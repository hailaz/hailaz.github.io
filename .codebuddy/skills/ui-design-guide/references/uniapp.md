# UniApp UI 速查（uni-ui / uView 2.x / uv-ui）

> 面向 **UniApp**（Vue2 / Vue3）跨端项目的 UI 产出速查。UniApp 一套代码可编译到：H5、微信小程序、支付宝小程序、抖音小程序、App（iOS/Android）、快应用等。UI 库选型需权衡**跨端一致性**与**平台原生体验**。

## 一、UI 库选型对比

| 库 | 版本 | 适用场景 | 特点 |
|---|---|---|---|
| **uni-ui**（官方） | 维护稳定 | 官方推荐，轻量业务 | DCloud 出品，与 uniapp 深度集成，组件偏基础 |
| **uView 2.x** | Vue 2 | 成熟社区大型项目 | 组件丰富、文档完整、仅支持 Vue 2 |
| **uv-ui / uView Plus** | Vue 3 | Vue 3 新项目 | uView 的 Vue 3 重构版，API 兼容 |
| **Wot Design Uni** | Vue 3 / TS | 有 TS + 设计系统需求 | TS 友好、京东风格、支持 主题切换 |
| **TuniaoUI 3.x** | Vue 3 | 希望偏年轻化风格 | UI 偏鸿蒙风，动效细腻 |

**推荐组合**：
- 新项目 Vue 3 → **uv-ui** 或 **Wot Design Uni**
- 已有 Vue 2 项目 → **uView 2.x**
- 极简/少量组件 → **uni-ui** + 手写 tokens

## 二、安装与配置（以 uv-ui 为例）

### 2.1 安装

```bash
npm i @climblee/uv-ui
```

### 2.2 `main.js` 全局引入

```js
// main.js (Vue 3)
import { createSSRApp } from 'vue';
import App from './App.vue';
import uvUI from '@climblee/uv-ui';

export function createApp() {
  const app = createSSRApp(App);
  app.use(uvUI);
  return { app };
}
```

### 2.3 主题 Token 注入（`uni.scss`）

把 `design-tokens.json` 映射为 SCSS 变量：

```scss
// uni.scss —— 全局 SCSS 变量，所有页面自动可用
/* ========== 主色 ========== */
$uni-primary:        #07c160;  // 等于 tokens.color.primary.500
$uni-primary-light:  #d4f7e1;
$uni-primary-dark:   #06ad56;
$uni-success:        #07c160;
$uni-warning:        #ffc300;
$uni-error:          #fa5151;
$uni-info:           #10aeff;

/* ========== 中性 ========== */
$uni-text-color:           #111111;
$uni-text-color-inverse:   #ffffff;
$uni-text-color-grey:      #888888;
$uni-text-color-placeholder: #cccccc;
$uni-text-color-disable:   #c0c0c0;
$uni-bg-color:             #f7f7f7;
$uni-bg-color-grey:        #ededed;
$uni-bg-color-hover:       #f1f1f1;
$uni-bg-color-mask:        rgba(0, 0, 0, .4);

/* ========== 边框 ========== */
$uni-border-color:         #e5e5e5;

/* ========== 尺寸 ========== */
$uni-font-size-sm:         26rpx;
$uni-font-size-base:       30rpx;
$uni-font-size-lg:         34rpx;

$uni-spacing-row-sm:       8rpx;
$uni-spacing-row-base:     16rpx;
$uni-spacing-row-lg:       24rpx;

$uni-border-radius-sm:     8rpx;
$uni-border-radius-base:   16rpx;
$uni-border-radius-lg:     24rpx;
$uni-border-radius-circle: 50%;

/* ========== uView / uv-ui 专属变量 ========== */
$u-primary: $uni-primary;
$u-warning: $uni-warning;
$u-error:   $uni-error;
$u-success: $uni-success;
$u-info:    $uni-info;
```

> **自动注入**：`uni.scss` 内变量会被编译时注入到所有 `<style lang="scss">` 块，组件中 `background: $uni-primary;` 可直接使用。

### 2.4 CSS Variables 补充（运行时主题切换）

SCSS 变量是编译期的，不支持运行时切换。主题切换场景需要 CSS Variables：

