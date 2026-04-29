import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const repoRoot = process.cwd()
const promptDir = path.resolve(repoRoot, 'prompts')

function loadPrompt(promptId) {
  const promptFile = path.join(promptDir, `${promptId}.md`)
  if (!fs.existsSync(promptFile)) return null
  return fs.readFileSync(promptFile, 'utf8')
}

function getValue(context, key) {
  return key.split('.').reduce((value, part) => {
    if (value && typeof value === 'object') {
      return value[part]
    }
    return undefined
  }, context)
}

function toNumber(value, fallback) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function renderTemplate(template, context) {
  return template.replace(/{{\s*([^}\s]+)\s*}}/g, (_, token) => {
    const value = getValue(context, token)
    if (value === undefined || value === null) return ''
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  })
}

export function loadInputFile(filePath) {
  try {
    const content = fs.readFileSync(path.resolve(repoRoot, filePath), 'utf8')
    return JSON.parse(content)
  } catch (error) {
    throw new Error(`无法加载输入文件：${filePath}，错误：${error.message}`)
  }
}

export function buildDefaultInput(parameters = {}) {
  const input = {}
  for (const key of Object.keys(parameters)) {
    if (
      key === 'weekly_tweet_target' ||
      key === 'frequency' ||
      key === 'duration_months'
    ) {
      if (key === 'weekly_tweet_target') {
        input[key] = 5
      } else if (key === 'duration_months') {
        input[key] = 120
      } else {
        input[key] = 'monthly'
      }
    } else if (key === 'assets') {
      input[key] = [
        { name: 'Stocks', currentValue: 700000, targetPercent: 60 },
        { name: 'Bonds', currentValue: 300000, targetPercent: 40 },
      ]
    } else if (key === 'expected_return') {
      input[key] = 0.07
    } else if (key === 'safe_withdrawal_rate') {
      input[key] = 0.04
    } else if (key === 'threshold') {
      input[key] = 0.05
    } else if (
      key.includes('amount') ||
      key.includes('expenses') ||
      key.includes('netWorth') ||
      key.includes('savings')
    ) {
      input[key] = 10000
    } else if (
      key.includes('index') ||
      key.includes('keyword') ||
      key.includes('niche')
    ) {
      input[key] = 'S&P 500'
    } else if (key.includes('goal')) {
      input[key] = '10k followers'
    } else if (key === 'monetization_model') {
      input[key] = 'affiliates'
    } else {
      input[key] = 'sample'
    }
  }
  return input
}

function dcaPlanCalculator(state) {
  const {
    investment_amount = 5000,
    duration_months = 120,
    frequency = 'monthly',
    target_index = 'S&P 500',
  } = state.input
  const annualRate = 0.06
  const monthlyRate = annualRate / 12
  const months = duration_months
  const projectedBalance = Math.round(
    Number(investment_amount) *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate),
  )

  return {
    investmentAmount: investment_amount,
    frequency,
    targetIndex: target_index,
    durationMonths: months,
    projectedBalance,
    recommendation: `建议以${frequency}方式向${target_index}持续投入，预计${months}个月后资产约为${projectedBalance}元。`,
  }
}


