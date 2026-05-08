/**
 * 快捷键：Ctrl+Z / Ctrl+Shift+Z / Ctrl+D / Delete / Esc
 */
import { undo, redo } from '../core/history.js';
import { state, bus } from '../core/state.js';
import { cmdRemoveNode, cmdDuplicateNode } from '../core/commands.js';
import { clearSelection } from '../core/selection.js';

export function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const mod = e.ctrlKey || e.metaKey;

    if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
    if (mod && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redo(); return; }
    if (mod && e.key === 'd') {
      e.preventDefault();
      if (state.selectedNodeId) cmdDuplicateNode(state.selectedNodeId);
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedNodeId) {
      e.preventDefault();
      cmdRemoveNode(state.selectedNodeId);
      return;
    }
    if (e.key === 'Escape') { clearSelection(); return; }
  });
}
