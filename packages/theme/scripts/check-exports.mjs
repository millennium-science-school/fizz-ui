import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const packageRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distRoot = resolve(packageRoot, 'dist')
const packageJson = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'))

const whitespaceRe = /\s+/g

function normalizeCss(css) {
  return css.replace(whitespaceRe, ' ').trim()
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
assert.equal(Array.isArray(themeEntry.fizzTokenRegistry), true)
assert.equal(Array.isArray(themeEntry.fizzTokenNames), true)
assert.equal(typeof themeEntry.createFizzThemeVars, 'function')
assert.equal(themeEntry.fizzTokenRegistry.length, themeEntry.fizzTokenNames.length)
assert.deepEqual(
  Object.keys(themeEntry.createFizzThemeVars('light')),
  themeEntry.fizzTokenNames,
)
assert.deepEqual(
  Object.keys(themeEntry.createFizzThemeVars('dark')),
  themeEntry.fizzTokenNames,
)
assert.equal(typeof presetEntry.fizzPreset, 'function')

const generatedCss = themeEntry.createThemeVarsCss()
const distCss = readFileSync(resolve(distRoot, 'styles/vars.css'), 'utf8')
assert.equal(normalizeCss(distCss), normalizeCss(generatedCss))
