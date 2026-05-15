# Fizz UI Architecture Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the highest-risk API and packaging gaps identified in the architecture review while preserving the current Element Plus adapter strategy.

**Architecture:** Keep `@fizz/el-plus` transparent at runtime, with the only wrapper enhancement being a stable `fe-*` class and transparent instance exposure. Keep `@fizz/el-comps` extensible through a small control resolver protocol. Keep `@fizz/theme` usable as a token/CSS package without forcing the root entry to import UnoCSS types.

**Tech Stack:** Vue 3, Element Plus, TSX, Vite, Vitest, vue-tsc, vite-plugin-dts, publint, pnpm workspace.

---

## Scope

Included:

- Fix transparent wrapper `ref` / exposed instance behavior.
- Add regression coverage for `data-*` / `aria-*` attrs on transparent wrappers.
- Add regression coverage for `FeMessageBox` shortcut signatures.
- Replace `el-comps` hard-coded Element Plus control names with a small resolver protocol.
- Add `FecQueryTable` button label props for minimal i18n.
- Move `fizzPreset` to `@fizz/theme/preset/unocss` and make the UnoCSS peer optional.
- Share the simple theme utility rule source between generated CSS and UnoCSS preset rules.
- Document compatibility aliases and directive naming direction.

Excluded:

- Namespace parameterization beyond the current hard-coded `fe`.
- Token reference/system/component layer redesign.
- SFC migration for `FecTable` and `FecQueryTable`.
- VitePress documentation site.
- Visual regression infrastructure.

## File Map

- Modify: `packages/el-plus/src/components/transparent.ts`
  - Add internal Element Plus component ref and expose a live proxy to the wrapped instance.
- Modify: `packages/el-plus/__tests__/transparentWrappers.spec.ts`
  - Add ref/expose and `data-*` / `aria-*` regression tests.
- Modify: `packages/el-plus/__tests__/runtimeExports.spec.ts`
  - Add `FeMessageBox.alert(message, options)` and `FeMessageBox.alert(message, title, options)` tests.
- Create: `packages/el-comps/src/components/controls.ts`
  - Define `FecControl`, legacy aliases, resolver result shape, and `resolveFecControl`.
- Modify: `packages/el-comps/src/components/FecTable.tsx`
  - Use `FecControl` and `resolveFecControl`.
- Modify: `packages/el-comps/src/components/FecQueryTable.tsx`
  - Use `FecControl`, `resolveFecControl`, `submitText`, and `resetText`.
- Modify: `packages/el-comps/__tests__/fecTable.spec.ts`
  - Cover semantic control names and custom component controls.
- Modify: `packages/el-comps/__tests__/fecQueryTable.spec.ts`
  - Cover semantic control names, custom component controls, and custom action text.
- Modify: `packages/theme/src/index.ts`
  - Stop exporting `fizzPreset` from the root token entry.
- Create: `packages/theme/src/preset/unocss.ts`
  - Export `fizzPreset` from the dedicated UnoCSS subpath.
- Modify: `packages/theme/src/preset.ts`
  - Read simple rules from the shared rule source.
- Create: `packages/theme/src/theme-rules.ts`
  - Hold the simple theme rules that are shared by CSS generation and UnoCSS.
- Modify: `packages/theme/src/tokens.ts`
  - Render shared simple CSS rules through `theme-rules.ts`.
- Modify: `packages/theme/vite.config.ts`
  - Build both root and `preset/unocss` entries.
- Modify: `packages/theme/package.json`
  - Add `./preset/unocss` export and mark `unocss` optional.
- Modify: `packages/theme/__tests__/tokens.spec.ts`
  - Import preset from the new subpath and assert generated CSS still matches.
- Modify: `packages/theme/__tests__/styleExports.spec.ts`
  - Assert the new export map shape.
- Modify: `packages/theme/uno.config.ts`
  - Import `fizzPreset` from the dedicated source subpath.
- Modify: `docs/consumer-setup.md`
  - Update UnoCSS import guidance.
- Modify: `docs/component-wrapper-contract.md`
  - Document exposed-instance behavior, compatibility aliases, and directive naming direction.
- Modify: `docs/release-boundary.md`
  - Record the root theme entry and preset subpath boundary.

---

## Task 1: Transparent Wrapper Refs

**Files:**

- Modify: `packages/el-plus/__tests__/transparentWrappers.spec.ts`
- Modify: `packages/el-plus/src/components/transparent.ts`
- Modify: `docs/component-wrapper-contract.md`

- [ ] **Step 1: Add failing ref/expose regression test**

