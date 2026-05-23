# el-comps SFC Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `FecTable` and `FecQueryTable` to SFC entry points, move their shared rendering logic into private helpers, and keep the public `@fizz/el-comps` API source-compatible.

**Architecture:** Put public prop/schema/pagination types in a normal TypeScript file so declaration generation does not depend on named exports from `.vue` files. Keep `controls.ts` as the control resolver, add private render helpers for schema fields and table columns, and keep pagination behavior inside each owner component because their contracts differ.

**Tech Stack:** Vue 3 SFCs, Element Plus through `@fizz/el-plus`, TypeScript, Vite, vite-plugin-dts, Vitest, vue-tsc, pnpm workspace.

---

## File Structure

- Create: `packages/el-comps/src/components/types.ts`
  - Own public `FecTable` / `FecQueryTable` prop, schema, pagination, and column types.
- Create: `packages/el-comps/src/components/schemaFields.ts`
  - Private render helper for schema-driven `FeFormItem` controls.
- Create: `packages/el-comps/src/components/tableColumns.ts`
  - Private render helper for `FeTableColumn` nodes.
- Create: `packages/el-comps/src/components/FecTable.vue`
  - SFC implementation of `FecTable`.
- Create: `packages/el-comps/src/components/FecQueryTable.vue`
  - SFC implementation of `FecQueryTable`.
- Modify: `packages/el-comps/src/index.ts`
  - Export SFC components and public types from `types.ts`.
- Modify: `packages/el-comps/__tests__/fecTable.spec.ts`
  - Add migration regression tests for writable pagination and supported column props.
- Modify: `packages/el-comps/__tests__/fecQueryTable.spec.ts`
  - Add migration regression tests for pagination events.
- Delete: `packages/el-comps/src/components/FecTable.tsx`
  - Replaced by `FecTable.vue`.
- Delete: `packages/el-comps/src/components/FecQueryTable.tsx`
  - Replaced by `FecQueryTable.vue`.

---

### Task 1: Add Migration Regression Tests

**Files:**

- Modify: `packages/el-comps/__tests__/fecTable.spec.ts`
- Modify: `packages/el-comps/__tests__/fecQueryTable.spec.ts`

- [ ] **Step 1: Add FecTable writable pagination and column prop tests**

In `packages/el-comps/__tests__/fecTable.spec.ts`, add these tests inside `describe('fecTable', () => { ... })`:

```ts
  it('updates writable current page refs from pagination events', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const currentPage = ref(1)

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          form: { name: '' },
          formSchema: [{ prop: 'name', label: '姓名', component: 'input' }],
          columns: [{ prop: 'name', label: '姓名' }],
          data: ref([
            { name: 'Tom', age: 18 },
            { name: 'Jerry', age: 20 },
            { name: 'Ann', age: 22 },
          ]),
          pagination: {
            currentPage,
            total: ref(30),
            pageSize: ref(10),
          },
        }),
    })

    app.mount(host)
    await nextTick()

    const nextButton = host.querySelector('.btn-next') as HTMLButtonElement
    nextButton.click()
    await nextTick()

    expect(currentPage.value).toBe(2)

    app.unmount()
    host.remove()
  })

  it('forwards supported table column props', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FecTable<User>, {
          form: { name: '' },
          formSchema: [{ prop: 'name', label: '姓名', component: 'input' }],
          columns: [
            { prop: 'name', label: '姓名', width: 160, minWidth: 120, align: 'center' },
          ],
          data: ref([{ name: 'Tom', age: 18 }]),
          pagination: {
            currentPage: ref(1),
            total: ref(1),
            pageSize: ref(10),
          },
        }),
    })

    app.mount(host)
    await nextTick()

    expect(host.textContent).toContain('姓名')
    expect(host.querySelector('.is-center')).toBeTruthy()

    app.unmount()
    host.remove()
  })
```

- [ ] **Step 2: Add FecQueryTable pagination event test**

In `packages/el-comps/__tests__/fecQueryTable.spec.ts`, add this test inside `describe('fecQueryTable', () => { ... })`:

