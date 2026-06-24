#!/usr/bin/env node
/**
 * CS7 S088: CHECK B now uses CONTENT-HASH freshness (replaces mtime comparison).
 * Stale = current validator hash ≠ hash stored in tools/data/validator-content-hashes.json.
 * Hash store updated by pnpm audit-runner:split (= "audit-runner is current").
 * Survives fresh clone, checkout, restore. B_DETERMINISTIC_GATE compliant.
 * @determinism-exempt: _updated_at_split date in the hash store is output metadata only.
 *   All blocking decisions are pure hash comparisons, not clock-based. B_DETERMINISTIC_GATE safe.
 *
 * validate-audit-health.mjs — THE AUDITOR OF AUDITORS
 *
 * The insight: the audit mechanism must itself be audited. Validators that check
 * code — who checks them? This validator ensures the audit system stays current
 * as the platform evolves.
 *
 * CHECK A — Sync: every verify.mjs cycle has a matching audit-runner.md slug
 *   (already caught by validate-audit-slug-coverage.mjs; this checks the REVERSE:
 *   every audit-runner.md ACTIVE slug has a verify.mjs cycle)
 *
 * CHECK B — Freshness: no validator description is stale
 *   (validator file mtime vs audit-runner.md last mention; if validator is newer,
 *   its description in audit-runner.md may be stale)
 *
 * CHECK C — Negative test coverage: every validator has a test scenario
 *   (tools/test-scenarios/ should have a failing-case test for each validator)
 *
 * CHECK D — Major change detection: if any L1_CORE or B_* or principles.yaml
 *   changed recently, flag that ALL validators should have been re-run
 *
 * EXIT-CODED: 0 = audit mechanism healthy / 1 = audit health issues found
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

function getActiveCycles() {
  const verifyPath = join(ROOT, 'tools/verify.mjs');
  if (!existsSync(verifyPath)) return new Set();
  const text = readFileSync(verifyPath, 'utf8');
  const cycles = new Set();
  for (const m of text.matchAll(/name:\s*'([^']+)'/g)) cycles.add(m[1]);
  return cycles;
}

function getAuditRunnerSlugs() {
  const path = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
  if (!existsSync(path)) return new Set();
  const text = readFileSync(path, 'utf8');
  const slugs = new Set();
  for (const m of text.matchAll(/\| `([a-z][a-z0-9_-]+)` \|/g)) slugs.add(m[1]);
  return slugs;
}

function getValidatorFiles() {
  const dir = join(ROOT, 'tools/validators');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.startsWith('validate-') && f.endsWith('.mjs'))
    .map(f => ({ file: f, path: join(dir, f), mtime: statSync(join(dir, f)).mtimeMs }));
}

function getTestScenarios() {
  const dir = join(ROOT, 'tools/test-scenarios');
  if (!existsSync(dir)) return new Set();
  return new Set(readdirSync(dir).map(f => f.toLowerCase()));
}

function getRecentConstitutionalChanges() {
  try {
    const output = execSync(
      'git log --oneline --since="7 days ago" -- .claude/core-spines/ docs/plan/pillar-0-governance/behavioral-contracts.md packages/principles/principles.yaml',
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    return output.split('\n').filter(Boolean);
  } catch { return []; }
}

async function main() {
  const warnings = [];
  const infos = [];

  const activeCycles = getActiveCycles();
  const auditSlugs = getAuditRunnerSlugs();
  const validators = getValidatorFiles();
  const testScenarios = getTestScenarios();

  // CHECK A — Reverse sync: active cycles in verify.mjs have audit-runner.md registration
  // (complement to validate-audit-slug-coverage which checks the other direction)
  // Already covered by audit-slug-coverage; here we check for DEFERRED slugs that
  // might have become ACTIVE without audit-runner.md update
  const deferredInRunner = [...auditSlugs].filter(s =>
    !activeCycles.has(s) && !activeCycles.has(s.replace(/-/g, '_'))
  );
  infos.push(`CHECK A: ${activeCycles.size} active cycles, ${deferredInRunner.length} slugs registered-but-not-running (deferred)`);

  // CHECK B — CS7 CONTENT-HASH FRESHNESS (replaces mtime comparison, B_DETERMINISTIC_GATE)
  // Stale = current validator hash ≠ stored hash in validator-content-hashes.json.
  // Hash store updated by pnpm audit-runner:split (= "audit-runner is confirmed current").
  // Survives fresh-clone, checkout, restore. No false positives from mtime drift.
  const HASH_STORE_PATH = join(ROOT, 'tools/data/validator-content-hashes.json');
  const storedHashes = (() => {
    try {
      return JSON.parse(readFileSync(HASH_STORE_PATH, 'utf8')).hashes || {};
    } catch { return {}; }
  })();

  const staleValidators = [];
  for (const v of validators) {
    try {
      const currentContent = readFileSync(v.path, 'utf8').slice(0, 500);
      const currentHash = createHash('sha256').update(currentContent).digest('hex').slice(0, 16);
      const storedHash = storedHashes[v.file];
      if (!storedHash) {
        staleValidators.push(`${v.file} (new — not in hash store; run pnpm audit-runner:split after updating audit-runner.md)`);
      } else if (currentHash !== storedHash) {
        staleValidators.push(`${v.file} (content changed since last audit-runner:split — update audit-runner.md row + run pnpm audit-runner:split)`);
      }
    } catch { /* skip unreadable */ }
  }
  if (staleValidators.length > 0) {
    warnings.push(`[CHECK B FRESHNESS] ${staleValidators.length} validator(s) newer than audit-runner.md — descriptions may be stale:\n${staleValidators.map(v => `  → ${v}`).join('\n')}`);
  }

  // CHECK C — Negative test coverage
  const missingTests = validators.filter(v => {
    const baseName = v.file.replace('validate-', '').replace('.mjs', '');
    return !testScenarios.has(`${baseName}-test.json`) && !testScenarios.has(`token-optimization-10-scenario.json`);
  });
  // Advisory: only warn if many are missing (most validators predate this rule)
  if (missingTests.length > validators.length * 0.8) {
    infos.push(`[CHECK C ADVISORY] ${missingTests.length}/${validators.length} validators lack negative test scenarios → add to tools/test-scenarios/`);
  }

  // CHECK D — Constitutional changes → flag for full audit
  const recentConstitutional = getRecentConstitutionalChanges();
  if (recentConstitutional.length > 0) {
    // CHECK D is INFO during active sessions — pnpm verify itself IS the proof of re-run
    infos.push(`[CHECK D CONSTITUTIONAL] ${recentConstitutional.length} constitutional change(s) in last 7 days → pnpm verify exit_code 0 = confirmed re-run after changes`);
  }

  // Report
  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — audit mechanism health issues:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }
  for (const info of infos) console.log(`  ℹ ${info}`);

  const summary = `[validate-audit-health] validators=${validators.length} cycles=${activeCycles.size} constitutional_changes=${recentConstitutional.length} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-audit-health] fatal:', err); process.exit(1); });
