# Docs And Demo Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Organize Fizz UI docs and playground demo content so current package capabilities are discoverable without turning playground into a project template or framework.

**Architecture:** Add a small docs index and focused markdown pages, update the existing playground home/navigation as a content directory, and extend static integration tests. Keep all code inside the existing playground app and do not add a docs framework.

**Tech Stack:** Markdown docs, Vue 3 playground pages, vue-router, Vitest static integration tests, pnpm workspace scripts.

---

## Scope Check

This plan is content and routing cleanup only. It does not add components,
change package APIs, introduce a docs framework, create a project template, or
expand playground into an application shell. Playground remains a lightweight
display and verification app.

## File Structure

- Create: `docs/index.md`
  - Main documentation entry and reading order.
- Create: `docs/theme-setup.md`
  - Focused setup for styles, UnoCSS, overrides, and composite theme polish.
- Create: `docs/el-comps.md`
  - Composite component usage map and workflow grouping.
- Create: `docs/el-kit-headless.md`
  - Headless state/schema responsibilities and CRUD workflow composables.
- Create: `docs/playground-demos.md`
  - Playground page map and explicit non-template boundary.
- Modify: `docs/consumer-setup.md`
  - Add a short pointer to the docs index and keep setup content focused.
- Modify: `playground/src/App.vue`
  - Add the Resource Layout route to the existing navigation.
- Modify: `playground/src/views/HomePage.vue`
  - Add content-directory sections for package boundaries and demo pages.
- Modify: `playground/__tests__/integration.spec.ts`
  - Assert docs/demo content entries and resource nav coverage.

---

### Task 1: Add Documentation Index

**Files:**
- Create: `docs/index.md`
- Modify: `docs/consumer-setup.md`

- [ ] **Step 1: Create `docs/index.md`**

Create `docs/index.md`:

```md
# Fizz UI Docs

Fizz UI is a pnpm workspace for Vue 3 UI packages built around Element Plus.

## Package Map

- `@fizz/el-plus`: transparent Element Plus namespace adapter.
- `@fizz/theme`: Fizz-owned theme variables, generated CSS, and UnoCSS preset.
- `@fizz/el-kit`: headless schema and CRUD state primitives.
- `@fizz/el-comps`: composite admin and resource-management components.
- `playground`: content display and integration acceptance app.

## Reading Order

1. [Consumer Setup](./consumer-setup.md)
2. [Theme Setup](./theme-setup.md)
3. [Component Wrapper Contract](./component-wrapper-contract.md)
4. [el-kit Headless Guide](./el-kit-headless.md)
5. [el-comps Guide](./el-comps.md)
6. [Playground Demos](./playground-demos.md)
7. [Style Validation](./style-validation.md)
8. [Release Boundary](./release-boundary.md)

## Boundaries

`@fizz/el-plus` adapts Element Plus into the `fe` namespace. It should preserve
Element Plus props, emits, slots, attrs, and runtime behavior.

`@fizz/el-kit` stays headless. It owns data/state protocols and must not return
Vue components.

`@fizz/el-comps` renders composite Vue components using `@fizz/el-plus` and
`@fizz/el-kit`.

`@fizz/theme` owns reusable Fizz variables and structural theme rules. Runtime
source must not depend on component packages.

The playground shows and verifies current capabilities. It is not a project
template or application framework.
```

- [ ] **Step 2: Add docs index pointer to `consumer-setup.md`**

Near the top of `docs/consumer-setup.md`, after the title, add:

```md
For the full documentation map, start with [Fizz UI Docs](./index.md). This
file stays focused on consumer installation and setup.
```

- [ ] **Step 3: Run docs sanity check**

Run:

```bash
rg -n "Fizz UI Docs|Package Map|Consumer Setup|project template" docs/index.md docs/consumer-setup.md
```

Expected: matches for the new index title, reading-order link, and playground
boundary language.

- [ ] **Step 4: Commit docs index**

Run:

```bash
git add docs/index.md docs/consumer-setup.md
git commit -m "docs: add fizz ui documentation index"
```

---

### Task 2: Add Focused Package Guides

**Files:**
- Create: `docs/theme-setup.md`
- Create: `docs/el-kit-headless.md`
- Create: `docs/el-comps.md`

- [ ] **Step 1: Create theme setup guide**

Create `docs/theme-setup.md`:

```md
# Theme Setup

## Style Imports

Use the package style entries in this order:

```ts
import '@fizz/el-plus/styles'
import '@fizz/theme/styles'
import './styles/element-overrides.css'
import 'virtual:uno.css'
```

`@fizz/el-plus/styles` emits Element Plus CSS under the `fe` namespace.
`@fizz/theme/styles` emits Fizz-owned wrapper and composite variables.
Application brand overrides should be imported after package styles.

## UnoCSS

```ts
import { fizzPreset } from '@fizz/theme/preset/unocss'
import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3(), fizzPreset()],
})
```

## Composite Surfaces

CRUD and resource-management components use stable `fe-comps-*` classes.
`@fizz/theme/styles` provides shared spacing, borders, and surface treatment for
`FecPage`, `FecSection`, `FecQueryTable`, `FecSplitPane`, `FecTreePanel`, and
`FecDetailSections`.

## Variable Ownership

Fizz-owned variables are registered in
`packages/theme/src/token-registry.ts`. Theme rules may reference registered
`--fe-fizz-*` and `--fe-comps-*` variables, plus explicitly allowed Element
Plus variables.

See [Style Validation](./style-validation.md) for the validation contract.
```

