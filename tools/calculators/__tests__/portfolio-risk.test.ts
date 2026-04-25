import { maxDrawdown, sharpeRatio } from '../portfolio-risk.ts'
import { strict as assert } from 'assert'

assert.equal(
  Math.round(maxDrawdown([0.1, -0.05, 0.2, -0.1]) * 1000) / 1000,
  0.125,
)
assert.equal(Math.round(sharpeRatio([0.1, 0.05, 0.02], 0.01) * 100) / 100, 1.41)
console.log('portfolio-risk tests passed.')
