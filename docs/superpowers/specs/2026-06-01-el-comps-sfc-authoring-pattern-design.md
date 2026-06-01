# el-comps SFC Authoring Pattern Design

## Goal

Define when `@fizz/el-comps` components should use plain SFC templates, when
they should keep render helpers, and how to migrate existing components without
changing public behavior.

This design promotes the successful patterns now visible in:

- `FecQueryTable.vue`: pure SFC composition with runtime props and small event
  bridge functions.
- `FecTreePanel.vue`: structural template with state, `watchDebounced`, and
  filter logic kept in `<script setup>`.
- `FecTable.vue`: template shell around toolbar and pagination, while table
  columns and row actions stay in render helpers.

## Scope

Included:

- Document an `@fizz/el-comps` authoring policy for SFC templates, render
  helpers, runtime props, and generic facade exports.
- Keep the current public component API and package exports.
- Prefer SFC templates for fixed DOM structure and composition components.
- Keep render helpers for schema-driven fields, table columns, and named-slot
  maps that are naturally VNode generation problems.
- Migrate only low-risk layout and section components after the policy lands.
- Tighten obvious local typing problems found while promoting the pattern.

Excluded:

- No changes to `@fizz/el-plus` transparent wrappers.
- No changes to Element Plus prop, emit, or slot names.
- No visual redesign.
- No new component features.
- No package `exports` changes.
- No broad replacement of every `h()` call.

## Authoring Policy

### Pure Template Composition

Use `<script setup lang="ts">` plus a plain `<template>` when a component is
primarily composing other public components and the DOM shape is fixed.

Good fit:

- `FecQueryTable`
- page-level or section-level components
- simple containers with named slots
- controls that mostly forward props and bridge events

The component should keep runtime props in `defineProps({ ... })` because the
package still publishes generic consumer facades from local `index.ts` files.
The SFC itself should not try to carry the generic public type contract.

Event bridge functions are acceptable when they preserve the public event
payload and make template bindings readable. They should not reinterpret or
rename consumer-facing events.

### Structural Template With Script Logic

Use a template when the DOM structure is meaningful, but keep stateful behavior
and adapters in `<script setup>`.

Good fit:

- `FecTreePanel`
- collapsible layout panels
- searchable structural widgets
- components using VueUse composables

The script section may own refs, watchers, computed values, and small adapter
functions such as `filterNode()` or `emitNodeClick()`. Template bindings should
remain declarative and should not contain complex inline expressions.

### Hybrid Template With Render Helpers

Use a template shell when the outer layout is fixed, but keep render helpers
for data-driven VNode generation.

Good fit:

- `FecTable`
- schema form field rendering
- table column generation
- row action columns
- dynamic named slot maps

Render helpers should stay in small functions or adjacent helper files. They
should own the VNode-specific complexity and leave the SFC template to show the
component's stable outer structure.

### Render Function Components

Keep render functions when they are the clearest expression of the component.
Do not convert code to templates only to remove `h()`.

Acceptable reasons to keep render functions:

- dynamic field/schema rendering;
- dynamic columns or slots keyed by schema data;
- shared helper functions that return `VNodeChild[]`;
- component factories used by more than one public component.

## Public Type Contract

This design does not change the public typing strategy from the component
directory work:

- Runtime props remain in the SFC.
- Generic consumer props stay in `props.ts`.
- Public component casts stay in local `index.ts` files.
- `packages/el-comps/src/index.ts` remains an aggregator.

For generic components, runtime props may use broad internal types such as
`object` or `Record<string, unknown>`. The exported facade is responsible for
the consumer-facing generic relationship between rows, query models, schemas,
and events.

## Migration Candidates

### Promote As Reference Patterns

`FecQueryTable.vue` should remain the reference for pure template composition.
It already expresses the intended component boundary:

```text
FecQueryForm + FecTable
```

`FecTreePanel.vue` should remain the reference for structural templates with
script-owned behavior. Before using it as a style example, tighten the tree ref
from `any` to a small local interface that only exposes `filter()`.

`FecTable.vue` should remain the reference for hybrid components. Its outer
toolbar and pagination belong in the template, while `renderTableNode()`,
`renderRowActionColumn()`, and `renderTableColumns()` should stay as render
helpers.

### Low-Risk Components To Convert

Convert the simple layout components after the policy is documented:

- `FecPage`
- `FecSection`
- `FecStack`
- `FecToolbar`
- `FecDetailSections`

These components have stable DOM structure and existing tests that assert
classes, visible text, slots, and action behavior.

### Components To Leave Alone For Now

Keep render helpers in:

- `FecForm`
- `FecQueryForm`
- `shared/schemaFields.ts`
- `fec-table/tableColumns.ts`
- the table column and row action internals in `FecTable`

These are schema-driven or VNode-driven surfaces. Converting them to template
syntax would make the code less direct and would not improve the public API.

## Testing Strategy

Run focused tests around each migrated component:

```bash
pnpm exec vitest run packages/el-comps/__tests__/layout.spec.ts
pnpm exec vitest run packages/el-comps/__tests__/fecDetailSections.spec.ts
pnpm exec vitest run packages/el-comps/__tests__/fecTreePanel.spec.ts
pnpm exec vitest run packages/el-comps/__tests__/fecTable.spec.ts packages/el-comps/__tests__/fecQueryTable.spec.ts
```

Run package type checks after the migration:

```bash
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
```

Run the full release path before reporting the migration complete:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

## Success Criteria

- The authoring policy exists in repository docs.
- Existing public exports and generic consumer types remain unchanged.
- `FecQueryTable`, `FecTreePanel`, and `FecTable` are documented as three
  distinct reference patterns.
- Low-risk layout components use SFC templates where that improves readability.
- Schema-driven and column-driven render helpers remain render helpers.
- Focused tests, package type checks, and the full release path pass.
