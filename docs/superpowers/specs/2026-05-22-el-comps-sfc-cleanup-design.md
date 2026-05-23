# el-comps SFC Cleanup Design

## Goal

Migrate the two `@fizz/el-comps` composite components from TSX to SFCs and
remove duplicated rendering logic without changing their public API or runtime
contracts.

This is the first follow-up after the 2026-05-15 architecture fixes. It keeps
the scope deliberately small so later release, theme, component expansion, and
documentation work can build on a clearer component structure.

## Scope

Included:

- Convert `FecTable` from `packages/el-comps/src/components/FecTable.tsx` to an
  SFC.
- Convert `FecQueryTable` from
  `packages/el-comps/src/components/FecQueryTable.tsx` to an SFC.
- Share the repeated schema-control rendering path between both components.
- Share the repeated table-column rendering path between both components.
- Preserve all existing public exports from `packages/el-comps/src/index.ts`.
- Keep existing tests passing and add focused migration regression coverage
  where behavior is currently implicit.

Excluded:

- New composite components.
- New `FecControl` names or control resolver behavior.
- Theme/token redesign.
- Release hardening, CI changes, or package publishing changes.
- Playground or documentation site expansion.

## Architecture

`controls.ts` remains the single control resolver entry point. The migration
should keep control resolution small and consumer-oriented: a schema item names
a semantic control or custom component, the shared rendering helper resolves it,
and the owning component provides the model update callback.

The two public components become SFC entry points:

- `packages/el-comps/src/components/FecTable.vue`
- `packages/el-comps/src/components/FecQueryTable.vue`

The repeated internals should move to lightweight private render helpers under
`packages/el-comps/src/components/`:

- `packages/el-comps/src/components/schemaFields.ts` renders `FeFormItem` plus
  the resolved field control and emits field-level model updates back to the
  owner.
- `packages/el-comps/src/components/tableColumns.ts` renders `FeTableColumn`
  entries from the shared `TableColumn` shape.

These helpers are private implementation details. They should not be exported
from `packages/el-comps/src/index.ts` in this phase.

Pagination behavior should not be merged in this phase. `FecTable` writes back
to a writable `currentPage` ref when one is provided, while `FecQueryTable`
emits `update:currentPage` and `update:pageSize`. Those are different public
contracts and should remain local to each owner component.

## Public API Contract

The import surface must remain source-compatible for consumers:

```ts
import type {
  FecFormSchemaItem,
  FecPagination,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableProps,
  FecTableProps,
} from '@fizz/el-comps'
import { FecQueryTable, FecTable } from '@fizz/el-comps'
```

`FecTable` must continue to accept:

- `form`
- `formSchema`
- `columns`
- `data`
- `pagination`

`FecTable` must continue to emit `update:form` without mutating the incoming
form object.

`FecQueryTable` must continue to accept:

- `query`
- `querySchema`
- `rules`
- `columns`
- `data`
- `loading`
- `pagination`
- `submitText`
- `resetText`

`FecQueryTable` must continue to emit:

- `update:query`
- `submit`
- `reset`
- `update:currentPage`
- `update:pageSize`

Default action labels remain `查询` and `重置`.

## Testing

Existing tests remain the migration baseline:

- `packages/el-comps/__tests__/fecTable.spec.ts`
- `packages/el-comps/__tests__/fecQueryTable.spec.ts`

The implementation plan should preserve the current regression coverage and add
focused tests for migration-sensitive behavior:

- `FecTable` and `FecQueryTable` still render their stable structural classes.
- Semantic and custom controls still update owner models through events.
- Shared column rendering preserves supported column props such as `prop`,
  `label`, `width`, `minWidth`, and `align`.
- `FecTable` still updates writable `pagination.currentPage` refs.
- `FecQueryTable` still emits pagination update events.

Focused verification for this phase:

```bash
pnpm exec vitest run packages/el-comps/__tests__
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-comps build
```

Before reporting implementation complete, the normal repository release path
still applies:

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

The remaining follow-up work should be planned separately in this order:

1. Release hardening.
2. Theme/token system.
3. Component expansion.
4. Docs/demo site.

Those stages should each receive their own spec and implementation plan because
their responsibilities, risks, and verification paths differ from this SFC
cleanup.
