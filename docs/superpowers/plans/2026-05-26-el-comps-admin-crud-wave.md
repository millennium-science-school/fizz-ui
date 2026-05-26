# el-comps Admin CRUD Wave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first high-frequency admin CRUD component wave in `@fizz/el-comps`.

**Architecture:** Add focused layout, form, table, detail, and dialog/drawer form components around the existing `@fizz/el-kit` field schema protocol. Replace the current experimental `FecTable` and `FecQueryTable` contracts directly with CRUD-oriented contracts. Keep all components controlled and leave fetching, permissions, async schema/options, and visual redesign outside this wave.

**Tech Stack:** Vue 3 SFCs and render functions, TypeScript, `@fizz/el-plus`, `@fizz/el-kit`, Vitest, vue-tsc, Vite library build, pnpm workspace scripts.

---

## File Structure

- Create: `packages/el-comps/src/components/actionTypes.ts`
  - Shared UI action metadata for toolbar and row actions.
- Create: `packages/el-comps/src/components/FecPage.vue`
  - Admin page shell with title, description, extra slot, and body slot.
- Create: `packages/el-comps/src/components/FecSection.vue`
  - Page section with title, description, extra slot, and body slot.
- Create: `packages/el-comps/src/components/FecStack.vue`
  - Low-level spacing primitive for vertical or horizontal layouts.
- Create: `packages/el-comps/src/components/FecToolbar.vue`
  - Toolbar with left/right slots and action metadata rendering.
- Create: `packages/el-comps/src/components/FecForm.vue`
  - Controlled schema form based on `FecFormSchemaItem<T>[]`.
- Create: `packages/el-comps/src/components/FecQueryForm.vue`
  - Controlled query form with submit/reset actions.
- Replace: `packages/el-comps/src/components/FecTable.vue`
  - Pure data table with optional toolbar, pagination, loading, selection, and row actions.
- Replace: `packages/el-comps/src/components/FecQueryTable.vue`
  - Composition of `FecQueryForm`, `FecToolbar`, and `FecTable`.
- Create: `packages/el-comps/src/components/FecDetail.vue`
  - Simple read-only record detail display.
- Create: `packages/el-comps/src/components/FecDialogForm.vue`
  - `FeDialog` plus `FecForm` for create/edit flows.
- Create: `packages/el-comps/src/components/FecDrawerForm.vue`
  - `FeDrawer` plus `FecForm` for create/edit flows.
- Modify: `packages/el-comps/src/components/types.ts`
  - Public props, detail schema, pagination, and event payload types.
- Modify: `packages/el-comps/src/components/schemaFields.ts`
  - Keep shared field rendering; add form-item class and optional label width support only if needed by `FecForm`.
- Modify: `packages/el-comps/src/components/tableColumns.ts`
  - Keep column rendering and allow row action column composition from `FecTable`.
- Modify: `packages/el-comps/src/index.ts`
  - Export all new components and public types with generic constructor facades where needed.
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`
  - Cover the new public component contracts from built declarations.
- Create: `packages/el-comps/__tests__/layout.spec.ts`
  - Runtime tests for layout components.
- Create: `packages/el-comps/__tests__/fecForm.spec.ts`
  - Runtime tests for `FecForm` and `FecQueryForm`.
- Replace/update: `packages/el-comps/__tests__/fecTable.spec.ts`
  - Runtime tests for the new pure `FecTable`.
- Replace/update: `packages/el-comps/__tests__/fecQueryTable.spec.ts`
  - Runtime tests for the new composed `FecQueryTable`.
- Create: `packages/el-comps/__tests__/fecFlow.spec.ts`
  - Runtime tests for `FecDialogForm`, `FecDrawerForm`, and `FecDetail`.
- Modify: `playground/src/App.vue`
  - Add route/link to the CRUD demo if the app remains single-screen.
- Create: `playground/src/views/CrudPage.vue`
  - In-memory CRUD demo page using the new component wave.
- Modify: `playground/__tests__/integration.spec.ts`
  - Assert the CRUD demo renders and exercises the main components.
- Modify: `docs/consumer-setup.md`
  - Replace near-term component expansion note with a summary of the completed CRUD component wave.

---

### Task 1: Shared action types and layout containers

**Files:**
- Create: `packages/el-comps/src/components/actionTypes.ts`
- Create: `packages/el-comps/src/components/FecPage.vue`
- Create: `packages/el-comps/src/components/FecSection.vue`
- Create: `packages/el-comps/src/components/FecStack.vue`
- Create: `packages/el-comps/src/components/FecToolbar.vue`
- Create: `packages/el-comps/__tests__/layout.spec.ts`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Add layout runtime tests**

Create `packages/el-comps/__tests__/layout.spec.ts` with tests that mount the components and assert:

```ts
import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { FecPage, FecSection, FecStack, FecToolbar } from '../src'

