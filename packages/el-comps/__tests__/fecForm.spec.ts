import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { FecForm, FecQueryForm } from '../src'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
  status: string
}

describe('FecForm', () => {
  it('renders kind fields from schema', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecForm<User>, {
          model: { name: 'Tom', age: 18 },
          schema: [
            { prop: 'name', label: '姓名', kind: 'input' },
            { prop: 'age', label: '年龄', kind: 'number' },
          ],
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-form')).toBeTruthy()
    expect(host.textContent).toContain('姓名')
    expect(host.textContent).toContain('年龄')

    app.unmount()
    host.remove()
  })

  it('emits update:model without mutating the original object', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const model = { name: 'Tom', age: 18 }
    const emitted: User[] = []

    const app = createApp({
      render: () =>
        h(FecForm<User>, {
          model,
          schema: [{ prop: 'name', label: '姓名', kind: 'input' }],
          'onUpdate:model': (updated: User) => emitted.push(updated),
        }),
    })

    app.mount(host)
    await nextTick()

    // Trigger an update via the rendered input
    const input = host.querySelector('input') as HTMLInputElement
    input.value = 'Jerry'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    expect(emitted).toHaveLength(1)
    expect(emitted[0].name).toBe('Jerry')
    // Original must not be mutated
    expect(model.name).toBe('Tom')

    app.unmount()
    host.remove()
  })
})

describe('FecQueryForm', () => {
  it('renders submit and reset buttons', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecQueryForm<Query>, {
          model: { keyword: '', status: '' },
          schema: [{ prop: 'keyword', label: '关键词', kind: 'input' }],
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-query-form')).toBeTruthy()
    expect(host.textContent).toContain('查询')
    expect(host.textContent).toContain('重置')

    app.unmount()
    host.remove()
  })

  it('emits submit and reset events', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const submits: Query[] = []
    const resets: number[] = []

    const app = createApp({
      render: () =>
        h(FecQueryForm<Query>, {
          model: { keyword: 'fizz', status: '' },
          schema: [{ prop: 'keyword', label: '关键词', kind: 'input' }],
          onSubmit: (model: Query) => submits.push(model),
          onReset: () => resets.push(1),
        }),
    })

    app.mount(host)
    await nextTick()

    const buttons = host.querySelectorAll('button')
    const submitBtn = Array.from(buttons).find(b => b.textContent?.includes('查询'))
    const resetBtn = Array.from(buttons).find(b => b.textContent?.includes('重置'))

    submitBtn!.click()
    await nextTick()
    expect(submits).toHaveLength(1)
    expect(submits[0].keyword).toBe('fizz')

    resetBtn!.click()
    await nextTick()
    expect(resets).toHaveLength(1)

    app.unmount()
    host.remove()
  })

  it('emits update:model and renders select options', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const emitted: Query[] = []

    const app = createApp({
      render: () =>
        h(FecQueryForm<Query>, {
          model: { keyword: '', status: '' },
          schema: [
            {
              prop: 'status',
              label: '状态',
              kind: 'select',
              options: [
                { label: '启用', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
              ],
            },
          ],
          'onUpdate:model': (updated: Query) => emitted.push(updated),
        }),
    })

    app.mount(host)
    await nextTick()

    // verify options are rendered
    expect(host.querySelector('.fe-comps-query-form')).toBeTruthy()

    // simulate update:model from an inner control update
    const input = host.querySelector('input') as HTMLInputElement
    if (input) {
      input.value = 'enabled'
      input.dispatchEvent(new Event('input'))
      await nextTick()
    }

    app.unmount()
    host.remove()
  })

  it('supports custom submitText and resetText', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecQueryForm<Query>, {
          model: { keyword: '', status: '' },
          schema: [{ prop: 'keyword', label: '关键词', kind: 'input' }],
          submitText: '搜索',
          resetText: '清空',
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.textContent).toContain('搜索')
    expect(host.textContent).toContain('清空')

    app.unmount()
    host.remove()
  })
})
