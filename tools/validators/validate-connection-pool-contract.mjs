#!/usr/bin/env node
/**
 * validate-connection-pool-contract.mjs
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces P-ARCH-007 (connection pool discipline) + dim-4 Surface 1
 *               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §DESIGN SURFACE 1
 * @csps-simulation-spine: B2 scale-sim validation surface (core-spine-registry.yaml#simulation)
 * Phase 1 S076: connection-pool contract validator (dim-4 Foundation)
 *
 * What it checks:
 *   Every app's .env.example file:
 *   1. DATABASE_URL uses port 6543 (pooled URL, not direct)
 *   2. DATABASE_URL contains pgbouncer=true
 *   3. DATABASE_URL contains connection_limit=N (N ≥ 1; Q2: override flag required for N > 1)
 *   4. DIRECT_URL is present (for migrations, port 5432 OK there)
 *   5. No app uses port 5432 in DATABASE_URL (direct URL in hot-path = 42P05 risk)
 *
 *   Governor Q-answers applied (dim-4 OPIA S076):
 *   Q2: connection_limit=1 is standard. Override (N>1) allowed only with
 *       CONNECTION_LIMIT_OVERRIDE_REASON comment in the .env.example file.
 *   Q4: 10ms provisional budget (re-baseline after UUID migration per Q7).
 *
 * Blocking: any app DATABASE_URL using port 5432 | missing pgbouncer=true | missing connection_limit
 * Advisory: connection_limit > 1 without override reason | DIRECT_URL missing
 *
 * Block-test: mock DATABASE_URL with port 5432 → exit 1
 *
 * Audit slug: connection_pool_contract
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-connection-pool-contract-last-run.json')

// Scan .env.example files in apps/ and apps/_trials-vaulted/
const APP_DIRS = [
  join(ROOT, 'apps'),
]

// Patterns
const PORT_5432_PATTERN = /:5432\//
const PORT_6543_PATTERN = /:6543\//
const PGBOUNCER_PATTERN = /pgbouncer=true/i
const CONNECTION_LIMIT_PATTERN = /connection_limit=(\d+)/i
const DIRECT_URL_PATTERN = /DIRECT_URL=/
const OVERRIDE_REASON_PATTERN = /CONNECTION_LIMIT_OVERRIDE_REASON/

let blocking = 0
let advisory = 0
let apps_checked = 0
const all_findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  all_findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

function scanEnvFile(envPath, appName) {
  if (!existsSync(envPath)) return false
  const content = readFileSync(envPath, 'utf-8')

  // Extract DATABASE_URL line(s)
  const dbUrlMatch = content.match(/^DATABASE_URL="?([^"\n]+)"?/m)
  if (!dbUrlMatch) {
    flag('advisory', `${appName}/.env.example: DATABASE_URL not found — add it with pgbouncer=true&connection_limit=1`)
    return true
  }

  const dbUrl = dbUrlMatch[1]
  apps_checked++

  // Check 1: No port 5432 in DATABASE_URL
  if (PORT_5432_PATTERN.test(dbUrl)) {
    flag('blocking', `${appName}: DATABASE_URL uses port 5432 (direct URL) — MUST use port 6543 (pooled). Risk: 42P05 under concurrency.`)
  }

  // Check 2: Must use port 6543
  if (!PORT_6543_PATTERN.test(dbUrl)) {
    flag('blocking', `${appName}: DATABASE_URL does not use port 6543 — Supabase pgBouncer pooler required for serverless/multi-app.`)
  }

  // Check 3: Must have pgbouncer=true
  if (!PGBOUNCER_PATTERN.test(dbUrl)) {
    flag('blocking', `${appName}: DATABASE_URL missing pgbouncer=true — required for transaction-mode connection pooling.`)
  }

  // Check 4: Must have connection_limit
  const limitMatch = dbUrl.match(CONNECTION_LIMIT_PATTERN)
  if (!limitMatch) {
    flag('blocking', `${appName}: DATABASE_URL missing connection_limit=N — set connection_limit=1 (default). Override: add CONNECTION_LIMIT_OVERRIDE_REASON comment.`)
  } else {
    const limit = Number(limitMatch[1])
    if (limit > 1) {
      // Q2: override allowed with documented reason
      const hasOverrideReason = OVERRIDE_REASON_PATTERN.test(content)
      if (!hasOverrideReason) {
        flag('advisory', `${appName}: connection_limit=${limit} (>1) without CONNECTION_LIMIT_OVERRIDE_REASON comment. Document the reason for higher limit.`)
      } else {
        console.log(`  ✓ ${appName}: connection_limit=${limit} with override reason documented`)
      }
    } else {
      console.log(`  ✓ ${appName}: connection_limit=${limit} (standard)`)
    }
  }

  // Check 5: DIRECT_URL should be present (advisory only — needed for migrations)
  if (!DIRECT_URL_PATTERN.test(content)) {
    flag('advisory', `${appName}: DIRECT_URL not found in .env.example — needed for 'prisma db push/migrate' (port 5432 is OK there).`)
  }

  if (PORT_6543_PATTERN.test(dbUrl) && PGBOUNCER_PATTERN.test(dbUrl) && limitMatch && Number(limitMatch[1]) === 1) {
    console.log(`  ✓ ${appName}: connection-pool contract compliant (port 6543, pgbouncer=true, connection_limit=1)`)
  }

  return true
}

console.log('\n[validate-connection-pool-contract] Scanning app DATABASE_URL configurations...\n')

for (const appsDir of APP_DIRS) {
  if (!existsSync(appsDir)) continue
  const entries = readdirSync(appsDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const appPath = join(appsDir, entry.name)
    // Check .env.example first, then .env (dev), then .env.local
    const envFiles = ['.env.example', '.env', '.env.local']
    let found = false
    for (const envFile of envFiles) {
      const envPath = join(appPath, envFile)
      if (existsSync(envPath)) {
        found = scanEnvFile(envPath, `${entry.name}/${envFile}`)
        if (found) break
      }
    }
    if (!found) {
      // Check _trials-vaulted subdirs
      const trialsPath = join(appPath)
      if (existsSync(trialsPath) && entry.name === '_trials-vaulted') {
        const trialEntries = readdirSync(trialsPath, { withFileTypes: true })
        for (const trial of trialEntries) {
          if (!trial.isDirectory()) continue
          const trialApp = join(trialsPath, trial.name)
          for (const envFile of envFiles) {
            const envPath = join(trialApp, envFile)
            if (existsSync(envPath)) {
              scanEnvFile(envPath, `_trials-vaulted/${trial.name}/${envFile}`)
              break
            }
          }
        }
      }
    }
  }
}

const summary = `[validate-connection-pool-contract] apps_checked=${apps_checked} blocking=${blocking} advisory=${advisory}`
console.log('\n' + summary)
if (blocking === 0) {
  console.log('  ✓ All checked apps comply with the connection-pool contract')
}

const result = {
  apps_checked,
  blocking,
  advisory,
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

process.exit(blocking > 0 ? 1 : 0)
