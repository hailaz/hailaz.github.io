/**
 * 业务组件：GoodsCard / OrderCard / UserCard / CommentCard / ChatBubble / Coupon / RedPacket / AddressCard / NotificationCard / LiveCard
 */
import { register, nodeAttrs } from './registry.js';

register({
  id: 'mp-goods-card',
  name: 'GoodsCard 商品卡',
  category: '业务',
  icon: '🛍',
  defaultProps: { title: '无线蓝牙耳机 降噪版', price: '199', original: '399', tag: '热销', sold: '2.3万已售' },
  schema: {
    props: [
      { key: 'title',    label: '标题', type: 'text' },
      { key: 'price',    label: '价格', type: 'text' },
      { key: 'original', label: '原价', type: 'text' },
      { key: 'tag',      label: '标签', type: 'text' },
      { key: 'sold',     label: '销量', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, 'mp-goods-card', `margin:8px;`)} >
      <div class="mp-goods-card__img" style="position:relative;">
        📦 ${p.tag ? `<span class="weui-tag weui-tag-red" style="position:absolute;top:6px;left:6px;">${p.tag}</span>` : ''}
      </div>
      <div class="mp-goods-card__info">
        <div class="mp-goods-card__title">${p.title||''}</div>
        <div style="display:flex;align-items:baseline;gap:4px;margin-top:4px;">
          <span class="mp-goods-card__price">¥${p.price||''}</span>
          ${p.original ? `<span style="font-size:11px;color:var(--weui-fg-2);text-decoration:line-through;">¥${p.original}</span>` : ''}
        </div>
        ${p.sold ? `<div style="font-size:11px;color:var(--weui-fg-2);margin-top:2px;">${p.sold}</div>` : ''}
      </div>
    </div>`;
  },
});

register({
  id: 'mp-order-card',
  name: 'OrderCard 订单',
  category: '业务',
  icon: '📦',
  defaultProps: { orderId: '20260507001', status: '已完成', statusColor: 'green', goodsName: '无线蓝牙耳机 降噪版', price: '199', qty: 1 },
  schema: {
    props: [
      { key: 'orderId',     label: '订单号', type: 'text' },
      { key: 'status',      label: '状态', type: 'text' },
      { key: 'statusColor', label: '状态色', type: 'select', options: ['green','orange','red','blue'] },
      { key: 'goodsName',   label: '商品', type: 'text' },
      { key: 'price',       label: '价格', type: 'text' },
      { key: 'qty',         label: '数量', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `background:var(--weui-bg-2);margin-top:8px;padding:12px 16px;`)}>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span style="font-size:12px;color:var(--weui-fg-2);">订单号: ${p.orderId||''}</span>
        <span class="weui-tag weui-tag-${p.statusColor||'green'}">${p.status||''}</span>
      </div>
      <div style="display:flex;gap:10px;">
        <div style="width:64px;height:64px;background:var(--weui-bg-0);border-radius:6px;display:flex;align-items:center;justify-content:center;">📦</div>
        <div style="flex:1;">
          <div style="font-size:14px;">${p.goodsName||''}</div>
          <div style="display:flex;justify-content:space-between;margin-top:4px;">
            <span style="font-weight:600;">¥${p.price||''}</span>
            <span style="font-size:12px;color:var(--weui-fg-2);">×${p.qty||1}</span>
          </div>
        </div>
      </div>
    </div>`;
  },
});

register({
  id: 'mp-user-card',
  name: 'UserCard 用户',
  category: '业务',
  icon: '👤',
  defaultProps: { name: 'Alice', desc: 'VIP 会员', avatar: 'A' },
  schema: {
    props: [
      { key: 'name',   label: '姓名', type: 'text' },
      { key: 'desc',   label: '描述', type: 'text' },
      { key: 'avatar', label: '头像文字', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `padding:20px 16px;background:var(--weui-bg-2);display:flex;align-items:center;gap:12px;`)}>
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--weui-brand),var(--weui-indigo));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:22px;">${(p.avatar||'A')[0].toUpperCase()}</div>
      <div>
        <div style="font-size:16px;font-weight:600;color:var(--weui-fg-0);">${p.name||''}</div>
        <div style="font-size:12px;color:var(--weui-fg-2);margin-top:2px;">${p.desc||''}</div>
      </div>
    </div>`;
  },
});

register({
  id: 'mp-comment',
  name: 'Comment 评论',
  category: '业务',
  icon: '💬',
  defaultProps: { name: '用户***8', time: '3天前', content: '音质很好，降噪效果出色！', stars: 5 },
  schema: {
    props: [
      { key: 'name',    label: '用户', type: 'text' },
      { key: 'time',    label: '时间', type: 'text' },
      { key: 'content', label: '评论', type: 'textarea' },
      { key: 'stars',   label: '星级', type: 'number' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `padding:12px 16px;background:var(--weui-bg-2);`)}>
      <div style="display:flex;gap:10px;">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--weui-bg-0);flex-shrink:0;"></div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span style="font-size:13px;font-weight:500;">${p.name||''}</span>
            <span style="font-size:11px;color:var(--weui-fg-2);">${p.time||''}</span>
          </div>
          <div style="font-size:14px;line-height:1.5;margin-top:4px;color:var(--weui-fg-0);">${p.content||''}</div>
          ${p.stars ? `<div style="margin-top:4px;color:#fbbf24;font-size:14px;">${'★'.repeat(p.stars)}</div>` : ''}
        </div>
      </div>
    </div>`;
  },
});

