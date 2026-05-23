# Release Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add package-level release checks so every publishable package is verified from built `dist` entries before release.

**Architecture:** Move declaration portability scanning into a reusable root script, then add focused consumer or built-entry checks to `@fizz/el-kit`, `@fizz/el-comps`, and `@fizz/theme`. Keep `@fizz/el-plus` on its existing consumer path, but route it through the shared declaration scanner. The root `check:packages` script composes all package contract checks and `publint`.

**Tech Stack:** pnpm workspace, TypeScript, Vue 3 JSX/TSX typechecking, Vite library builds, vite-plugin-dts, publint, Node.js ESM scripts.

---

## File Structure

- Create: `scripts/assert-public-dts.mjs`
  - Shared declaration scan for publishable package `dist/**/*.d.ts`.
- Modify: `packages/el-plus/package.json`
  - Point `typecheck:consumer` at the shared declaration scan.
- Delete: `packages/el-plus/scripts/assert-public-dts.mjs`
  - Replaced by the root shared script.
- Create: `packages/el-kit/tsconfig.consumer.json`
  - Consumer-dist TypeScript project for `@fizz/el-kit`.
- Create: `packages/el-kit/__tests__/consumer-dist.typecheck.ts`
  - Type-only consumer coverage for `useTable`, `useQueryForm`, and public types.
- Modify: `packages/el-kit/package.json`
  - Add `typecheck:consumer`.
- Create: `packages/el-comps/tsconfig.consumer.json`
  - Consumer-dist TypeScript project for `@fizz/el-comps`.
- Create: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`
  - Type-only consumer coverage for SFC component declarations and public types.
- Modify: `packages/el-comps/package.json`
  - Add `typecheck:consumer`.
- Create: `packages/theme/scripts/check-exports.mjs`
  - Built-entry runtime/style/preset export check.
- Modify: `packages/theme/package.json`
  - Add `check:exports`.
- Modify: `package.json`
  - Expand `check:packages` to run all package contract checks.
- Modify: `README.md`
  - Document that `check:packages` now covers all publishable package entries.
- Modify: `docs/release-boundary.md`
  - Align the release boundary with the hardened package checks.

---

### Task 1: Add Shared Declaration Scan

**Files:**

- Create: `scripts/assert-public-dts.mjs`
- Modify: `packages/el-plus/package.json`
- Delete: `packages/el-plus/scripts/assert-public-dts.mjs`

- [ ] **Step 1: Create the shared declaration scanner**

Create `scripts/assert-public-dts.mjs`:

```js
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'

const packageArg = process.argv[2] ?? '.'
const packageRoot = resolve(packageArg)
const distDir = resolve(packageRoot, 'dist')

const forbiddenPatterns = [
  {
    label: 'node_modules path',
    pattern: /node_modules[\\/]/,
  },
  {
    label: 'absolute Windows path',
    pattern: /[A-Za-z]:[\\/]/,
  },
  {
    label: 'absolute POSIX workspace path',
    pattern: /(?:\/Users\/|\/home\/|\/tmp\/|\/workspace\/|\/var\/folders\/)/,
  },
  {
    label: 'workspace source path',
    pattern: /packages[\\/][^\\/]+[\\/]src[\\/]/,
  },
  {
    label: 'parent source traversal',
    pattern: /\.\.[\\/].*src[\\/]/,
  },
]

function collectDtsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory())
      return collectDtsFiles(path)

    return entry.isFile() && entry.name.endsWith('.d.ts') ? [path] : []
  })
}

function assertPackageRoot() {
  if (!isAbsolute(packageRoot)) {
    console.error(`Package root must resolve to an absolute path: ${packageArg}`)
    process.exit(1)
  }

  if (!existsSync(distDir)) {
    console.error(`Package dist directory does not exist: ${distDir}`)
    process.exit(1)
  }
}

assertPackageRoot()

const violations = collectDtsFiles(distDir).flatMap((file) => {
  const source = readFileSync(file, 'utf8')

  return forbiddenPatterns
    .filter(rule => rule.pattern.test(source))
    .map(rule => `${file}: ${rule.label} (${rule.pattern})`)
})

