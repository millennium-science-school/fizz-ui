# Composite Surface Theme Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Fizz-owned composite theme tokens and generated theme rules so existing CRUD and resource-management surfaces have coherent spacing, borders, and surface treatment without changing component APIs.

**Architecture:** Keep `@fizz/theme` runtime-independent from component packages. Add tokens to `token-registry.ts` and `tokens.ts`, style existing `fe-comps-*` classes through `theme-rules.ts`, sync generated `src/styles/vars.css`, and use existing playground CRUD/resource pages as acceptance surfaces.

**Tech Stack:** TypeScript, generated CSS from `createThemeVarsCss()`, UnoCSS preset rules, Vitest, vue-tsc, Vite, pnpm workspace scripts.

---

## Scope Check

This plan implements theme polish only. It does not add components, change
component props/emits/slots, alter `@fizz/el-plus` transparent wrappers, or
introduce low-frequency admin workflows such as tree tables, uploads, imports,
or wizards.

## File Structure

- Modify: `packages/theme/src/token-registry.ts`
  - Add composite token metadata, light values, dark overrides, and
    descriptions.
- Modify: `packages/theme/src/tokens.ts`
  - Add the new token names to `FizzThemeVars`.
- Modify: `packages/theme/src/theme-rules.ts`
  - Add generated CSS rules for existing `fe-comps-*` structural classes.
- Modify: `packages/theme/src/preset.ts`
  - Extend the safelist for composite classes emitted by components and render
    helpers.
- Modify: `packages/theme/src/styles/vars.css`
  - Sync checked-in generated CSS with `createThemeVarsCss()`.
- Modify: `packages/theme/__tests__/tokens.spec.ts`
  - Add token and selector assertions.
- Modify: `packages/theme/__tests__/preset.spec.ts`
  - Add safelist assertions for the composite classes.
- Modify: `docs/style-validation.md`
  - Document the composite-surface token boundary.
- Modify: `docs/consumer-setup.md`
  - Add a short note about importing `@fizz/theme/styles` for composite
    surface polish.
- Test: `packages/el-comps/__tests__`
  - Existing regression coverage for the styled class names.
- Test: `playground/__tests__/integration.spec.ts`
  - Existing CRUD/resource page acceptance coverage.

---

### Task 1: Add Failing Theme Coverage

**Files:**
- Modify: `packages/theme/__tests__/tokens.spec.ts`
- Modify: `packages/theme/__tests__/preset.spec.ts`

- [ ] **Step 1: Add token and selector assertions**

In `packages/theme/__tests__/tokens.spec.ts`, update the
`generates only Fizz-owned vars by default` test by adding:

```ts
expect(css).toContain('--fe-comps-page-gap:')
expect(css).toContain('--fe-comps-section-padding:')
expect(css).toContain('--fe-comps-query-table-gap:')
expect(css).toContain('--fe-comps-toolbar-gap:')
expect(css).toContain('--fe-comps-split-pane-gap:')
expect(css).toContain('--fe-comps-tree-panel-padding:')
expect(css).toContain('--fe-comps-detail-sections-gap:')
```

Update the `emits core component selectors for the playground acceptance surface`
test by adding:

```ts
expect(css).toContain('.fe-comps-page')
expect(css).toContain('.fe-comps-section')
expect(css).toContain('.fe-comps-query-table')
expect(css).toContain('.fe-comps-toolbar')
expect(css).toContain('.fe-comps-table-wrap')
expect(css).toContain('.fe-comps-split-pane')
expect(css).toContain('.fe-comps-tree-panel')
expect(css).toContain('.fe-comps-detail-sections')
expect(css).toContain('.fe-comps-detail')
```

Update the `references only registered Fizz vars or allowed Element Plus vars in theme rules`
test by adding these expected references:

```ts
expect(ruleVars).toContain('--fe-comps-page-gap')
expect(ruleVars).toContain('--fe-comps-section-padding')
expect(ruleVars).toContain('--fe-comps-query-table-gap')
expect(ruleVars).toContain('--fe-comps-tree-panel-padding')
expect(ruleVars).toContain('--fe-comps-detail-sections-gap')
```

