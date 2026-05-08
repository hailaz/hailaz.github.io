/**
 * 画布渲染 + 选中交互
 */
import { state, getActivePage, bus, findNode, findParent } from '../core/state.js';
import { selectNode, clearSelection } from '../core/selection.js';
import { renderNode } from '../components/registry.js';
import { cmdAddNode } from '../core/commands.js';
import { get as getComponent } from '../components/registry.js';
import { nid } from '../core/id.js';

let canvasRoot = null;   // #mp-content
let overlay = null;      // 选中框/悬浮框

export function initCanvas() {
  canvasRoot = document.getElementById('mp-content');
  overlay    = document.getElementById('canvas-overlay');
  if (!canvasRoot) return;

  canvasRoot.addEventListener('click', onCanvasClick, true);
  canvasRoot.addEventListener('mouseover', onCanvasHover);
  canvasRoot.addEventListener('mouseleave', () => clearHover());

  // 拖拽投放
  canvasRoot.addEventListener('dragover', onDragOver);
  canvasRoot.addEventListener('drop',     onDrop);

  // 订阅状态变化重新渲染
  bus.on('project:changed',   renderCanvas);
  bus.on('page:changed',      () => { clearSelection(); renderCanvas(); });
  bus.on('selection:changed', updateOverlay);
  bus.on('hover:changed',     updateOverlay);
  window.addEventListener('resize', updateOverlay);
  canvasRoot.addEventListener('scroll', updateOverlay, true);

  renderCanvas();
}

export function renderCanvas() {
  if (_renderRaf) return;
  _renderRaf = requestAnimationFrame(() => {
    _renderRaf = null;
    _renderImmediate();
  });
}

let _renderRaf = null;
function _renderImmediate() {
  if (!canvasRoot) return;
  const page = getActivePage();
  if (!page) { canvasRoot.innerHTML = ''; return; }
  const isEmpty = !page.root?.children || page.root.children.length === 0;
  if (isEmpty) {
    canvasRoot.innerHTML = emptyGuideHtml(page);
    bindEmptyGuide();
  } else {
    canvasRoot.innerHTML = renderNode(page.root);
  }
  // 为所有节点加 ARIA 选中态
  canvasRoot.setAttribute('role', 'application');
  canvasRoot.setAttribute('aria-label', '页面画布（可点选组件）');
  canvasRoot.querySelectorAll('[data-node-id]').forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-selected', el.dataset.nodeId === state.selectedNodeId ? 'true' : 'false');
  });
  updateOverlay();
}

function emptyGuideHtml(page) {
  return `
    <div class="empty-guide" data-node-id="${page.root.id}">
      <div class="empty-guide-inner">
        <div class="empty-guide-icon">🎨</div>
        <h3 class="empty-guide-title">空白画布</h3>
        <p class="empty-guide-hint">从左侧<b>组件库</b>拖拽组件到这里，或选一个页面模板快速开始</p>
        <div class="empty-guide-templates">
          <button data-tpl="home">🏠 小程序首页</button>
          <button data-tpl="list">📋 列表页</button>
          <button data-tpl="detail">📄 详情页</button>
          <button data-tpl="form">📝 表单页</button>
          <button data-tpl="mine">👤 个人中心</button>
        </div>
        <div class="empty-guide-tip">
          💡 快捷键：<kbd>Ctrl</kbd>+<kbd>Z</kbd> 撤销 · <kbd>Ctrl</kbd>+<kbd>Y</kbd> 重做 · <kbd>Delete</kbd> 删除 · <kbd>Ctrl</kbd>+<kbd>D</kbd> 复制
        </div>
      </div>
    </div>
  `;
}

async function bindEmptyGuide() {
  const tpls = canvasRoot.querySelectorAll('[data-tpl]');
  if (!tpls.length) return;
  const mod = await import('../project/page-templates.js');
  tpls.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tplId = btn.dataset.tpl;
      const page = getActivePage();
      if (page && typeof mod.applyTemplate === 'function') {
        mod.applyTemplate(page.id, tplId);
      }
    });
  });
}

function onCanvasClick(e) {
  const node = e.target.closest('[data-node-id]');
  e.preventDefault();
  e.stopPropagation();
  if (!node) { clearSelection(); return; }
  selectNode(node.dataset.nodeId);
}

let hoverEl = null;
function onCanvasHover(e) {
  const node = e.target.closest('[data-node-id]');
  if (node !== hoverEl) {
    hoverEl = node;
    state.hoverNodeId = node ? node.dataset.nodeId : null;
    bus.emit('hover:changed');
  }
}
function clearHover() {
  state.hoverNodeId = null;
  bus.emit('hover:changed');
}

