/**
 * 组件注册中心
 * 所有组件在此统一注册，提供：
 *   - 元数据（id、名称、分类、图标）
 *   - schema（props/style 可编辑字段声明）
 *   - renderer（node → HTML string）
 *   - defaultProps
 *   - thumbnail（SVG 占位）
 */

const registry = new Map();
const categoryOrder = [];

/**
 * 注册组件
 * @param {object} def {
 *   id, name, category, icon,
 *   defaultProps, defaultStyle, defaultChildren,
 *   schema: {
 *     props: [{ key, label, type, options?, placeholder? }],
 *     style: [{ key, label, type, options? }],
 *   },
 *   render: (node) => HTML string,
 *   thumbnail?: HTML/SVG string (组件库面板展示),
 *   canHaveChildren?: boolean,
 *   accept?: string[],  // 允许的子组件 id
 * }
 */
export function register(def) {
  if (!def.id) throw new Error('component must have id');
  if (registry.has(def.id)) console.warn('[registry] override', def.id);
  registry.set(def.id, def);
  if (def.category && !categoryOrder.includes(def.category)) {
    categoryOrder.push(def.category);
  }
  return def;
}

export function get(id) {
  return registry.get(id);
}

export function all() {
  return Array.from(registry.values());
}

export function byCategory() {
  const groups = new Map();
  for (const def of registry.values()) {
    const cat = def.category || '其他';
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(def);
  }
  // 按注册顺序返回分类
  const result = [];
  for (const cat of categoryOrder) {
    if (groups.has(cat)) result.push({ category: cat, items: groups.get(cat) });
  }
  return result;
}

/**
 * 将节点渲染为 HTML
 * 递归处理 children
 */
export function renderNode(node) {
  if (!node) return '';
  const def = registry.get(node.type);
  if (!def) {
    return `<div class="unknown-node" data-node-id="${node.id}" style="border:1px dashed red;padding:4px;">未注册: ${node.type}</div>`;
  }
  // 渲染子节点 HTML
  const childrenHtml = (node.children || []).map(renderNode).join('');
  // 调用组件 renderer
  return def.render({ ...node, childrenHtml });
}

/* ============ 工具：通用样式 style 转 css string ============ */
export function styleObjToCss(style) {
  if (!style) return '';
  return Object.entries(style).map(([k, v]) => {
    const key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `${key}:${v}`;
  }).filter(Boolean).join(';');
}

/**
 * 生成节点的 data-node-id + class 属性（**不包含 style**，避免与组件内联 style 冲突）
 * @param {object} node
 * @param {string} baseClass 组件自身 class
 * @param {string} extraStyle 组件内联样式字符串
 */
export function nodeAttrs(node, baseClass = '', extraStyle = '') {
  const effects = (node.effects || []).map(e => `fx-${e}`).join(' ');
  const cls = [baseClass, effects].filter(Boolean).join(' ');
  const userStyle = styleObjToCss(node.style);
  // 合并用户 style + 组件内联 style，用户 style 优先（后写）
  const merged = [extraStyle, userStyle].filter(Boolean).join(';');
  const styleAttr = merged ? ` style="${merged.replace(/"/g, '&quot;')}"` : '';
  const classAttr = cls ? ` class="${cls}"` : '';
  return `data-node-id="${node.id}"${classAttr}${styleAttr}`;
}
