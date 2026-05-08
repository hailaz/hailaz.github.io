/**
 * 展示组件：Card / Tabs / Steps / Progress / Stat / Timeline / Rate / Tags Row / Capsule / Price / KV Row / Hero
 */
import { register, nodeAttrs } from './registry.js';

register({
  id: 'mp-card',
  name: 'Card 卡片',
  category: '展示',
  icon: '🃏',
  canHaveChildren: true,
  defaultProps: { title: '卡片标题', shadow: true },
  defaultStyle: { margin: '8px 12px' },
  schema: {
    props: [
      { key: 'title',  label: '标题', type: 'text' },
      { key: 'shadow', label: '阴影', type: 'boolean' },
    ],
    style: [
      { key: 'background', label: '背景', type: 'color' },
    ],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `background:var(--weui-bg-2);border-radius:8px;padding:16px;${p.shadow?'box-shadow:0 1px 3px rgba(0,0,0,.06);':''}`)}>
      ${p.title ? `<div style="font-size:15px;font-weight:600;margin-bottom:8px;color:var(--weui-fg-0);">${p.title}</div>` : ''}
      ${node.childrenHtml || ''}
    </div>`;
  },
});

register({
  id: 'mp-tabs',
  name: 'Tabs 标签页',
  category: '展示',
  icon: '⋮',
  defaultProps: { items: '首页,分类,购物车,我的', active: 0 },
  schema: {
    props: [
      { key: 'items',  label: '选项（逗号分隔）', type: 'text' },
      { key: 'active', label: '激活索引', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => s.trim()).filter(Boolean);
    return `<div ${nodeAttrs(node, '', `display:flex;background:var(--weui-bg-2);border-bottom:1px solid var(--weui-separator);`)}>
      ${items.map((t, i) => `
        <span style="flex:1;text-align:center;padding:12px 0;font-size:14px;${i === (p.active||0) ? 'color:var(--weui-brand);font-weight:500;border-bottom:2px solid var(--weui-brand);' : 'color:var(--weui-fg-1);'}">${t}</span>
      `).join('')}
    </div>`;
  },
});

register({
  id: 'mp-steps',
  name: 'Steps 步骤条',
  category: '展示',
  icon: '→',
  defaultProps: { items: '下单,付款,发货,签收', active: 1 },
  schema: {
    props: [
      { key: 'items',  label: '步骤（逗号）', type: 'text' },
      { key: 'active', label: '当前索引', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => s.trim()).filter(Boolean);
    return `<div ${nodeAttrs(node, '', `display:flex;align-items:center;padding:16px;background:var(--weui-bg-2);`)}>
      ${items.map((t, i) => {
        const done = i <= (p.active||0);
        return `
          ${i > 0 ? `<span style="flex:1;height:2px;background:${done ? 'var(--weui-brand)' : 'var(--weui-bg-0)'};"></span>` : ''}
          <span style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <span style="width:24px;height:24px;border-radius:50%;background:${done ? 'var(--weui-brand)' : 'var(--weui-bg-0)'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">${i+1}</span>
            <span style="font-size:11px;color:var(--weui-fg-1);">${t}</span>
          </span>
        `;
      }).join('')}
    </div>`;
  },
});

register({
  id: 'mp-progress',
  name: 'Progress 进度条',
  category: '展示',
  icon: '▬',
  defaultProps: { percent: 60, showText: true },
  schema: {
    props: [
      { key: 'percent',  label: '百分比', type: 'number' },
      { key: 'showText', label: '显示文字', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const pct = Math.max(0, Math.min(100, p.percent || 0));
    return `<div ${nodeAttrs(node, '', `padding:12px 16px;display:flex;align-items:center;gap:12px;`)}>
      <div style="flex:1;height:6px;background:var(--weui-bg-0);border-radius:3px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:var(--weui-brand);transition:width .3s;"></div>
      </div>
      ${p.showText ? `<span style="font-size:12px;color:var(--weui-fg-1);min-width:32px;">${pct}%</span>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-stat',
  name: 'Stat 数据统计',
  category: '展示',
  icon: '📊',
  defaultProps: { label: '月活跃用户', value: '12,340', suffix: '', trend: '+5.2%', trendType: 'up' },
  schema: {
    props: [
      { key: 'label',     label: '标签', type: 'text' },
      { key: 'value',     label: '数值', type: 'text' },
      { key: 'suffix',    label: '单位', type: 'text' },
      { key: 'trend',     label: '趋势文字', type: 'text' },
      { key: 'trendType', label: '趋势类型', type: 'select', options: ['up','down','flat'] },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const colors = { up: 'var(--weui-brand)', down: 'var(--weui-red)', flat: 'var(--weui-fg-2)' };
    return `<div ${nodeAttrs(node, '', `padding:12px 16px;background:var(--weui-bg-2);`)}>
      <div style="font-size:13px;color:var(--weui-fg-1);margin-bottom:4px;">${p.label||''}</div>
      <div style="display:flex;align-items:baseline;gap:4px;">
        <span style="font-size:24px;font-weight:700;color:var(--weui-fg-0);">${p.value||''}</span>
        ${p.suffix ? `<span style="font-size:13px;color:var(--weui-fg-2);">${p.suffix}</span>` : ''}
      </div>
      ${p.trend ? `<div style="font-size:12px;color:${colors[p.trendType]||colors.up};margin-top:2px;">${p.trend}</div>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-timeline',
  name: 'Timeline 时间线',
  category: '展示',
  icon: '🕘',
  defaultProps: { items: '下单|10:30|已支付;发货|14:20|快递员已取件;签收|16:45|您已签收' },
  schema: {
    props: [{ key: 'items', label: '项 (每项用;分隔, 内部用|: 标题|时间|描述)', type: 'textarea' }],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(';').map(s => s.trim()).filter(Boolean).map(s => {
      const [title, time, desc] = s.split('|').map(x => (x||'').trim());
      return { title, time, desc };
    });
    return `<div ${nodeAttrs(node, '', `padding:16px;background:var(--weui-bg-2);`)}>
      ${items.map((it, i) => `
        <div style="display:flex;gap:12px;padding:8px 0;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <span style="width:10px;height:10px;border-radius:50%;background:${i===0?'var(--weui-brand)':'var(--weui-bg-0)'};border:2px solid ${i===0?'var(--weui-brand)':'var(--weui-bg-0)'};"></span>
            ${i < items.length-1 ? '<span style="flex:1;width:2px;background:var(--weui-bg-0);margin-top:4px;"></span>' : ''}
          </div>
          <div style="flex:1;padding-bottom:12px;">
            <div style="font-size:14px;color:var(--weui-fg-0);font-weight:500;">${it.title||''}</div>
            ${it.time ? `<div style="font-size:12px;color:var(--weui-fg-2);margin-top:2px;">${it.time}</div>` : ''}
            ${it.desc ? `<div style="font-size:13px;color:var(--weui-fg-1);margin-top:4px;">${it.desc}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>`;
  },
});

register({
  id: 'mp-rate',
  name: 'Rate 评分',
  category: '展示',
  icon: '⭐',
  defaultProps: { value: 4, max: 5 },
  schema: {
    props: [
      { key: 'value', label: '分值', type: 'number' },
      { key: 'max',   label: '总分', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const val = p.value || 0, max = p.max || 5;
    return `<span ${nodeAttrs(node, '', `display:inline-flex;gap:2px;font-size:18px;`)}>
      ${Array.from({length:max}).map((_,i) => `<span style="color:${i<val?'#fbbf24':'#d4d4d4'};">★</span>`).join('')}
    </span>`;
  },
});

register({
  id: 'mp-price',
  name: 'Price 价格',
  category: '展示',
  icon: '💰',
  defaultProps: { current: '199', original: '399', discount: '5折' },
  schema: {
    props: [
      { key: 'current',  label: '现价', type: 'text' },
      { key: 'original', label: '原价', type: 'text' },
      { key: 'discount', label: '折扣标', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<span ${nodeAttrs(node, '', `display:inline-flex;align-items:baseline;gap:8px;`)}>
      <span style="font-size:24px;font-weight:700;color:var(--weui-red);">¥${p.current||''}</span>
      ${p.original ? `<span style="font-size:14px;color:var(--weui-fg-2);text-decoration:line-through;">¥${p.original}</span>` : ''}
      ${p.discount ? `<span class="weui-tag weui-tag-red">${p.discount}</span>` : ''}
    </span>`;
  },
});

register({
  id: 'mp-kv',
  name: 'KV 键值行',
  category: '展示',
  icon: '≡',
  defaultProps: { label: '规格', value: '黑色 / 标准版' },
  schema: {
    props: [
      { key: 'label', label: '键', type: 'text' },
      { key: 'value', label: '值', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `display:flex;padding:8px 16px;font-size:14px;`)}>
      <span style="width:96px;color:var(--weui-fg-2);">${p.label||''}</span>
      <span style="flex:1;color:var(--weui-fg-0);">${p.value||''}</span>
    </div>`;
  },
});

register({
  id: 'mp-hero',
  name: 'Hero 大横幅',
  category: '展示',
  icon: '🎨',
  canHaveChildren: false,
  defaultProps: { title: '春季新品上市', subtitle: '全场 5 折起', gradient: 'linear-gradient(135deg,var(--weui-brand),var(--weui-indigo))', height: 160 },
  schema: {
    props: [
      { key: 'title',    label: '主标题', type: 'text' },
      { key: 'subtitle', label: '副标题', type: 'text' },
      { key: 'gradient', label: '背景渐变', type: 'text' },
      { key: 'height',   label: '高度 px', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `height:${p.height||160}px;margin:8px 12px;border-radius:8px;background:${p.gradient};display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;`)}>
      <div style="font-size:20px;font-weight:700;">${p.title||''}</div>
      ${p.subtitle ? `<div style="font-size:14px;margin-top:6px;opacity:.9;">${p.subtitle}</div>` : ''}
    </div>`;
  },
});
