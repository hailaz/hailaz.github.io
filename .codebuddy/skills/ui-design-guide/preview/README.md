# Preview Prototype

> 可交互原型预览页，单文件 HTML，零构建。验证设计系统在多场景下的视觉一致性与交互合理性。

## 启动方式

### 方式 A：双击打开（推荐）

直接双击 `preview-template.html`。**部分浏览器（如 Chrome）会拦截 `fetch` 本地 JSON**，此时：

- 使用页面右上角"上传 tokens"按钮通过 `<input type="file">` 加载本地 JSON
- 或改用方式 B

### 方式 B：本地静态服务

```bash
cd .codebuddy/skills/ui-design-guide
python3 -m http.server 18888
# 访问：http://localhost:18888/preview/preview-template.html
```

### 方式 C：URL 参数指定主题

```
preview-template.html?theme=apple-style
preview-template.html?theme=cyberpunk&device=mobile
```

## 功能

- **顶部工具栏**
  - 主题预设下拉（6 套）
  - 明/暗切换
  - 桌面 / 移动样机切换
  - tokens & brand-kit 上传按钮
  - 「重置」按钮
- **左侧导航**（hash 路由）
  - 组件矩阵（Buttons / Inputs / Cards / Tags / Alerts / Tabs / Forms / States）
  - 6 类典型页面骨架（登录 / 主页列表 / 详情 / 表单 / 空态 / 错误）
- **中间渲染区**：根据 hash 路由渲染对应内容
- **底部「← 返回」**：消费返回栈
- **状态切换器**：在组件矩阵页可一键切换 hover/active/disabled/loading/error 演示

## 路由约定

- `#/components` — 组件矩阵（默认）
- `#/page/login` — 登录页
- `#/page/list` — 主页/列表
- `#/page/detail` — 详情页
- `#/page/form` — 表单页
- `#/page/empty` — 空态页
- `#/page/error` — 错误页

## 返回栈

- 内存数组，最大长度 32
- 每次 hashchange 入栈
- 「返回」按钮 pop；空栈时按钮禁用

## 兼容性

- Chrome / Edge / Safari / Firefox 现代版本
- 不依赖任何外部 CDN（除字体可选）
- 移动样机使用 CSS 模拟，不依赖真实浏览器尺寸

## 与 Skill 协作

- 通过相对路径加载 `../assets/themes/*.json`
- 加载后通过 `tokensToCssVars()` 注入 `:root`
- 与 `../configurator/index.html` 共用同一份预设文件，无副本
