# Fizz El Foundation Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the current fizz-el foundation after the namespace/theme/service proof of concept, excluding `FecTable`.

**Architecture:** Keep `@fizz/el-plus` as the Element Plus adapter layer, keep visual tokens and custom visual rules in `@fizz/theme`, and keep documentation in root `docs/`. Service APIs are explicit-import only for now; no service `app.use` contract is provided.

**Tech Stack:** Vue 3, Element Plus, Vite, Vitest, vue-tsc, ESLint, publint, pnpm workspace.

---

## Scope

Included:

- Clean the full-repo lint baseline.
- Document service usage and style setup.
- Add minimal service style validation for `fe-*` service classes.
- Document and test the component wrapper pattern.

Excluded:

- `FecTable` contract changes.
- Service `app.use` support.
- New component wrappers beyond the existing `FeButton` pattern.

## File Map

- Modify: `fizz-el/packages/el-kit/src/composables/useTable.ts`
  - Lint-only type/interface cleanup.
- Modify: `fizz-el/packages/theme/preview/index.html`
  - Lint-only doctype formatting.
- Modify: `fizz-el/playground/index.html`
  - Lint-only doctype formatting.
- Modify: `fizz-el/packages/theme/preview/src/App.vue`
  - Lint-only import ordering.
- Modify: `fizz-el/packages/theme/preview/src/views/ColorsPage.vue`
  - Lint-only named import ordering.
- Modify: `fizz-el/packages/theme/tsconfig.json`
  - Lint-only JSON key ordering.
- Modify: `fizz-el/pnpm-workspace.yaml`
  - Lint-only catalog key ordering and remove unused catalog entries only if confirmed unused.
- Modify: `fizz-el/docs/consumer-setup.md`
  - Add service import and style setup guidance.
- Modify: `fizz-el/docs/release-boundary.md`
  - Record that service `app.use` is intentionally unsupported for now.
- Create: `fizz-el/docs/component-wrapper-contract.md`
  - Define transparent wrapper rules, allowed enhancements, and type expectations.
- Modify: `fizz-el/packages/theme/src/tokens.ts`
  - Add service style token values only if they are not already expressible through existing tokens.
- Modify: `fizz-el/packages/theme/src/preset.ts`
  - Add service shortcuts only if UnoCSS validation needs them.
- Create or modify: `fizz-el/packages/theme/src/styles/services.css`
  - Minimal CSS targeting `fe-message`, `fe-loading`, `fe-notification`, `fe-message-box`.
- Modify: `fizz-el/packages/theme/scripts/copy-styles.mjs`
  - Emit/copy a stable style entry if `services.css` is introduced.
- Modify: `fizz-el/packages/theme/package.json`
  - Export the new style entry if needed.
- Modify: `fizz-el/packages/theme/__tests__/tokens.spec.ts`
  - Test generated CSS includes required service vars/styles when applicable.
- Modify: `fizz-el/packages/el-plus/__tests__/button.spec.ts`
  - Add or tighten transparent wrapper behavior tests.

---

## Task 1: Clean Full-Repo Lint Baseline

**Files:**

- Modify: `fizz-el/packages/el-kit/src/composables/useTable.ts`
- Modify: `fizz-el/packages/theme/preview/index.html`
- Modify: `fizz-el/playground/index.html`
- Modify: `fizz-el/packages/theme/preview/src/App.vue`
- Modify: `fizz-el/packages/theme/preview/src/views/ColorsPage.vue`
- Modify: `fizz-el/packages/theme/tsconfig.json`
- Modify: `fizz-el/pnpm-workspace.yaml`

- [x] **Step 1: Capture current lint failures**

Run:

```bash
pnpm lint
```

Expected before this task: lint fails only with formatting/order issues already reported by ESLint. Do not change behavior while fixing these.

- [x] **Step 2: Apply mechanical lint fixes**

Run:

```bash
pnpm lint:fix
```

Expected: ESLint rewrites import order, HTML formatting, JSON/YAML ordering where auto-fixable.

- [x] **Step 3: Inspect package catalog changes**

Run:

```bash
git diff -- pnpm-workspace.yaml
rg "unplugin-icons" -n .
```

Expected: If `unplugin-icons` is still unused, remove its catalog entry. If it is used indirectly or planned for immediate preview work, keep it and add a focused eslint disable comment only if the lint rule supports it cleanly.

