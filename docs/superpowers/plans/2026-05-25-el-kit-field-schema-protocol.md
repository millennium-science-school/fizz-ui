# el-kit Field Schema Protocol Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move semantic field schema data into `@fizz/el-kit` and update `@fizz/el-comps` to render that protocol without preserving the old semantic `component` string API.

**Architecture:** `@fizz/el-kit` gets a Vue-free field schema type module with `kind` and synchronous `options`. `@fizz/el-comps` extends those schema items with render-only `fieldProps` and a custom Vue component branch. `renderSchemaFields()` resolves built-in `kind` values to `@fizz/el-plus` controls and renders `select` options with `FeOption`.

**Tech Stack:** TypeScript, Vue 3 render functions and SFCs, Element Plus through `@fizz/el-plus`, Vitest, vue-tsc, pnpm workspace scripts.

---

## File Structure

- Create: `packages/el-kit/src/types/field.ts`
  - Owns the headless field schema protocol: `FieldControlKind`, `FieldOption`, `FormSchemaItem`, and `QuerySchemaItem`.
- Modify: `packages/el-kit/src/index.ts`
  - Exports the new field schema types from `@fizz/el-kit`.
- Modify: `packages/el-kit/__tests__/consumer-dist.typecheck.ts`
  - Adds consumer-facing type coverage for the new schema protocol.
- Modify: `packages/el-comps/src/components/types.ts`
  - Replaces local semantic schema definitions with `@fizz/el-kit` schema types plus render-only custom component branches.
- Modify: `packages/el-comps/src/components/controls.ts`
  - Resolves `FieldControlKind` or a custom Vue `Component` to a render component and props. Removes legacy `ElInput` / `ElInputNumber` support.
- Modify: `packages/el-comps/src/components/schemaFields.ts`
  - Reads `kind`, `options`, `fieldProps`, and custom `component` schema items. Renders `FeOption` children for `select`.
- Modify: `packages/el-comps/src/index.ts`
  - Exports the new composite schema types and stops exporting removed legacy control types.
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`
  - Switches public examples to `kind`, adds rejected old `component: 'input'` coverage, and covers custom Vue components.
- Modify: `packages/el-comps/__tests__/fecTable.spec.ts`
  - Updates runtime examples to `kind`, covers `fieldProps`, custom component branch, and select option VNodes.
- Modify: `packages/el-comps/__tests__/fecQueryTable.spec.ts`
  - Updates runtime examples to `kind`, covers query select options and custom component branch.
- Modify: `docs/consumer-setup.md`
  - Documents that schema control data uses `kind` and custom Vue components are render-only `@fizz/el-comps` concerns.

---

### Task 1: Add the headless field schema protocol to `@fizz/el-kit`

**Files:**
- Create: `packages/el-kit/src/types/field.ts`
- Modify: `packages/el-kit/src/index.ts`
- Modify: `packages/el-kit/__tests__/consumer-dist.typecheck.ts`

- [ ] **Step 1: Add failing consumer type coverage for field schema**

In `packages/el-kit/__tests__/consumer-dist.typecheck.ts`, replace the opening type import with:

```ts
import type {
  FieldControlKind,
  FieldOption,
  FormSchemaItem,
  QueryFormRules,
  QuerySchemaItem,
  TableColumn,
  UseTableOptions,
} from '@fizz/el-kit'
```

Add this block after the `Query` interface:

```ts
type Status = 'enabled' | 'disabled'

const statusOptions: FieldOption<Status>[] = [
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]

const fieldKind: FieldControlKind = 'select'

const formSchema: FormSchemaItem<User>[] = [
  { prop: 'name', label: '姓名', kind: 'input' },
  { prop: 'age', label: '年龄', kind: 'number' },
]

const querySchema: QuerySchemaItem<Query>[] = [
  { prop: 'keyword', label: '关键词', kind: 'input' },
  { prop: 'enabled', label: '状态', kind: fieldKind, options: statusOptions },
]

const invalidFormSchema: FormSchemaItem<User>[] = [
  {
    label: '缺失',
    kind: 'input',
    // @ts-expect-error form schema prop should be keyed to the form model
    prop: 'missing',
  },
]

