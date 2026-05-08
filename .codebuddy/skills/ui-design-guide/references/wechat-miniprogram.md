# 原生微信小程序 UI 速查（WeUI + 原生组件）

> 面向**原生微信小程序**（WXML/WXSS/JS/TS）开发时的 UI 产出速查。与 `templates/wechat-miniprogram/README.md` 配合使用。UI 库首选 **WeUI（官方） + 小程序原生组件**。

## 一、UI 体系推荐

| 层 | 选型 | 说明 |
|---|---|---|
| 设计规范 | **WeUI** | 微信官方设计语言，与微信 App 视觉一致 |
| 组件库 | **WeUI miniprogram**（`weui-miniprogram` npm 包） | 官方组件库，按需引入 |
| 图标 | **WeUI Icon** / iconfont 内联 SVG | 避免远程图片 |
| 布局 | 原生 `<view>` + Flex + Grid | 不使用第三方布局库 |
| 表单 | 原生 `<input>` / `<picker>` / `<switch>` + WeUI 封装 | 复杂交互用 `<form>` + `bindsubmit` |
| 弹层 | `wx.showToast` / `wx.showModal` / `wx.showActionSheet` | 小程序原生 API 已足够 |

## 二、引入方式

### 2.1 WeUI（推荐）

```bash
npm i weui-miniprogram
```

在 `app.json`：

```json
{
  "useExtendedLib": { "weui": true }
}
```

页面 `.json` 声明：

```json
{
  "usingComponents": {
    "mp-cells":   "weui-miniprogram/cells/cells",
    "mp-cell":    "weui-miniprogram/cell/cell",
    "mp-form":    "weui-miniprogram/form/form",
    "mp-dialog":  "weui-miniprogram/dialog/dialog",
    "mp-toptips": "weui-miniprogram/toptips/toptips",
    "mp-icon":    "weui-miniprogram/icon/icon"
  }
}
```

### 2.2 纯手写（基于 tokens）

如果不想引入 weui-miniprogram，直接用 `templates/wechat-miniprogram/theme.wxss.example` 中的样板复制到 `app.wxss`，所有 `.weui-*` class 即可使用。

## 三、常用组件速查

### 3.1 Cell 列表（导航/菜单场景）

```html
<view class="weui-cells">
  <view class="weui-cell">
    <view class="weui-cell__hd"><image src="/icon/user.svg" style="width:48rpx;height:48rpx;" /></view>
    <view class="weui-cell__bd">个人信息</view>
    <view class="weui-cell__ft">张三</view>
  </view>
  <view class="weui-cell" bindtap="goSettings">
    <view class="weui-cell__bd">设置</view>
    <view class="weui-cell__ft"></view>
  </view>
</view>
```

### 3.2 Button（三级按钮）

```html
<button class="weui-btn weui-btn--primary" bindtap="onSubmit" loading="{{loading}}" disabled="{{disabled}}">
  立即购买
</button>
<button class="weui-btn weui-btn--default" open-type="share">分享</button>
<button class="weui-btn weui-btn--warn" bindtap="onDelete">删除账号</button>
```

**open-type 常用值**（AI 生成时选对 type 是小程序独有约束）：

| open-type | 触发能力 |
|---|---|
| `getUserInfo` ❌已废弃 | 改用 `chooseAvatar` + `getPhoneNumber` |
| `getPhoneNumber` | 获取手机号，回调 `bindgetphonenumber` |
| `chooseAvatar` | 选头像，回调 `bindchooseavatar` |
| `contact` | 客服会话 |
| `share` | 转发好友 |
| `openSetting` | 打开授权设置页 |
| `feedback` | 打开反馈 |

### 3.3 Form 表单（WeUI mp-form 封装）

```html
<mp-form id="form" models="{{formData}}" rules="{{rules}}">
  <mp-cells title="基本信息">
    <mp-cell prop="name" title="姓名" ext-class="">
      <input class="weui-input" placeholder="请输入姓名" model:value="{{formData.name}}" />
    </mp-cell>
    <mp-cell prop="phone" title="手机" ext-class="">
      <input class="weui-input" type="number" maxlength="11" model:value="{{formData.phone}}" />
    </mp-cell>
  </mp-cells>
</mp-form>
<button class="weui-btn weui-btn--primary" bindtap="submitForm">提交</button>
```

```js
// .js
Page({
  data: {
    formData: { name: '', phone: '' },
    rules: [
      { name: 'name', rules: { required: true, message: '请输入姓名' } },
      { name: 'phone', rules: [{ required: true }, { mobile: true, message: '手机号格式不正确' }] },
    ],
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) return wx.showToast({ icon: 'error', title: errors[0].message });
      // 提交
    });
  },
});
```

### 3.4 TabBar（自定义）

推荐自定义 TabBar（完整主题切换 + 徽章 + 动画），创建 `custom-tab-bar/` 目录：

