import { describe, expect, it } from 'vitest'
import { computed, reactive, ref, shallowRef } from 'vue'
import { useQueryState } from '../src'

interface Query {
  keyword: string
  status: 'all' | 'enabled'
  tags?: string[]
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

  it('accepts a ref model without DataCloneError (reactive proxy safety)', () => {
    const model = ref<Query>({ keyword: '', status: 'all', tags: ['a'] })
    const query = useQueryState<Query>({ model })

    expect(query.model.value).toEqual({ keyword: '', status: 'all', tags: ['a'] })
  })

  it('accepts a reactive model without DataCloneError (proxy safety)', () => {
    // shallowRef wrapping a reactive proxy — .value is a reactive proxy, spread must not throw
    const model = shallowRef(reactive<Query>({ keyword: '', status: 'all' }))
    const query = useQueryState<Query>({ model })

    expect(query.model.value.keyword).toBe('')
    query.setField('keyword', 'fizz')
    query.reset()
    expect(query.model.value.keyword).toBe('')
  })

  it('deep-clones array fields when clone option is provided', () => {
    const query = useQueryState<Query>({
      model: { keyword: '', status: 'all', tags: ['x'] },
      clone: m => JSON.parse(JSON.stringify(m)),
    })

    query.model.value.tags!.push('y')
    query.reset()
    expect(query.model.value.tags).toEqual(['x'])
  })
})
