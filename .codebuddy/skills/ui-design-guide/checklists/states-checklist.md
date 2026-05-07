# States Checklist

> 五态规范：loading / empty / error / disabled / readonly。任何"展示数据"或"接受输入"的组件都必须配套实现。

## 1. Loading（加载中）

- [ ] 容器级别用 **Skeleton**（保留布局骨架），避免 spinner 占位导致的 layout shift
- [ ] 按钮级别用 inline spinner，**保留按钮宽高**
- [ ] 持续 ≥ 200ms 才显示（避免闪烁）
- [ ] `aria-busy="true"` 标记
- [ ] 禁用相关交互，但保留可见

```html
<button class="btn" aria-busy="true" disabled>
  <span class="spinner" aria-hidden="true"></span>
  <span>提交中…</span>
</button>
```

## 2. Empty（空状态）

- [ ] 必须有**插画或图标**（使用 `brand-kit.iconStyle` 风格）
- [ ] 必须有**主文案**（描述当前状态）
- [ ] 必须有**主操作**（CTA：去添加 / 去搜索 / 重新加载）
- [ ] 文案语调匹配 `brand-kit.tone`，复用 `brand-kit.voiceSamples.emptyState`
- [ ] 文字 ≤ 2 行

```html
<div class="empty">
  <svg class="empty-icon" />
  <p class="empty-title">还没有数据</p>
  <p class="empty-desc">添加你的第一条记录吧</p>
  <button class="btn-primary">立即添加</button>
</div>
```

## 3. Error（错误）

- [ ] 区分**字段级错误**（紧邻表单字段）与**页面级错误**（占满主区域）
- [ ] 必须包含：错误图标 + 错误描述 + **可执行的下一步**（重试 / 联系客服 / 返回）
- [ ] 错误码（若有）小字展示，便于排查
- [ ] 文字不要带情绪化责备语（"你输入错了"）；改为协助语（"请检查邮箱格式"）
- [ ] 复用 `brand-kit.voiceSamples.errorMessage`
- [ ] `aria-invalid="true"` + `aria-describedby`

## 4. Disabled（禁用）

- [ ] 视觉降饱和（`opacity: .5` 或 `--color-neutral-300`）
- [ ] 鼠标 `cursor: not-allowed`
- [ ] 必须仍可被屏幕阅读器读到（不要 `display: none`）
- [ ] **告知禁用原因**（tooltip / aria-describedby），避免用户困惑

## 5. Readonly（只读）

- [ ] 视觉与 disabled 区分（不变浅，但去掉边框/底色）
- [ ] 仍可获得焦点、可复制文本
- [ ] `aria-readonly="true"` 或原生 `readonly` 属性

## 6. 三态在数据视图中的组合

| 视图 | loading | empty | error |
|---|---|---|---|
| 列表 | 行级 skeleton ×N | empty 状态卡 | 顶部 banner + 重试按钮 |
| 卡片网格 | 卡片 skeleton | empty 状态卡 | banner + 重试 |
| 表单 | 字段 disabled + 顶部 spinner | — | 字段级 error + 顶部汇总 |
| 详情 | 整页 skeleton | 跳 empty 页 | 整页 error 页 |
| 搜索结果 | 输入区 spinner | 无结果 + 推荐 | banner 重试 |

## 7. 反例

- ❌ 仅在按钮上 `disabled` 而无 loading 提示
- ❌ 空状态只放一行文字，没有图标和 CTA
- ❌ 错误只 toast 一闪即逝，无法复制错误码
- ❌ Skeleton 与最终内容尺寸不一致导致跳动

## 8. 与 brand-kit 协同

```js
// 自检：empty 文案是否来自 brand-kit
function pickEmptyText(brandKit) {
  return brandKit.voiceSamples?.emptyState?.[0] ?? '暂无数据';
}
```
