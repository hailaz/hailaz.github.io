/**
 * 数据组件：Table / Tree / Calendar / Pagination / Chart-placeholder / Timeline-dot
 */
import { register, nodeAttrs } from './registry.js';

/* ============ Table ============ */
register({
  id: 'mp-table',
  name: 'Table 表格',
  category: '数据',
  icon: '📊',
  canHaveChildren: false,
  defaultProps: {
    columns: '姓名,年龄,城市,操作',
    rows: '张三|28|北京|编辑,李四|32|上海|编辑,王五|25|深圳|编辑,赵六|41|广州|编辑',
    striped: true,
    bordered: false,
  },
  defaultStyle: {},
  schema: {
    props: [
      { key: 'columns', label: '列（逗号分隔）', type: 'text' },
      { key: 'rows',    label: '行（行逗号，列竖线）', type: 'textarea' },
      { key: 'striped', label: '斑马纹', type: 'boolean' },
      { key: 'bordered',label: '边框',   type: 'boolean' },
    ],
    style: [{ key: 'background', label: '背景', type: 'color' }],
  },
  render(node) {
    const p = node.props || {};
    const cols = (p.columns || '').split(',').map(s => s.trim()).filter(Boolean);
    const rows = (p.rows    || '').split(',').map(r => r.split('|').map(s => s.trim()));
    const border = p.bordered ? 'border:1px solid var(--weui-separator);' : '';
    return `<div ${nodeAttrs(node, '', `background:var(--weui-bg-2);border-radius:8px;overflow:hidden;font-size:13px;${border}`)}>
      <div style="display:grid;grid-template-columns:repeat(${cols.length},1fr);background:var(--weui-bg-1);font-weight:600;color:var(--weui-fg-0);">
        ${cols.map(c => `<div style="padding:10px 12px;border-bottom:1px solid var(--weui-separator);">${c}</div>`).join('')}
      </div>
      ${rows.map((r, idx) => `
        <div style="display:grid;grid-template-columns:repeat(${cols.length},1fr);${p.striped && idx%2===1 ? 'background:var(--weui-bg-1);' : ''}">
          ${r.map(cell => `<div style="padding:10px 12px;border-bottom:1px solid var(--weui-separator);color:var(--weui-fg-1);">${cell || ''}</div>`).join('')}
        </div>
      `).join('')}
    </div>`;
  },
  codegen: {
    wxml(node, { styleAttr }) {
      const p = node.props || {};
      const cols = (p.columns || '').split(',').map(s => s.trim());
      return `<view class="table"${styleAttr}>
  <view class="table-head">${cols.map(c => `<text class="th">${c}</text>`).join('')}</view>
  <view wx:for="{{tableRows}}" wx:key="index" class="table-row">
    <text wx:for="{{item}}" wx:for-item="cell" wx:key="*this" class="td">{{cell}}</text>
  </view>
</view>`;
    },
  },
});

/* ============ Tree ============ */
register({
  id: 'mp-tree',
  name: 'Tree 树',
  category: '数据',
  icon: '🌲',
  canHaveChildren: false,
  defaultProps: {
    nodes: '一级1>二级1-1>叶子1-1-1,一级1>二级1-2,一级2>二级2-1,一级2>二级2-2>叶子2-2-1',
  },
  defaultStyle: {},
  schema: {
    props: [{ key: 'nodes', label: '节点（逗号分路径，>分层级）', type: 'textarea' }],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    // 解析树
    const tree = {};
    (p.nodes || '').split(',').forEach(path => {
      const parts = path.split('>').map(s => s.trim());
      let cur = tree;
      for (const part of parts) {
        if (!cur[part]) cur[part] = {};
        cur = cur[part];
      }
    });
    function renderTree(obj, depth = 0) {
      return Object.entries(obj).map(([k, children]) => {
        const hasChildren = Object.keys(children).length > 0;
        return `<div style="padding-left:${depth * 16}px;">
          <div style="padding:6px 8px;display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;">
            <span style="color:var(--weui-fg-2);width:14px;">${hasChildren ? '▸' : '·'}</span>
            <span>${k}</span>
          </div>
          ${hasChildren ? renderTree(children, depth + 1) : ''}
        </div>`;
      }).join('');
    }
    return `<div ${nodeAttrs(node, '', 'background:var(--weui-bg-2);border-radius:8px;padding:8px;font-size:13px;')}>
      ${renderTree(tree)}
    </div>`;
  },
});

