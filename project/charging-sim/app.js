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
 */

// ==================== Vue App（使用 Vue3 Composition API）====================
const { createApp, ref, reactive, computed, onMounted, onUnmounted, nextTick } = Vue;

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
      chargingGuns: [],
      degradeEvents: [],
      chartData: [],
      currentTotalPower: 0,
      currentGridPower: 0,
      currentStoragePower: 0,
      isDegraded: false,
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
    const displayQueue = computed(() => store.vehicles.filter(v => v.status === 'queuing').slice(0, 20)); // 排队列表最多展示 20 条
    const doneVehicles = computed(() => store.vehicles.filter(v => v.status === 'done'));

    const totalStorageCapacity = computed(() => store.stationConfig.storageCount * store.stationConfig.storageCapacityPerUnit);
    const totalMaxDischargePower = computed(() => store.stationConfig.storageCount * store.stationConfig.maxDischargePowerPerUnit);

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
          peakPower: Math.round(v.currentPower),
          degraded: v.degraded, degradeTime: 0,
        };
      });
    });

    /** 模拟结束后的结论文本 */
    const conclusionText = computed(() => {
      if (store.degradeEvents.length === 0 && store.simStatus === 'finished') {
        return `在储能 ${totalStorageCapacity.value} kWh、电网 ${store.stationConfig.gridPower} kW 条件下，${store.queueConfig.vehicleCount} 辆车间隔 ${store.queueConfig.arrivalInterval} 秒充电，全程未发生闪充降级。`;
      }
      if (store.degradeEvents.length > 0) {
        const fe = store.degradeEvents[0];
        const minutes = Math.floor(fe.time / 60);
        const seconds = Math.round(fe.time % 60);
        return `在储能 ${totalStorageCapacity.value} kWh、电网 ${store.stationConfig.gridPower} kW 条件下，连续 ${store.queueConfig.vehicleCount} 辆车间隔 ${store.queueConfig.arrivalInterval} 秒充电，第 ${fe.vehicleId} 辆车在 ${minutes}分${seconds}秒 时开始出现闪充降级，储能 SOC 仅 ${Math.round(fe.storageSoc * 100)}%。`;
      }
      return '';
    });

    // ---- 初始化 ----

    /** 根据当前配置初始化/重置模拟状态 */
    function initSimulation() {
      const sc = store.stationConfig;
      const qc = store.queueConfig;
      store.simTime = 0; store.simStatus = 'idle'; store.isDegraded = false;
      store.currentTotalPower = 0; store.currentGridPower = 0; store.currentStoragePower = 0;
      store.degradeEvents = []; store.chartData = [];
      const totalCap = sc.storageCount * sc.storageCapacityPerUnit;
      store.energyStorage = {
        totalCapacity: totalCap, currentEnergy: totalCap,
        maxDischargePower: sc.storageCount * sc.maxDischargePowerPerUnit,
        maxChargePower: sc.storageCount * sc.maxChargePowerPerUnit,
        currentPower: 0,
      };
      store.chargingGuns = Array.from({ length: sc.gunCount }, (_, i) => ({
        index: i, status: 'idle', vehicleId: -1, currentPower: 0,
      }));
      store.vehicles = Array.from({ length: qc.vehicleCount }, (_, i) => ({
        id: i + 1, model: qc.carModel, soc: qc.initialSoc, initialSoc: qc.initialSoc,
        status: 'queuing', arrivalTime: i * qc.arrivalInterval,
        startChargeTime: 0, endChargeTime: 0, currentPower: 0,
        energyCharged: 0, degraded: false, pileIndex: -1,
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
    }

    // ---- Simulation Engine（模拟引擎） ----
    const TICK_INTERVAL = 1;   // 每个 tick 代表 1 秒模拟时间
    const TARGET_SOC = 0.97;   // 充到 97% SOC 视为充满
    let animFrameId = null;    // requestAnimationFrame 返回的 ID
    let lastRealTime = 0;      // 上一帧的真实时间戳 (ms)
    let accumulatedTime = 0;   // 累积的模拟时间（用于把连续帧时间离散化为 tick）
    const degradedVehicleIds = new Set(); // 已记录降级事件的车辆 ID，避免重复记录

    /**
     * tick() - 单步模拟推进（每调用一次 = 1 秒模拟时间）
     * 流程：1) 到达的排队车辆进入空闲枪位
     *       2) 功率分配（电网优先 + 储能补充）
     *       3) 更新各车 SOC、储能电量
     *       4) 判断是否全部充满 → 结束
     */
    function tick() {
      // 1) 排队车辆 → 空闲枪位
      for (const v of store.vehicles) {
        if (v.status === 'queuing' && v.arrivalTime <= store.simTime) {
          const freeGun = store.chargingGuns.find(g => g.status === 'idle');
          if (freeGun) {
            v.status = 'charging'; v.startChargeTime = store.simTime;
            v.pileIndex = freeGun.index; freeGun.status = 'charging'; freeGun.vehicleId = v.id;
          }
        }
      }

      // 2) 功率分配
      const chargingVehicles = store.vehicles.filter(v => v.status === 'charging');
      const result = allocatePower(chargingVehicles, store.energyStorage, store.stationConfig.gridPower, store.simTime, TICK_INTERVAL, degradedVehicleIds);
      store.currentTotalPower = result.totalPower;
      store.currentGridPower = result.gridPowerUsed;
      store.currentStoragePower = Math.max(0, result.storagePowerUsed);
      store.isDegraded = result.isDegraded;
      for (const evt of result.newDegradeEvents) { store.degradeEvents.push(evt); degradedVehicleIds.add(evt.vehicleId); }

      // 3) 更新各车 SOC
      for (const v of chargingVehicles) {
        const power = result.vehiclePowers.get(v.id) || 0;
        v.currentPower = power;
        const config = CAR_MODEL_CONFIGS[v.model];
        const { energyDelta, socDelta } = calcChargeIncrement(power, config.batteryCapacity, TICK_INTERVAL);
        v.soc = Math.min(v.soc + socDelta, 1);
        v.energyCharged += energyDelta;
        if (result.isDegraded && !v.degraded) v.degraded = true;
        const gun = store.chargingGuns.find(g => g.vehicleId === v.id);
        if (gun) { gun.currentPower = power; gun.status = result.isDegraded ? 'degraded' : 'charging'; }
        if (v.soc >= TARGET_SOC) {
          v.soc = TARGET_SOC; v.status = 'done'; v.endChargeTime = store.simTime; v.currentPower = 0;
          if (gun) { gun.status = 'idle'; gun.vehicleId = -1; gun.currentPower = 0; }
        }
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

      // 4) 判断是否全部完成
      const allDone = store.vehicles.every(v => v.status === 'done');
      const allArrived = store.vehicles.every(v => v.arrivalTime <= store.simTime);
      const noCharging = chargingVehicles.length === 0;
      if (allDone || (allArrived && noCharging && completedVehicles.value === store.vehicles.length)) {
        store.simStatus = 'finished'; stopSim();
      }
    }

    /**
     * simLoop() - 由 requestAnimationFrame 驱动的主循环
     * 将真实经过的时间 × 模拟速度 → 映射为模拟世界的秒数，
     * 然后以 TICK_INTERVAL 为步长逐 tick 推进
     */
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
    const configCollapsed = ref(false);        // 配置面板是否折叠
    const localStation = reactive({ ...DEFAULT_STATION_CONFIG }); // 本地站点配置（编辑用）
    const localQueue = reactive({ ...DEFAULT_QUEUE_CONFIG });     // 本地队列配置（编辑用）
    const speedOptions = [1, 2, 5, 10];        // 可选模拟速度倍率

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

    function handleReset() { resetSim(); configCollapsed.value = false; }
    function applyConfig() {
      Object.assign(store.stationConfig, { ...localStation });
      Object.assign(store.queueConfig, { ...localQueue });
      resetSim(); configCollapsed.value = true;
    }

    // ---- Charts（Canvas 手绘图表，无第三方依赖） ----
    const powerChartRef = ref(null);
    const powerCanvas = ref(null);
    const socChartRef = ref(null);
    const socCanvas = ref(null);
    let chartRafId = null;
    let resizeObserver = null;

    const PADDING = { top: 20, right: 12, bottom: 28, left: 50 };
    const BG_COLOR = '#182236';  /* 图表画布背景色 */
    const GRID_COLOR = 'rgba(100,116,139,0.18)';
    const AXIS_COLOR = '#5a6e87';

    function resizeCanvas(canvas, container) {
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

      // 网格线
      ctx.strokeStyle = GRID_COLOR; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) { const y = PADDING.top + (plotH / 4) * i; ctx.beginPath(); ctx.moveTo(PADDING.left, y); ctx.lineTo(w - PADDING.right, y); ctx.stroke(); }

      // 降级区间高亮
      ctx.fillStyle = 'rgba(239,68,68,0.08)';
      let inDegrade = false, degradeStartX = 0;
      for (const d of data) { const x = xScale(d.time); if (d.isDegraded && !inDegrade) { inDegrade = true; degradeStartX = x; } else if (!d.isDegraded && inDegrade) { inDegrade = false; ctx.fillRect(degradeStartX, PADDING.top, x - degradeStartX, plotH); } }
      if (inDegrade) ctx.fillRect(degradeStartX, PADDING.top, xScale(timeMax) - degradeStartX, plotH);

      // 绘制数据线
      function drawLine(key, color, dash) {
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash(dash || []);
        ctx.beginPath(); let first = true;
        for (const d of data) { const x = xScale(d.time); const y = yScale(d[key]); if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      drawLine('storagePower', '#F59E0B');
      drawLine('gridPower', '#3B82F6', [4, 3]);
      drawLine('totalPower', '#00E5A0');

      // Y 轴刻度
      ctx.fillStyle = AXIS_COLOR; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) { const val = Math.round((maxPower / 4) * (4 - i)); ctx.fillText(`${val}`, PADDING.left - 4, PADDING.top + (plotH / 4) * i + 3); }
      // X 轴刻度
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

      // 网格线
      ctx.strokeStyle = GRID_COLOR; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) { const y = PADDING.top + (plotH / 4) * i; ctx.beginPath(); ctx.moveTo(PADDING.left, y); ctx.lineTo(w - PADDING.right, y); ctx.stroke(); }

      // SOC 区间底色
      const y20 = yScale(0.2); ctx.fillStyle = 'rgba(239,68,68,0.06)'; ctx.fillRect(PADDING.left, y20, plotW, PADDING.top + plotH - y20);
      const y50 = yScale(0.5); ctx.fillStyle = 'rgba(245,158,11,0.04)'; ctx.fillRect(PADDING.left, y50, plotW, y20 - y50);

      // 面积填充
      ctx.beginPath(); ctx.moveTo(xScale(data[0].time), yScale(0));
      for (const d of data) ctx.lineTo(xScale(d.time), yScale(d.storageSoc));
      ctx.lineTo(xScale(data[data.length - 1].time), yScale(0)); ctx.closePath();
      const gradient = ctx.createLinearGradient(0, PADDING.top, 0, PADDING.top + plotH);
      gradient.addColorStop(0, 'rgba(0,229,160,0.3)'); gradient.addColorStop(0.5, 'rgba(0,184,212,0.15)'); gradient.addColorStop(1, 'rgba(0,184,212,0.02)');
      ctx.fillStyle = gradient; ctx.fill();

      // SOC 曲线
      ctx.strokeStyle = '#00E5A0'; ctx.lineWidth = 2; ctx.beginPath(); let first = true;
      for (const d of data) { const x = xScale(d.time); const y = yScale(d.storageSoc); if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y); }
      ctx.stroke();

      // 20% 警戒线
      ctx.strokeStyle = 'rgba(239,68,68,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(PADDING.left, y20); ctx.lineTo(w - PADDING.right, y20); ctx.stroke(); ctx.setLineDash([]);

      // 坐标轴
      ctx.fillStyle = AXIS_COLOR; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) { ctx.fillText(`${Math.round(100 - i * 25)}%`, PADDING.left - 4, PADDING.top + (plotH / 4) * i + 3); }
      ctx.textAlign = 'center';
      const tickCount = Math.min(6, Math.floor(timeRange / 60) + 1);
      for (let i = 0; i <= tickCount; i++) { const t = timeMin + (timeRange / tickCount) * i; const x = xScale(t); ctx.fillText(`${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`, x, h - 6); }
      ctx.fillStyle = '#64748B'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('SOC', 4, PADDING.top - 4);
    }

    /** 图表绘制主循环 */
    function drawAll() { drawPowerChart(); drawSocChart(); chartRafId = requestAnimationFrame(drawAll); }

    function handleResize() {
      if (powerCanvas.value && powerChartRef.value) resizeCanvas(powerCanvas.value, powerChartRef.value);
      if (socCanvas.value && socChartRef.value) resizeCanvas(socCanvas.value, socChartRef.value);
    }

    // ---- 生命周期 ----
    onMounted(() => {
      nextTick(() => {
        handleResize();
        chartRafId = requestAnimationFrame(drawAll);
        resizeObserver = new ResizeObserver(() => handleResize());
        if (powerChartRef.value) resizeObserver.observe(powerChartRef.value);
        if (socChartRef.value) resizeObserver.observe(socChartRef.value);
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
      store, CAR_MODEL_CONFIGS,
      configCollapsed, localStation, localQueue, speedOptions,
      playBtnText, socColorClass, socColor, socDash,
      queuingVehicles, displayQueue, doneVehicles, vehicleStats, conclusionText,
      togglePlay, setSpeed, handleReset, applyConfig,
      formatTime, formatDuration, gunStatusText, getVehicleSoc, getVehicleLabel,
      powerChartRef, powerCanvas, socChartRef, socCanvas,
    };
  }
});

app.mount('#app');
