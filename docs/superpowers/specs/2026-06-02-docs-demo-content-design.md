# Docs And Demo Content Design

## Goal

Turn the existing repository docs and playground pages into a clearer content
surface for current Fizz UI capabilities.

This phase is documentation and demo-content work. The playground should remain
a lightweight content display and verification app. It should not become a
project framework, starter template, layout system, or marketing site. After the
components and theme stabilize further, separate project templates can be built
using these packages.

## Context

The repository now has stable enough surfaces to document:

- `@fizz/el-plus`: transparent Element Plus namespace adapter.
- `@fizz/el-kit`: headless schema and CRUD state primitives.
- `@fizz/el-comps`: composite admin/resource components.
- `@fizz/theme`: generated Fizz-owned theme variables, UnoCSS preset, and
  composite surface polish.

The current docs are useful but scattered:

- `docs/consumer-setup.md` covers setup and some boundaries.
- `docs/component-wrapper-contract.md` covers `@fizz/el-plus`.
- `docs/el-kit-table-state.md` covers headless table/query state.
- `docs/el-comps-sfc-authoring.md` covers component authoring style.
- `docs/style-validation.md` covers theme validation.

The playground already has content pages:

- `HomePage.vue`: broad package acceptance surface.
- `CrudPage.vue`: CRUD workflow demo.
- `CompsLabPage.vue`: component lab and edge-state checks.
- `ResourceLayoutPage.vue`: tree/split/detail resource layout demo.

This phase should organize and connect that content without introducing a new
documentation framework.

## Scope

Included:

- Add a compact docs index that points to the current documents in the right
  reading order.
- Split or supplement docs with focused pages for theme setup, el-comps usage,
  el-kit headless usage, and playground demos.
- Update the playground home page so it acts as a content directory for the
  existing demos and package boundaries.
- Add the resource layout page to the top navigation.
- Keep playground UI simple and content-oriented.
- Add/adjust integration tests that assert the content entries and routes exist.

Excluded:

- No VitePress, Docusaurus, Nuxt, static-site generator, or docs framework.
- No project template, scaffold, starter-kit, routing architecture, or app shell
  beyond the existing minimal playground.
- No new components or package APIs.
- No additional theme polish beyond content needs.
- No visual redesign of playground.
- No deployment pipeline for docs.

## Information Architecture

Add these documentation pages:

- `docs/index.md`
  - Reading order and package map.
- `docs/theme-setup.md`
  - Style imports, UnoCSS preset, Element Plus variable overrides, and composite
    surface theme boundary.
- `docs/el-comps.md`
  - Current composite components grouped by workflow: CRUD, forms, tables,
    overlays, detail, resource layouts.
- `docs/el-kit-headless.md`
  - Headless schema/state responsibilities, `useQueryTable`, and relationship
    to `useFecQueryTableBindings`.
- `docs/playground-demos.md`
  - What each playground page demonstrates and what it is not intended to be.

Keep existing docs as source-of-truth references:

- `docs/component-wrapper-contract.md`
- `docs/el-comps-sfc-authoring.md`
- `docs/style-validation.md`
- `docs/release-boundary.md`

`docs/consumer-setup.md` should remain a direct setup guide and link to the new
docs index instead of trying to become the whole documentation set.

## Playground Content Design

The playground should expose four content entries:

1. Overview
   - package boundaries;
   - style import contract;
   - current acceptance surfaces.
2. CRUD Demo
   - `FecQueryTable`, `useQueryTable`, `useFecQueryTableBindings`,
     `FecDialogForm`, `FecDetail`.
3. Resource Layout
   - `FecSplitPane`, `FecTreePanel`, `FecDetailSections`, `dateRange`,
     `multiSelect`.
4. Component Lab
   - broad component coverage and edge-state checks.

The playground navigation should list all four pages. It should not add
template-level concepts such as auth, layout presets, project settings,
generated menus, data clients, or file-system routing.

## Testing Strategy

Use static integration tests because this phase is content routing and
documentation organization:

```bash
pnpm exec vitest run playground/__tests__/integration.spec.ts
```

Run docs/package safety checks:

```bash
pnpm lint
pnpm -C playground build
pnpm check:packages
```

Run the full release path before completion:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ packages/el-comps/__tests__ playground/__tests__/integration.spec.ts packages/theme/__tests__
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

## Risks

The main risk is accidentally turning playground into an application framework
or project template. Keep it as a content display and acceptance app.

The second risk is duplicating source-of-truth docs. New docs should link to
existing detailed references instead of repeating every contract.

The third risk is creating docs that drift from examples. Integration tests
should assert key route names, page labels, and package capability strings.

## Success Criteria

- `docs/index.md` provides the main documentation entry.
- Setup, theme, el-comps, el-kit, and playground demo docs are easy to discover.
- Playground navigation includes the resource layout page.
- Playground home clearly lists package boundaries and demo entries.
- Integration tests cover the docs/demo content entries.
- No new project framework or template structure is introduced.
