/**
 * 页面级积木：Swiper / GridMenu / HomeHeader / Empty / Pagination / Footer
 */
import { register, nodeAttrs } from './registry.js';

register({
  id: 'mp-swiper',
  name: 'Swiper 轮播',
  category: '页面积木',
  icon: '◧',
  defaultProps: { slides: '春季新品|🌸,夏季清凉|☀️,秋冬上新|🍂', dots: true, active: 0 },
  schema: {
    props: [
      { key: 'slides', label: '帧（标题|emoji,分隔）', type: 'textarea' },
      { key: 'dots',   label: '指示点', type: 'boolean' },
      { key: 'active', label: '当前帧', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const slides = (p.slides || '').split(',').map(s => {
      const [title, emoji] = s.split('|').map(x => (x||'').trim());
      return { title, emoji };
    });
    const cur = slides[p.active || 0] || slides[0] || { title: '', emoji: '' };
    return `<div ${nodeAttrs(node, 'mp-swiper', `margin:8px 12px;height:140px;border-radius:8px;overflow:hidden;background:linear-gradient(135deg,var(--weui-brand) 0%,var(--weui-indigo) 100%);display:flex;align-items:center;justify-content:center;color:#fff;position:relative;`)} >
      <span style="font-size:18px;font-weight:600;">${cur.emoji||''} ${cur.title||''}</span>
      ${p.dots ? `<div class="mp-swiper-dots" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;">${slides.map((_, i) => `<div class="mp-swiper-dot ${i === (p.active||0) ? 'active' : ''}" style="width:${i === (p.active||0) ? '16px' : '6px'};height:6px;border-radius:3px;background:${i === (p.active||0) ? '#fff' : 'rgba(255,255,255,.4)'};"></div>`).join('')}</div>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-grid-menu',
  name: 'GridMenu 宫格菜单',
  category: '页面积木',
  icon: '⌗',
  defaultProps: { items: '特惠|🏷️,热销|🔥,新品|🆕,福利|🎁,秒杀|⚡,拼团|🎯,会员|💳,全部|📋', cols: 4 },
  schema: {
    props: [
      { key: 'items', label: '项（文字|emoji,分隔）', type: 'textarea' },
      { key: 'cols',  label: '列数', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => {
      const [text, emoji] = s.split('|').map(x => (x||'').trim());
      return { text, emoji };
    });
    return `<div ${nodeAttrs(node, 'weui-grid', `display:grid;grid-template-columns:repeat(${p.cols||4},1fr);background:var(--weui-bg-2);padding:16px 8px;`)} >
      ${items.map(it => `
        <div class="weui-grid-item" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 0;">
          <div class="weui-grid-item__icon" style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(7,193,96,.12);">${it.emoji||''}</div>
          <span class="weui-grid-item__text" style="font-size:11px;color:var(--weui-fg-1);">${it.text||''}</span>
        </div>
      `).join('')}
    </div>`;
  },
});

register({
  id: 'mp-empty',
  name: 'Empty 空状态',
  category: '页面积木',
  icon: '∅',
  defaultProps: { icon: '📭', title: '这里还没有数据', desc: '快去添加第一条记录吧', cta: '立即添加' },
  schema: {
    props: [
      { key: 'icon',  label: '图标', type: 'text' },
      { key: 'title', label: '标题', type: 'text' },
      { key: 'desc',  label: '描述', type: 'text' },
      { key: 'cta',   label: 'CTA', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `padding:64px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;`)}>
      <div style="font-size:64px;">${p.icon||'📭'}</div>
      <div style="font-size:16px;font-weight:500;color:var(--weui-fg-0);">${p.title||''}</div>
      ${p.desc ? `<div style="font-size:13px;color:var(--weui-fg-2);">${p.desc}</div>` : ''}
      ${p.cta ? `<button class="weui-btn weui-btn-primary" style="width:140px;height:36px;font-size:14px;margin-top:8px;">${p.cta}</button>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-pagination',
  name: 'Pagination 分页',
  category: '页面积木',
  icon: '⋯',
  defaultProps: { current: 3, total: 10 },
  schema: {
    props: [
      { key: 'current', label: '当前页', type: 'number' },
      { key: 'total',   label: '总页数', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const cur = p.current || 1, total = p.total || 1;
    return `<div ${nodeAttrs(node, '', `padding:16px;display:flex;gap:8px;justify-content:center;align-items:center;`)}>
      <button style="width:32px;height:32px;border:1px solid var(--weui-separator);background:var(--weui-bg-2);border-radius:4px;${cur<=1?'opacity:.4;':''}">‹</button>
      <span style="font-size:13px;color:var(--weui-fg-1);">${cur} / ${total}</span>
      <button style="width:32px;height:32px;border:1px solid var(--weui-separator);background:var(--weui-bg-2);border-radius:4px;${cur>=total?'opacity:.4;':''}">›</button>
    </div>`;
  },
});

register({
  id: 'mp-footer',
  name: 'Footer 底部固定栏',
  category: '页面积木',
  icon: '▁',
  defaultProps: { btnLabel: '立即购买', secondaryLabel: '加入购物车', showFavor: true },
  schema: {
    props: [
      { key: 'btnLabel',       label: '主按钮', type: 'text' },
      { key: 'secondaryLabel', label: '次按钮', type: 'text' },
      { key: 'showFavor',      label: '显示收藏', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `position:static;display:flex;background:var(--weui-bg-2);border-top:1px solid var(--weui-separator);padding:8px 12px;gap:8px;`)}>
      ${p.showFavor ? `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:48px;"><span style="font-size:18px;">♡</span><span style="font-size:10px;color:var(--weui-fg-2);">收藏</span></div>` : ''}
      ${p.secondaryLabel ? `<button class="weui-btn weui-btn-default" style="flex:1;height:40px;font-size:14px;width:auto;margin:0;">${p.secondaryLabel}</button>` : ''}
      ${p.btnLabel ? `<button class="weui-btn weui-btn-primary" style="flex:1;height:40px;font-size:14px;width:auto;margin:0;">${p.btnLabel}</button>` : ''}
    </div>`;
  },
});

register({
  id: 'mp-filter-bar',
  name: 'FilterBar 筛选',
  category: '页面积木',
  icon: '≡',
  defaultProps: { items: '综合|active,销量,价格 ↑,筛选' },
  schema: {
    props: [{ key: 'items', label: '项（逗号；标 active 标记当前）', type: 'text' }],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const items = (p.items || '').split(',').map(s => {
      const active = s.includes('|active');
      return { text: s.replace('|active','').trim(), active };
    });
    return `<div ${nodeAttrs(node, '', `display:flex;background:var(--weui-bg-2);padding:10px 16px;border-bottom:1px solid var(--weui-separator);`)}>
      ${items.map(it => `<span style="flex:1;text-align:center;font-size:14px;${it.active?'color:var(--weui-brand);font-weight:500;':'color:var(--weui-fg-1);'}">${it.text}</span>`).join('')}
    </div>`;
  },
});
