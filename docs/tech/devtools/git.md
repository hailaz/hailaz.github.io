---
title: Git 使用技巧
sidebar_position: 2
---

## git 添加文件的可执行权限

```shell
# 查看当前权限
git ls-files --stage run.sh
# 增加可执行权限
git update-index --chmod +x run.sh

```