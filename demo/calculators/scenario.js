// 多方案对比器：在统一参数集上 evaluate 出 FIRE 年限/年龄/目标
import { calculateCoreMetrics } from './fire-core.js';

// scenario = { id, name, age, annualIncome, annualExpenses, annualSavings,
//              monthlyPassiveIncome, expectedReturnRate, investableAssets,
//              retirementLifestyle }
export function evaluateScenario(scenario) {
  const annualExpenses = scenario.annualExpenses * (scenario.retirementLifestyle ?? 1);
  const m = calculateCoreMetrics({
    investableAssets: scenario.investableAssets,
    annualExpenses,
    annualSavings: scenario.annualSavings,
    expectedReturnRate: scenario.expectedReturnRate,
    monthlyPassiveIncome: scenario.monthlyPassiveIncome,
    safeWithdrawalRate: 0.04,
    emergencyFundMonths: 0,
    totalAssets: 0,
    totalLiabilities: 0,
  });
  return {
    id: scenario.id,
    name: scenario.name,
    fireTarget: m.fireTarget,
    yearsToFI: m.yearsToFI,
    fiAge: m.yearsToFI !== null ? scenario.age + m.yearsToFI : null,
    savingsRate: scenario.annualIncome > 0 ? scenario.annualSavings / scenario.annualIncome : 0,
    progressPct: m.progressPct,
  };
}

// 对一组 scenarios，返回与"基准"的差额（基准 = 第一个 scenario）
export function compareScenarios(scenarios) {
  const evals = scenarios.map(evaluateScenario);
  const base = evals[0];
  return evals.map((s, i) => ({
    ...s,
    isBaseline: i === 0,
    yearsDelta: (base.yearsToFI !== null && s.yearsToFI !== null)
      ? base.yearsToFI - s.yearsToFI
      : null,
    targetDelta: s.fireTarget - base.fireTarget,
  }));
}