/* ============ Calendar（月历） ============ */
register({
  id: 'mp-calendar',
  name: 'Calendar 日历',
  category: '数据',
  icon: '📅',
  canHaveChildren: false,
  defaultProps: { year: 2026, month: 5, marks: '6,12,18,24' },
  defaultStyle: {},
  schema: {
    props: [
      { key: 'year',  label: '年', type: 'number' },
      { key: 'month', label: '月（1-12）', type: 'number' },
      { key: 'marks', label: '标记日期（逗号分隔）', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const y = +p.year || new Date().getFullYear();
    const m = (+p.month || new Date().getMonth() + 1) - 1;
    const marks = new Set((p.marks || '').split(',').map(s => +s.trim()).filter(Boolean));
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push({ empty: true });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, mark: marks.has(d) });
    return `<div ${nodeAttrs(node, '', 'background:var(--weui-bg-2);border-radius:8px;padding:12px;font-size:13px;')}>
      <div style="text-align:center;font-weight:600;margin-bottom:10px;color:var(--weui-fg-0);">${y}年${m + 1}月</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;color:var(--weui-fg-2);font-size:11px;margin-bottom:6px;">
        ${['日','一','二','三','四','五','六'].map(d => `<div style="padding:4px 0;">${d}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">
        ${cells.map(c => c.empty
          ? `<div></div>`
          : `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:50%;color:${c.mark?'#fff':'var(--weui-fg-1)'};${c.mark?'background:var(--weui-brand);':''}">${c.day}</div>`
        ).join('')}
      </div>
    </div>`;
  },
});

/* ============ Pagination ============ */
register({
  id: 'mp-pagination',
  name: 'Pagination 分页',
  category: '数据',
  icon: '⬅️',
  canHaveChildren: false,
  defaultProps: { current: 3, total: 10, showInfo: true },
  defaultStyle: {},
  schema: {
    props: [
      { key: 'current',  label: '当前页', type: 'number' },
      { key: 'total',    label: '总页数', type: 'number' },
      { key: 'showInfo', label: '显示信息', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const cur = +p.current || 1;
    const total = +p.total || 1;
    const items = [];
    const push = (label, active, disabled) => items.push(
      `<span style="min-width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;padding:0 10px;font-size:13px;cursor:${disabled?'not-allowed':'pointer'};${active?'background:var(--weui-brand);color:#fff;':'background:var(--weui-bg-2);color:var(--weui-fg-1);'}${disabled?'opacity:.4;':''}border:1px solid var(--weui-separator);">${label}</span>`
    );
    push('‹', false, cur === 1);
    const start = Math.max(1, cur - 2);
    const end   = Math.min(total, cur + 2);
    if (start > 1) { push('1', false, false); if (start > 2) push('…', false, true); }
    for (let i = start; i <= end; i++) push(i, i === cur, false);
    if (end < total) { if (end < total - 1) push('…', false, true); push(total, false, false); }
    push('›', false, cur === total);
    return `<div ${nodeAttrs(node, '', 'display:flex;align-items:center;gap:6px;padding:12px;justify-content:center;flex-wrap:wrap;')}>
      ${items.join('')}
      ${p.showInfo ? `<span style="color:var(--weui-fg-2);font-size:12px;margin-left:8px;">共 ${total} 页</span>` : ''}
    </div>`;
  },
});

/* ============ Chart Placeholder ============ */
register({
  id: 'mp-chart',
  name: 'Chart 图表',
  category: '数据',
  icon: '📈',
  canHaveChildren: false,
  defaultProps: { type: 'bar', title: '销售趋势', data: '12,19,8,25,14,22,18' },
  defaultStyle: {},
  schema: {
    props: [
      { key: 'type',  label: '类型', type: 'select', options: ['bar','line','pie','area'] },
      { key: 'title', label: '标题', type: 'text' },
      { key: 'data',  label: '数据（逗号分隔）', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const nums = (p.data || '').split(',').map(s => +s.trim()).filter(n => !isNaN(n));
    const max = Math.max(...nums, 1);
    let chart = '';
    if (p.type === 'pie') {
      const total = nums.reduce((a,b) => a+b, 0) || 1;
      let cumulative = 0;
      const segments = nums.map((n, i) => {
        const start = cumulative;
        cumulative += n;
        const a1 = (start / total) * 2 * Math.PI - Math.PI/2;
        const a2 = (cumulative / total) * 2 * Math.PI - Math.PI/2;
        const large = (a2 - a1) > Math.PI ? 1 : 0;
        const x1 = 50 + 40 * Math.cos(a1), y1 = 50 + 40 * Math.sin(a1);
        const x2 = 50 + 40 * Math.cos(a2), y2 = 50 + 40 * Math.sin(a2);
        const colors = ['#07c160','#10aeff','#ffc300','#fa5151','#6467f0','#9c6ade'];
        return `<path d="M 50 50 L ${x1} ${y1} A 40 40 0 ${large} 1 ${x2} ${y2} Z" fill="${colors[i % colors.length]}" opacity=".85"/>`;
      }).join('');
      chart = `<svg viewBox="0 0 100 100" width="100%" height="140">${segments}</svg>`;
    } else if (p.type === 'line' || p.type === 'area') {
      const w = 300, h = 120, pad = 12;
      const stepX = (w - pad * 2) / Math.max(1, nums.length - 1);
      const pts = nums.map((n, i) => `${pad + i * stepX},${h - pad - (n / max) * (h - pad * 2)}`).join(' ');
      const areaPath = `M ${pad},${h - pad} L ${pts.replace(/,/g, ' ').replace(/ (\d)/g, ' L $1')} L ${pad + (nums.length-1) * stepX},${h - pad} Z`;
      chart = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="140">
        ${p.type === 'area' ? `<path d="${areaPath}" fill="var(--weui-brand)" opacity=".15"/>` : ''}
        <polyline points="${pts}" fill="none" stroke="var(--weui-brand)" stroke-width="2" stroke-linecap="round"/>
        ${nums.map((n, i) => `<circle cx="${pad + i * stepX}" cy="${h - pad - (n / max) * (h - pad * 2)}" r="3" fill="var(--weui-brand)"/>`).join('')}
      </svg>`;
    } else {
      // bar
      chart = `<div style="display:flex;align-items:flex-end;height:140px;gap:4px;padding:8px 4px;">
        ${nums.map(n => `<div style="flex:1;background:linear-gradient(180deg,var(--weui-brand) 0%,var(--weui-brand) 100%);border-radius:3px 3px 0 0;opacity:.85;min-height:3px;height:${(n/max)*100}%;position:relative;">
          <div style="position:absolute;top:-18px;left:0;right:0;text-align:center;font-size:10px;color:var(--weui-fg-2);">${n}</div>
        </div>`).join('')}
      </div>`;
    }
    return `<div ${nodeAttrs(node, '', 'background:var(--weui-bg-2);border-radius:8px;padding:16px;')}>
      ${p.title ? `<div style="font-size:14px;font-weight:600;margin-bottom:10px;color:var(--weui-fg-0);">${p.title}</div>` : ''}
      ${chart}
    </div>`;
  },
});

