#!/usr/bin/env node
// capture-module-snapshot.mjs — S036-PROTO (Turn 67)
// Static analysis snapshot of a module's exports and where it's imported in apps/.
// Usage: node tools/scripts/capture-module-snapshot.mjs [path-to-module]
// Output: docs/plan/_handoff/VAULT/snapshots/[basename]-[YYYYMMDD].yaml
//
// Run BEFORE modifying any libs/ module to establish the baseline.
// Use validate-snapshot-continuity.mjs to check the snapshot is still valid.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, resolve, basename, relative, extname } from 'path'

const ROOT = resolve(process.cwd())
const SNAPSHOT_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/snapshots')

const targetPath = process.argv[2]
if (!targetPath) {
  console.error('Usage: node tools/scripts/capture-module-snapshot.mjs [path-to-module]')
  process.exit(1)
}

const absTarget = resolve(ROOT, targetPath)
if (!existsSync(absTarget)) {
  console.error(`File not found: ${absTarget}`)
  process.exit(1)
}

// ─── Extract exports via static analysis ─────────────────────────────────────

function extractExports(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const exports = []

  // named exports: export function X, export const X, export class X, export type X
  const namedExportRe = /^export\s+(?:async\s+)?(?:function|const|class|type|interface|enum)\s+(\w+)/gm
  let m
  while ((m = namedExportRe.exec(content)) !== null) {
    exports.push(m[1])
  }

  // re-exports: export { X, Y } from '...' or export { X }
  const reExportRe = /^export\s*\{([^}]+)\}/gm
  while ((m = reExportRe.exec(content)) !== null) {
    const names = m[1].split(',').map(s => s.trim().split(/\s+as\s+/).pop()?.trim()).filter(Boolean)
    exports.push(...names)
  }

  // default export
  if (/^export\s+default\s+/m.test(content)) {
    exports.push('default')
  }

  return [...new Set(exports)]
}

// ─── Find imports of this module in apps/ ─────────────────────────────────────

function findWiredIn(targetRel) {
  const wiredIn = []
  const appsDir = join(ROOT, 'apps')
  if (!existsSync(appsDir)) return wiredIn

  const targetName = basename(targetRel, extname(targetRel))

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) { walk(full); continue }
      if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) continue

      const content = readFileSync(full, 'utf8')
      // Check if this file imports from the target (by module name or path segment)
      if (content.includes(targetName) || content.includes('@csps/integrations') || content.includes('@csps/components')) {
        const rel = relative(ROOT, full).replace(/\\/g, '/')
        wiredIn.push(rel)
      }
    }
  }
  walk(appsDir)
  return wiredIn
}

// ─── Write snapshot ───────────────────────────────────────────────────────────

const relTarget = relative(ROOT, absTarget).replace(/\\/g, '/')
const exports = extractExports(absTarget)
const wiredIn = findWiredIn(relTarget)
const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
const base = basename(absTarget, extname(absTarget))
const outFile = join(SNAPSHOT_DIR, `${base}-${date}.yaml`)

const yaml = `# Module snapshot — ${relTarget}
# Generated: ${new Date().toISOString()}
# Validate: node tools/validators/validate-snapshot-continuity.mjs [this-file]

source: ${relTarget}
snapshot_date: ${new Date().toISOString()}
exports:
${exports.map(e => `  - ${e}`).join('\n')}
wired_in:
${wiredIn.length > 0 ? wiredIn.map(w => `  - ${w}`).join('\n') : '  []'}
`

writeFileSync(outFile, yaml, 'utf8')
console.log(`[capture-module-snapshot] Snapshot written: ${relative(ROOT, outFile)}`)
console.log(`  exports: ${exports.length} | wired_in: ${wiredIn.length}`)