const invalidControlKind: FormSchemaItem<User>[] = [
  {
    prop: 'name',
    label: '错误控件',
    // @ts-expect-error semantic controls should use FieldControlKind
    kind: 'ElInput',
  },
]
```

Add these void markers near the bottom with the other `void` statements:

```ts
void formSchema
void querySchema
void invalidFormSchema
void invalidControlKind
void statusOptions
```

- [ ] **Step 2: Run the consumer check and verify it fails**

Run:

```bash
pnpm --filter @fizz/el-kit typecheck:consumer
```

Expected: FAIL because `FieldControlKind`, `FieldOption`, `FormSchemaItem`, and `QuerySchemaItem` are not exported yet.

- [ ] **Step 3: Create `packages/el-kit/src/types/field.ts`**

```ts
export type FieldControlKind =
  | 'input'
  | 'number'
  | 'select'
  | 'date'
  | 'switch'
  | 'textarea'

export interface FieldOption<Value = unknown> {
  label: string
  value: Value
  disabled?: boolean
}

export interface FormSchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  kind: FieldControlKind
  options?: FieldOption[]
}

export interface QuerySchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  kind: FieldControlKind
  options?: FieldOption[]
}
```

- [ ] **Step 4: Export the new types from `packages/el-kit/src/index.ts`**

Add this export block after the existing header comments and before composable exports:

```ts
export type {
  FieldControlKind,
  FieldOption,
  FormSchemaItem,
  QuerySchemaItem,
} from './types/field'
```

- [ ] **Step 5: Verify `@fizz/el-kit`**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__
pnpm --filter @fizz/el-kit typecheck
pnpm --filter @fizz/el-kit typecheck:consumer
```

Expected: all commands PASS.

- [ ] **Step 6: Commit the `el-kit` protocol**

```bash
git add packages/el-kit/src/types/field.ts packages/el-kit/src/index.ts packages/el-kit/__tests__/consumer-dist.typecheck.ts
git commit -m "feat: add el-kit field schema protocol"
```

---

### Task 2: Move `@fizz/el-comps` public schema types to `kind`

**Files:**
- Modify: `packages/el-comps/src/components/types.ts`
- Modify: `packages/el-comps/src/index.ts`
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`

- [ ] **Step 1: Update the consumer-dist test to the new schema API**

In `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`, add these imports:

```ts
import type { Component } from 'vue'
import type { FieldOption } from '@fizz/el-kit'
```

Keep the existing `ref` import from `vue` and define a typed custom component below the model interfaces:

```ts
declare const CustomControl: Component

const statusOptions: FieldOption<string>[] = [
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]
```

Replace `formSchema` with:

```ts
const formSchema: FecFormSchemaItem<User>[] = [
  { prop: 'name', label: '姓名', kind: 'input', fieldProps: { placeholder: '姓名' } },
  { prop: 'age', label: '年龄', kind: 'number' },
  { prop: 'name', label: '自定义', component: CustomControl, fieldProps: { placeholder: 'custom' } },
]
```

Replace `invalidFormSchema` with:

```ts
const invalidFormSchema: FecFormSchemaItem<User>[] = [
  {
    label: '缺失',
    kind: 'input',
    // @ts-expect-error form schema prop should be keyed to the row type
    prop: 'missing',
  },
]

const removedComponentStringSchema: FecFormSchemaItem<User>[] = [
  {
    prop: 'name',
    label: '旧写法',
    // @ts-expect-error semantic controls should use kind instead of component strings
    component: 'input',
  },
]
```

Replace `querySchema` with:

```ts
const querySchema: FecQuerySchemaItem<Query>[] = [
  { prop: 'keyword', label: '关键词', kind: 'select', options: statusOptions },
]
```

Replace `invalidQuerySchema` with:

```ts
const invalidQuerySchema: FecQuerySchemaItem<Query>[] = [
  {
    label: '缺失',
    kind: 'input',
    // @ts-expect-error query schema prop should be keyed to the query model
    prop: 'missing',
  },
]
```

In the invalid JSX examples, replace schema objects that use `component: 'input'` with `kind: 'input'`.

Add this void marker near the bottom:

```ts
void removedComponentStringSchema
```

- [ ] **Step 2: Run the consumer check and verify it fails**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: FAIL because `FecFormSchemaItem` and `FecQuerySchemaItem` still require `component: FecControl` and do not accept `kind` or `fieldProps`.

- [ ] **Step 3: Replace local schema type definitions**

Replace all of `packages/el-comps/src/components/types.ts` with:

```ts
import type {
  FormSchemaItem,
  QueryFormRules,
  QuerySchemaItem,
  TableColumn,
} from '@fizz/el-kit'
import type { Component, MaybeRefOrGetter } from 'vue'

