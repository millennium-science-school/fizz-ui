import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { FecDetailSections } from '../src'

describe('fecDetailSections', () => {
  it('renders section slots and local navigation', async () => {
    const host = document.createElement('div')
    const app = createApp({
      render() {
        return h(FecDetailSections, {
          nav: true,
          sections: [
            { key: 'basic', title: 'Basic' },
            { key: 'resource', title: 'Resource' },
          ],
        }, {
          basic: () => h('div', { class: 'basic-slot' }, 'Basic content'),
          resource: () => h('div', { class: 'resource-slot' }, 'Resource content'),
        })
      },
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-detail-sections')).not.toBeNull()
    expect(host.textContent).toContain('Basic content')
    expect(host.textContent).toContain('Resource content')
    expect(host.querySelector('.fe-comps-detail-sections__nav')).not.toBeNull()

    app.unmount()
  })
})
