#!/usr/bin/env node
/**
 * validate-rls-perf-budget.mjs
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces dim-4 Surface 3 (RLS PERF BUDGET)
 *               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §DESIGN SURFACE 3
 * Phase 2 S076: RLS performance budget validator
 *
 * What it checks in libs/policies/schema.zmodel:
 *   1. Every model with @@allow referencing auth().tenantId == tenantId
 *      MUST have @@index starting with tenantId (standalone or compound first-col)
 *      Compound index @@index([tenantId, x]) IS acceptable — covers tenantId lookups.
 *   2. RLS policy patterns must NOT contain subqueries or join-based conditions
 *      (O(N) complexity → BLOCKED)
 *   3. Allowed patterns: direct auth().tenantId == tenantId equality checks
 *
 * Q4 applied (Opus OPIA dim-4 S076):
 *   Per-query RLS latency budget: 10ms PROVISIONAL (ratchet → 5ms post-UUID migration)
 *   Static validator cannot measure runtime latency — this enforces the structural
 *   preconditions (index discipline) that make the budget achievable.
 *
 * Blocking: model with tenant-scoped RLS and no tenantId index
 * Advisory: subquery/join-like pattern in RLS policy (O(N) risk)
 *
 * Block-test: add model with @@allow auth().tenantId == tenantId + no @@index([tenantId]) → exit 1
 *
 * Audit slug: rls_perf_budget
 * Status: DEFERRED-WITH-REASON — verify cycle cap at 199/200 (see validate-platform-capacity)
 *   Promote to DEEP when: Governor authorization + cycles drop below target 134 (hard_limit=200, soft_limit=140)
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const SCHEMA_PATH = join(ROOT, 'libs/policies/schema.zmodel')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-rls-perf-budget-last-run.json')

let blocking = 0
let advisory = 0
let models_checked = 0
let models_with_rls = 0
const all_findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  all_findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

if (!existsSync(SCHEMA_PATH)) {
  console.log(`[validate-rls-perf-budget] schema not found: ${SCHEMA_PATH}`)
  process.exit(0)
}

const schema = readFileSync(SCHEMA_PATH, 'utf-8')

// Split schema into model blocks
const modelBlocks = []
const modelStartRe = /^model\s+(\w+)\s+extends\s+\w+\s*\{/gm
let m
while ((m = modelStartRe.exec(schema)) !== null) {
  const modelName = m[1]
  const blockStart = m.index
  // Find the closing brace (count depth)
  let depth = 0
  let i = blockStart
  while (i < schema.length) {
    if (schema[i] === '{') depth++
    else if (schema[i] === '}') {
      depth--
      if (depth === 0) {
        modelBlocks.push({ name: modelName, text: schema.slice(blockStart, i + 1) })
        break
      }
    }
    i++
  }
}

console.log(`\n[validate-rls-perf-budget] Checking RLS index discipline (Q4: 10ms provisional budget)...\n`)
console.log(`  Scanning ${modelBlocks.length} model blocks in schema.zmodel\n`)

for (const { name, text } of modelBlocks) {
  models_checked++

  // Check if this model has tenant-scoped RLS (auth().tenantId == tenantId pattern)
  const hasTenantRLS = /@@allow\([^)]*auth\(\)\.tenantId\s*==\s*tenantId[^)]*\)/.test(text)
  if (!hasTenantRLS) continue

  models_with_rls++

  // Check for tenantId index (standalone or compound first-col)
  // @@index([tenantId]) OR @@index([tenantId, x]) — both acceptable
  const hasTenantIndex = /@@index\(\[tenantId[,\]]/.test(text) ||
                         /@@index\(\[tenantId\]\)/.test(text)

  if (!hasTenantIndex) {
    flag('blocking', `${name}: has auth().tenantId == tenantId RLS but no @@index([tenantId, ...]) — RLS scans will be O(N). Add @@index([tenantId]) or @@index([tenantId, <field>]).`)
  } else {
    // Extract the first tenantId index found
    const indexMatch = text.match(/@@index\(\[tenantId[^\]]*\]\)/)
    console.log(`  ✓ ${name}: tenant-scoped RLS + ${indexMatch ? indexMatch[0] : '@@index([tenantId])'} (RLS perf budget: 10ms provisional)`)
  }

  // Check for O(N) RLS patterns: subqueries or joins
  // Look for `IN (SELECT`, `EXISTS (SELECT`, JOIN-like patterns in @@allow
  const allowLines = text.match(/@@allow\([^)]+\)/g) || []
  for (const line of allowLines) {
    const hasSubquery = /\bIN\s*\(SELECT|\bEXISTS\s*\(SELECT|\bJOIN\b/i.test(line)
    if (hasSubquery) {
      flag('advisory', `${name}: RLS policy may contain subquery/join (O(N) complexity): ${line.slice(0, 80)}`)
    }
  }

  // Check for generic-read-all (auth().tenantId != null) — this is OK but not tenant-specific
  const hasGenericRead = /@@allow\([^)]*auth\(\)\.tenantId\s*!=\s*null[^)]*\)/.test(text)
  if (hasGenericRead && !hasTenantRLS) {
    // Generic read is OK, no index requirement for it
  }
}

const summary = `[validate-rls-perf-budget] models_checked=${models_checked} models_with_tenant_rls=${models_with_rls} blocking=${blocking} advisory=${advisory}`
console.log('\n' + summary)
console.log(`  Budget: 10ms provisional per-query RLS overhead (Q4) — ratchets to 5ms post-UUID migration (Q7/Surface 5)`)
if (blocking === 0 && models_with_rls > 0) {
  console.log(`  ✓ All ${models_with_rls} tenant-scoped RLS models have tenantId indexes`)
}

const result = {
  models_checked,
  models_with_rls,
  blocking,
  advisory,
  rls_budget_ms: 10, // provisional; ratchets to 5ms post-UUID
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

process.exit(blocking > 0 ? 1 : 0)
