# el-comps SFC Authoring Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Codify and apply a conservative `@fizz/el-comps` SFC authoring policy that promotes templates for fixed structure while preserving render helpers for schema-driven and VNode-driven code.

**Architecture:** Add a repository authoring guide, tighten the `FecTreePanel` tree ref type, migrate only low-risk layout components to `<script setup>` templates, and keep table/form render helpers in place. Public generic component facades remain in each component directory's `index.ts`, and runtime props remain in the SFCs.

**Tech Stack:** Vue 3 SFCs, TypeScript, Element Plus through `@fizz/el-plus`, VueUse, Vitest, vue-tsc, pnpm workspace scripts.

---

## Scope Check

This plan covers one cohesive cleanup: documenting the authoring policy and
applying it to low-risk `@fizz/el-comps` components. It does not modify
`@fizz/el-plus`, package exports, visual design, table column behavior, form
schema behavior, or consumer-facing prop and event names.

## File Structure

- Create: `docs/el-comps-sfc-authoring.md`
  - Human-facing policy for choosing pure template, structural template, hybrid
    template/render-helper, or render-function implementations.
- Modify: `packages/el-comps/src/components/fec-tree-panel/FecTreePanel.vue`
  - Replace `ref<any>()` with a narrow local tree instance interface.
- Modify: `packages/el-comps/src/components/fec-page/FecPage.vue`
  - Convert fixed page shell from render function to SFC template.
- Modify: `packages/el-comps/src/components/fec-section/FecSection.vue`
  - Convert fixed section shell from render function to SFC template.
- Modify: `packages/el-comps/src/components/fec-stack/FecStack.vue`
  - Convert layout shell from render function to SFC template while keeping
    computed class/style logic.
- Modify: `packages/el-comps/src/components/fec-toolbar/FecToolbar.vue`
  - Convert toolbar structure to SFC template and keep action filtering in
    script.
- Modify: `packages/el-comps/src/components/fec-detail-sections/FecDetailSections.vue`
  - Convert section/nav structure to SFC template while preserving dynamic
    named slot lookup.
- Test: `packages/el-comps/__tests__/layout.spec.ts`
  - Existing coverage for page, section, stack, and toolbar behavior.
- Test: `packages/el-comps/__tests__/fecDetailSections.spec.ts`
  - Existing coverage for dynamic section slots and nav links.
- Test: `packages/el-comps/__tests__/fecTreePanel.spec.ts`
  - Existing coverage for tree panel structure and collapse event behavior.
- Test: `packages/el-comps/__tests__/fecTable.spec.ts`
  - Guard that table hybrid render-helper behavior still works.
- Test: `packages/el-comps/__tests__/fecQueryTable.spec.ts`
  - Guard that pure composition behavior still works.

---

### Task 1: Add The Authoring Guide

**Files:**
- Create: `docs/el-comps-sfc-authoring.md`

- [ ] **Step 1: Write the guide**

Create `docs/el-comps-sfc-authoring.md`:

```md
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
```

- [ ] **Step 2: Review the guide for local consistency**

Run:

```bash
rg -n "T(O)DO|T(B)D|PLACE(HOLDER)|fill\\s+in" docs/el-comps-sfc-authoring.md
```

Expected: no matches.

- [ ] **Step 3: Commit the guide**

Run:

```bash
git add docs/el-comps-sfc-authoring.md
git commit -m "docs: add el-comps sfc authoring guide"
```

---

### Task 2: Tighten FecTreePanel Ref Typing

**Files:**
- Modify: `packages/el-comps/src/components/fec-tree-panel/FecTreePanel.vue`
- Test: `packages/el-comps/__tests__/fecTreePanel.spec.ts`

- [ ] **Step 1: Update the local tree ref type**

In `packages/el-comps/src/components/fec-tree-panel/FecTreePanel.vue`, replace
the current `TreeNodeRecord` and `treeRef` block with:

```ts
type TreeNodeRecord = Record<string, unknown>

interface FilterableTreeInstance {
  filter: (value: string) => void
}
```

Then replace:

```ts
const treeRef = ref<any>()
```

with:

```ts
const treeRef = ref<FilterableTreeInstance>()
```

The `watchDebounced` block should remain:

```ts
watchDebounced(
  keyword,
  value => treeRef.value?.filter(value),
  { debounce: () => treePanelProps.filterDebounce },
)
```

- [ ] **Step 2: Run the focused tree panel tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecTreePanel.spec.ts
```

Expected: PASS with 2 tests.

- [ ] **Step 3: Run the package typecheck**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit the typing cleanup**

Run:

```bash
git add packages/el-comps/src/components/fec-tree-panel/FecTreePanel.vue
git commit -m "refactor: tighten fec tree panel ref type"
```

---

### Task 3: Convert Page And Section Shells

**Files:**
- Modify: `packages/el-comps/src/components/fec-page/FecPage.vue`
- Modify: `packages/el-comps/src/components/fec-section/FecSection.vue`
- Test: `packages/el-comps/__tests__/layout.spec.ts`

- [ ] **Step 1: Replace FecPage with a template shell**

Replace `packages/el-comps/src/components/fec-page/FecPage.vue` with:

```vue
<script setup lang="ts">
defineOptions({
  name: 'FecPage',
})

