使用中文交流

# 项目开发指南

## 项目概述
- 这是一个基于 Docusaurus 的个人技术文档网站
- 支持多端访问
- 主要用于技术文章分享和知识积累
- 使用 Markdown 和 MDX 格式编写文档

## 开发规范

### 技术栈
- 基于 React 和 Docusaurus 框架
- 使用 Markdown 和 MDX 编写文档
- 使用 CSS Modules 编写样式
- 使用 GitHub Actions 自动构建和部署

### 代码规范
- 使用 ESLint 和 Prettier 进行代码规范检查
- 所有代码需经过格式化和检查后才能提交
- 代码需要配套对应的注释和文档说明

### 文件组织
- 文档放置在 `docs` 目录下
- 博客文章放置在 `blog` 目录下
- 静态资源存放在 `static` 目录
- 组件放置在 `src/components` 目录

### 命名规范
- 文档文件使用有意义的英文名称，以 `.md` 或 `.mdx` 结尾
- 博客文件名格式：`YYYY-MM-DD-title.md`
- React 组件使用 PascalCase 命名法
- CSS 模块文件使用 `*.module.css` 命名

### 文档编写规范
- 文档必须包含 front matter
- 使用 Markdown 和 MDX 语法
- 代码块需指定语言类型
- 图片需添加 alt 文本描述
- 保持清晰的文章结构和段落划分

### Git 规范
- commit 信息需简明扼要
- 使用英文书写 commit 信息
- branch 命名规范：feature/xxx, fix/xxx

## 本地开发

参考README.md文档

## 部署说明
- 提交到 master 分支自动触发部署
- 通过 GitHub Actions 自动构建
- 构建输出目录为 `build`
- 确保提交前本地构建无误

## 其他

修改代码后不需要提示我运行，因为已经启动了热编译