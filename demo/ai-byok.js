// BYOK AI 分析：用户填自己的 Anthropic API key（存 localStorage），浏览器直连 Claude
// 模型：Claude Sonnet 4.6（性价比高，足以做财务分析）

const API_KEY_STORAGE = 'fire_anthropic_api_key_v1';
const MODEL = 'claude-sonnet-4-6';
const $ = (id) => document.getElementById(id);

function getKey() { return localStorage.getItem(API_KEY_STORAGE) || ''; }
function setKey(k) { localStorage.setItem(API_KEY_STORAGE, k); }
function clearKey() { localStorage.removeItem(API_KEY_STORAGE); }

function buildPrompt(report) {
  // 复用 copyAiButton 已有的 prompt 模板
  const lifestyleLabels = { '1': '维持现状', '0.7': '二线城市(-30%)', '0.5': '东南亚(-50%)', '0.35': '极简(-65%)' };
  const lifestyleLabel = lifestyleLabels[String(report.retirementLifestyle)] || `支出×${report.retirementLifestyle}`;
  const fmt = n => Math.round(n).toLocaleString('zh-CN');
  const pct = n => (n * 100).toFixed(1) + '%';

  return `请根据以下财务数据，按 awesome-financial-freedom 顾问规范，输出完整的 FIRE 财务自由分析（8段结构，使用 Markdown）：

【基本信息】
- 年龄：${report.age} 岁 | 退休：${report.retirementAge} 岁 | 职业安全期：${report.careerSafeYears} 年
- 家庭：${report.familyStatus} | 风险：${report.riskTolerance}

【资产负债】
- 银行 ${fmt(report.cash)} | 公积金 ${fmt(report.housingFund)} | 股票 ${fmt(report.stocks)} | 黄金 ${fmt(report.goldVal)} | 其他 ${fmt(report.otherAssets)} | 房产 ${fmt(report.houseValue)}
- 房贷 ${fmt(report.mortgage)}（月供 ${fmt(report.mortgageMonthly)}，利率 ${(report.mortgageRate*100).toFixed(2)}%）
- 净资产 ${fmt(report.netAssets)} | 可投资 ${fmt(report.investableAssets)}

【年度收支】
- 年收入 ${fmt(report.annualIncome)} | 年支出 ${fmt(report.annualExpenses)} | 年储蓄 ${fmt(report.annualSavings)}（${pct(report.savingsRate)}）
- 月被动收入 ${fmt(report.monthlyPassiveIncome)} | 个人养老金 ${report.pensionContrib > 0 ? fmt(report.pensionContrib) : '未缴'}

【FIRE 计算】
- 目标 ${fmt(report.fireTarget)} | 进度 ${report.progressPct}% | 年限 ${report.yearsToFI ?? '>100'} | FIRE 年龄 ${report.fiAge ?? '—'}
- 预期收益 ${pct(report.expectedReturn)} | Coast FIRE ${fmt(report.coastNumber)}（${report.alreadyCoasting ? '已达' : '未达'}）
- 收入年增 ${report.incomeGrowthRate}% → ${report.yearsWithGrowth ?? '—'} 年 | 副业 ${fmt(report.sideIncome)}/月 → ${report.yearsWithSide ?? '—'} 年
- 退休生活：${lifestyleLabel}

按 8 段结构输出：1)假设 2)0-100评分 3)FIRE目标(房贷AB对比) 4)三场景年限 5)配置(含A股/QDII/黄金代码) 6)收支优化(数字) 7)风险(3-5条) 8)本周3步行动(到日期金额)`;
}

async function callClaude(apiKey, prompt, onChunk) {
  const url = 'https://api.anthropic.com/v1/messages';
  const body = {
    model: MODEL,
    max_tokens: 4096,
    stream: true,
    messages: [{ role: 'user', content: prompt }],
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text.slice(0, 300)}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6);
      if (payload === '[DONE]') return;
      try {
        const ev = JSON.parse(payload);
        if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
          onChunk(ev.delta.text);
        }
      } catch {}
    }
  }
}

function openDialog() {
  if ($('byok-dialog')) return;
  const r = window._lastReport;
  if (!r) { alert('请先生成 FIRE 计划'); return; }

  const dlg = document.createElement('div');
  dlg.id = 'byok-dialog';
  dlg.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.7);display:flex;align-items:center;justify-content:center;z-index:2000;padding:16px;';
  dlg.innerHTML = `
    <div style="background:#fff;border-radius:16px;max-width:720px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="padding:18px 22px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
        <strong style="font-size:1.05rem;">🤖 AI 财务自由分析（BYOK）</strong>
        <button id="byok-close" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#64748b;">×</button>
      </div>
      <div style="padding:18px 22px;">
        <div id="byok-key-section">
          <label style="display:block;font-size:0.88rem;color:#475569;margin-bottom:6px;">
            Anthropic API Key（仅存浏览器 localStorage，不上传任何服务器）
          </label>
          <input id="byok-key" type="password" placeholder="sk-ant-..." value="${getKey()}"
            style="width:100%;padding:10px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.88rem;font-family:monospace;" />
          <p style="font-size:0.78rem;color:#94a3b8;margin:8px 0 0;">
            没有 key？去 <a href="https://console.anthropic.com/" target="_blank" style="color:#2563eb;">console.anthropic.com</a> 注册。模型用 ${MODEL}，单次调用约 ¥0.1-0.5。
            <button id="byok-clear-key" style="margin-left:8px;background:none;border:none;color:#dc2626;cursor:pointer;text-decoration:underline;font-size:0.78rem;">清除已存 key</button>
          </p>
        </div>
        <div style="margin-top:14px;text-align:right;">
          <button id="byok-run" class="btn-primary" style="padding:10px 20px;">用 AI 分析</button>
        </div>
        <div id="byok-output" style="margin-top:16px;display:none;background:#f8fafc;border-radius:10px;padding:16px;font-size:0.88rem;line-height:1.6;white-space:pre-wrap;max-height:50vh;overflow:auto;"></div>
        <div id="byok-status" style="margin-top:10px;font-size:0.82rem;color:#64748b;"></div>
      </div>
    </div>`;
  document.body.appendChild(dlg);

  $('byok-close').onclick = () => dlg.remove();
  $('byok-clear-key').onclick = () => { clearKey(); $('byok-key').value = ''; };
  $('byok-run').onclick = async () => {
    const key = $('byok-key').value.trim();
    if (!key.startsWith('sk-ant-')) { alert('请填入有效的 Anthropic API key（sk-ant- 开头）'); return; }
    setKey(key);

    const out = $('byok-output');
    const status = $('byok-status');
    out.style.display = 'block';
    out.textContent = '';
    status.textContent = '⏳ 正在调用 Claude...';
    $('byok-run').disabled = true;

    try {
      await callClaude(key, buildPrompt(window._lastReport), (txt) => {
        out.textContent += txt;
        out.scrollTop = out.scrollHeight;
      });
      status.textContent = '✅ 分析完成';
    } catch (e) {
      status.textContent = '❌ ' + e.message;
    } finally {
      $('byok-run').disabled = false;
    }
  };
}

export function initBYOK() {
  window.fireBYOK = { open: openDialog };
}