defineProps({
  title: String,
  description: String,
})
</script>

<template>
  <section class="fe-comps-page">
    <header
      v-if="title || description || $slots.extra"
      class="fe-comps-page-header"
    >
      <div class="fe-comps-page-heading">
        <h1
          v-if="title"
          class="fe-comps-page-title"
        >
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="fe-comps-page-description"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="$slots.extra"
        class="fe-comps-page-extra"
      >
        <slot name="extra" />
      </div>
    </header>
    <div class="fe-comps-page-body">
      <slot />
    </div>
  </section>
</template>
```

- [ ] **Step 2: Replace FecSection with a template shell**

Replace `packages/el-comps/src/components/fec-section/FecSection.vue` with:

```vue
<script setup lang="ts">
defineOptions({
  name: 'FecSection',
})

defineProps({
  title: String,
  description: String,
})
</script>

<template>
  <section class="fe-comps-section">
    <header
      v-if="title || description || $slots.extra"
      class="fe-comps-section-header"
    >
      <div class="fe-comps-section-heading">
        <h2
          v-if="title"
          class="fe-comps-section-title"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="fe-comps-section-description"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="$slots.extra"
        class="fe-comps-section-extra"
      >
        <slot name="extra" />
      </div>
    </header>
    <div class="fe-comps-section-body">
      <slot />
    </div>
  </section>
</template>
```

- [ ] **Step 3: Run layout tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/layout.spec.ts
```

Expected: PASS with 2 tests.

- [ ] **Step 4: Commit page and section conversion**

Run:

```bash
git add packages/el-comps/src/components/fec-page/FecPage.vue packages/el-comps/src/components/fec-section/FecSection.vue
git commit -m "refactor: convert page and section to sfc templates"
```

---

### Task 4: Convert Stack And Toolbar

**Files:**
- Modify: `packages/el-comps/src/components/fec-stack/FecStack.vue`
- Modify: `packages/el-comps/src/components/fec-toolbar/FecToolbar.vue`
- Test: `packages/el-comps/__tests__/layout.spec.ts`

- [ ] **Step 1: Replace FecStack with script setup and template**

Replace `packages/el-comps/src/components/fec-stack/FecStack.vue` with:

```vue
<script setup lang="ts">
import type { PropType } from 'vue'
import type { FecStackDirection, FecStackGap } from './props'
import { computed } from 'vue'

const GAP_MAP: Record<FecStackGap, string> = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
}

defineOptions({
  name: 'FecStack',
})

const stackProps = defineProps({
  direction: {
    type: String as PropType<FecStackDirection>,
    default: 'vertical',
  },
  gap: {
    type: String as PropType<FecStackGap>,
    default: 'md',
  },
})

const classes = computed(() => [
  'fe-comps-stack',
  `fe-comps-stack--${stackProps.direction}`,
  `fe-comps-stack--gap-${stackProps.gap}`,
])

const style = computed(() => ({
  display: 'flex',
  flexDirection: stackProps.direction === 'horizontal' ? 'row' : 'column',
  flexWrap: stackProps.direction === 'horizontal' ? 'wrap' : 'nowrap',
  gap: GAP_MAP[stackProps.gap],
}))
</script>

<template>
  <div
    :class="classes"
    :style="style"
  >
    <slot />
  </div>
</template>
```

- [ ] **Step 2: Replace FecToolbar with a template**

Replace `packages/el-comps/src/components/fec-toolbar/FecToolbar.vue` with:

```vue
<script setup lang="ts">
import type { PropType } from 'vue'
import type { FecActionItem } from '../shared/actionTypes'
import { FeButton } from '@fizz/el-plus'
import { computed } from 'vue'

defineOptions({
  name: 'FecToolbar',
})

const toolbarProps = defineProps({
  actions: {
    type: Array as PropType<FecActionItem[]>,
    default: () => [],
  },
})

const emit = defineEmits(['action'])

const visibleActions = computed(() => toolbarProps.actions.filter(action => !action.hidden))

function emitAction(action: FecActionItem) {
  emit('action', action.key, action)
}
</script>

<template>
  <div class="fe-comps-toolbar">
    <div class="fe-comps-toolbar-left">
      <slot />
    </div>
    <div class="fe-comps-toolbar-right">
      <slot name="extra" />
      <FeButton
        v-for="action in visibleActions"
        :key="action.key"
        :type="action.type"
        :disabled="action.disabled"
        @click="emitAction(action)"
      >
        {{ action.label }}
      </FeButton>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Run layout tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/layout.spec.ts
```

Expected: PASS with 2 tests.

- [ ] **Step 4: Commit stack and toolbar conversion**

Run:

```bash
git add packages/el-comps/src/components/fec-stack/FecStack.vue packages/el-comps/src/components/fec-toolbar/FecToolbar.vue
git commit -m "refactor: convert stack and toolbar to sfc templates"
```

