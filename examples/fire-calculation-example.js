#!/usr/bin/env node

/**
 * FIRE 计算示例
 * 演示如何使用 system.md 中定义的规则进行财务自由评估
 */

// ============ 系统常数定义（来自 prompts/system.md）============

const FIRE_CONSTANTS = {
  SWR: 0.04, // 安全提取率 4%
  INFLATION_RATE: 0.03, // 通胀率 3%
  RISK_ADJUSTED_RETURNS: {
    low: 0.05, // 低风险 5%
    medium: 0.07, // 中风险 7%
    high: 0.09, // 高风险 9%
  },
  EMERGENCY_FUND_MONTHS: {
    single: 6, // 单身 6 个月
    married: 9, // 已婚 9 个月
    with_dependents: 12, // 有子女或赡养 12 个月
  },
};

// ============ 用户财务数据示例 ============

const userData = {
  // 基本信息
  total_assets: 500000, // 总资产 50 万
  total_liabilities: 200000, // 总负债 20 万（含房贷）
  primary_residence_value: 1500000, // 自住房价值 150 万
  annual_fixed_expenses: 120000, // 年固定支出 12 万
  annual_savings: 60000, // 年储蓄 6 万
  monthly_passive_income: 3000, // 月被动收入 3000 元

  // 房产与负债
  mortgage_balance: 180000, // 房贷余额 18 万
  monthly_mortgage_payment: 3000, // 房贷月供 3000 元
  other_liabilities: 20000, // 其他负债 2 万
  mortgage_rate: 0.035, // 房贷利率 3.5%

  // 家庭责任
  family_status: "married", // 已婚
  dependents_count: 1, // 1 个子女

  // 投资偏好
  risk_tolerance: "medium", // 中等风险承受能力
  expected_return_rate: 0.07, // 预期 7% 年化收益
};

// ============ 核心计算函数 ============

/**
 * 计算应急金
 */
function calculateEmergencyFund(monthlyExpenses, familyStatus) {
  const months = FIRE_CONSTANTS.EMERGENCY_FUND_MONTHS[familyStatus] || 6;
  return monthlyExpenses * months;
}

/**
 * 计算可投资资产
 */
function calculateInvestableAssets(
  totalAssets,
  primaryResidenceValue,
  totalLiabilities,
  emergencyFund
) {
  return totalAssets - primaryResidenceValue - totalLiabilities - emergencyFund;
}

/**
 * 计算 FIRE 目标（保留房贷方案）
 */
function calculateFIRE_KeepMortgage(
  retirementMonthlyExpenses,
  monthlyMortgage,
  yearsToRetirement = 30
) {
  const retirementMonthlyTotal = retirementMonthlyExpenses + monthlyMortgage;
  const annualRetirementExpenses = retirementMonthlyTotal * 12;
  const requiredCapital = annualRetirementExpenses / FIRE_CONSTANTS.SWR;
  return requiredCapital;
}

/**
 * 计算 FIRE 目标（提前还清房贷方案）
 */
function calculateFIRE_PayOffMortgage(
  retirementMonthlyExpenses,
  mortgageBalance
) {
  const annualRetirementExpenses = retirementMonthlyExpenses * 12;
  const capitalForExpenses = annualRetirementExpenses / FIRE_CONSTANTS.SWR;
  const requiredCapital = capitalForExpenses + mortgageBalance;
  return requiredCapital;
}

/**
 * 计算达到 FIRE 的年限
 */
function calculateYearsToFIRE(
  requiredCapital,
  currentAssets,
  annualSavings,
  expectedReturn
) {
  if (currentAssets >= requiredCapital) {
    return 0;
  }

  const gap = requiredCapital - currentAssets;
  const futureValueOfAnnualSavings = annualSavings * (1 + expectedReturn);

  // 使用几何级数求和公式
  // FV = P * [((1 + r)^n - 1) / r]
  // 求解 n 使得 FV >= gap

  let years = 0;
  let accumulation = currentAssets;

  while (accumulation < requiredCapital && years < 100) {
    accumulation = accumulation * (1 + expectedReturn) + annualSavings;
    years++;
  }

  return years;
}

// ============ 执行计算 ============

console.log("═".repeat(60));
console.log("FIRE 财务自由评估 - 完整计算示例");
console.log("═".repeat(60));
console.log();

