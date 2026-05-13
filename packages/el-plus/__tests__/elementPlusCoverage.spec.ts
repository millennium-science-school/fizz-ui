import { describe, expect, it } from 'vitest'
import { getElementPlusCoverage } from '../scripts/element-plus-coverage.mjs'

describe('@fizz/el-plus Element Plus export coverage', () => {
  it('covers every Element Plus El* runtime export with a wrapper, special export, or compat alias', () => {
    const coverage = getElementPlusCoverage()

    expect(coverage.totalElRuntimeExports).toBe(122)
    expect(coverage.transparentWrapped).toBe(111)
    expect(coverage.specialAndCompatCovered).toBe(11)
    expect(coverage.coveredTotal).toBe(122)
    expect(coverage.remaining).toEqual([])
  })
})
