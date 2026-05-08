/**
 * 页面模板：为新建页面预置组件树
 */
import { state, findNode, bus } from '../core/state.js';
import { nid } from '../core/id.js';
import { get as getComponent } from '../components/registry.js';

function createNode(type, props = {}, children = []) {
  const def = getComponent(type);
  return {
    id: nid(type.replace('mp-','')),
    type,
    props: { ...(def?.defaultProps || {}), ...props },
    style: { ...(def?.defaultStyle || {}) },
    effects: [],
    children,
  };
}

const templates = {
  home: () => [
    createNode('mp-searchbar', { placeholder: '搜索商品、店铺' }),
    createNode('mp-swiper',    { slides: '春季新品|🌸,夏季清凉|☀️,秋冬上新|🍂', dots: true }),
    createNode('mp-grid-menu', { items: '特惠|🏷️,热销|🔥,新品|🆕,福利|🎁,秒杀|⚡,拼团|🎯,会员|💳,全部|📋', cols: 4 }),
    createNode('mp-section', { title: '为你推荐', more: '查看更多' }, [
      createNode('mp-grid', { cols: 2, gap: 8 }, [
        createNode('mp-goods-card', { title: '无线蓝牙耳机 降噪版', price: '199', original: '399', tag: '热销' }),
        createNode('mp-goods-card', { title: '智能手表 运动版', price: '599', tag: '新品' }),
      ]),
    ]),
  ],
  list: () => [
    createNode('mp-searchbar'),
    createNode('mp-filter-bar', { items: '综合|active,销量,价格 ↑,筛选' }),
    createNode('mp-grid', { cols: 2, gap: 8 }, [
      createNode('mp-goods-card', { title: '无线蓝牙耳机 降噪版', price: '199', tag: '热销' }),
      createNode('mp-goods-card', { title: '智能手表 运动版', price: '599', tag: '新品' }),
      createNode('mp-goods-card', { title: '便携充电宝', price: '89', tag: '特惠' }),
      createNode('mp-goods-card', { title: '机械键盘', price: '329' }),
    ]),
  ],
  detail: () => [
    createNode('mp-image', { w: 375, h: 375 }),
    createNode('mp-price', { current: '199', original: '399', discount: '5折' }),
    createNode('mp-title', { text: '无线蓝牙耳机 主动降噪 超长续航', level: 3 }),
    createNode('mp-cell-group', {}, [
      createNode('mp-kv', { label: '规格', value: '黑色 / 标准版' }),
      createNode('mp-kv', { label: '配送', value: '深圳 · 包邮' }),
      createNode('mp-kv', { label: '服务', value: '7天无理由 · 运费险' }),
    ]),
    createNode('mp-comment', { name: '用户***8', time: '3天前', content: '音质很好，降噪效果出色！', stars: 5 }),
    createNode('mp-footer', { btnLabel: '立即购买', secondaryLabel: '加入购物车', showFavor: true }),
  ],
  form: () => [
    createNode('mp-cell-group', { title: '基本信息' }, [
      createNode('mp-input', { label: '姓名', placeholder: '请输入' }),
      createNode('mp-input', { label: '手机号', placeholder: '请输入手机号', type: 'tel' }),
      createNode('mp-input', { label: '邮箱', placeholder: '请输入邮箱' }),
    ]),
    createNode('mp-cell-group', { title: '偏好设置' }, [
      createNode('mp-switch',   { label: '接收推送', checked: true }),
      createNode('mp-switch',   { label: '允许个性化推荐', checked: false }),
      createNode('mp-textarea', { placeholder: '个人简介', rows: 4 }),
    ]),
    createNode('mp-spacer', { height: 24 }),
    createNode('mp-button', { text: '提交', variant: 'primary', block: true }),
  ],
  mine: () => [
    createNode('mp-user-card', { name: 'Alice', desc: 'VIP 会员 · 999 积分', avatar: 'A' }),
    createNode('mp-flex', { direction: 'row', justify: 'space-around', align: 'center', gap: 0 }, [
      createNode('mp-stat', { label: '待付款', value: '12', suffix: '', trend: '' }),
      createNode('mp-stat', { label: '待收货', value: '3', trend: '' }),
      createNode('mp-stat', { label: '已完成', value: '28', trend: '' }),
      createNode('mp-stat', { label: '售后', value: '2', trend: '' }),
    ]),
    createNode('mp-cell-group', {}, [
      createNode('mp-cell', { title: '我的订单', desc: '全部订单', arrow: true }),
      createNode('mp-cell', { title: '收货地址', arrow: true }),
      createNode('mp-cell', { title: '优惠券', desc: '3张可用', arrow: true }),
      createNode('mp-cell', { title: '设置', arrow: true }),
    ]),
    createNode('mp-tabbar', { items: '首页|🏠,分类|⊞,购物车|🛒,我的|👤', active: 3 }),
  ],
};

export function applyTemplate(pageId, tpl) {
  if (!state.project) return;
  const page = state.project.pages.find(p => p.id === pageId);
  if (!page) return;
  const factory = templates[tpl];
  if (!factory) return;
  page.root.children = factory();
  bus.emit('project:changed');
}
