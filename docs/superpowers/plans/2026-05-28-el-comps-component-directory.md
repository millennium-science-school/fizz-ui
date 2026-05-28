# el-comps Component Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `packages/el-comps/src/components` so every public component has a kebab-case directory with local props and export files, while preserving the existing root public API.

**Architecture:** This is a behavior-preserving mechanical refactor. Shared schema/action/render helpers move to `components/shared`, component-specific props move beside each component, component generic facades move from the package root into component-local `index.ts` files, and `packages/el-comps/src/index.ts` becomes a root aggregator. No package subpath exports are added.

**Tech Stack:** Vue 3 SFCs, TypeScript, Vite library build, vue-tsc, Vitest, pnpm workspace scripts.

---

## Scope Check

This plan covers only `@fizz/el-comps` component directory organization. It does not change `@fizz/el-kit`, `@fizz/el-plus`, runtime behavior, styles, package `exports`, or public component names.

## File Structure

- Create: `packages/el-comps/__tests__/componentStructure.spec.ts`
  - Structure regression test for the new component layout and root aggregator.
- Move: `packages/el-comps/src/components/actionTypes.ts` -> `packages/el-comps/src/components/shared/actionTypes.ts`
  - Shared action metadata for toolbar and row actions.
- Move: `packages/el-comps/src/components/controls.ts` -> `packages/el-comps/src/components/shared/controls.ts`
  - Built-in field control resolution.
- Move: `packages/el-comps/src/components/schemaFields.ts` -> `packages/el-comps/src/components/shared/schemaFields.ts`
  - Shared form/query schema rendering.
- Move: `packages/el-comps/src/components/types.ts` -> `packages/el-comps/src/components/shared/types.ts`
  - Cross-component schema protocol and helper exports.
- Move: `packages/el-comps/src/components/FecPage.vue` -> `packages/el-comps/src/components/fec-page/FecPage.vue`
- Create: `packages/el-comps/src/components/fec-page/index.ts`
- Create: `packages/el-comps/src/components/fec-page/props.ts`
- Move: `packages/el-comps/src/components/FecSection.vue` -> `packages/el-comps/src/components/fec-section/FecSection.vue`
- Create: `packages/el-comps/src/components/fec-section/index.ts`
- Create: `packages/el-comps/src/components/fec-section/props.ts`
- Move: `packages/el-comps/src/components/FecStack.vue` -> `packages/el-comps/src/components/fec-stack/FecStack.vue`
- Create: `packages/el-comps/src/components/fec-stack/index.ts`
- Create: `packages/el-comps/src/components/fec-stack/props.ts`
- Move: `packages/el-comps/src/components/FecToolbar.vue` -> `packages/el-comps/src/components/fec-toolbar/FecToolbar.vue`
- Create: `packages/el-comps/src/components/fec-toolbar/index.ts`
- Create: `packages/el-comps/src/components/fec-toolbar/props.ts`
- Move: `packages/el-comps/src/components/FecForm.vue` -> `packages/el-comps/src/components/fec-form/FecForm.vue`
- Create: `packages/el-comps/src/components/fec-form/index.ts`
- Create: `packages/el-comps/src/components/fec-form/props.ts`
- Move: `packages/el-comps/src/components/FecQueryForm.vue` -> `packages/el-comps/src/components/fec-query-form/FecQueryForm.vue`
- Create: `packages/el-comps/src/components/fec-query-form/index.ts`
- Create: `packages/el-comps/src/components/fec-query-form/props.ts`
- Move: `packages/el-comps/src/components/FecTable.vue` -> `packages/el-comps/src/components/fec-table/FecTable.vue`
- Move: `packages/el-comps/src/components/tableColumns.ts` -> `packages/el-comps/src/components/fec-table/tableColumns.ts`
- Create: `packages/el-comps/src/components/fec-table/index.ts`
- Create: `packages/el-comps/src/components/fec-table/props.ts`
- Move: `packages/el-comps/src/components/FecQueryTable.vue` -> `packages/el-comps/src/components/fec-query-table/FecQueryTable.vue`
- Create: `packages/el-comps/src/components/fec-query-table/index.ts`
- Create: `packages/el-comps/src/components/fec-query-table/props.ts`
- Move: `packages/el-comps/src/components/FecDialogForm.vue` -> `packages/el-comps/src/components/fec-dialog-form/FecDialogForm.vue`
- Create: `packages/el-comps/src/components/fec-dialog-form/index.ts`
- Create: `packages/el-comps/src/components/fec-dialog-form/props.ts`
- Move: `packages/el-comps/src/components/FecDrawerForm.vue` -> `packages/el-comps/src/components/fec-drawer-form/FecDrawerForm.vue`
- Create: `packages/el-comps/src/components/fec-drawer-form/index.ts`
- Create: `packages/el-comps/src/components/fec-drawer-form/props.ts`
- Move: `packages/el-comps/src/components/FecDetail.vue` -> `packages/el-comps/src/components/fec-detail/FecDetail.vue`
- Create: `packages/el-comps/src/components/fec-detail/index.ts`
- Create: `packages/el-comps/src/components/fec-detail/props.ts`
- Modify: `packages/el-comps/src/index.ts`
  - Replace direct `.vue` imports and root-level facades with component-directory re-exports.
