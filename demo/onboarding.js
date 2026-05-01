// 财务阶段诊断 - 5问题引导新用户找到当前阶段
(function () {
  const ONBOARDING_KEY = 'fire_onboarding_done_v1';

  const STAGES = {
    debt: {
      name: '负债清偿期',
      emoji: '🚨',
      desc: '高息债务的利率通常高于投资收益率。先还清它们，投资收益跑不赢利息支出。',
      action: '今天：列出所有利率 > 5% 的债务，按利率从高到低排序，集中还最贵的那笔',
      color: '#fef2f2',
      borderColor: '#dc2626',
    },
    emergency: {
      name: '应急建设期',
      emoji: '🛡️',
      desc: '没有应急金就开始投资，一旦遇到失业或突发支出，你会被迫低价卖出资产。',
      action: '今天：开一个独立货币基金账户，设自动转入，目标是 6 个月固定支出',
      color: '#fffbeb',
      borderColor: '#f59e0b',
    },
    start: {
      name: '投资启动期',
      emoji: '🌱',
      desc: '应急金已有，但还没有建立自动化投资习惯。这一步是所有积累的起点。',
      action: '今天：开通指数基金账户，设置 ≥500 元/月的定投，哪怕很小也先开始',
      color: '#f0fdf4',
      borderColor: '#10b981',
    },
    savings: {
      name: '储蓄加速期',
      emoji: '⚡',
      desc: '已经在投资，但储蓄率还有空间。储蓄率是决定 FIRE 年限最重要的单一变量。',
      action: '今天：用计算器算出你的储蓄率，找一项可以立即削减的非必要支出',
      color: '#eff6ff',
      borderColor: '#2563eb',
    },
    optimize: {
      name: '配置优化期',
      emoji: '📈',
      desc: '储蓄率已达标，现在要让钱更有效率地工作——优化资产配置比例。',
      action: '今天：填写下方计算器，检查实际配置是否偏离目标比例，进行再平衡',
      color: '#f5f3ff',
      borderColor: '#7c3aed',
    },
    sprint: {
      name: '冲刺 FIRE 期',
      emoji: '🔥',
      desc: '你已建立完整财务体系，接近目标。重点转向提取策略和退休后的生活设计。',
      action: '今天：计算你的 Coast FIRE 数字，考虑是否可以放慢节奏或提前半退休',
      color: '#fdf4ff',
      borderColor: '#c026d3',
    },
  };

  const QUESTIONS = [
    {
      q: '你有利率 > 5% 的贷款吗？',
      hint: '车贷、信用卡欠款、消费贷、花呗/白条分期等',
    },
    {
      q: '你有 6 个月以上的应急储蓄吗？',
      hint: '放在活期或货币基金，随时可取的钱',
    },
    {
      q: '你目前有在坚持每月定投吗？',
      hint: '任何指数基金、ETF 或定期储蓄都算',
    },
    {
      q: '你的月储蓄超过月收入的 20% 吗？',
      hint: '储蓄率 = (收入 - 支出) ÷ 收入',
    },
    {
      q: '你大概知道自己的 FIRE 目标金额吗？',
      hint: '年支出 ÷ 4% = 需要攒到的总金额',
    },
  ];

  function determineStage(answers) {
    if (answers[0] === 'yes') return 'debt';
    if (answers[1] === 'no') return 'emergency';
    if (answers[2] === 'no') return 'start';
    if (answers[3] === 'no') return 'savings';
    if (answers[4] === 'yes') return 'sprint';
    return 'optimize';
  }

  function isTerminal(answers) {
    if (answers.length === 0) return false;
    if (answers[0] === 'yes') return true;
    if (answers.length >= 2 && answers[1] === 'no') return true;
    if (answers.length >= 3 && answers[2] === 'no') return true;
    if (answers.length >= 4 && answers[3] === 'no') return true;
    if (answers.length === 5) return true;
    return false;
  }

  function createOverlay() {
    const el = document.createElement('div');
    el.id = 'onboarding-overlay';
    el.innerHTML = `
      <div class="onb-card">
        <div class="onb-header">
          <div class="onb-logo">💰</div>
          <h2>先搞清楚你在哪个阶段</h2>
          <p>5个问题，告诉你现在最该做什么</p>
        </div>
        <div class="onb-progress-wrap">
          <div class="onb-progress-fill" id="onbProgressFill" style="width:0%"></div>
        </div>
        <div id="onbContent"></div>
        <div class="onb-footer">
          <button id="onbSkip">跳过，直接填表 →</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    el.style.opacity = '0';
    requestAnimationFrame(() => { el.style.opacity = '1'; });
    return el;
  }

  function renderQuestion(idx, onAnswer) {
    const q = QUESTIONS[idx];
    const pct = ((idx / QUESTIONS.length) * 100).toFixed(0);
    document.getElementById('onbProgressFill').style.width = pct + '%';

    document.getElementById('onbContent').innerHTML = `
      <div class="onb-step">
        <div class="onb-qnum">问题 ${idx + 1} / ${QUESTIONS.length}</div>
        <div class="onb-question">${q.q}</div>
        <div class="onb-hint">${q.hint}</div>
        <div class="onb-btns">
          <button class="onb-btn onb-yes" data-ans="yes">是</button>
          <button class="onb-btn onb-no" data-ans="no">否</button>
        </div>
      </div>
    `;
    document.querySelectorAll('#onbContent .onb-btn').forEach(btn => {
      btn.addEventListener('click', () => onAnswer(btn.dataset.ans));
    });
  }

  function renderResult(stageName) {
    const stage = STAGES[stageName];
    document.getElementById('onbProgressFill').style.width = '100%';

    document.getElementById('onbContent').innerHTML = `
      <div class="onb-result" style="border-color:${stage.borderColor};background:${stage.color}">
        <div class="onb-stage-badge" style="color:${stage.borderColor}">${stage.emoji} ${stage.name}</div>
        <p class="onb-stage-desc">${stage.desc}</p>
        <div class="onb-action">
          <strong>现在该做什么：</strong><br>${stage.action}
        </div>
      </div>
      <div style="text-align:center;margin-top:24px;">
        <button class="onb-btn-primary" id="onbStart">用计算器算出我的 FIRE 数字 →</button>
        <p style="font-size:0.8rem;color:#94a3b8;margin-top:8px;">输入真实数据，得到精确年限和目标金额</p>
      </div>
    `;
    document.getElementById('onbStart').addEventListener('click', closeOnboarding);
    localStorage.setItem('fire_user_stage_v1', stageName);
  }

  function closeOnboarding() {
    localStorage.setItem(ONBOARDING_KEY, '1');
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
    showStageBadge();
  }

  function showStageBadge() {
    const stageName = localStorage.getItem('fire_user_stage_v1');
    if (!stageName || !STAGES[stageName]) return;
    const stage = STAGES[stageName];

    const existing = document.getElementById('stage-badge-bar');
    if (existing) existing.remove();

    const bar = document.createElement('div');
    bar.id = 'stage-badge-bar';
    bar.style.cssText = `background:${stage.color};border:1px solid ${stage.borderColor};border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;`;
    bar.innerHTML = `
      <div>
        <strong style="font-size:0.9rem;color:${stage.borderColor}">${stage.emoji} 当前阶段：${stage.name}</strong>
        <div style="font-size:0.82rem;color:#475569;margin-top:3px;">${stage.action}</div>
      </div>
      <button onclick="window.fireOnboarding.restart()" style="font-size:0.78rem;color:#64748b;background:none;border:1px solid #cbd5e1;border-radius:6px;padding:4px 10px;cursor:pointer;white-space:nowrap;flex-shrink:0;">重新诊断</button>
    `;

    const panel = document.querySelector('.panel');
    if (panel) panel.prepend(bar);
  }

  function init() {
    if (localStorage.getItem(ONBOARDING_KEY)) {
      showStageBadge();
      return;
    }

    const overlay = createOverlay();
    const answers = [];
    let currentQ = 0;

    function handleAnswer(ans) {
      answers.push(ans);
      if (isTerminal(answers)) {
        renderResult(determineStage(answers));
        return;
      }
      currentQ++;
      renderQuestion(currentQ, handleAnswer);
    }

    renderQuestion(0, handleAnswer);
    document.getElementById('onbSkip').addEventListener('click', closeOnboarding);
  }

  window.fireOnboarding = {
    restart() {
      localStorage.removeItem(ONBOARDING_KEY);
      localStorage.removeItem('fire_user_stage_v1');
      location.reload();
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
