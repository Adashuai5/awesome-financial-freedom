import { fireTimeline } from '../fire-timeline.ts'
import { strict as assert } from 'assert'

const result = fireTimeline(50000, 20000, 40000, 0.06)
assert.ok(result.targetCorpus > 0)
assert.ok(result.yearsToFI >= 0)
console.log('fire-timeline tests passed.')
