<template>
	<div class="station-view">
		<h3 class="section-title">充电站实时状态</h3>
		<div class="station-layout">
			<!-- 储能柜区域 -->
			<div class="storage-area">
				<div class="storage-label">储能柜</div>
				<div class="storage-gauge">
					<svg viewBox="0 0 120 120" class="gauge-svg">
						<!-- 背景圆环 -->
						<circle
							cx="60"
							cy="60"
							r="50"
							fill="none"
							stroke="#1E293B"
							stroke-width="10"
						/>
						<!-- SOC圆环 -->
						<circle
							cx="60"
							cy="60"
							r="50"
							fill="none"
							:stroke="socColor"
							stroke-width="10"
							stroke-linecap="round"
							:stroke-dasharray="socDash"
							stroke-dashoffset="0"
							transform="rotate(-90 60 60)"
							class="soc-ring"
						/>
					</svg>
					<div class="gauge-center">
						<span class="gauge-value" :style="{ color: socColor }">
							{{ Math.round(store.storageSoc * 100) }}%
						</span>
						<span class="gauge-unit">
							{{ Math.round(store.energyStorage.currentEnergy) }}/{{
								Math.round(store.energyStorage.totalCapacity)
							}}
							kWh
						</span>
					</div>
				</div>
				<div class="storage-power-info">
					<span
						v-if="store.energyStorage.currentPower > 0"
						class="discharge-tag"
					>
						放电 {{ Math.round(store.energyStorage.currentPower) }} kW
					</span>
					<span
						v-else-if="store.energyStorage.currentPower < 0"
						class="recharge-tag"
					>
						回充 {{ Math.round(Math.abs(store.energyStorage.currentPower)) }} kW
					</span>
					<span v-else class="idle-tag">待机</span>
				</div>
			</div>

			<!-- 充电桩区域 -->
			<div class="pile-area">
				<div class="pile-icon-wrapper">
					<div class="pile-icon" :class="{ degraded: store.isDegraded }">
						<span class="pile-emoji">⚡</span>
						<span class="pile-text">闪充桩</span>
					</div>
					<!-- 电网输入线 -->
					<div class="grid-line">
						<span class="grid-label"
							>电网 {{ Math.round(store.currentGridPower) }}kW</span
						>
						<div class="flow-dots grid-dots">
							<span
								v-for="i in 4"
								:key="i"
								class="dot"
								:style="{ animationDelay: `${i * 0.2}s` }"
							></span>
						</div>
					</div>
				</div>

				<!-- 充电枪 -->
				<div class="guns-row">
					<div
						v-for="gun in store.chargingGuns"
						:key="gun.index"
						class="gun-slot"
						:class="gun.status"
					>
						<div class="gun-header">
							<span class="gun-label">枪{{ gun.index + 1 }}</span>
							<span class="gun-status-tag" :class="gun.status">
								{{ gunStatusText(gun.status) }}
							</span>
						</div>
						<!-- 正在充电的车辆 -->
						<div v-if="gun.vehicleId > 0" class="vehicle-card charging">
							<div class="vehicle-info">
								<span class="vehicle-icon">🚗</span>
								<span class="vehicle-name"
									>#{{ gun.vehicleId }}
									{{ getVehicleLabel(gun.vehicleId) }}</span
								>
							</div>
							<div class="soc-bar-wrapper">
								<div
									class="soc-bar"
									:style="{ width: `${getVehicleSoc(gun.vehicleId) * 100}%` }"
									:class="{ 'bar-degraded': gun.status === 'degraded' }"
								></div>
							</div>
							<div class="vehicle-stats">
								<span
									>SOC
									{{ Math.round(getVehicleSoc(gun.vehicleId) * 100) }}%</span
								>
								<span>{{ Math.round(gun.currentPower) }} kW</span>
							</div>
						</div>
						<div v-else class="vehicle-card empty">
							<span class="empty-text">等待车辆</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 排队区域 -->
			<div class="queue-area">
				<div class="queue-label">
					排队等候 ({{ store.queuingVehicles.length }})
				</div>
				<div class="queue-list">
					<div
						v-for="v in displayQueue"
						:key="v.id"
						class="queue-car"
						:class="{ arrived: v.arrivalTime <= store.simTime }"
					>
						<span class="q-icon">🚗</span>
						<span class="q-id">#{{ v.id }}</span>
						<span v-if="v.arrivalTime > store.simTime" class="q-wait">
							{{ Math.ceil((v.arrivalTime - store.simTime) / 60) }}分后到
						</span>
						<span v-else class="q-wait arrived-text">已到达</span>
					</div>
					<div v-if="store.queuingVehicles.length === 0" class="queue-empty">
						无排队车辆
					</div>
				</div>
			</div>
		</div>

		<!-- 已完成车辆 -->
		<div v-if="store.completedVehicles > 0" class="done-area">
			<span class="done-label">✅ 已完成充电：</span>
			<span
				v-for="v in doneVehicles"
				:key="v.id"
				class="done-car"
				:class="{ 'was-degraded': v.degraded }"
			>
				#{{ v.id }} {{ CAR_MODEL_CONFIGS[v.model].label }}
				<small>({{ Math.round(v.energyCharged) }}kWh)</small>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useChargingSimStore } from "@/stores/chargingSim";
