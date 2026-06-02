# Composite Surface Theme Polish Design

## Goal

Polish the visual foundation for existing `@fizz/el-comps` CRUD and
resource-management surfaces by expanding Fizz-owned composite tokens and
theme rules.

This phase uses the now-stable representative surfaces:

- CRUD list pages: `FecPage`, `FecSection`, `FecQueryTable`, `FecQueryForm`,
  `FecToolbar`, `FecTable`, `FecDialogForm`, `FecDetail`.
- Resource-management pages: `FecSplitPane`, `FecTreePanel`,
  `FecDetailSections`, `FecDetail`.
- Playground acceptance pages: `playground/src/views/CrudPage.vue`,
  `playground/src/views/ResourceLayoutPage.vue`, and
  `playground/src/views/CompsLabPage.vue`.

The work should make composite pages feel coherent without changing public
component APIs or starting the later low-frequency admin component wave.

## Context

Earlier theme work intentionally stopped at infrastructure: token registry,
generated CSS, UnoCSS preflight, and validation rules. The component expansion
work has now produced enough real surfaces to judge spacing, borders, density,
and section rhythm against full workflows instead of isolated controls.

The existing theme baseline already owns:

- Fizz wrapper tokens: `--fe-fizz-*`;
- a small composite token set: form gap, table radius/header background,
  pagination margin;
- generated CSS from `packages/theme/src/tokens.ts`;
- rule validation that only registered Fizz variables and explicitly allowed
  Element Plus variables are referenced.

This phase should extend that system, not bypass it.

## Scope

Included:

- Add Fizz-owned `--fe-comps-*` tokens for page, section, toolbar, query-table,
  table wrapper, split-pane, tree-panel, detail, and detail-section surfaces.
- Add generated theme rules for the existing `fe-comps-*` structural classes.
- Keep light and dark values in `fizzTokenRegistry`.
- Keep generated CSS and UnoCSS rules derived from `theme-rules.ts`.
- Update theme tests to assert the new composite tokens and selectors.
- Sync checked-in `packages/theme/src/styles/vars.css` with generated CSS.
- Use playground CRUD and resource-layout pages as visual acceptance surfaces.

Excluded:

- No prop, emit, slot, or package export changes.
- No new `@fizz/el-comps` components.
- No tree table, upload/import, wizard/steps, pivot/statistics, or search
  engine workflows.
- No changes to `@fizz/el-plus` transparent wrapper behavior.
- No dependency on `@fizz/el-comps` from `@fizz/theme` runtime source.
- No screenshot approval workflow in this phase. Visual acceptance remains
  manual through playground plus automated class/CSS coverage.

## Design

### Token Groups

Add composite tokens in four groups.

Page and section rhythm:

- `--fe-comps-page-gap`
- `--fe-comps-section-gap`
- `--fe-comps-section-padding`
- `--fe-comps-section-bg`
- `--fe-comps-section-border-color`
- `--fe-comps-section-radius`
- `--fe-comps-section-shadow`

CRUD table flow:

- `--fe-comps-query-table-gap`
- `--fe-comps-toolbar-gap`
- `--fe-comps-toolbar-margin-bottom`
- `--fe-comps-table-wrap-gap`

Resource layout:

- `--fe-comps-split-pane-gap`
- `--fe-comps-tree-panel-padding`
- `--fe-comps-tree-panel-header-gap`
- `--fe-comps-tree-panel-border-color`
- `--fe-comps-tree-panel-bg`

Detail surfaces:

- `--fe-comps-detail-gap`
- `--fe-comps-detail-sections-gap`
- `--fe-comps-detail-nav-width`
- `--fe-comps-detail-nav-gap`
- `--fe-comps-detail-nav-link-padding`

These tokens are intentionally structural. They avoid brand color decisions
except for neutral border/background values already needed by the surfaces.

### Theme Rules

Theme rules should target stable existing classes:

- `.fe-comps-page`
- `.fe-comps-page-header`
- `.fe-comps-page-body`
- `.fe-comps-section`
- `.fe-comps-section-header`
- `.fe-comps-section-body`
- `.fe-comps-query-table`
- `.fe-comps-toolbar`
- `.fe-comps-toolbar-left`
- `.fe-comps-toolbar-right`
- `.fe-comps-table-wrap`
- `.fe-comps-split-pane`
- `.fe-comps-tree-panel`
- `.fe-comps-tree-panel__header`
- `.fe-comps-tree-panel__empty`
- `.fe-comps-detail`
- `.fe-comps-detail-sections`
- `.fe-comps-detail-sections__main`
- `.fe-comps-detail-sections__nav`
- `.fe-comps-detail-sections__nav-link`

Rules should stay in `packages/theme/src/theme-rules.ts`. The theme package
must remain runtime-independent from component packages; it styles known class
names as strings.

### Dark Mode

Every new background, border, and shadow token should have an explicit dark
value. Pure spacing tokens can share light values.

Dark mode should avoid one-off selectors. It should be generated through
`darkTokens.fizzVars` the same way current dark control and table values are
generated.

### UnoCSS

Any simple class rules added to `themeUtilityRules` should automatically appear
in `createUnoThemeRules()`. The Uno preset safelist should include all
`fe-comps-*` classes that may be emitted by render helpers or external
consumers and would otherwise risk being purged.

### Playground Acceptance

The existing playground pages should remain the visual acceptance surface:

- `CrudPage.vue` checks query form, toolbar, table, dialog, and detail.
- `ResourceLayoutPage.vue` checks split pane, tree panel, query controls, and
  multi-section detail.
- `CompsLabPage.vue` checks component edge states.

This phase may add small wrapper classes in playground only when they improve
manual inspection, but it should not add app-specific styling that masks
missing theme rules.

## Testing Strategy

Focused theme checks:

```bash
pnpm exec vitest run packages/theme/__tests__
pnpm --filter @fizz/theme typecheck
pnpm --filter @fizz/theme build
pnpm --filter @fizz/theme check:exports
```

Composite and playground checks:

```bash
pnpm exec vitest run packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-comps typecheck
pnpm -C playground build
```

Full release path before completion:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ packages/el-comps/__tests__ playground/__tests__/integration.spec.ts packages/theme/__tests__
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

## Risks

The main risk is over-polishing before real consumer feedback. Keep this phase
to structural rhythm, borders, surfaces, and density.

The second risk is bypassing token validation with hard-coded values in theme
rules. Tests should catch any unregistered `--fe-comps-*` references.

The third risk is making playground-specific CSS carry the polish. The theme
rules must own the reusable composite styling.

## Success Criteria

- New `--fe-comps-*` tokens are registered, typed, and emitted in generated
  light and dark CSS.
- Theme rules style the existing CRUD and resource `fe-comps-*` classes.
- Checked-in `packages/theme/src/styles/vars.css` matches
  `createThemeVarsCss()`.
- UnoCSS rules and safelist cover the composite classes.
- Playground CRUD and resource layout pages build without local CSS carrying
  the core polish.
- Public component APIs and package exports remain unchanged.
