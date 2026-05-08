/**
 * AI 生成页面 · 自然语言 → 节点树
 *
 * 两种模式：
 * 1) 本地规则（离线）：关键词匹配 → 模板组合
 * 2) 远程 OpenAI 兼容 API（需 apiKey）：当前 tokens + 组件清单作为 context
 *
 * 生成的节点树通过 schema 校验后 apply
 */
import { state, bus, getActivePage } from '../core/state.js';
import { all as allComponents } from '../components/registry.js';
import { applyTemplate } from './page-templates.js';
import { nid } from '../core/id.js';
import { toast } from '../ui/toast.js';
import { clearHistory } from '../core/history.js';

const LS_CFG = 'udg-ai-cfg';

export function getAiConfig() {
  try { return JSON.parse(localStorage.getItem(LS_CFG) || 'null') || {}; }
  catch { return {}; }
}
export function setAiConfig(cfg) {
  localStorage.setItem(LS_CFG, JSON.stringify(cfg));
}

/* ============ 本地规则映射 ============ */
const KEYWORDS = [
  { pat: /(首页|主页|home|首页带搜索|首页带推荐)/i, tpl: 'home' },
  { pat: /(列表|商品列表|list|feed)/i,            tpl: 'list' },
  { pat: /(详情|商品详情|detail)/i,               tpl: 'detail' },
  { pat: /(表单|注册|登录|form|signup|signin)/i,  tpl: 'form' },
  { pat: /(个人|我的|mine|profile|用户中心)/i,     tpl: 'mine' },
];

function matchLocal(prompt) {
  for (const k of KEYWORDS) if (k.pat.test(prompt)) return k.tpl;
  return null;
}

export async function generateFromPrompt(prompt) {
  const cfg = getAiConfig();
  const page = getActivePage();
  if (!page) { toast('没有活动页面', 'error'); return; }

  // 1. 本地规则优先（无网络时可用）
  const tpl = matchLocal(prompt);
  if (tpl) {
    applyTemplate(page.id, tpl);
    toast(`✓ 本地规则匹配：${tpl} 模板`, 'success');
    return;
  }

  // 2. 远程 AI（如果配置了 apiKey）
  if (cfg.apiKey && cfg.baseUrl) {
    try {
      await callRemoteAI(prompt, cfg);
      toast('✓ AI 已生成页面', 'success');
    } catch (e) {
      toast(`AI 调用失败: ${e.message}`, 'error', 3500);
    }
  } else {
    toast('未匹配到本地模板，且未配置 AI API。点击"⚙"配置 API Key', 'error', 3500);
  }
}

/* ============ 远程 API 调用 ============ */
async function callRemoteAI(prompt, cfg) {
  const components = allComponents()
    .filter(c => c.id.startsWith('mp-') || c.id === 'container')
    .map(c => `${c.id}(${c.name})`).join(', ');

  const systemPrompt = `你是一个微信小程序 UI 设计师。用户会描述想要的页面，你需要返回一个 JSON 节点树。

可用组件（id 必须从这些中选）：
${components}

节点格式：
{ "type": "<id>", "props": { "text": "...", ... }, "children": [...] }

要求：
1. 返回纯 JSON，不要 markdown 代码块
2. 根节点不需要包裹，直接返回数组（作为页面根的 children）
3. 组件的 props 参考常识，不确定的可以不填
4. 尽量用 WeUI 风格，使用 mp-cell、mp-cell-group、mp-flex 等布局`;

  const res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: cfg.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: prompt },
      ],
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI 返回内容为空');

  // 解析 JSON
  const raw = content.replace(/```json\s*|\s*```/g, '').trim();
  let tree;
  try { tree = JSON.parse(raw); }
  catch { throw new Error('AI 返回的不是有效 JSON'); }

  if (!Array.isArray(tree)) throw new Error('AI 返回的不是数组');

  // 给每个节点打 id
  function assignIds(nodes) {
    return nodes.map(n => ({
      id: nid(n.type?.replace('mp-','') || 'node'),
      type: n.type,
      props: n.props || {},
      style: n.style || {},
      effects: n.effects || [],
      children: assignIds(n.children || []),
    }));
  }
  const activePage = getActivePage();
  if (activePage) activePage.root.children = assignIds(tree);
  clearHistory();
  bus.emit('project:changed');
  bus.emit('page:changed');
}

