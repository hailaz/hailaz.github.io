/**
 * 代码生成器：把当前页面导出为 HTML / React / Vue3 / 微信小程序 代码
 *
 * 扩展机制：
 *   组件注册时可提供 `codegen: { html?, wxml?, react?, vue? }` 函数
 *   签名：(node, ctx) => string
 *     ctx: { childHtml, childWxml, childReact, childVue, indent, styleInline, styleJsx, styleVue }
 *   未提供则走 default rules（按类型），再降级为 <div>
 */
import { state, getActivePage } from '../core/state.js';
import { get as getComponent, renderNode } from '../components/registry.js';

/* ============ 公共样式串工具 ============ */
function styleObjToInline(style) {
  if (!style) return '';
  return Object.entries(style).map(([k,v]) => {
    const key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `${key}:${v}`;
  }).join(';');
}
function styleObjToJsx(style) {
  if (!style || !Object.keys(style).length) return '';
  return `{${Object.entries(style).map(([k,v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(',')}}`;
}
function escapeText(s) {
  return String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
function escapeJsx(s) {
  return String(s || '').replace(/[{}]/g, c => `{'${c}'}`);
}

/* ============ HTML ============ */
export function genHtml(page = getActivePage()) {
  if (!page) return '';
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeText(page.name)}</title>
<style>
${genCssVars()}
body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: var(--weui-bg-1); color: var(--weui-fg-0); }
.btn { display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:8px;font-size:14px;color:#fff;background:var(--weui-brand);border:0;cursor:pointer; }
.btn-secondary { background:transparent;color:var(--weui-brand);border:1px solid var(--weui-brand); }
.btn-danger { background:#fa5151; }
.cell { display:flex;align-items:center;padding:12px 16px;border-bottom:1px solid var(--weui-separator);background:var(--weui-bg-2); }
.tag { display:inline-block;padding:2px 8px;border-radius:3px;font-size:12px;background:rgba(7,193,96,.1);color:var(--weui-brand); }
</style>
</head>
<body>
${renderNode(page.root)}
</body>
</html>`;
}

/* ============ 微信小程序 WXML/WXSS/JS ============ */
export function genWxml(page = getActivePage()) {
  if (!page) return { wxml: '', wxss: '', js: '' };
  const wxml = nodeToWxml(page.root, 0);
  const wxss = `page {
${Object.entries(cssVarMap()).map(([k,v]) => `  ${k}: ${v};`).join('\n')}
}

.btn { display:flex;align-items:center;justify-content:center;height:96rpx;border-radius:16rpx;font-size:30rpx;color:#fff;background:var(--weui-brand); }
.btn-secondary { background:transparent;color:var(--weui-brand);border:2rpx solid var(--weui-brand); }
.btn-danger { background:#fa5151; }
.cell { display:flex;align-items:center;padding:24rpx 32rpx;border-bottom:2rpx solid var(--weui-separator);background:var(--weui-bg-2); }
.cell-title { flex:1;font-size:30rpx; }
.cell-desc { font-size:28rpx;color:var(--weui-fg-2); }
.tag { display:inline-block;padding:4rpx 16rpx;border-radius:6rpx;font-size:22rpx;background:rgba(7,193,96,.1);color:var(--weui-brand); }
.cell-group { background:var(--weui-bg-2); }
`;
  const js = `Page({
  data: ${JSON.stringify(collectPageData(page.root), null, 2)},
});`;
  return { wxml, wxss, js };
}

function nodeToWxml(node, depth) {
  const indent = '  '.repeat(depth);
  const def = getComponent(node.type);
  const p = node.props || {};
  const styleInline = styleObjToInline(node.style);
  const styleAttr = styleInline ? ` style="${styleInline}"` : '';

  // 1. 优先调用组件自带 codegen.wxml
  if (def?.codegen?.wxml) {
    const childWxml = (node.children || []).map(c => nodeToWxml(c, depth + 1)).join('\n');
    return indent + def.codegen.wxml(node, { childWxml, styleAttr, indent });
  }

  // 2. 内置类型规则
  const kidsStr = (node.children || []).map(c => nodeToWxml(c, depth + 1)).join('\n');
  const rules = {
    container:    () => `<view class="container"${styleAttr}>\n${kidsStr}\n${indent}</view>`,
    'mp-button':  () => `<button class="btn btn-${p.variant||'primary'}"${styleAttr} ${p.disabled?'disabled':''}>${escapeText(p.text||'')}</button>`,
    'mp-input':   () => `<view class="cell"${styleAttr}><text class="cell-title">${escapeText(p.label||'')}</text><input placeholder="${escapeText(p.placeholder||'')}" /></view>`,
    'mp-textarea':() => `<textarea placeholder="${escapeText(p.placeholder||'')}" maxlength="${p.maxlength||200}"${styleAttr} />`,
    'mp-switch':  () => `<view class="cell"${styleAttr}><text class="cell-title">${escapeText(p.label||'')}</text><switch checked="{{${!!p.checked}}}" /></view>`,
    'mp-cell':    () => `<view class="cell"${styleAttr}><view class="cell-title">${escapeText(p.title||'')}</view><view class="cell-desc">${escapeText(p.desc||'')}${p.arrow?' ›':''}</view></view>`,
    'mp-cell-group':() => `<view class="cell-group"${styleAttr}>${p.title?`\n${indent}  <view class="cell-group-title">${escapeText(p.title)}</view>`:''}\n${kidsStr}\n${indent}</view>`,
    'mp-title':   () => `<view class="title title-${p.level||2}"${styleAttr}>${escapeText(p.text||'')}</view>`,
    'mp-text':    () => `<text${styleAttr}>${escapeText(p.text||'')}</text>`,
    'mp-image':   () => `<image src="${p.src||''}" mode="${p.mode||'aspectFill'}" lazy-load="{{true}}" style="width:${(p.w||200)*2}rpx;height:${(p.h||200)*2}rpx;${styleInline}"/>`,
    'mp-searchbar':()=> `<view class="search-bar"${styleAttr}><input placeholder="${escapeText(p.placeholder||'搜索')}" /></view>`,
    'mp-tag':     () => `<text class="tag tag-${p.color||'green'}"${styleAttr}>${escapeText(p.text||'')}</text>`,
    'mp-badge':   () => `<text class="badge"${styleAttr}>${escapeText(p.text||p.count||'')}</text>`,
    'mp-spacer':  () => `<view style="height:${(p.height||16)*2}rpx;${styleInline}"></view>`,
    'mp-divider': () => `<view class="divider" style="height:2rpx;background:var(--weui-separator);margin:${(p.margin||8)*2}rpx 0;${styleInline}"></view>`,
    'mp-icon':    () => `<text class="icon"${styleAttr}>${escapeText(p.icon||'')}</text>`,
    'mp-avatar':  () => `<view class="avatar"${styleAttr}>${escapeText(p.name?.[0]||'')}</view>`,
    'mp-loading': () => `<view class="loading"${styleAttr}><text>加载中...</text></view>`,
    'mp-progress':() => `<progress percent="${p.percent||0}" stroke-width="6" activeColor="var(--weui-brand)"${styleAttr}/>`,
    'mp-slider':  () => `<slider value="${p.value||0}" min="${p.min||0}" max="${p.max||100}" activeColor="var(--weui-brand)" show-value${styleAttr}/>`,
    'mp-checkbox':() => `<checkbox checked="{{${!!p.checked}}}" color="var(--weui-brand)"${styleAttr}>${escapeText(p.label||'')}</checkbox>`,
    'mp-radio':   () => `<radio checked="{{${!!p.checked}}}" color="var(--weui-brand)"${styleAttr}>${escapeText(p.label||'')}</radio>`,
    'mp-link':    () => `<navigator url="${p.url||''}"${styleAttr}><text style="color:var(--weui-brand);">${escapeText(p.text||'')}</text></navigator>`,

    // 布局
    'mp-flex':    () => `<view class="flex" style="display:flex;flex-direction:${p.direction||'row'};gap:${(p.gap||0)*2}rpx;justify-content:${p.justify||'flex-start'};align-items:${p.align||'stretch'};${styleInline}">\n${kidsStr}\n${indent}</view>`,
    'mp-grid':    () => `<view class="grid" style="display:grid;grid-template-columns:repeat(${p.cols||2},1fr);gap:${(p.gap||0)*2}rpx;${styleInline}">\n${kidsStr}\n${indent}</view>`,
    'mp-space':   () => `<view style="display:flex;gap:${(p.size||8)*2}rpx;flex-direction:${p.vertical?'column':'row'};${styleInline}">\n${kidsStr}\n${indent}</view>`,
    'mp-section': () => `<view class="section"${styleAttr}>${p.title?`\n${indent}  <view class="section-title">${escapeText(p.title)}${p.more?`<text class="section-more">${escapeText(p.more)}</text>`:''}</view>`:''}\n${kidsStr}\n${indent}</view>`,
    'mp-container':()=> `<view class="container"${styleAttr}>\n${kidsStr}\n${indent}</view>`,
    'mp-safe-area':()=> `<view style="padding-bottom:env(safe-area-inset-bottom);${styleInline}">\n${kidsStr}\n${indent}</view>`,
    'mp-list':    () => `<view class="list"${styleAttr}>\n${kidsStr}\n${indent}</view>`,

    // 导航
    'mp-navbar':  () => `<view class="navbar" style="height:88rpx;display:flex;align-items:center;padding:0 32rpx;background:var(--weui-bg-2);${styleInline}">${escapeText(p.title||'')}</view>`,
    'mp-tabbar':  () => {
      const items = (p.items||'首页|🏠').split(',').map(s => s.split('|'));
      const act = p.active || 0;
      return `<view class="tabbar" style="position:fixed;bottom:0;left:0;right:0;display:flex;background:var(--weui-bg-2);border-top:2rpx solid var(--weui-separator);padding-bottom:env(safe-area-inset-bottom);${styleInline}">\n${items.map(([t,i],idx)=>`${indent}  <view class="tab${idx===act?' active':''}" style="flex:1;text-align:center;padding:16rpx;font-size:22rpx;${idx===act?'color:var(--weui-brand);':''}"><text>${i||''}</text>\\n${indent}    <view>${t}</view></view>`).join('\n')}\n${indent}</view>`;
    },
    'mp-capsule': () => `<view class="capsule"${styleAttr}>···</view>`,
    'mp-fab':     () => `<view class="fab" style="position:fixed;bottom:120rpx;right:40rpx;width:96rpx;height:96rpx;border-radius:48rpx;background:var(--weui-brand);color:#fff;display:flex;align-items:center;justify-content:center;${styleInline}">${escapeText(p.icon||'+')}</view>`,

    // 展示
    'mp-card':    () => `<view class="card" style="background:var(--weui-bg-2);border-radius:16rpx;padding:24rpx;${styleInline}">\n${kidsStr}\n${indent}</view>`,
    'mp-goods-card':()=> `<view class="goods-card" style="background:var(--weui-bg-2);border-radius:16rpx;overflow:hidden;${styleInline}">
${indent}  <image src="${p.image||''}" mode="aspectFill" style="width:100%;height:300rpx;"/>
${indent}  <view style="padding:16rpx;">
${indent}    <view style="font-size:26rpx;">${escapeText(p.title||'')}</view>
${indent}    <view style="color:#fa5151;margin-top:8rpx;">¥${escapeText(p.price||'')}</view>
${indent}  </view>
${indent}</view>`,
    'mp-stat':    () => `<view style="text-align:center;${styleInline}"><view style="font-size:40rpx;font-weight:600;">${escapeText(p.value||'')}</view><view style="font-size:24rpx;color:var(--weui-fg-2);">${escapeText(p.label||'')}</view></view>`,
    'mp-empty':   () => `<view style="text-align:center;padding:80rpx 32rpx;color:var(--weui-fg-2);${styleInline}"><view style="font-size:80rpx;">${escapeText(p.icon||'📦')}</view><view>${escapeText(p.text||'暂无数据')}</view></view>`,

    // 反馈
    'mp-alert':   () => `<view class="alert" style="padding:16rpx 24rpx;background:rgba(7,193,96,.1);border-radius:8rpx;font-size:26rpx;${styleInline}">${escapeText(p.content||'')}</view>`,
    'mp-toast':   () => `<!-- 请用 wx.showToast({ title: '${escapeText(p.content||'')}' }) -->`,
    'mp-modal':   () => `<!-- 请用 wx.showModal({ content: '${escapeText(p.content||'')}' }) -->`,

    // 业务
    'mp-user-card':()=> `<view class="user-card" style="display:flex;align-items:center;padding:32rpx;background:var(--weui-bg-2);${styleInline}">
${indent}  <view class="avatar" style="width:96rpx;height:96rpx;border-radius:48rpx;background:var(--weui-brand);color:#fff;display:flex;align-items:center;justify-content:center;">${escapeText((p.name||'A')[0])}</view>
${indent}  <view style="flex:1;margin-left:24rpx;">
${indent}    <view style="font-size:32rpx;font-weight:500;">${escapeText(p.name||'')}</view>
${indent}    <view style="font-size:24rpx;color:var(--weui-fg-2);margin-top:8rpx;">${escapeText(p.desc||'')}</view>
${indent}  </view>
${indent}</view>`,
  };

  const rule = rules[node.type];
  if (rule) return indent + rule();

  // 3. fallback：view 包一层 children
  if ((node.children || []).length) {
    return `${indent}<view${styleAttr}><!-- ${node.type} -->\n${kidsStr}\n${indent}</view>`;
  }
  return `${indent}<view${styleAttr}><!-- ${node.type} --></view>`;
}

function collectPageData(root) {
  const data = {};
  function walk(n) {
    for (const [k, v] of Object.entries(n.props || {})) {
      if (typeof v === 'string' && v.length < 50) data[`${n.id}_${k}`] = v;
    }
    (n.children || []).forEach(walk);
  }
  walk(root);
  return data;
}

/* ============ React (JSX) ============ */
export function genReact(page = getActivePage()) {
  if (!page) return '';
  const body = nodeToJsx(page.root, 4);
  return `import React from 'react';
import './design-tokens.css';

export default function ${pageComponentName(page)}() {
  return (
${body}
  );
}`;
}

function nodeToJsx(node, indent) {
  const pad = ' '.repeat(indent);
  const def = getComponent(node.type);
  const p = node.props || {};
  const styleJsx = styleObjToJsx(node.style);
  const styleAttr = styleJsx ? ` style={${styleJsx}}` : '';

  if (def?.codegen?.react) {
    const childJsx = (node.children || []).map(c => nodeToJsx(c, indent + 2)).join('\n');
    return pad + def.codegen.react(node, { childJsx, styleAttr, indent });
  }

  const kids = (node.children || []).map(c => nodeToJsx(c, indent + 2)).join('\n');
  const kidsWrapped = kids ? `\n${kids}\n${pad}` : '';

  const rules = {
    container:    () => `<div${styleAttr}>${kidsWrapped}</div>`,
    'mp-button':  () => `<button className="btn btn-${p.variant||'primary'}"${styleAttr}${p.disabled?' disabled':''}>${escapeJsx(p.text||'')}</button>`,
    'mp-input':   () => `<label className="cell"${styleAttr}><span>${escapeJsx(p.label||'')}</span><input placeholder="${escapeText(p.placeholder||'')}" /></label>`,
    'mp-textarea':() => `<textarea placeholder="${escapeText(p.placeholder||'')}" maxLength={${p.maxlength||200}}${styleAttr} />`,
    'mp-switch':  () => `<label className="cell"${styleAttr}><span>${escapeJsx(p.label||'')}</span><input type="checkbox" defaultChecked={${!!p.checked}} /></label>`,
    'mp-cell':    () => `<div className="cell"${styleAttr}><div className="cell-title">${escapeJsx(p.title||'')}</div><div className="cell-desc">${escapeJsx(p.desc||'')}${p.arrow?' ›':''}</div></div>`,
    'mp-cell-group':()=>`<div className="cell-group"${styleAttr}>${p.title?`<div className="cell-group-title">${escapeJsx(p.title)}</div>`:''}${kidsWrapped}</div>`,
    'mp-title':   () => `<h${p.level||2}${styleAttr}>${escapeJsx(p.text||'')}</h${p.level||2}>`,
    'mp-text':    () => `<span${styleAttr}>${escapeJsx(p.text||'')}</span>`,
    'mp-image':   () => `<img src="${p.src||''}" alt="${escapeText(p.alt||'')}" style={{width:${p.w||200},height:${p.h||200}}} />`,
    'mp-tag':     () => `<span className="tag tag-${p.color||'green'}"${styleAttr}>${escapeJsx(p.text||'')}</span>`,
    'mp-badge':   () => `<span className="badge"${styleAttr}>${escapeJsx(p.text||p.count||'')}</span>`,
    'mp-spacer':  () => `<div style={{height:${p.height||16}}} />`,
    'mp-divider': () => `<hr style={{border:0,borderTop:'1px solid var(--weui-separator)',margin:'${p.margin||8}px 0'}} />`,
    'mp-icon':    () => `<span className="icon"${styleAttr}>${escapeJsx(p.icon||'')}</span>`,
    'mp-avatar':  () => `<div className="avatar"${styleAttr}>${escapeJsx((p.name||'A')[0])}</div>`,
    'mp-progress':() => `<progress value={${p.percent||0}} max="100"${styleAttr} />`,
    'mp-link':    () => `<a href="${p.url||'#'}" style={{color:'var(--weui-brand)'}}${styleAttr}>${escapeJsx(p.text||'')}</a>`,

    'mp-flex':    () => `<div style={{display:'flex',flexDirection:'${p.direction||'row'}',gap:${p.gap||0},justifyContent:'${p.justify||'flex-start'}',alignItems:'${p.align||'stretch'}'}}>${kidsWrapped}</div>`,
    'mp-grid':    () => `<div style={{display:'grid',gridTemplateColumns:'repeat(${p.cols||2},1fr)',gap:${p.gap||0}}}>${kidsWrapped}</div>`,
    'mp-space':   () => `<div style={{display:'flex',gap:${p.size||8},flexDirection:'${p.vertical?'column':'row'}'}}>${kidsWrapped}</div>`,
    'mp-section': () => `<section${styleAttr}>${p.title?`<header>${escapeJsx(p.title)}${p.more?`<a>${escapeJsx(p.more)}</a>`:''}</header>`:''}${kidsWrapped}</section>`,
    'mp-container':()=> `<div className="container"${styleAttr}>${kidsWrapped}</div>`,
    'mp-list':    () => `<div className="list"${styleAttr}>${kidsWrapped}</div>`,

    'mp-navbar':  () => `<header className="navbar"${styleAttr}>${escapeJsx(p.title||'')}</header>`,
    'mp-searchbar':()=>`<div className="search-bar"${styleAttr}><input placeholder="${escapeText(p.placeholder||'搜索')}" /></div>`,

    'mp-card':    () => `<div className="card"${styleAttr}>${kidsWrapped}</div>`,
    'mp-stat':    () => `<div${styleAttr}><div style={{fontSize:20,fontWeight:600}}>${escapeJsx(p.value||'')}</div><div style={{fontSize:12,color:'var(--weui-fg-2)'}}>${escapeJsx(p.label||'')}</div></div>`,
    'mp-empty':   () => `<div style={{textAlign:'center',padding:40,color:'var(--weui-fg-2)'}}${styleAttr}><div style={{fontSize:40}}>${escapeJsx(p.icon||'📦')}</div><div>${escapeJsx(p.text||'暂无数据')}</div></div>`,
    'mp-alert':   () => `<div className="alert"${styleAttr}>${escapeJsx(p.content||'')}</div>`,
    'mp-user-card':()=>`<div className="user-card"${styleAttr}>
${pad}  <div className="avatar">${escapeJsx((p.name||'A')[0])}</div>
${pad}  <div><div>${escapeJsx(p.name||'')}</div><div>${escapeJsx(p.desc||'')}</div></div>
${pad}</div>`,
  };
  const rule = rules[node.type];
  if (rule) return pad + rule();
  if ((node.children || []).length) return `${pad}<div${styleAttr}>${kidsWrapped}</div>`;
  return `${pad}<div${styleAttr} />`;
}

/* ============ Vue 3 ============ */
export function genVue(page = getActivePage()) {
  if (!page) return '';
  const body = nodeToVue(page.root, 2);
  return `<template>
${body}
</template>

<script setup lang="ts">
// import '@/design-tokens.css';
</script>

<style scoped>
/* 请在全局样式中导入 design-tokens.css */
</style>`;
}

function nodeToVue(node, indent) {
  const pad = ' '.repeat(indent);
  const def = getComponent(node.type);
  const p = node.props || {};
  const styleInline = styleObjToInline(node.style);
  const styleAttr = styleInline ? ` style="${styleInline}"` : '';

  if (def?.codegen?.vue) {
    const childVue = (node.children || []).map(c => nodeToVue(c, indent + 2)).join('\n');
    return pad + def.codegen.vue(node, { childVue, styleAttr, indent });
  }

  const kids = (node.children || []).map(c => nodeToVue(c, indent + 2)).join('\n');
  const kidsWrapped = kids ? `\n${kids}\n${pad}` : '';

  const rules = {
    container:    () => `<div${styleAttr}>${kidsWrapped}</div>`,
    'mp-button':  () => `<button class="btn btn-${p.variant||'primary'}"${styleAttr} ${p.disabled?'disabled':''}>${escapeText(p.text||'')}</button>`,
    'mp-title':   () => `<h${p.level||2}${styleAttr}>${escapeText(p.text||'')}</h${p.level||2}>`,
    'mp-text':    () => `<span${styleAttr}>${escapeText(p.text||'')}</span>`,
    'mp-input':   () => `<label class="cell"${styleAttr}><span>${escapeText(p.label||'')}</span><input placeholder="${escapeText(p.placeholder||'')}" /></label>`,
    'mp-cell':    () => `<div class="cell"${styleAttr}><div class="cell-title">${escapeText(p.title||'')}</div><div class="cell-desc">${escapeText(p.desc||'')}${p.arrow?' ›':''}</div></div>`,
    'mp-cell-group':()=> `<div class="cell-group"${styleAttr}>${p.title?`<div class="cell-group-title">${escapeText(p.title)}</div>`:''}${kidsWrapped}</div>`,
    'mp-image':   () => `<img src="${p.src||''}" alt="${escapeText(p.alt||'')}" :style="{width:'${p.w||200}px',height:'${p.h||200}px'}" />`,
    'mp-tag':     () => `<span class="tag tag-${p.color||'green'}"${styleAttr}>${escapeText(p.text||'')}</span>`,
    'mp-spacer':  () => `<div style="height:${p.height||16}px;"></div>`,
    'mp-divider': () => `<hr style="border:0;border-top:1px solid var(--weui-separator);margin:${p.margin||8}px 0;"/>`,
    'mp-searchbar':()=>`<div class="search-bar"${styleAttr}><input placeholder="${escapeText(p.placeholder||'搜索')}" /></div>`,
    'mp-card':    () => `<div class="card"${styleAttr}>${kidsWrapped}</div>`,
    'mp-flex':    () => `<div style="display:flex;flex-direction:${p.direction||'row'};gap:${p.gap||0}px;justify-content:${p.justify||'flex-start'};align-items:${p.align||'stretch'};">${kidsWrapped}</div>`,
    'mp-grid':    () => `<div style="display:grid;grid-template-columns:repeat(${p.cols||2},1fr);gap:${p.gap||0}px;">${kidsWrapped}</div>`,
    'mp-section': () => `<section${styleAttr}>${p.title?`<header>${escapeText(p.title)}${p.more?`<a>${escapeText(p.more)}</a>`:''}</header>`:''}${kidsWrapped}</section>`,
    'mp-stat':    () => `<div${styleAttr}><div style="font-size:20px;font-weight:600;">${escapeText(p.value||'')}</div><div style="font-size:12px;color:var(--weui-fg-2);">${escapeText(p.label||'')}</div></div>`,
    'mp-empty':   () => `<div style="text-align:center;padding:40px;color:var(--weui-fg-2);"${styleAttr}><div style="font-size:40px;">${escapeText(p.icon||'📦')}</div><div>${escapeText(p.text||'暂无数据')}</div></div>`,
    'mp-user-card':()=>`<div class="user-card"${styleAttr}>
${pad}  <div class="avatar">${escapeText((p.name||'A')[0])}</div>
${pad}  <div><div>${escapeText(p.name||'')}</div><div>${escapeText(p.desc||'')}</div></div>
${pad}</div>`,
  };
  const rule = rules[node.type];
  if (rule) return pad + rule();
  if ((node.children || []).length) return `${pad}<div${styleAttr}>${kidsWrapped}</div>`;
  return `${pad}<div${styleAttr}></div>`;
}

function pageComponentName(page) {
  return (page.name || 'Page').replace(/[^a-zA-Z0-9]/g, '') || 'Page';
}

/* ====== CSS Variables（导出完整） ====== */
function cssVarMap() {
  const t = state.project?.tokens;
  const m = {};
  if (!t) return m;
  for (const grp of ['primary','neutral']) {
    for (const [s, v] of Object.entries(t.color?.[grp] || {})) m[`--color-${grp}-${s}`] = v;
  }
  for (const [name, scale] of Object.entries(t.color?.semantic || {})) {
    if (typeof scale === 'object') {
      for (const [s, v] of Object.entries(scale)) m[`--color-${name}-${s}`] = v;
    }
  }
  for (const [k, v] of Object.entries(t.spacing || {})) m[`--space-${k}`] = `${v*2}rpx`;
  for (const [k, v] of Object.entries(t.radius  || {})) m[`--radius-${k}`] = typeof v === 'number' ? `${v*2}rpx` : v;
  m['--weui-brand'] = t.color?.primary?.[500] || '#07c160';
  m['--weui-bg-1']  = t.color?.neutral?.[50]  || '#f7f7f7';
  m['--weui-bg-2']  = t.color?.neutral?.[0]   || '#ffffff';
  m['--weui-fg-0']  = t.color?.neutral?.[900] || '#111111';
  m['--weui-fg-2']  = t.color?.neutral?.[500] || '#888888';
  m['--weui-separator'] = 'rgba(0,0,0,.1)';
  return m;
}

function genCssVars() {
  const m = cssVarMap();
  return `:root {\n${Object.entries(m).map(([k,v]) => `  ${k}: ${v};`).join('\n')}\n}`;
}
