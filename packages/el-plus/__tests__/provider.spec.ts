import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { FeButton, FeConfigProvider } from '../src'

describe('feConfigProvider', () => {
  it('sets the Element Plus namespace to fe by default', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(FeButton, { type: 'primary' }, () => '保存')),
    })

    app.mount(host)
    await nextTick()

    const button = host.querySelector('button')
    expect(button?.classList.contains('fe-button')).toBe(true)
    expect(button?.classList.contains('el-button')).toBe(false)

    app.unmount()
    host.remove()
  })

  it('keeps fe namespace even if attrs include another namespace', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, { namespace: 'el' }, () =>
          h(FeButton, { type: 'primary' }, () => '保存')),
    })

    app.mount(host)
    await nextTick()

    const button = host.querySelector('button')
    expect(button?.classList.contains('fe-button')).toBe(true)
    expect(button?.classList.contains('el-button')).toBe(false)

    app.unmount()
    host.remove()
  })
})
