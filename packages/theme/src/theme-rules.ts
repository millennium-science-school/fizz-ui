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
  {
    className: 'fe-comps-page',
    declarations: {
      display: 'grid',
      gap: 'var(--fe-comps-page-gap)',
    },
  },
  {
    className: 'fe-comps-section',
    declarations: {
      'display': 'grid',
      'gap': 'var(--fe-comps-section-gap)',
      'padding': 'var(--fe-comps-section-padding)',
      'background': 'var(--fe-comps-section-bg)',
      'border': '1px solid var(--fe-comps-section-border-color)',
      'border-radius': 'var(--fe-comps-section-radius)',
      'box-shadow': 'var(--fe-comps-section-shadow)',
    },
  },
  {
    className: 'fe-comps-query-table',
    declarations: {
      display: 'grid',
      gap: 'var(--fe-comps-query-table-gap)',
    },
  },
  {
    className: 'fe-comps-toolbar',
    declarations: {
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
      'gap': 'var(--fe-comps-toolbar-gap)',
      'margin-bottom': 'var(--fe-comps-toolbar-margin-bottom)',
    },
  },
  {
    className: 'fe-comps-table-wrap',
    declarations: {
      display: 'grid',
      gap: 'var(--fe-comps-table-wrap-gap)',
    },
  },
  {
    className: 'fe-comps-split-pane',
    declarations: {
      gap: 'var(--fe-comps-split-pane-gap)',
    },
  },
  {
    className: 'fe-comps-tree-panel',
    declarations: {
      'height': '100%',
      'padding': 'var(--fe-comps-tree-panel-padding)',
      'background': 'var(--fe-comps-tree-panel-bg)',
      'border-right': '1px solid var(--fe-comps-tree-panel-border-color)',
    },
  },
  {
    className: 'fe-comps-detail',
    declarations: {
      display: 'grid',
      gap: 'var(--fe-comps-detail-gap)',
      margin: '0',
    },
  },
  {
    className: 'fe-comps-detail-sections',
    declarations: {
      display: 'flex',
      gap: 'var(--fe-comps-detail-sections-gap)',
    },
  },
]

export const descendantThemeCssRules: ThemeCssRule[] = [
  {
    selector: '.fe-comps-page-header,\n.fe-comps-section-header',
    declarations: {
      'display': 'flex',
      'align-items': 'flex-start',
      'justify-content': 'space-between',
      'gap': 'var(--fe-comps-toolbar-gap)',
    },
  },
  {
    selector: '.fe-comps-page-body,\n.fe-comps-section-body',
    declarations: {
      'min-width': '0',
    },
  },
  {
    selector: '.fe-comps-toolbar-left,\n.fe-comps-toolbar-right',
    declarations: {
      'display': 'flex',
      'align-items': 'center',
      'gap': 'var(--fe-comps-toolbar-gap)',
      'min-width': '0',
    },
  },
  {
    selector: '.fe-comps-toolbar-right',
    declarations: {
      'justify-content': 'flex-end',
      'flex-wrap': 'wrap',
    },
  },
  {
    selector: '.fe-comps-tree-panel__header',
    declarations: {
      'display': 'flex',
      'align-items': 'center',
      'gap': 'var(--fe-comps-tree-panel-header-gap)',
      'margin-bottom': 'var(--fe-comps-tree-panel-header-gap)',
    },
  },
  {
    selector: '.fe-comps-tree-panel__empty',
    declarations: {
      padding: 'var(--fe-comps-tree-panel-padding)',
    },
  },
  {
    selector: '.fe-comps-detail-sections__main',
    declarations: {
      'display': 'grid',
      'gap': 'var(--fe-comps-detail-sections-gap)',
      'min-width': '0',
      'flex': '1 1 auto',
    },
  },
  {
    selector: '.fe-comps-detail-sections__nav',
    declarations: {
      'display': 'grid',
      'align-content': 'start',
      'gap': 'var(--fe-comps-detail-nav-gap)',
      'width': 'var(--fe-comps-detail-nav-width)',
      'flex': '0 0 var(--fe-comps-detail-nav-width)',
    },
  },
  {
    selector: '.fe-comps-detail-sections__nav-link',
    declarations: {
      'display': 'block',
      'padding': 'var(--fe-comps-detail-nav-link-padding)',
      'border-radius': 'var(--fe-fizz-control-radius)',
      'color': 'var(--fe-color-primary)',
      'text-decoration': 'none',
    },
  },
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