- [ ] **Step 2: Add preset safelist assertions**

In `packages/theme/__tests__/preset.spec.ts`, update the
`safelists wrapper and structural classes generated outside templates` test by
adding:

```ts
expect(preset.safelist).toContain('fe-comps-page')
expect(preset.safelist).toContain('fe-comps-section')
expect(preset.safelist).toContain('fe-comps-query-table')
expect(preset.safelist).toContain('fe-comps-toolbar')
expect(preset.safelist).toContain('fe-comps-table-wrap')
expect(preset.safelist).toContain('fe-comps-split-pane')
expect(preset.safelist).toContain('fe-comps-tree-panel')
expect(preset.safelist).toContain('fe-comps-detail')
expect(preset.safelist).toContain('fe-comps-detail-sections')
```

- [ ] **Step 3: Run tests and verify they fail**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__/tokens.spec.ts packages/theme/__tests__/preset.spec.ts
```

Expected: FAIL because the new tokens, selectors, and safelist entries do not
exist yet.

- [ ] **Step 4: Commit failing coverage**

Run:

```bash
git add packages/theme/__tests__/tokens.spec.ts packages/theme/__tests__/preset.spec.ts
git commit -m "test: cover composite surface theme tokens"
```

---

### Task 2: Expand Composite Token Registry

**Files:**
- Modify: `packages/theme/src/tokens.ts`
- Modify: `packages/theme/src/token-registry.ts`

- [ ] **Step 1: Add token names to `FizzThemeVars`**

In `packages/theme/src/tokens.ts`, extend `FizzThemeVars` after the existing
pagination token:

```ts
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
```

- [ ] **Step 2: Add registry definitions**

In `packages/theme/src/token-registry.ts`, add these entries after
`--fe-comps-pagination-margin-top`:

```ts
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
```

- [ ] **Step 3: Run typecheck**

Run:

```bash
pnpm --filter @fizz/theme typecheck
```

Expected: PASS. The compile-time registry assertions should confirm that every
`FizzThemeVars` key is registered and every registry key is typed.

- [ ] **Step 4: Commit token expansion**

Run:

```bash
git add packages/theme/src/tokens.ts packages/theme/src/token-registry.ts
git commit -m "feat: add composite surface theme tokens"
```

---

### Task 3: Add Composite Theme Rules

**Files:**
- Modify: `packages/theme/src/theme-rules.ts`
- Modify: `packages/theme/src/preset.ts`

- [ ] **Step 1: Extend `themeUtilityRules`**

In `packages/theme/src/theme-rules.ts`, add these utility rules after
`fe-comps-pagination`:

```ts
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
```

- [ ] **Step 2: Add descendant rules for inner structural classes**

In `descendantThemeCssRules`, add these entries before service rules are
rendered:

```ts
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
      'padding': 'var(--fe-comps-tree-panel-padding)',
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
```

- [ ] **Step 3: Extend Uno preset safelist**

In `packages/theme/src/preset.ts`, extend `safelist` to:

```ts
    safelist: [
      'fe-btn',
      'fe-comps-form',
      'fe-comps-page',
      'fe-comps-section',
      'fe-comps-query-table',
      'fe-comps-toolbar',
      'fe-comps-table-wrap',
      'fe-comps-table',
      'fe-comps-pagination',
      'fe-comps-split-pane',
      'fe-comps-tree-panel',
      'fe-comps-detail',
      'fe-comps-detail-sections',
    ],
```

- [ ] **Step 4: Run focused theme tests**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__/tokens.spec.ts packages/theme/__tests__/preset.spec.ts
```

Expected: FAIL only on checked-in `vars.css` synchronization if the source CSS
has not been regenerated yet. If failures mention unregistered CSS variables,
fix the token registry or rule references before continuing.

- [ ] **Step 5: Commit theme rules**

Run:

```bash
git add packages/theme/src/theme-rules.ts packages/theme/src/preset.ts
git commit -m "feat: style composite surface classes"
```

---

### Task 4: Sync Checked-In CSS

**Files:**
- Modify: `packages/theme/src/styles/vars.css`

- [ ] **Step 1: Generate CSS from source tokens**

