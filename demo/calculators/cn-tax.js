// 中国综合所得税 2026 适用税档 + 专项附加扣除
// 数据来源：国家税务总局个人所得税法实施条例
// 用于"税后真实储蓄率"测算，非税务建议。

// 综合所得税年度税档（应纳税所得额 = 年收入 - 6万 - 五险一金 - 专项附加扣除）
export const CN_TAX_BRACKETS = [
  { upTo: 36000, rate: 0.03, quickDeduction: 0 },
  { upTo: 144000, rate: 0.10, quickDeduction: 2520 },
  { upTo: 300000, rate: 0.20, quickDeduction: 16920 },
  { upTo: 420000, rate: 0.25, quickDeduction: 31920 },
  { upTo: 660000, rate: 0.30, quickDeduction: 52920 },
  { upTo: 960000, rate: 0.35, quickDeduction: 85920 },
  { upTo: Infinity, rate: 0.45, quickDeduction: 181920 },
];

export const BASIC_DEDUCTION_ANNUAL = 60000; // 起征点 5000/月

// 专项附加扣除（月） — 2026 年标准
export const SPECIAL_DEDUCTIONS = {
  childEducation: 2000,        // 每孩 2000/月
  continuingEducation: 400,    // 学历教育 400/月，最多 48 月
  housingMortgageInterest: 1000, // 首套房贷利息 1000/月，最多 240 月
  housingRent: { tier1: 1500, tier2: 1100, tier3: 800 }, // 一线/二线/其他
  elderlyCare: 3000,           // 独生子女 3000/月；非独生总额 3000 兄妹分摊
  infantCare: 2000,            // 3 岁以下婴幼儿照护，每孩 2000/月
};

// 输入：年综合所得 income, 五险一金合计 socialInsurance, 专项扣除年总额 specialDeductionAnnual, 个人养老金缴费(<=12000)
// 输出：应税所得、应纳税额、边际税率、平均税率
export function calculateComprehensiveIncomeTax({
  annualIncome,
  socialInsuranceAnnual = 0,
  specialDeductionAnnual = 0,
  pensionContribAnnual = 0,
}) {
  const taxableIncome = Math.max(
    0,
    annualIncome
      - BASIC_DEDUCTION_ANNUAL
      - socialInsuranceAnnual
      - specialDeductionAnnual
      - Math.min(12000, Math.max(0, pensionContribAnnual)),
  );

  const bracket = CN_TAX_BRACKETS.find(b => taxableIncome <= b.upTo);
  const tax = taxableIncome === 0 ? 0 : Math.max(0, taxableIncome * bracket.rate - bracket.quickDeduction);

  return {
    taxableIncome,
    tax,
    marginalRate: bracket.rate,
    averageRate: annualIncome > 0 ? tax / annualIncome : 0,
    afterTaxIncome: annualIncome - tax,
  };
}

// 个人养老金节税 = 缴费 × 边际税率
export function pensionTaxSaving(contribAnnual, marginalRate) {
  const capped = Math.min(12000, Math.max(0, contribAnnual));
  return capped * marginalRate;
}

// 计算"税后真实储蓄率"
// 给定税前年收入、年支出、专项扣除等 → 输出税后到手收入、真实储蓄率
export function calculateAfterTaxSavingsRate({
  grossIncomeAnnual,
  annualExpenses,
  socialInsuranceAnnual = 0,
  specialDeductionAnnual = 0,
  pensionContribAnnual = 0,
}) {
  const tax = calculateComprehensiveIncomeTax({
    annualIncome: grossIncomeAnnual,
    socialInsuranceAnnual,
    specialDeductionAnnual,
    pensionContribAnnual,
  });
  const afterTaxIncome = tax.afterTaxIncome;
  const realSavings = Math.max(0, afterTaxIncome - annualExpenses);
  const realSavingsRate = afterTaxIncome > 0 ? realSavings / afterTaxIncome : 0;
  return {
    ...tax,
    realSavings,
    realSavingsRate,
    pensionTaxSaving: pensionTaxSaving(pensionContribAnnual, tax.marginalRate),
  };
}

// 总专项扣除年额（接受 UI 配置对象）
export function totalSpecialDeductionAnnual({
  children = 0,
  hasMortgage = false,
  rentTier = null,        // null | 'tier1' | 'tier2' | 'tier3'
  elderlyCare = false,    // 是否赡养老人（独生子女）
  infants = 0,            // 3 岁以下婴幼儿数量
} = {}) {
  let monthly = 0;
  monthly += children * SPECIAL_DEDUCTIONS.childEducation;
  if (hasMortgage) monthly += SPECIAL_DEDUCTIONS.housingMortgageInterest;
  if (rentTier && SPECIAL_DEDUCTIONS.housingRent[rentTier]) {
    monthly += SPECIAL_DEDUCTIONS.housingRent[rentTier];
  }
  if (elderlyCare) monthly += SPECIAL_DEDUCTIONS.elderlyCare;
  monthly += infants * SPECIAL_DEDUCTIONS.infantCare;
  return monthly * 12;
}
