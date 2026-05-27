# el-kit CRUD Headless Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first reusable CRUD headless layer to `@fizz/el-kit` and prove it by simplifying the playground CRUD page.

**Architecture:** Build small A-level state primitives first, then compose them into the B-level `useQueryTable` workflow. Keep `@fizz/el-kit` headless and leave rendering in `@fizz/el-comps`. Defer the `packages/el-comps/src/components` directory restructure to a separate mechanical plan after this API lands.

**Tech Stack:** Vue 3 refs/computed helpers, TypeScript, Vitest, vue-tsc, Vite library build, pnpm workspace scripts.

---

## Scope Check

This plan implements the kit CRUD headless layer and playground proof. It does not reorganize `packages/el-comps/src/components`; that is a separate follow-up because it is mechanical and should not be mixed with behavior/API changes.

## File Structure

- Create: `packages/el-kit/src/composables/stateSource.ts`
  - Shared internal helper for writable or readonly `MaybeRefOrGetter` state.
- Create: `packages/el-kit/src/composables/usePaginationState.ts`
  - Pagination primitive shared by table and query-table workflows.
- Create: `packages/el-kit/src/composables/useQueryState.ts`
  - Query model primitive used by `useQueryForm` and `useQueryTable`.
- Modify: `packages/el-kit/src/composables/useQueryForm.ts`
  - Reuse `useQueryState` instead of maintaining a separate model state machine.
- Modify: `packages/el-kit/src/composables/useTable.ts`
  - Keep the public `useTable` name and align it with the table primitive shape.
- Create: `packages/el-kit/src/composables/useDialogFormState.ts`
  - Headless create/edit dialog form primitive.
- Create: `packages/el-kit/src/composables/useDetailState.ts`
  - Headless current-detail-record primitive.
- Create: `packages/el-kit/src/composables/useQueryTable.ts`
  - B-level workflow that composes query, table, pagination, loading, and optional `fetchList`.
- Modify: `packages/el-kit/src/index.ts`
  - Export new composables and public types.
- Modify: `packages/el-kit/__tests__/useTable.spec.ts`
  - Add reset-page coverage through the existing `useTable` public API.
- Create: `packages/el-kit/__tests__/usePaginationState.spec.ts`
  - Unit tests for pagination primitive.
- Create: `packages/el-kit/__tests__/useQueryState.spec.ts`
  - Unit tests for query model primitive.
- Create: `packages/el-kit/__tests__/useDialogFormState.spec.ts`
  - Unit tests for create/edit dialog state.
- Create: `packages/el-kit/__tests__/useDetailState.spec.ts`
  - Unit tests for detail state.
- Create: `packages/el-kit/__tests__/useQueryTable.spec.ts`
  - Unit tests for query-table workflow.
- Modify: `packages/el-kit/__tests__/consumer-dist.typecheck.ts`
  - Consumer type coverage for the new APIs.
- Modify: `playground/src/views/CrudPage.vue`
  - Replace manual query/pagination/dialog/detail glue with kit composables.
- Modify: `playground/__tests__/integration.spec.ts`
  - Keep the CRUD demo assertions aligned with the simplified page.

---

### Task 1: Shared State Source And Pagination Primitive

**Files:**
- Create: `packages/el-kit/src/composables/stateSource.ts`
- Create: `packages/el-kit/src/composables/usePaginationState.ts`
- Create: `packages/el-kit/__tests__/usePaginationState.spec.ts`
- Modify: `packages/el-kit/src/index.ts`

- [ ] **Step 1: Write the failing pagination tests**

Create `packages/el-kit/__tests__/usePaginationState.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { computed, shallowRef } from 'vue'
import { usePaginationState } from '../src'

describe('usePaginationState', () => {
  it('creates writable internal pagination state from defaults', () => {
    const pagination = usePaginationState()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.pageSize.value).toBe(10)
    expect(pagination.total.value).toBe(0)

    pagination.setPage(3)
    pagination.setPageSize(20)
    pagination.setTotal(55)

    expect(pagination.currentPage.value).toBe(3)
    expect(pagination.pageSize.value).toBe(20)
    expect(pagination.total.value).toBe(55)

    pagination.resetPage()
    expect(pagination.currentPage.value).toBe(1)
  })

  it('keeps external refs as the single state source', () => {
    const currentPage = shallowRef(2)
    const pageSize = shallowRef(15)
    const total = shallowRef(41)

    const pagination = usePaginationState({
      currentPage,
      pageSize,
      total,
    })

    pagination.setPage(4)
    pagination.setPageSize(30)
    pagination.setTotal(90)

    expect(currentPage.value).toBe(4)
    expect(pageSize.value).toBe(30)
    expect(total.value).toBe(90)
  })

  it('throws when setters target readonly state sources', () => {
    const pagination = usePaginationState({
      currentPage: computed(() => 1),
      pageSize: computed(() => 10),
      total: computed(() => 0),
    })

    expect(() => pagination.setPage(2)).toThrow('pagination.currentPage is readonly')
    expect(() => pagination.setPageSize(20)).toThrow('pagination.pageSize is readonly')
    expect(() => pagination.setTotal(40)).toThrow('pagination.total is readonly')
  })
})
```

