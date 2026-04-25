// Retirement Goal Calculator
// Estimates the target savings and years to retirement based on current savings and expenses.

export interface RetirementGoal {
  currentSavings: number
  annualExpenses: number
  annualSavings: number
  expectedReturn: number
  safeWithdrawalRate: number
  targetAssets: number
  yearsToFI: number
  savingsRate: number
}

export function calculateRetirementGoal(
  currentSavings: number,
  annualExpenses: number,
  annualSavings: number,
  expectedReturn: number = 0.07,
  safeWithdrawalRate: number = 0.04,
): RetirementGoal {
  const targetAssets = annualExpenses / safeWithdrawalRate
  const savingsRate =
    annualExpenses <= 0 ? 0 : annualSavings / (annualExpenses + annualSavings)
  if (currentSavings >= targetAssets) {
    return {
      currentSavings,
      annualExpenses,
      annualSavings,
      expectedReturn,
      safeWithdrawalRate,
      targetAssets,
      yearsToFI: 0,
      savingsRate,
    }
  }

  let balance = currentSavings
  let years = 0
  while (balance < targetAssets && years < 100) {
    balance = balance * (1 + expectedReturn) + annualSavings
    years++
  }

  return {
    currentSavings,
    annualExpenses,
    annualSavings,
    expectedReturn,
    safeWithdrawalRate,
    targetAssets,
    yearsToFI: Math.ceil(years),
    savingsRate,
  }
}

// Example usage:
// calculateRetirementGoal(200000, 108000, 72000)
