# Website

https://docusaurus.io/zh-CN/docs

## search

https://github.com/cmfcmf/docusaurus-search-local

## 从文件导入代码块

https://docusaurus.io/zh-CN/docs/markdown-features/react#importing-code-snippets

```js
cnpm install --save @docusaurus/theme-live-codeblock
cnpm install --save raw-loader
// docusaurus.config.js
module.exports = {
  // ...
  themes: ['@docusaurus/theme-live-codeblock'],
  // ...
};
```

use

```md
import CodeBlock from '@theme/CodeBlock';
import mycode from '!!raw-loader!./mycode.go';// 下面必须空一行

<CodeBlock language="go">
{mycode}
</CodeBlock>
```

## 指定安装源

npm install --registry https://registry.npmmirror.com

## cherry-markdown

https://tencent.github.io/cherry-markdown/examples/index.html

## 本地运行

```shell
# 安装依赖
yarn

# 添加依赖（举例）
yarn add @docusaurus/theme-classic

# 删除依赖（举例）
yarn remove @docusaurus/theme-classic

# 运行
yarn start

# 构建
yarn build

```

```shell
# 更换源 
# .npmrc 文件中指定优先级最高
# 其次是 npm config get registry
# 最后是 yarn config get registry
# 优先级：.npmrc > npm config > yarn config
npm config get registry
npm config set registry https://registry.npmjs.org

yarn config get registry
yarn config set registry https://registry.npmjs.org

rm yarn.lock
yarn install --force
# 实在不行可以手动替换
sed -i 's|https://mirrors.tencent.com/npm/|https://registry.npmjs.org/|g' yarn.lock
```