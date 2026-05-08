/**
 * 工程 JSON 导入导出
 */
import { state, bus } from '../core/state.js';
import { toast } from '../ui/toast.js';
import { clearHistory } from '../core/history.js';

export function exportProject() {
  if (!state.project) return;
  const blob = new Blob([JSON.stringify(state.project, null, 2)], { type: 'application/json' });
  download(blob, `${state.project.meta?.name || 'project'}.udg.json`);
  toast('✓ 工程已导出', 'success');
}

export function exportTokens() {
  if (!state.project?.tokens) { toast('尚未加载 tokens', 'error'); return; }
  const blob = new Blob([JSON.stringify(state.project.tokens, null, 2)], { type: 'application/json' });
  download(blob, 'design-tokens.json');
  toast('✓ tokens 已导出', 'success');
}

export function exportBrand() {
  if (!state.project?.brand) { toast('尚未配置 brand', 'error'); return; }
  const blob = new Blob([JSON.stringify(state.project.brand, null, 2)], { type: 'application/json' });
  download(blob, 'brand-kit.json');
  toast('✓ brand-kit 已导出', 'success');
}

/** 基础 schema 校验 */
function validateProject(p) {
  if (!p || typeof p !== 'object') return '不是有效 JSON 对象';
  if (!Array.isArray(p.pages)) return '缺少 pages 数组';
  if (!p.pages.length) return 'pages 数组为空';
  for (const page of p.pages) {
    if (!page.id || !page.root) return `页面 ${page.name || '?'} 结构不完整`;
  }
  return null;
}

export function importProject(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const proj = JSON.parse(r.result);
      const err = validateProject(proj);
      if (err) { toast(`导入失败：${err}`, 'error'); return; }
      // 确保 meta 完整
      if (!proj.meta) proj.meta = { name: 'imported', version: '1.0.0', createdAt: Date.now(), updatedAt: Date.now() };
      if (!proj.activePageId) proj.activePageId = proj.pages[0].id;
      state.project = proj;
      state.selectedNodeId = null;
      clearHistory();
      bus.emit('project:changed');
      bus.emit('page:changed');
      toast('✓ 工程已导入', 'success');
    } catch (e) {
      toast(`JSON 解析失败: ${e.message}`, 'error');
    }
  };
  r.onerror = () => toast('文件读取失败', 'error');
  r.readAsText(file);
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/** 导入 tokens（通过差异对比预览） */
export function importTokens(file) {
  const r = new FileReader();
  r.onload = async () => {
    try {
      const newTokens = JSON.parse(r.result);
      const { showTokensDiff } = await import('./tokens-diff.js');
      showTokensDiff(newTokens, () => toast('✓ Tokens 已应用', 'success'));
    } catch (e) {
      toast(`Tokens JSON 解析失败: ${e.message}`, 'error');
    }
  };
  r.readAsText(file);
}
