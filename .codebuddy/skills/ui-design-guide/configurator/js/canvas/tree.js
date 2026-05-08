/**
 * 节点树（左栏 2）· 支持 rAF 合并渲染 + 大型树虚拟滚动
 */
import { state, bus, getActivePage } from '../core/state.js';
import { get as getComponent } from '../components/registry.js';
import { selectNode } from '../core/selection.js';
import { cmdRemoveNode, cmdDuplicateNode } from '../core/commands.js';

let rootEl = null;
let _raf = null;

export function initTree() {
  rootEl = document.getElementById('node-tree');
  if (!rootEl) return;
  bus.on('project:changed',   render);
  bus.on('page:changed',      render);
  bus.on('selection:changed', render);
  render();
}

function render() {
  if (_raf) return;
  _raf = requestAnimationFrame(() => { _raf = null; _renderImmediate(); });
}

function _renderImmediate() {
  if (!rootEl) return;
  const page = getActivePage();
  if (!page) { rootEl.innerHTML = ''; return; }

  // 扁平化遍历节点 - 便于未来虚拟滚动
  const flat = [];
  (function walk(n, depth) {
    flat.push({ node: n, depth });
    (n.children || []).forEach(c => walk(c, depth + 1));
  })(page.root, 0);

  // 小规模：直接全量渲染
  // 大规模（>200 项）：简化虚拟滚动（每次只渲染可视区 + 预渲染 20 项）
  if (flat.length <= 200) {
    rootEl.innerHTML = flat.map(({ node, depth }) => nodeRowHtml(node, depth)).join('');
  } else {
    renderVirtual(flat);
  }
  bindEvents();
}

function renderVirtual(flat) {
  const ROW_H = 26;
  const total = flat.length;
  const spacerTop = document.createElement('div');
  const spacerBottom = document.createElement('div');
  const viewport = document.createElement('div');
  viewport.style.position = 'relative';

  rootEl.innerHTML = '';
  rootEl.style.overflow = 'auto';
  rootEl.appendChild(spacerTop);
  rootEl.appendChild(viewport);
  rootEl.appendChild(spacerBottom);

  function paint() {
    const scrollTop = rootEl.scrollTop;
    const h = rootEl.clientHeight;
    const startIdx = Math.max(0, Math.floor(scrollTop / ROW_H) - 10);
    const endIdx   = Math.min(total, Math.ceil((scrollTop + h) / ROW_H) + 10);
    spacerTop.style.height    = `${startIdx * ROW_H}px`;
    spacerBottom.style.height = `${(total - endIdx) * ROW_H}px`;
    viewport.innerHTML = flat.slice(startIdx, endIdx)
      .map(({ node, depth }) => nodeRowHtml(node, depth))
      .join('');
    bindEvents();
  }
  paint();
  rootEl.onscroll = () => requestAnimationFrame(paint);
}

function nodeRowHtml(node, depth) {
  const comp = getComponent(node.type);
  const selected = state.selectedNodeId === node.id;
  const pad = depth * 12;
  return `<div class="tree-item ${selected ? 'selected' : ''}" data-tree-node="${node.id}" style="padding:4px 6px 4px ${pad+6}px;display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;border-radius:4px;${selected?'background:var(--shell-accent);color:#fff;':''}">
  <span style="width:16px;text-align:center;">${comp?.icon || '•'}</span>
  <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${comp?.name || node.type}</span>
  ${node.type !== 'container' ? `<span data-tree-action="dup" data-tree-target="${node.id}" title="复制" style="opacity:.6;">⎘</span>` : ''}
  ${node.type !== 'container' && depth > 0 ? `<span data-tree-action="delete" data-tree-target="${node.id}" title="删除" style="opacity:.6;">×</span>` : ''}
</div>`;
}

function bindEvents() {
  rootEl.querySelectorAll('[data-tree-node]').forEach(el => {
    el.onclick = e => {
      e.stopPropagation();
      selectNode(el.dataset.treeNode);
    };
  });
  rootEl.querySelectorAll('[data-tree-action]').forEach(el => {
    el.onclick = e => {
      e.stopPropagation();
      const action = el.dataset.treeAction;
      const id = el.dataset.treeTarget;
      if (action === 'delete') cmdRemoveNode(id);
      if (action === 'dup')    cmdDuplicateNode(id);
    };
  });
}
