<template>
	<div class="charts-panel">
		<h3 class="section-title">实时图表</h3>

		<!-- 充电功率时间曲线 -->
		<div class="chart-block">
			<div class="chart-header">
				<span class="chart-title">充电功率曲线</span>
				<div class="chart-legend">
					<span class="legend-item"
						><span class="dot" style="background: #00e5a0"></span>总功率</span
					>
					<span class="legend-item"
						><span class="dot" style="background: #3b82f6"></span>电网</span
					>
					<span class="legend-item"
						><span class="dot" style="background: #f59e0b"></span>储能放电</span
					>
				</div>
			</div>
			<div ref="powerChartRef" class="chart-container">
				<canvas ref="powerCanvas"></canvas>
			</div>
		</div>

		<!-- 储能电量变化曲线 -->
		<div class="chart-block">
			<div class="chart-header">
				<span class="chart-title">储能 SOC 变化</span>
				<div class="chart-legend">
					<span class="legend-item"
						><span class="dot" style="background: #00e5a0"></span>SOC</span
					>
					<span class="legend-item"
						><span class="dot" style="background: rgba(239, 68, 68, 0.3)"></span
						>降级区间</span
					>
				</div>
			</div>
			<div ref="socChartRef" class="chart-container">
				<canvas ref="socCanvas"></canvas>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useChargingSimStore } from "@/stores/chargingSim";

const store = useChargingSimStore();

const powerChartRef = ref<HTMLDivElement>();
const powerCanvas = ref<HTMLCanvasElement>();
const socChartRef = ref<HTMLDivElement>();
const socCanvas = ref<HTMLCanvasElement>();

let rafId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

const PADDING = { top: 20, right: 12, bottom: 28, left: 50 };
const BG_COLOR = "#0F172A";
const GRID_COLOR = "rgba(100,116,139,0.15)";
const AXIS_COLOR = "#475569";

function resizeCanvas(canvas: HTMLCanvasElement, container: HTMLDivElement) {
	const rect = container.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	canvas.style.width = `${rect.width}px`;
	canvas.style.height = `${rect.height}px`;
	const ctx = canvas.getContext("2d");
	if (ctx) ctx.scale(dpr, dpr);
}

