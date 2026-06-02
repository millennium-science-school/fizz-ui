# Style Validation Path

This document records the current minimum style path for the `fizz-el` monorepo.

## Main Path: `fe` Namespace

The primary path fully takes over Element Plus class names with the `fe` namespace.

```text
@fizz/el-plus/styles
  -> precompiled Element Plus .fe-* component styles
@fizz/el-plus/styles/scss
  -> source SCSS entry for projects that need Sass compilation control
FeConfigProvider
  -> emits .fe-* runtime DOM classes
@fizz/theme/styles
  -> emits Fizz-owned wrapper and composite variables
@fizz/theme fizzPreset()
  -> reuses the same generated Fizz-owned variable CSS and adds wrapper/structural classes
playground/src/styles/element-overrides.css
  -> app-level Element Plus variable overrides for visible brand proof
```

The playground implements this path in:

- `playground/src/App.vue`
- `playground/src/main.ts`
- `playground/vite.config.ts`

The import order in `main.ts` is intentional:

```ts
import '@fizz/el-plus/styles'
import '@fizz/theme/styles'
import './styles/element-overrides.css'
import 'virtual:uno.css'
```

Projects that need to participate in Sass compilation can use the SCSS entry
instead of the precompiled CSS entry:

```scss
@use '@fizz/el-plus/styles/scss';
```

## Service Style Validation

Service APIs are imported explicitly from `@fizz/el-plus`, and `@fizz/theme/styles`
provides the minimal Fizz-owned service selectors.

1. Import `@fizz/el-plus/styles`.
2. Import `@fizz/theme/styles`.
3. Trigger `FeMessage.success('Saved')`.
4. Confirm the service DOM contains `.fe-message`.
5. Confirm the service style is applied from theme CSS, not from ad hoc playground CSS.

Element Plus defines many `--fe-*` variables on `:root`. `@fizz/theme/styles`
does not duplicate those variables by default. Applications that need different
Element Plus colors or radius should import an override file after the package
styles.

`FeConfigProvider` intentionally ignores consumer namespace overrides. Fizz owns
the `fe` namespace contract; projects that need a different namespace must use a
separate advanced adapter rather than mutating the primary path.

## Unsupported Path: Default `el` Namespace

`@fizz/theme` no longer exports an `el` namespace bridge. The supported path is
the primary `fe` namespace path through `@fizz/el-plus/styles` and
`FeConfigProvider`.

## Current Minimum Verification

The current minimum verification confirms:

- `@fizz/el-plus` accounts for every current Element Plus `El*` runtime export:
  transparent wrappers, special exports, or compatibility aliases.
- `FeButton` renders `fe-button fe-button--primary fe-btn`.
- `FeConfigProvider` sets the Element Plus runtime namespace to `fe`.
- Element Plus SCSS emits `.fe-*` styles.
- `@fizz/el-plus` exports both `./styles` and `./styles/scss`.
- `@fizz/theme/styles` and `fizzPreset()` both use CSS generated from `tokens.ts`.
- `@fizz/theme/styles` emits minimal service selectors for `fe-message`, `fe-loading`, `fe-notification`, and `fe-message-box`.
- App-specific Element Plus variable overrides live in `playground/src/styles/element-overrides.css`.
- `fizzPreset()` safelists and emits `fe-btn`, `fe-comps-form`, `fe-comps-table`, and `fe-comps-pagination`.
- `FecTable` renders stable structural classes.

## Variable Ownership Checks

- Element Plus variables come from `@fizz/el-plus/styles` by default.
- App-specific Element Plus overrides live in the consuming app.
- Fizz-owned variables come from `@fizz/theme/styles`.
- `@fizz/theme/styles/bridge` is not part of the supported package contract.
- `@fizz/theme/styles` should not define `--fe-color-primary-hover` or other pseudo Element variables.
- `.fe-btn` may use Fizz-owned variables, but it should not duplicate Element Plus button state styling.
- Fizz-owned variables are registered in `packages/theme/src/token-registry.ts`.
- `lightTokens.fizzVars` and `darkTokens.fizzVars` must be derived from the registry.
- Theme CSS rules may reference registered `--fe-fizz-*` and `--fe-comps-*` variables.
- Theme CSS rules may reference only explicitly allowed Element Plus variables.

## Composite Surface Theme Rules

Composite component styling is owned by `@fizz/theme` through registered
`--fe-comps-*` variables and selectors for stable `fe-comps-*` classes.

Theme rules may style structural classes such as `fe-comps-page`,
`fe-comps-section`, `fe-comps-query-table`, `fe-comps-tree-panel`, and
`fe-comps-detail-sections`, but they must only reference registered Fizz-owned
variables or explicitly allowed Element Plus variables. Do not place reusable
CRUD/resource surface polish in playground-only CSS.

## Theme Infrastructure Boundary

The token registry (`packages/theme/src/token-registry.ts`) is the single source of truth for Fizz-owned CSS variables.

- Adding a new Fizz CSS variable requires a corresponding entry in `fizzTokenRegistry`.
- Both light and dark theme values must be provided in the registry entry (`dark` is optional and falls back to `light`).
- `FizzThemeVars` in `tokens.ts` must stay in sync with the registry's `name` fields.
- `createFizzThemeVars` builds `lightTokens.fizzVars` and `darkTokens.fizzVars` from the registry; do not override these object literals manually.
- The `tokens.spec.ts` tests `'derives light and dark Fizz vars from the token registry'` and `'references only registered Fizz vars or allowed Element Plus vars in theme rules'` guard this boundary automatically.

## Browser Verification

After changing namespace, theme, or style entry code:

1. Start dev server: `pnpm dev`.
2. Open `http://localhost:5173/`.
3. Verify `FeButton` has class `fe-button fe-button--primary fe-btn`.
4. Verify no `el-button` class appears on the primary button.
5. Verify primary color follows `--fe-color-primary`.

## Known Temporary Choices

These choices keep the first verification path small, but should be addressed
before expanding the component set:

- `@fizz/el-plus/styles/scss` currently fixes the namespace to `fe`.
  If a future product needs a different namespace, introduce an explicit advanced
  Sass API instead of letting application code rewrite the main path.
- `@fizz/theme/styles` does not ship app-specific Element Plus color overrides.
  The playground imports its own override file to prove the extension point.
