# i18n Checklist

> 国际化校验清单。AI 生成可见文案时**必须**外置，不得硬编码。

## 1. 文案外置

- [ ] 所有可见字符串放入 `i18n/{lang}.json` / `locales/{lang}.json` / `lang/{lang}.ts` 等
- [ ] 不在组件中硬编码中文/英文（除占位、调试日志、内部 type 字面量）
- [ ] 优先复用 `brand-kit.voiceSamples` 中的句式作为 zh-CN 翻译模板

## 2. 长文本与截断

- [ ] 按钮、Tag、Tab 标签预留 30% 长度冗余（英文/德文常更长）
- [ ] 限定行数：`-webkit-line-clamp: N` + `text-overflow: ellipsis`
- [ ] 表格单元格 `max-width` + `truncate` + tooltip 显示完整文本

## 3. 数字、日期、货币

- [ ] 用 `Intl.NumberFormat` / `Intl.DateTimeFormat`，禁止字符串拼接
- [ ] 货币：始终带符号 + 小数位，根据 locale 决定符号位置
- [ ] 日期：相对时间（"3 天前"）使用 `Intl.RelativeTimeFormat`

## 4. RTL（从右到左）

- [ ] 关键布局使用 **逻辑属性**：`margin-inline-start` 替代 `margin-left`、`padding-inline` 替代左右 padding
- [ ] 图标方向性元素（箭头、返回键）用 CSS `transform` 在 `[dir="rtl"]` 下镜像
- [ ] Drawer / Popover 在 RTL 下自动翻转

## 5. 字体与字符集

- [ ] `font-family` 包含 fallback：`"Inter", "PingFang SC", "Hiragino Sans GB", system-ui, sans-serif`
- [ ] 阿拉伯/印地语等使用对应 fallback 字体
- [ ] 不要用 `letter-spacing` 强加在 CJK 字符（破坏排版）

## 6. 复数与性别

- [ ] 用 ICU MessageFormat 或 `Intl.PluralRules`：`{count, plural, one {# item} other {# items}}`
- [ ] 不要简单字符串拼接 `${count} item${count > 1 ? 's' : ''}`

## 7. 切换与持久化

- [ ] 语言切换器放在显眼位置（页头/账户菜单）
- [ ] 选择写入 localStorage / cookie
- [ ] HTML 根 `<html lang="...">` 与 `dir="..."` 同步切换

## 8. 与 brand-kit 协作

- [ ] zh-CN 文案语调匹配 `brand-kit.tone`
- [ ] 多语言版本保持同一 tone（如 formal 在英文也用 "Please" 而非 "Hey"）

## 自检示例

```ts
// ❌ 硬编码 + 字符串拼接
const text = `共 ${count} 个未读消息`;

// ✅ i18n + ICU
const text = t('inbox.unreadCount', { count });
// zh-CN: "共 {count} 个未读消息"
// en-US: "{count, plural, one {# unread message} other {# unread messages}}"
```
