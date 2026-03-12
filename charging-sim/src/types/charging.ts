/** 车型枚举 */
export type CarModel = "han-l" | "z9gt" | "u7";

/** 车型参数配置 */
export interface CarModelConfig {
	name: string;
	label: string;
	batteryCapacity: number; // kWh
	maxChargePower: number; // kW 峰值充电功率
	color: string; // 展示颜色
}

/** 车型配置表 */
export const CAR_MODEL_CONFIGS: Record<CarModel, CarModelConfig> = {
	"han-l": {
		name: "han-l",
		label: "汉L",
		batteryCapacity: 80,
		maxChargePower: 800,
		color: "#3B82F6",
	},
	z9gt: {
		name: "z9gt",
		label: "腾势Z9GT",
		batteryCapacity: 100,
		maxChargePower: 1000,
		color: "#8B5CF6",
	},
	u7: {
		name: "u7",
		label: "仰望U7",
		batteryCapacity: 150,
		maxChargePower: 1000,
		color: "#F59E0B",
	},
};

/** 排队车辆 */
export interface Vehicle {
	id: number;
	model: CarModel;
	soc: number; // 当前SOC 0~1
	initialSoc: number; // 初始SOC 0~1
	status: "queuing" | "charging" | "done";
	arrivalTime: number; // 到达时间(模拟秒)
	startChargeTime: number; // 开始充电时间(模拟秒)
	endChargeTime: number; // 结束充电时间(模拟秒)
	currentPower: number; // 当前充电功率 kW
	energyCharged: number; // 已充入电量 kWh
	degraded: boolean; // 是否经历过降级
	pileIndex: number; // 充电桩枪号 0 or 1, -1=未分配
}

/** 储能柜状态 */
export interface EnergyStorage {
	totalCapacity: number; // 总容量 kWh
	currentEnergy: number; // 当前剩余 kWh
	maxDischargePower: number; // 最大放电功率 kW (全部储能柜合计)
	maxChargePower: number; // 最大回充功率 kW
	currentPower: number; // 当前功率(正=放电, 负=回充)
}

/** 充电桩枪状态 */
export interface ChargingGun {
	index: number; // 0 or 1
	status: "idle" | "charging" | "degraded";
	vehicleId: number; // 当前充电车辆ID, -1=空
	currentPower: number; // 当前输出功率 kW
}

/** 降级事件记录 */
export interface DegradeEvent {
	time: number; // 发生时间(模拟秒)
	vehicleId: number; // 受影响车辆
	vehicleModel: CarModel;
	demandPower: number; // 需求功率 kW
	actualPower: number; // 实际功率 kW
	storageSoc: number; // 储能SOC 0~1
	description: string; // 描述
}

/** 闪充站配置 */
export interface StationConfig {
	storageCount: number; // 储能柜数量 (1~4)
	storageCapacityPerUnit: number; // 单柜容量 kWh
	gridPower: number; // 电网输入功率 kW
	maxDischargePowerPerUnit: number; // 单柜最大放电功率 kW
	maxChargePowerPerUnit: number; // 单柜最大回充功率 kW
	gunCount: number; // 充电枪数量
}

/** 车辆队列配置 */
export interface QueueConfig {
	vehicleCount: number; // 排队车辆数 (3~20)
	carModel: CarModel; // 车型
	initialSoc: number; // 初始SOC 0~1
	arrivalInterval: number; // 到达间隔(模拟秒)
}

/** 模拟状态 */
export type SimStatus = "idle" | "running" | "paused" | "finished";

/** 图表数据点 */
export interface ChartDataPoint {
	time: number; // 模拟秒
	totalPower: number; // 总输出功率 kW
	gridPower: number; // 电网功率 kW
	storagePower: number; // 储能放电功率 kW
	storageSoc: number; // 储能SOC 0~1
	isDegraded: boolean; // 是否降级中
}

/** 车辆充电统计 */
export interface VehicleStats {
	id: number;
	model: CarModel;
	modelLabel: string;
	initialSoc: number;
	finalSoc: number;
	chargeTime: number; // 充电耗时(秒)
	energyCharged: number; // 充入电量 kWh
	peakPower: number; // 峰值功率 kW
	degraded: boolean;
	degradeTime: number; // 首次降级时间(秒), 0=未降级
}

/** 默认闪充站配置 */
export const DEFAULT_STATION_CONFIG: StationConfig = {
	storageCount: 2,
	storageCapacityPerUnit: 169,
	gridPower: 360,
	maxDischargePowerPerUnit: 800,
	maxChargePowerPerUnit: 200,
	gunCount: 2,
};

/** 默认车辆队列配置 */
export const DEFAULT_QUEUE_CONFIG: QueueConfig = {
	vehicleCount: 8,
	carModel: "z9gt",
	initialSoc: 0.1,
	arrivalInterval: 30, // 30秒间隔
};
