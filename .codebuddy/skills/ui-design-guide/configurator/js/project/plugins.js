/**
 * 插件系统
 *
 * 插件是一个 ESM，导出 register(api) 函数：
 *   export function register(api) {
 *     api.registerComponent({ id:'my-hero', name:'Hero', ... });
 *     api.registerEffect({ id:'fx-neon', ... });
 *     api.registerCodegen('my-hero', 'wxml', (node, ctx) => ...);
 *   }
 *
 * 加载方式：
 *   - URL 动态 import（CORS 必须允许）
 *   - 拖放本地 .js 文件（URL.createObjectURL + import）
 *   - 粘贴源码（Blob URL）
 *
 * 插件元数据持久化到 localStorage 'udg-plugins'
 */
import { register as registerComponent } from '../components/registry.js';
import { register as registerEffect }    from '../effects/registry.js';
import { bus } from '../core/state.js';
import { toast } from '../ui/toast.js';

const LS_KEY = 'udg-plugins';
const loaded = new Map(); // id -> { meta, objectUrl? }

/* ============ Plugin API 传给插件 ============ */
const api = {
  registerComponent(def) {
    if (!def.id) throw new Error('plugin component must have id');
    registerComponent(def);
    bus.emit('project:changed');
  },
  registerEffect(def) {
    if (!def.id) throw new Error('plugin effect must have id');
    registerEffect(def);
  },
  registerCodegen(componentId, target, fn) {
    import('../components/registry.js').then(({ get }) => {
      const def = get(componentId);
      if (!def) return;
      def.codegen = def.codegen || {};
      def.codegen[target] = fn;
    });
  },
};

export async function loadPlugin(url, meta = {}) {
  try {
    const mod = await import(/* @vite-ignore */ url);
    if (typeof mod.register !== 'function') throw new Error('插件必须导出 register(api)');
    mod.register(api);
    const id = meta.id || url;
    loaded.set(id, { meta: { ...meta, url, name: meta.name || id, loadedAt: Date.now() } });
    persistList();
    toast(`✓ 插件已加载：${meta.name || id}`, 'success');
  } catch (e) {
    console.error(e);
    toast(`插件加载失败：${e.message}`, 'error', 3500);
    throw e;
  }
}

export async function loadPluginFromBlob(source, name = 'custom') {
  const blob = new Blob([source], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  await loadPlugin(url, { id: `blob-${Date.now()}`, name, source, kind: 'blob' });
}

export function listPlugins() {
  return Array.from(loaded.values()).map(x => x.meta);
}

function persistList() {
  // blob 插件需要存源码，URL 插件只存 URL
  const arr = Array.from(loaded.values())
    .map(x => x.meta)
    .filter(m => m.kind !== 'blob' || m.source); // 无 source 的 blob 无法恢复
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

export async function restorePlugins() {
  try {
    const arr = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    for (const meta of arr) {
      if (meta.kind === 'blob' && meta.source) {
        await loadPluginFromBlob(meta.source, meta.name).catch(() => {});
      } else if (meta.url) {
        await loadPlugin(meta.url, meta).catch(() => {});
      }
    }
  } catch { /* ignore */ }
}

/* ============ 示例插件（内置） ============ */
export function getBuiltinPlugins() {
  return [
    {
      id: 'demo-stars',
      name: 'Demo · 装饰星',
      description: '注册一个 decorative star 组件示例',
      source: `export function register(api){
  api.registerComponent({
    id:'demo-stars',
    name:'✨ 装饰星',
    category:'插件·示例',
    icon:'✨',
    defaultProps:{ count:5, color:'#ffb800' },
    schema:{
      props:[
        { key:'count', label:'星数', type:'number' },
        { key:'color', label:'颜色', type:'color' },
      ],
      style:[],
    },
    render(node){
      const p = node.props || {};
      const n = +p.count || 5;
      return '<span data-node-id="'+node.id+'" style="font-size:22px;color:'+(p.color||'#ffb800')+';letter-spacing:4px;">' + '★'.repeat(n) + '</span>';
    },
  });
}`,
    },
  ];
}

/* ============ UI ============ */
export function showPluginManager() {
  const mask = document.createElement('div');
  mask.className = 'ui-confirm-mask';
  const list = listPlugins();
  const builtin = getBuiltinPlugins();

  mask.innerHTML = `
    <div class="ai-panel" style="width:640px;">
      <div class="ai-header">
        <strong>🧩 插件管理</strong>
        <button class="code-close" id="pl-close">×</button>
      </div>
      <div class="ai-body">
        <label class="ai-label">从 URL 加载（ESM）：</label>
        <div style="display:flex;gap:6px;">
          <input class="ai-input" id="pl-url" placeholder="https://example.com/my-plugin.js" style="flex:1;" />
          <button class="tool primary" id="pl-load-url">加载</button>
        </div>
        <label class="ai-label">或粘贴源码：</label>
        <textarea class="ai-input" id="pl-source" rows="5" placeholder="export function register(api){ api.registerComponent({id:'x',name:'X',...}); }"></textarea>
        <div style="display:flex;gap:6px;justify-content:flex-end;">
          <button class="tool primary" id="pl-load-source">加载源码</button>
        </div>

        <label class="ai-label">内置示例插件：</label>
        <div class="pl-list">
          ${builtin.map(b => `
            <div class="pl-item">
              <div style="flex:1;">
                <div class="pl-name">${b.name}</div>
                <div class="pl-desc">${b.description}</div>
              </div>
              <button class="tool" data-pl-builtin="${b.id}">安装</button>
            </div>
          `).join('')}
        </div>

        ${list.length ? `<label class="ai-label">已加载（${list.length}）：</label>
        <div class="pl-list">
          ${list.map(m => `
            <div class="pl-item">
              <div style="flex:1;">
                <div class="pl-name">${m.name}</div>
                <div class="pl-desc">${m.url || '(blob)'}</div>
              </div>
            </div>
          `).join('')}
        </div>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  mask.querySelector('#pl-close').onclick = () => mask.remove();
  mask.addEventListener('click', e => { if (e.target === mask) mask.remove(); });

  mask.querySelector('#pl-load-url').onclick = async () => {
    const url = mask.querySelector('#pl-url').value.trim();
    if (!url) return;
    await loadPlugin(url, { id: url, name: url.split('/').pop() });
    mask.remove();
  };
  mask.querySelector('#pl-load-source').onclick = async () => {
    const src = mask.querySelector('#pl-source').value.trim();
    if (!src) return;
    await loadPluginFromBlob(src, 'custom-' + Date.now());
    mask.remove();
  };
  mask.querySelectorAll('[data-pl-builtin]').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.plBuiltin;
      const b  = builtin.find(x => x.id === id);
      if (!b) return;
      await loadPluginFromBlob(b.source, b.name);
      mask.remove();
    };
  });
}
