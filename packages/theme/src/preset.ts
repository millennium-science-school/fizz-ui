import type { Preset } from 'unocss'
import { createThemeVarsCss } from './tokens'

/**
 * fizzPreset — @fizz/theme 的 UnoCSS preset
 *
 * 在消费侧 uno.config.ts 中引入：
 * ```ts
 * import { defineConfig, presetWind3 } from 'unocss'
 * import { fizzPreset } from '@fizz/theme/preset/unocss'
 *
 * export default defineConfig({
 *   presets: [presetWind3(), fizzPreset()],
 * })
 * ```
 *
 * 提供：
 *   - CSS 变量的预飞行声明（html:root 和 html.dark）
 *   - Fizz-owned CSS variables for wrapper and composite layers
 *   - fe-btn / fe-comps-* 等统一类名的基础样式规则
 *   - 主题色 shortcut（bg-primary、text-primary 等）
 */
export function fizzPreset(): Preset {
  return {
    name: '@fizz/theme/preset',
    safelist: [
      'fe-btn',
      'fe-comps-form',
      'fe-comps-table',
      'fe-comps-pagination',
    ],

    // ── 预飞行：从 tokens.ts 生成 CSS 变量 ───────────────────────────────
    preflights: [
      {
        getCSS: () => createThemeVarsCss(),
      },
    ],

    // ── shortcuts：常用类名组合 ───────────────────────────────────────────
    shortcuts: [
      // 主色系
      ['btn-primary', 'bg-[var(--fe-color-primary)] text-white rounded-[var(--fe-fizz-button-radius)] px-4 py-2 hover:bg-[var(--fe-color-primary-light-3)] transition-colors'],
      ['text-primary', 'text-[var(--fe-color-primary)]'],
      ['bg-page', 'bg-[var(--fe-bg-color-page)]'],
    ],

    // ── rules：fe-* 类名的样式规则 ────────────────────────────────────────
    rules: [
      [
        'fe-btn',
        {
          'font-weight': 'var(--fe-fizz-button-font-weight)',
          'border-radius': 'var(--fe-fizz-button-radius)',
          'box-shadow': 'var(--fe-fizz-button-shadow)',
        },
      ],
      [
        'fe-input',
        {
          '--fe-input-border-radius': 'var(--fe-fizz-control-radius)',
        },
      ],
      // 示例：fe-comps-form 结构类（只定义布局变量，颜色由 preflights 覆盖）
      [
        'fe-comps-form',
        {
          'display': 'grid',
          'grid-template-columns': 'repeat(var(--fe-comps-form-cols, 2), 1fr)',
          'gap': 'var(--fe-comps-form-gap, 16px)',
        },
      ],
      [
        'fe-comps-table',
        {
          'border-radius': 'var(--fe-comps-table-radius)',
          'overflow': 'hidden',
        },
      ],
      [
        'fe-comps-pagination',
        {
          'margin-top': 'var(--fe-comps-pagination-margin-top)',
          'justify-content': 'flex-end',
        },
      ],
    ],
  }
}
