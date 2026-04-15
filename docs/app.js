const workflowSelect = document.getElementById('workflowSelect')
const fireFields = document.getElementById('fireFields')
const rebalanceFields = document.getElementById('rebalanceFields')
const runButton = document.getElementById('runButton')
const summary = document.getElementById('summary')

workflowSelect.addEventListener('change', () => {
  const workflow = workflowSelect.value
  fireFields.classList.toggle('hidden', workflow !== 'fire_planning')
  rebalanceFields.classList.toggle(
    'hidden',
    workflow !== 'portfolio_rebalancing',
  )
})

function normalizeNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function runFirePlanning(input) {
  const currentSavings = normalizeNumber(input.currentSavings)
  const annualIncome = normalizeNumber(input.annualIncome)
  const annualExpenses = normalizeNumber(input.annualExpenses)
  let annualSavings = normalizeNumber(input.annualSavings)
  let expectedReturn = normalizeNumber(input.expectedReturn)
  let safeWithdrawalRate = normalizeNumber(input.safeWithdrawalRate)

  if (safeWithdrawalRate !== null && safeWithdrawalRate > 1) {
    safeWithdrawalRate = safeWithdrawalRate / 100
  }
  if (expectedReturn !== null && expectedReturn > 1) {
    expectedReturn = expectedReturn / 100
  }

  const invalidFields = []
  if (annualIncome === null || annualIncome <= 0) {
    invalidFields.push('年收入')
  }
  if (annualExpenses === null || annualExpenses <= 0) {
    invalidFields.push('年支出')
  }
  if (annualSavings === null || annualSavings < 0) {
    invalidFields.push('年储蓄')
  }
  if (safeWithdrawalRate === null || safeWithdrawalRate <= 0) {
    invalidFields.push('安全提现率')
  }
  if (invalidFields.length > 0) {
    return {
      summary: `请填写正确的 ${invalidFields.join('、')}。安全提现率应填写百分比，例如 4 表示 4%。`,
      actions: [],
      raw: { input },
    }
  }

  const savingsRate =
    annualIncome > 0 ? Math.round((annualSavings / annualIncome) * 100) : null
  const targetAssets = Math.round(annualExpenses / safeWithdrawalRate)
  const yearsToFI = Math.max(
    0,
    Math.round((targetAssets - currentSavings) / annualSavings),
  )
  const message = `预计需要 ${yearsToFI} 年达到 FIRE。`
  const rateNote =
    savingsRate !== null ? `你的年储蓄率约为 ${savingsRate}%。` : ''

  return {
    summary: `目标资产 ${targetAssets.toLocaleString()} 元，${message}`,
    actions: [
      `把目标资产设置为 ${targetAssets.toLocaleString()} 元。`,
      '保持稳定储蓄，将每月储蓄作为长期习惯。',
      '把投资配置到低成本指数基金、被动收入工具或稳健资产。',
      '每季度回顾进度，并根据实际情况调整储蓄和风险配置。',
    ],
    notes: rateNote,
    raw: {
      currentSavings,
      annualIncome,
      annualExpenses,
      annualSavings,
      expectedReturn,
      safeWithdrawalRate,
      savingsRate,
      targetAssets,
      yearsToFI,
    },
  }
}

function runPortfolioRebalancing(input) {
  const totalValue = input.assets.reduce(
    (sum, asset) => sum + asset.currentValue,
    0,
  )
  const assets = input.assets.map((asset) => {
    const targetValue = Math.round((asset.targetPercent / 100) * totalValue)
    const diff = targetValue - asset.currentValue
    const action = Math.abs(diff) < 1 ? 'hold' : diff > 0 ? 'buy' : 'sell'
    return { ...asset, targetValue, diff, action, amount: Math.abs(diff) }
  })
  const needsRebalance = assets.some(
    (asset) =>
      Math.abs(asset.diff / (asset.targetValue || 1)) > input.threshold,
  )
  const tradePlan = assets.filter((asset) => asset.action !== 'hold')
  const summaryText = needsRebalance
    ? `建议执行 ${tradePlan.length} 项再平衡操作。`
    : '当前组合接近目标比例，无需立即再平衡。'

  return {
    summary: summaryText,
    actions: tradePlan.map(
      (asset) =>
        `${asset.name}: ${asset.action} ${asset.amount.toLocaleString()} 元`,
    ),
    notes: '建议保持目标配置，避免频繁交易导致过度成本。',
    raw: { totalValue, assets, needsRebalance },
  }
}

function showResult(result) {
  const actions = Array.isArray(result.actions) ? result.actions : []
  const actionList = actions.length
    ? `<ul>${actions.map((item) => `<li>${item}</li>`).join('')}</ul>`
    : ''
  const note = result.notes ? `<p class="badge">${result.notes}</p>` : ''
  const warning =
    actions.length === 0 && result.summary.includes('请填写正确')
      ? `<div class="warning">${result.summary}</div>`
      : ''

  summary.innerHTML = `
    <h3>计划结果</h3>
    <p>${result.summary}</p>
    ${actionList}
    ${note}
    ${warning}
  `
  summary.classList.remove('hidden')
}

runButton.addEventListener('click', () => {
  const workflow = workflowSelect.value

  if (workflow === 'fire_planning') {
    const input = {
      currentSavings: Number(document.getElementById('currentSavings').value),
      annualExpenses: Number(document.getElementById('annualExpenses').value),
      annualSavings: Number(document.getElementById('annualSavings').value),
      expectedReturn: Number(document.getElementById('expectedReturn').value),
      safeWithdrawalRate: Number(
        document.getElementById('safeWithdrawalRate').value,
      ),
    }
    showResult(runFirePlanning(input))
    return
  }

  const input = {
    assets: [
      {
        name: 'Stocks',
        currentValue: Number(document.getElementById('stocksValue').value),
        targetPercent: Number(document.getElementById('stocksTarget').value),
      },
      {
        name: 'Bonds',
        currentValue: Number(document.getElementById('bondsValue').value),
        targetPercent: Number(document.getElementById('bondsTarget').value),
      },
    ],
    threshold: Number(document.getElementById('threshold').value),
  }
  showResult(runPortfolioRebalancing(input))
})
