/**
 * 多页面管理 UI（顶部页面 Tab）
 */
import { state, bus } from '../core/state.js';
import { cmdAddPage, cmdRemovePage, cmdRenamePage, cmdDuplicatePage } from '../core/commands.js';

let rootEl = null;

export function initPagesBar() {
  rootEl = document.getElementById('pages-bar');
  if (!rootEl) return;
  bus.on('project:changed', render);
  bus.on('page:changed',    render);
  render();
}

function render() {
  if (!rootEl || !state.project) return;
  const project = state.project;
  rootEl.innerHTML = `
<div class="pages-scroll">
  ${project.pages.map(p => `
    <div class="page-tab ${p.id === project.activePageId ? 'active' : ''}" data-page-id="${p.id}">
      <span class="page-name" title="双击重命名">${escapeHtml(p.name)}</span>
      ${project.pages.length > 1 ? '<span class="page-close" title="删除">×</span>' : ''}
    </div>
  `).join('')}
  <button class="page-add" title="新建页面">+</button>
</div>
`;

  rootEl.querySelectorAll('.page-tab').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.classList.contains('page-close')) {
        cmdRemovePage(el.dataset.pageId);
      } else {
        state.project.activePageId = el.dataset.pageId;
        state.selectedNodeId = null;
        bus.emit('page:changed');
      }
    });
    el.querySelector('.page-name')?.addEventListener('dblclick', () => {
      const name = prompt('重命名页面', state.project.pages.find(p => p.id === el.dataset.pageId)?.name);
      if (name) cmdRenamePage(el.dataset.pageId, name);
    });
  });
  rootEl.querySelector('.page-add')?.addEventListener('click', (e) => showAddMenu(e));
}

function showAddMenu(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const menu = document.createElement('div');
  menu.className = 'page-add-menu';
  menu.innerHTML = `
    <div data-tpl="blank">📄 空白页面</div>
    <div data-tpl="home">🏠 小程序首页</div>
    <div data-tpl="list">📋 列表页</div>
    <div data-tpl="detail">🔍 详情页</div>
    <div data-tpl="form">✍️ 表单页</div>
    <div data-tpl="mine">👤 个人中心</div>
  `;
  Object.assign(menu.style, {
    position: 'fixed',
    top: (rect.bottom + 4) + 'px',
    left: rect.left + 'px',
    background: 'var(--shell-side)', border: '1px solid var(--shell-border)',
    borderRadius: '6px', padding: '4px', zIndex: '1000',
    boxShadow: '0 4px 12px rgba(0,0,0,.12)', minWidth: '160px',
  });
  menu.querySelectorAll('div[data-tpl]').forEach(d => {
    Object.assign(d.style, { padding: '8px 12px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px' });
    d.addEventListener('mouseenter', () => d.style.background = 'var(--shell-bg)');
    d.addEventListener('mouseleave', () => d.style.background = '');
    d.addEventListener('click', () => {
      const tpl = d.dataset.tpl;
      createFromTemplate(tpl);
      menu.remove();
    });
  });
  document.body.appendChild(menu);
  setTimeout(() => {
    document.addEventListener('click', function close(e) {
      if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', close); }
    });
  }, 0);
}

function createFromTemplate(tpl) {
  const names = { blank: '空白页面', home: '首页', list: '列表页', detail: '详情页', form: '表单页', mine: '我的' };
  const pageId = cmdAddPage('mp-page', names[tpl] || tpl);
  if (!pageId || tpl === 'blank') return;
  // 向新页面填充模板
  import('./page-templates.js').then(m => {
    m.applyTemplate(pageId, tpl);
  });
}

function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
