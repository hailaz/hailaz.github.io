/**
 * 过渡 / 入场动画（8 种）
 */
import { register } from './registry.js';

register({ id: 'fade-in',  name: 'Fade In 渐入',  category: '过渡', preview: `<div class="fx-fade-in" style="width:60px;height:40px;background:#07c160;border-radius:6px;"></div>`,
  css: `@keyframes fx-fade-in { from { opacity: 0; } to { opacity: 1; } } .fx-fade-in { animation: fx-fade-in .4s ease both; }` });

register({ id: 'slide-up', name: 'Slide Up 上滑', category: '过渡', preview: `<div class="fx-slide-up" style="width:60px;height:40px;background:#10aeff;border-radius:6px;"></div>`,
  css: `@keyframes fx-slide-up { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } } .fx-slide-up { animation: fx-slide-up .4s cubic-bezier(.2,0,0,1) both; }` });

register({ id: 'slide-down', name: 'Slide Down 下滑', category: '过渡', preview: `<div class="fx-slide-down" style="width:60px;height:40px;background:#fa9d3b;border-radius:6px;"></div>`,
  css: `@keyframes fx-slide-down { from { opacity:0; transform: translateY(-20px); } to { opacity:1; transform: translateY(0); } } .fx-slide-down { animation: fx-slide-down .4s cubic-bezier(.2,0,0,1) both; }` });

register({ id: 'zoom-in', name: 'Zoom In 放大', category: '过渡', preview: `<div class="fx-zoom-in" style="width:60px;height:40px;background:#6467f0;border-radius:6px;"></div>`,
  css: `@keyframes fx-zoom-in { from { opacity:0; transform: scale(.85); } to { opacity:1; transform: scale(1); } } .fx-zoom-in { animation: fx-zoom-in .35s cubic-bezier(.2,0,0,1) both; }` });

register({ id: 'flip-in', name: 'Flip 翻转', category: '过渡', preview: `<div class="fx-flip-in" style="width:60px;height:40px;background:#fa5151;border-radius:6px;"></div>`,
  css: `@keyframes fx-flip-in { from { opacity:0; transform: perspective(400px) rotateX(-90deg); } to { opacity:1; transform: perspective(400px) rotateX(0); } } .fx-flip-in { animation: fx-flip-in .5s ease both; }` });

register({ id: 'bounce-in', name: 'Bounce In 弹跳', category: '过渡', preview: `<div class="fx-bounce-in" style="width:60px;height:40px;background:#ffc300;border-radius:6px;"></div>`,
  css: `@keyframes fx-bounce-in { 0% { opacity:0; transform: scale(.3); } 50% { opacity:1; transform: scale(1.05); } 70% { transform: scale(.97); } 100% { transform: scale(1); } } .fx-bounce-in { animation: fx-bounce-in .6s cubic-bezier(.3,1.4,.5,1) both; }` });

register({ id: 'rotate-in', name: 'Rotate In 旋入', category: '过渡', preview: `<div class="fx-rotate-in" style="width:60px;height:40px;background:#91d300;border-radius:6px;"></div>`,
  css: `@keyframes fx-rotate-in { from { opacity:0; transform: rotate(-180deg) scale(.5); } to { opacity:1; transform: rotate(0) scale(1); } } .fx-rotate-in { animation: fx-rotate-in .5s ease both; }` });

register({ id: 'blur-in', name: 'Blur In 虚化入', category: '过渡', preview: `<div class="fx-blur-in" style="width:60px;height:40px;background:#1485ee;border-radius:6px;"></div>`,
  css: `@keyframes fx-blur-in { from { opacity:0; filter: blur(8px); } to { opacity:1; filter: blur(0); } } .fx-blur-in { animation: fx-blur-in .5s ease both; }` });