import { CAR_MODEL_CONFIGS } from "@/types/charging";

const store = useChargingSimStore();

const socColor = computed(() => {
	const soc = store.storageSoc;
	if (soc > 0.5) return "#22C55E";
	if (soc > 0.2) return "#F59E0B";
	return "#EF4444";
});

const circumference = Math.PI * 2 * 50; // 2πr
const socDash = computed(() => {
	const filled = store.storageSoc * circumference;
	return `${filled} ${circumference}`;
});

const displayQueue = computed(() =>
	store.vehicles.filter((v) => v.status === "queuing").slice(0, 10),
);

const doneVehicles = computed(() =>
	store.vehicles.filter((v) => v.status === "done"),
);

function gunStatusText(status: string): string {
	if (status === "idle") return "空闲";
	if (status === "charging") return "充电中";
	if (status === "degraded") return "降级中";
	return status;
}

function getVehicleSoc(vehicleId: number): number {
	const v = store.vehicles.find((v) => v.id === vehicleId);
	return v ? v.soc : 0;
}

function getVehicleLabel(vehicleId: number): string {
	const v = store.vehicles.find((v) => v.id === vehicleId);
	return v ? CAR_MODEL_CONFIGS[v.model].label : "";
}
</script>

<style lang="scss" scoped>
.station-view {
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

.station-layout {
	display: grid;
	grid-template-columns: 140px 1fr 150px;
	gap: 12px;
	align-items: start;
}

@media (max-width: 800px) {
	.station-layout {
		grid-template-columns: 1fr;
	}
}

/* 储能区 */
.storage-area {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.storage-label {
	font-size: 12px;
	color: #64748b;
	margin-bottom: 8px;
}

.storage-gauge {
	position: relative;
	width: 120px;
	height: 120px;
}

.gauge-svg {
	width: 100%;
	height: 100%;
}

.soc-ring {
	transition:
		stroke-dasharray 0.5s ease,
		stroke 0.5s ease;
}

.gauge-center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
}

.gauge-value {
	display: block;
	font-size: 22px;
	font-weight: 700;
}

.gauge-unit {
	display: block;
	font-size: 9px;
	color: #64748b;
	margin-top: 2px;
}

.storage-power-info {
	margin-top: 8px;
}

.discharge-tag {
	font-size: 11px;
	color: #f59e0b;
	background: rgba(245, 158, 11, 0.1);
	padding: 2px 8px;
	border-radius: 4px;
}

.recharge-tag {
	font-size: 11px;
	color: #22c55e;
	background: rgba(34, 197, 94, 0.1);
	padding: 2px 8px;
	border-radius: 4px;
}

.idle-tag {
	font-size: 11px;
	color: #64748b;
}

/* 充电桩区 */
.pile-area {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.pile-icon-wrapper {
	position: relative;
	margin-bottom: 12px;
}

.pile-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(
		135deg,
		rgba(0, 229, 160, 0.15),
		rgba(0, 184, 212, 0.15)
	);
	border: 2px solid rgba(0, 229, 160, 0.3);
	border-radius: 10px;
	padding: 10px 24px;
	transition: all 0.3s;
	&.degraded {
		border-color: rgba(239, 68, 68, 0.6);
		background: rgba(239, 68, 68, 0.1);
		animation: pile-pulse 1s infinite;
	}
}

.pile-emoji {
	font-size: 28px;
}
.pile-text {
	font-size: 12px;
	color: #00e5a0;
	font-weight: 600;
}

@keyframes pile-pulse {
	0%,
	100% {
		box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3);
	}
	50% {
		box-shadow: 0 0 20px 4px rgba(239, 68, 68, 0.2);
	}
}

