#!/usr/bin/env node
/**
 * validate-proto-completeness.mjs
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces PROTO-AND-TAB-TRANSFER-PROTOCOL.md + proto.template.md
 * @behavioral-test-status: tested — tests A/B/C below
 * M0.5 (S071) — Proto-Production Discipline
 *
 * STATUS: ADVISORY in S071. Promotes to BLOCKING only after all existing protos
 *         pass clean (the exemplar gate). Per OPUS-14 directive.
 *
 * What it checks on every docs/plan/protos/*.md:
 *   1. All required sections present (exact header match)
 *   2. N-PERSONA REVIEW integer equals count of persona bullet blocks
 *      (kills nominal persona count claims at source)
 *   3. STEP 0 has ratification checkbox: "[ ] Governor ratifies design → Sonnet builds"
 *      or "[x] Governor ratifies design → Sonnet builds"
 *   4. status:ratified requires ratified_by + ratified_at non-empty
 *   5. AUTHOR SIGNATURE present
 *   6. INHERITS / ALIGNS-WITH declared
 *
 * Test 3/3:
 *   A: passing proto → exits 0, advisory=0
 *   B: persona-count-mismatch (## 5-PERSONA REVIEW but only 3 blocks) → advisory
 *   C: missing required section → advisory
 *
 * Audit slug: proto-completeness (registered in audit-runner.md)
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs'
import { join, resolve, basename } from 'path'

const ROOT = resolve(process.cwd())
const PROTOS_DIR = join(ROOT, 'docs/plan/protos')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-proto-completeness-last-run.json')

// Required section headers (exact match against lines starting with ##)
const REQUIRED_SECTIONS = [
  /^## CORE SEED/i,
  /^## INHERITS\s*[/\\]?\s*ALIGNS[-\s]WITH/i,
  /^## ASK[-\s]OPUS[-\s]STOP/i,
  /^## \d+[-\s]PERSONA REVIEW/i,
  /^## STEP 0/i,
  /^## ZF GATE/i,
  /^## PREVENTION CLASSES/i,
  /^## .*(3[-\s]SCOPE|§15)/i,
  /^## AUTHOR SIGNATURE/i,
]

const REQUIRED_SECTION_NAMES = [
  'CORE SEED',
  'INHERITS / ALIGNS-WITH',
  'ASK-OPUS-STOP TRIGGERS',
  'N-PERSONA REVIEW',
  'STEP 0',
  'ZF GATE',
  'PREVENTION CLASSES',
  '§15 3-SCOPE',
  'AUTHOR SIGNATURE',
]

let protos_checked = 0
let findings_count = 0
let advisory = 0
let blocking = 0
const all_findings = []

function addFinding(file, level, msg) {
  all_findings.push({ file, level, msg })
  if (level === 'blocking') blocking++
  else advisory++
  findings_count++
  console.log(`  ${level === 'blocking' ? '✗' : '⚠'} [${level}] ${basename(file)}: ${msg}`)
}

function extractFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/m)
  if (!m) return {}
  const fm = {}
  for (const line of m[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    if (key && val) fm[key] = val
  }
  return fm
}

function checkProto(filePath) {
  const raw = readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n')
  const lines = raw.split('\n')
  const fm = extractFrontmatter(raw)

  protos_checked++
  const findings = []

  // 1. Check required sections
  for (let i = 0; i < REQUIRED_SECTIONS.length; i++) {
    const pattern = REQUIRED_SECTIONS[i]
    const found = lines.some(line => pattern.test(line))
    if (!found) {
      findings.push({ level: 'advisory', msg: `missing required section: ${REQUIRED_SECTION_NAMES[i]}` })
    }
  }

  // 2. Check N-PERSONA REVIEW header integer matches persona block count
  const personaHeaderLine = lines.find(l => /^## \d+[-\s]PERSONA REVIEW/i.test(l))
  if (personaHeaderLine) {
    const headerNum = parseInt(personaHeaderLine.match(/## (\d+)/)?.[1] ?? '0')
    // Count persona blocks: lines starting with "- **<persona-name>:**"
    const personaBlocks = lines.filter(l => /^\s*-\s+\*\*[a-z][-a-z ]+\*\*\s*:/i.test(l))
    const actualCount = personaBlocks.length
    if (headerNum !== actualCount && headerNum > 0 && actualCount > 0) {
      findings.push({
        level: 'advisory',
        msg: `N-PERSONA REVIEW header says ${headerNum} but found ${actualCount} persona blocks — nominal count (kills M4 root-cause at source)`,
      })
    }
  }

  // 3. STEP 0 ratification checkbox
  const step0Idx = lines.findIndex(l => /^## STEP 0/i.test(l))
  if (step0Idx > -1) {
    const step0Block = lines.slice(step0Idx, step0Idx + 20).join('\n')
    if (!step0Block.includes('Governor ratifies design')) {
      findings.push({
        level: 'advisory',
        msg: 'STEP 0 missing ratification checkbox ("Governor ratifies design → Sonnet builds")',
      })
    }
  }

  // 4. status:ratified requires ratified_by + ratified_at
  if (fm.status === 'ratified') {
    if (!fm.ratified_by || fm.ratified_by === '""' || fm.ratified_by === "''") {
      findings.push({ level: 'advisory', msg: 'status:ratified but ratified_by is empty' })
    }
    if (!fm.ratified_at || fm.ratified_at === '""' || fm.ratified_at === "''") {
      findings.push({ level: 'advisory', msg: 'status:ratified but ratified_at is empty' })
    }
  }

  // 5. Author signature
  const hasSignature = lines.some(l => /^—\s+(OPUS|Opus|SONNET|Sonnet|Governor)/i.test(l))
  if (!hasSignature) {
    findings.push({ level: 'advisory', msg: 'missing AUTHOR SIGNATURE line (— OPUS-N or — Sonnet)' })
  }

  // 6. INHERITS declared (at least one inherit reference)
  const inheritSection = lines.findIndex(l => /^## INHERITS\s*[/\\]?\s*ALIGNS[-\s]WITH/i.test(l))
  if (inheritSection > -1) {
    const inheritBlock = lines.slice(inheritSection, inheritSection + 10).join('\n')
    if (!inheritBlock.includes('Inherits') && !inheritBlock.includes('inherits') && !inheritBlock.includes('-')) {
      findings.push({ level: 'advisory', msg: 'INHERITS section present but appears empty (no declared parent)' })
    }
  }

  for (const f of findings) {
    addFinding(filePath, f.level, f.msg)
  }

  return findings.length === 0
}

// Run on all protos
if (!existsSync(PROTOS_DIR)) {
  console.log('[validate-proto-completeness] protos dir not found — no protos to check')
  process.exit(0)
}

const protoFiles = readdirSync(PROTOS_DIR)
  .filter(f => f.startsWith('PROTO-') && f.endsWith('.md'))
  .map(f => join(PROTOS_DIR, f))

for (const file of protoFiles) {
  checkProto(file)
}

// Migration sweep summary (advisory pass — findings are NOT blocking in S071)
if (all_findings.length > 0) {
  console.log(`\n[validate-proto-completeness] ${all_findings.length} finding(s) across ${protos_checked} protos`)
  console.log('  → Run migration: create proto-completeness-migration.yaml vlt entry for systematic fix')
  console.log('  → Advisory in S071 (promotes to blocking after existing protos pass clean)')
}

const summary = `[validate-proto-completeness] protos_checked=${protos_checked} findings=${findings_count} advisory=${advisory} blocking=${blocking}`
console.log(summary)

const result = {
  protos_checked,
  findings_count,
  advisory,
  blocking,
  all_findings: all_findings.slice(0, 50),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

// ADVISORY in S071 — always exit 0
process.exit(0)
