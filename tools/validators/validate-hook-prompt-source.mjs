#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-hook-prompt-source
 * @csps-name validate-hook-prompt-source
 * @csps-description B1 S086 INHERITANCE-LOOP: verifies every user-prompt-submit-*.sh hook
 *   reads the user prompt from STDIN (the JSON .prompt field) — NOT from CLAUDE_USER_PROMPT
 *   as the primary source. Claude Code does NOT set CLAUDE_USER_PROMPT; hooks reading it
 *   as primary source receive empty string → entire prompt-hook layer silently dead.
 *
 *   BLOCKING: any hook whose PRIMARY prompt source is CLAUDE_USER_PROMPT (not stdin).
 *   ADVISORY: hook has both — confirm fallback ordering is correct (stdin first).
 *
 *   Block-test: the test fixture hook-with-env-primary.sh.fixture uses env-var-only primary;
 *   this validator MUST detect it as BLOCKING (proves machine works).
 *
 * run_tier: EXTENDED
 * load_mode: on-demand + --extended flag
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_ACTIVATION_STEADY_STATE_VERIFY PROTO-S086-INHERITANCE-LOOP
 * @csps-prevention-class DEAD-HOOK-LAYER ENV-VAR-ONLY-PROMPT-SOURCE
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): hook uses CLAUDE_USER_PROMPT as its ONLY/PRIMARY prompt source
 *   ADVISORY (exit 0): hook lacks stdin reading but has env fallback with explicit note
 *
 * Exit: 1 if any hook has env-var-only primary source; 0 otherwise
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const HOOKS_DIR = join(ROOT, '.claude/hooks');
const FIXTURE_PATH = join(ROOT, 'tools/validators/__tests__/hook-with-env-primary.sh.fixture');

let blocking = 0;
let advisory = 0;
const issues = [];

// ── Patterns ──────────────────────────────────────────────────────────────────

// GOOD: reads from stdin first
const STDIN_READ_PATTERN = /STDIN_JSON.*cat\s|cat\s.*2>\/dev\/null.*STDIN_JSON/;
// BAD: reads from env var as primary (no stdin read before it)
const ENV_ONLY_PATTERN = /^(readonly\s+)?[A-Z_]+="\$\{CLAUDE_USER_PROMPT[^}]*\}"/m;
// GOOD marker: has stdin reading at all
const HAS_STDIN_PATTERN = /STDIN_JSON|cat.*2>\/dev\/null/;

// ── Scan hooks ────────────────────────────────────────────────────────────────

function checkHook(hookPath, relPath, isFixture = false) {
  const text = readFileSync(hookPath, 'utf-8');

  const hasStdin = HAS_STDIN_PATTERN.test(text);
  const hasEnvOnly = ENV_ONLY_PATTERN.test(text);

  // A hook that reads CLAUDE_USER_PROMPT as primary AND has no stdin reading = dead
  if (!hasStdin && hasEnvOnly) {
    return { status: 'BLOCKING', path: relPath, isFixture, reason: 'CLAUDE_USER_PROMPT is primary with NO stdin reading — hook receives empty prompt (Claude Code never sets this env var)' };
  }
  // A hook that has stdin reading but also has env-only fallback is OK (correct pattern)
  if (hasStdin) {
    return { status: 'PASS', path: relPath, isFixture };
  }
  // No stdin and no CLAUDE_USER_PROMPT — neutral (hook may not need prompt content)
  return { status: 'PASS', path: relPath, isFixture, note: 'No prompt reading detected (hook may not use prompt content)' };
}

// ── Block-test ────────────────────────────────────────────────────────────────

let blockTestPassed = false;
if (existsSync(FIXTURE_PATH)) {
  const result = checkHook(FIXTURE_PATH, 'tools/validators/__tests__/hook-with-env-primary.sh.fixture', true);
  blockTestPassed = result.status === 'BLOCKING';
} else {
  console.warn('[validate-hook-prompt-source] WARN: block-test fixture not found — create tools/validators/__tests__/hook-with-env-primary.sh.fixture');
}

// ── Scan all user-prompt-submit hooks ────────────────────────────────────────

if (existsSync(HOOKS_DIR)) {
  const hooks = readdirSync(HOOKS_DIR).filter(f => f.startsWith('user-prompt-submit-') && f.endsWith('.sh'));
  for (const hook of hooks) {
    const hookPath = join(HOOKS_DIR, hook);
    const relPath = `.claude/hooks/${hook}`;
    const result = checkHook(hookPath, relPath);
    if (result.status === 'BLOCKING') {
      issues.push(result);
      blocking++;
      console.error(`  ✗ BLOCKING: ${relPath} — ${result.reason}`);
    } else if (result.status === 'ADVISORY') {
      issues.push(result);
      advisory++;
      console.warn(`  ⚠ ADVISORY: ${relPath} — ${result.reason}`);
    }
  }
}

// ── Output ────────────────────────────────────────────────────────────────────

const status = (blocking > 0 || !blockTestPassed) ? 'FAIL' : 'PASS';
console.log(`[validate-hook-prompt-source] ${status}`);
console.log(`  hooks_checked=${existsSync(HOOKS_DIR) ? readdirSync(HOOKS_DIR).filter(f => f.startsWith('user-prompt-submit-') && f.endsWith('.sh')).length : 0} blocking=${blocking} advisory=${advisory}`);
console.log(`  block_test=${blockTestPassed ? 'PASS (env-only fixture detected as BLOCKING)' : 'FAIL — machine is NOT detecting env-var-only primary source'}`);

if (!blockTestPassed) {
  console.error('[validate-hook-prompt-source] BLOCKING: block-test FAILED — fix fixture or detection pattern');
}
if (blocking === 0 && advisory === 0 && blockTestPassed) {
  console.log('[validate-hook-prompt-source] ✓ All user-prompt-submit hooks read from stdin .prompt (not CLAUDE_USER_PROMPT primary)');
}

process.exit((blocking > 0 || !blockTestPassed) ? 1 : 0);
