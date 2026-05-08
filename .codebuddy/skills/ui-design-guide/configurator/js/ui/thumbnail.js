/**
 * 轻量画布缩略图生成（DOM → SVG 内联，不转 PNG，体积小）
 * 用于工程槽位列表展示
 */
export async function captureThumbnail(width = 120, height = 160) {
  try {
    const target = document.getElementById('mp-content') || document.querySelector('.preview-area');
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    const srcW = Math.max(1, rect.width);
    const srcH = Math.max(1, rect.height);

    const clone = target.cloneNode(true);
    clone.querySelectorAll('.canvas-handle, .canvas-box, .canvas-guide-line').forEach(el => el.remove());

    // 构造简化的 SVG 缩略图（内联）：不含 cross-origin CSS 以避免失败，只保留骨架色块
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${srcW} ${srcH}" preserveAspectRatio="xMidYMid slice">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:${srcW}px;height:${srcH}px;background:#fff;font-family:system-ui;">${clone.outerHTML}</div>
  </foreignObject>
</svg>`;
    // data URL（不经过图片 decode，直接当 SVG 展示）
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  } catch {
    return null;
  }
}
