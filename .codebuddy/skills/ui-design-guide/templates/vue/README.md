# Vue 接入模板（v2 占位）

> ⚠️ **首版未实现**。本目录仅作占位，避免 AI 在未明确实现细节时盲目生成。

## v2 迭代计划

| 项 | 说明 |
|---|---|
| Vite Plugin | 编译时读取 `design-tokens.json` 自动生成 `tokens.css` 与 `tailwind.config.js` |
| Composition API hook | 提供 `useDesignTokens()` 返回响应式 token 树，便于 JS 访问 |
| 暗黑模式 | `useColorMode` 封装 + persist 到 cookie/localStorage |
| 组件库桥接 | 提供 Element Plus / Naive UI / Vant 的主题 override 模板 |
| UnoCSS preset | 提供 `presetUiDesignGuide()`，等价于 tailwind.config snippet |
| HMR | tokens 变更时热更新 CSS Variables 而非 reload |

## 临时建议

在 v2 完成前，Vue 项目可以：

1. **直接复用 `../html-tailwind/`** 的 tokens-to-css.html 思路，把脚本搬到 `App.vue` 的 mounted hook
2. **复用 `tailwind.config.snippet.js`** 作为 Vue + Tailwind 的配置基础
3. **暗黑模式** 用 `document.documentElement.dataset.theme` + watch 切换

## 资源参考

- `../../assets/design-tokens.schema.json` — 契约
- `../../assets/themes/*.json` — 6 套预设
- `../../checklists/*.md` — 校验清单

## 升级路径

待 v2 实现后，Vue 用户应迁移到本目录提供的标准模板，避免与未来版本不兼容。
