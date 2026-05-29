# Resource Management Layout And VueUse Design

## Goal

Add the next `@fizz/el-comps` wave for resource-management application pages,
using the page-pattern report from `nrms-web2` as the business sample.

This wave should extend the current CRUD coverage into the high-frequency
resource-management layouts that are not covered by `FecQueryTable` alone:

- tree-driven pages;
- resizable left/right workspaces;
- multi-section detail pages with local navigation;
- a small expansion of schema field controls used by search forms.

The same wave should also decide how the workspace uses VueUse. The repository
already catalogs `@vueuse/core`, but `@fizz/el-kit` and `@fizz/el-comps` do not
currently depend on it. The next implementation should use VueUse deliberately
where it removes local browser-state machinery, without leaking unnecessary
VueUse-specific types into Fizz public APIs.

## Source Input

The page-pattern report identifies these high-frequency resource-management
patterns:

| Pattern | Frequency | Current Fizz Coverage |
|---------|-----------|-----------------------|
| P1 query form + table | highest | Covered by `FecQueryTable`, `FecForm`, `FecDialogForm`, `useQueryTable` |
| P2 left tree + right content | high | Not covered as a first-class layout |
| P3 search form + resizable tree + detail | high | Not covered as a first-class layout |
| P5 multi-card detail + catalog navigation | medium | Partially covered by `FecDetail`, but not page layout/navigation |
| P6 tabs + subpanels | medium | Can be assembled with `FeTabs` and existing sections |
| P8 file/import workflows | low-medium | Not covered; should remain a later wave |

The report's highest-value extraction candidates are `ResizableLayout`,
`ResourceTree`, and `DetailPageLayout`. Fizz should keep the same intent but use
domain-neutral names so the components remain useful outside resource catalogs.

## Scope

Included:

- Reuse Element Plus splitter support exposed by `@fizz/el-plus` as
  `FeSplitter` and `FeSplitterPanel`.
- Add a visual split-pane composition component to `@fizz/el-comps` only as a
  thin layout facade over the Element Plus splitter.
- Add a generic tree-panel component to `@fizz/el-comps`.
- Add a tree/content layout convenience component if the split-pane and
  tree-panel composition proves repetitive.
- Add a multi-section detail layout with local section navigation.
- Add common search/form field kinds needed by the report, starting with date
  range and multi-select.
- Use VueUse for browser-event, element-size, and interaction primitives where
  appropriate.
- Add playground examples and consumer type coverage for the new public APIs.

Excluded:

- Resource-domain components such as `ResourceTree`.
- Data-fetching clients, permission systems, or remote schema loading.
- Tree-table, upload workflows, import wizard, pivot tables, search engine
  pages, and micro-app host protocols.
- A full form designer or dynamic schema parser.
- Visual redesign or new theme-token decisions beyond structural classes needed
  for the new components.

## Architecture

The wave is split into four small layers.

### 1. Splitter Foundation

`@fizz/el-plus` already exposes Element Plus `ElSplitter` and
`ElSplitterPanel` as `FeSplitter` and `FeSplitterPanel`. This wave must not
reimplement splitter dragging, pointer tracking, size clamping, or collapse
behavior in `@fizz/el-kit`.

`@fizz/el-comps` may add a thin `FecSplitPane` facade if it improves
resource-page ergonomics:

- render `FeSplitter` and two `FeSplitterPanel` children;
- provide stable `fe-comps-*` classes;
- map Fizz-friendly prop names to Element Plus splitter props;
- forward resize/collapse events;
- leave drag mechanics entirely to Element Plus.

VueUse is not needed for splitter dragging while Element Plus splitter satisfies
the behavior.

### 2. Split And Tree Layout Components

`@fizz/el-comps` should add:

- `FecSplitPane`
  - generic left/right layout;
  - supports fixed, resizable, and collapsible left pane;
  - exposes slots for `left`, default/right content, and optional resize handle;
  - wraps `FeSplitter` / `FeSplitterPanel`;
  - does not know about trees or resources.

- `FecTreePanel`
  - wraps `FeTree` in a reusable panel;
  - optional search box;
  - optional collapse control;
  - supports loading and empty states;
  - emits node events without fetching data;
  - supports node slot customization.

- `FecTreeContentLayout`
  - optional convenience composition of `FecSplitPane` + `FecTreePanel`;
  - should be added only if playground examples show repeated wiring;
  - keeps right content as a slot.

This covers report patterns P2 and P3 without introducing a resource-specific
component.

### 3. Detail Section Layout

`@fizz/el-comps` should add:

- `FecDetailSections`
  - accepts a list of section descriptors;
  - renders stacked sections with stable ids/classes;
  - supports optional right-side local navigation;
  - each section content is provided by named slots;
  - may use `FecDetail` inside sections but does not force it.

This covers P5. It should not become a full document renderer; its job is page
structure and section navigation.

VueUse can be used here for scroll tracking and element observation, for example
to keep the active section in sync while the user scrolls. Keep this behavior
optional and avoid making active-section tracking a dependency for basic render.

### 4. Field Control Expansion

Extend the schema protocol conservatively:

- `dateRange`
- `multiSelect`

Likely later additions:

- `datetime`
- `datetimeRange`
- `radio`
- `checkbox`
- `treeSelect`

`treeSelect` should wait until the tree-panel API settles. The first wave should
avoid coupling field rendering to a tree data protocol too early.

## VueUse Adoption Rules

VueUse is appropriate when Fizz needs browser interaction primitives:

- pointer and mouse events;
- resize and element measurement;
- scroll tracking;
- outside-click handling;
- debounced refs or throttled event handlers;
- breakpoints and media queries for future responsive layouts.

VueUse is not a reason to replace existing small state primitives:

- do not wrap or replace Element Plus splitter dragging when `FeSplitter` covers
  the need;
- keep `usePaginationState`, `useQueryState`, `useDialogFormState`, and
  `useDetailState` as Fizz-owned APIs;
- keep state ownership contracts explicit;
- do not expose VueUse return types in package-root public declarations unless
  there is a deliberate consumer benefit;
- prefer `@fizz/el-kit` wrapping VueUse for shared headless behavior and
  `@fizz/el-comps` using those Fizz wrappers.

Dependency placement:

- Add `@vueuse/core` to `@fizz/el-kit` dependencies only when a kit composable
  imports it at runtime.
- Add `@vueuse/core` to `@fizz/el-comps` dependencies only if a component imports
  VueUse directly.
- Keep it out of `peerDependencies`; consumers should not have to install or
  version-manage VueUse to use Fizz packages.

## Public API Sketch

```ts
export interface FecSplitPaneProps {
  leftSize?: string | number
  leftMin?: string | number
  leftMax?: string | number
  collapsible?: boolean
  resizable?: boolean
}
```

```ts
export interface FecTreePanelProps<Node extends object> {
  data: Node[]
  nodeKey?: string
  searchable?: boolean
  collapsible?: boolean
  loading?: boolean
  emptyText?: string
}
```

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

These sketches are intentionally incomplete. The implementation plan should
check Element Plus public `ElTree` and `ElDatePicker` props before finalizing
portable Fizz-facing facades.

## Playground Coverage

Add one new route or section that demonstrates:

- tree search and node click driving right-side content;
- resizable split pane with min/max behavior;
- query form + tree + detail composition matching report pattern P3;
- multi-section detail page with local navigation;
- `dateRange` and `multiSelect` schema fields.

The existing CRUD page should remain focused on P1. Do not turn it into a
catch-all demo.

## Testing

Focused checks:

```bash
pnpm exec vitest run packages/el-kit/__tests__
pnpm exec vitest run packages/el-comps/__tests__
pnpm --filter @fizz/el-kit typecheck
pnpm --filter @fizz/el-comps typecheck
pnpm --filter @fizz/el-kit typecheck:consumer
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm -C playground build
```

Repository checks before completion:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

Add targeted tests for:

- `FecSplitPane` classes and forwarded splitter events;
- `FecTreePanel` search, loading, empty, and node-click behavior;
- `FecDetailSections` section rendering and navigation events;
- consumer type coverage for generic tree node types and field schema additions.

## Risks

The largest risk is overfitting to the source resource-management system. Keep
names and props domain-neutral.

The second risk is exposing VueUse implementation details in public declaration
files. Use Fizz-owned interfaces for exported APIs and inspect generated dts.

The third risk is adding too many field kinds at once. Start with the two most
useful additions, then let real examples prove the next controls.

## Decisions

- Start with P2/P3/P5, because those are high-frequency gaps after the CRUD
  wave.
- Use VueUse broadly for interaction plumbing, but behind Fizz public APIs.
- Reuse `FeSplitter` and `FeSplitterPanel` for split-pane dragging instead of
  implementing custom drag logic.
- Do not add import/upload, pivot/statistics, full-text search, or micro-app
  host components in this wave.
- Keep `FecSplitPane` independent from `FecTreePanel`; add
  `FecTreeContentLayout` only if composition repetition is obvious.
