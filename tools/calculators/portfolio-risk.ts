// Portfolio Risk Calculator
// Estimates portfolio volatility based on asset allocation

export function calculatePortfolioRisk(
  stockAllocation: number,
  bondAllocation: number,
  stockVolatility: number = 0.15,
  bondVolatility: number = 0.05,
): number {
  const totalAllocation = stockAllocation + bondAllocation
  if (totalAllocation === 0) return 0

  const normalizedStock = stockAllocation / totalAllocation
  const normalizedBond = bondAllocation / totalAllocation

  // Simplified variance calculation
  const variance =
    Math.pow(normalizedStock * stockVolatility, 2) +
    Math.pow(normalizedBond * bondVolatility, 2)

  return Math.sqrt(variance)
}

// Example usage:
// calculatePortfolioRisk(0.6, 0.4) // Returns estimated volatility