In `packages/el-plus/__tests__/transparentWrappers.spec.ts`, extend the Vue import:

```ts
import { createApp, h, nextTick, ref } from 'vue'
```

Add this test inside `describe('transparent wrappers', () => { ... })`:

```ts
it('exposes wrapped Element Plus instance methods through refs', async () => {
  const host = document.createElement('div')
  document.body.append(host)
  const inputRef = ref<{ focus: () => void, blur: () => void } | null>(null)

  const app = createApp({
    render: () =>
      h(FeConfigProvider, null, () =>
        h(FeInput, {
          ref: inputRef,
          modelValue: '',
        })),
  })

  app.mount(host)
  await nextTick()

  expect(typeof inputRef.value?.focus).toBe('function')
  expect(typeof inputRef.value?.blur).toBe('function')

  inputRef.value?.focus()
  await nextTick()
  expect(document.activeElement).toBe(host.querySelector('input'))

  inputRef.value?.blur()

  app.unmount()
  host.remove()
})
```

- [ ] **Step 2: Add attrs regression test**

Add this second test to the same `describe` block:

```ts
it('forwards data and aria attrs once through the wrapped component', async () => {
  const host = document.createElement('div')
  document.body.append(host)

  const app = createApp({
    render: () =>
      h(FeConfigProvider, null, () =>
        h(FeInput, {
          'aria-label': 'Keyword',
          'data-testid': 'keyword-input',
          'modelValue': '',
        })),
  })

  app.mount(host)
  await nextTick()

  expect(host.querySelectorAll('[data-testid="keyword-input"]')).toHaveLength(1)
  expect(host.querySelectorAll('[aria-label="Keyword"]')).toHaveLength(1)

  app.unmount()
  host.remove()
})
```

- [ ] **Step 3: Run the focused test and verify failure**

Run:

```bash
pnpm exec vitest run packages/el-plus/__tests__/transparentWrappers.spec.ts
```

Expected before implementation: the ref/expose test fails because `inputRef.value?.focus` is not a function.

- [ ] **Step 4: Implement live expose proxy**

Replace `packages/el-plus/src/components/transparent.ts` with this structure, preserving the existing public type names:

```ts
import type {
  AllowedComponentProps,
  Component,
  ComponentCustomProps,
  ComponentPublicInstance,
  DefineComponent,
  Ref,
  VNodeProps,
} from 'vue'
import { defineComponent, h, ref } from 'vue'
import { FIZZ_WRAPPER_CLASS_PREFIX } from '../namespace'

type TransparentWrapperBaseProps
  = & VNodeProps
    & AllowedComponentProps
    & ComponentCustomProps
    & Record<`on${string}`, unknown>

export type TransparentWrapperComponent<Props extends object = Record<string, unknown>>
  = DefineComponent<Partial<Props> & TransparentWrapperBaseProps>

function getWrappedInstanceRecord(
  wrappedRef: Ref<ComponentPublicInstance | null>,
): Record<PropertyKey, unknown> | null {
  return wrappedRef.value as Record<PropertyKey, unknown> | null
}

function createExposeProxy(wrappedRef: Ref<ComponentPublicInstance | null>) {
  return new Proxy({}, {
    get(_, key) {
      return getWrappedInstanceRecord(wrappedRef)?.[key]
    },
    has(_, key) {
      const target = getWrappedInstanceRecord(wrappedRef)
      return target === null ? false : key in target
    },
    set(_, key, value) {
      const target = getWrappedInstanceRecord(wrappedRef)
      if (target === null)
        return false

      target[key] = value
      return true
    },
  })
}

export function createTransparentWrapper<Props extends object = Record<string, unknown>>(
  name: string,
  component: Component,
  fizzClassSuffix: string,
): TransparentWrapperComponent<Props> {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, expose, slots }) {
      const wrappedRef = ref<ComponentPublicInstance | null>(null)
      expose(createExposeProxy(wrappedRef))

      return () =>
        h(
          component,
          {
            ...attrs,
            ref: wrappedRef,
            class: [`${FIZZ_WRAPPER_CLASS_PREFIX}-${fizzClassSuffix}`, attrs.class],
          },
          slots,
        )
    },
  }) as unknown as TransparentWrapperComponent<Props>
}
```

- [ ] **Step 5: Document the contract**

Add this subsection to `docs/component-wrapper-contract.md` after the transparent wrapper export description:

```md
### Ref and Exposed Instance Behavior

Transparent wrappers should expose the wrapped Element Plus component instance
through Vue component refs. Consumer code such as `inputRef.value.focus()` or
`formRef.value.validate()` should behave as it does with the matching `El*`
component. The wrapper may use a live proxy to avoid exposing a `null` setup-time
snapshot, but it must not rename or reinterpret Element Plus instance methods.
```

- [ ] **Step 6: Verify wrapper behavior**

Run:

```bash
pnpm exec vitest run packages/el-plus/__tests__/transparentWrappers.spec.ts
pnpm --filter @fizz/el-plus typecheck
```

Expected: both commands pass.

- [ ] **Step 7: Commit**

Run:

```bash
git add packages/el-plus/src/components/transparent.ts packages/el-plus/__tests__/transparentWrappers.spec.ts docs/component-wrapper-contract.md
git commit -m "fix: expose wrapped element plus instances"
```

---

## Task 2: Service Signature Coverage

**Files:**

- Modify: `packages/el-plus/__tests__/runtimeExports.spec.ts`
- Modify: `packages/el-plus/src/services.ts` only if the new tests fail

- [ ] **Step 1: Add MessageBox shortcut tests**

Add these tests after the existing `FeMessage` shortcut test in `packages/el-plus/__tests__/runtimeExports.spec.ts`:

```ts
it('adds a fizz class to FeMessageBox alert when options are passed as the second argument', async () => {
  const promise = FizzEl.FeMessageBox
    .alert('Saved', {
      customClass: 'consumer-message-box',
    })
    .catch(() => undefined)

  await nextTick()

  const messageBox = document.querySelector('.fe-message-box')
  expect(messageBox).not.toBeNull()
  expect(messageBox?.classList.contains('consumer-message-box')).toBe(true)

  FizzEl.FeMessageBox.close()
  await promise
})

it('adds a fizz class to FeMessageBox alert when title and options are passed', async () => {
  const promise = FizzEl.FeMessageBox
    .alert('Saved', 'Notice', {
      customClass: 'consumer-message-box-title',
    })
    .catch(() => undefined)

  await nextTick()

  const messageBox = document.querySelector('.fe-message-box')
  expect(messageBox).not.toBeNull()
  expect(messageBox?.classList.contains('consumer-message-box-title')).toBe(true)

  FizzEl.FeMessageBox.close()
  await promise
})
```

- [ ] **Step 2: Run the focused test**

Run:

```bash
pnpm exec vitest run packages/el-plus/__tests__/runtimeExports.spec.ts
```

Expected: PASS with the current implementation. If either test fails, fix only `normalizeMessageBoxOptions` or `createMessageBoxShortcut`; do not change the public `FeMessageBox` method names.

- [ ] **Step 3: Verify all el-plus tests**

Run:

```bash
pnpm exec vitest run packages/el-plus/__tests__
pnpm --filter @fizz/el-plus typecheck:consumer
```

Expected: both commands pass.

- [ ] **Step 4: Commit**

Run:

```bash
git add packages/el-plus/__tests__/runtimeExports.spec.ts packages/el-plus/src/services.ts
git commit -m "test: cover fizz message box shortcut signatures"
```

---

## Task 3: Composite Control Resolver

**Files:**

- Create: `packages/el-comps/src/components/controls.ts`
- Modify: `packages/el-comps/src/components/FecTable.tsx`
- Modify: `packages/el-comps/src/components/FecQueryTable.tsx`
- Modify: `packages/el-comps/__tests__/fecTable.spec.ts`
- Modify: `packages/el-comps/__tests__/fecQueryTable.spec.ts`

- [ ] **Step 1: Create the shared resolver**

Create `packages/el-comps/src/components/controls.ts`:

```ts
import type { Component } from 'vue'
import {
  FeInput,
  FeInputNumber,
} from '@fizz/el-plus'

export type FecBuiltinControlName = 'input' | 'number'
export type FecLegacyControlName = 'ElInput' | 'ElInputNumber'

export interface FecCustomControl {
  component: Component
  props?: Record<string, unknown>
}

export type FecControl = FecBuiltinControlName | FecLegacyControlName | FecCustomControl

export interface FecResolvedControl {
  component: Component
  props: Record<string, unknown>
}

export function resolveFecControl(control: FecControl): FecResolvedControl {
  if (typeof control !== 'string') {
    return {
      component: control.component,
      props: control.props ?? {},
    }
  }

  if (control === 'number' || control === 'ElInputNumber') {
    return {
      component: FeInputNumber,
      props: {},
    }
  }

  return {
    component: FeInput,
    props: {},
  }
}
```