function runPromptStep(step, state, workflow) {
  const promptText = loadPrompt(step.prompt_id)
  const context = { input: state.input, state: state.output, workflow }
  const rendered = promptText
    ? renderTemplate(promptText, context)
    : `Prompt ${step.prompt_id} (template missing)`
  const result = {
    prompt: rendered,
    response: `模拟回答：执行 ${step.prompt_id}`,
  }

  if (step.prompt_id === 'dca_risk_assessment') {
    result.riskProfile = {
      level: 'Moderate',
      comment: '你的风险承受力在中等水平。',
    }
  }
  if (step.prompt_id === 'dca_summary') {
    result.summary = `基于当前输入，建议每月投入 ${state.input.investment_amount || 5000} 元，目标指数为 ${state.input.target_index || 'S&P 500'}。`
  }
  if (step.prompt_id === 'fire_assessment') {
    const goal = calculateRetirementGoal(
      toNumber(state.input.current_savings, 0),
      toNumber(state.input.annual_expenses, 0),
      toNumber(state.input.annual_savings, 0),
      toNumber(state.input.expected_return, 0.07),
      toNumber(state.input.safe_withdrawal_rate, 0.04),
    )
    result.analysis = `目标资产 ${goal.targetAssets}，预计 ${goal.yearsToFI} 年达到 FIRE。`
    result.actionItems = [
      `优先提高储蓄率，目标储蓄率至少达到 ${Math.round(goal.savingsRate * 100)}%。`,
      '增加被动收入来源，例如指数基金红利或稳定租金收入。',
      '保持资产配置稳定，避免短期市场波动影响长期目标。',
    ]
  }

  if (step.prompt_id === 'fire_summary') {
    const goal = calculateRetirementGoal(
      toNumber(state.input.current_savings, 0),
      toNumber(state.input.annual_expenses, 0),
      toNumber(state.input.annual_savings, 0),
      toNumber(state.input.expected_return, 0.07),
      toNumber(state.input.safe_withdrawal_rate, 0.04),
    )
    result.planSummary = {
      targetAssets: goal.targetAssets,
      yearsToFI: goal.yearsToFI,
      keyActions: [
        '每月固定储蓄，确保至少达到当前收入的 20%-30%。',
        '把可投资资产配置到低成本指数基金或被动收入工具。',
        '每季度检查一次进度，必要时调整储蓄和风险配置。',
      ],
    }
  }

  if (step.prompt_id === 'rebalancing_assessment') {
    const rebalance = rebalancePortfolio(
      Array.isArray(state.input.assets) ? state.input.assets : [],
      toNumber(state.input.threshold, 0.05),
    )
    result.recommendation = rebalance.needsRebalance
      ? '当前组合偏离目标，建议执行再平衡。'
      : '当前组合偏离较小，可暂缓再平衡。'
    result.tradeSuggestions = rebalance.assets
      .filter((item) => item.action !== 'hold')
      .map((item) => `${item.name}: ${item.action} ${item.amount} 元`)
  }

  if (step.prompt_id === 'rebalancing_plan') {
    const rebalance = rebalancePortfolio(
      Array.isArray(state.input.assets) ? state.input.assets : [],
      toNumber(state.input.threshold, 0.05),
    )
    result.tradePlan = rebalance.assets.map((item) => ({
      name: item.name,
      action: item.action,
      amount: item.amount,
      targetValue: item.targetValue,
    }))
    result.riskNote = '保持配置接近目标比例，避免频繁交易导致过度成本。'
  }

  return result
}

function runCalculatorStep(step, state) {
  switch (step.calculator_id) {
    case 'dca-plan-calculator':
      return dcaPlanCalculator(state)
    case 'fire-goal-calculator': {
      const {
        current_savings = 200000,
        annual_expenses = 108000,
        annual_savings = 72000,
        expected_return = 0.07,
        safe_withdrawal_rate = 0.04,
      } = state.input
      return calculateRetirementGoal(
        toNumber(current_savings, 200000),
        toNumber(annual_expenses, 108000),
        toNumber(annual_savings, 72000),
        toNumber(expected_return, 0.07),
        toNumber(safe_withdrawal_rate, 0.04),
      )
    }
    case 'portfolio-rebalance-calculator': {
      const assets = Array.isArray(state.input.assets)
        ? state.input.assets
        : [
            { name: 'Stocks', currentValue: 700000, targetPercent: 60 },
            { name: 'Bonds', currentValue: 300000, targetPercent: 40 },
          ]
      const threshold = Number(state.input.threshold) || 0.05
      return rebalancePortfolio(assets, threshold)
    }
    default:
      return { message: `未知计算器：${step.calculator_id}` }
  }
}

function runConditionStep(step, state) {
  const review = runPromptStep(step, state, null)
  const passed = review.passed !== false
  return {
    passed,
    decision: passed ? 'publish_plan' : 'revise_article',
    review,
  }
}

function determineNextStep(step, result) {
  if (step.type === 'condition') {
    if (Array.isArray(step.next)) {
      return result.passed ? step.next[0] : step.next[1]
    }
  }

  if (typeof step.next === 'string') {
    return step.next === 'output' ? null : step.next
  }

  return null
}

