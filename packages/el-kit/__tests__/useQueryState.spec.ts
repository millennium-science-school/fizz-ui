import { describe, expect, it } from 'vitest'
import { computed, shallowRef } from 'vue'
import { useQueryState } from '../src'

interface Query {
  keyword: string
  status: 'all' | 'enabled'
}

describe('useQueryState', () => {
  it('creates writable query state and resets to the initial snapshot', () => {
    const query = useQueryState<Query>({
      model: { keyword: '', status: 'all' },
    })

    query.setField('keyword', 'fizz')
    query.setField('status', 'enabled')

    expect(query.model.value).toEqual({ keyword: 'fizz', status: 'enabled' })

    query.reset()
    expect(query.model.value).toEqual({ keyword: '', status: 'all' })
  })

  it('keeps an external model ref as the single state source', () => {
    const model = shallowRef<Query>({ keyword: '', status: 'all' })
    const query = useQueryState<Query>({ model })

    query.setModel({ keyword: 'kit', status: 'enabled' })

    expect(model.value).toEqual({ keyword: 'kit', status: 'enabled' })
  })

  it('uses an explicit initial model snapshot for reset', () => {
    const query = useQueryState<Query>({
      initialModel: { keyword: 'initial', status: 'enabled' },
      model: { keyword: '', status: 'all' },
    })

    query.setField('keyword', 'changed')
    query.reset()

    expect(query.model.value).toEqual({ keyword: 'initial', status: 'enabled' })
  })

  it('throws when setters target a readonly model source', () => {
    const query = useQueryState<Query>({
      model: computed(() => ({ keyword: '', status: 'all' })),
    })

    expect(() => query.setField('keyword', 'fizz')).toThrow('model is readonly')
    expect(() =>
      query.setModel({ keyword: 'kit', status: 'enabled' }),
    ).toThrow('model is readonly')
  })
})