/* ============ Breadcrumb ============ */
register({
  id: 'mp-breadcrumb',
  name: 'Breadcrumb 面包屑',
  category: '数据',
  icon: '🧭',
  canHaveChildren: false,
  defaultProps: { items: '首页,分类,电子产品,手机' },
  defaultStyle: {},
  schema: {
    props: [{ key: 'items', label: '项（逗号分隔）', type: 'text' }],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => s.trim()).filter(Boolean);
    return `<div ${nodeAttrs(node, '', 'display:flex;align-items:center;gap:4px;padding:8px 12px;font-size:12px;color:var(--weui-fg-2);flex-wrap:wrap;')}>
      ${items.map((it, idx) => `
        <span style="${idx === items.length - 1 ? 'color:var(--weui-fg-0);' : 'cursor:pointer;'}">${it}</span>
        ${idx < items.length - 1 ? '<span>/</span>' : ''}
      `).join('')}
    </div>`;
  },
});

/* ============ Description 描述列表 ============ */
register({
  id: 'mp-descriptions',
  name: 'Descriptions 描述列表',
  category: '数据',
  icon: '📝',
  canHaveChildren: false,
  defaultProps: {
    items: '姓名|张三,性别|男,年龄|28,邮箱|zhang@example.com,电话|13800138000,地址|北京市海淀区',
    cols: 2,
    bordered: true,
  },
  defaultStyle: {},
  schema: {
    props: [
      { key: 'items',   label: '项（label|value,...）', type: 'textarea' },
      { key: 'cols',    label: '列数',   type: 'number' },
      { key: 'bordered',label: '带边框', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => s.split('|'));
    const cols = +p.cols || 2;
    const br = p.bordered ? 'border:1px solid var(--weui-separator);' : '';
    return `<div ${nodeAttrs(node, '', `background:var(--weui-bg-2);border-radius:8px;overflow:hidden;${br}`)}>
      <div style="display:grid;grid-template-columns:repeat(${cols},1fr);">
        ${items.map(([label, value], idx) => `
          <div style="padding:10px 14px;border-right:1px solid var(--weui-separator);border-bottom:1px solid var(--weui-separator);font-size:13px;${(idx+1)%cols===0?'border-right:0;':''}">
            <div style="color:var(--weui-fg-2);font-size:11px;margin-bottom:2px;">${label || ''}</div>
            <div style="color:var(--weui-fg-0);">${value || ''}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  },
});
