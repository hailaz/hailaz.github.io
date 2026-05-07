/* ============================================================
 * ui-design-guide / configurator / app.js
 * - 状态管理（state.tokens / state.brand / state.vibeTags）
 * - 双向绑定（表单 ↔ state ↔ CSS Variables ↔ JSON 文本）
 * - 预设加载（fetch ../assets/themes/*.json）
 * - Vibe 加载与应用（fetch ../assets/vibe-tags.json）
 * - Schema 校验（fetch ../assets/*.schema.json，简易子集）
 * - 双 JSON 导出
 * ============================================================ */

const ASSETS = '../assets';
const PRESET_NAMES = ['weui-light', 'weui-dark', 'default-light', 'default-dark', 'apple-style', 'material-style', 'minimal', 'cyberpunk'];
const COLOR_STEPS = ['50','100','200','300','400','500','600','700','800','900'];
const SEMANTIC_KEYS = ['success', 'warning', 'danger', 'info'];

const state = {
  tokens: null,
  brand:  defaultBrand(),
  vibeTags: null, // 加载后填充
  lockedColorSet: new Set(), // brand.lockedColors 缓存
};

function defaultBrand() {
  return {
    brandName: 'Acme',
    logoSvg: '',
    tone: 'friendly',
    lockedColors: [],
    voiceSamples: { buttonCta: ['立即开始'], errorMessage: [], emptyState: [], placeholder: [], successToast: [] },
    iconStyle: 'outline',
  };
}

