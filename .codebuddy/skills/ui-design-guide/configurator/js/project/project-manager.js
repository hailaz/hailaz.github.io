/**
 * 工程管理器：IndexedDB 多工程槽位
 * 提供"保存到槽位 / 从槽位加载 / 删除槽位"UI
 */
import { state, bus, createEmptyProject } from '../core/state.js';
import {
  saveProjectSlot, loadProjectSlot, listProjectSlots, deleteProjectSlot,
} from '../core/persistence.js';
import { clearHistory } from '../core/history.js';
import { toast, confirmDialog } from '../ui/toast.js';
import { captureThumbnail } from '../ui/thumbnail.js';

export async function openProjectManager() {
  const list = await listProjectSlots();
  const mask = document.createElement('div');
  mask.className = 'ui-confirm-mask pm-mask';
  mask.innerHTML = `
    <div class="pm-panel">
      <div class="pm-header">
        <strong>📁 我的工程</strong>
        <div class="pm-actions">
          <input id="pm-current-name" value="${(state.project?.meta?.name || 'untitled').replace(/"/g,'&quot;')}" placeholder="工程名" />
          <button class="tool primary" id="pm-save-current">💾 保存当前为新工程</button>
        </div>
        <button class="code-close" id="pm-close">×</button>
      </div>
      <div class="pm-list">
        ${list.length ? list.sort((a,b)=>b.updatedAt-a.updatedAt).map(p => `
          <div class="pm-item" data-id="${p.id}">
            <div class="pm-thumb">${p.thumbnail ? `<img src="${p.thumbnail}" alt="" />` : '📄'}</div>
            <div class="pm-info">
              <div class="pm-name">${escape(p.name || 'untitled')}</div>
              <div class="pm-meta">
                <span>${p.pagesCount || 0} 个页面</span>
                <span>·</span>
                <span>${new Date(p.updatedAt).toLocaleString('zh-CN')}</span>
                <span class="pm-platform">${p.platform || ''}</span>
              </div>
            </div>
            <div class="pm-buttons">
              <button class="tool" data-pm-action="load">打开</button>
              <button class="tool pm-danger" data-pm-action="delete">删除</button>
            </div>
          </div>
        `).join('') : '<div class="pm-empty">还没有保存的工程。点击右上角「保存当前」开始建立工程库。</div>'}
      </div>
      <div class="pm-footer">
        <button class="tool" id="pm-new">✨ 新建空工程</button>
        <span class="pm-tip">💡 工程存储在浏览器 IndexedDB 中，清除浏览器数据会丢失，请及时导出 JSON。</span>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  mask.querySelector('#pm-close').onclick = () => mask.remove();
  mask.addEventListener('click', e => { if (e.target === mask) mask.remove(); });

  mask.querySelector('#pm-save-current').onclick = async () => {
    const name = mask.querySelector('#pm-current-name').value.trim() || 'untitled';
    if (!state.project) return;
    const thumb = await captureThumbnail();
    const snapshot = JSON.parse(JSON.stringify(state.project));
    snapshot.meta = { ...(snapshot.meta || {}), id: `proj_${Date.now()}`, name };
    await saveProjectSlot(snapshot, thumb);
    toast(`✓ 已保存到工程库：${name}`, 'success');
    mask.remove();
    openProjectManager(); // 刷新列表
  };

  mask.querySelector('#pm-new').onclick = async () => {
    const ok = await confirmDialog('新建空工程？当前未保存的修改会丢失（可先保存到工程库）。', { okText: '新建', danger: true });
    if (!ok) return;
    state.project = createEmptyProject();
    state.selectedNodeId = null;
    clearHistory();
    bus.emit('project:changed');
    bus.emit('page:changed');
    mask.remove();
    toast('✓ 已新建空工程', 'success');
  };

  mask.querySelectorAll('.pm-item').forEach(item => {
    const id = item.dataset.id;
    item.querySelector('[data-pm-action="load"]').onclick = async () => {
      const proj = await loadProjectSlot(id);
      if (!proj) { toast('加载失败，工程可能已被删除', 'error'); return; }
      state.project = proj;
      state.selectedNodeId = null;
      clearHistory();
      bus.emit('project:changed');
      bus.emit('page:changed');
      toast(`✓ 已打开工程：${proj.meta?.name || '?'}`, 'success');
      mask.remove();
    };
    item.querySelector('[data-pm-action="delete"]').onclick = async () => {
      const ok = await confirmDialog('确认删除此工程？该操作不可恢复。', { okText: '删除', danger: true });
      if (!ok) return;
      await deleteProjectSlot(id);
      item.remove();
      toast('已删除', 'success');
      if (!mask.querySelectorAll('.pm-item').length) {
        mask.querySelector('.pm-list').innerHTML = '<div class="pm-empty">还没有保存的工程。</div>';
      }
    };
  });
}

function escape(s) {
  return String(s || '').replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
}