- [ ] **Step 2: Run the pagination test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/usePaginationState.spec.ts
```

Expected: FAIL because `usePaginationState` is not exported.

- [ ] **Step 3: Add the shared state-source helper**

Create `packages/el-kit/src/composables/stateSource.ts`:

```ts
import type { MaybeRefOrGetter, Ref } from 'vue'
import {
  computed,
  isReadonly,
  isRef,
  shallowRef,
} from 'vue'

export interface StateSource<T> {
  ref: Ref<T>
  set: (value: T) => void
}

export function createStateSource<T>(
  name: string,
  source: MaybeRefOrGetter<T>,
): StateSource<T> {
  const state = isRef(source)
    ? source
    : typeof source === 'function'
      ? computed(source as () => T)
      : shallowRef(source)

  return {
    ref: state as Ref<T>,
    set(value: T) {
      if (isReadonly(state)) {
        throw new Error(`${name} is readonly`)
      }

      const writableState = state as Ref<T>
      writableState.value = value
    },
  }
}
```

- [ ] **Step 4: Implement `usePaginationState`**

Create `packages/el-kit/src/composables/usePaginationState.ts`:

```ts
import type { MaybeRefOrGetter, Ref } from 'vue'
import { createStateSource } from './stateSource'

export interface UsePaginationStateOptions {
  currentPage?: MaybeRefOrGetter<number>
  pageSize?: MaybeRefOrGetter<number>
  total?: MaybeRefOrGetter<number>
}

export interface PaginationState {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotal: (total: number) => void
  resetPage: () => void
}

export function usePaginationState(
  options: UsePaginationStateOptions = {},
): PaginationState {
  const currentPage = createStateSource('pagination.currentPage', options.currentPage ?? 1)
  const pageSize = createStateSource('pagination.pageSize', options.pageSize ?? 10)
  const total = createStateSource('pagination.total', options.total ?? 0)

  return {
    currentPage: currentPage.ref,
    pageSize: pageSize.ref,
    resetPage: () => currentPage.set(1),
    setPage: currentPage.set,
    setPageSize: pageSize.set,
    setTotal: total.set,
    total: total.ref,
  }
}
```

- [ ] **Step 5: Export pagination API**

Modify `packages/el-kit/src/index.ts`:

```ts
export { usePaginationState } from './composables/usePaginationState'
export type {
  PaginationState,
  UsePaginationStateOptions,
} from './composables/usePaginationState'
```

- [ ] **Step 6: Run the pagination test and verify it passes**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/usePaginationState.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit Task 1**

Run:

```bash
git add packages/el-kit/src/composables/stateSource.ts packages/el-kit/src/composables/usePaginationState.ts packages/el-kit/src/index.ts packages/el-kit/__tests__/usePaginationState.spec.ts
git commit -m "feat: add pagination state primitive"
```

---

### Task 2: Query State Primitive And Query Form Alignment

**Files:**
- Create: `packages/el-kit/src/composables/useQueryState.ts`
- Create: `packages/el-kit/__tests__/useQueryState.spec.ts`
- Modify: `packages/el-kit/src/composables/useQueryForm.ts`
- Modify: `packages/el-kit/__tests__/useQueryForm.spec.ts`
- Modify: `packages/el-kit/src/index.ts`

- [ ] **Step 1: Write the failing query-state tests**

Create `packages/el-kit/__tests__/useQueryState.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { computed, shallowRef } from 'vue'
import { useQueryState } from '../src'

interface Query {
  keyword: string
  status: 'all' | 'enabled'
}

describe('useQueryState', () => {
  it('creates writable query state and resets to the initial snapshot', () => {
    const query = useQueryState<Query>({
      model: { keyword: '', status: 'all' },
    })

    query.setField('keyword', 'fizz')
    query.setField('status', 'enabled')

    expect(query.model.value).toEqual({ keyword: 'fizz', status: 'enabled' })

    query.reset()
    expect(query.model.value).toEqual({ keyword: '', status: 'all' })
  })

  it('keeps an external model ref as the single state source', () => {
    const model = shallowRef<Query>({ keyword: '', status: 'all' })
    const query = useQueryState<Query>({ model })

    query.setModel({ keyword: 'kit', status: 'enabled' })

    expect(model.value).toEqual({ keyword: 'kit', status: 'enabled' })
  })

  it('uses an explicit initial model snapshot for reset', () => {
    const query = useQueryState<Query>({
      initialModel: { keyword: 'initial', status: 'enabled' },
      model: { keyword: '', status: 'all' },
    })

    query.setField('keyword', 'changed')
    query.reset()

    expect(query.model.value).toEqual({ keyword: 'initial', status: 'enabled' })
  })

  it('throws when setters target a readonly model source', () => {
    const query = useQueryState<Query>({
      model: computed(() => ({ keyword: '', status: 'all' })),
    })

    expect(() => query.setField('keyword', 'fizz')).toThrow('model is readonly')
    expect(() =>
      query.setModel({ keyword: 'kit', status: 'enabled' }),
    ).toThrow('model is readonly')
  })
})
```

- [ ] **Step 2: Run the query-state test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/useQueryState.spec.ts
```

