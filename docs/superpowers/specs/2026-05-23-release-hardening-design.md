# Release Hardening Design

## Goal

Harden the release checks for the four publishable packages so a local release
candidate can be verified from built package entries, not only from workspace
source aliases.

This is the first follow-up after the 2026-05-22 `el-comps` SFC cleanup. It
keeps the scope focused on package correctness and release confidence before
theme redesign, component expansion, or documentation site work.

## Scope

Included:

- Keep the existing `@fizz/el-plus` consumer-dist verification path.
- Add consumer-dist type verification for `@fizz/el-kit`.
- Add consumer-dist type verification for `@fizz/el-comps`.
- Add built-entry verification for `@fizz/theme`, including runtime, style, and
  UnoCSS preset subpaths.
- Add a reusable declaration scan for publishable package `dist/**/*.d.ts`
  files.
- Update root release scripts so `pnpm check:packages` covers all publishable
  package contracts consistently.
- Update release documentation so `README.md`, `docs/release-boundary.md`, and
  package scripts describe the same release path.

Excluded:

- Versioning automation, changesets, npm publishing, or GitHub Actions release
  workflows.
- Theme token redesign or visual style changes.
- New `@fizz/el-comps` components or new `FecControl` names.
- New `@fizz/el-plus` wrappers beyond fixes needed to keep release checks
  passing.
- Documentation site or demo-site expansion.

## Current State

`@fizz/el-plus` already has the strongest package release checks. Its
`typecheck:consumer` script builds the package, runs a consumer-facing typecheck
against `dist`, and scans declarations for non-portable public types.

The other publishable packages rely mostly on `build` and `publint`:

- `@fizz/el-kit` builds declarations but has no consumer-dist typecheck.
- `@fizz/el-comps` builds declarations and is now SFC-based, but the new public
  `.vue` declaration entries are not checked from a consumer package import.
- `@fizz/theme` has source-level tests for exports and generated CSS, but no
  built-entry check for `@fizz/theme`, `@fizz/theme/styles`, and
  `@fizz/theme/preset/unocss`.

This leaves a release gap: workspace source checks can pass while published
package entry points, generated declarations, or subpath exports are broken.

## Architecture

Each publishable package should own a focused consumer verification script. The
root `check:packages` script should compose those package scripts plus `publint`
instead of encoding only one package's consumer contract at the root.

The consumer checks should import from package names and package subpaths, not
relative source files. They should run after the package and its local workspace
dependencies have been built, so TypeScript resolves the same `dist` entry
points that a downstream consumer will see.

A shared declaration scan should live outside package-specific source code and
be reusable across packages. It should inspect generated `.d.ts` files for
non-portable references such as local source paths, `node_modules`, absolute
Windows or POSIX paths, and package-internal implementation paths that are not
part of the public contract.

## Package Contracts

### `@fizz/el-plus`

Keep the current contract:

- Runtime imports from `@fizz/el-plus` work from `dist/index.d.ts`.
- Style imports for `@fizz/el-plus/styles` and `@fizz/el-plus/styles/scss`
  resolve from published subpaths.
- Public component props reject known invalid values for strongly typed
  wrappers.
- Declarations do not expose private Element Plus internals or local paths.

### `@fizz/el-kit`

Add a consumer-dist typecheck that verifies:

- `useTable`, `useQueryForm`, `TableColumn`, `UseTableOptions`,
  `QueryFormRules`, and related public types import from `@fizz/el-kit`.
- `TableColumn<T>['prop']` remains keyed to `Extract<keyof T, string>`.
- `useTable<T>()` accepts refs, getters, and arrays for table data and columns.
- `useQueryForm()` exposes model, rules, reset, and patch behavior through the
  public dist declaration.

### `@fizz/el-comps`

Add a consumer-dist typecheck that verifies:

- `FecTable`, `FecQueryTable`, `FecTableProps`, `FecQueryTableProps`,
  `FecFormSchemaItem`, `FecQuerySchemaItem`, `FecPagination`, and
  `FecQueryPagination` import from `@fizz/el-comps`.
- `FecTable` and `FecQueryTable` can be used in JSX/TSX through package imports.
- Schema item `prop` values remain keyed to the provided model type.
- `FecTable` accepts `MaybeRefOrGetter` table data and pagination values.
- `FecQueryTable` accepts query rules, loading state, and pagination update
  handlers through the public dist declaration.

The check should focus on source compatibility and declaration portability. It
does not need to assert every Element Plus prop forwarded through the composite
components.

### `@fizz/theme`

Add a built-entry check that verifies:

- Runtime imports from `@fizz/theme` expose token helpers and token types.
- `@fizz/theme/preset/unocss` resolves and exports `fizzPreset`.
- `@fizz/theme/styles` resolves as a CSS subpath with a declaration file.
- The generated `dist/styles/vars.css` remains synchronized with
  `createThemeVarsCss()`.
- The package does not add runtime dependencies on `@fizz/el-plus`,
  `@fizz/el-kit`, or `@fizz/el-comps`.

## Declaration Scan

The shared scan should fail when a publishable package declaration contains:

- `node_modules`
- absolute Windows paths such as `C:\`
- absolute POSIX paths that point outside package imports
- `packages/<package>/src/`
- relative references to private helper files from the package root public entry
  when those helpers are not intended as public subpaths

The scan should allow normal package imports such as `vue`, `element-plus`,
`@fizz/el-plus`, `@fizz/el-kit`, and `@fizz/el-comps`.

## Release Scripts

The root release path should stay sequential on Windows because builds clean
package `dist/` directories. The intended local release path remains:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

`pnpm check:packages` should become the canonical package contract command. It
should run the consumer-dist checks and `publint` checks for every publishable
package.

## Testing

Focused verification for this phase:

```bash
pnpm --filter @fizz/el-plus typecheck:consumer
pnpm --filter @fizz/el-kit typecheck:consumer
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm --filter @fizz/theme check:exports
pnpm check:packages
```

Before reporting implementation complete, run the normal release path:

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

After release hardening is complete, continue with the remaining 2026-05-22
roadmap in order:

1. Theme/token system.
2. Component expansion.
3. Docs/demo site.

Those follow-ups should each receive their own spec and implementation plan.