register({
  id: 'mp-chat-bubble',
  name: 'ChatBubble 气泡',
  category: '业务',
  icon: '🗯',
  defaultProps: { text: '你好，请问有什么可以帮助你的？', mine: false },
  schema: {
    props: [
      { key: 'text', label: '内容', type: 'textarea' },
      { key: 'mine', label: '我发的', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    const mine = p.mine;
    return `<div ${nodeAttrs(node, '', `display:flex;padding:8px 12px;${mine?'flex-direction:row-reverse;':''}gap:8px;align-items:flex-end;`)}>
      <div style="width:32px;height:32px;border-radius:50%;background:${mine?'var(--weui-indigo)':'var(--weui-bg-0)'};flex-shrink:0;"></div>
      <div style="max-width:70%;padding:8px 12px;background:${mine?'var(--weui-brand)':'var(--weui-bg-2)'};color:${mine?'#fff':'var(--weui-fg-0)'};border-radius:${mine?'12px 4px 12px 12px':'4px 12px 12px 12px'};font-size:14px;line-height:1.5;">${p.text||''}</div>
    </div>`;
  },
});

register({
  id: 'mp-coupon',
  name: 'Coupon 优惠券',
  category: '业务',
  icon: '🎫',
  defaultProps: { amount: '50', threshold: '满 200 可用', title: '全场通用券', validity: '有效期至 2026-05-31' },
  schema: {
    props: [
      { key: 'amount',    label: '金额', type: 'text' },
      { key: 'threshold', label: '门槛', type: 'text' },
      { key: 'title',     label: '标题', type: 'text' },
      { key: 'validity',  label: '有效期', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `margin:8px 12px;display:flex;background:linear-gradient(90deg,#fa5151,#fa9d3b);border-radius:8px;color:#fff;overflow:hidden;`)}>
      <div style="padding:16px 20px;display:flex;flex-direction:column;justify-content:center;align-items:center;border-right:2px dashed rgba(255,255,255,.3);">
        <div style="font-size:12px;opacity:.9;">¥</div>
        <div style="font-size:32px;font-weight:700;line-height:1;">${p.amount||'0'}</div>
        <div style="font-size:11px;opacity:.9;margin-top:2px;">${p.threshold||''}</div>
      </div>
      <div style="flex:1;padding:12px 16px;display:flex;flex-direction:column;justify-content:center;">
        <div style="font-size:14px;font-weight:600;">${p.title||''}</div>
        <div style="font-size:11px;opacity:.85;margin-top:4px;">${p.validity||''}</div>
      </div>
      <div style="display:flex;align-items:center;padding:0 16px;background:rgba(255,255,255,.15);">
        <span style="font-size:12px;font-weight:500;">领取</span>
      </div>
    </div>`;
  },
});

register({
  id: 'mp-redpacket',
  name: 'RedPacket 红包',
  category: '业务',
  icon: '🧧',
  defaultProps: { sender: 'Alice', greeting: '恭喜发财', amount: '' },
  schema: {
    props: [
      { key: 'sender',   label: '发送者', type: 'text' },
      { key: 'greeting', label: '祝语', type: 'text' },
      { key: 'amount',   label: '金额（空=未拆）', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `margin:12px;background:linear-gradient(180deg,#fa5151 0%,#c91c1c 100%);border-radius:12px;padding:24px 16px;text-align:center;color:#fff;box-shadow:0 4px 12px rgba(250,81,81,.3);`)}>
      <div style="font-size:13px;opacity:.9;">${p.sender||''} 发给你的红包</div>
      <div style="font-size:20px;font-weight:600;margin:12px 0;">「${p.greeting||'恭喜发财'}」</div>
      ${p.amount ? `<div style="font-size:36px;font-weight:700;">¥${p.amount}</div>` : `<div style="width:64px;height:64px;margin:8px auto;background:#fef8d9;color:#c91c1c;font-size:32px;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center;">开</div>`}
    </div>`;
  },
});

register({
  id: 'mp-address',
  name: 'AddressCard 地址',
  category: '业务',
  icon: '📍',
  defaultProps: { name: '张三', phone: '138****8888', address: '广东省深圳市南山区科技园' },
  schema: {
    props: [
      { key: 'name',    label: '姓名', type: 'text' },
      { key: 'phone',   label: '电话', type: 'text' },
      { key: 'address', label: '详细地址', type: 'textarea' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `margin:8px 12px;background:var(--weui-bg-2);padding:16px;border-radius:8px;display:flex;gap:12px;align-items:flex-start;`)}>
      <span style="color:var(--weui-red);font-size:20px;">📍</span>
      <div style="flex:1;">
        <div style="display:flex;gap:12px;align-items:baseline;">
          <span style="font-size:15px;font-weight:600;">${p.name||''}</span>
          <span style="font-size:13px;color:var(--weui-fg-1);">${p.phone||''}</span>
        </div>
        <div style="font-size:13px;color:var(--weui-fg-1);margin-top:4px;line-height:1.5;">${p.address||''}</div>
      </div>
    </div>`;
  },
});

register({
  id: 'mp-notification',
  name: 'Notification 通知',
  category: '业务',
  icon: '🔔',
  defaultProps: { title: '系统通知', content: '你的订单 #001 已发货', time: '2 分钟前', unread: true },
  schema: {
    props: [
      { key: 'title',   label: '标题', type: 'text' },
      { key: 'content', label: '内容', type: 'text' },
      { key: 'time',    label: '时间', type: 'text' },
      { key: 'unread',  label: '未读', type: 'boolean' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `padding:12px 16px;background:var(--weui-bg-2);border-bottom:1px solid var(--weui-separator);display:flex;gap:12px;position:relative;`)}>
      <span style="width:36px;height:36px;border-radius:50%;background:rgba(7,193,96,.12);color:var(--weui-brand);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">🔔</span>
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:14px;font-weight:500;color:var(--weui-fg-0);">${p.title||''}</span>
          <span style="font-size:11px;color:var(--weui-fg-2);">${p.time||''}</span>
        </div>
        <div style="font-size:13px;color:var(--weui-fg-1);margin-top:2px;line-height:1.5;">${p.content||''}</div>
      </div>
      ${p.unread ? '<span style="position:absolute;top:12px;right:12px;width:8px;height:8px;border-radius:50%;background:var(--weui-red);"></span>' : ''}
    </div>`;
  },
});

register({
  id: 'mp-live',
  name: 'LiveCard 直播',
  category: '业务',
  icon: '🎥',
  defaultProps: { title: '主播间 · 春季新品首发', host: '直播君', viewers: '12.3k' },
  schema: {
    props: [
      { key: 'title',   label: '标题', type: 'text' },
      { key: 'host',    label: '主播', type: 'text' },
      { key: 'viewers', label: '观看数', type: 'text' },
    ],
    style: [],
  },
  render(node) {
    const p = node.props || {};
    return `<div ${nodeAttrs(node, '', `margin:8px 12px;aspect-ratio:16/9;background:linear-gradient(135deg,#6467f0,#10aeff);border-radius:8px;position:relative;overflow:hidden;color:#fff;`)}>
      <div style="position:absolute;top:8px;left:8px;display:flex;align-items:center;gap:4px;padding:4px 8px;background:var(--weui-red);border-radius:4px;font-size:11px;font-weight:500;">
        <span style="width:6px;height:6px;background:#fff;border-radius:50%;animation:pulse 1.5s infinite;"></span>LIVE
      </div>
      <div style="position:absolute;top:8px;right:8px;padding:4px 8px;background:rgba(0,0,0,.5);border-radius:4px;font-size:11px;">👁 ${p.viewers||'0'}</div>
      <div style="position:absolute;bottom:8px;left:8px;right:8px;">
        <div style="font-size:13px;font-weight:500;">${p.title||''}</div>
        <div style="font-size:11px;opacity:.85;margin-top:2px;">${p.host||''}</div>
      </div>
    </div>`;
  },
});
