// Savings Rate Calculator
// Calculates the percentage of income saved/invested

export function calculateSavingsRate(
  annualIncome: number,
  annualSavings: number,
): number {
  if (annualIncome <= 0) return 0
  return (annualSavings / annualIncome) * 100
}

// Example usage:
// calculateSavingsRate(60000, 24000) // Returns 40%
