// Portfolio Risk Calculator
// Estimates portfolio risk metrics from a return series

export function maxDrawdown(returns: number[]): number {
  if (returns.length === 0) return 0

  let peak = 1
  let trough = 1
  let maxDrawdown = 0
  let running = 1

  for (const r of returns) {
    running *= 1 + r
    peak = Math.max(peak, running)
    trough = Math.min(trough, running)
    maxDrawdown = Math.max(maxDrawdown, peak - running)
  }

  return maxDrawdown
}

export function sharpeRatio(
  returns: number[],
  riskFreeRate: number = 0,
): number {
  if (returns.length === 0) return 0

  const excessReturns = returns.map((r) => r - riskFreeRate)
  const mean =
    excessReturns.reduce((sum, value) => sum + value, 0) / returns.length
  const variance =
    excessReturns.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    returns.length

  const standardDeviation = Math.sqrt(variance)
  return standardDeviation === 0 ? 0 : mean / standardDeviation
}

// Example usage:
// maxDrawdown([0.1, -0.05, 0.2, -0.1])
// sharpeRatio([0.1, 0.05, 0.02], 0.01)
