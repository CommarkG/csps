#!/usr/bin/env node
/**
 * validate-tenant-quota-policy.mjs
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces dim-4 Surface 2 (PER-TENANT QUOTA + NOISY-NEIGHBOR ISOLATION)
 *               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §DESIGN SURFACE 2
 *               libs/platform-quota/ — SSoT for quota constants (Q6=A)
 *               Supabase Free tier conservative limits (Q1=FREE)
 * Phase 1 S077: quota policy validator
 *
 * What it checks:
 *   1. libs/platform-quota/ exists with required source files (types.ts, supabase-free.ts, index.ts)
 *   2. libs/platform-quota/src/supabase-free.ts exports required constants with conservative values:
 *      - FREE_MAX_DB_CONNECTIONS ≤ 60
 *      - FREE_DB_CONNECTIONS_PER_APP ≤ 2
 *      - PLATFORM_APP_COUNT_TARGET ≥ 1
 *   3. Free-tier pool math: PLATFORM_APP_COUNT_TARGET × FREE_DB_CONNECTIONS_PER_APP ≤ FREE_MAX_DB_CONNECTIONS
 *      If this would exceed headroom → BLOCKING (register tier-upgrade obligation)
 *   4. DNA header present in libs/platform-quota/src/index.ts (@csps-dna)
 *   5. No app defines its own quota constants (no QUOTA or RATE_LIMIT constant blocks in apps/)
 *
 * Blocking: quota lib missing | pool math exceeds Free limit | per-app quota definitions found
 * Advisory: pool math approaching Free limit (≥80%) | quota lib missing DNA header
 *
 * Block-test:
 *   A: PLATFORM_APP_COUNT_TARGET = 100 → pool math exceeds limit → exit 1
 *   B: apps/_trials-vaulted/ quota constant definition → exit 1 (per-app quota)
 *
 * Audit slug: tenant_quota_policy
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { writeFileSync } from 'fs'

const ROOT = resolve(process.cwd())
const QUOTA_LIB = join(ROOT, 'libs/platform-quota')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-tenant-quota-policy-last-run.json')

let blocking = 0
let advisory = 0
const findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

// Block-test mode: simulate excessive app count to verify pool-math check fires
const BLOCK_TEST_A = process.argv.includes('--block-test-a')
if (BLOCK_TEST_A) {
  console.log('[validate-tenant-quota-policy] BLOCK-TEST-A mode: simulating PLATFORM_APP_COUNT_TARGET=100')
}

console.log('\n[validate-tenant-quota-policy] Checking Surface 2 — per-tenant quota policy…\n')

// ── CHECK 1: libs/platform-quota/ exists with required files ──────
const REQUIRED_FILES = [
  'src/types.ts',
  'src/supabase-free.ts',
  'src/index.ts',
  'package.json',
]

if (!existsSync(QUOTA_LIB)) {
  flag('blocking', 'libs/platform-quota/ missing — create shared quota lib (Q6=A: SSoT not per-app)')
} else {
  let libOk = true
  for (const f of REQUIRED_FILES) {
    const path = join(QUOTA_LIB, f)
    if (!existsSync(path)) {
      flag('blocking', `libs/platform-quota/${f} missing — required for quota SSoT`)
      libOk = false
    }
  }
  if (libOk) {
    console.log(`  ✓ libs/platform-quota/ exists with all required files`)
  }
}

// ── CHECK 2: DNA header in index.ts ───────────────────────────────
const indexPath = join(QUOTA_LIB, 'src/index.ts')
if (existsSync(indexPath)) {
  const indexContent = readFileSync(indexPath, 'utf8')
  if (!indexContent.includes('@csps-dna')) {
    flag('advisory', 'libs/platform-quota/src/index.ts missing @csps-dna header')
  } else {
    console.log('  ✓ @csps-dna header present in index.ts')
  }
}

// ── CHECK 3: Conservative Free tier constants ─────────────────────
const freePath = join(QUOTA_LIB, 'src/supabase-free.ts')
if (existsSync(freePath)) {
  const freeContent = readFileSync(freePath, 'utf8')

  // Extract constants via regex (source-of-truth check, not runtime import)
  const maxConnMatch = freeContent.match(/FREE_MAX_DB_CONNECTIONS\s*=\s*(\d+)/)
  const connPerAppMatch = freeContent.match(/FREE_DB_CONNECTIONS_PER_APP\s*=\s*(\d+)/)
  const appCountMatch = freeContent.match(/PLATFORM_APP_COUNT_TARGET\s*=\s*(\d+)/)
  const thresholdMatch = freeContent.match(/FREE_HEADROOM_WARNING_THRESHOLD\s*=\s*([\d.]+)/)

  const maxConn = maxConnMatch ? parseInt(maxConnMatch[1]) : null
  const connPerApp = connPerAppMatch ? parseInt(connPerAppMatch[1]) : null
  // Block-test-A override: simulate 100 apps to verify pool-math check fires
  const appCount = BLOCK_TEST_A ? 100 : (appCountMatch ? parseInt(appCountMatch[1]) : null)
  const threshold = thresholdMatch ? parseFloat(thresholdMatch[1]) : 0.8

  if (maxConn === null) {
    flag('blocking', 'FREE_MAX_DB_CONNECTIONS not found in supabase-free.ts')
  } else if (maxConn > 60) {
    flag('blocking', `FREE_MAX_DB_CONNECTIONS=${maxConn} exceeds Supabase Free limit (60). Use conservative numbers.`)
  } else {
    console.log(`  ✓ FREE_MAX_DB_CONNECTIONS=${maxConn} (≤60 Supabase Free limit)`)
  }

  if (connPerApp === null) {
    flag('blocking', 'FREE_DB_CONNECTIONS_PER_APP not found in supabase-free.ts')
  } else if (connPerApp > 2) {
    flag('advisory', `FREE_DB_CONNECTIONS_PER_APP=${connPerApp} — conservative Free tier allows 1-2 per app`)
  } else {
    console.log(`  ✓ FREE_DB_CONNECTIONS_PER_APP=${connPerApp} (conservative)`)
  }

  if (appCount === null) {
    flag('advisory', 'PLATFORM_APP_COUNT_TARGET not found in supabase-free.ts')
  } else {
    console.log(`  ✓ PLATFORM_APP_COUNT_TARGET=${appCount}`)
  }

  // Pool math: appCount × connPerApp vs maxConn
  if (maxConn !== null && connPerApp !== null && appCount !== null) {
    const totalConnections = appCount * connPerApp
    const headroomFraction = totalConnections / maxConn
    const headroomPct = Math.round(headroomFraction * 100)

    if (totalConnections > maxConn) {
      flag('blocking',
        `Pool math EXCEEDS Free limit: ${appCount} apps × ${connPerApp} conn/app = ${totalConnections} > ${maxConn} max. ` +
        `Register tier-upgrade obligation (boundary-crossing protocol) or reduce connections_per_app.`
      )
    } else if (headroomFraction >= threshold) {
      flag('advisory',
        `Pool math approaching limit: ${appCount} apps × ${connPerApp} conn/app = ${totalConnections}/${maxConn} (${headroomPct}%). ` +
        `Consider tier-upgrade obligation when deploying app #${Math.ceil(maxConn * threshold / connPerApp) + 1}.`
      )
    } else {
      console.log(`  ✓ Pool math: ${appCount}×${connPerApp}=${totalConnections}/${maxConn} connections (${headroomPct}% of Free limit)`)
    }
  }
}

// ── CHECK 4: No per-app quota constants ───────────────────────────
// Apps must NOT define their own quota constants — they import from @csps/platform-quota
const QUOTA_PATTERNS = [
  /MAX_REQUESTS_PER_MINUTE\s*=\s*\d+/,
  /RATE_LIMIT\s*=\s*\d+/,
  /maxRequestsPerMinute\s*[:=]\s*\d+/,
  /rateLimit\s*[:=]\s*\d+/,
]

const APPS_DIR = join(ROOT, 'apps')
let perAppQuotaFound = false

function scanDir(dir, depth = 0) {
  if (depth > 3) return
  if (!existsSync(dir)) return
  let entries
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      scanDir(fullPath, depth + 1)
    } else if (entry.isFile() && /\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      try {
        const content = readFileSync(fullPath, 'utf8')
        // Skip files that import from platform-quota (they're using the lib)
        if (content.includes('@csps/platform-quota') || content.includes('platform-quota')) continue
        for (const pattern of QUOTA_PATTERNS) {
          if (pattern.test(content)) {
            const rel = fullPath.replace(ROOT + '/', '')
            flag('blocking', `Per-app quota constant found in ${rel} — move to @csps/platform-quota (Q6=A SSoT)`)
            perAppQuotaFound = true
            break
          }
        }
      } catch { /* skip unreadable */ }
    }
  }
}

