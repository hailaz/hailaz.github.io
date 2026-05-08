# Configurator（小程序可视化设计工作台）

> 全能一体化入口：**设计配置 + 组件库 + 效果库 + 可视化画布编辑 + 多页面工程 + 代码生成**

## 启动

```bash
cd .codebuddy/skills/ui-design-guide
python3 -m http.server 18888
# 浏览器访问：http://localhost:18888/configurator/
```

或双击 `index.html`（部分浏览器 `file://` 协议下 fetch 会被拦截）。

## 5 栏布局

```
┌──────┬──────┬──────────────┬──────────┬─────┐
│ 组件 │ 节点 │   小程序画布    │   属性    │ Vibe │
│ 库   │ 树   │   （模拟器）   │   面板    │ 风格 │
└──────┴──────┴──────────────┴──────────┴─────┘
```

- **组件库**：分类列表 + 搜索 + 拖拽源（67 个组件）
- **节点树**：当前页面组件层级，点击选中/悬浮高亮
- **画布**：1:1 小程序模拟器，支持点选、8 手柄拖拽改尺寸、拖拽放置新组件
- **属性面板**：三 Tab「属性 / 样式 / 效果」
- **Vibe 面板**：13 个情绪标签快速应用

## 核心交互

| 操作 | 方式 |
|---|---|
| 添加组件 | 拖组件库到画布 / 双击组件（放入选中节点或根） |
| 选中组件 | 画布点击 / 节点树点击 |
| 修改属性/样式 | 右栏「属性」「样式」Tab |
| 叠加效果 | 右栏「效果」Tab 多选 |
| 改尺寸 | 选中后拖 8 个手柄 |
| 删除 | `Delete` / 属性面板 × |
| 复制 | `Ctrl+D` / 属性面板 ⎘ |
| 撤销/重做 | `Ctrl+Z` / `Ctrl+Y` |
| 取消选中 | `Esc` / 画布空白 |
| 多页面 | 顶部 Tab 点 `+` 新建，双击重命名 |

## 组件库（67 个）

| 类别 | 数量 | 示例 |
|---|---|---|
| 容器   | 1  | container |
| 基础   | 17 | Button, Input, Textarea, Switch, Checkbox, Radio, Slider, Icon, Image, Text, Title, Divider, Link, Badge, Tag, Avatar |
| 布局   | 8  | Flex, Grid, Stack, Cell, CellGroup, ScrollView, Section, Spacer |
| 展示   | 10 | Card, Tabs, Steps, Progress, Stat, Timeline, Rate, Price, KV, Hero |
| 反馈   | 7  | Modal, Toast, Loading, ActionSheet, Msg, Alert, Skeleton |
| 导航   | 5  | Navbar, SearchBar, TabBar, Capsule, Breadcrumb |
| 业务   | 10 | GoodsCard, OrderCard, UserCard, Comment, ChatBubble, Coupon, RedPacket, Address, Notification, LiveCard |
| 页面积木 | 6 | Swiper, GridMenu, Empty, Pagination, Footer, FilterBar |

## 效果库（32 个）

| 类别 | 示例 |
|---|---|
| 加载 | Spin / Pulse / Shimmer / Bounce / Wave / Bars / Dots3 / Breath |
| 过渡 | Fade / SlideUp / SlideDown / ZoomIn / Flip / BounceIn / RotateIn / BlurIn |
| 悬浮 | Lift / Glow / Tilt / Scale / Brighten |
| 手势 | PressDown / Ripple / Shake |
| 插画 | 空列表 / 空搜索 / 空购物车 / 404 / 网络异常 / 成功 / 维护中 / 开发中 |

## 代码生成

顶部 `</> 代码` 按钮弹出 Modal，一键导出：
- **HTML**（完整页面 + :root CSS Variables）
- **微信小程序**（WXML + WXSS + JS data 草稿）
- **React**（JSX 组件）
- **Vue 3**（SFC）

## JS 模块结构（30 文件 / 3844 行）

```
js/
├── main.js                   主入口
├── core/                     （基础设施）
│   ├── id.js                 ID 生成
│   ├── state.js              全局 state + 事件总线
│   ├── history.js            undo/redo 命令栈
│   ├── commands.js           所有可撤销命令
│   ├── selection.js          选中态
│   └── persistence.js        IndexedDB 自动保存
├── tokens/engine.js          tokens + vibe + 色阶
├── components/               （组件）
│   ├── registry.js           注册中心
│   ├── mp-base.js            18 个基础
│   ├── mp-layout.js          8 个布局
│   ├── mp-display.js         10 展示
│   ├── mp-feedback.js        7 反馈
│   ├── mp-nav.js             5 导航
│   ├── mp-business.js        10 业务
│   └── mp-blocks.js          6 页面积木
├── effects/                  （效果）
│   ├── registry.js
│   ├── loading.js
│   ├── transition.js
│   ├── hover.js
│   └── illustration.js
├── canvas/                   （画布）
│   ├── canvas.js             渲染 + 点选 + 拖拽 + 8 手柄
│   ├── tree.js               节点树
│   ├── components-sidebar.js 组件库面板
│   └── keyboard.js           快捷键
├── panels/
│   └── props-panel.js        属性面板
└── project/                  （工程）
    ├── pages.js              多页面 Tab
    ├── page-templates.js     页面模板
    ├── code-gen.js           代码生成
    └── export.js             导入/导出
```

## URL 参数

- `?theme=weui-dark` 初始加载指定预设
- `#/<route>` 暂未启用（v2）

## 数据持久化

- **自动**：所有变更 debounce 500ms 后写入 IndexedDB `ui-design-guide/projects/__current__`
- **手动**：顶部 ⬇ 工程 按钮导出完整 `.udg.json`
- **重置**：顶部 ♻ 按钮清空 IndexedDB 并重建空工程

## 相关

- 主文档：`../SKILL.md`
- 契约：`../assets/design-tokens.schema.json`、`../assets/brand-kit.schema.json`
- 小程序接入：`../templates/wechat-miniprogram/README.md`