.grid-line {
	position: absolute;
	top: -20px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	flex-direction: column;
	align-items: center;
}

.grid-label {
	font-size: 10px;
	color: #3b82f6;
	white-space: nowrap;
}

.flow-dots {
	display: flex;
	gap: 3px;
	margin-top: 2px;
}

.dot {
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: #3b82f6;
	animation: flow-down 1s infinite;
}

@keyframes flow-down {
	0% {
		opacity: 0.2;
		transform: translateY(-3px);
	}
	50% {
		opacity: 1;
		transform: translateY(0);
	}
	100% {
		opacity: 0.2;
		transform: translateY(3px);
	}
}

.guns-row {
	display: flex;
	gap: 10px;
	width: 100%;
}

.gun-slot {
	flex: 1;
	background: #0f172a;
	border: 1px solid #1e293b;
	border-radius: 8px;
	padding: 10px;
	transition: all 0.3s;
	&.charging {
		border-color: rgba(0, 229, 160, 0.3);
	}
	&.degraded {
		border-color: rgba(239, 68, 68, 0.4);
		background: rgba(239, 68, 68, 0.05);
	}
}

.gun-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.gun-label {
	font-size: 12px;
	font-weight: 600;
	color: #94a3b8;
}

.gun-status-tag {
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 3px;
	&.idle {
		color: #64748b;
		background: rgba(100, 116, 139, 0.15);
	}
	&.charging {
		color: #00e5a0;
		background: rgba(0, 229, 160, 0.12);
	}
	&.degraded {
		color: #ef4444;
		background: rgba(239, 68, 68, 0.15);
	}
}

.vehicle-card {
	min-height: 60px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	&.empty {
		align-items: center;
		justify-content: center;
	}
}

.vehicle-info {
	display: flex;
	align-items: center;
	gap: 4px;
}

.vehicle-icon {
	font-size: 14px;
}
.vehicle-name {
	font-size: 12px;
	color: #f1f5f9;
	font-weight: 500;
}

.soc-bar-wrapper {
	width: 100%;
	height: 6px;
	background: #1e293b;
	border-radius: 3px;
	overflow: hidden;
}

.soc-bar {
	height: 100%;
	background: linear-gradient(90deg, #00e5a0, #00b8d4);
	border-radius: 3px;
	transition: width 0.3s;
	&.bar-degraded {
		background: linear-gradient(90deg, #ef4444, #f59e0b);
	}
}

.vehicle-stats {
	display: flex;
	justify-content: space-between;
	font-size: 10px;
	color: #64748b;
}

.empty-text {
	font-size: 11px;
	color: #475569;
}

/* 排队区 */
.queue-area {
	.queue-label {
		font-size: 12px;
		color: #64748b;
		margin-bottom: 8px;
	}
}

.queue-list {
	display: flex;
	flex-direction: column;
	gap: 4px;
	max-height: 260px;
	overflow-y: auto;
}

.queue-car {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 4px 8px;
	background: #0f172a;
	border: 1px solid #1e293b;
	border-radius: 4px;
	font-size: 11px;
	color: #64748b;
	&.arrived {
		border-color: rgba(245, 158, 11, 0.3);
		color: #f59e0b;
	}
}

.q-icon {
	font-size: 12px;
}
.q-id {
	font-weight: 600;
}
.q-wait {
	margin-left: auto;
	font-size: 10px;
}
.arrived-text {
	color: #f59e0b;
}

.queue-empty {
	font-size: 11px;
	color: #475569;
	text-align: center;
	padding: 12px 0;
}

/* 已完成区 */
.done-area {
	margin-top: 12px;
	padding-top: 10px;
	border-top: 1px solid rgba(34, 197, 94, 0.1);
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
}

.done-label {
	font-size: 12px;
	color: #22c55e;
}

.done-car {
	font-size: 11px;
	color: #94a3b8;
	background: rgba(34, 197, 94, 0.08);
	padding: 2px 8px;
	border-radius: 4px;
	border: 1px solid rgba(34, 197, 94, 0.15);
	&.was-degraded {
		border-color: rgba(239, 68, 68, 0.2);
		background: rgba(239, 68, 68, 0.08);
	}
	small {
		color: #64748b;
	}
}
</style>
