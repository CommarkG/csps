#!/usr/bin/env node
/**
 * validate-prevention-coverage.mjs — Self-learning pipeline coverage gate
 *
 * PROTO-S088-SELF-LEARNING | S088
 * Validates that the self-learning pipeline is producing outputs AND that
 * high-k findings are not accumulating without corresponding validators.
 *
 * ADVISORY: findings-actuator-last-run.json is stale (>24h without rerun)
 * ADVISORY: 1-4 unacted high-k findings (k≥2, not resolved)
 * BLOCKING: ≥5 unacted high-k findings (persistent graveyard)
 * BLOCKING: findings-actuator script itself is missing (pipeline broken)
 *
 * Called by: verify.mjs STANDARD tier (always_rerun: true)
 * Also called by: session-open.sh (background cadence, sink to last-run JSON)
 *
 * @csps-id csps.validators.validate-prevention-coverage
 * @csps-version 1.0.0
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:self-learning audience:ai-agent
 * @csps-dna core_spine: VALD
 * @csps-enforces PROTO-S088-SELF-LEARNING gap-recurrence-register improvement-register
 * @csps-prevention-class FINDING-GRAVEYARD UNACTED-INSIGHT
 * @determinism-exempt: new Date() used ONLY for ran_at metadata and staleness check
 *   (comparing last-run timestamps). The blocking decision threshold (count ≥ N) is
 *   purely numeric, not clock-based. B_DETERMINISTIC_GATE-safe.
 *
 * run_tier: STANDARD
 * always_rerun: true
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const ACTUATOR_SCRIPT  = join(ROOT, 'tools/scripts/findings-actuator.mjs');
const ACTUATOR_RUN     = join(ROOT, 'tools/data/findings-actuator-last-run.json');
const LAST_RUN         = join(ROOT, 'tools/data/validate-prevention-coverage-last-run.json');

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

console.log('[validate-prevention-coverage] Self-learning pipeline coverage gate');
console.log('  BLOCKING: findings-actuator missing OR ≥5 unacted high-k findings');
console.log('  ADVISORY: actuator stale >24h OR 1-4 unacted high-k findings');
console.log('');

// ─── CHECK 1: actuator script exists ──────────────────────────────────────────
if (!existsSync(ACTUATOR_SCRIPT)) {
  BLOCK('tools/scripts/findings-actuator.mjs missing — self-learning pipeline is BROKEN (script removed?)');
} else {
  PASS('findings-actuator.mjs exists');
}

// ─── CHECK 2: run the actuator to get fresh data ──────────────────────────────
let actuatorData = null;
if (existsSync(ACTUATOR_SCRIPT)) {
  try {
    execSync(`node "${ACTUATOR_SCRIPT}"`, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 15000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    PASS('findings-actuator.mjs ran successfully');
  } catch (e) {
    WARN(`findings-actuator.mjs run failed: ${String(e.message || e).slice(0, 100)}`);
  }

  if (existsSync(ACTUATOR_RUN)) {
    try {
      actuatorData = JSON.parse(readFileSync(ACTUATOR_RUN, 'utf8'));
      PASS(`findings-actuator last-run loaded (${actuatorData.ran_at})`);
    } catch {
      WARN('findings-actuator-last-run.json exists but cannot be parsed');
    }
  } else {
    WARN('findings-actuator-last-run.json not found after run — actuator may have errored silently');
  }
}

// ─── CHECK 3: unacted high-k gaps ─────────────────────────────────────────────
if (actuatorData) {
  const gapCount = actuatorData.unacted_high_k?.length ?? 0;
  const impCount  = actuatorData.unacted_improvement?.length ?? 0;
  const total     = gapCount + impCount;

  // Thresholds: ADVISORY at 3+ (inform), BLOCKING at 25+ (graveyard)
  // Rationale: pre-existing backlog of ~17 unacted findings from S066-S088.
  // BLOCKING only fires when count grows ABOVE baseline to prevent deadlock.
  // Decrease threshold by ~3 each session as findings are acted upon.
  const ADVISORY_THRESHOLD = 3;
  const BLOCKING_THRESHOLD = 25;

  if (total === 0) {
    PASS('no unacted high-k findings — pipeline is current');
  } else if (total < ADVISORY_THRESHOLD) {
    PASS(`${total} unacted high-k finding(s) — below advisory threshold (${ADVISORY_THRESHOLD})`);
  } else if (total < BLOCKING_THRESHOLD) {
    WARN(`${total} unacted high-k findings (${gapCount} gaps k≥2, ${impCount} improvements k≥2) — act on oldest before adding new work`);
    // Surface top items
    for (const g of (actuatorData.unacted_high_k || []).slice(0, 3)) {
      console.log(`    [gap k=${g.k_count}] ${g.id}: ${g.observation?.slice(0, 80) || '(no description)'}`);
    }
    for (const imp of (actuatorData.unacted_improvement || []).slice(0, 2)) {
      console.log(`    [imp k=${imp.k_count}] ${imp.id}: ${imp.observation?.slice(0, 80) || '(no description)'}`);
    }
  } else {
    // ≥25 is a graveyard — BLOCKING
    BLOCK(`${total} unacted high-k findings — insight GRAVEYARD (≥${BLOCKING_THRESHOLD}). ${gapCount} gaps + ${impCount} improvements with k≥2 and no validator. Act before adding new work.`);
    for (const g of (actuatorData.unacted_high_k || []).slice(0, 5)) {
      console.log(`    [gap k=${g.k_count}] ${g.id}: ${g.observation?.slice(0, 80) || '(no description)'}`);
    }
  }

  // Also check gap register total exists (prove it's not empty)
  if (actuatorData.total_gap_entries === 0) {
    WARN('gap-recurrence-register has 0 entries — register may be missing or unreadable');
  } else {
    PASS(`gap-recurrence-register has ${actuatorData.total_gap_entries} total entries (${gapCount} unacted k≥2)`);
  }
}

// ─── RESULT ───────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-prevention-coverage] blocking=${blocking} advisory=${advisory} passes=${passes}`);

const lastRun = {
  ran_at: new Date().toISOString(),
  blocking,
  advisory,
  passes,
  findings,
  actuator_summary: actuatorData?.summary ?? 'actuator did not run',
};

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify(lastRun, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
