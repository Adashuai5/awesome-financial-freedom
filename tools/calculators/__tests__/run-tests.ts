import { strict as assert } from 'assert'
import { compoundInterest } from '../compound-interest.ts'
import { fireTimeline } from '../fire-timeline.ts'
import { maxDrawdown, sharpeRatio } from '../portfolio-risk.ts'
import { savingsRate } from '../savings-rate.ts'
import { rebalancePortfolio } from '../rebalance.ts'
import { calculateFireProgress } from '../fire-milestones.ts'
import { calculateRetirementGoal } from '../retirement-goal.ts'
import { projectNetWorth } from '../net-worth-projection.ts'

function testCompoundInterest() {
  assert.equal(Math.round(compoundInterest(10000, 0.05, 1)), 10500)
  assert.equal(Math.round(compoundInterest(10000, 0.05, 2)), 11025)
  assert.equal(Math.round(compoundInterest(0, 0.1, 10)), 0)
}

function testFireTimeline() {
  const result = fireTimeline(50000, 20000, 40000, 0.06)
  assert.equal(Math.round(result.targetCorpus), 1000000)
  assert.ok(result.yearsToFI >= 0)
}

function testPortfolioRisk() {
  assert.equal(
    Math.round(maxDrawdown([0.1, -0.05, 0.2, -0.1]) * 1000) / 1000,
    0.125,
  )
  assert.equal(
    Math.round(sharpeRatio([0.1, 0.05, 0.02], 0.01) * 100) / 100,
    1.41,
  )
}

function testSavingsRate() {
  assert.equal(savingsRate(10000, 8000), 20)
  assert.equal(savingsRate(5000, 5000), 0)
}

function testRebalancePortfolio() {
  const result = rebalancePortfolio(
    [
      { name: 'Stocks', currentValue: 700000, targetPercent: 60 },
      { name: 'Bonds', currentValue: 300000, targetPercent: 40 },
    ],
    0.05,
  )

  const stocks = result.assets.find((asset) => asset.name === 'Stocks')
  const bonds = result.assets.find((asset) => asset.name === 'Bonds')

  assert.ok(result.needsRebalance)
  assert.equal(stocks?.action, 'sell')
  assert.equal(bonds?.action, 'buy')
  assert.equal(result.totalValue, 1000000)
}

function testFireProgress() {
  const progress = calculateFireProgress(200000, 108000, 72000, 0.07, 0.04)
  assert.equal(Math.round(progress.fireTarget), 2700000)
  assert.ok(progress.overallProgress > 0)
  assert.ok(progress.yearsToNextMilestone !== null)
}

function testRetirementGoal() {
  const goal = calculateRetirementGoal(200000, 108000, 72000, 0.07, 0.04)
  assert.equal(Math.round(goal.targetAssets), 2700000)
  assert.ok(goal.yearsToFI >= 0)
  assert.equal(Math.round(goal.savingsRate * 100), 40)
}

function testNetWorthProjection() {
  const projection = projectNetWorth(200000, 72000, 0.07, 5)
  assert.equal(projection.projection.length, 5)
  assert.ok(projection.projection[4].balance > projection.projection[0].balance)
}

function run() {
  testCompoundInterest()
  testFireTimeline()
  testPortfolioRisk()
  testSavingsRate()
  testRebalancePortfolio()
  testFireProgress()
  testRetirementGoal()
  testNetWorthProjection()
  console.log('All calculator tests passed.')
}

run()
