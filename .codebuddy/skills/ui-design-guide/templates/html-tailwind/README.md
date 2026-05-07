# HTML + Tailwind CSS 接入模板

## 概述

最简化的 Web 接入方式：纯 HTML 页面 + Tailwind CSS（CDN 或构建版本）+ CSS Variables 注入。**所有 Tailwind 类名最终都引用 CSS 变量**，从而被本 Skill 的 tokens 管控。

## 接入步骤

### Step 1：注入 Tokens 到 `:root`

将 `design-tokens.json` 转换为 CSS Variables，写入页面或独立 `tokens.css` 文件。可参考本目录 `tokens-to-css.html` 的最小实现（页面加载时读 JSON 并 set CSS 变量）。

### Step 2：配置 Tailwind 引用变量

参考 `tailwind.config.snippet.js`：在 `theme.extend` 中将 Tailwind 的 color / spacing / borderRadius / boxShadow / fontFamily / fontSize / screens 全部指向同名 CSS 变量。

### Step 3：暗黑模式

```html
<html data-theme="light">
  <!-- 切换：document.documentElement.dataset.theme = 'dark' -->
</html>
```

```js
// JS 切换并持久化
const root = document.documentElement;
const saved = localStorage.getItem('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
root.dataset.theme = saved;
function toggleTheme() {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
}
```

### Step 4：响应式

- 用 Tailwind 内置断点 `sm:768 / md:1024 / lg:1440`，但**值取自 token**（在 config 中映射）
- 字号优先用 `text-base`（其值已是 `clamp()`）
- 间距优先用 `p-4 / m-6 / gap-3` 等，禁止 `p-[12px]` 这类硬编码

## tailwind.config 关键映射

```js
// 完整示例见 tailwind.config.snippet.js
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: { 500: 'var(--color-primary-500)', /* ... */ },
        // ...
      },
      spacing:      { 1: 'var(--space-1)', /* ... */ },
      borderRadius: { sm: 'var(--radius-sm)', /* ... */ },
      boxShadow:    { sm: 'var(--shadow-sm)', /* ... */ },
      screens:      { sm: '768px', md: '1024px', lg: '1440px' },
    }
  }
};
```

## 检查项

- [ ] 不在 HTML/CSS/JS 中硬编码颜色 / px 数值
- [ ] 暗黑模式通过 `[data-theme="dark"]` 切换
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] 焦点环可见（Tailwind 默认会去除 outline，要补 `focus-visible:ring-2 focus-visible:ring-primary-500`）

## 与 Skill 协作

1. 用户在 configurator 中调好 tokens → 导出 `design-tokens.json`
2. AI 把 JSON 注入项目 `tokens.css` 或运行时 set 变量
3. AI 写组件时只用 Tailwind 类（已映射到变量）
4. AI 自检：对比度 / 三态 / a11y / brand-tone 文案