if (violations.length > 0) {
  console.error('Public declaration files contain internal or non-portable paths:')
  for (const violation of violations)
    console.error(`- ${violation}`)

  process.exitCode = 1
}
```

- [ ] **Step 2: Update `@fizz/el-plus` to use the shared scan**

In `packages/el-plus/package.json`, replace the `typecheck:consumer` script with:

```json
"typecheck:consumer": "pnpm build && vue-tsc --noEmit -p tsconfig.consumer.json && node ../../scripts/assert-public-dts.mjs ."
```

- [ ] **Step 3: Delete the old package-local scanner**

Delete:

```text
packages/el-plus/scripts/assert-public-dts.mjs
```

- [ ] **Step 4: Verify `@fizz/el-plus` still passes its consumer check**

Run:

```bash
pnpm --filter @fizz/el-plus typecheck:consumer
```

Expected: PASS.

- [ ] **Step 5: Commit the shared scanner**

```bash
git add scripts/assert-public-dts.mjs packages/el-plus/package.json packages/el-plus/scripts/assert-public-dts.mjs
git commit -m "chore: share public dts release scan"
```

---

### Task 2: Add `@fizz/el-kit` Consumer-Dist Typecheck

**Files:**

- Create: `packages/el-kit/tsconfig.consumer.json`
- Create: `packages/el-kit/__tests__/consumer-dist.typecheck.ts`
- Modify: `packages/el-kit/package.json`

- [ ] **Step 1: Add the consumer TypeScript project**

Create `packages/el-kit/tsconfig.consumer.json`:

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "types": ["vite/client"],
    "allowJs": false,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "paths": {
      "@fizz/el-kit": ["./dist/index.d.ts"]
    }
  },
  "include": [
    "__tests__/consumer-dist.typecheck.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

- [ ] **Step 2: Add public dist type coverage**

Create `packages/el-kit/__tests__/consumer-dist.typecheck.ts`:

```ts
import type {
  QueryFormRules,
  TableColumn,
  UseTableOptions,
} from '@fizz/el-kit'
import { useQueryForm, useTable } from '@fizz/el-kit'
import { ref } from 'vue'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
  enabled: boolean
}

const columns: TableColumn<User>[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'right', minWidth: 120 },
]

const invalidColumns: TableColumn<User>[] = [
  {
    label: '缺失',
    // @ts-expect-error table column prop should be keyed to the row type
    prop: 'missing',
  },
]

const tableOptions: UseTableOptions<User> = {
  columns: () => columns,
  data: ref([{ name: 'Tom', age: 18 }]),
  loading: ref(false),
  pagination: {
    currentPage: () => 1,
    pageSize: ref(10),
    total: 1,
  },
}

const table = useTable<User>(tableOptions)
table.setColumns([{ prop: 'name', label: '姓名' }])
table.setData([{ name: 'Jerry', age: 20 }])
table.setLoading(true)
table.setPage(2)
table.setPageSize(20)
table.setTotal(40)

const rules: QueryFormRules<Query> = {
  keyword: [{ required: true, min: 2, message: '至少两个字符' }],
  enabled: [{ validator: value => typeof value === 'boolean' }],
}

const invalidRules: QueryFormRules<Query> = {
  // @ts-expect-error query rules should be keyed to the query model
  missing: [{ required: true }],
}

const submitted: Query[] = []
const queryForm = useQueryForm<Query>({
  model: ref({ keyword: '', enabled: false }),
  rules,
  initialModel: { keyword: 'initial', enabled: true },
  onSubmit: model => submitted.push(model),
})

queryForm.setField('keyword', 'Fizz')
queryForm.setField('enabled', true)
queryForm.setRules({ keyword: [{ max: 20 }] })
queryForm.reset()
queryForm.submit()

// @ts-expect-error setField should reject unknown query fields
queryForm.setField('missing', 'value')

// @ts-expect-error setField should preserve the field value type
queryForm.setField('enabled', 'yes')