- [ ] **Step 2: Update `FecTable` types and render path**

In `packages/el-comps/src/components/FecTable.tsx`, remove the imports of `TransparentWrapperComponent`, `FeInput`, and `FeInputNumber`. Add:

```ts
import type { FecControl } from './controls'
import { resolveFecControl } from './controls'
```

Change the schema interface to:

```ts
export interface FecFormSchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  component: FecControl
}
```

Delete the local `resolveFormComponent` function. In the form schema render loop, replace:

```tsx
const FormControl = resolveFormComponent(item.component)
```

with:

```tsx
const resolvedControl = resolveFecControl(item.component)
const FormControl = resolvedControl.component
```

Then spread custom control props before controlled model props:

```tsx
<FormControl
  {...{
    ...resolvedControl.props,
    'modelValue': props.form[item.prop],
    'onUpdate:modelValue': (value: unknown) => emitFormField(item.prop, value),
  }}
/>
```

- [ ] **Step 3: Update `FecQueryTable` types and render path**

In `packages/el-comps/src/components/FecQueryTable.tsx`, remove the imports of `TransparentWrapperComponent`, `FeInput`, and `FeInputNumber`. Add:

```ts
import type { FecControl } from './controls'
import { resolveFecControl } from './controls'
```

Change the schema interface to:

```ts
export interface FecQuerySchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  component: FecControl
}
```

Delete the local `resolveFormComponent` function. In the query schema render loop, replace:

```tsx
const FormControl = resolveFormComponent(item.component)
```

with:

```tsx
const resolvedControl = resolveFecControl(item.component)
const FormControl = resolvedControl.component
```

Then spread custom control props before controlled model props:

```tsx
<FormControl
  {...{
    ...resolvedControl.props,
    'modelValue': props.query[item.prop],
    'onUpdate:modelValue': (value: unknown) => emitQueryField(item.prop, value),
  }}
/>
```

- [ ] **Step 4: Add `FecTable` resolver tests**

In `packages/el-comps/__tests__/fecTable.spec.ts`, extend the Vue import:

```ts
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
```

Add this custom control near the test interfaces:

```ts
const CustomControl = defineComponent({
  name: 'CustomControl',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-custom-control': 'yes',
        'placeholder': props.placeholder,
        'value': props.modelValue,
        'onInput': (event: Event) => {
          emit('update:modelValue', (event.target as HTMLInputElement).value)
        },
      })
  },
})
```

Add this test:

```ts
it('accepts semantic and custom form controls', async () => {
  const host = document.createElement('div')
  document.body.append(host)
  const updates: Array<Record<string, unknown>> = []

  const app = createApp({
    render: () =>
      h(FecTable<User>, {
        'form': { name: '' },
        'onUpdate:form': value => updates.push(value),
        'formSchema': [
          { prop: 'name', label: '姓名', component: 'input' },
          {
            prop: 'name',
            label: '自定义',
            component: {
              component: CustomControl,
              props: { placeholder: 'custom-name' },
            },
          },
        ],
        'columns': [{ prop: 'name', label: '姓名' }],
        'data': ref([{ name: 'Tom', age: 18 }]),
        'pagination': {
          currentPage: ref(1),
          total: ref(1),
          pageSize: 10,
        },
      }),
  })

  app.mount(host)
  await nextTick()

  const customInput = host.querySelector('[data-custom-control="yes"]') as HTMLInputElement
  expect(customInput?.getAttribute('placeholder')).toBe('custom-name')

  customInput.value = 'Ann'
  customInput.dispatchEvent(new Event('input'))
  await nextTick()

  expect(updates.at(-1)).toEqual({ name: 'Ann' })

  app.unmount()
  host.remove()
})
```

- [ ] **Step 5: Add `FecQueryTable` resolver test**

In `packages/el-comps/__tests__/fecQueryTable.spec.ts`, extend the Vue import:

```ts
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
```

Add the same `CustomControl` definition used in the previous step. Then add:

