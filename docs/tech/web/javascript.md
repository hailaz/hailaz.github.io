---
title: JavaScript 技巧
sidebar_position: 1
---

## 取消请求，触发golang的context cancel

```html
<meta http-equiv="Content-Security-Policy" content="connect-src 'self'">
```

```js
// 现在不管用的，浏览器会拦截
const controller = new AbortController();
const signal = controller.signal;

fetch('https://xxx', { signal })
 .then(response => {
    // 处理响应数据
  })
 .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    } else {
      console.error('请求失败', error);
    }
  });

setTimeout(() => {
  // 取消请求
controller.abort();
}, 50);
```

## 不同包指定不同源

全局

```shell
npm config set @xxx:registry=https://mirrors.xxx.com/npm/
npm config set registry https://registry.npmjs.org/
```

也可以使用`.npmrc`方式针对特定项目，项目根目录新建`.npmrc`文件，内容如下：

```shell
# 为了安装旧版本依赖
registry=https://registry.npmjs.org/
@xxx:registry=https://mirrors.xxx.com/npm/
```