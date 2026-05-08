/**
 * 画布截图导出：DOM → SVG foreignObject → PNG
 * 不依赖外部库，使用原生 Canvas API
 */
import { toast } from './toast.js';

export async function screenshotCanvas() {
  const target = document.getElementById('mp-content') || document.querySelector('.preview-area');
  if (!target) { toast('找不到画布', 'error'); return; }

  const rect = target.getBoundingClientRect();
  const width  = Math.max(100, Math.round(rect.width));
  const height = Math.max(100, Math.round(rect.height));

  try {
    // 克隆并注入所有样式
    const clone = target.cloneNode(true);
    // 移除选中框/手柄 overlay 干扰
    clone.querySelectorAll('.canvas-handle, .canvas-box, .canvas-guide-line, [data-canvas-overlay]').forEach(el => el.remove());

    // 收集所有 style
    const styleSheets = Array.from(document.styleSheets);
    let cssText = '';
    for (const sheet of styleSheets) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) cssText += rule.cssText + '\n';
      } catch { /* cross-origin */ }
    }

    const svgData = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;background:#fff;">
      <style>${cssText.replace(/<\/style>/g, '<\\/style>')}</style>
      ${clone.outerHTML}
    </div>
  </foreignObject>
</svg>`;

    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = () => rej(new Error('SVG 转图失败（可能含 cross-origin 资源）'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width  = width  * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(pngBlob => {
      if (!pngBlob) { toast('截图失败', 'error'); return; }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(pngBlob);
      a.download = `screenshot-${Date.now()}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      URL.revokeObjectURL(url);
      toast('✓ 截图已保存', 'success');
    }, 'image/png');
  } catch (e) {
    console.error(e);
    toast(`截图失败: ${e.message}`, 'error');
  }
}