void invalidColumns
void invalidRules
void table
void queryForm
void submitted
```

- [ ] **Step 3: Add the package script**

In `packages/el-kit/package.json`, add this script:

```json
"typecheck:consumer": "pnpm build && vue-tsc --noEmit -p tsconfig.consumer.json && node ../../scripts/assert-public-dts.mjs ."
```

- [ ] **Step 4: Verify the new consumer check**

Run:

```bash
pnpm --filter @fizz/el-kit typecheck:consumer
```

Expected: PASS.

- [ ] **Step 5: Commit the `el-kit` release check**

```bash
git add packages/el-kit/tsconfig.consumer.json packages/el-kit/__tests__/consumer-dist.typecheck.ts packages/el-kit/package.json
git commit -m "test: add el-kit consumer dist check"
```

---

### Task 3: Add `@fizz/el-comps` Consumer-Dist Typecheck

**Files:**

- Create: `packages/el-comps/tsconfig.consumer.json`
- Create: `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`
- Modify: `packages/el-comps/package.json`

- [ ] **Step 1: Add the consumer TypeScript project**

Create `packages/el-comps/tsconfig.consumer.json`:

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2023",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "types": ["vite/client"],
    "allowJs": false,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "paths": {
      "@fizz/el-comps": ["./dist/index.d.ts"],
      "@fizz/el-comps/*": ["./dist/*"],
      "@fizz/el-kit": ["../el-kit/dist/index.d.ts"],
      "@fizz/el-kit/*": ["../el-kit/dist/*"],
      "@fizz/el-plus": ["../el-plus/dist/index.d.ts"],
      "@fizz/el-plus/*": ["../el-plus/dist/*"]
    }
  },
  "include": [
    "__tests__/consumer-dist.typecheck.tsx"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

- [ ] **Step 2: Add public dist component and type coverage**

Create `packages/el-comps/__tests__/consumer-dist.typecheck.tsx`:

```tsx
import type {
  FecFormSchemaItem,
  FecPagination,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableProps,
  FecTableProps,
} from '@fizz/el-comps'
import { FecQueryTable, FecTable } from '@fizz/el-comps'
import { h, ref } from 'vue'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
}

const formSchema: FecFormSchemaItem<User>[] = [
  { prop: 'name', label: '姓名', component: 'input' },
]

const invalidFormSchema: FecFormSchemaItem<User>[] = [
  {
    label: '缺失',
    component: 'input',
    // @ts-expect-error form schema prop should be keyed to the row type
    prop: 'missing',
  },
]

const querySchema: FecQuerySchemaItem<Query>[] = [
  { prop: 'keyword', label: '关键词', component: 'input' },
]

const invalidQuerySchema: FecQuerySchemaItem<Query>[] = [
  {
    label: '缺失',
    component: 'input',
    // @ts-expect-error query schema prop should be keyed to the query type
    prop: 'missing',
  },
]

const pagination: FecPagination = {
  currentPage: ref(1),
  pageSize: () => 10,
  total: 1,
}

const queryPagination: FecQueryPagination = {
  currentPage: ref(1),
  pageSize: ref(10),
  total: () => 30,
}

const tableProps: FecTableProps<User> = {
  form: { name: '' },
  formSchema,
  columns: [{ prop: 'name', label: '姓名', width: 160, align: 'center' }],
  data: ref([{ name: 'Tom', age: 18 }]),
  pagination,
}

const queryTableProps: FecQueryTableProps<User, Query> = {
  query: { keyword: '' },
  querySchema,
  rules: { keyword: [{ min: 2, message: '至少两个字符' }] },
  columns: [{ prop: 'age', label: '年龄', minWidth: 120 }],
  data: () => [{ name: 'Jerry', age: 20 }],
  loading: ref(false),
  pagination: queryPagination,
  submitText: 'Search',
  resetText: 'Clear',
}

const tableVNode = h(FecTable, {
  ...tableProps,
  'onUpdate:form': (form: Record<string, unknown>) => {
    void form
  },
})

