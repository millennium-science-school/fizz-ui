# el-comps Component Directory Design

## Goal

Restructure `packages/el-comps/src/components` so each public component owns a
small directory with its component implementation, props/emits definitions, and
local export entry.

The current flat directory was acceptable for the first CRUD component wave,
but it is already hard to scan:

```text
components/
  FecForm.vue
  FecQueryForm.vue
  FecTable.vue
  FecQueryTable.vue
  FecDialogForm.vue
  FecDrawerForm.vue
  FecDetail.vue
  FecPage.vue
  FecSection.vue
  FecStack.vue
  FecToolbar.vue
  actionTypes.ts
  controls.ts
  schemaFields.ts
  tableColumns.ts
  types.ts
```

The next phase should make component ownership clearer before more CRUD or
layout components are added.

## Scope

Included:

- Move every public `Fec*` component into a kebab-case component directory.
- Add a local `index.ts` for each component directory.
- Add a local `props.ts` for each component directory where that component's
  runtime props/emits and facade props can live.
- Move shared cross-component helpers into `components/shared`.
- Keep package-root exports through `packages/el-comps/src/index.ts`.
- Preserve the current public API names.
- Preserve current runtime behavior.
- Preserve current tests and consumer type coverage.

Excluded:

- No new component features.
- No visual redesign.
- No public subpath exports such as `@fizz/el-comps/fec-form`.
- No package `exports` changes.
- No `@fizz/el-kit` API changes.
- No changes to `@fizz/el-plus` wrappers.
- No broad test rewrites beyond import path updates and optional structure
  assertions.

## Element Plus Reference

Element Plus organizes each component under a component directory with a local
entry and a `src` folder. A typical package-build output looks like:

```text
components/button/
  index.js
  index.d.ts
  src/
    button.vue...
    button.d.ts
    constants.d.ts
    instance.d.ts
    use-button...
  style/
    css.js
    index.js
```

The useful ideas for `@fizz/el-comps` are:

- component-level directories;
- local component entry files;
- props/types separated from implementation;
- shared utilities kept out of component implementation files.

The parts not worth copying yet are:

- `src/` nesting for every component;
- per-component style entry files;
- installation helpers;
- instance files for every component;
- deeply split internal hooks before the components need them.

`@fizz/el-comps` is a small composite component package, so the structure should
be a lightweight version of the Element Plus pattern.

## Target Structure

Use kebab-case directory names and PascalCase SFC filenames:

```text
packages/el-comps/src/components/
  fec-form/
    FecForm.vue
    index.ts
    props.ts
  fec-query-form/
    FecQueryForm.vue
    index.ts
    props.ts
  fec-table/
    FecTable.vue
    index.ts
    props.ts
    tableColumns.ts
  fec-query-table/
    FecQueryTable.vue
    index.ts
    props.ts
  fec-dialog-form/
    FecDialogForm.vue
    index.ts
    props.ts
  fec-drawer-form/
    FecDrawerForm.vue
    index.ts
    props.ts
  fec-detail/
    FecDetail.vue
    index.ts
    props.ts
  fec-page/
    FecPage.vue
    index.ts
    props.ts
  fec-section/
    FecSection.vue
    index.ts
    props.ts
  fec-stack/
    FecStack.vue
    index.ts
    props.ts
  fec-toolbar/
    FecToolbar.vue
    index.ts
    props.ts
  shared/
    actionTypes.ts
    controls.ts
    schemaFields.ts
    types.ts
```

## Component Directory Contract

Each component directory has one local entry:

```ts
// components/fec-form/index.ts
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

The package root imports component facades from these local entries:

```ts
export { FecForm } from './components/fec-form'
export type { FecFormProps } from './components/fec-form'
```

This keeps generic facade detail close to the component instead of centralizing
all component casting in `packages/el-comps/src/index.ts`.

## Props And Shared Types

`props.ts` should own types specific to one component.

Examples:

- `fec-form/props.ts`: `FecFormProps<T>`
- `fec-query-form/props.ts`: `FecQueryFormProps<T>`
- `fec-table/props.ts`: `FecTableProps<Row>`, `FecPagination`
- `fec-query-table/props.ts`: `FecQueryTableProps<Row, Query>`
- `fec-detail/props.ts`: `FecDetailProps<T>`, `FecDetailSchemaItem<T>`,
  `FecLooseDetailSchemaItem`, `defineFecDetailSchema`
- `fec-dialog-form/props.ts`: `FecDialogFormProps<T>`
- `fec-drawer-form/props.ts`: `FecDrawerFormProps<T>`
- `fec-toolbar/props.ts`: `FecToolbarProps` if a named props type is needed

`shared/types.ts` should keep cross-component schema and field rendering types:

- `FecFormModel`
- `FecQueryModel`
- `FecRenderFieldConfig`
- `FecBuiltinFormSchemaItem<T>`
- `FecBuiltinQuerySchemaItem<T>`
- `FecCustomFormSchemaItem<T>`
- `FecCustomQuerySchemaItem<T>`
- `FecFormSchemaItem<T>`
- `FecQuerySchemaItem<T>`
- `FecTableColumn<T>`
- `FecQueryTableColumn<T>` if it remains as an alias
- `defineFecFormSchema`
- `defineFecQuerySchema`
- `defineFecTableColumns`

`shared/actionTypes.ts` remains the common action protocol:

- `FecActionType`
- `FecActionItem`
- `FecRowAction`

`shared/schemaFields.ts` and `shared/controls.ts` remain shared render helpers
for form and query-form components.

## Root Export Contract

`packages/el-comps/src/index.ts` should become an aggregator:

```ts
export { FecForm } from './components/fec-form'
export { FecQueryForm } from './components/fec-query-form'
export { FecTable } from './components/fec-table'
export { FecQueryTable } from './components/fec-query-table'
export { FecDialogForm } from './components/fec-dialog-form'
export { FecDrawerForm } from './components/fec-drawer-form'
export { FecDetail } from './components/fec-detail'
export { FecPage } from './components/fec-page'
export { FecSection } from './components/fec-section'
export { FecStack } from './components/fec-stack'
export { FecToolbar } from './components/fec-toolbar'

export type { FecActionItem, FecActionType, FecRowAction } from './components/shared/actionTypes'
export {
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
} from './components/shared/types'
export { defineFecDetailSchema } from './components/fec-detail'
```

The root file should not import `.vue` files directly after the restructure.

## No Subpath Exports

Do not add package subpath exports in this phase.

Consumers continue to use:

```ts
import { FecForm, FecQueryTable } from '@fizz/el-comps'
```

The new directory layout may later support:

```ts
import { FecForm } from '@fizz/el-comps/fec-form'
```

but that is intentionally out of scope. Keeping only the root export avoids
locking subpath API names before the component organization proves stable.

## Migration Strategy

This should be a mechanical refactor with no behavior changes.

Recommended sequence:

1. Move shared files first:
   - `actionTypes.ts` -> `shared/actionTypes.ts`
   - `controls.ts` -> `shared/controls.ts`
   - `schemaFields.ts` -> `shared/schemaFields.ts`
   - `types.ts` -> `shared/types.ts`
2. Move the low-dependency layout components:
   - `FecPage`
   - `FecSection`
   - `FecStack`
   - `FecToolbar`
3. Move form components:
   - `FecForm`
   - `FecQueryForm`
4. Move table components:
   - `FecTable`
   - `FecQueryTable`
5. Move dialog/detail components:
   - `FecDialogForm`
   - `FecDrawerForm`
   - `FecDetail`
6. Replace root `src/index.ts` with aggregator exports.
7. Update tests and internal imports.
8. Run the full verification path.

This order keeps shared import churn controlled and reduces the chance of
cyclic imports.

## Testing

Focused checks:

```bash
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm exec vitest run packages/el-comps/__tests__
pnpm -C playground build
```

Repository checks before completion:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ packages/el-kit/__tests__ packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

Add a lightweight structure assertion if useful:

```ts
expect(readFileSync('packages/el-comps/src/index.ts', 'utf8')).not.toContain('.vue')
expect(existsSync('packages/el-comps/src/components/fec-form/index.ts')).toBe(true)
expect(existsSync('packages/el-comps/src/components/shared/types.ts')).toBe(true)
```

This should complement, not replace, runtime and consumer type tests.

## Risks

The main risk is broken internal relative imports after moving files. Keep the
refactor mechanical and commit in small chunks so failures are easy to isolate.

The second risk is accidentally changing the public declaration surface while
moving generic component facades out of the root entry. `typecheck:consumer` and
`check:packages` must stay green before this is considered complete.

The third risk is exporting too much from component-local `props.ts` files. Keep
root exports explicit and consumer-oriented; local implementation helpers should
stay local.

## Decisions

- Use kebab-case component directory names.
- Use PascalCase SFC filenames.
- Keep only root package exports for now.
- Move component generic facades from the root entry into component-local
  `index.ts` files.
- Split component-specific props from shared cross-component protocol types.
- Do this as a behavior-preserving refactor before adding more `el-comps`
  features.
