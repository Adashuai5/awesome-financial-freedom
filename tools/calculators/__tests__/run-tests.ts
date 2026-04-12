import { strict as assert } from 'assert'
import { compoundInterest } from '../compound-interest.ts'
import { fireTimeline } from '../fire-timeline.ts'
import { maxDrawdown, sharpeRatio } from '../portfolio-risk.ts'
import { savingsRate } from '../savings-rate.ts'

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

function run() {
  testCompoundInterest()
  testFireTimeline()
  testPortfolioRisk()
  testSavingsRate()
  console.log('All calculator tests passed.')
}

run()
