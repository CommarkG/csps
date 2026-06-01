#!/usr/bin/env node
/**
 * validate-layer-split.mjs
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces P-ARCH-030 (agent-decoupling) — dim 3 Foundation
 * Phase A S076: Agent-Decoupling layer-split validator
 *
 * What it checks:
 *   1. default-correction-registry.yaml: every default has `layer: system|scaffold`
 *   2. hardwire-register.yaml: every row has `layer: system|scaffold`
 *   3. No scaffold artifact is referenced from system-layer validators/hooks
 *      (scaffold: D16, D17, D19, hardwire-002, hardwire-004, relay files)
 *   4. Relay files (opus-turn.md, sonnet-turn.md) carry scaffold classification comment
 *
 * Blocking: missing layer: field on any registered artifact
 * Advisory: scaffold artifact referenced from system-layer file
 *
 * Block-test A: remove layer: from any entry → exit 1 (blocking)
 * Block-test B: add D16 (scaffold) reference to a system validator → advisory flag
 *
 * Audit slug: layer_split
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-layer-split-last-run.json')

const DEFAULT_REGISTRY = join(ROOT, 'tools/data/default-correction-registry.yaml')
const HARDWIRE_REGISTRY = join(ROOT, 'tools/data/hardwire-register.yaml')
const RELAY_FILES = [
  join(ROOT, 'tools/council/opus-turn.md'),
  join(ROOT, 'tools/council/sonnet-turn.md'),
]

// Scaffold artifact IDs — these must NOT be referenced from system validators
const SCAFFOLD_IDS = new Set(['D16', 'D17', 'D19', 'hardwire-002', 'hardwire-004'])
const SCAFFOLD_RELAY_PATHS = ['opus-turn.md', 'sonnet-turn.md']

let blocking = 0
let advisory = 0
const all_findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  all_findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

// --- CHECK 1: default-correction-registry layer: fields ---
if (!existsSync(DEFAULT_REGISTRY)) {
  flag('blocking', 'default-correction-registry.yaml not found')
} else {
  const content = readFileSync(DEFAULT_REGISTRY, 'utf-8')
  const idMatches = content.match(/  - id: (D\d+)/g) || []
  for (const m of idMatches) {
    const id = m.replace('  - id: ', '')
    // Find the entry block for this ID
    const entryStart = content.indexOf(`  - id: ${id}`)
    const nextEntry = content.indexOf('  - id: D', entryStart + 1)
    const entryBlock = content.slice(entryStart, nextEntry > -1 ? nextEntry : content.length)
    const hasLayer = /^\s+layer:\s+(system|scaffold)\s*$/m.test(entryBlock)
    if (!hasLayer) {
      flag('blocking', `default-correction-registry.yaml: ${id} missing layer: field (must be system|scaffold)`)
    } else {
      const layerMatch = entryBlock.match(/^\s+layer:\s+(system|scaffold)\s*$/m)
      if (layerMatch) {
        console.log(`  ✓ ${id}: layer=${layerMatch[1]}`)
      }
    }
  }
}

// --- CHECK 2: hardwire-register layer: fields ---
if (!existsSync(HARDWIRE_REGISTRY)) {
  flag('blocking', 'hardwire-register.yaml not found')
} else {
  const content = readFileSync(HARDWIRE_REGISTRY, 'utf-8')
  const idMatches = content.match(/  - id: (hardwire-\d+)/g) || []
  for (const m of idMatches) {
    const id = m.replace('  - id: ', '')
    const entryStart = content.indexOf(`  - id: ${id}`)
    const nextEntry = content.indexOf('  - id: hardwire-', entryStart + 1)
    const entryBlock = content.slice(entryStart, nextEntry > -1 ? nextEntry : content.length)
    const hasLayer = /^\s+layer:\s+(system|scaffold)\s*$/m.test(entryBlock)
    if (!hasLayer) {
      flag('blocking', `hardwire-register.yaml: ${id} missing layer: field (must be system|scaffold)`)
    } else {
      const layerMatch = entryBlock.match(/^\s+layer:\s+(system|scaffold)\s*$/m)
      if (layerMatch) {
        console.log(`  ✓ ${id}: layer=${layerMatch[1]}`)
      }
    }
  }
}

// --- CHECK 3: relay files carry scaffold classification ---
for (const relayFile of RELAY_FILES) {
  if (!existsSync(relayFile)) {
    flag('advisory', `relay file not found: ${relayFile}`)
    continue
  }
  const content = readFileSync(relayFile, 'utf-8')
  const hasScaffoldComment = /# layer: scaffold/.test(content)
  const hasDisposableComment = /# disposable_if: arrangement_changes/.test(content)
  const fileName = relayFile.split(/[/\\]/).pop()
  if (!hasScaffoldComment) {
    flag('blocking', `${fileName}: missing "# layer: scaffold" classification comment`)
  } else if (!hasDisposableComment) {
    flag('advisory', `${fileName}: has layer:scaffold but missing disposable_if comment`)
  } else {
    console.log(`  ✓ ${fileName}: layer=scaffold + disposable_if declared`)
  }
}

// --- CHECK 4: scaffold artifact refs from system validator files ---
// Scan system validators for references to scaffold artifact IDs
// (Advisory — scaffold IDs mentioned in system validators as load-bearing deps)
import { readdirSync } from 'fs'
const validatorDir = join(ROOT, 'tools/validators')
if (existsSync(validatorDir)) {
  const validatorFiles = readdirSync(validatorDir).filter(f => f.endsWith('.mjs') && f !== 'validate-layer-split.mjs')
  for (const vf of validatorFiles) {
    const vPath = join(validatorDir, vf)
    const vContent = readFileSync(vPath, 'utf-8')
    for (const scaffoldId of SCAFFOLD_IDS) {
      // Only flag load-bearing enforcement patterns, not casual mentions or comments
      // Pattern: scaffold ID appears as an argument to enforce/require/block/gate functions
      const refPattern = new RegExp(`(?:enforce|require|block|gate|validate).*\\b${scaffoldId}\\b|\\b${scaffoldId}\\b.*(?:enforce|require|block|gate)`)
      if (refPattern.test(vContent)) {
        flag('advisory', `${vf}: load-bearing reference to scaffold artifact ${scaffoldId} — verify this is not a system dependency`)
      }
    }
  }
}

const summary = `[validate-layer-split] blocking=${blocking} advisory=${advisory}`
console.log(summary)

const result = {
  blocking,
  advisory,
  all_findings: all_findings.slice(0, 30),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

process.exit(blocking > 0 ? 1 : 0)
