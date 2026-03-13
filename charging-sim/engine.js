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
 * 车型分代分类
 * - gen1: 一代兆瓦闪充（超级e平台，2025年3月发布）
 *   · 充电桩参数：单枪峰值 1000kW，双枪总功率 1000kW，峰值 1360kW
 *   · 首发车型：汉L、唐L
 *
 * - gen2: 二代兆瓦闪充（2026年3月"闪充中国"发布）
 *   · 充电桩参数：单枪峰值 1500kW，整站最高 2100kW
 *   · 二代刀片电池：10%-70% 仅需5分钟，10%-97% 仅需9分钟
 *   · 首搭10款车型
 */

/** 车型代际枚举 */
const CAR_GENERATIONS = {
  gen1: {
    id: 'gen1',
    label: '一代兆瓦闪充',
    subtitle: '超级e平台 · 10C充电倍率 · 单枪峰值1000kW',
    year: 2025,
    maxGunPower: 1000,    // 单枪峰值 kW
    maxPilePower: 1360,   // 单桩峰值 kW
  },
  gen2: {
    id: 'gen2',
    label: '二代兆瓦闪充',
    subtitle: '二代刀片电池 · 5分钟充好 · 单枪峰值1500kW',
    year: 2026,
    maxGunPower: 1500,    // 单枪峰值 kW
    maxPilePower: 2100,   // 整站最高 kW
  },
};

/**
 * 车型配置表
 * - batteryCapacity: 电池容量 (kWh)
 * - maxChargePower:  单枪最大充电功率 (kW)
 * - color:           图表中该车型对应颜色
 * - generation:      所属代际 (gen1 | gen2)
 * - brand:           品牌系列
 * - segment:         车型级别
 */
const CAR_MODEL_CONFIGS = {
  // ====== 一代兆瓦闪充 · 超级e平台车型 ======
  'han-l':      { name: 'han-l',      label: '汉L EV',         batteryCapacity: 100, maxChargePower: 1000, color: '#3B82F6', generation: 'gen1', brand: '王朝', segment: '旗舰轿车' },
  'tang-l':     { name: 'tang-l',     label: '唐L EV',         batteryCapacity: 100, maxChargePower: 1000, color: '#0EA5E9', generation: 'gen1', brand: '王朝', segment: '旗舰SUV' },

  // ====== 二代兆瓦闪充 · 二代刀片电池首搭10款车型 ======
  // 王朝网
  'song-ultra': { name: 'song-ultra', label: '宋Ultra EV',     batteryCapacity: 72,  maxChargePower: 1000, color: '#22C55E', generation: 'gen2', brand: '王朝', segment: '主力SUV' },
  'da-tang':    { name: 'da-tang',    label: '大唐',            batteryCapacity: 100, maxChargePower: 1200, color: '#06B6D4', generation: 'gen2', brand: '王朝', segment: '大型SUV' },
  // 海洋网
  'hailion-06': { name: 'hailion-06', label: '海狮06 EV',      batteryCapacity: 72,  maxChargePower: 1000, color: '#84CC16', generation: 'gen2', brand: '海洋', segment: '紧凑SUV' },
  'haibao-07':  { name: 'haibao-07',  label: '海豹07 EV',      batteryCapacity: 80,  maxChargePower: 1200, color: '#14B8A6', generation: 'gen2', brand: '海洋', segment: '中型轿车' },
  // 腾势
  'z9gt':       { name: 'z9gt',       label: '腾势Z9GT',       batteryCapacity: 120, maxChargePower: 1500, color: '#8B5CF6', generation: 'gen2', brand: '腾势', segment: 'GT轿跑' },
  'n9':         { name: 'n9',         label: '腾势N9',         batteryCapacity: 100, maxChargePower: 1200, color: '#A855F7', generation: 'gen2', brand: '腾势', segment: '旗舰SUV' },
  // 方程豹
  'titan-3':    { name: 'titan-3',    label: '方程豹钛3',      batteryCapacity: 72,  maxChargePower: 1200, color: '#F59E0B', generation: 'gen2', brand: '方程豹', segment: '紧凑SUV' },
  'titan-7':    { name: 'titan-7',    label: '方程豹钛7 EV',   batteryCapacity: 100, maxChargePower: 1200, color: '#F97316', generation: 'gen2', brand: '方程豹', segment: '中大型SUV' },
  // 仰望
  'u7':         { name: 'u7',         label: '仰望U7',         batteryCapacity: 150, maxChargePower: 1500, color: '#EF4444', generation: 'gen2', brand: '仰望', segment: '旗舰轿车' },
  'u8l':        { name: 'u8l',        label: '仰望U8L 鼎世版', batteryCapacity: 150, maxChargePower: 1500, color: '#EC4899', generation: 'gen2', brand: '仰望', segment: '豪华SUV' },
};

