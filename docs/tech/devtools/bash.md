---
title: Bash 技巧
sidebar_position: 1
---

## 字符变量截取

### 字符子串截取

在Bash中，可以使用变量截取功能来从一个字符串变量中提取部分子串，一般有以下几种方式：

1. 从开头截取指定长度的子串：

   ```
   ${variable:0:length}
   ```

   例如，`${variable:0:3}`表示从变量`variable`的开头截取3个字符的子串。

2. 从指定位置截取到结尾的子串：

   ```
   ${variable:position}
   ```

   例如，`${variable:3}`表示从变量`variable`的第4个字符开始截取到结尾的子串。

3. 从指定位置截取指定长度的子串：

   ```
   ${variable:position:length}
   ```

   例如，`${variable:3:5}`表示从变量`variable`的第4个字符开始截取5个字符的子串。

4. 从结尾截取指定长度的子串：

   ```
   ${variable:length-from-end}
   ```

   例如，`${variable: -3}`表示从变量`variable`的倒数第3个字符开始截取到结尾的子串。注意这里`${variable: -3}`中有一个空格，用于区分第4种情况和第2种情况。

5. 从结尾截取到指定位置的子串：

   ```
   ${variable:0:-position-from-end}
   ```

   例如，`${variable:0:-3}`表示从变量`variable`的开头截取到倒数第4个字符的子串。

需要注意的是，变量截取功能只能应用于字符串类型的变量，对于数字类型的变量需要先转换为字符串类型才能使用。例如：

```
num=12345
str=${num}
echo ${str:1:3}  # 输出234
```

### 特定字符截取

Bash中还提供了一些特定字符截取的功能，可以方便地从字符串中提取特定字符之前或之后的子串，这些功能包括：

1. 从开头截取到第一个特定字符之前的子串：

   ```
   ${variable%%pattern}
   ```

   例如，`${variable%%/*}`表示从变量`variable`的开头截取到第一个斜杠（`/`）之前的子串。

2. 从结尾截取到第一个特定字符之后的子串：

   ```
   ${variable#*pattern}
   ```

   例如，`${variable#*/}`表示从变量`variable`的最后一个斜杠之后的子串。

3. 从结尾截取到最后一个特定字符之前的子串：

   ```
   ${variable%pattern}
   ```

   例如，`${variable%/*}`表示从变量`variable`的最后一个斜杠之前的子串。

4. 从开头截取到最后一个特定字符之后的子串：

   ```
   ${variable##*pattern}
   ```

   例如，`${variable##*/}`表示从变量`variable`的最后一个斜杠之后的子串。

其中，`pattern`是一个用于匹配的通配符模式，可以是任何有效的通配符，例如`*`表示匹配任意数量的任意字符。

需要注意的是，特定字符截取功能也只能应用于字符串类型的变量。如果匹配不到相应的特定字符，则返回原始字符串。

## curl

### 同时获取返回内容和状态码并判断
流水线
```bash
CallbackResp=$(curl -s -w ":%{http_code}" -X POST -H "Content-Type: application/json" -d "{\"image\":\"${DOCKER_IMAGE_NAME}\", \"function_name\":\"${MODULENAME}\", \"commit\":\"${COMMIT_MSG%\\n*}\"}" "http://xxx.com");[ ${CallbackResp##*:} -ne "200" ] && { echo "操作错误：${CallbackResp%:*}；如无法处理，请联系管理员。"; exit 1; } || exit 0;
```