/**
 * 效果库注册中心
 * 效果 = 一段可叠加到节点上的 CSS 类（fx-<id>）和对应 @keyframes
 */

const effects = new Map();
const catOrder = [];

export function register(def) {
  if (!def.id) throw new Error('effect must have id');
  effects.set(def.id, def);
  if (def.category && !catOrder.includes(def.category)) catOrder.push(def.category);
}

export function get(id) { return effects.get(id); }
export function all()   { return Array.from(effects.values()); }
export function byCategory() {
  const g = new Map();
  for (const e of effects.values()) {
    if (!g.has(e.category)) g.set(e.category, []);
    g.get(e.category).push(e);
  }
  return catOrder.map(c => ({ category: c, items: g.get(c) || [] }));
}

/** 生成所有效果的全局 CSS 字符串，注入 <head> */
export function buildEffectsCss() {
  return all().map(e => e.css || '').join('\n\n');
}
