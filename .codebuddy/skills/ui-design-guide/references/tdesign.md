# TDesign 速查（v2 占位）

> ⚠️ **首版未完整实现**。本文件仅作占位骨架。

## v2 计划补全

- [ ] TDesign 多端（Web / Mobile / 微信小程序）主题定制与 Skill tokens 完整映射
- [ ] CSS Variables 模式（TDesign 已默认使用 CSS 变量）→ 与 Skill 命名空间对齐
- [ ] 暗黑模式：`<body theme-mode="dark">` 与 Skill `[data-theme="dark"]` 协调
- [ ] TDesign 微信小程序版的 token 注入策略
- [ ] React / Vue / Miniprogram 三端接入示例

## 临时桥接示例

```css
/* TDesign 已用 CSS 变量，桥接最简洁 */
:root {
  --td-brand-color: var(--color-primary-500);
  --td-brand-color-1: var(--color-primary-50);
  --td-brand-color-9: var(--color-primary-900);
  --td-bg-color-page: var(--color-neutral-50);
  --td-text-color-primary: var(--color-neutral-900);
  --td-radius-default: var(--radius-md);
  --td-font-size: var(--font-size-base);
}
```

## 升级路径

待 v2 完成后迁移到标准模板。
