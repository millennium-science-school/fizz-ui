# Theme Token Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a typed Fizz-owned token registry and validation guardrails while keeping current `@fizz/theme` visual output and public token APIs stable.

**Architecture:** `packages/theme/src/token-registry.ts` becomes the metadata source for Fizz-owned CSS variables. `packages/theme/src/tokens.ts` keeps the public API and derives `lightTokens` and `darkTokens` from the registry. Existing theme rule data stays in `theme-rules.ts`; tests validate rule variable references against the registry and an explicit Element Plus allowlist.

**Tech Stack:** TypeScript, Vue package build through Vite and vue-tsc, Vitest, pnpm workspace scripts.

---

## File Structure

- Create: `packages/theme/src/token-registry.ts`
  - Owns Fizz token metadata, token categories, token names, and `createFizzThemeVars()`.
- Modify: `packages/theme/src/tokens.ts`
  - Imports `createFizzThemeVars()` and derives `lightTokens.fizzVars` and `darkTokens.fizzVars`.
- Modify: `packages/theme/src/index.ts`
  - Exports registry metadata for optional downstream inspection.
- Modify: `packages/theme/__tests__/tokens.spec.ts`
  - Adds registry parity tests and theme-rule CSS variable reference validation.
- Modify: `packages/theme/scripts/check-exports.mjs`
  - Verifies built runtime entry exports the registry metadata.
- Modify: `docs/style-validation.md`
  - Documents token registry ownership and validation boundaries.
- Modify: `docs/consumer-setup.md`
  - Records that the visual upgrade waits until component expansion is running in parallel or complete.

---

### Task 1: Add failing registry and rule validation tests

**Files:**
- Modify: `packages/theme/__tests__/tokens.spec.ts`

- [ ] **Step 1: Extend imports in the theme token test**

Replace the current imports from `../src` and `../src/theme-rules` with:

```ts
import { createThemeVarsCss, darkTokens, lightTokens } from '../src'
import { fizzTokenNames, fizzTokenRegistry } from '../src/token-registry'
import {
  createUnoThemeRules,
  descendantThemeCssRules,
  serviceThemeCssRules,
  themeUtilityRules,
} from '../src/theme-rules'
```

- [ ] **Step 2: Add CSS variable scan helpers after `normalizeCss()`**

```ts
function collectCssVarReferences(value: string): string[] {
  return Array.from(value.matchAll(/var\((--[a-z0-9-]+)/g), match => match[1])
}

function collectRuleCssVars(): string[] {
  return [
    ...themeUtilityRules,
    ...descendantThemeCssRules,
    ...serviceThemeCssRules,
  ].flatMap(rule =>
    Object.entries(rule.declarations).flatMap(([name, value]) => [
      ...(name.startsWith('--') ? [name] : []),
      ...collectCssVarReferences(value),
    ]),
  )
}

const allowedElementRuleVars = new Set([
  '--fe-border-radius-base',
  '--fe-color-primary',
  '--fe-table-header-bg-color',
])
```

- [ ] **Step 3: Add the registry parity test**

Add this test inside `describe('theme token generation', () => {`:

```ts
  it('derives light and dark Fizz vars from the token registry', () => {
    const registryNames = fizzTokenRegistry.map(token => token.name)

    expect(registryNames).toEqual(fizzTokenNames)
    expect(Object.keys(lightTokens.fizzVars)).toEqual(registryNames)
    expect(Object.keys(darkTokens.fizzVars)).toEqual(registryNames)
    expect(Object.keys(darkTokens.fizzVars)).toEqual(Object.keys(lightTokens.fizzVars))

    for (const token of fizzTokenRegistry) {
      expect(lightTokens.fizzVars[token.name]).toBe(token.light)
      expect(darkTokens.fizzVars[token.name]).toBe(token.dark ?? token.light)
      expect(token.description.trim().length).toBeGreaterThan(0)
    }
  })
```

- [ ] **Step 4: Add the theme-rule variable validation test**

Add this test inside the same `describe` block:

