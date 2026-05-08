# UI Design Guide · 激进重构 Roadmap

> 目标：把 `configurator/` 从"设计系统配置 + 小程序原型预览"升级为**完整的小程序可视化设计工作台**。
> 主攻平台：微信小程序（WeUI 规范）。Web 顺带兼容。
> 启动地址：`http://localhost:18888/configurator/`

---

## 🟢 已完成（Phase 1 · MVP ~3900 行）

### 1. 基础设施层（`js/core/` · 6 文件 · ~650 行）

- [x] **`id.js`** — nanoid 风格节点 ID
- [x] **`state.js`** — 多页面工程 state + 事件总线（订阅/发布）
- [x] **`history.js`** — undo/redo 命令栈
- [x] **`commands.js`** — 所有可撤销命令（addNode/removeNode/updateProps/updateStyle/moveNode/resizeNode...）
- [x] **`selection.js`** — 选中态 + 悬浮态管理
- [x] **`persistence.js`** — IndexedDB 持久化（自动保存 + 恢复）

### 2. 组件库（`js/components/` · 8 文件 · ~1500 行）

- [x] **`registry.js`** — 注册中心（`register` / `getComponent` / `renderNode` / `nodeAttrs`）
- [x] **`mp-base.js`** — 18 个基础组件：Button / Input / Textarea / Switch / Icon / Text / Image / Link / Checkbox / Radio / Rate / Slider / Tag / Divider / Loading / Badge / Avatar / Progress
- [x] **`mp-layout.js`** — 9 个布局：Container / Flex / Grid / Space / Section / Cell / CellGroup / List / Safe-area
- [x] **`mp-display.js`** — 11 个展示：Card / Goods-card / Avatar-group / Tabs / Steps / Timeline / Stat / Breadcrumb / Empty / Result / Skeleton
- [x] **`mp-feedback.js`** — 8 个反馈：Alert / Toast / Modal / Action-sheet / Half-screen / Msg / Tag-notice / Dialog
- [x] **`mp-nav.js`** — 5 个导航：Navbar / Capsule / Searchbar / Tabbar / Fab
- [x] **`mp-business.js`** — 10 个业务：Goods-list-item / Order-card / Comment / Chat-bubble / Coupon / Red-packet / User-card / Notice-card / Message-row / Live-card
- [x] **`mp-blocks.js`** — 6 个页面积木：Hero / Swiper-banner / Grid-menu / Section-header / Feature-grid / Action-bar
- [x] **合计 67 个**

### 3. 效果库（`js/effects/` · 5 文件 · ~400 行）

- [x] **`registry.js`** — 效果注册中心
- [x] **`loading.js`** — 8 个加载：spin / dots / bars / bouncing / pulse / ring / shimmer / skeleton-wave
- [x] **`transition.js`** — 8 个过渡：fade-in / slide-up / slide-down / zoom-in / flip / rotate / bounce / elastic
- [x] **`hover.js`** — 8 个悬浮：lift / glow / tilt / shift / scale / press / shake / ripple
- [x] **`illustration.js`** — 8 张 SVG 插画：empty-list / empty-search / error-network / error-404 / success / maintenance / no-data / no-permission
- [x] **合计 32 个**

### 4. 画布交互（`js/canvas/` · 4 文件 · ~680 行）

- [x] **`canvas.js`** — 渲染节点树 + 选中框 + 悬浮提示 + 8 手柄拖拽改尺寸
- [x] **`tree.js`** — 左栏节点树（层级缩进 + 点击选中）
- [x] **`components-sidebar.js`** — 最左栏组件库（分类 + 搜索 + HTML5 拖拽源）
- [x] **`keyboard.js`** — 快捷键（Ctrl+Z/Y/D、Delete、Esc、↑/↓ 移动层级）

### 5. 属性面板（`js/panels/` · 1 文件 · ~280 行）

