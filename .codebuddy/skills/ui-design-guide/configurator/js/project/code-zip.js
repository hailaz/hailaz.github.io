/**
 * 代码导出 zip：纯 JS ZIP STORE（无压缩）
 * 规格参考：PKZIP APPNOTE.TXT
 * 足以生成 wechat-mp 项目 / web 项目的多文件包
 */
import { toast } from '../ui/toast.js';

/** 生成并下载 zip */
export function downloadCodeZip({ html, wxml, react, vue }) {
  try {
    const files = [
      // HTML 项目
      { name: 'web/index.html', data: html },
      // 小程序项目
      { name: 'miniprogram/pages/page/index.wxml', data: wxml.wxml },
      { name: 'miniprogram/pages/page/index.wxss', data: wxml.wxss },
      { name: 'miniprogram/pages/page/index.js',   data: wxml.js  },
      { name: 'miniprogram/README.md',             data: mpReadme() },
      // React 项目
      { name: 'react/src/Page.jsx',                data: react },
      { name: 'react/src/index.js',                data: reactEntry() },
      { name: 'react/README.md',                   data: reactReadme() },
      // Vue 项目
      { name: 'vue/src/Page.vue',                  data: vue },
      { name: 'vue/src/main.js',                   data: vueEntry() },
      { name: 'vue/README.md',                     data: vueReadme() },
      // 总 README
      { name: 'README.md', data: rootReadme() },
    ];
    const blob = buildZip(files);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ui-design-guide-export-${Date.now()}.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('✓ zip 已下载', 'success');
  } catch (e) {
    console.error(e);
    toast(`zip 生成失败: ${e.message}`, 'error');
  }
}

function rootReadme() {
  return `# UI Design Guide · 导出工程\n\n包含 4 种框架实现：\n\n- \`web/\` — 标准 HTML\n- \`miniprogram/\` — 微信小程序\n- \`react/\` — React\n- \`vue/\` — Vue 3\n\n请根据需要选择使用。生成时间：${new Date().toLocaleString('zh-CN')}\n`;
}
function mpReadme() {
  return `# 微信小程序页面\n\n1. 把整个 miniprogram/ 目录内容拷贝到你的小程序工程 \`pages/page/\` 下\n2. 在 \`app.json\` 的 pages 数组添加 \`"pages/page/index"\`\n3. app.wxss 中注入 tokens（参考 wxss 顶部 page 变量）\n`;
}
function reactEntry() {
  return `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport Page from './Page.jsx';\n\ncreateRoot(document.getElementById('root')).render(<Page />);\n`;
}
function reactReadme() {
  return `# React 页面\n\n\`\`\`bash\nnpm create vite@latest my-app -- --template react\ncd my-app && cp ../Page.jsx src/\n\`\`\`\n`;
}
function vueEntry() {
  return `import { createApp } from 'vue';\nimport Page from './Page.vue';\ncreateApp(Page).mount('#app');\n`;
}
function vueReadme() {
  return `# Vue 3 页面\n\n\`\`\`bash\nnpm create vite@latest my-app -- --template vue\ncd my-app && cp ../Page.vue src/\n\`\`\`\n`;
}

/* ============ 纯 JS ZIP STORE 实现 ============ */
function buildZip(files) {
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const dataBytes = enc.encode(f.data);
    const crc = crc32(dataBytes);
    const size = dataBytes.length;
    const now = dosDateTime(new Date());

    // Local File Header
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);         // signature
    lv.setUint16(4, 20, true);                  // version
    lv.setUint16(6, 0, true);                   // flags
    lv.setUint16(8, 0, true);                   // method = store
    lv.setUint16(10, now.time, true);
    lv.setUint16(12, now.date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);
    chunks.push(localHeader);
    chunks.push(dataBytes);

    // Central Directory Record
    const centralRec = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralRec.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, now.time, true);
    cv.setUint16(14, now.date, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);                  // extra
    cv.setUint16(32, 0, true);                  // comment
    cv.setUint16(34, 0, true);                  // disk
    cv.setUint16(36, 0, true);                  // internal attrs
    cv.setUint32(38, 0, true);                  // external attrs
    cv.setUint32(42, offset, true);
    centralRec.set(nameBytes, 46);
    central.push(centralRec);

    offset += localHeader.length + dataBytes.length;
  }

  const centralBlob = concat(central);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralBlob.length, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  chunks.push(centralBlob);
  chunks.push(eocd);
  return new Blob(chunks, { type: 'application/zip' });
}

function concat(arrs) {
  const total = arrs.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrs) { out.set(a, off); off += a.length; }
  return out;
}

function dosDateTime(d) {
  return {
    time: ((d.getHours() & 0x1f) << 11) | ((d.getMinutes() & 0x3f) << 5) | ((d.getSeconds() / 2) & 0x1f),
    date: (((d.getFullYear() - 1980) & 0x7f) << 9) | (((d.getMonth() + 1) & 0x0f) << 5) | (d.getDate() & 0x1f),
  };
}

/* CRC32 */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}