```ts
  it('references only registered Fizz vars or allowed Element Plus vars in theme rules', () => {
    const fizzNames = new Set(fizzTokenNames)
    const ruleVars = collectRuleCssVars()

    expect(ruleVars).toContain('--fe-fizz-button-radius')
    expect(ruleVars).toContain('--fe-comps-table-header-bg')

    for (const cssVar of ruleVars) {
      if (cssVar.startsWith('--fe-fizz-') || cssVar.startsWith('--fe-comps-')) {
        expect(fizzNames.has(cssVar)).toBe(true)
      }
      else {
        expect(allowedElementRuleVars.has(cssVar)).toBe(true)
      }
    }
  })
```

- [ ] **Step 5: Add a stricter pseudo Element variable assertion**

Add this test inside the same `describe` block:

```ts
  it('does not define pseudo Element Plus variables in default CSS', () => {
    const css = createThemeVarsCss()

    expect(css).not.toMatch(/--fe-color-primary-hover\s*:/)
    expect(css).not.toMatch(/--fe-color-primary-active\s*:/)
  })
```

- [ ] **Step 6: Run the focused test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__/tokens.spec.ts
```

Expected: FAIL because `../src/token-registry` does not exist yet.

- [ ] **Step 7: Leave the failing test uncommitted**

```bash
git status --short
```

Expected: `packages/theme/__tests__/tokens.spec.ts` is modified and uncommitted. Commit it with the implementation in Task 2 so the branch never contains a red test commit.

---

### Task 2: Add the token registry and derive theme vars from it

**Files:**
- Create: `packages/theme/src/token-registry.ts`
- Modify: `packages/theme/src/tokens.ts`

- [ ] **Step 1: Create `packages/theme/src/token-registry.ts`**

```ts
import type { FizzThemeVars } from './tokens'

export type FizzTokenCategory =
  | 'button'
  | 'control'
  | 'surface'
  | 'feedback'
  | 'composite'

export interface FizzTokenDefinition<Name extends keyof FizzThemeVars = keyof FizzThemeVars> {
  name: Name
  category: FizzTokenCategory
  light: FizzThemeVars[Name]
  dark?: FizzThemeVars[Name]
  description: string
}

export const fizzTokenRegistry = [
  {
    name: '--fe-fizz-button-font-weight',
    category: 'button',
    light: '600',
    description: 'Font weight used by Fizz button wrappers.',
  },
  {
    name: '--fe-fizz-button-radius',
    category: 'button',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by Fizz button wrappers.',
  },
  {
    name: '--fe-fizz-button-shadow',
    category: 'button',
    light: '0 1px 2px rgba(15, 118, 110, 0.18)',
    description: 'Subtle visual elevation used by Fizz button wrappers.',
  },
  {
    name: '--fe-fizz-control-radius',
    category: 'control',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by Fizz input-like control wrappers.',
  },
  {
    name: '--fe-fizz-control-shadow',
    category: 'control',
    light: '0 1px 2px rgba(15, 23, 42, 0.06)',
    dark: '0 1px 2px rgba(0, 0, 0, 0.2)',
    description: 'Default shadow used by Fizz input-like control wrappers.',
  },
  {
    name: '--fe-fizz-control-focus-shadow',
    category: 'control',
    light: '0 0 0 3px rgba(15, 118, 110, 0.14)',
    dark: '0 0 0 3px rgba(45, 212, 191, 0.18)',
    description: 'Focus shadow used by Fizz input-like control wrappers.',
  },
  {
    name: '--fe-fizz-surface-radius',
    category: 'surface',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by Fizz surface selectors.',
  },
  {
    name: '--fe-fizz-surface-shadow',
    category: 'surface',
    light: '0 8px 24px rgba(15, 23, 42, 0.08)',
    dark: '0 12px 28px rgba(0, 0, 0, 0.32)',
    description: 'Elevation shadow used by Fizz surface selectors.',
  },
  {
    name: '--fe-fizz-feedback-radius',
    category: 'feedback',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by Fizz feedback and service selectors.',
  },
  {
    name: '--fe-comps-form-cols',
    category: 'composite',
    light: '2',
    description: 'Default grid column count for composite form layouts.',
  },
  {
    name: '--fe-comps-form-gap',
    category: 'composite',
    light: '16px',
    description: 'Default grid gap for composite form layouts.',
  },
  {
    name: '--fe-comps-table-radius',
    category: 'composite',
    light: 'var(--fe-border-radius-base)',
    description: 'Border radius used by composite table surfaces.',
  },
  {
    name: '--fe-comps-table-header-bg',
    category: 'composite',
    light: '#f9fafb',
    dark: '#1f2937',
    description: 'Header background color used by composite table surfaces.',
  },
  {
    name: '--fe-comps-pagination-margin-top',
    category: 'composite',
    light: '16px',
    description: 'Top margin used by composite pagination blocks.',
  },
] as const satisfies readonly FizzTokenDefinition[]

