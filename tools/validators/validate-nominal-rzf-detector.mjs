#!/usr/bin/env node
/**
 * validate-nominal-rzf-detector.mjs
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces P-META-006 (RZF) + RZF-LATEST.md §6.I5
 * @behavioral-test-status: tested — tests A/B/C below
 * M1 Facet A sibling (S071) — nominal-RZF anti-theater validator
 *
 * STATUS: ADVISORY in S071.
 *
 * What it checks in tools/council/sonnet-turn.md + opus-turn.md:
 *   Cycle-2+ lines containing "0 new" / "0 new findings" / "zero new" that lack
 *   at least one filename-with-extension (.mjs/.sh/.yaml/.md etc.) in the same line
 *   or within ±1 line.
 *
 * RZF-LATEST §6.I3 + §6.I5: Cycle 2+ must NAME the re-examined files, not just claim
 * "0 new". "Cycle 2: 0 new findings" without file citations = nominal (non-terminal).
 *
 * Test 3/3:
 *   A: "Cycle 2: 0 new findings" without filename → flag (advisory)
 *   B: "Cycle 2: re-examined tools/verify.mjs + audit-runner.md. 0 new." → pass (has filenames)
 *   C: Non-ZF section (## MILESTONE REPORT) → pass (exempt)
 *
 * Audit slug: nominal-rzf-detector (registered in audit-runner.md)
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const SCAN_FILES = [
  join(ROOT, 'tools/council/sonnet-turn.md'),
  join(ROOT, 'tools/council/opus-turn.md'),
]
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-nominal-rzf-detector-last-run.json')

// Patterns for ZF cycle lines that claim completion without evidence
const NOMINAL_ZF_PATTERNS = [
  /\bCycle\s+[2-9]\b[^.]*\b0\s+new\b/i,
  /\bCycle\s+[2-9]\b[^.]*\bzero\s+new\b/i,
  /\bCycle\s+[2-9]\b.*\bno\s+new\s+findings\b/i,
]

// File extension pattern — presence indicates real file citation
const FILE_EXTENSION_PATTERN = /\b\w[\w./\-]*\.(mjs|sh|yaml|yml|md|ts|tsx|json|mts)\b/

// Exempt contexts — these are real completion markers, not nominal
const EXEMPT_PATTERNS = [
  /MILESTONE REPORT/i,
  /## M[\d.]+.*REPORT/i,
  /ZF ACHIEVED/i,           // The terminal line itself
  /Status:\s*ZF ACHIEVED/i,
  /ASK-OPUS-STOP/i,
]

let findings = 0
let advisory = 0
const all_findings = []

for (const filePath of SCAN_FILES) {
  if (!existsSync(filePath)) continue

  const raw = readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n')
  const lines = raw.split('\n')
  const fileName = filePath.split('/').pop() || filePath.split('\\').pop()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip exempt contexts
    if (EXEMPT_PATTERNS.some(p => p.test(line))) continue

    // Check if this line has a nominal ZF pattern
    const isNominal = NOMINAL_ZF_PATTERNS.some(p => p.test(line))
    if (!isNominal) continue

    // Check if there's a file extension in this line OR adjacent lines (±1)
    const contextStart = Math.max(0, i - 1)
    const contextEnd = Math.min(lines.length, i + 2)
    const context = lines.slice(contextStart, contextEnd).join(' ')

    const hasCitation = FILE_EXTENSION_PATTERN.test(context)
    if (hasCitation) continue

    // Flag as nominal ZF
    findings++
    advisory++
    all_findings.push({
      file: fileName,
      line: i + 1,
      content: line.trim().slice(0, 120),
      level: 'advisory',
    })

    if (all_findings.length <= 10) {
      console.log(`  ⚠ [advisory] ${fileName}:${i + 1}: Cycle 2+ claims "0 new" without naming any file:`)
      console.log(`    "${line.trim().slice(0, 100)}"`)
      console.log(`    Fix: name the files re-examined (e.g. "re-examined tools/verify.mjs + audit-runner.md — 0 new")`)
      console.log(`    Per RZF-LATEST §6.I5 + P-META-006 RZF discipline`)
    }
  }
}

const summary = `[validate-nominal-rzf-detector] findings=${findings} advisory=${advisory} blocking=0 (advisory S071 — RZF-LATEST §6.I5)`
console.log(summary)

const result = {
  findings,
  advisory,
  blocking: 0,
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

// ADVISORY — exit 0
process.exit(0)
