import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { FecQueryTable } from '../src'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
}

const CustomControl = defineComponent({
  name: 'CustomControl',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-custom-control': 'yes',
        'placeholder': props.placeholder,
        'value': props.modelValue,
        'onInput': (event: Event) => {
          emit('update:modelValue', (event.target as HTMLInputElement).value)
        },
      })
  },
})

describe('fecQueryTable', () => {
  it('renders query form table and pagination sections', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecQueryTable<User, Query>, {
          query: { keyword: '' },
          querySchema: [{ prop: 'keyword', label: '关键词', component: 'ElInput' }],
          columns: [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
          ],
          data: ref([{ name: 'Tom', age: 18 }]),
          pagination: {
            currentPage: ref(1),
            pageSize: ref(10),
            total: ref(1),
          },
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-query-table')).toBeTruthy()
    expect(host.querySelector('.fe-comps-query-form')).toBeTruthy()
    expect(host.querySelector('.fe-comps-query-actions')).toBeTruthy()
    expect(host.querySelector('.fe-comps-table')).toBeTruthy()
    expect(host.querySelector('.fe-comps-pagination')).toBeTruthy()

    app.unmount()
    host.remove()
  })

  it('accepts getter based table data and loading state', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecQueryTable<User, Query>, {
          query: { keyword: '' },
          querySchema: [{ prop: 'keyword', label: '关键词', component: 'ElInput' }],
          columns: [{ prop: 'name', label: '姓名' }],
          data: () => [{ name: 'Getter', age: 18 }],
          loading: () => false,
          pagination: {
            currentPage: () => 1,
            pageSize: () => 10,
            total: () => 1,
          },
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-table')).toBeTruthy()

    app.unmount()
    host.remove()
  })

  it('emits query and action events without mutating the original query object', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const originalQuery = Object.freeze({ keyword: '' })
    const queryUpdates: Query[] = []
    let submitCount = 0
    let resetCount = 0

    const app = createApp({
      render: () =>
        h(FecQueryTable<User, Query>, {
          'query': originalQuery,
          'onUpdate:query': value => queryUpdates.push(value),
          'onSubmit': () => {
            submitCount += 1
          },
          'onReset': () => {
            resetCount += 1
          },
          'querySchema': [{ prop: 'keyword', label: '关键词', component: 'ElInput' }],
          'columns': [{ prop: 'name', label: '姓名' }],
          'data': ref([{ name: 'Tom', age: 18 }]),
          'pagination': {
            currentPage: ref(1),
            pageSize: ref(10),
            total: ref(1),
          },
        }),
    })

    app.mount(host)
    await nextTick()

    const input = host.querySelector('input') as HTMLInputElement
    input.value = 'Fizz'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    const buttons = [...host.querySelectorAll('button')]
    buttons.find(button => button.textContent?.includes('查询'))?.click()
    buttons.find(button => button.textContent?.includes('重置'))?.click()
    await nextTick()

    expect(originalQuery.keyword).toBe('')
    expect(queryUpdates.at(-1)).toEqual({ keyword: 'Fizz' })
    expect(submitCount).toBe(1)
    expect(resetCount).toBe(1)

    app.unmount()
    host.remove()
  })

  it('accepts semantic and custom query controls', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const queryUpdates: Query[] = []

    const app = createApp({
      render: () =>
        h(FecQueryTable<User, Query>, {
          'query': { keyword: '' },
          'onUpdate:query': value => queryUpdates.push(value),
          'querySchema': [
            { prop: 'keyword', label: '关键词', component: 'input' },
            {
              prop: 'keyword',
              label: '自定义',
              component: {
                component: CustomControl,
                props: { placeholder: 'custom-keyword' },
              },
            },
          ],
          'columns': [{ prop: 'name', label: '姓名' }],
          'data': ref([{ name: 'Tom', age: 18 }]),
          'pagination': {
            currentPage: ref(1),
            pageSize: ref(10),
            total: ref(1),
          },
        }),
    })

    app.mount(host)
    await nextTick()

    const customInput = host.querySelector('[data-custom-control="yes"]') as HTMLInputElement
    expect(customInput?.getAttribute('placeholder')).toBe('custom-keyword')

    customInput.value = 'Fizz'
    customInput.dispatchEvent(new Event('input'))
    await nextTick()

    expect(queryUpdates.at(-1)).toEqual({ keyword: 'Fizz' })

    app.unmount()
    host.remove()
  })

  it('allows query action text to be customized', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecQueryTable<User, Query>, {
          query: { keyword: '' },
          querySchema: [{ prop: 'keyword', label: '关键词', component: 'input' }],
          submitText: 'Search',
          resetText: 'Clear',
          columns: [{ prop: 'name', label: '姓名' }],
          data: ref([{ name: 'Tom', age: 18 }]),
          pagination: {
            currentPage: ref(1),
            pageSize: ref(10),
            total: ref(1),
          },
        }),
    })

    app.mount(host)
    await nextTick()

    const buttons = [...host.querySelectorAll('button')]
    expect(buttons.some(button => button.textContent?.includes('Search'))).toBe(true)
    expect(buttons.some(button => button.textContent?.includes('Clear'))).toBe(true)

    app.unmount()
    host.remove()
  })
})