Run this Node command from the repository root:

```bash
node --input-type=module -e "import { writeFileSync } from 'node:fs'; import { createThemeVarsCss } from './packages/theme/src/tokens.ts'; writeFileSync('./packages/theme/src/styles/vars.css', createThemeVarsCss())"
```

Expected: `packages/theme/src/styles/vars.css` changes and contains
`--fe-comps-page-gap` plus the new `fe-comps-*` selectors.

- [ ] **Step 2: Run focused theme tests**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__
```

Expected: PASS.

- [ ] **Step 3: Commit generated CSS**

Run:

```bash
git add packages/theme/src/styles/vars.css
git commit -m "chore: sync generated theme css"
```

---

### Task 5: Document Composite Theme Boundary

**Files:**
- Modify: `docs/style-validation.md`
- Modify: `docs/consumer-setup.md`

- [ ] **Step 1: Update style validation docs**

In `docs/style-validation.md`, add this section near the existing theme
variable validation guidance:

```md
## Composite Surface Theme Rules

Composite component styling is owned by `@fizz/theme` through registered
`--fe-comps-*` variables and selectors for stable `fe-comps-*` classes.

Theme rules may style structural classes such as `fe-comps-page`,
`fe-comps-section`, `fe-comps-query-table`, `fe-comps-tree-panel`, and
`fe-comps-detail-sections`, but they must only reference registered Fizz-owned
variables or explicitly allowed Element Plus variables. Do not place reusable
CRUD/resource surface polish in playground-only CSS.
```

- [ ] **Step 2: Update consumer setup docs**

In `docs/consumer-setup.md`, add this paragraph near the style import guidance:

```md
Composite CRUD and resource-management surfaces use `fe-comps-*` structural
classes. Import `@fizz/theme/styles` alongside `@fizz/el-plus/styles` so
`FecPage`, `FecSection`, `FecQueryTable`, `FecSplitPane`, `FecTreePanel`, and
`FecDetailSections` receive the shared composite spacing, borders, and surface
tokens.
```

- [ ] **Step 3: Commit docs**

Run:

```bash
git add docs/style-validation.md docs/consumer-setup.md
git commit -m "docs: describe composite surface theme polish"
```

---

### Task 6: Verify Composite Pages

**Files:**
- No source edits expected.

- [ ] **Step 1: Run composite component tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
```

Expected: PASS. These tests confirm that the classes styled by the theme still
exist on the component and playground acceptance surfaces.

- [ ] **Step 2: Run package typechecks**

Run:

```bash
pnpm --filter @fizz/theme typecheck
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 3: Build theme and playground**

Run:

```bash
pnpm --filter @fizz/theme build
pnpm -C playground build
```

Expected: PASS.

---

### Task 7: Run Full Release Verification

**Files:**
- No source edits expected.

- [ ] **Step 1: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 2: Run release test set**

Run:

```bash
pnpm exec vitest run packages/el-plus/__tests__ packages/el-comps/__tests__ playground/__tests__/integration.spec.ts packages/theme/__tests__
```

Expected: PASS.

- [ ] **Step 3: Run wrapper coverage**

Run:

```bash
pnpm --filter @fizz/el-plus check:coverage
```

Expected: PASS.

- [ ] **Step 4: Run workspace typecheck and build**

Run:

```bash
pnpm typecheck
pnpm build
pnpm -C playground build
```

Expected: PASS.

- [ ] **Step 5: Run package checks**

Run:

```bash
pnpm check:packages
```

Expected: PASS.

- [ ] **Step 6: Confirm no unstaged tracked files**

Run:

```bash
git status --short
```

Expected: no unstaged tracked files. Ignored build output may exist but should
not appear.

---

## Completion Criteria

- `FizzThemeVars` and `fizzTokenRegistry` include the new composite surface
  tokens.
- `createThemeVarsCss()` emits the new tokens and class rules.
- `packages/theme/src/styles/vars.css` is synchronized with generated CSS.
- `fizzPreset()` safelists the composite classes.
- Theme tests, component tests, playground integration tests, package
  typechecks, builds, and package checks pass.
- Public component APIs and package exports are unchanged.