const queryTableVNode = (
  <FecQueryTable
    {...queryTableProps}
    {...{
      'onUpdate:currentPage': (page: number) => {
        void page
      },
      'onUpdate:pageSize': (pageSize: number) => {
        void pageSize
      },
      'onUpdate:query': (query: Query) => {
        void query
      },
    }}
  />
)

void invalidFormSchema
void invalidQuerySchema
void tableVNode
void queryTableVNode
```

- [ ] **Step 3: Add the package script**

In `packages/el-comps/package.json`, add this script:

```json
"typecheck:consumer": "pnpm --filter @fizz/el-plus build && pnpm --filter @fizz/el-kit build && pnpm build && vue-tsc --noEmit -p tsconfig.consumer.json && node ../../scripts/assert-public-dts.mjs ."
```

- [ ] **Step 4: Run the new consumer check**

Run:

```bash
pnpm --filter @fizz/el-comps typecheck:consumer
```

Expected: PASS. If this fails because the generated SFC declaration narrows
component props to `FecTableColumn<object>[]` or `FecQueryTableColumn<object>[]`,
adjust only the component declaration strategy needed to preserve the public
`FecTableProps<T>` and `FecQueryTableProps<Row, Query>` type surface, then rerun
this command.

- [ ] **Step 5: Commit the `el-comps` release check**

```bash
git add packages/el-comps/tsconfig.consumer.json packages/el-comps/__tests__/consumer-dist.typecheck.tsx packages/el-comps/package.json packages/el-comps/src
git commit -m "test: add el-comps consumer dist check"
```

---

### Task 4: Add `@fizz/theme` Built-Entry Check

**Files:**

- Create: `packages/theme/scripts/check-exports.mjs`
- Modify: `packages/theme/package.json`

- [ ] **Step 1: Add the built-entry export checker**

Create `packages/theme/scripts/check-exports.mjs`:

```js
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'

const packageRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distRoot = resolve(packageRoot, 'dist')
const packageJson = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'))

function normalizeCss(css) {
  return css.replace(/\s+/g, ' ').trim()
}

function assertFile(path) {
  assert.equal(existsSync(path), true, `Expected file to exist: ${path}`)
}

assert.deepEqual(packageJson.exports['./styles'], {
  types: './dist/styles/vars.d.ts',
  default: './dist/styles/vars.css',
})
assert.deepEqual(packageJson.exports['./preset/unocss'], {
  types: './dist/preset/unocss.d.ts',
  import: './dist/preset/unocss.mjs',
})
assert.equal(packageJson.dependencies?.['@fizz/el-plus'], undefined)
assert.equal(packageJson.dependencies?.['@fizz/el-kit'], undefined)
assert.equal(packageJson.dependencies?.['@fizz/el-comps'], undefined)

assertFile(resolve(distRoot, 'index.d.ts'))
assertFile(resolve(distRoot, 'index.mjs'))
assertFile(resolve(distRoot, 'preset/unocss.d.ts'))
assertFile(resolve(distRoot, 'preset/unocss.mjs'))
assertFile(resolve(distRoot, 'styles/vars.css'))
assertFile(resolve(distRoot, 'styles/vars.d.ts'))

const themeEntry = await import(pathToFileURL(resolve(distRoot, 'index.mjs')).href)
const presetEntry = await import(pathToFileURL(resolve(distRoot, 'preset/unocss.mjs')).href)

assert.equal(typeof themeEntry.createThemeVarsCss, 'function')
assert.equal(typeof themeEntry.createThemeCssVars, 'function')
assert.equal(typeof presetEntry.fizzPreset, 'function')