```ts
it('accepts semantic and custom query controls', async () => {
  const host = document.createElement('div')
  document.body.append(host)
  const queryUpdates: Query[] = []

  const app = createApp({
    render: () =>
      h(FecQueryTable<User, Query>, {
        'query': { keyword: '' },
        'onUpdate:query': value => queryUpdates.push(value),
        'querySchema': [
          { prop: 'keyword', label: '关键词', component: 'input' },
          {
            prop: 'keyword',
            label: '自定义',
            component: {
              component: CustomControl,
              props: { placeholder: 'custom-keyword' },
            },
          },
        ],
        'columns': [{ prop: 'name', label: '姓名' }],
        'data': ref([{ name: 'Tom', age: 18 }]),
        'pagination': {
          currentPage: ref(1),
          pageSize: ref(10),
          total: ref(1),
        },
      }),
  })

  app.mount(host)
  await nextTick()

  const customInput = host.querySelector('[data-custom-control="yes"]') as HTMLInputElement
  expect(customInput?.getAttribute('placeholder')).toBe('custom-keyword')

  customInput.value = 'Fizz'
  customInput.dispatchEvent(new Event('input'))
  await nextTick()

  expect(queryUpdates.at(-1)).toEqual({ keyword: 'Fizz' })

  app.unmount()
  host.remove()
})
```

- [ ] **Step 6: Verify composite components**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__
pnpm typecheck
```

Expected: both commands pass. Existing tests that use `'ElInput'` and `'ElInputNumber'` should continue to pass because those names remain legacy aliases.

- [ ] **Step 7: Commit**

Run:

```bash
git add packages/el-comps/src/components/controls.ts packages/el-comps/src/components/FecTable.tsx packages/el-comps/src/components/FecQueryTable.tsx packages/el-comps/__tests__/fecTable.spec.ts packages/el-comps/__tests__/fecQueryTable.spec.ts
git commit -m "feat: add extensible composite control resolver"
```

---

## Task 4: Theme Preset Subpath

**Files:**

- Modify: `packages/theme/src/index.ts`
- Create: `packages/theme/src/preset/unocss.ts`
- Modify: `packages/theme/vite.config.ts`
- Modify: `packages/theme/package.json`
- Modify: `packages/theme/__tests__/tokens.spec.ts`
- Modify: `packages/theme/__tests__/styleExports.spec.ts`
- Modify: `packages/theme/uno.config.ts`
- Modify: `docs/consumer-setup.md`
- Modify: `docs/release-boundary.md`

- [ ] **Step 1: Move the public preset export to a subpath**

Remove this export from `packages/theme/src/index.ts`:

```ts
export { fizzPreset } from './preset'
```

Create `packages/theme/src/preset/unocss.ts`:

```ts
export { fizzPreset } from '../preset'
```

- [ ] **Step 2: Update the package export map**

In `packages/theme/package.json`, add the `./preset/unocss` export and make the UnoCSS peer optional:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    },
    "./preset/unocss": {
      "types": "./dist/preset/unocss.d.ts",
      "import": "./dist/preset/unocss.mjs"
    },
    "./styles": {
      "types": "./dist/styles/vars.d.ts",
      "default": "./dist/styles/vars.css"
    }
  },
  "peerDependencies": {
    "unocss": ">=0.60.0"
  },
  "peerDependenciesMeta": {
    "unocss": {
      "optional": true
    }
  }
}
```

Keep the rest of the existing package fields unchanged.

- [ ] **Step 3: Build both library entries**

In `packages/theme/vite.config.ts`, change `build.lib` to multi-entry output:

```ts
lib: {
  entry: {
    index: resolve(__dirname, 'src/index.ts'),
    'preset/unocss': resolve(__dirname, 'src/preset/unocss.ts'),
  },
  formats: ['es'],
  fileName: (_format, entryName) => `${entryName}.mjs`,
},
```

Keep `external: ['unocss']` because the preset subpath still imports UnoCSS types.

- [ ] **Step 4: Update tests and local config imports**

In `packages/theme/__tests__/tokens.spec.ts`, change:

```ts
import { createThemeVarsCss, fizzPreset } from '../src'
```

to:

```ts
import { createThemeVarsCss } from '../src'
import { fizzPreset } from '../src/preset/unocss'
```

In `packages/theme/uno.config.ts`, change:

```ts
import { fizzPreset } from './src/preset'
```

to:

```ts
import { fizzPreset } from './src/preset/unocss'
```

- [ ] **Step 5: Assert export map shape**

Extend `packages/theme/__tests__/styleExports.spec.ts`:

```ts
it('exposes the UnoCSS preset through a dedicated optional subpath', () => {
  const packageJson = JSON.parse(
    readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
  )

  expect(packageJson.exports['./preset/unocss']).toEqual({
    types: './dist/preset/unocss.d.ts',
    import: './dist/preset/unocss.mjs',
  })
  expect(packageJson.peerDependencies.unocss).toBe('>=0.60.0')
  expect(packageJson.peerDependenciesMeta.unocss.optional).toBe(true)
})
```

- [ ] **Step 6: Update consumer docs**

