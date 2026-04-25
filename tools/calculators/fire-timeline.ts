// FIRE Timeline Calculator
// Calculates years needed to reach financial independence

export function fireTimeline(
  currentSavings: number,
  annualSavings: number,
  annualExpenses: number,
  expectedReturn: number = 0.07,
  safeWithdrawalRate: number = 0.04,
): { targetCorpus: number; yearsToFI: number } {
  const targetNestEgg = annualExpenses / safeWithdrawalRate

  if (currentSavings >= targetNestEgg) {
    return { targetCorpus: targetNestEgg, yearsToFI: 0 }
  }

  const remaining = targetNestEgg - currentSavings
  const years =
    Math.log(remaining / annualSavings + 1) / Math.log(1 + expectedReturn)

  return { targetCorpus: targetNestEgg, yearsToFI: Math.ceil(years) }
}

// Example usage:
// fireTimeline(50000, 20000, 40000) // Returns FI target and years to FI
