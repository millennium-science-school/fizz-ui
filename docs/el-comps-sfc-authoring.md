# el-comps SFC Authoring Guide

`@fizz/el-comps` components should use the simplest implementation style that
keeps component structure, behavior, and public types clear.

## Runtime And Public Types

- Keep runtime props in the SFC with `defineProps({ ... })` or component
  `props`.
- Keep generic consumer-facing props in the component directory's `props.ts`.
- Keep public generic component casts in the component directory's `index.ts`.
- Do not expose inferred Element Plus component internals in public
  declarations.

## Pure Template Composition

Use `<script setup lang="ts">` and a plain `<template>` when a component mostly
composes other public components and has a fixed DOM shape.

Reference: `packages/el-comps/src/components/fec-query-table/FecQueryTable.vue`.

Good fit:

- query/table composition surfaces;
- page and section shells;
- fixed slot containers;
- small event bridges that preserve payloads.

## Structural Template With Script Logic

Use a template for meaningful DOM structure and keep behavior in script.

Reference: `packages/el-comps/src/components/fec-tree-panel/FecTreePanel.vue`.

Good fit:

- searchable panels;
- collapsible panels;
- VueUse watchers and refs;
- small adapter functions such as `filterNode()` and `emitNodeClick()`.

## Hybrid Template With Render Helpers

Use a template for fixed outer structure and render helpers for VNode-driven
internals.

Reference: `packages/el-comps/src/components/fec-table/FecTable.vue`.

Good fit:

- table columns;
- row action columns;
- schema fields;
- dynamic named slot maps.

## Render Helpers That Should Stay

Keep render helpers when the code is naturally data-driven:

- `packages/el-comps/src/components/shared/schemaFields.ts`
- `packages/el-comps/src/components/fec-table/tableColumns.ts`
- table internals that build `FeTableColumn` nodes
- form/query field rendering from schema definitions

Do not convert code to templates only to remove `h()`.

## Migration Checklist

Before converting a render function component to a template:

1. Confirm the DOM structure is fixed.
2. Confirm dynamic VNode generation is not the main job of the component.
3. Keep existing runtime props and emit names.
4. Preserve existing stable `fe-comps-*` classes.
5. Run focused tests for the component.
6. Run `pnpm --filter @fizz/el-comps typecheck`.