- [x] **Step 4: Re-run lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [x] **Step 5: Run smoke verification**

Run:

```bash
pnpm test -- --run
pnpm typecheck
```

Expected: PASS.

- [x] **Step 6: Commit**

Run:

```bash
git add fizz-el/packages/el-kit/src/composables/useTable.ts fizz-el/packages/theme/preview/index.html fizz-el/playground/index.html fizz-el/packages/theme/preview/src/App.vue fizz-el/packages/theme/preview/src/views/ColorsPage.vue fizz-el/packages/theme/tsconfig.json fizz-el/pnpm-workspace.yaml
git commit -m "chore: clean fizz-el lint baseline"
```

---

## Task 2: Document Service Import Contract

**Files:**

- Modify: `fizz-el/docs/consumer-setup.md`
- Modify: `fizz-el/docs/release-boundary.md`

- [x] **Step 1: Update consumer setup docs**

Add a section to `docs/consumer-setup.md`:

````md
## Service APIs

Use fizz service APIs through explicit imports:

```ts
import { FeLoadingService, FeMessage } from '@fizz/el-plus'

FeMessage.success('Saved')

const loading = FeLoadingService({ target: document.body })
loading.close()
```

```

Fizz services automatically append fizz service classes such as `fe-message` and `fe-loading` while preserving consumer-provided `customClass`.

Do not register service APIs with `app.use(FeMessage)` or `app.use(FeLoadingService)`. Service app-level installation is intentionally not part of the current contract.

```
````

- [x] **Step 2: Update release boundary docs**

Add this boundary to `docs/release-boundary.md`:

```md
## Service Boundary

`@fizz/el-plus` exposes service wrappers for explicit imports only. The wrappers inject fizz classes before delegating to Element Plus. They intentionally do not expose Element Plus service installers, because copying Element Plus installers would register the original Element Plus service and bypass fizz class injection.
```

- [x] **Step 3: Verify docs references**

Run:

```bash
rg "FeMessage|FeLoadingService|app.use\\(FeMessage\\)|service" fizz-el/docs
```

Expected: docs consistently describe explicit import support and no service `app.use` support.

- [x] **Step 4: Commit**

Run:

```bash
git add fizz-el/docs/consumer-setup.md fizz-el/docs/release-boundary.md
git commit -m "docs: clarify fizz service usage contract"
```

---

## Task 3: Add Minimal Service Style Validation

**Files:**

- Create or modify: `fizz-el/packages/theme/src/styles/services.css`
- Modify: `fizz-el/packages/theme/src/styles/vars.css` only if no separate style entry is added.
- Modify: `fizz-el/packages/theme/scripts/copy-styles.mjs`
- Modify: `fizz-el/packages/theme/package.json`
- Modify: `fizz-el/packages/theme/__tests__/tokens.spec.ts`
- Modify: `fizz-el/docs/style-validation.md`

- [x] **Step 1: Decide style entry shape**

Preferred contract:

```ts
import '@fizz/el-plus/styles'
import '@fizz/theme/styles'
```

If `@fizz/theme/styles` remains `vars.css`, include service CSS in the generated theme style output. If service rules are split, export a clear second entry such as `@fizz/theme/styles/services`.

- [x] **Step 2: Write failing style generation test**

Add assertions in `packages/theme/__tests__/tokens.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { createThemeVarsCss } from '../src'

describe('@fizz/theme service styles', () => {
  it('emits service selectors for fizz service classes', () => {
    const css = createThemeVarsCss()

    expect(css).toContain('.fe-message')
    expect(css).toContain('.fe-loading')
  })
})
```

Run:

```bash
pnpm test -- --run packages/theme/__tests__/tokens.spec.ts
```

Expected before implementation: FAIL because service selectors are not emitted yet.

- [x] **Step 3: Implement minimal CSS**

Keep the first version intentionally small:

```css
.fe-message {
  border-radius: var(--fe-border-radius-base);
}

.fe-loading {
  color: var(--fe-color-primary);
}

.fe-notification {
  border-radius: var(--fe-border-radius-base);
}

.fe-message-box {
  border-radius: var(--fe-border-radius-large);
}
```

Use existing token variables first. Do not add new tokens unless a service style cannot be represented by existing Element/Fizz vars.

- [x] **Step 4: Wire style output**

If the style remains generated by `createThemeVarsCss`, update the generator to append the service CSS after vars. If a separate `services.css` is used, update `copy-styles.mjs` and `package.json` exports.

