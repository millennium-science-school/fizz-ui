import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { FecTable } from '../src'
import { renderSchemaFields } from '../src/components/schemaFields'

interface User {
  name: string
  age: number
}

describe('fecTable', () => {
  it('renders table and pagination without form', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
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

    expect(host.querySelector('.fe-comps-table')).toBeTruthy()
    expect(host.querySelector('.fe-comps-pagination')).toBeTruthy()
    expect(host.querySelector('.fe-comps-form')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('accepts getter based table data and loading', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          columns: [{ prop: 'name', label: '姓名' }],
          data: () => [{ name: 'Getter', age: 18 }],
          loading: ref(false),
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

  it('renders toolbar when toolbarActions are provided', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const actions: string[] = []

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          columns: [{ prop: 'name', label: '姓名' }],
          data: ref([]),
          toolbarActions: [
            { key: 'create', label: '新建', type: 'primary' },
          ],
          'onToolbar-action': (key: string) => actions.push(key),
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-toolbar')).toBeTruthy()
    expect(host.textContent).toContain('新建')

    ;(host.querySelector('button') as HTMLButtonElement).click()
    await nextTick()
    expect(actions).toEqual(['create'])

    app.unmount()
    host.remove()
  })

  it('emits update:currentPage from pagination', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const pageUpdates: number[] = []

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          columns: [{ prop: 'name', label: '姓名' }],
          data: ref([{ name: 'Tom', age: 18 }]),
          pagination: {
            currentPage: ref(1),
            total: ref(30),
            pageSize: ref(10),
          },
          'onUpdate:currentPage': (page: number) => pageUpdates.push(page),
        }),
    })

    app.mount(host)
    await nextTick()

    const nextButton = host.querySelector('.btn-next') as HTMLButtonElement
    nextButton.click()
    await nextTick()

    expect(pageUpdates).toContain(2)

    app.unmount()
    host.remove()
  })

  it('forwards supported table column props', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          columns: [
            { prop: 'name', label: '姓名', width: 160, minWidth: 120, align: 'center' },
          ],
          data: ref([{ name: 'Tom', age: 18 }]),
        }),
    })

    app.mount(host)
    await nextTick()
    await nextTick()

    expect(host.textContent).toContain('姓名')
    expect(host.querySelector('.is-center')).toBeTruthy()

    app.unmount()
    host.remove()
  })

  it('renders row actions and emits row-action', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const rowEvents: Array<{ key: string, row: User }> = []

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          columns: [{ prop: 'name', label: '姓名' }],
          data: ref([{ name: 'Tom', age: 18 }]),
          rowActions: [{ key: 'edit', label: '编辑' }],
          'onRow-action': (key: string, row: User) => rowEvents.push({ key, row }),
        }),
    })

    app.mount(host)
    await nextTick()
    await nextTick()

    const editBtn = Array.from(host.querySelectorAll('button')).find(
      b => b.textContent?.includes('编辑'),
    )
    expect(editBtn).toBeTruthy()
    editBtn!.click()
    await nextTick()

    expect(rowEvents[0]?.key).toBe('edit')
    expect(rowEvents[0]?.row?.name).toBe('Tom')

    app.unmount()
    host.remove()
  })
})

describe('renderSchemaFields', () => {
  it('renders select options from field schema metadata', () => {
    const fields = renderSchemaFields({
      schema: [
        {
          prop: 'status',
          label: '状态',
          kind: 'select',
          options: [
            { label: '启用', value: 'enabled' },
            { label: '禁用', value: 'disabled', disabled: true },
          ],
        },
      ],
      model: { status: 'enabled' },
      onUpdateField: () => {},
    })

    expect(fields).toHaveLength(1)
  })
})
