# UniApp 接入模板

## 概述

UniApp 跨多端编译，需要同时兼容微信小程序、支付宝小程序、H5、App。本模板规定：

1. **核心 tokens 通过 `uni.scss` 暴露 SCSS 变量** → 所有 vue 组件消费
2. **运行时 CSS Variables 同名注入** → 保证动态主题切换可用
3. **平台差异通过条件编译** `#ifdef MP-WEIXIN/H5/APP-PLUS/MP-ALIPAY` 处理

## 接入步骤

### Step 1：填写 `uni.scss`

参考 `uni.scss.example`：把 `design-tokens.json` 转为 SCSS 变量并 export 为 CSS 变量。

### Step 2：根组件注入 CSS Variables

在 `App.vue` 的 `<style>` 顶部 `@import 'uni.scss';` 并通过 `page` 选择器声明 CSS 变量。

### Step 3：暗黑模式切换

```vue
<script setup>
import { ref, watch } from 'vue';
const theme = ref(uni.getSystemInfoSync().theme ?? 'light');

uni.onThemeChange(res => theme.value = res.theme);

watch(theme, t => {
  // #ifdef H5
  document.documentElement.dataset.theme = t;
  // #endif
});
</script>
```

### Step 4：条件编译处理多端差异

```scss
.btn {
  background: var(--color-primary-500);
  
  // #ifdef MP-WEIXIN || MP-ALIPAY
  padding: 16rpx 32rpx;       // 小程序用 rpx
  // #endif
  
  // #ifdef H5 || APP-PLUS
  padding: 8px 16px;          // H5/APP 用 px
  // #endif
}
```

> 推荐做法：在 `uni.scss` 中**只用 rpx**（H5 端 uni 会自动换算 px），从而消除差异。

### Step 5：响应式

- H5 / APP：使用媒体查询 + `--bp-*` 变量
- 小程序：通常单端单尺寸，但可通过 `uni.getSystemInfoSync().windowWidth` 切换 class

## 检查项

- [ ] `uni.scss` 仅声明本 Skill 命名规范的变量
- [ ] 不要在组件 `<style>` 中硬编码颜色 / 数值
- [ ] 暗黑模式监听 `uni.onThemeChange`
- [ ] 涉及多端差异的样式使用条件编译
- [ ] 触控热区 88rpx（≈ 44px）

## v2 计划

- [ ] 提供 vite plugin：自动从 design-tokens.json 生成 uni.scss
- [ ] 支持 uni-ui / uview-plus 主题 override 桥接
