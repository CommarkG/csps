#!/usr/bin/env node
// validate-snapshot-continuity.mjs — S036-PROTO (Turn 67)
// Checks a module snapshot is still valid: exports still exist, still imported.
// Usage: node tools/validators/validate-snapshot-continuity.mjs [snapshot-file]
//        OR: node tools/validators/validate-snapshot-continuity.mjs --all
//
// ADVISORY if export removed without removal_reason: in snapshot.

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, resolve, relative } from 'path'

const ROOT = resolve(process.cwd())
const SNAPSHOT_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/snapshots')

function parseSimpleYaml(content) {
  const result = { exports: [], wired_in: [] }
  let currentKey = null
  for (const line of content.split('\n')) {
    if (line.startsWith('source: ')) result.source = line.slice(8).trim()
    if (line.startsWith('snapshot_date: ')) result.snapshot_date = line.slice(15).trim()
    if (line.startsWith('exports:')) { currentKey = 'exports'; continue }
    if (line.startsWith('wired_in:')) { currentKey = 'wired_in'; continue }
    if (line.startsWith('removal_reason:')) result.removal_reason = line.slice(16).trim()
    if (currentKey && line.match(/^\s+-\s+(.+)$/)) {
      const val = line.match(/^\s+-\s+(.+)$/)[1].trim()
      if (val !== '[]') result[currentKey].push(val)
    }
    if (line.match(/^\w/) && !line.startsWith('-')) currentKey = null
  }
  return result
}

function checkSnapshot(snapshotFile) {
  if (!existsSync(snapshotFile)) {
    console.log(`[validate-snapshot-continuity] Snapshot not found: ${snapshotFile}`)
    return { advisories: 1, blocking: 0 }
  }

  const content = readFileSync(snapshotFile, 'utf8')
  const snap = parseSimpleYaml(content)
  const sourceFile = join(ROOT, snap.source || '')
  let advisories = 0, blocking = 0

  if (!snap.source) {
    console.log(`[validate-snapshot-continuity] ⚠ Snapshot missing source: field`)
    return { advisories: 1, blocking: 0 }
  }

  if (!existsSync(sourceFile)) {
    console.log(`[validate-snapshot-continuity] ⚠ ADVISORY: Source file deleted: ${snap.source}`)
    if (!snap.removal_reason) {
      console.log(`  Add removal_reason: [reason] to snapshot to acknowledge deletion`)
      advisories++
    }
    return { advisories, blocking }
  }

  const sourceContent = readFileSync(sourceFile, 'utf8')

  // Check each export still exists in source
  for (const exp of snap.exports) {
    if (exp === 'default') continue
    if (!sourceContent.includes(exp)) {
      if (!snap.removal_reason) {
        console.log(`  ⚠ ADVISORY: Export "${exp}" no longer in ${snap.source}`)
        advisories++
      }
    }
  }

  // Check wired_in paths still import the module
  const baseName = (snap.source || '').split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
  for (const wiredPath of snap.wired_in) {
    const absWired = join(ROOT, wiredPath)
    if (!existsSync(absWired)) {
      console.log(`  ⚠ ADVISORY: Wired file deleted: ${wiredPath}`)
      advisories++
      continue
    }
    const wiredContent = readFileSync(absWired, 'utf8')
    if (!wiredContent.includes(baseName) && !wiredContent.includes('@csps/integrations') && !wiredContent.includes('@csps/components')) {
      console.log(`  ⚠ ADVISORY: ${wiredPath} may no longer import ${snap.source}`)
      advisories++
    }
  }

  if (advisories === 0) {
    console.log(`[validate-snapshot-continuity] ✓ ${relative(ROOT, snapshotFile)} — all exports valid, all wired_in consistent`)
  }

  return { advisories, blocking }
}

// Determine which snapshots to check
let snapshotFiles = []
if (process.argv[2] === '--all') {
  if (existsSync(SNAPSHOT_DIR)) {
    snapshotFiles = readdirSync(SNAPSHOT_DIR)
      .filter(f => f.endsWith('.yaml'))
      .map(f => join(SNAPSHOT_DIR, f))
  }
} else if (process.argv[2]) {
  snapshotFiles = [resolve(ROOT, process.argv[2])]
} else {
  console.log('Usage: node validate-snapshot-continuity.mjs [snapshot-file] OR --all')
  process.exit(0)
}

let totalAdvisories = 0, totalBlocking = 0
for (const sf of snapshotFiles) {
  const { advisories, blocking } = checkSnapshot(sf)
  totalAdvisories += advisories
  totalBlocking += blocking
}

console.log(`[validate-snapshot-continuity] checked=${snapshotFiles.length} advisory=${totalAdvisories} blocking=${totalBlocking}`)
process.exit(totalBlocking > 0 ? 1 : 0)
