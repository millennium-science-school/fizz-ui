# Resource Management Layout And VueUse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add resource-management page building blocks for tree-driven split layouts, sectioned detail pages, and common search field controls while using VueUse only where it removes local browser plumbing.

**Architecture:** Keep `@fizz/el-kit` headless and limited to schema type additions in this wave. Build `@fizz/el-comps` components as thin Vue render surfaces over existing `@fizz/el-plus` wrappers. Use `FeSplitter` and `FeSplitterPanel` for split-pane drag behavior; do not implement custom drag or a `useResizablePanel` composable.

**Tech Stack:** Vue 3 SFCs, TypeScript, Element Plus via `@fizz/el-plus`, VueUse `@vueuse/core`, Vitest, vue-tsc, Vite library build, pnpm workspace.

---

## Scope Check

This plan implements one coherent component wave:

- P2/P3 resource-management layouts through split panes and tree panels.
- P5 detail pages through sectioned detail layout and local navigation.
- P1/P3/P6 search-form ergonomics through `dateRange` and `multiSelect` field kinds.
- VueUse adoption only where implementation code benefits from existing composables.

It does not implement import/upload workflows, tree tables, full-text search,
micro-app host protocols, permission systems, or a full dynamic form designer.

## Existing Facts To Preserve

- `@fizz/el-plus` already exports transparent wrappers for `FeSplitter`,
  `FeSplitterPanel`, `FeTree`, `FeTreeSelect`, `FeAnchor`, `FeAnchorLink`,
  `FeDatePicker`, `FeSelect`, and `FeOption`.
- Element Plus local version is `2.13.7`.
- Element Plus splitter public props:
  - `ElSplitter`: `layout?: 'horizontal' | 'vertical'`, `lazy?: boolean`
  - `ElSplitterPanel`: `min?: string | number`, `max?: string | number`,
    `size?: string | number`, `resizable?: boolean`, `collapsible?: boolean`
- Element Plus splitter emits:
  - `resizeStart(index, sizes)`
  - `resize(index, sizes)`
  - `resizeEnd(index, sizes)`
  - `collapse(index, type, sizes)`
  - `ElSplitterPanel` emits `update:size(value)`

## File Structure

- Modify: `packages/el-kit/src/types/field.ts`
  - Add `dateRange` and `multiSelect` field kinds.
- Modify: `packages/el-kit/__tests__/consumer-dist.typecheck.ts`
  - Cover the new field kinds from the public package.
- Modify: `packages/el-comps/src/components/shared/controls.ts`
  - Map `dateRange` and `multiSelect` to Element Plus controls.
- Modify: `packages/el-comps/src/components/shared/schemaFields.ts`
  - Render options for both `select` and `multiSelect`.
- Modify: `packages/el-comps/__tests__/schemaFields.spec.ts`
  - Cover date range and multi-select rendering behavior.
- Create: `packages/el-comps/src/components/fec-split-pane/FecSplitPane.vue`
  - Thin facade over `FeSplitter` and `FeSplitterPanel`.
- Create: `packages/el-comps/src/components/fec-split-pane/props.ts`
  - Public split-pane prop and event payload types.
- Create: `packages/el-comps/src/components/fec-split-pane/index.ts`
  - Local component entry and props export.
- Create: `packages/el-comps/src/components/fec-tree-panel/FecTreePanel.vue`
  - Generic tree panel with optional search, loading, empty, collapse, and node slots.
- Create: `packages/el-comps/src/components/fec-tree-panel/props.ts`
  - Public tree-panel prop and event payload types.
- Create: `packages/el-comps/src/components/fec-tree-panel/index.ts`
  - Local component entry and props export.
- Create: `packages/el-comps/src/components/fec-detail-sections/FecDetailSections.vue`
  - Multi-section page/detail layout with optional local navigation.
- Create: `packages/el-comps/src/components/fec-detail-sections/props.ts`
  - Public detail-section types.
- Create: `packages/el-comps/src/components/fec-detail-sections/index.ts`
  - Local component entry and props export.
- Modify: `packages/el-comps/src/index.ts`
  - Export the new components and public types.
- Modify: `packages/el-comps/__tests__/componentStructure.spec.ts`
  - Include the three new component directories.
- Create: `packages/el-comps/__tests__/fecSplitPane.spec.ts`
  - Runtime tests for split pane rendering and forwarded events.
- Create: `packages/el-comps/__tests__/fecTreePanel.spec.ts`
  - Runtime tests for search, empty/loading, collapse, and node click.
- Create: `packages/el-comps/__tests__/fecDetailSections.spec.ts`
  - Runtime tests for section rendering and navigation.
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`
  - Consumer type coverage for new components and field kinds.
- Modify: `packages/el-comps/package.json`
  - Add `@vueuse/core` dependency only if `FecTreePanel` imports VueUse at runtime.
- Modify: `playground/src/main.ts`
  - Add resource layout demo route to the existing `createRouter` route list.
- Create: `playground/src/views/ResourceLayoutPage.vue`
  - Demonstrate P2/P3/P5 coverage without bloating `CrudPage.vue`.
- Modify: `playground/__tests__/integration.spec.ts`
  - Assert the new playground route exists and covers key component names.
- Modify: `docs/consumer-setup.md`
  - Add a short note pointing resource-layout users to the new components.

---

### Task 1: Add Field Kinds For Date Range And Multi Select

**Files:**
- Modify: `packages/el-kit/src/types/field.ts`
- Modify: `packages/el-kit/__tests__/consumer-dist.typecheck.ts`
- Modify: `packages/el-comps/src/components/shared/controls.ts`
- Modify: `packages/el-comps/src/components/shared/schemaFields.ts`
- Modify: `packages/el-comps/__tests__/schemaFields.spec.ts`
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`

