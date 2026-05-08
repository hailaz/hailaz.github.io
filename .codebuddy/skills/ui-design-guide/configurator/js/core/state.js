/**
 * 多页面工程 + 全局 state + 事件总线
 *
 * 数据模型：
 * project {
 *   meta: { name, version, createdAt, updatedAt, platform },
 *   tokens: {...},           // 当前主题 tokens
 *   brand: {...},            // brand-kit
 *   pages: [                 // 多页面
 *     {
 *       id, name, type: 'mp-page' | 'web-page' | 'components-gallery',
 *       root: node,          // 节点树根
 *     }
 *   ],
 *   activePageId: string,
 * }
 *
 * node {
 *   id, type: '<componentId>', props: {...}, style: {...}, effects: [], children: [node]
 * }
 */

import { nid } from './id.js';

export const state = {
  project: null,               // Project（见上）
  activePageId: null,
  selectedNodeId: null,        // 当前选中节点
  hoverNodeId: null,
  clipboard: null,             // 剪贴板节点

  // 预览
  preview: {
    device: 'miniprogram',     // miniprogram | desktop
    themeMode: 'light',
    componentState: 'default', // default / hover / loading / disabled / skeleton
  },

  // 编辑器模式
  editor: {
    mode: 'edit',              // edit | preview（预览模式下隐藏选中框/手柄）
    showTree: true,
    showProps: true,
    zoom: 1,
  },

  // Vibe（加载后填充）
  vibeTags: null,
  lockedColorSet: new Set(),
};

/* ============ 事件总线 ============ */
const handlers = new Map();
export const bus = {
  on(event, fn) {
    if (!handlers.has(event)) handlers.set(event, new Set());
    handlers.get(event).add(fn);
    return () => handlers.get(event)?.delete(fn);
  },
  emit(event, payload) {
    handlers.get(event)?.forEach(fn => { try { fn(payload); } catch (e) { console.error(event, e); } });
  },
  off(event, fn) { handlers.get(event)?.delete(fn); },
};

/* ============ Project 构造 ============ */
export function createEmptyProject() {
  const homeId = nid('page');
  return {
    meta: {
      name: 'untitled',
      version: '1.0.0',
      platform: 'wechat-miniprogram',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    tokens: null,
    brand: defaultBrand(),
    pages: [
      {
        id: homeId,
        name: '首页',
        type: 'mp-page',
        root: {
          id: nid('root'),
          type: 'container',
          props: {},
          style: {},
          effects: [],
          children: [],
        },
      },
    ],
    activePageId: homeId,
  };
}

export function defaultBrand() {
  return {
    brandName: 'Acme',
    logoSvg: '',
    tone: 'friendly',
    lockedColors: [],
    voiceSamples: { buttonCta: ['立即开始'], errorMessage: [], emptyState: [], placeholder: [], successToast: [] },
    iconStyle: 'outline',
  };
}

/* ============ Node 辅助 ============ */
export function findNode(root, id) {
  if (!root) return null;
  if (root.id === id) return root;
  for (const c of root.children || []) {
    const r = findNode(c, id);
    if (r) return r;
  }
  return null;
}

export function findParent(root, id) {
  if (!root?.children) return null;
  for (const c of root.children) {
    if (c.id === id) return root;
    const r = findParent(c, id);
    if (r) return r;
  }
  return null;
}

export function getActivePage() {
  const p = state.project;
  if (!p) return null;
  return p.pages.find(x => x.id === p.activePageId) || p.pages[0];
}

export function getSelectedNode() {
  const page = getActivePage();
  if (!page) return null;
  return state.selectedNodeId ? findNode(page.root, state.selectedNodeId) : null;
}

/* ============ 路径辅助 ============ */
export function getAt(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}
export function setAt(obj, path, val) {
  const ks = path.split('.');
  let cur = obj;
  for (let i = 0; i < ks.length - 1; i++) {
    if (cur[ks[i]] == null || typeof cur[ks[i]] !== 'object') cur[ks[i]] = {};
    cur = cur[ks[i]];
  }
  cur[ks[ks.length - 1]] = val;
}

/* ============ 状态提示 ============ */
export function setStatus(msg, kind) {
  const v = document.getElementById('validation');
  if (v) { v.textContent = msg; v.className = `validation ${kind || ''}`; }
  bus.emit('status', { msg, kind });
}

/* ============ 深拷贝（节点） ============ */
export function deepClone(x) {
  if (x == null || typeof x !== 'object') return x;
  if (Array.isArray(x)) return x.map(deepClone);
  const o = {};
  for (const [k, v] of Object.entries(x)) o[k] = deepClone(v);
  // 节点克隆需要换新 ID
  if (o.id && typeof o.id === 'string' && o.id.includes('_')) {
    o.id = nid(o.id.split('_')[0]);
  }
  return o;
}
