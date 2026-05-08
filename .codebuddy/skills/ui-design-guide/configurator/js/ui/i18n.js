/**
 * 轻量 i18n（中英）
 * 用法：
 *   import { t, setLang } from './i18n.js';
 *   t('topbar.export-code')  // "&lt;/&gt; 代码" or "</> Code"
 *
 * 持久化：localStorage 'udg-lang' = 'zh' | 'en'
 */

const DICT = {
  zh: {
    'topbar.preset':  '预设',
    'topbar.device':  '视口',
    'topbar.theme':   '主题',
    'topbar.vibe':    '应用 Vibe',
    'topbar.undo':    '↶',
    'topbar.redo':    '↷',
    'topbar.export-project': '⬇ 工程',
    'topbar.export-tokens':  '⬇ Tokens',
    'topbar.export-brand':   '⬇ Brand',
    'topbar.export-code':    '</> 代码',
    'topbar.project-mgr':    '📁 工程库',
    'topbar.screenshot':     '📷 截图',
    'topbar.share':          '🔗 分享',
    'topbar.shell-dark':     '🌙',
    'topbar.shell-light':    '☀️',
    'topbar.reset':          '♻',
    'topbar.lang':           '🌐 EN',
    'empty.title':       '空白画布',
    'empty.hint':        '从左侧 <b>组件库</b> 拖拽组件到这里，或选一个页面模板快速开始',
    'empty.tip':         '💡 快捷键：Ctrl+Z 撤销 · Ctrl+Y 重做 · Delete 删除 · Ctrl+D 复制',
    'empty.tpl-home':    '🏠 小程序首页',
    'empty.tpl-list':    '📋 列表页',
    'empty.tpl-detail':  '📄 详情页',
    'empty.tpl-form':    '📝 表单页',
    'empty.tpl-mine':    '👤 个人中心',
    'panel.components':  '组件库',
    'panel.tree':        '节点树',
    'panel.props':       '属性',
    'panel.style':       '样式',
    'panel.effects':     '效果',
    'panel.search':      '搜索组件...',
    'btn.copy-code':     '📋 复制当前代码',
    'btn.download-zip':  '📦 下载 zip',
    'toast.saved':       '✓ 已保存',
    'toast.copied':      '✓ 已复制',
    'toast.no-project':  '尚未加载工程',
  },
  en: {
    'topbar.preset':  'Preset',
    'topbar.device':  'Device',
    'topbar.theme':   'Theme',
    'topbar.vibe':    'Apply Vibe',
    'topbar.undo':    '↶',
    'topbar.redo':    '↷',
    'topbar.export-project': '⬇ Project',
    'topbar.export-tokens':  '⬇ Tokens',
    'topbar.export-brand':   '⬇ Brand',
    'topbar.export-code':    '</> Code',
    'topbar.project-mgr':    '📁 Library',
    'topbar.screenshot':     '📷 Shot',
    'topbar.share':          '🔗 Share',
    'topbar.shell-dark':     '🌙',
    'topbar.shell-light':    '☀️',
    'topbar.reset':          '♻',
    'topbar.lang':           '🌐 中',
    'empty.title':       'Empty Canvas',
    'empty.hint':        'Drag components from <b>library</b> on the left, or pick a template to start',
    'empty.tip':         '💡 Shortcuts: Ctrl+Z Undo · Ctrl+Y Redo · Delete Remove · Ctrl+D Duplicate',
    'empty.tpl-home':    '🏠 MP Home',
    'empty.tpl-list':    '📋 List',
    'empty.tpl-detail':  '📄 Detail',
    'empty.tpl-form':    '📝 Form',
    'empty.tpl-mine':    '👤 Profile',
    'panel.components':  'Components',
    'panel.tree':        'Tree',
    'panel.props':       'Props',
    'panel.style':       'Style',
    'panel.effects':     'Effects',
    'panel.search':      'Search components...',
    'btn.copy-code':     '📋 Copy Current',
    'btn.download-zip':  '📦 Download zip',
    'toast.saved':       '✓ Saved',
    'toast.copied':      '✓ Copied',
    'toast.no-project':  'No project loaded',
  },
};

let currentLang = (localStorage.getItem('udg-lang') || navigator.language.startsWith('en') ? 'en' : 'zh');
if (!DICT[currentLang]) currentLang = 'zh';

export function t(key) {
  return DICT[currentLang]?.[key] ?? key;
}

export function getLang() { return currentLang; }

export function setLang(lang) {
  if (!DICT[lang]) return;
  currentLang = lang;
  localStorage.setItem('udg-lang', lang);
  applyI18n();
}

export function toggleLang() {
  setLang(currentLang === 'zh' ? 'en' : 'zh');
}

/** 扫描 DOM 上的 data-i18n 属性，替换文本 */
export function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}
