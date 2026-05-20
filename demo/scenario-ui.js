// 多方案对比 UI（ESM 模块）
import { compareScenarios } from './calculators/scenario.js';

const SCENARIOS_KEY = 'fire_scenarios_v1';
const MAX_SCENARIOS = 4;
const $ = (id) => document.getElementById(id);
const fmt = n => Number.isFinite(n) ? Math.round(n).toLocaleString('zh-CN') : '—';

function loadScenarios() {
  try { return JSON.parse(localStorage.getItem(SCENARIOS_KEY) || '[]'); }
  catch { return []; }
}
function saveScenarios(arr) {
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify(arr));
}

export function captureCurrentScenario(name) {
  const r = window._lastReport;
  if (!r) return null;
  return {
    id: 'sc_' + Date.now(),
    name: name || `方案 ${loadScenarios().length + 1}`,
    age: r.age,
    annualIncome: r.annualIncome,
    annualExpenses: r.annualExpenses,
    annualSavings: r.annualSavings,
    monthlyPassiveIncome: r.monthlyPassiveIncome,
    expectedReturnRate: r.expectedReturn,
    investableAssets: r.investableAssets,
    retirementLifestyle: r.retirementLifestyle,
  };
}

export function addScenarioFromCurrent(name) {
  const sc = captureCurrentScenario(name);
  if (!sc) return false;
  const arr = loadScenarios();
  if (arr.length >= MAX_SCENARIOS) arr.shift();
  arr.push(sc);
  saveScenarios(arr);
  renderScenariosPanel();
  return true;
}

export function clearScenarios() {
  localStorage.removeItem(SCENARIOS_KEY);
  renderScenariosPanel();
}

export function removeScenario(id) {
  saveScenarios(loadScenarios().filter(s => s.id !== id));
  renderScenariosPanel();
}

function renderScenariosPanel() {
  const panel = $('scenarios-panel');
  if (!panel) return;
  const arr = loadScenarios();

  if (arr.length === 0) {
    panel.innerHTML = `
      <p style="color:#94a3b8;font-size:0.88rem;padding:8px 0;">
        生成 FIRE 计划后，点击"加入对比"保存当前参数。最多保存 ${MAX_SCENARIOS} 个，并排展示差异。
      </p>`;
    return;
  }

  const cmp = compareScenarios(arr);
  const rows = cmp.map(s => `
    <tr style="border-bottom:1px solid #f1f5f9;${s.isBaseline ? 'background:#eff6ff;' : ''}">
      <td style="padding:7px 8px;">
        ${s.name}${s.isBaseline ? ' <span style="background:#bfdbfe;color:#1e40af;font-size:0.7rem;padding:1px 5px;border-radius:3px;">基准</span>' : ''}
        <button onclick="window.fireScenarios.remove('${s.id}')" style="margin-left:6px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:0.78rem;">✕</button>
      </td>
      <td style="padding:7px 8px;text-align:right;">${fmt(s.fireTarget)}</td>
      <td style="padding:7px 8px;text-align:right;font-weight:600;">${s.yearsToFI === null ? '>100' : s.yearsToFI + ' 年'}</td>
      <td style="padding:7px 8px;text-align:right;">${s.fiAge ?? '—'}</td>
      <td style="padding:7px 8px;text-align:right;">${(s.savingsRate * 100).toFixed(1)}%</td>
      <td style="padding:7px 8px;text-align:right;color:${s.yearsDelta > 0 ? '#16a34a' : s.yearsDelta < 0 ? '#dc2626' : '#94a3b8'};">
        ${s.isBaseline ? '—' : s.yearsDelta === null ? '—' : (s.yearsDelta > 0 ? `提前 ${s.yearsDelta} 年` : s.yearsDelta < 0 ? `推后 ${-s.yearsDelta} 年` : '持平')}
      </td>
    </tr>`).join('');

  panel.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem;min-width:600px;">
        <thead>
          <tr style="border-bottom:2px solid #e2e8f0;">
            <th style="text-align:left;padding:7px 8px;color:#64748b;">方案</th>
            <th style="text-align:right;padding:7px 8px;color:#64748b;">FIRE 目标</th>
            <th style="text-align:right;padding:7px 8px;color:#64748b;">达成年限</th>
            <th style="text-align:right;padding:7px 8px;color:#64748b;">FIRE 年龄</th>
            <th style="text-align:right;padding:7px 8px;color:#64748b;">储蓄率</th>
            <th style="text-align:right;padding:7px 8px;color:#64748b;">vs 基准</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div style="text-align:right;margin-top:6px;">
      <button onclick="window.fireScenarios.clear()" style="font-size:0.75rem;color:#94a3b8;background:none;border:none;cursor:pointer;text-decoration:underline;">清除所有方案</button>
    </div>`;
}

export function initScenarios() {
  window.fireScenarios = {
    add: addScenarioFromCurrent,
    remove: removeScenario,
    clear: clearScenarios,
    render: renderScenariosPanel,
  };
  renderScenariosPanel();
}