export function calculateRetirementGoal(
  currentSavings,
  annualExpenses,
  annualSavings,
  expectedReturn,
  safeWithdrawalRate,
) {
  const targetAssets = Math.round(annualExpenses / safeWithdrawalRate)
  // 复利公式: FV = PV*(1+r)^n + PMT*((1+r)^n-1)/r
  // 解n: n = ln((FV*r + PMT) / (PV*r + PMT)) / ln(1+r)
  const r = expectedReturn
  const pv = currentSavings
  const pmt = annualSavings
  const fv = targetAssets
  const denominator = pv * r + pmt
  if (denominator <= 0 || r <= 0) {
    // 保守降级：线性估算
    const yearsToFI = Math.round((fv - pv) / pmt)
    const savingsRate = annualSavings / (annualExpenses + annualSavings)
    return {
      currentSavings,
      annualExpenses,
      annualSavings,
      expectedReturn,
      safeWithdrawalRate,
      targetAssets,
      yearsToFI,
      savingsRate,
      note: '降级为线性计算（输入参数异常）',
    }
  }
  const numerator = fv * r + pmt
  if (numerator <= 0 || denominator <= 0) {
    const yearsToFI = Math.round((fv - pv) / pmt)
    const savingsRate = annualSavings / (annualExpenses + annualSavings)
    return {
      currentSavings, annualExpenses, annualSavings,
      expectedReturn, safeWithdrawalRate, targetAssets,
      yearsToFI, savingsRate,
      note: '降级为线性计算',
    }
  }
  const yearsToFI = Math.ceil(
    Math.log(numerator / denominator) / Math.log(1 + r),
  )
  const savingsRate = annualSavings / (annualExpenses + annualSavings)
  return {
    currentSavings,
    annualExpenses,
    annualSavings,
    expectedReturn,
    safeWithdrawalRate,
    targetAssets,
    yearsToFI,
    savingsRate,
  }
}

export function rebalancePortfolio(assets, threshold = 0.05) {
  const totalValue = assets.reduce(
    (sum, asset) => sum + Number(asset.currentValue || 0),
    0,
  )
  const normalized = assets.map((asset) => {
    const currentValue = Number(asset.currentValue || 0)
    const targetValue = Math.round(
      (Number(asset.targetPercent || 0) / 100) * totalValue,
    )
    const diff = targetValue - currentValue
    return {
      ...asset,
      currentValue,
      targetValue,
      diff,
      action: Math.abs(diff) < 1e-6 ? 'hold' : diff > 0 ? 'buy' : 'sell',
      amount: Math.abs(diff),
    }
  })
  const needsRebalance = normalized.some(
    (asset) => Math.abs(asset.diff / (asset.targetValue || 1)) > threshold,
  )
  const totalTradeAmount = normalized.reduce(
    (sum, asset) => sum + asset.amount,
    0,
  )
  return { totalValue, assets: normalized, needsRebalance, totalTradeAmount }
}

export async function executeWorkflow(workflowFile, inputOverride = {}) {
  const content = fs.readFileSync(path.resolve(repoRoot, workflowFile), 'utf8')
  const workflow = yaml.load(content)

  if (typeof workflow !== 'object' || workflow === null) {
    throw new Error('工作流文件未解析为对象，请检查 YAML 语法。')
  }

  if (!Array.isArray(workflow.steps)) {
    throw new Error('工作流文件必须包含 steps 数组。')
  }

  const steps = workflow.steps
  const stepMap = new Map(steps.map((step) => [step.id, step]))
  const state = {
    input: {
      ...buildDefaultInput(workflow.input?.parameters),
      ...inputOverride,
    },
    output: {},
  }

  let currentStepId = steps[0]?.id
  while (currentStepId) {
    const step = stepMap.get(currentStepId)
    if (!step) break

    let result
    if (step.type === 'prompt') {
      result = runPromptStep(step, state, workflow)
    } else if (step.type === 'calculator') {
      result = runCalculatorStep(step, state)
    } else if (step.type === 'condition') {
      result = runConditionStep(step, state)
    } else {
      result = { message: `Unsupported step type ${step.type}` }
    }

    state.output[step.id] = result
    state.last_step = step.id
    currentStepId = determineNextStep(step, result)
  }

  return {
    workflow: {
      name: workflow.name || path.basename(workflowFile),
      description: workflow.description || '',
    },
    input: state.input,
    output: state.output,
  }
}
