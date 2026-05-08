/**
 * Viewer（只读）入口
 * 从 URL hash / search 读取 share 数据，渲染节点树到只读容器
 */
import { state } from '../configurator/js/core/state.js';

// 注册所有组件与效果（副作用）
import '../configurator/js/components/mp-base.js';
import '../configurator/js/components/mp-layout.js';
import '../configurator/js/components/mp-display.js';
import '../configurator/js/components/mp-feedback.js';
import '../configurator/js/components/mp-nav.js';
import '../configurator/js/components/mp-business.js';
import '../configurator/js/components/mp-blocks.js';
import '../configurator/js/components/mp-data.js';
import '../configurator/js/effects/loading.js';
import '../configurator/js/effects/transition.js';
import '../configurator/js/effects/hover.js';
import '../configurator/js/effects/illustration.js';

import { renderNode } from '../configurator/js/components/registry.js';
import { buildEffectsCss } from '../configurator/js/effects/registry.js';
import { tokensToCssVars } from '../configurator/js/tokens/engine.js';

// 注入效果 CSS
(function injectEffects() {
  const tag = document.createElement('style');
  tag.textContent = buildEffectsCss();
  document.head.appendChild(tag);
})();

async function loadFromHash() {
  // 优先读 #share=xxx
  const hashMatch = location.hash.match(/#share=([A-Za-z0-9_-]+)/);
  // 或者 ?share=xxx
  const searchMatch = new URLSearchParams(location.search).get('share');
  const token = hashMatch ? hashMatch[1] : searchMatch;
  if (!token) {
    document.getElementById('viewer-canvas').innerHTML = `
      <div class="viewer-empty">
        <div style="font-size:32px;margin-bottom:10px;">📭</div>
        <div>没有分享数据</div>
        <div style="font-size:12px;color:#bbb;margin-top:6px;">在 configurator 中点击「🔗 分享」按钮生成链接</div>
      </div>`;
    return;
  }

  try {
    const json = await decompressBase64(token);
    const proj = JSON.parse(json);
    renderProject(proj);
  } catch (e) {
    document.getElementById('viewer-canvas').innerHTML = `
      <div class="viewer-empty">
        <div style="font-size:32px;margin-bottom:10px;">⚠️</div>
        <div>解析失败：${e.message}</div>
      </div>`;
  }
}

function renderProject(proj) {
  state.project = proj;
  state.preview = state.preview || { themeMode: 'light' };

  document.getElementById('viewer-title').textContent = proj.meta?.name || 'UI Design Guide · 预览';

  // 去编辑按钮指向 configurator
  const editBtn = document.getElementById('viewer-edit');
  editBtn.href = location.href.replace('/viewer/', '/configurator/');

  // 应用 tokens
  if (proj.tokens) {
    const root = document.getElementById('viewer-canvas');
    const map = tokensToCssVars(proj.tokens);
    for (const [k, v] of Object.entries(map)) root.style.setProperty(k, v);
  }

  // 页面 tab
  const tabs = document.getElementById('viewer-pages');
  tabs.innerHTML = '';
  proj.pages.forEach((page, idx) => {
    const tab = document.createElement('button');
    tab.className = 'tab' + (idx === 0 ? ' on' : '');
    tab.textContent = page.name || `页面${idx + 1}`;
    tab.onclick = () => {
      tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      renderPage(page);
    };
    tabs.appendChild(tab);
  });

  if (proj.pages.length) renderPage(proj.pages[0]);
}

function renderPage(page) {
  const canvas = document.getElementById('viewer-canvas');
  const existing = canvas.querySelector('#viewer-root');
  const html = renderNode(page.root);
  if (existing) existing.remove();
  const wrap = document.createElement('div');
  wrap.id = 'viewer-root';
  wrap.innerHTML = html;
  canvas.appendChild(wrap);
}

loadFromHash();
window.addEventListener('hashchange', loadFromHash);

/* ============ 同步压缩算法（与 share.js 一致） ============ */
async function decompressBase64(b64) {
  if (b64.startsWith('gz:')) {
    if (typeof DecompressionStream === 'undefined') throw new Error('当前浏览器不支持解压');
    const buf = base64urlToUint8(b64.slice(3));
    const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).text();
  }
  if (b64.startsWith('raw:')) {
    const s = b64.slice(4).replace(/-/g, '+').replace(/_/g, '/');
    const padded = s + '==='.slice((s.length + 3) % 4);
    return decodeURIComponent(escape(atob(padded)));
  }
  throw new Error('未知格式');
}

function base64urlToUint8(s) {
  const std = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = std + '==='.slice((std.length + 3) % 4);
  const bin = atob(padded);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}
