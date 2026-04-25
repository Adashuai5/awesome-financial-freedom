import { compoundInterest } from '../compound-interest.ts'
import { strict as assert } from 'assert'

assert.equal(Math.round(compoundInterest(10000, 0.05, 1)), 10500)
assert.equal(Math.round(compoundInterest(10000, 0.05, 2)), 11025)
assert.equal(Math.round(compoundInterest(10000, 0.07, 10)), 19672)
console.log('compound-interest tests passed.')
