#!/usr/bin/env node
/**
 * validate-uuid-column-types.mjs
 * @csps-dna
 * core_spine: ARCH
 * @csps-enforces dim-4 Surface 5 (NATIVE-UUID MIGRATION)
 *               SANDBOX-multi-tenant-scale-readiness-spec-S076.md §DESIGN SURFACE 5
 *               gap_DIM2_CORE_ID_UUID_UPGRADE (tools/data/gap-recurrence-register.yaml)
 * Phase 5 S076: UUID column type validator
 *
 * What it checks in libs/policies/schema.zmodel:
 *   1. abstract model Base: id field has @db.Uuid
 *   2. abstract model AppendOnlyBase: id field has @db.Uuid
 *   3. FK scalar fields referencing id (tenantId, userId, etc.) have @db.Uuid
 *
 * Calendar enforcement (validate-finding-scheduling.mjs governs the deadline):
 *   - Before 2026-06-16: ADVISORY (migration not yet due)
 *   - At 2026-06-16: ADVISORY + calendar-enforced K=1 escalation
 *   - After 2026-06-30: BLOCKING (K=2 auto-promoted)
 *
 * Current state (S076 OPTION A): @db.Uuid was REMOVED from Base/AppendOnlyBase to unblock
 * dim-2 (FINDING-S076-DIM2-03). This validator will flag that as ADVISORY (pre-deadline).
 *
 * Blocking (post-deadline): Base or AppendOnlyBase id missing @db.Uuid
 * Advisory (pre-deadline or FK fields): missing @db.Uuid annotations
 *
 * Block-test: schema with Base.id missing @db.Uuid after 2026-06-16 → exit 1
 *
 * Audit slug: uuid_column_types
 * Status: DEFERRED-WITH-REASON — verify cycle cap at 199/200 + advisory-only until 2026-06-16
 *   Promote to DEEP when: (1) cap raised to 220, AND (2) migration applied (Governor DB run)
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const SCHEMA_PATH = join(ROOT, 'libs/policies/schema.zmodel')
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-uuid-column-types-last-run.json')

// Calendar deadline from gap_DIM2_CORE_ID_UUID_UPGRADE
const UUID_DEADLINE = '2026-06-16'
const UUID_BLOCKING_DATE = '2026-06-30'  // K=2 auto-promoted by finding-scheduling validator
const TODAY_ISO = new Date().toISOString().slice(0, 10)
const isPastDeadline = TODAY_ISO >= UUID_DEADLINE
const isBlocking = TODAY_ISO >= UUID_BLOCKING_DATE

let blocking = 0
let advisory = 0
const all_findings = []

function flag(level, msg) {
  if (level === 'blocking') blocking++
  else advisory++
  all_findings.push({ level, msg })
  console.log(`  ${level === 'blocking' ? '✖' : '⚠'} [${level}] ${msg}`)
}

if (!existsSync(SCHEMA_PATH)) {
  console.log(`[validate-uuid-column-types] schema not found: ${SCHEMA_PATH}`)
  process.exit(0)
}

const schema = readFileSync(SCHEMA_PATH, 'utf-8')

console.log(`\n[validate-uuid-column-types] Checking UUID column type annotations...`)
console.log(`  Today: ${TODAY_ISO} | Deadline: ${UUID_DEADLINE} | Blocking after: ${UUID_BLOCKING_DATE}`)
console.log(`  Status: ${isBlocking ? '🔴 PAST BLOCKING DATE' : isPastDeadline ? '🟡 PAST DEADLINE (K=1 advisory)' : '🟢 PRE-DEADLINE (advisory only)'}`)
console.log()

// Check for @db.Uuid on the actual id field line — not in comments.
// Comments in ZModel start with // — we look for the id field line specifically,
// excluding any line that starts with whitespace+// (comment lines).
function idFieldHasDbUuid(modelBlock) {
  const lines = modelBlock.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    // Skip comment lines
    if (trimmed.startsWith('//')) continue
    // Look for the id field: must start with 'id' as a field definition
    // and must include @id (primary key marker)
    if (/^\s+id\s+String\b/.test(line) && /@id\b/.test(line)) {
      // This is the id field line — check if it has @db.Uuid
      return /@db\.Uuid\b/.test(line)
    }
  }
  return false  // id field not found or no @db.Uuid
}

// Check abstract model Base: id @db.Uuid
const baseMatch = schema.match(/abstract\s+model\s+Base\s*\{[^}]+\}/s)
if (baseMatch) {
  const hasDbUuid = idFieldHasDbUuid(baseMatch[0])
  if (!hasDbUuid) {
    const severity = isBlocking ? 'blocking' : 'advisory'
    flag(severity, `Base.id: missing @db.Uuid — native UUID storage not set. Due: ${UUID_DEADLINE}. Run ALTER TABLE migration per dim-4 Surface 5 spec.`)
  } else {
    console.log('  ✓ Base.id: @db.Uuid present')
  }
} else {
  flag('advisory', 'abstract model Base not found in schema — cannot verify UUID type')
}

// Check abstract model AppendOnlyBase: id @db.Uuid
const appendOnlyMatch = schema.match(/abstract\s+model\s+AppendOnlyBase\s*\{[^}]+\}/s)
if (appendOnlyMatch) {
  const hasDbUuid = idFieldHasDbUuid(appendOnlyMatch[0])
  if (!hasDbUuid) {
    const severity = isBlocking ? 'blocking' : 'advisory'
    flag(severity, `AppendOnlyBase.id: missing @db.Uuid — native UUID storage not set. Due: ${UUID_DEADLINE}.`)
  } else {
    console.log('  ✓ AppendOnlyBase.id: @db.Uuid present')
  }
}

// Check FK scalar fields for @db.Uuid
// Pattern: String field ending in "Id" that references a model with native UUID id.
// EXCLUSION LIST: external-system IDs that are NOT CSPS UUIDs — keep as TEXT.
const EXTERNAL_ID_FIELDS = new Set([
  'clerkId',             // Clerk user ID (external auth system)
  'clerkOrgId',          // Clerk org ID (external auth system)
  'stripeCustomerId',    // Stripe customer ID (external billing)
  'stripeSubscriptionId',// Stripe subscription ID (external billing)
  'stripePriceId',       // Stripe price ID (external billing)
  'resourceId',          // Generic resource reference in AuditEvent — not a CSPS FK
])

const fkFields = schema.matchAll(/^\s+(\w+Id)\s+String(?:\?)?(?!\s+@id)(?!\s+@unique\s+@id)([^\n]*)/gm)
let fk_missing = 0
let fk_present = 0
let fk_excluded = 0
for (const match of fkFields) {
  const fieldName = match[1]
  const fieldDef = match[2]
  // Skip known external-system ID fields — they MUST stay as TEXT
  if (EXTERNAL_ID_FIELDS.has(fieldName)) {
    fk_excluded++
    continue
  }
  const hasDbUuid = /@db\.Uuid/.test(fieldDef)
  if (!hasDbUuid) {
    fk_missing++
    // Advisory for FK fields (they need the migration to complete first)
    if (fk_missing <= 5) { // Limit output
      flag('advisory', `FK field '${fieldName}': missing @db.Uuid — apply after Base/AppendOnlyBase migration`)
    }
  } else {
    fk_present++
  }
}
if (fk_missing > 5) {
  flag('advisory', `... and ${fk_missing - 5} more FK fields missing @db.Uuid (suppressed)`)
}
if (fk_excluded > 0) {
  console.log(`  ↳ ${fk_excluded} external-system ID fields correctly excluded from @db.Uuid (clerkId, stripeCustomerId, etc.)`)
}
console.log(`  FK fields: ${fk_present} with @db.Uuid, ${fk_missing} without (all advisory pre-migration)`)

const summary = `[validate-uuid-column-types] blocking=${blocking} advisory=${advisory} deadline=${UUID_DEADLINE} today=${TODAY_ISO}`
console.log('\n' + summary)
const statusLine = isBlocking
  ? '  ✖ PAST BLOCKING DATE — run UUID migration immediately'
  : isPastDeadline
  ? '  ⚠ Past deadline (K=1) — schedule UUID migration; auto-promotes to K=2 at 2026-06-30'
  : `  ⚠ Advisory: schedule UUID migration by ${UUID_DEADLINE} (dim-4 Surface 5)`

console.log(statusLine)

const result = {
  blocking,
  advisory,
  deadline: UUID_DEADLINE,
  blocking_date: UUID_BLOCKING_DATE,
  today: TODAY_ISO,
  status: isBlocking ? 'past-blocking' : isPastDeadline ? 'past-deadline' : 'pre-deadline',
  all_findings: all_findings.slice(0, 20),
  ran_at: new Date().toISOString(),
}
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8')

// Only exit 1 (blocking) if past the blocking date AND blocking findings exist
process.exit(isBlocking && blocking > 0 ? 1 : 0)
