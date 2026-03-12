<template>
	<div class="result-summary">
		<h3 class="section-title">📊 模拟结果分析</h3>

		<div class="result-grid">
			<!-- 左侧：降级事件时间线 -->
			<div class="timeline-area">
				<h4 class="area-title">降级事件时间线</h4>
				<div v-if="store.degradeEvents.length === 0" class="no-events">
					<span class="ok-icon">✅</span>
					<span>全程未发生闪充降级</span>
				</div>
				<div v-else class="timeline">
					<div
						v-for="(evt, idx) in store.degradeEvents"
						:key="idx"
						class="timeline-item"
					>
						<div class="timeline-dot"></div>
						<div
							v-if="idx < store.degradeEvents.length - 1"
							class="timeline-line"
						></div>
						<div class="timeline-content">
							<span class="event-time">{{ formatTime(evt.time) }}</span>
							<span class="event-desc">{{ evt.description }}</span>
							<span class="event-detail">
								储能 SOC {{ Math.round(evt.storageSoc * 100) }}% · 需求
								{{ evt.demandPower }}kW → 实际 {{ evt.actualPower }}kW
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧：统计表格 -->
			<div class="stats-area">
				<h4 class="area-title">车辆充电统计</h4>
				<div class="stats-table-wrapper">
					<table class="stats-table">
						<thead>
							<tr>
								<th>车辆</th>
								<th>车型</th>
								<th>初始SOC</th>
								<th>最终SOC</th>
								<th>耗时</th>
								<th>充电量</th>
								<th>状态</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="s in store.vehicleStats"
								:key="s.id"
								:class="{ 'row-degraded': s.degraded }"
							>
								<td class="cell-id">#{{ s.id }}</td>
								<td>{{ s.modelLabel }}</td>
								<td>{{ Math.round(s.initialSoc * 100) }}%</td>
								<td>{{ Math.round(s.finalSoc * 100) }}%</td>
								<td>{{ formatDuration(s.chargeTime) }}</td>
								<td>{{ s.energyCharged }} kWh</td>
								<td>
									<span v-if="s.degraded" class="status-tag degraded"
										>⚠ 降级</span
									>
									<span v-else class="status-tag normal">✓ 正常</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- 结论 -->
		<div v-if="store.conclusionText" class="conclusion">
			<span class="conclusion-icon">💡</span>
			<span class="conclusion-text">{{ store.conclusionText }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useChargingSimStore } from "@/stores/chargingSim";

const store = useChargingSimStore();

function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDuration(seconds: number): string {
	if (seconds <= 0) return "-";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	if (m > 0) return `${m}分${s}秒`;
	return `${s}秒`;
}
</script>

<style lang="scss" scoped>
.result-summary {
	background: rgba(17, 24, 39, 0.8);
	border: 1px solid rgba(0, 229, 160, 0.1);
	border-radius: 8px;
	padding: 16px;
}

.section-title {
	font-size: 14px;
	font-weight: 600;
	color: #94a3b8;
	margin: 0 0 12px;
}

.result-grid {
	display: grid;
	grid-template-columns: 300px 1fr;
	gap: 16px;
}

@media (max-width: 900px) {
	.result-grid {
		grid-template-columns: 1fr;
	}
}

.area-title {
	font-size: 12px;
	color: #64748b;
	margin: 0 0 10px;
}

/* 时间线 */
.timeline-area {
	max-height: 300px;
	overflow-y: auto;
}

.no-events {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: #22c55e;
	padding: 20px 0;
}

.ok-icon {
	font-size: 20px;
}

.timeline {
	position: relative;
	padding-left: 16px;
}

.timeline-item {
	position: relative;
	padding-bottom: 16px;
	padding-left: 16px;
}

.timeline-dot {
	position: absolute;
	left: -8px;
	top: 4px;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #ef4444;
	box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

.timeline-line {
	position: absolute;
	left: -4px;
	top: 14px;
	bottom: 0;
	width: 2px;
	background: rgba(239, 68, 68, 0.2);
}

.timeline-content {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.event-time {
	font-size: 12px;
	font-weight: 700;
	color: #ef4444;
}

.event-desc {
	font-size: 11px;
	color: #f1f5f9;
}

.event-detail {
	font-size: 10px;
	color: #64748b;
}

/* 统计表格 */
.stats-area {
	overflow-x: auto;
}

.stats-table-wrapper {
	max-height: 300px;
	overflow-y: auto;
}

.stats-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 12px;

	th {
		padding: 6px 10px;
		text-align: left;
		color: #64748b;
		border-bottom: 1px solid rgba(100, 116, 139, 0.2);
		font-weight: 600;
		white-space: nowrap;
		position: sticky;
		top: 0;
		background: rgba(17, 24, 39, 0.95);
	}

	td {
		padding: 6px 10px;
		color: #94a3b8;
		border-bottom: 1px solid rgba(100, 116, 139, 0.08);
		white-space: nowrap;
	}

	.row-degraded td {
		color: #f1f5f9;
		background: rgba(239, 68, 68, 0.05);
	}
}

.cell-id {
	font-weight: 700;
	color: #f1f5f9 !important;
}

.status-tag {
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 3px;
	&.normal {
		color: #22c55e;
		background: rgba(34, 197, 94, 0.12);
	}
	&.degraded {
		color: #ef4444;
		background: rgba(239, 68, 68, 0.12);
	}
}

/* 结论 */
.conclusion {
	margin-top: 14px;
	padding: 12px 16px;
	background: linear-gradient(
		135deg,
		rgba(0, 229, 160, 0.06),
		rgba(0, 184, 212, 0.06)
	);
	border: 1px solid rgba(0, 229, 160, 0.15);
	border-radius: 8px;
	display: flex;
	align-items: flex-start;
	gap: 8px;
}

.conclusion-icon {
	font-size: 18px;
	flex-shrink: 0;
}

.conclusion-text {
	font-size: 13px;
	color: #f1f5f9;
	line-height: 1.6;
}
</style>