- [ ] **Step 2: Create el-kit headless guide**

Create `docs/el-kit-headless.md`:

```md
# el-kit Headless Guide

`@fizz/el-kit` owns reusable state and schema protocols. It does not render Vue
components.

## Field Schema

Built-in form/query controls use `kind` values such as `input`, `number`,
`select`, `multiSelect`, `date`, `dateRange`, `switch`, and `textarea`.

Custom Vue component rendering belongs in `@fizz/el-comps` or application code.

## CRUD State

`useQueryTable` composes query, table, pagination, loading, and optional
`fetchList` state. It is the headless workflow behind query-table pages.

`useDialogFormState` owns create/edit form state.

`useDetailState` owns current detail record state.

## Rendering Bridge

`@fizz/el-comps` provides `useFecQueryTableBindings()` to adapt a
`useQueryTable` state object into `FecQueryTable` props and update handlers.

See [el-kit Table State](./el-kit-table-state.md) for lower-level state source
rules.
```

- [ ] **Step 3: Create el-comps guide**

Create `docs/el-comps.md`:

```md
# el-comps Guide

`@fizz/el-comps` provides composite Vue components built from `@fizz/el-plus`
and `@fizz/el-kit`.

## CRUD Surfaces

- `FecPage`: page shell.
- `FecSection`: titled page section.
- `FecQueryTable`: query form plus toolbar/table/pagination.
- `FecTable`: data table with optional toolbar, pagination, selection, and row
  actions.
- `FecDialogForm` and `FecDrawerForm`: controlled form overlays.
- `FecDetail`: read-only record detail display.

## Resource Layouts

- `FecSplitPane`: thin `FeSplitter` facade.
- `FecTreePanel`: searchable/collapsible tree panel.
- `FecDetailSections`: multi-section detail layout with local navigation.

## Authoring Boundary

Components should keep runtime props local and expose generic consumer types
through their component directory `props.ts` and `index.ts` files.

Use templates for fixed structure and render helpers for schema, table column,
and row-action VNode generation.

See [el-comps SFC Authoring Guide](./el-comps-sfc-authoring.md).
```

- [ ] **Step 4: Commit package guides**

Run:

```bash
git add docs/theme-setup.md docs/el-kit-headless.md docs/el-comps.md
git commit -m "docs: add focused package guides"
```

---

### Task 3: Document Playground Demos

**Files:**
- Create: `docs/playground-demos.md`

- [ ] **Step 1: Create playground demo guide**

Create `docs/playground-demos.md`:

```md
# Playground Demos

The playground is a content display and integration acceptance app. It is not a
project template, starter kit, or framework scaffold.

## Pages

- `/`: overview of package boundaries, style setup, and acceptance surfaces.
- `/crud`: CRUD workflow using `FecQueryTable`, `useQueryTable`,
  `useFecQueryTableBindings`, `FecDialogForm`, and `FecDetail`.
- `/resource-layout`: tree-driven split layout using `FecSplitPane`,
  `FecTreePanel`, `FecDetailSections`, `multiSelect`, and `dateRange`.
- `/comps-lab`: broad component lab for manual checks and integration
  assertions.

## Boundary

Keep the playground small. Do not add auth, data clients, generated menus,
file-system routing, project settings, or application template conventions.

When components and themes stabilize, project templates can be built as a
separate phase using the packages demonstrated here.
```

- [ ] **Step 2: Commit playground docs**

Run:

```bash
git add docs/playground-demos.md
git commit -m "docs: describe playground demo boundaries"
```

---

### Task 4: Update Playground Navigation And Home Content

**Files:**
- Modify: `playground/src/App.vue`
- Modify: `playground/src/views/HomePage.vue`

- [ ] **Step 1: Add resource layout to nav**

In `playground/src/App.vue`, update `navItems` to:

```ts
const navItems = [
  { to: '/', label: '首页' },
  { to: '/crud', label: 'CRUD 示例' },
  { to: '/resource-layout', label: '资源布局' },
  { to: '/comps-lab', label: '组件 Lab' },
]
```

- [ ] **Step 2: Add content directory data to home page**

In `playground/src/views/HomePage.vue`, add these constants in `<script setup>`
near the other local constants:

