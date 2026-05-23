import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'

const packageArg = process.argv[2] ?? '.'
const packageRoot = resolve(packageArg)
const distDir = resolve(packageRoot, 'dist')

const forbiddenPatterns = [
  {
    label: 'node_modules path',
    pattern: /node_modules[\\/]/,
  },
  {
    label: 'absolute Windows path',
    pattern: /[A-Z]:[\\/]/i,
  },
  {
    label: 'absolute POSIX workspace path',
    pattern: /(?:\/Users\/|\/home\/|\/tmp\/|\/workspace\/|\/var\/folders\/)/,
  },
  {
    label: 'workspace source path',
    pattern: /packages[\\/][^\\/]+[\\/]src[\\/]/,
  },
  {
    label: 'parent source traversal',
    pattern: /\.\.[\\/].*src[\\/]/,
  },
]

function collectDtsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory())
      return collectDtsFiles(path)

    return entry.isFile() && entry.name.endsWith('.d.ts') ? [path] : []
  })
}

function assertPackageRoot() {
  if (!isAbsolute(packageRoot)) {
    console.error(`Package root must resolve to an absolute path: ${packageArg}`)
    process.exit(1)
  }

  if (!existsSync(distDir)) {
    console.error(`Package dist directory does not exist: ${distDir}`)
    process.exit(1)
  }
}

assertPackageRoot()

const violations = collectDtsFiles(distDir).flatMap((file) => {
  const source = readFileSync(file, 'utf8')

  return forbiddenPatterns
    .filter(rule => rule.pattern.test(source))
    .map(rule => `${file}: ${rule.label} (${rule.pattern})`)
})

if (violations.length > 0) {
  console.error('Public declaration files contain internal or non-portable paths:')
  for (const violation of violations)
    console.error(`- ${violation}`)

  process.exitCode = 1
}
