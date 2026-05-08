/**
 * 悬浮 / 交互微效果（8 种）
 */
import { register } from './registry.js';

register({ id: 'hover-lift', name: 'Lift 悬浮抬升', category: '悬浮', preview: `<div class="fx-hover-lift" style="width:80px;height:48px;background:#07c160;border-radius:6px;"></div>`,
  css: `.fx-hover-lift { transition: transform .2s ease, box-shadow .2s ease; } .fx-hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.12); }` });

register({ id: 'hover-glow', name: 'Glow 发光', category: '悬浮', preview: `<div class="fx-hover-glow" style="width:80px;height:48px;background:#10aeff;border-radius:6px;"></div>`,
  css: `.fx-hover-glow { transition: box-shadow .2s ease; } .fx-hover-glow:hover { box-shadow: 0 0 0 4px rgba(16,174,255,.3); }` });

register({ id: 'hover-tilt', name: 'Tilt 倾斜', category: '悬浮', preview: `<div class="fx-hover-tilt" style="width:80px;height:48px;background:#6467f0;border-radius:6px;"></div>`,
  css: `.fx-hover-tilt { transition: transform .3s ease; } .fx-hover-tilt:hover { transform: perspective(400px) rotateX(8deg) rotateY(-8deg); }` });

register({ id: 'hover-scale', name: 'Scale 放大', category: '悬浮', preview: `<div class="fx-hover-scale" style="width:80px;height:48px;background:#fa9d3b;border-radius:6px;"></div>`,
  css: `.fx-hover-scale { transition: transform .2s ease; } .fx-hover-scale:hover { transform: scale(1.05); }` });

register({ id: 'hover-brighten', name: 'Brighten 变亮', category: '悬浮', preview: `<div class="fx-hover-brighten" style="width:80px;height:48px;background:#91d300;border-radius:6px;"></div>`,
  css: `.fx-hover-brighten { transition: filter .2s; } .fx-hover-brighten:hover { filter: brightness(1.1); }` });

register({ id: 'press-down', name: 'Press Down 按压', category: '手势', preview: `<div class="fx-press-down" style="width:80px;height:48px;background:#fa5151;border-radius:6px;"></div>`,
  css: `.fx-press-down { transition: transform .1s ease, opacity .1s; } .fx-press-down:active { transform: scale(.96); opacity:.85; }` });

register({ id: 'ripple', name: 'Ripple 涟漪', category: '手势', preview: `<button class="fx-ripple" style="width:80px;height:48px;background:#07c160;border-radius:6px;border:0;color:#fff;position:relative;overflow:hidden;">Btn</button>`,
  css: `.fx-ripple { position: relative; overflow: hidden; } .fx-ripple::after { content:''; position: absolute; inset: 0; background: radial-gradient(circle, rgba(255,255,255,.4) 0%, transparent 40%); opacity: 0; transform: scale(0); transition: transform .5s, opacity .5s; } .fx-ripple:active::after { opacity:1; transform: scale(2); transition: 0s; }` });

register({ id: 'shake', name: 'Shake 抖动（错误）', category: '手势', preview: `<div class="fx-shake" style="width:80px;height:48px;background:#fa5151;border-radius:6px;"></div>`,
  css: `@keyframes fx-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } } .fx-shake { animation: fx-shake .3s ease; }` });
