import { describe, expect, it } from 'vitest'
import { useDetailState } from '../src'

interface User {
  id: number
  name: string
}

describe('useDetailState', () => {
  it('opens, closes, and clears the current detail record', () => {
    const detail = useDetailState<User>()
    const record = { id: 1, name: 'Tom' }

    expect(detail.visible.value).toBe(false)
    expect(detail.record.value).toBeUndefined()

    detail.open(record)

    expect(detail.visible.value).toBe(true)
    expect(detail.record.value).toBe(record)

    detail.close()

    expect(detail.visible.value).toBe(false)
    expect(detail.record.value).toBe(record)

    detail.clear()

    expect(detail.visible.value).toBe(false)
    expect(detail.record.value).toBeUndefined()
  })
})