- Modify: `packages/el-comps/__tests__/*`
  - Update any internal import paths only when needed. Consumer imports from `../src` should continue to work.

---

### Task 1: Add Structure Regression Test

**Files:**
- Create: `packages/el-comps/__tests__/componentStructure.spec.ts`

- [ ] **Step 1: Write the failing structure test**

Create `packages/el-comps/__tests__/componentStructure.spec.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '..')

function exists(path: string) {
  return existsSync(resolve(root, path))
}

describe('el-comps component directory structure', () => {
  it('keeps one kebab-case directory per public component', () => {
    const components = [
      'fec-form/FecForm.vue',
      'fec-query-form/FecQueryForm.vue',
      'fec-table/FecTable.vue',
      'fec-query-table/FecQueryTable.vue',
      'fec-dialog-form/FecDialogForm.vue',
      'fec-drawer-form/FecDrawerForm.vue',
      'fec-detail/FecDetail.vue',
      'fec-page/FecPage.vue',
      'fec-section/FecSection.vue',
      'fec-stack/FecStack.vue',
      'fec-toolbar/FecToolbar.vue',
    ]

    for (const component of components) {
      const dir = component.split('/')[0]
      expect(exists(`src/components/${component}`)).toBe(true)
      expect(exists(`src/components/${dir}/index.ts`)).toBe(true)
      expect(exists(`src/components/${dir}/props.ts`)).toBe(true)
    }
  })

  it('moves shared component helpers under components/shared', () => {
    expect(exists('src/components/shared/actionTypes.ts')).toBe(true)
    expect(exists('src/components/shared/controls.ts')).toBe(true)
    expect(exists('src/components/shared/schemaFields.ts')).toBe(true)
    expect(exists('src/components/shared/types.ts')).toBe(true)
  })

  it('keeps package root as an aggregator without direct vue imports', () => {
    const entry = readFileSync(resolve(root, 'src/index.ts'), 'utf8')

    expect(entry).not.toContain('.vue')
    expect(entry).toContain("export { FecForm } from './components/fec-form'")
    expect(entry).toContain("export { FecQueryTable } from './components/fec-query-table'")
    expect(entry).toContain("from './components/shared/types'")
  })
})
```

- [ ] **Step 2: Run the structure test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/componentStructure.spec.ts
```

Expected: FAIL because the component directories and shared directory do not exist yet.

- [ ] **Step 3: Commit the failing structure test**

Run:

```bash
git add packages/el-comps/__tests__/componentStructure.spec.ts
git commit -m "test: cover el-comps component directory structure"
```

---

### Task 2: Move Shared Helpers

**Files:**
- Move: `packages/el-comps/src/components/actionTypes.ts` -> `packages/el-comps/src/components/shared/actionTypes.ts`
- Move: `packages/el-comps/src/components/controls.ts` -> `packages/el-comps/src/components/shared/controls.ts`
- Move: `packages/el-comps/src/components/schemaFields.ts` -> `packages/el-comps/src/components/shared/schemaFields.ts`
- Move: `packages/el-comps/src/components/types.ts` -> `packages/el-comps/src/components/shared/types.ts`
- Modify imports in current component files and tests that reference these files.

- [ ] **Step 1: Move shared files with git**

Run:

```bash
mkdir -p packages/el-comps/src/components/shared
git mv packages/el-comps/src/components/actionTypes.ts packages/el-comps/src/components/shared/actionTypes.ts
git mv packages/el-comps/src/components/controls.ts packages/el-comps/src/components/shared/controls.ts
git mv packages/el-comps/src/components/schemaFields.ts packages/el-comps/src/components/shared/schemaFields.ts
git mv packages/el-comps/src/components/types.ts packages/el-comps/src/components/shared/types.ts
```

- [ ] **Step 2: Update imports from components to shared files**

Run:

```bash
rg -n "from './(actionTypes|controls|schemaFields|types)'|from '../src/components/(actionTypes|controls|schemaFields|types)'" packages/el-comps
```

Update matching imports:

```ts
// before, inside components/*.vue or components/*.ts
import type { FecPagination } from './types'
import { renderSchemaFields } from './schemaFields'
import type { FecActionItem } from './actionTypes'

