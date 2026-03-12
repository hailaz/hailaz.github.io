/**
 * 模拟引擎
 * 使用 requestAnimationFrame 驱动加速时间轴
 * 默认 1秒真实时间 = 60秒模拟时间 (可调速)
 */

import { ref } from "vue";
import { useChargingSimStore } from "@/stores/chargingSim";
import { CAR_MODEL_CONFIGS } from "@/types/charging";
import { calcChargeIncrement } from "./chargingCurve";
import { allocatePower } from "./powerAllocator";

const TICK_INTERVAL = 1; // 每tick模拟1秒
const TARGET_SOC = 0.97; // 充到97%视为充满

export function useSimulation() {
	const store = useChargingSimStore();
	let animFrameId: number | null = null;
	let lastRealTime = 0;
	let accumulatedTime = 0;

	/** 已记录降级的车辆ID集合 */
	const degradedVehicleIds = ref(new Set<number>());

	/** 单tick处理逻辑 */
	function tick() {
		const st = store;

		// 1. 处理新到达车辆：分配空闲充电枪
		for (const v of st.vehicles) {
			if (v.status === "queuing" && v.arrivalTime <= st.simTime) {
				// 找空闲枪
				const freeGun = st.chargingGuns.find((g) => g.status === "idle");
				if (freeGun) {
					v.status = "charging";
					v.startChargeTime = st.simTime;
					v.pileIndex = freeGun.index;
					freeGun.status = "charging";
					freeGun.vehicleId = v.id;
				}
			}
		}

		// 2. 获取当前充电中的车辆
		const chargingVehicles = st.vehicles.filter((v) => v.status === "charging");

		// 3. 功率分配
		const result = allocatePower(
			chargingVehicles,
			st.energyStorage,
			st.stationConfig.gridPower,
			st.simTime,
			TICK_INTERVAL,
			degradedVehicleIds.value,
		);

		// 4. 更新当前帧数据
		st.currentTotalPower = result.totalPower;
		st.currentGridPower = result.gridPowerUsed;
		st.currentStoragePower = Math.max(0, result.storagePowerUsed);
		st.isDegraded = result.isDegraded;

		// 5. 记录新降级事件
		for (const evt of result.newDegradeEvents) {
			st.degradeEvents.push(evt);
			degradedVehicleIds.value.add(evt.vehicleId);
		}

		// 6. 更新各车SOC和充电枪状态
		for (const v of chargingVehicles) {
			const power = result.vehiclePowers.get(v.id) || 0;
			v.currentPower = power;
			const config = CAR_MODEL_CONFIGS[v.model];
			const { energyDelta, socDelta } = calcChargeIncrement(
				power,
				config.batteryCapacity,
				TICK_INTERVAL,
			);
			v.soc = Math.min(v.soc + socDelta, 1);
			v.energyCharged += energyDelta;

			if (result.isDegraded && !v.degraded) {
				v.degraded = true;
			}

			// 更新充电枪状态
			const gun = st.chargingGuns.find((g) => g.vehicleId === v.id);
			if (gun) {
				gun.currentPower = power;
				gun.status = result.isDegraded ? "degraded" : "charging";
			}

			// 检查是否充满
			if (v.soc >= TARGET_SOC) {
				v.soc = TARGET_SOC;
				v.status = "done";
				v.endChargeTime = st.simTime;
				v.currentPower = 0;
				if (gun) {
					gun.status = "idle";
					gun.vehicleId = -1;
					gun.currentPower = 0;
				}
			}
		}

		// 7. 更新储能电量
		if (result.storagePowerUsed > 0) {
			// 放电
			const energyUsed = (result.storagePowerUsed * TICK_INTERVAL) / 3600;
			st.energyStorage.currentEnergy = Math.max(
				0,
				st.energyStorage.currentEnergy - energyUsed,
			);
		} else if (result.storagePowerUsed < 0) {
			// 回充
			const energyCharged =
				(Math.abs(result.storagePowerUsed) * TICK_INTERVAL) / 3600;
			st.energyStorage.currentEnergy = Math.min(
				st.energyStorage.totalCapacity,
				st.energyStorage.currentEnergy + energyCharged,
			);
		}
		st.energyStorage.currentPower = result.storagePowerUsed;

		// 8. 记录数据点 (每2秒记一个)
		if (Math.floor(st.simTime) % 2 === 0) {
			st.recordDataPoint();
		}

		// 9. 推进模拟时间
		st.simTime += TICK_INTERVAL;

		// 10. 检查模拟结束
		const allDone = st.vehicles.every((v) => v.status === "done");
		const allArrived = st.vehicles.every((v) => v.arrivalTime <= st.simTime);
		const noCharging = chargingVehicles.length === 0;

		if (
			allDone ||
			(allArrived && noCharging && st.completedVehicles === st.vehicles.length)
		) {
			st.simStatus = "finished";
			stop();
		}
	}

	/** RAF循环 */
	function loop(realTime: number) {
		if (store.simStatus !== "running") return;

		if (lastRealTime === 0) {
			lastRealTime = realTime;
		}

		const deltaReal = (realTime - lastRealTime) / 1000; // 真实秒
		lastRealTime = realTime;

		// 根据速度倍率计算本帧应推进的模拟时间
		// simSpeed=1 → 1秒真实=60秒模拟
		const simDelta = deltaReal * 60 * store.simSpeed;
		accumulatedTime += simDelta;

		// 以TICK_INTERVAL为步长执行tick
		while (accumulatedTime >= TICK_INTERVAL) {
			tick();
			accumulatedTime -= TICK_INTERVAL;
			if (store.simStatus !== "running") break;
		}

		if (store.simStatus === "running") {
			animFrameId = requestAnimationFrame(loop);
		}
	}

	/** 开始模拟 */
	function start() {
		if (store.simStatus === "idle") {
			store.initSimulation();
		}
		store.simStatus = "running";
		lastRealTime = 0;
		accumulatedTime = 0;
		degradedVehicleIds.value = new Set(
			store.degradeEvents.map((e) => e.vehicleId),
		);
		animFrameId = requestAnimationFrame(loop);
	}

	/** 暂停模拟 */
	function pause() {
		store.simStatus = "paused";
		if (animFrameId !== null) {
			cancelAnimationFrame(animFrameId);
			animFrameId = null;
		}
	}

	/** 停止/完成 */
	function stop() {
		if (animFrameId !== null) {
			cancelAnimationFrame(animFrameId);
			animFrameId = null;
		}
	}

	/** 重置 */
	function reset() {
		stop();
		degradedVehicleIds.value.clear();
		store.resetSimulation();
	}

	/** 设置速度 */
	function setSpeed(speed: number) {
		store.simSpeed = speed;
	}

	/** 切换开始/暂停 */
	function togglePlay() {
		if (store.simStatus === "running") {
			pause();
		} else if (store.simStatus === "idle" || store.simStatus === "paused") {
			start();
		} else if (store.simStatus === "finished") {
			reset();
			start();
		}
	}

	return {
		start,
		pause,
		stop,
		reset,
		setSpeed,
		togglePlay,
	};
}
