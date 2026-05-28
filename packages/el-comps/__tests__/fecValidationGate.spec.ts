/**
 * Validation gate tests for FecQueryForm, FecDialogForm, FecDrawerForm.
 *
 * happy-dom does not support ElFormItem registration with ElForm across slot
 * boundaries (provide/inject breaks through the transparent-wrapper slot chain),
 * so ElForm.validate() always resolves in this environment regardless of rules.
 *
 * This file replaces FecForm.vue with a controlled mock (for Dialog/Drawer) and
 * also replaces @fizz/el-plus's FeForm with a controlled mock (for QueryForm)
 * so their `validate` method can be toggled between "resolve" and "reject" to
 * exercise the try/catch gate that guards submit/confirm.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'

import { FecDialogForm, FecDrawerForm, FecQueryForm } from '../src'

// `shouldFail` is read lazily by the mocks' setup at call time.
let shouldFail = false

// ── Mock @fizz/el-plus: replace only FeForm so FecQueryForm's direct FeForm
//    usage becomes controllable. FeDialog and other components stay real.
vi.mock('@fizz/el-plus', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@fizz/el-plus')>()
  const FeFormMock = defineComponent({
    name: 'FeForm',
    inheritAttrs: false,
    setup(_, { expose, attrs, slots }) {
      expose({
        validate: () =>
          shouldFail
            ? Promise.reject(new Error('validation failed'))
            : Promise.resolve(true),
        clearValidate: () => {},
        resetFields: () => {},
      })
      return () => h('form', attrs, slots.default?.())
    },
  })
  return { ...mod, FeForm: FeFormMock }
})

// ── Mock FecForm.vue: used by FecDialogForm and FecDrawerForm internally.
vi.mock('../src/components/fec-form/FecForm.vue', () => ({
  default: defineComponent({
    name: 'FecForm',
    props: {
      model: Object,
      schema: Array,
      rules: Object,
      labelWidth: null,
      columns: Number,
    },
    emits: ['update:model'],
    setup(_props, { expose }) {
      expose({
        validate: () =>
          shouldFail
            ? Promise.reject(new Error('validation failed'))
            : Promise.resolve(true),
        clearValidate: () => {},
      })
      return () => null
    },
  }),
}))

const flushPromises = () => new Promise<void>(resolve => setTimeout(resolve, 0))

interface User { name: string, age: number }
interface Query { keyword: string, status: string }

// Reset the flag before every test so tests are isolated.
beforeEach(() => {
  shouldFail = false
})

// ─── FecQueryForm ────────────────────────────────────────────────────────────

describe('fecQueryForm validation gate', () => {
  it('emits submit when validate resolves', async () => {
    shouldFail = false
    const host = document.createElement('div')
    document.body.append(host)
    const submits: Query[] = []

    const app = createApp({
      render: () =>
        h(FecQueryForm<Query>, {
          model: { keyword: 'fizz', status: '' },
          schema: [{ prop: 'keyword', label: '关键词', kind: 'input' }],
          onSubmit: (m: Query) => submits.push(m),
        }),
    })
    app.mount(host)
    await nextTick()

    const btn = Array.from(host.querySelectorAll('button'))
      .find(b => b.textContent?.includes('查询'))
    btn!.click()
    await flushPromises()

    expect(submits).toHaveLength(1)

    app.unmount()
    host.remove()
  })

  it('does not emit submit when validate rejects', async () => {
    shouldFail = true
    const host = document.createElement('div')
    document.body.append(host)
    const submits: Query[] = []

    const app = createApp({
      render: () =>
        h(FecQueryForm<Query>, {
          model: { keyword: '', status: '' },
          schema: [{ prop: 'keyword', label: '关键词', kind: 'input' }],
          onSubmit: (m: Query) => submits.push(m),
        }),
    })
    app.mount(host)
    await nextTick()

    const btn = Array.from(host.querySelectorAll('button'))
      .find(b => b.textContent?.includes('查询'))
    btn!.click()
    await flushPromises()

    expect(submits).toHaveLength(0)

    app.unmount()
    host.remove()
  })
})

// ─── FecDialogForm ───────────────────────────────────────────────────────────

describe('fecDialogForm validation gate', () => {
  it('emits confirm when validate resolves', async () => {
    shouldFail = false
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
          'onUpdate:modelValue': () => events.push('close'),
        }),
    })
    app.mount(host)
    await nextTick()
    await nextTick()

    const btn = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent?.includes('确定'))
    btn?.click()
    await flushPromises()

    expect(events).toContain('confirm')
    expect(events).toContain('close')

    app.unmount()
  })

  it('does not emit confirm or close when validate rejects', async () => {
    shouldFail = true
    const host = document.createElement('div')
    document.body.append(host)
    const events: string[] = []

    const app = createApp({
      render: () =>
        h(FecDialogForm<User>, {
          'modelValue': true,
          'title': '编辑',
          'model': { name: '', age: 18 },
          'schema': [{ prop: 'name', label: '姓名', kind: 'input' }],
          'onConfirm': () => events.push('confirm'),
          'onUpdate:modelValue': () => events.push('close'),
        }),
    })
    app.mount(host)
    await nextTick()
    await nextTick()

    const btn = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent?.includes('确定'))
    btn?.click()
    await flushPromises()

    expect(events).not.toContain('confirm')
    expect(events).not.toContain('close')

    app.unmount()
  })
})

// ─── FecDrawerForm ───────────────────────────────────────────────────────────

describe('fecDrawerForm validation gate', () => {
  it('emits confirm when validate resolves', async () => {
    shouldFail = false
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
          'onUpdate:modelValue': () => events.push('close'),
        }),
    })
    app.mount(host)
    await nextTick()
    await nextTick()

    const btn = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent?.includes('确定'))
    btn?.click()
    await flushPromises()

    expect(events).toContain('confirm')
    expect(events).toContain('close')

    app.unmount()
  })

  it('does not emit confirm or close when validate rejects', async () => {
    shouldFail = true
    const host = document.createElement('div')
    document.body.append(host)
    const events: string[] = []

    const app = createApp({
      render: () =>
        h(FecDrawerForm<User>, {
          'modelValue': true,
          'title': '编辑',
          'model': { name: '', age: 18 },
          'schema': [{ prop: 'name', label: '姓名', kind: 'input' }],
          'onConfirm': () => events.push('confirm'),
          'onUpdate:modelValue': () => events.push('close'),
        }),
    })
    app.mount(host)
    await nextTick()
    await nextTick()

    const btn = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent?.includes('确定'))
    btn?.click()
    await flushPromises()

    expect(events).not.toContain('confirm')
    expect(events).not.toContain('close')

    app.unmount()
  })
})
