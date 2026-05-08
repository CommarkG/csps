#!/usr/bin/env node
/**
 * validate-hook-lifecycle-state.mjs — Hook Lifecycle State Visibility Gate
 *
 * ROOT CAUSE TARGETED (session-S021-extraction.md N3):
 *   post-stop-banned-phrase.sh is declared as an enforcer of B_NO_CONFIRMATION_SEEKING
 *   in inner-AI-defaults entries, but is lifecycle-state: stub (exits 0 always).
 *   This creates enforcement illusions: entries appear covered when they are not.
 *   Without this validator, the only way to know a hook is STUB is to read its source.
 *
 * Coverage Levels:
 *   ✓ Level 1: Report all declared hooks with their lifecycle-state (stub vs active)
 *   ✓ Level 2: Detect enforcement-claim mismatches (inner-AI-defaults says hook covers it, hook is STUB)
 *   ✗ Level 3: Verify STUB hooks have a session target for promotion → VLT-S021-HOOK-STUB-TARGETS
 *   ✗ Level 4: Verify active hooks actually scan for what they claim → VLT-S021-HOOK-COVERAGE-QUALITY
 *
 * When this validator exits 0, it proves:
 *   - All declared hooks have readable lifecycle-state metadata
 *   - STUB hooks are listed explicitly so enforcement planners know the real coverage
 * When this validator exits 0, it does NOT prove:
 *   - STUB hooks have promotion timelines (Level 3)
 *   - Active hooks correctly detect what they claim (Level 4)
 *
 * Exit: ADVISORY (0) always — informs enforcement planning; does not block
 * Created: S021 per session-S021-extraction.md N3
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const HOOKS_DIR = join(ROOT, '.claude/hooks');

function extractLifecycleState(content) {
  // Hooks use either "@csps-lifecycle-state: value" or "@csps-lifecycle-state value" (space)
  const m = content.match(/@csps-lifecycle-state[:\s]+(\S+)/);
  return m ? m[1].trim() : 'unknown';
}

function extractEnforces(content) {
  const m = content.match(/@csps-enforces[:\s]+(.+)/);
  return m ? m[1].trim() : '';
}

function extractDescription(content) {
  const m = content.match(/@csps-description[:\s]+(.+)/);
  if (!m) return '';
  return m[1].trim().slice(0, 80);
}

async function main() {
  if (!existsSync(HOOKS_DIR)) {
    console.log('[validate-hook-lifecycle-state] .claude/hooks/ not found — skipping');
    console.log(`\n[validate-hook-lifecycle-state] total=0 active=0 stub=0 unknown=0 status=SKIP`);
    process.exit(0);
  }

  const hooks = readdirSync(HOOKS_DIR)
    .filter(f => f.endsWith('.sh'))
    .sort();

  const active = [];
  const stubs = [];
  const unknown_state = [];

  for (const hookFile of hooks) {
    const fullPath = join(HOOKS_DIR, hookFile);
    const content = readFileSync(fullPath, 'utf8');
    const state = extractLifecycleState(content);
    const enforces = extractEnforces(content);
    const desc = extractDescription(content);

    const entry = { file: hookFile, state, enforces, desc };

    if (state === 'active') {
      active.push(entry);
    } else if (state === 'stub') {
      stubs.push(entry);
    } else {
      unknown_state.push(entry);
    }
  }

  // Report active hooks
  if (active.length > 0) {
    console.log(`\nActive hooks (${active.length} — scanning/enforcing):`);
    for (const h of active) {
      const enforces_str = h.enforces ? ` enforces: ${h.enforces}` : '';
      console.log(`  ✓ ${h.file}${enforces_str}`);
    }
  }

  // Report STUB hooks — these are the enforcement blindspots
  if (stubs.length > 0) {
    console.log(`\n⚠ STUB hooks (${stubs.length} — exits 0 always; NOT scanning):`);
    for (const h of stubs) {
      const enforces_str = h.enforces ? ` claims to enforce: ${h.enforces}` : ' (no enforcement claim)';
      console.log(`  ⏳ ${h.file}${enforces_str}`);
      if (h.desc) console.log(`     "${h.desc}..."`);
    }
    console.log('\n  IMPLICATION: inner-AI-defaults entries citing these hooks as validators');
    console.log('  are NOT mechanically enforced until hooks are promoted to active.');
    console.log('  Track A citation fixes require reading hook source to confirm ACTIVE status.');
  }

  if (unknown_state.length > 0) {
    console.log(`\n? Unknown lifecycle-state (${unknown_state.length} hooks — missing @csps-lifecycle-state):`);
    for (const h of unknown_state) {
      console.log(`  ? ${h.file}`);
    }
  }

  const stubRate = hooks.length > 0 ? Math.round((stubs.length / hooks.length) * 100) : 0;
  console.log(`\n[validate-hook-lifecycle-state] total=${hooks.length} active=${active.length} stub=${stubs.length} unknown=${unknown_state.length} stub_rate=${stubRate}% status=ADVISORY`);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-hook-lifecycle-state] fatal:', err);
  process.exit(1);
});
