#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { calculateRetirementGoal } from './calculators/retirement-goal.ts'
import { rebalancePortfolio } from './calculators/rebalance.ts'

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

function buildDefaultInput(parameters = {}) {
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

function twitterEngagementModel(state) {
  const { audience_goal = 'grow audience', weekly_tweet_target = 5 } =
    state.input
  const impressions = weekly_tweet_target * 1200
  return {
    weeklyTweetTarget: weekly_tweet_target,
    audienceGoal: audience_goal,
    expectedWeeklyImpressions: impressions,
    growthStrategy: '保持高频、有价值内容，并与粉丝互动来提高参与度。',
    recommendation: `每周发布 ${weekly_tweet_target} 条推文，并结合热点话题以支持 ${audience_goal}。`,
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

  if (step.prompt_id === 'seo_article') {
    result.generatedArticle = `这是基于 ${state.input.niche || '个人理财'} 的模拟SEO文章内容。`
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
  if (step.prompt_id === 'seo_review') {
    result.review = '内容符合SEO要求，建议继续发布。'
    result.passed = true
  }
  if (step.prompt_id === 'seo_publish_plan') {
    result.publishPlan = {
      channel: 'blog',
      cadence: 'weekly',
      promotion: '社交媒体和邮件列表',
    }
  }
  if (step.prompt_id === 'twitter_ideas') {
    result.topics = [
      `${state.input.niche || '个人理财'} 创业故事`,
      '理财小贴士',
      '被动收入策略',
    ]
  }
  if (step.prompt_id === 'twitter_schedule') {
    result.schedule = `每周发布 ${state.input.weekly_tweet_target || 5} 条推文，集中在周二和周四。`
  }

  return result
}

function runCalculatorStep(step, state) {
  switch (step.calculator_id) {
    case 'dca-plan-calculator':
      return dcaPlanCalculator(state)
    case 'twitter-engagement-model':
      return twitterEngagementModel(state)
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

function runWorkflow(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
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
    input: buildDefaultInput(workflow.input?.parameters),
    output: {},
  }

  console.log(`\n加载工作流：${workflow.name || path.basename(filePath)}`)
  console.log(`描述：${workflow.description || '（无描述）'}`)
  console.log('使用输入：', state.input)

  let currentStepId = steps[0]?.id
  while (currentStepId) {
    const step = stepMap.get(currentStepId)
    if (!step) break

    console.log(`\n执行步骤：${step.id} - ${step.name}`)
    console.log(`类型：${step.type}`)

    try {
      let result
      if (step.type === 'prompt') {
        result = runPromptStep(step, state, workflow)
      } else if (step.type === 'calculator') {
        result = runCalculatorStep(step, state)
      } else if (step.type === 'condition') {
        result = runConditionStep(step, state)
      } else {
        console.warn(`未知步骤类型：${step.type}`)
        result = { message: `Unsupported step type ${step.type}` }
      }

      state.output[step.id] = result
      state.last_step = step.id

      currentStepId = determineNextStep(step, result)
    } catch (error) {
      console.error(`步骤失败：${step.id} - ${error.message}`)
      if (step.on_error === 'abort') {
        console.error('流程终止')
        break
      }
      currentStepId =
        typeof step.next === 'string' && step.next !== 'output'
          ? step.next
          : null
    }
  }

  console.log('\n工作流执行模拟完成。输出结果：')
  console.log(JSON.stringify(state.output, null, 2))
}

const workflowFile = process.argv[2]
if (!workflowFile) {
  console.error(
    '用法：node tools/run-workflow.js workflows/<workflow-file>.yaml',
  )
  process.exit(1)
}

const resolved = path.resolve(process.cwd(), workflowFile)
runWorkflow(resolved)
