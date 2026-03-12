import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
	StationConfig,
	QueueConfig,
	Vehicle,
	EnergyStorage,
	ChargingGun,
	DegradeEvent,
	ChartDataPoint,
	VehicleStats,
	SimStatus,
} from "@/types/charging";
import {
	DEFAULT_STATION_CONFIG,
	DEFAULT_QUEUE_CONFIG,
	CAR_MODEL_CONFIGS,
} from "@/types/charging";

export const useChargingSimStore = defineStore("chargingSim", () => {
	// ==================== 配置参数 ====================
	const stationConfig = ref<StationConfig>({ ...DEFAULT_STATION_CONFIG });
	const queueConfig = ref<QueueConfig>({ ...DEFAULT_QUEUE_CONFIG });

	// ==================== 模拟运行状态 ====================
	const simStatus = ref<SimStatus>("idle");
	const simTime = ref(0); // 当前模拟时间(秒)
	const simSpeed = ref(1); // 模拟速度倍率

	// ==================== 核心数据 ====================
	const vehicles = ref<Vehicle[]>([]);
	const energyStorage = ref<EnergyStorage>({
		totalCapacity: 0,
		currentEnergy: 0,
		maxDischargePower: 0,
		maxChargePower: 0,
		currentPower: 0,
	});
	const chargingGuns = ref<ChargingGun[]>([]);
	const degradeEvents = ref<DegradeEvent[]>([]);
	const chartData = ref<ChartDataPoint[]>([]);

	// ==================== 当前帧数据 ====================
	const currentTotalPower = ref(0);
	const currentGridPower = ref(0);
	const currentStoragePower = ref(0);
	const isDegraded = ref(false);

	// ==================== 计算属性 ====================
	const storageSoc = computed(() => {
		if (energyStorage.value.totalCapacity === 0) return 0;
		return (
			energyStorage.value.currentEnergy / energyStorage.value.totalCapacity
		);
	});

	const completedVehicles = computed(
		() => vehicles.value.filter((v) => v.status === "done").length,
	);

	const chargingVehicles = computed(() =>
		vehicles.value.filter((v) => v.status === "charging"),
	);

	const queuingVehicles = computed(() =>
		vehicles.value.filter((v) => v.status === "queuing"),
	);

	const totalStorageCapacity = computed(
		() =>
			stationConfig.value.storageCount *
			stationConfig.value.storageCapacityPerUnit,
	);

	const totalMaxDischargePower = computed(
		() =>
			stationConfig.value.storageCount *
			stationConfig.value.maxDischargePowerPerUnit,
	);

	const vehicleStats = computed<VehicleStats[]>(() => {
		return vehicles.value
			.filter((v) => v.status === "done" || v.status === "charging")
			.map((v) => {
				const config = CAR_MODEL_CONFIGS[v.model];
				const chargeTime =
					v.status === "done"
						? v.endChargeTime - v.startChargeTime
						: simTime.value - v.startChargeTime;
				return {
					id: v.id,
					model: v.model,
					modelLabel: config.label,
					initialSoc: v.initialSoc,
					finalSoc: v.soc,
					chargeTime: Math.round(chargeTime),
					energyCharged: Math.round(v.energyCharged * 10) / 10,
					peakPower: Math.round(v.currentPower),
					degraded: v.degraded,
					degradeTime: 0,
				};
			});
	});

	const conclusionText = computed(() => {
		if (degradeEvents.value.length === 0 && simStatus.value === "finished") {
			return `在储能 ${totalStorageCapacity.value} kWh、电网 ${stationConfig.value.gridPower} kW 条件下，${queueConfig.value.vehicleCount} 辆车间隔 ${queueConfig.value.arrivalInterval} 秒充电，全程未发生闪充降级。`;
		}
		if (degradeEvents.value.length > 0) {
			const firstEvent = degradeEvents.value[0];
			const minutes = Math.floor(firstEvent.time / 60);
			const seconds = Math.round(firstEvent.time % 60);
			return `在储能 ${totalStorageCapacity.value} kWh、电网 ${stationConfig.value.gridPower} kW 条件下，连续 ${queueConfig.value.vehicleCount} 辆车间隔 ${queueConfig.value.arrivalInterval} 秒充电，第 ${firstEvent.vehicleId} 辆车在 ${minutes}分${seconds}秒 时开始出现闪充降级，储能 SOC 仅 ${Math.round(firstEvent.storageSoc * 100)}%。`;
		}
		return "";
	});

	// ==================== Actions ====================

	/** 初始化模拟 */
	function initSimulation() {
		const sc = stationConfig.value;
		const qc = queueConfig.value;

		// 重置状态
		simTime.value = 0;
		simStatus.value = "idle";
		isDegraded.value = false;
		currentTotalPower.value = 0;
		currentGridPower.value = 0;
		currentStoragePower.value = 0;
		degradeEvents.value = [];
		chartData.value = [];

		// 初始化储能
		const totalCap = sc.storageCount * sc.storageCapacityPerUnit;
		energyStorage.value = {
			totalCapacity: totalCap,
			currentEnergy: totalCap, // 满电开始
			maxDischargePower: sc.storageCount * sc.maxDischargePowerPerUnit,
			maxChargePower: sc.storageCount * sc.maxChargePowerPerUnit,
			currentPower: 0,
		};

		// 初始化充电枪
		chargingGuns.value = Array.from({ length: sc.gunCount }, (_, i) => ({
			index: i,
			status: "idle" as const,
			vehicleId: -1,
			currentPower: 0,
		}));

		// 初始化车辆队列
		vehicles.value = Array.from({ length: qc.vehicleCount }, (_, i) => ({
			id: i + 1,
			model: qc.carModel,
			soc: qc.initialSoc,
			initialSoc: qc.initialSoc,
			status: "queuing" as const,
			arrivalTime: i * qc.arrivalInterval,
			startChargeTime: 0,
			endChargeTime: 0,
			currentPower: 0,
			energyCharged: 0,
			degraded: false,
			pileIndex: -1,
		}));
	}

	/** 记录图表数据点 */
	function recordDataPoint() {
		chartData.value.push({
			time: simTime.value,
			totalPower: currentTotalPower.value,
			gridPower: currentGridPower.value,
			storagePower: currentStoragePower.value,
			storageSoc: storageSoc.value,
			isDegraded: isDegraded.value,
		});
		// 保留最多 1800 个点
		if (chartData.value.length > 1800) {
			chartData.value.shift();
		}
	}

	/** 重置模拟 */
	function resetSimulation() {
		initSimulation();
	}

	return {
		// 配置
		stationConfig,
		queueConfig,
		// 模拟状态
		simStatus,
		simTime,
		simSpeed,
		// 核心数据
		vehicles,
		energyStorage,
		chargingGuns,
		degradeEvents,
		chartData,
		// 当前帧
		currentTotalPower,
		currentGridPower,
		currentStoragePower,
		isDegraded,
		// 计算属性
		storageSoc,
		completedVehicles,
		chargingVehicles,
		queuingVehicles,
		totalStorageCapacity,
		totalMaxDischargePower,
		vehicleStats,
		conclusionText,
		// Actions
		initSimulation,
		recordDataPoint,
		resetSimulation,
	};
});
