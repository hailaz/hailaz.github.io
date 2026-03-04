---
title: Superpowers - AI 编程工作流框架
tags: [ai, claude-code, cursor, workflow]
---

# Superpowers

https://github.com/obra/superpowers

Superpowers 是一个专为 AI 编程代理（Claude Code、Cursor 等）设计的**软件开发工作流框架**，69.8k Star。

核心思路：把 AI 代理当作一名初级工程师，通过一套可组合的"技能"和流程规范，引导 AI 遵循成熟的工程方法论（TDD、YAGNI、DRY）进行开发，而不是直接让它写代码。

## 工作流程

Superpowers 将开发过程分为强制性的阶段，每个阶段由特定技能自动触发：

1. **头脑风暴** — 编码前激活，通过提问细化需求，探索替代方案
2. **Git Worktree** — 设计批准后，在新分支创建隔离工作区
3. **编写计划** — 将工作拆解为微小任务（每个 2-5 分钟），包含文件路径、完整代码和验证步骤
4. **子代理开发** — 为每个任务分派子代理，进行两级审查（规范符合性 + 代码质量）
5. **TDD** — 强制红-绿-重构循环：写失败测试 → 看失败 → 写最小代码 → 看通过 → 提交
6. **代码审查** — 对照计划审查，按严重程度报告问题，关键问题阻止进度
7. **完成分支** — 验证测试，提供合并/PR/保留/丢弃选项，清理 Worktree

## 技能模块

| 类别 | 内容 |
|------|------|
| 测试 | TDD 循环、测试反模式参考 |
| 调试 | 系统性根因分析（4 阶段）、完成前验证 |
| 协作 | 苏格拉底式设计、实施计划、并行子代理、代码审查 |
| 元技能 | 如何编写新技能、如何使用 Superpowers |

## 安装

### Claude Code

```bash
# 通过插件市场
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

### Cursor

在 Agent 聊天中：

```
/plugin-add superpowers
```

### 其他平台

Codex、OpenCode 等需要手动设置，参考 [官方文档](https://github.com/obra/superpowers)。

## 参考

- [GitHub - obra/superpowers](https://github.com/obra/superpowers)