```ts
  it('emits current page updates from pagination events', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const currentPageUpdates: number[] = []

    const app = createApp({
      render: () =>
        h(FecQueryTable<User, Query>, {
          'query': { keyword: '' },
          'querySchema': [{ prop: 'keyword', label: '关键词', component: 'input' }],
          'columns': [{ prop: 'name', label: '姓名' }],
          'data': ref([
            { name: 'Tom', age: 18 },
            { name: 'Jerry', age: 20 },
            { name: 'Ann', age: 22 },
          ]),
          'pagination': {
            currentPage: ref(1),
            pageSize: ref(10),
            total: ref(30),
          },
          'onUpdate:currentPage': (page: number) => {
            currentPageUpdates.push(page)
          },
        }),
    })

    app.mount(host)
    await nextTick()

    const nextButton = host.querySelector('.btn-next') as HTMLButtonElement
    nextButton.click()
    await nextTick()

    expect(currentPageUpdates.at(-1)).toBe(2)

    app.unmount()
    host.remove()
  })
```

- [ ] **Step 3: Run focused tests and verify the current baseline**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__
```

Expected before implementation: `forwards supported table column props` fails because `FecTable.tsx` currently forwards only `prop` and `label`. The other tests pass and become migration guards.

- [ ] **Step 4: Commit tests**

```bash
git add packages/el-comps/__tests__/fecTable.spec.ts packages/el-comps/__tests__/fecQueryTable.spec.ts
git commit -m "test: cover el-comps sfc migration behavior"
```

---

### Task 2: Extract Public Types and Private Render Helpers

**Files:**

- Create: `packages/el-comps/src/components/types.ts`
- Create: `packages/el-comps/src/components/schemaFields.ts`
- Create: `packages/el-comps/src/components/tableColumns.ts`

- [ ] **Step 1: Create shared public component types**

Create `packages/el-comps/src/components/types.ts`:

```ts
import type { QueryFormRules, TableColumn } from '@fizz/el-kit'
import type { MaybeRefOrGetter } from 'vue'
import type { FecControl } from './controls'

export type FecFormModel = Record<string, unknown>
export type FecQueryModel = Record<string, unknown>

export interface FecFormSchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  component: FecControl
}

export interface FecQuerySchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  component: FecControl
}

export type FecTableColumn<T extends object> = TableColumn<T>
export type FecQueryTableColumn<T extends object> = TableColumn<T>

export interface FecPagination {
  currentPage: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
}

export interface FecQueryPagination {
  currentPage: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
}

export interface FecTableProps<T extends object> {
  form: FecFormModel
  formSchema: FecFormSchemaItem<T>[]
  columns: FecTableColumn<T>[]
  data: MaybeRefOrGetter<T[]>
  pagination: FecPagination
}

export interface FecQueryTableProps<Row extends object, Query extends FecQueryModel> {
  query: Query
  querySchema: FecQuerySchemaItem<Query>[]
  rules?: QueryFormRules<Query>
  columns: FecQueryTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination: FecQueryPagination
  submitText?: string
  resetText?: string
}
```

- [ ] **Step 2: Create schema field render helper**

Create `packages/el-comps/src/components/schemaFields.ts`:

```ts
import type { VNodeChild } from 'vue'
import type { FecControl } from './controls'
import { FeFormItem } from '@fizz/el-plus'
import { h } from 'vue'
import { resolveFecControl } from './controls'

export interface FecSchemaFieldItem {
  prop: string
  label: string
  component: FecControl
}

export interface RenderSchemaFieldsOptions {
  schema: FecSchemaFieldItem[]
  model: Record<string, unknown>
  includeProp?: boolean
  onUpdateField: (prop: string, value: unknown) => void
}