- [x] **`props-panel.js`** — 三 Tab 设计：
  - 属性（组件 schema 驱动的 props 编辑器）
  - 样式（color / bgColor / padding / margin / radius / fontSize / shadow / border）
  - 效果（叠加 32 个效果中的任意组合）

### 6. 工程管理（`js/project/` · 4 文件 · ~470 行）

- [x] **`pages.js`** — 多页面栏（新建 / 复制 / 删除 / 重命名 / 切换 / 拖拽排序）
- [x] **`page-templates.js`** — 5 个模板：首页 / 列表 / 详情 / 表单 / 我的
- [x] **`export.js`** — 导入/导出工程 JSON + tokens + brand-kit
- [x] **`code-gen.js`** — 4 种代码生成：HTML / WXML + WXSS / React (JSX) / Vue3 (SFC)

### 7. 主题引擎（`js/tokens/` · 1 文件 · ~250 行）

- [x] **`engine.js`** — 整合 tokens → CSS vars 注入 + Vibe 映射 + 色阶生成 + 8 套预设加载

### 8. 装配 + 样式（~400 行）

- [x] **`main.js`** — 总装配入口（110 行）
- [x] **`index.html`** — 5 栏布局（组件库 / 节点树 / 画布 / 属性面板 / Tokens+JSON）
- [x] **`style.css`** — 小程序模拟器样式 + WeUI 基础组件 CSS + 编辑器外壳

### 9. 文档

- [x] **`SKILL.md`** — 标注激进升级、文件索引、启动 SOP
- [x] **`README.md`** — 快速开始双场景
- [x] **`configurator/README.md`** — 新架构速查
- [x] **`templates/wechat-miniprogram/README.md`** — 小程序全流程接入（10 大章节）
- [x] **`references/wechat-miniprogram.md`** — 原生小程序 + WeUI 速查
- [x] **`references/uniapp.md`** — UniApp 生态速查

---

## 🟡 未完成（Phase 2 · 精修 ~2000 行）

### A. 运行时稳定性（最高优先级）

- [x] **A1. 全局错误捕获** — `main.js` 新增 `window.error` / `unhandledrejection` 监听，错误以 Toast 呈现，避免白屏
- [x] **A2. 空画布引导** — 引导卡片含 5 个页面模板快捷入口 + 快捷键提示
- [x] **A3. `nodeAttrs` 空 `class=""` 清理** — 无 baseClass + 无 effects 时不输出 class 属性
- [x] **A4. 节点 removeNode 后选中态清除** — 已在 `cmdRemoveNode` 中处理（`state.selectedNodeId = null`）
- [x] **A5. persistence 写入防抖** — 已有 500ms 去抖（`autosave`）
- [x] **A6. undo/redo 后选中态恢复** — 命令的 `do/undo` 内部维护 selection，history.js 会触发 `project:changed` 重渲
- [x] **A7. 导入异常工程 JSON 的降级** — 新增 `validateProject` schema 预检 + Toast 提示 + 清空 history
- [x] **A8. 全局 Toast / Confirm 工具** — 新增 `js/ui/toast.js`，替代原生 alert/confirm

### B. 代码生成器补齐（目前覆盖 ~40 个组件）

- [x] **B1. 组件级 codegen hook** — 每个组件注册时可提供 `codegen: { html / wxml / react / vue }` 可选方法，优先于内置规则
- [x] **B2. WXML 规则扩展** — 基础 15 个 + 布局 8 个 + 导航 4 个 + 展示 5 个 + 反馈 3 个 + 业务 1 个 ≈ 40 类型覆盖
- [x] **B3. React JSX 规则扩展** — 同 WXML 覆盖度
- [x] **B4. Vue 3 template 规则扩展** — 同 WXML 覆盖度
- [x] **B5. fallback 兜底** — 未识别组件降级为 `<view>`/`<div>` + 保留 children，加组件类型注释
- [x] **B6. HTML5 特殊转义** — 新增 `escapeText` / `escapeJsx`，防止 props 中的 `<`/`>`/`&`/`{`/`}` 破坏生成代码
- [ ] **B7. 剩余业务组件 hook 定制** — goods-list-item / order-card / comment / chat-bubble / coupon 等 9 个业务组件可进一步美化生成代码
- [ ] **B8. 代码预览语法高亮** — 引入 prism.js CDN（或 highlight.js）
- [ ] **B9. 批量导出 zip** — `JSZip` 引入，HTML/WXML 多文件打包