- [ ] **Step 1: Add failing el-kit consumer type coverage**

In `packages/el-kit/__tests__/consumer-dist.typecheck.ts`, extend the existing schema coverage with:

```ts
const querySchemaWithNewKinds = defineQuerySchema<Query>([
  { prop: 'keyword', label: '关键词', kind: 'input' },
  { prop: 'enabled', label: '状态', kind: 'multiSelect', options: statusOptions },
  { prop: 'keyword', label: '日期范围', kind: 'dateRange' },
])

const formSchemaWithNewKinds = defineFormSchema<User>([
  { prop: 'name', label: '姓名', kind: 'multiSelect', options: statusOptions },
  { prop: 'age', label: '日期范围', kind: 'dateRange' },
])

void querySchemaWithNewKinds
void formSchemaWithNewKinds
```

- [ ] **Step 2: Run el-kit consumer typecheck and verify it fails**

Run:

```bash
pnpm --filter @fizz/el-kit typecheck:consumer
```

Expected: FAIL because `multiSelect` and `dateRange` are not assignable to `FieldControlKind`.

- [ ] **Step 3: Add failing schema rendering tests**

In `packages/el-comps/__tests__/schemaFields.spec.ts`, add tests using the existing test style:

```ts
it('renders multi-select options through the select control', () => {
  const nodes = renderSchemaFields({
    model: { status: ['enabled'] },
    onUpdateField: () => {},
    schema: [
      {
        kind: 'multiSelect',
        label: '状态',
        options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled', disabled: true },
        ],
        prop: 'status',
      },
    ],
  })

  expect(nodes).toHaveLength(1)
})

it('renders date range fields through the date picker control', () => {
  const nodes = renderSchemaFields({
    model: { createdAt: [] },
    onUpdateField: () => {},
    schema: [
      {
        kind: 'dateRange',
        label: '创建时间',
        prop: 'createdAt',
      },
    ],
  })

  expect(nodes).toHaveLength(1)
})
```

- [ ] **Step 4: Run schema fields test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/schemaFields.spec.ts
```

Expected: FAIL because `FieldControlKind` does not include the new values.

- [ ] **Step 5: Extend `FieldControlKind`**

Modify `packages/el-kit/src/types/field.ts`:

```ts
export type FieldControlKind
  = | 'input'
    | 'number'
    | 'select'
    | 'multiSelect'
    | 'date'
    | 'dateRange'
    | 'switch'
    | 'textarea'
```

- [ ] **Step 6: Map new controls in el-comps**

Modify `packages/el-comps/src/components/shared/controls.ts`:

```ts
  if (control === 'multiSelect') {
    return {
      component: FeSelect,
      props: { multiple: true },
    }
  }

  if (control === 'dateRange') {
    return {
      component: FeDatePicker,
      props: { type: 'daterange' },
    }
  }
```

Place `multiSelect` next to `select`, and `dateRange` next to `date`.

- [ ] **Step 7: Render options for multi-select**

Modify `packages/el-comps/src/components/shared/schemaFields.ts`:

```ts
function renderFieldOptions(item: FecSchemaFieldItem): VNodeChild[] | undefined {
  if (isCustomSchemaField(item) || (item.kind !== 'select' && item.kind !== 'multiSelect')) {
    return undefined
  }

  return item.options?.map((option, idx) =>
    h(FeOption, {
      key: idx,
      disabled: option.disabled,
      label: option.label,
      value: option.value as string | number | boolean | Record<string, unknown>,
    }),
  )
}
```

- [ ] **Step 8: Add el-comps consumer type coverage**

In `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`, add:

```ts
const querySchemaWithResourceFields = defineFecQuerySchema<Query>([
  { prop: 'keyword', label: '关键词', kind: 'input' },
  { prop: 'enabled', label: '状态', kind: 'multiSelect', options: statusOptions },
  { prop: 'keyword', label: '时间范围', kind: 'dateRange' },
])

const formSchemaWithResourceFields = defineFecFormSchema<User>([
  { prop: 'name', label: '状态', kind: 'multiSelect', options: statusOptions },
  { prop: 'age', label: '时间范围', kind: 'dateRange' },
])

