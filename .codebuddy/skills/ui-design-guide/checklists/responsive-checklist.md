# Responsive Checklist

> 响应式设计校验清单。AI 生成 UI 代码时按本清单逐项校验。

## 1. 断点（Breakpoints）

> 全局唯一断点，全部从 `design-tokens.breakpoint` 读取，**禁止**硬编码。

| 名称 | 默认值 | 适用 |
|---|---|---|
| `mobile` | 0 | 默认（移动优先） |
| `tablet` | 768 | iPad / 横屏手机 |
| `desktop` | 1024 | 笔电 / 小屏台式 |
| `wide` | 1440 | 大屏桌面 |

- [ ] 所有 `@media (min-width: ...)` 使用 `--bp-*` 变量或同名 SCSS/JS 常量
- [ ] 移动优先：默认样式针对 mobile，向上覆盖
- [ ] 不要使用 `max-width` 链式查询（除非有特殊业务）

## 2. 容器宽度

- [ ] 主内容容器 max-width 用 `breakpoint.scaling.container` 中的对应端值
- [ ] 容器水平 padding 至少 `--space-4`，移动端 `--space-3`
- [ ] 长 form / 文章正文 max-width ≤ 720px 保证可读

## 3. 触控热区

- [ ] 移动端可点击区域 **≥ 44×44 px**
- [ ] 相邻可点击元素间距 ≥ `--space-2`（8px）
- [ ] 桌面端 button min-height ≥ 32px，移动端 ≥ 44px

## 4. 字号与间距自适应

详见 `adaptive-rules.md`。基本要求：

- [ ] 字号使用 `clamp(min, fluid, max)`，min/max 取自 `breakpoint.scaling.fontSize`
- [ ] 间距按 `breakpoint.scaling.spacing[端]` 系数缩放
- [ ] 标题阶梯（h1/h2/h3）在移动端可降一档

## 5. 横屏与折叠屏

- [ ] 横屏（`@media (orientation: landscape) and (max-height: 480px)`）下隐藏装饰、紧凑布局
- [ ] 关键 CTA 不被虚拟键盘遮挡（form 内用 `scrollIntoView` 或 sticky bottom）

## 6. 多端适配

| 端 | 技术约束 |
|---|---|
| **PC Web** | CSS Grid / Flexbox + `@media`；`hover:` 状态生效 |
| **H5 移动** | 视口 `<meta name="viewport" content="width=device-width, initial-scale=1">`；`hover:` 替换为 `:active` |
| **微信小程序** | 使用 `rpx`（750rpx = 屏宽）；token 中 px → rpx 换算：`rpx = px * 750 / 375` |
| **UniApp** | 同小程序 + 条件编译 `#ifdef MP-WEIXIN/H5/APP` |

## 7. 图片与媒体

- [ ] `<img>` 设置 `srcset` + `sizes` 多端适配
- [ ] 关键图设置 `loading="lazy"` + 占位 `aspect-ratio`，避免 CLS
- [ ] 视频播放器在窄屏铺满，宽屏限宽

## 8. 数据表格

- [ ] 移动端表格转卡片或横向滚动（`overflow-x: auto` + 视觉提示）
- [ ] 关键列固定（sticky）

## 自检要点

```css
/* 错误示范 */
@media (min-width: 768px) { ... }   /* ❌ 硬编码断点 */
.btn { padding: 12px 16px; }         /* ❌ 硬编码间距 */

/* 正确示范 */
@media (min-width: var(--bp-tablet)) { ... }  /* ✅ */
.btn { padding: var(--space-3) var(--space-4); } /* ✅ */
```
