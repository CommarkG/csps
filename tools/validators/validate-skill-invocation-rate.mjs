#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/ + PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 4
 * core_spine: VALD
 * governing_principle: P-META-019
 * behavioral_contract: B_STRUCTURAL_PREVENTION_DISCIPLINE
 * role: C2 prevention (EXISTS_NOT_INVOKED). Scans council-registry.md skills for non-empty
 *       trigger patterns. ADVISORY if skill has no triggers documented.
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-019
 * @behavioral-test-status: tested — council-dispatcher-test.sh A/B/C
 */

/**
 * validate-skill-invocation-rate.mjs — PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 4
 *
 * C2 prevention: skills that exist but are never invoked.
 * Validates: each skill in council-registry.md has a non-empty Trigger patterns column.
 * Advisory for skills without triggers (marks them @inactive-justified if intentional).
 *
 * Output: skills_checked=N with_triggers=N without_triggers=N advisory=N blocking=N
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REGISTRY_PATH = join(ROOT, 'docs', 'plan', 'pillar-0-governance', 'council-registry.md');

let skills_checked = 0, with_triggers = 0, without_triggers = 0, advisory = 0, blocking = 0;
const findings = [];

if (!existsSync(REGISTRY_PATH)) {
  console.log(`[validate-skill-invocation-rate] council-registry.md not found`);
  process.exit(0);
}

const content = readFileSync(REGISTRY_PATH, 'utf-8');
const lines = content.split('\n');
let inTable = false;

for (const line of lines) {
  if (line.includes('| Member |') && line.includes('| Trigger patterns |')) { inTable = true; continue; }
  if (!inTable) continue;
  if (line.startsWith('|---')) continue;
  if (!line.startsWith('| ')) { inTable = false; continue; }

  const cols = line.split(' | ').map(c => c.replace(/^\|/, '').trim());
  if (cols.length < 5) continue;

  const memberRaw = cols[0];
  const triggerPatterns = cols[4];
  if (!memberRaw || !triggerPatterns || triggerPatterns === 'Trigger patterns') continue;

  const nameMatch = memberRaw.match(/\*\*([^*]+)\*\*/) || memberRaw.match(/`([^`]+)`/);
  const skillName = nameMatch ? nameMatch[1] : memberRaw;

  skills_checked++;

  const hasTriggers = triggerPatterns.trim().length > 0 &&
    triggerPatterns !== '—' &&
    triggerPatterns !== '-' &&
    !triggerPatterns.toLowerCase().includes('@inactive');

  if (hasTriggers) {
    with_triggers++;
  } else {
    without_triggers++;
    advisory++;
    findings.push({ skill: skillName, issue: 'No trigger patterns documented', fix: 'Add trigger patterns column OR mark @inactive-justified with reason' });
  }
}

for (const f of findings.slice(0, 5)) {
  console.log(`  ⚠ ${f.skill}: ${f.issue}`);
  console.log(`    → ${f.fix}`);
}

const summary = `[validate-skill-invocation-rate] skills_checked=${skills_checked} with_triggers=${with_triggers} without_triggers=${without_triggers} advisory=${advisory} blocking=${blocking}`;
console.log(summary);

writeFileSync(
  join(ROOT, 'tools', 'data', 'validate-skill-invocation-rate-last-run.json'),
  JSON.stringify({ skills_checked, with_triggers, without_triggers, advisory, blocking, ran_at: new Date().toISOString() }, null, 2),
  'utf-8'
);

if (blocking > 0) process.exit(1);
process.exit(0);