void querySchemaWithResourceFields
void formSchemaWithResourceFields
```

- [ ] **Step 9: Run focused checks**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/schemaFields.spec.ts
pnpm --filter @fizz/el-kit typecheck
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 10: Commit field kind expansion**

Run:

```bash
git add packages/el-kit/src/types/field.ts packages/el-kit/__tests__/consumer-dist.typecheck.ts packages/el-comps/src/components/shared/controls.ts packages/el-comps/src/components/shared/schemaFields.ts packages/el-comps/__tests__/schemaFields.spec.ts packages/el-comps/__tests__/consumer-dist.typecheck.tsx
git commit -m "feat: add resource search field kinds"
```

---

### Task 2: Add FecSplitPane As A Thin FeSplitter Facade

**Files:**
- Create: `packages/el-comps/src/components/fec-split-pane/FecSplitPane.vue`
- Create: `packages/el-comps/src/components/fec-split-pane/props.ts`
- Create: `packages/el-comps/src/components/fec-split-pane/index.ts`
- Modify: `packages/el-comps/src/index.ts`
- Modify: `packages/el-comps/__tests__/componentStructure.spec.ts`
- Create: `packages/el-comps/__tests__/fecSplitPane.spec.ts`
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`

- [ ] **Step 1: Add failing structure coverage**

In `packages/el-comps/__tests__/componentStructure.spec.ts`, add this component path to the `components` array:

```ts
'fec-split-pane/FecSplitPane.vue',
```

- [ ] **Step 2: Add failing split-pane runtime tests**

Create `packages/el-comps/__tests__/fecSplitPane.spec.ts`:

```ts
import { createApp, h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { FecSplitPane } from '../src'

describe('FecSplitPane', () => {
  it('renders left and right slots through the splitter facade', async () => {
    const host = document.createElement('div')
    const app = createApp({
      render() {
        return h(FecSplitPane, { leftSize: 260 }, {
          default: () => h('div', { class: 'right-content' }, 'Right'),
          left: () => h('div', { class: 'left-content' }, 'Left'),
        })
      },
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-split-pane')).not.toBeNull()
    expect(host.querySelector('.left-content')?.textContent).toBe('Left')
    expect(host.querySelector('.right-content')?.textContent).toBe('Right')

    app.unmount()
  })

  it('forwards left panel size updates', async () => {
    const host = document.createElement('div')
    const size = ref<string | number>(260)
    const app = createApp({
      render() {
        return h(FecSplitPane, {
          leftSize: size.value,
          'onUpdate:leftSize': (value: string | number) => {
            size.value = value
          },
        }, {
          default: () => 'Right',
          left: () => 'Left',
        })
      },
    })

    app.mount(host)
    await nextTick()

    const vnode = app._instance?.subTree
    expect(vnode).toBeTruthy()

    app.unmount()
  })
})
```

- [ ] **Step 3: Run split-pane tests and verify they fail**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecSplitPane.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts
```

Expected: FAIL because `FecSplitPane` is not exported and the component directory does not exist.

- [ ] **Step 4: Create split-pane props**

Create `packages/el-comps/src/components/fec-split-pane/props.ts`:

```ts
export type FecSplitPaneLayout = 'horizontal' | 'vertical'
export type FecSplitPaneCollapseType = 'start' | 'end'
export type FecSplitPaneSize = string | number

export interface FecSplitPaneProps {
  layout?: FecSplitPaneLayout
  lazy?: boolean
  leftSize?: FecSplitPaneSize
  leftMin?: FecSplitPaneSize
  leftMax?: FecSplitPaneSize
  leftResizable?: boolean
  leftCollapsible?: boolean
  rightMin?: FecSplitPaneSize
  rightMax?: FecSplitPaneSize
  rightResizable?: boolean
  rightCollapsible?: boolean
}

export type FecSplitPaneSizes = FecSplitPaneSize[]
```

- [ ] **Step 5: Create `FecSplitPane.vue` using FeSplitter**

Create `packages/el-comps/src/components/fec-split-pane/FecSplitPane.vue`:

```vue
<script lang="ts">
import type { PropType } from 'vue'
import type {
  FecSplitPaneCollapseType,
  FecSplitPaneLayout,
  FecSplitPaneSize,
  FecSplitPaneSizes,
} from './props'
import { FeSplitter, FeSplitterPanel } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecSplitPane',
  props: {
    layout: {
      type: String as PropType<FecSplitPaneLayout>,
      default: 'horizontal',
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    leftSize: {
      type: [String, Number] as PropType<FecSplitPaneSize>,
      default: undefined,
    },
    leftMin: {
      type: [String, Number] as PropType<FecSplitPaneSize>,
      default: undefined,
    },
    leftMax: {
      type: [String, Number] as PropType<FecSplitPaneSize>,
      default: undefined,
    },
    leftResizable: {
      type: Boolean,
      default: true,
    },
    leftCollapsible: {
      type: Boolean,
      default: false,
    },
    rightMin: {
      type: [String, Number] as PropType<FecSplitPaneSize>,
      default: undefined,
    },
    rightMax: {
      type: [String, Number] as PropType<FecSplitPaneSize>,
      default: undefined,
    },
    rightResizable: {
      type: Boolean,
      default: true,
    },
    rightCollapsible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:leftSize', 'resizeStart', 'resize', 'resizeEnd', 'collapse'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        FeSplitter,
        {
          class: 'fe-comps-split-pane',
          layout: props.layout,
          lazy: props.lazy,
          onCollapse: (index: number, type: FecSplitPaneCollapseType, sizes: FecSplitPaneSizes) =>
            emit('collapse', index, type, sizes),
          onResize: (index: number, sizes: FecSplitPaneSizes) =>
            emit('resize', index, sizes),
          onResizeEnd: (index: number, sizes: FecSplitPaneSizes) =>
            emit('resizeEnd', index, sizes),
          onResizeStart: (index: number, sizes: FecSplitPaneSizes) =>
            emit('resizeStart', index, sizes),
        },
        () => [
          h(
            FeSplitterPanel,
            {
              class: 'fe-comps-split-pane__left',
              collapsible: props.leftCollapsible,
              max: props.leftMax,
              min: props.leftMin,
              resizable: props.leftResizable,
              size: props.leftSize,
              'onUpdate:size': (value: FecSplitPaneSize) => emit('update:leftSize', value),
            },
            slots.left,
          ),
          h(
            FeSplitterPanel,
            {
              class: 'fe-comps-split-pane__right',
              collapsible: props.rightCollapsible,
              max: props.rightMax,
              min: props.rightMin,
              resizable: props.rightResizable,
            },
            slots.default,
          ),
        ],
      )
  },
})
</script>
```

- [ ] **Step 6: Create local index**

Create `packages/el-comps/src/components/fec-split-pane/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecSplitPaneProps } from './props'
import FecSplitPaneImpl from './FecSplitPane.vue'

