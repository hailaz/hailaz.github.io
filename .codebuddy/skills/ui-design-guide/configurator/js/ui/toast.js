/**
 * 全局 Toast 提示（替代 alert/confirm）
 */
let currentToast = null;

export function toast(message, kind = '', duration = 2200) {
  if (currentToast) { currentToast.remove(); currentToast = null; }
  const el = document.createElement('div');
  el.className = `ui-toast ${kind}`;
  el.textContent = message;
  document.body.appendChild(el);
  currentToast = el;
  setTimeout(() => {
    if (currentToast === el) {
      el.style.transition = 'opacity 0.2s';
      el.style.opacity = '0';
      setTimeout(() => { if (el.parentNode) el.remove(); currentToast = null; }, 200);
    }
  }, duration);
}

/** 自定义确认框（非阻塞 alert/confirm） */
export function confirmDialog(message, { okText = '确定', cancelText = '取消', danger = false } = {}) {
  return new Promise(resolve => {
    const mask = document.createElement('div');
    mask.className = 'ui-confirm-mask';
    mask.innerHTML = `
      <div class="ui-confirm">
        <div class="ui-confirm-msg">${message}</div>
        <div class="ui-confirm-footer">
          <button class="btn-cancel">${cancelText}</button>
          <button class="btn-ok ${danger ? 'danger' : ''}">${okText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);
    mask.querySelector('.btn-cancel').onclick = () => { mask.remove(); resolve(false); };
    mask.querySelector('.btn-ok').onclick     = () => { mask.remove(); resolve(true); };
    mask.addEventListener('click', e => { if (e.target === mask) { mask.remove(); resolve(false); } });
  });
}