// 1. 计算应急金
const monthlyExpenses = userData.annual_fixed_expenses / 12;
const emergencyFund = calculateEmergencyFund(monthlyExpenses, userData.family_status);
console.log("📊 第 1 步：应急金计算");
console.log(`  月固定支出：¥${monthlyExpenses.toFixed(0)}`);
console.log(`  家庭状况：${userData.family_status}（${FIRE_CONSTANTS.EMERGENCY_FUND_MONTHS[userData.family_status]} 个月）`);
console.log(`  应急金目标：¥${emergencyFund.toFixed(0)}`);
console.log();

// 2. 计算可投资资产
const investableAssets = calculateInvestableAssets(
  userData.total_assets,
  userData.primary_residence_value,
  userData.total_liabilities,
  emergencyFund
);
console.log("💰 第 2 步：可投资资产计算");
console.log(`  总资产：¥${userData.total_assets.toFixed(0)}`);
console.log(`  减去自住房：¥${userData.primary_residence_value.toFixed(0)}`);
console.log(`  减去总负债：¥${userData.total_liabilities.toFixed(0)}`);
console.log(`  减去应急金：¥${emergencyFund.toFixed(0)}`);
console.log(`  可投资资产：¥${investableAssets.toFixed(0)}`);
console.log();

// 3. 计算 FIRE 目标
const retirementMonthlyExpenses = userData.annual_fixed_expenses / 12;
const fireTarget_KeepMortgage = calculateFIRE_KeepMortgage(
  retirementMonthlyExpenses,
  userData.monthly_mortgage_payment
);
const fireTarget_PayOffMortgage = calculateFIRE_PayOffMortgage(
  retirementMonthlyExpenses,
  userData.mortgage_balance
);

console.log("🎯 第 3 步：FIRE 目标计算");
console.log(`  预期退休月支出：¥${retirementMonthlyExpenses.toFixed(0)}`);
console.log(`  安全提取率（SWR）：${(FIRE_CONSTANTS.SWR * 100).toFixed(1)}%`);
console.log();
console.log("  方案 A（保留房贷）：");
console.log(`    退休月支出 = ¥${retirementMonthlyExpenses.toFixed(0)} + ¥${userData.monthly_mortgage_payment.toFixed(0)} = ¥${(retirementMonthlyExpenses + userData.monthly_mortgage_payment).toFixed(0)}`);
console.log(`    所需本金 = ¥${fireTarget_KeepMortgage.toFixed(0)}`);
console.log();
console.log("  方案 B（提前还清房贷）：");
console.log(`    所需本金 = ¥${fireTarget_PayOffMortgage.toFixed(0)}`);
console.log();

// 4. 计算达成时间
const yearsKeepMortgage = calculateYearsToFIRE(
  fireTarget_KeepMortgage,
  investableAssets,
  userData.annual_savings,
  userData.expected_return_rate
);
const yearsPayOffMortgage = calculateYearsToFIRE(
  fireTarget_PayOffMortgage,
  investableAssets,
  userData.annual_savings,
  userData.expected_return_rate
);

console.log("⏰ 第 4 步：达成时间预测");
console.log(`  当前可投资资产：¥${investableAssets.toFixed(0)}`);
console.log(`  年储蓄能力：¥${userData.annual_savings.toFixed(0)}`);
console.log(`  预期年化收益：${(userData.expected_return_rate * 100).toFixed(1)}%`);
console.log();
console.log(`  方案 A（保留房贷）：${yearsKeepMortgage} 年`);
console.log(`  方案 B（提前还清房贷）：${yearsPayOffMortgage} 年`);
console.log();

// 5. 最终建议
console.log("✅ 第 5 步：最终建议");
if (yearsPayOffMortgage < yearsKeepMortgage) {
  console.log(`  ✓ 建议优先选择【方案 B】，可提前 ${yearsKeepMortgage - yearsPayOffMortgage} 年达到 FIRE`);
  console.log(`  ✓ 房贷利率 ${(userData.mortgage_rate * 100).toFixed(2)}% < 预期收益 ${(userData.expected_return_rate * 100).toFixed(1)}%`);
} else {
  console.log(`  ✓ 建议优先选择【方案 A】，保留房贷，继续投资`);
  console.log(`  ✓ 用低成本债务进行投资配置`);
}

console.log();
console.log("═".repeat(60));
console.log("计算完成！这个示例演示了 system.md 中定义的核心规则");
console.log("═".repeat(60));
