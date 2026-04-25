// Portfolio Rebalancing Calculator
// Calculates how to rebalance a portfolio to target allocation

export interface Asset {
  name: string
  currentValue: number
  targetPercent: number
}

export interface RebalanceResult {
  totalValue: number
  assets: Array<{
    name: string
    currentValue: number
    targetValue: number
    diff: number
    action: 'sell' | 'buy' | 'hold'
    amount: number
  }>
  needsRebalance: boolean
  totalTradeAmount: number
}

export function rebalancePortfolio(
  assets: Asset[],
  threshold: number = 0.05,
): RebalanceResult {
  const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0)

  const results = assets.map((asset) => {
    const targetValue = (asset.targetPercent / 100) * totalValue
    const currentPercent = (asset.currentValue / totalValue) * 100
    const diff = targetValue - asset.currentValue
    const percentDiff = Math.abs(currentPercent - asset.targetPercent) / 100

    let action: 'sell' | 'buy' | 'hold' = 'hold'
    if (diff > 0 && percentDiff > threshold) {
      action = 'buy'
    } else if (diff < 0 && percentDiff > threshold) {
      action = 'sell'
    }

    return {
      name: asset.name,
      currentValue: asset.currentValue,
      targetValue: Math.round(targetValue * 100) / 100,
      diff: Math.round(diff * 100) / 100,
      action,
      amount: Math.round(Math.abs(diff) * 100) / 100,
    }
  })

  const needsRebalance = results.some(
    (r) => r.action !== 'hold' && r.amount > totalValue * threshold,
  )

  const totalTradeAmount = results.reduce(
    (sum, r) => sum + (r.action !== 'hold' ? r.amount : 0),
    0,
  )

  return {
    totalValue,
    assets: results,
    needsRebalance,
    totalTradeAmount,
  }
}

// Example usage:
// const portfolio = [
//   { name: 'Stocks', currentValue: 700000, targetPercent: 60 },
//   { name: 'Bonds', currentValue: 300000, targetPercent: 40 },
// ]
// rebalancePortfolio(portfolio, 0.05)