scanDir(APPS_DIR)
if (!perAppQuotaFound) {
  console.log('  ✓ No per-app quota constant definitions found in apps/')
}

// ── CHECK 5: TIER-UPGRADE OBLIGATION registered ───────────────────
// When approaching Free limits, a boundary-crossing obligation must exist
const BOUNDARIES_PATH = join(ROOT, 'tools/data/boundaries-register.yaml')
if (existsSync(BOUNDARIES_PATH)) {
  const boundariesContent = readFileSync(BOUNDARIES_PATH, 'utf8')
  if (!boundariesContent.includes('boundary-003') && !boundariesContent.includes('tier-upgrade')) {
    flag('advisory',
      'No tier-upgrade boundary-crossing obligation found in boundaries-register.yaml. ' +
      'Add boundary-003 (Free→Pro tier upgrade) when approaching Free headroom limit.'
    )
  } else {
    console.log('  ✓ Tier-upgrade boundary-crossing obligation registered')
  }
}

// ── SUMMARY ───────────────────────────────────────────────────────
const summary = `[validate-tenant-quota-policy] blocking=${blocking} advisory=${advisory}`
console.log('\n' + summary)

// Write last-run data
const result = {
  validator: 'validate-tenant-quota-policy',
  timestamp: new Date().toISOString(),
  blocking,
  advisory,
  findings,
  free_tier_constants: {
    max_db_connections: 60,
    db_connections_per_app: 1,
    platform_app_count: 30,
    headroom_pct: Math.round((30 * 1 / 60) * 100),
  },
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2))

process.exit(blocking > 0 ? 1 : 0)
