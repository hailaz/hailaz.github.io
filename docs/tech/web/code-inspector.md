---
title: Code Inspector - 点击页面跳转源码
tags: [frontend, devtools, vite, webpack]
---

# Code Inspector

https://github.com/zh-lx/code-inspector

前端开发效率工具：在浏览器中点击页面元素，自动打开 IDE 并定位到对应的源码位置。解决"看到页面元素找不到源码在哪"的痛点。

## 支持范围

**构建工具**：Vite、Webpack、Rspack/Rsbuild、Farm、Esbuild、Turbopack、Mako

**前端框架**：Vue 2/3（Nuxt）、React（Next.js/Umi）、Preact、Solid、Qwik、Svelte、Astro

**编辑器**：VS Code 及其他主流编辑器

## 安装

```bash
npm i code-inspector-plugin -D
# 或
yarn add code-inspector-plugin -D
# 或
pnpm add code-inspector-plugin -D
```

## 配置

### Vite

```js
// vite.config.js
import { codeInspectorPlugin } from 'code-inspector-plugin';

export default defineConfig({
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
});
```

### Webpack

```js
// webpack.config.js
const { codeInspectorPlugin } = require('code-inspector-plugin');

module.exports = () => ({
  plugins: [
    codeInspectorPlugin({
      bundler: 'webpack',
    }),
  ],
});
```

### Next.js (>= 15.3.x)

```js
// next.config.js
import { codeInspectorPlugin } from 'code-inspector-plugin';

const nextConfig = {
  turbopack: {
    rules: codeInspectorPlugin({
      bundler: 'turbopack',
    }),
  },
};
export default nextConfig;
```

其他构建工具（Nuxt、Rspack、Esbuild、Umi 等）配置方式类似，参考 [官方文档](https://github.com/zh-lx/code-inspector)。

## 使用

1. 启动本地开发服务器
2. 按下快捷键激活检查模式：
   - **Mac**：`Option + Shift`
   - **Windows**：`Alt + Shift`
3. 鼠标悬停到页面元素上，会显示带信息的遮罩层
4. **点击**元素，IDE 自动弹出并跳转到对应源码位置

## 参考

- [GitHub - zh-lx/code-inspector](https://github.com/zh-lx/code-inspector)
