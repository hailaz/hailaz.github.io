# ui-design-guide

UI 设计开发约束器 Skill（**微信小程序全流程优化版**）。在已有项目中开发 UI 时，约束 AI 生成符合所选设计系统与品牌资产的代码。

## 功能概览

- 🎨 **双契约**：`design-tokens.schema.json`（视觉系统） + `brand-kit.schema.json`（品牌资产）
- 🌈 **8 套主题预设**：🟢 weui-light / 🟢 weui-dark（小程序专用）、default-light/dark、apple-style、material-style、minimal、cyberpunk
- 🧭 **Vibe/Mood 入口**（13 个标签）：含小程序专属 `wechat` / `ecommerce` / `social`
- 🛠️ **内置 Configurator**：可视化调节 + 实时 WeUI 风格预览 + 双 JSON 导出 + 小程序适配字段（rpx/TabBar/安全区）
- 📱 **小程序模拟器预览**：1:1 还原小程序视觉（状态栏 + 自定义导航 + 胶囊按钮 + TabBar + 11 种页面骨架）
- 🚀 **可交互原型**：hash 路由 + 返回栈 + 组件状态切换器 + 桌面/小程序视口切换
- 📐 **Magic Resize**：fluid typography + spacing 缩放系数 + 容器策略
- ♿ **a11y / i18n / 三态 / 暗黑 / 品牌语调 / 小程序规范** 全方位 checklist

## 首版范围

| 维度 | 首版完整 | v2 占位 |
|---|---|---|
| 端 | 🟢 **微信小程序（深度优化）** / H5 / PC Web / UniApp | — |
| 框架 | 原生微信小程序 / HTML+Tailwind / UniApp | Vue / React |
| UI 库 | 🟢 **原生微信小程序 + WeUI** / **UniApp（uni-ui/uv-ui/uView）** / Tailwind CSS | Shadcn / AntD / Arco / TDesign |
| 预览骨架 | 11 种小程序页面（首页/列表/详情/个人中心/搜索/订单/登录/空态/错误/成功/分类） + 6 种 Web 页面 | admin-dashboard 后台模板 |
| 版本管理 | `meta.version` 字段（手动） | 自动 CHANGELOG / semver 自动递增 |

## 快速开始

### 场景 A：微信小程序项目（推荐路径）

1. **打开 Configurator**：双击 `configurator/index.html`，默认加载 `weui-light` 主题
2. **选择场景 Vibe**：`wechat` / `ecommerce` / `social` 三选一，或自定义微调
3. **填写 Brand Kit**：品牌名、Logo SVG、语调（friendly 推荐）、锁定品牌色
4. **导出双 JSON**：放到小程序项目根目录
5. **中间栏实时查看 11 种小程序页面骨架**（配置已合并预览，无需切换页面）
6. **接入 app.wxss**：参考 `templates/wechat-miniprogram/theme.wxss.example`
7. **让 AI 写小程序代码**：AI 会自动按 `templates/wechat-miniprogram/README.md` 的检查清单（rpx/胶囊/TabBar/安全区/三态/合规）约束输出

### 场景 B：Web / H5 项目

1. **打开 Configurator**：切换预设为 `default-light` / `apple-style` / `material-style` / `minimal` / `cyberpunk`
2. **输入 Vibe**：如 `professional, calm, medical`，自动微调 token
3. **导出 JSON** → 放到项目根目录，AI 会自动加载并按 Workflow 6 步受约束输出

## 目录结构

```
ui-design-guide/
├── SKILL.md                 # 主入口（含小程序全流程约束）
├── README.md                # 本文件
├── assets/
│   ├── design-tokens.schema.json  # tokens 契约
│   ├── brand-kit.schema.json      # 品牌契约
│   ├── tokens-naming-convention.md
│   ├── vibe-tags.json             # 13 个 vibe 标签
│   └── themes/                     # 8 套预设
│       ├── weui-light.json         # 🟢 微信小程序推荐
│       ├── weui-dark.json          # 🟢 微信小程序暗色
│       ├── default-light.json
│       ├── default-dark.json
│       ├── apple-style.json
│       ├── material-style.json
│       ├── minimal.json
│       └── cyberpunk.json
├── configurator/            # 🟢 一体化入口（配置 + 小程序原型预览）
│   ├── index.html
│   ├── style.css
│   └── js/ (10 个 ESM 模块)
├── templates/
│   ├── wechat-miniprogram/  # 🟢 全流程优化（app.wxss/rpx/TabBar/安全区/合规）
│   ├── uniapp/              # 全流程
│   ├── html-tailwind/       # 全流程
│   ├── vue/                 # v2 占位
│   └── react/               # v2 占位
├── references/              # UI 库速查
└── checklists/              # a11y / responsive / i18n / states / adaptive-rules / brand-tone
```

## 触发场景示例

| 用户表述 | 触发机制 |
|---|---|
| "做个小程序登录页" | 识别小程序 → 加载 weui-light → `viewMPLogin` 骨架 + 小程序专属约束 |
| "小程序首页要带 TabBar" | 使用 `mp-tabbar` + 自定义 TabBar 组件（见 wechat-miniprogram/README 4.2） |
| "适配 iPhone X+ 底部" | 强制 `env(safe-area-inset-bottom)` |
| "把按钮做成微信支付风格" | vibe `wechat` + 主色 `#07C160` |
| "小程序暗黑模式" | 切换 weui-dark + `app.json` 开 `darkmode: true` + wxss `prefers-color-scheme` |
| "把这个项目改成专业医疗风" | Vibe Mapping → professional + medical |
| "按钮文案要正式一点" | 读取 `brand-kit.tone=formal` + brand-tone checklist |

## v2 迭代计划

- [ ] 完整 Vue 接入模板（vite plugin 注入、UnoCSS preset）
- [ ] 完整 React 接入模板（CSS-in-JS / shadcn theme.css）
- [ ] Shadcn / AntD / Arco / TDesign 速查全集
- [ ] admin-dashboard 后台管理专项模板（高密度 tokens 变体）
- [ ] tokens CHANGELOG 自动递增 + semver 校验
- [ ] Configurator 增加导入项目 tokens 反向编辑模式
- [ ] Preview 增加性能/打印/截图导出能力
- [ ] 小程序 iconfont 图标库集成 + 自定义 TabBar 组件代码生成器

## 相关 Skill

- `docs-toc-generator`：生成 docs 目录索引页（不相关）
- `draft-organizer`：整理草稿到博客分类（不相关）
- `skill-creator`：创建新 Skill 的元工具（用于本 Skill 自身的迭代维护）