Expected: FAIL because `useQueryState` is not exported.

- [ ] **Step 3: Implement `useQueryState`**

Create `packages/el-kit/src/composables/useQueryState.ts`:

```ts
import type { MaybeRefOrGetter, Ref } from 'vue'
import { createStateSource } from './stateSource'

export type QueryStateModel = object

export interface UseQueryStateOptions<Query extends QueryStateModel> {
  model: MaybeRefOrGetter<Query>
  initialModel?: Query
}

export interface QueryState<Query extends QueryStateModel> {
  model: Ref<Query>
  initialModel: Query
  setModel: (model: Query) => void
  setField: <K extends Extract<keyof Query, string>>(field: K, value: Query[K]) => void
  reset: () => void
}

function cloneModel<Query extends QueryStateModel>(model: Query): Query {
  return { ...model }
}

export function useQueryState<Query extends QueryStateModel>(
  options: UseQueryStateOptions<Query>,
): QueryState<Query> {
  const model = createStateSource('model', options.model)
  const initialModel = cloneModel(options.initialModel ?? model.ref.value)

  function setModel(value: Query) {
    model.set(value)
  }

  function setField<K extends Extract<keyof Query, string>>(field: K, value: Query[K]) {
    setModel({
      ...model.ref.value,
      [field]: value,
    })
  }

  function reset() {
    setModel(cloneModel(initialModel))
  }

  return {
    initialModel,
    model: model.ref,
    reset,
    setField,
    setModel,
  }
}
```

- [ ] **Step 4: Refactor `useQueryForm` to reuse `useQueryState`**

Modify `packages/el-kit/src/composables/useQueryForm.ts` so model handling delegates to `useQueryState`:

```ts
import type { MaybeRefOrGetter, Ref } from 'vue'
import { createStateSource } from './stateSource'
import { useQueryState } from './useQueryState'

export type QueryFormModel = object

export interface QueryFormRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  trigger?: string | string[]
  validator?: (value: unknown, model: QueryFormModel) => boolean | string | Promise<boolean | string>
}

export type QueryFormRules<T extends QueryFormModel> = Partial<
  Record<Extract<keyof T, string>, QueryFormRule[]>
>

export interface UseQueryFormOptions<T extends QueryFormModel> {
  model: MaybeRefOrGetter<T>
  rules?: MaybeRefOrGetter<QueryFormRules<T>>
  initialModel?: T
  onSubmit?: (model: T) => void
}

export interface QueryFormState<T extends QueryFormModel> {
  model: Ref<T>
  rules: Ref<QueryFormRules<T>>
  setModel: (model: T) => void
  setField: <K extends Extract<keyof T, string>>(field: K, value: T[K]) => void
  setRules: (rules: QueryFormRules<T>) => void
  reset: () => void
  submit: () => void
}

function cloneModel<T extends QueryFormModel>(model: T): T {
  return { ...model }
}

export function useQueryForm<T extends QueryFormModel>(
  options: UseQueryFormOptions<T>,
): QueryFormState<T> {
  const query = useQueryState({
    initialModel: options.initialModel,
    model: options.model,
  })
  const rules = createStateSource<QueryFormRules<T>>('rules', options.rules ?? {})

  function setRules(value: QueryFormRules<T>) {
    rules.set(value)
  }

  function submit() {
    options.onSubmit?.(cloneModel(query.model.value))
  }

  return {
    model: query.model,
    reset: query.reset,
    rules: rules.ref,
    setField: query.setField,
    setModel: query.setModel,
    setRules,
    submit,
  }
}
```

- [ ] **Step 5: Export query-state API**

Modify `packages/el-kit/src/index.ts`:

```ts
export { useQueryState } from './composables/useQueryState'
export type {
  QueryState,
  QueryStateModel,
  UseQueryStateOptions,
} from './composables/useQueryState'
```

- [ ] **Step 6: Run query tests and verify they pass**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/useQueryState.spec.ts packages/el-kit/__tests__/useQueryForm.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit Task 2**

Run:

```bash
git add packages/el-kit/src/composables/useQueryState.ts packages/el-kit/src/composables/useQueryForm.ts packages/el-kit/src/index.ts packages/el-kit/__tests__/useQueryState.spec.ts packages/el-kit/__tests__/useQueryForm.spec.ts
git commit -m "feat: add query state primitive"
```

---

### Task 3: Table Alignment With Pagination Primitive

**Files:**
- Modify: `packages/el-kit/src/composables/useTable.ts`
- Modify: `packages/el-kit/__tests__/useTable.spec.ts`
- Modify: `packages/el-kit/src/index.ts`

- [ ] **Step 1: Add failing table pagination reset coverage**

Append this test to `packages/el-kit/__tests__/useTable.spec.ts`:

```ts
  it('exposes pagination reset through the table state', () => {
    const table = useTable<User>({
      columns: [{ prop: 'name', label: '姓名' }],
      data: [{ name: 'Tom', age: 18 }],
      pagination: {
        currentPage: 4,
        pageSize: 20,
        total: 90,
      },
    })

    expect(table.pagination.currentPage.value).toBe(4)

    table.resetPage()

    expect(table.pagination.currentPage.value).toBe(1)
  })
```