```vue
<!-- App.vue -->
<script setup>
import { onLaunch } from '@dcloudio/uni-app';
onLaunch(() => {
  // 根据 theme 注入 CSS Variables
  const theme = uni.getStorageSync('theme') || 'light';
  applyTheme(theme);
});
</script>

<style>
/* 根节点 CSS Variables */
page, .theme-light {
  --primary-500: #07c160;
  --bg-1: #f7f7f7;
  --fg-0: #111;
}
.theme-dark {
  --primary-500: #07c160;
  --bg-1: #1a1a1a;
  --fg-0: #fff;
}
</style>
```

## 三、条件编译（UniApp 核心能力）

AI 生成代码**必须**考虑条件编译来处理不同端差异：

```vue
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <view class="wx-capsule-placeholder" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <view class="h5-header">H5 独有导航</view>
    <!-- #endif -->

    <!-- #ifdef APP-PLUS -->
    <view class="app-safe-area" :style="{ paddingTop: getStatusBarHeight() + 'px' }"></view>
    <!-- #endif -->
  </view>
</template>

<script setup>
// #ifdef MP-WEIXIN
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
// #endif
</script>

<style lang="scss" scoped>
.box {
  /* 通用 */
  padding: 32rpx;

  /* #ifdef MP-WEIXIN */
  padding-top: 88rpx; /* 小程序额外避让胶囊 */
  /* #endif */

  /* #ifdef H5 */
  max-width: 750rpx;
  margin: 0 auto;
  /* #endif */
}
</style>
```

**条件编译标记速查**：

| 标记 | 平台 |
|---|---|
| `#ifdef MP` | 所有小程序 |
| `#ifdef MP-WEIXIN` | 微信小程序 |
| `#ifdef MP-ALIPAY` | 支付宝小程序 |
| `#ifdef MP-TOUTIAO` | 抖音小程序 |
| `#ifdef H5` | H5 / Web |
| `#ifdef APP-PLUS` | App（iOS/Android） |
| `#ifdef APP-NVUE` | App 下的 nvue 页面 |
| `#ifdef VUE3` | Vue 3 编译目标 |

## 四、常用组件速查

### 4.1 Button

```vue
<!-- uv-ui -->
<uv-button type="primary" :loading="loading" @click="onSubmit">立即购买</uv-button>
<uv-button type="success" size="small">保存</uv-button>
<uv-button type="error" plain>删除</uv-button>

<!-- uni-ui -->
<uni-button type="primary" @click="onSubmit">确定</uni-button>
```

### 4.2 Cell 列表

```vue
<!-- uv-ui -->
<uv-cell-group title="我的">
  <uv-cell title="个人信息" value="张三" is-link @click="goProfile" />
  <uv-cell title="收货地址" is-link :rightIcon="''" />
  <uv-cell title="设置" is-link />
</uv-cell-group>

<!-- uni-ui -->
<uni-list>
  <uni-list-item title="个人信息" rightText="张三" show-arrow @click="goProfile" />
</uni-list>
```

### 4.3 表单

```vue
<uv-form :model="form" :rules="rules" ref="formRef" label-width="160rpx">
  <uv-form-item label="姓名" prop="name" required>
    <uv-input v-model="form.name" placeholder="请输入姓名" />
  </uv-form-item>
  <uv-form-item label="手机号" prop="phone" required>
    <uv-input v-model="form.phone" type="number" maxlength="11" />
  </uv-form-item>
</uv-form>
<uv-button type="primary" @click="submit">提交</uv-button>

<script setup>
const formRef = ref();
const form = reactive({ name: '', phone: '' });
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
};
const submit = () => formRef.value.validate().then(ok => ok && doSubmit());
</script>
```

### 4.4 Toast / Modal / Loading（uni 原生 API）

```js
// 跨端统一用 uni.* API，uView 的 $u.toast 仅为封装
uni.showToast({ title: '操作成功', icon: 'success' });
uni.showLoading({ title: '加载中', mask: true });
uni.hideLoading();
uni.showModal({
  title: '确认删除？', content: '删除后不可恢复',
  confirmColor: '#fa5151',
  success: (res) => { if (res.confirm) doDelete(); },
});
uni.showActionSheet({ itemList: ['拍照', '相册'] });
```

### 4.5 Swiper / 图片懒加载

