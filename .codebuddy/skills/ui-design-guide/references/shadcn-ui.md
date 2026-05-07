# Shadcn UI 速查（v2 占位）

> ⚠️ **首版未完整实现**。本文件仅作占位骨架，避免 AI 在未明确细节时盲目生成。

## v2 计划补全

- [ ] Shadcn UI 默认使用 HSL 变量（`--background` / `--foreground` / `--primary` 等）→ 与本 Skill 的 HEX 命名（`--color-primary-500`）的完整映射表
- [ ] `globals.css` 模板：把 Skill 命名的变量桥接为 Shadcn 命名
- [ ] `components.json` 配置示例（base color、style、cssVariables）
- [ ] 常用组件（Button / Card / Dialog / Tabs / Form）的 className 与本 Skill token 对照
- [ ] 暗黑模式（next-themes）与 Skill `[data-theme="dark"]` 的协调

## 临时映射建议

```css
/* globals.css 中临时桥接 */
:root {
  --background:   var(--color-neutral-50);
  --foreground:   var(--color-neutral-900);
  --primary:      var(--color-primary-500);
  --primary-foreground: #fff;
  --muted:        var(--color-neutral-100);
  --muted-foreground: var(--color-neutral-500);
  --border:       var(--color-neutral-200);
  --ring:         var(--color-primary-500);
  --radius:       var(--radius-md);
}

[data-theme="dark"] {
  --background:   var(--color-neutral-50);  /* 注意 modeOverrides 已翻转 */
  --foreground:   var(--color-neutral-900);
  /* ... */
}
```

## 升级路径

待 v2 完成后，Shadcn UI 用户应迁移到本目录提供的标准映射，避免与未来版本不兼容。