In `docs/consumer-setup.md`, replace the UnoCSS example import:

```ts
import { fizzPreset } from '@fizz/theme'
```

with:

```ts
import { fizzPreset } from '@fizz/theme/preset/unocss'
```

In `docs/release-boundary.md`, update the `@fizz/theme` package description to:

```md
- `@fizz/theme`: Fizz-owned tokens and CSS variables. The root entry does not
  import UnoCSS types. UnoCSS integration is available through
  `@fizz/theme/preset/unocss`.
```

- [ ] **Step 7: Verify theme packaging**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__
pnpm --filter @fizz/theme typecheck
pnpm --filter @fizz/theme build
pnpm --filter @fizz/theme lint:package
```

Expected: all commands pass, and `packages/theme/dist/preset/unocss.mjs` plus `packages/theme/dist/preset/unocss.d.ts` exist after build.

- [ ] **Step 8: Commit**

Run:

```bash
git add packages/theme/src/index.ts packages/theme/src/preset/unocss.ts packages/theme/vite.config.ts packages/theme/package.json packages/theme/__tests__/tokens.spec.ts packages/theme/__tests__/styleExports.spec.ts packages/theme/uno.config.ts docs/consumer-setup.md docs/release-boundary.md
git commit -m "feat: expose unocss preset from theme subpath"
```

---

## Task 5: Shared Theme Rule Source

**Files:**

- Create: `packages/theme/src/theme-rules.ts`
- Modify: `packages/theme/src/tokens.ts`
- Modify: `packages/theme/src/preset.ts`
- Modify: `packages/theme/__tests__/tokens.spec.ts`

- [ ] **Step 1: Create shared simple rule source**

Create `packages/theme/src/theme-rules.ts`:

```ts
export interface ThemeUtilityRule {
  className: string
  declarations: Record<string, string>
}

export interface ThemeCssRule {
  selector: string
  declarations: Record<string, string>
}

export const themeUtilityRules: ThemeUtilityRule[] = [
  {
    className: 'fe-btn',
    declarations: {
      'font-weight': 'var(--fe-fizz-button-font-weight)',
      'border-radius': 'var(--fe-fizz-button-radius)',
      'box-shadow': 'var(--fe-fizz-button-shadow)',
    },
  },
  {
    className: 'fe-comps-form',
    declarations: {
      'display': 'grid',
      'grid-template-columns': 'repeat(var(--fe-comps-form-cols, 2), 1fr)',
      'gap': 'var(--fe-comps-form-gap, 16px)',
    },
  },
  {
    className: 'fe-comps-table',
    declarations: {
      'border-radius': 'var(--fe-comps-table-radius)',
      'overflow': 'hidden',
    },
  },
  {
    className: 'fe-comps-pagination',
    declarations: {
      'margin-top': 'var(--fe-comps-pagination-margin-top)',
      'justify-content': 'flex-end',
    },
  },
]

export const descendantThemeCssRules: ThemeCssRule[] = [
  {
    selector: '.fe-input .fe-input__wrapper,\n.fe-select .fe-select__wrapper',
    declarations: {
      'border-radius': 'var(--fe-fizz-control-radius)',
      'box-shadow': 'var(--fe-fizz-control-shadow)',
    },
  },
  {
    selector: '.fe-input .fe-input__wrapper.is-focus,\n.fe-select .fe-select__wrapper.is-focused',
    declarations: {
      'box-shadow': 'var(--fe-fizz-control-focus-shadow)',
    },
  },
  {
    selector: '.fe-table',
    declarations: {
      'overflow': 'hidden',
      'border-radius': 'var(--fe-comps-table-radius)',
      '--fe-table-header-bg-color': 'var(--fe-comps-table-header-bg)',
    },
  },
  {
    selector: '.fe-card,\n.fe-dialog',
    declarations: {
      'border-radius': 'var(--fe-fizz-surface-radius)',
    },
  },
  {
    selector: '.fe-dialog',
    declarations: {
      'box-shadow': 'var(--fe-fizz-surface-shadow)',
    },
  },
]

export const serviceThemeCssRules: ThemeCssRule[] = [
  {
    selector: '.fe-message',
    declarations: {
      'border-radius': 'var(--fe-fizz-feedback-radius)',
      'box-shadow': 'var(--fe-fizz-surface-shadow)',
    },
  },
  {
    selector: '.fe-loading',
    declarations: {
      'color': 'var(--fe-color-primary)',
    },
  },
  {
    selector: '.fe-notification',
    declarations: {
      'border-radius': 'var(--fe-fizz-feedback-radius)',
      'box-shadow': 'var(--fe-fizz-surface-shadow)',
    },
  },
  {
    selector: '.fe-message-box',
    declarations: {
      'border-radius': 'var(--fe-fizz-feedback-radius)',
      'box-shadow': 'var(--fe-fizz-surface-shadow)',
    },
  },
]

