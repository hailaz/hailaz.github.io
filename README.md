# Website

<https://docusaurus.io/zh-CN/docs>

## search

<https://github.com/cmfcmf/docusaurus-search-local>

## 从文件导入代码块

<https://docusaurus.io/zh-CN/docs/markdown-features/react#importing-code-snippets>

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
import gorun2 from '!!raw-loader!./gorun2.go';// 下面必须空一行

<CodeBlock language="go">
{gorun2}
</CodeBlock>
```

## 指定安装源

npm install --registry <https://registry.npmmirror.com>

## cherry-markdown
<https://tencent.github.io/cherry-markdown/examples/index.html>