/* ============ Overlay（选中框 + 悬浮框 + 8 手柄） ============ */
function updateOverlay() {
  if (!overlay || !canvasRoot) return;
  overlay.innerHTML = '';
  if (state.hoverNodeId && state.hoverNodeId !== state.selectedNodeId) {
    drawBox(state.hoverNodeId, 'hover');
  }
  if (state.selectedNodeId) {
    drawBox(state.selectedNodeId, 'selected');
    drawHandles(state.selectedNodeId);
  }
}

function drawBox(nodeId, kind) {
  const el = canvasRoot.querySelector(`[data-node-id="${nodeId}"]`);
  if (!el) return;
  const containerRect = canvasRoot.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  const box = document.createElement('div');
  box.className = `canvas-box canvas-box-${kind}`;
  Object.assign(box.style, {
    position: 'absolute',
    left: `${rect.left - containerRect.left + canvasRoot.scrollLeft}px`,
    top:  `${rect.top  - containerRect.top  + canvasRoot.scrollTop}px`,
    width:  `${rect.width}px`,
    height: `${rect.height}px`,
    pointerEvents: 'none',
    border: kind === 'selected' ? '2px solid var(--shell-accent)' : '1px dashed rgba(7,193,96,.6)',
    borderRadius: '2px',
    zIndex: '10',
  });
  // label
  if (kind === 'selected') {
    const label = document.createElement('span');
    label.textContent = getNodeLabel(nodeId);
    Object.assign(label.style, {
      position: 'absolute',
      top: '-20px',
      left: '0',
      background: 'var(--shell-accent)',
      color: '#fff',
      fontSize: '11px',
      padding: '2px 6px',
      borderRadius: '3px',
      whiteSpace: 'nowrap',
    });
    box.appendChild(label);
  }
  overlay.appendChild(box);
}

function drawHandles(nodeId) {
  const el = canvasRoot.querySelector(`[data-node-id="${nodeId}"]`);
  if (!el) return;
  const containerRect = canvasRoot.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  const positions = [
    { name: 'nw', x: 0,    y: 0    }, { name: 'n',  x: 0.5,  y: 0    }, { name: 'ne', x: 1,    y: 0    },
    { name: 'w',  x: 0,    y: 0.5  },                                   { name: 'e',  x: 1,    y: 0.5  },
    { name: 'sw', x: 0,    y: 1    }, { name: 's',  x: 0.5,  y: 1    }, { name: 'se', x: 1,    y: 1    },
  ];
  for (const pos of positions) {
    const h = document.createElement('div');
    h.className = 'canvas-handle';
    h.dataset.direction = pos.name;
    Object.assign(h.style, {
      position: 'absolute',
      left: `${rect.left - containerRect.left + canvasRoot.scrollLeft + rect.width * pos.x - 4}px`,
      top:  `${rect.top  - containerRect.top  + canvasRoot.scrollTop  + rect.height * pos.y - 4}px`,
      width: '8px', height: '8px',
      background: '#fff',
      border: '1.5px solid var(--shell-accent)',
      borderRadius: '2px',
      cursor: `${pos.name}-resize`,
      pointerEvents: 'auto',
      zIndex: '11',
    });
    h.addEventListener('mousedown', (e) => startResize(e, nodeId, pos.name));
    overlay.appendChild(h);
  }
}

function getNodeLabel(nodeId) {
  const page = getActivePage();
  const node = findNode(page?.root, nodeId);
  const comp = node ? getComponent(node.type) : null;
  return comp ? `${comp.name}` : node?.type || '?';
}

