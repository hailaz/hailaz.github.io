/**
 * engine.js - 兆瓦闪充站充电模拟引擎
 *
 * 包含：
 * 1. 车型配置表 (CAR_MODEL_CONFIGS)
 * 2. 默认站点/队列配置 (DEFAULT_STATION_CONFIG / DEFAULT_QUEUE_CONFIG)
 * 3. 充电曲线引擎 (interpolate / getMaxChargePower / calcChargeIncrement)
 * 4. 功率分配器 (allocatePower)
 *
 * 这些都是纯函数/常量，不依赖 Vue，可独立测试。
 */

// ==================== 常量与配置 ====================

/**
 * 车型配置表
 * - batteryCapacity: 电池容量 (kWh)
 * - maxChargePower:  单枪最大充电功率 (kW)，目前闪充桩支持最高 1500kW
 * - color:           图表中该车型对应颜色
 */
const CAR_MODEL_CONFIGS = {
  'han-l': { name: 'han-l', label: '汉L', batteryCapacity: 80, maxChargePower: 800, color: '#3B82F6' },
  'z9gt':  { name: 'z9gt',  label: '腾势Z9GT', batteryCapacity: 100, maxChargePower: 1000, color: '#8B5CF6' },
  'u7':    { name: 'u7',    label: '仰望U7', batteryCapacity: 150, maxChargePower: 1500, color: '#F59E0B' },
};

/**
 * 闪充站默认配置
 * - storageCount:             储能柜数量
 * - storageCapacityPerUnit:   单柜容量 (kWh)
 * - gridPower:                电网输入功率 (kW)
 * - maxDischargePowerPerUnit: 单柜最大放电功率 (kW)
 * - maxChargePowerPerUnit:    单柜最大充电功率（回充）(kW)
 * - gunCount:                 充电枪数量
 */
const DEFAULT_STATION_CONFIG = {
  storageCount: 2, storageCapacityPerUnit: 169, gridPower: 360,
  maxDischargePowerPerUnit: 800, maxChargePowerPerUnit: 200, gunCount: 2,
};

/**
 * 车辆队列默认配置
 * - vehicleCount:    排队车辆总数
 * - carModel:        默认选用的车型
 * - initialSoc:      初始电量百分比 (0~1)
 * - arrivalInterval: 相邻车辆到达间隔 (秒)
 */
const DEFAULT_QUEUE_CONFIG = {
  vehicleCount: 8, carModel: 'z9gt', initialSoc: 0.1, arrivalInterval: 30,
};


// ==================== 充电曲线引擎 ====================

/**
 * 充电功率曲线控制点 [SOC, 功率系数(0~1)]
 * - SOC 从 5% 到 100%，功率系数描述"当前SOC对应的最大充电功率比例"
 * - 低 SOC（<25%）阶段功率快速爬升至峰值
 * - 25%~35% 维持满功率平台期
 * - 之后随 SOC 升高逐步降功，模拟真实锂电池 CC-CV 充电曲线
 */
const CHARGE_CURVE_POINTS = [
  [0.05,0.3],[0.1,0.6],[0.15,0.85],[0.2,0.95],[0.25,1.0],[0.35,1.0],
  [0.45,0.95],[0.55,0.85],[0.65,0.7],[0.7,0.6],[0.75,0.45],[0.8,0.35],
  [0.85,0.25],[0.9,0.15],[0.95,0.08],[0.97,0.04],[1.0,0.0],
];

/** 线性插值：根据 SOC 查表得到功率系数 */
function interpolate(soc) {
  if (soc <= CHARGE_CURVE_POINTS[0][0]) return CHARGE_CURVE_POINTS[0][1];
  if (soc >= CHARGE_CURVE_POINTS[CHARGE_CURVE_POINTS.length - 1][0]) return 0;
  for (let i = 1; i < CHARGE_CURVE_POINTS.length; i++) {
    const [x0, y0] = CHARGE_CURVE_POINTS[i - 1];
    const [x1, y1] = CHARGE_CURVE_POINTS[i];
    if (soc <= x1) { const t = (soc - x0) / (x1 - x0); return y0 + t * (y1 - y0); }
  }
  return 0;
}

/** 根据当前 SOC 和车型，计算该时刻的最大充电功率 (kW) */
function getMaxChargePower(soc, carModel) {
  return CAR_MODEL_CONFIGS[carModel].maxChargePower * interpolate(soc);
}

/**
 * 计算一个时间步长内的充电增量
 * @param {number} power         - 当前充电功率 (kW)
 * @param {number} batteryCapacity - 电池总容量 (kWh)
 * @param {number} deltaTime     - 时间步长 (秒)
 * @returns {{ energyDelta: number, socDelta: number }}
 */
