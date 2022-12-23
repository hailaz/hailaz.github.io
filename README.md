# Website

https://docusaurus.io/zh-CN/docs

## search

https://github.com/cmfcmf/docusaurus-search-local

## 导入代码

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
import gorun2 from '!!raw-loader!./gorun2.go';// 下面必须空一行

<CodeBlock language="go">
{gorun2}
</CodeBlock>
```