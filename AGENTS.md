# AI Agent Guide

This file is for AI coding agents working in this repository. Prefer it as the
first context document, then read the specific docs linked below.

## Current Architecture

This repository is a pnpm workspace for Vue 3 UI packages built on Element Plus.

- `packages/el-plus` owns the Element Plus adapter layer.
- `packages/theme` owns Fizz tokens, CSS variables, UnoCSS preset, and base
  Fizz styles.
- `packages/el-kit` owns headless composables and shared types.
- `packages/el-comps` owns composite components built on `@fizz/el-plus` and
  `@fizz/el-kit`.
- `playground` is an integration app and is not publishable.

## Important Contracts

`@fizz/el-plus` is a namespace adapter, not a full Element Plus fork.

Runtime wrapper behavior must stay transparent:

- switch Element Plus namespace from `el` to `fe`;
- forward attrs, events, and slots;
- add stable wrapper classes such as `fe-btn`, `fe-input`, `fe-table`;
- avoid changing Element Plus prop, emit, or slot names.

Public TypeScript coverage is intentionally layered:

1. Use Element Plus root-level public props when the generated `.d.ts` stays
   clean and portable.
2. Use small Fizz-maintained facades for high-value components where Element
   Plus public props are missing or produce internal path leakage.
3. Leave low-frequency or unstable components as wide transparent wrappers.

Do not expose inferred Element Plus component types directly when that causes
private helper types, `node_modules`, source paths, or package-internal paths to
appear in public declarations.

`FeOption` and `FeTableColumn` currently use Fizz facades. Keep the facades
small and consumer-oriented.

## Verification Commands

Run focused checks while editing:

```bash
pnpm --filter @fizz/el-plus typecheck
pnpm --filter @fizz/el-plus typecheck:consumer
pnpm exec vitest run packages/el-plus/__tests__
```

Run the full release path before reporting completion:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

On Windows, avoid running build commands in parallel when they clean the same
`dist/` directory.

## Files To Read Before Changing Wrapper Types

- `docs/component-wrapper-contract.md`
- `packages/el-plus/src/components/transparent.ts`
- `packages/el-plus/src/components/transparent-components.ts`
- `packages/el-plus/__tests__/transparentWrappers.typecheck.tsx`
- `packages/el-plus/__tests__/consumer-dist.typecheck.tsx`
- `packages/el-plus/scripts/assert-public-dts.mjs`

## Maintenance Rules

- Keep wrapper runtime logic light. Do not add behavior unless the component is
  explicitly documented as special.
- Prefer package-root public types from `element-plus`; verify generated dts
  with `pnpm --filter @fizz/el-plus typecheck:consumer`.
- If a public Element Plus type leaks an internal path, replace it with a small
  Fizz facade and document that decision.
- Keep `pnpm --filter @fizz/el-plus check:coverage` passing after Element Plus
  upgrades. The expected surface is all Element Plus `El*` runtime exports.
- `@fizz/el-comps` should consume Element Plus through `@fizz/el-plus`, not by
  importing components directly from `element-plus`.
- `@fizz/el-kit` should remain headless. It should not return Vue components.

## GitHub Upload Notes

This directory is intended to be used as its own GitHub repository. It should
not include `node_modules`, package `dist/`, `.turbo`, logs, or local env files.
The `.gitignore` in this directory is the source of truth for those exclusions.
