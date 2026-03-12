<template>
	<div class="config-panel" :class="{ collapsed }">
		<div class="panel-header" @click="$emit('toggle')">
			<span class="panel-title">⚙ 参数配置</span>
			<span class="toggle-icon">{{ collapsed ? "▼" : "▲" }}</span>
		</div>
		<div v-show="!collapsed" class="panel-body">
			<div class="config-grid">
				<!-- 左栏：闪充站配置 -->
				<div class="config-section">
					<h3 class="section-title">闪充站配置</h3>
					<div class="form-row">
						<label>储能柜数量</label>
						<div class="input-group">
							<button
								v-for="n in [1, 2, 3, 4]"
								:key="n"
								class="option-btn"
								:class="{ active: localStation.storageCount === n }"
								@click="localStation.storageCount = n"
							>
								{{ n }} 台
							</button>
						</div>
					</div>
					<div class="form-row">
						<label
							>单柜容量
							<span class="val-badge"
								>{{ localStation.storageCapacityPerUnit }} kWh</span
							></label
						>
						<input
							v-model.number="localStation.storageCapacityPerUnit"
							type="range"
							min="100"
							max="300"
							step="10"
							class="slider"
						/>
						<div class="range-hint">
							<span>100</span>
							<span>总计 {{ totalStorageCap }} kWh</span>
							<span>300</span>
						</div>
					</div>
					<div class="form-row">
						<label
							>电网输入功率
							<span class="val-badge"
								>{{ localStation.gridPower }} kW</span
							></label
						>
						<input
							v-model.number="localStation.gridPower"
							type="range"
							min="100"
							max="800"
							step="20"
							class="slider"
						/>
						<div class="range-hint">
							<span>100 kW</span>
							<span>800 kW</span>
						</div>
					</div>
					<div class="form-row">
						<label
							>单柜最大放电功率
							<span class="val-badge"
								>{{ localStation.maxDischargePowerPerUnit }} kW</span
							></label
						>
						<input
							v-model.number="localStation.maxDischargePowerPerUnit"
							type="range"
							min="200"
							max="1000"
							step="50"
							class="slider"
						/>
						<div class="range-hint">
							<span>200 kW</span>
							<span>1000 kW</span>
						</div>
					</div>
					<div class="form-row">
						<label>充电枪数量</label>
						<div class="input-group">
							<button
								v-for="n in [1, 2]"
								:key="n"
								class="option-btn"
								:class="{ active: localStation.gunCount === n }"
								@click="localStation.gunCount = n"
							>
								{{ n }} 枪
							</button>
						</div>
					</div>
				</div>

				<!-- 右栏：车辆队列配置 -->
				<div class="config-section">
					<h3 class="section-title">车辆队列配置</h3>
					<div class="form-row">
						<label>车型选择</label>
						<div class="input-group car-models">
							<button
								v-for="(cfg, key) in CAR_MODEL_CONFIGS"
								:key="key"
								class="car-btn"
								:class="{ active: localQueue.carModel === key }"
								@click="localQueue.carModel = key as CarModel"
							>
								<span class="car-icon">🚗</span>
								<span class="car-name">{{ cfg.label }}</span>
								<span class="car-cap">{{ cfg.batteryCapacity }}kWh</span>
							</button>
						</div>
					</div>
					<div class="form-row">
						<label
							>排队车辆数
							<span class="val-badge"
								>{{ localQueue.vehicleCount }} 辆</span
							></label
						>
						<input
							v-model.number="localQueue.vehicleCount"
							type="range"
							min="3"
							max="20"
							step="1"
							class="slider"
						/>
						<div class="range-hint">
							<span>3 辆</span>
							<span>20 辆</span>
						</div>
					</div>
					<div class="form-row">
						<label
							>初始 SOC
							<span class="val-badge"
								>{{ Math.round(localQueue.initialSoc * 100) }}%</span
							></label
						>
						<input
							v-model.number="localQueue.initialSoc"
							type="range"
							min="0.05"
							max="0.5"
							step="0.05"
							class="slider"
						/>
						<div class="range-hint">
							<span>5%</span>
							<span>50%</span>
						</div>
					</div>
					<div class="form-row">
						<label
							>到达间隔
							<span class="val-badge"
								>{{ localQueue.arrivalInterval }} 秒</span
							></label
						>
						<input
							v-model.number="localQueue.arrivalInterval"
							type="range"
							min="0"
							max="600"
							step="10"
							class="slider"
						/>
						<div class="range-hint">
							<span>0秒(同时)</span>
							<span
								>{{
									Math.round((localQueue.arrivalInterval / 60) * 10) / 10
								}}分钟</span
							>
							<span>600秒</span>
						</div>
					</div>
				</div>
			</div>
			<div class="panel-footer">
				<button class="apply-btn" @click="applyConfig">
					✓ 应用配置并重置模拟
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useChargingSimStore } from "@/stores/chargingSim";
import {
	CAR_MODEL_CONFIGS,
	DEFAULT_STATION_CONFIG,
	DEFAULT_QUEUE_CONFIG,
} from "@/types/charging";
import type { CarModel } from "@/types/charging";

