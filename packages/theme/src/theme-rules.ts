export interface ThemeUtilityRule {
  className: string
  declarations: Record<string, string>
}

export interface ThemeCssRule {
  selector: string
  declarations: Record<string, string>
}

export const themeUtilityRules: ThemeUtilityRule[] = [
  {
    className: 'fe-btn',
    declarations: {
      'font-weight': 'var(--fe-fizz-button-font-weight)',
      'border-radius': 'var(--fe-fizz-button-radius)',
      'box-shadow': 'var(--fe-fizz-button-shadow)',
    },
  },
  {
    className: 'fe-comps-form',
    declarations: {
      'display': 'grid',
      'grid-template-columns': 'repeat(var(--fe-comps-form-cols, 2), 1fr)',
      'gap': 'var(--fe-comps-form-gap, 16px)',
    },
  },
  {
    className: 'fe-comps-table',
    declarations: {
      'border-radius': 'var(--fe-comps-table-radius)',
      'overflow': 'hidden',
    },
  },
  {
    className: 'fe-comps-pagination',
    declarations: {
      'margin-top': 'var(--fe-comps-pagination-margin-top)',
      'justify-content': 'flex-end',
    },
  },
]

export const descendantThemeCssRules: ThemeCssRule[] = [
  {
    selector: '.fe-input .fe-input__wrapper,\n.fe-select .fe-select__wrapper',
    declarations: {
      'border-radius': 'var(--fe-fizz-control-radius)',
      'box-shadow': 'var(--fe-fizz-control-shadow)',
    },
  },
  {
    selector: '.fe-input .fe-input__wrapper.is-focus,\n.fe-select .fe-select__wrapper.is-focused',
    declarations: {
      'box-shadow': 'var(--fe-fizz-control-focus-shadow)',
    },
  },
  {
    selector: '.fe-table',
    declarations: {
      'overflow': 'hidden',
      'border-radius': 'var(--fe-comps-table-radius)',
      '--fe-table-header-bg-color': 'var(--fe-comps-table-header-bg)',
    },
  },
  {
    selector: '.fe-card,\n.fe-dialog',
    declarations: {
      'border-radius': 'var(--fe-fizz-surface-radius)',
    },
  },
  {
    selector: '.fe-dialog',
    declarations: {
      'box-shadow': 'var(--fe-fizz-surface-shadow)',
    },
  },
]

export const serviceThemeCssRules: ThemeCssRule[] = [
  {
    selector: '.fe-message',
    declarations: {
      'border-radius': 'var(--fe-fizz-feedback-radius)',
      'box-shadow': 'var(--fe-fizz-surface-shadow)',
    },
  },
  {
    selector: '.fe-loading',
    declarations: {
      color: 'var(--fe-color-primary)',
    },
  },
  {
    selector: '.fe-notification',
    declarations: {
      'border-radius': 'var(--fe-fizz-feedback-radius)',
      'box-shadow': 'var(--fe-fizz-surface-shadow)',
    },
  },
  {
    selector: '.fe-message-box',
    declarations: {
      'border-radius': 'var(--fe-fizz-feedback-radius)',
      'box-shadow': 'var(--fe-fizz-surface-shadow)',
    },
  },
]

export function renderThemeCssRules(rules: ThemeCssRule[]): string {
  return rules
    .map((rule) => {
      const declarations = Object.entries(rule.declarations)
        .map(([name, value]) => `  ${name}: ${value};`)
        .join('\n')

      return `${rule.selector} {\n${declarations}\n}`
    })
    .join('\n\n')
}

export function renderUtilityThemeCssRules(rules = themeUtilityRules): string {
  return renderThemeCssRules(
    rules.map(rule => ({
      selector: `.${rule.className}`,
      declarations: rule.declarations,
    })),
  )
}

export function createUnoThemeRules(rules = themeUtilityRules) {
  return rules.map(rule => [rule.className, rule.declarations] as [string, Record<string, string>])
}
