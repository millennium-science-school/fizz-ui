# el-kit CRUD Headless Layer Design

## Goal

Make `@fizz/el-kit` carry the reusable CRUD state and workflow layer that
`@fizz/el-comps` can render.

The current `@fizz/el-comps` components can build a typical admin page, but the
consumer still writes a large amount of repeated glue code:

- query model state;
- query submit and reset handlers;
- table data, loading, and pagination state;
- create/edit dialog visibility and mode;
- form model initialization and confirm handling;
- current detail record and detail dialog visibility.

That is the wrong long-term shape. `@fizz/el-comps` should not become a state
framework, but `@fizz/el-kit` should provide headless composables that make the
same CRUD page easy to assemble.

The target direction is:

```text
el-kit    -> state, workflow, request orchestration, shared headless contracts
el-comps  -> Vue rendering, layout, dialogs, tables, schema fields
playground/business -> domain data, API calls, copy, page-specific decisions
```

## Scope

Included:

- Add small A-level state primitives to `@fizz/el-kit`.
- Add B-level workflow composables on top of those primitives.
- Keep all new `@fizz/el-kit` APIs headless: no Vue component references, no
  `@fizz/el-plus`, and no `@fizz/el-comps` imports.
- Preserve the existing schema protocol and `define*` helper direction.
- Let `@fizz/el-comps` consume the new kit APIs in examples and future
  composites.
- Define where the `packages/el-comps/src/components` directory restructuring
  should happen.
- Add consumer type coverage for the intended developer ergonomics.

Excluded:

- A full CRUD configuration framework as the first step.
- Permission systems.
- Remote schema loading.
- Async select option loading.
- Router integration.
- Cache libraries, retry policies, or transport clients.
- Optimistic update strategies.
- Bulk actions beyond exposing selection state and callbacks.
- Visual redesign or new theme tokens.

## Current State

`@fizz/el-kit` currently contains:

- `useQueryForm`
- `useTable`
- field schema types and `defineFormSchema` / `defineQuerySchema`
- table column types and `defineTableColumns`

This is useful but incomplete. In the playground CRUD page, the business code
still directly owns almost the entire CRUD flow:

- filtering users;
- pagination object creation;
- query reset behavior;
- dialog mode;
- editing record;
- detail record;
- manual create/edit confirm behavior.

`@fizz/el-comps` currently contains the rendered building blocks:

- `FecPage`
- `FecSection`
- `FecStack`
- `FecToolbar`
- `FecForm`
- `FecQueryForm`
- `FecTable`
- `FecQueryTable`
- `FecDialogForm`
- `FecDrawerForm`
- `FecDetail`

The components are now useful, but their files are flat under
`packages/el-comps/src/components`. That was acceptable for the first wave, but
it will not scale once each component gets dedicated props, emits, tests, and
helpers.

## Layering Decision

The A/B/C model is intentionally progressive.

### A. State Primitives

A-level APIs are the required core of `@fizz/el-kit`. They own small pieces of
state and expose simple operations.

They should be stable and independently useful:

- `usePaginationState`
- `useQueryState`
- `useTable` (existing primitive, aligned with the new design)
- `useDialogFormState`
- `useDetailState`

These primitives do not fetch data and do not know about CRUD services. They
exist to remove repeated local state wiring.

### B. Workflow Composables

B-level APIs are standard workflows composed from A-level primitives.

They may accept business functions such as `fetchList`, `create`, `update`, or
`remove`, and they may own loading flags and refresh sequencing.

They should still be headless:

- no render component imports;
- no Element Plus types;
- no DOM assumptions;
- no forced API client implementation.

Candidate B-level APIs:

- `useQueryTable`
- `useCrudList`
- `useDialogForm`
- `useCrudMutation`

The first implementation should probably focus on `useQueryTable` and
`useDialogForm`, because those remove the most visible boilerplate in the
current playground.

### C. CRUD Configuration Facade

C-level APIs are higher-level facades such as `useCrud()`.

They can be valuable later, but they should not be the first stable public API.
They tend to lock in assumptions about API shape, action layout, detail display,
dialog behavior, and permissions.

The right path is:

1. Build A primitives.
2. Build B workflows.
3. Use playground and `@fizz/el-comps` examples to discover recurring C-level
   configuration patterns.
4. Add `useCrud()` only if it can be a thin composition of B-level APIs.

## Public API Sketch

The exact names can still change during implementation, but the shape should
stay close to this.

### Pagination

```ts
export interface PaginationState {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotal: (total: number) => void
  resetPage: () => void
}

export interface UsePaginationStateOptions {
  currentPage?: MaybeRefOrGetter<number>
  pageSize?: MaybeRefOrGetter<number>
  total?: MaybeRefOrGetter<number>
}

export function usePaginationState(options?: UsePaginationStateOptions): PaginationState
```

This should reuse or align with the pagination state currently inside
`useTable`.

### Query

```ts
export interface QueryState<Query extends object> {
  model: Ref<Query>
  initialModel: Query
  setField: <K extends keyof Query>(field: K, value: Query[K]) => void
  setModel: (model: Query) => void
  reset: () => void
}

export interface UseQueryStateOptions<Query extends object> {
  model: MaybeRefOrGetter<Query>
  initialModel?: Query
}

export function useQueryState<Query extends object>(
  options: UseQueryStateOptions<Query>,
): QueryState<Query>
```

`useQueryForm` can either be refactored to build on this or kept as a validation
specialization. The implementation should avoid two separate query model state
machines.

### Table