defineProps<{
	collapsed: boolean;
}>();

const emit = defineEmits<{
	toggle: [];
	apply: [];
}>();

const store = useChargingSimStore();

const localStation = reactive({ ...DEFAULT_STATION_CONFIG });
const localQueue = reactive({ ...DEFAULT_QUEUE_CONFIG });

const totalStorageCap = computed(
	() => localStation.storageCount * localStation.storageCapacityPerUnit,
);

function applyConfig() {
	Object.assign(store.stationConfig, { ...localStation });
	Object.assign(store.queueConfig, { ...localQueue });
	emit("apply");
}
</script>

<style lang="scss" scoped>
.config-panel {
	background: rgba(17, 24, 39, 0.8);
	border: 1px solid rgba(0, 229, 160, 0.12);
	border-radius: 8px;
	margin-bottom: 16px;
	overflow: hidden;
	transition: all 0.3s ease;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 16px;
	cursor: pointer;
	user-select: none;
	&:hover {
		background: rgba(0, 229, 160, 0.05);
	}
}

.panel-title {
	font-size: 14px;
	font-weight: 600;
	color: #94a3b8;
}

.toggle-icon {
	font-size: 12px;
	color: #64748b;
}

.panel-body {
	padding: 0 16px 16px;
}

.config-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;
}

@media (max-width: 900px) {
	.config-grid {
		grid-template-columns: 1fr;
	}
}

.config-section {
	.section-title {
		font-size: 13px;
		color: #00e5a0;
		margin: 0 0 12px;
		padding-bottom: 6px;
		border-bottom: 1px solid rgba(0, 229, 160, 0.1);
	}
}

.form-row {
	margin-bottom: 14px;
	label {
		display: block;
		font-size: 12px;
		color: #94a3b8;
		margin-bottom: 6px;
	}
}

.val-badge {
	display: inline-block;
	background: rgba(0, 184, 212, 0.15);
	color: #00b8d4;
	padding: 1px 6px;
	border-radius: 3px;
	font-size: 11px;
	margin-left: 4px;
}

.input-group {
	display: flex;
	gap: 6px;
}

.option-btn {
	flex: 1;
	padding: 6px 0;
	background: #1e293b;
	border: 1px solid #334155;
	color: #94a3b8;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
	transition: all 0.2s;
	&:hover {
		border-color: #00b8d4;
	}
	&.active {
		background: rgba(0, 184, 212, 0.15);
		border-color: #00b8d4;
		color: #00e5a0;
	}
}

.car-models {
	flex-wrap: wrap;
}

.car-btn {
	flex: 1;
	min-width: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
	padding: 8px 6px;
	background: #1e293b;
	border: 1px solid #334155;
	color: #94a3b8;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s;
	&:hover {
		border-color: #00b8d4;
	}
	&.active {
		background: rgba(0, 184, 212, 0.15);
		border-color: #00b8d4;
		color: #f1f5f9;
	}
	.car-icon {
		font-size: 20px;
	}
	.car-name {
		font-size: 12px;
		font-weight: 600;
	}
	.car-cap {
		font-size: 10px;
		color: #64748b;
	}
}

.slider {
	width: 100%;
	height: 4px;
	appearance: none;
	background: #1e293b;
	border-radius: 2px;
	outline: none;
	cursor: pointer;
	&::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #00e5a0;
		cursor: pointer;
		box-shadow: 0 0 6px rgba(0, 229, 160, 0.4);
	}
}

.range-hint {
	display: flex;
	justify-content: space-between;
	margin-top: 2px;
	font-size: 10px;
	color: #475569;
}

.panel-footer {
	margin-top: 12px;
	text-align: center;
}

.apply-btn {
	padding: 8px 32px;
	background: linear-gradient(135deg, #00e5a0, #00b8d4);
	color: #0a0e1a;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;
	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(0, 229, 160, 0.3);
	}
}
</style>
