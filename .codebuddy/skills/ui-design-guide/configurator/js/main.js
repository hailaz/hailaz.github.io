/**
 * 主入口：装配所有模块
 */

import { state, bus, createEmptyProject } from './core/state.js';
import { autosave, loadCurrent, clearAll } from './core/persistence.js';
import { undo, redo, canUndo, canRedo } from './core/history.js';

import { loadPreset, applyTokensToPreview, loadVibeTags, PRESET_NAMES } from './tokens/engine.js';

// 注册所有组件（副作用 import）
import './components/mp-base.js';
import './components/mp-layout.js';
import './components/mp-display.js';
import './components/mp-feedback.js';
import './components/mp-nav.js';
import './components/mp-business.js';
import './components/mp-blocks.js';
import './components/mp-data.js';

// 注册所有效果
import './effects/loading.js';
import './effects/transition.js';
import './effects/hover.js';
import './effects/illustration.js';
import { buildEffectsCss } from './effects/registry.js';

// 初始化各面板
import { initCanvas, renderCanvas } from './canvas/canvas.js';
import { initTree } from './canvas/tree.js';
import { initComponentsSidebar } from './canvas/components-sidebar.js';
import { initKeyboard } from './canvas/keyboard.js';
import { initPropsPanel } from './panels/props-panel.js';
import { initPagesBar } from './project/pages.js';
import { exportProject, exportTokens, exportBrand, importProject } from './project/export.js';
import { genHtml, genWxml, genReact, genVue } from './project/code-gen.js';
import { openProjectManager } from './project/project-manager.js';
import { tryLoadFromShareHash } from './project/share.js';
import { showShareDialog } from './project/share-dialog.js';
import { showAiDialog } from './project/ai-generate.js';
import { showPluginManager, restorePlugins } from './project/plugins.js';
import { showCollabDialog } from './project/collab.js';
import { toast, confirmDialog } from './ui/toast.js';
import { screenshotCanvas } from './ui/screenshot.js';
import { getLang, toggleLang, applyI18n } from './ui/i18n.js';

/* ============ 注入所有效果 CSS ============ */
function injectEffectsCss() {
  const tag = document.createElement('style');
  tag.id = 'effects-injected';
  tag.textContent = buildEffectsCss();
  document.head.appendChild(tag);
}

