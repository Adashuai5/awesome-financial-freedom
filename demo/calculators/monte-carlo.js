// 蒙特卡洛 FIRE 模拟：累积期与退休期成功率
// 模型：年化收益服从对数正态分布 N(μ-σ²/2, σ²)，每年独立。
// 默认 σ（年化波动率）：
//   高风险（股票为主）≈ 18%
//   中风险（混合）  ≈ 12%
//   低风险（债券为主）≈ 6%
// 不是 macroeconomic forecast——只是用历史一阶矩做粗略不确定性带，比"假设固定 7%"诚实。

const RISK_SIGMA = { low: 0.06, medium: 0.12, high: 0.18 };

// 标准正态 Box-Muller
function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function logNormalReturn(mu, sigma) {
  // 年回报 r 使得 1+r ~ LogNormal(mu - sigma²/2, sigma²)，期望 = e^μ
  const drift = mu - 0.5 * sigma * sigma;
  return Math.exp(drift + sigma * randn()) - 1;
}

function quantile(sorted, p) {
  if (sorted.length === 0) return null;
  const idx = Math.max(0, Math.min(sorted.length - 1, Math.floor(p * sorted.length)));
  return sorted[idx];
}

// 累积期 MC：N 次试验，每次模拟 horizonYears 年，记录是否在该年到达 fireTarget
// 返回：{ successRate, medianYears, p5Years, p95Years, allYears }
export function monteCarloAccumulation({
  investableAssets,
  annualSavings,
  fireTarget,
  expectedReturn,
  sigma,
  horizonYears = 50,
  trials = 1000,
}) {
  if (fireTarget <= 0) return { successRate: 1, medianYears: 0 };
  const mu = Math.log(1 + expectedReturn);
  const yearsReached = [];
  for (let t = 0; t < trials; t++) {
    let balance = investableAssets;
    let reached = null;
    for (let yr = 1; yr <= horizonYears; yr++) {
      const r = logNormalReturn(mu, sigma);
      balance = balance * (1 + r) + annualSavings;
      if (balance >= fireTarget) { reached = yr; break; }
    }
    yearsReached.push(reached);
  }
  const success = yearsReached.filter(y => y !== null);
  const successRate = success.length / trials;
  const sortedSuccess = success.slice().sort((a, b) => a - b);
  return {
    successRate,
    medianYears: quantile(sortedSuccess, 0.5),
    p5Years: quantile(sortedSuccess, 0.05),
    p95Years: quantile(sortedSuccess, 0.95),
    trials,
    horizonYears,
  };
}

// 退休期 MC：从 fireTarget 开始，每年取 annualWithdrawal（通胀调整 = withdrawalGrowth）
// 模拟 retirementYears 年，记录"未破产"概率（终值 > 0）
export function monteCarloRetirement({
  startingBalance,
  annualWithdrawal,
  expectedReturn,
  sigma,
  inflation = 0.03,
  retirementYears = 30,
  trials = 1000,
}) {
  const mu = Math.log(1 + expectedReturn);
  let successCount = 0;
  const endBalances = [];
  for (let t = 0; t < trials; t++) {
    let balance = startingBalance;
    let withdraw = annualWithdrawal;
    let bankrupt = false;
    for (let yr = 1; yr <= retirementYears; yr++) {
      balance -= withdraw;
      if (balance <= 0) { bankrupt = true; break; }
      const r = logNormalReturn(mu, sigma);
      balance = balance * (1 + r);
      withdraw *= (1 + inflation);
    }
    if (!bankrupt) successCount++;
    endBalances.push(Math.max(0, balance));
  }
  endBalances.sort((a, b) => a - b);
  return {
    successRate: successCount / trials,
    medianEndBalance: quantile(endBalances, 0.5),
    p5EndBalance: quantile(endBalances, 0.05),
    p95EndBalance: quantile(endBalances, 0.95),
    trials,
    retirementYears,
  };
}

export function sigmaForRisk(riskTolerance) {
  return RISK_SIGMA[riskTolerance] ?? RISK_SIGMA.medium;
}
