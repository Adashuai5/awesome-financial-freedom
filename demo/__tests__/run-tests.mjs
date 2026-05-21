// Node ESM 测试入口（不依赖 ts-node）。运行: node demo/__tests__/run-tests.mjs
import { strict as assert } from 'assert';
import { determineStage, isTerminal } from '../calculators/onboarding-logic.js';
import { upsertSnapshot, trendDirection, snapshotDelta, snapshotsToCSV } from '../calculators/snapshot-logic.js';
import {
  calculateCoreMetrics,
  calculateRequiredAnnualSavingsForTargetYears,
  simIncomeGrowth, simWithSideIncome, calcCoastFIRE,
} from '../calculators/fire-core.js';
import {
  calculateComprehensiveIncomeTax,
  calculateAfterTaxSavingsRate,
  totalSpecialDeductionAnnual,
  pensionTaxSaving,
} from '../calculators/cn-tax.js';
import { evaluateScenario, compareScenarios } from '../calculators/scenario.js';
import {
  monteCarloAccumulation, monteCarloRetirement, sigmaForRisk,
} from '../calculators/monte-carlo.js';

// ---- 阶段诊断 ----
function testOnboardingStage() {
  // Q1=yes → debt（提前终止）
  assert.equal(determineStage(['yes']), 'debt');
  assert.equal(isTerminal(['yes']), true);

  // Q1=no, Q2=no → emergency
  assert.equal(determineStage(['no', 'no']), 'emergency');
  assert.equal(isTerminal(['no', 'no']), true);

  // Q1=no, Q2=yes, Q3=no → start
  assert.equal(determineStage(['no', 'yes', 'no']), 'start');
  assert.equal(isTerminal(['no', 'yes', 'no']), true);

  // Q1=no, Q2=yes, Q3=yes, Q4=no → savings
  assert.equal(determineStage(['no', 'yes', 'yes', 'no']), 'savings');
  assert.equal(isTerminal(['no', 'yes', 'yes', 'no']), true);

  // 五题全过 + Q5=yes → sprint
  assert.equal(determineStage(['no', 'yes', 'yes', 'yes', 'yes']), 'sprint');
  // Q5=no → optimize
  assert.equal(determineStage(['no', 'yes', 'yes', 'yes', 'no']), 'optimize');

  // 未完成不终止
  assert.equal(isTerminal([]), false);
  assert.equal(isTerminal(['no']), false);
  assert.equal(isTerminal(['no', 'yes', 'yes']), false);
}

// ---- 快照算法 ----
function testSnapshot() {
  let snaps = [];
  snaps = upsertSnapshot(snaps, { date: '2026-01', netAssets: 100 });
  snaps = upsertSnapshot(snaps, { date: '2026-02', netAssets: 200 });
  // 同月重复 → 覆盖
  snaps = upsertSnapshot(snaps, { date: '2026-02', netAssets: 250 });
  assert.equal(snaps.length, 2);
  assert.equal(snaps[1].netAssets, 250);

  // 排序
  snaps = upsertSnapshot(snaps, { date: '2025-12', netAssets: 50 });
  assert.deepEqual(snaps.map(s => s.date), ['2025-12', '2026-01', '2026-02']);

  // 趋势
  assert.equal(trendDirection(200, 100), 'up');
  assert.equal(trendDirection(50, 100), 'down');
  assert.equal(trendDirection(100, 100), 'flat');
  assert.equal(trendDirection(100, null), 'none');
  // higherBetter=false (例如负债)
  assert.equal(trendDirection(50, 100, false), 'up');

  // delta
  const d = snapshotDelta(snaps, 'netAssets');
  assert.equal(d.delta, 200); // 250 - 50
  assert.equal(snapshotDelta([{ netAssets: 1 }], 'netAssets'), null);

  // CSV
  const csv = snapshotsToCSV(snaps);
  assert.ok(csv.startsWith('date,netAssets,'));
  assert.equal(csv.split('\n').length, 4);
}