/* ============ UI ============ */
export function showAiDialog() {
  const cfg = getAiConfig();
  const mask = document.createElement('div');
  mask.className = 'ui-confirm-mask';
  mask.innerHTML = `
    <div class="ai-panel">
      <div class="ai-header">
        <strong>🤖 AI 生成页面</strong>
        <button class="tool" id="ai-config-btn" title="配置 API">⚙</button>
        <button class="code-close" id="ai-close">×</button>
      </div>
      <div class="ai-body">
        <label class="ai-label">用一句话描述你想要的页面：</label>
        <textarea class="ai-input" id="ai-prompt" rows="4" placeholder="示例：一个商品列表页，有搜索框、筛选条、双列商品卡片&#10;示例：商品详情页，有大图、价格、规格选择、立即购买按钮"></textarea>
        <div class="ai-samples">
          <span class="ai-sample-tag" data-ai-sample="首页带搜索和推荐商品">首页</span>
          <span class="ai-sample-tag" data-ai-sample="商品列表页">列表</span>
          <span class="ai-sample-tag" data-ai-sample="商品详情页">详情</span>
          <span class="ai-sample-tag" data-ai-sample="注册表单">表单</span>
          <span class="ai-sample-tag" data-ai-sample="个人中心">我的</span>
        </div>
        <div class="ai-hint" id="ai-hint">
          ${cfg.apiKey
            ? `✓ 已配置 <b>${cfg.model || 'gpt-4o-mini'}</b> · 将优先使用本地规则，未匹配时调用 AI`
            : '💡 当前为<b>本地规则模式</b>（离线），可识别"首页/列表/详情/表单/个人中心"。点击⚙配置 OpenAI 兼容 API 以启用 AI'}
        </div>
      </div>
      <div class="ai-footer">
        <button class="tool"         id="ai-cancel">取消</button>
        <button class="tool primary" id="ai-generate">✨ 生成</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  const close = () => mask.remove();
  mask.querySelector('#ai-close').onclick  = close;
  mask.querySelector('#ai-cancel').onclick = close;
  mask.addEventListener('click', e => { if (e.target === mask) close(); });

  mask.querySelectorAll('[data-ai-sample]').forEach(el => {
    el.onclick = () => mask.querySelector('#ai-prompt').value = el.dataset.aiSample;
  });

  mask.querySelector('#ai-config-btn').onclick = () => {
    close();
    showAiConfigDialog();
  };
  mask.querySelector('#ai-generate').onclick = async () => {
    const prompt = mask.querySelector('#ai-prompt').value.trim();
    if (!prompt) { toast('请输入描述', 'error'); return; }
    close();
    await generateFromPrompt(prompt);
  };
}

function showAiConfigDialog() {
  const cfg = getAiConfig();
  const mask = document.createElement('div');
  mask.className = 'ui-confirm-mask';
  mask.innerHTML = `
    <div class="ai-panel">
      <div class="ai-header">
        <strong>⚙ AI 配置</strong>
        <button class="code-close" id="cfg-close">×</button>
      </div>
      <div class="ai-body">
        <label class="ai-label">API Base URL（OpenAI 兼容）：</label>
        <input class="ai-input" id="cfg-base" value="${cfg.baseUrl || 'https://api.openai.com/v1'}" placeholder="https://api.openai.com/v1" />
        <label class="ai-label">API Key：</label>
        <input class="ai-input" id="cfg-key" type="password" value="${cfg.apiKey || ''}" placeholder="sk-..." />
        <label class="ai-label">Model：</label>
        <input class="ai-input" id="cfg-model" value="${cfg.model || 'gpt-4o-mini'}" placeholder="gpt-4o-mini" />
        <div class="ai-hint">🔒 仅保存在本地 localStorage，不会发送到任何服务器</div>
      </div>
      <div class="ai-footer">
        <button class="tool" id="cfg-clear">清除</button>
        <button class="tool primary" id="cfg-save">保存</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);
  const close = () => mask.remove();
  mask.querySelector('#cfg-close').onclick = close;
  mask.addEventListener('click', e => { if (e.target === mask) close(); });
  mask.querySelector('#cfg-save').onclick = () => {
    setAiConfig({
      baseUrl: mask.querySelector('#cfg-base').value.trim(),
      apiKey:  mask.querySelector('#cfg-key').value.trim(),
      model:   mask.querySelector('#cfg-model').value.trim(),
    });
    toast('✓ AI 配置已保存', 'success');
    close();
  };
  mask.querySelector('#cfg-clear').onclick = () => {
    setAiConfig({});
    toast('已清除 AI 配置', 'success');
    close();
  };
}
