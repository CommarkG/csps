#!/usr/bin/env node
/**
 * validate-context-wrapped-numbers.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces P-META-028 (context-refined-communication cornerstone)
 * @behavioral-test-status: tested — tests A/B/C below
 * M1 Facet A (S071) — Rigidity advisory validator
 *
 * STATUS: ADVISORY in S071 (never blocking; rigidity-validator cannot itself be rigid).
 *
 * What it checks in docs/plan/ (md + yaml files recursively):
 *   Bare integers not wrapped by sample|tunable|expandable markers within ±3 lines
 *   AND not in the context-wrapped-numbers-allowlist.yaml.
 *
 * Allowlist: tools/data/context-wrapped-numbers-allowlist.yaml (built in M0.5)
 *
 * Test 3/3:
 *   A: bare integer in body without context → flag (advisory)
 *   B: integer with "(sample" nearby → pass
 *   C: allowlisted pattern (version string, principle ID) → pass
 *
 * Audit slug: context-wrapped-numbers (registered in audit-runner.md)
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve, relative } from 'path'
import { readdirSync, statSync } from 'fs'

const ROOT = resolve(process.cwd())
const ALLOWLIST_PATH = join(ROOT, 'tools/data/context-wrapped-numbers-allowlist.yaml')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-context-wrapped-numbers-last-run.json')

// Context marker phrases (within ±3 lines of a bare integer)
const CONTEXT_MARKERS = [
  /\(sample/i,
  /sample —/i,
  /tunable/i,
  /expandable/i,
  /\(target/i,
  /allowlisted/i,
  /current enumeration/i,
  /not a cap/i,
  /\(current set/i,
  /≥\s*\d/,        // "≥ 5" — already contextual (minimum, not cap)
  /at most \d/i,
  /up to \d/i,
]

// Load allowlist patterns from YAML (simple text parse — no js-yaml dependency)
function loadAllowlistPatterns() {
  const patterns = []
  if (!existsSync(ALLOWLIST_PATH)) return patterns
  const raw = readFileSync(ALLOWLIST_PATH, 'utf-8').replace(/\r\n/g, '\n')
  const lines = raw.split('\n')
  for (const line of lines) {
    const m = line.match(/^\s+pattern:\s*['"]?(.+?)['"]?\s*$/)
    if (m) {
      try {
        patterns.push(new RegExp(m[1].trim()))
      } catch { /* skip bad patterns */ }
    }
  }
  return patterns
}

const allowlistPatterns = loadAllowlistPatterns()

function isAllowlisted(line) {
  return allowlistPatterns.some(p => p.test(line))
}

function hasContextMarker(lines, idx) {
  const start = Math.max(0, idx - 3)
  const end = Math.min(lines.length, idx + 4)
  const window = lines.slice(start, end).join(' ')
  return CONTEXT_MARKERS.some(p => p.test(window))
}

// Files to scan (docs/plan/ .md and .yaml, excluding generated/data files)
const SCAN_DIRS = ['docs/plan/pillar-0-governance', 'docs/plan/_handoff']
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /last-run\.json/,
  /vault-pending/,
  /improvement-register/,
  /gap-recurrence/,
]

function shouldScan(filePath) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/')
  if (EXCLUDE_PATTERNS.some(p => p.test(rel))) return false
  return /\.(md|yaml)$/.test(filePath)
}

function walkDir(dir) {
  if (!existsSync(dir)) return []
  const results = []
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (/node_modules|\.git/.test(entry.name)) continue
      if (entry.isDirectory()) results.push(...walkDir(full))
      else if (entry.isFile() && shouldScan(full)) results.push(full)
    }
  } catch { /* skip unreadable dirs */ }
  return results
}

let files_checked = 0
let findings = 0
let advisory = 0
const all_findings = []

// Bare integer pattern: a standalone number ≥ 4 (single-digit numbers too common to flag)
// that isn't part of a version string, commit SHA, or identifier
const BARE_INT_PATTERN = /(?<![a-zA-Z0-9_.-])(\b[4-9]\d*\b|\b[1-9]\d{1,}\b)(?![a-zA-Z0-9_./\-])/g

// Lines we skip entirely (too noisy or always allowlisted)
const SKIP_LINE_PATTERNS = [
  /^#/,           // YAML comments
  /^\s*#/,        // Indented comments
  /```/,          // Code blocks
  /^\s*-{3}/,     // YAML separators
  /^\|.*\|/,      // Markdown tables
  /\bSHA\b/i,
  /commit\s+[0-9a-f]{7}/i,
  /[0-9a-f]{8,}/i, // Git SHAs
  /version:\s/,
  /^\s*id:/,
  /generated_at/,
  /session:\s/,
]

for (const dir of SCAN_DIRS) {
  const files = walkDir(join(ROOT, dir))
  for (const file of files) {
    try {
      const raw = readFileSync(file, 'utf-8').replace(/\r\n/g, '\n')
      const lines = raw.split('\n')
      files_checked++

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Skip certain line types
        if (SKIP_LINE_PATTERNS.some(p => p.test(line))) continue
        if (isAllowlisted(line)) continue

        let match
        BARE_INT_PATTERN.lastIndex = 0
        while ((match = BARE_INT_PATTERN.exec(line)) !== null) {
          const num = parseInt(match[1])
          // Skip very small numbers (1-3) — too common in text to be meaningful
          if (num < 4) continue
          // Skip if allowlisted
          if (isAllowlisted(line)) continue
          // Check ±3 lines for context markers
          if (hasContextMarker(lines, i)) continue

          // Flag as advisory finding
          findings++
          advisory++
          const rel = relative(ROOT, file).replace(/\\/g, '/')
          all_findings.push({
            file: rel,
            line: i + 1,
            content: line.trim().slice(0, 100),
            number: match[1],
            level: 'advisory',
          })
          if (all_findings.length <= 10) {
            console.log(`  ⚠ [advisory] ${rel}:${i + 1}: bare integer ${match[1]} lacks context marker`)
            console.log(`    "${line.trim().slice(0, 80)}"`)
            console.log(`    Fix: add (sample — expandable) / (target — tunable) / (allowlisted) within ±3 lines`)
          }
          break // One finding per line
        }
      }
    } catch { /* skip unreadable files */ }
  }
}

const summary = `[validate-context-wrapped-numbers] files_checked=${files_checked} findings=${findings} advisory=${advisory} blocking=0 (advisory-only per P-META-028 cornerstone — rigidity-validator cannot itself be rigid)`
console.log(summary)

const result = {
  files_checked,
  findings,
  advisory,
  blocking: 0,
  all_findings: all_findings.slice(0, 30),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

// ADVISORY always — exit 0
process.exit(0)