- [ ] **Step 2: Run the table test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/useTable.spec.ts
```

Expected: FAIL because `resetPage` is not returned by `useTable`.

- [ ] **Step 3: Refactor `useTable` to reuse shared helpers**

Modify `packages/el-kit/src/composables/useTable.ts` to remove its local `createStateSource` and pagination setup. Keep `useTable` as the public primitive name:

```ts
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { PaginationState, UsePaginationStateOptions } from './usePaginationState'
import { createStateSource } from './stateSource'
import { usePaginationState } from './usePaginationState'

export interface TableColumn<T extends object> {
  prop: [keyof T] extends [never] ? string : Extract<keyof T, string>
  label: string
  visible?: boolean
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  formatter?: (row: T, column: TableColumn<T>, rowIndex: number) => unknown
}

export type UseTablePaginationOptions = UsePaginationStateOptions
export type TablePaginationState = PaginationState

export interface UseTableOptions<T extends object> {
  columns: MaybeRefOrGetter<readonly TableColumn<T>[]>
  data: MaybeRefOrGetter<T[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: UseTablePaginationOptions
}

export interface TableState<T extends object> {
  columns: Ref<readonly TableColumn<T>[]>
  data: Ref<T[]>
  loading: Ref<boolean>
  pagination: TablePaginationState
  setColumns: (columns: readonly TableColumn<T>[]) => void
  setData: (data: T[]) => void
  setLoading: (loading: boolean) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotal: (total: number) => void
  resetPage: () => void
}

export function defineTableColumns<T extends object>(
  columns: readonly TableColumn<T>[],
): readonly TableColumn<T>[] {
  return columns
}

export function useTable<T extends object>(options: UseTableOptions<T>): TableState<T> {
  const columns = createStateSource('columns', options.columns)
  const data = createStateSource('data', options.data)
  const loading = createStateSource('loading', options.loading ?? false)
  const pagination = usePaginationState(options.pagination)

  return {
    columns: columns.ref,
    data: data.ref,
    loading: loading.ref,
    pagination,
    resetPage: pagination.resetPage,
    setColumns: columns.set,
    setData: data.set,
    setLoading: loading.set,
    setPage: pagination.setPage,
    setPageSize: pagination.setPageSize,
    setTotal: pagination.setTotal,
  }
}
```

- [ ] **Step 4: Run table tests and verify they pass**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/useTable.spec.ts packages/el-kit/__tests__/usePaginationState.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Run el-kit typecheck**

Run:

```bash
pnpm --filter @fizz/el-kit typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit Task 3**

Run:

```bash
git add packages/el-kit/src/composables/useTable.ts packages/el-kit/src/index.ts packages/el-kit/__tests__/useTable.spec.ts
git commit -m "refactor: align table state with pagination primitive"
```

---

### Task 4: Dialog Form And Detail Primitives

**Files:**
- Create: `packages/el-kit/src/composables/useDialogFormState.ts`
- Create: `packages/el-kit/src/composables/useDetailState.ts`
- Create: `packages/el-kit/__tests__/useDialogFormState.spec.ts`
- Create: `packages/el-kit/__tests__/useDetailState.spec.ts`
- Modify: `packages/el-kit/src/index.ts`

- [ ] **Step 1: Write failing dialog form tests**

Create `packages/el-kit/__tests__/useDialogFormState.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { useDialogFormState } from '../src'

interface User {
  id: number
  name: string
  age: number
}

interface UserForm {
  name: string
  age: number
}

describe('useDialogFormState', () => {
  it('opens create mode with a fresh model', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', age: 0 }),
      toFormModel: user => ({ name: user.name, age: user.age }),
    })

    form.openCreate()

    expect(form.visible.value).toBe(true)
    expect(form.mode.value).toBe('create')
    expect(form.model.value).toEqual({ name: '', age: 0 })
    expect(form.editingRecord.value).toBeUndefined()
  })

  it('opens edit mode with mapped record data', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', age: 0 }),
      toFormModel: user => ({ name: user.name, age: user.age }),
    })
    const record = { id: 1, name: 'Tom', age: 18 }

    form.openEdit(record)

    expect(form.visible.value).toBe(true)
    expect(form.mode.value).toBe('edit')
    expect(form.editingRecord.value).toBe(record)
    expect(form.model.value).toEqual({ name: 'Tom', age: 18 })
  })

  it('resets and closes without clearing the current editing record unexpectedly', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', age: 0 }),
      toFormModel: user => ({ name: user.name, age: user.age }),
    })

    form.openEdit({ id: 1, name: 'Tom', age: 18 })
    form.setModel({ name: 'Changed', age: 20 })
    form.reset()

    expect(form.model.value).toEqual({ name: 'Tom', age: 18 })

    form.close()
    expect(form.visible.value).toBe(false)
  })
})
```

- [ ] **Step 2: Write failing detail tests**

Create `packages/el-kit/__tests__/useDetailState.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { useDetailState } from '../src'

interface User {
  id: number
  name: string
}

describe('useDetailState', () => {
  it('opens, closes, and clears the current detail record', () => {
    const detail = useDetailState<User>()
    const record = { id: 1, name: 'Tom' }

    expect(detail.visible.value).toBe(false)
    expect(detail.record.value).toBeUndefined()

    detail.open(record)

    expect(detail.visible.value).toBe(true)
    expect(detail.record.value).toBe(record)

    detail.close()

    expect(detail.visible.value).toBe(false)
    expect(detail.record.value).toBe(record)

    detail.clear()

    expect(detail.visible.value).toBe(false)
    expect(detail.record.value).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run the tests and verify they fail**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/useDialogFormState.spec.ts packages/el-kit/__tests__/useDetailState.spec.ts
```

Expected: FAIL because both composables are not exported.

- [ ] **Step 4: Implement `useDialogFormState`**

Create `packages/el-kit/src/composables/useDialogFormState.ts`:

```ts
import type { Ref } from 'vue'
import { shallowRef } from 'vue'

export type DialogFormMode = 'create' | 'edit'

export interface UseDialogFormStateOptions<Form extends object, Row extends object = Form> {
  createModel: () => Form
  toFormModel?: (record: Row) => Form
}

export interface DialogFormState<Form extends object, Row extends object = Form> {
  visible: Ref<boolean>
  mode: Ref<DialogFormMode>
  model: Ref<Form>
  editingRecord: Ref<Row | undefined>
  openCreate: (initial?: Partial<Form>) => void
  openEdit: (record: Row, model?: Partial<Form>) => void
  close: () => void
  reset: () => void
  setModel: (model: Form) => void
}

function cloneModel<Form extends object>(model: Form): Form {
  return { ...model }
}

export function useDialogFormState<Form extends object, Row extends object = Form>(
  options: UseDialogFormStateOptions<Form, Row>,
): DialogFormState<Form, Row> {
  const visible = shallowRef(false)
  const mode = shallowRef<DialogFormMode>('create')
  const model = shallowRef(options.createModel()) as Ref<Form>
  const editingRecord = shallowRef<Row>()
  let resetModel = cloneModel(model.value)

  function setModel(value: Form) {
    model.value = value
  }

  function openCreate(initial: Partial<Form> = {}) {
    const nextModel = {
      ...options.createModel(),
      ...initial,
    }
    mode.value = 'create'
    editingRecord.value = undefined
    resetModel = cloneModel(nextModel)
    model.value = nextModel
    visible.value = true
  }

  function openEdit(record: Row, partialModel: Partial<Form> = {}) {
    const baseModel = options.toFormModel
      ? options.toFormModel(record)
      : record as unknown as Form
    const nextModel = {
      ...baseModel,
      ...partialModel,
    }
    mode.value = 'edit'
    editingRecord.value = record
    resetModel = cloneModel(nextModel)
    model.value = nextModel
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  function reset() {
    model.value = cloneModel(resetModel)
  }

  return {
    close,
    editingRecord,
    mode,
    model,
    openCreate,
    openEdit,
    reset,
    setModel,
    visible,
  }
}
```

- [ ] **Step 5: Implement `useDetailState`**

Create `packages/el-kit/src/composables/useDetailState.ts`:

```ts
import type { Ref } from 'vue'
import { shallowRef } from 'vue'

export interface DetailState<Row extends object> {
  visible: Ref<boolean>
  record: Ref<Row | undefined>
  open: (record: Row) => void
  close: () => void
  clear: () => void
}

export function useDetailState<Row extends object>(): DetailState<Row> {
  const visible = shallowRef(false)
  const record = shallowRef<Row>() as Ref<Row | undefined>

  function open(value: Row) {
    record.value = value
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  function clear() {
    record.value = undefined
    visible.value = false
  }

  return {
    clear,
    close,
    open,
    record,
    visible,
  }
}
```

- [ ] **Step 6: Export dialog and detail APIs**

Modify `packages/el-kit/src/index.ts`:

```ts
export { useDialogFormState } from './composables/useDialogFormState'
export type {
  DialogFormMode,
  DialogFormState,
  UseDialogFormStateOptions,
} from './composables/useDialogFormState'

export { useDetailState } from './composables/useDetailState'
export type { DetailState } from './composables/useDetailState'
```

- [ ] **Step 7: Run the tests and verify they pass**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/useDialogFormState.spec.ts packages/el-kit/__tests__/useDetailState.spec.ts
```

Expected: PASS.

- [ ] **Step 8: Commit Task 4**

Run:

```bash
git add packages/el-kit/src/composables/useDialogFormState.ts packages/el-kit/src/composables/useDetailState.ts packages/el-kit/src/index.ts packages/el-kit/__tests__/useDialogFormState.spec.ts packages/el-kit/__tests__/useDetailState.spec.ts
git commit -m "feat: add dialog and detail state primitives"
```

---

### Task 5: Query Table Workflow

**Files:**
- Create: `packages/el-kit/src/composables/useQueryTable.ts`
- Create: `packages/el-kit/__tests__/useQueryTable.spec.ts`
- Modify: `packages/el-kit/src/index.ts`

- [ ] **Step 1: Write failing query-table workflow tests**

Create `packages/el-kit/__tests__/useQueryTable.spec.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { defineTableColumns, useQueryTable } from '../src'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
}