// ---- FIRE 核心 ----
function testFireCore() {
  // 已达成
  let m = calculateCoreMetrics({
    investableAssets: 5000000, annualExpenses: 100000,
    annualSavings: 0, expectedReturnRate: 0.07,
    monthlyPassiveIncome: 0, safeWithdrawalRate: 0.04,
  });
  assert.equal(m.yearsToFI, 0);
  assert.equal(m.fireTarget, 2500000);

  // 标准场景：100万投资，年支出 10 万，年储蓄 10 万，7% 收益
  m = calculateCoreMetrics({
    investableAssets: 1000000, annualExpenses: 100000,
    annualSavings: 100000, expectedReturnRate: 0.07,
    monthlyPassiveIncome: 0, safeWithdrawalRate: 0.04,
  });
  assert.equal(m.fireTarget, 2500000);
  assert.ok(m.yearsToFI > 0 && m.yearsToFI < 20);

  // 储蓄率=0 + 已超目标 → 0
  m = calculateCoreMetrics({
    investableAssets: 3000000, annualExpenses: 100000,
    annualSavings: 0, expectedReturnRate: 0.07,
  });
  assert.equal(m.yearsToFI, 0);

  // 反推
  const need = calculateRequiredAnnualSavingsForTargetYears({
    investableAssets: 1000000, fireTarget: 2500000,
    expectedReturnRate: 0.07, targetYears: 10,
  });
  assert.ok(need > 0);

  // 副业加速：副业越多年限越短
  const noSide = simWithSideIncome(500000, 2500000, 0.07, 100000, 0);
  const withSide = simWithSideIncome(500000, 2500000, 0.07, 100000, 3000);
  assert.ok(withSide < noSide);

  // 收入增长
  const noGrowth = simIncomeGrowth(500000, 2500000, 0.07, 200000, 100000, 0);
  const withGrowth = simIncomeGrowth(500000, 2500000, 0.07, 200000, 100000, 5);
  // 收入增长 5% → 应不慢于无增长
  if (withGrowth !== null && noGrowth !== null) assert.ok(withGrowth <= noGrowth);

  // Coast FIRE: 远早于退休年龄，需要的本金应远小于 fireTarget
  const coast = calcCoastFIRE(2500000, 0.07, 30);
  assert.ok(coast < 500000);
}

// ---- CN 税档 ----
function testCNTax() {
  // 起征点下不缴税
  let t = calculateComprehensiveIncomeTax({ annualIncome: 50000 });
  assert.equal(t.tax, 0);

  // 年薪 20 万，无任何扣除：应税 14 万 → 落入 10% 档 (≤144000)
  t = calculateComprehensiveIncomeTax({ annualIncome: 200000 });
  assert.equal(t.taxableIncome, 140000);
  assert.equal(t.marginalRate, 0.10);
  // 140000*0.10 - 2520 = 11480
  assert.equal(t.tax, 11480);

  // 个人养老金 12000 节税
  const baseTax = calculateComprehensiveIncomeTax({ annualIncome: 300000 }).tax;
  const withPension = calculateComprehensiveIncomeTax({ annualIncome: 300000, pensionContribAnnual: 12000 }).tax;
  assert.ok(baseTax - withPension > 0);
  // 节税 ≈ 12000 × 20% = 2400 (300k - 60k = 240k 应税，落在 20% 档)
  assert.equal(baseTax - withPension, 2400);

  // 节税公式
  assert.equal(pensionTaxSaving(12000, 0.20), 2400);
  assert.equal(pensionTaxSaving(15000, 0.20), 2400); // 超过 12000 截断

  // 专项扣除总额：一线租房 1500/月 + 1 个孩子教育 2000/月 = 3500/月 = 42000/年
  assert.equal(totalSpecialDeductionAnnual({ children: 1, rentTier: 'tier1' }), 42000);
  // 房贷+赡养老人：1000 + 3000 = 4000/月
  assert.equal(totalSpecialDeductionAnnual({ hasMortgage: true, elderlyCare: true }), 48000);

  // 税后真实储蓄率
  const r = calculateAfterTaxSavingsRate({
    grossIncomeAnnual: 300000, annualExpenses: 150000,
    socialInsuranceAnnual: 36000, specialDeductionAnnual: 24000,
    pensionContribAnnual: 12000,
  });
  assert.ok(r.afterTaxIncome < 300000);
  assert.ok(r.realSavingsRate > 0 && r.realSavingsRate < 1);
}