```vue
<swiper autoplay circular :indicator-dots="true" indicator-active-color="#07c160">
  <swiper-item v-for="item in banners" :key="item.id">
    <image :src="item.img" mode="aspectFill" lazy-load />
  </swiper-item>
</swiper>
```

### 4.6 TabBar（原生）

`pages.json`：

```json
{
  "tabBar": {
    "color": "#888", "selectedColor": "#07c160",
    "backgroundColor": "#fff", "borderStyle": "black",
    "list": [
      { "pagePath": "pages/home/home", "text": "首页", "iconPath": "static/home.png", "selectedIconPath": "static/home-active.png" },
      { "pagePath": "pages/mine/mine", "text": "我的", "iconPath": "static/mine.png", "selectedIconPath": "static/mine-active.png" }
    ]
  }
}
```

### 4.7 导航栏定制（`page.style`）

`pages.json`：

```json
{
  "path": "pages/detail/detail",
  "style": {
    "navigationBarTitleText": "商品详情",
    "navigationBarBackgroundColor": "#07c160",
    "navigationBarTextStyle": "white",
    "navigationStyle": "custom",   
    "enablePullDownRefresh": true,
    "onReachBottomDistance": 50
  }
}
```

## 五、跨端单位策略

| 端 | 单位推荐 |
|---|---|
| 所有端 | **rpx**（UniApp 统一单位，编译时换算） |
| H5 | rpx 会编译为 rem 或 px（由 uni.config 控制） |
| 小程序 | 原生 rpx |
| App | 原生 rpx（uni-app 虚拟单位） |

**统一规则**：
- spacing / font-size / width / height → **rpx**
- 边框 → `1rpx`
- 图标尺寸 → `rpx`
- 圆角 → `rpx`

## 六、主题切换（运行时）

```js
// store/theme.ts
import { defineStore } from 'pinia';
export const useThemeStore = defineStore('theme', {
  state: () => ({ current: 'light' }),
  actions: {
    toggle() {
      this.current = this.current === 'light' ? 'dark' : 'light';
      uni.setStorageSync('theme', this.current);
      // #ifdef H5
      document.documentElement.dataset.theme = this.current;
      // #endif
      // 小程序端通过根 view class 切换
    },
  },
});
```

App.vue 根节点绑定：

```vue
<template>
  <view :class="`theme-${theme.current}`">
    <slot />
  </view>
</template>
```

## 七、UniApp 独有约束（AI 生成时必须遵守）

- ✅ **单位一律用 rpx**，不用 `px`（除 `1rpx` 边框）
- ✅ **API 一律用 `uni.*`**，不用 `wx.*`（条件编译内除外）
- ✅ **条件编译覆盖差异**：不同端有差异时必须用 `#ifdef` 隔离，禁止运行时判断 `uni.getSystemInfoSync().platform`
- ✅ **Vue 3 项目**：全局状态管用 Pinia，避免用 Vuex
- ✅ **页面栈**：`uni.navigateTo` 最多 10 层，超出用 `uni.redirectTo`
- ✅ **nvue 页面**（App 原生渲染）：只能用 flex 布局，CSS 受限，慎用
- ✅ **图片路径**：静态图用 `/static/xxx.png`，动态图用完整 URL；CDN 图必须 HTTPS
- ✅ **分包**：`pages.json` 配置 `subPackages`，首包 ≤ 2MB（小程序端硬性约束）

## 八、预览与调试

- **H5**：`npm run dev:h5`，浏览器直接开发
- **微信小程序**：`npm run dev:mp-weixin` → 微信开发者工具导入 `dist/dev/mp-weixin`
- **App**：HBuilderX 运行到 App 基座
- **设计验证**：用本 Skill 的 `preview/preview-template.html`（视口切"📱 小程序"或"🖥 桌面"）1:1 对比

## 九、相关资源

- UniApp 官网：https://uniapp.dcloud.net.cn/
- 条件编译：https://uniapp.dcloud.net.cn/tutorial/platform.html
- uv-ui：https://www.uvui.cn/
- uView 2.x（Vue 2）：https://www.uviewui.com/
- Wot Design Uni：https://wot-design-uni.pages.dev/
- 接入模板：`../templates/uniapp/README.md`
- 关联速查：`./wechat-miniprogram.md`（小程序独有约束仍需遵循）
