import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { transparentWrappers } from './transparentWrapperList'

const packageRoot = resolve(__dirname, '..')
const transparentComponentFiles = transparentWrappers.map(({ name }) =>
  name
    .replace(/^Fe/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase(),
)

describe('@fizz/el-plus component source structure', () => {
  it('keeps pure transparent wrappers in a single mapping module', () => {
    const contractSource = readFileSync(resolve(packageRoot, '../../docs/component-wrapper-contract.md'), 'utf8')
    const indexSource = readFileSync(resolve(packageRoot, 'src/index.ts'), 'utf8')
    const compatSource = readFileSync(resolve(packageRoot, 'src/compat.ts'), 'utf8')
    const transparentComponentsPath = resolve(packageRoot, 'src/components/transparent-components.ts')

    expect(indexSource).toContain('export * from \'./components/transparent-components\'')
    expect(indexSource).toContain('export * from \'./compat\'')
    expect(compatSource).toContain('ElLoading as FeLoading')
    expect(compatSource).toContain('ElPopper as FePopper')
    expect(compatSource).toContain('ElPopperArrow as FePopperArrow')
    expect(contractSource).toContain('Transparent wrapper exports')
    expect(contractSource).toContain('Special exports')
    expect(contractSource).toContain('Compatibility aliases')
    for (const name of transparentComponentFiles) {
      expect(indexSource).not.toContain(`./components/${name}'`)
      expect(existsSync(resolve(packageRoot, `src/components/${name}.ts`))).toBe(false)
    }
    expect(existsSync(transparentComponentsPath)).toBe(true)
  })

  it('marks transparent wrapper creation as pure for bundlers', () => {
    const source = readFileSync(
      resolve(packageRoot, 'src/components/transparent-components.ts'),
      'utf8',
    )

    const pureAnnotations = source.match(/\/\* @__PURE__ \*\/ (?:createTransparentWrapper|defineFeTransparentComponent)/g) ?? []

    expect(pureAnnotations).toHaveLength(transparentComponentFiles.length)
    for (const { classSuffix, name } of transparentWrappers) {
      expect(source).toMatch(new RegExp(`export const ${name} = /\\* @__PURE__ \\*/ (?:createTransparentWrapper|defineFeTransparentComponent)`))
      expect(source).toContain(`'${classSuffix}'`)
    }
  })
})