const columns = defineTableColumns<User>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'right' },
])

describe('useQueryTable', () => {
  it('creates query, table, and pagination state without fetchList', async () => {
    const state = useQueryTable<User, Query>({
      columns,
      query: { keyword: '' },
    })

    expect(state.query.model.value).toEqual({ keyword: '' })
    expect(state.table.columns.value).toHaveLength(2)
    expect(state.table.data.value).toEqual([])
    expect(state.pagination.currentPage.value).toBe(1)

    await state.refresh()

    expect(state.table.data.value).toEqual([])
    expect(state.loading.value).toBe(false)
  })

  it('fetches list data and updates table plus pagination', async () => {
    const fetchList = vi.fn(async (request: { query: Query, currentPage: number, pageSize: number }) => ({
      data: [{ name: request.query.keyword || 'Tom', age: 18 }],
      total: 1,
    }))

    const state = useQueryTable<User, Query>({
      columns,
      fetchList,
      query: { keyword: '' },
    })

    state.query.setField('keyword', 'Jerry')
    await state.submit()

    expect(fetchList).toHaveBeenCalledWith({
      currentPage: 1,
      pageSize: 10,
      query: { keyword: 'Jerry' },
    })
    expect(state.table.data.value).toEqual([{ name: 'Jerry', age: 18 }])
    expect(state.pagination.total.value).toBe(1)
    expect(state.loading.value).toBe(false)
  })

  it('resets query and page before fetching again', async () => {
    const fetchList = vi.fn(async () => ({
      data: [{ name: 'Tom', age: 18 }],
      total: 1,
    }))

    const state = useQueryTable<User, Query>({
      columns,
      fetchList,
      query: { keyword: '' },
    })

    state.query.setField('keyword', 'changed')
    state.pagination.setPage(5)

    await state.reset()

    expect(state.query.model.value).toEqual({ keyword: '' })
    expect(state.pagination.currentPage.value).toBe(1)
    expect(fetchList).toHaveBeenLastCalledWith({
      currentPage: 1,
      pageSize: 10,
      query: { keyword: '' },
    })
  })

  it('runs immediate fetch when requested', async () => {
    const fetchList = vi.fn(async () => ({
      data: [{ name: 'Tom', age: 18 }],
      total: 1,
    }))

    const state = useQueryTable<User, Query>({
      columns,
      fetchList,
      immediate: true,
      query: { keyword: '' },
    })

    await state.pending

    expect(fetchList).toHaveBeenCalledTimes(1)
    expect(state.table.data.value).toEqual([{ name: 'Tom', age: 18 }])
  })
})
```

- [ ] **Step 2: Run the query-table test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/useQueryTable.spec.ts
```

