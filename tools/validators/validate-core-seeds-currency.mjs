#!/usr/bin/env node
/**
 * validate-core-seeds-currency.mjs (S071 Turn 26 — OPUS-14)
 *
 * PREVENTION CLASS: CORE-SEEDS-INDEX-NOT-UPDATED-AT-MILESTONE-BOUNDARY
 *
 * Catches: any doctrine .md in docs/plan/pillar-0-governance/ that is missing
 * a NODE entry in docs/plan/_handoff/CORE-SEEDS-PLAN-PARTS.md.
 *
 * Inaugural instance (S071 Turn 24): Cornerstone + Long-Run + RZF-LATEST v1.1
 * + ONE-SOURCE-OF + AI-PROFILING + PLATFORM-OBSERVATION (6 doctrines authored
 * in S071) — none had CORE-SEEDS nodes until Governor surfaced the gap. Fix
 * needed Governor question to surface.
 *
 * Advisory in S071. Promotes to BLOCKING after 5 sample exemplar advisory
 * passes (tunable per P-META-028 cornerstone).
 *
 * NOTE: This is the v1 minimal-shape validator. Full status-consistency check
 * (compare CORE-SEEDS NODE STATUS line vs linked artifact's status: field)
 * is queued for S072 as vlt-S072-core-seeds-currency-status-check.
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'

const ROOT = process.cwd()
const DOCTRINES_DIR = join(ROOT, 'docs/plan/pillar-0-governance')
const CORE_SEEDS_FILE = join(ROOT, 'docs/plan/_handoff/CORE-SEEDS-PLAN-PARTS.md')

// Doctrines we expect to find NODE entries for (well-known canonical doctrines).
// Anchor names match what appears in CORE-SEEDS-PLAN-PARTS.md NODE headers.
// Sample enumeration — expandable per P-META-028 cornerstone.
const EXPECTED_DOCTRINES = [
  { file: 'RZF-LATEST.md', node_match: /RZF-LATEST|Real.Zero.Findings/i },
  { file: 'LONG-RUN-BUILDER-DOCTRINE.md', node_match: /Long.Run Builder/i },
  { file: 'ONE-SOURCE-OF-DOCTRINE.md', node_match: /ONE.SOURCE.OF/i },
  { file: 'AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md', node_match: /AI.PROFILING/i },
  { file: 'PLATFORM-OBSERVATION-DOCTRINE.md', node_match: /PLATFORM.OBSERVATION/i },
  { file: 'JOURNEY-DOCTRINE.md', node_match: /Journey Doctrine/i },
  { file: 'NAIVE-PERSONAS-DOCTRINE.md', node_match: /Naive Personas/i }
]

function main() {
  if (!existsSync(CORE_SEEDS_FILE)) {
    console.error(`[validate-core-seeds-currency] CORE-SEEDS file missing: ${CORE_SEEDS_FILE}`)
    process.exit(1)
  }
  const seeds = readFileSync(CORE_SEEDS_FILE, 'utf8')

  const findings = []
  let checked = 0
  let missing = 0

  for (const expected of EXPECTED_DOCTRINES) {
    const doctrinePath = join(DOCTRINES_DIR, expected.file)
    if (!existsSync(doctrinePath)) continue // doctrine itself absent — out of scope here
    checked++
    if (!expected.node_match.test(seeds)) {
      missing++
      findings.push({
        doctrine: expected.file,
        finding: `Doctrine exists at docs/plan/pillar-0-governance/${expected.file} but no NODE entry in CORE-SEEDS-PLAN-PARTS.md`,
        severity: 'ADVISORY'
      })
    }
  }

  const status = missing === 0 ? 'PASS' : 'ADVISORY-FINDINGS'
  console.log(`[validate-core-seeds-currency] checked=${checked} missing_nodes=${missing} status=${status}`)
  if (findings.length > 0) {
    for (const f of findings) {
      console.log(`  ⚠ ${f.doctrine}: ${f.finding}`)
    }
    console.log('  → Add NODE entry to docs/plan/_handoff/CORE-SEEDS-PLAN-PARTS.md (ANCHOR · ALIGNS · STATUS)')
  }
  process.exit(0) // advisory in S071
}

main()
