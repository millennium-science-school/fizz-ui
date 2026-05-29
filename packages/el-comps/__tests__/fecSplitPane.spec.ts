import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
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

  it('bridges FeSplitterPanel update:size to update:leftSize', async () => {
    const onUpdateLeftSize = vi.fn()
    const host = document.createElement('div')
    const app = createApp({
      render() {
        return h(FecSplitPane, {
          'leftSize': 260,
          'onUpdate:leftSize': onUpdateLeftSize,
        }, {
          default: () => 'Right',
          left: () => 'Left',
        })
      },
    })

    app.mount(host)
    await nextTick()

    // Walk the vnode tree to find the left FeSplitterPanel's onUpdate:size handler
    // and invoke it directly — this tests the emit bridge without needing real drag events.
    //
    // app._instance.subTree      → h(FecSplitPane, ...)  [component vnode]
    // .component.subTree         → h(FeSplitter, ...)    [FecSplitPane renders FeSplitter]
    // .children.default()        → [leftPanel, rightPanel]  [FeSplitter slot factory]
    const fecSplitPaneInstance = app._instance?.subTree?.component
    const feSplitterVnode = fecSplitPaneInstance?.subTree
    const slotDefault = (feSplitterVnode?.children as any)?.default
    const panels: any[] = typeof slotDefault === 'function' ? slotDefault() : []
    const leftPanel = panels[0]
    const onUpdateSize = leftPanel?.props?.['onUpdate:size']

    expect(typeof onUpdateSize).toBe('function')
    onUpdateSize(320)

    expect(onUpdateLeftSize).toHaveBeenCalledWith(320)

    app.unmount()
  })
})
