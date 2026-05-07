---
name: ui-design-guide
description: "约束并指导多端（微信小程序/H5/PC/UniApp）多框架（HTML/Vue/React）多 UI 库（WeUI/Tailwind/Shadcn/AntD/Arco/TDesign）项目的 UI 设计与代码产出。**针对微信小程序做了全流程优化**：内置 weui-light/weui-dark 主题、WeUI 组件规范、rpx 换算、胶囊按钮/TabBar/安全区避让、11 种小程序页面骨架预览。提供 design-tokens 与 brand-kit 双契约、Vibe 风格映射（含 wechat/ecommerce/social）、8 套主题预设、内置可视化配置网页与可交互小程序原型预览器。This skill should be used when the user is developing or refactoring UI code, mentions design system / theme / tokens / brand kit / vibe / dark mode / accessibility / responsive / WeUI / 微信小程序 / 小程序设计, or wants to apply a unified visual style across pages."
---

# UI Design Guide — UI 设计开发约束器（微信小程序全流程优化版）

## Purpose

约束 AI 在已有项目中开发或重构 UI 代码时的产出，使其严格遵循统一的设计系统（design tokens）与品牌资产（brand kit）。本 Skill **不生成业务脚手架**，只输出"规则 + 资源 + 模板 + 内置工具网页"，让 AI 读取后受约束地写代码。

**🟢 针对微信小程序做了全流程深度优化**：

- **设计层**：WeUI 规范主题（`weui-light` / `weui-dark`）· WeUI 专属色板 · rpx 单位适配 · Vibe 标签 `wechat` 一键套用
- **预览层**：1:1 还原小程序模拟器（状态栏 + 自定义导航栏 + 胶囊按钮 + 底部 TabBar + 安全区）· 11 种典型页面骨架（首页 / 列表 / 详情 / 个人中心 / 搜索 / 订单 / 登录 / 空态 / 错误 / 成功 / 分类）
- **代码层**：`templates/wechat-miniprogram/` 完整接入指南（app.wxss 注入 / prefers-color-scheme 暗黑 / 胶囊按钮避让 / 自定义 TabBar / 性能与合规清单）

## When to Use

当用户出现以下意图之一时触发：

- 提到 **设计系统 / design system / 主题 / theme / tokens / 设计 token**
- 提到 **品牌 / brand / brand kit / Logo 适配 / 品牌色 / 品牌语调**
- 提到 **暗黑模式 / dark mode / 配色 / 可访问性 / a11y / 响应式 / responsive**
- 描述 **风格情绪**（如"宁静、专业、科技感、赛博朋克、医疗风、高奢"等 Vibe 词）
- 要求**统一改造现有页面视觉**、**新增页面但需对齐既有风格**
- 要求**多端（PC/H5/小程序/UniApp）保持视觉一致**
- 要求**生成或调整组件样式、主题切换、响应式断点**

## How to Launch Configurator & Preview

Skill 自带两个零构建静态网页，**双击即可打开**：

| 工具 | 路径 | 用途 |
|---|---|---|
| Configurator | `.codebuddy/skills/ui-design-guide/configurator/index.html` | 可视化调节 tokens + brand-kit，实时预览，导出双 JSON |
| Preview Prototype | `.codebuddy/skills/ui-design-guide/preview/preview-template.html` | hash 路由 + 多屏页面级联 + 状态切换器，验证设计一致性 |

**file:// 协议兜底**：部分浏览器（如 Chrome）双击打开时会拦截 `fetch` 本地 JSON。遇到该问题：

1. 改用页面上的 `<input type="file">` 手动加载预设 / tokens JSON；或
2. 在 Skill 目录起本地静态服务：
   ```bash
   cd .codebuddy/skills/ui-design-guide
   python3 -m http.server 18888
   # 浏览器访问：
   #   http://localhost:18888/configurator/
   #   http://localhost:18888/preview/preview-template.html
   ```

## Workflow

AI 在执行任何 UI 编码任务前，**严格按以下顺序处理**：

### Step 0 · Vibe Mapping（情绪 → token 微调）

如果用户描述包含风格情绪词（calm/professional/playful/tech/medical/luxury/energetic/minimal/warm/neon 或同义词），**先读 `assets/vibe-tags.json`**，根据 hue/saturation/radius/shadow/duration 建议产出 token 调整方案，提示用户"建议用 configurator 微调后导出"。如果用户已提供 tokens JSON，跳过本步。

### Step 1 · 端识别（Platform Detection）

通过项目根目录文件特征识别：

