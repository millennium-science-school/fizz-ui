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
})