describe('CRUD layout components', () => {
  it('renders page and section structure with stable classes', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecPage, { title: 'Users', description: 'Manage users' }, {
          extra: () => h('button', 'Create'),
          default: () =>
            h(FecSection, { title: 'List', description: 'Active users' }, {
              extra: () => h('span', 'Extra'),
              default: () => h('div', 'Body'),
            }),
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-page')).toBeTruthy()
    expect(host.querySelector('.fe-comps-page-header')).toBeTruthy()
    expect(host.querySelector('.fe-comps-section')).toBeTruthy()
    expect(host.textContent).toContain('Users')
    expect(host.textContent).toContain('List')

    app.unmount()
    host.remove()
  })

  it('renders stack direction and toolbar action events', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const clicked: string[] = []

    const app = createApp({
      render: () =>
        h(FecStack, { direction: 'horizontal', gap: 'sm' }, () =>
          h(FecToolbar, {
            actions: [
              { key: 'create', label: 'Create', type: 'primary' },
              { key: 'hidden', label: 'Hidden', hidden: true },
            ],
            onAction: key => clicked.push(key),
          })),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-stack')).toBeTruthy()
    expect(host.querySelector('.fe-comps-stack--horizontal')).toBeTruthy()
    expect(host.querySelector('.fe-comps-toolbar')).toBeTruthy()
    expect(host.textContent).toContain('Create')
    expect(host.textContent).not.toContain('Hidden')

    ;(host.querySelector('button') as HTMLButtonElement).click()
    await nextTick()

    expect(clicked).toEqual(['create'])

    app.unmount()
    host.remove()
  })
})
```

- [ ] **Step 2: Run the layout test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/layout.spec.ts
```

Expected: FAIL because `FecPage`, `FecSection`, `FecStack`, and `FecToolbar` are not exported yet.

- [ ] **Step 3: Add shared action types**

Create `packages/el-comps/src/components/actionTypes.ts`:

```ts
export type FecActionType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface FecActionItem<Context = unknown> {
  key: string
  label: string
  type?: FecActionType
  disabled?: boolean
  hidden?: boolean
  context?: Context
}

export interface FecRowAction<Row extends object> extends FecActionItem<Row> {
  onClick?: (row: Row, index: number) => void
}
```

- [ ] **Step 4: Add `FecPage.vue`**

Create `packages/el-comps/src/components/FecPage.vue`:

```vue
<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecPage',
  props: {
    title: String,
    description: String,
  },
  setup(props, { slots }) {
    return () =>
      h('section', { class: 'fe-comps-page' }, [
        (props.title || props.description || slots.extra)
          ? h('header', { class: 'fe-comps-page-header' }, [
              h('div', { class: 'fe-comps-page-heading' }, [
                props.title ? h('h1', { class: 'fe-comps-page-title' }, props.title) : null,
                props.description ? h('p', { class: 'fe-comps-page-description' }, props.description) : null,
              ]),
              slots.extra ? h('div', { class: 'fe-comps-page-extra' }, slots.extra()) : null,
            ])
          : null,
        h('div', { class: 'fe-comps-page-body' }, slots.default?.()),
      ])
  },
})
</script>
```

- [ ] **Step 5: Add `FecSection.vue`, `FecStack.vue`, and `FecToolbar.vue`**

Create `packages/el-comps/src/components/FecSection.vue` with the same header/body pattern as `FecPage`, using classes `fe-comps-section`, `fe-comps-section-header`, `fe-comps-section-heading`, `fe-comps-section-title`, `fe-comps-section-description`, `fe-comps-section-extra`, and `fe-comps-section-body`.

Create `packages/el-comps/src/components/FecStack.vue`:

```vue
<script lang="ts">
import { computed, defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecStack',
  props: {
    direction: {
      type: String,
      default: 'vertical',
      validator: (value: string) => ['vertical', 'horizontal'].includes(value),
    },
    gap: {
      type: String,
      default: 'md',
      validator: (value: string) => ['xs', 'sm', 'md', 'lg'].includes(value),
    },
  },
  setup(props, { slots }) {
    const classes = computed(() => [
      'fe-comps-stack',
      `fe-comps-stack--${props.direction}`,
      `fe-comps-stack--gap-${props.gap}`,
    ])

    return () => h('div', { class: classes.value }, slots.default?.())
  },
})
</script>
```

Create `packages/el-comps/src/components/FecToolbar.vue`:

```vue
<script lang="ts">
import type { PropType } from 'vue'
import type { FecActionItem } from './actionTypes'
import { FeButton } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecToolbar',
  props: {
    actions: {
      type: Array as PropType<FecActionItem[]>,
      default: () => [],
    },
  },
  emits: ['action'],
  setup(props, { emit, slots }) {
    return () =>
      h('div', { class: 'fe-comps-toolbar' }, [
        h('div', { class: 'fe-comps-toolbar-left' }, slots.default?.()),
        h('div', { class: 'fe-comps-toolbar-right' }, [
          slots.extra?.(),
          ...props.actions
            .filter(action => !action.hidden)
            .map(action =>
              h(
                FeButton,
                {
                  key: action.key,
                  type: action.type,
                  disabled: action.disabled,
                  onClick: () => emit('action', action.key, action),
                },
                () => action.label,
              ),
            ),
        ]),
      ])
  },
})
</script>
```

- [ ] **Step 6: Export layout components**

In `packages/el-comps/src/index.ts`, import the four SFCs and export them directly:

```ts
import FecPage from './components/FecPage.vue'
import FecSection from './components/FecSection.vue'
import FecStack from './components/FecStack.vue'
import FecToolbar from './components/FecToolbar.vue'

export { FecPage, FecSection, FecStack, FecToolbar }
export type { FecActionItem, FecActionType, FecRowAction } from './components/actionTypes'
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/layout.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

Commit:

```bash
git add packages/el-comps/src/components/actionTypes.ts packages/el-comps/src/components/FecPage.vue packages/el-comps/src/components/FecSection.vue packages/el-comps/src/components/FecStack.vue packages/el-comps/src/components/FecToolbar.vue packages/el-comps/src/index.ts packages/el-comps/__tests__/layout.spec.ts
git commit -m "feat: add el-comps CRUD layout components"
```

---

### Task 2: Add standalone schema form components

**Files:**
- Create: `packages/el-comps/src/components/FecForm.vue`
- Create: `packages/el-comps/src/components/FecQueryForm.vue`
- Modify: `packages/el-comps/src/components/types.ts`
- Create: `packages/el-comps/__tests__/fecForm.spec.ts`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Add form runtime tests**

Create `packages/el-comps/__tests__/fecForm.spec.ts` with coverage for:

- `FecForm` renders `kind` fields from schema.
- `FecForm` emits `update:model` without mutating the original object.
- `FecQueryForm` renders submit/reset buttons and emits `submit`, `reset`, and `update:model`.
- `FecQueryForm` supports select options.

Use existing patterns from `fecTable.spec.ts` and `fecQueryTable.spec.ts`.

- [ ] **Step 2: Run form tests and verify failure**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecForm.spec.ts
```

Expected: FAIL because `FecForm` and `FecQueryForm` are not exported yet.

- [ ] **Step 3: Add form props to `types.ts`**

Add:

```ts
export interface FecFormProps<T extends object> {
  model: T
  schema: FecFormSchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
}

export interface FecQueryFormProps<T extends object> {
  model: T
  schema: FecQuerySchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
  submitText?: string
  resetText?: string
}
```

- [ ] **Step 4: Add `FecForm.vue`**

Create `packages/el-comps/src/components/FecForm.vue`:

```vue
<script lang="ts">
import type { PropType } from 'vue'
import type { FecFormModel, FecFormSchemaItem } from './types'
import { FeForm } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'
import { renderSchemaFields } from './schemaFields'

export default defineComponent({
  name: 'FecForm',
  props: {
    model: {
      type: Object as PropType<FecFormModel>,
      required: true,
    },
    schema: {
      type: Array as PropType<FecFormSchemaItem<Record<string, unknown>>[]>,
      required: true,
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    labelWidth: [String, Number],
    columns: {
      type: Number as PropType<1 | 2 | 3 | 4>,
      default: 1,
    },
  },
  emits: ['update:model'],
  setup(props, { emit }) {
    function emitField(prop: string, value: unknown) {
      emit('update:model', {
        ...props.model,
        [prop]: value,
      })
    }

    return () =>
      h(
        FeForm,
        {
          class: ['fe-comps-form', `fe-comps-form--cols-${props.columns}`],
          model: props.model,
          rules: props.rules,
          labelWidth: props.labelWidth,
        },
        () =>
          renderSchemaFields({
            schema: props.schema,
            model: props.model,
            includeProp: true,
            onUpdateField: emitField,
          }),
      )
  },
})
</script>
```

- [ ] **Step 5: Add `FecQueryForm.vue`**

Create `packages/el-comps/src/components/FecQueryForm.vue` using `FecForm` plus an actions form item. It must render `FeButton` buttons with defaults `查询` and `重置`, emit `submit`, `reset`, and pass through `update:model`.

- [ ] **Step 6: Export form components**

In `packages/el-comps/src/index.ts`, import and export `FecForm` and `FecQueryForm`. Add generic constructor facades for both so explicit model generics are preserved in JSX:

```ts
export const FecForm = FecFormImpl as unknown as new <T extends object>() => {
  $props: FecFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:model'?: (...args: any[]) => void
  }
}
```

Do the same for `FecQueryForm`.

- [ ] **Step 7: Verify and commit**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecForm.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

Commit:

```bash
git add packages/el-comps/src/components/FecForm.vue packages/el-comps/src/components/FecQueryForm.vue packages/el-comps/src/components/types.ts packages/el-comps/src/index.ts packages/el-comps/__tests__/fecForm.spec.ts
git commit -m "feat: add el-comps schema form components"
```

---

### Task 3: Replace `FecTable` with a pure data table

**Files:**
- Replace: `packages/el-comps/src/components/FecTable.vue`
- Modify: `packages/el-comps/src/components/types.ts`
- Modify: `packages/el-comps/src/components/tableColumns.ts`
- Replace/update: `packages/el-comps/__tests__/fecTable.spec.ts`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Replace table runtime tests**

Rewrite `packages/el-comps/__tests__/fecTable.spec.ts` so it asserts the new contract:

- `FecTable` renders only table, optional toolbar, and optional pagination.
- It no longer accepts `form` or `formSchema`.
- It emits `update:currentPage` and `update:pageSize`.
- It emits `toolbar-action`.
- It renders row actions and emits `row-action`.
- It supports loading and selectable rows.

- [ ] **Step 2: Run table tests and verify failure**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecTable.spec.ts
```

Expected: FAIL because current `FecTable` still requires `form` and `formSchema`.

- [ ] **Step 3: Update public table types**

In `packages/el-comps/src/components/types.ts`, replace `FecTableProps<T>` with:

```ts
export interface FecTableProps<Row extends object> {
  columns: FecTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: FecPagination
  rowActions?: FecRowAction<Row>[]
  toolbarActions?: FecActionItem[]
  selectable?: boolean
}
```

Import `FecActionItem` and `FecRowAction` from `./actionTypes`.

- [ ] **Step 4: Replace `FecTable.vue`**

Implement `FecTable` as:

```text
optional FecToolbar
withDirectives(FeTable, vFeLoading)
optional FePagination
```

Rules:

- Render a selection column when `selectable` is true.
- Render normal columns with `renderTableColumns(props.columns)`.
- Render a final action column when `rowActions` has visible actions.
- Emit `toolbar-action` with `(key, action)`.
- Emit `row-action` with `(key, row, index, action)`.
- Emit pagination updates without mutating refs internally.

- [ ] **Step 5: Verify and commit**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecTable.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

Commit:

```bash
git add packages/el-comps/src/components/FecTable.vue packages/el-comps/src/components/types.ts packages/el-comps/src/components/tableColumns.ts packages/el-comps/src/index.ts packages/el-comps/__tests__/fecTable.spec.ts
git commit -m "refactor: replace fec table with data table contract"
```

---

### Task 4: Add detail, dialog form, and drawer form

**Files:**
- Create: `packages/el-comps/src/components/FecDetail.vue`
- Create: `packages/el-comps/src/components/FecDialogForm.vue`
- Create: `packages/el-comps/src/components/FecDrawerForm.vue`
- Modify: `packages/el-comps/src/components/types.ts`
- Create: `packages/el-comps/__tests__/fecFlow.spec.ts`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Add flow component tests**

Create `packages/el-comps/__tests__/fecFlow.spec.ts` with tests for:

- `FecDetail` renders label/value pairs and formatter output.
- `FecDetail` renders empty text for nullish or empty values.
- `FecDialogForm` renders dialog title and form fields.
- `FecDialogForm` emits `update:model`, `confirm`, `cancel`, and `update:modelValue`.
- `FecDrawerForm` mirrors the same controlled behavior.

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecFlow.spec.ts
```

Expected: FAIL because the flow components are not exported yet.

- [ ] **Step 3: Add detail and form overlay types**

Add to `types.ts`:

```ts
export interface FecDetailSchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  formatter?: (value: T[Extract<keyof T, string>], record: T) => unknown
}

export interface FecDetailProps<T extends object> {
  record: T
  schema: FecDetailSchemaItem<T>[]
  columns?: 1 | 2 | 3 | 4
  emptyText?: string
}

export interface FecDialogFormProps<T extends object> extends FecFormProps<T> {
  modelValue: boolean
  title?: string
  confirmText?: string
  cancelText?: string
}

export interface FecDrawerFormProps<T extends object> extends FecFormProps<T> {
  modelValue: boolean
  title?: string
  confirmText?: string
  cancelText?: string
}
```

- [ ] **Step 4: Add the three components**

Implement:

- `FecDetail.vue` with class `fe-comps-detail`.
- `FecDialogForm.vue` using `FeDialog`, `FecForm`, and footer buttons.
- `FecDrawerForm.vue` using `FeDrawer`, `FecForm`, and footer buttons.

Both overlay form components must be controlled and emit `update:modelValue`
instead of closing themselves silently.

- [ ] **Step 5: Export components and verify**

Import/export `FecDetail`, `FecDialogForm`, and `FecDrawerForm` from
`packages/el-comps/src/index.ts` with generic constructor facades for the three
components.

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecFlow.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

Commit:

```bash
git add packages/el-comps/src/components/FecDetail.vue packages/el-comps/src/components/FecDialogForm.vue packages/el-comps/src/components/FecDrawerForm.vue packages/el-comps/src/components/types.ts packages/el-comps/src/index.ts packages/el-comps/__tests__/fecFlow.spec.ts
git commit -m "feat: add el-comps CRUD flow components"
```

---

### Task 5: Replace `FecQueryTable` with composed CRUD list surface

**Files:**
- Replace: `packages/el-comps/src/components/FecQueryTable.vue`
- Modify: `packages/el-comps/src/components/types.ts`
- Replace/update: `packages/el-comps/__tests__/fecQueryTable.spec.ts`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Replace query table tests**

Rewrite `packages/el-comps/__tests__/fecQueryTable.spec.ts` to verify:

- It renders `FecQueryForm`, `FecToolbar`, and `FecTable` classes.
- It emits `update:query`, `submit`, and `reset`.
- It forwards pagination update events.
- It forwards toolbar and row action events.
- It supports `loading`, `selectable`, and `rowActions`.

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecQueryTable.spec.ts
```

Expected: FAIL because the current implementation still owns the old query/table structure.

- [ ] **Step 3: Update `FecQueryTableProps`**

Replace `FecQueryTableProps<Row, Query>` with:

```ts
export interface FecQueryTableProps<Row extends object, Query extends FecQueryModel> {
  query: Query
  querySchema: FecQuerySchemaItem<Query>[]
  queryRules?: QueryFormRules<Query>
  columns: FecQueryTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: FecPagination
  toolbarActions?: FecActionItem[]
  rowActions?: FecRowAction<Row>[]
  selectable?: boolean
  submitText?: string
  resetText?: string
}
```

- [ ] **Step 4: Replace `FecQueryTable.vue`**

Implement it as a composition of:

```text
FecQueryForm
FecTable
```

Forward events:

- `update:model` from `FecQueryForm` -> `update:query`
- `submit` -> `submit`
- `reset` -> `reset`
- `update:currentPage` -> `update:currentPage`
- `update:pageSize` -> `update:pageSize`
- `toolbar-action` -> `toolbar-action`
- `row-action` -> `row-action`
- `selection-change` -> `selection-change`

- [ ] **Step 5: Verify and commit**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecQueryTable.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

Commit:

```bash
git add packages/el-comps/src/components/FecQueryTable.vue packages/el-comps/src/components/types.ts packages/el-comps/src/index.ts packages/el-comps/__tests__/fecQueryTable.spec.ts
git commit -m "refactor: compose fec query table from CRUD primitives"
```

---

### Task 6: Consumer type coverage and playground CRUD page

**Files:**
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`
- Modify: `playground/src/App.vue`
- Create: `playground/src/views/CrudPage.vue`
- Modify: `playground/__tests__/integration.spec.ts`
- Modify: `docs/consumer-setup.md`

- [ ] **Step 1: Expand consumer-dist type coverage**

Update `packages/el-comps/__tests__/consumer-dist.typecheck.tsx` to import and use:

```ts
FecPage
FecSection
FecStack
FecToolbar
FecForm
FecQueryForm
FecTable
FecQueryTable
FecDetail
FecDialogForm
FecDrawerForm
```

Add type assertions through valid JSX usage and invalid schema/column examples.

- [ ] **Step 2: Run consumer check and verify failure if declarations are incomplete**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: PASS if all exports and declarations are complete. If it fails, fix the relevant export/type declaration before continuing.

- [ ] **Step 3: Add playground CRUD page**

Create `playground/src/views/CrudPage.vue` with in-memory user data and the full CRUD flow:

- `FecPage`
- `FecSection`
- `FecQueryTable`
- create toolbar action
- edit/detail row actions
- `FecDialogForm` for create/edit
- `FecDetail` for detail display

Use only local refs and arrays. Do not add remote fetch logic.

- [ ] **Step 4: Wire playground entry**

Update `playground/src/App.vue` so the CRUD page is reachable from the default playground UI. Keep existing routes/pages working.

- [ ] **Step 5: Update integration test**

Update `playground/__tests__/integration.spec.ts` to assert the CRUD page renders:

- page title;
- query form;
- table;
- create action;
- edit/detail actions.

- [ ] **Step 6: Update docs**

In `docs/consumer-setup.md`, replace the near-term expansion note with a summary that the CRUD wave now includes layout, schema forms, data table, dialog/drawer form, and simple detail display.

- [ ] **Step 7: Verify and commit**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm exec vitest run packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm -C playground build
```

Expected: PASS.

Commit:

```bash
git add packages/el-comps/__tests__/consumer-dist.typecheck.tsx playground/src/App.vue playground/src/views/CrudPage.vue playground/__tests__/integration.spec.ts docs/consumer-setup.md
git commit -m "test: cover el-comps CRUD wave in consumers and playground"
```

---

### Task 7: Final verification

**Files:**
- Verify: repository root

- [ ] **Step 1: Run focused verification**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm --filter @fizz/el-comps build
pnpm check:packages
```

Expected: all commands PASS.

- [ ] **Step 2: Run the repository release path**

Run:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

Expected: all commands PASS.

- [ ] **Step 3: Confirm worktree state**

Run:

```bash
git status --short
```

Expected: no uncommitted source, test, or doc changes. Ignored build output may exist but should not appear.

- [ ] **Step 4: Report completion**

Report:

```text
Implemented el-comps admin CRUD wave.
Verified with:
- pnpm exec vitest run packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
- pnpm --filter @fizz/el-comps typecheck
- pnpm --filter @fizz/el-comps typecheck:consumer
- pnpm --filter @fizz/el-comps build
- pnpm check:packages
- pnpm lint
- pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
- pnpm --filter @fizz/el-plus check:coverage
- pnpm typecheck
- pnpm build
- pnpm -C playground build
```
