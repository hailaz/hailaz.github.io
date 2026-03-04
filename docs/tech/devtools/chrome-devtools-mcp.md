---
title: Chrome DevTools MCP
tags: [mcp, chrome, devtools, ai]
---

# Chrome DevTools MCP

https://github.com/ChromeDevTools/chrome-devtools-mcp

Chrome 官方推出的 MCP 服务器，让 AI 编程助手（Gemini、Claude、Cursor、Copilot 等）通过 [MCP 协议](https://modelcontextprotocol.io/) 直接控制和调试 Chrome 浏览器。

简单说：AI 可以帮你打开网页、点击元素、截图、分析性能、查看网络请求、执行 JS 脚本等，所有操作都在真实的 Chrome 中进行。

## 核心能力

- **浏览器自动化**：导航、点击、拖拽、填写表单、上传文件、处理对话框等（基于 Puppeteer）
- **性能分析**：录制 Performance 追踪、获取性能洞察、内存快照
- **网络调试**：获取和列出网络请求
- **控制台调试**：获取控制台消息（支持 source map 堆栈跟踪）、执行 JS 脚本
- **截图 & Lighthouse 审计**
- **设备模拟**：模拟不同设备和环境

总共暴露了 **29 个工具**，涵盖输入自动化(9)、导航(6)、模拟(2)、性能(4)、网络(2)、调试(6) 六大类。

## 安装配置

**要求**：Node.js v20.19+、Chrome 稳定版、npm

在 MCP 客户端配置文件中添加：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

### 常用参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--headless` | false | 无头模式运行 |
| `--isolated` | false | 使用临时用户数据目录，关闭后自动清理 |
| `--slim` | - | 精简模式，仅暴露导航、执行脚本、截图 3 个工具 |
| `--autoConnect` | false | 自动连接本地 Chrome（需 Chrome 144+） |
| `--browser-url` | - | 连接到指定的可调试 Chrome 实例，如 `http://127.0.0.1:9222` |

带参数的配置示例：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--headless=true",
        "--isolated=true"
      ]
    }
  }
}
```

## 连接已有的 Chrome 实例

如果想在已登录的 Chrome 中操作（保持登录状态等），有两种方式：

**方式一：自动连接（Chrome 144+）**

1. Chrome 中访问 `chrome://inspect/#remote-debugging` 启用远程调试
2. MCP 参数加 `--autoConnect`

**方式二：手动指定端口**

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile
```

MCP 参数加 `--browser-url=http://127.0.0.1:9222`

## 使用示例

配置完成后，在 AI 助手中试试：

> Check the performance of https://developers.chrome.com

AI 会自动打开浏览器、录制性能追踪并返回分析结果。

## 注意事项

- 该工具会将浏览器内容暴露给 AI 客户端，**避免在连接时访问包含敏感信息的页面**
- 手动开启远程调试端口时，本机任何应用都可能连接，注意安全
- 默认会向 Google 发送使用统计，可通过 `--no-usage-statistics` 禁用

## 参考

- [GitHub - ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [MCP 协议官网](https://modelcontextprotocol.io/)
