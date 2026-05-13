import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const distDir = fileURLToPath(new URL('../dist', import.meta.url))
const forbiddenPatterns = [
  /node_modules[\\/]/,
  /packages[\\/]el-plus[\\/]src[\\/]/,
  /components[\\/][^'"]+[\\/]src[\\/]/,
  /\.\.[\\/]\.\.[\\/]/,
]

function collectDtsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory())
      return collectDtsFiles(path)

    return entry.isFile() && entry.name.endsWith('.d.ts') ? [path] : []
  })
}

const violations = collectDtsFiles(distDir).flatMap((file) => {
  const source = readFileSync(file, 'utf8')

  return forbiddenPatterns
    .filter(pattern => pattern.test(source))
    .map(pattern => `${file}: ${pattern}`)
})

if (violations.length > 0) {
  console.error('Public declaration files contain internal or non-portable paths:')
  for (const violation of violations)
    console.error(`- ${violation}`)

  process.exitCode = 1
}
