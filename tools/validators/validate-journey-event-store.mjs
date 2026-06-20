#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-journey-event-store
 * @csps-name validate-journey-event-store
 * @csps-description B3.3 SEED-8 event store wiring validator.
 *   Opus R3 immutability audit result (JOURNEY-SEEDS-S084.md SEED-8 F10):
 *     - audit.events HAS active no_direct_write RLS policy (append-only by policy)
 *     - public."AuditEvent" immutability trigger is COMMENTED OUT (not hardened)
 *   Decision: REUSE audit.events as journey event store (entity_type=journey_event).
 *   This validator proves the decision is structurally wired:
 *   1. audit.events no_direct_write RLS is ACTIVE in audit-triggers.sql.
 *   2. enforce_audit_event_immutability trigger is documented as commented out.
 *   3. SEED-8 decision (reuse audit.events) is recorded in JOURNEY-SEEDS-S084.md.
 *   BLOCKING: no_direct_write RLS missing (event store has no immutability).
 *   ADVISORY: AuditEvent trigger still commented out (harden in B4/B5 if migrating).
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces SEED-8 P-ARCH-008 PROTO-S084-B3
 * @csps-prevention-class JOURNEY-EVENT-STORE-NOT-IMMUTABLE
 *
 * load_mode: on-demand
 * justification: structural SQL/config check, not per-turn
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const TRIGGERS_PATH = resolve(ROOT, 'libs/policies/audit-triggers.sql');
const SEEDS_PATH = resolve(ROOT, 'docs/plan/pillar-0-governance/JOURNEY-SEEDS-S084.md');

let blocking = 0;
let advisory = 0;
const findings = [];

// ── Check 1: audit-triggers.sql exists ───────────────────────────────────────
if (!existsSync(TRIGGERS_PATH)) {
  console.log('[validate-journey-event-store] BLOCKING: libs/policies/audit-triggers.sql not found');
  console.log('  checked=0 blocking=1 advisory=0');
  process.exit(1);
}

const sqlText = readFileSync(TRIGGERS_PATH, 'utf8');

// ── Check 2: no_direct_write RLS policy active on audit.events ───────────────
// This is the core immutability guarantee for the SEED-8 reuse decision.
const hasNoDirectWrite = sqlText.includes('no_direct_write') && sqlText.includes('audit.events');
if (!hasNoDirectWrite) {
  findings.push('BLOCKING: no_direct_write RLS policy not found for audit.events in audit-triggers.sql');
  findings.push('  The SEED-8 reuse decision requires this policy to be active (append-only by RLS).');
  findings.push('  Fix: verify libs/policies/audit-triggers.sql and re-run.');
  blocking = blocking + 1;
}

// ── Check 3: RLS is ENABLED on audit.events ───────────────────────────────────
const hasRlsEnabled = sqlText.includes('ALTER TABLE audit.events ENABLE ROW LEVEL SECURITY');
if (!hasRlsEnabled) {
  findings.push('BLOCKING: ALTER TABLE audit.events ENABLE ROW LEVEL SECURITY not found');
  findings.push('  RLS must be enabled on audit.events for no_direct_write policy to be enforced.');
  blocking = blocking + 1;
}

// ── Check 4: audit.events CREATE TABLE present (table exists in schema) ───────
const hasAuditEventsTable = sqlText.includes('CREATE TABLE') && sqlText.includes('audit.events');
if (!hasAuditEventsTable) {
  findings.push('ADVISORY: audit.events CREATE TABLE not found in audit-triggers.sql');
  findings.push('  May be in a separate schema file. Verify audit.events table is deployed.');
  advisory = advisory + 1;
}

// ── Check 5: AuditEvent immutability trigger is commented out ─────────────────
// Opus F10 audit result: trigger is commented out = convention-only, not storage-hardened.
const hasTriggerCommentedOut = sqlText.includes('enforce_audit_event_immutability') &&
  (sqlText.includes('-- CREATE OR REPLACE FUNCTION') ||
   sqlText.includes('-- DROP TRIGGER') ||
   sqlText.includes('--   BEFORE UPDATE OR DELETE'));

if (hasTriggerCommentedOut) {
  findings.push('ADVISORY: enforce_audit_event_immutability trigger on public."AuditEvent" is commented out');
  findings.push('  public."AuditEvent" is append-only by CONVENTION only (Prisma exposes Update/Delete).');
  findings.push('  SEED-8 decision: use audit.events (RLS-protected) for journey events instead.');
  findings.push('  Future: uncomment + deploy the trigger in B4/B5 to harden public."AuditEvent".');
  advisory = advisory + 1;
}

// ── Check 6: SEED-8 decision documented in JOURNEY-SEEDS-S084.md ─────────────
if (existsSync(SEEDS_PATH)) {
  const seedsText = readFileSync(SEEDS_PATH, 'utf8');
  const hasSeed8 = seedsText.includes('## SEED-8') || seedsText.includes('SEED-8');
  const hasReuseDecision = seedsText.includes('audit.events') && seedsText.includes('REUSE');
  if (!hasSeed8) {
    findings.push('ADVISORY: SEED-8 section not found in JOURNEY-SEEDS-S084.md');
    advisory = advisory + 1;
  } else if (!hasReuseDecision) {
    findings.push('ADVISORY: REUSE decision for audit.events not explicitly documented in SEED-8');
    advisory = advisory + 1;
  }
}

// ── Output ────────────────────────────────────────────────────────────────────
const status = blocking > 0 ? 'FAIL' : 'PASS';
const no_direct_write_active = hasNoDirectWrite && hasRlsEnabled;

console.log(`[validate-journey-event-store] ${status}`);
console.log(`  no_direct_write_rls_active=${no_direct_write_active} blocking=${blocking} advisory=${advisory}`);
console.log(`  event_store_decision=audit.events (entity_type=journey_event)`);

if (findings.length > 0) {
  console.log('\n[validate-journey-event-store] findings:');
  for (const f of findings) console.log(`  - ${f}`);
}

if (blocking === 0) {
  console.log('\n[validate-journey-event-store] SEED-8 decision wired:');
  console.log('  Journey events -> audit.events (no_direct_write RLS = append-only by policy)');
  console.log('  entity_type field = journey_event on AuditEvent-compatible rows');
  console.log('  Rationale: audit.events RLS-protected; public."AuditEvent" trigger uncommented in B4/B5');
}

process.exit(blocking > 0 ? 1 : 0);