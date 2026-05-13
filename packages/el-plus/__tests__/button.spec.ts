import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { FeButton, FeConfigProvider } from '../src'

describe('fe button', () => {
  it('passes attrs, classes, and slots through to Element Plus', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeButton,
            {
              type: 'primary',
              class: 'consumer-class',
              disabled: true,
            },
            () => '保存',
          )),
    })

    app.mount(host)
    await nextTick()

    const button = host.querySelector('button')
    expect(button?.classList.contains('fe-button')).toBe(true)
    expect(button?.classList.contains('fe-button--primary')).toBe(true)
    expect(button?.classList.contains('fe-btn')).toBe(true)
    expect(button?.classList.contains('consumer-class')).toBe(true)
    expect(button?.classList.contains('el-button')).toBe(false)
    expect((button as HTMLButtonElement | null)?.disabled).toBe(true)
    expect(button?.textContent).toContain('保存')

    app.unmount()
    host.remove()
  })

  it('lets click listeners pass through attrs without declaring component emits', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const onClick = vi.fn()

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeButton,
            {
              'data-testid': 'save-button',
              'onClick': onClick,
            },
            () => '保存',
          )),
    })

    app.mount(host)
    await nextTick()

    const button = host.querySelector('[data-testid="save-button"]') as HTMLButtonElement | null
    button?.click()
    await nextTick()
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent)

    app.unmount()
    host.remove()
  })

  it('does not use deprecated Element Plus runtime button prop helpers', () => {
    const source = readFileSync(
      resolve(__dirname, '../src/components/transparent-components.ts'),
      'utf8',
    )

    expect(source).not.toContain('buttonProps')
    expect(source).not.toContain('buttonEmits')
  })
})
