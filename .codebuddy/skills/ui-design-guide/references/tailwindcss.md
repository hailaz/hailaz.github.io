# Tailwind CSS 速查（首版完整）

> Tailwind 最常用的类名 ↔ token 对应表，AI 在生成 UI 时优先使用这些类。

## 1. 颜色

| 类名 | 等价 CSS | 来源 token |
|---|---|---|
| `text-primary-500` | `color: var(--color-primary-500)` | `color.primary.500` |
| `bg-primary-500` | `background: var(--color-primary-500)` | 同上 |
| `border-primary-500` | `border-color: var(--color-primary-500)` | 同上 |
| `text-neutral-900 dark:text-neutral-50` | 自动暗黑切换 | `color.neutral.{900,50}` |
| `ring-primary-500` | `--tw-ring-color` | 同上 |

> ⚠️ **不要使用** `text-blue-500`、`bg-zinc-100` 等 Tailwind 默认色，必须用映射后的 `primary/neutral/success/warning/danger/info`。

## 2. 间距

| 类名 | 值（base） |
|---|---|
| `p-1 / m-1 / gap-1` | `--space-1` (4px) |
| `p-2 / px-2 / py-2` | `--space-2` (8px) |
| `p-3` | 12px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |
| `p-12` | 48px |
| `p-16` | 64px |
| `p-24` | 96px |

> ⚠️ 禁止 `p-[20px]`、`m-[7px]`、`gap-[13px]` 等任意值。

## 3. 圆角

| 类名 | 值 |
|---|---|
| `rounded-none` | 0 |
| `rounded-sm` | `--radius-sm` |
| `rounded-md` | `--radius-md` |
| `rounded-lg` | `--radius-lg` |
| `rounded-xl` | `--radius-xl` |
| `rounded-full` | 9999px |

## 4. 阴影

| 类名 | token |
|---|---|
| `shadow-none` | `--shadow-none` |
| `shadow-sm` | `--shadow-sm` |
| `shadow-md` 或 `shadow` | `--shadow-md` |
| `shadow-lg` | `--shadow-lg` |
| `shadow-xl` | `--shadow-xl` |

## 5. 字号与行高

| 类名 | 值 |
|---|---|
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |
| `leading-tight` | 1.25 |
| `leading-normal` | 1.5 |
| `leading-relaxed` | 1.75 |
| `font-medium / semibold / bold` | 500 / 600 / 700 |

## 6. 断点

| 类名前缀 | 触发宽度 |
|---|---|
| `sm:` | ≥ 768px (tablet) |
| `md:` | ≥ 1024px (desktop) |
| `lg:` | ≥ 1440px (wide) |

```html
<!-- 移动优先 → tablet → desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

## 7. 暗黑模式

```html
<html data-theme="light">
<!-- 切换 root.dataset.theme = 'dark' -->
```

```html
<div class="bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50">
```

> 配置：`darkMode: ['class', '[data-theme="dark"]']`

## 8. 焦点环（a11y）

```html
<button class="focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus:outline-none">
```

## 9. 动效

```html
<button class="transition-colors duration-base ease-standard hover:bg-primary-600">
```

> 配置后可用 `duration-fast/base/slow` 与 `ease-standard/emphasized`。

## 10. 常见组件类名组合

### Button (Primary)

```html
<button class="
  inline-flex items-center justify-center gap-2
  px-4 py-2
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white font-semibold text-base
  rounded-md
  shadow-sm
  transition-colors duration-fast ease-standard
  focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus:outline-none
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Submit
</button>
```

### Card

```html
<div class="
  bg-neutral-50 dark:bg-neutral-100
  p-6
  rounded-lg
  shadow-md
  border border-neutral-200 dark:border-neutral-700
">
```

### Input

```html
<input class="
  w-full
  px-3 py-2
  bg-neutral-50 dark:bg-neutral-100
  border border-neutral-300 dark:border-neutral-700
  rounded-md
  text-neutral-900 dark:text-neutral-50 text-base
  placeholder:text-neutral-400
  focus-visible:ring-2 focus-visible:ring-primary-500 focus:outline-none
  disabled:bg-neutral-100 disabled:cursor-not-allowed
" />
```

### Empty State

```html
<div class="flex flex-col items-center justify-center gap-3 p-12 text-center">
  <svg class="w-16 h-16 text-neutral-300" />
  <p class="text-base font-medium text-neutral-900">还没有数据</p>
  <p class="text-sm text-neutral-500">添加你的第一条记录吧</p>
  <button class="...">立即添加</button>
</div>
```

## 11. 反例

```html
<!-- ❌ 硬编码颜色 -->
<div class="bg-[#3b82f6]">

<!-- ❌ 任意值间距 -->
<div class="p-[15px] m-[7px]">

<!-- ❌ 用了 Tailwind 默认色 -->
<div class="bg-blue-500 text-zinc-100">

<!-- ✅ 全部走 token -->
<div class="bg-primary-500 text-neutral-50 p-4 m-2">
```
