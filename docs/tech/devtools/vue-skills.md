---
title: Vue Skills - Vue 3 开发的 AI 技能库
tags: [vue, ai, skills, claude-code]
---

# Vue Skills

[GitHub - vuejs-ai/skills](https://github.com/vuejs-ai/skills)

`vuejs-ai/skills` 是一个给 AI 编程助手用的 **Vue 3 技能库**。

它不是普通的脚手架，也不是组件库，而是一组围绕 Vue 3 开发经验整理出来的“技能提示”。目标很直接：让 AI 在写 Vue 代码时，少踩坑、少胡写，更接近熟悉 Vue 生态的工程师。

## 这个项目解决什么问题

很多时候，AI 不是完全不会写 Vue，而是：

- 能写，但细节不稳
- 知道大概方向，但最佳实践不一致
- 对 Vue 3 某些边缘行为、生态约定、常见坑理解不够深

所以这个项目把经验拆成多个技能模块，让 AI 在接到相关任务时，能更稳定地套用对应的方法。

## 技能分类

项目把技能大致分成两类：

- **能力型技能**：没有这个技能，AI 可能根本解不出来
- **效率型技能**：AI 能做，但做得不够稳、不够像有经验的 Vue 开发者

这个划分我觉得挺合理，因为它不只是“告诉 AI 一些知识”，而是在区分：到底是在补知识盲区，还是在拉高输出质量。

## 目前包含的技能

我看下来，覆盖的是 Vue 3 里最常见的几个工作面：

- `vue-best-practices`：Composition API + TypeScript 最佳实践
- `vue-options-api-best-practices`：Options API 的常见写法和注意点
- `vue-router-best-practices`：Vue Router 4 的导航守卫、参数和生命周期
- `vue-pinia-best-practices`：Pinia 状态管理模式
- `vue-testing-best-practices`：组件测试和 E2E 测试
- `vue-jsx-best-practices`：Vue JSX 与 React JSX 的差异
- `vue-debug-guides`：Vue 3 调试思路
- `create-adaptable-composable`：如何写更通用的 composable

如果你平时主要写 Vue 3，这几个方向基本就是高频区。

## 安装

### 通用安装

```bash
npx skills add vuejs-ai/skills
```

### Claude Code Marketplace

添加 marketplace：

```bash
/plugin marketplace add vuejs-ai/skills
```

安装单个技能：

```bash
/plugin install create-adaptable-composable@vue-skills
```

安装多个技能：

```bash
/plugin install create-adaptable-composable@vue-skills vue-best-practices@vue-skills
```

## 怎么用

这个项目 README 里提到一个很实用的经验：**显式告诉 AI 你要用 Vue skill**。

例如：

```text
Use vue skill, refactor this Vue 3 component with Composition API and TypeScript best practices.
```

这样做的好处是，能更明确地触发技能，而不是把希望寄托在模型自己猜出来。

## 我觉得值得关注的点

### 1. 它在做“AI 开发经验包”

很多 AI 工具的问题不是模型不聪明，而是缺少某个框架里的“长期经验”。

这个项目本质上是在把 Vue 社区里的隐性经验，整理成可复用的规则包，给 AI 挂上去。

### 2. 它不只讲写法，还讲验证

README 里提到，项目会对比“没装技能”和“装了技能”的效果，再决定规则有没有保留价值。

这个思路很重要：

- 不是只写一堆看起来正确的话
- 而是要求技能真的能提升产出结果

这比单纯积累 prompt 更像工程化做法。

### 3. 很适合作为团队沉淀

如果一个团队长期写 Vue 3，完全可以把自己的规范和踩坑经验也整理成 skill。

这样以后不只是给人看，也可以直接给 AI 用。

## 适合谁

我觉得比较适合这几类人：

- 经常让 AI 帮忙写 Vue 3 代码的人
- 想让 AI 产出更贴近团队规范的人
- 在做 Vue 组件库、后台系统、业务前端的人
- 想把“最佳实践”沉淀成可执行知识的人

## 一些限制

README 里也说了，这还是一个 **早期实验项目**。

所以看待它更合适的方式应该是：

- 它不是万能修复器
- 也不是装上就一定全对
- 但它很像一个方向明确的尝试：把框架经验模块化，让 AI 输出更靠谱

这条路如果做成熟，未来不只是 Vue，其他技术栈也都可以这样玩。

## 参考

- [vuejs-ai/skills 仓库](https://github.com/vuejs-ai/skills)
- [Claude Code](https://www.codebuddy.ai/docs/zh/ide/User-guide/Overview)
