# React 接入模板（v2 占位）

> ⚠️ **首版未实现**。本目录仅作占位，避免 AI 在未明确实现细节时盲目生成。

## v2 迭代计划

| 项 | 说明 |
|---|---|
| 标准 React + Tailwind 接入 | 同 html-tailwind 思路，提供 Vite/Next/CRA 三套示例 |
| Shadcn UI 桥接 | 通过 `globals.css` 中的 `--*` 变量映射到本 Skill 的 token 命名 |
| Tokens Provider | `<TokensProvider value={tokens}>` 上下文 + `useTokens()` hook |
| CSS-in-JS 适配 | 提供 styled-components / emotion 的 theme 桥接 |
| 暗黑模式 | `next-themes` 等价封装，支持 SSR |
| Tailwind config | 复用 `../html-tailwind/tailwind.config.snippet.js` |

## 临时建议

React 项目在 v2 之前可以：

1. **复用 `../html-tailwind/tokens-to-css.html`** 中的 `tokensToCssVars()` 函数
2. **在 `<App>` 顶层** `useEffect(() => applyTokens(tokens), [tokens])`
3. **暗黑模式**：`document.documentElement.dataset.theme = 'dark'`
4. **Tailwind**：直接用 `tailwind.config.snippet.js`

## Shadcn UI 特别说明

Shadcn UI 默认使用 `--background`、`--foreground` 等 HSL 变量；本 Skill 使用 `--color-neutral-50`、`--color-primary-500` 等 HEX 变量。**v2 将提供完整映射表**，首版用户需要手动在 `globals.css` 中加：

```css
:root {
  --background: var(--color-neutral-50);
  --foreground: var(--color-neutral-900);
  --primary:    var(--color-primary-500);
  /* ... */
}
```

## 资源参考

- `../../assets/design-tokens.schema.json`
- `../../assets/themes/*.json`
- `../../references/shadcn-ui.md` — v2 占位速查
