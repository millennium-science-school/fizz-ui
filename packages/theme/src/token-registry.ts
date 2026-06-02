import type { FizzThemeVars } from './tokens'

export type FizzTokenCategory
  = | 'button'
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
  {
    name: '--fe-comps-page-gap',
    category: 'composite',
    light: '24px',
    description: 'Vertical rhythm between top-level composite page children.',
  },
  {
    name: '--fe-comps-section-gap',
    category: 'composite',
    light: '16px',
    description: 'Gap between section heading and body content.',
  },
  {
    name: '--fe-comps-section-padding',
    category: 'composite',
    light: '20px',
    description: 'Inner padding for composite section surfaces.',
  },
  {
    name: '--fe-comps-section-bg',
    category: 'composite',
    light: '#ffffff',
    dark: '#111827',
    description: 'Background color for composite section surfaces.',
  },
  {
    name: '--fe-comps-section-border-color',
    category: 'composite',
    light: '#e5e7eb',
    dark: '#374151',
    description: 'Border color for composite section surfaces.',
  },
  {
    name: '--fe-comps-section-radius',
    category: 'composite',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius for composite section surfaces.',
  },
  {
    name: '--fe-comps-section-shadow',
    category: 'composite',
    light: '0 1px 2px rgba(15, 23, 42, 0.04)',
    dark: '0 1px 2px rgba(0, 0, 0, 0.24)',
    description: 'Subtle elevation for composite section surfaces.',
  },
  {
    name: '--fe-comps-query-table-gap',
    category: 'composite',
    light: '16px',
    description: 'Gap between query form and table content.',
  },
  {
    name: '--fe-comps-toolbar-gap',
    category: 'composite',
    light: '8px',
    description: 'Gap between toolbar content and action buttons.',
  },
  {
    name: '--fe-comps-toolbar-margin-bottom',
    category: 'composite',
    light: '12px',
    description: 'Bottom margin below composite toolbars.',
  },
  {
    name: '--fe-comps-table-wrap-gap',
    category: 'composite',
    light: '12px',
    description: 'Internal spacing for table wrapper children.',
  },
  {
    name: '--fe-comps-split-pane-gap',
    category: 'composite',
    light: '16px',
    description: 'Gap used around split-pane child surfaces.',
  },
  {
    name: '--fe-comps-tree-panel-padding',
    category: 'composite',
    light: '12px',
    description: 'Inner padding for tree panel surfaces.',
  },
  {
    name: '--fe-comps-tree-panel-header-gap',
    category: 'composite',
    light: '8px',
    description: 'Gap between tree panel search and collapse controls.',
  },
  {
    name: '--fe-comps-tree-panel-border-color',
    category: 'composite',
    light: '#e5e7eb',
    dark: '#374151',
    description: 'Border color for tree panel surfaces.',
  },
  {
    name: '--fe-comps-tree-panel-bg',
    category: 'composite',
    light: '#ffffff',
    dark: '#111827',
    description: 'Background color for tree panel surfaces.',
  },
  {
    name: '--fe-comps-detail-gap',
    category: 'composite',
    light: '12px',
    description: 'Gap used inside detail display surfaces.',
  },
  {
    name: '--fe-comps-detail-sections-gap',
    category: 'composite',
    light: '16px',
    description: 'Gap between detail sections and local navigation.',
  },
  {
    name: '--fe-comps-detail-nav-width',
    category: 'composite',
    light: '180px',
    description: 'Width of local detail section navigation.',
  },
  {
    name: '--fe-comps-detail-nav-gap',
    category: 'composite',
    light: '4px',
    description: 'Gap between local detail navigation links.',
  },
  {
    name: '--fe-comps-detail-nav-link-padding',
    category: 'composite',
    light: '6px 8px',
    description: 'Padding for local detail navigation links.',
  },
] as const satisfies readonly FizzTokenDefinition[]

type RegisteredFizzTokenName = (typeof fizzTokenRegistry)[number]['name']
type AssertNever<T extends never> = T

export type FizzTokenRegistryIncludesAllThemeVars = AssertNever<
  Exclude<keyof FizzThemeVars, RegisteredFizzTokenName>
>
export type FizzTokenRegistryUsesOnlyThemeVars = AssertNever<
  Exclude<RegisteredFizzTokenName, keyof FizzThemeVars>
>

export const fizzTokenNames = fizzTokenRegistry.map(token => token.name)

export function createFizzThemeVars(mode: 'light' | 'dark'): FizzThemeVars {
  return Object.fromEntries(
    (fizzTokenRegistry as readonly FizzTokenDefinition[]).map(token => [
      token.name,
      mode === 'dark' ? token.dark ?? token.light : token.light,
    ]),
  ) as unknown as FizzThemeVars
}
