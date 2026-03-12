<template>
	<div class="charging-sim-page">
		<!-- 顶部标题栏 -->
		<div class="sim-header">
			<div class="header-left">
				<h1 class="page-title">
					<span class="title-icon">⚡</span>
					兆瓦闪充站充电模拟器
				</h1>
				<p class="page-subtitle">
					基于比亚迪第二代刀片电池 + 兆瓦闪充桩真实参数建模 · 储能降级临界分析
				</p>
			</div>
			<div class="header-right">
				<div class="speed-group">
					<span class="speed-label">速度</span>
					<button
						v-for="s in speedOptions"
						:key="s"
						class="speed-btn"
						:class="{ active: store.simSpeed === s }"
						@click="sim.setSpeed(s)"
					>
						×{{ s }}
					</button>
				</div>
				<div class="control-group">
					<button class="ctrl-btn play-btn" @click="sim.togglePlay()">
						{{ playBtnText }}
					</button>
					<button
						class="ctrl-btn reset-btn"
						:disabled="store.simStatus === 'idle'"
						@click="handleReset"
					>
						重置
					</button>
				</div>
			</div>
		</div>

		<!-- 配置面板（可折叠） -->
		<ConfigPanel
			:collapsed="configCollapsed"
			@toggle="configCollapsed = !configCollapsed"
			@apply="handleApplyConfig"
		/>

		<!-- 模拟时间与关键指标 -->
		<div class="metrics-bar">
			<div class="metric-item">
				<span class="metric-label">模拟时间</span>
				<span class="metric-value time-value">{{
					formatTime(store.simTime)
				}}</span>
			</div>
			<div class="metric-item">
				<span class="metric-label">总输出功率</span>
				<span class="metric-value power-value"
					>{{ Math.round(store.currentTotalPower) }} <small>kW</small></span
				>
			</div>
			<div class="metric-item">
				<span class="metric-label">电网功率</span>
				<span class="metric-value grid-value"
					>{{ Math.round(store.currentGridPower) }} <small>kW</small></span
				>
			</div>
			<div class="metric-item">
				<span class="metric-label">储能放电</span>
				<span class="metric-value storage-value"
					>{{ Math.round(store.currentStoragePower) }} <small>kW</small></span
				>
			</div>
			<div class="metric-item">
				<span class="metric-label">储能SOC</span>
				<span class="metric-value" :class="socColorClass"
					>{{ Math.round(store.storageSoc * 100) }}%</span
				>
			</div>
			<div class="metric-item">
				<span class="metric-label">已完成</span>
				<span class="metric-value done-value"
					>{{ store.completedVehicles }} / {{ store.vehicles.length }}</span
				>
			</div>
			<div v-if="store.isDegraded" class="metric-item degrade-alert">
				<span class="alert-icon">⚠️</span>
				<span class="alert-text">闪充降级中</span>
			</div>
		</div>

		<!-- 核心可视化区 -->
		<div class="main-content">
			<StationView />
			<ChartsPanel />
		</div>

		<!-- 结果分析区 -->
		<ResultSummary
			v-if="store.simStatus === 'finished' || store.degradeEvents.length > 0"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useChargingSimStore } from "@/stores/chargingSim";
import { useSimulation } from "@/engine/simulation";
import ConfigPanel from "@/components/ConfigPanel.vue";
import StationView from "@/components/StationView.vue";
import ChartsPanel from "@/components/ChartsPanel.vue";
import ResultSummary from "@/components/ResultSummary.vue";

const store = useChargingSimStore();
const sim = useSimulation();

const configCollapsed = ref(false);
const speedOptions = [1, 2, 5, 10];

const playBtnText = computed(() => {
	switch (store.simStatus) {
		case "idle":
			return "▶ 开始模拟";
		case "running":
			return "⏸ 暂停";
		case "paused":
			return "▶ 继续";
		case "finished":
			return "▶ 重新开始";
		default:
			return "▶ 开始";
	}
});