/* ============ 手柄拖拽改尺寸（含 Shift 等比 + 对齐辅助线） ============ */
function startResize(e, nodeId, direction) {
  e.preventDefault();
  e.stopPropagation();
  const page = getActivePage();
  const node = findNode(page?.root, nodeId);
  if (!node) return;
  const el = canvasRoot.querySelector(`[data-node-id="${nodeId}"]`);
  const startRect = el.getBoundingClientRect();
  const startX = e.clientX, startY = e.clientY;
  const originalStyle = { ...(node.style || {}) };
  const aspectRatio = startRect.width / Math.max(1, startRect.height);

  // 收集邻居节点边界（用于对齐辅助线）
  const siblings = [];
  canvasRoot.querySelectorAll('[data-node-id]').forEach(sib => {
    if (sib.dataset.nodeId === nodeId) return;
    const r = sib.getBoundingClientRect();
    siblings.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
  });

  function snap(val, candidates, threshold = 4) {
    for (const c of candidates) {
      if (Math.abs(val - c) <= threshold) return { value: c, snapped: true };
    }
    return { value: val, snapped: false };
  }

  function onMove(ev) {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    const newStyle = { ...originalStyle };
    let w = startRect.width, h = startRect.height;
    if (direction.includes('e')) w = startRect.width + dx;
    if (direction.includes('w')) w = startRect.width - dx;
    if (direction.includes('s')) h = startRect.height + dy;
    if (direction.includes('n')) h = startRect.height - dy;

    // Shift 等比缩放
    if (ev.shiftKey && direction.length === 2) {
      // 角手柄才做等比
      const ratioW = w / Math.max(1, aspectRatio);
      const ratioH = h * aspectRatio;
      if (Math.abs(dx) > Math.abs(dy)) h = ratioW;
      else w = ratioH;
    }

    // 对齐辅助线（宽高对齐邻居）
    const allWidths  = siblings.map(s => s.right - s.left);
    const allHeights = siblings.map(s => s.bottom - s.top);
    const sw = snap(w, allWidths);
    const sh = snap(h, allHeights);
    w = sw.value; h = sh.value;

    if (direction !== 'n' && direction !== 's') newStyle.width  = `${Math.max(20, Math.round(w))}px`;
    if (direction !== 'w' && direction !== 'e') newStyle.height = `${Math.max(20, Math.round(h))}px`;
    node.style = newStyle;

    drawGuideLines(nodeId, sw.snapped, sh.snapped);
    renderCanvas();
    bus.emit('node:resizing', nodeId);
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    clearGuideLines();
    const newStyle = { ...node.style };
    node.style = originalStyle;
    import('../core/commands.js').then(m => {
      for (const k of new Set([...Object.keys(originalStyle), ...Object.keys(newStyle)])) {
        if (originalStyle[k] !== newStyle[k]) m.cmdUpdateNodeStyle(nodeId, k, newStyle[k]);
      }
    });
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

/* ============ 对齐辅助线 ============ */
function drawGuideLines(nodeId, hSnapped, vSnapped) {
  clearGuideLines();
  if (!hSnapped && !vSnapped) return;
  const el = canvasRoot.querySelector(`[data-node-id="${nodeId}"]`);
  if (!el) return;
  const containerRect = canvasRoot.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  const mkLine = (direction) => {
    const line = document.createElement('div');
    line.className = 'canvas-guide-line';
    if (direction === 'h') {
      Object.assign(line.style, {
        position: 'absolute', height: '1px',
        left: `${rect.left - containerRect.left}px`, width: `${rect.width}px`,
        top:  `${rect.top - containerRect.top + rect.height / 2}px`,
        background: '#ff4c4c', boxShadow: '0 0 2px rgba(255,76,76,0.5)',
        zIndex: '20', pointerEvents: 'none',
      });
    } else {
      Object.assign(line.style, {
        position: 'absolute', width: '1px',
        top: `${rect.top - containerRect.top}px`, height: `${rect.height}px`,
        left: `${rect.left - containerRect.left + rect.width / 2}px`,
        background: '#ff4c4c', boxShadow: '0 0 2px rgba(255,76,76,0.5)',
        zIndex: '20', pointerEvents: 'none',
      });
    }
    overlay.appendChild(line);
  };
  if (hSnapped) mkLine('h');
  if (vSnapped) mkLine('v');
}

function clearGuideLines() {
  overlay?.querySelectorAll('.canvas-guide-line').forEach(el => el.remove());
}

/* ============ 拖拽投放 ============ */
function onDragOver(e) {
  const tp = e.dataTransfer?.types || [];
  if (tp.includes('application/x-component')) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    // 高亮 drop target
    const node = e.target.closest('[data-node-id]');
    if (node) {
      state.hoverNodeId = node.dataset.nodeId;
      bus.emit('hover:changed');
    }
  }
}

function onDrop(e) {
  const type = e.dataTransfer?.getData('application/x-component');
  if (!type) return;
  e.preventDefault();
  const def = getComponent(type);
  if (!def) return;
  // 寻找目标父节点（若落在空白处，用根）
  const target = e.target.closest('[data-node-id]');
  const page = getActivePage();
  let parentId = page.root.id;
  if (target) {
    const tNode = findNode(page.root, target.dataset.nodeId);
    if (tNode && (def.canHaveChildren !== false) && getComponent(tNode.type)?.canHaveChildren) {
      parentId = tNode.id;
    } else {
      // 插到目标节点所在的父级
      const p = findParent(page.root, target.dataset.nodeId);
      if (p) parentId = p.id;
    }
  }
  const childNode = {
    id: nid(def.id.replace('mp-','')),
    type: def.id,
    props: { ...(def.defaultProps || {}) },
    style: { ...(def.defaultStyle || {}) },
    effects: [],
    children: [],
  };
  cmdAddNode(parentId, childNode);
}
