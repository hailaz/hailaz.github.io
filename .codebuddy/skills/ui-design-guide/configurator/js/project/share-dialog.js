/**
 * 分享对话框：生成分享链接 + 二维码 + 复制 / 扫码预览
 */
import { generateShareUrl } from './share.js';
import { qrToSvg } from '../ui/qrcode.js';
import { toast } from '../ui/toast.js';

export async function showShareDialog() {
  const url = await generateShareUrl();
  if (!url) return;

  const mask = document.createElement('div');
  mask.className = 'ui-confirm-mask';
  const viewerUrl = url.replace('/configurator/', '/viewer/');
  mask.innerHTML = `
    <div class="share-panel">
      <div class="share-header">
        <strong>🔗 分享工程</strong>
        <button class="code-close share-close">×</button>
      </div>
      <div class="share-body">
        <div class="share-qr" id="share-qr"></div>
        <div class="share-info">
          <div class="share-label">分享链接（已复制到剪贴板）：</div>
          <textarea class="share-url" readonly rows="3">${url}</textarea>
          <div class="share-label">只读预览链接（适合扫码查看）：</div>
          <textarea class="share-url" id="share-viewer-url" readonly rows="3">${viewerUrl}</textarea>
          <div class="share-tips">
            💡 <strong>编辑链接</strong>：打开后可继续编辑（自动导入工程）<br/>
            💡 <strong>预览链接</strong>：只读模式，适合分享给他人快速查看<br/>
            💡 <strong>二维码</strong>：扫码即可在手机端查看（预览链接）<br/>
            ⚠️ 链接较长时可能超出浏览器限制（&gt;2KB），建议用于小型工程
          </div>
        </div>
      </div>
      <div class="share-footer">
        <button class="tool"         id="share-copy-editor">📋 复制编辑链接</button>
        <button class="tool primary" id="share-copy-viewer">📋 复制预览链接</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  // 二维码：如果 viewerUrl 太长，退化显示文字提示
  const qrBox = mask.querySelector('#share-qr');
  try {
    qrBox.innerHTML = qrToSvg(viewerUrl, { size: 220 });
  } catch (e) {
    qrBox.innerHTML = `<div class="share-qr-err">⚠️ 工程较大，无法生成二维码<br/><span style="font-size:11px;color:#999;">（${(viewerUrl.length/1024).toFixed(1)} KB 超出 QR 支持范围）</span></div>`;
  }

  mask.querySelector('.share-close').onclick = () => mask.remove();
  mask.addEventListener('click', e => { if (e.target === mask) mask.remove(); });

  mask.querySelector('#share-copy-editor').onclick = () => {
    navigator.clipboard.writeText(url).then(() => toast('✓ 编辑链接已复制', 'success'));
  };
  mask.querySelector('#share-copy-viewer').onclick = () => {
    navigator.clipboard.writeText(viewerUrl).then(() => toast('✓ 预览链接已复制', 'success'));
  };
}
