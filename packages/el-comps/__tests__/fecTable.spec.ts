import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { FecTable } from '../src'

interface User {
  name: string
  age: number
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

describe('fecTable', () => {
  it('renders stable structural classes for form table and pagination', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          form: { name: '' },
          formSchema: [{ prop: 'name', label: '姓名', component: 'ElInput' }],
          columns: [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
          ],
          data: ref([{ name: 'Tom', age: 18 }]),
          pagination: {
            currentPage: ref(1),
            total: ref(1),
            pageSize: 10,
          },
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-form')).toBeTruthy()
    expect(host.querySelector('.fe-comps-table')).toBeTruthy()
    expect(host.querySelector('.fe-comps-pagination')).toBeTruthy()

    app.unmount()
    host.remove()
  })

  it('accepts getter based table data', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          form: { name: '' },
          formSchema: [{ prop: 'name', label: '姓名', component: 'ElInput' }],
          columns: [{ prop: 'name', label: '姓名' }],
          data: () => [{ name: 'Getter', age: 18 }],
          pagination: {
            currentPage: 1,
            total: () => 1,
            pageSize: 10,
          },
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-table')).toBeTruthy()

    app.unmount()
    host.remove()
  })

  it('emits update:form instead of mutating the original form object', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const originalForm = Object.freeze({ name: '' })
    const updates: Array<Record<string, unknown>> = []

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          'form': originalForm,
          'onUpdate:form': value => updates.push(value),
          'formSchema': [{ prop: 'name', label: '姓名', component: 'ElInput' }],
          'columns': [{ prop: 'name', label: '姓名' }],
          'data': ref([{ name: 'Tom', age: 18 }]),
          'pagination': {
            currentPage: ref(1),
            total: ref(1),
            pageSize: 10,
          },
        }),
    })

    app.mount(host)
    await nextTick()

    const input = host.querySelector('input') as HTMLInputElement
    input.value = 'Ann'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    expect(originalForm.name).toBe('')
    expect(updates.at(-1)).toEqual({ name: 'Ann' })

    app.unmount()
    host.remove()
  })

  it('accepts semantic and custom form controls', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const updates: Array<Record<string, unknown>> = []

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          'form': { name: '' },
          'onUpdate:form': value => updates.push(value),
          'formSchema': [
            { prop: 'name', label: '姓名', component: 'input' },
            {
              prop: 'name',
              label: '自定义',
              component: {
                component: CustomControl,
                props: { placeholder: 'custom-name' },
              },
            },
          ],
          'columns': [{ prop: 'name', label: '姓名' }],
          'data': ref([{ name: 'Tom', age: 18 }]),
          'pagination': {
            currentPage: ref(1),
            total: ref(1),
            pageSize: 10,
          },
        }),
    })

    app.mount(host)
    await nextTick()

    const customInput = host.querySelector('[data-custom-control="yes"]') as HTMLInputElement
    expect(customInput?.getAttribute('placeholder')).toBe('custom-name')

    customInput.value = 'Ann'
    customInput.dispatchEvent(new Event('input'))
    await nextTick()

    expect(updates.at(-1)).toEqual({ name: 'Ann' })

    app.unmount()
    host.remove()
  })
})