export const FecSplitPane = FecSplitPaneImpl as unknown as new () => {
  $props: FecSplitPaneProps & VNodeProps & AllowedComponentProps & {
    'onUpdate:leftSize'?: (...args: any[]) => void
    'onResizeStart'?: (...args: any[]) => void
    'onResize'?: (...args: any[]) => void
    'onResizeEnd'?: (...args: any[]) => void
    'onCollapse'?: (...args: any[]) => void
  }
}

export type {
  FecSplitPaneCollapseType,
  FecSplitPaneLayout,
  FecSplitPaneProps,
  FecSplitPaneSize,
  FecSplitPaneSizes,
} from './props'
export default FecSplitPaneImpl
```

- [ ] **Step 7: Export from package root**

Modify `packages/el-comps/src/index.ts`:

```ts
export { FecSplitPane } from './components/fec-split-pane'
export type {
  FecSplitPaneCollapseType,
  FecSplitPaneLayout,
  FecSplitPaneProps,
  FecSplitPaneSize,
  FecSplitPaneSizes,
} from './components/fec-split-pane'
```

- [ ] **Step 8: Add consumer type coverage**

In `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`, import `FecSplitPane` and `FecSplitPaneProps`, then add:

```tsx
const splitPaneProps: FecSplitPaneProps = {
  leftCollapsible: true,
  leftMax: '50%',
  leftMin: 180,
  leftSize: 280,
}

const splitPaneVNode = (
  <FecSplitPane
    {...splitPaneProps}
    {...{
      'onUpdate:leftSize': (value: string | number) => {
        void value
      },
    }}
  />
)

void splitPaneVNode
```

- [ ] **Step 9: Run focused checks**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecSplitPane.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 10: Commit split-pane facade**

Run:

```bash
git add packages/el-comps/src/components/fec-split-pane packages/el-comps/src/index.ts packages/el-comps/__tests__/fecSplitPane.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts packages/el-comps/__tests__/consumer-dist.typecheck.tsx
git commit -m "feat: add split pane composite"
```

---

### Task 3: Add FecTreePanel With VueUse-Debounced Filtering

**Files:**
- Create: `packages/el-comps/src/components/fec-tree-panel/FecTreePanel.vue`
- Create: `packages/el-comps/src/components/fec-tree-panel/props.ts`
- Create: `packages/el-comps/src/components/fec-tree-panel/index.ts`
- Modify: `packages/el-comps/src/index.ts`
- Modify: `packages/el-comps/package.json`
- Modify: `packages/el-comps/__tests__/componentStructure.spec.ts`
- Create: `packages/el-comps/__tests__/fecTreePanel.spec.ts`
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`

- [ ] **Step 1: Add VueUse dependency to el-comps**

Modify `packages/el-comps/package.json`:

```json
"dependencies": {
  "@fizz/el-kit": "workspace:*",
  "@vueuse/core": "catalog:"
}
```

Keep `@vueuse/core` out of `peerDependencies`.

- [ ] **Step 2: Add failing structure coverage**

In `packages/el-comps/__tests__/componentStructure.spec.ts`, add:

```ts
'fec-tree-panel/FecTreePanel.vue',
```

- [ ] **Step 3: Add failing tree-panel runtime tests**

Create `packages/el-comps/__tests__/fecTreePanel.spec.ts`:

```ts
import { createApp, h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { FecTreePanel } from '../src'

interface Node {
  id: string
  label: string
  children?: Node[]
}

const data: Node[] = [
  { id: 'network', label: 'Network' },
  { id: 'service', label: 'Service' },
]

describe('FecTreePanel', () => {
  it('renders search input and tree content', async () => {
    const host = document.createElement('div')
    const app = createApp({
      render() {
        return h(FecTreePanel<Node>, {
          data,
          nodeKey: 'id',
          searchable: true,
        })
      },
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-tree-panel')).not.toBeNull()
    expect(host.textContent).toContain('Network')

    app.unmount()
  })

  it('emits collapse updates from the collapse control', async () => {
    const host = document.createElement('div')
    const onUpdateCollapsed = vi.fn()
    const app = createApp({
      render() {
        return h(FecTreePanel<Node>, {
          collapsible: true,
          data,
          nodeKey: 'id',
          onUpdateCollapsed,
        })
      },
    })

    app.mount(host)
    await nextTick()

    const button = host.querySelector('button') as HTMLButtonElement
    button.click()
    await nextTick()

    expect(onUpdateCollapsed).toHaveBeenCalledWith(true)

    app.unmount()
  })
})
```