function calcChargeIncrement(power, batteryCapacity, deltaTime) {
  const energyDelta = (power * deltaTime) / 3600;
  return { energyDelta, socDelta: energyDelta / batteryCapacity };
}


// ==================== 功率分配器 ====================

/**
 * 核心功率分配算法
 * 优先使用电网功率满足需求，不足部分由储能柜放电补充。
 * 如果电网 + 储能仍不够，则按需求比例降功分配（即"闪充降级"）。
 * 空闲时若电网有余量，还会对储能柜进行回充。
 *
 * @param {Array}  chargingVehicles          - 当前正在充电的车辆列表
 * @param {Object} energyStorage             - 储能系统状态
 * @param {number} gridMaxPower              - 电网最大输入功率 (kW)
 * @param {number} simTime                   - 当前模拟时间 (秒)
 * @param {number} deltaTime                 - 时间步长 (秒)
 * @param {Set}    existingDegradeVehicleIds  - 已记录过降级事件的车辆 ID 集合
 */
function allocatePower(chargingVehicles, energyStorage, gridMaxPower, simTime, deltaTime, existingDegradeVehicleIds) {
  const vehiclePowers = new Map();
  const newDegradeEvents = [];

  // 无车充电时，若储能未满则用电网回充储能
  if (chargingVehicles.length === 0) {
    const rechargeRoom = energyStorage.totalCapacity - energyStorage.currentEnergy;
    if (rechargeRoom > 0) {
      const maxEnergyPerTick = (rechargeRoom * 3600) / deltaTime;
      const rechargePower = Math.min(gridMaxPower, energyStorage.maxChargePower, maxEnergyPerTick);
      return { gridPowerUsed: rechargePower, storagePowerUsed: -rechargePower, totalPower: 0, isDegraded: false, vehiclePowers, newDegradeEvents };
    }
    return { gridPowerUsed: 0, storagePowerUsed: 0, totalPower: 0, isDegraded: false, vehiclePowers, newDegradeEvents };
  }

  // 计算每台车的功率需求
  const demands = [];
  let totalDemand = 0;
  for (const v of chargingVehicles) {
    const demand = getMaxChargePower(v.soc, v.model);
    demands.push({ vehicle: v, demand });
    totalDemand += demand;
  }

  // 电网优先供电，不足部分由储能补充
  const gridUsed = Math.min(gridMaxPower, totalDemand);
  let deficit = totalDemand - gridUsed;
  let storageUsed = 0;
  if (deficit > 0) {
    const maxStorageEnergy = (energyStorage.currentEnergy * 3600) / deltaTime;
    const maxStoragePower = Math.min(energyStorage.maxDischargePower, maxStorageEnergy);
    storageUsed = Math.min(deficit, maxStoragePower);
    deficit = deficit - storageUsed;
  }

  const totalAvailable = gridUsed + storageUsed;
  const isDegraded = deficit > 1;

  // 按需求比例分配功率
  if (totalDemand <= totalAvailable + 1) {
    // 供电充足，每台车按需获得全部功率
    for (const { vehicle, demand } of demands) vehiclePowers.set(vehicle.id, demand);
  } else {
    // 供电不足，按需求比例降功分配
    for (const { vehicle, demand } of demands) {
      const ratio = totalDemand > 0 ? demand / totalDemand : 0;
      const allocated = totalAvailable * ratio;
      vehiclePowers.set(vehicle.id, allocated);
      if (!existingDegradeVehicleIds.has(vehicle.id)) {
        newDegradeEvents.push({
          time: simTime, vehicleId: vehicle.id, vehicleModel: vehicle.model,
          demandPower: Math.round(demand), actualPower: Math.round(allocated),
          storageSoc: energyStorage.currentEnergy / energyStorage.totalCapacity,
          description: `车辆 #${vehicle.id}(${CAR_MODEL_CONFIGS[vehicle.model].label}) 闪充降级：需求 ${Math.round(demand)}kW，实际 ${Math.round(allocated)}kW`,
        });
      }
    }
  }

  // 电网有余量时回充储能
  let actualStoragePower = storageUsed;
  if (totalDemand < gridMaxPower) {
    const surplus = gridMaxPower - totalDemand;
    const rechargeRoom = energyStorage.totalCapacity - energyStorage.currentEnergy;
    if (rechargeRoom > 0 && storageUsed === 0) {
      const rechargePower = Math.min(surplus, energyStorage.maxChargePower, (rechargeRoom * 3600) / deltaTime);
      actualStoragePower = -rechargePower;
    }
  }

  return { gridPowerUsed: gridUsed, storagePowerUsed: actualStoragePower, totalPower: totalAvailable, isDegraded, vehiclePowers, newDegradeEvents };
}
