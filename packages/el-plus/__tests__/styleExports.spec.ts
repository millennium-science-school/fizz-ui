import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const packageRoot = resolve(__dirname, '..')

describe('@fizz/el-plus style exports', () => {
  it('exposes precompiled CSS and SCSS style entries', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
    )

    expect(packageJson.exports['.'].types).toBe('./dist/index.d.ts')
    expect(packageJson.exports['.'].import).toBe('./dist/index.mjs')
    expect(packageJson.exports['./styles']).toEqual({
      types: './dist/styles/index.d.ts',
      default: './dist/styles/index.css',
    })
    expect(packageJson.exports['./styles/scss']).toEqual({
      types: './dist/styles/index.d.ts',
      default: './dist/styles/index.scss',
    })
    expect(packageJson.style).toBe('./dist/styles/index.css')
    expect(packageJson.sideEffects).toEqual([
      '**/*.css',
      '**/*.scss',
      'dist/styles/*',
    ])
    expect(packageJson.files).toContain('dist')
  })

  it('keeps the SCSS source as the canonical fe namespace entry', () => {
    const scss = readFileSync(resolve(packageRoot, 'src/styles/index.scss'), 'utf8')

    expect(scss).toContain('$namespace: \'fe\'')
    expect(scss).toContain('element-plus/theme-chalk/src/index.scss')
  })
})
