---
title: TrueNAS
sidebar_position: 10
---

# TrueNAS

## 修改 pool 的名称

相关的地址依赖记得修改，例如共享文件夹的地址等。

1. 在 UI 中导出需要修改名字的 pool
2. 在 shell 中执行以下命令

```bash
zpool import oldpoolname newpoolname
zpool status newpoolname
zpool export newpoolname
```

3. 在 UI 中导入新的 pool
