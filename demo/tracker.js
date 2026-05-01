// 财务快照追踪 - 月度净资产记录与历史趋势
(function () {
  const SNAPSHOTS_KEY = 'fire_snapshots_v1';

  function getSnapshots() {
    try {
      return JSON.parse(localStorage.getItem(SNAPSHOTS_KEY) || '[]');
    } catch { return []; }
  }

  function saveSnapshot(data) {
    const snapshots = getSnapshots();
    const date = new Date().toISOString().slice(0, 7); // YYYY-MM
    const idx = snapshots.findIndex(s => s.date === date);
    const snap = { date, ...data };
    if (idx >= 0) snapshots[idx] = snap;
    else snapshots.push(snap);
    snapshots.sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
    return snapshots;
  }

  function fmt(n) { return Math.round(n).toLocaleString('zh-CN'); }

  function trend(curr, prev, higherBetter = true) {
    if (prev == null) return '';
    if (curr === prev) return '<span style="color:#94a3b8">—</span>';
    const better = higherBetter ? curr > prev : curr < prev;
    return better
      ? '<span style="color:#10b981;font-weight:700">↑</span>'
      : '<span style="color:#dc2626;font-weight:700">↓</span>';
  }

  function renderSparkline(snapshots) {
    if (snapshots.length < 2) return '';
    const vals = snapshots.map(s => s.netAssets);
    const maxV = Math.max(...vals);
    const minV = Math.min(...vals);
    const range = maxV - minV || 1;
    const W = 100, H = 30, PAD = 3;

    const pts = snapshots.map((s, i) => {
      const x = PAD + (i / (snapshots.length - 1)) * (W - PAD * 2);
      const y = PAD + (1 - (s.netAssets - minV) / range) * (H - PAD * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const dots = snapshots.map((s, i) => {
      const x = PAD + (i / (snapshots.length - 1)) * (W - PAD * 2);
      const y = PAD + (1 - (s.netAssets - minV) / range) * (H - PAD * 2);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#2563eb"/>`;
    }).join('');

    return `<svg width="${W}" height="${H}" style="display:inline-block;vertical-align:middle;overflow:visible">
      <polyline points="${pts}" fill="none" stroke="#2563eb" stroke-width="1.5"/>
      ${dots}
    </svg>`;
  }

  function renderHistory() {
    const panel = document.getElementById('tracker-panel');
    if (!panel) return;
    const snapshots = getSnapshots();

    if (snapshots.length === 0) {
      panel.innerHTML = `<p style="color:#94a3b8;font-size:0.88rem;text-align:center;padding:16px 0;">还没有记录。生成计划后点击"保存本月快照"。</p>`;
      return;
    }

    const reversed = snapshots.slice().reverse();
    let rows = reversed.map((s, i) => {
      const prev = reversed[i + 1];
      const pct = (s.savingsRate * 100).toFixed(1);
      return `<tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:7px 8px;">${s.date}</td>
        <td style="padding:7px 8px;text-align:right;">${fmt(s.netAssets)} ${trend(s.netAssets, prev?.netAssets)}</td>
        <td style="padding:7px 8px;text-align:right;">${fmt(s.investableAssets)} ${trend(s.investableAssets, prev?.investableAssets)}</td>
        <td style="padding:7px 8px;text-align:right;">${s.progressPct}% ${trend(s.progressPct, prev?.progressPct)}</td>
        <td style="padding:7px 8px;text-align:right;">${pct}% ${trend(s.savingsRate, prev?.savingsRate)}</td>
      </tr>`;
    }).join('');

    const sparkline = renderSparkline(snapshots);
    const latest = snapshots[snapshots.length - 1];
    const oldest = snapshots[0];
    const nwDelta = latest.netAssets - oldest.netAssets;
    const deltaText = nwDelta >= 0
      ? `<span style="color:#10b981">+${fmt(nwDelta)} 元</span>`
      : `<span style="color:#dc2626">${fmt(nwDelta)} 元</span>`;

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:12px;flex-wrap:wrap;">
        <div style="font-size:0.85rem;color:#475569;">
          共 <strong>${snapshots.length}</strong> 条记录 ·
          净资产变化 ${deltaText}
          ${snapshots.length >= 2 ? `（${oldest.date} → ${latest.date}）` : ''}
        </div>
        ${snapshots.length >= 2 ? `<div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:0.75rem;color:#94a3b8;">净资产趋势</span>
          ${sparkline}
        </div>` : ''}
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.84rem;min-width:380px;">
          <thead>
            <tr style="border-bottom:2px solid #e2e8f0;">
              <th style="text-align:left;padding:7px 8px;color:#64748b;font-weight:600;">月份</th>
              <th style="text-align:right;padding:7px 8px;color:#64748b;font-weight:600;">净资产</th>
              <th style="text-align:right;padding:7px 8px;color:#64748b;font-weight:600;">可投资</th>
              <th style="text-align:right;padding:7px 8px;color:#64748b;font-weight:600;">FIRE进度</th>
              <th style="text-align:right;padding:7px 8px;color:#64748b;font-weight:600;">储蓄率</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="margin-top:8px;text-align:right;">
        <button onclick="window.fireTracker.clearAll()" style="font-size:0.75rem;color:#94a3b8;background:none;border:none;cursor:pointer;text-decoration:underline;">清除所有记录</button>
      </div>
    `;
  }

  function addSaveButton(reportData) {
    const existing = document.getElementById('save-snapshot-btn');
    if (existing) existing.remove();

    const btn = document.createElement('button');
    btn.id = 'save-snapshot-btn';
    btn.className = 'btn-secondary';
    btn.style.cssText = 'margin-top:14px;width:100%;font-size:0.9rem;';
    btn.textContent = '💾 保存本月快照';

    btn.addEventListener('click', () => {
      saveSnapshot({
        netAssets: reportData.netAssets,
        investableAssets: reportData.investableAssets,
        progressPct: reportData.progressPct,
        savingsRate: reportData.savingsRate,
        fireTarget: reportData.fireTarget,
        yearsToFI: reportData.yearsToFI,
        annualIncome: reportData.annualIncome,
        annualSavings: reportData.annualSavings,
      });
      btn.textContent = '✓ 已保存到本月记录';
      btn.style.background = '#10b981';
      btn.style.color = 'white';
      renderHistory();
      // Expand tracker section
      const sec = document.getElementById('tracker-section');
      if (sec) {
        sec.classList.remove('collapsed');
        sec.style.maxHeight = '800px';
        sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    const summary = document.getElementById('summary');
    if (summary) summary.appendChild(btn);
  }

  window.fireTracker = {
    addSaveButton,
    renderHistory,
    clearAll() {
      if (confirm('确认清除所有历史快照记录？')) {
        localStorage.removeItem(SNAPSHOTS_KEY);
        renderHistory();
      }
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHistory);
  } else {
    renderHistory();
  }
})();
