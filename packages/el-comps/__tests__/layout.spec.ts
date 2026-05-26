import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { FecPage, FecSection, FecStack, FecToolbar } from '../src'

describe('CRUD layout components', () => {
  it('renders page and section structure with stable classes', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecPage, { title: 'Users', description: 'Manage users' }, {
          extra: () => h('button', 'Create'),
          default: () =>
            h(FecSection, { title: 'List', description: 'Active users' }, {
              extra: () => h('span', 'Extra'),
              default: () => h('div', 'Body'),
            }),
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-page')).toBeTruthy()
    expect(host.querySelector('.fe-comps-page-header')).toBeTruthy()
    expect(host.querySelector('.fe-comps-section')).toBeTruthy()
    expect(host.textContent).toContain('Users')
    expect(host.textContent).toContain('List')

    app.unmount()
    host.remove()
  })

  it('renders stack direction and toolbar action events', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const clicked: string[] = []

    const app = createApp({
      render: () =>
        h(FecStack, { direction: 'horizontal', gap: 'sm' }, () =>
          h(FecToolbar, {
            actions: [
              { key: 'create', label: 'Create', type: 'primary' },
              { key: 'hidden', label: 'Hidden', hidden: true },
            ],
            onAction: (key: string) => clicked.push(key),
          })),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-stack')).toBeTruthy()
    expect(host.querySelector('.fe-comps-stack--horizontal')).toBeTruthy()
    expect(host.querySelector('.fe-comps-toolbar')).toBeTruthy()
    expect(host.textContent).toContain('Create')
    expect(host.textContent).not.toContain('Hidden')

    ;(host.querySelector('button') as HTMLButtonElement).click()
    await nextTick()

    expect(clicked).toEqual(['create'])

    app.unmount()
    host.remove()
  })
})
