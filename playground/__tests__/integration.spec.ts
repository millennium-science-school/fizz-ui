import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('playground integration contract', () => {
  it('uses package style entries instead of local Element Plus namespace scss', () => {
    const main = readFileSync(resolve(__dirname, '../src/main.ts'), 'utf8')
    const app = readFileSync(resolve(__dirname, '../src/App.vue'), 'utf8')
    const home = readFileSync(resolve(__dirname, '../src/views/HomePage.vue'), 'utf8')
    const themeVars = readFileSync(resolve(__dirname, '../../packages/theme/src/styles/vars.css'), 'utf8')
    const elementOverrides = readFileSync(resolve(__dirname, '../src/styles/element-overrides.css'), 'utf8')

    expect(main).toContain('import \'@fizz/el-plus/styles\'')
    expect(main).toContain('import \'@fizz/theme/styles\'')
    expect(main).toContain('import \'./styles/element-overrides.css\'')
    expect(main).toContain('import \'virtual:uno.css\'')
    expect(main).not.toContain('./styles/element-plus.scss')
    expect(themeVars).not.toContain('--fe-color-primary: #0f766e;')
    expect(elementOverrides).toContain('--fe-color-primary: #0f766e;')
    expect(app).toContain('FeConfigProvider')
    expect(home).toContain('@fizz UI 验收台')
    expect(home).toContain('覆盖面')
    expect(home).toContain('主题变量')
    expect(home).toContain('表单控件')
    expect(home).toContain('数据展示')
    expect(home).toContain('反馈组件')
    expect(home).toContain('组合组件')
    expect(home).toContain('FecQueryTable')
    expect(home).toContain('透明包装')
    expect(home).toContain('兼容别名')
    expect(home).toContain('table.columns.value.map')
    expect(home).toContain(':columns="table.columns.value"')
  })

  it('cRUD demo page uses the new CRUD wave components', () => {
    const crud = readFileSync(resolve(__dirname, '../src/views/CrudPage.vue'), 'utf8')
    const main = readFileSync(resolve(__dirname, '../src/main.ts'), 'utf8')

    // route is registered
    expect(main).toContain('/crud')
    expect(main).toContain('CrudPage.vue')

    // page structure
    expect(crud).toContain('FecPage')
    expect(crud).toContain('FecSection')
    expect(crud).toContain('FecQueryTable')
    expect(crud).toContain('FecDialogForm')
    expect(crud).toContain('FecDetail')

    // toolbar and row actions
    expect(crud).toContain('toolbar-actions')
    expect(crud).toContain('row-actions')

    // submit / reset
    expect(crud).toContain('submit-text')
    expect(crud).toContain('reset-text')
  })

  it('comps-lab page covers all key components and interactions', () => {
    const lab = readFileSync(resolve(__dirname, '../src/views/CompsLabPage.vue'), 'utf8')
    const main = readFileSync(resolve(__dirname, '../src/main.ts'), 'utf8')

    // route is registered
    expect(main).toContain('/comps-lab')
    expect(main).toContain('CompsLabPage.vue')

    // all major components are used
    expect(lab).toContain('FecForm')
    expect(lab).toContain('FecQueryForm')
    expect(lab).toContain('FecTable')
    expect(lab).toContain('FecQueryTable')
    expect(lab).toContain('FecDialogForm')
    expect(lab).toContain('FecDrawerForm')
    expect(lab).toContain('FecDetail')
    expect(lab).toContain('FecPage')
    expect(lab).toContain('FecSection')
    expect(lab).toContain('FecStack')

    // all built-in kinds are exercised
    expect(lab).toContain('kind: \'input\'')
    expect(lab).toContain('kind: \'number\'')
    expect(lab).toContain('kind: \'select\'')
    expect(lab).toContain('kind: \'switch\'')

    // custom component slot
    expect(lab).toContain('component: ColorInput')

    // validation rules on dialog/drawer
    expect(lab).toContain('dialogRules')
    expect(lab).toContain('required: true')

    // toolbar and row actions
    expect(lab).toContain('toolbar-actions')
    expect(lab).toContain('row-actions')
    expect(lab).toContain('@toolbar-action')
    expect(lab).toContain('@row-action')

    // loading state
    expect(lab).toContain(':loading="tableLoading"')

    // FecTable only advertises currently supported capabilities.
    expect(lab).not.toContain('empty-text')
    expect(lab).not.toContain('FecTable — formatter')

    // formatter on detail
    expect(lab).toContain('formatter')

    // confirm/cancel wiring
    expect(lab).toContain('@confirm')
    expect(lab).toContain('@cancel')

    // FecDrawerForm is present (not only Dialog)
    expect(lab).toContain('FecDrawerForm')
    expect(lab).toContain('drawerVisible')
  })
})
