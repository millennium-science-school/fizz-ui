import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const packageRoot = resolve(__dirname, '..')

describe('@fizz/theme style exports', () => {
  it('exposes the CSS style entry with a type declaration', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
    )

    expect(packageJson.exports['./styles']).toEqual({
      types: './dist/styles/vars.d.ts',
      default: './dist/styles/vars.css',
    })
  })

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
})
