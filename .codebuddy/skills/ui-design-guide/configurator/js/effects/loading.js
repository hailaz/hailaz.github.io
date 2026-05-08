/**
 * 加载效果（8 种）
 */
import { register } from './registry.js';

register({ id: 'spin', name: 'Spin 旋转', category: '加载', preview: `<span class="fx-spin" style="display:inline-block;width:24px;height:24px;border:3px solid #ddd;border-top-color:#07c160;border-radius:50%;"></span>`,
  css: `@keyframes fx-spin { to { transform: rotate(360deg); } } .fx-spin { animation: fx-spin .8s linear infinite; }` });

register({ id: 'pulse', name: 'Pulse 脉冲', category: '加载', preview: `<span class="fx-pulse" style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#07c160;"></span>`,
  css: `@keyframes fx-pulse { 0%, 100% { transform: scale(.9); opacity:.7; } 50% { transform: scale(1.2); opacity:1; } } .fx-pulse { animation: fx-pulse 1.4s ease infinite; }` });

register({ id: 'shimmer', name: 'Shimmer 流光', category: '加载', preview: `<span class="fx-shimmer" style="display:inline-block;width:80px;height:12px;background:#ededed;border-radius:3px;"></span>`,
  css: `@keyframes fx-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } } .fx-shimmer { background: linear-gradient(90deg, var(--weui-bg-0,#ededed) 25%, rgba(0,0,0,.04) 37%, var(--weui-bg-0,#ededed) 63%) !important; background-size: 200% 100% !important; animation: fx-shimmer 1.4s linear infinite; }` });

register({ id: 'bounce', name: 'Bounce 跳动', category: '加载', preview: `<span class="fx-bounce" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#07c160;"></span>`,
  css: `@keyframes fx-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } } .fx-bounce { animation: fx-bounce .8s ease infinite; }` });

register({ id: 'wave', name: 'Wave 波纹', category: '加载', preview: `<span class="fx-wave" style="display:inline-block;width:40px;height:40px;border-radius:50%;border:2px solid #07c160;"></span>`,
  css: `@keyframes fx-wave { 0% { box-shadow: 0 0 0 0 rgba(7,193,96,.4); } 100% { box-shadow: 0 0 0 20px rgba(7,193,96,0); } } .fx-wave { animation: fx-wave 1.6s ease-out infinite; }` });

register({ id: 'bars', name: 'Bars 条形', category: '加载', preview: `<span class="fx-bars" style="display:inline-flex;gap:3px;align-items:flex-end;height:24px;"><span style="width:4px;height:100%;background:#07c160;border-radius:2px;"></span><span style="width:4px;height:60%;background:#07c160;border-radius:2px;"></span><span style="width:4px;height:100%;background:#07c160;border-radius:2px;"></span></span>`,
  css: `@keyframes fx-bar { 0%,100% { transform: scaleY(.4); } 50% { transform: scaleY(1); } } .fx-bars > span { animation: fx-bar 1.2s ease infinite; transform-origin: bottom; } .fx-bars > span:nth-child(2) { animation-delay: .2s; } .fx-bars > span:nth-child(3) { animation-delay: .4s; }` });

register({ id: 'dots3', name: 'Dots3 三点', category: '加载', preview: `<span class="fx-dots3" style="display:inline-flex;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#07c160;"></span><span style="width:8px;height:8px;border-radius:50%;background:#07c160;"></span><span style="width:8px;height:8px;border-radius:50%;background:#07c160;"></span></span>`,
  css: `@keyframes fx-d3 { 0%,100% { opacity:.3; transform:scale(.8); } 50% { opacity:1; transform:scale(1); } } .fx-dots3 > span { animation: fx-d3 1.2s ease infinite; } .fx-dots3 > span:nth-child(2) { animation-delay:.2s; } .fx-dots3 > span:nth-child(3) { animation-delay:.4s; }` });

register({ id: 'breath', name: 'Breath 呼吸', category: '加载', preview: `<span class="fx-breath" style="display:inline-block;width:48px;height:48px;background:#07c160;border-radius:50%;"></span>`,
  css: `@keyframes fx-breath { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.08); opacity:.85; } } .fx-breath { animation: fx-breath 2.4s ease-in-out infinite; }` });