| 信号 | 端 | 模板 |
|---|---|---|
| `app.json` + `pages/*.wxml` | 微信小程序 | `templates/wechat-miniprogram/` |
| `pages.json` + `manifest.json` | UniApp | `templates/uniapp/` |
| `package.json` 含 `vue` / `react` | Web (PC/H5) | `templates/vue/` / `templates/react/`（v2 占位） |
| 仅 `*.html` + `tailwind.config.*` | HTML+Tailwind | `templates/html-tailwind/` |

### Step 2 · 框架识别（Framework Detection）

读取 `package.json` 的 `dependencies` / `devDependencies`，确定主框架版本，决定后续生成代码的语法（SFC / JSX / WXML / Vue3 Composition / React Hooks）。

### Step 3 · UI 库识别（Library Detection）

检查依赖中是否含 `tailwindcss / shadcn-ui / antd / @arco-design/web-react / tdesign-*`，对应读取 `references/<lib>.md` 的速查规则。**未命中则默认 Tailwind + 原生 CSS 变量**。

### Step 4 · 加载 Tokens 与 Brand Kit

按以下顺序查找：

1. 项目根 `design-tokens.json` + `brand-kit.json`（首选）
2. 项目根 `tokens/`、`design/` 目录下同名文件
3. 若都不存在 → 提示用户"启动 configurator 生成或选择内置预设之一（apple-style / material-style / minimal / cyberpunk / default-light / default-dark）"

加载后**校验 schema**（`assets/design-tokens.schema.json` + `assets/brand-kit.schema.json`），失败则中止并报错聚合提示。

### 📱 小程序场景预设选择（Step 4 补充）

当 Step 1 识别为 **微信小程序** 或 UniApp 编译目标含 `MP-WEIXIN` 时：

| 场景 | 推荐预设 | 说明 |
|---|---|---|
| 默认小程序（WeUI 规范） | **`weui-light`** | 微信绿 `#07C160` + WeUI 色板 + rpx 友好字号阶梯 |
| 小程序暗黑模式 | **`weui-dark`** | 同上，mode=dark，对应 `prefers-color-scheme: dark` |
| 电商/促销类小程序 | `weui-light` + vibe `ecommerce` | 主色保持微信绿，局部强调红橙高饱和 |
| 社交/社区类小程序 | `weui-light` + vibe `social` | 柔和绿 + 大圆角气泡 + 柔阴影 |

对于非小程序项目，优先考虑：`default-light` / `apple-style` / `material-style` / `minimal` / `cyberpunk`。

### Step 5 · 校验（Constraints Check）

在生成代码**之前**做以下校验，任一不通过立即报警并提示修正：

| 维度 | 规则 | 来源 |
|---|---|---|
| 颜色对比度 | 文本对底色 ≥ 4.5:1（AA）；大文本/图标 ≥ 3:1 | `checklists/a11y-checklist.md` |
| 断点 | 必须使用 token 中的 mobile/tablet/desktop/wide | `checklists/responsive-checklist.md` |
| 间距 | 必须使用 4/8 px 基线网格上的 token 阶梯 | `assets/tokens-naming-convention.md` |
| 命名 | CSS 变量遵循 `--{group}-{name}-{step?}` | `assets/tokens-naming-convention.md` |
| 三态 | loading/empty/error 必须配套出现 | `checklists/states-checklist.md` |
| i18n | 文案外置 + 长文本截断 + RTL 检查 | `checklists/i18n-checklist.md` |
| 自适应 | 字号用 fluid clamp、间距按断点缩放系数 | `checklists/adaptive-rules.md` |
| 品牌语调 | 按钮/placeholder/error 文案语调匹配 `brand-kit.tone` | `checklists/brand-tone-checklist.md` |
| 锁定色 | 不得覆盖 `brand-kit.lockedColors` | `checklists/brand-tone-checklist.md` |

### Step 6 · 受约束输出（Constrained Output）

按以下原则生成代码：

- **样式只用 CSS Variables 或 Tailwind 引用 token 的类名**，禁止硬编码颜色 / px 数值
- **文案优先复用 `brand-kit.voiceSamples`** 中的句式；新增文案语气与 `tone` 一致
- **暗黑模式**通过 `[data-theme="dark"]` 或 `prefers-color-scheme` 注入 `color.modeOverrides.dark`
- **图标统一来源**（`brand-kit.iconStyle` 与 `tokens.icon.source`），不混用风格
- **动效**只用 `--dur-*` + `--ease-*`，不写硬编码 `200ms` 或 `ease-in-out`
- **响应式**：断点用 `--bp-*`；字号用 clamp(min, fluid, max)；间距乘 `breakpoint.scaling.spacing[端]`

## Constraints（核心约束清单）

