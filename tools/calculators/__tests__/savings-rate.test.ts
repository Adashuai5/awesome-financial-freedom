import { savingsRate } from '../savings-rate.ts'
import { strict as assert } from 'assert'

assert.equal(savingsRate(10000, 8000), 20)
assert.equal(savingsRate(5000, 5000), 0)
assert.equal(savingsRate(0, 0), 0)
console.log('savings-rate tests passed.')