export type FecFormModel = Record<string, unknown>
export type FecQueryModel = object

export interface FecRenderFieldConfig {
  fieldProps?: Record<string, unknown>
}

export type FecBuiltinFormSchemaItem<T extends object> =
  FormSchemaItem<T> & FecRenderFieldConfig

export type FecBuiltinQuerySchemaItem<T extends object> =
  QuerySchemaItem<T> & FecRenderFieldConfig

export interface FecCustomFormSchemaItem<T extends object> extends FecRenderFieldConfig {
  prop: Extract<keyof T, string>
  label: string
  component: Component
}

export interface FecCustomQuerySchemaItem<T extends object> extends FecRenderFieldConfig {
  prop: Extract<keyof T, string>
  label: string
  component: Component
}

export type FecFormSchemaItem<T extends object> =
  | FecBuiltinFormSchemaItem<T>
  | FecCustomFormSchemaItem<T>

export type FecQuerySchemaItem<T extends object> =
  | FecBuiltinQuerySchemaItem<T>
  | FecCustomQuerySchemaItem<T>

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

- [ ] **Step 4: Update root exports for removed legacy controls**

In `packages/el-comps/src/index.ts`, delete this export block:

```ts
export type {
  FecBuiltinControlName,
  FecControl,
  FecCustomControl,
  FecLegacyControlName,
} from './components/controls'
```

Replace the final type export block with:

```ts
export type {
  FecBuiltinFormSchemaItem,
  FecBuiltinQuerySchemaItem,
  FecCustomFormSchemaItem,
  FecCustomQuerySchemaItem,
  FecFormSchemaItem,
  FecPagination,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableProps,
  FecRenderFieldConfig,
  FecTableProps,
} from './components/types'
```

- [ ] **Step 5: Verify the public type migration**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: FAIL may remain because runtime files still pass schema items to `renderSchemaFields()` whose local `FecSchemaFieldItem` still requires `component`. Type errors should now point at `schemaFields.ts`, `FecTable.vue`, or `FecQueryTable.vue`, not at the public consumer schema declarations.

- [ ] **Step 6: Leave these changes uncommitted until runtime migration**

```bash
git status --short
```

Expected: modified `packages/el-comps/src/components/types.ts`, `packages/el-comps/src/index.ts`, and `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`.

---

### Task 3: Update `@fizz/el-comps` field resolution and select option rendering

**Files:**
- Modify: `packages/el-comps/src/components/controls.ts`
- Modify: `packages/el-comps/src/components/schemaFields.ts`
- Modify: `packages/el-comps/__tests__/fecTable.spec.ts`
- Modify: `packages/el-comps/__tests__/fecQueryTable.spec.ts`

- [ ] **Step 1: Add direct VNode coverage for select options**

Create `packages/el-comps/__tests__/schemaFields.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { renderSchemaFields } from '../src/components/schemaFields'

describe('schemaFields', () => {
  it('renders select options from headless field metadata', () => {
    const fields = renderSchemaFields({
      schema: [
        {
          prop: 'status',
          label: '状态',
          kind: 'select',
          options: [
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled', disabled: true },
          ],
        },
      ],
      model: { status: 'enabled' },
      onUpdateField: () => {},
    })

    const formItem = fields[0] as VNode
    const renderControl = formItem.children as () => VNode
    const control = renderControl()
    const renderOptions = control.children as () => VNode[]
    const options = renderOptions()

    expect(options.map(option => option.props?.label)).toEqual(['Enabled', 'Disabled'])
    expect(options.map(option => option.props?.value)).toEqual(['enabled', 'disabled'])
    expect(options[1]?.props?.disabled).toBe(true)
  })
})
```

- [ ] **Step 2: Run the new focused test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/schemaFields.spec.ts
```

Expected: FAIL because `renderSchemaFields()` still expects `component` and does not render option children.

- [ ] **Step 3: Replace `packages/el-comps/src/components/controls.ts`**

```ts
import type { FieldControlKind } from '@fizz/el-kit'
import type { Component } from 'vue'
import {
  FeDatePicker,
  FeInput,
  FeInputNumber,
  FeSelect,
  FeSwitch,
} from '@fizz/el-plus'

export type FecControl = FieldControlKind | Component

export interface FecResolvedControl {
  component: Component
  props: Record<string, unknown>
}