---

### Task 5: Convert Detail Sections

**Files:**
- Modify: `packages/el-comps/src/components/fec-detail-sections/FecDetailSections.vue`
- Test: `packages/el-comps/__tests__/fecDetailSections.spec.ts`

- [ ] **Step 1: Replace FecDetailSections with structural template**

Replace `packages/el-comps/src/components/fec-detail-sections/FecDetailSections.vue` with:

```vue
<script setup lang="ts">
import type { PropType } from 'vue'
import type { FecDetailSectionItem } from './props'
import FecSection from '../fec-section/FecSection.vue'

defineOptions({
  name: 'FecDetailSections',
})

defineProps({
  sections: {
    type: Array as PropType<readonly FecDetailSectionItem[]>,
    required: true,
  },
  nav: {
    type: Boolean,
    default: true,
  },
})

function sectionId(key: string) {
  return `fec-detail-section-${key}`
}
</script>

<template>
  <div class="fe-comps-detail-sections">
    <div class="fe-comps-detail-sections__main">
      <FecSection
        v-for="section in sections"
        :id="sectionId(section.key)"
        :key="section.key"
        class="fe-comps-detail-sections__section"
        :description="section.description"
        :title="section.title"
      >
        <slot :name="section.key" />
      </FecSection>
    </div>
    <aside
      v-if="nav"
      class="fe-comps-detail-sections__nav"
    >
      <a
        v-for="section in sections"
        :key="section.key"
        class="fe-comps-detail-sections__nav-link"
        :href="`#${sectionId(section.key)}`"
      >
        {{ section.title }}
      </a>
    </aside>
  </div>
</template>
```

- [ ] **Step 2: Run detail sections tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecDetailSections.spec.ts
```

Expected: PASS with 2 tests and no Vue warnings.

- [ ] **Step 3: Commit detail sections conversion**

Run:

```bash
git add packages/el-comps/src/components/fec-detail-sections/FecDetailSections.vue
git commit -m "refactor: convert detail sections to structural template"
```

---

### Task 6: Guard Reference Components

**Files:**
- Test: `packages/el-comps/__tests__/fecTable.spec.ts`
- Test: `packages/el-comps/__tests__/fecQueryTable.spec.ts`
- Test: `packages/el-comps/__tests__/fecTreePanel.spec.ts`

- [ ] **Step 1: Run the reference component tests together**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecTable.spec.ts packages/el-comps/__tests__/fecQueryTable.spec.ts packages/el-comps/__tests__/fecTreePanel.spec.ts
```

Expected: PASS with 17 tests.

- [ ] **Step 2: Confirm render helpers were not flattened**

Run:

```bash
rg -n "renderTableNode|renderRowActionColumn|renderTableColumns|renderSchemaFields" packages/el-comps/src/components
```

Expected output includes:

```text
packages/el-comps/src/components/fec-table/FecTable.vue
packages/el-comps/src/components/fec-table/tableColumns.ts
packages/el-comps/src/components/shared/schemaFields.ts
```

- [ ] **Step 3: Commit the reference verification if tests or comments changed**

If no files changed in this task, skip the commit. If a small clarifying comment
was added while verifying the reference components, run:

```bash
git add packages/el-comps/src/components/fec-table/FecTable.vue packages/el-comps/src/components/fec-table/tableColumns.ts packages/el-comps/src/components/shared/schemaFields.ts
git commit -m "docs: mark el-comps render helper boundaries"
```

---

### Task 7: Run Type And Consumer Checks

**Files:**
- No source files should be changed in this task.

- [ ] **Step 1: Run package typecheck**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 2: Run package consumer typecheck**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: PASS and no public declaration leaks from `node_modules` or source
paths.

- [ ] **Step 3: Run package tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__
```

Expected: PASS for all `@fizz/el-comps` tests.

---

### Task 8: Run Full Release Verification

**Files:**
- No source files should be changed in this task.

- [ ] **Step 1: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 2: Run release test set**

Run:

```bash
pnpm exec vitest run packages/el-plus/__tests__ packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
```

Expected: PASS.

- [ ] **Step 3: Run Element Plus wrapper coverage**

Run:

```bash
pnpm --filter @fizz/el-plus check:coverage
```

Expected: PASS.

- [ ] **Step 4: Run workspace typecheck**

Run:

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 5: Run workspace build**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 6: Run playground build**

Run:

```bash
pnpm -C playground build
```

Expected: PASS.

- [ ] **Step 7: Run package publication checks**

Run:

```bash
pnpm check:packages
```

Expected: PASS.

---

## Completion Criteria

- `docs/el-comps-sfc-authoring.md` exists and matches the design policy.
- `FecTreePanel` no longer uses `ref<any>()` for the tree instance.
- `FecPage`, `FecSection`, `FecStack`, `FecToolbar`, and
  `FecDetailSections` use SFC templates.
- `FecTable`, `renderTableColumns()`, and `renderSchemaFields()` still use
  render helpers for VNode-driven work.
- Focused tests, package type checks, consumer type checks, and the full
  release verification path pass.
