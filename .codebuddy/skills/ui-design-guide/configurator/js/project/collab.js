/**
 * 多人协作演示（BroadcastChannel 同域双窗口）
 *
 * 机制：
 *  - 同一个 ROOM_ID 的窗口加入同一个 BroadcastChannel
 *  - 节点变更（project:changed）→ 广播完整 state.project
 *  - 选中变更 → 广播光标位置
 *  - 接收端：应用 project；展示其他协作者光标
 *
 * 注意：非真·CRDT，最后写入胜出；演示用
 */
import { state, bus } from '../core/state.js';
import { toast } from '../ui/toast.js';

const LS_KEY = 'udg-collab';
let channel = null;
let myId = null;
let applying = false;
let cursors = new Map(); // userId -> { nodeId, name, color, lastSeen }

const COLORS = ['#07C160', '#10aeff', '#ffc300', '#fa5151', '#6467f0', '#9c6ade'];

export function getCollabState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') || {}; }
  catch { return {}; }
}

export function startCollab({ room, name } = {}) {
  if (channel) channel.close();
  const roomId = room || 'default';
  myId = `u-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
  localStorage.setItem(LS_KEY, JSON.stringify({ room: roomId, name: name || '匿名' }));

  if (typeof BroadcastChannel === 'undefined') {
    toast('当前浏览器不支持 BroadcastChannel', 'error');
    return;
  }

  channel = new BroadcastChannel(`udg-collab-${roomId}`);
  const myName  = name || '匿名';
  const myColor = COLORS[Math.abs(hashCode(myId)) % COLORS.length];

  channel.onmessage = (e) => {
    const msg = e.data;
    if (!msg || msg.from === myId) return;
    if (msg.type === 'project') {
      applying = true;
      state.project = msg.project;
      bus.emit('project:changed');
      bus.emit('page:changed');
      applying = false;
    } else if (msg.type === 'selection') {
      cursors.set(msg.from, { nodeId: msg.nodeId, name: msg.name, color: msg.color, lastSeen: Date.now() });
      renderCursors();
    } else if (msg.type === 'join') {
      // 新成员加入：发送一份当前工程
      channel.postMessage({ type: 'project', from: myId, project: state.project });
      toast(`👋 ${msg.name} 加入了房间`, 'success');
    }
  };

  bus.on('project:changed', () => {
    if (applying) return;
    channel.postMessage({ type: 'project', from: myId, project: state.project });
  });
  bus.on('selection:changed', () => {
    channel.postMessage({
      type: 'selection', from: myId, name: myName, color: myColor,
      nodeId: state.selectedNodeId,
    });
  });

  channel.postMessage({ type: 'join', from: myId, name: myName });
  toast(`✓ 已加入房间 "${roomId}"，打开第二个窗口试试`, 'success', 3500);

  // 清理过期光标
  setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (const [id, c] of cursors) {
      if (now - c.lastSeen > 30000) { cursors.delete(id); changed = true; }
    }
    if (changed) renderCursors();
  }, 10000);
}

export function stopCollab() {
  if (channel) { channel.close(); channel = null; }
  cursors.clear();
  renderCursors();
  toast('已退出协作房间', 'success');
}

function renderCursors() {
  // 在画布上展示其他协作者选中的节点
  const canvas = document.getElementById('mp-content');
  if (!canvas) return;
  canvas.querySelectorAll('.collab-cursor').forEach(el => el.remove());
  for (const [id, c] of cursors) {
    if (!c.nodeId) continue;
    const el = canvas.querySelector(`[data-node-id="${c.nodeId}"]`);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const containerRect = canvas.getBoundingClientRect();
    const tag = document.createElement('div');
    tag.className = 'collab-cursor';
    tag.textContent = c.name;
    Object.assign(tag.style, {
      position: 'absolute',
      left: `${rect.left - containerRect.left + canvas.scrollLeft}px`,
      top:  `${rect.top - containerRect.top + canvas.scrollTop - 18}px`,
      background: c.color, color: '#fff', padding: '2px 8px', fontSize: '10px',
      borderRadius: '10px', pointerEvents: 'none', zIndex: '15',
      whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    });
    // 附加到 overlay
    const overlay = document.getElementById('canvas-overlay');
    (overlay || canvas).appendChild(tag);
  }
}

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return h;
}

/* ============ UI ============ */
export function showCollabDialog() {
  const cur = getCollabState();
  const isActive = !!channel;
  const mask = document.createElement('div');
  mask.className = 'ui-confirm-mask';
  mask.innerHTML = `
    <div class="ai-panel">
      <div class="ai-header">
        <strong>👥 协作房间（演示）</strong>
        <button class="code-close" id="co-close">×</button>
      </div>
      <div class="ai-body">
        <label class="ai-label">你的昵称：</label>
        <input class="ai-input" id="co-name" value="${cur.name || '匿名'}" />
        <label class="ai-label">房间号（多人用同一个房间号协作）：</label>
        <input class="ai-input" id="co-room" value="${cur.room || 'default'}" />
        <div class="ai-hint">
          💡 基于 <b>BroadcastChannel</b>：<b>同源多窗口</b>实时同步 project。<br/>
          💡 打开两个 configurator 窗口使用相同房间号即可演示协作。<br/>
          ⚠️ 不是真·多人协作（需 WebSocket 服务端），适合本地多窗口演示。
        </div>
      </div>
      <div class="ai-footer">
        ${isActive ? `<button class="tool" id="co-stop">退出房间</button>` : ''}
        <button class="tool primary" id="co-start">${isActive ? '重新加入' : '加入房间'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  mask.querySelector('#co-close').onclick = () => mask.remove();
  mask.addEventListener('click', e => { if (e.target === mask) mask.remove(); });
  mask.querySelector('#co-start').onclick = () => {
    startCollab({
      room: mask.querySelector('#co-room').value.trim() || 'default',
      name: mask.querySelector('#co-name').value.trim() || '匿名',
    });
    mask.remove();
  };
  if (isActive) {
    mask.querySelector('#co-stop').onclick = () => { stopCollab(); mask.remove(); };
  }
}
