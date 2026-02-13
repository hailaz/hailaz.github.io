---
title: Docusaurus 搭建与部署
sidebar_position: 3
---

# Docusaurus文档系统搭建与部署指南

本文将详细介绍如何使用Docusaurus构建个人技术文档网站，并将其部署到GitHub Pages上，实现自动化构建和发布。

## 1. Docusaurus介绍

Docusaurus是Facebook开源的一款静态网站生成器，专为创建文档网站而设计，具有以下优点：

- 基于React开发，性能优良
- 内置支持Markdown和MDX文档
- 提供搜索、国际化、版本控制等功能
- 支持自定义主题和插件
- 快速构建与部署

## 2. 环境准备

在开始之前，请确保已安装以下工具：

```bash
# 检查Node.js版本 (推荐v16.14.0或更高)
node -v

# 检查npm版本
npm -v

# 或使用yarn
yarn -v
```

## 3. 创建Docusaurus项目

### 3.1 使用脚手架创建项目

```bash
# 使用npm
npx create-docusaurus@latest my-docs classic

# 使用yarn
yarn create docusaurus my-docs classic
```

该命令将创建一个名为`my-docs`的目录，使用classic模板初始化项目。

### 3.2 项目目录结构

```
my-docs/
├── blog/                 # 博客文章目录
├── docs/                 # 文档目录
├── src/                  # 自定义React组件
│   ├── components/       # 公共组件
│   └── pages/            # 自定义页面
├── static/               # 静态资源
├── docusaurus.config.js  # 站点配置文件
├── sidebars.js           # 侧边栏配置
└── package.json          # 项目依赖
```

## 4. 配置和自定义

### 4.1 修改基础配置

打开`docusaurus.config.js`文件，修改基本配置：

```javascript
module.exports = {
  title: '我的技术文档',
  tagline: '个人知识库与技术积累',
  url: 'https://www.hailaz.cn',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'hailaz', // 通常是GitHub用户名
  projectName: 'hailaz.github.io', // 通常是仓库名
  
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/hailaz/hailaz.github.io/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/hailaz/hailaz.github.io/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

### 4.2 配置侧边栏

编辑`sidebars.js`文件组织文档结构：

```javascript
module.exports = {
  docs: [
    'index',
    {
      type: 'category',
      label: '学习笔记',
      items: ['learn/docusaurus-github-pages', 'learn/index'],
    },
    {
      type: 'category',
      label: 'Golang',
      items: ['learn/go/index'],
    },
  ],
};
```

## 5. 本地开发与预览

启动开发服务器预览网站：

```bash
# 进入项目目录
cd my-docs

# 使用npm启动
npm run start

# 或使用yarn
yarn start
```

启动后可以通过 http://localhost:3000 访问网站，修改源文件后页面会自动刷新。

## 6. 部署到GitHub Pages

### 6.1 创建GitHub仓库

在GitHub上创建一个名为`hailaz.github.io`的仓库（将username替换为你的GitHub用户名）。

### 6.2 配置部署设置

修改`docusaurus.config.js`中的部署配置：

```javascript
module.exports = {
  // ...其他配置
  url: 'https://www.hailaz.cn',
  baseUrl: '/',
  organizationName: 'hailaz', // GitHub用户名
  projectName: 'hailaz.github.io', // 仓库名
  trailingSlash: false,
  
  // 添加部署配置
  deploymentBranch: 'gh-pages', // 部署分支
};
```

### 6.3 手动部署

```bash
# 构建网站
npm run build

# 部署到GitHub Pages
GIT_USER=hailaz npm run deploy
```

这将构建网站并将构建目录推送到GitHub仓库的gh-pages分支。

## 7. 自动化部署（GitHub Actions）

### 7.1 创建GitHub Actions工作流

在项目根目录创建`.github/workflows/deploy.yml`文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - master
    # 如果你想要进一步定义触发条件、路径等，可以查看文档
    # https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#on

jobs:
  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: yarn

      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Build website
        run: yarn build

      # 部署到 GitHub Pages 的热门选择：
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          # 要发布到 `gh-pages` 分支的构建输出：
          publish_dir: ./build
          # 设置部署的用户信息
          user_name: hailaz
          user_email: 739476267@qq.com
          cname: www.hailaz.cn
```

**注意**：在上面的配置中，设置了`cname`参数，这将自动在构建目录中生成CNAME文件，不需要在static目录中手动创建。

### 7.2 启用GitHub Pages

在GitHub仓库设置中，找到Pages选项：
1. 将"Source"设置为"Deploy from a branch"
2. 选择"gh-pages"分支和"/(root)"文件夹
3. 点击"Save"保存设置

## 8. 添加自定义域名（可选）

### 8.1 配置DNS

在域名提供商处添加CNAME记录，指向`hailaz.github.io`。

### 8.2 配置GitHub Pages

有两种方式配置自定义域名：

1. **通过GitHub Actions自动配置（推荐）**：
   如上面的`deploy.yml`文件所示，在部署步骤中添加`cname: www.hailaz.cn`参数。

2. **手动配置**：
   在`static`目录下创建`CNAME`文件，内容为你的域名：
   ```
   www.hailaz.cn
   ```

然后，在GitHub仓库设置中的Pages部分，确认自定义域名已填写，并选择"Enforce HTTPS"。

## 9. 常见问题与解决方案

### 9.1 部署后页面显示404

- 检查`baseUrl`配置是否正确
- 确认GitHub Pages设置中的源分支是`gh-pages`

### 9.2 静态资源无法加载

- 检查图片等资源路径是否正确
- 确保所有资源都放置在`static`目录下

### 9.3 样式或功能在生产环境与开发环境不一致

- 运行`npm run build && npm run serve`在本地模拟生产环境

## 总结

通过本文的指南，你应该已经成功搭建了一个基于Docusaurus的个人技术文档网站，并部署到GitHub Pages上。这个系统支持Markdown和MDX格式的文档编写，具有良好的可扩展性和自定义性。

随着你的文档内容不断丰富，可以进一步探索Docusaurus的高级特性，如国际化、版本控制、搜索功能等，打造更加专业和实用的技术文档平台。

## 参考资源

- [Docusaurus官方文档](https://docusaurus.io/)
- [GitHub Pages文档](https://docs.github.com/cn/pages)
- [Markdown基础语法](https://www.markdownguide.org/basic-syntax/)
- [MDX文档](https://mdxjs.com/)
