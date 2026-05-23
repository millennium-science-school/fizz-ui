# Release Boundary

## Publishable Packages

- `@fizz/el-plus`
- `@fizz/el-kit`
- `@fizz/el-comps`
- `@fizz/theme`

## Non-publishable Workspace

- `@fizz/playground`

## Required Before Publish

Run the full local release path from the workspace root:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

`pnpm check:packages` is the package contract gate. It runs:

- `@fizz/el-plus` consumer-dist typecheck, style subpath typecheck, and public
  declaration scan.
- `@fizz/el-kit` consumer-dist typecheck and public declaration scan.
- `@fizz/el-comps` consumer-dist typecheck and public declaration scan.
- `@fizz/theme` built runtime/style/preset export check and public declaration
  scan.
- `publint` for all publishable packages.

## Package Responsibilities

- `@fizz/el-plus`: Element Plus adapter, `fe` namespace provider, CSS/SCSS style entries.
- `@fizz/theme`: Fizz-owned tokens and CSS variables. The root entry does not
  import UnoCSS types. UnoCSS integration is available through
  `@fizz/theme/preset/unocss`.
- `@fizz/el-kit`: headless composables and shared types.
- `@fizz/el-comps`: structural composite components.

## Service Boundary

`@fizz/el-plus` exposes service wrappers for explicit imports only. The wrappers
inject fizz classes before delegating to Element Plus. They intentionally do not
expose Element Plus service installers, because copying Element Plus installers
would register the original Element Plus service and bypass fizz class injection.

## Component Wrapper Boundary

New `@fizz/el-plus` component wrappers should follow
`docs/component-wrapper-contract.md`. `FeButton` is the reference implementation
for transparent wrappers.

## Commit Boundary

Implementation work should land in one local commit after the full verification path passes, unless a future change explicitly needs split commits.