export function renderThemeCssRules(rules: ThemeCssRule[]): string {
  return rules
    .map((rule) => {
      const declarations = Object.entries(rule.declarations)
        .map(([name, value]) => `  ${name}: ${value};`)
        .join('\n')

      return `${rule.selector} {\n${declarations}\n}`
    })
    .join('\n\n')
}

export function renderUtilityThemeCssRules(rules = themeUtilityRules): string {
  return renderThemeCssRules(
    rules.map(rule => ({
      selector: `.${rule.className}`,
      declarations: rule.declarations,
    })),
  )
}

export function createUnoThemeRules(rules = themeUtilityRules) {
  return rules.map(rule => [rule.className, rule.declarations] as const)
}
```

- [ ] **Step 2: Use shared source in token CSS generation**

In `packages/theme/src/tokens.ts`, add:

```ts
import {
  descendantThemeCssRules,
  renderThemeCssRules,
  renderUtilityThemeCssRules,
  serviceThemeCssRules,
} from './theme-rules'
```

Replace `renderServiceCss()` with:

```ts
function renderServiceCss(): string {
  return renderThemeCssRules(serviceThemeCssRules)
}
```

Replace `renderCoreComponentCss()` with:

```ts
function renderCoreComponentCss(): string {
  return [
    renderUtilityThemeCssRules(),
    renderThemeCssRules(descendantThemeCssRules),
  ].join('\n\n')
}
```

- [ ] **Step 3: Use shared source in UnoCSS preset**

In `packages/theme/src/preset.ts`, add:

```ts
import { createUnoThemeRules } from './theme-rules'
```

Replace the explicit `rules: [...]` array with:

```ts
rules: createUnoThemeRules(),
```

Keep the current `shortcuts` unchanged in this task.

- [ ] **Step 4: Add test coverage for shared rule source**

In `packages/theme/__tests__/tokens.spec.ts`, import:

```ts
import { createUnoThemeRules, themeUtilityRules } from '../src/theme-rules'
```

Add:

```ts
it('shares simple class rules between generated CSS and UnoCSS rules', () => {
  const css = createThemeVarsCss()
  const unoRules = fizzPreset().rules ?? []

  for (const rule of themeUtilityRules) {
    expect(css).toContain(`.${rule.className}`)

    for (const [name, value] of Object.entries(rule.declarations)) {
      expect(css).toContain(`${name}: ${value};`)
    }
  }

  expect(unoRules).toEqual(createUnoThemeRules())
})
```

- [ ] **Step 5: Verify generated CSS stability**

Run:

```bash
pnpm exec vitest run packages/theme/__tests__/tokens.spec.ts
pnpm --filter @fizz/theme build
pnpm exec vitest run packages/theme/__tests__/tokens.spec.ts
```

Expected: all commands pass. The second test run verifies that checked-in/generated `vars.css` still matches `createThemeVarsCss()` after build.

- [ ] **Step 6: Commit**

Run:

```bash
git add packages/theme/src/theme-rules.ts packages/theme/src/tokens.ts packages/theme/src/preset.ts packages/theme/__tests__/tokens.spec.ts packages/theme/src/styles/vars.css
git commit -m "refactor: share theme utility rule source"
```

---

## Task 6: Query Table Text Props

**Files:**

- Modify: `packages/el-comps/src/components/FecQueryTable.tsx`
- Modify: `packages/el-comps/__tests__/fecQueryTable.spec.ts`

- [ ] **Step 1: Add custom action text test**

In `packages/el-comps/__tests__/fecQueryTable.spec.ts`, add:

```ts
it('allows query action text to be customized', async () => {
  const host = document.createElement('div')
  document.body.append(host)

  const app = createApp({
    render: () =>
      h(FecQueryTable<User, Query>, {
        query: { keyword: '' },
        querySchema: [{ prop: 'keyword', label: '关键词', component: 'input' }],
        submitText: 'Search',
        resetText: 'Clear',
        columns: [{ prop: 'name', label: '姓名' }],
        data: ref([{ name: 'Tom', age: 18 }]),
        pagination: {
          currentPage: ref(1),
          pageSize: ref(10),
          total: ref(1),
        },
      }),
  })

  app.mount(host)
  await nextTick()

  const buttons = [...host.querySelectorAll('button')]
  expect(buttons.some(button => button.textContent?.includes('Search'))).toBe(true)
  expect(buttons.some(button => button.textContent?.includes('Clear'))).toBe(true)

  app.unmount()
  host.remove()
})
```

- [ ] **Step 2: Update props interface**

In `packages/el-comps/src/components/FecQueryTable.tsx`, add to `FecQueryTableProps`:

```ts
submitText?: string
resetText?: string
```

Add runtime props:

```ts
submitText: {
  type: String,
  default: '查询',
},
resetText: {
  type: String,
  default: '重置',
},
```

- [ ] **Step 3: Render prop values**

Replace the hard-coded button children:

```tsx
<FeButton type="primary" onClick={() => emit('submit')}>
  查询
