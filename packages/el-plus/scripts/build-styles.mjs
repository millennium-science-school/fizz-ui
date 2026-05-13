import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'sass'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = resolve(packageRoot, '../..')
const source = resolve(packageRoot, 'src/styles/index.scss')
const outDir = resolve(packageRoot, 'dist/styles')
const cssOut = resolve(outDir, 'index.css')
const scssOut = resolve(outDir, 'index.scss')
const dtsOut = resolve(outDir, 'index.d.ts')

await mkdir(outDir, { recursive: true })

const result = compile(source, {
  loadPaths: [
    resolve(packageRoot, 'node_modules'),
    resolve(workspaceRoot, 'node_modules'),
  ],
})

await writeFile(cssOut, result.css)
await copyFile(source, scssOut)
await writeFile(dtsOut, 'export {}\n')

console.log(`built: ${source} -> ${cssOut}`)
console.log(`copied: ${source} -> ${scssOut}`)
console.log(`typed: ${dtsOut}`)
