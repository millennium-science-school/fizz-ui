# Release Boundary

## Publishable Packages

- `@fizz/el-plus`
- `@fizz/el-kit`
- `@fizz/el-comps`
- `@fizz/theme`

## Non-publishable Workspace

- `@fizz/playground`

## Required Before Publish

```powershell
pnpm check
pnpm --filter @fizz/el-plus build
pnpm --filter @fizz/theme build
pnpm --filter @fizz/el-kit build
pnpm --filter @fizz/el-comps build
```

## Package Responsibilities

- `@fizz/el-plus`: Element Plus adapter, `fe` namespace provider, CSS/SCSS style entries.
- `@fizz/theme`: Fizz-owned tokens, CSS variables, UnoCSS preset.
  Element Plus variable overrides are optional inputs, not mandatory theme output.
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
