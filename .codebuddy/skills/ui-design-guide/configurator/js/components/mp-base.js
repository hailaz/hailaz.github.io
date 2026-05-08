/**
 * 小程序基础组件（WeUI 风格）
 * 15 个：Button / Input / Textarea / Switch / Checkbox / Radio / Slider / Icon / Image / Text / Title / Divider / Link / Badge / Tag
 */

import { register, nodeAttrs, renderNode } from './registry.js';

/* ====== 容器（根节点类型，永远存在） ====== */
register({
  id: 'container',
  name: 'Container',
  category: '容器',
  icon: '📦',
  canHaveChildren: true,
  defaultProps: {},
  defaultStyle: { padding: '0' },
  schema: {
    props: [],
    style: [
      { key: 'padding',   label: '内边距', type: 'text' },
      { key: 'background',label: '背景色', type: 'color' },
      { key: 'minHeight', label: '最小高度', type: 'text' },
    ],
  },
  render(node) {
    return `<div ${nodeAttrs(node, 'node-container')}>${node.childrenHtml || ''}</div>`;
  },
  thumbnail: '<div style="width:40px;height:40px;border:2px dashed #999;border-radius:4px;"></div>',
});

/* ====== Button ====== */
register({
  id: 'mp-button',
  name: 'Button 按钮',
  category: '基础',
  icon: '🔘',
  defaultProps: { text: '按钮', variant: 'primary', size: 'default', block: true, loading: false, disabled: false },
  defaultStyle: {},
  schema: {
    props: [
      { key: 'text',     label: '文本', type: 'text' },
      { key: 'variant',  label: '类型', type: 'select', options: ['primary','default','warn'] },
      { key: 'size',     label: '尺寸', type: 'select', options: ['default','mini'] },
      { key: 'block',    label: '占满宽度', type: 'boolean' },
      { key: 'loading',  label: '加载中', type: 'boolean' },
      { key: 'disabled', label: '禁用', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const cls = [
      'weui-btn',
      `weui-btn-${p.variant || 'primary'}`,
      p.size === 'mini' ? 'weui-btn-mini' : '',
      p.disabled ? 'disabled' : '',
    ].filter(Boolean).join(' ');
    const style = !p.block ? 'width:auto;display:inline-flex;padding:0 24px;' : '';
    return `<button ${nodeAttrs(node, cls, style)} ${p.disabled ? 'disabled' : ''}>
      ${p.loading ? '<span class="weui-loading" style="width:14px;height:14px;margin-right:6px;"></span>' : ''}${p.text || '按钮'}
    </button>`;
  },
});

/* ====== Input ====== */
register({
  id: 'mp-input',
  name: 'Input 输入框',
  category: '基础',
  icon: '⌨️',
  defaultProps: { placeholder: '请输入', type: 'text', value: '', label: '', disabled: false },
  schema: {
    props: [
      { key: 'label',       label: '标签', type: 'text' },
      { key: 'placeholder', label: '占位符', type: 'text' },
      { key: 'type',        label: '类型', type: 'select', options: ['text','number','tel','password'] },
      { key: 'value',       label: '默认值', type: 'text' },
      { key: 'disabled',    label: '禁用', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, 'weui-form-cell')}>
      ${p.label ? `<span class="weui-form-label">${p.label}</span>` : ''}
      <input class="weui-form-input" type="${p.type || 'text'}" placeholder="${p.placeholder || ''}" value="${p.value || ''}" ${p.disabled ? 'disabled' : ''} />
    </div>`;
  },
});

/* ====== Textarea ====== */
register({
  id: 'mp-textarea',
  name: 'Textarea 多行',
  category: '基础',
  icon: '📝',
  defaultProps: { placeholder: '请输入', rows: 3, maxlength: 200 },
  schema: {
    props: [
      { key: 'placeholder', label: '占位符', type: 'text' },
      { key: 'rows',        label: '行数', type: 'number' },
      { key: 'maxlength',   label: '最大字数', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, 'weui-form-cell', 'flex-direction:column;align-items:stretch;')}>
      <textarea class="weui-form-input" rows="${p.rows || 3}" placeholder="${p.placeholder || ''}" maxlength="${p.maxlength || 200}" style="resize:vertical;padding:8px 0;"></textarea>
    </div>`;
  },
});

/* ====== Switch ====== */
register({
  id: 'mp-switch',
  name: 'Switch 开关',
  category: '基础',
  icon: '🔀',
  defaultProps: { label: '开关', checked: true, disabled: false },
  schema: {
    props: [
      { key: 'label',    label: '标签', type: 'text' },
      { key: 'checked',  label: '开启', type: 'boolean' },
      { key: 'disabled', label: '禁用', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, 'weui-cell')}>
      <div class="weui-cell__bd">${p.label || '开关'}</div>
      <div class="weui-cell__ft" style="padding:0;">
        <span class="weui-switch ${p.checked ? 'on' : ''} ${p.disabled ? 'disabled' : ''}" style="
          display:inline-block;width:40px;height:22px;border-radius:11px;position:relative;
          background:${p.checked ? 'var(--weui-brand)' : '#ccc'};
          transition:background .2s;${p.disabled ? 'opacity:.5;' : ''}">
          <span style="
            position:absolute;top:2px;left:${p.checked ? '20px' : '2px'};
            width:18px;height:18px;background:#fff;border-radius:50%;
            box-shadow:0 1px 2px rgba(0,0,0,.15);transition:left .2s;"></span>
        </span>
      </div>
    </div>`;
  },
});

/* ====== Checkbox ====== */
register({
  id: 'mp-checkbox',
  name: 'Checkbox 复选',
  category: '基础',
  icon: '☑️',
  defaultProps: { label: '选项', checked: false, disabled: false },
  schema: {
    props: [
      { key: 'label',    label: '标签', type: 'text' },
      { key: 'checked',  label: '选中', type: 'boolean' },
      { key: 'disabled', label: '禁用', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<label ${nodeAttrs(node, 'weui-cell', `cursor:pointer;`)} >
      <div class="weui-cell__hd" style="margin-right:12px;">
        <span style="display:inline-flex;width:20px;height:20px;border:2px solid ${p.checked ? 'var(--weui-brand)' : '#ccc'};border-radius:4px;background:${p.checked ? 'var(--weui-brand)' : 'transparent'};align-items:center;justify-content:center;color:#fff;font-size:12px;">${p.checked ? '✓' : ''}</span>
      </div>
      <div class="weui-cell__bd">${p.label || '选项'}</div>
    </label>`;
  },
});

/* ====== Radio ====== */
register({
  id: 'mp-radio',
  name: 'Radio 单选',
  category: '基础',
  icon: '⚪',
  defaultProps: { label: '选项', checked: false },
  schema: {
    props: [
      { key: 'label',   label: '标签', type: 'text' },
      { key: 'checked', label: '选中', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<label ${nodeAttrs(node, 'weui-cell', `cursor:pointer;`)} >
      <div class="weui-cell__hd" style="margin-right:12px;">
        <span style="display:inline-flex;width:20px;height:20px;border:2px solid ${p.checked ? 'var(--weui-brand)' : '#ccc'};border-radius:50%;align-items:center;justify-content:center;">
          ${p.checked ? '<span style="width:10px;height:10px;background:var(--weui-brand);border-radius:50%;"></span>' : ''}
        </span>
      </div>
      <div class="weui-cell__bd">${p.label || '选项'}</div>
    </label>`;
  },
});

/* ====== Slider ====== */
register({
  id: 'mp-slider',
  name: 'Slider 滑块',
  category: '基础',
  icon: '🎚️',
  defaultProps: { label: '进度', value: 50, min: 0, max: 100 },
  schema: {
    props: [
      { key: 'label', label: '标签', type: 'text' },
      { key: 'value', label: '值', type: 'number' },
      { key: 'min',   label: '最小', type: 'number' },
      { key: 'max',   label: '最大', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const pct = Math.round(((p.value - p.min) / (p.max - p.min)) * 100);
    return `<div ${nodeAttrs(node, '', `padding:12px 16px;background:var(--weui-bg-2);`)}>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:14px;color:var(--weui-fg-1);min-width:40px;">${p.label || ''}</span>
        <div style="flex:1;height:4px;background:var(--weui-bg-0);border-radius:2px;position:relative;">
          <div style="width:${pct}%;height:100%;background:var(--weui-brand);border-radius:2px;"></div>
          <div style="position:absolute;left:${pct}%;top:50%;transform:translate(-50%,-50%);width:20px;height:20px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.15);"></div>
        </div>
        <span style="font-size:14px;color:var(--weui-fg-0);min-width:32px;text-align:right;">${p.value}</span>
      </div>
    </div>`;
  },
});

/* ====== Icon ====== */
register({
  id: 'mp-icon',
  name: 'Icon 图标',
  category: '基础',
  icon: '⭐',
  defaultProps: { symbol: '⭐', size: 24, color: '' },
  schema: {
    props: [
      { key: 'symbol', label: '图标', type: 'text' },
      { key: 'size',   label: '尺寸 px', type: 'number' },
      { key: 'color',  label: '颜色', type: 'color' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<span ${nodeAttrs(node, '', `display:inline-block;font-size:${p.size || 24}px;${p.color ? `color:${p.color};` : ''}`)}>${p.symbol || '⭐'}</span>`;
  },
});

/* ====== Image ====== */
register({
  id: 'mp-image',
  name: 'Image 图片',
  category: '基础',
  icon: '🖼️',
  defaultProps: { src: '', alt: '图片', mode: 'aspectFill', w: 120, h: 120 },
  schema: {
    props: [
      { key: 'src',  label: '图片 URL', type: 'text' },
      { key: 'alt',  label: '替代文本', type: 'text' },
      { key: 'mode', label: '模式', type: 'select', options: ['aspectFit','aspectFill','widthFix','cover','contain'] },
      { key: 'w',    label: '宽 px', type: 'number' },
      { key: 'h',    label: '高 px', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const objectFit = p.mode === 'aspectFit' ? 'contain' : p.mode === 'aspectFill' ? 'cover' : p.mode;
    const style = `width:${p.w}px;height:${p.h}px;object-fit:${objectFit};background:var(--weui-bg-0);border-radius:6px;`;
    if (p.src) {
      return `<img ${nodeAttrs(node)} src="${p.src}" alt="${p.alt}" style="${style}" />`;
    }
    return `<div ${nodeAttrs(node, '', `${style}display:flex;align-items:center;justify-content:center;color:var(--weui-fg-2);font-size:${Math.min(p.w, p.h) / 3}px;`)}>📦</div>`;
  },
});

/* ====== Text ====== */
register({
  id: 'mp-text',
  name: 'Text 文本',
  category: '基础',
  icon: '📄',
  defaultProps: { text: '这是一段文本', size: 'base', weight: 'regular', color: '' },
  schema: {
    props: [
      { key: 'text',   label: '文本', type: 'textarea' },
      { key: 'size',   label: '字号', type: 'select', options: ['xs','sm','base','lg','xl','2xl','3xl'] },
      { key: 'weight', label: '字重', type: 'select', options: ['regular','medium','semibold','bold'] },
      { key: 'color',  label: '颜色', type: 'color' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const style = `font-size:var(--font-size-${p.size || 'base'});font-weight:var(--weight-${p.weight || 'regular'});${p.color ? `color:${p.color};` : 'color:var(--weui-fg-0);'}`;
    return `<span ${nodeAttrs(node, '', `${style}`)}>${p.text || ''}</span>`;
  },
});

/* ====== Title ====== */
register({
  id: 'mp-title',
  name: 'Title 标题',
  category: '基础',
  icon: '🔠',
  defaultProps: { text: '标题', level: 2 },
  schema: {
    props: [
      { key: 'text',  label: '标题', type: 'text' },
      { key: 'level', label: '级别', type: 'select', options: ['1','2','3','4'] },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const sizes = { '1':'2xl','2':'xl','3':'lg','4':'base' };
    return `<h${p.level || 2} ${nodeAttrs(node, '', `margin:0;padding:8px 16px;font-size:var(--font-size-${sizes[p.level] || 'xl'});font-weight:var(--weight-bold);color:var(--weui-fg-0);`)}>${p.text || '标题'}</h${p.level || 2}>`;
  },
});

/* ====== Divider ====== */
register({
  id: 'mp-divider',
  name: 'Divider 分割线',
  category: '基础',
  icon: '➖',
  defaultProps: { text: '' },
  schema: {
    props: [{ key: 'text', label: '居中文字', type: 'text' }],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    if (p.text) {
      return `<div ${nodeAttrs(node, '', `display:flex;align-items:center;padding:12px 16px;color:var(--weui-fg-2);font-size:12px;gap:8px;`)}>
        <span style="flex:1;height:1px;background:var(--weui-separator);"></span>
        <span>${p.text}</span>
        <span style="flex:1;height:1px;background:var(--weui-separator);"></span>
      </div>`;
    }
    return `<div ${nodeAttrs(node, '', `height:1px;background:var(--weui-separator);margin:0 16px;`)}></div>`;
  },
});

/* ====== Link ====== */
register({
  id: 'mp-link',
  name: 'Link 链接',
  category: '基础',
  icon: '🔗',
  defaultProps: { text: '查看详情', href: '#' },
  schema: {
    props: [
      { key: 'text', label: '文字', type: 'text' },
      { key: 'href', label: '链接', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<a ${nodeAttrs(node)} href="${p.href || '#'}" style="color:var(--weui-link);text-decoration:none;font-size:14px;">${p.text || ''}</a>`;
  },
});

/* ====== Badge ====== */
register({
  id: 'mp-badge',
  name: 'Badge 徽章',
  category: '基础',
  icon: '🔴',
  defaultProps: { text: '8', dot: false },
  schema: {
    props: [
      { key: 'text', label: '内容', type: 'text' },
      { key: 'dot',  label: '点状', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    if (p.dot) {
      return `<span ${nodeAttrs(node, 'weui-badge weui-badge-dot')}></span>`;
    }
    return `<span ${nodeAttrs(node, 'weui-badge')}>${p.text || '8'}</span>`;
  },
});

/* ====== Tag ====== */
register({
  id: 'mp-tag',
  name: 'Tag 标签',
  category: '基础',
  icon: '🏷️',
  defaultProps: { text: '标签', color: 'green' },
  schema: {
    props: [
      { key: 'text',  label: '文字', type: 'text' },
      { key: 'color', label: '颜色', type: 'select', options: ['green','orange','red','blue'] },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<span ${nodeAttrs(node, `weui-tag weui-tag-${p.color || 'green'}`)}>${p.text || '标签'}</span>`;
  },
});

/* ====== Avatar ====== */
register({
  id: 'mp-avatar',
  name: 'Avatar 头像',
  category: '基础',
  icon: '👤',
  defaultProps: { src: '', size: 'md', text: 'A' },
  schema: {
    props: [
      { key: 'src',  label: '图片 URL', type: 'text' },
      { key: 'text', label: '文字（无图时）', type: 'text' },
      { key: 'size', label: '尺寸', type: 'select', options: ['sm','md','lg'] },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const sizes = { sm: 32, md: 40, lg: 64 };
    const sz = sizes[p.size] || 40;
    const style = `width:${sz}px;height:${sz}px;border-radius:50%;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${sz/2.5}px;`;
    if (p.src) {
      return `<img ${nodeAttrs(node)} src="${p.src}" style="${style}object-fit:cover;" />`;
    }
    return `<span ${nodeAttrs(node, '', `${style}background:linear-gradient(135deg,var(--weui-brand),var(--weui-indigo));`)}>${p.text || 'A'}</span>`;
  },
});