Run:

```bash
pnpm --filter @fizz/theme build
pnpm --filter @fizz/theme lint:package
```

Expected: PASS, and `dist/styles` contains the chosen style entry.

- [x] **Step 5: Document validation path**

Update `docs/style-validation.md` with:

```md
## Service Style Validation

1. Import `@fizz/el-plus/styles`.
2. Import `@fizz/theme/styles`.
3. Trigger `FeMessage.success('Saved')`.
4. Confirm the service DOM contains `.fe-message`.
5. Confirm the service style is applied from theme CSS, not from ad hoc playground CSS.
```

- [x] **Step 6: Run verification**

Run:

```bash
pnpm test -- --run
pnpm --filter @fizz/theme build
pnpm --filter @fizz/theme lint:package
```

Expected: PASS.

- [x] **Step 7: Commit**

Run:

```bash
git add fizz-el/packages/theme fizz-el/docs/style-validation.md
git commit -m "feat: add minimal fizz service style validation"
```

---

## Task 4: Define Component Wrapper Pattern

**Files:**

- Create: `fizz-el/docs/component-wrapper-contract.md`
- Modify: `fizz-el/docs/release-boundary.md`
- Modify: `fizz-el/packages/el-plus/__tests__/button.spec.ts`
- Modify: `fizz-el/packages/el-plus/src/components/button.ts` only if tests expose a contract gap.

- [x] **Step 1: Write wrapper contract doc**

Create `docs/component-wrapper-contract.md`:

```md
# Component Wrapper Contract

## Default Rule

Fizz Element Plus components are transparent wrappers by default. A wrapper should preserve Element Plus props, emits, slots, attrs, and runtime behavior unless the file explicitly documents an enhancement.

## Allowed Enhancements

- Add a stable fizz class for theme targeting.
- Provide a fizz default value when it is part of the design system.
- Add a wrapper-only prop only when Element Plus has no equivalent and the behavior is documented.

## Disallowed Enhancements

- Do not intercept events without a documented reason.
- Do not mutate incoming props.
- Do not replace Element Plus prop or emit names with fizz-specific names.
- Do not hide Element Plus attrs or slots.

## Current Button Pattern

`FeButton` is the reference transparent wrapper. It forwards attrs and slots to `ElButton`, adds the fizz wrapper class, and does not implement custom click handling.
```

- [x] **Step 2: Link release boundary**

Add to `docs/release-boundary.md`:

```md
## Component Wrapper Boundary

New `@fizz/el-plus` component wrappers should follow `docs/component-wrapper-contract.md`. `FeButton` is the reference implementation for transparent wrappers.
```

- [x] **Step 3: Tighten FeButton behavior tests**

In `packages/el-plus/__tests__/button.spec.ts`, ensure tests cover:

```ts
it('forwards click events without custom interception', async () => {
  const onClick = vi.fn()
  const wrapper = mount(FeButton, {
    attrs: { onClick },
    slots: { default: 'Save' },
  })

  await wrapper.trigger('click')

  expect(onClick).toHaveBeenCalledTimes(1)
})
```

Expected: PASS with current transparent wrapper. If it fails, fix `src/components/button.ts` minimally.

- [x] **Step 4: Run wrapper verification**

Run:

```bash
pnpm test -- --run packages/el-plus/__tests__/button.spec.ts
pnpm --filter @fizz/el-plus typecheck
```

Expected: PASS.

- [x] **Step 5: Commit**

Run:

```bash
git add fizz-el/docs/component-wrapper-contract.md fizz-el/docs/release-boundary.md fizz-el/packages/el-plus/__tests__/button.spec.ts fizz-el/packages/el-plus/src/components/button.ts
git commit -m "docs: define el-plus wrapper contract"
```

---

## Final Verification

Run after all tasks:

```bash
pnpm lint
pnpm test -- --run
pnpm typecheck
pnpm exec turbo run build --filter=!./playground --force
pnpm check:packages
```

Expected:

- Full lint passes with no baseline noise.
- Tests pass.
- Typecheck passes.
- Package builds pass.
- publint passes for all packages.

## Review Checklist

- [x] No `FecTable` files changed.
- [x] Service docs do not mention `app.use(FeMessage)` as supported.
- [x] Service style rules use existing CSS vars before adding new tokens.
- [x] Wrapper docs keep transparent forwarding as the default.
- [x] Each task is committed separately.