- [ ] **Step 4: Run tree-panel tests and verify they fail**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecTreePanel.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts
```

Expected: FAIL because `FecTreePanel` is not exported.

- [ ] **Step 5: Create tree-panel props**

Create `packages/el-comps/src/components/fec-tree-panel/props.ts`:

```ts
export interface FecTreePanelNodeProps {
  label?: string
  children?: string
  disabled?: string
  isLeaf?: string
}

export interface FecTreePanelProps<Node extends object> {
  data: readonly Node[]
  nodeKey?: string
  props?: FecTreePanelNodeProps
  searchable?: boolean
  searchPlaceholder?: string
  filterDebounce?: number
  collapsible?: boolean
  collapsed?: boolean
  loading?: boolean
  emptyText?: string
}
```

- [ ] **Step 6: Create `FecTreePanel.vue`**

Create `packages/el-comps/src/components/fec-tree-panel/FecTreePanel.vue`:

```vue
<script lang="ts">
import type { PropType } from 'vue'
import type { FecTreePanelNodeProps } from './props'
import { FeButton, FeEmpty, FeInput, FeTree, vFeLoading } from '@fizz/el-plus'
import { useDebounceFn } from '@vueuse/core'
import { defineComponent, h, ref, watch, withDirectives } from 'vue'

type TreeNodeRecord = Record<string, unknown>

export default defineComponent({
  name: 'FecTreePanel',
  props: {
    data: {
      type: Array as PropType<readonly TreeNodeRecord[]>,
      required: true,
    },
    nodeKey: {
      type: String,
      default: 'id',
    },
    props: {
      type: Object as PropType<FecTreePanelNodeProps>,
      default: () => ({ label: 'label', children: 'children', disabled: 'disabled', isLeaf: 'isLeaf' }),
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: 'Search',
    },
    filterDebounce: {
      type: Number,
      default: 120,
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: 'No data',
    },
  },
  emits: ['update:collapsed', 'nodeClick'],
  setup(props, { emit, slots }) {
    const keyword = ref('')
    const treeRef = ref<any>()

    const applyFilter = useDebounceFn((value: string) => {
      treeRef.value?.filter?.(value)
    }, props.filterDebounce)

    watch(keyword, value => applyFilter(value))

    function filterNode(value: string, data: TreeNodeRecord) {
      if (!value)
        return true

      const labelKey = props.props.label ?? 'label'
      return String(data[labelKey] ?? '').toLowerCase().includes(value.toLowerCase())
    }

    return () =>
      h('aside', {
        class: [
          'fe-comps-tree-panel',
          props.collapsed ? 'fe-comps-tree-panel--collapsed' : undefined,
        ],
      }, [
        props.searchable || props.collapsible
          ? h('div', { class: 'fe-comps-tree-panel__header' }, [
              props.searchable
                ? h(FeInput, {
                    class: 'fe-comps-tree-panel__search',
                    modelValue: keyword.value,
                    placeholder: props.searchPlaceholder,
                    'onUpdate:modelValue': (value: string) => {
                      keyword.value = value
                    },
                  })
                : null,
              props.collapsible
                ? h(FeButton, {
                    class: 'fe-comps-tree-panel__collapse',
                    onClick: () => emit('update:collapsed', !props.collapsed),
                  }, () => props.collapsed ? 'Expand' : 'Collapse')
                : null,
            ])
          : null,
        props.collapsed
          ? null
          : withDirectives(
              props.data.length
                ? h(FeTree, {
                    ref: treeRef,
                    class: 'fe-comps-tree-panel__tree',
                    data: props.data,
                    filterNodeMethod: filterNode,
                    nodeKey: props.nodeKey,
                    props: props.props,
                    onNodeClick: (node: TreeNodeRecord, treeNode: unknown, component: unknown, event: Event) =>
                      emit('nodeClick', node, treeNode, component, event),
                  }, slots)
                : h(FeEmpty, {
                    class: 'fe-comps-tree-panel__empty',
                    description: props.emptyText,
                  }),
              [[vFeLoading, props.loading]],
            ),
      ])
  },
})
</script>
```

- [ ] **Step 7: Create local index**

Create `packages/el-comps/src/components/fec-tree-panel/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecTreePanelProps } from './props'
import FecTreePanelImpl from './FecTreePanel.vue'

export const FecTreePanel = FecTreePanelImpl as unknown as new <
  Node extends object = any,
>() => {
  $props: FecTreePanelProps<Node> & VNodeProps & AllowedComponentProps & {
    'onUpdate:collapsed'?: (...args: any[]) => void
    'onNodeClick'?: (...args: any[]) => void
  }
}

