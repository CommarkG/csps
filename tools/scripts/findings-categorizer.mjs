#!/usr/bin/env node
/**
 * findings-categorizer.mjs — OPEN-051 / S041 Sprint 2
 *
 * Reads pnpm verify output and categorizes each finding into:
 *   [S1] BLOCKING     — fix in this session (same response)
 *   [S2] ADVISORY     — ripple check needed before next commit
 *   [S3] DEFERRED     — PRACE analysis + threshold routing required
 *
 * Makes the three-scope processing MECHANICAL (not optional).
 * Called automatically by post-stop-pnpm-verify.sh after every verify run.
 *
 * Usage:
 *   node tools/verify.mjs 2>&1 | node tools/scripts/findings-categorizer.mjs
 *   OR: node tools/scripts/findings-categorizer.mjs --file tools/verify-last-run.md
 *
 * Output: structured JSON + human-readable summary
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ── Read verify output ─────────────────────────────────────────────────────
let verifyData = null;

const fileFlag = process.argv.indexOf('--file');
if (fileFlag !== -1 && process.argv[fileFlag + 1]) {
  const path = process.argv[fileFlag + 1];
  if (existsSync(path)) {
    const content = readFileSync(path, 'utf8');
    // Extract JSON from markdown code block if needed
    const jsonMatch = content.match(/```json\n([\s\S]+?)\n```/);
    try {
      verifyData = JSON.parse(jsonMatch ? jsonMatch[1] : content);
    } catch {
      console.error('[findings-categorizer] Could not parse verify output from file');
      process.exit(0);
    }
  }
} else {
  // Run verify.mjs with explicit stdout/stderr capture
  try {
    const { spawnSync } = await import('child_process');
    const result = spawnSync('node', ['tools/verify.mjs'], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024
    });
    const raw = result.stdout || '';  // stdout has the JSON; stderr has [verify] running: lines
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      verifyData = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    }
  } catch (err) {
    console.log('[findings-categorizer] Could not run verify:', err.message);
  }
  if (!verifyData) {
    console.log('[findings-categorizer] No verify data. Run: node tools/verify.mjs first.');
    process.exit(0);
  }
}

// Normalize: verify.mjs uses pre_close_verification.cycles, not validators
if (verifyData && verifyData.pre_close_verification) {
  verifyData = {
    validators: verifyData.pre_close_verification.cycles || [],
    exit_code: verifyData.pre_close_verification.exit_code
  };
}

if (!verifyData || !verifyData.validators || !Array.isArray(verifyData.validators)) {
  console.log('[findings-categorizer] Invalid verify output format');
  process.exit(0);
}

// ── Categorize findings ────────────────────────────────────────────────────
const S1 = []; // BLOCKING — fix now
const S2 = []; // ADVISORY — ripple check before next commit
const S3 = []; // DEFERRED — PRACE analysis + threshold routing

for (const v of verifyData.validators) {
  const { name, status, exit_code, advisories, errors } = v;

  if (status === 'DEFERRED-WITH-REASON') {
    // Deferred validators are S3 — they represent known gaps not yet fixed structurally
    S3.push({
      name,
      scope: 'S3',
      reason: v.skip_reason || 'deferred',
      prace_question: `What training default caused this to be deferred instead of built? When will T1+T2 be installed?`,
      threshold_needed: true
    });
    continue;
  }

  if (status === 'FAIL' || exit_code === 1) {
    S1.push({
      name,
      scope: 'S1',
      reason: `${errors || 0} errors — fix in this session`,
      immediate_action: `Run: node tools/validators/${name.replace(/_/g, '-')}.mjs to see specific files`
    });
    continue;
  }

  if (status === 'PASS' && advisories > 0) {
    S2.push({
      name,
      scope: 'S2',
      reason: `${advisories} advisory findings — ripple check before next commit`,
      ripple_check: `Verify connected artifacts are consistent after any change to ${name} area`
    });
    continue;
  }
}

// ── Output ─────────────────────────────────────────────────────────────────
const timestamp = new Date().toISOString();
const summary = {
  timestamp,
  exit_code: verifyData.exit_code,
  total_validators: verifyData.validators.length,
  s1_count: S1.length,
  s2_count: S2.length,
  s3_count: S3.length,
  S1,
  S2,
  S3
};

// Human-readable output
console.log('\n━━━ FINDINGS CATEGORIZER (Core Scopes) ━━━');
console.log(`Timestamp: ${timestamp}`);
console.log(`Overall: exit_code=${verifyData.exit_code} | validators=${verifyData.validators.length}`);
console.log('');

if (S1.length === 0 && S2.length === 0 && S3.length === 0) {
  console.log('✓ All findings processed — no scope actions needed');
} else {
  if (S1.length > 0) {
    console.log(`[S1] BLOCKING — Fix in this session (${S1.length} items):`);
    S1.forEach(f => console.log(`  • ${f.name}: ${f.reason}`));
    console.log(`  ⚠ AI behavior override: Default is "fix symptom → done". S1 alone = recurrence.`);
    console.log(`  → After S1: enumerate connected artifacts (S2) before closing.`);
    console.log('');
  }

  if (S2.length > 0) {
    console.log(`[S2] ADVISORY — Ripple check before next commit (${S2.length} items):`);
    S2.forEach(f => console.log(`  • ${f.name}: ${f.reason}`));
    console.log(`  ⚠ AI behavior override: Default is "change is self-contained". S2 = enumerate what else moved.`);
    console.log(`  → After S2: identify if any item warrants Scope-3 (recurring class? training default?)`);
    console.log('');
  }

  if (S3.length > 0) {
    console.log(`[S3] DEFERRED — PRACE analysis + threshold routing (${S3.length} items):`);
    S3.forEach(f => console.log(`  • ${f.name}: ${f.reason}`));
    console.log(`  ⚠ AI behavior override: Default is "problem solved → move on". S3 = install T1/T2/T3 so the CLASS cannot recur.`);
    console.log(`  → Name the training default. Name the satisfaction point. Install mechanical prevention.`);
    console.log(`  → Route S3 findings to: docs/plan/pillar-0-governance/threshold-intake-protocol.md`);
    console.log('');
  }
}

console.log('━━━ END FINDINGS CATEGORIZER ━━━\n');

// Write structured output for downstream tools
const outputPath = resolve(ROOT, 'tools/findings-last-run.json');
try {
  writeFileSync(outputPath, JSON.stringify(summary, null, 2));
} catch { /* non-fatal */ }
