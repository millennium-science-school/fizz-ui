import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '..')

function exists(path: string) {
  return existsSync(resolve(root, path))
}

describe('el-comps component directory structure', () => {
  it('keeps one kebab-case directory per public component', () => {
    const components = [
      'fec-form/FecForm.vue',
      'fec-query-form/FecQueryForm.vue',
      'fec-table/FecTable.vue',
      'fec-query-table/FecQueryTable.vue',
      'fec-dialog-form/FecDialogForm.vue',
      'fec-drawer-form/FecDrawerForm.vue',
      'fec-detail/FecDetail.vue',
      'fec-page/FecPage.vue',
      'fec-section/FecSection.vue',
      'fec-stack/FecStack.vue',
      'fec-toolbar/FecToolbar.vue',
      'fec-split-pane/FecSplitPane.vue',
      'fec-tree-panel/FecTreePanel.vue',
      'fec-detail-sections/FecDetailSections.vue',
    ]

    for (const component of components) {
      const dir = component.split('/')[0]
      expect(exists(`src/components/${component}`)).toBe(true)
      expect(exists(`src/components/${dir}/index.ts`)).toBe(true)
      expect(exists(`src/components/${dir}/props.ts`)).toBe(true)
    }
  })

  it('moves shared component helpers under components/shared', () => {
    expect(exists('src/components/shared/actionTypes.ts')).toBe(true)
    expect(exists('src/components/shared/controls.ts')).toBe(true)
    expect(exists('src/components/shared/schemaFields.ts')).toBe(true)
    expect(exists('src/components/shared/types.ts')).toBe(true)
  })

  it('keeps one sample for each component implementation style', () => {
    const queryTable = readFileSync(resolve(root, 'src/components/fec-query-table/FecQueryTable.vue'), 'utf8')
    const treePanel = readFileSync(resolve(root, 'src/components/fec-tree-panel/FecTreePanel.vue'), 'utf8')
    const table = readFileSync(resolve(root, 'src/components/fec-table/FecTable.vue'), 'utf8')

    expect(queryTable).toContain('<template>')
    expect(queryTable).not.toContain('return () =>')

    expect(treePanel).toContain('<template>')
    expect(treePanel).not.toContain('return () =>')

    expect(table).toContain('<template>')
    expect(table).toContain('function renderTableNode')
  })

  it('keeps package root as an aggregator without direct vue imports', () => {
    const entry = readFileSync(resolve(root, 'src/index.ts'), 'utf8')

    expect(entry).not.toContain('.vue')
    expect(entry).toContain('export { FecForm } from \'./components/fec-form\'')
    expect(entry).toContain('export { FecQueryTable } from \'./components/fec-query-table\'')
    expect(entry).toContain('from \'./components/shared/types\'')
  })

  it('does not export unplanned layout-prop or utility types from root', () => {
    const entry = readFileSync(resolve(root, 'src/index.ts'), 'utf8')

    const banned = [
      'FecPageProps',
      'FecSectionProps',
      'FecStackProps',
      'FecStackDirection',
      'FecStackGap',
      'FecToolbarProps',
      'FecFormModel',
      'FecQueryModel',
      'FecTableColumn',
      'FecQueryTableColumn',
    ]
    for (const name of banned) {
      expect(
        new RegExp(`\\b${name}\\b`).test(entry),
        `root index.ts should not export ${name}`,
      ).toBe(false)
    }
  })
})
