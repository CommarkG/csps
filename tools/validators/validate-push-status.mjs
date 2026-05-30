#!/usr/bin/env node
/**
 * validate-push-status.mjs
 * @csps-dna
 * core_spine: OPER
 * @csps-enforces GOVERNANCE-WORK-NOT-PUSHED-TO-ORIGIN
 * @behavioral-test-status: advisory-exempt — push-status check depends on live git remote state;
 *   not mockable in unit test without live network. Validated via live manual run each session.
 *
 * Surfaces unpushed local commits in every verify run.
 * Closes governance gap discovered S072 Turn 9: 16 commits built locally without pushing.
 *
 * Advisory only — exits 0 always. Never blocks.
 * Thresholds are samples — tunable per P-META-028 cornerstone.
 *
 * Prevention class: GOVERNANCE-WORK-NOT-PUSHED-TO-ORIGIN
 * Session where gap was caught: S072 (Governor question surfaced 16 local-only commits)
 * Audit slug: push_status
 */

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-push-status-last-run.json');

// Advisory thresholds — samples, tunable per P-META-028
const ADVISORY_THRESHOLD = 5;   // (sample — tunable): warn when ahead by this many commits
const STRONG_WARN_THRESHOLD = 10; // (sample — tunable): stronger warn above this count

function main() {
  let unpushed_count = 0;
  let remote_check_ok = false;
  let advisory = 0;
  const blocking = 0; // Always 0 — advisory only

  try {
    // Verify origin/main exists before counting
    execSync('git rev-parse --verify origin/main', { cwd: ROOT, stdio: 'pipe' });

    const result = execSync('git rev-list --count origin/main..HEAD', {
      cwd: ROOT, stdio: 'pipe',
    }).toString().trim();

    unpushed_count = parseInt(result, 10) || 0;
    remote_check_ok = true;

  } catch {
    // Can't reach origin or no remote — skip gracefully
    console.log('[validate-push-status] origin/main unreachable — skipping push check (no network or no remote)');
    console.log(`[validate-push-status] unpushed_count=0 advisory=0 blocking=0`);
    process.exit(0);
  }

  if (unpushed_count === 0) {
    console.log('[validate-push-status] ✓ all commits pushed to origin/main');
  } else if (unpushed_count >= STRONG_WARN_THRESHOLD) {
    advisory++;
    console.log(`[validate-push-status] ⚠ STRONG-WARN: ${unpushed_count} commits ahead of origin/main (threshold=${STRONG_WARN_THRESHOLD} — tunable). PUSH NOW.`);
    console.log(`[validate-push-status]   Run: git push origin main`);
  } else if (unpushed_count >= ADVISORY_THRESHOLD) {
    advisory++;
    console.log(`[validate-push-status] ⚠ ADVISORY: ${unpushed_count} commits ahead of origin/main (threshold=${ADVISORY_THRESHOLD} — tunable)`);
    console.log(`[validate-push-status]   Consider: git push origin main before session close`);
  } else {
    // Below advisory threshold — informational only
    console.log(`[validate-push-status] ℹ ${unpushed_count} commit(s) ahead of origin/main (below advisory threshold=${ADVISORY_THRESHOLD} — tunable)`);
  }

  console.log(`[validate-push-status] unpushed_count=${unpushed_count} advisory=${advisory} blocking=${blocking}`);

  try {
    writeFileSync(LAST_RUN_PATH, JSON.stringify({
      run_at: new Date().toISOString(),
      unpushed_count,
      remote_check_ok,
      advisory,
      blocking,
      advisory_threshold: ADVISORY_THRESHOLD,
      strong_warn_threshold: STRONG_WARN_THRESHOLD,
    }, null, 2) + '\n');
  } catch {
    // Non-fatal — last-run write failure doesn't affect result
  }

  // Advisory only — always exits 0
  process.exit(0);
}

main();