export function renderSchemaFields(options: RenderSchemaFieldsOptions): VNodeChild[] {
  return options.schema.map((item, index) => {
    const resolvedControl = resolveFecControl(item.component)
    const FormControl = resolvedControl.component
    const formItemProps = options.includeProp
      ? { label: item.label, prop: item.prop }
      : { label: item.label }

    return h(
      FeFormItem,
      {
        key: `${item.prop}-${index}`,
        ...formItemProps,
      },
      () =>
        h(FormControl, {
          ...resolvedControl.props,
          'modelValue': options.model[item.prop],
          'onUpdate:modelValue': (value: unknown) => {
            options.onUpdateField(item.prop, value)
          },
        }),
    )
  })
}
```

- [ ] **Step 3: Create table column render helper**

Create `packages/el-comps/src/components/tableColumns.ts`:

```ts
import type { TableColumn } from '@fizz/el-kit'
import type { VNodeChild } from 'vue'
import { FeTableColumn } from '@fizz/el-plus'
import { h } from 'vue'

export function renderTableColumns<T extends object>(columns: TableColumn<T>[]): VNodeChild[] {
  return columns.map(column =>
    h(FeTableColumn, {
      key: column.prop,
      align: column.align,
      label: column.label,
      minWidth: column.minWidth,
      prop: column.prop,
      width: column.width,
    }),
  )
}
```

- [ ] **Step 4: Run typecheck for helper files**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit helpers**

```bash
git add packages/el-comps/src/components/types.ts packages/el-comps/src/components/schemaFields.ts packages/el-comps/src/components/tableColumns.ts
git commit -m "refactor: extract el-comps shared render helpers"
```

---

### Task 3: Migrate FecTable to SFC

**Files:**

- Create: `packages/el-comps/src/components/FecTable.vue`
- Modify: `packages/el-comps/src/index.ts`
- Delete: `packages/el-comps/src/components/FecTable.tsx`

- [ ] **Step 1: Create FecTable SFC**

Create `packages/el-comps/src/components/FecTable.vue`:

```vue
<script lang="ts">
import type { MaybeRefOrGetter, PropType, Ref } from 'vue'
import type {
  FecFormModel,
  FecFormSchemaItem,
  FecPagination,
  FecTableColumn,
} from './types'
import {
  FeForm,
  FePagination,
  FeTable,
} from '@fizz/el-plus'
import { defineComponent, h, isRef, toValue } from 'vue'
import { renderSchemaFields } from './schemaFields'
import { renderTableColumns } from './tableColumns'

