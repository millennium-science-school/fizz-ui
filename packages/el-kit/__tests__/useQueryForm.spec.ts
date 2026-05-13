import { describe, expect, it, vi } from 'vitest'
import { computed, shallowRef } from 'vue'
import { useQueryForm } from '../src'

interface Query {
  keyword: string
  status: 'all' | 'enabled'
  page: number
}

describe('useQueryForm', () => {
  it('keeps an external model ref as the single state source', () => {
    const model = shallowRef<Query>({
      keyword: '',
      page: 1,
      status: 'all',
    })

    const form = useQueryForm<Query>({
      model,
    })

    model.value = {
      keyword: 'fizz',
      page: 2,
      status: 'enabled',
    }

    expect(form.model.value.keyword).toBe('fizz')

    form.setField('keyword', 'ui')
    form.setModel({
      keyword: 'kit',
      page: 3,
      status: 'all',
    })

    expect(model.value.keyword).toBe('kit')
    expect(model.value.page).toBe(3)
  })

  it('keeps external rules refs as the single state source', () => {
    const rules = shallowRef({
      keyword: [{ required: true, message: '请输入关键词' }],
    })

    const form = useQueryForm<Query>({
      model: {
        keyword: '',
        page: 1,
        status: 'all',
      },
      rules,
    })

    rules.value = {
      status: [{ required: true, message: '请选择状态' }],
    }

    expect(form.rules.value.status?.[0]?.message).toBe('请选择状态')

    form.setRules({
      keyword: [{ min: 2, message: '至少两个字符' }],
    })

    expect(rules.value.keyword?.[0]?.message).toBe('至少两个字符')
  })

  it('creates internal state for plain models and can reset to the initial snapshot', () => {
    const form = useQueryForm<Query>({
      model: {
        keyword: '',
        page: 1,
        status: 'all',
      },
    })

    form.setField('keyword', 'fizz')
    form.setField('status', 'enabled')

    expect(form.model.value.keyword).toBe('fizz')
    expect(form.model.value.status).toBe('enabled')

    form.reset()

    expect(form.model.value).toEqual({
      keyword: '',
      page: 1,
      status: 'all',
    })
  })

  it('submits the current model snapshot', () => {
    const onSubmit = vi.fn()
    const form = useQueryForm<Query>({
      model: {
        keyword: '',
        page: 1,
        status: 'all',
      },
      onSubmit,
    })

    form.setField('keyword', 'fizz')
    form.submit()

    expect(onSubmit).toHaveBeenCalledWith({
      keyword: 'fizz',
      page: 1,
      status: 'all',
    })
  })

  it('throws when setter targets a readonly model source', () => {
    const model = computed<Query>(() => ({
      keyword: '',
      page: 1,
      status: 'all',
    }))

    const form = useQueryForm<Query>({
      model,
    })

    expect(form.model.value.keyword).toBe('')
    expect(() => form.setField('keyword', 'fizz')).toThrow('model is readonly')
    expect(() =>
      form.setModel({
        keyword: 'kit',
        page: 2,
        status: 'enabled',
      }),
    ).toThrow('model is readonly')
  })

  it('throws when setter targets a readonly rules source', () => {
    const rules = computed(() => ({
      keyword: [{ required: true, message: '请输入关键词' }],
    }))

    const form = useQueryForm<Query>({
      model: {
        keyword: '',
        page: 1,
        status: 'all',
      },
      rules,
    })

    expect(form.rules.value.keyword?.[0]?.message).toBe('请输入关键词')
    expect(() => form.setRules({})).toThrow('rules is readonly')
  })
})
