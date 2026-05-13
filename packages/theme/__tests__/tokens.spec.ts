import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createThemeVarsCss, fizzPreset } from '../src'

const packageRoot = resolve(__dirname, '..')

function normalizeCss(css: string): string {
  return css.replace(/\s+/g, ' ').trim()
}

describe('theme token generation', () => {
  it('exposes runtime and style entries without component package dependencies', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
    )

    expect(packageJson.exports['.'].types).toBe('./dist/index.d.ts')
    expect(packageJson.exports['.'].import).toBe('./dist/index.mjs')
    expect(packageJson.exports['./styles']).toEqual({
      types: './dist/styles/vars.d.ts',
      default: './dist/styles/vars.css',
    })
    expect(packageJson.exports).not.toHaveProperty('./styles/bridge')
    expect(existsSync(resolve(packageRoot, 'src/styles/bridge.css'))).toBe(false)
    expect(packageJson.dependencies ?? {}).not.toHaveProperty('@fizz/el-plus')
    expect(packageJson.dependencies ?? {}).not.toHaveProperty('@fizz/el-kit')
    expect(packageJson.dependencies ?? {}).not.toHaveProperty('@fizz/el-comps')
  })

  it('uses tokens as the source for UnoCSS preflight CSS', () => {
    const presetCss = fizzPreset().preflights?.map(preflight => preflight.getCSS()).join('\n') ?? ''

    expect(normalizeCss(presetCss)).toBe(normalizeCss(createThemeVarsCss()))
  })

  it('generates only Fizz-owned vars by default', () => {
    const css = createThemeVarsCss()

    expect(css).toContain('--fe-fizz-button-radius:')
    expect(css).toContain('--fe-fizz-control-radius:')
    expect(css).toContain('--fe-fizz-surface-radius:')
    expect(css).toContain('--fe-fizz-feedback-radius:')
    expect(css).toContain('--fe-comps-form-cols:')
    expect(css).toContain('--fe-comps-form-gap:')
    expect(css).toContain('--fe-comps-table-header-bg:')
    expect(css).not.toContain('--fe-color-primary:')
    expect(css).not.toContain('--fe-color-primary-hover:')
    expect(css).not.toContain('--fe-color-primary-active:')
  })

  it('emits core component selectors for the playground acceptance surface', () => {
    const css = createThemeVarsCss()

    expect(css).toContain('.fe-btn')
    expect(css).toContain('.fe-input')
    expect(css).toContain('.fe-table')
    expect(css).toContain('.fe-dialog')
    expect(css).toContain('.fe-message')
    expect(css).toContain('.fe-loading')
  })

  it('emits service selectors for fizz service classes', () => {
    const css = createThemeVarsCss()

    expect(css).toContain('.fe-message')
    expect(css).toContain('.fe-loading')
    expect(css).toContain('.fe-notification')
    expect(css).toContain('.fe-message-box')
  })

  it('can generate optional Element Plus variable overrides', () => {
    const css = createThemeVarsCss({
      elementVars: {
        '--fe-color-primary': '#0f766e',
        '--fe-color-primary-light-3': '#5eead4',
        '--fe-color-primary-light-5': '#99f6e4',
        '--fe-color-primary-light-7': '#ccfbf1',
        '--fe-color-primary-light-9': '#f0fdfa',
        '--fe-color-primary-dark-2': '#115e59',
      },
    })

    expect(css).toContain('--fe-color-primary: #0f766e;')
    expect(css).toContain('--fe-color-primary-light-3: #5eead4;')
    expect(css).not.toContain('--fe-color-primary-hover:')
  })

  it('keeps the checked-in vars.css synchronized with generated token CSS', () => {
    const varsCss = readFileSync(resolve(packageRoot, 'src/styles/vars.css'), 'utf8')

    expect(normalizeCss(varsCss)).toBe(normalizeCss(createThemeVarsCss()))
  })

  it('can generate token CSS for custom light and dark selectors', () => {
    const css = createThemeVarsCss({
      lightSelector: '.fe-theme',
      darkSelector: '.fe-theme.dark',
    })

    expect(css).toContain('.fe-theme {')
    expect(css).toContain('.fe-theme.dark {')
    expect(css).not.toContain('html:root {')
  })
})