export type { FecTreePanelNodeProps, FecTreePanelProps } from './props'
export default FecTreePanelImpl
```

- [ ] **Step 8: Export from package root**

Modify `packages/el-comps/src/index.ts`:

```ts
export { FecTreePanel } from './components/fec-tree-panel'
export type {
  FecTreePanelNodeProps,
  FecTreePanelProps,
} from './components/fec-tree-panel'
```

- [ ] **Step 9: Add consumer type coverage**

In `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`, import `FecTreePanel` and `FecTreePanelProps`, then add:

```tsx
interface ResourceNode {
  id: string
  label: string
  children?: ResourceNode[]
}

const resourceTreeData: ResourceNode[] = [
  { id: 'network', label: 'Network' },
]

const treePanelProps: FecTreePanelProps<ResourceNode> = {
  data: resourceTreeData,
  nodeKey: 'id',
  searchable: true,
}

const treePanelVNode = (
  <FecTreePanel<ResourceNode>
    {...treePanelProps}
    onNodeClick={(node) => {
      node.id.toUpperCase()
    }}
  />
)

void treePanelVNode
```

- [ ] **Step 10: Run focused checks**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecTreePanel.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 11: Commit tree panel**

Run:

```bash
git add packages/el-comps/package.json packages/el-comps/src/components/fec-tree-panel packages/el-comps/src/index.ts packages/el-comps/__tests__/fecTreePanel.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts packages/el-comps/__tests__/consumer-dist.typecheck.tsx
git commit -m "feat: add tree panel composite"
```

---

### Task 4: Add Detail Sections Layout

**Files:**
- Create: `packages/el-comps/src/components/fec-detail-sections/FecDetailSections.vue`
- Create: `packages/el-comps/src/components/fec-detail-sections/props.ts`
- Create: `packages/el-comps/src/components/fec-detail-sections/index.ts`
- Modify: `packages/el-comps/src/index.ts`
- Modify: `packages/el-comps/__tests__/componentStructure.spec.ts`
- Create: `packages/el-comps/__tests__/fecDetailSections.spec.ts`
- Modify: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`

- [ ] **Step 1: Add failing structure coverage**

In `packages/el-comps/__tests__/componentStructure.spec.ts`, add:

```ts
'fec-detail-sections/FecDetailSections.vue',
```

- [ ] **Step 2: Add failing detail sections runtime test**

Create `packages/el-comps/__tests__/fecDetailSections.spec.ts`:

```ts
import { createApp, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { FecDetailSections } from '../src'

describe('FecDetailSections', () => {
  it('renders section slots and local navigation', async () => {
    const host = document.createElement('div')
    const app = createApp({
      render() {
        return h(FecDetailSections, {
          nav: true,
          sections: [
            { key: 'basic', title: 'Basic' },
            { key: 'resource', title: 'Resource' },
          ],
        }, {
          basic: () => h('div', { class: 'basic-slot' }, 'Basic content'),
          resource: () => h('div', { class: 'resource-slot' }, 'Resource content'),
        })
      },
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-comps-detail-sections')).not.toBeNull()
    expect(host.textContent).toContain('Basic content')
    expect(host.textContent).toContain('Resource content')
    expect(host.querySelector('.fe-comps-detail-sections__nav')).not.toBeNull()

    app.unmount()
  })
})
```

- [ ] **Step 3: Run detail sections test and verify it fails**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecDetailSections.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts
```

Expected: FAIL because `FecDetailSections` is not exported.

- [ ] **Step 4: Create detail sections props**

Create `packages/el-comps/src/components/fec-detail-sections/props.ts`:

```ts
export interface FecDetailSectionItem {
  key: string
  title: string
  description?: string
}

export interface FecDetailSectionsProps {
  sections: readonly FecDetailSectionItem[]
  nav?: boolean
}
```

- [ ] **Step 5: Create `FecDetailSections.vue`**

Create `packages/el-comps/src/components/fec-detail-sections/FecDetailSections.vue`:

```vue
<script lang="ts">
import type { PropType } from 'vue'
import type { FecDetailSectionItem } from './props'
import { FeAnchor, FeAnchorLink } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'
import FecSection from '../fec-section/FecSection.vue'

function sectionId(key: string) {
  return `fec-detail-section-${key}`
}

export default defineComponent({
  name: 'FecDetailSections',
  props: {
    sections: {
      type: Array as PropType<readonly FecDetailSectionItem[]>,
      required: true,
    },
    nav: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'fe-comps-detail-sections' }, [
        h('div', { class: 'fe-comps-detail-sections__main' },
          props.sections.map(section =>
            h(FecSection, {
              key: section.key,
              class: 'fe-comps-detail-sections__section',
              description: section.description,
              id: sectionId(section.key),
              title: section.title,
            }, () => slots[section.key]?.()),
          ),
        ),
        props.nav
          ? h('aside', { class: 'fe-comps-detail-sections__nav' }, [
              h(FeAnchor, {}, () =>
                props.sections.map(section =>
                  h(FeAnchorLink, {
                    key: section.key,
                    href: `#${sectionId(section.key)}`,
                    title: section.title,
                  }),
                ),
              ),
            ])
          : null,
      ])
  },
})
</script>
```

- [ ] **Step 6: Create local index**

Create `packages/el-comps/src/components/fec-detail-sections/index.ts`:

```ts
import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDetailSectionsProps } from './props'
import FecDetailSectionsImpl from './FecDetailSections.vue'

