// 内联知识卡片：根据计算结果挑选相关知识节点 summary，注入到结果区
// 数据由 tools/build-knowledge-cards.js 从 knowledge/nodes/*.json 自动生成。
// 若改了节点内容，记得运行 `npm run build:knowledge-cards` 同步。
import { KNOWLEDGE_CARDS } from './calculators/knowledge-data.js';

// 根据计算结果，挑选 2-4 个最相关的卡片
export function pickRelevantCards(report) {
  const out = [];
  if (!report) return out;

  // 进度 < 30% → 储蓄率 + 应急金
  if (report.progressPct < 30) {
    out.push(KNOWLEDGE_CARDS['savings-rate']);
    out.push(KNOWLEDGE_CARDS['emergency-fund']);
  }
  // 接近或已达 Coast → fire-types (含 Coast 介绍)
  if (report.alreadyCoasting || (report.coastNumber && report.investableAssets >= report.coastNumber * 0.7)) {
    out.push(KNOWLEDGE_CARDS['fire-types']);
  }
  // 配置建议总会展示双轮配置
  out.push(KNOWLEDGE_CARDS['dual-wheel-allocation']);
  // 公积金 > 0 → 公积金优化
  if (report.housingFund > 0) {
    out.push(KNOWLEDGE_CARDS['housing-fund-optimization']);
  }
  // 总是展示 4% 法则（基础假设）
  out.push(KNOWLEDGE_CARDS['four-percent-rule']);

  // 去重 + 限 4 张
  const seen = new Set();
  return out.filter(c => c && !seen.has(c.title) && seen.add(c.title)).slice(0, 4);
}

export function renderKnowledgeCardsHTML(report) {
  const cards = pickRelevantCards(report);
  if (cards.length === 0) return '';

  const items = cards.map(c => `
    <div style="background:#f8fafc;border-left:3px solid #2563eb;border-radius:8px;padding:12px 14px;margin-bottom:8px;">
      <div style="font-weight:700;color:#0f172a;margin-bottom:4px;">📚 ${c.title}</div>
      <div style="font-size:0.85rem;color:#334155;margin-bottom:6px;">${c.summary}</div>
      <details style="font-size:0.8rem;color:#64748b;">
        <summary style="cursor:pointer;color:#2563eb;">展开 ${c.limitations.length} 个局限</summary>
        <ul style="margin:4px 0 0 18px;line-height:1.6;">
          ${c.limitations.map(l => `<li>${l}</li>`).join('')}
        </ul>
      </details>
    </div>`).join('');

  return `
    <div class="result-actions-label" style="margin-top:20px;">📖 相关知识（点击展开局限性）</div>
    ${items}
    <p style="font-size:0.78rem;color:#94a3b8;margin-top:4px;">
      完整节点见 <code>knowledge/nodes/</code>。所有计算都基于这些公开规则，可追溯。
    </p>`;
}
