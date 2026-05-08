/**
 * 轻量代码高亮（纯正则，不引外部库）
 * 支持：HTML/XML、JSX、Vue template、CSS、JS
 */

export function highlight(code, lang = 'html') {
  if (!code) return '';
  // 先转义
  let s = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (lang === 'html' || lang === 'xml' || lang === 'wxml' || lang === 'vue') {
    // 注释
    s = s.replace(/&lt;!--[\s\S]*?--&gt;/g, m => `<span class="hl-comment">${m}</span>`);
    // 标签（含属性）
    s = s.replace(/(&lt;\/?)([\w-]+)((?:\s+[\w-]+(?:=(?:"[^"]*"|'[^']*'|\{[^}]*\}))?)*)(\s*\/?&gt;)/g,
      (_, open, tag, attrs, close) => {
        // 高亮属性
        const hAttrs = attrs.replace(/([\w-]+)(=(?:"[^"]*"|'[^']*'|\{[^}]*\}))?/g,
          (_, name, val) => {
            if (!val) return `<span class="hl-attr">${name}</span>`;
            return `<span class="hl-attr">${name}</span>=<span class="hl-string">${val.slice(1)}</span>`;
          });
        return `<span class="hl-punc">${open}</span><span class="hl-tag">${tag}</span>${hAttrs}<span class="hl-punc">${close}</span>`;
      });
  } else if (lang === 'css' || lang === 'wxss') {
    // 注释
    s = s.replace(/\/\*[\s\S]*?\*\//g, m => `<span class="hl-comment">${m}</span>`);
    // 属性名 :
    s = s.replace(/([\w-]+)\s*:/g, '<span class="hl-attr">$1</span>:');
    // 字符串
    s = s.replace(/(&quot;[^&]*?&quot;|'[^']*')/g, '<span class="hl-string">$1</span>');
    // 数值单位
    s = s.replace(/(\d+(?:\.\d+)?)(px|rpx|em|rem|%|vw|vh|s|ms)/g, '<span class="hl-num">$1$2</span>');
    // 选择器 #id / .class
    s = s.replace(/(^|\n|\s)([.#][\w-]+)/g, '$1<span class="hl-tag">$2</span>');
  } else if (lang === 'js' || lang === 'jsx' || lang === 'ts' || lang === 'tsx') {
    // 字符串
    s = s.replace(/(&quot;[^&]*?&quot;|'[^']*'|`[^`]*`)/g, '<span class="hl-string">$1</span>');
    // 注释
    s = s.replace(/\/\/[^\n]*/g, m => `<span class="hl-comment">${m}</span>`);
    s = s.replace(/\/\*[\s\S]*?\*\//g, m => `<span class="hl-comment">${m}</span>`);
    // 关键字
    s = s.replace(/\b(import|export|from|default|const|let|var|function|return|async|await|if|else|for|while|class|new|this|typeof|in|of|try|catch|throw)\b/g,
      '<span class="hl-keyword">$1</span>');
    // 数字
    s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="hl-num">$1</span>');
  }

  return s;
}
