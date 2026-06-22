#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-hook-prompt-source
 * @csps-name validate-hook-prompt-source
 * @csps-description B1 S086 INHERITANCE-LOOP AMENDMENT-1: verifies every user-prompt-submit-*.sh
 *   hook reads user prompt by SOURCING tools/lib/hook-read-prompt.sh — the canonical reader.
 *   AMENDMENT-1 (prevent-by-construction): instead of checking for hand-rolled STDIN reads,
 *   we now require all hooks to source the canonical library. Any hook with its own inline
 *   STDIN reader is BLOCKING — it may drift again.
 *
 *   BLOCKING: any user-prompt-submit hook NOT sourcing hook-read-prompt.sh.
 *
 *   Block-test: fixture hook-with-env-primary.sh.fixture does NOT source hook-read-prompt.sh
 *   → validator MUST detect it as BLOCKING (proves machine works).
 *
 * run_tier: EXTENDED
 * load_mode: on-demand + --extended flag
 *
 * @csps-version 2.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_ACTIVATION_STEADY_STATE_VERIFY PROTO-S086-INHERITANCE-LOOP AMENDMENT-1
 * @csps-prevention-class DEAD-HOOK-LAYER HAND-ROLLED-STDIN-DRIFT
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): hook does NOT source tools/lib/hook-read-prompt.sh
 *   PASS (exit 0): all hooks source the canonical reader
 *
 * Exit: 1 if any hook missing canonical source; 0 otherwise
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const HOOKS_DIR = join(ROOT, '.claude/hooks');
const FIXTURE_PATH = join(ROOT, 'tools/validators/__tests__/hook-with-env-primary.sh.fixture');

let blocking = 0;
const issues = [];

// ── Patterns ────────────────────────────────────────────────────────────────────
// GOOD: hook sources or calls hook-read-prompt.sh (the canonical reader)
const CANONICAL_SOURCE = /hook-read-prompt\.sh/;

// Prompt-reading hooks: contain any variable that captures the user prompt.
// If a hook does NOT match this, it doesn't read the prompt → exempt from AMENDMENT-1.
// Patterns: PROMPT=, USER_MESSAGE=, RAW_COMMENT=, STDIN_JSON=, CLAUDE_USER_PROMPT
const READS_PROMPT = /\b(PROMPT|USER_MESSAGE|RAW_COMMENT|STDIN_JSON|CLAUDE_USER_PROMPT)\s*=/;

// ── Check function ────────────────────────────────────────────────────────────

function checkHook(hookPath, relPath, isFixture = false) {
  const text = readFileSync(hookPath, 'utf-8');
  const readsPrompt = READS_PROMPT.test(text);
  const hasCanonical = CANONICAL_SOURCE.test(text);

  // Hook doesn't read the prompt at all → exempt (no prompt means no sourcing needed)
  if (!readsPrompt) {
    return { status: 'PASS', path: relPath, isFixture, note: 'No prompt reading — exempt from AMENDMENT-1' };
  }

  // Hook reads prompt but via hand-rolled inline method, not canonical reader → BLOCKING
  if (!hasCanonical) {
    return {
      status: 'BLOCKING',
      path: relPath,
      isFixture,
      reason: 'Reads prompt but does NOT source tools/lib/hook-read-prompt.sh — prompt reading may drift; AMENDMENT-1 requires canonical reader'
    };
  }

  return { status: 'PASS', path: relPath, isFixture };
}

// ── Block-test ────────────────────────────────────────────────────────────────

let blockTestPassed = false;
if (existsSync(FIXTURE_PATH)) {
  const result = checkHook(FIXTURE_PATH, 'tools/validators/__tests__/hook-with-env-primary.sh.fixture', true);
  blockTestPassed = result.status === 'BLOCKING';
  if (!blockTestPassed) {
    console.error('[validate-hook-prompt-source] BLOCKING: block-test FAILED — fixture has hook-read-prompt.sh? It should NOT. Machine is broken.');
  }
} else {
  console.warn('[validate-hook-prompt-source] WARN: block-test fixture not found — create tools/validators/__tests__/hook-with-env-primary.sh.fixture');
  // Missing fixture = block-test inconclusive, treat as failed
  blockTestPassed = false;
}

// ── Scan all user-prompt-submit hooks ────────────────────────────────────────

const checkedHooks = [];
if (existsSync(HOOKS_DIR)) {
  const hooks = readdirSync(HOOKS_DIR).filter(f => f.startsWith('user-prompt-submit-') && f.endsWith('.sh'));
  for (const hook of hooks) {
    const hookPath = join(HOOKS_DIR, hook);
    const relPath = `.claude/hooks/${hook}`;
    const result = checkHook(hookPath, relPath);
    checkedHooks.push(result);
    if (result.status === 'BLOCKING') {
      issues.push(result);
      blocking++;
      console.error(`  ✗ BLOCKING: ${relPath} — ${result.reason}`);
    } else if (result.note) {
      console.log(`  ✓ PASS: ${relPath} — ${result.note}`);
    } else {
      console.log(`  ✓ PASS: ${relPath} — sources hook-read-prompt.sh (AMENDMENT-1 satisfied)`);
    }
  }
}

// ── Output ────────────────────────────────────────────────────────────────────

const overallStatus = (blocking > 0 || !blockTestPassed) ? 'FAIL' : 'PASS';
console.log(`[validate-hook-prompt-source] ${overallStatus}`);
console.log(`  hooks_checked=${checkedHooks.length} blocking=${blocking}`);
console.log(`  block_test=${blockTestPassed ? 'PASS (non-canonical fixture detected as BLOCKING)' : 'FAIL — machine is NOT detecting missing canonical source'}`);

if (blocking === 0 && blockTestPassed) {
  console.log('[validate-hook-prompt-source] ✓ All user-prompt-submit hooks source canonical hook-read-prompt.sh (AMENDMENT-1 satisfied)');
}

process.exit((blocking > 0 || !blockTestPassed) ? 1 : 0);
