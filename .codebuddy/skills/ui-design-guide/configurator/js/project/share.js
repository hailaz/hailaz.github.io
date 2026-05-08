/**
 * 分享链接：工程 JSON → gzip（CompressionStream）→ base64url → URL hash
 */
import { state, bus } from '../core/state.js';
import { toast } from '../ui/toast.js';
import { clearHistory } from '../core/history.js';

/** 生成分享 URL（复制到剪贴板） */
export async function generateShareUrl() {
  if (!state.project) return;
  try {
    const json = JSON.stringify(state.project);
    const b64 = await compressBase64(json);
    const url = `${location.origin}${location.pathname}#share=${b64}`;
    await navigator.clipboard.writeText(url);
    toast(`✓ 分享链接已复制（${(b64.length/1024).toFixed(1)} KB）`, 'success', 3000);
    return url;
  } catch (e) {
    console.error(e);
    toast(`生成分享链接失败: ${e.message}`, 'error');
  }
}

/** 启动时检查 hash#share= 并恢复工程 */
export async function tryLoadFromShareHash() {
  const m = location.hash.match(/#share=([A-Za-z0-9_-]+)/);
  if (!m) return false;
  try {
    const b64 = m[1];
    const json = await decompressBase64(b64);
    const proj = JSON.parse(json);
    if (!proj?.pages) throw new Error('数据格式不正确');
    state.project = proj;
    state.selectedNodeId = null;
    clearHistory();
    bus.emit('project:changed');
    bus.emit('page:changed');
    // 清除 hash 避免刷新时又加载
    history.replaceState(null, '', location.pathname + location.search);
    toast('✓ 已从分享链接恢复工程', 'success');
    return true;
  } catch (e) {
    console.error(e);
    toast(`分享链接解析失败: ${e.message}`, 'error');
    return false;
  }
}

/* ============ 压缩工具（CompressionStream 优先，不支持则直接 base64） ============ */
async function compressBase64(str) {
  if (typeof CompressionStream !== 'undefined') {
    const stream = new Blob([str], { type: 'text/plain' }).stream()
      .pipeThrough(new CompressionStream('gzip'));
    const blob = await new Response(stream).blob();
    const buf = new Uint8Array(await blob.arrayBuffer());
    return 'gz:' + uint8ToBase64url(buf);
  }
  // fallback: 直接 utf-8 转 base64
  return 'raw:' + btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function decompressBase64(b64) {
  if (b64.startsWith('gz:')) {
    if (typeof DecompressionStream === 'undefined') throw new Error('当前浏览器不支持解压');
    const buf = base64urlToUint8(b64.slice(3));
    const stream = new Blob([buf]).stream()
      .pipeThrough(new DecompressionStream('gzip'));
    const text = await new Response(stream).text();
    return text;
  }
  if (b64.startsWith('raw:')) {
    const s = b64.slice(4).replace(/-/g, '+').replace(/_/g, '/');
    const padded = s + '==='.slice((s.length + 3) % 4);
    return decodeURIComponent(escape(atob(padded)));
  }
  throw new Error('未知的分享数据格式');
}

function uint8ToBase64url(u8) {
  let bin = '';
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToUint8(s) {
  const std = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = std + '==='.slice((std.length + 3) % 4);
  const bin = atob(padded);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}