export const fizzTokenNames = fizzTokenRegistry.map(token => token.name)

export function createFizzThemeVars(mode: 'light' | 'dark'): FizzThemeVars {
  return Object.fromEntries(
    fizzTokenRegistry.map(token => [
      token.name,
      mode === 'dark' ? token.dark ?? token.light : token.light,
    ]),
  ) as FizzThemeVars
}
```

- [ ] **Step 2: Import the registry factory in `packages/theme/src/tokens.ts`**

Add this import below the existing `theme-rules` import block:

```ts
import { createFizzThemeVars } from './token-registry'
```

- [ ] **Step 3: Replace `lightTokens` and `darkTokens` Fizz var object literals**

Replace the existing `lightTokens` and `darkTokens` definitions with:

```ts
export const lightTokens: ThemeTokens = {
  elementVars: {},
  fizzVars: createFizzThemeVars('light'),
}

export const darkTokens: ThemeTokens = {
  elementVars: {},
  fizzVars: createFizzThemeVars('dark'),
}
```

- [ ] **Step 4: Run the focused test**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__/tokens.spec.ts
```

Expected: PASS. The generated CSS should remain stable because every value matches the previous literals.

- [ ] **Step 5: Commit the registry implementation**

```bash
git add packages/theme/src/token-registry.ts packages/theme/src/tokens.ts packages/theme/__tests__/tokens.spec.ts
git commit -m "feat: add theme token registry"
```

---

### Task 3: Export and verify the registry from built package entries

**Files:**
- Modify: `packages/theme/src/index.ts`
- Modify: `packages/theme/scripts/check-exports.mjs`
- Modify: `packages/theme/__tests__/styleExports.spec.ts`

- [ ] **Step 1: Add public registry exports in `packages/theme/src/index.ts`**

Add these exports after the existing token exports:

```ts
export { createFizzThemeVars, fizzTokenNames, fizzTokenRegistry } from './token-registry'
export type { FizzTokenCategory, FizzTokenDefinition } from './token-registry'
```

- [ ] **Step 2: Add built-entry registry assertions to `packages/theme/scripts/check-exports.mjs`**

Add these assertions after the existing `createThemeCssVars` assertion:

```js
assert.equal(Array.isArray(themeEntry.fizzTokenRegistry), true)
assert.equal(Array.isArray(themeEntry.fizzTokenNames), true)
assert.equal(typeof themeEntry.createFizzThemeVars, 'function')
assert.equal(themeEntry.fizzTokenRegistry.length, themeEntry.fizzTokenNames.length)
assert.deepEqual(
  Object.keys(themeEntry.createFizzThemeVars('light')),
  themeEntry.fizzTokenNames,
)
assert.deepEqual(
  Object.keys(themeEntry.createFizzThemeVars('dark')),
  themeEntry.fizzTokenNames,
)
```

- [ ] **Step 3: Add a source-level export test in `packages/theme/__tests__/styleExports.spec.ts`**

Add this import at the top:

```ts
import { createFizzThemeVars, fizzTokenNames, fizzTokenRegistry } from '../src'
```

