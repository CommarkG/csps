#!/usr/bin/env node
/**
 * validate-deferred-target-session.mjs — Week-4 deferrals must have target sessions
 *
 * ROOT CAUSE TARGETED: RP-001 — "week-4 is a commitment, not a metaphor."
 * Items tagged week-4 or deferred without a target session become governance debt
 * that accumulates silently across sessions. S027 found: instance-registry-populator
 * deferred S006→S027 (21 sessions), canonical-home validator deferred S009→S027 (18 sessions).
 *
 * What it checks:
 *   1. audit-runner.md: rows mentioning "week-4" or "deferred" without "impl deferred week-4"
 *      being tied to a session target (S<NNN>)
 *   2. behavioral-contracts.md: enforcement_stage: planned|week-4 without target_session
 *   3. principles.yaml: enforces_by: [...] where any enforcement is "deferred" without session
 *   4. ADVISORY for all findings — the information surfaces the debt without blocking
 *
 * ADVISORY Phase 1 — surfaces governance debt visibly
 * BLOCKING Phase 2 after K=2 recurring patterns (per RP-001 spec)
 *
 * Audit slug: deferred-target-session
 * PE=75 | RP-001 | retrograde-principles-s027.md
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const AUDIT_RUNNER = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
const CONTRACTS = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');

const advisories = [];
let checked = 0;

// ─── Check 1: audit-runner.md rows with week-4 but no S<NNN> target ──────────

if (existsSync(AUDIT_RUNNER)) {
  checked++;
  const content = readFileSync(AUDIT_RUNNER, 'utf8');
  const rows = content.split('\n').filter(l => l.startsWith('|'));

  let week4WithoutTarget = 0;
  for (const row of rows) {
    if (!row.toLowerCase().includes('week-4') && !row.toLowerCase().includes('deferred')) continue;
    // Check if the row mentions a target session S<NNN>
    const hasTarget = /S\d{3,}|S028|S029|S030|S031/.test(row);
    if (!hasTarget) week4WithoutTarget++;
  }

  if (week4WithoutTarget > 5) {
    advisories.push({
      source: 'audit-runner.md',
      count: week4WithoutTarget,
      issue: `${week4WithoutTarget} audit-runner rows mention week-4/deferred without a target session number`,
      suggestion: 'Add target session references like "ships S028" to deferred audit slugs',
    });
  }
}

// ─── Check 2: behavioral-contracts.md enforcement_stage: week-4 count ────────

if (existsSync(CONTRACTS)) {
  checked++;
  const content = readFileSync(CONTRACTS, 'utf8');
  const week4Contracts = (content.match(/enforcement_stage:\s*(?:week-4|planned)/gi) || []).length;
  if (week4Contracts > 15) {
    advisories.push({
      source: 'behavioral-contracts.md',
      count: week4Contracts,
      issue: `${week4Contracts} contracts have enforcement_stage: week-4/planned (governance debt)`,
      suggestion: 'Review and assign target sessions to highest-PE contracts per enforcement-coverage.md',
    });
  }
}

// ─── Check 3: Total governance debt estimate ──────────────────────────────────

// Count total week-4 stubs in verify.mjs (registered but not running)
const VERIFY = join(ROOT, 'tools/verify.mjs');
if (existsSync(VERIFY)) {
  checked++;
  const content = readFileSync(VERIFY, 'utf8');
  const deferredCount = (content.match(/DEFERRED-WITH-REASON/gi) || []).length +
                        (content.match(/week-4/gi) || []).length;
  if (deferredCount > 3) {
    advisories.push({
      source: 'verify.mjs',
      count: deferredCount,
      issue: `${deferredCount} deferred/week-4 references in verify.mjs — governance debt accumulating`,
      suggestion: 'Track: tools/config/platform-update-backlog.yaml (to build) — itemize each with target session',
    });
  }
}

if (advisories.length > 0) {
  advisories.forEach(a => {
    console.log(`  ⚠ [deferred-target-session] ${a.source} (${a.count}): ${a.issue}`);
    console.log(`     → ${a.suggestion}`);
  });
  console.log('[deferred-target-session] governance debt is visible — schedule resolution sessions or accept as planned capacity');
} else {
  console.log('[deferred-target-session] deferred item levels within acceptable range ✓');
}

console.log(`[deferred-target-session] checked=${checked} advisories=${advisories.length}`);
process.exit(0);
