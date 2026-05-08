/**
 * 导航：Navbar / SearchBar / TabBar / Capsule / Breadcrumb
 */
import { register, nodeAttrs } from './registry.js';

register({
  id: 'mp-navbar',
  name: 'Navbar 导航栏',
  category: '导航',
  icon: '▔',
  defaultProps: { title: '标题', showBack: true, rightText: '' },
  schema: {
    props: [
      { key: 'title',     label: '标题', type: 'text' },
      { key: 'showBack',  label: '返回按钮', type: 'boolean' },
      { key: 'rightText', label: '右侧文字', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `height:44px;background:var(--weui-bg-2);display:flex;align-items:center;padding:0 16px;border-bottom:1px solid var(--weui-separator);position:relative;`)}>
      ${p.showBack ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>' : ''}
      <div style="flex:1;text-align:center;font-size:17px;font-weight:600;color:var(--weui-fg-0);">${p.title||''}</div>
      ${p.rightText ? `<span style="font-size:14px;color:var(--weui-brand);">${p.rightText}</span>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-searchbar',
  name: 'SearchBar 搜索栏',
  category: '导航',
  icon: '🔍',
  defaultProps: { placeholder: '搜索商品、店铺', showCancel: false },
  schema: {
    props: [
      { key: 'placeholder', label: '占位符', type: 'text' },
      { key: 'showCancel',  label: '显示取消', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, 'weui-search-bar')}>
      <input class="weui-search-input" placeholder="${p.placeholder||'搜索'}" readonly />
      ${p.showCancel ? '<button style="background:none;border:none;color:var(--weui-brand);font-size:14px;padding:0 8px;">取消</button>' : ''}
    </div>`;
  },
});

register({
  id: 'mp-tabbar',
  name: 'TabBar 底栏',
  category: '导航',
  icon: '▁',
  defaultProps: { items: '首页|🏠,分类|⊞,购物车|🛒,我的|👤', active: 0 },
  schema: {
    props: [
      { key: 'items',  label: '标签（标签|图标,分隔）', type: 'text' },
      { key: 'active', label: '激活索引', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => {
      const [label, icon] = s.split('|').map(x => (x||'').trim());
      return { label, icon };
    });
    return `<div ${nodeAttrs(node, 'mp-tabbar', `position:static;`)} >
      ${items.map((it, i) => `
        <div class="mp-tabbar-item ${i === (p.active||0) ? 'active' : ''}">
          <span style="font-size:22px;">${it.icon||''}</span>
          <span>${it.label||''}</span>
        </div>
      `).join('')}
    </div>`;
  },
});

register({
  id: 'mp-capsule',
  name: 'Capsule 胶囊',
  category: '导航',
  icon: '⌘',
  defaultProps: {},
  schema: { props: [], style: [] },
  render(node) {
    return `<span ${nodeAttrs(node, 'mp-capsule', `position:static;transform:none;display:inline-flex;`)} >
      <div class="mp-capsule-btn"><span style="font-size:18px;">⋯</span></div>
      <div class="mp-capsule-divider"></div>
      <div class="mp-capsule-btn"><span style="font-size:18px;">○</span></div>
    </span>`;
  },
});

register({
  id: 'mp-breadcrumb',
  name: 'Breadcrumb 面包屑',
  category: '导航',
  icon: '›',
  defaultProps: { items: '首页,分类,商品' },
  schema: {
    props: [{ key: 'items', label: '路径（逗号）', type: 'text' }],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => s.trim()).filter(Boolean);
    return `<div ${nodeAttrs(node, '', `padding:8px 16px;font-size:13px;color:var(--weui-fg-2);`)}>
      ${items.map((t, i) => i === items.length-1 ? `<span style="color:var(--weui-fg-0);">${t}</span>` : `<span>${t}</span><span style="margin:0 6px;">›</span>`).join('')}
    </div>`;
  },
});