```js
// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/home',         text: '首页', iconPath: '/icon/home.png',     selectedIconPath: '/icon/home-active.png' },
      { pagePath: '/pages/category/category', text: '分类', iconPath: '/icon/cat.png',      selectedIconPath: '/icon/cat-active.png' },
      { pagePath: '/pages/cart/cart',         text: '购物车', iconPath: '/icon/cart.png',   selectedIconPath: '/icon/cart-active.png' },
      { pagePath: '/pages/mine/mine',         text: '我的', iconPath: '/icon/mine.png',     selectedIconPath: '/icon/mine-active.png' },
    ],
  },
  methods: {
    switchTab(e) {
      const i = e.currentTarget.dataset.index;
      wx.switchTab({ url: this.data.list[i].pagePath });
    },
  },
});
```

`app.json`：`"tabBar": { "custom": true, "list": [...] }`

### 3.5 Swiper 轮播

```html
<swiper class="banner" autoplay="{{true}}" interval="3000" circular="{{true}}" indicator-dots="{{true}}" indicator-active-color="#07c160">
  <swiper-item wx:for="{{banners}}" wx:key="id">
    <image src="{{item.img}}" mode="aspectFill" lazy-load="{{true}}" />
  </swiper-item>
</swiper>
```

### 3.6 Modal / ActionSheet / Toast（原生 API）

```js
// 二次确认
wx.showModal({
  title: '确认删除？', content: '删除后不可恢复',
  cancelText: '取消', confirmText: '删除', confirmColor: '#fa5151',
  success: (res) => { if (res.confirm) doDelete(); },
});

// 底部菜单
wx.showActionSheet({
  itemList: ['拍照', '从相册选择'],
  success: (res) => { /* res.tapIndex */ },
});

// 即时反馈
wx.showToast({ title: '操作成功', icon: 'success', duration: 2000 });
wx.showLoading({ title: '加载中', mask: true });
// 记得 wx.hideLoading()
```

### 3.7 下拉刷新 + 上拉加载

`page.json`：

```json
{ "enablePullDownRefresh": true, "onReachBottomDistance": 50, "backgroundTextStyle": "dark" }
```

`page.js`：

```js
Page({
  async onPullDownRefresh() {
    await this.reload();
    wx.stopPullDownRefresh();
  },
  async onReachBottom() {
    if (this.data.noMore || this.data.loading) return;
    await this.loadMore();
  },
});
```

### 3.8 Image / 图片规范

```html
<image
  src="{{goods.img}}"
  mode="aspectFill"           
  lazy-load="{{true}}"
  webp="{{true}}"
  binderror="onImgError"
  style="width:200rpx;height:200rpx;border-radius:16rpx;background:var(--weui-bg-0);"
/>
```

**mode 常用值**：
- `aspectFill` 裁剪填满（列表、封面图首选）
- `aspectFit` 完整显示（Logo、商品主图）
- `widthFix` 宽度固定，高度按原图比例（文章内图）

## 四、小程序独有约束（AI 生成时必须遵守）

### 4.1 单位

- spacing / font-size / size → **`rpx`**
- `border-width` → `1rpx` 或 `2rpx`
- `border-radius` → `rpx` 或 `9999rpx`
- 禁止 `vw` / `vh` / `em`（兼容性差）

### 4.2 class 命名

使用 WeUI 的 BEM 命名（`.weui-{block}__{element}--{modifier}`），自定义业务 class 加项目前缀：`.mp-goods-card` / `.mp-user-info`

### 4.3 全局样式污染

小程序 page 之间**样式隔离**（除非用 `addGlobalClass`）。Tokens 必须写在 `app.wxss`，业务样式写在 `page.wxss`。

### 4.4 登录授权流程

```js
// 1. 点击"微信登录"按钮（open-type="getPhoneNumber"）
// 2. 获取手机号
<button open-type="getPhoneNumber" bindgetphonenumber="onGetPhone">手机号登录</button>

// 3. 后端用 code 换 session_key，解密手机号
Page({
  onGetPhone(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') return;
    wx.login({ success: ({ code }) => {
      wx.request({ url: '/api/login', data: { code, encryptedData: e.detail.encryptedData, iv: e.detail.iv } });
    }});
  },
});
```

### 4.5 支付

```js
wx.requestPayment({
  timeStamp, nonceStr, package: `prepay_id=${prepayId}`, signType: 'MD5', paySign,
  success: () => wx.showToast({ title: '支付成功', icon: 'success' }),
  fail:    () => wx.showToast({ title: '支付失败', icon: 'error' }),
});
```

## 五、预览与调试

- **DevTools**：微信开发者工具 · 模拟器 · 各机型切换
- **设计验证**：用本 Skill 的 `preview/preview-template.html`（视口切"📱 小程序"） 1:1 对比

## 六、相关资源

- WeUI 规范：https://weui.io/
- WeUI 组件库：https://github.com/wechat-miniprogram/weui-miniprogram
- 小程序组件 API：https://developers.weixin.qq.com/miniprogram/dev/component/
- 接入模板：`../templates/wechat-miniprogram/README.md`
