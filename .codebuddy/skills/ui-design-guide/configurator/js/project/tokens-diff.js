/**
 * Tokens 差异视图：导入新 tokens 前预览颜色差异
 */
import { state, bus } from '../core/state.js';
import { applyTokensToPreview } from '../tokens/engine.js';

export function showTokensDiff(newTokens, onApply) {
  const oldTokens = state.project?.tokens || {};
  const diffs = [];

  // 对比 color.primary / neutral / semantic
  function diffScale(path, oldScale, newScale) {
    const keys = new Set([...Object.keys(oldScale||{}), ...Object.keys(newScale||{})]);
    for (const k of keys) {
      const o = oldScale?.[k], n = newScale?.[k];
      if (o !== n) diffs.push({ path: `${path}.${k}`, old: o, new: n });
    }
  }
  for (const grp of ['primary','neutral']) {
    diffScale(`color.${grp}`, oldTokens.color?.[grp], newTokens.color?.[grp]);
  }
  for (const k of new Set([
    ...Object.keys(oldTokens.color?.semantic||{}),
    ...Object.keys(newTokens.color?.semantic||{}),
  ])) {
    const o = oldTokens.color?.semantic?.[k], n = newTokens.color?.semantic?.[k];
    if (typeof o === 'object' || typeof n === 'object') diffScale(`color.semantic.${k}`, o, n);
    else if (o !== n) diffs.push({ path: `color.semantic.${k}`, old: o, new: n });
  }
  // 对比标量（radius / spacing）
  for (const group of ['radius', 'spacing']) {
    const keys = new Set([
      ...Object.keys(oldTokens[group]||{}),
      ...Object.keys(newTokens[group]||{}),
    ]);
    for (const k of keys) {
      const o = oldTokens[group]?.[k], n = newTokens[group]?.[k];
      if (o !== n) diffs.push({ path: `${group}.${k}`, old: o, new: n });
    }
  }

  const mask = document.createElement('div');
  mask.className = 'ui-confirm-mask';
  mask.innerHTML = `
    <div class="td-panel">
      <div class="td-header">
        <strong>🔍 Tokens 差异对比</strong>
        <span class="muted">共 ${diffs.length} 项变更</span>
        <button class="code-close td-close">×</button>
      </div>
      <div class="td-body">
        ${diffs.length === 0 ? '<div class="td-empty">没有差异，两个 tokens 完全相同</div>' : `
        <table class="td-table">
          <thead>
            <tr><th>路径</th><th>旧值</th><th>新值</th></tr>
          </thead>
          <tbody>
            ${diffs.map(d => `<tr>
              <td class="td-path">${d.path}</td>
              <td class="td-old">${renderValue(d.old)}</td>
              <td class="td-new">${renderValue(d.new)}</td>
            </tr>`).join('')}
          </tbody>
        </table>`}
      </div>
      <div class="td-footer">
        <button class="tool td-cancel">取消</button>
        <button class="tool primary td-apply">应用新 Tokens</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);
  const close = () => mask.remove();
  mask.querySelector('.td-close').onclick  = close;
  mask.querySelector('.td-cancel').onclick = close;
  mask.addEventListener('click', e => { if (e.target === mask) close(); });
  mask.querySelector('.td-apply').onclick = () => {
    if (state.project) state.project.tokens = newTokens;
    applyTokensToPreview();
    bus.emit('tokens:changed');
    bus.emit('project:changed');
    close();
    onApply?.();
  };
}

function renderValue(v) {
  if (v == null) return '<span class="muted">—</span>';
  if (typeof v === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(v)) {
    return `<span class="td-color-cell"><span class="td-swatch" style="background:${v};"></span>${v}</span>`;
  }
  return `<code>${String(v)}</code>`;
}
