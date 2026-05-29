import { describe, expect, it, vi } from 'vitest'
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

  it('renders nav links with correct hrefs and no Vue warnings', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
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
          basic: () => null,
          resource: () => null,
        })
      },
    })

    app.mount(host)
    await nextTick()

    const links = host.querySelectorAll('.fe-comps-detail-sections__nav-link')
    expect(links).toHaveLength(2)
    expect((links[0] as HTMLAnchorElement).getAttribute('href')).toBe('#fec-detail-section-basic')
    expect((links[1] as HTMLAnchorElement).getAttribute('href')).toBe('#fec-detail-section-resource')

    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()

    app.unmount()
  })
})
