---
id: index
title: 目录
---

## [Golang](go/index)

## 技术文章

- [这篇 Redis 文章，图灵看了都说好](https://mp.weixin.qq.com/s/k8agEub4qmhm3kX_TpETrA)
- [Nginx 最全操作总结](https://mp.weixin.qq.com/s/LmtHTOVOvdcnMBuxv7a9_A)
- [不吹不擂，一文揭秘鸿蒙操作系统](https://mp.weixin.qq.com/s/xQ6w1qlMjgxlP8QpF34GVA)
- [gRPC 基础概念详解](https://mp.weixin.qq.com/s/I2QHEBO26nGqhGwIw281Pg)
- [深入理解 overlayfs（一）：初识\_My Linux Journey-CSDN 博客](https://blog.csdn.net/luckyapple1028/article/details/77916194)
- [深入理解 overlayfs（二）：使用与原理分析\_My Linux Journey-CSDN 博客](https://blog.csdn.net/luckyapple1028/article/details/78075358)
- [认识 MySQL 和 Redis 的数据一致性问题](https://mp.weixin.qq.com/s/GU3cbUkI84IMwttDz16P3w)
- [Golang 高质量单元测试之 Table-Driven：从入门到真香](https://mp.weixin.qq.com/s/OX2we6WvIgXE_zTOijTs_g)
- [go 哪些情况会造成内存逃逸和内存泄露？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/440402836)

## temp

下面两个网站，可以查询某个 IP 地址的地域归属。
1、[ipinfo.io](https://ipinfo.io/)
![image](https://cdn.beekka.com/blogimg/asset/202309/bg2023091501.webp)
2、[ipapi.is](https://ipapi.is/)
![image](https://cdn.beekka.com/blogimg/asset/202309/bg2023091502.webp)下面两个网站，可以查询某个 IP 地址的地域归属。

这两个网站还都提供免费的数据库下载（[ipinfo 下载](https://ipinfo.io/developers/ip-to-country-asn-database)， [ipapi 下载](https://ipapi.is/geolocation.html)）。

## FinalShell SSH

FinalShell 是一体化的服务器远程管理工具，支持 SSH 终端、SFTP 文件传输、文本编辑等功能。它具有以下特点：

- 全功能 SSH 客户端
- SFTP 文件传输
- 系统监控
- 内置文本编辑器
- 多标签和分屏支持
- 支持 Windows/Linux/Mac 系统

### 下载地址

- Windows 版本：http://www.hostbuf.com/downloads/finalshell_install.exe
- Mac 版本：http://www.hostbuf.com/downloads/finalshell_install.pkg
- Linux 版本安装命令：

```bash
wget www.hostbuf.com/downloads/finalshell_install_linux.sh
chmod +x finalshell_install_linux.sh
./finalshell_install_linux.sh
```

## truenas

### 修改 pool 的名称

相关的地址依赖记得修改，例如共享文件夹的地址等。

1. 在 UI 中导出需要修改名字的 pool
2. 在 shell 中执行以下命令

```bash
zpool import oldpoolname newpoolname
zpool status newpoolname
zpool export newpoolname
```

3. 在 UI 中导入新的 pool

## vscode copilot 使用 GitHub MCP Server （本地启动）

https://github.com/github/github-mcp-server

> 目前只有 vscode insiders 版本支持

1. 创建一个 Personal access tokens，https://github.com/settings/tokens
2. 安装 github-mcp-server
   本地启动，需要将 GOPATH/bin 设置到 PATH 中 或者 指定 github-mcp-server 路径（command）

   ```bash
   # 安装github-mcp-server
   go install github.com/github/github-mcp-server/cmd/github-mcp-server@latest
   ```

3. vscode 设置，添加这个设置到 settings.json 中，会提示输入 token 的

   ```json
   "mcp": {
       "servers": {
       "github": {
           "command": "github-mcp-server",
           "args": [
           "stdio",
           ],
           "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
           }
       }
       },
       "inputs": [
       {
           "id": "github_token",
           "type": "promptString",
           "description": "GitHub Personal Access Token",
           "password": true
       }
       ]
   }
   ```

4. 使用，在 vscode 中使用 copilot agent 模式，提问：请搜索 Go GUI 相关的热门仓库
   ![alt text](image.png)
