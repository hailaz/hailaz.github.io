/**
 * 反馈/交互组件：Modal / Toast / Loading / ActionSheet / Msg / Skeleton / EmptyState / Alert
 */
import { register, nodeAttrs } from './registry.js';

register({
  id: 'mp-modal',
  name: 'Modal 对话框',
  category: '反馈',
  icon: '🗨️',
  defaultProps: { title: '提示', content: '确认要删除这条数据吗？', cancel: '取消', confirm: '删除', danger: true },
  schema: {
    props: [
      { key: 'title',   label: '标题', type: 'text' },
      { key: 'content', label: '内容', type: 'textarea' },
      { key: 'cancel',  label: '取消文字', type: 'text' },
      { key: 'confirm', label: '确认文字', type: 'text' },
      { key: 'danger',  label: '危险色', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `margin:24px;background:var(--weui-bg-2);border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.12);`)}>
      <div style="padding:24px 16px 16px;text-align:center;">
        <div style="font-size:17px;font-weight:500;color:var(--weui-fg-0);margin-bottom:8px;">${p.title||''}</div>
        <div style="font-size:14px;color:var(--weui-fg-1);line-height:1.5;">${p.content||''}</div>
      </div>
      <div style="display:flex;border-top:1px solid var(--weui-separator);">
        <div style="flex:1;padding:14px;text-align:center;font-size:16px;color:var(--weui-fg-1);border-right:1px solid var(--weui-separator);cursor:pointer;">${p.cancel||'取消'}</div>
        <div style="flex:1;padding:14px;text-align:center;font-size:16px;color:${p.danger?'var(--weui-red)':'var(--weui-brand)'};cursor:pointer;">${p.confirm||'确认'}</div>
      </div>
    </div>`;
  },
});

register({
  id: 'mp-toast',
  name: 'Toast 提示',
  category: '反馈',
  icon: '💬',
  defaultProps: { text: '操作成功', icon: 'success' },
  schema: {
    props: [
      { key: 'text', label: '文字', type: 'text' },
      { key: 'icon', label: '图标', type: 'select', options: ['success','error','loading','none'] },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const icons = {
      success: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>',
      error:   '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      loading: '<span style="display:inline-block;width:32px;height:32px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;"></span>',
      none: '',
    };
    return `<div ${nodeAttrs(node, '', `margin:40px auto;width:120px;background:rgba(0,0,0,.75);color:#fff;border-radius:8px;padding:20px 12px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;`)}>
      ${icons[p.icon] || ''}
      <span style="font-size:14px;">${p.text||''}</span>
    </div>`;
  },
});

register({
  id: 'mp-loading',
  name: 'Loading 加载',
  category: '反馈',
  icon: '⟳',
  defaultProps: { text: '加载中...', mode: 'spinner' },
  schema: {
    props: [
      { key: 'text', label: '文字', type: 'text' },
      { key: 'mode', label: '样式', type: 'select', options: ['spinner','dots','bar','skeleton'] },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const body = p.mode === 'dots'
      ? `<span style="display:inline-flex;gap:4px;"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--weui-brand);animation:bounce 1.4s infinite;"></span><span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--weui-brand);animation:bounce 1.4s infinite .2s;"></span><span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--weui-brand);animation:bounce 1.4s infinite .4s;"></span></span>`
      : p.mode === 'bar'
      ? `<span style="width:80px;height:3px;background:var(--weui-bg-0);border-radius:2px;overflow:hidden;display:inline-block;"><span style="display:block;width:40%;height:100%;background:var(--weui-brand);animation:slide 1.2s infinite;"></span></span>`
      : p.mode === 'skeleton'
      ? `<div style="width:200px;display:flex;flex-direction:column;gap:8px;"><span class="weui-skeleton" style="height:14px;width:60%;"></span><span class="weui-skeleton" style="height:10px;width:100%;"></span><span class="weui-skeleton" style="height:10px;width:80%;"></span></div>`
      : `<span class="weui-loading"></span>`;
    return `<div ${nodeAttrs(node, '', `padding:32px;text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center;`)}>
      ${body}
      ${p.text ? `<span style="font-size:13px;color:var(--weui-fg-1);">${p.text}</span>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-actionsheet',
  name: 'ActionSheet',
  category: '反馈',
  icon: '📋',
  defaultProps: { items: '拍照,从相册选择', destructive: '删除', cancel: '取消' },
  schema: {
    props: [
      { key: 'items',       label: '选项（逗号）', type: 'text' },
      { key: 'destructive', label: '危险项', type: 'text' },
      { key: 'cancel',      label: '取消文字', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => s.trim()).filter(Boolean);
    return `<div ${nodeAttrs(node, '', `margin:12px;`)}>
      <div style="background:var(--weui-bg-2);border-radius:12px;overflow:hidden;">
        ${items.map(t => `<div class="weui-actionsheet__action">${t}</div>`).join('')}
        ${p.destructive ? `<div class="weui-actionsheet__action destructive">${p.destructive}</div>` : ''}
      </div>
      ${p.cancel ? `<div style="margin-top:8px;background:var(--weui-bg-2);border-radius:12px;padding:16px;text-align:center;font-size:17px;color:var(--weui-fg-0);">${p.cancel}</div>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-msg',
  name: 'Msg 结果页',
  category: '反馈',
  icon: '🎯',
  defaultProps: { icon: '✓', title: '操作成功', desc: '你的订单已提交成功，商家将尽快处理', cta: '查看订单', iconColor: 'var(--weui-brand)' },
  schema: {
    props: [
      { key: 'icon',      label: '图标 emoji/svg', type: 'text' },
      { key: 'title',     label: '标题', type: 'text' },
      { key: 'desc',      label: '描述', type: 'textarea' },
      { key: 'cta',       label: 'CTA 文字', type: 'text' },
      { key: 'iconColor', label: '图标色', type: 'color' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, 'weui-msg')}>
      <div style="font-size:60px;margin-bottom:20px;color:${p.iconColor||'var(--weui-brand)'};">${p.icon||'✓'}</div>
      <div class="weui-msg__title">${p.title||''}</div>
      <div class="weui-msg__desc">${p.desc||''}</div>
      ${p.cta ? `<button class="weui-btn weui-btn-primary" style="width:140px;height:36px;font-size:14px;">${p.cta}</button>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-alert',
  name: 'Alert 提示条',
  category: '反馈',
  icon: 'ⓘ',
  defaultProps: { type: 'info', content: '这是一条提示信息' },
  schema: {
    props: [
      { key: 'type',    label: '类型', type: 'select', options: ['info','success','warning','error'] },
      { key: 'content', label: '内容', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const colors = {
      info:    { bg:'rgba(16,174,255,.08)',  fg:'var(--weui-blue,var(--color-info-500))', icon:'ⓘ' },
      success: { bg:'rgba(7,193,96,.08)',    fg:'var(--weui-brand)', icon:'✓' },
      warning: { bg:'rgba(250,157,59,.08)',  fg:'var(--weui-orange)', icon:'⚠' },
      error:   { bg:'rgba(250,81,81,.08)',   fg:'var(--weui-red)', icon:'✕' },
    };
    const c = colors[p.type || 'info'];
    return `<div ${nodeAttrs(node, '', `margin:8px 12px;padding:10px 12px;background:${c.bg};border-radius:6px;display:flex;gap:8px;align-items:flex-start;`)}>
      <span style="color:${c.fg};font-size:16px;font-weight:700;line-height:1.2;">${c.icon}</span>
      <span style="flex:1;font-size:13px;color:var(--weui-fg-0);line-height:1.5;">${p.content||''}</span>
    </div>`;
  },
});

register({
  id: 'mp-skeleton',
  name: 'Skeleton 骨架屏',
  category: '反馈',
  icon: '░',
  defaultProps: { rows: 3, avatar: true },
  schema: {
    props: [
      { key: 'rows',   label: '行数', type: 'number' },
      { key: 'avatar', label: '含头像', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `padding:16px;background:var(--weui-bg-2);display:flex;gap:12px;`)}>
      ${p.avatar ? '<span class="weui-skeleton" style="width:40px;height:40px;border-radius:50%;flex-shrink:0;"></span>' : ''}
      <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
        ${Array.from({length:p.rows||3}).map((_,i) => `<span class="weui-skeleton" style="height:12px;width:${100 - i*15}%;"></span>`).join('')}
      </div>
    </div>`;
  },
});
