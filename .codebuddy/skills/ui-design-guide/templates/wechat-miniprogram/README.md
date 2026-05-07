# 微信小程序接入模板（全流程优化）

> 本模板是 `ui-design-guide` Skill 对微信小程序的**全流程设计/开发规范**。涵盖 Token 落地、WeUI 组件规范、rpx 适配、暗黑模式、胶囊按钮/TabBar/安全区、交互反馈、性能与合规。

## 一、适用范围

- **原生微信小程序**（WXML + WXSS + JS/TS）
- 推荐搭配 **WeUI 设计规范** 与 `weui-light` / `weui-dark` 主题
- **UniApp 编译到 MP-WEIXIN**：见 `../uniapp/README.md`，token 落地方式略有差异

## 二、推荐主题预设

| 预设 | 说明 |
|---|---|
| `weui-light` | 微信绿主色 `#07C160` · WeUI 规范 · 亮色（推荐） |
| `weui-dark`  | WeUI 规范暗色模式 |

加载主题：在 configurator 顶部预设下拉选择 `🟢 WeUI 亮色（推荐）`，或在预览页顶部主题选择器切换 `🟢 WeUI 亮色`。

## 三、Token 落地（app.wxss）

### Step 1：`app.wxss` 顶部声明全局 CSS Variables

```wxss
/* app.wxss */
page {
  /* 颜色（直接复用 tokens） */
  --color-primary-500: #07c160;
  --color-primary-600: #06ad56;
  --color-primary-700: #059a4c;

  --color-neutral-50:  #fafafa;
  --color-neutral-100: #f7f7f7;
  --color-neutral-200: #ededed;
  --color-neutral-500: #888888;
  --color-neutral-900: #111111;

  --color-success-500: #07c160;
  --color-warning-500: #ffc300;
  --color-danger-500:  #fa5151;
  --color-info-500:    #10aeff;

  /* WeUI 专属色 */
  --weui-brand:       #07c160;
  --weui-link:        #576b95;
  --weui-red:         #fa5151;
  --weui-orange:      #fa9d3b;
  --weui-bg-0:        #ededed;
  --weui-bg-1:        #f7f7f7;
  --weui-bg-2:        #ffffff;
  --weui-fg-0:        #000000;
  --weui-fg-1:        rgba(0,0,0,.55);
  --weui-fg-2:        rgba(0,0,0,.3);
  --weui-separator:   rgba(0,0,0,.1);

  /* 间距：使用 rpx（见 Step 3） */
  --space-1: 8rpx;    /* 4px @ 375 基准 */
  --space-2: 16rpx;
  --space-3: 24rpx;
  --space-4: 32rpx;
  --space-6: 48rpx;
  --space-8: 64rpx;

  /* 圆角 */
  --radius-sm: 8rpx;
  --radius-md: 16rpx;
  --radius-lg: 24rpx;
  --radius-full: 9999rpx;

  /* 阴影（小程序不支持太复杂的 shadow） */
  --shadow-sm: 0 2rpx 4rpx rgba(0,0,0,.04);
  --shadow-md: 0 4rpx 16rpx -4rpx rgba(0,0,0,.08);

  /* 字号：rpx 值 */
  --font-size-xs:   22rpx;  /* 11px */
  --font-size-sm:   26rpx;  /* 13px */
  --font-size-base: 30rpx;  /* 15px */
  --font-size-lg:   34rpx;  /* 17px */
  --font-size-xl:   40rpx;  /* 20px */

  /* 动效 */
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 350ms;
  --ease-standard: cubic-bezier(.2,0,0,1);

  /* 小程序专属尺寸 */
  --tabbar-height:     100rpx;  /* 50px */
  --navbar-height:     88rpx;   /* 44px */
  --statusbar-height:  88rpx;   /* 44px，实际由 wx.getSystemInfo 动态获取 */
  --safe-area-bottom:  68rpx;   /* 34px，iPhone X+ Home 指示器 */

  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: var(--weui-fg-0);
  background: var(--weui-bg-1);
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  page {
    --color-neutral-50:  #111111;
    --color-neutral-100: #1a1a1a;
    --color-neutral-200: #2a2a2a;
    --color-neutral-900: #fafafa;
    --weui-bg-0: #111111;
    --weui-bg-1: #1a1a1a;
    --weui-bg-2: #222222;
    --weui-fg-0: #ffffff;
    --weui-fg-1: rgba(255,255,255,.55);
    --weui-fg-2: rgba(255,255,255,.3);
    --weui-separator: rgba(255,255,255,.1);
  }
}
```

