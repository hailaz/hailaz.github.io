---
title: Playwright MCP
tags: [mcp, playwright, ai, browser]
---

# Playwright MCP

[GitHub - microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

`Playwright MCP` 是 Microsoft 提供的一个 MCP Server，用来把 **浏览器自动化能力** 暴露给 AI 编程助手。

和传统“截图 + 视觉识别 + 猜按钮”的方式相比，它更偏结构化：主要依赖 Playwright 提供的页面可访问性树和浏览器能力，让 AI 直接做导航、点击、输入、截图、抓日志、看网络请求这些动作。

我理解它适合的场景有三类：

- 让 AI 在真实浏览器里复现问题
- 做带状态的网页操作或测试
- 跑需要多轮观察、再决策、再操作的 agent 工作流

## 核心特点

### 1. 不是纯视觉自动化

它的一个关键点是：**优先走结构化页面信息，而不是纯靠截图理解页面**。

这样做的好处：

- 更稳定，少一点“看错按钮”
- 更省模型成本，不一定依赖视觉模型
- 更适合需要连续多步推理的场景

### 2. 浏览器能力比较完整

常见能力基本都覆盖了：

- 页面导航
- 点击、输入、拖拽等交互
- 截图
- 读取控制台日志
- 观察网络请求
- 保存 trace / video

如果是做页面排查、自动化回归、表单流转这类任务，已经够用了。

### 3. 既能持久化，也能隔离运行

这个点我觉得很实用：

- **持久化模式**：像平时用浏览器一样保留状态
- **隔离模式**：适合测试，不把浏览器状态落盘

如果要让 AI 碰真实账号环境，更建议先从隔离模式开始。

## 安装

最常见的方式：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

直接运行也可以：

```bash
npx @playwright/mcp@latest
```

如果要指定配置文件：

```bash
npx @playwright/mcp@latest --config path/to/config.json
```

## 常用配置

### 无头模式

```bash
npx @playwright/mcp@latest --headless
```

适合 CI、远程环境或者只关心结果不关心过程的场景。

### 隔离模式

```bash
npx @playwright/mcp@latest --isolated
```

适合临时测试，避免把登录态、缓存、Cookie 混到本地环境里。

### 保存 trace / video

```bash
npx @playwright/mcp@latest --save-trace --save-video
```

适合回放问题，尤其是 AI 自动执行失败时，可以反向看它到底点了什么。

## 在常见客户端里怎么接

### Claude Code

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

### VS Code / Cursor

本质上也是把命令配置成一个 MCP Server：

- `command`: `npx`
- `args`: `@playwright/mcp@latest`

如果你的客户端已经支持 MCP 图形界面，直接按界面填就行。

## 什么时候用 MCP，什么时候直接用 Playwright CLI

这个问题其实挺关键。

我自己的理解：

- **用 MCP**：需要 AI 长时间接管浏览器、保留状态、多轮观察页面再继续操作
- **用普通脚本 / CLI**：流程已经固定，只是想执行一段确定性的自动化逻辑

换句话说，MCP 更像“把浏览器工具箱接给 AI”；CLI/脚本更像“我已经知道怎么做，只是让程序跑完”。

## 适合拿来做什么

### 页面问题复现

比如：

- 打开页面
- 登录
- 点击几个按钮
- 观察 Console / Network
- 截图留档

这类动作以前要人工点一遍，现在可以让 AI 帮忙跑。

### 自愈式测试或探索式自动化

如果页面结构经常改，小脚本很容易挂；而 MCP 模式下，AI 可以边看页面边调整动作，容错会更高一些。

### 调试线上页面

如果客户端支持连接真实浏览器上下文，那么它很适合做“先看页面，再问 AI 帮我分析”的工作流。

## 注意事项

- AI 拿到的是实际浏览器能力，**不要随便连接有敏感信息的页面**
- 如果跑真实账号，优先考虑隔离环境、测试账号
- trace、video、截图都可能留下隐私信息，记得清理
- 页面自动化很容易受到登录态、弹窗、权限策略影响，排查时别只看模型输出

## 参考

- [Playwright MCP 仓库](https://github.com/microsoft/playwright-mcp)
- [Playwright 官网](https://playwright.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
