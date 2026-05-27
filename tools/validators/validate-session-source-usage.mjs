#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/ + PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 1
 * core_spine: VALD
 * governing_principle: P-META-019
 * behavioral_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
 * role: BLOCKING — detects hooks that compute session locally instead of importing
 *       from tools/lib/session-source.mjs. Prevents F-NEW-17 recurrence.
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-019
 * @behavioral-test-status: tested — session-source-test.sh A/B
 */

/**
 * validate-session-source-usage.mjs
 * PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 1 companion validator.
 *
 * Scans .claude/hooks/*.sh for inline session computation patterns that
 * bypass tools/lib/session-source.mjs. BLOCKING if found.
 *
 * Patterns that FAIL (local computation bypassing the lib):
 *   - node -e "...current_session..." (inline node without lib)
 *   - grep ... session-state.json | ... current_session (grep-based computation)
 *
 * Pattern that PASSES:
 *   - node .../tools/lib/session-source.mjs (lib call)
 *   - CSPS_SESSION_ID environment variable (test override)
 *
 * Output: hooks_checked=N using_lib=N local_computation=N blocking=N
 * Writes: tools/data/validate-session-source-usage-last-run.json
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const HOOKS_DIR = join(ROOT, '.claude', 'hooks');

// Patterns indicating local session computation (not via lib)
const LOCAL_COMPUTATION_PATTERNS = [
  // Inline node that reads current_session directly
  /node\s+-e\s+"[^"]*current_session[^"]*"/,
  // Inline node using require('fs') to read session-state
  /node\s+-e\s+"[^"]*session-state\.json[^"]*"/,
  // grep-based session computation (old pattern)
  /grep.*current_session.*session-state\.json/,
];

// Pattern indicating correct lib usage
const LIB_PATTERN = /session-source\.mjs/;

let hooks_checked = 0, using_lib = 0, local_computation = 0, blocking = 0;
const findings = [];

if (!existsSync(HOOKS_DIR)) {
  console.log(`[validate-session-source-usage] hooks dir not found`);
  process.exit(0);
}

const hookFiles = readdirSync(HOOKS_DIR).filter(f => f.endsWith('.sh'));

for (const hookFile of hookFiles) {
  const content = readFileSync(join(HOOKS_DIR, hookFile), 'utf-8');
  hooks_checked++;

  // Check if hook uses session at all (only care about hooks that need session)
  const mentionsSession = /current_session|THRESHOLD_SESSION|_SESSION\s*=|_SN\s*=/.test(content);
  if (!mentionsSession) continue;

  // Check if it correctly uses the lib
  const usesLib = LIB_PATTERN.test(content);

  // Check for local computation patterns
  let hasLocalComputation = false;
  for (const pattern of LOCAL_COMPUTATION_PATTERNS) {
    if (pattern.test(content)) {
      hasLocalComputation = true;
      break;
    }
  }

  if (hasLocalComputation) {
    local_computation++;
    blocking++;
    findings.push({
      hook: hookFile,
      issue: 'Local session computation detected (bypasses session-source.mjs)',
      fix: `Replace inline node computation with: node tools/lib/session-source.mjs`,
    });
    console.log(`  ✗ ${hookFile}: local session computation bypasses session-source.mjs`);
    console.log(`    Fix: use: _SN=$(node "\${REPO_ROOT}/tools/lib/session-source.mjs")`);
  } else if (usesLib) {
    using_lib++;
  }
}

const summary = `[validate-session-source-usage] hooks_checked=${hooks_checked} using_lib=${using_lib} local_computation=${local_computation} blocking=${blocking}`;
console.log(summary);

// Write last-run JSON
writeFileSync(
  join(ROOT, 'tools', 'data', 'validate-session-source-usage-last-run.json'),
  JSON.stringify({ hooks_checked, using_lib, local_computation, blocking, findings, ran_at: new Date().toISOString() }, null, 2),
  'utf-8'
);

if (blocking > 0) process.exit(1);
process.exit(0);