> ⚠️ **小程序 JSON 配置中也要开启暗黑**：`app.json` 中加 `"darkmode": true` 并提供 `themeLocation`（或使用 `theme.json`）。

### Step 2：组件中消费 tokens

```wxss
/* pages/home/home.wxss */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 96rpx;
  background: var(--weui-brand);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--font-size-lg);
  font-weight: 500;
  transition: opacity var(--dur-fast) var(--ease-standard);
}
.btn:active { opacity: 0.7; }

.btn-secondary {
  background: var(--weui-bg-2);
  color: var(--weui-brand);
  border: 2rpx solid var(--weui-brand);
}

.cell {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-4);
  background: var(--weui-bg-2);
  border-bottom: 2rpx solid var(--weui-separator);
  min-height: 96rpx;
}
```

### Step 3：px → rpx 换算约定

| 设计稿基准 | 换算公式 | 示例 |
|---|---|---|
| **375 px（推荐）** | `rpx = px × 2` | 16px → 32rpx |
| 750 px | `rpx = px × 1` | 16px → 16rpx |
| 414 px | `rpx = px × (750/414)` | 16px ≈ 29rpx |

> **AI 产出约束**：生成 wxss 时，**spacing/sizing 一律用 rpx**，`border-width` 用 `1rpx` 或 `2rpx`，`font-size` 用 rpx。**仅 `box-shadow`、`border-radius` 的 9999 像素等场景可用 `px`**。

## 四、WeUI 组件规范对齐

### 4.1 胶囊按钮区避让

```js
// 小程序自带右上角胶囊按钮，自定义导航栏时必须避让
Page({
  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync();
    const menu = wx.getMenuButtonBoundingClientRect();
    this.setData({
      statusBarHeight,
      navbarHeight: (menu.top - statusBarHeight) * 2 + menu.height,
      capsuleRight: (wx.getSystemInfoSync().windowWidth - menu.right),
      capsuleWidth: menu.width,
      capsuleHeight: menu.height,
    });
  }
});
```

```wxml
<!-- 自定义导航栏 -->
<view class="custom-navbar" style="padding-top: {{statusBarHeight}}px; height: {{navbarHeight}}px;">
  <view class="navbar-title">{{title}}</view>
</view>
```

### 4.2 底部 TabBar

- **系统 TabBar**：在 `app.json` 声明，颜色使用 tokens 的 `--weui-brand`
- **自定义 TabBar**（推荐，用于完整主题切换）：创建 `custom-tab-bar/` 组件，启用 `"usingComponents": true`

```json
// app.json
{
  "tabBar": {
    "custom": true,
    "color": "#888888",
    "selectedColor": "#07c160",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      { "pagePath": "pages/home/home",     "text": "首页" },
      { "pagePath": "pages/category/category", "text": "分类" },
      { "pagePath": "pages/cart/cart",     "text": "购物车" },
      { "pagePath": "pages/mine/mine",     "text": "我的" }
    ]
  }
}
```

### 4.3 iPhone X+ 底部安全区

