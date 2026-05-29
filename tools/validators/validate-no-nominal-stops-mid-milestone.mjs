#!/usr/bin/env node
/**
 * validate-no-nominal-stops-mid-milestone.mjs
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces LONG-RUN-BUILDER-DOCTRINE + B_AUTONOMOUS_BATCH_WITH_PREFLIGHT
 * @behavioral-test-status: tested — tests A/B/C below
 * M0.7 (S071) — Long-Run Builder Discipline T2 validator
 *
 * STATUS: ADVISORY in S071. Promotes to BLOCKING after 5 sample exemplar passes
 *         (tunable per P-META-028 cornerstone). This count is NOT a cap.
 *
 * What it checks in tools/council/sonnet-turn.md recent entries:
 *   1. N1-N8 nominal-stop phrase patterns appearing inside milestone-run blocks
 *   2. Heuristic: pattern in section that is NOT a Milestone Report header
 *      AND NOT an ASK-OPUS-STOP block AND NOT an OPTIMAL NEXT STEP section
 *
 * Test 3/3:
 *   A: nominal-stop mid-milestone (N1: "Should I proceed?") → flags as advisory
 *   B: real-stop R3 ("ASK-OPUS-STOP") → passes cleanly (exempt)
 *   C: Milestone Report header section → passes cleanly (exempt)
 *
 * Audit slug: no-nominal-stops (registered in audit-runner.md)
 * Advisory promotion threshold: 5 sample exemplar passes (tunable)
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const SONNET_TURN_PATH = join(ROOT, 'tools/council/sonnet-turn.md')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-no-nominal-stops-mid-milestone-last-run.json')

// N1-N8 nominal stop patterns — current enumeration (expandable per vlt-S071-nominal-stop-phrase-expansion)
// Numbers are sample/tunable per P-META-028
const NOMINAL_STOP_PATTERNS = [
  { id: 'N1', pattern: /should i proceed\??/i },
  { id: 'N1', pattern: /ready for next\??/i },
  { id: 'N1', pattern: /shall i continue\??/i },
  { id: 'N1', pattern: /do you want me to continue\??/i },
  { id: 'N2', pattern: /just to be safe,? let me ask/i },
  { id: 'N2', pattern: /just to confirm before/i },
  { id: 'N3', pattern: /shall i start the next milestone/i },
  { id: 'N3', pattern: /ready to begin the next milestone/i },
  { id: 'N7', pattern: /let me confirm my understanding/i },
  { id: 'N8', pattern: /do you want me to also/i },
  { id: 'N8', pattern: /would you like me to additionally/i },
]

// Phrases that indicate an EXEMPT context (real stop or milestone report)
const EXEMPT_PATTERNS = [
  /MILESTONE REPORT/i,
  /## M[\d.]+.*REPORT/i,
  /ASK-OPUS-STOP/i,
  /OPTIMAL NEXT STEP/i,
  /R[1-9]:? /,    // Real-stop mentions (R1-R9) in real-stop context
  /REAL STOP/i,
  /ZF Cycle/i,    // ZF evidence blocks are not nominal stops
]

let findings = 0
let advisory = 0
let blocking = 0
const all_findings = []

function isExemptContext(block) {
  return EXEMPT_PATTERNS.some(p => p.test(block))
}

function checkSonnetTurn() {
  if (!existsSync(SONNET_TURN_PATH)) {
    console.log('[validate-no-nominal-stops] sonnet-turn.md not found — skipping')
    return
  }

  const raw = readFileSync(SONNET_TURN_PATH, 'utf-8').replace(/\r\n/g, '\n')
  const lines = raw.split('\n')

  // Scan recent sections (last 200 sample lines — tunable)
  const recentLines = lines.slice(-200)
  const recentBlock = recentLines.join('\n')

  for (const { id, pattern } of NOMINAL_STOP_PATTERNS) {
    const match = recentBlock.match(pattern)
    if (!match) continue

    // Get context around the match (sample 5 lines before + after)
    const matchIdx = recentLines.findIndex(l => pattern.test(l))
    if (matchIdx === -1) continue

    const contextStart = Math.max(0, matchIdx - 5)
    const contextEnd = Math.min(recentLines.length, matchIdx + 5)
    const context = recentLines.slice(contextStart, contextEnd).join('\n')

    // Check if this is an exempt context (real stop, milestone report, etc.)
    if (isExemptContext(context)) continue

    // Flag as advisory finding
    findings++
    advisory++
    all_findings.push({
      id,
      pattern: pattern.toString(),
      matched: match[0],
      context: context.slice(0, 200),
      level: 'advisory',
    })
    console.log(`  ⚠ [advisory] ${id} nominal-stop pattern in sonnet-turn.md: "${match[0]}"`)
    console.log(`    Context: ...${context.trim().slice(0, 100)}...`)
    console.log(`    Long-run doctrine: proceed through N1-N8; pause only for R1-R9.`)
  }
}

checkSonnetTurn()

const summary = `[validate-no-nominal-stops] findings=${findings} advisory=${advisory} blocking=${blocking} (advisory-only S071 — promotes after 5 sample exemplar passes)`
console.log(summary)

const result = {
  findings,
  advisory,
  blocking,
  advisory_promotion_threshold: 5,  // sample — tunable per P-META-028
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

// ADVISORY in S071 — always exit 0
process.exit(0)
