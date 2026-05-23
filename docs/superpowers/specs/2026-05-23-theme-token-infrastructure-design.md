# Theme Token Infrastructure Design

## Goal

Improve `@fizz/theme` as the infrastructure layer for future Fizz visual
upgrades without changing the current visual language in this phase.

This is the next follow-up after release hardening. The intent is to make theme
tokens easier to inspect, validate, and extend before larger `@fizz/el-comps`
work and before a real visual upgrade.

## Scope

Included:

- Add a typed registry for Fizz-owned CSS variables.
- Preserve the existing `lightTokens`, `darkTokens`, `ThemeTokens`,
  `FizzThemeVars`, and CSS generation public API.
- Keep current token values visually stable except for mechanical migration into
  the registry.
- Record token metadata such as category, CSS variable name, light value, dark
  value, and intended owner surface.
- Add validation that light and dark themes expose the same Fizz-owned token
  keys.
- Add validation that theme CSS rules only reference known Fizz-owned tokens or
  allowed Element Plus variables.
- Keep Element Plus variable ownership explicit: `@fizz/theme` may accept opt-in
  Element Plus overrides, but it should not define pseudo Element variables by
  default.
- Update theme documentation and roadmap notes to describe the infrastructure
  boundary and the deferred visual upgrade direction.

Excluded:

- New palette, typography, spacing, or motion decisions.
- Runtime theme switching beyond the current `html:root` and `html.dark` CSS
  output.
- Multi-brand theming, remote token loading, or design-tool synchronization.
- New `@fizz/el-comps` components.
- Docs/demo site expansion.

## Current State

`packages/theme/src/tokens.ts` currently owns the token values and CSS rendering
helpers in one file. It exports flat Fizz-owned CSS variables such as
`--fe-fizz-button-radius`, `--fe-fizz-control-shadow`, and
`--fe-comps-table-header-bg`.

`packages/theme/src/theme-rules.ts` owns three related style registries:

- utility rules for classes such as `.fe-btn` and `.fe-comps-table`;
- descendant component rules for existing `fe` namespace DOM;
- service rules for Element Plus service DOM such as `.fe-message`.

This shape is workable for the current small token set, but it gives future
visual work weak guardrails. A new token can be added to one theme and not the
other, a style rule can reference an accidental variable, and token intent is
only visible by reading variable names.

## Architecture

Introduce `packages/theme/src/token-registry.ts` as the single source for
Fizz-owned token metadata.

The registry should describe each Fizz-owned variable as data:

```ts
export type FizzTokenCategory =
  | 'button'
  | 'control'
  | 'surface'
  | 'feedback'
  | 'composite'

export interface FizzTokenDefinition {
  name: keyof FizzThemeVars
  category: FizzTokenCategory
  light: string
  dark?: string
  description: string
}
```

`tokens.ts` should keep the public API stable and derive `lightTokens.fizzVars`
and `darkTokens.fizzVars` from the registry. A missing `dark` value should mean
"same as light", matching the current `darkTokens` spread behavior.

Element Plus overrides should remain separate in `ElementThemeVars`. The Fizz
registry should not include Element Plus variables, because those variables are
owned by `@fizz/el-plus/styles` and consumer app overrides.

`theme-rules.ts` can remain the rule source in this phase. The important change
is validation, not rule generation. Tests should scan rule declaration values
for CSS variable references and verify that:

- `--fe-fizz-*` and `--fe-comps-*` references exist in the Fizz token registry;
- Element Plus references are on an explicit allowlist, such as
  `--fe-border-radius-base`, `--fe-table-header-bg-color`, and
  `--fe-color-primary`;
- no pseudo Element variables such as `--fe-color-primary-hover` are introduced
  by theme rules or generated default CSS.

## Public API Contract

The following imports must remain source-compatible:

```ts
import {
  createThemeCssVars,
  createThemeVarsCss,
  darkTokens,
  fizzPreset,
  lightTokens,
} from '@fizz/theme'

import type {
  ElementThemeVars,
  FizzThemeVars,
  ThemeCssVars,
  ThemeTokens,
  ThemeVarsCssOptions,
} from '@fizz/theme'
```

The registry may be exported if it is useful for validation and downstream
inspection, but generated CSS and token helper behavior should not require
consumers to adopt a new API in this phase.

## Validation

Add focused theme tests that verify:

- every registry entry appears in `lightTokens.fizzVars`;
- every registry entry appears in `darkTokens.fizzVars`;
- `lightTokens.fizzVars` and `darkTokens.fizzVars` have identical keys;
- `createThemeVarsCss()` includes registry-driven values for both selectors;
- `@fizz/theme/styles` output remains synchronized with
  `createThemeVarsCss()`;
- utility, descendant, and service rules reference only known or explicitly
  allowed CSS variables;
- default theme CSS does not define pseudo Element variables.

Focused verification for this phase:

```bash
pnpm exec vitest run packages/theme/__tests__
pnpm --filter @fizz/theme typecheck
pnpm --filter @fizz/theme build
pnpm --filter @fizz/theme check:exports
pnpm check:packages
```

Before reporting implementation complete, run the normal release path:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts packages/theme/__tests__
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

## Documentation

Update `docs/style-validation.md` so the style validation path describes:

- Fizz-owned token registry ownership;
- allowed Element Plus variable references;
- no default pseudo Element variable definitions;
- the distinction between infrastructure readiness and visual redesign.

Update the roadmap notes in the relevant Superpowers docs so the next direction
is clear: build theme/token infrastructure first, continue `@fizz/el-comps`
expansion next, and defer the real visual upgrade until component expansion is
running in parallel or complete.

## Roadmap Notes

This phase intentionally raises infrastructure capability rather than changing
the product look. The visual upgrade should be treated as a later design phase
that benefits from:

1. a validated theme token registry;
2. clearer composite component surfaces;
3. enough `@fizz/el-comps` coverage to judge visual decisions against real
   product workflows.

After this phase, the roadmap should continue with component expansion unless a
small theme validation gap blocks that work.