### C. 数据组件（Phase 1 未做）

- [x] **C1. Table** — 表头 + 行 + 斑马纹 + 可选边框（WeUI 风格）
- [x] **C2. Tree** — 嵌套可折叠路径树（>分层级）
- [x] **C3. Calendar** — 月历 + 事件标记
- [x] **C4. Chart 占位** — bar / line / area / pie 4 种 SVG 静态示意
- [x] **C5. Pagination** — 首末页 + 省略号 + 上下箭头 + 总页数
- [x] **C6. Breadcrumb** — 面包屑
- [x] **C7. Descriptions** — 描述列表（label|value 多列）
- 📍 新增文件：`js/components/mp-data.js`，注册到 main.js

### D. 拖拽改尺寸增强

- [ ] **D1. 百分比单位切换** — 留下轮，当前默认 px
- [x] **D2. 对齐辅助线** — 拖拽时显示红色辅助线，吸附到邻居节点的宽/高（阈值 4px）
- [x] **D3. 等比缩放** — 按住 Shift 拖角手柄等比
- [x] **D4. padding/margin 可视化** — 右栏样式 Tab 顶部 9 格盒模型编辑器（4 边 padding + 4 边 margin）
- 📍 修改：`canvas/canvas.js`、`panels/props-panel.js`、`style.css`

### E. 多工程管理

- [x] **E1. IndexedDB 多 project 槽位** — 新增 `meta` store + `projects-index` 索引，支持列表/读取/写入/删除
- [x] **E2. 工程管理器 UI** — 顶栏「📁 工程库」按钮，弹出列表含名称/页面数/平台/时间
- [x] **E3. 保存到槽位** — 可将当前工程命名保存到槽位
- [x] **E4. 切换工程** — 点击"打开"立即切换当前工程，清空 history 避免悬空引用
- [x] **E5. 新建空工程** — 弹窗内一键新建
- [ ] **E6. 工程封面缩略图** — 留下轮（需 html2canvas 或 DOM-to-SVG）
- 📍 新增文件：`js/project/project-manager.js`；修改：`core/persistence.js`、`index.html`

### F. 协作增强

- [ ] **F1. Monaco 代码编辑器内嵌** — 工作量大，留 Phase 3
- [x] **F2. 截图导出** — 新增 `js/ui/screenshot.js`：DOM → SVG foreignObject → PNG，顶栏「📷 截图」按钮
- [ ] **F3. 分享链接** — 工程 JSON 压缩成 URL hash（留 Phase 3）
- [ ] **F4. 差异对比** — 导入新 tokens 时展示差异（留 Phase 3）

### G. 无障碍 / i18n / 暗黑

- [x] **G1. 画布节点键盘可达** — `tabindex=0` + `role=button`
- [x] **G2. 画布组件选中 ARIA** — `aria-selected` + `aria-label` + canvas `role=application`
- [x] **G3. 工作台亮/暗切换** — 顶栏 🌙/☀️ 按钮，`data-theme` + localStorage 持久化（与预览主题完全分离）
- [ ] **G4. 中英双语** — 留 Phase 3

### H. 性能

- [x] **H1. 节点树虚拟滚动** — flat 扁平化 + >200 节点时启用窗口化渲染（row=26px，预留 10 行缓冲）
- [x] **H2. 画布渲染 rAF 合并** — `renderCanvas` 同帧多次调用仅执行一次，避免 N 次 emit 连续重绘
- [x] **H3. 树渲染 rAF 合并** — 同上策略
- [x] **H4. Token 应用去抖** — `applyTokensToPreview` rAF 化，60fps 限流