```ts
const demoEntries = [
  {
    title: 'CRUD 示例',
    path: '/crud',
    description: 'FecQueryTable + useQueryTable + dialog/detail workflow',
  },
  {
    title: '资源布局',
    path: '/resource-layout',
    description: 'FecSplitPane + FecTreePanel + FecDetailSections',
  },
  {
    title: '组件 Lab',
    path: '/comps-lab',
    description: 'Forms, tables, overlays, detail and edge-state checks',
  },
]

const packageBoundaries = [
  '@fizz/el-plus: transparent Element Plus namespace adapter',
  '@fizz/theme: variables, generated CSS and UnoCSS preset',
  '@fizz/el-kit: headless schema and CRUD state',
  '@fizz/el-comps: composite admin/resource components',
]
```

- [ ] **Step 3: Add content directory markup to home page**

In `playground/src/views/HomePage.vue`, place this section below the existing
intro header:

```vue
<section class="mb-6 grid gap-4 md:grid-cols-2">
  <FeCard shadow="never">
    <template #header>
      <div class="font-semibold">
        Demo content
      </div>
    </template>
    <div class="grid gap-3 text-sm">
      <RouterLink
        v-for="entry in demoEntries"
        :key="entry.path"
        :to="entry.path"
        class="rounded-[var(--fe-fizz-surface-radius)] border border-[var(--fe-border-color)] p-3 no-underline"
      >
        <div class="font-semibold text-[var(--fe-text-color-primary)]">
          {{ entry.title }}
        </div>
        <div class="mt-1 text-[var(--fe-text-color-regular)]">
          {{ entry.description }}
        </div>
      </RouterLink>
    </div>
  </FeCard>

  <FeCard shadow="never">
    <template #header>
      <div class="font-semibold">
        Package boundaries
      </div>
    </template>
    <ul class="m-0 grid gap-2 pl-4 text-sm leading-6">
      <li
        v-for="item in packageBoundaries"
        :key="item"
      >
        {{ item }}
      </li>
    </ul>
    <p class="mt-3 text-sm text-[var(--fe-text-color-regular)]">
      Playground is a content display and acceptance app, not a project template.
    </p>
  </FeCard>
</section>
```

If `RouterLink` is not already imported in the home page, add:

```ts
import { RouterLink } from 'vue-router'
```

- [ ] **Step 4: Commit playground content update**

Run:

```bash
git add playground/src/App.vue playground/src/views/HomePage.vue
git commit -m "docs: expose playground demo content"
```

---

### Task 5: Extend Integration Tests

**Files:**
- Modify: `playground/__tests__/integration.spec.ts`

- [ ] **Step 1: Extend home page assertions**

In the first test in `playground/__tests__/integration.spec.ts`, add:

```ts
expect(app).toContain('/resource-layout')
expect(app).toContain('资源布局')
expect(home).toContain('Demo content')
expect(home).toContain('Package boundaries')
expect(home).toContain('Playground is a content display and acceptance app')
expect(home).toContain('@fizz/el-kit: headless schema and CRUD state')
expect(home).toContain('@fizz/el-comps: composite admin/resource components')
expect(home).toContain('FecSplitPane + FecTreePanel + FecDetailSections')
```

- [ ] **Step 2: Add docs assertions**

Add a new test:

```ts
it('docs index links the current package guides and playground boundary', () => {
  const index = readFileSync(resolve(__dirname, '../../docs/index.md'), 'utf8')
  const playgroundDocs = readFileSync(resolve(__dirname, '../../docs/playground-demos.md'), 'utf8')

  expect(index).toContain('Package Map')
  expect(index).toContain('@fizz/el-plus')
  expect(index).toContain('@fizz/theme')
  expect(index).toContain('@fizz/el-kit')
  expect(index).toContain('@fizz/el-comps')
  expect(index).toContain('Playground Demos')
  expect(playgroundDocs).toContain('not a project template')
  expect(playgroundDocs).toContain('/resource-layout')
})
```

- [ ] **Step 3: Run integration tests**

Run:

```bash
pnpm exec vitest run playground/__tests__/integration.spec.ts
```

Expected: PASS.

- [ ] **Step 4: Commit integration coverage**

Run:

```bash
git add playground/__tests__/integration.spec.ts
git commit -m "test: cover docs and playground content map"
```

---

### Task 6: Verify Content Build

**Files:**
- No source edits expected.

- [ ] **Step 1: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 2: Build playground**

Run:

```bash
pnpm -C playground build
```

Expected: PASS.

- [ ] **Step 3: Run package checks**

Run:

```bash
pnpm check:packages
```

Expected: PASS.

- [ ] **Step 4: Confirm worktree state**

Run:

```bash
git status --short
```

Expected: only committed changes or intentionally staged files. No accidental
generated app-template files should exist.

---

## Completion Criteria

- Docs index and focused package guides exist.
- `consumer-setup.md` points readers to the docs index.
- `playground-demos.md` explicitly says playground is not a project template.
- Playground navigation includes Resource Layout.
- Playground home lists demo content and package boundaries.
- Integration tests cover docs and playground content entries.
- Lint, playground build, and package checks pass.