// after
import type { FecPagination } from './shared/types'
import { renderSchemaFields } from './shared/schemaFields'
import type { FecActionItem } from './shared/actionTypes'
```

For tests that import implementation helpers directly:

```ts
// before
import { renderSchemaFields } from '../src/components/schemaFields'

// after
import { renderSchemaFields } from '../src/components/shared/schemaFields'
```

- [ ] **Step 3: Update shared helper internal imports**

Open moved files and update their own relative imports:

```ts
// packages/el-comps/src/components/shared/schemaFields.ts
import { resolveFecControl } from './controls'

// packages/el-comps/src/components/shared/types.ts
import type { FecActionItem, FecRowAction } from './actionTypes'
```

- [ ] **Step 4: Run focused typecheck**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit shared move**

Run:

```bash
git add packages/el-comps/src/components packages/el-comps/__tests__
git commit -m "refactor: move el-comps shared helpers"
```

---

### Task 3: Move Layout Components

**Files:**
- Move/create files under:
  - `packages/el-comps/src/components/fec-page/`
  - `packages/el-comps/src/components/fec-section/`
  - `packages/el-comps/src/components/fec-stack/`
  - `packages/el-comps/src/components/fec-toolbar/`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Move layout SFC files**

Run:

```bash
mkdir -p packages/el-comps/src/components/fec-page
mkdir -p packages/el-comps/src/components/fec-section
mkdir -p packages/el-comps/src/components/fec-stack
mkdir -p packages/el-comps/src/components/fec-toolbar
git mv packages/el-comps/src/components/FecPage.vue packages/el-comps/src/components/fec-page/FecPage.vue
git mv packages/el-comps/src/components/FecSection.vue packages/el-comps/src/components/fec-section/FecSection.vue
git mv packages/el-comps/src/components/FecStack.vue packages/el-comps/src/components/fec-stack/FecStack.vue
git mv packages/el-comps/src/components/FecToolbar.vue packages/el-comps/src/components/fec-toolbar/FecToolbar.vue
```

- [ ] **Step 2: Create layout props files**

Create `packages/el-comps/src/components/fec-page/props.ts`:

```ts
export interface FecPageProps {
  title?: string
  description?: string
}
```

Create `packages/el-comps/src/components/fec-section/props.ts`:

```ts
export interface FecSectionProps {
  title?: string
  description?: string
}
```

Create `packages/el-comps/src/components/fec-stack/props.ts`:

```ts
export type FecStackDirection = 'vertical' | 'horizontal'
export type FecStackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg'

export interface FecStackProps {
  direction?: FecStackDirection
  gap?: FecStackGap
}
```

Create `packages/el-comps/src/components/fec-toolbar/props.ts`:

```ts
import type { FecActionItem } from '../shared/actionTypes'

export interface FecToolbarProps {
  actions?: FecActionItem[]
}
```

- [ ] **Step 3: Create layout local index files**

Create `packages/el-comps/src/components/fec-page/index.ts`:

```ts
import FecPage from './FecPage.vue'

export { FecPage }
export type { FecPageProps } from './props'
export default FecPage
```

Create `packages/el-comps/src/components/fec-section/index.ts`:

```ts
import FecSection from './FecSection.vue'

export { FecSection }
export type { FecSectionProps } from './props'
export default FecSection
```

Create `packages/el-comps/src/components/fec-stack/index.ts`:

```ts
import FecStack from './FecStack.vue'

export { FecStack }
export type {
  FecStackDirection,
  FecStackGap,
  FecStackProps,
} from './props'
export default FecStack
```

Create `packages/el-comps/src/components/fec-toolbar/index.ts`:

```ts
import FecToolbar from './FecToolbar.vue'