/**
 * 闪充站默认配置（基于比亚迪兆瓦闪充实际参数）
 *
 * 实际架构：1充电桩 + 2储能柜 + 1充电主机
 * - 储能柜有 169kWh / 180kWh / 225kWh 三种规格
 * - 单柜最大输出 800kW，1250A 电流
 * - 电网输入功率仅需 315 kVA 变压器
 * - 电网 + 储能协同：一代总输出 1360kW，二代总输出 2100kW
 * - 每桩固定2枪（滑轨悬吊式T型桩标准配置）
 *
 * storagePerPile:             每桩配储能柜数量（实际1桩配2柜）
 * storageCapacityPerUnit:     单柜容量 (kWh)
 * gridPower:                  电网输入功率 (kW)
 * maxDischargePowerPerUnit:   单柜最大放电功率 (kW)
 * maxChargePowerPerUnit:      单柜最大充电功率（回充）(kW)
 * pileCount:                  充电桩数量
 * gunsPerPile:                每桩固定2枪
 */
const DEFAULT_STATION_CONFIG = {
  storagePerPile: 2,                   // 每桩配2台储能柜（实际参数）
  storageCapacityPerUnit: 169,         // 单柜 169 kWh（比亚迪标配）
  gridPower: 315,                      // 电网输入 315 kW（仅需 315 kVA 变压器）
  maxDischargePowerPerUnit: 800,       // 单柜最大放电 800 kW
  maxChargePowerPerUnit: 160,          // 单柜回充功率 (kW)
  pileCount: 1, gunsPerPile: 2,       // 默认1桩，固定2枪，不可配置
};

/**
 * 车辆队列默认配置
 * - vehicleCount:      排队车辆总数
 * - carModel:          默认选用的车型
 * - initialSoc:        初始电量百分比 (0~1)
 * - targetSoc:         目标充电 SOC (0~1)，充到此值即视为充满
 * - chargingInterval:  充电间隔 (分钟)，即前车拔枪离开 + 后车停车插枪的非充电时间
 *                       模拟真实场景：一辆车充完离开后，下一辆车需要一段时间停车、插枪才能开始充电
 */
const DEFAULT_QUEUE_CONFIG = {
  vehicleCount: 50, carModel: 'z9gt', initialSoc: 0.1, targetSoc: 0.97, chargingInterval: 5,
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
 * @param {Array}  chargingVehicles          - 当前正在充电的车辆列表（需含 pileIndex 属性）
 * @param {Object} energyStorage             - 储能系统状态
 * @param {number} gridMaxPower              - 电网最大输入功率 (kW)
 * @param {number} simTime                   - 当前模拟时间 (秒)
 * @param {number} deltaTime                 - 时间步长 (秒)
 * @param {Set}    existingDegradeVehicleIds  - 已记录过降级事件的车辆 ID 集合
 * @param {Array}  [pileGenList]              - 每桩代际 ['gen1'|'gen2', ...]，用于单桩功率上限
 */
function allocatePower(chargingVehicles, energyStorage, gridMaxPower, simTime, deltaTime, existingDegradeVehicleIds, pileGenList) {
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

  // 计算每台车的功率需求（先受单枪峰值限制）
  const demands = [];
  let totalDemand = 0;
  for (const v of chargingVehicles) {
    let demand = getMaxChargePower(v.soc, v.model);
    // 单枪峰值限制：取车型代际对应的 maxGunPower
    const gen = CAR_MODEL_CONFIGS[v.model]?.generation;
    if (gen && CAR_GENERATIONS[gen]) {
      demand = Math.min(demand, CAR_GENERATIONS[gen].maxGunPower);
    }
    demands.push({ vehicle: v, demand });
    totalDemand += demand;
  }

  // ---- 单桩功率上限约束 ----
  // 同一桩的多枪合计不能超过该桩的 maxPilePower
  if (pileGenList && pileGenList.length > 0) {
    // 按桩分组
    const pileGroups = {};
    for (const d of demands) {
      const pi = d.vehicle.pileIndex;
      if (pi == null || pi < 0) continue;
      if (!pileGroups[pi]) pileGroups[pi] = [];
      pileGroups[pi].push(d);
    }
    for (const [piStr, group] of Object.entries(pileGroups)) {
      const pi = Number(piStr);
      const genId = pileGenList[pi] || 'gen2';
      const maxPilePower = CAR_GENERATIONS[genId]?.maxPilePower || Infinity;
      const pileTotal = group.reduce((s, d) => s + d.demand, 0);
      if (pileTotal > maxPilePower) {
        // 按比例缩减到桩上限
        const ratio = maxPilePower / pileTotal;
        let diff = 0;
        for (const d of group) {
          const capped = d.demand * ratio;
          diff += d.demand - capped;
          d.demand = capped;
        }
        totalDemand -= diff;
      }
    }
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
