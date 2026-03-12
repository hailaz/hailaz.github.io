/**
 * 充电曲线模型
 * 基于比亚迪第二代刀片电池真实充电参数建模
 *
 * 关键参数（来源：比亚迪官方发布会 2026.3.5）：
 * - 10%→70%: 5分钟（300秒）
 * - 10%→97%: 9分钟（540秒）
 * - 峰值充电功率: ~1000kW（10C倍率）
 * - 充电倍率: 最高10C
 * - 架构电压: 1000V
 *
 * 充电曲线特性（锂电池恒流-恒压特性）：
 * SOC 10%~30%: 快速爬升到峰值功率
 * SOC 30%~50%: 维持高功率平台
 * SOC 50%~70%: 功率开始缓慢下降
 * SOC 70%~85%: 功率大幅衰减
 * SOC 85%~97%: 涓流充电，功率很低
 */

import type { CarModel } from "@/types/charging";
import { CAR_MODEL_CONFIGS } from "@/types/charging";

/**
 * 充电功率曲线控制点 [SOC(0~1), 功率比例(0~1)]
 * 功率比例 × 车辆峰值功率 = 实际最大充电功率
 */
const CHARGE_CURVE_POINTS: [number, number][] = [
	[0.05, 0.3], // 极低SOC，预热阶段
	[0.1, 0.6], // 开始爬升
	[0.15, 0.85], // 快速爬升
	[0.2, 0.95], // 接近峰值
	[0.25, 1.0], // 峰值功率
	[0.35, 1.0], // 维持峰值平台
	[0.45, 0.95], // 开始缓慢下降
	[0.55, 0.85], // 继续下降
	[0.65, 0.7], // 加速下降
	[0.7, 0.6], // 明显下降
	[0.75, 0.45], // 大幅衰减
	[0.8, 0.35],
	[0.85, 0.25], // 进入涓流
	[0.9, 0.15],
	[0.95, 0.08],
	[0.97, 0.04], // 接近满电
	[1.0, 0.0], // 满电停充
];

/**
 * 分段线性插值
 * 在控制点之间进行线性插值，获取给定SOC下的功率比例
 */
function interpolate(soc: number): number {
	if (soc <= CHARGE_CURVE_POINTS[0][0]) return CHARGE_CURVE_POINTS[0][1];
	if (soc >= CHARGE_CURVE_POINTS[CHARGE_CURVE_POINTS.length - 1][0]) return 0;

	for (let i = 1; i < CHARGE_CURVE_POINTS.length; i++) {
		const [x0, y0] = CHARGE_CURVE_POINTS[i - 1];
		const [x1, y1] = CHARGE_CURVE_POINTS[i];
		if (soc <= x1) {
			const t = (soc - x0) / (x1 - x0);
			return y0 + t * (y1 - y0);
		}
	}
	return 0;
}

/**
 * 获取给定SOC和车型下的最大充电需求功率
 * @param soc 当前SOC (0~1)
 * @param carModel 车型
 * @returns 最大充电功率 (kW)
 */
export function getMaxChargePower(soc: number, carModel: CarModel): number {
	const config = CAR_MODEL_CONFIGS[carModel];
	const ratio = interpolate(soc);
	return config.maxChargePower * ratio;
}

/**
 * 计算给定功率下单位时间充入的能量和SOC增量
 * @param power 实际充电功率 (kW)
 * @param batteryCapacity 电池容量 (kWh)
 * @param deltaTime 时间步长 (秒)
 * @returns { energyDelta: kWh, socDelta: 0~1 }
 */
export function calcChargeIncrement(
	power: number,
	batteryCapacity: number,
	deltaTime: number,
): { energyDelta: number; socDelta: number } {
	// power (kW) × deltaTime (s) / 3600 = energy (kWh)
	const energyDelta = (power * deltaTime) / 3600;
	const socDelta = energyDelta / batteryCapacity;
	return { energyDelta, socDelta };
}
