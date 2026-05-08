/**
 * 布局组件：Flex / Grid / Stack / Cell / CellGroup / List / ScrollView / Row / Col
 */
import { register, nodeAttrs } from './registry.js';

register({
  id: 'mp-flex',
  name: 'Flex 弹性盒',
  category: '布局',
  icon: '↔️',
  canHaveChildren: true,
  defaultProps: { direction: 'row', justify: 'flex-start', align: 'center', gap: 8, wrap: false },
  defaultStyle: { padding: '12px' },
  schema: {
    props: [
      { key: 'direction', label: '方向', type: 'select', options: ['row','column','row-reverse','column-reverse'] },
      { key: 'justify',   label: '主轴', type: 'select', options: ['flex-start','center','flex-end','space-between','space-around'] },
      { key: 'align',     label: '交叉轴', type: 'select', options: ['flex-start','center','flex-end','stretch'] },
      { key: 'gap',       label: '间距 px', type: 'number' },
      { key: 'wrap',      label: '换行', type: 'boolean' },
    ],
    style: [
      { key: 'background', label: '背景', type: 'color' },
      { key: 'padding',    label: '内边距', type: 'text' },
    ],
  },
  render(node) {
    const p = node.props || {};
    const style = `display:flex;flex-direction:${p.direction||'row'};justify-content:${p.justify||'flex-start'};align-items:${p.align||'center'};gap:${p.gap||0}px;${p.wrap?'flex-wrap:wrap;':''}`;
    return `<div ${nodeAttrs(node, 'node-flex', `${style}`)} data-style-merge >${node.childrenHtml || ''}</div>`;
  },
});

register({
  id: 'mp-grid',
  name: 'Grid 网格',
  category: '布局',
  icon: '⊞',
  canHaveChildren: true,
  defaultProps: { cols: 4, gap: 12 },
  defaultStyle: { padding: '12px' },
  schema: {
    props: [
      { key: 'cols', label: '列数', type: 'number' },
      { key: 'gap',  label: '间距 px', type: 'number' },
    ],
    style: [
      { key: 'background', label: '背景', type: 'color' },
      { key: 'padding',    label: '内边距', type: 'text' },
    ],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, 'node-grid', `display:grid;grid-template-columns:repeat(${p.cols||4},1fr);gap:${p.gap||12}px;`)} >${node.childrenHtml || ''}</div>`;
  },
});

register({
  id: 'mp-stack',
  name: 'Stack 垂直栈',
  category: '布局',
  icon: '☰',
  canHaveChildren: true,
  defaultProps: { gap: 8 },
  schema: {
    props: [{ key: 'gap', label: '间距 px', type: 'number' }],
    style: [{ key: 'padding', label: '内边距', type: 'text' }, { key: 'background', label: '背景', type: 'color' }],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `display:flex;flex-direction:column;gap:${p.gap||8}px;`)}>${node.childrenHtml || ''}</div>`;
  },
});

register({
  id: 'mp-cell',
  name: 'Cell 列表项',
  category: '布局',
  icon: '▭',
  canHaveChildren: false,
  defaultProps: { title: '标题', desc: '', arrow: true },
  schema: {
    props: [
      { key: 'title', label: '标题', type: 'text' },
      { key: 'desc',  label: '描述', type: 'text' },
      { key: 'arrow', label: '箭头', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, 'weui-cell')}>
      <div class="weui-cell__bd">${p.title || '标题'}</div>
      ${p.desc ? `<div class="weui-cell__ft" style="${p.arrow?'':'padding-right:0;'}">${p.desc}</div>` : p.arrow ? '<div class="weui-cell__ft"></div>' : ''}
    </div>`;
  },
});

register({
  id: 'mp-cell-group',
  name: 'CellGroup 列表',
  category: '布局',
  icon: '▤',
  canHaveChildren: true,
  accept: ['mp-cell'],
  defaultProps: { title: '' },
  defaultStyle: {},
  schema: {
    props: [{ key: 'title', label: '分组标题', type: 'text' }],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node)}>
      ${p.title ? `<div style="padding:12px 16px 8px;font-size:12px;color:var(--weui-fg-2);">${p.title}</div>` : ''}
      <div class="weui-cells">${node.childrenHtml || ''}</div>
    </div>`;
  },
});

register({
  id: 'mp-scrollview',
  name: 'ScrollView 滚动区',
  category: '布局',
  icon: '↕',
  canHaveChildren: true,
  defaultProps: { horizontal: false, height: 300 },
  schema: {
    props: [
      { key: 'horizontal', label: '水平滚动', type: 'boolean' },
      { key: 'height',     label: '高度 px', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const style = p.horizontal
      ? `display:flex;overflow-x:auto;height:auto;`
      : `overflow-y:auto;height:${p.height||300}px;`;
    return `<div ${nodeAttrs(node, '', `${style}`)}>${node.childrenHtml || ''}</div>`;
  },
});

register({
  id: 'mp-section',
  name: 'Section 区块',
  category: '布局',
  icon: '▨',
  canHaveChildren: true,
  defaultProps: { title: '区块标题', more: '查看更多' },
  defaultStyle: { background: 'var(--weui-bg-2)' },
  schema: {
    props: [
      { key: 'title', label: '标题', type: 'text' },
      { key: 'more',  label: '右侧文字', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node)}>
      <div style="padding:12px 16px 8px;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:16px;font-weight:600;color:var(--weui-fg-0);">${p.title || ''}</span>
        ${p.more ? `<span style="font-size:12px;color:var(--weui-fg-2);">${p.more} ›</span>` : ''}
      </div>
      <div>${node.childrenHtml || ''}</div>
    </div>`;
  },
});

register({
  id: 'mp-spacer',
  name: 'Spacer 占位',
  category: '布局',
  icon: '␣',
  canHaveChildren: false,
  defaultProps: { height: 16 },
  schema: {
    props: [{ key: 'height', label: '高度 px', type: 'number' }],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `height:${p.height||16}px;`)}></div>`;
  },
});
