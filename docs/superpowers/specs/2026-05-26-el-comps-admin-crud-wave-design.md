# el-comps Admin CRUD Wave Design

## Goal

Build the first substantial `@fizz/el-comps` component wave around high-frequency
admin CRUD pages.

The target workflow is:

```text
page layout -> query form -> toolbar -> data table -> pagination
            -> create/edit dialog or drawer form -> simple detail display
```

This wave should prove that the current `@fizz/el-plus`, `@fizz/el-kit`,
`@fizz/theme`, and release-check infrastructure can support real composite
business surfaces without turning `@fizz/el-comps` into a full application
framework.

## Scope

Included:

- Add focused layout containers for admin pages.
- Add standalone schema-driven form and query form components.
- Replace the current experimental `FecTable` and `FecQueryTable` contracts with
  the new CRUD-oriented contracts.
- Add a data table component with pagination, toolbar integration, selection,
  and row actions.
- Add dialog and drawer form composites for create/edit flows.
- Add a simple detail display component for read-only record views.
- Add a complete playground CRUD page that exercises the component wave.
- Keep all components controlled: data, query, form models, pagination, and
  visibility are owned by the consumer and updated through events.
- Keep remote fetching, persistence, and permissions outside `@fizz/el-comps`.

Excluded:

- Async option loading.
- Remote schema loading.
- Data fetching clients or request state machines.
- Permission systems.
- Tree tables, upload workflows, transfer, wizard/steps, calendar, or other
  lower-frequency admin widgets.
- Visual redesign or new theme token decisions.
- Full form designer or dynamic schema parser.
- Backward compatibility for the current experimental `FecTable` and
  `FecQueryTable` form/table contracts.

## Current State

`@fizz/el-comps` currently exposes only `FecTable` and `FecQueryTable`. Those
components were useful as integration experiments, but their contracts are not
the right long-term boundary:

- `FecTable` currently mixes a form, table, and pagination.
- `FecQueryTable` mixes query form, action buttons, table, loading directive,
  and pagination.
- Shared form rendering exists in `schemaFields.ts`, but there is no standalone
  public form component.
- `FieldControlKind`, `FieldOption`, `FormSchemaItem`, and `QuerySchemaItem`
  now live in `@fizz/el-kit`, so the next step should build real composite
  surfaces on that protocol.

The current experimental `FecTable` and `FecQueryTable` may be replaced
directly. This is acceptable because the package has not yet established those
contracts as stable consumer APIs.

## Architecture

The wave is split into four component groups:

1. Layout containers
2. Schema forms
3. Data display and actions
4. CRUD flow composites

Each group should be independently testable and exported from `@fizz/el-comps`.

### Layout Containers

Add:

- `FecPage`
- `FecSection`
- `FecStack`
- `FecToolbar`

`FecPage` is the admin page shell. It provides a stable root class, optional
title, optional description, optional extra area, and default slot.

`FecSection` is a page section. It provides title, optional description, optional
extra area, and default slot.

`FecStack` is a low-level spacing primitive. It supports vertical or horizontal
layout and spacing presets, but no business behavior.

`FecToolbar` is the common CRUD action bar. It supports left and right slots and
an optional action list. It should not own permissions or remote behavior.

### Schema Forms

Add:

- `FecForm`
- `FecQueryForm`

`FecForm` renders `FecFormSchemaItem<T>[]` against a controlled model. It uses
the existing `FieldControlKind` protocol for built-in fields and the existing
custom Vue component escape hatch in `@fizz/el-comps`.

`FecQueryForm` renders `FecQuerySchemaItem<T>[]` and emits `submit`, `reset`,
and `update:model` events. It owns button placement and labels, but it does not
fetch data.

Both components should reuse `schemaFields.ts` internally.

### Data Display And Actions

Replace `FecTable` with a pure data table contract:

- data table only;
- optional pagination;
- optional loading;
- optional selection;
- optional toolbar;
- optional row actions;
- no embedded form or query form.

The renamed contract may keep the `FecTable` export name, but its behavior
should be the new data-table behavior. The old form/table behavior should not be
preserved.

