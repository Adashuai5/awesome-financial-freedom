// Savings Rate Calculator
// Calculates the percentage of income saved after expenses

export function savingsRate(
  annualIncome: number,
  annualExpenses: number,
): number {
  if (annualIncome <= 0) return 0
  const savings = annualIncome - annualExpenses
  return savings <= 0 ? 0 : (savings / annualIncome) * 100
}

// Example usage:
// savingsRate(60000, 48000) // Returns 20%