Add this test inside `describe('@fizz/theme style exports', () => {`:

```ts
  it('exposes token registry metadata through the runtime entry', () => {
    expect(fizzTokenRegistry.length).toBeGreaterThan(0)
    expect(fizzTokenNames).toEqual(fizzTokenRegistry.map(token => token.name))
    expect(Object.keys(createFizzThemeVars('light'))).toEqual(fizzTokenNames)
    expect(Object.keys(createFizzThemeVars('dark'))).toEqual(fizzTokenNames)
  })
```

- [ ] **Step 4: Run focused export checks**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__
pnpm --filter @fizz/theme check:exports
```

Expected: PASS. `check:exports` will build `@fizz/theme`, verify the CSS style subpath, verify the UnoCSS preset subpath, and verify built registry exports.

- [ ] **Step 5: Commit public export verification**

```bash
git add packages/theme/src/index.ts packages/theme/scripts/check-exports.mjs packages/theme/__tests__/styleExports.spec.ts
git commit -m "test: verify theme registry exports"
```

---

### Task 4: Update style and roadmap documentation

**Files:**
- Modify: `docs/style-validation.md`
- Modify: `docs/consumer-setup.md`

- [ ] **Step 1: Update `docs/style-validation.md` variable ownership section**

Add these bullets under `## Variable Ownership Checks`:

```markdown
- Fizz-owned variables are registered in `packages/theme/src/token-registry.ts`.
- `lightTokens.fizzVars` and `darkTokens.fizzVars` must be derived from the registry.
- Theme CSS rules may reference registered `--fe-fizz-*` and `--fe-comps-*` variables.
- Theme CSS rules may reference only explicitly allowed Element Plus variables.
```

- [ ] **Step 2: Add an infrastructure note before `## Browser Verification`**

```markdown
## Theme Infrastructure Boundary

The current theme phase is infrastructure work. It improves token ownership,
metadata, and validation without changing the visual language.

Real visual redesign should wait until `@fizz/el-comps` expansion is running in
parallel or complete, so token decisions can be judged against representative
composite workflows instead of isolated controls.
```

- [ ] **Step 3: Update `docs/consumer-setup.md` near-term component expansion section**

Append this paragraph to `## Near-term Component Expansion`:

```markdown
Theme token infrastructure should be improved before the visual redesign phase.
The visual upgrade itself should wait until component expansion is running in
parallel or complete, so consumer-facing examples exercise real composite
workflows.
```

- [ ] **Step 4: Commit documentation updates**

```bash
git add docs/style-validation.md docs/consumer-setup.md
git commit -m "docs: record theme infrastructure roadmap"
```

---

### Task 5: Run release verification for the theme infrastructure phase

**Files:**
- No source edits.

- [ ] **Step 1: Run focused theme verification**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__
pnpm --filter @fizz/theme typecheck
pnpm --filter @fizz/theme build
pnpm --filter @fizz/theme check:exports
pnpm check:packages
```

Expected: all commands exit 0. If `check:exports` rebuilds `@fizz/theme`, the generated `dist` content should remain ignored by git.

- [ ] **Step 2: Run full release path before reporting complete**

Run:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts packages/theme/__tests__
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

Expected: all commands exit 0.

- [ ] **Step 3: Confirm worktree state**

Run:

```bash
git status --short
```

Expected: no tracked source, test, or doc files are unstaged. Ignored build output may exist but should not appear in this command.

---

## Self-Review Checklist

- Registry values match the previous `lightTokens` and `darkTokens` literals exactly.
- `lightTokens`, `darkTokens`, `ThemeTokens`, `FizzThemeVars`, `ThemeCssVars`, and `createThemeVarsCss()` remain source-compatible.
- Theme rules stay in `theme-rules.ts`; this phase validates them but does not redesign them.
- Tests catch unknown Fizz CSS variables and unapproved Element Plus variables.
- Documentation states that this phase is infrastructure, and that the real visual upgrade waits until component expansion is running in parallel or complete.