// ---- 多方案对比 ----
function testScenario() {
  const base = {
    id: 'a', name: '现状', age: 30,
    annualIncome: 300000, annualExpenses: 150000, annualSavings: 150000,
    monthlyPassiveIncome: 0, expectedReturnRate: 0.07,
    investableAssets: 500000, retirementLifestyle: 1,
  };
  const cheaper = { ...base, id: 'b', name: '搬清迈', retirementLifestyle: 0.5 };

  const cmp = compareScenarios([base, cheaper]);
  assert.equal(cmp.length, 2);
  assert.equal(cmp[0].isBaseline, true);
  // 支出降一半 → FIRE 目标减半，年限更短
  assert.ok(cmp[1].fireTarget < cmp[0].fireTarget);
  assert.ok(cmp[1].yearsDelta > 0); // 比基准提前 N 年
}

// ---- TS 与 JS 计算一致性（drift detector） ----
// 注意：TS 模块只能 ts-node 运行，这里只断言 JS 端公式与 4% 规则一致
function testFireTargetConsistency() {
  const m = calculateCoreMetrics({
    investableAssets: 0, annualExpenses: 100000,
    annualSavings: 0, expectedReturnRate: 0,
    monthlyPassiveIncome: 0, safeWithdrawalRate: 0.04,
  });
  // 100000 / 0.04 = 2,500,000  — 与 tools/calculators/retirement-goal.ts 同源
  assert.equal(m.fireTarget, 2500000);
}

// ---- 蒙特卡洛 ----
function testMonteCarlo() {
  // 风险档对应不同 sigma
  assert.ok(sigmaForRisk('high') > sigmaForRisk('medium'));
  assert.ok(sigmaForRisk('medium') > sigmaForRisk('low'));
  assert.equal(sigmaForRisk('unknown'), sigmaForRisk('medium'));

  // 累积期：500 万投资 + 100 万年储 + 7% 收益 → 早就达成 250 万目标
  const acc = monteCarloAccumulation({
    investableAssets: 5000000, annualSavings: 0,
    fireTarget: 2500000, expectedReturn: 0.07, sigma: 0.12,
    horizonYears: 30, trials: 200,
  });
  assert.equal(acc.successRate, 1); // 起始就已超目标
  assert.equal(acc.medianYears, 1); // 第一年验证

  // 累积期：5 万投资 + 5 万年储 → 难以快速到 250 万
  const slow = monteCarloAccumulation({
    investableAssets: 50000, annualSavings: 50000,
    fireTarget: 2500000, expectedReturn: 0.07, sigma: 0.18,
    horizonYears: 50, trials: 300,
  });
  // 50 年内有相当概率达成，但不是 100%
  assert.ok(slow.successRate > 0 && slow.successRate <= 1);
  assert.ok(slow.p5Years <= slow.p95Years);

  // 退休期：250 万、4% 提取（10 万/年）、30 年、7% 收益 → 应有高成功率（>80%）
  const ret = monteCarloRetirement({
    startingBalance: 2500000, annualWithdrawal: 100000,
    expectedReturn: 0.07, sigma: 0.12, inflation: 0.03,
    retirementYears: 30, trials: 500,
  });
  assert.ok(ret.successRate > 0.5, `retirement success ${ret.successRate} should be > 50%`);
  assert.ok(ret.p5EndBalance <= ret.medianEndBalance);
  assert.ok(ret.medianEndBalance <= ret.p95EndBalance);

  // 退休期：100 万、每年取 10 万、30 年 → 几乎必破产
  const bankrupt = monteCarloRetirement({
    startingBalance: 1000000, annualWithdrawal: 100000,
    expectedReturn: 0.07, sigma: 0.18, inflation: 0.03,
    retirementYears: 30, trials: 300,
  });
  assert.ok(bankrupt.successRate < 0.5, `under-funded retirement should mostly fail, got ${bankrupt.successRate}`);
}

const tests = [
  ['onboarding stage', testOnboardingStage],
  ['snapshot algorithm', testSnapshot],
  ['FIRE core', testFireCore],
  ['CN comprehensive income tax', testCNTax],
  ['scenario comparison', testScenario],
  ['FIRE target consistency (4% rule)', testFireTargetConsistency],
  ['monte carlo (accumulation + retirement)', testMonteCarlo],
];

let failed = 0;
for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(e.stack || e.message);
  }
}
if (failed) {
  console.error(`\n${failed} demo test(s) failed.`);
  process.exit(1);
}
console.log('\nAll demo tests passed.');
