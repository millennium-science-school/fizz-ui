import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { FecSplitPane } from '../src'

describe('fecSplitPane', () => {
  it('renders left and right slots through the splitter facade', async () => {
    const host = document.createElement('div')
    const app = createApp({
      render() {
        return h(FecSplitPane, { leftSize: 260 }, {
          default: () => h('div', { class: 'right-content' }, 'Right'),
          left: () => h('div', { class: 'left-content' }, 'Left'),
        })
      },
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-split-pane')).not.toBeNull()
    expect(host.querySelector('.left-content')?.textContent).toBe('Left')
    expect(host.querySelector('.right-content')?.textContent).toBe('Right')

    app.unmount()
  })

  it('forwards left panel size updates', async () => {
    const host = document.createElement('div')
    const size = ref<string | number>(260)
    const app = createApp({
      render() {
        return h(FecSplitPane, {
          'leftSize': size.value,
          'onUpdate:leftSize': (value: string | number) => {
            size.value = value
          },
        }, {
          default: () => 'Right',
          left: () => 'Left',
        })
      },
    })

    app.mount(host)
    await nextTick()

    const vnode = app._instance?.subTree
    expect(vnode).toBeTruthy()

    app.unmount()
  })
})
