/**
 * 可撤销命令定义（所有通过 execute() 执行）
 */

import { state, findNode, findParent, getActivePage, deepClone, bus } from './state.js';
import { execute } from './history.js';
import { nid } from './id.js';

/* ===== 节点增删改 ===== */

export function cmdAddNode(parentId, childNode, index = -1) {
  const page = getActivePage(); if (!page) return;
  execute({
    label: `添加 ${childNode.type}`,
    _ran: false,
    do() {
      const parent = findNode(page.root, parentId);
      if (!parent) return;
      if (!parent.children) parent.children = [];
      if (index < 0 || index >= parent.children.length) parent.children.push(childNode);
      else parent.children.splice(index, 0, childNode);
      state.selectedNodeId = childNode.id;
      bus.emit('selection:changed');
    },
    undo() {
      const parent = findNode(page.root, parentId);
      if (!parent?.children) return;
      parent.children = parent.children.filter(c => c.id !== childNode.id);
      if (state.selectedNodeId === childNode.id) state.selectedNodeId = null;
      bus.emit('selection:changed');
    },
  });
}

export function cmdRemoveNode(nodeId) {
  const page = getActivePage(); if (!page) return;
  const node = findNode(page.root, nodeId);
  const parent = findParent(page.root, nodeId);
  if (!node || !parent) return;
  const index = parent.children.indexOf(node);
  execute({
    label: `删除 ${node.type}`,
    do() {
      parent.children.splice(index, 1);
      if (state.selectedNodeId === nodeId) state.selectedNodeId = null;
      bus.emit('selection:changed');
    },
    undo() {
      parent.children.splice(index, 0, node);
      state.selectedNodeId = nodeId;
      bus.emit('selection:changed');
    },
  });
}

export function cmdUpdateNodeProp(nodeId, key, value) {
  const page = getActivePage(); if (!page) return;
  const node = findNode(page.root, nodeId);
  if (!node) return;
  const oldVal = node.props?.[key];
  execute({
    label: `修改 ${key}`,
    do() { if (!node.props) node.props = {}; node.props[key] = value; },
    undo() { if (!node.props) node.props = {}; node.props[key] = oldVal; },
  });
}

export function cmdUpdateNodeStyle(nodeId, key, value) {
  const page = getActivePage(); if (!page) return;
  const node = findNode(page.root, nodeId);
  if (!node) return;
  const oldVal = node.style?.[key];
  execute({
    label: `样式 ${key}`,
    do() { if (!node.style) node.style = {}; node.style[key] = value; },
    undo() { if (!node.style) node.style = {}; node.style[key] = oldVal; },
  });
}

export function cmdToggleEffect(nodeId, effectId) {
  const page = getActivePage(); if (!page) return;
  const node = findNode(page.root, nodeId);
  if (!node) return;
  if (!node.effects) node.effects = [];
  const has = node.effects.includes(effectId);
  execute({
    label: has ? `移除效果 ${effectId}` : `添加效果 ${effectId}`,
    do() {
      if (has) node.effects = node.effects.filter(e => e !== effectId);
      else node.effects = [...node.effects, effectId];
    },
    undo() {
      if (has) node.effects = [...node.effects, effectId];
      else node.effects = node.effects.filter(e => e !== effectId);
    },
  });
}

export function cmdMoveNode(nodeId, newParentId, newIndex) {
  const page = getActivePage(); if (!page) return;
  const node = findNode(page.root, nodeId);
  const oldParent = findParent(page.root, nodeId);
  const newParent = findNode(page.root, newParentId);
  if (!node || !oldParent || !newParent) return;
  const oldIndex = oldParent.children.indexOf(node);
  execute({
    label: `移动 ${node.type}`,
    do() {
      oldParent.children.splice(oldIndex, 1);
      if (!newParent.children) newParent.children = [];
      if (newIndex < 0 || newIndex >= newParent.children.length) newParent.children.push(node);
      else newParent.children.splice(newIndex, 0, node);
    },
    undo() {
      if (!newParent.children) newParent.children = [];
      newParent.children = newParent.children.filter(c => c.id !== nodeId);
      oldParent.children.splice(oldIndex, 0, node);
    },
  });
}

export function cmdDuplicateNode(nodeId) {
  const page = getActivePage(); if (!page) return;
  const node = findNode(page.root, nodeId);
  const parent = findParent(page.root, nodeId);
  if (!node || !parent) return;
  const cloned = deepClone(node);
  // deepClone 已重设所有 id
  const index = parent.children.indexOf(node);
  execute({
    label: `复制 ${node.type}`,
    do() {
      parent.children.splice(index + 1, 0, cloned);
      state.selectedNodeId = cloned.id;
      bus.emit('selection:changed');
    },
    undo() {
      parent.children = parent.children.filter(c => c.id !== cloned.id);
      state.selectedNodeId = node.id;
      bus.emit('selection:changed');
    },
  });
}

/* ===== 页面级 ===== */

export function cmdAddPage(type = 'mp-page', name) {
  const project = state.project; if (!project) return;
  const id = nid('page');
  const pageName = name || `页面 ${project.pages.length + 1}`;
  const page = {
    id, name: pageName, type,
    root: { id: nid('root'), type: 'container', props: {}, style: {}, effects: [], children: [] },
  };
  const oldActive = project.activePageId;
  execute({
    label: `新建页面 ${pageName}`,
    do() {
      project.pages.push(page);
      project.activePageId = id;
      bus.emit('page:changed');
    },
    undo() {
      project.pages = project.pages.filter(p => p.id !== id);
      project.activePageId = oldActive;
      bus.emit('page:changed');
    },
  });
  return id;
}

export function cmdRemovePage(pageId) {
  const project = state.project; if (!project || project.pages.length <= 1) return;
  const idx = project.pages.findIndex(p => p.id === pageId);
  if (idx < 0) return;
  const page = project.pages[idx];
  const wasActive = project.activePageId === pageId;
  const nextActive = wasActive ? (project.pages[idx - 1] || project.pages[idx + 1]).id : project.activePageId;
  const oldActive = project.activePageId;
  execute({
    label: `删除页面 ${page.name}`,
    do() {
      project.pages.splice(idx, 1);
      if (wasActive) project.activePageId = nextActive;
      bus.emit('page:changed');
    },
    undo() {
      project.pages.splice(idx, 0, page);
      project.activePageId = oldActive;
      bus.emit('page:changed');
    },
  });
}

export function cmdRenamePage(pageId, newName) {
  const project = state.project; if (!project) return;
  const page = project.pages.find(p => p.id === pageId);
  if (!page) return;
  const oldName = page.name;
  execute({
    label: `重命名 ${oldName} → ${newName}`,
    do() { page.name = newName; bus.emit('page:changed'); },
    undo() { page.name = oldName; bus.emit('page:changed'); },
  });
}

export function cmdDuplicatePage(pageId) {
  const project = state.project; if (!project) return;
  const page = project.pages.find(p => p.id === pageId);
  if (!page) return;
  const cloned = deepClone(page);
  cloned.name = page.name + ' 副本';
  execute({
    label: `复制页面 ${page.name}`,
    do() {
      project.pages.push(cloned);
      project.activePageId = cloned.id;
      bus.emit('page:changed');
    },
    undo() {
      project.pages = project.pages.filter(p => p.id !== cloned.id);
      project.activePageId = pageId;
      bus.emit('page:changed');
    },
  });
}
