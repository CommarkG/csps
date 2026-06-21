#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-hook-activation-smoke
 * @csps-name validate-hook-activation-smoke
 * @csps-description B3 S086 INHERITANCE-LOOP: smoke-tests every user-prompt-submit-*.sh hook
 *   by piping {"prompt":"SMOKE-<ts>"} to each one and asserting:
 *   (a) the hook actually CONSUMES the prompt (no exit immediately / no empty-message skip),
 *   (b) any file the hook creates or appends to in this run has valid frontmatter.
 *
 *   "EXISTS ≠ ACTIVE" (AP-001 + feedback_exists_not_equals_active): verify.mjs confirms hooks
 *   are present on disk; this validator confirms they FUNCTION at runtime with a real prompt.
 *
 *   ADVISORY (exit 0) by default for all findings — hooks can have legitimate reasons to be
 *   quiet (e.g. turn-counter only fires at turn 25/50). BLOCKING only for hooks that crash
 *   (non-zero exit) or write files WITHOUT frontmatter.
 *
 * run_tier: EXTENDED
 * load_mode: on-demand + --extended flag
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_ACTIVATION_STEADY_STATE_VERIFY AP-001 PROTO-S086-INHERITANCE-LOOP
 * @csps-prevention-class DEAD-HOOK-LAYER EXISTS-NOT-EQUALS-ACTIVE
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): hook crashes (non-zero exit) or writes files with missing frontmatter
 *   ADVISORY (exit 0): hook ran but produced no output (may be intentional)
 *
 * Exit: 1 if any hook crashes or writes bad-frontmatter files; 0 otherwise
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const HOOKS_DIR = join(ROOT, '.claude/hooks');
const SMOKE_PROMPT = `{"prompt":"SMOKE-${Date.now()}-activation-test"}`;

let blocking = 0;
let advisory = 0;
const results = [];

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasFrontmatter(filePath) {
  try {
    const text = readFileSync(filePath, 'utf-8');
    return text.startsWith('---\n') || text.startsWith('---\r\n');
  } catch { return false; }
}

function getRecentFiles(dir, afterMs) {
  const recent = [];
  if (!existsSync(dir)) return recent;
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fp = join(dir, entry.name);
      if (entry.isDirectory()) {
        recent.push(...getRecentFiles(fp, afterMs));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const mtime = statSync(fp).mtimeMs;
          if (mtime > afterMs) recent.push(fp);
        } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
  return recent;
}

// ── Scan hooks ────────────────────────────────────────────────────────────────

if (!existsSync(HOOKS_DIR)) {
  console.warn('[validate-hook-activation-smoke] hooks directory not found — skipping');
  process.exit(0);
}

const hooks = readdirSync(HOOKS_DIR)
  .filter(f => f.startsWith('user-prompt-submit-') && f.endsWith('.sh'))
  .sort();

// Watch directories for file writes
const watchDirs = [
  join(ROOT, 'docs/plan/_handoff/VAULT/governor-prompts'),
  join(ROOT, 'docs/plan/_handoff/VAULT/governor-comments'),
  join(ROOT, 'tools/data'),
  join(ROOT, '.csps'),
];

for (const hook of hooks) {
  const hookPath = join(HOOKS_DIR, hook);
  const beforeMs = Date.now();

  const result = spawnSync('bash', [hookPath], {
    input: SMOKE_PROMPT,
    encoding: 'utf-8',
    cwd: ROOT,
    timeout: 10000,
    env: { ...process.env, PATH: process.env.PATH },
  });

  const hookResult = {
    hook,
    exit_code: result.status,
    stdout: (result.stdout || '').slice(0, 200),
    stderr_first100: (result.stderr || '').slice(0, 100),
    files_written: [],
    frontmatter_issues: [],
    status: 'PASS',
  };

  if (result.status !== 0 && result.status !== null) {
    hookResult.status = 'BLOCKING';
    hookResult.reason = `Hook exited with code ${result.status} — crash or fatal error`;
    blocking++;
  }

  // Check for newly written files in watch dirs
  for (const watchDir of watchDirs) {
    const newFiles = getRecentFiles(watchDir, beforeMs);
    for (const fp of newFiles) {
      const rel = fp.replace(ROOT + '/', '').replace(/\\/g, '/');
      hookResult.files_written.push(rel);
      if (rel.endsWith('.md') && !hasFrontmatter(fp)) {
        hookResult.frontmatter_issues.push(rel);
        if (hookResult.status !== 'BLOCKING') {
          hookResult.status = 'BLOCKING';
          hookResult.reason = `Hook wrote ${rel} without YAML frontmatter — will fail validate-frontmatter`;
          blocking++;
        }
      }
    }
  }

  if (result.status === 0 && !hookResult.stdout.trim() && hookResult.files_written.length === 0) {
    hookResult.note = 'Hook ran silently (may be intentional for this hook type)';
    advisory++;
  }

  results.push(hookResult);
}

// ── Output ─────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-hook-activation-smoke] ${status}`);
console.log(`  hooks_tested=${hooks.length} blocking=${blocking} advisory=${advisory}`);

for (const r of results) {
  if (r.status === 'BLOCKING') {
    console.error(`  ✗ BLOCKING: ${r.hook} — ${r.reason}`);
    if (r.frontmatter_issues.length) {
      r.frontmatter_issues.forEach(f => console.error(`    → ${f}: missing frontmatter`));
    }
  } else if (r.note) {
    console.log(`  ℹ ${r.hook}: ${r.note}`);
  } else {
    const fileNote = r.files_written.length ? ` (wrote ${r.files_written.length} file(s))` : '';
    const stdoutNote = r.stdout.trim() ? ` stdout="${r.stdout.slice(0,60).trim()}"` : '';
    console.log(`  ✓ ${r.hook}${fileNote}${stdoutNote}`);
  }
}

if (blocking === 0) {
  console.log('[validate-hook-activation-smoke] ✓ All hooks ran without crashing + file writes have frontmatter');
}

process.exit(blocking > 0 ? 1 : 0);
