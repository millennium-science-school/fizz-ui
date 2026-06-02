/**
 * tokens.ts - theme token source.
 *
 * Element Plus styles are emitted by @fizz/el-plus/styles under the fe namespace.
 * This package emits Fizz-owned variables by default, and accepts Element Plus
 * variable overrides only when the consuming app opts in.
 */

import {
  descendantThemeCssRules,
  renderThemeCssRules,
  renderUtilityThemeCssRules,
  serviceThemeCssRules,
} from './theme-rules'
import { createFizzThemeVars } from './token-registry'

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
  '--fe-comps-page-gap': string
  '--fe-comps-section-gap': string
  '--fe-comps-section-padding': string
  '--fe-comps-section-bg': string
  '--fe-comps-section-border-color': string
  '--fe-comps-section-radius': string
  '--fe-comps-section-shadow': string
  '--fe-comps-query-table-gap': string
  '--fe-comps-toolbar-gap': string
  '--fe-comps-toolbar-margin-bottom': string
  '--fe-comps-table-wrap-gap': string
  '--fe-comps-split-pane-gap': string
  '--fe-comps-tree-panel-padding': string
  '--fe-comps-tree-panel-header-gap': string
  '--fe-comps-tree-panel-border-color': string
  '--fe-comps-tree-panel-bg': string
  '--fe-comps-detail-gap': string
  '--fe-comps-detail-sections-gap': string
  '--fe-comps-detail-nav-width': string
  '--fe-comps-detail-nav-gap': string
  '--fe-comps-detail-nav-link-padding': string
}

export interface ThemeTokens {
  elementVars: ElementThemeVars
  fizzVars: FizzThemeVars
}

export const lightTokens: ThemeTokens = {
  elementVars: {},
  fizzVars: createFizzThemeVars('light'),
}

export const darkTokens: ThemeTokens = {
  elementVars: {},
  fizzVars: createFizzThemeVars('dark'),
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
  return renderThemeCssRules(serviceThemeCssRules)
}

function renderCoreComponentCss(): string {
  return [
    renderUtilityThemeCssRules(),
    renderThemeCssRules(descendantThemeCssRules),
  ].join('\n\n')
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