export { FecToolbar }
export type { FecToolbarProps } from './props'
export default FecToolbar
```

- [ ] **Step 4: Update layout component imports**

Update `packages/el-comps/src/components/fec-toolbar/FecToolbar.vue` imports:

```ts
import type { PropType } from 'vue'
import type { FecActionItem } from '../shared/actionTypes'
```

- [ ] **Step 5: Add temporary root exports for moved layout components**

Modify `packages/el-comps/src/index.ts` so the moved components are imported from local entries:

```ts
import { FecPage } from './components/fec-page'
import { FecSection } from './components/fec-section'
import { FecStack } from './components/fec-stack'
import { FecToolbar } from './components/fec-toolbar'
```

Remove old `FecPageImpl`, `FecSectionImpl`, `FecStackImpl`, and `FecToolbarImpl` imports and keep:

```ts
export { FecPage, FecSection, FecStack, FecToolbar }
```

- [ ] **Step 6: Run layout tests**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/layout.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit layout move**

Run:

```bash
git add packages/el-comps/src packages/el-comps/__tests__
git commit -m "refactor: move el-comps layout components"
```

---

### Task 4: Move Form Components

**Files:**
- Move/create files under:
  - `packages/el-comps/src/components/fec-form/`
  - `packages/el-comps/src/components/fec-query-form/`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Move form SFC files**

Run:

```bash
mkdir -p packages/el-comps/src/components/fec-form
mkdir -p packages/el-comps/src/components/fec-query-form
git mv packages/el-comps/src/components/FecForm.vue packages/el-comps/src/components/fec-form/FecForm.vue
git mv packages/el-comps/src/components/FecQueryForm.vue packages/el-comps/src/components/fec-query-form/FecQueryForm.vue
```

- [ ] **Step 2: Create form props files**

Create `packages/el-comps/src/components/fec-form/props.ts`:

```ts
import type { QueryFormRules } from '@fizz/el-kit'
import type { FecFormSchemaItem } from '../shared/types'

export interface FecFormProps<T extends object> {
  model: T
  schema: readonly FecFormSchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
}
```

Create `packages/el-comps/src/components/fec-query-form/props.ts`:

```ts
import type { QueryFormRules } from '@fizz/el-kit'
import type { FecQuerySchemaItem } from '../shared/types'

export interface FecQueryFormProps<T extends object> {
  model: T
  schema: readonly FecQuerySchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
  submitText?: string
  resetText?: string
}
```

- [ ] **Step 3: Create form local index files with generic facades**

Create `packages/el-comps/src/components/fec-form/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecFormProps } from './props'
import FecFormImpl from './FecForm.vue'

export const FecForm = FecFormImpl as unknown as new <T extends object = any>() => {
  $props: FecFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:model'?: (...args: any[]) => void
  }
}

export type { FecFormProps } from './props'
export default FecFormImpl
```

Create `packages/el-comps/src/components/fec-query-form/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecQueryFormProps } from './props'
import FecQueryFormImpl from './FecQueryForm.vue'

export const FecQueryForm = FecQueryFormImpl as unknown as new <T extends object = any>() => {
  $props: FecQueryFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:model'?: (...args: any[]) => void
    'onSubmit'?: (...args: any[]) => void
    'onReset'?: (...args: any[]) => void
  }
}

export type { FecQueryFormProps } from './props'
export default FecQueryFormImpl
```

- [ ] **Step 4: Update form SFC imports**

Update `packages/el-comps/src/components/fec-form/FecForm.vue`:

```ts
import type { FecFormModel, FecFormSchemaItem } from '../shared/types'
import { renderSchemaFields } from '../shared/schemaFields'
```

Update `packages/el-comps/src/components/fec-query-form/FecQueryForm.vue`:

```ts
import type { FecFormModel, FecQuerySchemaItem } from '../shared/types'
import { renderSchemaFields } from '../shared/schemaFields'
```

Update current flat dialog/drawer imports because `FecDialogForm.vue` and
`FecDrawerForm.vue` are not moved until Task 6:

```ts
// packages/el-comps/src/components/FecDialogForm.vue
import FecForm from './fec-form/FecForm.vue'