const generatedCss = themeEntry.createThemeVarsCss()
const distCss = readFileSync(resolve(distRoot, 'styles/vars.css'), 'utf8')
assert.equal(normalizeCss(distCss), normalizeCss(generatedCss))
```

- [ ] **Step 2: Add the package script**

In `packages/theme/package.json`, add this script:

```json
"check:exports": "pnpm build && node scripts/check-exports.mjs && node ../../scripts/assert-public-dts.mjs ."
```

- [ ] **Step 3: Verify the theme built-entry check**

Run:

```bash
pnpm --filter @fizz/theme check:exports
```

Expected: PASS.

- [ ] **Step 4: Commit the theme release check**

```bash
git add packages/theme/scripts/check-exports.mjs packages/theme/package.json
git commit -m "test: add theme built export check"
```

---

### Task 5: Align Root Release Scripts and Docs

**Files:**

- Modify: `package.json`
- Modify: `README.md`
- Modify: `docs/release-boundary.md`

- [ ] **Step 1: Update the root package contract script**

In root `package.json`, replace `check:packages` with:

```json
"check:packages": "pnpm --filter @fizz/el-plus typecheck:consumer && pnpm --filter @fizz/el-kit typecheck:consumer && pnpm --filter @fizz/el-comps typecheck:consumer && pnpm --filter @fizz/theme check:exports && pnpm --filter @fizz/el-plus lint:package && pnpm --filter @fizz/theme lint:package && pnpm --filter @fizz/el-kit lint:package && pnpm --filter @fizz/el-comps lint:package"
```

- [ ] **Step 2: Update README package-check description**

In `README.md`, replace the paragraph after the release command block with:

```md
`pnpm check:packages` runs consumer or built-entry checks for every publishable
package, then runs `publint` for each package. The package checks build the
relevant `dist` entries, typecheck imports from package names or package
subpaths, and scan generated declaration files for non-portable public paths.
```

- [ ] **Step 3: Update release boundary docs**

In `docs/release-boundary.md`, replace the `Required Before Publish` section
with:

````md
## Required Before Publish

Run the full local release path from the workspace root:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

`pnpm check:packages` is the package contract gate. It runs:

- `@fizz/el-plus` consumer-dist typecheck, style subpath typecheck, and public
  declaration scan.
- `@fizz/el-kit` consumer-dist typecheck and public declaration scan.
- `@fizz/el-comps` consumer-dist typecheck and public declaration scan.
- `@fizz/theme` built runtime/style/preset export check and public declaration
  scan.
- `publint` for all publishable packages.
````

- [ ] **Step 4: Verify the composed package checks**

Run:

```bash
pnpm check:packages
```

Expected: PASS.

- [ ] **Step 5: Commit root scripts and docs**

```bash
git add package.json README.md docs/release-boundary.md
git commit -m "docs: align release package checks"
```

---

### Task 6: Final Release Verification

**Files:**

- Verify: repository root

- [ ] **Step 1: Run focused package verification**

Run:

```bash
pnpm --filter @fizz/el-plus typecheck:consumer
pnpm --filter @fizz/el-kit typecheck:consumer
pnpm --filter @fizz/el-comps typecheck:consumer
pnpm --filter @fizz/theme check:exports
pnpm check:packages
```

Expected: every command passes.

- [ ] **Step 2: Run the full release path**

Run these commands sequentially:

```bash
pnpm lint
pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
pnpm --filter @fizz/el-plus check:coverage
pnpm typecheck
pnpm build
pnpm -C playground build
pnpm check:packages
```

Expected: every command passes. On Windows, keep build commands sequential
because package builds clean `dist/` directories.

- [ ] **Step 3: Check final git status**

Run:

```bash
git status --short
```

Expected: no uncommitted source changes. Ignored `dist/` outputs may have been
regenerated locally, but they should not appear in `git status --short`.

- [ ] **Step 4: Report completion**

Report:

```text
Implemented release hardening.
Verified with:
- pnpm --filter @fizz/el-plus typecheck:consumer
- pnpm --filter @fizz/el-kit typecheck:consumer
- pnpm --filter @fizz/el-comps typecheck:consumer
- pnpm --filter @fizz/theme check:exports
- pnpm check:packages
- pnpm lint
- pnpm exec vitest run packages/el-plus/__tests__ playground/__tests__/integration.spec.ts
- pnpm --filter @fizz/el-plus check:coverage
- pnpm typecheck
- pnpm build
- pnpm -C playground build
```
