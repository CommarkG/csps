#!/usr/bin/env node
// validate-wiring-completeness.mjs — S036 (P-ARCH-031 / wiring completeness standard)
// Scans libs/components/src/ and libs/integrations/*/index.ts for exported symbols.
// For each export: checks if any apps/*/src/**/*.{ts,tsx} file imports it.
// Also checks for wiring_deferred_until: comment to classify as DEFERRED.
//
// Status: WIRED | DEFERRED | ORPHAN
// ADVISORY for ORPHAN symbols with no wiring_deferred_until comment.
//
// Slug: 'wiring-completeness' in audit-runner.md
// Usage: node tools/validators/validate-wiring-completeness.mjs

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, resolve, relative } from 'path'

const ROOT = resolve(process.cwd())

// Collect all app source files
function getAppSrcFiles() {
  const files = []
  const appsDir = join(ROOT, 'apps')
  if (!existsSync(appsDir)) return files

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('.next')) {
        walk(full)
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        files.push(full)
      }
    }
  }

  for (const appDir of readdirSync(appsDir, { withFileTypes: true })) {
    if (!appDir.isDirectory()) continue
    const srcDir = join(appsDir, appDir.name, 'src')
    if (existsSync(srcDir)) walk(srcDir)
    // Also check next.config.js
    const configFile = join(appsDir, appDir.name, 'next.config.js')
    if (existsSync(configFile)) files.push(configFile)
    const sentryConfig = join(appsDir, appDir.name, 'sentry.client.config.ts')
    if (existsSync(sentryConfig)) files.push(sentryConfig)
  }
  return files
}

const appSrcFiles = getAppSrcFiles()
const appSrcContent = appSrcFiles.map(f => readFileSync(f, 'utf8').replace(/\r/g, ''))

function isWiredIn(symbol) {
  return appSrcContent.some(content =>
    content.includes(symbol) && (content.includes('import') || content.includes('require'))
  )
}

function isDeferredIn(symbol, filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')
    return content.includes(`wiring_deferred_until`) && content.includes(symbol.split(',')[0])
  } catch { return false }
}

// Extract exports from a file
function extractExports(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')
    const symbols = []
    // named exports in { X, Y }
    const braceRe = /^export\s*\{([^}]+)\}/gm
    let m
    while ((m = braceRe.exec(content)) !== null) {
      m[1].split(',').forEach(s => {
        const name = s.trim().split(/\s+as\s+/).pop()?.trim()
        if (name && name !== 'type') symbols.push(name)
      })
    }
    // direct exports
    const directRe = /^export\s+(?:async\s+)?(?:function|const|class|type|interface)\s+(\w+)/gm
    while ((m = directRe.exec(content)) !== null) {
      symbols.push(m[1])
    }
    return [...new Set(symbols)].filter(s => s && s !== 'default')
  } catch { return [] }
}

// Scan libs/components
const results = []
const COMP_INDEX = join(ROOT, 'libs/components/src/index.ts')
if (existsSync(COMP_INDEX)) {
  const compExports = extractExports(COMP_INDEX)
  for (const sym of compExports) {
    const wired = isWiredIn(sym)
    // Check for deferred comment in the component file
    const compFiles = readdirSync(join(ROOT, 'libs/components/src'), { recursive: true })
      .filter(f => String(f).includes('.tsx') || String(f).includes('.ts'))
      .map(f => join(ROOT, 'libs/components/src', String(f)))

    const deferred = compFiles.some(f => isDeferredIn(sym, f))
    results.push({
      symbol: sym,
      source: 'libs/components',
      status: wired ? 'WIRED' : deferred ? 'DEFERRED' : 'ORPHAN'
    })
  }
}

// Scan libs/integrations
const INTEG_INDEX = join(ROOT, 'libs/integrations/index.ts')
if (existsSync(INTEG_INDEX)) {
  const integExports = extractExports(INTEG_INDEX)
  for (const sym of integExports) {
    const wired = isWiredIn(sym)
    const integDirs = readdirSync(join(ROOT, 'libs/integrations'), { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => join(ROOT, 'libs/integrations', e.name))

    let deferred = false
    for (const dir of integDirs) {
      const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.ts')).map(f => join(dir, f)) : []
      if (files.some(f => isDeferredIn(sym, f))) { deferred = true; break }
    }
    // Also check root-level .ts files (errors.ts, webhook-idempotency.ts, index.ts)
    if (!deferred) {
      const rootFiles = readdirSync(join(ROOT, 'libs/integrations')).filter(f => f.endsWith('.ts')).map(f => join(ROOT, 'libs/integrations', f))
      if (rootFiles.some(f => isDeferredIn(sym, f))) deferred = true
    }

    results.push({
      symbol: sym,
      source: 'libs/integrations',
      status: wired ? 'WIRED' : deferred ? 'DEFERRED' : 'ORPHAN'
    })
  }
}

// Output
const wired = results.filter(r => r.status === 'WIRED').length
const deferred = results.filter(r => r.status === 'DEFERRED').length
const orphans = results.filter(r => r.status === 'ORPHAN')

console.log(`[validate-wiring-completeness] Symbols: ${results.length} | WIRED: ${wired} | DEFERRED: ${deferred} | ORPHAN: ${orphans.length}`)

if (orphans.length > 0) {
  console.log(`\n[validate-wiring-completeness] ADVISORY — ${orphans.length} ORPHAN symbol(s) (no wiring or deferral):`)
  for (const o of orphans.slice(0, 20)) {
    console.log(`  ⚠ ${o.symbol} (${o.source})`)
  }
  if (orphans.length > 20) console.log(`  ... and ${orphans.length - 20} more`)
  console.log('\n  Fix: Import symbol in apps/ OR add wiring_deferred_until: [session] comment in source file')
}

console.log(`[validate-wiring-completeness] wired=${wired} deferred=${deferred} orphan=${orphans.length}`)
process.exit(0) // ADVISORY only
