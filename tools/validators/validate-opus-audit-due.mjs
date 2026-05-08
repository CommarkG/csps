#!/usr/bin/env node
/**
 * validate-opus-audit-due.mjs — Opus Audit Trigger Gate
 *
 * ROOT CAUSE TARGETED (S019 Part3 opus-lessons — Opus Trigger Classes):
 *   The S019 Opus review found 15 gaps that accumulated over 19 sessions.
 *   Without a mechanical trigger, Opus reviews happen only when the Governor
 *   thinks to request one. This validator makes the trigger criteria mechanical.
 *
 * Coverage Levels:
 *   ✓ Level 1: Session Interval Gate (SIG) — triggers at sessions_since_opus_review >= 10
 *   ✓ Level 2: opus_audit_due flag — manual trigger set by any Trigger Class
 *   ✗ Level 3: Big Plan Gate (BPG) — detects when plans affect 3+ spines → VLT-S019-BPG
 *   ✗ Level 4: Phase Exit Gate (PEG) — detects foundation slice changes at phase exit → VLT-S019-PEG
 *   ✗ Level 5: Post-Implementation Audit (PIA) — new app deployment trigger → VLT-S019-PIA
 *   ✗ Level 6: K=2 Critical Pattern (KCP) — pattern registry integration → VLT-S019-KCP
 *
 * When this validator exits 0, it proves: no Opus audit is overdue by SIG criteria
 * When this validator exits 0, it does NOT prove: no BPG/PEG/PIA/KCP triggers are active
 *
 * Exit codes:
 *   0 = no Opus audit due (or advisory only)
 *   1 = BLOCKING: Opus audit overdue (sessions_since >= HARD_BLOCK) or opus_audit_due=true
 *
 * Thresholds:
 *   ADVISORY: sessions_since_opus_review >= 8 (2-session warning before due)
 *   BLOCKING: sessions_since_opus_review >= 10 OR opus_audit_due=true
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const SESSION_STATE_PATH = join(ROOT, 'tools/session-state.json');

const ADVISORY_THRESHOLD = 8;  // warn 2 sessions before due
const BLOCK_THRESHOLD    = 10; // block at 10 sessions since last review

async function main() {
  if (!existsSync(SESSION_STATE_PATH)) {
    console.log('[validate-opus-audit-due] session-state.json not found — skipping');
    process.exit(0);
  }

  let sessionState;
  try {
    sessionState = JSON.parse(readFileSync(SESSION_STATE_PATH, 'utf8'));
  } catch (err) {
    console.error('[validate-opus-audit-due] Failed to parse session-state.json:', err.message);
    process.exit(1);
  }

  const opusAudit = sessionState.opus_audit;

  if (!opusAudit) {
    console.log('[validate-opus-audit-due] No opus_audit section in session-state.json — adding field is required');
    console.log('Add to session-state.json: "opus_audit": { "sessions_since_opus_review": 0, "opus_audit_due": false, ... }');
    // Advisory only — don't block on missing field, just surface
    console.log('\n[validate-opus-audit-due] sessions_since=unknown opus_audit_due=unknown status=ADVISORY');
    process.exit(0);
  }

  const sessionsSince = opusAudit.sessions_since_opus_review ?? 0;
  const auditDue      = opusAudit.opus_audit_due === true;
  const trigger       = opusAudit.opus_audit_trigger ?? null;
  const lastReview    = opusAudit.last_opus_review_session ?? 'unknown';
  const nextDue       = opusAudit.next_opus_review_due ?? 'unknown';
  const enfRate       = opusAudit.enforcement_rate_at_last_review ?? 'unknown';

  console.log(`\nOpus Audit Status:`);
  console.log(`  Last review: ${lastReview}`);
  console.log(`  Sessions since review: ${sessionsSince}`);
  console.log(`  Next due: ${nextDue} (${BLOCK_THRESHOLD - sessionsSince} sessions remaining)`);
  console.log(`  Enforcement rate at last review: ${enfRate}%`);
  console.log(`  Manual override (opus_audit_due): ${auditDue}${trigger ? ` [trigger: ${trigger}]` : ''}`);

  // Check manual override first
  if (auditDue) {
    console.error(`\n⛔ OPUS AUDIT DUE — Manual trigger active`);
    console.error(`   Trigger: ${trigger || 'Governor-set'}`);
    console.error(`   Resolution: Conduct Opus review using tools/templates/opus-consultation-brief.template.md`);
    console.error(`   After review: set opus_audit_due=false + update last_opus_review_session in session-state.json`);
    console.error(`\n[validate-opus-audit-due] sessions_since=${sessionsSince} opus_audit_due=true status=BLOCKING`);
    process.exit(1);
  }

  // Check session interval gate (SIG)
  if (sessionsSince >= BLOCK_THRESHOLD) {
    console.error(`\n⛔ OPUS AUDIT OVERDUE — ${sessionsSince} sessions since last review (threshold: ${BLOCK_THRESHOLD})`);
    console.error(`   The platform has accumulated ${sessionsSince} sessions of potential drift without architectural review.`);
    console.error(`   S019 Opus review found 15 gaps after 19 sessions. Regular reviews prevent accumulation.`);
    console.error(`   Resolution: Conduct Opus review. Template: tools/templates/opus-consultation-brief.template.md`);
    console.error(`   After review: update opus_audit section in tools/session-state.json`);
    console.error(`\n[validate-opus-audit-due] sessions_since=${sessionsSince} opus_audit_due=${auditDue} status=BLOCKING`);
    process.exit(1);
  }

  if (sessionsSince >= ADVISORY_THRESHOLD) {
    console.log(`\n⚠ OPUS AUDIT ADVISORY — ${sessionsSince} sessions since last review (due at ${BLOCK_THRESHOLD})`);
    console.log(`   ${BLOCK_THRESHOLD - sessionsSince} sessions remaining before mandatory Opus review.`);
    console.log(`   Consider scheduling now: tools/templates/opus-consultation-brief.template.md`);
  } else {
    console.log(`\n✓ Opus audit not due (${sessionsSince}/${BLOCK_THRESHOLD} sessions since last review)`);
  }

  console.log(`\n[validate-opus-audit-due] sessions_since=${sessionsSince} opus_audit_due=${auditDue} status=${sessionsSince >= ADVISORY_THRESHOLD ? 'ADVISORY' : 'OK'}`);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-opus-audit-due] fatal:', err);
  process.exit(1);
});
