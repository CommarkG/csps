#!/usr/bin/env node
/**
 * validate-load-test-harness.mjs
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces dim-4 Surface 4 (N×M LOAD-TEST HARNESS)
 *               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §DESIGN SURFACE 4
 *               libs/platform-quota/ (config.js must sync with supabase-free.ts constants)
 * Phase 1 S077: load-test harness structure validator
 *
 * What it checks:
 *   1. tools/load-tests/k6/ directory exists with all 4 scenario files
 *   2. Each scenario file has @csps-dna header
 *   3. Each scenario has k6 options.thresholds (PASS bar defined)
 *   4. Scenario C has DEFERRED notation (RLS measurement requires Pro)
 *   5. tools/load-tests/k6/config.js constants match libs/platform-quota/src/supabase-free.ts
 *   6. tools/load-tests/README.md exists with run instructions
 *
 * Blocking: harness directory missing | scenario file missing | DEFERRED notation missing from C
 * Advisory: config constants drift from platform-quota | README missing run command
 *
 * Block-test A: missing scenario file → exit 1
 *
 * Audit slug: load_test_harness
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { writeFileSync } from 'fs'

const ROOT = resolve(process.cwd())
const HARNESS_DIR = join(ROOT, 'tools/load-tests/k6')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-load-test-harness-last-run.json')

const REQUIRED_SCENARIOS = [
  { file: 'scenario-a-concurrent-burst.js', label: 'A — Concurrent Burst', deferredOk: false },
  { file: 'scenario-b-connection-pool-stress.js', label: 'B — Connection Pool Stress', deferredOk: false },
  { file: 'scenario-c-rls-latency.js', label: 'C — RLS Latency', deferredOk: true, requiresDeferred: true },
  { file: 'scenario-d-noisy-neighbor.js', label: 'D — Noisy-Neighbor Isolation', deferredOk: false },
]

// Constants that must match between config.js and supabase-free.ts
const SYNC_CONSTANTS = [
  { name: 'FREE_MAX_DB_CONNECTIONS', expected: 60 },
  { name: 'FREE_DB_CONNECTIONS_PER_APP', expected: 1 },
  { name: 'PLATFORM_APP_COUNT_TARGET', expected: 30 },
  { name: 'FREE_MAX_REQUESTS_PER_MINUTE', expected: 60 },
]

let blocking = 0
let advisory = 0
const findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

// Block-test A override: simulate missing scenario file
const BLOCK_TEST_A = process.argv.includes('--block-test-a')

console.log('\n[validate-load-test-harness] Checking Surface 4 — N×M load-test harness…\n')

// ── CHECK 1: Harness directory exists ─────────────────────────────
if (!existsSync(HARNESS_DIR)) {
  flag('blocking', `tools/load-tests/k6/ missing — create the k6 load-test harness directory`)
} else {
  console.log('  ✓ tools/load-tests/k6/ exists')
}

// ── CHECK 2: All 4 scenario files present ─────────────────────────
for (const scenario of REQUIRED_SCENARIOS) {
  const path = join(HARNESS_DIR, scenario.file)
  // Block-test A: simulate missing scenario-a
  const isMissing = BLOCK_TEST_A && scenario.file.includes('scenario-a')
    ? true
    : !existsSync(path)

  if (isMissing) {
    flag('blocking', `Missing scenario ${scenario.label}: ${scenario.file}`)
    continue
  }

  const content = readFileSync(path, 'utf8')

  // Check DNA header
  if (!content.includes('@csps-dna')) {
    flag('advisory', `Scenario ${scenario.label}: missing @csps-dna header`)
  }

  // Check k6 options with thresholds
  if (!content.includes('export const options') || !content.includes('thresholds')) {
    flag('blocking', `Scenario ${scenario.label}: missing k6 options.thresholds (PASS bar undefined)`)
  }

  // Check DEFERRED notation for Scenario C
  if (scenario.requiresDeferred && !content.includes('DEFERRED')) {
    flag('blocking', `Scenario C: missing DEFERRED notation — C requires Pro tier (pg_stat_statements); must document deferral with boundary-003 reference`)
  }

  // Check boundary-003 reference in Scenario C
  if (scenario.requiresDeferred && !content.includes('boundary-003')) {
    flag('advisory', `Scenario C: missing boundary-003 reference — add link to tier-upgrade obligation`)
  }

  console.log(`  ✓ Scenario ${scenario.label}: present, structured correctly`)
}

// ── CHECK 3: config.js constants match supabase-free.ts ──────────
const configPath = join(HARNESS_DIR, 'config.js')
const supabaseFreePath = join(ROOT, 'libs/platform-quota/src/supabase-free.ts')

if (existsSync(configPath) && existsSync(supabaseFreePath)) {
  const configContent = readFileSync(configPath, 'utf8')
  const freeContent = readFileSync(supabaseFreePath, 'utf8')

  for (const constant of SYNC_CONSTANTS) {
    const configMatch = configContent.match(new RegExp(`${constant.name}\\s*=\\s*(\\d+)`))
    const freeMatch = freeContent.match(new RegExp(`${constant.name}\\s*=\\s*(\\d+)`))

    const configVal = configMatch ? parseInt(configMatch[1]) : null
    const freeVal = freeMatch ? parseInt(freeMatch[1]) : null

    if (configVal !== null && freeVal !== null && configVal !== freeVal) {
      flag('blocking',
        `config.js ${constant.name}=${configVal} ≠ supabase-free.ts ${constant.name}=${freeVal} — constants drifted, sync them`
      )
    } else if (configVal === null) {
      flag('advisory', `config.js missing ${constant.name} — add and sync with supabase-free.ts`)
    } else {
      console.log(`  ✓ ${constant.name}=${configVal} (synced with supabase-free.ts)`)
    }
  }
} else {
  if (!existsSync(configPath)) flag('blocking', 'tools/load-tests/k6/config.js missing — shared k6 config required')
}

// ── CHECK 4: README.md with run instructions ──────────────────────
const readmePath = join(ROOT, 'tools/load-tests/README.md')
if (!existsSync(readmePath)) {
  flag('advisory', 'tools/load-tests/README.md missing — add run instructions for Governor')
} else {
  const readme = readFileSync(readmePath, 'utf8')
  if (!readme.includes('k6 run')) {
    flag('advisory', 'tools/load-tests/README.md missing k6 run command for Governor')
  } else {
    console.log('  ✓ README.md present with run instructions')
  }
}

// ── CHECK 5: N=30 gate registered as DEFERRED ────────────────────
const boundariesPath = join(ROOT, 'tools/data/boundaries-register.yaml')
if (existsSync(boundariesPath)) {
  const boundaries = readFileSync(boundariesPath, 'utf8')
  if (!boundaries.includes('boundary-003')) {
    flag('advisory',
      'boundary-003 not found in boundaries-register.yaml — register Free→Pro tier-upgrade obligation'
    )
  } else {
    console.log('  ✓ boundary-003 (Free→Pro tier upgrade) registered for N=30 gate deferral')
  }
}

// ── SUMMARY ───────────────────────────────────────────────────────
const summary = `[validate-load-test-harness] blocking=${blocking} advisory=${advisory} scenarios=4`
console.log('\n' + summary)
if (blocking === 0) {
  console.log('  ✓ k6 harness structure complete. Governor runs scenario-a for OPIA.')
  console.log('  → k6 run --env TARGET_URL=https://your-app.vercel.app tools/load-tests/k6/scenario-a-concurrent-burst.js')
}

writeFileSync(LAST_RUN_PATH, JSON.stringify({
  validator: 'validate-load-test-harness',
  timestamp: new Date().toISOString(),
  blocking, advisory, scenarios_checked: 4,
  deferred_items: ['scenario-c full measurement (Pro+)', 'N=30 foundation gate (boundary-003)'],
  findings,
}, null, 2))

process.exit(blocking > 0 ? 1 : 0)
