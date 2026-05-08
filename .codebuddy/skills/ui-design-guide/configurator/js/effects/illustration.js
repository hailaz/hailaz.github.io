/**
 * 插画效果（8 张 SVG）—— 用作 empty / error / success 场景
 */
import { register } from './registry.js';

const base = (svg) => `<div style="display:flex;justify-content:center;">${svg}</div>`;

register({ id: 'illu-empty-list', name: '空列表', category: '插画', preview: base(`<svg width="80" height="80" viewBox="0 0 120 120" fill="none"><rect x="24" y="30" width="72" height="70" rx="6" stroke="#ccc" stroke-width="2"/><path d="M36 48h48M36 62h48M36 76h32" stroke="#ddd" stroke-width="2"/></svg>`), css: '' });
register({ id: 'illu-empty-search', name: '空搜索', category: '插画', preview: base(`<svg width="80" height="80" viewBox="0 0 120 120" fill="none"><circle cx="48" cy="48" r="24" stroke="#ccc" stroke-width="3"/><path d="M68 68l16 16" stroke="#ccc" stroke-width="3" stroke-linecap="round"/><path d="M40 48h16" stroke="#ddd" stroke-width="2"/></svg>`), css: '' });
register({ id: 'illu-empty-cart', name: '空购物车', category: '插画', preview: base(`<svg width="80" height="80" viewBox="0 0 120 120" fill="none"><path d="M24 32h12l6 52h48l8-40H42" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="94" r="6" fill="#ccc"/><circle cx="84" cy="94" r="6" fill="#ccc"/></svg>`), css: '' });
register({ id: 'illu-error-404', name: '404', category: '插画', preview: base(`<svg width="80" height="80" viewBox="0 0 120 120"><text x="60" y="70" text-anchor="middle" font-size="40" font-weight="700" fill="#fa5151">404</text></svg>`), css: '' });
register({ id: 'illu-error-network', name: '网络异常', category: '插画', preview: base(`<svg width="80" height="80" viewBox="0 0 120 120" fill="none"><path d="M60 92v-8M40 80a28 28 0 0140-40M80 80a28 28 0 00-40-40" stroke="#fa5151" stroke-width="3" stroke-linecap="round"/><path d="M20 20l80 80" stroke="#fa5151" stroke-width="3" stroke-linecap="round"/></svg>`), css: '' });
register({ id: 'illu-success', name: '成功', category: '插画', preview: base(`<svg width="80" height="80" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="48" stroke="#07c160" stroke-width="3"/><path d="M40 62l14 14 26-28" stroke="#07c160" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`), css: '' });
register({ id: 'illu-maintenance', name: '维护中', category: '插画', preview: base(`<svg width="80" height="80" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="16" stroke="#fa9d3b" stroke-width="3"/><path d="M60 20v14M60 86v14M20 60h14M86 60h14M31 31l10 10M79 79l10 10M89 31l-10 10M41 79l-10 10" stroke="#fa9d3b" stroke-width="3" stroke-linecap="round"/></svg>`), css: '' });
register({ id: 'illu-developing', name: '开发中', category: '插画', preview: base(`<svg width="80" height="80" viewBox="0 0 120 120" fill="none"><rect x="20" y="32" width="80" height="56" rx="4" stroke="#10aeff" stroke-width="3"/><path d="M44 52l-8 10 8 10M76 52l8 10-8 10M56 76l8-28" stroke="#10aeff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`), css: '' });
