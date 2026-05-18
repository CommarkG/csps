#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: P-META-019
 * behavioral_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
 * role: Scans new PI items and HANDOFF files for rules declared without enforcement_trio.
 *       Enforces the written text mandate: every plan creating a rule must declare T1+T2+T3.
 * @csps-enforces P-META-019 B_STRUCTURAL_PREVENTION_DISCIPLINE
 *
 * @csps-name validate-rule-has-enforcement
 * @csps-description Scans PI YAML items for: (1) rules stated without enforcement_trio,
 * (2) HANDOFF files without enforcement delta section. Detects DEFAULT-ME-1 pattern:
 * "written rule = done" when T1+T2 are absent. ADVISORY (exits 0) — week-4 BLOCKING.
 * @csps-version 1.0.0
 *
 * What this validator enforces (written into every plan):
 * - PI items that create behavioral rules MUST have enforcement_trio declared
 * - HANDOFF files SHOULD declare enforcement_rate delta (contracts gaining T1+T2)
 * - Plans creating "never do X" rules without T1+T2 = DEFAULT-ME-1 pattern
 *
 * AI deep instruction embedded in output:
 * Every finding explains WHY the training default fails and what the CSPS override requires.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLAN_ITEMS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/plan-items');
const HANDOFF_DIR   = resolve(ROOT, 'docs/plan/_handoff');

const WHY_AI_INSTRUCTION = `
  AI DEEP INSTRUCTION — Why this matters:
  Training default DEFAULT-ME-1: "Writing a rule = completing governance."
  CSPS override: "Written rule = 0% complete. T1+T2+T3 = 100% complete."
  Your satisfaction point MUST NOT fire at "rule exists."
  It fires ONLY at "pnpm verify exit_code=0 with T2 validator visible in output."
  Reference: docs/plan/_handoff/VAULT/inner-ai-defaults/mechanical-enforcement-defaults.md
`;

let advisories = 0;
const findings = [];

// ── PART 1: PI items — new rules without enforcement_trio ──────────────────────

if (existsSync(PLAN_ITEMS_DIR)) {
  const piFiles = readdirSync(PLAN_ITEMS_DIR).filter(f => /^PI-\d{3}-.*\.yaml$/.test(f));

  for (const file of piFiles) {
    const content = readFileSync(resolve(PLAN_ITEMS_DIR, file), 'utf-8');

    // Only check ratified/implementing PIs
    if (!/^\s*status:\s*(ratified|implementing)/m.test(content)) continue;

    // Check if PI creates a new behavioral rule
    const createsRule = /behavioral.contract|new.*contract|B_[A-Z_]{3,}|Hard NO|AGENTS\.md.*add|enforcement.trio|T1.*hook|T2.*validator/i.test(content);
    if (!createsRule) continue;

    const piId = file.match(/^(PI-\d{3})/)?.[1] ?? file;

    if (!/enforcement_trio:/m.test(content)) {
      advisories++;
      findings.push({
        type: 'PI_MISSING_ENFORCEMENT_TRIO',
        file: `docs/plan/_handoff/VAULT/plan-items/${file}`,
        id: piId,
        message: `${piId} creates a behavioral rule but has no enforcement_trio: field.`,
        instruction: `Add enforcement_trio: { t1_hook, t2_validator, t3_session, satisfaction_point } before declaring this PI complete.`
      });
    }
  }
}

// ── PART 2: Recent HANDOFFs — check for enforcement delta mention ──────────────

if (existsSync(HANDOFF_DIR)) {
  // Check last 3 HANDOFFs
  const handoffs = readdirSync(HANDOFF_DIR)
    .filter(f => /^HANDOFF-S\d+-to-S\d+\.md$/.test(f))
    .sort()
    .slice(-3);

  for (const file of handoffs) {
    const content = readFileSync(resolve(HANDOFF_DIR, file), 'utf-8');
    const sessionMatch = file.match(/HANDOFF-S(\d+)/);
    const sessionNum = sessionMatch ? Number(sessionMatch[1]) : 0;

    // Only check recent HANDOFFs (post-S040 where this was ratified)
    if (sessionNum < 40) continue;

    const hasEnforcementDelta = /enforcement.rate|T1.*T2.*added|contracts.*gained.*enforcement|blocking.*validator.*added/i.test(content);

    if (!hasEnforcementDelta) {
      advisories++;
      findings.push({
        type: 'HANDOFF_MISSING_ENFORCEMENT_DELTA',
        file: `docs/plan/_handoff/${file}`,
        id: file,
        message: `${file} does not declare enforcement delta (which contracts gained T1+T2 this session).`,
        instruction: `Add to Zone A: "contracts_gained_t1_t2: N | enforcement_rate_change: from X% to Y%"`
      });
    }
  }
}

// ── Output ─────────────────────────────────────────────────────────────────────

if (findings.length > 0) {
  console.warn(`\n⚠ [validate-rule-has-enforcement] ${findings.length} enforcement gap(s) found:\n`);
  for (const f of findings) {
    console.warn(`  TYPE: ${f.type}`);
    console.warn(`  FILE: ${f.file}`);
    console.warn(`  FINDING: ${f.message}`);
    console.warn(`  ACTION: ${f.instruction}`);
    console.warn(`  ${WHY_AI_INSTRUCTION.trim()}`);
    console.warn('');
  }
} else {
  console.log(`[validate-rule-has-enforcement] CLEAN — all rules have enforcement declarations`);
}

console.log(`[validate-rule-has-enforcement] advisories=${advisories}`);
process.exit(0); // ADVISORY — week-4 promotes to exit 1 on PI items