Expected: FAIL because `useQueryTable` is not exported.

- [ ] **Step 3: Implement `useQueryTable`**

Create `packages/el-kit/src/composables/useQueryTable.ts`:

```ts
import type { Ref } from 'vue'
import type { QueryState } from './useQueryState'
import type { PaginationState } from './usePaginationState'
import type { TableColumn, TableState } from './useTable'
import { shallowRef } from 'vue'
import { usePaginationState } from './usePaginationState'
import { useQueryState } from './useQueryState'
import { useTable } from './useTable'

export type MaybePromise<T> = T | Promise<T>

export interface QueryTableRequest<Query extends object> {
  query: Query
  currentPage: number
  pageSize: number
}

export interface QueryTableResult<Row extends object> {
  data: readonly Row[]
  total: number
}

export interface UseQueryTableOptions<Row extends object, Query extends object> {
  query: Query
  columns: readonly TableColumn<Row>[]
  fetchList?: (
    request: QueryTableRequest<Query>,
  ) => MaybePromise<QueryTableResult<Row>>
  immediate?: boolean
  pageSize?: number
}

export interface QueryTableState<Row extends object, Query extends object> {
  query: QueryState<Query>
  table: TableState<Row>
  pagination: PaginationState
  loading: Ref<boolean>
  pending: Promise<void> | undefined
  submit: () => Promise<void>
  reset: () => Promise<void>
  refresh: () => Promise<void>
}

function cloneQuery<Query extends object>(query: Query): Query {
  return { ...query }
}

export function useQueryTable<Row extends object, Query extends object>(
  options: UseQueryTableOptions<Row, Query>,
): QueryTableState<Row, Query> {
  const query = useQueryState<Query>({
    model: options.query,
  })
  const pagination = usePaginationState({
    pageSize: options.pageSize ?? 10,
  })
  const loading = shallowRef(false)
  const table = useTable<Row>({
    columns: options.columns,
    data: [],
    loading,
    pagination: {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      total: pagination.total,
    },
  })

  async function refresh() {
    if (!options.fetchList) {
      loading.value = false
      return
    }

    loading.value = true

    try {
      const result = await options.fetchList({
        currentPage: pagination.currentPage.value,
        pageSize: pagination.pageSize.value,
        query: cloneQuery(query.model.value),
      })
      table.setData([...result.data])
      pagination.setTotal(result.total)
    }
    finally {
      loading.value = false
    }
  }

  async function submit() {
    pagination.resetPage()
    await refresh()
  }

  async function reset() {
    query.reset()
    pagination.resetPage()
    await refresh()
  }

  const state: QueryTableState<Row, Query> = {
    loading,
    pagination,
    pending: undefined,
    query,
    refresh,
    reset,
    submit,
    table,
  }

  if (options.immediate) {
    state.pending = refresh()
  }

  return state
}
```