export function resolveFecControl(control: FecControl): FecResolvedControl {
  if (typeof control !== 'string') {
    return {
      component: control,
      props: {},
    }
  }

  if (control === 'number') {
    return {
      component: FeInputNumber,
      props: {},
    }
  }

  if (control === 'select') {
    return {
      component: FeSelect,
      props: {},
    }
  }

  if (control === 'date') {
    return {
      component: FeDatePicker,
      props: { type: 'date' },
    }
  }

  if (control === 'switch') {
    return {
      component: FeSwitch,
      props: {},
    }
  }

  if (control === 'textarea') {
    return {
      component: FeInput,
      props: { type: 'textarea' },
    }
  }

  return {
    component: FeInput,
    props: {},
  }
}
```

- [ ] **Step 4: Replace `packages/el-comps/src/components/schemaFields.ts`**

```ts
import type { Component, VNodeChild } from 'vue'
import type { FieldControlKind, FieldOption } from '@fizz/el-kit'
import { FeFormItem, FeOption } from '@fizz/el-plus'
import { h } from 'vue'
import { resolveFecControl } from './controls'

export interface FecSchemaFieldBase {
  prop: string
  label: string
  fieldProps?: Record<string, unknown>
}

export interface FecBuiltinSchemaFieldItem extends FecSchemaFieldBase {
  kind: FieldControlKind
  options?: FieldOption[]
}

export interface FecCustomSchemaFieldItem extends FecSchemaFieldBase {
  component: Component
}

export type FecSchemaFieldItem =
  | FecBuiltinSchemaFieldItem
  | FecCustomSchemaFieldItem

export interface RenderSchemaFieldsOptions {
  schema: FecSchemaFieldItem[]
  model: Record<string, unknown>
  includeProp?: boolean
  onUpdateField: (prop: string, value: unknown) => void
}

function isCustomSchemaField(item: FecSchemaFieldItem): item is FecCustomSchemaFieldItem {
  return 'component' in item
}

function renderFieldOptions(item: FecSchemaFieldItem): VNodeChild[] | undefined {
  if (isCustomSchemaField(item) || item.kind !== 'select') {
    return undefined
  }

  return item.options?.map(option =>
    h(FeOption, {
      key: String(option.value),
      disabled: option.disabled,
      label: option.label,
      value: option.value,
    }),
  )
}

