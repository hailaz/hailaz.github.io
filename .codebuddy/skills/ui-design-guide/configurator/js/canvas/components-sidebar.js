/**
 * 左栏组件库面板：分类列表 + 搜索 + 拖拽源
 */
import { byCategory } from '../components/registry.js';
import { bus, getActivePage, state } from '../core/state.js';
import { cmdAddNode } from '../core/commands.js';
import { get as getComponent } from '../components/registry.js';
import { nid } from '../core/id.js';

let rootEl = null;
let searchQuery = '';

export function initComponentsSidebar() {
  rootEl = document.getElementById('components-sidebar');
  if (!rootEl) return;
  render();

  // 搜索
  const search = document.getElementById('comp-search');
  if (search) {
    search.addEventListener('input', e => {
      searchQuery = e.target.value.toLowerCase().trim();
      render();
    });
  }
}

function render() {
  if (!rootEl) return;
  const groups = byCategory().map(g => ({
    ...g,
    items: g.items.filter(it =>
      it.id !== 'container' &&
      (!searchQuery || (it.name.toLowerCase().includes(searchQuery) || it.id.includes(searchQuery)))
    ),
  })).filter(g => g.items.length);

  rootEl.innerHTML = groups.map(g => `
    <details open style="margin-bottom:4px;">
      <summary style="padding:6px 8px;font-size:12px;font-weight:600;color:var(--shell-muted);cursor:pointer;">${g.category} · ${g.items.length}</summary>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px;">
        ${g.items.map(it => `
          <div class="comp-tile" draggable="true" data-comp-id="${it.id}" title="${it.name}" style="padding:6px 4px;border:1px solid var(--shell-border);background:var(--shell-bg);border-radius:4px;cursor:grab;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;text-align:center;overflow:hidden;">
            <span style="font-size:18px;">${it.icon || '◻'}</span>
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;">${it.name.split(' ')[0]}</span>
          </div>
        `).join('')}
      </div>
    </details>
  `).join('');

  // 绑定拖拽
  rootEl.querySelectorAll('.comp-tile').forEach(el => {
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('application/x-component', el.dataset.compId);
      e.dataTransfer.effectAllowed = 'copy';
      el.style.opacity = '.5';
    });
    el.addEventListener('dragend', () => { el.style.opacity = ''; });
    el.addEventListener('dblclick', () => addToSelected(el.dataset.compId));
  });
}

/** 双击快速添加到当前选中节点（若可装子）或根 */
function addToSelected(compId) {
  const def = getComponent(compId); if (!def) return;
  const page = getActivePage(); if (!page) return;
  let parentId = page.root.id;
  // 若当前选中节点可装子，作为目标
  if (state.selectedNodeId) {
    const node = findInTree(page.root, state.selectedNodeId);
    if (node) {
      const cdef = getComponent(node.type);
      if (cdef?.canHaveChildren) parentId = node.id;
    }
  }
  const child = {
    id: nid(def.id.replace('mp-','')),
    type: def.id,
    props: { ...(def.defaultProps || {}) },
    style: { ...(def.defaultStyle || {}) },
    effects: [],
    children: [],
  };
  cmdAddNode(parentId, child);
}

function findInTree(root, id) {
  if (!root) return null;
  if (root.id === id) return root;
  for (const c of root.children || []) {
    const r = findInTree(c, id);
    if (r) return r;
  }
  return null;
}