---

## 📊 Phase 2 收尾统计

- **文件总数**：34 个 JS 模块
- **代码总量**：**4954 行**（较 Phase 1 的 3844 行 +1110 行）
- **依赖校验**：✅ 所有 import 符号真实存在
- **Lint**：✅ 0 错误
- **HTTP 服务**：✅ 18888 端口正常

### 新增文件（Phase 2 本轮）

| 文件 | 行数 | 说明 |
|---|---:|---|
| `js/components/mp-data.js` | ~260 | 7 个数据组件 |
| `js/project/project-manager.js` | ~120 | 工程库 UI |
| `js/ui/toast.js` | ~40 | Toast + Confirm |
| `js/ui/screenshot.js` | ~75 | 画布截图 |
| 合计 | ~495 | — |

### 修改的关键文件

- `core/persistence.js` — 重写为 v2 schema（+80 行）
- `canvas/canvas.js` — 空态引导 + Shift 等比 + 对齐辅助线 + rAF 合并 + ARIA（+130 行）
- `canvas/tree.js` — 虚拟滚动 + rAF 合并（重写）
- `panels/props-panel.js` — 间距盒子（+50 行）
- `project/code-gen.js` — 完全重写，40 类型覆盖（+ ~200 行）
- `project/export.js` — 升级 schema 校验 + Toast + clearHistory（+40 行）
- `tokens/engine.js` — rAF 节流（+10 行）
- `main.js` — 全局错误捕获 + 工作台暗色 + 所有新按钮装配（+40 行）
- `index.html` — 新增 3 个按钮（工程库 / 截图 / 暗色）
- `style.css` — 空态引导 + 间距盒子 + 工程库 + Toast/Confirm（+240 行）

---

## ⚪️ Phase 3 · 收尾 & 生态（本轮全部完成）

### I. Phase 2 遗留收尾（6 项）

- [x] **I1. D1 百分比/auto 单位切换** — 属性面板 width/height 改为「数值 + px/%/auto 单位按钮组」，auto 时自动 disable 数值输入
- [x] **I2. E6 工程封面缩略图** — 新增 `js/ui/thumbnail.js`，保存槽位时生成 SVG 缩略图（DOM→foreignObject），列表展示
- [x] **I3. F3 分享链接** — 新增 `js/project/share.js`：CompressionStream gzip + base64url → URL hash；启动时自动检测 `#share=` 恢复
- [x] **I4. F4 tokens 差异对比** — 新增 `js/project/tokens-diff.js`：导入新 tokens 时弹窗预览（颜色色块 diff + 路径/旧/新值表格）
- [x] **I5. B8 代码语法高亮** — 新增 `js/ui/highlight.js`：纯正则高亮 HTML/WXML/JSX/Vue/CSS/JS（不引外部库），代码弹窗用深色主题
- [x] **I6. B9 批量导出 zip** — 新增 `js/project/code-zip.js`：纯 JS 实现 PKZIP STORE（含 CRC32），导出 web/小程序/React/Vue 多文件包

### J. 真机扫码预览

- [x] **J1. 二维码生成** — 新增 `js/ui/qrcode.js`：纯 JS QR Code（Byte 模式 + L 容错 + Reed-Solomon 编码），返回 SVG，支持 v1-v10
- [x] **J2. Viewer 只读页** — 新增 `viewer/index.html` + `viewer/viewer.js`：移动端友好布局，从 `?share=` 或 `#share=` 加载并渲染节点树，移动端撑满全屏
- [x] **J3. 分享对话框** — 新增 `js/project/share-dialog.js`：含编辑链接 + 预览链接 + 二维码扫码 + 复制按钮

### K. AI 生成页面（自然语言 → 节点树）

