/**
 * tokens.ts - theme token source.
 *
 * Element Plus styles are emitted by @fizz/el-plus/styles under the fe namespace.
 * This package emits Fizz-owned variables by default, and accepts Element Plus
 * variable overrides only when the consuming app opts in.
 */

export interface ElementThemeVars {
  '--fe-color-primary'?: string
  '--fe-color-primary-light-3'?: string
  '--fe-color-primary-light-5'?: string
  '--fe-color-primary-light-7'?: string
  '--fe-color-primary-light-8'?: string
  '--fe-color-primary-light-9'?: string
  '--fe-color-primary-dark-2'?: string
  '--fe-color-success'?: string
  '--fe-color-warning'?: string
  '--fe-color-danger'?: string
  '--fe-color-info'?: string
  '--fe-border-radius-base'?: string
}

export interface FizzThemeVars {
  '--fe-fizz-button-font-weight': string
  '--fe-fizz-button-radius': string
  '--fe-fizz-button-shadow': string
  '--fe-fizz-control-radius': string
  '--fe-fizz-control-shadow': string
  '--fe-fizz-control-focus-shadow': string
  '--fe-fizz-surface-radius': string
  '--fe-fizz-surface-shadow': string
  '--fe-fizz-feedback-radius': string
  '--fe-comps-form-cols': string
  '--fe-comps-form-gap': string
  '--fe-comps-table-radius': string
  '--fe-comps-table-header-bg': string
  '--fe-comps-pagination-margin-top': string
}

export interface ThemeTokens {
  elementVars: ElementThemeVars
  fizzVars: FizzThemeVars
}

export const lightTokens: ThemeTokens = {
  elementVars: {},
  fizzVars: {
    '--fe-fizz-button-font-weight': '600',
    '--fe-fizz-button-radius': 'var(--fe-border-radius-base)',
    '--fe-fizz-button-shadow': '0 1px 2px rgba(15, 118, 110, 0.18)',
    '--fe-fizz-control-radius': 'var(--fe-border-radius-base)',
    '--fe-fizz-control-shadow': '0 1px 2px rgba(15, 23, 42, 0.06)',
    '--fe-fizz-control-focus-shadow': '0 0 0 3px rgba(15, 118, 110, 0.14)',
    '--fe-fizz-surface-radius': 'var(--fe-border-radius-base)',
    '--fe-fizz-surface-shadow': '0 8px 24px rgba(15, 23, 42, 0.08)',
    '--fe-fizz-feedback-radius': 'var(--fe-border-radius-base)',
    '--fe-comps-form-cols': '2',
    '--fe-comps-form-gap': '16px',
    '--fe-comps-table-radius': 'var(--fe-border-radius-base)',
    '--fe-comps-table-header-bg': '#f9fafb',
    '--fe-comps-pagination-margin-top': '16px',
  },
}

export const darkTokens: ThemeTokens = {
  elementVars: {},
  fizzVars: {
    ...lightTokens.fizzVars,
    '--fe-fizz-control-shadow': '0 1px 2px rgba(0, 0, 0, 0.2)',
    '--fe-fizz-control-focus-shadow': '0 0 0 3px rgba(45, 212, 191, 0.18)',
    '--fe-fizz-surface-shadow': '0 12px 28px rgba(0, 0, 0, 0.32)',
    '--fe-comps-table-header-bg': '#1f2937',
  },
}

export type ThemeCssVars = ElementThemeVars & FizzThemeVars

export interface ThemeVarsCssOptions {
  lightSelector?: string
  darkSelector?: string
  elementVars?: ElementThemeVars
  darkElementVars?: ElementThemeVars
  fizzVars?: Partial<FizzThemeVars>
  darkFizzVars?: Partial<FizzThemeVars>
}

export function createThemeCssVars(tokens: ThemeTokens): ThemeCssVars {
  return {
    ...tokens.elementVars,
    ...tokens.fizzVars,
  }
}

function renderCssBlock(selector: string, vars: object): string {
  const declarations = Object.entries(vars)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  return `${selector} {\n${declarations}\n}`
}

function renderServiceCss(): string {
  return `.fe-message {
  border-radius: var(--fe-fizz-feedback-radius);
  box-shadow: var(--fe-fizz-surface-shadow);
}

.fe-loading {
  color: var(--fe-color-primary);
}

.fe-notification {
  border-radius: var(--fe-fizz-feedback-radius);
  box-shadow: var(--fe-fizz-surface-shadow);
}

.fe-message-box {
  border-radius: var(--fe-fizz-feedback-radius);
  box-shadow: var(--fe-fizz-surface-shadow);
}`
}

function renderCoreComponentCss(): string {
  return `.fe-btn {
  font-weight: var(--fe-fizz-button-font-weight);
  border-radius: var(--fe-fizz-button-radius);
  box-shadow: var(--fe-fizz-button-shadow);
}

.fe-input .fe-input__wrapper,
.fe-select .fe-select__wrapper {
  border-radius: var(--fe-fizz-control-radius);
  box-shadow: var(--fe-fizz-control-shadow);
}

.fe-input .fe-input__wrapper.is-focus,
.fe-select .fe-select__wrapper.is-focused {
  box-shadow: var(--fe-fizz-control-focus-shadow);
}

.fe-table {
  overflow: hidden;
  border-radius: var(--fe-comps-table-radius);
  --fe-table-header-bg-color: var(--fe-comps-table-header-bg);
}

.fe-card,
.fe-dialog {
  border-radius: var(--fe-fizz-surface-radius);
}

.fe-dialog {
  box-shadow: var(--fe-fizz-surface-shadow);
}`
}

export function createThemeVarsCss(options: ThemeVarsCssOptions = {}): string {
  const lightSelector = options.lightSelector ?? 'html:root'
  const darkSelector = options.darkSelector ?? 'html.dark'

  const lightVars = createThemeCssVars({
    elementVars: {
      ...lightTokens.elementVars,
      ...options.elementVars,
    },
    fizzVars: {
      ...lightTokens.fizzVars,
      ...options.fizzVars,
    },
  })

  const darkVars = createThemeCssVars({
    elementVars: {
      ...darkTokens.elementVars,
      ...options.darkElementVars,
    },
    fizzVars: {
      ...darkTokens.fizzVars,
      ...options.darkFizzVars,
    },
  })

  return `/**
 * vars.css - generated from src/tokens.ts
 *
 * Do not edit token values here. Update tokens.ts, then regenerate or run tests.
 */

${renderCssBlock(lightSelector, lightVars)}

${renderCssBlock(darkSelector, darkVars)}

${renderCoreComponentCss()}

${renderServiceCss()}
`
}
