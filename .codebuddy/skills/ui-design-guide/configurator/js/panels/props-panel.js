/**
 * 属性面板（右栏）
 * 根据选中节点的 component schema 动态生成表单
 */
import { state, bus, findNode, getActivePage } from '../core/state.js';
import { get as getComponent } from '../components/registry.js';
import { byCategory as effectsByCategory } from '../effects/registry.js';
import { cmdUpdateNodeProp, cmdUpdateNodeStyle, cmdToggleEffect, cmdRemoveNode, cmdDuplicateNode } from '../core/commands.js';

let rootEl = null;
let currentTab = 'props';

export function initPropsPanel() {
  rootEl = document.getElementById('props-panel');
  if (!rootEl) return;
  bus.on('selection:changed', render);
  bus.on('project:changed',   render);
  render();
}

function render() {
  if (!rootEl) return;
  const page = getActivePage();
  const node = state.selectedNodeId ? findNode(page?.root, state.selectedNodeId) : null;
  if (!node) {
    rootEl.innerHTML = `<div style="padding:32px 16px;text-align:center;color:var(--shell-muted);font-size:13px;">点击画布中的组件<br/>或双击左侧组件库添加</div>`;
    return;
  }
  const def = getComponent(node.type);
  if (!def) {
    rootEl.innerHTML = `<div style="padding:16px;color:var(--shell-danger);">未注册组件：${node.type}</div>`;
    return;
  }

  rootEl.innerHTML = `
<div class="pp-header">
  <span class="pp-icon">${def.icon || '◻'}</span>
  <strong>${def.name}</strong>
  <span class="pp-id muted" title="节点 ID">${node.id.slice(0, 12)}</span>
  <span class="grow"></span>
  <button class="tool pp-action" data-action="dup"    title="复制 (Ctrl+D)">⎘</button>
  <button class="tool pp-action" data-action="delete" title="删除 (Del)">×</button>
</div>

<nav class="pp-tabs">
  <button data-pp-tab="props"   class="${currentTab==='props'?'on':''}">属性</button>
  <button data-pp-tab="style"   class="${currentTab==='style'?'on':''}">样式</button>
  <button data-pp-tab="effects" class="${currentTab==='effects'?'on':''}">效果</button>
</nav>

<div class="pp-body">
${currentTab === 'props'   ? renderProps(node, def) : ''}
${currentTab === 'style'   ? renderStyle(node, def) : ''}
${currentTab === 'effects' ? renderEffects(node) : ''}
</div>
`;

  bindEvents(node, def);
}

function renderProps(node, def) {
  const fields = def.schema?.props || [];
  if (fields.length === 0) return '<div class="pp-empty">此组件暂无可编辑属性</div>';
  return fields.map(f => fieldHtml(f, node.props?.[f.key], 'props')).join('');
}

function renderStyle(node, def) {
  const commonStyle = [
    { key: 'background', label: '背景',   type: 'color' },
    { key: 'color',      label: '文字色', type: 'color' },
    { key: 'borderRadius', label: '圆角', type: 'text' },
    { key: 'border',     label: '边框',   type: 'text' },
    { key: 'fontSize',   label: '字号',   type: 'text' },
    { key: 'fontWeight', label: '字重',   type: 'select', options: ['400','500','600','700'] },
    { key: 'textAlign',  label: '对齐',   type: 'select', options: ['left','center','right'] },
    { key: 'boxShadow',  label: '阴影',   type: 'text' },
    { key: 'opacity',    label: '透明度', type: 'text' },
  ];
  const extra = def.schema?.style || [];
  const seen = new Set();
  const all = [...extra, ...commonStyle].filter(f => {
    if (seen.has(f.key)) return false;
    seen.add(f.key); return true;
  });
  return `
    ${renderDimField(node, 'width',  '宽度')}
    ${renderDimField(node, 'height', '高度')}
    ${renderSpacingBox(node)}
    ${all.map(f => fieldHtml(f, node.style?.[f.key], 'style')).join('')}
  `;
}

