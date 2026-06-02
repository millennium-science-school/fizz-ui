import { describe, expect, it } from 'vitest'
import { fizzPreset } from '../src/preset/unocss'

describe('fizzPreset', () => {
  it('uses a higher-specificity root selector than Element Plus defaults', () => {
    const preset = fizzPreset()
    const css = preset.preflights?.map(preflight => preflight.getCSS()).join('\n') ?? ''

    expect(css).toContain('html:root')
    expect(css).toContain('html.dark')
  })

  it('safelists wrapper and structural classes generated outside templates', () => {
    const preset = fizzPreset()

    expect(preset.safelist).toContain('fe-btn')
    expect(preset.safelist).toContain('fe-comps-form')
    expect(preset.safelist).toContain('fe-comps-table')
    expect(preset.safelist).toContain('fe-comps-pagination')
    expect(preset.safelist).toContain('fe-comps-page')
    expect(preset.safelist).toContain('fe-comps-section')
    expect(preset.safelist).toContain('fe-comps-query-table')
    expect(preset.safelist).toContain('fe-comps-toolbar')
    expect(preset.safelist).toContain('fe-comps-table-wrap')
    expect(preset.safelist).toContain('fe-comps-split-pane')
    expect(preset.safelist).toContain('fe-comps-tree-panel')
    expect(preset.safelist).toContain('fe-comps-detail')
    expect(preset.safelist).toContain('fe-comps-detail-sections')
  })

  it('uses Element Plus variable names for Element Plus shortcuts', () => {
    const preset = fizzPreset()
    const shortcuts = JSON.stringify(preset.shortcuts)

    expect(shortcuts).toContain('--fe-bg-color-page')
    expect(shortcuts).not.toContain('--fe-color-bg-page')
    expect(shortcuts).not.toContain('--fe-color-primary-hover')
  })
})
