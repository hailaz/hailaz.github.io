/**
 * 功率分配器
 *
 * 分配逻辑（遵循"电网为主，储能补峰值"原则）：
 * 1. 计算所有充电中车辆的理想充电功率需求总和
 * 2. 电网持续稳定输出（不超过配置功率）
 * 3. 需求超过电网功率时，差额由储能柜补充
 * 4. 储能也不足时，按比例降级分配（触发降级告警）
 * 5. 无车充电时，电网富余功率给储能柜回充
 */

import type { Vehicle, EnergyStorage, DegradeEvent } from "@/types/charging";
import { CAR_MODEL_CONFIGS } from "@/types/charging";
import { getMaxChargePower } from "./chargingCurve";

export interface AllocationResult {
	gridPowerUsed: number; // 电网实际使用功率 kW
	storagePowerUsed: number; // 储能实际放电功率 kW (正=放电)
	totalPower: number; // 总输出功率 kW
	isDegraded: boolean; // 是否发生降级
	vehiclePowers: Map<number, number>; // 各车实际分配功率
	newDegradeEvents: DegradeEvent[]; // 新降级事件
}

/**
 * 执行一次功率分配
 */
export function allocatePower(
	chargingVehicles: Vehicle[],
	energyStorage: EnergyStorage,
	gridMaxPower: number,
	simTime: number,
	deltaTime: number,
	existingDegradeVehicleIds: Set<number>,
): AllocationResult {
	const vehiclePowers = new Map<number, number>();
	const newDegradeEvents: DegradeEvent[] = [];

	// 无车充电：回充储能
	if (chargingVehicles.length === 0) {
		const rechargeRoom =
			energyStorage.totalCapacity - energyStorage.currentEnergy;
		if (rechargeRoom > 0) {
			// 回充功率 = min(电网功率, 储能最大回充功率, 剩余容量对应的最大功率)
			const maxEnergyPerTick = (rechargeRoom * 3600) / deltaTime;
			const rechargePower = Math.min(
				gridMaxPower,
				energyStorage.maxChargePower,
				maxEnergyPerTick,
			);
			return {
				gridPowerUsed: rechargePower,
				storagePowerUsed: -rechargePower, // 负=回充
				totalPower: 0,
				isDegraded: false,
				vehiclePowers,
				newDegradeEvents,
			};
		}
		return {
			gridPowerUsed: 0,
			storagePowerUsed: 0,
			totalPower: 0,
			isDegraded: false,
			vehiclePowers,
			newDegradeEvents,
		};
	}

	// 计算各车需求功率
	const demands: { vehicle: Vehicle; demand: number }[] = [];
	let totalDemand = 0;

	for (const v of chargingVehicles) {
		const demand = getMaxChargePower(v.soc, v.model);
		demands.push({ vehicle: v, demand });
		totalDemand += demand;
	}

	// 电网优先供电
	const gridUsed = Math.min(gridMaxPower, totalDemand);
	let deficit = totalDemand - gridUsed;

	// 储能补充差额
	let storageUsed = 0;
	if (deficit > 0) {
		// 储能最大可放电量受限于：最大放电功率 和 剩余电量
		const maxStorageEnergy = (energyStorage.currentEnergy * 3600) / deltaTime; // 本tick可提供的最大功率
		const maxStoragePower = Math.min(
			energyStorage.maxDischargePower,
			maxStorageEnergy,
		);
		storageUsed = Math.min(deficit, maxStoragePower);
		deficit = deficit - storageUsed;
	}

	const totalAvailable = gridUsed + storageUsed;
	const isDegraded = deficit > 1; // 容许1kW误差

	// 分配功率给各车
	if (totalDemand <= totalAvailable + 1) {
		// 充足供电：各车按需分配
		for (const { vehicle, demand } of demands) {
			vehiclePowers.set(vehicle.id, demand);
		}
	} else {
		// 降级：按需求比例分配可用功率
		for (const { vehicle, demand } of demands) {
			const ratio = totalDemand > 0 ? demand / totalDemand : 0;
			const allocated = totalAvailable * ratio;
			vehiclePowers.set(vehicle.id, allocated);

			// 记录降级事件（每辆车只记录一次）
			if (!existingDegradeVehicleIds.has(vehicle.id)) {
				newDegradeEvents.push({
					time: simTime,
					vehicleId: vehicle.id,
					vehicleModel: vehicle.model,
					demandPower: Math.round(demand),
					actualPower: Math.round(allocated),
					storageSoc: energyStorage.currentEnergy / energyStorage.totalCapacity,
					description: `车辆 #${vehicle.id}(${CAR_MODEL_CONFIGS[vehicle.model].label}) 闪充降级：需求 ${Math.round(demand)}kW，实际 ${Math.round(allocated)}kW`,
				});
			}
		}
	}

	// 如果有富余电网功率且储能未满，回充储能
	let actualStoragePower = storageUsed;
	if (totalDemand < gridMaxPower) {
		const surplus = gridMaxPower - totalDemand;
		const rechargeRoom =
			energyStorage.totalCapacity - energyStorage.currentEnergy;
		if (rechargeRoom > 0 && storageUsed === 0) {
			const rechargePower = Math.min(
				surplus,
				energyStorage.maxChargePower,
				(rechargeRoom * 3600) / deltaTime,
			);
			actualStoragePower = -rechargePower; // 负=回充
		}
	}

	return {
		gridPowerUsed: gridUsed,
		storagePowerUsed: actualStoragePower,
		totalPower: totalAvailable,
		isDegraded,
		vehiclePowers,
		newDegradeEvents,
	};
}
