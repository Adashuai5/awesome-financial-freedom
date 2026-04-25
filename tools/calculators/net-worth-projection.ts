// Net Worth Projection Calculator
// Projects net worth growth over time using regular savings and compound returns.

export interface ProjectionPoint {
  year: number
  balance: number
  contribution: number
  growth: number
}

export interface NetWorthProjection {
  startingBalance: number
  annualContribution: number
  expectedReturn: number
  years: number
  projection: ProjectionPoint[]
}

export function projectNetWorth(
  startingBalance: number,
  annualContribution: number,
  expectedReturn: number,
  years: number,
): NetWorthProjection {
  const projection: ProjectionPoint[] = []
  let balance = startingBalance

  for (let year = 1; year <= years; year++) {
    const growth = balance * expectedReturn
    balance += growth + annualContribution
    projection.push({
      year,
      balance: Math.round(balance),
      contribution: annualContribution,
      growth: Math.round(growth),
    })
  }

  return {
    startingBalance,
    annualContribution,
    expectedReturn,
    years,
    projection,
  }
}

// Example usage:
// projectNetWorth(200000, 72000, 0.07, 10)
