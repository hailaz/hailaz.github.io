# Accessibility (a11y) Checklist

> AI 在生成 UI 代码时**必须**逐项校验。任一不通过 → 报警并提示修正。

## 1. 颜色对比度

- [ ] 正文文本与底色对比度 ≥ **4.5:1**（WCAG AA）
- [ ] 大文本（≥ 18px 加粗 / ≥ 24px 普通）≥ **3:1**
- [ ] UI 组件边框与背景对比度 ≥ **3:1**
- [ ] 焦点环（focus ring）与底色对比度 ≥ **3:1**
- [ ] 暗黑模式 `color.modeOverrides.dark` 同样满足上述阈值

## 2. 焦点可见

- [ ] 所有可交互元素（button / input / a / [role=button]）必须有可见 `:focus-visible` 样式
- [ ] 禁止全局 `outline: none` 而无替代方案
- [ ] 焦点环宽度 ≥ 2px，颜色使用 `--color-primary-500` 或对比足够的语义色

## 3. 键盘导航

- [ ] Tab 顺序与视觉顺序一致；跳过装饰性元素
- [ ] Modal / Drawer / Popover 必须实现**焦点陷阱**：打开后 Tab 循环在内部
- [ ] Esc 关闭浮层；Enter 提交表单
- [ ] 自定义控件（自做的 Select、Tabs、Tree）必须实现 ARIA Authoring Practices 中的键盘行为

## 4. 语义化与 ARIA

- [ ] 优先用语义化标签（`<button>`、`<nav>`、`<main>`、`<aside>`、`<header>`、`<footer>`）
- [ ] 仅在原生标签不够时使用 `role="..."`
- [ ] 图标按钮必须有 `aria-label` 或 `<span class="sr-only">文本</span>`
- [ ] 输入控件必须有可见 `<label>` 或 `aria-labelledby` / `aria-label`
- [ ] 错误提示用 `aria-invalid="true"` + `aria-describedby` 关联说明文本
- [ ] 异步加载用 `aria-busy="true"` / `aria-live="polite"`

## 5. 表单

- [ ] 每个输入框都有可见 label（不能仅靠 placeholder 替代）
- [ ] 必填字段用 `required` 与可见 `*` 标记
- [ ] 错误信息紧邻字段且不仅依赖颜色（同时用图标 + 文字）
- [ ] 提交按钮在 loading 时 `aria-busy="true"` 且 disabled

## 6. 图像与媒体

- [ ] `<img>` 必须有 `alt`；装饰性图片用 `alt=""`
- [ ] 视频必须有字幕或 transcript
- [ ] 自动播放默认静音

## 7. 减弱动效（prefers-reduced-motion）

- [ ] 检测 `@media (prefers-reduced-motion: reduce)`，将 `--dur-*` 全部置 0 或近 0
- [ ] 不要使用持续旋转/闪烁的纯装饰动画

## 8. 触控

- [ ] 触控热区 ≥ **44×44 px**（移动端）
- [ ] 相邻热区间距 ≥ 8px

## 自检脚本（伪代码）

```js
// 在 AI 生成代码前
function check(token) {
  assert(contrast(token.color.fg, token.color.bg) >= 4.5);
  assert(focusRingVisible);
  assert(allInteractiveHasLabel);
}
```
