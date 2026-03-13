/**
 * app.js - 兆瓦闪充站充电模拟器 Vue 应用
 *
 * 依赖：
 * - Vue 3 (全局变量 Vue)
 * - engine.js (全局变量 CAR_MODEL_CONFIGS, DEFAULT_STATION_CONFIG, DEFAULT_QUEUE_CONFIG,
 *              getMaxChargePower, calcChargeIncrement, allocatePower)
 *
 * 包含：
 * 1. Vue3 Composition API 响应式状态管理（简化版 Pinia）
 * 2. 模拟引擎（tick / simLoop）
 * 3. UI 状态与交互
 * 4. Canvas 手绘图表（无第三方依赖）
 * 5. 每辆车功率变化图表
 * 6. 停车动画特效
 */

// ==================== Vue App（使用 Vue3 Composition API）====================
const { createApp, ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } = Vue;

const app = createApp({
  setup() {
    // ---- Store：全局响应式状态（相当于简化版 Pinia） ----
    const store = reactive({
      stationConfig: { ...DEFAULT_STATION_CONFIG },
      queueConfig: { ...DEFAULT_QUEUE_CONFIG },
      simStatus: 'idle',       // idle | running | paused | finished
      simTime: 0,
      simSpeed: 1,
      vehicles: [],
      energyStorage: { totalCapacity: 0, currentEnergy: 0, maxDischargePower: 0, maxChargePower: 0, currentPower: 0 },
      chargingPiles: [],       // 多充电桩数组
      chargingGuns: [],        // 扁平化所有枪（向下兼容）
      degradeEvents: [],
      chartData: [],
      vehicleChartData: {},    // 每辆车的功率历史 { vehicleId: [{ time, power, soc }] }
      currentTotalPower: 0,
      currentGridPower: 0,
      currentStoragePower: 0,
      isDegraded: false,
      parkingAnimations: [],   // 停车动画队列
    });

    // ---- 车型分代管理 ----
    /** 当前选中的代际筛选 ('all' | 'gen1' | 'gen2') */
    const selectedGeneration = ref('all');
    /** 按代际筛选后的车型列表 */
    const filteredCarModels = computed(() => {
      const result = {};
      for (const [key, cfg] of Object.entries(CAR_MODEL_CONFIGS)) {
        if (selectedGeneration.value === 'all' || cfg.generation === selectedGeneration.value) {
          result[key] = cfg;
        }
      }
      return result;
    });
    /** 按代际分组的车型（供UI展示用） */
    const carModelsByGen = computed(() => {
      const groups = {};
      for (const [key, cfg] of Object.entries(CAR_MODEL_CONFIGS)) {
        const gen = cfg.generation;
        if (!groups[gen]) groups[gen] = { ...CAR_GENERATIONS[gen], models: [] };
        groups[gen].models.push({ key, ...cfg });
      }
      return groups;
    });

    // ---- 计算属性 ----
    const storageSoc = computed(() => {
      if (store.energyStorage.totalCapacity === 0) return 0;
      return store.energyStorage.currentEnergy / store.energyStorage.totalCapacity;
    });
    Object.defineProperty(store, 'storageSoc', { get: () => storageSoc.value, enumerable: true });

    const completedVehicles = computed(() => store.vehicles.filter(v => v.status === 'done').length);
    Object.defineProperty(store, 'completedVehicles', { get: () => completedVehicles.value, enumerable: true });

    const chargingVehiclesComputed = computed(() => store.vehicles.filter(v => v.status === 'charging'));
    const queuingVehicles = computed(() => store.vehicles.filter(v => v.status === 'queuing'));
    const displayQueue = computed(() => store.vehicles.filter(v => v.status === 'queuing').slice(0, 20));
    const doneVehicles = computed(() => store.vehicles.filter(v => v.status === 'done'));

    const totalStorageCount = computed(() => store.stationConfig.storagePerPile * store.stationConfig.pileCount);
    const totalStorageCapacity = computed(() => totalStorageCount.value * store.stationConfig.storageCapacityPerUnit);
    const totalMaxDischargePower = computed(() => totalStorageCount.value * store.stationConfig.maxDischargePowerPerUnit);
    const totalGunCount = computed(() => store.stationConfig.pileCount * store.stationConfig.gunsPerPile);

    /** 车辆充电统计数据（用于结果表格） */
    const vehicleStats = computed(() => {
      return store.vehicles.filter(v => v.status === 'done' || v.status === 'charging').map(v => {
        const config = CAR_MODEL_CONFIGS[v.model];
        const chargeTime = v.status === 'done' ? v.endChargeTime - v.startChargeTime : store.simTime - v.startChargeTime;
        return {
          id: v.id, model: v.model, modelLabel: config.label,
          initialSoc: v.initialSoc, finalSoc: v.soc,
          chargeTime: Math.round(chargeTime),
          energyCharged: Math.round(v.energyCharged * 10) / 10,
          peakPower: Math.round(v.peakPower || v.currentPower),
          degraded: v.degraded, degradeTime: 0,
        };
      });
    });

    /** 模拟结束后的结论文本 */
    const conclusionText = computed(() => {
      const genLabel = CAR_MODEL_CONFIGS[store.queueConfig.carModel]?.generation === 'gen2' ? '二代闪充' : '一代闪充';
      if (store.degradeEvents.length === 0 && store.simStatus === 'finished') {
        return `在储能 ${totalStorageCapacity.value} kWh、电网 ${store.stationConfig.gridPower} kW、${store.stationConfig.pileCount} 桩×2枪（${genLabel}）条件下，${store.queueConfig.vehicleCount} 辆 ${CAR_MODEL_CONFIGS[store.queueConfig.carModel]?.label || ''} 间隔 ${store.queueConfig.chargingInterval} 分钟充电，全程未发生闪充降级。`;
      }
      if (store.degradeEvents.length > 0) {
        const fe = store.degradeEvents[0];
        const minutes = Math.floor(fe.time / 60);
        const seconds = Math.round(fe.time % 60);
        return `在储能 ${totalStorageCapacity.value} kWh、电网 ${store.stationConfig.gridPower} kW、${store.stationConfig.pileCount} 桩×2枪（${genLabel}）条件下，连续 ${store.queueConfig.vehicleCount} 辆 ${CAR_MODEL_CONFIGS[store.queueConfig.carModel]?.label || ''} 间隔 ${store.queueConfig.chargingInterval} 分钟充电，第 ${fe.vehicleId} 辆车在 ${minutes}分${seconds}秒 时开始出现闪充降级，储能 SOC 仅 ${Math.round(fe.storageSoc * 100)}%。`;
      }
      return '';
    });

    /** 当前选中查看功率曲线的车辆 ID（0 表示查看全部概览） */
    const selectedVehicleId = ref(0);
    /** 获取指定车辆的功率历史数据 */
    function getVehiclePowerHistory(vehicleId) {
      return store.vehicleChartData[vehicleId] || [];
    }
    /** 可供选择的车辆列表（正在充电或已完成的） */
    const selectableVehicles = computed(() => {
      return store.vehicles.filter(v => v.status === 'charging' || v.status === 'done');
    });

    // ---- 初始化 ----

    /** 根据当前配置初始化/重置模拟状态 */
    function initSimulation() {
      const sc = store.stationConfig;
      const qc = store.queueConfig;
      store.simTime = 0; store.simStatus = 'idle'; store.isDegraded = false;
      store.currentTotalPower = 0; store.currentGridPower = 0; store.currentStoragePower = 0;
      store.degradeEvents = []; store.chartData = [];
      store.vehicleChartData = {};
      store.parkingAnimations = [];
      selectedVehicleId.value = 0;
      const storageCount = sc.storagePerPile * sc.pileCount;
      const totalCap = storageCount * sc.storageCapacityPerUnit;
      store.energyStorage = {
        totalCapacity: totalCap, currentEnergy: totalCap,
        maxDischargePower: storageCount * sc.maxDischargePowerPerUnit,
        maxChargePower: storageCount * sc.maxChargePowerPerUnit,
        currentPower: 0,
      };
      // 创建多充电桩结构
      const piles = [];
      const allGuns = [];
      let gunGlobalIndex = 0;
      for (let p = 0; p < sc.pileCount; p++) {
        const guns = [];
        for (let g = 0; g < sc.gunsPerPile; g++) {
          const gun = {
            index: gunGlobalIndex, pileIndex: p, gunInPile: g,
            status: 'idle', vehicleId: -1, currentPower: 0,
            parkingAnim: null, // 停车动画状态
            cooldownUntil: 0,  // 充电间隔冷却截止时间（前车离开后需等待一段时间）
          };
          guns.push(gun);
          allGuns.push(gun);
          gunGlobalIndex++;
        }
        piles.push({
          index: p, guns, totalPower: 0,
          status: 'idle', // idle | charging | degraded
        });
      }
      store.chargingPiles = piles;
      store.chargingGuns = allGuns;
      // 所有车辆随时可用，按排队顺序等待空闲枪位
      // 充电间隔由枪位的 cooldownUntil 控制（前车离开后需等待 chargingInterval 分钟）
      store.vehicles = Array.from({ length: qc.vehicleCount }, (_, i) => ({
        id: i + 1, model: qc.carModel, soc: qc.initialSoc, initialSoc: qc.initialSoc,
        status: 'queuing',
        startChargeTime: 0, endChargeTime: 0, currentPower: 0,
        energyCharged: 0, degraded: false, pileIndex: -1, gunIndex: -1,
        peakPower: 0,
      }));
    }

    /** 记录图表数据点（每 2 秒模拟时间采一次样） */
    function recordDataPoint() {
      store.chartData.push({
        time: store.simTime, totalPower: store.currentTotalPower,
        gridPower: store.currentGridPower, storagePower: store.currentStoragePower,
        storageSoc: storageSoc.value, isDegraded: store.isDegraded,
      });
      if (store.chartData.length > 1800) store.chartData.shift();

      // 记录每辆正在充电的车辆功率数据
      for (const v of store.vehicles) {
        if (v.status === 'charging') {
          if (!store.vehicleChartData[v.id]) store.vehicleChartData[v.id] = [];
          store.vehicleChartData[v.id].push({
            time: store.simTime, power: v.currentPower, soc: v.soc,
          });
          if (store.vehicleChartData[v.id].length > 1800) store.vehicleChartData[v.id].shift();
        }
      }
    }

    // ---- 停车动画管理 ----
    function triggerParkingAnimation(gun, vehicleId) {
      gun.parkingAnim = {
        vehicleId,
        phase: 'approaching', // approaching -> parking -> docked
        progress: 0,
        startTime: performance.now(),
      };
      // 300ms后进入 parking 阶段
      setTimeout(() => {
        if (gun.parkingAnim && gun.parkingAnim.vehicleId === vehicleId) {
          gun.parkingAnim.phase = 'parking';
        }
      }, 300);
      // 600ms后停车完成
      setTimeout(() => {
        if (gun.parkingAnim && gun.parkingAnim.vehicleId === vehicleId) {
          gun.parkingAnim.phase = 'docked';
        }
      }, 600);
    }

    function triggerDepartAnimation(gun, vehicleId) {
      if (gun.parkingAnim) {
        gun.parkingAnim.phase = 'departing';
        setTimeout(() => {
          if (gun.parkingAnim && gun.parkingAnim.vehicleId === vehicleId) {
            gun.parkingAnim = null;
          }
        }, 400);
      }
    }

    // ---- Simulation Engine（模拟引擎） ----
    const TICK_INTERVAL = 1;
    let animFrameId = null;
    let lastRealTime = 0;
    let accumulatedTime = 0;
    const degradedVehicleIds = new Set();

    function tick() {
      // 1) 排队车辆 → 空闲枪位（需枪位冷却期已过，模拟充电间隔）
      for (const v of store.vehicles) {
        if (v.status === 'queuing') {
          const freeGun = store.chargingGuns.find(g => g.status === 'idle' && g.cooldownUntil <= store.simTime);
          if (freeGun) {
            v.status = 'charging'; v.startChargeTime = store.simTime;
            v.pileIndex = freeGun.pileIndex; v.gunIndex = freeGun.index;
            freeGun.status = 'charging'; freeGun.vehicleId = v.id;
            triggerParkingAnimation(freeGun, v.id);
          }
        }
      }

      // 2) 功率分配（传入每桩代际，用于单桩功率上限约束）
      const chargingVehicles = store.vehicles.filter(v => v.status === 'charging');
      // 构建每桩代际列表：取该桩上正在充电的第一辆车的代际（同桩同代际）
      const pileGenList = store.chargingPiles.map(pile => {
        for (const gun of pile.guns) {
          if (gun.vehicleId > 0) {
            const v = store.vehicles.find(vv => vv.id === gun.vehicleId);
            if (v) return CAR_MODEL_CONFIGS[v.model]?.generation || 'gen2';
          }
        }
        return 'gen2'; // 默认二代
      });
      const result = allocatePower(chargingVehicles, store.energyStorage, store.stationConfig.gridPower, store.simTime, TICK_INTERVAL, degradedVehicleIds, pileGenList);
      store.currentTotalPower = result.totalPower;
      store.currentGridPower = result.gridPowerUsed;
      store.currentStoragePower = Math.max(0, result.storagePowerUsed);
      store.isDegraded = result.isDegraded;
      for (const evt of result.newDegradeEvents) { store.degradeEvents.push(evt); degradedVehicleIds.add(evt.vehicleId); }

      // 3) 更新各车 SOC
      for (const v of chargingVehicles) {
        const power = result.vehiclePowers.get(v.id) || 0;
        v.currentPower = power;
        if (power > (v.peakPower || 0)) v.peakPower = power;
        const config = CAR_MODEL_CONFIGS[v.model];
        const { energyDelta, socDelta } = calcChargeIncrement(power, config.batteryCapacity, TICK_INTERVAL);
        v.soc = Math.min(v.soc + socDelta, 1);
        v.energyCharged += energyDelta;
        if (result.isDegraded && !v.degraded) v.degraded = true;
        const gun = store.chargingGuns.find(g => g.vehicleId === v.id);
        if (gun) { gun.currentPower = power; gun.status = result.isDegraded ? 'degraded' : 'charging'; }
        if (v.soc >= store.queueConfig.targetSoc) {
          v.soc = store.queueConfig.targetSoc; v.status = 'done'; v.endChargeTime = store.simTime; v.currentPower = 0;
          if (gun) {
            // 设置枪位冷却期：模拟前车拔枪离开 + 后车停车插枪的时间间隔
            const intervalSeconds = store.queueConfig.chargingInterval * 60;
            gun.cooldownUntil = store.simTime + intervalSeconds;
            triggerDepartAnimation(gun, v.id);
            setTimeout(() => {
              gun.status = 'idle'; gun.vehicleId = -1; gun.currentPower = 0;
            }, 50);
          }
        }
      }

      // 更新桩状态
      for (const pile of store.chargingPiles) {
        let pilePower = 0;
        let pileStatus = 'idle';
        for (const gun of pile.guns) {
          pilePower += gun.currentPower;
          if (gun.status === 'degraded') pileStatus = 'degraded';
          else if (gun.status === 'charging' && pileStatus !== 'degraded') pileStatus = 'charging';
        }
        pile.totalPower = pilePower;
        pile.status = pileStatus;
      }

      // 更新储能电量
      if (result.storagePowerUsed > 0) {
        store.energyStorage.currentEnergy = Math.max(0, store.energyStorage.currentEnergy - (result.storagePowerUsed * TICK_INTERVAL) / 3600);
      } else if (result.storagePowerUsed < 0) {
        store.energyStorage.currentEnergy = Math.min(store.energyStorage.totalCapacity, store.energyStorage.currentEnergy + (Math.abs(result.storagePowerUsed) * TICK_INTERVAL) / 3600);
      }
      store.energyStorage.currentPower = result.storagePowerUsed;

      // 采样图表数据
      if (Math.floor(store.simTime) % 2 === 0) recordDataPoint();
      store.simTime += TICK_INTERVAL;

      // 4) 判断是否全部完成（所有车辆充完 + 储能柜充满）
      const allDone = store.vehicles.every(v => v.status === 'done');
      const noQueuing = store.vehicles.every(v => v.status !== 'queuing');
      const noCharging = chargingVehicles.length === 0;
      const vehiclesFinished = allDone || (noQueuing && noCharging && completedVehicles.value === store.vehicles.length);
      const storageFullEnough = store.energyStorage.currentEnergy >= store.energyStorage.totalCapacity * 0.995; // 99.5% 视为充满
      if (vehiclesFinished && storageFullEnough) {
        store.simStatus = 'finished'; stopSim();
      }
    }

    function simLoop(realTime) {
      if (store.simStatus !== 'running') return;
      if (lastRealTime === 0) lastRealTime = realTime;
      const deltaReal = (realTime - lastRealTime) / 1000;
      lastRealTime = realTime;
      const simDelta = deltaReal * 60 * store.simSpeed;
      accumulatedTime += simDelta;
      while (accumulatedTime >= TICK_INTERVAL) {
        tick(); accumulatedTime -= TICK_INTERVAL;
        if (store.simStatus !== 'running') break;
      }
      if (store.simStatus === 'running') animFrameId = requestAnimationFrame(simLoop);
    }

    function startSim() {
      if (store.simStatus === 'idle') initSimulation();
      store.simStatus = 'running'; lastRealTime = 0; accumulatedTime = 0;
      degradedVehicleIds.clear();
      store.degradeEvents.forEach(e => degradedVehicleIds.add(e.vehicleId));
      animFrameId = requestAnimationFrame(simLoop);
    }
    function pauseSim() { store.simStatus = 'paused'; if (animFrameId !== null) { cancelAnimationFrame(animFrameId); animFrameId = null; } }
    function stopSim() { if (animFrameId !== null) { cancelAnimationFrame(animFrameId); animFrameId = null; } }
    function resetSim() { stopSim(); degradedVehicleIds.clear(); initSimulation(); }

    function togglePlay() {
      if (store.simStatus === 'running') pauseSim();
      else if (store.simStatus === 'idle' || store.simStatus === 'paused') startSim();
      else if (store.simStatus === 'finished') { resetSim(); startSim(); }
    }
    function setSpeed(s) { store.simSpeed = s; }

    // ---- UI State（界面交互状态） ----
    const configCollapsed = ref(false);
    const localStation = reactive({ ...DEFAULT_STATION_CONFIG });
    const localQueue = reactive({ ...DEFAULT_QUEUE_CONFIG });
    const speedOptions = [1, 2, 5, 10];

    const playBtnText = computed(() => {
      switch (store.simStatus) {
        case 'idle': return '▶ 开始模拟'; case 'running': return '⏸ 暂停';
        case 'paused': return '▶ 继续'; case 'finished': return '▶ 重新开始'; default: return '▶ 开始';
      }
    });

    const socColorClass = computed(() => {
      const soc = storageSoc.value;
      if (soc > 0.5) return 'soc-good'; if (soc > 0.2) return 'soc-warn'; return 'soc-danger';
    });

    const circumference = Math.PI * 2 * 50;
    const socColor = computed(() => {
      const soc = storageSoc.value;
      if (soc > 0.5) return '#22C55E'; if (soc > 0.2) return '#F59E0B'; return '#EF4444';
    });
    const socDash = computed(() => {
      const filled = storageSoc.value * circumference;
      return `${filled} ${circumference}`;
    });

    // ---- 工具函数 ----
    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    function formatDuration(seconds) {
      if (seconds <= 0) return '-';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      if (m > 0) return `${m}分${s}秒`;
      return `${s}秒`;
    }
    function gunStatusText(status) {
      if (status === 'idle') return '空闲'; if (status === 'charging') return '充电中'; if (status === 'degraded') return '降级中'; return status;
    }
    function getVehicleSoc(vehicleId) { const v = store.vehicles.find(v => v.id === vehicleId); return v ? v.soc : 0; }
    function getVehicleLabel(vehicleId) { const v = store.vehicles.find(v => v.id === vehicleId); return v ? CAR_MODEL_CONFIGS[v.model].label : ''; }
    function getVehiclePower(vehicleId) { const v = store.vehicles.find(v => v.id === vehicleId); return v ? Math.round(v.currentPower) : 0; }

    function handleReset() { resetSim(); configCollapsed.value = false; }
    function applyConfig() {
      Object.assign(store.stationConfig, { ...localStation });
      Object.assign(store.queueConfig, { ...localQueue });
      resetSim(); configCollapsed.value = true;
    }

    // ---- 获取停车动画 CSS class ----
    function getParkingClass(gun) {
      if (!gun.parkingAnim) return '';
      return 'parking-' + gun.parkingAnim.phase;
    }

    // ---- Charts（Canvas 手绘图表，无第三方依赖） ----
    const powerChartRef = ref(null);
    const powerCanvas = ref(null);
    const socChartRef = ref(null);
    const socCanvas = ref(null);
    const vehiclePowerChartRef = ref(null);
    const vehiclePowerCanvas = ref(null);
    let chartRafId = null;
    let resizeObserver = null;

    // 车位内嵌功率图 canvas refs（按 gun.index 索引）
    const slotChartRefs = {};   // { gunIndex: containerEl }
    const slotCanvasRefs = {};  // { gunIndex: canvasEl }
    function setSlotChartRef(gunIndex, el) { if (el) slotChartRefs[gunIndex] = el; else delete slotChartRefs[gunIndex]; }
    function setSlotCanvasRef(gunIndex, el) { if (el) slotCanvasRefs[gunIndex] = el; else delete slotCanvasRefs[gunIndex]; }

    const PADDING = { top: 20, right: 16, bottom: 28, left: 50 };
    const PADDING_RIGHT_WITH_SOC = 48; // 单车功率图需要显示右侧 SOC 坐标轴时的额外间距
    const BG_COLOR = '#182236';
    const GRID_COLOR = 'rgba(100,116,139,0.18)';
    const AXIS_COLOR = '#5a6e87';

    // 车辆功率曲线颜色表
    const VEHICLE_COLORS = [
      '#00E5A0', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
      '#14B8A6', '#E879F9', '#FB923C', '#22D3EE', '#A3E635',
    ];

    function resizeCanvas(canvas, container) {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d'); if (ctx) ctx.scale(dpr, dpr);
    }

    /** 绘制功率曲线图（总功率 / 电网 / 储能放电） */
    function drawPowerChart() {
      const canvas = powerCanvas.value; const container = powerChartRef.value;
      if (!canvas || !container) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      const w = container.getBoundingClientRect().width;
      const h = container.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = BG_COLOR; ctx.fillRect(0, 0, w, h);
      const data = store.chartData;
      if (data.length < 2) { ctx.fillStyle = '#475569'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('等待模拟数据...', w / 2, h / 2); return; }
      const plotW = w - PADDING.left - PADDING.right;
      const plotH = h - PADDING.top - PADDING.bottom;
      const timeMin = data[0].time; const timeMax = data[data.length - 1].time;
      const timeRange = Math.max(timeMax - timeMin, 1);
      let maxPower = 0;
      for (const d of data) maxPower = Math.max(maxPower, d.totalPower, d.gridPower, d.storagePower);
      maxPower = Math.max(maxPower * 1.1, 100);
      const xScale = t => PADDING.left + ((t - timeMin) / timeRange) * plotW;
      const yScale = v => PADDING.top + plotH - (v / maxPower) * plotH;

      ctx.strokeStyle = GRID_COLOR; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) { const y = PADDING.top + (plotH / 4) * i; ctx.beginPath(); ctx.moveTo(PADDING.left, y); ctx.lineTo(w - PADDING.right, y); ctx.stroke(); }

      ctx.fillStyle = 'rgba(239,68,68,0.08)';
      let inDegrade = false, degradeStartX = 0;
      for (const d of data) { const x = xScale(d.time); if (d.isDegraded && !inDegrade) { inDegrade = true; degradeStartX = x; } else if (!d.isDegraded && inDegrade) { inDegrade = false; ctx.fillRect(degradeStartX, PADDING.top, x - degradeStartX, plotH); } }
      if (inDegrade) ctx.fillRect(degradeStartX, PADDING.top, xScale(timeMax) - degradeStartX, plotH);

      function drawLine(key, color, dash) {
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash(dash || []);
        ctx.beginPath(); let first = true;
        for (const d of data) { const x = xScale(d.time); const y = yScale(d[key]); if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      drawLine('storagePower', '#F59E0B');
      drawLine('gridPower', '#3B82F6', [4, 3]);
      drawLine('totalPower', '#00E5A0');

      ctx.fillStyle = AXIS_COLOR; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) { const val = Math.round((maxPower / 4) * (4 - i)); ctx.fillText(`${val}`, PADDING.left - 4, PADDING.top + (plotH / 4) * i + 3); }
      ctx.textAlign = 'center';
      const tickCount = Math.min(6, Math.floor(timeRange / 60) + 1);
      for (let i = 0; i <= tickCount; i++) { const t = timeMin + (timeRange / tickCount) * i; const x = xScale(t); ctx.fillText(`${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`, x, h - 6); }
      ctx.fillStyle = '#64748B'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('kW', 4, PADDING.top - 4);
    }

    /** 绘制储能 SOC 曲线图 */
    function drawSocChart() {
      const canvas = socCanvas.value; const container = socChartRef.value;
      if (!canvas || !container) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      const w = container.getBoundingClientRect().width; const h = container.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = BG_COLOR; ctx.fillRect(0, 0, w, h);
      const data = store.chartData;
      if (data.length < 2) { ctx.fillStyle = '#475569'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('等待模拟数据...', w / 2, h / 2); return; }
      const plotW = w - PADDING.left - PADDING.right;
      const plotH = h - PADDING.top - PADDING.bottom;
      const timeMin = data[0].time; const timeMax = data[data.length - 1].time;
      const timeRange = Math.max(timeMax - timeMin, 1);
      const xScale = t => PADDING.left + ((t - timeMin) / timeRange) * plotW;
      const yScale = soc => PADDING.top + plotH - soc * plotH;

      ctx.strokeStyle = GRID_COLOR; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) { const y = PADDING.top + (plotH / 4) * i; ctx.beginPath(); ctx.moveTo(PADDING.left, y); ctx.lineTo(w - PADDING.right, y); ctx.stroke(); }

      const y20 = yScale(0.2); ctx.fillStyle = 'rgba(239,68,68,0.06)'; ctx.fillRect(PADDING.left, y20, plotW, PADDING.top + plotH - y20);
      const y50 = yScale(0.5); ctx.fillStyle = 'rgba(245,158,11,0.04)'; ctx.fillRect(PADDING.left, y50, plotW, y20 - y50);

      ctx.beginPath(); ctx.moveTo(xScale(data[0].time), yScale(0));
      for (const d of data) ctx.lineTo(xScale(d.time), yScale(d.storageSoc));
      ctx.lineTo(xScale(data[data.length - 1].time), yScale(0)); ctx.closePath();
      const gradient = ctx.createLinearGradient(0, PADDING.top, 0, PADDING.top + plotH);
      gradient.addColorStop(0, 'rgba(0,229,160,0.3)'); gradient.addColorStop(0.5, 'rgba(0,184,212,0.15)'); gradient.addColorStop(1, 'rgba(0,184,212,0.02)');
      ctx.fillStyle = gradient; ctx.fill();

      ctx.strokeStyle = '#00E5A0'; ctx.lineWidth = 2; ctx.beginPath(); let first = true;
      for (const d of data) { const x = xScale(d.time); const y = yScale(d.storageSoc); if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y); }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(239,68,68,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(PADDING.left, y20); ctx.lineTo(w - PADDING.right, y20); ctx.stroke(); ctx.setLineDash([]);

      ctx.fillStyle = AXIS_COLOR; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) { ctx.fillText(`${Math.round(100 - i * 25)}%`, PADDING.left - 4, PADDING.top + (plotH / 4) * i + 3); }
      ctx.textAlign = 'center';
      const tickCount = Math.min(6, Math.floor(timeRange / 60) + 1);
      for (let i = 0; i <= tickCount; i++) { const t = timeMin + (timeRange / tickCount) * i; const x = xScale(t); ctx.fillText(`${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`, x, h - 6); }
      ctx.fillStyle = '#64748B'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('SOC', 4, PADDING.top - 4);
    }

    /** 绘制单车功率/SOC 曲线或多车对比图 */
    function drawVehiclePowerChart() {
      const canvas = vehiclePowerCanvas.value; const container = vehiclePowerChartRef.value;
      if (!canvas || !container) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      const w = container.getBoundingClientRect().width; const h = container.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = BG_COLOR; ctx.fillRect(0, 0, w, h);

      // 收集要绘制的车辆数据
      const vehicleIds = selectedVehicleId.value === 0
        ? Object.keys(store.vehicleChartData).map(Number).slice(0, 10) // 最多显示10辆
        : [selectedVehicleId.value];

      // 单车模式需要右侧 SOC 坐标轴，使用更大的右侧间距
      const isSingleVehicle = vehicleIds.length === 1 && store.vehicleChartData[vehicleIds[0]];
      const rightPad = isSingleVehicle ? PADDING_RIGHT_WITH_SOC : PADDING.right;
      const plotW = w - PADDING.left - rightPad;
      const plotH = h - PADDING.top - PADDING.bottom;

      if (vehicleIds.length === 0 || vehicleIds.every(id => !store.vehicleChartData[id] || store.vehicleChartData[id].length < 2)) {
        ctx.fillStyle = '#475569'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('等待车辆充电数据...', w / 2, h / 2);
        return;
      }

      // 计算时间范围和功率范围
      let timeMin = Infinity, timeMax = -Infinity, maxPower = 0;
      for (const id of vehicleIds) {
        const data = store.vehicleChartData[id];
        if (!data || data.length < 2) continue;
        timeMin = Math.min(timeMin, data[0].time);
        timeMax = Math.max(timeMax, data[data.length - 1].time);
        for (const d of data) maxPower = Math.max(maxPower, d.power);
      }
      if (timeMin === Infinity) return;
      const timeRange = Math.max(timeMax - timeMin, 1);
      maxPower = Math.max(maxPower * 1.1, 100);

      const xScale = t => PADDING.left + ((t - timeMin) / timeRange) * plotW;
      const yScale = v => PADDING.top + plotH - (v / maxPower) * plotH;

      // 网格
      ctx.strokeStyle = GRID_COLOR; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) { const y = PADDING.top + (plotH / 4) * i; ctx.beginPath(); ctx.moveTo(PADDING.left, y); ctx.lineTo(PADDING.left + plotW, y); ctx.stroke(); }

      // 绘制每辆车的功率曲线
      let colorIdx = 0;
      for (const id of vehicleIds) {
        const data = store.vehicleChartData[id];
        if (!data || data.length < 2) continue;
        const color = VEHICLE_COLORS[colorIdx % VEHICLE_COLORS.length];
        ctx.strokeStyle = color; ctx.lineWidth = 1.5;
        ctx.beginPath();
        let first = true;
        for (const d of data) {
          const x = xScale(d.time); const y = yScale(d.power);
          if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 在最后一个点标注车辆ID
        if (data.length > 0) {
          const last = data[data.length - 1];
          const lx = xScale(last.time); const ly = yScale(last.power);
          ctx.fillStyle = color; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText(`#${id}`, lx + 3, ly - 3);
        }
        colorIdx++;
      }

      // 如果是单车，还绘制 SOC 曲线（右侧Y轴）
      if (isSingleVehicle) {
        const data = store.vehicleChartData[vehicleIds[0]];
        const socYScale = soc => PADDING.top + plotH - soc * plotH;
        ctx.strokeStyle = 'rgba(245,158,11,0.7)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
        ctx.beginPath(); let first = true;
        for (const d of data) {
          const x = xScale(d.time); const y = socYScale(d.soc);
          if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.setLineDash([]);
        // 右侧 SOC 刻度
        ctx.fillStyle = '#F59E0B'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
        for (let i = 0; i <= 4; i++) {
          ctx.fillText(`${Math.round(100 - i * 25)}%`, PADDING.left + plotW + 4, PADDING.top + (plotH / 4) * i + 3);
        }
        // 右侧 SOC 轴标签
        ctx.fillStyle = '#F59E0B'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('SOC', w - 2, PADDING.top - 4);
      }

      // Y轴刻度
      ctx.fillStyle = AXIS_COLOR; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) { const val = Math.round((maxPower / 4) * (4 - i)); ctx.fillText(`${val}`, PADDING.left - 4, PADDING.top + (plotH / 4) * i + 3); }
      // X轴刻度
      ctx.textAlign = 'center';
      const tickCount = Math.min(6, Math.floor(timeRange / 60) + 1);
      for (let i = 0; i <= tickCount; i++) { const t = timeMin + (timeRange / tickCount) * i; const x = xScale(t); ctx.fillText(`${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`, x, h - 6); }
      ctx.fillStyle = '#64748B'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('kW', 4, PADDING.top - 4);
    }

    /** 绘制车位内嵌功率迷你曲线图 */
    function drawSlotCharts() {
      for (const gun of store.chargingGuns) {
        const canvas = slotCanvasRefs[gun.index];
        const container = slotChartRefs[gun.index];
        if (!canvas || !container || gun.vehicleId <= 0) continue;

        const data = store.vehicleChartData[gun.vehicleId];
        if (!data || data.length < 2) continue;

        const rect = container.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        if (w === 0 || h === 0) continue;

        // resize canvas
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // 绘制背景
        ctx.clearRect(0, 0, w, h);

        // 迷你图不需要坐标轴，紧凑布局
        const pad = { top: 2, right: 2, bottom: 2, left: 2 };
        const plotW = w - pad.left - pad.right;
        const plotH = h - pad.top - pad.bottom;

        const timeMin = data[0].time;
        const timeMax = data[data.length - 1].time;
        const timeRange = Math.max(timeMax - timeMin, 1);

        // 功率最大值（取车型最大充电功率作为上限，保证比例一致）
        const vehicle = store.vehicles.find(v => v.id === gun.vehicleId);
        const modelMaxPower = vehicle ? (CAR_MODEL_CONFIGS[vehicle.model]?.maxChargePower || 1000) : 1000;
        const maxPower = modelMaxPower * 1.05;

        const xScale = t => pad.left + ((t - timeMin) / timeRange) * plotW;
        const yScale = v => pad.top + plotH - (v / maxPower) * plotH;

        // 渐变填充区域
        ctx.beginPath();
        ctx.moveTo(xScale(data[0].time), pad.top + plotH);
        for (const d of data) ctx.lineTo(xScale(d.time), yScale(d.power));
        ctx.lineTo(xScale(data[data.length - 1].time), pad.top + plotH);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
        if (gun.status === 'degraded') {
          gradient.addColorStop(0, 'rgba(239,68,68,0.35)');
          gradient.addColorStop(1, 'rgba(239,68,68,0.02)');
        } else {
          gradient.addColorStop(0, 'rgba(0,229,160,0.35)');
          gradient.addColorStop(0.6, 'rgba(0,184,212,0.12)');
          gradient.addColorStop(1, 'rgba(0,184,212,0.02)');
        }
        ctx.fillStyle = gradient;
        ctx.fill();

        // 功率曲线
        const lineColor = gun.status === 'degraded' ? '#EF4444' : '#00E5A0';
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        let first = true;
        for (const d of data) {
          const x = xScale(d.time);
          const y = yScale(d.power);
          if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 最新值标注（右上角小字）
        const lastD = data[data.length - 1];
        ctx.fillStyle = 'rgba(241,245,249,0.7)';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(lastD.power)}kW`, w - 3, 10);
      }
    }

    /** 图表绘制主循环 */
    function drawAll() { drawPowerChart(); drawSocChart(); drawVehiclePowerChart(); drawSlotCharts(); chartRafId = requestAnimationFrame(drawAll); }

    function handleResize() {
      if (powerCanvas.value && powerChartRef.value) resizeCanvas(powerCanvas.value, powerChartRef.value);
      if (socCanvas.value && socChartRef.value) resizeCanvas(socCanvas.value, socChartRef.value);
      if (vehiclePowerCanvas.value && vehiclePowerChartRef.value) resizeCanvas(vehiclePowerCanvas.value, vehiclePowerChartRef.value);
    }

    // ---- 生命周期 ----
    onMounted(() => {
      nextTick(() => {
        handleResize();
        chartRafId = requestAnimationFrame(drawAll);
        resizeObserver = new ResizeObserver(() => handleResize());
        if (powerChartRef.value) resizeObserver.observe(powerChartRef.value);
        if (socChartRef.value) resizeObserver.observe(socChartRef.value);
        if (vehiclePowerChartRef.value) resizeObserver.observe(vehiclePowerChartRef.value);
      });
    });

    onUnmounted(() => {
      if (chartRafId !== null) cancelAnimationFrame(chartRafId);
      if (resizeObserver) resizeObserver.disconnect();
      stopSim();
    });

    // 初始化模拟
    initSimulation();

    return {
      store, CAR_MODEL_CONFIGS, CAR_GENERATIONS,
      selectedGeneration, filteredCarModels, carModelsByGen,
      configCollapsed, localStation, localQueue, speedOptions,
      playBtnText, socColorClass, socColor, socDash, totalStorageCount,
      queuingVehicles, displayQueue, doneVehicles, vehicleStats, conclusionText,
      totalGunCount, selectableVehicles, selectedVehicleId,
      togglePlay, setSpeed, handleReset, applyConfig,
      formatTime, formatDuration, gunStatusText, getVehicleSoc, getVehicleLabel, getVehiclePower,
      getParkingClass,
      powerChartRef, powerCanvas, socChartRef, socCanvas,
      vehiclePowerChartRef, vehiclePowerCanvas,
      setSlotChartRef, setSlotCanvasRef,
    };
  }
});

app.mount('#app');