export const FecDetailSections = FecDetailSectionsImpl as unknown as new () => {
  $props: FecDetailSectionsProps & VNodeProps & AllowedComponentProps
}

export type { FecDetailSectionItem, FecDetailSectionsProps } from './props'
export default FecDetailSectionsImpl
```

- [ ] **Step 7: Export from package root**

Modify `packages/el-comps/src/index.ts`:

```ts
export { FecDetailSections } from './components/fec-detail-sections'
export type {
  FecDetailSectionItem,
  FecDetailSectionsProps,
} from './components/fec-detail-sections'
```

- [ ] **Step 8: Add consumer type coverage**

In `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`, import `FecDetailSections`, `FecDetailSectionItem`, and `FecDetailSectionsProps`, then add:

```tsx
const detailSections: FecDetailSectionItem[] = [
  { key: 'basic', title: 'Basic' },
  { key: 'resource', title: 'Resource', description: 'Resource details' },
]

const detailSectionsProps: FecDetailSectionsProps = {
  nav: true,
  sections: detailSections,
}

const detailSectionsVNode = (
  <FecDetailSections {...detailSectionsProps} />
)

void detailSectionsVNode
```

- [ ] **Step 9: Run focused checks**

Run:

```bash
pnpm exec vitest run packages/el-comps/__tests__/fecDetailSections.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts
pnpm --filter @fizz/el-comps typecheck
```

Expected: PASS.

- [ ] **Step 10: Commit detail sections**

Run:

```bash
git add packages/el-comps/src/components/fec-detail-sections packages/el-comps/src/index.ts packages/el-comps/__tests__/fecDetailSections.spec.ts packages/el-comps/__tests__/componentStructure.spec.ts packages/el-comps/__tests__/consumer-dist.typecheck.tsx
git commit -m "feat: add detail sections layout"
```

---

### Task 5: Add Resource Layout Playground Page

**Files:**
- Create: `playground/src/views/ResourceLayoutPage.vue`
- Modify: `playground/src/main.ts`
- Modify: `playground/__tests__/integration.spec.ts`

- [ ] **Step 1: Create resource layout playground page**

Create `playground/src/views/ResourceLayoutPage.vue`:

```vue
<script setup lang="ts">
import {
  defineFecDetailSchema,
  defineFecQuerySchema,
  FecDetail,
  FecDetailSections,
  FecPage,
  FecQueryForm,
  FecSplitPane,
  FecTreePanel,
} from '@fizz/el-comps'
import { ref } from 'vue'

interface ResourceNode {
  id: string
  label: string
  type: string
  children?: ResourceNode[]
}

interface Query {
  keyword: string
  status: string[]
  period: string[]
}

interface ResourceDetail {
  name: string
  type: string
  status: string
  owner: string
}

const tree = ref<ResourceNode[]>([
  {
    id: 'network',
    label: 'Network',
    type: 'group',
    children: [
      { id: 'router-1', label: 'Router 1', type: 'device' },
      { id: 'switch-1', label: 'Switch 1', type: 'device' },
    ],
  },
  {
    id: 'service',
    label: 'Service',
    type: 'group',
    children: [
      { id: 'vpn-1', label: 'VPN 1', type: 'service' },
    ],
  },
])

const query = ref<Query>({ keyword: '', period: [], status: [] })
const selected = ref<ResourceDetail>({
  name: 'Router 1',
  owner: 'Network Team',
  status: 'Online',
  type: 'Device',
})
const treeCollapsed = ref(false)
const leftSize = ref<string | number>(280)

const querySchema = defineFecQuerySchema<Query>([
  { prop: 'keyword', label: 'Keyword', kind: 'input' },
  {
    prop: 'status',
    label: 'Status',
    kind: 'multiSelect',
    options: [
      { label: 'Online', value: 'online' },
      { label: 'Offline', value: 'offline' },
    ],
  },
  { prop: 'period', label: 'Period', kind: 'dateRange' },
])

const detailSchema = defineFecDetailSchema<ResourceDetail>([
  { prop: 'name', label: 'Name' },
  { prop: 'type', label: 'Type' },
  { prop: 'status', label: 'Status' },
  { prop: 'owner', label: 'Owner' },
])

const sections = [
  { key: 'basic', title: 'Basic Information' },
  { key: 'resource', title: 'Resource Information' },
]

function handleNodeClick(node: ResourceNode) {
  selected.value = {
    name: node.label,
    owner: node.type === 'service' ? 'Service Team' : 'Network Team',
    status: 'Online',
    type: node.type,
  }
}
</script>

<template>
  <FecPage title="Resource Layout" description="Tree-driven resource management layout">
    <FecQueryForm
      v-model:model="query"
      :schema="querySchema"
      submit-text="Search"
      reset-text="Reset"
    />

    <FecSplitPane
      v-model:left-size="leftSize"
      class="resource-layout-demo__split"
      :left-min="220"
      left-max="50%"
      left-collapsible
    >
      <template #left>
        <FecTreePanel
          v-model:collapsed="treeCollapsed"
          :data="tree"
          node-key="id"
          searchable
          collapsible
          @node-click="handleNodeClick"
        />
      </template>

      <FecDetailSections :sections="sections" nav>
        <template #basic>
          <FecDetail :record="selected" :schema="detailSchema" :columns="2" />
        </template>
        <template #resource>
          <FecDetail :record="selected" :schema="detailSchema" :columns="2" />
        </template>
      </FecDetailSections>
    </FecSplitPane>
  </FecPage>