```wxss
.footer-btn {
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--space-4));
}
.tabbar {
  height: calc(var(--tabbar-height) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 五、核心 WeUI 组件清单（必须提供）

| 组件 | 对应文件 | 必须状态 |
|---|---|---|
| Button（primary/default/warn/mini） | `components/btn/` | default / active / loading / disabled |
| Cell 列表（带箭头/Switch/Radio） | `components/cell/` | default / active / last |
| Form（input/textarea/picker） | `components/form/` | default / focus / error / disabled |
| SearchBar | `components/search-bar/` | default / focus / with-value |
| ActionSheet | `components/action-sheet/` | normal / destructive |
| Modal（Dialog） | `components/modal/` | confirm / alert / form |
| Toast / Loading | `wx.showToast` / `wx.showLoading` | 统一 icon 与文案 tone |
| Tag / Badge | `components/tag/` | green / orange / red / blue |
| Swiper 轮播 | 原生 `<swiper>` | 含分页指示器 |
| Grid 宫格（4 列） | `components/grid/` | icon + text |
| GoodsCard 商品卡 | `components/goods-card/` | 图片 + 标题 + 价格 + 角标 |
| Skeleton 骨架屏 | `components/skeleton/` | 加载态占位 |

## 六、页面骨架清单（AI 生成时参考预览页）

对应预览页 `preview/preview-template.html` 的 11 种小程序页面：

1. **首页（TabBar）** — SearchBar + Swiper + Grid + 推荐流
2. **商品列表** — SearchBar + 排序筛选 Tab + 双列瀑布流
3. **商品详情** — 轮播图 + 价格区 + 规格 Cell + 评价 + 底部购买栏
4. **个人中心（TabBar）** — 头像卡 + 订单快捷入口 + 功能 Cell 分组
5. **搜索页** — SearchBar + 历史 + 热门 TOP 列表
6. **订单列表** — 状态 Tab + 订单卡列表
7. **登录/授权页** — 微信一键登录 + 手机号 + 协议
8. **空态页** — WeUI msg 规范：icon + 标题 + 描述 + CTA
9. **错误页** — 同 msg 规范，icon 为 danger 色
10. **操作成功** — 同 msg 规范，icon 为 success 色 + 双 CTA（查看 / 返回）
11. **分类（TabBar）** — 左侧锚点 + 右侧品类网格

## 七、交互反馈（AI 必须遵循）

| 场景 | 实现 | 示例 |
|---|---|---|
| 按钮点击 | `:active` 透明度 0.7 | `.btn:active { opacity: .7; }` |
| Loading | `wx.showLoading` + 按钮 `disabled` | 避免重复提交 |
| 成功 | `wx.showToast({ icon: 'success' })` | 2 秒后自动关闭 |
| 失败 | `wx.showModal` 或底部 Toast | 给明确原因与行动项 |
| 空态 | `<weui-msg>` 组件 | 必须提供 CTA |
| 骨架屏 | 加载时 `<skeleton>` 占位 | 避免白屏 |
| 下拉刷新 | `onPullDownRefresh` + `wx.stopPullDownRefresh` | 必须在 page.json 开启 |
| 上拉加载 | `onReachBottomDistance: 50` | 触底加载更多 |

## 八、性能优化（生成代码时注意）

1. **setData 优化**：一次聚合，避免频繁触发；大数据用 `.splice(index, 1, newItem)` 而非整个数组替换
2. **图片懒加载**：`<image lazy-load="{{true}}">`，首屏外图片必须加
3. **分包**：首包 ≤ 2MB，次要页面放分包；商品详情、订单详情等推荐分包
4. **wxss 大小**：小程序要求单个 wxss ≤ 1.5MB，tokens 层可抽到 `app.wxss`
5. **长列表**：用 `recycle-view` 或虚拟列表，避免一次渲染 500+ 节点
6. **骨架屏**：首次进入必须展示骨架屏 < 300ms

## 九、合规与隐私

- **用户信息**：`wx.getUserProfile` 已废弃，使用 `open-type="chooseAvatar"` + `open-type="getPhoneNumber"`
- **位置信息**：必须在 `app.json` 声明 `requiredPrivateInfos`
- **协议**：登录/注册页必须展示《用户协议》《隐私政策》勾选框
- **敏感词**：文案不得含"第一/最佳/最"等极限词（广告法）

## 十、AI 生成代码检查项

- [ ] 全部颜色/间距/圆角/字号都用 `var(--xxx)`，无硬编码
- [ ] spacing/sizing 用 `rpx`，不混 `px`
- [ ] 触控热区 ≥ 88rpx（44px）
- [ ] 所有页面处理 `prefers-color-scheme: dark`
- [ ] iPhone X+ 底部 CTA 用 `env(safe-area-inset-bottom)` 避让
- [ ] 关键操作（下单/支付/删除）有 `wx.showModal` 二次确认
- [ ] 表单提交有 loading + disable，防止重复
- [ ] 空态、错误态、加载态三套必须齐全
- [ ] 文案遵循 `brand-kit.json` 的 `tone`（参考 `checklists/brand-tone-checklist.md`）
- [ ] 图片有 `lazy-load` + `mode="aspectFill"` 默认

## 十一、相关资源

- WeUI 官方：https://weui.io/
- 小程序设计指南：https://developers.weixin.qq.com/miniprogram/design/
- Skin / 主题化：https://developers.weixin.qq.com/miniprogram/dev/framework/ability/darkmode.html
- 预览与配置：`.codebuddy/skills/ui-design-guide/preview/preview-template.html` + `configurator/`