/* ============ 顶栏事件 ============ */
function bindTopbar() {
  document.getElementById('preset-select')?.addEventListener('change', async e => {
    await loadPreset(e.target.value);
    bus.emit('project:changed');
  });

  document.getElementById('btn-apply-vibe')?.addEventListener('click', async () => {
    const raw = document.getElementById('vibe-input')?.value || '';
    const tags = raw.split(/[,，\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
    if (!tags.length) return;
    const mod = await import('./tokens/engine.js');
    mod.applyVibe(tags);
  });

  document.getElementById('btn-undo')?.addEventListener('click', undo);
  document.getElementById('btn-redo')?.addEventListener('click', redo);

  document.getElementById('btn-preview-theme')?.addEventListener('click', () => {
    state.preview.themeMode = state.preview.themeMode === 'dark' ? 'light' : 'dark';
    applyTokensToPreview();
  });
  document.getElementById('device-select')?.addEventListener('change', e => {
    state.preview.device = e.target.value;
    document.querySelector('.preview-area').dataset.device = state.preview.device;
  });

  // 导出
  document.getElementById('btn-export-project')?.addEventListener('click', exportProject);
  document.getElementById('btn-export-tokens')?.addEventListener('click', exportTokens);
  document.getElementById('btn-export-brand')?.addEventListener('click', exportBrand);

  document.getElementById('btn-export-code')?.addEventListener('click', showCodeExportModal);
  document.getElementById('btn-project-manager')?.addEventListener('click', openProjectManager);
  document.getElementById('btn-screenshot')?.addEventListener('click', screenshotCanvas);
  document.getElementById('btn-share')?.addEventListener('click', showShareDialog);
  document.getElementById('btn-ai')?.addEventListener('click', showAiDialog);
  document.getElementById('btn-plugins')?.addEventListener('click', showPluginManager);
  document.getElementById('btn-collab')?.addEventListener('click', showCollabDialog);

  // 语言切换
  const langBtn = document.getElementById('btn-lang');
  langBtn?.addEventListener('click', () => {
    toggleLang();
    if (langBtn) langBtn.textContent = getLang() === 'zh' ? '🌐 EN' : '🌐 中';
  });
  if (langBtn) langBtn.textContent = getLang() === 'zh' ? '🌐 EN' : '🌐 中';

  // 工作台主题切换（与预览主题分离，存 localStorage）
  const shellThemeBtn = document.getElementById('btn-shell-theme');
  const currentShell = localStorage.getItem('udg-shell-theme') || 'light';
  document.documentElement.dataset.theme = currentShell;
  if (shellThemeBtn) shellThemeBtn.textContent = currentShell === 'dark' ? '☀️' : '🌙';
  shellThemeBtn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('udg-shell-theme', next);
    shellThemeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  document.getElementById('file-project')?.addEventListener('change', e => {
    const f = e.target.files?.[0]; if (f) importProject(f);
  });

  document.getElementById('btn-reset')?.addEventListener('click', async () => {
    const ok = await confirmDialog('确定要重置工程？所有页面和历史记录将被清空，此操作不可撤销。', { okText: '重置', danger: true });
    if (!ok) return;
    await clearAll();
    state.project = createEmptyProject();
    state.selectedNodeId = null;
    await loadPreset('weui-light');
    bus.emit('project:changed');
    bus.emit('page:changed');
    toast('工程已重置', 'success');
  });

  // undo/redo 按钮状态
  bus.on('history:changed', () => {
    const u = document.getElementById('btn-undo');
    const r = document.getElementById('btn-redo');
    if (u) u.disabled = !canUndo();
    if (r) r.disabled = !canRedo();
  });
}

function showCodeExportModal() {
  const wrap = document.createElement('div');
  wrap.className = 'code-modal';
  const html = genHtml();
  const wxml = genWxml();
  const react = genReact();
  const vue = genVue();

  // 异步加载高亮模块
  import('./ui/highlight.js').then(({ highlight }) => {
    const panes = wrap.querySelectorAll('[data-code-pane]');
    panes.forEach(p => {
      const lang = p.dataset.lang;
      const raw  = p.dataset.raw;
      p.innerHTML = highlight(raw, lang);
    });
  }).catch(() => {});

  wrap.innerHTML = `
    <div class="code-modal-inner">
      <div class="code-modal-header">
        <strong>导出代码</strong>
        <div class="code-tabs">
          <button data-code-tab="html"  class="on">HTML</button>
          <button data-code-tab="wxml">小程序</button>
          <button data-code-tab="react">React</button>
          <button data-code-tab="vue">Vue 3</button>
        </div>
        <button class="code-close">×</button>
      </div>
      <pre class="code-pane hl" data-code-pane="html" data-lang="html" data-raw="${escape(html)}">${escape(html)}</pre>
      <pre class="code-pane hl" data-code-pane="wxml" data-lang="wxml" data-raw="${escape(formatWxmlPack(wxml))}" hidden>${escape(formatWxmlPack(wxml))}</pre>
      <pre class="code-pane hl" data-code-pane="react" data-lang="jsx" data-raw="${escape(react)}" hidden>${escape(react)}</pre>
      <pre class="code-pane hl" data-code-pane="vue"   data-lang="vue" data-raw="${escape(vue)}" hidden>${escape(vue)}</pre>
      <div class="code-modal-footer">
        <button class="tool"         id="btn-download-zip">📦 下载 zip</button>
        <button class="tool primary" id="btn-copy-code">📋 复制当前代码</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  wrap.addEventListener('click', e => { if (e.target === wrap) wrap.remove(); });
  wrap.querySelector('.code-close').addEventListener('click', () => wrap.remove());
  wrap.querySelectorAll('[data-code-tab]').forEach(b => {
    b.addEventListener('click', () => {
      wrap.querySelectorAll('[data-code-tab]').forEach(x => x.classList.toggle('on', x === b));
      wrap.querySelectorAll('[data-code-pane]').forEach(p => p.hidden = p.dataset.codePane !== b.dataset.codeTab);
    });
  });
  wrap.querySelector('#btn-copy-code').addEventListener('click', () => {
    const pane = wrap.querySelector('[data-code-pane]:not([hidden])');
    navigator.clipboard.writeText(pane.dataset.raw.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')).then(() => {
      wrap.querySelector('#btn-copy-code').textContent = '✓ 已复制';
      setTimeout(() => wrap.querySelector('#btn-copy-code').textContent = '📋 复制当前代码', 1500);
    });
  });
  wrap.querySelector('#btn-download-zip').addEventListener('click', async () => {
    const { downloadCodeZip } = await import('./project/code-zip.js');
    downloadCodeZip({ html, wxml, react, vue });
  });
}

function formatWxmlPack(pack) {
  return `<!-- ========= pages/page.wxml ========= -->\n${pack.wxml}\n\n<!-- ========= pages/page.wxss ========= -->\n${pack.wxss}\n\n<!-- ========= pages/page.js ========= -->\n${pack.js}`;
}

function escape(s) { return String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ============ 启动 ============ */
(async function init() {
  // 全局错误捕获：避免白屏
  window.addEventListener('error', (e) => {
    console.error('[global]', e.error || e.message);
    toast(`运行错误：${e.message}`, 'error', 3500);
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[promise]', e.reason);
    toast(`异步错误：${e.reason?.message || e.reason}`, 'error', 3500);
  });

  injectEffectsCss();

  // 从 IndexedDB 恢复；否则建新工程
  let saved = null;
  try { saved = await loadCurrent(); } catch { saved = null; }
  state.project = saved || createEmptyProject();
  if (!state.project.tokens) {
    await loadPreset('weui-light');
  } else {
    applyTokensToPreview();
  }

  initComponentsSidebar();
  initTree();
  initCanvas();
  initPropsPanel();
  initPagesBar();
  initKeyboard();
  bindTopbar();

  await loadVibeTags();

  // 恢复插件（在 VibeTags 之后，tokens 之前的 user 操作之前）
  await restorePlugins();

  // 优先尝试从 #share= 加载（覆盖 IndexedDB）
  await tryLoadFromShareHash();

  // 预设下拉赋初值
  const sel = document.getElementById('preset-select');
  if (sel && state.project.tokens?.meta?.name) {
    // 匹配预设名：meta.name 可能为 'weui-light' 之类
    const v = state.project.tokens.meta.name;
    if (PRESET_NAMES.includes(v)) sel.value = v;
  }

  // 自动保存
  bus.on('project:changed', () => {
    if (!state.project.meta) state.project.meta = {};
    state.project.meta.updatedAt = Date.now();
    autosave(state.project);
  });

  // 首次渲染
  bus.emit('project:changed');
  bus.emit('page:changed');

  // 调试入口
  window.__udg = { state, bus };
})();
