import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { FecTreePanel } from '../src'

interface Node {
  id: string
  label: string
  children?: Node[]
}

const data: Node[] = [
  { id: 'network', label: 'Network' },
  { id: 'service', label: 'Service' },
]

describe('fecTreePanel', () => {
  it('renders search input and tree content', async () => {
    const host = document.createElement('div')
    const app = createApp({
      render() {
        return h(FecTreePanel<Node>, {
          data,
          nodeKey: 'id',
          searchable: true,
        })
      },
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-tree-panel')).not.toBeNull()
    expect(host.textContent).toContain('Network')

    app.unmount()
  })

  it('emits collapse updates from the collapse control', async () => {
    const host = document.createElement('div')
    const onUpdateCollapsed = vi.fn()
    const app = createApp({
      render() {
        return h(FecTreePanel<Node>, {
          'collapsible': true,
          data,
          'nodeKey': 'id',
          'onUpdate:collapsed': onUpdateCollapsed,
        })
      },
    })

    app.mount(host)
    await nextTick()

    const button = host.querySelector('button') as HTMLButtonElement
    button.click()
    await nextTick()

    expect(onUpdateCollapsed).toHaveBeenCalledWith(true)

    app.unmount()
  })
})
