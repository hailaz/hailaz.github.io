# Configurator

> 内置可视化配置网页，零构建。在浏览器中调节 design tokens 与 brand-kit，实时预览，导出 JSON。

## 启动方式

### 方式 A：双击打开（推荐用于离线环境）

直接双击 `index.html`。**部分浏览器（如 Chrome）会拦截 `fetch` 本地 JSON**，导致预设/Vibe 加载失败：

- ✅ 仍可使用：手动调节表单 + 实时预览 + 导出 JSON（不依赖 fetch）
- ❌ 不可用：「预设下拉」「Vibe 标签库」「Schema 远程加载」

遇到拦截时，请使用方式 B；或通过页面右上角「📂 导入 tokens / brand-kit」上传本地 JSON。

### 方式 B：本地静态服务（推荐）

```bash
cd .codebuddy/skills/ui-design-guide
python3 -m http.server 18888
# 浏览器访问：http://localhost:18888/configurator/
```

或使用 Node：

```bash
npx --yes serve .codebuddy/skills/ui-design-guide
```

## 界面布局

三栏 + 顶部工具栏：

```
┌──────────────────────────────────────────────────────────────────────┐
│ Topbar: 预设选择 │ Vibe 输入 │ 明暗切换 │ 导入/导出按钮              │
├───────────────┬──────────────────────────┬──────────────────────────┤
│ 左侧 (360px)  │   中间 实时预览区        │   右侧 JSON (380px)      │
│ Vibe / Brand  │                          │   tokens │ brand-kit     │
│ Kit / Tokens  │   按钮/输入/卡片/空态/   │   实时输出 + 校验         │
│ 三 Tab        │   色阶预览               │                          │
└───────────────┴──────────────────────────┴──────────────────────────┘
```

## 表单 Tab 说明

### 1. Vibe（情绪/风格）

- 顶部输入框：输入情绪词（支持中英文，如 `calm, professional` 或 `宁静, 专业`），点「应用 Vibe」
- 标签卡片：点击任一标签即应用对应建议
- 应用效果：自动调整 `color.primary` 色阶（基于 hue 区间）、`radius`、`shadow`、`motion.duration`，并写入 `meta.vibeTags`

### 2. Brand Kit

- 必填：品牌名 + 品牌语调
- Logo SVG 内联粘贴 + 实时预览
- 锁定品牌色：每行一个 HEX，被锁定的颜色不会被 Vibe 或主题切换覆盖
- 语调样例：按行分隔，AI 生成 UI 文案时优先复用

### 3. Tokens

- 颜色：Primary / Neutral 各 10 阶；Semantic 仅 500
- 修改 500 时**自动重建 50–900 整个色阶**（hue/saturation 保持，lightness 阶梯）
- 锁定色不会被自动重建覆盖
- 字体 / 圆角 / 间距 / 阴影 / 动效 / 断点（含 Magic Resize 缩放系数） / 元信息

## 实时预览

中间预览区使用 CSS Variables 驱动，所有变更立刻生效：

- Logo + 品牌名（来自 brand-kit）
- 按钮（CTA 文字根据 tone 自动变化）
- 输入框（placeholder 根据 tone 自动变化）
- 卡片
- 空状态（文案 + CTA 根据 tone）
- 色阶预览（500 是基准，hover 显示 HEX）

## JSON 输出

右侧实时显示两份 JSON：

- `design-tokens.json` — 给业务项目使用
- `brand-kit.json` — 给业务项目使用

底部「校验」区域显示 schema 校验结果（必填字段 / HEX 格式 / semver / tone 合法性）。

## 导出与协作

1. 点击「⬇ 导出 tokens」「⬇ 导出 brand-kit」下载到本地
2. 把两份 JSON 放到项目根目录
3. AI 写 UI 时会自动加载这两份文件，按 SKILL.md 工作流约束输出代码

## 常见问题

| 问题 | 解决 |
|---|---|
| 双击打开后预设下拉无效 | Chrome 拦截了 file:// 下的 fetch，请用本地静态服务 |
| Vibe 标签库为空 | 同上 |
| 颜色阶梯不符合预期 | 阶梯算法是简化的 lightness 映射；可手动微调单个阶梯 |
| Logo 粘贴后没显示 | SVG 必须以 `<svg ...>` 开头，且不超过 4KB |
| 锁定色生效但不显示锁图标 | 颜色 HEX 大小写不敏感；如不显示请刷新 |

## 与 Skill 协作

- 本目录与 `../assets/themes/` 共用同一份预设文件，通过相对路径加载（无副本）
- `../assets/vibe-tags.json` 是 Vibe 映射的唯一源
- `../assets/design-tokens.schema.json` 与 `../assets/brand-kit.schema.json` 是契约（首版校验为简化子集，v2 引入完整 ajv 校验）

## v2 计划

- [ ] 完整 ajv schema 校验（含 patternProperties / required 嵌套）
- [ ] 反向编辑模式：导入用户项目的 tokens.json + 自动 diff
- [ ] 多预设对比视图（左右两份 tokens 同时预览）
- [ ] 一键应用到 preview 原型并跳转
- [ ] 实时对比度计算（WCAG AA/AAA 标记）
