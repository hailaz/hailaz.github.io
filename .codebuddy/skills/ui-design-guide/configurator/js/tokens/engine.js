/**
 * 主题 tokens 引擎 + Vibe（最小版，复用旧逻辑）
 */
import { state, bus, setStatus } from '../core/state.js';

const ASSETS = '../assets';
export const PRESET_NAMES = ['weui-light','weui-dark','default-light','default-dark','apple-style','material-style','minimal','cyberpunk'];

export function tokensToCssVars(tokens) {
  if (!tokens) return {};
  const map = {};
  for (const grp of ['primary','neutral']) {
    for (const [s, v] of Object.entries(tokens.color?.[grp] || {})) map[`--color-${grp}-${s}`] = v;
  }
  for (const [name, scale] of Object.entries(tokens.color?.semantic || {})) {
    for (const [s, v] of Object.entries(scale)) map[`--color-${name}-${s}`] = v;
  }
  for (const [k, v] of Object.entries(tokens.typography?.fontFamily || {})) map[`--font-${k}`] = v;
  for (const [k, v] of Object.entries(tokens.typography?.fontSize   || {})) map[`--font-size-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(tokens.typography?.fontWeight || {})) map[`--weight-${k}`] = String(v);
  for (const [k, v] of Object.entries(tokens.spacing || {})) map[`--space-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(tokens.radius  || {})) map[`--radius-${k}`] = typeof v === 'number' ? `${v}px` : v;
  for (const [k, v] of Object.entries(tokens.shadow  || {})) map[`--shadow-${k}`] = v;
  for (const [k, v] of Object.entries(tokens.motion?.duration || {})) map[`--dur-${k}`] = `${v}ms`;
  // WeUI 派生
  map['--weui-brand'] = tokens.color?.primary?.[500] || '#07c160';
  map['--weui-link']  = '#576b95';
  map['--weui-red']   = tokens.color?.semantic?.danger?.[500] || '#fa5151';
  map['--weui-orange']= '#fa9d3b';
  map['--weui-indigo']= '#1485ee';
  return map;
}

let _rafId = null;
export function applyTokensToPreview() {
  if (_rafId) return;
  _rafId = requestAnimationFrame(() => {
    _rafId = null;
    _applyTokensImmediate();
  });
}

function _applyTokensImmediate() {
  const root = document.getElementById('preview-root');
  if (!root || !state.project?.tokens) return;
  const map = tokensToCssVars(state.project.tokens);
  for (const [k, v] of Object.entries(map)) root.style.setProperty(k, v);
  root.dataset.theme = state.preview.themeMode;
  const mode = state.preview.themeMode;
  const overrides = state.project.tokens.color?.modeOverrides?.[mode];
  if (overrides) {
    for (const [grp, scale] of Object.entries(overrides)) {
      for (const [s, v] of Object.entries(scale)) root.style.setProperty(`--color-${grp}-${s}`, v);
    }
  }
}

export async function loadPreset(name) {
  try {
    const res = await fetch(`${ASSETS}/themes/${name}.json`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const tokens = await res.json();
    if (state.project) state.project.tokens = tokens;
    applyTokensToPreview();
    bus.emit('tokens:changed');
    setStatus(`已加载预设: ${name}`, 'ok');
    return tokens;
  } catch (err) {
    setStatus(`⚠ 无法 fetch (${err.message})，请用本地静态服务启动`, 'warn');
  }
}

export async function loadVibeTags() {
  try {
    const res = await fetch(`${ASSETS}/vibe-tags.json`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    state.vibeTags = await res.json();
    renderVibe();
  } catch {}
}

function renderVibe() {
  const grid = document.getElementById('vibe-tags');
  if (!grid || !state.vibeTags) return;
  grid.innerHTML = Object.entries(state.vibeTags.tags).map(([k, v]) => `
    <button class="vibe-chip" data-tag="${k}" type="button">
      <strong>${v.label} · ${k}</strong>
      <span>${(v.synonyms || []).slice(0,3).join(' / ')}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.vibe-chip').forEach(b =>
    b.addEventListener('click', () => applyVibe([b.dataset.tag]))
  );
}

export function applyVibe(tags) {
  if (!state.project?.tokens || !state.vibeTags) return;
  const hints = [];
  const tokens = state.project.tokens;
  for (const tag of tags) {
    const def = state.vibeTags.tags[tag];
    if (!def) continue;
    hints.push(`✨ ${tag}: ${def.notes}`);
    const rv = state.vibeTags.radiusPresets?.[def.radius];
    if (rv != null) { tokens.radius.md = rv; tokens.radius.lg = rv*1.5|0; tokens.radius.xl = rv*2|0; }
    const sv = state.vibeTags.shadowPresets?.[def.shadow];
    if (sv != null) { tokens.shadow.sm = sv; tokens.shadow.md = sv; }
    const dv = state.vibeTags.durationPresets?.[def.duration];
    if (dv != null) tokens.motion.duration.base = dv;
    if (def.hue && Array.isArray(def.hue)) {
      const h = (def.hue[0] + def.hue[1]) / 2;
      const hex = hslToHex(h, 0.7, 0.55);
      tokens.color.primary = buildScale(hex);
    }
    if (!tokens.meta.vibeTags) tokens.meta.vibeTags = [];
    if (!tokens.meta.vibeTags.includes(tag)) tokens.meta.vibeTags.push(tag);
  }
  const hint = document.getElementById('vibe-hint');
  if (hint) hint.textContent = hints.join('\n');
  applyTokensToPreview();
  bus.emit('tokens:changed');
  bus.emit('project:changed');
}

function hslToHex(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function hexToHsl(hex) {
  const m = hex.replace('#','').match(/.{2}/g);
  const [r,g,b] = m.map(x => parseInt(x,16)/255);
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0, l = (max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > .5 ? d/(2-max-min) : d/(max+min);
    switch(max) { case r: h = ((g-b)/d + (g<b?6:0)); break; case g: h = (b-r)/d + 2; break; case b: h = (r-g)/d + 4; }
    h *= 60;
  }
  return [h, s, l];
}
function buildScale(hex) {
  const [h, s] = hexToHsl(hex);
  const ls = {50:.96,100:.92,200:.85,300:.75,400:.65,500:.55,600:.45,700:.35,800:.25,900:.15};
  const out = {};
  for (const [k, l] of Object.entries(ls)) out[k] = hslToHex(h, s, l);
  return out;
}
