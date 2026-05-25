# el-kit Field Schema Protocol Design

## Goal

Split headless field schema data from Vue render concerns before the next
`@fizz/el-comps` component expansion wave.

The immediate reason is that `FecFormSchemaItem.component` currently accepts
both semantic strings such as `input` and custom Vue component objects. That
couples the reusable data protocol to the rendering layer and makes
`@fizz/el-kit` hard to extend cleanly.

## Scope

Included:

- Add a field schema protocol to `@fizz/el-kit`.
- Use `kind` for semantic control names instead of `component`.
- Add synchronous select option metadata.
- Keep the field protocol free of Vue component types and Element Plus imports.
- Move composite schema types in `@fizz/el-comps` onto the `@fizz/el-kit`
  protocol.
- Keep custom Vue component escape hatches in `@fizz/el-comps` only.
- Render `select` schema options through `FeOption`.
- Remove the old semantic `component: 'input' | 'select' | ...` schema style.
- Remove legacy `ElInput` and `ElInputNumber` schema control names.
- Update tests and consumer type coverage to use the new schema shape.

Excluded:

- Async option loading.
- Remote schema loading.
- Full form layout or validation engine work.
- Promoting `placeholder`, `clearable`, `disabled`, or `multiple` into
  `@fizz/el-kit` first-class fields.
- Visual redesign or new theme tokens.
- New composite components beyond schema protocol support.

## Current State

`@fizz/el-kit` currently exposes `useTable`, `useQueryForm`, `TableColumn`, and
query form rule types. It does not own the form/query schema item protocol used
by `@fizz/el-comps`.

`@fizz/el-comps` owns:

- `FecBuiltinControlName` in `controls.ts`;
- `FecControl`, which mixes semantic strings, legacy Element Plus names, and a
  custom Vue component object;
- `FecFormSchemaItem<T>.component`;
- `FecQuerySchemaItem<T>.component`;
- `renderSchemaFields()`, which resolves that mixed `component` value into an
  actual `@fizz/el-plus` component.

This works for the current examples, but the field schema is not reusable as
headless data because it may contain Vue component references.

## Architecture

Add a small field schema protocol under `packages/el-kit/src/types/field.ts`:

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

`@fizz/el-kit` remains headless: these types are plain TypeScript data and do
not import Vue, Element Plus, or `@fizz/el-plus`.

`@fizz/el-comps` should extend this protocol for rendering:

```ts
export type FecFormSchemaItem<T extends object> =
  | (FormSchemaItem<T> & FecRenderFieldConfig)
  | FecCustomFormSchemaItem<T>

export type FecQuerySchemaItem<T extends object> =
  | (QuerySchemaItem<T> & FecRenderFieldConfig)
  | FecCustomQuerySchemaItem<T>
```

The render-only config is owned by `@fizz/el-comps`:

```ts
export interface FecRenderFieldConfig {
  fieldProps?: Record<string, unknown>
}

export interface FecCustomFormSchemaItem<T extends object> extends FecRenderFieldConfig {
  prop: Extract<keyof T, string>
  label: string
  component: Component
}
```

The built-in path uses `kind`. The custom path uses `component: Component`.
There is no mixed state where a single schema item can provide both `kind` and a
custom Vue component.

## Public API Contract

`@fizz/el-kit` should export:

```ts
export type {
  FieldControlKind,
  FieldOption,
  FormSchemaItem,
  QuerySchemaItem,
} from './types/field'
```

`@fizz/el-comps` should accept:

```ts
const schema: FecFormSchemaItem<User>[] = [
  {
    prop: 'status',
    label: 'Status',
    kind: 'select',
    options: [
      { label: 'Enabled', value: 'enabled' },
      { label: 'Disabled', value: 'disabled', disabled: true },
    ],
    fieldProps: { clearable: true },
  },
]
```

Custom controls are render-only:

```ts
const schema: FecFormSchemaItem<User>[] = [
  {
    prop: 'name',
    label: 'Name',
    component: CustomInput,
    fieldProps: { placeholder: 'Name' },
  },
]
```

These forms should no longer typecheck:

```ts
{ prop: 'name', label: 'Name', component: 'input' }
{ prop: 'name', label: 'Name', component: 'ElInput' }
```

This is intentionally a breaking cleanup. Existing `FecTable` and
`FecQueryTable` usages in the repository are development examples, not a
published compatibility boundary that should preserve a weak schema API.

## Rendering Rules

`@fizz/el-comps` maps `FieldControlKind` values to `@fizz/el-plus` components:

- `input` -> `FeInput`
- `number` -> `FeInputNumber`
- `select` -> `FeSelect`
- `date` -> `FeDatePicker` with `{ type: 'date' }`
- `switch` -> `FeSwitch`
- `textarea` -> `FeInput` with `{ type: 'textarea' }`

`fieldProps` are merged after built-in defaults so consumers can override
rendering details deliberately.

For `select`, `renderSchemaFields()` should render one `FeOption` per
`FieldOption`. Option values are synchronous arrays only. Async loading stays in
business code or a later explicit composable.

## Validation

Focused verification:

```bash
pnpm exec vitest run packages/el-kit/__tests__ packages/el-comps/__tests__
pnpm --filter @fizz/el-kit typecheck
pnpm --filter @fizz/el-kit typecheck:consumer
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
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

This phase is the prerequisite for the next `@fizz/el-comps` expansion wave.
After the protocol exists, expansion can add richer composite behavior without
pulling Vue component references into `@fizz/el-kit`.

The visual redesign remains deferred. New component surfaces should first prove
their schema, option, and update behavior; theme work should then style those
stable surfaces.