/** 尺寸字段：数值 + 单位切换（px/%/auto） */
function renderDimField(node, key, label) {
  const raw = String(node.style?.[key] || '');
  let numVal = '', unit = 'px';
  if (raw === 'auto') { numVal = ''; unit = 'auto'; }
  else if (raw.endsWith('%')) { numVal = raw.slice(0, -1); unit = '%'; }
  else if (raw.endsWith('px')) { numVal = raw.slice(0, -2); unit = 'px'; }
  else numVal = raw;
  const units = ['px', '%', 'auto'];
  return `<div class="pp-field pp-dim-field">
    <label class="pp-label">${label}</label>
    <div class="pp-dim">
      <input type="number" class="pp-input pp-dim-num" data-dim-key="${key}" value="${numVal}" ${unit==='auto'?'disabled':''} />
      <div class="pp-dim-units">
        ${units.map(u => `<button type="button" class="pp-dim-unit ${u===unit?'on':''}" data-dim-unit="${u}" data-dim-for="${key}">${u}</button>`).join('')}
      </div>
    </div>
  </div>`;
}

/** padding/margin 可视化盒子 */
function renderSpacingBox(node) {
  const s = node.style || {};
  // 支持缩写 + 分向
  const parseEdge = (full, edgeKey) => {
    if (s[edgeKey] != null) return String(s[edgeKey]).replace(/px$/, '');
    if (!full) return '';
    const parts = String(full).replace(/px/g, '').trim().split(/\s+/);
    const pick = { top: parts[0], right: parts[1] ?? parts[0], bottom: parts[2] ?? parts[0], left: parts[3] ?? parts[1] ?? parts[0] };
    return pick[edgeKey.replace(/^(padding|margin)/, '').toLowerCase()] || '';
  };
  const pt = parseEdge(s.padding, 'paddingTop');
  const pr = parseEdge(s.padding, 'paddingRight');
  const pb = parseEdge(s.padding, 'paddingBottom');
  const pl = parseEdge(s.padding, 'paddingLeft');
  const mt = parseEdge(s.margin, 'marginTop');
  const mr = parseEdge(s.margin, 'marginRight');
  const mb = parseEdge(s.margin, 'marginBottom');
  const ml = parseEdge(s.margin, 'marginLeft');

  return `
    <div class="pp-field">
      <label class="pp-label">间距盒子（padding / margin）</label>
      <div class="spacing-box">
        <div class="sb-margin">
          <span class="sb-tag">margin</span>
          <input class="sb-input sb-m-t" data-spacing="marginTop"    value="${mt}" placeholder="0" />
          <input class="sb-input sb-m-r" data-spacing="marginRight"  value="${mr}" placeholder="0" />
          <input class="sb-input sb-m-b" data-spacing="marginBottom" value="${mb}" placeholder="0" />
          <input class="sb-input sb-m-l" data-spacing="marginLeft"   value="${ml}" placeholder="0" />
          <div class="sb-padding">
            <span class="sb-tag">padding</span>
            <input class="sb-input sb-p-t" data-spacing="paddingTop"    value="${pt}" placeholder="0" />
            <input class="sb-input sb-p-r" data-spacing="paddingRight"  value="${pr}" placeholder="0" />
            <input class="sb-input sb-p-b" data-spacing="paddingBottom" value="${pb}" placeholder="0" />
            <input class="sb-input sb-p-l" data-spacing="paddingLeft"   value="${pl}" placeholder="0" />
            <div class="sb-center">内容</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderEffects(node) {
  const cats = effectsByCategory();
  const applied = node.effects || [];
  return cats.map(g => `
    <details open style="margin-bottom:8px;">
      <summary class="pp-cat">${g.category}</summary>
      <div class="pp-effects-grid">
        ${g.items.map(e => `
          <label class="pp-effect-chip ${applied.includes(e.id) ? 'on' : ''}" data-effect-id="${e.id}">
            <input type="checkbox" ${applied.includes(e.id) ? 'checked' : ''} />
            <span class="pp-effect-preview">${e.preview || ''}</span>
            <span class="pp-effect-name">${e.name}</span>
          </label>
        `).join('')}
      </div>
    </details>
  `).join('');
}

function fieldHtml(f, value, kind) {
  const v = value == null ? '' : value;
  const dataAttr = `data-${kind}-key="${f.key}"`;
  let input;
  switch (f.type) {
    case 'boolean':
      input = `<input type="checkbox" ${dataAttr} class="pp-input" ${v ? 'checked' : ''} />`;
      break;
    case 'number':
      input = `<input type="number" ${dataAttr} class="pp-input" value="${v}" />`;
      break;
    case 'color':
      input = `<span class="pp-color"><input type="color" ${dataAttr} class="pp-input" value="${v || '#000000'}" /><input type="text" ${dataAttr}-text class="pp-input" value="${v}" placeholder="#RRGGBB" /></span>`;
      break;
    case 'select':
      input = `<select ${dataAttr} class="pp-input">${(f.options||[]).map(o => `<option value="${o}" ${o==v?'selected':''}>${o}</option>`).join('')}</select>`;
      break;
    case 'textarea':
      input = `<textarea ${dataAttr} class="pp-input" rows="3">${v}</textarea>`;
      break;
    default:
      input = `<input type="text" ${dataAttr} class="pp-input" value="${v}" placeholder="${f.placeholder||''}" />`;
  }
  return `<div class="pp-field">
    <label class="pp-label">${f.label}</label>
    ${input}
  </div>`;
}

function bindEvents(node, def) {
  // Tab 切换
  rootEl.querySelectorAll('[data-pp-tab]').forEach(b => {
    b.addEventListener('click', () => { currentTab = b.dataset.ppTab; render(); });
  });

  // 操作按钮
  rootEl.querySelectorAll('[data-action]').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.action === 'delete') cmdRemoveNode(node.id);
      if (b.dataset.action === 'dup')    cmdDuplicateNode(node.id);
    });
  });

  // props 字段
  rootEl.querySelectorAll('[data-props-key]').forEach(el => {
    el.addEventListener('change', () => applyInput(el, 'props', node.id));
    if (el.type === 'text' || el.tagName === 'TEXTAREA') el.addEventListener('blur', () => applyInput(el, 'props', node.id));
  });

  // style 字段
  rootEl.querySelectorAll('[data-style-key]').forEach(el => {
    el.addEventListener('change', () => applyInput(el, 'style', node.id));
    if (el.type === 'text' || el.tagName === 'TEXTAREA') el.addEventListener('blur', () => applyInput(el, 'style', node.id));
  });

  // color text 同步
  rootEl.querySelectorAll('[data-style-key-text]').forEach(el => {
    el.addEventListener('change', () => {
      const key = el.dataset.styleKeyText || el.dataset.propsKeyText;
      const val = el.value;
      cmdUpdateNodeStyle(node.id, key, val);
    });
  });

  // 效果
  rootEl.querySelectorAll('.pp-effect-chip').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') e.preventDefault();
      cmdToggleEffect(node.id, el.dataset.effectId);
    });
  });

  // 间距盒子
  rootEl.querySelectorAll('[data-spacing]').forEach(el => {
    const commit = () => {
      const key = el.dataset.spacing;
      const raw = el.value.trim();
      const val = raw === '' ? '' : (/^\d+$/.test(raw) ? `${raw}px` : raw);
      cmdUpdateNodeStyle(node.id, key, val);
    };
    el.addEventListener('change', commit);
    el.addEventListener('blur',   commit);
  });

  // 尺寸字段（带单位切换）
  function readDimInput(key) {
    const numEl  = rootEl.querySelector(`[data-dim-key="${key}"]`);
    const unitEl = rootEl.querySelector(`[data-dim-for="${key}"].on`);
    const unit = unitEl?.dataset.dimUnit || 'px';
    if (unit === 'auto') return 'auto';
    const num = numEl?.value?.trim() || '';
    return num === '' ? '' : `${num}${unit}`;
  }
  rootEl.querySelectorAll('[data-dim-key]').forEach(el => {
    const commit = () => cmdUpdateNodeStyle(node.id, el.dataset.dimKey, readDimInput(el.dataset.dimKey));
    el.addEventListener('change', commit);
    el.addEventListener('blur',   commit);
  });
  rootEl.querySelectorAll('[data-dim-unit]').forEach(btn => {
    btn.onclick = () => {
      const key = btn.dataset.dimFor;
      const newUnit = btn.dataset.dimUnit;
      // 更新按钮 on 状态
      rootEl.querySelectorAll(`[data-dim-for="${key}"]`).forEach(b => b.classList.toggle('on', b === btn));
      const numEl = rootEl.querySelector(`[data-dim-key="${key}"]`);
      if (newUnit === 'auto') {
        if (numEl) numEl.disabled = true;
        cmdUpdateNodeStyle(node.id, key, 'auto');
      } else {
        if (numEl) numEl.disabled = false;
        cmdUpdateNodeStyle(node.id, key, readDimInput(key));
      }
    };
  });
}

function applyInput(el, kind, nodeId) {
  const key = el.dataset[kind + 'Key'];
  if (!key) return;
  let val;
  if (el.type === 'checkbox') val = el.checked;
  else if (el.type === 'number') val = parseFloat(el.value);
  else val = el.value;
  if (kind === 'props') cmdUpdateNodeProp(nodeId, key, val);
  else                  cmdUpdateNodeStyle(nodeId, key, val);
}
