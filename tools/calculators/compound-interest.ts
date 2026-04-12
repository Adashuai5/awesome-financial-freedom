// Compound Interest Calculator
// Calculates future value with compound interest

export function compoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number = 1,
): number {
  const rate = annualRate / compoundingFrequency
  const periods = years * compoundingFrequency

  return principal * Math.pow(1 + rate, periods)
}

// Example usage:
// compoundInterest(10000, 0.07, 10) // Returns future value
