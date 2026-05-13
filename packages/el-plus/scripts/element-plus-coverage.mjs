import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(scriptDir, '..')
const EXPORT_BODY_RE = /export \{([\s\S]*?)\};/
const EXPORT_ALIAS_RE = /\s+as\s+/
const ELEMENT_COMPONENT_EXPORT_RE = /^El[A-Z]/
const TRANSPARENT_WRAPPER_RE = /(?:createTransparentWrapper|defineFeTransparentComponent)(?:<[^>]+>)?\('Fe\w+',\s*(El\w+),/g

const SPECIAL_AND_COMPAT_EL_EXPORTS = [
  'ElConfigProvider',
  'ElInfiniteScroll',
  'ElLoading',
  'ElLoadingDirective',
  'ElLoadingService',
  'ElMessage',
  'ElMessageBox',
  'ElNotification',
  'ElPopoverDirective',
  'ElPopper',
  'ElPopperArrow',
]

function readPackageFile(path) {
  return readFileSync(resolve(packageRoot, path), 'utf8')
}

function getElementPlusRuntimeExports() {
  const source = readPackageFile('node_modules/element-plus/es/components/index.mjs')
  const exportBody = source.match(EXPORT_BODY_RE)?.[1]

  if (!exportBody) {
    throw new Error('Could not find Element Plus components export body.')
  }

  return [...new Set(exportBody
    .split(',')
    .map(raw => raw.trim())
    .map(item => item.includes(' as ') ? item.split(EXPORT_ALIAS_RE).at(-1) : item)
    .filter(name => ELEMENT_COMPONENT_EXPORT_RE.test(name)))]
    .sort()
}

function getTransparentWrappedElementPlusExports() {
  const source = readPackageFile('src/components/transparent-components.ts')

  return [...new Set(Array.from(
    source.matchAll(TRANSPARENT_WRAPPER_RE),
    match => match[1],
  ))]
    .sort()
}

export function getElementPlusCoverage() {
  const elementPlusExports = getElementPlusRuntimeExports()
  const transparentExports = getTransparentWrappedElementPlusExports()
  const covered = new Set([...transparentExports, ...SPECIAL_AND_COMPAT_EL_EXPORTS])
  const remaining = elementPlusExports.filter(name => !covered.has(name))

  return {
    totalElRuntimeExports: elementPlusExports.length,
    transparentWrapped: transparentExports.length,
    specialAndCompatCovered: SPECIAL_AND_COMPAT_EL_EXPORTS.length,
    coveredTotal: elementPlusExports.filter(name => covered.has(name)).length,
    remaining,
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const coverage = getElementPlusCoverage()
  console.log(JSON.stringify(coverage, null, 2))

  if (coverage.remaining.length > 0) {
    process.exitCode = 1
  }
}