- [ ] **Step 4: Export query-table workflow API**

Modify `packages/el-kit/src/index.ts`:

```ts
export { useQueryTable } from './composables/useQueryTable'
export type {
  MaybePromise,
  QueryTableRequest,
  QueryTableResult,
  QueryTableState,
  UseQueryTableOptions,
} from './composables/useQueryTable'
```

- [ ] **Step 5: Run query-table tests and verify they pass**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__/useQueryTable.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Run all el-kit unit tests**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__
```

Expected: PASS.

- [ ] **Step 7: Commit Task 5**

Run:

```bash
git add packages/el-kit/src/composables/useQueryTable.ts packages/el-kit/src/index.ts packages/el-kit/__tests__/useQueryTable.spec.ts
git commit -m "feat: add query table workflow"
```

---

### Task 6: Consumer Type Coverage

**Files:**
- Modify: `packages/el-kit/__tests__/consumer-dist.typecheck.ts`

- [ ] **Step 1: Add consumer type coverage for new APIs**

Modify `packages/el-kit/__tests__/consumer-dist.typecheck.ts` imports to include:

```ts
import {
  defineFormSchema,
  defineQuerySchema,
  defineTableColumns,
  useDetailState,
  useDialogFormState,
  usePaginationState,
  useQueryForm,
  useQueryState,
  useQueryTable,
  useTable,
} from '@fizz/el-kit'
```

Append these checks before the final `void` block:

```ts
const paginationState = usePaginationState({ pageSize: 20 })
paginationState.setPage(2)
paginationState.resetPage()

const queryState = useQueryState<Query>({
  model: { keyword: '', enabled: false },
})
queryState.setField('enabled', true)
// @ts-expect-error query state should preserve field value types
queryState.setField('enabled', 'yes')

interface UserForm {
  name: string
  age: number
}

const dialogFormState = useDialogFormState<UserForm, User>({
  createModel: () => ({ name: '', age: 0 }),
  toFormModel: user => ({ name: user.name, age: user.age }),
})
dialogFormState.openCreate()
dialogFormState.openEdit({ name: 'Tom', age: 18 })

const detailState = useDetailState<User>()
detailState.open({ name: 'Tom', age: 18 })

const queryTableState = useQueryTable<User, Query>({
  columns: helperColumns,
  query: { keyword: '', enabled: false },
  fetchList: async request => ({
    data: [{ name: request.query.keyword || 'Tom', age: 18 }],
    total: 1,
  }),
})

async function exerciseCrudApis() {
  await queryTableState.submit()
}
```

Add these to the final `void` block:

```ts
void paginationState
void queryState
void dialogFormState
void detailState
void queryTableState
void exerciseCrudApis
```

- [ ] **Step 2: Run consumer typecheck and verify it fails before exports are built**

Run:

```bash
pnpm --filter @fizz/el-kit typecheck:consumer
```

Expected before Task 1-5 exports: FAIL. Expected after Task 1-5 exports: PASS.

- [ ] **Step 3: Commit Task 6**

Run:

```bash
git add packages/el-kit/__tests__/consumer-dist.typecheck.ts
git commit -m "test: cover el-kit CRUD consumer types"
```

---

### Task 7: Playground CRUD Page Conversion

**Files:**
- Modify: `playground/src/views/CrudPage.vue`
- Modify: `playground/__tests__/integration.spec.ts`

- [ ] **Step 1: Capture the current playground build**

Run:

```bash
pnpm -C playground build
```

Expected: PASS before editing.

- [ ] **Step 2: Replace manual CRUD state with kit composables**

Modify the script block in `playground/src/views/CrudPage.vue` so it imports:

```ts
import {
  defineFecDetailSchema,
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
  FecDetail,
  FecDialogForm,
  FecPage,
  FecQueryTable,
  FecSection,
} from '@fizz/el-comps'
import {
  useDetailState,
  useDialogFormState,
  useQueryTable,
} from '@fizz/el-kit'
import { computed, ref } from 'vue'
```

Replace manual `queryModel`, `filteredUsers`, `pagination`, `dialogVisible`, `dialogMode`, `editingUser`, `dialogModel`, `detailVisible`, and `detailRecord` with:

```ts
const list = useQueryTable<User, Query>({
  columns,
  fetchList: ({ query }) => {
    const data = users.value.filter((u) => {
      if (query.keyword && !u.name.includes(query.keyword))
        return false
      if (query.status && u.status !== query.status)
        return false
      return true
    })

    return {
      data,
      total: data.length,
    }
  },
  immediate: true,
  query: { keyword: '', status: '' },
})