- [x] **K1. AI 对话框** — 新增 `js/project/ai-generate.js`：标签快捷示例（首页/列表/详情/表单/我的）
- [x] **K2. 本地规则映射** — 离线兜底：关键词正则 → 5 个内置模板
- [x] **K3. OpenAI 兼容接口配置** — apiKey/baseURL/model 配置弹窗，仅存 localStorage
- [x] **K4. 远程 AI 调用** — 当前 tokens + 组件清单作为 system prompt，返回 JSON → 重新打 ID → applyProject

### L. 插件系统

- [x] **L1. 插件 API** — 新增 `js/project/plugins.js`：暴露 `registerComponent / registerEffect / registerCodegen`
- [x] **L2. 插件加载器** — 支持 URL 动态 import + 粘贴源码（Blob URL）
- [x] **L3. 持久化** — localStorage 保存插件清单，启动时自动恢复
- [x] **L4. 内置示例插件** — 「✨ 装饰星」演示插件，一键安装

### M. 多人协作（演示版）

- [x] **M1. BroadcastChannel 同源协作** — 新增 `js/project/collab.js`：同房间号自动同步 project + selection
- [x] **M2. 协作光标标识** — 其他协作者选中的节点上方显示彩色昵称气泡
- [x] **M3. 加入/退出房间** — 房间号 + 昵称配置，30s 心跳清理失活光标
- ⚠️ M4 真·WebSocket + CRDT 留 Phase 4

### N. i18n（中英）

- [x] **N1. i18n 模块** — 新增 `js/ui/i18n.js`：双 dict（zh / en）+ `t()` / `setLang()` / `applyI18n()`
- [x] **N2. 顶栏 🌐 切换按钮** — 中英互切，localStorage 持久化
- [ ] **N3. UI 字符串全量抽取** — 当前仅 i18n 模块就绪，DOM 标签 `data-i18n` 标注尚未铺开（已有基础设施，下轮逐个改）

---

## 📊 Phase 3 收尾统计

- **文件总数**：47 个 JS 模块（含 viewer/）
- **代码总量**：**6811 行**（较 Phase 2 的 4954 行 +1857 行）
- **依赖校验**：✅ 所有 import 符号真实存在
- **HTTP 服务**：✅ 18888 端口正常

### 新增文件（Phase 3 本轮）

| 文件 | 说明 |
|---|---|
| `viewer/index.html` | 只读预览页（移动端友好） |
| `viewer/viewer.js`  | 复用 configurator 模块渲染 |
| `js/project/share.js` | gzip + base64url URL hash 分享 |
| `js/project/share-dialog.js` | 分享弹窗（含 QR） |
| `js/project/tokens-diff.js` | tokens 差异对比 |
| `js/project/code-zip.js` | 纯 JS PKZIP STORE 实现 |
| `js/project/ai-generate.js` | AI 生成页面 + API 配置 |
| `js/project/plugins.js` | 插件系统 + 内置示例 |
| `js/project/collab.js` | BroadcastChannel 协作演示 |
| `js/ui/qrcode.js` | 纯 JS QR Code 生成 |
| `js/ui/highlight.js` | 轻量正则代码高亮 |
| `js/ui/i18n.js` | 中英双语 |
| `js/ui/thumbnail.js` | DOM→SVG 缩略图 |

### 顶栏新增按钮（Phase 3）

- 🔗 **分享** — 生成分享链接 / 二维码
- 🤖 **AI** — AI 生成页面（本地规则 + OpenAI 兼容）
- 🧩 **插件** — 插件管理器
- 👥 **协作** — BroadcastChannel 演示
- 🌐 **EN/中** — 语言切换

---

## ⚪️ Phase 4 · 真·后端（远期）

- [ ] WebSocket 协作服务端（CRDT/yjs）
- [ ] 用户系统 + 工程云同步
- [ ] 真机扫码（生成微信小程序预览二维码，需备案小程序）
- [ ] 大语言模型本地化（如 webLLM）
- [ ] 表单/数据组件的真实数据绑定

---

_最后更新：跟随实现进度持续更新_
