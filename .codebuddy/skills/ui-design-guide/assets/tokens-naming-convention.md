# Tokens 命名规范

本文件规定 `design-tokens.json` 在落地为 CSS 变量、SCSS 变量、JS 常量时的命名约定。**所有框架/平台的注入与消费都必须遵守，避免命名漂移。**

## 核心原则

1. **一一映射**：JSON 的层级结构 → 命名以 `-` 分隔的扁平变量名
2. **小写连字符**：仅使用小写字母、数字、连字符 `-`，不使用驼峰、不使用下划线
3. **前缀分组**：`color / space / radius / shadow / font / leading / weight / dur / ease / bp / z`
4. **基色省略 500**：`--color-primary` 等价于 `--color-primary-500`（仅作便利别名，原始 500 必须存在）
5. **HEX 颜色 6 位小写**：`#1677ff`，不使用 `#FFF` 简写

## CSS Custom Properties 命名表

| Token JSON 路径 | CSS 变量 | 示例值 |
|---|---|---|
| `color.primary.500` | `--color-primary-500` | `#1677ff` |
| `color.primary.50..900` | `--color-primary-{50..900}` | `#e6f4ff` |
| `color.neutral.500` | `--color-neutral-500` | `#737373` |
| `color.semantic.success.500` | `--color-success-500` | `#22c55e` |
| `color.semantic.warning.500` | `--color-warning-500` | `#f59e0b` |
| `color.semantic.danger.500` | `--color-danger-500` | `#ef4444` |
| `color.semantic.info.500` | `--color-info-500` | `#3b82f6` |
| `typography.fontFamily.sans` | `--font-sans` | `"Inter, ..."` |
| `typography.fontFamily.mono` | `--font-mono` | `"JetBrains Mono, ..."` |
| `typography.fontSize.xs..5xl` | `--font-size-{xs..5xl}` | `12px` |
| `typography.lineHeight.tight` | `--leading-tight` | `1.25` |
| `typography.fontWeight.bold` | `--weight-bold` | `700` |
| `spacing.{0..24}` | `--space-{0..24}` | `16px` |
| `radius.{none/sm/md/lg/xl/full}` | `--radius-{name}` | `8px` |
| `shadow.{sm/md/lg/xl}` | `--shadow-{name}` | `0 1px 2px ...` |
| `breakpoint.{mobile..wide}` | `--bp-{name}` | `768px` |
| `motion.duration.{fast/base/slow}` | `--dur-{name}` | `200ms` |
| `motion.easing.standard` | `--ease-standard` | `cubic-bezier(.2,0,0,1)` |
| `zIndex.{level}` | `--z-{level}` | `100` |

## 派生别名（语义化，可选）

为提高代码可读性，约定以下语义别名（实现上指向具体 token）：

| 别名 | 指向 |
|---|---|
| `--color-bg` | `--color-neutral-50`（light） / `--color-neutral-900`（dark） |
| `--color-fg` | `--color-neutral-900`（light） / `--color-neutral-50`（dark） |
| `--color-border` | `--color-neutral-200`（light） / `--color-neutral-700`（dark） |
| `--color-muted` | `--color-neutral-500` |
| `--color-link` | `--color-primary-500` |

## 多端落地

- **Web/H5**：`:root { --xxx: yyy }`，暗黑模式通过 `:root[data-theme="dark"]` 覆盖
- **微信小程序**：`app.wxss` 顶部 `page { --xxx: yyy }`，暗黑通过 `@media (prefers-color-scheme: dark)`
- **UniApp**：`uni.scss` 中 SCSS 变量映射，运行时通过 `:root` CSS 变量；条件编译 `#ifdef MP-WEIXIN/H5/APP`

## SCSS / JS 桥接

- SCSS：`$color-primary-500: var(--color-primary-500);`，便于在编译时被组件库主题系统消费
- JS（如 Tailwind config）：`'primary-500': 'var(--color-primary-500)'`

## 反例（禁止）

- ❌ `--colorPrimary500`（驼峰）
- ❌ `--color_primary_500`（下划线）
- ❌ `--primary-color`（前缀错位）
- ❌ `--primary`（语义不清，未带 `color-` 分组）