export default defineComponent({
  name: 'FecTable',
  props: {
    form: {
      type: Object as PropType<FecFormModel>,
      required: true,
    },
    formSchema: {
      type: Array as PropType<FecFormSchemaItem<Record<string, unknown>>[]>,
      required: true,
    },
    columns: {
      type: Array as PropType<FecTableColumn<object>[]>,
      required: true,
    },
    data: {
      type: [Array, Object, Function] as PropType<MaybeRefOrGetter<object[]>>,
      required: true,
    },
    pagination: {
      type: Object as PropType<FecPagination>,
      required: true,
    },
  },
  emits: ['update:form'],
  setup(props, { emit }) {
    function emitFormField(prop: string, value: unknown) {
      emit('update:form', {
        ...props.form,
        [prop]: value,
      })
    }

    function updateCurrentPage(page: number) {
      if (isRef(props.pagination.currentPage)) {
        const currentPage = props.pagination.currentPage as Ref<number>
        currentPage.value = page
      }
    }

    return () =>
      h('div', { class: 'fe-comps-table-wrap' }, [
        h(
          FeForm,
          {
            class: 'fe-comps-form',
            inline: true,
            model: props.form,
          },
          () =>
            renderSchemaFields({
              schema: props.formSchema,
              model: props.form,
              onUpdateField: emitFormField,
            }),
        ),
        h(
          FeTable,
          {
            class: 'fe-comps-table',
            data: toValue(props.data),
          },
          () => renderTableColumns(props.columns),
        ),
        h(FePagination, {
          class: 'fe-comps-pagination',
          currentPage: toValue(props.pagination.currentPage),
          total: toValue(props.pagination.total),
          pageSize: toValue(props.pagination.pageSize),
          'onUpdate:currentPage': updateCurrentPage,
        }),
      ])
  },
})
</script>
```

- [ ] **Step 2: Update package entry for FecTable**

In `packages/el-comps/src/index.ts`, replace the old `FecTable` exports with SFC and type exports:

```ts
export { default as FecTable } from './components/FecTable.vue'
export type { FecFormSchemaItem, FecPagination, FecTableProps } from './components/types'
```

Do not export `schemaFields.ts` or `tableColumns.ts`.

- [ ] **Step 3: Delete old FecTable TSX file**

Delete:

```text
packages/el-comps/src/components/FecTable.tsx
```

- [ ] **Step 4: Run focused FecTable tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecTable.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Run el-comps typecheck**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit FecTable migration**

```bash
git add packages/el-comps/src/components/FecTable.vue packages/el-comps/src/components/FecTable.tsx packages/el-comps/src/index.ts
git commit -m "refactor: migrate FecTable to sfc"
```

---

### Task 4: Migrate FecQueryTable to SFC

**Files:**

- Create: `packages/el-comps/src/components/FecQueryTable.vue`
- Modify: `packages/el-comps/src/index.ts`
- Delete: `packages/el-comps/src/components/FecQueryTable.tsx`

- [ ] **Step 1: Create FecQueryTable SFC**

Create `packages/el-comps/src/components/FecQueryTable.vue`:

```vue
<script lang="ts">
import type { QueryFormRules } from '@fizz/el-kit'
import type { MaybeRefOrGetter, PropType } from 'vue'
import type {
  FecQueryModel,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableColumn,
} from './types'
import {
  FeButton,
  FeForm,
  FeFormItem,
  FePagination,
  FeTable,
  vFeLoading,
} from '@fizz/el-plus'
import { defineComponent, h, toValue, withDirectives } from 'vue'
import { renderSchemaFields } from './schemaFields'
import { renderTableColumns } from './tableColumns'

