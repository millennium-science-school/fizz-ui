import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { FecDetail, FecDialogForm, FecDrawerForm } from '../src'

interface User {
  name: string
  age: number
}

describe('fecDetail', () => {
  it('renders label/value pairs with stable class', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecDetail<User>, {
          record: { name: 'Tom', age: 18 },
          schema: [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
          ],
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-detail')).toBeTruthy()
    expect(host.textContent).toContain('姓名')
    expect(host.textContent).toContain('Tom')
    expect(host.textContent).toContain('年龄')
    expect(host.textContent).toContain('18')

    app.unmount()
    host.remove()
  })

  it('renders formatter output', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecDetail<User>, {
          record: { name: 'Tom', age: 18 },
          schema: [
            {
              prop: 'age',
              label: '年龄',
              formatter: (value: number) => `${value} 岁`,
            },
          ],
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.textContent).toContain('18 岁')

    app.unmount()
    host.remove()
  })

  it('renders emptyText for nullish values', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecDetail<{ name: string | null }>, {
          record: { name: null },
          schema: [{ prop: 'name', label: '姓名' }],
          emptyText: '暂无',
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.textContent).toContain('暂无')

    app.unmount()
    host.remove()
  })
})

describe('fecDialogForm', () => {
  it('renders dialog title and form fields when visible', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecDialogForm<User>, {
          modelValue: true,
          title: '新建用户',
          model: { name: '', age: 0 },
          schema: [{ prop: 'name', label: '姓名', kind: 'input' }],
        }),
    })

    app.mount(host)
    await nextTick()
    await nextTick()

    const dialog = document.querySelector('.fe-dialog')
    expect(dialog).toBeTruthy()
    expect(document.body.textContent).toContain('新建用户')
    expect(document.body.textContent).toContain('姓名')

    app.unmount()
  })

  it('emits update:modelValue, confirm and cancel', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const events: string[] = []

    const app = createApp({
      render: () =>
        h(FecDialogForm<User>, {
          'modelValue': true,
          'title': '编辑',
          'model': { name: 'Tom', age: 18 },
          'schema': [{ prop: 'name', label: '姓名', kind: 'input' }],
          'onConfirm': () => events.push('confirm'),
          'onCancel': () => events.push('cancel'),
          'onUpdate:modelValue': () => events.push('close'),
        }),
    })

    app.mount(host)
    await nextTick()
    await nextTick()

    const buttons = Array.from(document.querySelectorAll('button'))
    const confirmBtn = buttons.find(b => b.textContent?.includes('确定'))
    const cancelBtn = buttons.find(b => b.textContent?.includes('取消'))

    confirmBtn?.click()
    await nextTick()
    expect(events).toContain('confirm')

    cancelBtn?.click()
    await nextTick()
    expect(events).toContain('cancel')

    app.unmount()
  })
})

describe('fecDrawerForm', () => {
  it('renders drawer title and form fields when visible', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecDrawerForm<User>, {
          modelValue: true,
          title: '编辑用户',
          model: { name: '', age: 0 },
          schema: [{ prop: 'name', label: '姓名', kind: 'input' }],
        }),
    })

    app.mount(host)
    await nextTick()
    await nextTick()

    const drawer = document.querySelector('.fe-drawer')
    expect(drawer).toBeTruthy()
    expect(document.body.textContent).toContain('编辑用户')

    app.unmount()
  })

  it('emits update:modelValue, confirm and cancel', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const events: string[] = []

    const app = createApp({
      render: () =>
        h(FecDrawerForm<User>, {
          'modelValue': true,
          'title': '编辑',
          'model': { name: 'Tom', age: 18 },
          'schema': [{ prop: 'name', label: '姓名', kind: 'input' }],
          'onConfirm': () => events.push('confirm'),
          'onCancel': () => events.push('cancel'),
          'onUpdate:modelValue': () => events.push('close'),
        }),
    })

    app.mount(host)
    await nextTick()
    await nextTick()

    const buttons = Array.from(document.querySelectorAll('button'))
    const confirmBtn = buttons.find(b => b.textContent?.includes('确定'))
    const cancelBtn = buttons.find(b => b.textContent?.includes('取消'))

    confirmBtn?.click()
    await nextTick()
    expect(events).toContain('confirm')

    cancelBtn?.click()
    await nextTick()
    expect(events).toContain('cancel')

    app.unmount()
  })
})
