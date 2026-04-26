import { calculateRetirementGoal } from '../retirement-goal.ts'
import { strict as assert } from 'assert'

const result = calculateRetirementGoal(50000, 40000, 20000, 0.06)
assert.ok(result.targetAssets > 0)
assert.ok(result.yearsToFI >= 0)
console.log('fire-timeline tests passed (using retirement-goal).')