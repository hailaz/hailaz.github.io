/**
 * 命令模式 + undo/redo 历史栈
 * 所有可撤销的操作都通过 execute(cmd) 进入，自动入栈
 */

import { bus, setStatus } from './state.js';

const MAX_STACK = 100;

export const history = {
  undoStack: [],
  redoStack: [],
};

/**
 * Command 接口：
 * {
 *   label: string,           // 用于 UI 显示（可选）
 *   do():  void,             // 执行
 *   undo(): void,            // 撤销
 * }
 */
export function execute(cmd) {
  try {
    cmd.do();
    history.undoStack.push(cmd);
    if (history.undoStack.length > MAX_STACK) history.undoStack.shift();
    history.redoStack = [];
    bus.emit('history:changed');
    bus.emit('project:changed');
  } catch (err) {
    console.error('[cmd exec failed]', cmd.label, err);
    setStatus(`操作失败: ${err.message}`, 'error');
  }
}

export function undo() {
  const cmd = history.undoStack.pop();
  if (!cmd) return;
  try {
    cmd.undo();
    history.redoStack.push(cmd);
    bus.emit('history:changed');
    bus.emit('project:changed');
    setStatus(`↩ 撤销: ${cmd.label || ''}`, 'ok');
  } catch (err) {
    console.error('[undo failed]', cmd.label, err);
  }
}

export function redo() {
  const cmd = history.redoStack.pop();
  if (!cmd) return;
  try {
    cmd.do();
    history.undoStack.push(cmd);
    bus.emit('history:changed');
    bus.emit('project:changed');
    setStatus(`↪ 重做: ${cmd.label || ''}`, 'ok');
  } catch (err) {
    console.error('[redo failed]', cmd.label, err);
  }
}

export function canUndo() { return history.undoStack.length > 0; }
export function canRedo() { return history.redoStack.length > 0; }

export function clearHistory() {
  history.undoStack = [];
  history.redoStack = [];
  bus.emit('history:changed');
}
