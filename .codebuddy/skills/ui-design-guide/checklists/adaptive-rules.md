# Adaptive Rules — Magic Resize 自适应规约

> 灵感来自 Canva Magic Resize：一稿适配多端。本清单规定字号、间距、容器宽度在断点切换时的**确定性缩放规则**。

## 1. Fluid Typography（流体字号）

字号在断点之间使用 `clamp(min, fluid, max)`，避免离散跳变。

```css
:root {
  --font-size-base: clamp(14px, 1.6vw, 16px);
  --font-size-lg:   clamp(16px, 1.8vw, 18px);
  --font-size-xl:   clamp(18px, 2.2vw, 20px);
  --font-size-2xl:  clamp(20px, 3vw,   24px);
  --font-size-3xl:  clamp(24px, 4vw,   30px);
  --font-size-4xl:  clamp(30px, 5vw,   36px);
  --font-size-5xl:  clamp(36px, 6vw,   48px);
}
```

> `min` 取自 `breakpoint.scaling.fontSize.{step}.min`（mobile 端最小值）  
> `max` 取自 `breakpoint.scaling.fontSize.{step}.max`（desktop 端最大值）  
> `fluid` 推荐 `(max - min) / (1440 - 320) * 100vw + 起始值`（线性插值）

## 2. Spacing 缩放系数

间距整体随断点乘缩放系数（来自 `breakpoint.scaling.spacing`）：

| 端 | 缩放系数 | 说明 |
|---|---|---|
| mobile  | 0.875 | 略紧凑 |
| tablet  | 1.000 | 基准 |
| desktop | 1.000 | 基准 |
| wide    | 1.125 | 略宽松 |

实现方式 A（CSS 变量层级覆盖，推荐）：

```css
:root          { --space-scale: 0.875; }            /* mobile 默认 */
@media (min-width: 768px)  { :root { --space-scale: 1.000; } }
@media (min-width: 1440px) { :root { --space-scale: 1.125; } }

:root {
  --space-1:  calc(4px  * var(--space-scale));
  --space-2:  calc(8px  * var(--space-scale));
  --space-3:  calc(12px * var(--space-scale));
  --space-4:  calc(16px * var(--space-scale));
  /* ... */
}
```

实现方式 B（构建时生成不同变量）：将 `--space-*-mobile / -tablet / -desktop / -wide` 三套变量并发，在媒体查询中切换 alias。

## 3. 容器宽度策略

```css
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--space-4);
  max-width: 100%;                                /* mobile: 满宽 */
}
@media (min-width: 768px)  { .container { max-width: 720px; } }
@media (min-width: 1024px) { .container { max-width: 960px; } }
@media (min-width: 1440px) { .container { max-width: 1280px; } }
```

> 上述 max-width 取自 `breakpoint.scaling.container` 字段。

## 4. 标题阶梯降级

移动端 H1/H2/H3 各降一档，避免占据过多视觉重量：

| 桌面 | 移动 |
|---|---|
| H1 = 5xl (48px) | H1 = 4xl (36px) |
| H2 = 4xl (36px) | H2 = 3xl (30px) |
| H3 = 3xl (30px) | H3 = 2xl (24px) |

实现：使用 fluid clamp 自动达成。

## 5. Grid 列数

| 端 | 推荐 grid 列 |
|---|---|
| mobile | 1（单列） |
| tablet | 2 |
| desktop | 3–4 |
| wide | 4–6 |

```css
.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}
@media (min-width: 768px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1440px) { .grid { grid-template-columns: repeat(4, 1fr); } }
```

## 6. 输入控件高度

| 端 | min-height |
|---|---|
| mobile | 44px（触控热区） |
| desktop | 36px |

## 7. 校验规则

- [ ] 任何字号都不应直接写 `px`（除 0/1px 边框/分隔线），必须经 token 或 clamp
- [ ] 任何间距都必须经 `var(--space-*)`，不直接写数值
- [ ] 容器 max-width 必须取自 token，不硬编码
- [ ] 关键区域在 320px 宽度下可正常浏览（不出现横向滚动）
- [ ] 关键区域在 1920px 宽度下不出现孤立的"漂浮"内容（容器居中限宽）

## 8. 反例

```css
/* ❌ 离散跳变，断点处突然变大 */
.title { font-size: 24px; }
@media (min-width: 1024px) { .title { font-size: 36px; } }

/* ✅ 流体过渡 */
.title { font-size: clamp(24px, 3vw, 36px); }
```