</template>
```

- [ ] **Step 2: Add playground route**

Modify `playground/src/main.ts`. Add this route object after the existing `/comps-lab` route:

```ts
{
  component: () => import('./views/ResourceLayoutPage.vue'),
  path: '/resource-layout',
}
```

- [ ] **Step 3: Add integration assertions**

Modify `playground/__tests__/integration.spec.ts`:

```ts
it('resource layout page covers tree split and detail sections', () => {
  const page = readFileSync(resolve(root, 'src/views/ResourceLayoutPage.vue'), 'utf8')

  expect(page).toContain('FecSplitPane')
  expect(page).toContain('FecTreePanel')
  expect(page).toContain('FecDetailSections')
  expect(page).toContain('multiSelect')
  expect(page).toContain('dateRange')
})
```

Use the existing `root` helper from the file.

- [ ] **Step 4: Run playground checks**

Run:

```bash
pnpm exec vitest run playground/__tests__/integration.spec.ts
pnpm -C playground build
```

Expected: PASS.

- [ ] **Step 5: Commit playground resource layout demo**

Run:

```bash
git add playground/src playground/__tests__/integration.spec.ts
git commit -m "test: cover resource layout playground"
```

---

### Task 6: Update Documentation And Package Checks

**Files:**
- Modify: `docs/consumer-setup.md`
- Modify: `docs/superpowers/specs/2026-05-29-resource-management-layout-vueuse-design.md`

- [ ] **Step 1: Add consumer setup note**

In `docs/consumer-setup.md`, add a short section after "Near-term Component Expansion":

```md
## Resource Management Layouts

Resource-management pages can use `FecSplitPane`, `FecTreePanel`, and
`FecDetailSections` for tree-driven workspaces and multi-section detail pages.
`FecSplitPane` delegates drag behavior to Element Plus splitter through
`@fizz/el-plus`; Fizz does not implement custom splitter dragging.
```

- [ ] **Step 2: Update spec decisions if implementation names changed**

Open `docs/superpowers/specs/2026-05-29-resource-management-layout-vueuse-design.md` and ensure the final names match the implemented names:

```text
FecSplitPane
FecTreePanel
FecDetailSections
dateRange
multiSelect
```

No changes are needed if those names already match.

- [ ] **Step 3: Run consumer package checks**

Run:

```bash
pnpm --filter @fizz/el-kit typecheck:consumer
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: PASS and `assert-public-dts.mjs` reports no public path leakage.

- [ ] **Step 4: Inspect generated declaration surface**

Run:

```bash
rg -n "FecSplitPane|FecTreePanel|FecDetailSections|dateRange|multiSelect|@vueuse|node_modules|src/components" packages/el-comps/dist packages/el-kit/dist
```

Expected:

- `FecSplitPane`, `FecTreePanel`, `FecDetailSections`, `dateRange`, and `multiSelect` appear.
- `@vueuse/core` may appear only if it is part of a private generated component declaration. It must not appear as a package-root type that consumers must name.
- `node_modules` and private source paths do not appear in public declarations.

- [ ] **Step 5: Commit docs and declaration fixes**

Run:

```bash
git add docs/consumer-setup.md docs/superpowers/specs/2026-05-29-resource-management-layout-vueuse-design.md packages/el-comps/dist packages/el-kit/dist
git status --short
```

If `dist` files are ignored and not staged, commit only tracked docs/source/test files:

```bash
git add docs/consumer-setup.md docs/superpowers/specs/2026-05-29-resource-management-layout-vueuse-design.md
git commit -m "docs: describe resource layout components"
```

---

### Task 7: Full Verification

**Files:**
- No planned source changes unless verification reveals package-contract issues.

- [ ] **Step 1: Run focused verification**

Run:

```bash
pnpm exec vitest run packages/el-kit/__tests__ packages/el-comps/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-kit typecheck
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-kit typecheck:consumer
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm -C playground build
```

Expected: PASS.

- [ ] **Step 2: Run full repository release path**

Run:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

Expected: PASS.

- [ ] **Step 3: Confirm no custom splitter dragging was introduced**

Run:

```bash
rg -n "useResizablePanel|mousedown|mousemove|pointerdown|useDraggable|addEventListener\\('mousemove'|dragging" packages/el-kit/src packages/el-comps/src
```

Expected:

- No `useResizablePanel`.
- No custom splitter drag handlers.
- Any matches are unrelated to split-pane implementation or are Element Plus wrapper usage only.

- [ ] **Step 4: Confirm worktree state**

Run:

```bash
git status --short
```

Expected: clean working tree after all commits, or only intentionally untracked local files.

- [ ] **Step 5: Commit verification fixes if needed**

If verification required fixes, commit them:

```bash
git add <changed-files>
git commit -m "fix: harden resource layout package checks"
```

Skip this step if no verification fixes were needed.
