// FIRE Timeline Calculator
// Calculates years needed to reach financial independence

export function calculateFireTimeline(
  currentSavings: number,
  annualSavings: number,
  annualExpenses: number,
  expectedReturn: number = 0.07,
  safeWithdrawalRate: number = 0.04,
): number {
  const targetNestEgg = annualExpenses / safeWithdrawalRate

  if (currentSavings >= targetNestEgg) {
    return 0 // Already FI
  }

  const remaining = targetNestEgg - currentSavings
  const years =
    Math.log(remaining / annualSavings + 1) / Math.log(1 + expectedReturn)

  return Math.ceil(years)
}

// Example usage:
// calculateFireTimeline(50000, 20000, 40000) // Returns years to FI