// packages/el-comps/src/components/FecDrawerForm.vue
import FecForm from './fec-form/FecForm.vue'
```

Update the validation-gate mock target to the moved form component:

```ts
// packages/el-comps/__tests__/fecValidationGate.spec.ts
vi.mock('../src/components/fec-form/FecForm.vue', () => ({
```

- [ ] **Step 5: Update root imports for form components**

Modify `packages/el-comps/src/index.ts`:

```ts
import { FecForm } from './components/fec-form'
import { FecQueryForm } from './components/fec-query-form'
export { FecForm, FecQueryForm }
export type { FecFormProps } from './components/fec-form'
export type { FecQueryFormProps } from './components/fec-query-form'
```

Remove old root-level `FecForm` and `FecQueryForm` facade definitions.

- [ ] **Step 6: Run form tests and consumer typecheck**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecForm.spec.ts packages/el-comps/__tests__/fecValidationGate.spec.ts packages/el-comps/__tests__/schemaFields.spec.ts
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: PASS.

- [ ] **Step 7: Commit form move**

Run:

```bash
git add packages/el-comps/src packages/el-comps/__tests__
git commit -m "refactor: move el-comps form components"
```

---

### Task 5: Move Table Components

**Files:**
- Move/create files under:
  - `packages/el-comps/src/components/fec-table/`
  - `packages/el-comps/src/components/fec-query-table/`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Move table files**

Run:

```bash
mkdir -p packages/el-comps/src/components/fec-table
mkdir -p packages/el-comps/src/components/fec-query-table
git mv packages/el-comps/src/components/FecTable.vue packages/el-comps/src/components/fec-table/FecTable.vue
git mv packages/el-comps/src/components/FecQueryTable.vue packages/el-comps/src/components/fec-query-table/FecQueryTable.vue
git mv packages/el-comps/src/components/tableColumns.ts packages/el-comps/src/components/fec-table/tableColumns.ts
```

- [ ] **Step 2: Create table props files**

Create `packages/el-comps/src/components/fec-table/props.ts`:

```ts
import type { MaybeRefOrGetter } from 'vue'
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type { FecTableColumn } from '../shared/types'

export interface FecPagination {
  currentPage: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
}

export interface FecTableProps<Row extends object> {
  columns: readonly FecTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: FecPagination
  rowActions?: FecRowAction<Row>[]
  toolbarActions?: FecActionItem[]
  selectable?: boolean
}
```

Create `packages/el-comps/src/components/fec-query-table/props.ts`:

```ts
import type { MaybeRefOrGetter } from 'vue'
import type { QueryFormRules } from '@fizz/el-kit'
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type {
  FecQueryModel,
  FecQuerySchemaItem,
  FecQueryTableColumn,
} from '../shared/types'
import type { FecPagination } from '../fec-table/props'

export interface FecQueryPagination {
  currentPage: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
}

export interface FecQueryTableProps<Row extends object, Query extends FecQueryModel> {
  query: Query
  querySchema: readonly FecQuerySchemaItem<Query>[]
  queryRules?: QueryFormRules<Query>
  columns: readonly FecQueryTableColumn<Row>[]
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

- [ ] **Step 3: Create table local index files with generic facades**

Create `packages/el-comps/src/components/fec-table/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecTableProps } from './props'
import FecTableImpl from './FecTable.vue'

export const FecTable = FecTableImpl as unknown as new <Row extends object = any>() => {
  $props: FecTableProps<Row> & VNodeProps & AllowedComponentProps & {
    'onUpdate:currentPage'?: (...args: any[]) => void
    'onUpdate:pageSize'?: (...args: any[]) => void
    'onToolbarAction'?: (...args: any[]) => void
    'onRowAction'?: (...args: any[]) => void
    'onSelectionChange'?: (...args: any[]) => void
  }
}

export type { FecPagination, FecTableProps } from './props'
export default FecTableImpl
```

Create `packages/el-comps/src/components/fec-query-table/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecQueryTableProps } from './props'
import FecQueryTableImpl from './FecQueryTable.vue'

export const FecQueryTable = FecQueryTableImpl as unknown as new <
  Row extends object = any,
  Query extends object = any,
>() => {
  $props: FecQueryTableProps<Row, Query> & VNodeProps & AllowedComponentProps & {
    'onUpdate:query'?: (...args: any[]) => void
    'onSubmit'?: (...args: any[]) => void
    'onReset'?: (...args: any[]) => void
    'onUpdate:currentPage'?: (...args: any[]) => void
    'onUpdate:pageSize'?: (...args: any[]) => void
    'onToolbarAction'?: (...args: any[]) => void
    'onRowAction'?: (...args: any[]) => void
    'onSelectionChange'?: (...args: any[]) => void
  }
}

export type { FecQueryPagination, FecQueryTableProps } from './props'
export default FecQueryTableImpl
```

- [ ] **Step 4: Update table SFC imports**

Update `packages/el-comps/src/components/fec-table/FecTable.vue`:

```ts
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type { FecTableColumn } from '../shared/types'
import type { FecPagination } from './props'
import FecToolbar from '../fec-toolbar/FecToolbar.vue'
import { renderTableColumns } from './tableColumns'
```

Update `packages/el-comps/src/components/fec-table/tableColumns.ts`:

```ts
import type { TableColumn } from '@fizz/el-kit'
import { FeTableColumn } from '@fizz/el-plus'
import { h } from 'vue'
```

Update `packages/el-comps/src/components/fec-query-table/FecQueryTable.vue`:

```ts
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type { FecQueryModel, FecQuerySchemaItem, FecQueryTableColumn } from '../shared/types'
import type { FecPagination } from '../fec-table/props'
import FecQueryForm from '../fec-query-form/FecQueryForm.vue'
import FecTable from '../fec-table/FecTable.vue'
```

- [ ] **Step 5: Update root imports for table components**

Modify `packages/el-comps/src/index.ts`:

```ts
import { FecTable } from './components/fec-table'
import { FecQueryTable } from './components/fec-query-table'
export { FecTable, FecQueryTable }
export type { FecPagination, FecTableProps } from './components/fec-table'
export type {
  FecQueryPagination,
  FecQueryTableProps,
} from './components/fec-query-table'
```

Remove old root-level `FecTable` and `FecQueryTable` facade definitions.

- [ ] **Step 6: Run table tests and consumer typecheck**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecTable.spec.ts packages/el-comps/__tests__/fecQueryTable.spec.ts
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: PASS.

- [ ] **Step 7: Commit table move**

Run:

```bash
git add packages/el-comps/src packages/el-comps/__tests__
git commit -m "refactor: move el-comps table components"
```

---

### Task 6: Move Dialog, Drawer, And Detail Components

**Files:**
- Move/create files under:
  - `packages/el-comps/src/components/fec-dialog-form/`
  - `packages/el-comps/src/components/fec-drawer-form/`
  - `packages/el-comps/src/components/fec-detail/`
- Modify: `packages/el-comps/src/index.ts`

- [ ] **Step 1: Move dialog/detail SFC files**

Run:

```bash
mkdir -p packages/el-comps/src/components/fec-dialog-form
mkdir -p packages/el-comps/src/components/fec-drawer-form
mkdir -p packages/el-comps/src/components/fec-detail
git mv packages/el-comps/src/components/FecDialogForm.vue packages/el-comps/src/components/fec-dialog-form/FecDialogForm.vue
git mv packages/el-comps/src/components/FecDrawerForm.vue packages/el-comps/src/components/fec-drawer-form/FecDrawerForm.vue
git mv packages/el-comps/src/components/FecDetail.vue packages/el-comps/src/components/fec-detail/FecDetail.vue
```

- [ ] **Step 2: Create dialog/detail props files**

Create `packages/el-comps/src/components/fec-dialog-form/props.ts`:

```ts
import type { FecFormProps } from '../fec-form/props'

export interface FecDialogFormProps<T extends object> extends FecFormProps<T> {
  modelValue: boolean
  title?: string
  confirmText?: string
  cancelText?: string
}
```

Create `packages/el-comps/src/components/fec-drawer-form/props.ts`:

```ts
import type { FecFormProps } from '../fec-form/props'

export interface FecDrawerFormProps<T extends object> extends FecFormProps<T> {
  modelValue: boolean
  title?: string
  confirmText?: string
  cancelText?: string
}
```

Create `packages/el-comps/src/components/fec-detail/props.ts`:

```ts
export type FecDetailSchemaItem<T extends object> = [keyof T] extends [never]
  ? {
      prop: string
      label: string
      formatter?: (value: unknown, record: T) => unknown
    }
  : {
      [K in Extract<keyof T, string>]: {
        prop: K
        label: string
        formatter?: (value: T[K], record: T) => unknown
      }
    }[Extract<keyof T, string>]

export interface FecLooseDetailSchemaItem {
  prop: string
  label: string
  formatter?: (value: unknown, record: Record<string, unknown>) => unknown
}

export function defineFecDetailSchema<T extends object>(
  schema: readonly FecDetailSchemaItem<T>[],
): readonly FecDetailSchemaItem<T>[] {
  return schema
}

export interface FecDetailProps<T extends object> {
  record: T
  schema: readonly FecDetailSchemaItem<T>[]
  columns?: 1 | 2 | 3 | 4
  emptyText?: string
}
```

- [ ] **Step 3: Create dialog/detail local index files**

Create `packages/el-comps/src/components/fec-dialog-form/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDialogFormProps } from './props'
import FecDialogFormImpl from './FecDialogForm.vue'

export const FecDialogForm = FecDialogFormImpl as unknown as new <T extends object = any>() => {
  $props: FecDialogFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:modelValue'?: (...args: any[]) => void
    'onUpdate:model'?: (...args: any[]) => void
    'onConfirm'?: (...args: any[]) => void
    'onCancel'?: (...args: any[]) => void
  }
}

export type { FecDialogFormProps } from './props'
export default FecDialogFormImpl
```

Create `packages/el-comps/src/components/fec-drawer-form/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDrawerFormProps } from './props'
import FecDrawerFormImpl from './FecDrawerForm.vue'

export const FecDrawerForm = FecDrawerFormImpl as unknown as new <T extends object = any>() => {
  $props: FecDrawerFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:modelValue'?: (...args: any[]) => void
    'onUpdate:model'?: (...args: any[]) => void
    'onConfirm'?: (...args: any[]) => void
    'onCancel'?: (...args: any[]) => void
  }
}

export type { FecDrawerFormProps } from './props'
export default FecDrawerFormImpl
```

Create `packages/el-comps/src/components/fec-detail/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDetailProps } from './props'
import FecDetailImpl from './FecDetail.vue'

export const FecDetail = FecDetailImpl as unknown as new <T extends object = any>() => {
  $props: FecDetailProps<T> & VNodeProps & AllowedComponentProps
}

export {
  defineFecDetailSchema,
} from './props'
export type {
  FecDetailProps,
  FecDetailSchemaItem,
  FecLooseDetailSchemaItem,
} from './props'
export default FecDetailImpl
```

- [ ] **Step 4: Update dialog/detail SFC imports**

Update `packages/el-comps/src/components/fec-dialog-form/FecDialogForm.vue`:

```ts
import type { PropType } from 'vue'
import type { FecFormModel, FecFormSchemaItem } from '../shared/types'
import FecForm from '../fec-form/FecForm.vue'
```

Update `packages/el-comps/src/components/fec-drawer-form/FecDrawerForm.vue`:

```ts
import type { PropType } from 'vue'
import type { FecFormModel, FecFormSchemaItem } from '../shared/types'
import FecForm from '../fec-form/FecForm.vue'
```

Update `packages/el-comps/src/components/fec-detail/FecDetail.vue`:

```ts
import type { PropType } from 'vue'
import type { FecLooseDetailSchemaItem } from './props'
```

Verify the validation-gate test still mocks the moved form component. The mock
path should remain:

```ts
// packages/el-comps/__tests__/fecValidationGate.spec.ts
vi.mock('../src/components/fec-form/FecForm.vue', () => ({
```

- [ ] **Step 5: Update root imports for dialog/detail components**

Modify `packages/el-comps/src/index.ts`:

```ts
import { FecDialogForm } from './components/fec-dialog-form'
import { FecDrawerForm } from './components/fec-drawer-form'
import { FecDetail, defineFecDetailSchema } from './components/fec-detail'
export { FecDetail, FecDialogForm, FecDrawerForm, defineFecDetailSchema }
export type { FecDialogFormProps } from './components/fec-dialog-form'
export type { FecDrawerFormProps } from './components/fec-drawer-form'
export type {
  FecDetailProps,
  FecDetailSchemaItem,
} from './components/fec-detail'
```

Remove old root-level `FecDetail`, `FecDialogForm`, and `FecDrawerForm` facade definitions.

- [ ] **Step 6: Run flow tests and consumer typecheck**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecFlow.spec.ts packages/el-comps/__tests__/fecValidationGate.spec.ts
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: both commands exit 0.

- [ ] **Step 7: Commit dialog/detail move**

Run:

```bash
git add packages/el-comps/src packages/el-comps/__tests__
git commit -m "refactor: move el-comps dialog and detail components"
```

---

### Task 7: Replace Root Entry With Aggregator

**Files:**
- Modify: `packages/el-comps/src/index.ts`
- Modify: `packages/el-comps/src/components/shared/types.ts`

- [ ] **Step 1: Replace shared types with only cross-component schema contracts**

Replace `packages/el-comps/src/components/shared/types.ts` with:

```ts
import type {
  FormSchemaItem,
  QuerySchemaItem,
  TableColumn,
} from '@fizz/el-kit'
import type { Component } from 'vue'

export type FecFormModel = Record<string, unknown>
export type FecQueryModel = object

export interface FecRenderFieldConfig {
  fieldProps?: Record<string, unknown>
}

export type FecBuiltinFormSchemaItem<T extends object>
  = FormSchemaItem<T> & FecRenderFieldConfig

export type FecBuiltinQuerySchemaItem<T extends object>
  = QuerySchemaItem<T> & FecRenderFieldConfig

export interface FecCustomFormSchemaItem<T extends object> extends FecRenderFieldConfig {
  prop: [keyof T] extends [never] ? string : Extract<keyof T, string>
  label: string
  component: Component
}

export interface FecCustomQuerySchemaItem<T extends object> extends FecRenderFieldConfig {
  prop: [keyof T] extends [never] ? string : Extract<keyof T, string>
  label: string
  component: Component
}

export type FecFormSchemaItem<T extends object>
  = | FecBuiltinFormSchemaItem<T>
    | FecCustomFormSchemaItem<T>

export type FecQuerySchemaItem<T extends object>
  = | FecBuiltinQuerySchemaItem<T>
    | FecCustomQuerySchemaItem<T>

export type FecTableColumn<T extends object> = TableColumn<T>
export type FecQueryTableColumn<T extends object> = TableColumn<T>

export function defineFecFormSchema<T extends object>(
  schema: readonly FecFormSchemaItem<T>[],
): readonly FecFormSchemaItem<T>[] {
  return schema
}

export function defineFecQuerySchema<T extends object>(
  schema: readonly FecQuerySchemaItem<T>[],
): readonly FecQuerySchemaItem<T>[] {
  return schema
}

export function defineFecTableColumns<T extends object>(
  columns: readonly FecTableColumn<T>[],
): readonly FecTableColumn<T>[] {
  return columns
}
```

This intentionally removes pagination types, component prop interfaces,
dialog/drawer/detail schema types, and the action type re-export from
`shared/types.ts`. Existing public types are re-exported from the package root
through component-local `props.ts` files or `components/shared/actionTypes.ts`.
Do not add new root-level type exports during this mechanical refactor.

- [ ] **Step 2: Replace root entry with aggregator exports**

Replace `packages/el-comps/src/index.ts` with:

```ts
// @fizz/el-comps 入口
// 基于 @fizz/el-kit 的无主题样式结构化组合组件层。
// 提供 form + table + pagination 等高阶组合，供业务页面直接使用。

export { FecDetail, defineFecDetailSchema } from './components/fec-detail'
export type {
  FecDetailProps,
  FecDetailSchemaItem,
} from './components/fec-detail'
export { FecDialogForm } from './components/fec-dialog-form'
export type { FecDialogFormProps } from './components/fec-dialog-form'
export { FecDrawerForm } from './components/fec-drawer-form'
export type { FecDrawerFormProps } from './components/fec-drawer-form'
export { FecForm } from './components/fec-form'
export type { FecFormProps } from './components/fec-form'
export { FecPage } from './components/fec-page'
export { FecQueryForm } from './components/fec-query-form'
export type { FecQueryFormProps } from './components/fec-query-form'
export { FecQueryTable } from './components/fec-query-table'
export type {
  FecQueryPagination,
  FecQueryTableProps,
} from './components/fec-query-table'
export { FecSection } from './components/fec-section'
export { FecStack } from './components/fec-stack'
export { FecTable } from './components/fec-table'
export type {
  FecPagination,
  FecTableProps,
} from './components/fec-table'
export { FecToolbar } from './components/fec-toolbar'

export type {
  FecActionItem,
  FecActionType,
  FecRowAction,
} from './components/shared/actionTypes'
export {
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
} from './components/shared/types'
export type {
  FecBuiltinFormSchemaItem,
  FecBuiltinQuerySchemaItem,
  FecCustomFormSchemaItem,
  FecCustomQuerySchemaItem,
  FecFormSchemaItem,
  FecQuerySchemaItem,
  FecRenderFieldConfig,
} from './components/shared/types'
```

- [ ] **Step 3: Run the structure test and consumer typecheck**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/componentStructure.spec.ts
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: PASS.

- [ ] **Step 4: Check no package subpath exports were added**

Run:

```bash
node -e "const p=require('./packages/el-comps/package.json'); console.log(JSON.stringify(p.exports,null,2))"
```

Expected output contains only the root package export:

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.mjs"
  }
}
```

- [ ] **Step 5: Commit root aggregator**

Run:

```bash
git add packages/el-comps/src packages/el-comps/__tests__
git commit -m "refactor: aggregate el-comps component exports"
```

---

### Task 8: Full Verification

**Files:**
- No source files expected beyond previous tasks.

- [ ] **Step 1: Run focused el-comps verification**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm exec vitest run packages/el-comps/__tests__
pnpm -C playground build
```

Expected: all commands exit 0.

- [ ] **Step 2: Run repository verification**

Run:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ packages/el-kit/__tests__ packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 3: Inspect generated public declarations**

Run:

```bash
pnpm --filter @fizz/el-comps build
rg -n "components/.+\\.vue|node_modules|src/components/Fec" packages/el-comps/dist/index.d.ts
rg -n "FecFormProps|FecQueryTableProps|FecQueryPagination|defineFecDetailSchema|defineFecFormSchema" packages/el-comps/dist/index.d.ts
```

Expected:

- first `rg` exits 1 because no private `.vue`, `node_modules`, or old flat `src/components/Fec*` paths appear;
- second `rg` exits 0 and finds the public types/functions.

- [ ] **Step 4: Commit verification fixes if needed**

If verification required small fixes, commit them:

```bash
git add packages/el-comps playground docs
git commit -m "fix: polish el-comps component directory verification"
```

If there were no changes, do not create an empty commit.

---

## Execution Notes

- Use `git mv` for file moves so review diffs preserve history where possible.
- Do not edit `packages/el-comps/package.json` `exports` unless a verification command proves it was already changed accidentally; this plan should leave it unchanged.
- Keep consumer imports rooted at `@fizz/el-comps`.
- Do not add new runtime behavior while moving files.
