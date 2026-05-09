/**
 * 左栏组件库面板：分类列表 + 搜索 + 拖拽源 + 悬停预览
 */
import { byCategory, renderNode } from '../components/registry.js';
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

  // 绑定拖拽 + 点击预览
  rootEl.querySelectorAll('.comp-tile').forEach(el => {
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('application/x-component', el.dataset.compId);
      e.dataTransfer.effectAllowed = 'copy';
      el.style.opacity = '.5';
    });
    el.addEventListener('dragend', () => { el.style.opacity = ''; });
    el.addEventListener('dblclick', () => addToSelected(el.dataset.compId));
    
    // 悬停预览
    el.addEventListener('mouseenter', (e) => {
      const comp = getComponent(el.dataset.compId);
      if (!comp) return;
      showHoverPreview(e, comp);
    });
    el.addEventListener('mouseleave', () => {
      hideHoverPreview();
    });
    
    // 单击预览到固定区域
    el.addEventListener('click', () => {
      const comp = getComponent(el.dataset.compId);
      if (!comp) return;
      const tempNode = {
        id: '__preview__',
        type: comp.id,
        props: { ...(comp.defaultProps || {}) },
        style: { ...(comp.defaultStyle || {}) },
        effects: [],
        children: [],
      };
      showPreviewInArea(tempNode, comp);
    });
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

/* ============ 悬停预览 ============ */
let hoverPreviewEl = null;
let hoverPreviewTimer = null;

function showHoverPreview(e, comp) {
  // 清除之前的隐藏定时器
  if (hoverPreviewTimer) {
    clearTimeout(hoverPreviewTimer);
    hoverPreviewTimer = null;
  }

  // 如果预览弹窗不存在，创建它
  if (!hoverPreviewEl) {
    hoverPreviewEl = document.createElement('div');
    hoverPreviewEl.id = 'hover-preview';
    hoverPreviewEl.style.cssText = `
      position: fixed;
      z-index: 10000;
      background: #fff;
      border: 1px solid var(--shell-border, #e5e7eb);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,.15);
      padding: 12px;
      min-width: 200px;
      max-width: 375px;
      max-height: 500px;
      overflow: auto;
      pointer-events: none;
    `;
    document.body.appendChild(hoverPreviewEl);
  }

  // 计算位置（在鼠标右侧）
  const x = e.clientX + 16;
  const y = e.clientY;
  
  // 确保不超出视口
  const maxX = window.innerWidth - 400;
  const maxY = window.innerHeight - 500;
  
  hoverPreviewEl.style.left = `${Math.min(x, maxX)}px`;
  hoverPreviewEl.style.top = `${Math.min(y, maxY)}px`;
  hoverPreviewEl.style.display = 'block';

  // 渲染组件预览
  const tempNode = {
    id: '__hover_preview__',
    type: comp.id,
    props: { ...(comp.defaultProps || {}) },
    style: { ...(comp.defaultStyle || {}) },
    effects: [],
    children: [],
  };
  
  const html = renderNode(tempNode);
  // 包裹在样式环境中，确保 CSS 变量生效
  hoverPreviewEl.innerHTML = `
    <div style="font-size:11px;color:var(--shell-muted,#6b7280);margin-bottom:8px;font-weight:600;">${comp.icon || ''} ${comp.name} 预览</div>
    <div style="width:375px;min-height:40px;background:var(--weui-bg-1,#f7f7f7);border-radius:8px;overflow:hidden;">
      <div style="padding:8px;">
        ${html || '<div style="color:#999;padding:16px;">暂无预览</div>'}
      </div>
    </div>
  `;
}

function hideHoverPreview() {
  // 延迟隐藏，避免鼠标移动到预览弹窗时立即消失
  hoverPreviewTimer = setTimeout(() => {
    if (hoverPreviewEl) {
      hoverPreviewEl.style.display = 'none';
    }
  }, 200);
}

/* ============ 点击预览（固定区域） ============ */
function showPreviewInArea(tempNode, comp) {
  const previewArea = document.getElementById('comp-preview-area');
  const previewName = document.getElementById('comp-preview-name');
  const previewBody = document.getElementById('comp-preview-body');
  if (!previewArea || !previewBody) return;

  // 显示预览区域
  previewArea.style.display = 'flex';
  previewName.textContent = `${comp.icon || ''} ${comp.name}`;

  // 渲染组件到预览区域，包裹在样式环境中
  const html = renderNode(tempNode);
  previewBody.innerHTML = `
    <div style="width:375px;min-height:40px;margin:0 auto;overflow-x:hidden;background:var(--weui-bg-1,#f7f7f7);border-radius:8px;">
      <div style="padding:8px;">
        ${html || '<div style="color:#999;padding:16px;">暂无预览</div>'}
      </div>
    </div>
  `;
}

