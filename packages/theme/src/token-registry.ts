import type { FizzThemeVars } from './tokens'

export type FizzTokenCategory =
  | 'button'
  | 'control'
  | 'surface'
  | 'feedback'
  | 'composite'

export interface FizzTokenDefinition<Name extends keyof FizzThemeVars = keyof FizzThemeVars> {
  name: Name
  category: FizzTokenCategory
  light: FizzThemeVars[Name]
  dark?: FizzThemeVars[Name]
  description: string
}

export const fizzTokenRegistry = [
  {
    name: '--fe-fizz-button-font-weight',
    category: 'button',
    light: '600',
    description: 'Font weight used by Fizz button wrappers.',
  },
  {
    name: '--fe-fizz-button-radius',
    category: 'button',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by Fizz button wrappers.',
  },
  {
    name: '--fe-fizz-button-shadow',
    category: 'button',
    light: '0 1px 2px rgba(15, 118, 110, 0.18)',
    description: 'Subtle visual elevation used by Fizz button wrappers.',
  },
  {
    name: '--fe-fizz-control-radius',
    category: 'control',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by Fizz input-like control wrappers.',
  },
  {
    name: '--fe-fizz-control-shadow',
    category: 'control',
    light: '0 1px 2px rgba(15, 23, 42, 0.06)',
    dark: '0 1px 2px rgba(0, 0, 0, 0.2)',
    description: 'Default shadow used by Fizz input-like control wrappers.',
  },
  {
    name: '--fe-fizz-control-focus-shadow',
    category: 'control',
    light: '0 0 0 3px rgba(15, 118, 110, 0.14)',
    dark: '0 0 0 3px rgba(45, 212, 191, 0.18)',
    description: 'Focus shadow used by Fizz input-like control wrappers.',
  },
  {
    name: '--fe-fizz-surface-radius',
    category: 'surface',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by Fizz surface selectors.',
  },
  {
    name: '--fe-fizz-surface-shadow',
    category: 'surface',
    light: '0 8px 24px rgba(15, 23, 42, 0.08)',
    dark: '0 12px 28px rgba(0, 0, 0, 0.32)',
    description: 'Elevation shadow used by Fizz surface selectors.',
  },
  {
    name: '--fe-fizz-feedback-radius',
    category: 'feedback',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by Fizz feedback and service selectors.',
  },
  {
    name: '--fe-comps-form-cols',
    category: 'composite',
    light: '2',
    description: 'Default grid column count for composite form layouts.',
  },
  {
    name: '--fe-comps-form-gap',
    category: 'composite',
    light: '16px',
    description: 'Default grid gap for composite form layouts.',
  },
  {
    name: '--fe-comps-table-radius',
    category: 'composite',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by composite table surfaces.',
  },
  {
    name: '--fe-comps-table-header-bg',
    category: 'composite',
    light: '#f9fafb',
    dark: '#1f2937',
    description: 'Header background color used by composite table surfaces.',
  },
  {
    name: '--fe-comps-pagination-margin-top',
    category: 'composite',
    light: '16px',
    description: 'Top margin used by composite pagination blocks.',
  },
] as const satisfies readonly FizzTokenDefinition[]

export const fizzTokenNames = fizzTokenRegistry.map(token => token.name)

export function createFizzThemeVars(mode: 'light' | 'dark'): FizzThemeVars {
  return Object.fromEntries(
    fizzTokenRegistry.map(token => [
      token.name,
      mode === 'dark' ? token.dark ?? token.light : token.light,
    ]),
  ) as FizzThemeVars
}
