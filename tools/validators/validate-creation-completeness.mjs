#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-creation-completeness
 * @csps-name validate-creation-completeness
 * @csps-description Creation Completeness Gate: scans PI files added in last 30 days.
 * Checks: wiring_checklist ≥3 entries, enforcement_trio exists, done_criterion exists,
 * all questions answered, ep_err_pre_check exists (Turn 88 §3 OPEN-021 learning loop).
 * ADVISORY for all (transition period — legacy PIs grandfathered). S037-H + S037-H addendum.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:developer
 * @csps-enforces P-ARCH-031 P-OPER-002
 *
 * Coverage Levels:
 *   ✓ Checks: PI files modified in last 30 days
 *   ✓ Detects: missing wiring_checklist (or < 3 entries)
 *   ✓ Detects: missing enforcement_trio field
 *   ✓ Detects: missing done_criterion or plan_summary done criterion
 *   ✓ Detects: unanswered questions (status: unanswered)
 *   ✓ Detects: missing ep_err_pre_check field (EP-ERR→Planning loop)
 *   ✗ Does not check: correctness of content — only presence
 *
 * Exit: 0 always (ADVISORY — transition period)
 * Output: pi_checked=N advisories=N
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLAN_ITEMS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/plan-items');

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const NOW = Date.now();

let piChecked = 0;
let advisories = 0;

if (!existsSync(PLAN_ITEMS_DIR)) {
  console.log(`[validate-creation-completeness] plan-items dir not found pi_checked=0 advisories=0`);
  process.exit(0);
}

const files = readdirSync(PLAN_ITEMS_DIR)
  .filter(f => /^PI-\d{3}-.*\.yaml$/.test(f))
  .filter(f => {
    try {
      const mtime = statSync(resolve(PLAN_ITEMS_DIR, f)).mtimeMs;
      return (NOW - mtime) <= THIRTY_DAYS_MS;
    } catch { return false; }
  });

piChecked = files.length;

for (const file of files) {
  const content = readFileSync(resolve(PLAN_ITEMS_DIR, file), 'utf-8');
  const piId = file.match(/^(PI-\d{3})/)?.[1] ?? file;
  const fileAdvisories = [];

  // 1. wiring_checklist: with ≥3 entries
  if (!/wiring_checklist:/m.test(content)) {
    fileAdvisories.push('missing wiring_checklist: field (need ≥3 specific wiring locations)');
  } else {
    const checklistItems = (content.match(/^\s{2,}- "/gm) || []).length;
    if (checklistItems < 3) {
      fileAdvisories.push(`wiring_checklist has ${checklistItems} entries (minimum 3 — specify all wiring locations)`);
    }
  }

  // 2. enforcement_trio: field
  if (!/enforcement_trio:/m.test(content)) {
    fileAdvisories.push('missing enforcement_trio: field (T1 hook + T2 validator + T3 session + permanence)');
  }

  // 3. done_criterion or plan_summary with DONE criterion
  const hasDoneCriterion = /done_criterion:/m.test(content) ||
    /DONE criterion:/m.test(content);
  if (!hasDoneCriterion) {
    fileAdvisories.push('missing done_criterion — specify exact passing test before building');
  }

  // 4. All questions answered (no status: unanswered)
  if (/status:\s*unanswered/m.test(content)) {
    fileAdvisories.push('has unanswered questions (status: unanswered) — answer before implementing');
  }

  // 5. ep_err_pre_check: field (OPEN-021 — EP-ERR→Planning loop)
  if (!/ep_err_pre_check:/m.test(content)) {
    fileAdvisories.push(
      'missing ep_err_pre_check: field — before ratifying, list applicable error patterns from\n' +
      '    docs/plan/_handoff/VAULT/error-registry/ (EP-ERR-001 through EP-ERR-007).\n' +
      '    Format:\n' +
      '      ep_err_pre_check:\n' +
      '        - pattern: done-equals-committed\n' +
      '          applicable: true\n' +
      '          mitigation: "validate-wiring-completeness.mjs runs before done claim"\n' +
      '        - pattern: plain-path-reference\n' +
      '          applicable: false\n' +
      '          mitigation: "n/a — no doc output from this PI"'
    );
  }

  if (fileAdvisories.length > 0) {
    advisories++;
    const issues = fileAdvisories.map(a => `    • ${a}`).join('\n');
    console.warn(
      `[validate-creation-completeness] ADVISORY: ${piId} creation completeness gaps:\n` +
      `${issues}\n` +
      `  File: docs/plan/_handoff/VAULT/plan-items/${file}\n` +
      `  Reference: docs/plan/pillar-0-governance/meta-platform/plan-items.md`
    );
  }
}

console.log(`[validate-creation-completeness] pi_checked=${piChecked} advisories=${advisories}`);
process.exit(0);