```ts
export interface TableState<Row extends object> {
  columns: Ref<readonly TableColumn<Row>[]>
  data: Ref<Row[]>
  loading: Ref<boolean>
  pagination: PaginationState
  setColumns: (columns: readonly TableColumn<Row>[]) => void
  setData: (data: Row[]) => void
  setLoading: (loading: boolean) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotal: (total: number) => void
  resetPage: () => void
}

export function useTable<Row extends object>(
  options: UseTableOptions<Row>,
): TableState<Row>
```

The existing `useTable` is kept as the public primitive name. Its pagination
handling is refactored to delegate to `usePaginationState` internally.

### Dialog Form

```ts
export type DialogFormMode = 'create' | 'edit'

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

export interface UseDialogFormStateOptions<Form extends object, Row extends object = Form> {
  createModel: () => Form
  toFormModel?: (record: Row) => Form
}
```

This removes the most common duplicated dialog code while staying independent
from `FecDialogForm`.

### Detail

```ts
export interface DetailState<Row extends object> {
  visible: Ref<boolean>
  record: Ref<Row | undefined>
  open: (record: Row) => void
  close: () => void
  clear: () => void
}

export function useDetailState<Row extends object>(): DetailState<Row>
```

This is intentionally small. It should not become a description layout engine.

### Query Table Workflow

```ts
export interface QueryTableRequest<Query extends object> {
  query: Query
  currentPage: number
  pageSize: number
}

export interface QueryTableResult<Row extends object> {
  data: readonly Row[]
  total: number
}

export type MaybePromise<T> = T | Promise<T>

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
  submit: () => Promise<void>
  reset: () => Promise<void>
  refresh: () => Promise<void>
}
```

`fetchList` should be optional so the workflow can still support local data or
externally controlled data during early adoption.

## el-comps Consumption

`@fizz/el-comps` should not import new APIs just to hide state by default.

Instead, examples and optional future composites should show the intended
composition:

```ts
const list = useQueryTable<User, Query>({
  query: { keyword: '', status: '' },
  columns,
  fetchList,
})

const form = useDialogFormState<UserForm, User>({
  createModel: () => ({ name: '', age: 0 }),
  toFormModel: user => ({ name: user.name, age: user.age }),
})

const detail = useDetailState<User>()
```

Then render with existing components:

```vue
<FecQueryTable
  :query="list.query.model.value"
  :query-schema="querySchema"
  :columns="list.table.columns.value"
  :data="list.table.data.value"
  :loading="list.loading.value"
  :pagination="list.pagination"
  @update:query="list.query.setModel"
  @submit="list.submit"
  @reset="list.reset"
/>
```

If this is too verbose in templates, `@fizz/el-comps` may later provide a thin
adapter helper, but the first step should keep state ownership visible.

## Component Directory Restructure

The directory restructure is valid, but it should happen after the kit CRUD API
shape is written down and before adding more component features.

Target structure:

```text
packages/el-comps/src/components/
  FecForm/
    FecForm.vue
    props.ts
    index.ts
  FecQueryForm/
    FecQueryForm.vue
    props.ts
    index.ts
  FecTable/
    FecTable.vue
    props.ts
    tableColumns.ts
    index.ts
  FecQueryTable/
    FecQueryTable.vue
    props.ts
    index.ts
  FecDialogForm/
    FecDialogForm.vue
    props.ts
    index.ts
  FecDrawerForm/
    FecDrawerForm.vue
    props.ts
    index.ts
  FecDetail/
    FecDetail.vue
    props.ts
    index.ts
  shared/
    actionTypes.ts
    controls.ts
    schemaFields.ts
    types.ts
```

Rules:

- Each public component owns its `.vue`, props helpers, and local exports.
- Shared render helpers move under `shared/`.
- Public package exports still come from `packages/el-comps/src/index.ts`.
- Runtime behavior should not change during this restructure.
- Tests should keep passing before and after the move.

This should be a separate mechanical phase. Mixing it with CRUD workflow logic
would make review harder and increase the chance of accidental behavior drift.

## Implementation Order

1. Add `usePaginationState` and refactor `useTable` to share pagination
   behavior or clearly separate table and pagination responsibilities.
2. Add `useQueryState` and align `useQueryForm` with it.
3. Add `useDialogFormState` and `useDetailState`.
4. Add `useQueryTable` as the first B-level workflow.
5. Update `playground/src/views/CrudPage.vue` to prove boilerplate reduction.
6. Add consumer type tests for helper ergonomics and template compatibility.
7. Restructure `packages/el-comps/src/components` into per-component
   directories without changing runtime behavior.
8. Decide whether `FecQueryTable` needs a small adapter helper after real usage.

## Testing

Focused checks for the kit layer:

```bash
pnpm exec vitest run packages/el-kit/__tests__
pnpm --filter @fizz/el-kit typecheck
pnpm --filter @fizz/el-kit typecheck:consumer
```

Focused checks for comps consumption:

```bash
pnpm exec vitest run packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm -C playground build
```

Before merging:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

## Design Constraints

- `@fizz/el-kit` must stay headless.
- `@fizz/el-kit` must not import Vue components, Element Plus components, or
  `@fizz/el-comps`.
- `@fizz/el-comps` should continue importing Element Plus only through
  `@fizz/el-plus`.
- A-level primitives should remain small enough to be useful outside CRUD
  pages.
- B-level workflows should be optional; consumers must still be able to use A
  primitives directly.
- C-level facades should wait until real examples show stable repetition.

## Decisions

1. Keep `useTable` as the public primitive name and internally align it with
   the `usePaginationState` design. No rename or compatibility export needed.
2. `useQueryTable` supports optional `fetchList` from the start, making it
   useful for both local data and remote data without a breaking change later.
3. Convert `CrudPage.vue` first, then do the component directory restructure as
   a separate mechanical follow-up plan.