export function renderSchemaFields(options: RenderSchemaFieldsOptions): VNodeChild[] {
  return options.schema.map((item, index) => {
    const resolvedControl = resolveFecControl(isCustomSchemaField(item) ? item.component : item.kind)
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
        h(
          FormControl,
          {
            ...resolvedControl.props,
            ...item.fieldProps,
            'modelValue': options.model[item.prop],
            'onUpdate:modelValue': (value: unknown) => {
              options.onUpdateField(item.prop, value)
            },
          },
          () => renderFieldOptions(item),
        ),
    )
  })
}
```

- [ ] **Step 5: Update `fecTable` runtime tests to use `kind` and direct custom components**

In `packages/el-comps/__tests__/fecTable.spec.ts`, replace all built-in schema entries like:

```ts
{ prop: 'name', label: '姓名', component: 'ElInput' }
{ prop: 'name', label: '姓名', component: 'input' }
```

with:

```ts
{ prop: 'name', label: '姓名', kind: 'input' }
```

Replace the extended controls schema with:

```ts
formSchema: [
  { prop: 'name', label: '输入', kind: 'textarea' },
  { prop: 'enabled', label: '开关', kind: 'switch' },
],
```

Replace the custom control schema object with:

```ts
{
  prop: 'name',
  label: '自定义',
  component: CustomControl,
  fieldProps: { placeholder: 'custom-name' },
}
```

Add this test inside `describe('fecTable', () => {`:

```ts
  it('renders select options from field schema metadata', () => {
    const fields = renderSchemaFields({
      schema: [
        {
          prop: 'status',
          label: '状态',
          kind: 'select',
          options: [
            { label: '启用', value: 'enabled' },
            { label: '禁用', value: 'disabled', disabled: true },
          ],
        },
      ],
      model: { status: 'enabled' },
      onUpdateField: () => {},
    })

    expect(fields).toHaveLength(1)
  })
```

Also import `renderSchemaFields` at the top:

```ts
import { renderSchemaFields } from '../src/components/schemaFields'
```

- [ ] **Step 6: Update `fecQueryTable` runtime tests to use `kind` and direct custom components**

In `packages/el-comps/__tests__/fecQueryTable.spec.ts`, replace all built-in schema entries like:

```ts
{ prop: 'keyword', label: '关键词', component: 'ElInput' }
{ prop: 'keyword', label: '关键词', component: 'input' }
```

with:

```ts
{ prop: 'keyword', label: '关键词', kind: 'input' }
```

Replace the custom control schema object with:

```ts
{
  prop: 'keyword',
  label: '自定义',
  component: CustomControl,
  fieldProps: { placeholder: 'custom-keyword' },
}
```

Add a select schema item to the first query form test:

```ts
querySchema: [
  { prop: 'keyword', label: '关键词', kind: 'select', options: [{ label: 'Fizz', value: 'fizz' }] },
],
```

- [ ] **Step 7: Verify the composite runtime migration**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: all commands PASS.

- [ ] **Step 8: Commit the composite schema migration**

```bash
git add packages/el-comps/src/components/types.ts packages/el-comps/src/components/controls.ts packages/el-comps/src/components/schemaFields.ts packages/el-comps/src/index.ts packages/el-comps/__tests__/consumer-dist.typecheck.tsx packages/el-comps/__tests__/fecTable.spec.ts packages/el-comps/__tests__/fecQueryTable.spec.ts packages/el-comps/__tests__/schemaFields.spec.ts
git commit -m "refactor: move composite schemas to field kind protocol"
```

---

### Task 4: Document the schema boundary

**Files:**
- Modify: `docs/consumer-setup.md`
- Modify: `docs/el-kit-table-state.md`

- [ ] **Step 1: Update `docs/consumer-setup.md` near the component expansion note**

Replace the current near-term component expansion paragraph with:

```markdown
The next component expansion wave should prioritize common admin form/query controls that are already supported by `FieldControlKind` semantic names (`select`, `date`, `switch`, and `textarea`) before adding low-frequency widgets. Schema data should use `kind` for built-in controls. Custom Vue components are an `@fizz/el-comps` render escape hatch and should not be moved into `@fizz/el-kit`.
```

- [ ] **Step 2: Add schema protocol notes to `docs/el-kit-table-state.md`**

Append this section:

```markdown
## Field Schema Protocol

`@fizz/el-kit` owns the headless field schema protocol used by composite form and query surfaces. Built-in controls use `kind`, not `component`, so schema data stays free of Vue component references.

`FieldControlKind` covers the first common admin control set: `input`, `number`, `select`, `date`, `switch`, and `textarea`. `FieldOption[]` is synchronous metadata for select-like controls. Async loading, field placeholders, clearable behavior, and custom Vue components belong in `@fizz/el-comps` or application code until repeated use justifies promoting a field into the headless protocol.
```

- [ ] **Step 3: Verify docs references**

Run:

```bash
rg "FieldControlKind|component: 'input'|component: 'ElInput'|FecBuiltinControlName|FecLegacyControlName" docs/consumer-setup.md docs/el-kit-table-state.md packages/el-kit packages/el-comps -g '!**/dist/**'
```

Expected: matches show `FieldControlKind` docs/tests/types and no remaining old semantic `component: 'input'`, `component: 'ElInput'`, `FecBuiltinControlName`, or `FecLegacyControlName` references in active docs or package source.

- [ ] **Step 4: Commit docs**

```bash
git add docs/consumer-setup.md docs/el-kit-table-state.md
git commit -m "docs: document field schema boundary"
```

---

### Task 5: Final verification

**Files:**
- Verify: repository root

- [ ] **Step 1: Run focused verification**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__ packages/el-comps/__tests__
pnpm --filter @fizz/el-kit typecheck
pnpm --filter @fizz/el-kit typecheck:consumer
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
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

- [ ] **Step 3: Check final worktree state**

Run:

```bash
git status --short
```

Expected: no uncommitted source, test, or doc changes. Ignored build output may exist but should not appear in this command.

- [ ] **Step 4: Report completion**

Report:

```text
Implemented el-kit field schema protocol.
Verified with:
- pnpm exec vitest run packages/el-kit/__tests__ packages/el-comps/__tests__
- pnpm --filter @fizz/el-kit typecheck
- pnpm --filter @fizz/el-kit typecheck:consumer
- pnpm --filter @fizz/el-comps typecheck
- pnpm --filter @fizz/el-comps typecheck:consumer
- pnpm check:packages
- pnpm lint
- pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
- pnpm --filter @fizz/el-plus check:coverage
- pnpm typecheck
- pnpm build
- pnpm -C playground build
```