</FeButton>,
<FeButton onClick={() => emit('reset')}>
  重置
</FeButton>,
```

with:

```tsx
<FeButton type="primary" onClick={() => emit('submit')}>
  {props.submitText}
</FeButton>,
<FeButton onClick={() => emit('reset')}>
  {props.resetText}
</FeButton>,
```

- [ ] **Step 4: Verify composite package**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecQueryTable.spec.ts
pnpm typecheck
```

Expected: both commands pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add packages/el-comps/src/components/FecQueryTable.tsx packages/el-comps/__tests__/fecQueryTable.spec.ts
git commit -m "feat: allow query table action labels"
```

---

## Task 7: Compatibility and Naming Docs

**Files:**

- Modify: `docs/component-wrapper-contract.md`
- Modify: `docs/consumer-setup.md`
- Modify: `packages/el-plus/__tests__/runtimeExports.spec.ts`

- [ ] **Step 1: Document compatibility aliases as compatibility-only**

In `docs/component-wrapper-contract.md`, replace the compatibility aliases paragraph with:

```md
Compatibility aliases only align the public `Fe*` API surface with Element Plus.
They do not inject `fe-*` classes and should not be treated as full transparent
wrappers. `FeLoading`, `FePopper`, and `FePopperArrow` fall into this category
because they are plugin/provider/internal primitives without a stable DOM class
target under the transparent wrapper strategy. New code should prefer documented
transparent wrappers or service wrappers when those exist.
```

- [ ] **Step 2: Document directive naming direction**

Add this paragraph to the directive part of `docs/component-wrapper-contract.md`:

```md
Directive aliases should use the `vFe*` form in examples when they are consumed
as Vue directives. Existing non-`v` aliases remain for compatibility and should
not be removed outside a planned major release.
```

- [ ] **Step 3: Add a test comment to lock current compatibility**

In `packages/el-plus/__tests__/runtimeExports.spec.ts`, add this comment above the `aliases Element Plus directives without app-level registration` test:

```ts
  // Keep both names until a major release formally removes the legacy alias.
```

- [ ] **Step 4: Verify docs and runtime tests**

Run:

```bash
pnpm exec vitest run packages/el-plus/__tests__/runtimeExports.spec.ts
rg "compatibility aliases|vFe\\*|FeInfiniteScroll" docs packages/el-plus/__tests__/runtimeExports.spec.ts
```

Expected: tests pass and search output shows the compatibility direction in docs.

- [ ] **Step 5: Commit**

Run:

```bash
git add docs/component-wrapper-contract.md docs/consumer-setup.md packages/el-plus/__tests__/runtimeExports.spec.ts
git commit -m "docs: clarify compatibility alias direction"
```

---

## Final Verification

After all tasks are complete, run the focused checks first:

```bash
pnpm --filter @fizz/el-plus typecheck
pnpm --filter @fizz/el-plus typecheck:consumer
pnpm exec vitest run packages/el-plus/__tests__
pnpm exec vitest run packages/el-comps/__tests__
pnpm exec vitest run packages/theme/__tests__
```

Then run the release path:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

Expected: every command passes. On Windows, keep these build commands sequential because multiple package builds can clean `dist/` directories.

## Deferred Work

- `FecTable` and `FecQueryTable` SFC migration: do this only after the control resolver and text props are stable, so the migration is mechanical.
- Token reference/system/component layering: do this when the token count grows enough that repeated aliases become difficult to review.
- Namespace parameterization: do this only with a real multi-app or micro-frontend requirement because it changes Sass, runtime provider, theme selectors, tests, and docs together.
- VitePress documentation site: do this after the API contracts above are stable enough to document for consumers.
