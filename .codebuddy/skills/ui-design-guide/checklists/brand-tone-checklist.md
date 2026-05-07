# Brand Tone Checklist

> 品牌语调落地清单。AI 在生成按钮文字、placeholder、错误提示、空状态文案时**必须**读取 `brand-kit.tone` 字段并匹配对应风格。

## 1. 六种 Tone 对照表

| 场景 | formal（正式） | friendly（友好） | geek（极客） | playful（俏皮） | luxury（高奢） | medical（严谨） |
|---|---|---|---|---|---|---|
| **CTA 按钮** | 立即提交 | 试试看 | Run | 走起 | 探索 | 确认 |
| **登录** | 登录 | 欢迎回来 | Sign in | Hi！登录吧 | 进入 | 登录账户 |
| **空状态** | 暂无数据 | 这里空空的~ 先添加一条吧 | No data. Add one. | 哎呀！什么都还没有 | 此处尚无内容 | 暂无记录 |
| **错误** | 操作失败，请稍后重试 | 哎呀，刚才出了点小问题 | Error: failed. Retry? | 呜呜失败了，再来一次？ | 操作未完成 | 系统繁忙，请重试 |
| **placeholder** | 请输入邮箱 | 你的邮箱地址 | email@example.com | 邮箱填这里~ | 您的邮箱 | 请输入邮箱地址 |
| **成功 toast** | 已保存 | 搞定！ | Done. | 棒棒哒！ | 已完成 | 操作已完成 |
| **删除确认** | 确认删除该记录？ | 真的要删除吗？ | Delete? y/n | 删了它好嘛？ | 确认删除？ | 确认删除该数据？此操作不可撤销 |

## 2. 通用规则

- [ ] **优先复用** `brand-kit.voiceSamples.{buttonCta|errorMessage|emptyState|placeholder|successToast}` 中的样例
- [ ] 没有样例时，按上表对照表生成；保持同 tone 内的一致性
- [ ] 同一项目**不混用** tone（除非明确做大版本切换）
- [ ] 多语言版本翻译时**保留 tone 等价性**：formal 中文 → formal 英文（用 "Please"），不变成 friendly

## 3. 反例

| 反例 | 问题 | 修正 |
|---|---|---|
| `tone=medical` 写"哎呀出错啦~" | 与严谨语调冲突 | "系统繁忙，请重试" |
| `tone=playful` 写"操作失败" | 太冷 | "啊哦，没成功，再试一次？" |
| `tone=luxury` 用感叹号"立即抢购！！" | 失去克制感 | "立即购置" |
| `tone=geek` 写大段散文 | 失去精炼感 | 短句 + 命令式 + 英文术语 |

## 4. 锁定色（Locked Colors）

- [ ] `brand-kit.lockedColors` 中的颜色**禁止被 Vibe Mapping / 主题切换 / configurator 覆盖**
- [ ] 这些颜色通常是 Logo 主色、企业 VI 色
- [ ] Configurator 在锁定色对应的 swatch 旁显示锁图标
- [ ] 暗黑模式下也不替换，仅调整其周边底色保证对比度

## 5. Logo 用法

- [ ] `brand-kit.logoSvg` 优先单色 + `currentColor`，便于自动适配明暗模式
- [ ] Header 区域 logo 高度 32–40px；移动端 24–32px
- [ ] Logo 的最小净空（clear space）≥ logo 高度的 1/4
- [ ] 不在低对比底色上直接显示 Logo，必要时加底纹或边框

## 6. 图标风格一致

- [ ] 全站 icon 统一来自 `brand-kit.iconStyle`（outline / filled / duotone）
- [ ] 不要在同一界面混用不同来源/不同 stroke-width 的图标

## 7. 字体偏好

- [ ] 若 `brand-kit.fontPairing.display` 存在，则 H1/H2 使用之
- [ ] `body` 使用 `brand-kit.fontPairing.body` 或 `tokens.typography.fontFamily.sans`
- [ ] 中文系统字体回退：`"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui`

## 8. 校验脚本（伪代码）

```js
function pickCta(brandKit, fallback) {
  const samples = brandKit.voiceSamples?.buttonCta;
  if (samples?.length) return samples[0];
  const map = {
    formal:   '提交',
    friendly: '试试看',
    geek:     'Run',
    playful:  '走起',
    luxury:   '探索',
    medical:  '确认',
  };
  return map[brandKit.tone] ?? fallback;
}
```