export default defineComponent({
  name: 'FecQueryTable',
  props: {
    query: {
      type: Object as PropType<FecQueryModel>,
      required: true,
    },
    querySchema: {
      type: Array as PropType<FecQuerySchemaItem<Record<string, unknown>>[]>,
      required: true,
    },
    rules: {
      type: Object as PropType<QueryFormRules<FecQueryModel>>,
      default: () => ({}),
    },
    columns: {
      type: Array as PropType<FecQueryTableColumn<object>[]>,
      required: true,
    },
    data: {
      type: [Array, Object, Function] as PropType<MaybeRefOrGetter<object[]>>,
      required: true,
    },
    loading: {
      type: [Boolean, Object, Function] as PropType<MaybeRefOrGetter<boolean>>,
      default: false,
    },
    pagination: {
      type: Object as PropType<FecQueryPagination>,
      required: true,
    },
    submitText: {
      type: String,
      default: '查询',
    },
    resetText: {
      type: String,
      default: '重置',
    },
  },
  emits: [
    'reset',
    'submit',
    'update:currentPage',
    'update:pageSize',
    'update:query',
  ],
  setup(props, { emit }) {
    function emitQueryField(prop: string, value: unknown) {
      emit('update:query', {
        ...props.query,
        [prop]: value,
      })
    }

    return () =>
      h('div', { class: 'fe-comps-query-table' }, [
        h(
          FeForm,
          {
            class: 'fe-comps-query-form',
            inline: true,
            model: props.query,
            rules: props.rules,
          },
          () => [
            ...renderSchemaFields({
              schema: props.querySchema,
              model: props.query,
              includeProp: true,
              onUpdateField: emitQueryField,
            }),
            h(
              FeFormItem,
              { class: 'fe-comps-query-actions' },
              () => [
                h(
                  FeButton,
                  {
                    type: 'primary',
                    onClick: () => emit('submit'),
                  },
                  () => props.submitText,
                ),
                h(
                  FeButton,
                  {
                    onClick: () => emit('reset'),
                  },
                  () => props.resetText,
                ),
              ],
            ),
          ],
        ),
        withDirectives(
          h(
            FeTable,
            {
              class: 'fe-comps-table',
              data: toValue(props.data),
            },
            () => renderTableColumns(props.columns),
          ),
          [[vFeLoading, toValue(props.loading)]],
        ),
        h(FePagination, {
          class: 'fe-comps-pagination',
          currentPage: toValue(props.pagination.currentPage),
          pageSize: toValue(props.pagination.pageSize),
          total: toValue(props.pagination.total),
          'onUpdate:currentPage': (page: number) => emit('update:currentPage', page),
          'onUpdate:pageSize': (pageSize: number) => emit('update:pageSize', pageSize),
        }),
      ])
  },
})
</script>
```

- [ ] **Step 2: Update package entry for FecQueryTable and centralized types**

In `packages/el-comps/src/index.ts`, make the component and type export block look like this:

```ts
export type {
  FecBuiltinControlName,
  FecControl,
  FecCustomControl,
  FecLegacyControlName,
} from './components/controls'
export { default as FecQueryTable } from './components/FecQueryTable.vue'
export { default as FecTable } from './components/FecTable.vue'
export type {
  FecFormSchemaItem,
  FecPagination,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableProps,
  FecTableProps,
} from './components/types'
```

- [ ] **Step 3: Delete old FecQueryTable TSX file**

Delete:

```text
packages/el-comps/src/components/FecQueryTable.tsx
```

- [ ] **Step 4: Run focused FecQueryTable tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecQueryTable.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Run el-comps typecheck**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit FecQueryTable migration**

```bash
git add packages/el-comps/src/components/FecQueryTable.vue packages/el-comps/src/components/FecQueryTable.tsx packages/el-comps/src/index.ts
git commit -m "refactor: migrate FecQueryTable to sfc"
```

---

### Task 5: Build and Declaration Verification

**Files:**

- Verify: `packages/el-comps/dist/index.d.ts`
- Verify: `packages/el-comps/dist/index.mjs`

- [ ] **Step 1: Run full el-comps focused verification**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps build
```

Expected: all commands PASS.

- [ ] **Step 2: Inspect generated declarations for public exports**

Run:

```bash
rg "FecTable|FecQueryTable|FecTableProps|FecQueryTableProps|schemaFields|tableColumns" packages/el-comps/dist/index.d.ts
```

Expected:

```text
packages/el-comps/dist/index.d.ts
```

The output includes `FecTable`, `FecQueryTable`, `FecTableProps`, and
`FecQueryTableProps`. The output does not export `schemaFields` or
`tableColumns` from the package root.

- [ ] **Step 3: Verify package entry contains no TSX component imports**

Run:

```bash
rg "FecTable\\.tsx|FecQueryTable\\.tsx|./components/FecTable'|./components/FecQueryTable'" packages/el-comps/src packages/el-comps/dist
```

Expected: no matches.

- [ ] **Step 4: Commit source corrections from declaration verification**

When Steps 1-3 required source corrections, commit them:

```bash
git add packages/el-comps
git commit -m "chore: verify el-comps sfc declarations"
```

When Steps 1-3 required no source corrections, skip this commit step.

---

### Task 6: Repository Release Path

**Files:**

- Verify: repository root

- [ ] **Step 1: Run the repository release path**

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

- [ ] **Step 2: Check final git status**

Run:

```bash
git status --short
```

Expected: no uncommitted source changes. Build artifacts under ignored `dist/`
directories may be regenerated locally, but they should not appear in
`git status --short`.

- [ ] **Step 3: Report completion**

Report:

```text
Implemented el-comps SFC cleanup.
Verified with:
- pnpm exec vitest run packages/el-comps/__tests__
- pnpm --filter @fizz/el-comps typecheck
- pnpm --filter @fizz/el-comps build
- pnpm lint
- pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
- pnpm --filter @fizz/el-plus check:coverage
- pnpm typecheck
- pnpm build
- pnpm -C playground build
- pnpm check:packages
```
