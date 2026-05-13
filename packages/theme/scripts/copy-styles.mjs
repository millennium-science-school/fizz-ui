/**
 * scripts/copy-styles.mjs
 * 从 dist/index.mjs 的 token 生成 vars.css。
 * 在 build 命令末尾调用：pnpm copy:styles
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outDir = resolve(root, 'dist/styles')

mkdirSync(outDir, { recursive: true })

const { createThemeVarsCss } = await import(pathToFileURL(resolve(root, 'dist/index.mjs')).href)
writeFileSync(resolve(outDir, 'vars.css'), createThemeVarsCss())
writeFileSync(resolve(outDir, 'vars.d.ts'), 'export {}\n')
console.log('generated: dist/styles/vars.css')
console.log('generated: dist/styles/vars.d.ts')
