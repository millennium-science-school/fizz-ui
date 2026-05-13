# Fizz UI

Fizz UI is a Vue 3 component workspace built around Element Plus. The current
focus is the `fizz-el` package set: a transparent Element Plus adapter,
theme tokens, headless composables, and a small composite component layer.

## Packages

- `@fizz/el-plus`: Element Plus adapter. It switches Element Plus runtime and
  style namespace from `el-*` to `fe-*`, forwards attrs/events/slots, and adds
  stable `fe-*` wrapper classes for theme targeting.
- `@fizz/theme`: Fizz-owned tokens, CSS variables, UnoCSS preset, and base
  Fizz styles.
- `@fizz/el-kit`: headless composables and shared types, including table and
  query-form state helpers.
- `@fizz/el-comps`: structural composite components built on `@fizz/el-plus`
  and `@fizz/el-kit`.
- `@fizz/playground`: local integration playground, not intended for publishing.

## Quick Start

```bash
pnpm install
pnpm check
```

Run the playground:

```bash
pnpm dev
```

## Consumer Setup

```ts
import '@fizz/el-plus/styles'
import '@fizz/theme/styles'
import './styles/element-overrides.css'
import 'virtual:uno.css'
```

```vue
<script setup lang="ts">
import { FeConfigProvider } from '@fizz/el-plus'
</script>

<template>
  <FeConfigProvider>
    <RouterView />
  </FeConfigProvider>
</template>
```

## Verification

Before publishing or opening a release PR, run:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

`pnpm check:packages` includes a consumer-facing typecheck for
`@fizz/el-plus`. It builds the package, checks the `dist` type entry from the
package name, and verifies public declaration files do not expose internal or
non-portable paths.

## Documentation

- `docs/consumer-setup.md`: recommended consumer imports and runtime provider.
- `docs/component-wrapper-contract.md`: transparent wrapper contract and public
  type strategy.
- `docs/release-boundary.md`: publishable packages and release checklist.
- `docs/style-validation.md`: namespace, style, and service validation notes.
- `docs/el-kit-table-state.md`: table state composable design notes.
- `AGENTS.md`: AI-agent context and maintenance rules.
