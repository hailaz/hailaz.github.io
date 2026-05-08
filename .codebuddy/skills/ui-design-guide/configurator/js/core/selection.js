/**
 * 选中态 / 悬浮态管理
 */

import { state, bus, getActivePage, findNode } from './state.js';

export function selectNode(nodeId) {
  if (state.selectedNodeId === nodeId) return;
  state.selectedNodeId = nodeId;
  bus.emit('selection:changed', nodeId);
}

export function hoverNode(nodeId) {
  if (state.hoverNodeId === nodeId) return;
  state.hoverNodeId = nodeId;
  bus.emit('hover:changed', nodeId);
}

export function clearSelection() {
  state.selectedNodeId = null;
  state.hoverNodeId = null;
  bus.emit('selection:changed', null);
}

/** 获取选中节点的 DOM 元素 */
export function getSelectedDom() {
  if (!state.selectedNodeId) return null;
  return document.querySelector(`[data-node-id="${state.selectedNodeId}"]`);
}

export function getNodeDom(nodeId) {
  if (!nodeId) return null;
  return document.querySelector(`[data-node-id="${nodeId}"]`);
}

/** 获取祖先链（从根到 node，用于面包屑） */
export function getAncestors(nodeId) {
  const page = getActivePage();
  if (!page) return [];
  const chain = [];
  function walk(node, ancestors) {
    if (node.id === nodeId) { chain.push(...ancestors, node); return true; }
    for (const c of node.children || []) {
      if (walk(c, [...ancestors, node])) return true;
    }
    return false;
  }
  walk(page.root, []);
  return chain;
}