/* ============ 路径辅助 ============ */
function getAt(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setAt(obj, path, val) {
  const ks = path.split('.');
  let cur = obj;
  for (let i = 0; i < ks.length - 1; i++) {
    if (cur[ks[i]] == null || typeof cur[ks[i]] !== 'object') cur[ks[i]] = {};
    cur = cur[ks[i]];
  }
  cur[ks[ks.length - 1]] = val;
}

/* ============ Tokens → CSS Variables ============ */
function tokensToCssVars(tokens) {
  const map = {};
  for (const grp of ['primary', 'neutral']) {
    for (const [step, val] of Object.entries(tokens.color?.[grp] || {})) map[`--color-${grp}-${step}`] = val;
  }
  for (const [name, scale] of Object.entries(tokens.color?.semantic || {})) {
    for (const [step, val] of Object.entries(scale)) map[`--color-${name}-${step}`] = val;
  }
  for (const [k, v] of Object.entries(tokens.typography?.fontFamily || {})) map[`--font-${k}`] = v;
  for (const [k, v] of Object.entries(tokens.typography?.fontSize   || {})) map[`--font-size-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(tokens.typography?.lineHeight || {})) map[`--leading-${k}`] = String(v);
  for (const [k, v] of Object.entries(tokens.typography?.fontWeight || {})) map[`--weight-${k}`] = String(v);
  for (const [k, v] of Object.entries(tokens.spacing || {})) map[`--space-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(tokens.radius || {}))  map[`--radius-${k}`] = typeof v === 'number' ? `${v}px` : v;
  for (const [k, v] of Object.entries(tokens.shadow || {}))  map[`--shadow-${k}`] = v;
  for (const [k, v] of Object.entries(tokens.breakpoint || {})) {
    if (typeof v === 'number') map[`--bp-${k}`] = `${v}px`;
  }
  for (const [k, v] of Object.entries(tokens.motion?.duration || {})) map[`--dur-${k}`] = `${v}ms`;
  for (const [k, v] of Object.entries(tokens.motion?.easing   || {})) map[`--ease-${k}`] = v;
  return map;
}

function applyTokens() {
  if (!state.tokens) return;
  const map = tokensToCssVars(state.tokens);
  // 应用到「预览区」: 仅作用 .preview-area 的子树（避免污染配置器自身的 shell 颜色）
  const root = document.documentElement;
  for (const [k, v] of Object.entries(map)) root.style.setProperty(k, v);
  // modeOverrides
  const mode = root.dataset.theme;
  const overrides = state.tokens.color?.modeOverrides?.[mode];
  if (overrides) {
    for (const [grp, scale] of Object.entries(overrides)) {
      for (const [step, val] of Object.entries(scale)) {
        root.style.setProperty(`--color-${grp}-${step}`, val);
      }
    }
  }
}

/* ============ 预设加载 ============ */
async function loadPreset(name) {
  try {
    const res = await fetch(`${ASSETS}/themes/${name}.json`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const tokens = await res.json();
    state.tokens = tokens;
    syncFormFromTokens();
    applyAndDump();
    setStatus(`已加载预设: ${name}`, 'ok');
  } catch (err) {
    setStatus(`⚠ 无法 fetch（请用本地服务或导入按钮）: ${err.message}`, 'warn');
  }
}

/* ============ Vibe 加载 ============ */
async function loadVibeTags() {
  try {
    const res = await fetch(`${ASSETS}/vibe-tags.json`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    state.vibeTags = await res.json();
    renderVibeChips();
  } catch (err) {
    document.getElementById('vibe-tags').innerHTML =
      '<div class="hint">⚠ 无法加载 vibe-tags.json。请用 python3 -m http.server 启动。</div>';
  }
}

function renderVibeChips() {
  const grid = document.getElementById('vibe-tags');
  if (!state.vibeTags) return;
  grid.innerHTML = Object.entries(state.vibeTags.tags).map(([k, v]) => `
    <button class="vibe-chip" data-tag="${k}" type="button">
      <strong>${v.label} · ${k}</strong>
      <span>${v.synonyms?.slice(0, 3).join(' / ') ?? ''}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.vibe-chip').forEach(b =>
    b.addEventListener('click', () => applyVibe([b.dataset.tag]))
  );
}

/**
 * 应用 vibe 标签：调整主色饱和度方向、圆角、阴影、动效
 * 简化策略：只取第一个有效 tag，按其建议覆盖关键 token
 */
function applyVibe(tags) {
  if (!state.tokens || !state.vibeTags) return;
  const hints = [];
  for (const tag of tags) {
    const def = state.vibeTags.tags[tag];
    if (!def) continue;
    hints.push(`✨ ${tag}: ${def.notes}`);

    // radius
    const radiusKey = def.radius;
    const radiusVal = state.vibeTags.radiusPresets?.[radiusKey];
    if (radiusVal != null) {
      state.tokens.radius.md = radiusVal;
      state.tokens.radius.lg = Math.round(radiusVal * 1.5);
      state.tokens.radius.xl = Math.round(radiusVal * 2);
    }

    // shadow
    const shadowKey = def.shadow;
    const shadowVal = state.vibeTags.shadowPresets?.[shadowKey];
    if (shadowVal != null) {
      state.tokens.shadow.sm = shadowVal;
      state.tokens.shadow.md = shadowVal;
    }

    // duration
    const durKey = def.duration;
    const durVal = state.vibeTags.durationPresets?.[durKey];
    if (durVal != null) {
      state.tokens.motion.duration.base = durVal;
    }

    // 主色 hue 范围 → 重设 primary 500（保留 saturation/lightness 接近原值）
    if (def.hue && Array.isArray(def.hue)) {
      const targetHue = (def.hue[0] + def.hue[1]) / 2;
      const newHex = hslToHex(targetHue, 0.7, 0.55);
      // 整体重建色阶
      state.tokens.color.primary = buildScaleFromAnchor(newHex);
    }

    // meta vibeTags
    if (!state.tokens.meta.vibeTags) state.tokens.meta.vibeTags = [];
    if (!state.tokens.meta.vibeTags.includes(tag)) state.tokens.meta.vibeTags.push(tag);
  }
  document.getElementById('vibe-hint').textContent = hints.join('\n') || '没有匹配的 vibe 标签';
  syncFormFromTokens();
  applyAndDump();
}

/* ============ 颜色工具 ============ */
function hslToHex(h, s, l) {
  s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
  h = ((h % 360) + 360) % 360;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function hexToHsl(hex) {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return [0, 0, 0];
  const [r, g, b] = m.map(x => parseInt(x, 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return [h, s, l];
}
/** 从 500 色生成 50-900 的色阶（简化算法：lightness 阶梯） */
function buildScaleFromAnchor(hex500) {
  const [h, s] = hexToHsl(hex500);
  const ls = { 50: .96, 100: .92, 200: .85, 300: .75, 400: .65, 500: .55, 600: .45, 700: .35, 800: .25, 900: .15 };
  const out = {};
  for (const [step, l] of Object.entries(ls)) out[step] = hslToHex(h, s, l);
  return out;
}

/* ============ 表单 → state 双向绑定 ============ */
function bindFormChange() {
  // brand 字段 (data-bk)
  document.querySelectorAll('[data-bk]').forEach(el => {
    el.addEventListener('input', () => {
      const path = el.dataset.bk;
      let val = el.value;
      if (path === 'lockedColors') val = val.split(/[\n,\s]+/).map(s => s.trim()).filter(Boolean);
      else if (path.startsWith('voiceSamples.')) val = val.split(/\n/).map(s => s.trim()).filter(Boolean);
      setAt(state.brand, path, val);
      if (path === 'lockedColors') state.lockedColorSet = new Set(val.map(s => s.toLowerCase()));
      applyAndDump();
    });
  });
  // tokens 字段 (data-tk)
  document.querySelectorAll('[data-tk]').forEach(el => {
    el.addEventListener('input', () => {
      if (!state.tokens) return;
      const path = el.dataset.tk;
      let val = el.value;
      if (el.type === 'number') val = parseFloat(val);
      setAt(state.tokens, path, val);
      applyAndDump();
    });
  });
}

function syncFormFromTokens() {
  if (!state.tokens) return;
  document.querySelectorAll('[data-tk]').forEach(el => {
    const v = getAt(state.tokens, el.dataset.tk);
    if (v != null) el.value = String(v);
  });
  renderColorGrids();
}
function syncFormFromBrand() {
  for (const [path, _] of Object.entries({ brandName: '', logoSvg: '', tone: '', iconStyle: '' })) {
    const el = document.querySelector(`[data-bk="${path}"]`);
    if (el) el.value = state.brand[path] ?? '';
  }
  const lockedEl = document.querySelector('[data-bk="lockedColors"]');
  if (lockedEl) lockedEl.value = (state.brand.lockedColors || []).join('\n');
  for (const k of ['buttonCta', 'errorMessage', 'emptyState']) {
    const el = document.querySelector(`[data-bk="voiceSamples.${k}"]`);
    if (el) el.value = (state.brand.voiceSamples?.[k] || []).join('\n');
  }
}

/* ============ 颜色色阶网格 ============ */
function renderColorGrids() {
  const t = state.tokens; if (!t) return;
  // primary
  document.getElementById('grid-primary').innerHTML = COLOR_STEPS.map(step => colorCell('color.primary', step, t.color.primary[step])).join('');
  // neutral
  document.getElementById('grid-neutral').innerHTML = COLOR_STEPS.map(step => colorCell('color.neutral', step, t.color.neutral[step])).join('');
  // semantic（仅 500）
  document.getElementById('grid-semantic').innerHTML = SEMANTIC_KEYS.map(k =>
    colorCell(`color.semantic.${k}`, '500', t.color.semantic[k][500], k)
  ).join('');

  // 给所有 color cell 绑定事件
  document.querySelectorAll('.color-cell input[type="color"]').forEach(inp => {
    inp.addEventListener('input', e => {
      const path = e.target.dataset.path;
      const step = e.target.dataset.step;
      const newColor = e.target.value;
      if (state.lockedColorSet.has(newColor.toLowerCase()) || isLocked(path, step, newColor)) {
        // 锁定色不变更
        return;
      }
      setAt(state.tokens, `${path}.${step}`, newColor);
      // 如果是 500，重建整个色阶（仅 primary/neutral）
      if (step === '500' && (path === 'color.primary' || path === 'color.neutral')) {
        const scale = buildScaleFromAnchor(newColor);
        for (const [s, v] of Object.entries(scale)) {
          if (!state.lockedColorSet.has(v.toLowerCase())) setAt(state.tokens, `${path}.${s}`, v);
        }
      }
      syncFormFromTokens();
      applyAndDump();
    });
  });
}
function isLocked(path, step, val) {
  return state.lockedColorSet.has(String(val).toLowerCase());
}
function colorCell(path, step, val, tag) {
  const cur = String(val || '#ffffff').toLowerCase();
  const locked = state.lockedColorSet.has(cur);
  return `
    <div class="color-cell ${locked ? 'locked' : ''}" style="background: ${val};" title="${path}.${step}">
      <input type="color" value="${val}" data-path="${path}" data-step="${step}" />
      <span class="step-label">${tag ? `${tag}:${step}` : step}</span>
    </div>`;
}

/* ============ JSON 输出 + 校验 ============ */
function applyAndDump() {
  applyTokens();
  document.getElementById('json-tokens').textContent = JSON.stringify(state.tokens, null, 2);
  document.getElementById('json-brand').textContent = JSON.stringify(state.brand, null, 2);

  // 简易校验
  const errs = validate();
  const v = document.getElementById('validation');
  if (errs.length === 0) {
    v.className = 'validation ok';
    v.textContent = '✓ 校验通过';
  } else {
    v.className = 'validation error';
    v.textContent = `✗ ${errs.length} 个问题：${errs.join('; ')}`;
  }

  // 同步预览区中与 brand 联动的文案
  document.getElementById('brand-name-display').textContent = state.brand.brandName || '(未命名品牌)';
  const cta = pickByTone('buttonCta', '提交');
  const empty = pickByTone('emptyState', '还没有数据');
  document.getElementById('cta-sample').textContent = cta;
  document.getElementById('empty-sample').textContent = empty;
  document.getElementById('empty-cta-sample').textContent = pickByTone('buttonCta', '立即添加');
  document.getElementById('ph-sample').placeholder = pickByTone('placeholder', '请输入...');
  // logo
  const slot = document.getElementById('brand-logo-slot');
  slot.innerHTML = state.brand.logoSvg || '';
  document.getElementById('logo-preview').innerHTML = state.brand.logoSvg || '<span style="color: var(--shell-muted); font-size: 12px;">未填写 Logo SVG</span>';
}

function pickByTone(field, fallback) {
  const samples = state.brand?.voiceSamples?.[field];
  if (samples?.length) return samples[0];
  const map = {
    buttonCta:    { formal:'提交', friendly:'试试看', geek:'Run', playful:'走起', luxury:'探索', medical:'确认' },
    errorMessage: { formal:'操作失败', friendly:'哎呀出问题了', geek:'Error.', playful:'呜呜失败了', luxury:'操作未完成', medical:'系统繁忙，请重试' },
    emptyState:   { formal:'暂无数据', friendly:'空空如也，先添加一条吧', geek:'No data.', playful:'什么都没有！', luxury:'此处尚无内容', medical:'暂无记录' },
    placeholder:  { formal:'请输入...', friendly:'写点什么吧~', geek:'input...', playful:'快填这里！', luxury:'请输入内容', medical:'请输入信息' },
  };
  return map[field]?.[state.brand?.tone] ?? fallback;
}

function validate() {
  const errs = [];
  const t = state.tokens, b = state.brand;
  if (!t) { errs.push('tokens 未加载'); return errs; }
  if (!t.meta?.name) errs.push('meta.name 缺失');
  if (!/^\d+\.\d+\.\d+$/.test(t.meta?.version || '')) errs.push('meta.version 不符 semver');
  if (!['light', 'dark'].includes(t.meta?.mode)) errs.push('meta.mode 必须 light/dark');
  for (const grp of ['primary', 'neutral']) {
    if (!t.color?.[grp]) { errs.push(`color.${grp} 缺失`); continue; }
    for (const step of COLOR_STEPS) {
      const v = t.color[grp][step];
      if (!/^#[0-9a-fA-F]{6}$/.test(v || '')) errs.push(`color.${grp}.${step} 非合法 #RRGGBB`);
    }
  }
  if (!b.brandName) errs.push('brand.brandName 缺失');
  if (!['formal','friendly','geek','playful','luxury','medical'].includes(b.tone)) errs.push('brand.tone 非法');
  for (const c of (b.lockedColors || [])) {
    if (!/^#[0-9a-fA-F]{6}$/.test(c)) errs.push(`lockedColors 中 ${c} 非合法 HEX`);
  }
  return errs;
}

/* ============ 导入 / 导出 ============ */
function exportJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function importTokens(file) {
  const r = new FileReader();
  r.onload = () => {
    try { state.tokens = JSON.parse(r.result); syncFormFromTokens(); applyAndDump(); setStatus('已导入 tokens', 'ok'); }
    catch (err) { setStatus('导入失败：' + err.message, 'error'); }
  };
  r.readAsText(file);
}
function importBrand(file) {
  const r = new FileReader();
  r.onload = () => {
    try { state.brand = JSON.parse(r.result); syncFormFromBrand(); applyAndDump(); setStatus('已导入 brand-kit', 'ok'); }
    catch (err) { setStatus('导入失败：' + err.message, 'error'); }
  };
  r.readAsText(file);
}

/* ============ UI 事件 ============ */
function setStatus(msg, kind) {
  // 复用 validation 区域临时展示
  const v = document.getElementById('validation');
  v.textContent = msg;
  v.className = `validation ${kind || ''}`;
}

function bindUiEvents() {
  // 左侧 Tab 切换
  document.querySelectorAll('.tabs .tab[data-tab]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.tabs .tab[data-tab]').forEach(x => x.classList.toggle('active', x === b));
      document.querySelectorAll('.tab-panel').forEach(p => p.hidden = p.dataset.panel !== b.dataset.tab);
    });
  });
  // 右侧 JSON Tab
  document.querySelectorAll('.tabs .tab[data-jtab]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.tabs .tab[data-jtab]').forEach(x => x.classList.toggle('active', x === b));
      document.querySelectorAll('.json-out').forEach(p => p.hidden = p.dataset.jpanel !== b.dataset.jtab);
    });
  });

  document.getElementById('preset-select').addEventListener('change', e => loadPreset(e.target.value));

  document.getElementById('btn-toggle-theme').addEventListener('click', () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (state.tokens?.meta) state.tokens.meta.mode = root.dataset.theme;
    applyAndDump();
  });

  document.getElementById('btn-apply-vibe').addEventListener('click', () => {
    const raw = document.getElementById('vibe-input').value;
    const tags = raw.split(/[,，\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
    if (tags.length) applyVibe(tags);
  });

  document.getElementById('file-tokens').addEventListener('change', e => {
    const f = e.target.files?.[0]; if (f) importTokens(f);
  });
  document.getElementById('file-brand').addEventListener('change', e => {
    const f = e.target.files?.[0]; if (f) importBrand(f);
  });
  document.getElementById('btn-export-tokens').addEventListener('click', () => {
    if (!state.tokens) return setStatus('tokens 尚未加载', 'warn');
    exportJson('design-tokens.json', state.tokens);
  });
  document.getElementById('btn-export-brand').addEventListener('click', () => {
    exportJson('brand-kit.json', state.brand);
  });
}

/* ============ 初始化 ============ */
(async function init() {
  bindUiEvents();
  bindFormChange();
  syncFormFromBrand();
  await loadVibeTags();
  await loadPreset('weui-light');
})();