const dialog = useDialogFormState<UserForm, User>({
  createModel: () => ({ name: '', age: 0 }),
  toFormModel: user => ({ name: user.name, age: user.age }),
})

const detail = useDetailState<User>()

const dialogTitle = computed(() =>
  dialog.mode.value === 'create' ? '新建用户' : '编辑用户',
)
```

Replace handlers with:

```ts
function openCreate() {
  dialog.openCreate()
}

function openEdit(row: User) {
  dialog.openEdit(row)
}

async function handleConfirm(model: UserForm) {
  if (dialog.mode.value === 'create') {
    users.value.push({ id: nextId++, status: 'enabled', ...model })
  }
  else if (dialog.editingRecord.value) {
    Object.assign(dialog.editingRecord.value, model)
  }

  dialog.close()
  await list.refresh()
}

function openDetail(row: User) {
  detail.open(row)
}

function handleRowAction(key: string, row: User) {
  if (key === 'edit')
    openEdit(row)
  else if (key === 'detail')
    openDetail(row)
}
```

- [ ] **Step 3: Update the template bindings**

Modify the `FecQueryTable` usage:

```vue
<FecQueryTable
  :query="list.query.model.value"
  :query-schema="querySchema"
  :columns="list.table.columns.value"
  :data="list.table.data.value"
  :loading="list.loading.value"
  :pagination="list.pagination"
  :toolbar-actions="[{ key: 'create', label: '新建用户', type: 'primary' }]"
  :row-actions="[
    { key: 'edit', label: '编辑' },
    { key: 'detail', label: '详情' },
  ]"
  submit-text="查询"
  reset-text="重置"
  @update:query="list.query.setModel"
  @submit="list.submit"
  @reset="list.reset"
  @toolbar-action="(key) => key === 'create' && openCreate()"
  @row-action="handleRowAction"
/>
```

Modify the dialog:

```vue
<FecDialogForm
  :model-value="dialog.visible.value"
  :model="dialog.model.value"
  :title="dialogTitle"
  :schema="formSchema"
  :rules="formRules"
  @update:model-value="(value) => { value ? undefined : dialog.close() }"
  @update:model="dialog.setModel"
  @confirm="handleConfirm"
  @cancel="dialog.close"
/>
```

Modify the detail dialog:

```vue
<FeDialog
  :model-value="detail.visible.value"
  title="用户详情"
  width="480px"
  @update:model-value="(value) => { value ? undefined : detail.close() }"
>
  <FecDetail
    v-if="detail.record.value"
    :record="detail.record.value"
    :schema="detailSchema"
    :columns="1"
  />
  <template #footer>
    <FeButton @click="detail.close">
      关闭
    </FeButton>
  </template>
</FeDialog>
```

- [ ] **Step 4: Run playground build and fix template type issues**

Run:

```bash
pnpm -C playground build
```

Expected: PASS. If Vue template unwrapping rejects `.value` on nested refs, expose local computed aliases in the script:

```ts
const queryModel = computed(() => list.query.model.value)
const tableColumns = computed(() => list.table.columns.value)
const tableData = computed(() => list.table.data.value)
const tableLoading = computed(() => list.loading.value)
```

Then bind to those aliases in the template.

- [ ] **Step 5: Run integration tests**

Run:

```bash
pnpm exec vitest run playground/__tests__/integration.spec.ts
```

Expected: PASS. Keep the assertions focused on the same user-visible CRUD page behavior: the page title renders, the query table renders, and the create/detail controls are present.

- [ ] **Step 6: Commit Task 7**

Run:

```bash
git add playground/src/views/CrudPage.vue playground/__tests__/integration.spec.ts
git commit -m "refactor: consume el-kit CRUD state in playground"
```

---

### Task 8: Final Verification

**Files:**
- No source files expected beyond previous tasks.

- [ ] **Step 1: Run focused el-kit verification**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__
pnpm --filter @fizz/el-kit typecheck
pnpm --filter @fizz/el-kit typecheck:consumer
```

Expected: all commands exit 0.

- [ ] **Step 2: Run comps and playground verification**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm -C playground build
```

Expected: all commands exit 0.

- [ ] **Step 3: Run repository verification**

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 4: Inspect public exports**

Run:

```bash
rg -n "usePaginationState|useQueryState|useDialogFormState|useDetailState|useQueryTable" packages/el-kit/dist/index.d.ts packages/el-kit/src/index.ts
```

Expected: every new public API appears in both source exports and generated declarations after build.

- [ ] **Step 5: Commit verification-only adjustments**

If verification required small fixes, commit them:

```bash
git add packages/el-kit packages/el-comps playground
git commit -m "fix: polish CRUD headless verification"
```

If there were no changes, do not create an empty commit.

---

## Follow-Up Plan

After this plan is merged, write a separate plan for the `packages/el-comps/src/components` directory restructure. That plan should be mechanical: move each component into its own directory, move shared helpers under `components/shared`, update imports, and verify no runtime behavior changes.
