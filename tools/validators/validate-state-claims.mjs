#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-state-claims
 * @csps-name validate-state-claims
 * @csps-description T2 for B_VALIDATE_BEFORE_ASSUME. Scans tools/council/sonnet-turn.md
 *   for council entries (OPUS-* or FROM SONNET) containing numeric state claims
 *   (validators=N, exit_code=N, blocking=N, advisory=N, commit sha) without
 *   associated verification evidence text.
 *   ADVISORY ONLY — outputs state_claims_without_evidence count.
 *   Upgrade to BLOCKING when evidence-citation rate reaches 80%.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_VALIDATE_BEFORE_ASSUME P-META-006
 * context_question: "Are numeric state claims in council files backed by this-session tool output?"
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const SCAN_FILES = [
  resolve(ROOT, 'tools/council/sonnet-turn.md'),
];

const STATE_CLAIM_PATTERNS = [
  /validators=\d+/i,
  /exit_code=\d/i,
  /blocking=\d+/i,
  /advisory=\d+/i,
  /K=\d+/i,
  /commit:\s*[a-f0-9]{7,40}/i,
  /commit\s+[a-f0-9]{7,40}/i,
];

const EVIDENCE_PATTERNS = [
  /confirmed/i,
  /per Sonnet report/i,
  /from this-session/i,
  /node tools\//i,
  /git log/i,
  /git rev-parse/i,
  /pnpm verify/i,
  /this-session run/i,
  /verify-last-run/i,
];

let totalClaims = 0;
let claimsWithoutEvidence = 0;
let advisory = 0;

for (const filePath of SCAN_FILES) {
  if (!existsSync(filePath)) continue;
  const content = readFileSync(filePath, 'utf-8');

  // Split into council entry blocks (each starts with "FROM SONNET" or "# OPUS-")
  const blocks = content.split(/(?=FROM SONNET|# OPUS-\d+)/g).filter(b => b.trim());

  for (const block of blocks) {
    const hasStateClaim = STATE_CLAIM_PATTERNS.some(p => p.test(block));
    if (!hasStateClaim) continue;

    totalClaims++;
    const hasEvidence = EVIDENCE_PATTERNS.some(p => p.test(block));
    if (!hasEvidence) {
      claimsWithoutEvidence++;
      advisory++;
      // Find the specific claims for reporting
      const found = STATE_CLAIM_PATTERNS
        .map(p => { const m = block.match(p); return m ? m[0] : null; })
        .filter(Boolean)
        .slice(0, 2)
        .join(', ');
      console.warn(`[validate-state-claims] ADVISORY: Block contains "${found}" without verification evidence.`);
      console.warn(`  Rule: State claims must cite THIS-SESSION tool output (B_VALIDATE_BEFORE_ASSUME).`);
    }
  }
}

console.log(`[validate-state-claims] state_claims_checked=${totalClaims} claims_without_evidence=${claimsWithoutEvidence} advisory=${advisory}`);
console.log(`[validate-state-claims] (Advisory only — not blocking. Target: 80% evidence-citation rate.)`);

// Advisory only — always exit 0
process.exit(0);
