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

## How to Launch Configurator（小程序设计工作台 · IDE 内置预览）

Skill 仅有**一个零构建静态网页**：`configurator/`。**激进合一：设计配置 + 组件库 + 效果库 + 可视化画布编辑（点选/拖拽/改尺寸）+ 多页面工程 + 代码生成** 全部集成在同一页面。**默认在 IDE 内置浏览器中打开**。

| 工具 | 入口路径 | 内置预览 URL（起服务后） |
|---|---|---|
| **Configurator 设计工作台** | `.codebuddy/skills/ui-design-guide/configurator/` | `http://localhost:18888/configurator/` |

### 能力速览

- 🧩 **组件库 67 个**：基础/布局/展示/反馈/导航/业务/页面积木 7 大类
- 🎭 **效果库 32 个**：加载/过渡/悬浮/手势/插画 5 大类（可叠加）
- 🎨 **8 套主题预设** + 13 个 Vibe 标签 + 品牌色锁定
- 🖱 **可视化编辑**：点选组件 → 右栏属性面板；拖拽 8 手柄改尺寸；从组件库拖到画布
- 📄 **多页面工程**：顶部 Tab 新建/删除/重命名，支持页面模板（首页/列表/详情/表单/个人中心）
- ⌨️ **撤销/重做**：Ctrl+Z / Ctrl+Y / Ctrl+D 复制 / Delete 删除 / Esc 取消选中
- 💾 **自动保存到 IndexedDB**，刷新不丢失
- 📤 **一键导出**：工程 JSON / tokens / brand-kit / **代码**（HTML / WXML / React / Vue3）

### 标准启动流程（AI 必须按此执行）

当用户提到"预览 / 配置主题 / 打开 configurator / 调设计 / 看看效果"等意图时，AI **按以下顺序**操作，不要让用户自己手动启动：

1. **检查端口占用**：先试 `18888`，被占则依次尝试 `18889 / 18900 / 28888`。
   ```bash
   lsof -i:18888 2>/dev/null
   ```
2. **启动本地静态服务**（workspace 根下执行，后台运行）：
   ```bash
   cd <workspace>/.codebuddy/skills/ui-design-guide && python3 -m http.server 18888 &
   ```
3. **在 IDE 内置浏览器打开**（使用 `preview_url` 工具，用户直接在编辑器里看到）：
   - `http://localhost:18888/configurator/`
4. **URL 参数透传**（可选）：
   - 指定预设：`?theme=weui-light`（或 `weui-dark` / `default-light` / `apple-style` / `material-style` / `minimal` / `cyberpunk`）
   - 指定初始路由（进入后自动切到某个小程序页面）：`#/mp/home` / `#/mp/list` / `#/mp/detail` / `#/mp/mine` / `#/mp/search` / `#/mp/order` / `#/mp/login` / `#/mp/empty` / `#/mp/error` / `#/mp/success` / `#/components`
   - 示例：`http://localhost:18888/configurator/?theme=weui-dark#/mp/detail`

### 服务端口同步约定

- Skill 内**所有文档示例端口**统一写 `18888`
- 若实际占用改用其他端口，AI **必须同步更新文档引用**或在回复中明确告知用户当前端口

### file:// 协议兜底（仅当无法起服务时）

若运行环境无 `python3` / `lsof`（如受限容器），回退方案：

1. 让用户**双击** `configurator/index.html`
2. 页面加载失败时，用页内「导入 tokens」按钮手动上传 `assets/themes/*.json`
3. 告知用户也可尝试：
   ```bash
   # Node 环境
   npx serve .codebuddy/skills/ui-design-guide -p 18888
   # 或 PHP
   php -S localhost:18888 -t .codebuddy/skills/ui-design-guide
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

按下表匹配依赖 / 文件特征，读取对应 `references/<lib>.md` 的速查规则。**未命中则默认 Tailwind + 原生 CSS 变量**。

| 特征 | UI 库 | 速查 |
|---|---|---|
| `app.json` + `pages/*.wxml` | 原生微信小程序 + WeUI | `references/wechat-miniprogram.md` |
| `weui-miniprogram` 依赖 | WeUI 官方组件库 | `references/wechat-miniprogram.md` |
| `pages.json` + `manifest.json` | UniApp | `references/uniapp.md` |
| `@climblee/uv-ui` / `uview-ui` / `@dcloudio/uni-ui` / `wot-design-uni` | uni 系 UI 库 | `references/uniapp.md` |
| `tailwindcss` | Tailwind CSS | `references/tailwindcss.md` |
| `shadcn-ui` / `@shadcn/ui` | Shadcn UI | `references/shadcn-ui.md`（v2 占位） |
| `antd` / `ant-design-vue` | Ant Design | `references/ant-design.md`（v2 占位） |
| `@arco-design/web-react` / `@arco-design/web-vue` | Arco Design | `references/arco-design.md`（v2 占位） |
| `tdesign-react` / `tdesign-vue-next` / `tdesign-miniprogram` | TDesign | `references/tdesign.md`（v2 占位） |

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
| 一体化设计工作台 | `configurator/index.html`、`configurator/style.css`、`configurator/README.md`、`configurator/js/**/*.js`（30 个 ESM 模块，3800+ 行：`core/`状态+历史+持久化、`components/`67 个 WeUI 组件、`effects/`32 效果、`canvas/`画布+拖拽+快捷键、`panels/`属性面板、`project/`多页面+代码生成、`tokens/`主题+Vibe） |
| 接入模板 | `templates/{html-tailwind,wechat-miniprogram,uniapp,vue,react}/` |
| UI 库速查 | `references/{wechat-miniprogram,uniapp,tailwindcss,shadcn-ui,ant-design,arco-design,tdesign}.md`（前三项首版完整） |
| 检查清单 | `checklists/{a11y,responsive,i18n,states,adaptive-rules,brand-tone}-checklist.md` |
