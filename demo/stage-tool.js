// 阶段联动工具 - 根据用户当前财务阶段显示对应的mini计算器
(function () {
  const STAGE_KEY = 'fire_user_stage_v1';

  // ---- 工具渲染器 ----

  function renderDebtTool(container) {
    container.innerHTML = `
      <div class="st-desc">高息债务的利息成本通常高于投资收益率。先还清它们，再谈投资。</div>
      <div id="st-debt-rows"></div>
      <button class="st-add-btn" id="st-add-debt">+ 添加一笔债务</button>
      <button class="st-calc-btn" id="st-calc-debt">计算最优还款顺序</button>
      <div id="st-debt-result" style="margin-top:14px;"></div>
    `;

    let debtCount = 0;
    const rowsEl = container.querySelector('#st-debt-rows');

    function addDebtRow(name = '', balance = '', rate = '', minPay = '') {
      debtCount++;
      const row = document.createElement('div');
      row.className = 'st-debt-row';
      row.dataset.id = debtCount;
      row.innerHTML = `
        <input class="st-input" placeholder="名称（选填）" value="${name}" data-field="name" />
        <input class="st-input" type="number" placeholder="余额（元）" value="${balance}" data-field="balance" />
        <input class="st-input" type="number" placeholder="年利率（%）" step="0.1" value="${rate}" data-field="rate" />
        <input class="st-input" type="number" placeholder="最低月还款" value="${minPay}" data-field="minPay" />
        <button class="st-del-btn" onclick="this.parentNode.remove()">✕</button>
      `;
      rowsEl.appendChild(row);
    }

    // 预填一行
    addDebtRow('', '', '', '');
    container.querySelector('#st-add-debt').addEventListener('click', () => addDebtRow());
    container.querySelector('#st-calc-debt').addEventListener('click', () => {
      const rows = rowsEl.querySelectorAll('.st-debt-row');
      const debts = [];
      rows.forEach(row => {
        const b = parseFloat(row.querySelector('[data-field="balance"]').value);
        const r = parseFloat(row.querySelector('[data-field="rate"]').value);
        const m = parseFloat(row.querySelector('[data-field="minPay"]').value);
        const n = row.querySelector('[data-field="name"]').value || '债务';
        if (b > 0 && r > 0) debts.push({ name: n, balance: b, rate: r / 100, minPay: m || b * 0.02 });
      });
      if (debts.length === 0) return;

      // 雪崩法（按利率从高到低）
      const avalanche = [...debts].sort((a, b) => b.rate - a.rate);
      // 雪球法（按余额从低到高）
      const snowball = [...debts].sort((a, b) => a.balance - b.balance);

      function totalInterest(order) {
        let debts2 = order.map(d => ({ ...d }));
        let month = 0, totalInt = 0;
        const MAX = 600;
        while (debts2.some(d => d.balance > 0) && month < MAX) {
          month++;
          let extra = 0; // freed-up minimum payments
          debts2.forEach(d => {
            if (d.balance <= 0) { extra += d.minPay; return; }
            const interest = d.balance * d.rate / 12;
            totalInt += interest;
            d.balance = Math.max(0, d.balance + interest - d.minPay);
          });
          // avalanche: put extra onto first unpaid
          const target = debts2.find(d => d.balance > 0);
          if (target && extra > 0) target.balance = Math.max(0, target.balance - extra);
        }
        return { months: month, interest: totalInt };
      }

      const av = totalInterest(avalanche);
      const sb = totalInterest(snowball);
      const fmt = n => Math.round(n).toLocaleString('zh-CN');

      let html = `<div style="font-weight:700;margin-bottom:8px;">还款计划对比</div>`;
      html += `<table class="st-table">
        <tr><th>方法</th><th>顺序</th><th>月数</th><th>总利息</th></tr>
        <tr>
          <td><strong style="color:#2563eb">雪崩法</strong><br><span style="font-size:0.75rem;color:#64748b">先还利率最高的</span></td>
          <td>${avalanche.map(d => d.name).join(' → ')}</td>
          <td>${av.months} 个月</td>
          <td style="color:#dc2626">${fmt(av.interest)} 元</td>
        </tr>
        <tr>
          <td><strong style="color:#7c3aed">雪球法</strong><br><span style="font-size:0.75rem;color:#64748b">先还余额最小的</span></td>
          <td>${snowball.map(d => d.name).join(' → ')}</td>
          <td>${sb.months} 个月</td>
          <td style="color:#dc2626">${fmt(sb.interest)} 元</td>
        </tr>
      </table>`;
      const saved = sb.interest - av.interest;
      if (saved > 0) {
        html += `<p style="margin-top:8px;font-size:0.85rem;color:#16a34a">✅ 雪崩法可少还利息 <strong>${fmt(saved)} 元</strong>，建议优先采用。</p>`;
      }
      html += `<p style="font-size:0.78rem;color:#94a3b8;margin-top:4px;">假设每月总还款额不变，债务还清后的最低还款额全部转移到下一笔债务。</p>`;
      container.querySelector('#st-debt-result').innerHTML = html;
    });
  }

  function renderEmergencyTool(container) {
    // 尝试从主表单读取数据
    const getVal = id => { const el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; };
    const expenses = getVal('annualExpenses') / 12 || 0;
    const cash = getVal('cash');
    const stocks = getVal('stocks');
    const gold = getVal('gold');
    const liquid = cash + stocks + gold;
    const familyStatus = document.getElementById('familyStatus')?.value || 'single';
    const months = familyStatus === 'with_dependents' ? 12 : familyStatus === 'married' ? 9 : 6;
    const target = expenses * months;
    const gap = Math.max(0, target - liquid);
    const fmt = n => Math.round(n).toLocaleString('zh-CN');

    let progressHtml = '';
    if (expenses > 0) {
      const pct = Math.min(100, target > 0 ? Math.round(liquid / target * 100) : 0);
      const color = pct >= 100 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#dc2626';
      progressHtml = `
        <div style="margin:12px 0;">
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px;">
            <span>当前流动资产 ${fmt(liquid)} 元</span>
            <span>目标 ${fmt(target)} 元（${months}个月）</span>
          </div>
          <div style="height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;transition:width 0.5s;"></div>
          </div>
          <div style="text-align:right;font-size:0.78rem;color:#64748b;margin-top:3px;">${pct}%</div>
        </div>
        ${gap > 0 ? `<p style="font-size:0.85rem;color:#92400e;background:#fffbeb;padding:8px 12px;border-radius:8px;">还差 <strong>${fmt(gap)} 元</strong>。${expenses > 0 ? `每月存 ${fmt(Math.ceil(gap / 6))} 元，6个月可补足。` : ''}</p>` : '<p style="font-size:0.85rem;color:#065f46;background:#d1fae5;padding:8px 12px;border-radius:8px;">✅ 应急金已充足，可以开始加大投资。</p>'}
      `;
    }

    container.innerHTML = `
      <div class="st-desc">应急金是投资的前提。没有它，市场下跌时你会被迫低价卖出资产。</div>
      ${progressHtml || `<p style="font-size:0.85rem;color:#64748b;">请先在主表单填写月支出和流动资产，查看进度。</p>`}
      <div style="margin-top:12px;font-size:0.85rem;">
        <strong>存放建议：</strong>货币基金（余额宝/微信零钱通等），随时可取，年化约 1.5-2%。<br>
        <strong>不要存在：</strong>股票账户或定期存款（取出有延迟或有损失）。
      </div>
    `;
  }

  function renderDCATool(container) {
    const fmt = n => Math.round(n).toLocaleString('zh-CN');
    container.innerHTML = `
      <div class="st-desc">定投的核心是"纪律性"，不是选时机。每月固定买，长期持有，市场震荡帮你降低均价。</div>
      <div class="st-form-row">
        <div class="st-field">
          <label>每月定投金额（元）</label>
          <input id="dca-monthly" type="number" value="500" class="st-input" min="100" />
        </div>
        <div class="st-field">
          <label>预期年化收益率（%）</label>
          <input id="dca-rate" type="number" value="7" step="0.5" class="st-input" />
        </div>
      </div>
      <button class="st-calc-btn" id="st-calc-dca">计算定投收益</button>
      <div id="st-dca-result" style="margin-top:14px;"></div>
      <div style="margin-top:12px;font-size:0.82rem;color:#475569;">
        <strong>推荐起点：</strong>
        沪深300 ETF（510300 / 159919）— A股宽基，费率低，跟踪300家大公司。<br>
        标普500 QDII（513500 / 159632）— 境外分散，人民币购买，对冲汇率风险。<br>
        两者各买一半是最简单的双轮配置起点。
      </div>
    `;
    container.querySelector('#st-calc-dca').addEventListener('click', () => {
      const monthly = parseFloat(document.getElementById('dca-monthly').value) || 500;
      const rate = (parseFloat(document.getElementById('dca-rate').value) || 7) / 100;
      const years = [5, 10, 20, 30];
      let rows = years.map(y => {
        const n = y * 12;
        const r = rate / 12;
        const fv = monthly * ((Math.pow(1 + r, n) - 1) / r);
        const cost = monthly * n;
        const gain = fv - cost;
        return `<tr>
          <td>${y} 年</td>
          <td>${fmt(cost)} 元</td>
          <td style="color:#16a34a;font-weight:600;">${fmt(fv)} 元</td>
          <td style="color:#2563eb;">${fmt(gain)} 元（${Math.round(gain / cost * 100)}%）</td>
        </tr>`;
      }).join('');
      document.getElementById('st-dca-result').innerHTML = `
        <table class="st-table">
          <tr><th>年限</th><th>总投入</th><th>最终资产</th><th>收益</th></tr>
          ${rows}
        </table>
        <p style="font-size:0.78rem;color:#94a3b8;margin-top:6px;">每月 ${fmt(monthly)} 元，年化 ${(rate*100).toFixed(1)}%，复利计算。实际收益受市场波动影响。</p>
      `;
    });
  }

  function renderSavingsOptimizer(container) {
    const getVal = id => { const el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; };
    const income = getVal('annualIncome');
    const expenses = getVal('annualExpenses');
    const currentSavingsRate = income > 0 ? Math.round((income - expenses) / income * 100) : 30;
    const fmt = n => Math.round(n).toLocaleString('zh-CN');

    function yearsToFIRE(savingsRate) {
      // 基于储蓄率的简化公式（假设收益率7%，初始资产=0）
      const r = 0.07;
      const s = savingsRate / 100;
      if (s <= 0) return null;
      // FIRE目标 = 年支出/4% = 年收入×(1-s)/0.04
      // 年储蓄 = 年收入×s
      // n = ln((目标×r + 储蓄)/(储蓄)) / ln(1+r)  (初始资产=0)
      const annualIncome = 100; // 归一化
      const annualSavings = annualIncome * s;
      const annualExpenses = annualIncome * (1 - s);
      const target = annualExpenses / 0.04;
      const n = Math.log((target * r + annualSavings) / annualSavings) / Math.log(1 + r);
      return Math.ceil(n);
    }

    const rates = [10, 20, 30, 40, 50, 60, 70];
    let rows = rates.map(rate => {
      const yrs = yearsToFIRE(rate);
      const isCurrentApprox = Math.abs(rate - currentSavingsRate) <= 5;
      const rowStyle = isCurrentApprox ? 'background:#eff6ff;' : '';
      return `<tr style="${rowStyle}">
        <td style="padding:6px 10px;">${rate}%${isCurrentApprox ? ' <span style="background:#bfdbfe;color:#1e40af;font-size:0.72rem;padding:1px 5px;border-radius:3px;">约为你</span>' : ''}</td>
        <td style="padding:6px 10px;text-align:right;">${income > 0 ? fmt(income * rate / 100) : '—'} 元</td>
        <td style="padding:6px 10px;text-align:right;font-weight:600;color:${yrs <= 20 ? '#16a34a' : yrs <= 35 ? '#2563eb' : '#64748b'}">${yrs !== null ? yrs + ' 年' : '>100年'}</td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <div class="st-desc">储蓄率是 FIRE 最大的单一杠杆。收益率从5%提升到7%很难，但储蓄率从30%提升到40%只需少花一点。</div>
      <table class="st-table" style="margin-top:8px;">
        <tr><th>储蓄率</th><th>年储蓄${income > 0 ? '（基于你的收入）' : ''}</th><th>FIRE 年限</th></tr>
        ${rows}
      </table>
      <p style="font-size:0.78rem;color:#94a3b8;margin-top:6px;">假设年化收益率7%，初始资产为零。你已有的积累会进一步缩短年限。</p>
      <div style="margin-top:10px;font-size:0.84rem;color:#475569;">
        <strong>提升储蓄率最快的方式：</strong>
        找到最大的单项支出（通常是房租/购车/外食），砍掉或替换，而不是省很多小钱。
      </div>
    `;
  }

  function renderOptimizeTool(container) {
    container.innerHTML = `
      <div class="st-desc">你已有良好储蓄习惯。现在的重点是让钱更高效地工作——资产配置比例比选股更重要。</div>
      <div style="margin-top:10px;font-size:0.85rem;">
        <strong>配置优化检查清单：</strong>
        <ol style="margin:8px 0 0 16px;line-height:1.8;color:#475569;">
          <li>确认可投资资产中股票比例是否符合"100 - 年龄"规则</li>
          <li>A股和境外资产是否有分散（建议境外 ≥ 40%）</li>
          <li>是否有黄金对冲通胀（建议 5-10%）</li>
          <li>上次再平衡是否超过1年，偏离目标比例是否 > 5%</li>
          <li>单只基金费率是否 < 0.5%（指数基金应在 0.1-0.15%）</li>
        </ol>
      </div>
      <div style="margin-top:10px;padding:10px 12px;background:#f0fdf4;border-radius:8px;font-size:0.84rem;">
        👆 填写下方主计算器，生成你的专属配置方案。
      </div>
    `;
  }

  function renderSprintTool(container) {
    container.innerHTML = `
      <div class="st-desc">你已接近 FIRE 终点。现在关注的不是"存多少"，而是"怎么用"。</div>
      <div style="margin-top:10px;font-size:0.85rem;">
        <strong>冲刺阶段核心问题：</strong>
        <ol style="margin:8px 0 0 16px;line-height:1.9;color:#475569;">
          <li><strong>Coast FIRE 确认</strong>：是否已到达可以停止储蓄的数字？（主计算器会显示）</li>
          <li><strong>Barista FIRE</strong>：如果 FIRE 还有几年，是否可以换低压工作+被动收入覆盖支出？</li>
          <li><strong>提取策略</strong>：4% 法则按年提取，建议持有 1-2 年现金缓冲，避免在熊市卖出</li>
          <li><strong>税务规划</strong>：在正式退休前，是否充分利用个人养老金账户节税？</li>
          <li><strong>退休生活设计</strong>：退休后做什么？地点、节奏、社交——这比资产计划更难</li>
        </ol>
      </div>
    `;
  }

  // ---- 插入舞台工具 ----

  function renderStageTool() {
    const stage = localStorage.getItem(STAGE_KEY);
    if (!stage) return;

    const existing = document.getElementById('stage-tool-panel');
    if (existing) existing.remove();

    const LABELS = {
      debt: { title: '🚨 债务清偿计算器', color: '#fef2f2', border: '#dc2626', fn: renderDebtTool },
      emergency: { title: '🛡️ 应急金进度', color: '#fffbeb', border: '#f59e0b', fn: renderEmergencyTool },
      start: { title: '🌱 定投启动计算器', color: '#f0fdf4', border: '#10b981', fn: renderDCATool },
      savings: { title: '⚡ 储蓄率优化器', color: '#eff6ff', border: '#2563eb', fn: renderSavingsOptimizer },
      optimize: { title: '📈 配置优化指引', color: '#f5f3ff', border: '#7c3aed', fn: renderOptimizeTool },
      sprint: { title: '🔥 冲刺 FIRE 清单', color: '#fdf4ff', border: '#c026d3', fn: renderSprintTool },
    };

    const cfg = LABELS[stage];
    if (!cfg) return;

    const wrap = document.createElement('div');
    wrap.id = 'stage-tool-panel';
    wrap.style.cssText = `background:${cfg.color};border:2px solid ${cfg.border};border-radius:14px;padding:16px;margin-bottom:16px;`;
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;">
        <strong style="font-size:0.95rem;color:#0f172a;">${cfg.title}</strong>
        <button id="st-toggle" style="background:none;border:1px solid #cbd5e1;border-radius:6px;padding:3px 10px;font-size:0.78rem;color:#64748b;cursor:pointer;">收起 ▲</button>
      </div>
      <div id="st-content"></div>
    `;

    // Insert after stage badge or before the panel
    const badge = document.getElementById('stage-badge-bar');
    const panel = document.querySelector('.panel');
    if (badge && badge.nextSibling) {
      badge.parentNode.insertBefore(wrap, badge.nextSibling);
    } else if (panel) {
      panel.parentNode.insertBefore(wrap, panel);
    }

    cfg.fn(wrap.querySelector('#st-content'));

    // Toggle
    let collapsed = false;
    wrap.querySelector('#st-toggle').addEventListener('click', () => {
      collapsed = !collapsed;
      const content = wrap.querySelector('#st-content');
      content.style.display = collapsed ? 'none' : '';
      wrap.querySelector('#st-toggle').textContent = collapsed ? '展开 ▼' : '收起 ▲';
    });
  }

  window.fireStageTool = { render: renderStageTool };

  // Run after DOM + onboarding badge is placed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(renderStageTool, 100));
  } else {
    setTimeout(renderStageTool, 100);
  }
})();