Add:

- `FecDetail`

`FecDetail` is a simple read-only record display. It accepts a schema of
label/prop/formatter items, a record, column count, and empty text. It should be
enough for common drawer/dialog/page detail views, but not a full layout engine.

### CRUD Flow Composites

Replace `FecQueryTable` with:

```text
FecQueryForm + FecToolbar + FecTable
```

`FecQueryTable` should become a high-level CRUD list page section, not a
one-off experimental query/table wrapper. It coordinates the query form, toolbar,
table, pagination, loading, selection, and events, but still does not fetch data.

Add:

- `FecDialogForm`
- `FecDrawerForm`

These components combine `FeDialog` or `FeDrawer` with `FecForm`. They are
controlled through `modelValue` and emit `update:modelValue`, `update:model`,
`confirm`, and `cancel`.

## Public API Sketch

### Actions

```ts
export interface FecActionItem<Context = unknown> {
  key: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  disabled?: boolean
  hidden?: boolean
  context?: Context
}

export interface FecRowAction<Row extends object> extends FecActionItem<Row> {
  onClick?: (row: Row, index: number) => void
}
```

Actions are UI metadata and events. They are not permission rules.

### Form

```ts
export interface FecFormProps<T extends object> {
  model: T
  schema: FecFormSchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
}
```

`FecForm` emits:

- `update:model`

`FecQueryForm` extends this with:

- `submit`
- `reset`

### Table

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

`FecTable` emits:

- `update:currentPage`
- `update:pageSize`
- `toolbar-action`
- `row-action`
- `selection-change`

### Query Table

```ts
export interface FecQueryTableProps<Row extends object, Query extends object> {
  query: Query
  querySchema: FecQuerySchemaItem<Query>[]
  queryRules?: QueryFormRules<Query>
  columns: FecTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: FecPagination
  toolbarActions?: FecActionItem[]
  rowActions?: FecRowAction<Row>[]
  selectable?: boolean
}
```

`FecQueryTable` emits:

- `update:query`
- `submit`
- `reset`
- `update:currentPage`
- `update:pageSize`
- `toolbar-action`
- `row-action`
- `selection-change`

## Data Flow

All components use controlled data flow:

```text
consumer state -> component props -> user interaction -> update/event -> consumer state
```

Components may compose events, but they must not fetch or mutate remote state.

Examples:

- `FecForm` emits a new model when a field changes.
- `FecDialogForm` emits `confirm` with the current model, but does not submit it
  to an API.
- `FecQueryTable` emits `submit` and pagination updates, but the consumer owns
  the actual data loading.

## Styling And Classes

This wave should add structural classes only. Theme values should continue to
come from `@fizz/theme` or application overrides.

Expected stable classes include:

- `fe-comps-page`
- `fe-comps-section`
- `fe-comps-stack`
- `fe-comps-toolbar`
- `fe-comps-form`
- `fe-comps-query-form`
- `fe-comps-table`
- `fe-comps-pagination`
- `fe-comps-detail`
- `fe-comps-dialog-form`
- `fe-comps-drawer-form`

Do not introduce a visual redesign in this phase. If a missing token blocks a
basic structural style, document it for a later theme phase instead of adding
ad hoc colors.

## Playground

Add a playground CRUD page that demonstrates:

- `FecPage`
- `FecSection`
- `FecQueryTable`
- toolbar create action;
- row edit/detail actions;
- `FecDialogForm` for create/edit;
- `FecDrawerForm` or `FecDetail` for detail display.

The playground may use local in-memory data. It should not call remote APIs.

## Validation

Focused verification:

```bash
pnpm exec vitest run packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm --filter @fizz/el-comps build
pnpm check:packages
```

Before reporting implementation complete, run the repository release path:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

## Roadmap Notes

After this wave, the project should have enough real composite surfaces to make
theme and visual-design decisions with useful context. The next likely phases
are:

1. theme polish for CRUD surfaces;
2. documentation/demo site work;
3. lower-frequency admin components such as tree table, upload workflows, or
   step/wizard flows.

Those later phases should not be mixed into this wave.