- ✅ **断点**：`mobile=0 / tablet=768 / desktop=1024 / wide=1440`，全局唯一
- ✅ **基线网格**：所有 spacing 必须落在 4px 整数倍上
- ✅ **对比度**：文本 ≥ 4.5:1，UI 控件焦点环 ≥ 3:1
- ✅ **触控热区**：移动端可点击区域 ≥ 44×44 px
- ✅ **三态强制**：列表/卡片/数据视图必须实现 loading + empty + error
- ✅ **i18n**：所有可见文案外置；为 RTL 预留 `dir="rtl"` 适配
- ✅ **暗黑模式**：通过 `color.modeOverrides.dark` 而非另存一份完整主题
- ✅ **动效**：duration ≤ 320ms，遵循 motion.duration / motion.easing
- ✅ **图标**：单一来源 + 单一风格（outline/filled/duotone 三选一）
- ✅ **品牌语调**：文案严格按 `brand-kit.tone` 匹配
- ✅ **锁定色**：禁止替换 `brand-kit.lockedColors` 列出的颜色

## 📱 微信小程序专属约束（Wechat Miniprogram Constraints）

当目标端为微信小程序时，额外强制以下规则（对应 `templates/wechat-miniprogram/README.md` 第十节检查清单）：

| 维度 | 规则 |
|---|---|
| 单位 | spacing / sizing / font-size 一律用 **rpx**，不混 px（仅 `border-width: 1rpx/2rpx`、`border-radius` 可酌情 px） |
| 换算 | 设计稿基准 375px → `rpx = px × 2`；750px → `rpx = px × 1` |
| 触控热区 | **≥ 88rpx × 88rpx**（44px × 44px） |
| 顶部避让 | 自定义导航栏必须用 `wx.getSystemInfoSync()` + `wx.getMenuButtonBoundingClientRect()` 动态计算，避让胶囊按钮 |
| 底部避让 | 固定底部 CTA / TabBar 用 `env(safe-area-inset-bottom)` 处理 iPhone X+ |
| 暗黑模式 | `app.json` 必须 `"darkmode": true`；wxss 用 `@media (prefers-color-scheme: dark)` |
| TabBar | 需要完整主题切换时用**自定义 TabBar**（`custom-tab-bar/` 组件）；否则原生 tabBar 够用 |
| 反馈三态 | `wx.showLoading` / `wx.showToast({icon:'success'})` / `wx.showModal` 必须成套出现 |
| 关键操作二次确认 | 下单/支付/删除/退款 必须 `wx.showModal` 确认 |
| 防重复提交 | 表单提交期间按钮 `disabled` + `wx.showLoading` |
| 性能 | 单 wxss ≤ 1.5MB · 首包 ≤ 2MB · 长列表用 recycle-view |
| 合规 | 登录页含《用户协议》《隐私政策》勾选；文案无"第一/最佳"等极限词 |
| 图片 | `lazy-load="true"` + `mode="aspectFill"` 默认 |

## Important Notes

- 本 Skill 是"开发约束器"，**不生成项目脚手架、不安装依赖、不部署**
- Configurator 与 Preview 都通过相对路径 `../assets/*` 直接消费同 Skill 资源，**不维护副本**
- Vue / React / Shadcn / AntD / Arco / TDesign 在首版仅放占位 README，**v2 迭代补全**
- `admin-dashboard` 后台管理专项模板与 `tokens` `CHANGELOG` 自动版本化属于 v2
- 修改本 Skill 时**严格沿用** `name + description` 两字段 frontmatter 模式，与 `docs-toc-generator/SKILL.md`、`draft-organizer/SKILL.md` 保持一致

## File Index

| 类别 | 路径 |
|---|---|
| 契约 | `assets/design-tokens.schema.json`、`assets/brand-kit.schema.json` |
| 命名规范 | `assets/tokens-naming-convention.md` |
| Vibe 映射 | `assets/vibe-tags.json` |
| 主题预设 | `assets/themes/{weui-light,weui-dark,default-light,default-dark,apple-style,material-style,minimal,cyberpunk}.json`（8 套；weui-* 为小程序专用） |
| 配置网页 | `configurator/{index.html,style.css,app.js,README.md}` |
| 预览原型 | `preview/preview-template.html`、`preview/README.md` |
| 接入模板 | `templates/{html-tailwind,wechat-miniprogram,uniapp,vue,react}/` |
| UI 库速查 | `references/{tailwindcss,shadcn-ui,ant-design,arco-design,tdesign}.md` |
| 检查清单 | `checklists/{a11y,responsive,i18n,states,adaptive-rules,brand-tone}-checklist.md` |
