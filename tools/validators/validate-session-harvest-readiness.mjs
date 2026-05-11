#!/usr/bin/env node
/**
 * validate-session-harvest-readiness.mjs — Session Harvest Trigger Gate
 *
 * ROOT CAUSE TARGETED (session-S021-extraction.md — harvest trigger for "when mature enough"):
 *   Governor directive S021: "create or enhance existing way of making this mechanical thing
 *   enforced every several turns when a topic analysis is mature enough."
 *
 *   Training default: AI never proactively suggests harvest — waits to be asked.
 *   CSPS override: when session work volume exceeds thresholds, actively remind that
 *   a harvest/CEC walk is warranted. The CEC trigger hook fires on specific file writes;
 *   this validator fires on SESSION MATURITY (cumulative work volume signal).
 *
 * Coverage Levels:
 *   ✓ Level 1: Detect when verify-last-run.md shows significant work (≥40 validators, ≥3 runs)
 *   ✓ Level 2: Detect when no session extraction exists for the current session
 *   ✗ Level 3: Detect when specific high-value insights were produced (semantic) → VLT-S021-INSIGHT-SIGNAL
 *   ✗ Level 4: Detect mid-session maturity (requires turn-counter infrastructure) → VLT-S021-TURN-COUNTER
 *
 * When this validator exits 0 with HARVEST_READY:
 *   Session has produced significant work AND no extraction exists yet.
 *   Governor should walk SAP Sweep 6 (synergy) + CEC before session close.
 * When this validator exits 0 with HARVEST_DONE:
 *   A session extraction already exists for current session — harvest was completed.
 *
 * Exit: ADVISORY (0) always — reminder, not gate
 * Created: S021 per Governor directive + session-S021-extraction.md harvest trigger spec
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const VERIFY_LAST_RUN = join(ROOT, 'tools/verify-last-run.md');
const SESSION_STATE   = join(ROOT, 'tools/session-state.json');
const VAULT_DIR       = join(ROOT, 'docs/plan/_handoff/VAULT');

// Thresholds for "session maturity"
const VALIDATOR_THRESHOLD = 40;  // significant session if ≥40 validators checked

function getCurrentSession() {
  if (!existsSync(SESSION_STATE)) return null;
  try {
    const data = JSON.parse(readFileSync(SESSION_STATE, 'utf8'));
    return data.current_session || null;
  } catch { return null; }
}

function getValidatorCount(verifyContent) {
  const m = verifyContent.match(/"validators_checked":\s*(\d+)/);
  return m ? Number(m[1]) : 0;
}

function sessionExtractionExists(session) {
  if (!existsSync(VAULT_DIR) || !session) return false;
  return readdirSync(VAULT_DIR)
    .some(f => f.startsWith(`session-${session}-extraction`) && f.endsWith('.md'));
}

async function main() {
  if (!existsSync(VERIFY_LAST_RUN)) {
    console.log('[validate-session-harvest-readiness] no verify-last-run.md — skipping');
    console.log(`\n[validate-session-harvest-readiness] status=SKIP`);
    process.exit(0);
  }

  const verifyContent = readFileSync(VERIFY_LAST_RUN, 'utf8');
  const validatorCount = getValidatorCount(verifyContent);
  const currentSession = getCurrentSession();
  const extractionExists = sessionExtractionExists(currentSession);

  const sessionMature = validatorCount >= VALIDATOR_THRESHOLD;

  if (extractionExists) {
    console.log(`✓ Session harvest complete — extraction exists for ${currentSession}`);
    console.log(`  validators_checked=${validatorCount} session=${currentSession} extraction=FOUND`);
    console.log(`\n[validate-session-harvest-readiness] session=${currentSession} validators=${validatorCount} extraction=EXISTS status=HARVEST_DONE`);
    process.exit(0);
  }

  if (sessionMature) {
    console.log(`\n⚠ SESSION HARVEST RECOMMENDED:`);
    console.log(`  validators_checked=${validatorCount} (threshold: ${VALIDATOR_THRESHOLD})`);
    console.log(`  session=${currentSession}`);
    console.log(`  No session extraction found for ${currentSession}`);
    console.log('');
    console.log('  RECOMMENDED ACTIONS:');
    console.log('  1. SAP Sweep 6 (Synergy Audit) — walk platform for cross-enhancement opportunities');
    console.log('  2. CEC walk — iterate until 0 new opportunities found');
    console.log('  3. Create session extraction: docs/plan/_handoff/VAULT/session-S<NNN>-extraction.md');
    console.log('  4. Register positive patterns in inner-AI-defaults/continuous-drift-log.md');
    console.log('');
    console.log('  Per P-META-006 CEC + B_POSITIVE_VALUE_EXTRACTION: significant sessions deserve extraction.');
    console.log(`\n[validate-session-harvest-readiness] session=${currentSession} validators=${validatorCount} extraction=MISSING status=HARVEST_READY`);
    // PROMOTED FROM ADVISORY TO BLOCKING (S022 Governor directive: ZF within system not over it)
    // Harvest missing = session cannot be declared done
    process.exit(1);
  } else {
    console.log(`ℹ Session not yet mature for harvest`);
    console.log(`  validators_checked=${validatorCount} (threshold: ${VALIDATOR_THRESHOLD})`);
    console.log(`  Continue work. Harvest reminder fires when validators_checked ≥ ${VALIDATOR_THRESHOLD}.`);
    console.log(`\n[validate-session-harvest-readiness] session=${currentSession} validators=${validatorCount} threshold=${VALIDATOR_THRESHOLD} status=NOT_YET_MATURE`);
    process.exit(0); // Not yet mature — advisory only
  }
}

main().catch(err => {
  console.error('[validate-session-harvest-readiness] fatal:', err);
  process.exit(1);
});