function drawPowerChart() {
	const canvas = powerCanvas.value;
	const container = powerChartRef.value;
	if (!canvas || !container) return;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const w = container.getBoundingClientRect().width;
	const h = container.getBoundingClientRect().height;

	ctx.clearRect(0, 0, w, h);

	// 背景
	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(0, 0, w, h);

	const data = store.chartData;
	if (data.length < 2) {
		ctx.fillStyle = "#475569";
		ctx.font = "12px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("等待模拟数据...", w / 2, h / 2);
		return;
	}

	const plotW = w - PADDING.left - PADDING.right;
	const plotH = h - PADDING.top - PADDING.bottom;

	// 计算范围
	const timeMin = data[0].time;
	const timeMax = data[data.length - 1].time;
	const timeRange = Math.max(timeMax - timeMin, 1);

	let maxPower = 0;
	for (const d of data) {
		maxPower = Math.max(maxPower, d.totalPower, d.gridPower, d.storagePower);
	}
	maxPower = Math.max(maxPower * 1.1, 100);

	const xScale = (t: number) =>
		PADDING.left + ((t - timeMin) / timeRange) * plotW;
	const yScale = (v: number) => PADDING.top + plotH - (v / maxPower) * plotH;

	// 网格线
	ctx.strokeStyle = GRID_COLOR;
	ctx.lineWidth = 0.5;
	for (let i = 0; i <= 4; i++) {
		const y = PADDING.top + (plotH / 4) * i;
		ctx.beginPath();
		ctx.moveTo(PADDING.left, y);
		ctx.lineTo(w - PADDING.right, y);
		ctx.stroke();
	}

	// 降级区间背景
	ctx.fillStyle = "rgba(239,68,68,0.08)";
	let inDegrade = false;
	let degradeStartX = 0;
	for (const d of data) {
		const x = xScale(d.time);
		if (d.isDegraded && !inDegrade) {
			inDegrade = true;
			degradeStartX = x;
		} else if (!d.isDegraded && inDegrade) {
			inDegrade = false;
			ctx.fillRect(degradeStartX, PADDING.top, x - degradeStartX, plotH);
		}
	}
	if (inDegrade) {
		ctx.fillRect(
			degradeStartX,
			PADDING.top,
			xScale(timeMax) - degradeStartX,
			plotH,
		);
	}

	// 画线函数
	function drawLine(
		key: "totalPower" | "gridPower" | "storagePower",
		color: string,
		dash: number[] = [],
	) {
		if (!ctx) return;
		ctx.strokeStyle = color;
		ctx.lineWidth = 1.5;
		ctx.setLineDash(dash);
		ctx.beginPath();
		let first = true;
		for (const d of data) {
			const x = xScale(d.time);
			const y = yScale(d[key]);
			if (first) {
				ctx.moveTo(x, y);
				first = false;
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();
		ctx.setLineDash([]);
	}

	drawLine("storagePower", "#F59E0B");
	drawLine("gridPower", "#3B82F6", [4, 3]);
	drawLine("totalPower", "#00E5A0");

	// Y轴标签
	ctx.fillStyle = AXIS_COLOR;
	ctx.font = "10px sans-serif";
	ctx.textAlign = "right";
	for (let i = 0; i <= 4; i++) {
		const val = Math.round((maxPower / 4) * (4 - i));
		const y = PADDING.top + (plotH / 4) * i;
		ctx.fillText(`${val}`, PADDING.left - 4, y + 3);
	}

	// X轴标签
	ctx.textAlign = "center";
	const tickCount = Math.min(6, Math.floor(timeRange / 60) + 1);
	for (let i = 0; i <= tickCount; i++) {
		const t = timeMin + (timeRange / tickCount) * i;
		const x = xScale(t);
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		ctx.fillText(`${m}:${String(s).padStart(2, "0")}`, x, h - 6);
	}

	// 单位
	ctx.fillStyle = "#64748B";
	ctx.font = "9px sans-serif";
	ctx.textAlign = "left";
	ctx.fillText("kW", 4, PADDING.top - 4);
}

function drawSocChart() {
	const canvas = socCanvas.value;
	const container = socChartRef.value;
	if (!canvas || !container) return;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const w = container.getBoundingClientRect().width;
	const h = container.getBoundingClientRect().height;

	ctx.clearRect(0, 0, w, h);
	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(0, 0, w, h);

	const data = store.chartData;
	if (data.length < 2) {
		ctx.fillStyle = "#475569";
		ctx.font = "12px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("等待模拟数据...", w / 2, h / 2);
		return;
	}

	const plotW = w - PADDING.left - PADDING.right;
	const plotH = h - PADDING.top - PADDING.bottom;

	const timeMin = data[0].time;
	const timeMax = data[data.length - 1].time;
	const timeRange = Math.max(timeMax - timeMin, 1);

	const xScale = (t: number) =>
		PADDING.left + ((t - timeMin) / timeRange) * plotW;
	const yScale = (soc: number) => PADDING.top + plotH - soc * plotH;

	// 网格线
	ctx.strokeStyle = GRID_COLOR;
	ctx.lineWidth = 0.5;
	for (let i = 0; i <= 4; i++) {
		const y = PADDING.top + (plotH / 4) * i;
		ctx.beginPath();
		ctx.moveTo(PADDING.left, y);
		ctx.lineTo(w - PADDING.right, y);
		ctx.stroke();
	}

	// 危险区域背景 (SOC < 20%)
	const y20 = yScale(0.2);
	ctx.fillStyle = "rgba(239,68,68,0.06)";
	ctx.fillRect(PADDING.left, y20, plotW, PADDING.top + plotH - y20);

	// 警告区域 (SOC 20%~50%)
	const y50 = yScale(0.5);
	ctx.fillStyle = "rgba(245,158,11,0.04)";
	ctx.fillRect(PADDING.left, y50, plotW, y20 - y50);

	// 面积图
	ctx.beginPath();
	ctx.moveTo(xScale(data[0].time), yScale(0));
	for (const d of data) {
		ctx.lineTo(xScale(d.time), yScale(d.storageSoc));
	}
	ctx.lineTo(xScale(data[data.length - 1].time), yScale(0));
	ctx.closePath();

	const gradient = ctx.createLinearGradient(
		0,
		PADDING.top,
		0,
		PADDING.top + plotH,
	);
	gradient.addColorStop(0, "rgba(0,229,160,0.3)");
	gradient.addColorStop(0.5, "rgba(0,184,212,0.15)");
	gradient.addColorStop(1, "rgba(0,184,212,0.02)");
	ctx.fillStyle = gradient;
	ctx.fill();

	// SOC线
	ctx.strokeStyle = "#00E5A0";
	ctx.lineWidth = 2;
	ctx.beginPath();
	let first = true;
	for (const d of data) {
		const x = xScale(d.time);
		const y = yScale(d.storageSoc);
		if (first) {
			ctx.moveTo(x, y);
			first = false;
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();

	// 20% 警戒线
	ctx.strokeStyle = "rgba(239,68,68,0.4)";
	ctx.lineWidth = 1;
	ctx.setLineDash([4, 4]);
	ctx.beginPath();
	ctx.moveTo(PADDING.left, y20);
	ctx.lineTo(w - PADDING.right, y20);
	ctx.stroke();
	ctx.setLineDash([]);

	// Y轴标签
	ctx.fillStyle = AXIS_COLOR;
	ctx.font = "10px sans-serif";
	ctx.textAlign = "right";
	for (let i = 0; i <= 4; i++) {
		const val = Math.round(100 - i * 25);
		const y = PADDING.top + (plotH / 4) * i;
		ctx.fillText(`${val}%`, PADDING.left - 4, y + 3);
	}

	// X轴标签
	ctx.textAlign = "center";
	const tickCount = Math.min(6, Math.floor(timeRange / 60) + 1);
	for (let i = 0; i <= tickCount; i++) {
		const t = timeMin + (timeRange / tickCount) * i;
		const x = xScale(t);
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		ctx.fillText(`${m}:${String(s).padStart(2, "0")}`, x, h - 6);
	}

	ctx.fillStyle = "#64748B";
	ctx.font = "9px sans-serif";
	ctx.textAlign = "left";
	ctx.fillText("SOC", 4, PADDING.top - 4);
}

function drawAll() {
	drawPowerChart();
	drawSocChart();
	rafId = requestAnimationFrame(drawAll);
}

function handleResize() {
	if (powerCanvas.value && powerChartRef.value) {
		resizeCanvas(powerCanvas.value, powerChartRef.value);
	}
	if (socCanvas.value && socChartRef.value) {
		resizeCanvas(socCanvas.value, socChartRef.value);
	}
}

onMounted(() => {
	handleResize();
	rafId = requestAnimationFrame(drawAll);

	resizeObserver = new ResizeObserver(() => {
		handleResize();
	});
	if (powerChartRef.value) resizeObserver.observe(powerChartRef.value);
	if (socChartRef.value) resizeObserver.observe(socChartRef.value);
});

onUnmounted(() => {
	if (rafId !== null) cancelAnimationFrame(rafId);
	if (resizeObserver) resizeObserver.disconnect();
});
</script>

<style lang="scss" scoped>
.charts-panel {
	background: rgba(17, 24, 39, 0.8);
	border: 1px solid rgba(0, 229, 160, 0.1);
	border-radius: 8px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.section-title {
	font-size: 14px;
	font-weight: 600;
	color: #94a3b8;
	margin: 0;
}

.chart-block {
	flex: 1;
}

.chart-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 6px;
}

.chart-title {
	font-size: 12px;
	color: #94a3b8;
}

.chart-legend {
	display: flex;
	gap: 10px;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 10px;
	color: #64748b;
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}
}

.chart-container {
	width: 100%;
	height: 180px;
	border-radius: 4px;
	overflow: hidden;

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
}
</style>