const socColorClass = computed(() => {
	const soc = store.storageSoc;
	if (soc > 0.5) return "soc-good";
	if (soc > 0.2) return "soc-warn";
	return "soc-danger";
});

function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function handleReset() {
	sim.reset();
	configCollapsed.value = false;
}

function handleApplyConfig() {
	sim.reset();
	configCollapsed.value = true;
}

// 初始化
store.initSimulation();
</script>

<style lang="scss" scoped>
.charging-sim-page {
	min-height: 100vh;
	background: #0a0e1a;
	color: #f1f5f9;
	padding: 16px 20px;
	font-family: "DIN Next", "Helvetica Neue", Arial, sans-serif;
}

.sim-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
	padding-bottom: 12px;
	border-bottom: 1px solid rgba(0, 229, 160, 0.15);
}

.header-left {
	.page-title {
		font-size: 24px;
		font-weight: 700;
		margin: 0;
		background: linear-gradient(135deg, #00e5a0, #00b8d4);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.title-icon {
		-webkit-text-fill-color: initial;
		font-size: 28px;
	}
	.page-subtitle {
		margin: 4px 0 0;
		font-size: 12px;
		color: #64748b;
	}
}

.header-right {
	display: flex;
	align-items: center;
	gap: 16px;
}

.speed-group {
	display: flex;
	align-items: center;
	gap: 4px;
	.speed-label {
		font-size: 12px;
		color: #94a3b8;
		margin-right: 4px;
	}
}

.speed-btn {
	background: #1e293b;
	border: 1px solid #334155;
	color: #94a3b8;
	padding: 4px 10px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
	transition: all 0.2s;
	&:hover {
		border-color: #00b8d4;
		color: #00b8d4;
	}
	&.active {
		background: rgba(0, 184, 212, 0.15);
		border-color: #00b8d4;
		color: #00e5a0;
	}
}

.control-group {
	display: flex;
	gap: 8px;
}

.ctrl-btn {
	padding: 8px 20px;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;
}

.play-btn {
	background: linear-gradient(135deg, #00e5a0, #00b8d4);
	color: #0a0e1a;
	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(0, 229, 160, 0.3);
	}
}

.reset-btn {
	background: #1e293b;
	color: #94a3b8;
	border: 1px solid #334155;
	&:hover:not(:disabled) {
		border-color: #f59e0b;
		color: #f59e0b;
	}
	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
}

.metrics-bar {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	background: rgba(17, 24, 39, 0.8);
	border: 1px solid rgba(0, 229, 160, 0.1);
	border-radius: 8px;
	margin-bottom: 16px;
	flex-wrap: wrap;
}

.metric-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 12px;
	border-right: 1px solid rgba(100, 116, 139, 0.2);
	&:last-child {
		border-right: none;
	}
}

.metric-label {
	font-size: 11px;
	color: #64748b;
	margin-bottom: 2px;
}

.metric-value {
	font-size: 20px;
	font-weight: 700;
	small {
		font-size: 12px;
		font-weight: 400;
		opacity: 0.6;
	}
}

.time-value {
	color: #f1f5f9;
}
.power-value {
	color: #00e5a0;
}
.grid-value {
	color: #3b82f6;
}
.storage-value {
	color: #f59e0b;
}
.done-value {
	color: #22c55e;
}
.soc-good {
	color: #22c55e;
}
.soc-warn {
	color: #f59e0b;
}
.soc-danger {
	color: #ef4444;
}

.degrade-alert {
	flex-direction: row;
	gap: 4px;
	background: rgba(239, 68, 68, 0.15);
	border-radius: 6px;
	padding: 6px 14px;
	border: 1px solid rgba(239, 68, 68, 0.3);
	animation: pulse-alert 1.5s ease-in-out infinite;
}

.alert-icon {
	font-size: 16px;
}
.alert-text {
	color: #ef4444;
	font-weight: 600;
	font-size: 14px;
}

@keyframes pulse-alert {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.6;
	}
}

.main-content {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-bottom: 16px;
}

@media (max-width: 1200px) {
	.main-content {
		grid-template-columns: 1fr;
	}
}
</style>
