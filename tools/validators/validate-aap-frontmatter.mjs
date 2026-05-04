#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-aap-frontmatter
 * @csps-name validate-aap-frontmatter
 * @csps-description Per B_AGENT_ALIGNMENT_PROTOCOL Class A enforcer (active-mechanical S005 turn 26; multi-location coverage S007 §24+ post-close addendum). Scans EVERY SKILL.md location across CSPS — `packages/skills/<name>/SKILL.md` (platform skills) AND `.claude/skills/<name>/SKILL.md` (Claude Code auto-load skills) AND `libs/agents/<name>/agent.zmodel` (Mastra runtime; week-6+) — for AAP frontmatter coverage: csps_aligned + aap_version + agent_class + acknowledged_contracts (universal-required B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME minimum) + respects_quality_gates + output_contract + trust_tier. Missing fields fail; reports scanned/missing/aligned counts. **No-wildcards mandate:** any SKILL.md location not in coverage glob = wildcard hazard (per S007 §24+ user directive: "non aligned agent and skills are wild cards that could destroy and damage a lot of what we built here").
 * @csps-version 0.1.0
 * @csps-owner group:finky
 * @csps-lifecycle experimental
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:governance audience:developer
 * @csps-enforces P-META-010 B_AGENT_ALIGNMENT_PROTOCOL
 *
 * Usage:
 *   node tools/validators/validate-aap-frontmatter.mjs
 *
 * Exit codes:
 *   0 — all SKILL.md files have full AAP frontmatter
 *   1 — at least one SKILL.md missing required AAP fields (PR-blocking error per B_AGENT_ALIGNMENT_PROTOCOL)
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// All SKILL.md authoring locations in CSPS — every location scanned per B_AGENT_ALIGNMENT_PROTOCOL no-wildcards mandate.
// S007 §24+ post-close addendum: '.claude/skills' added (Claude Code auto-load location for 9 skills authored S007 turn 6).
// Adding a new SKILL.md location requires:
//   1. add path here
//   2. update audit-runner.md agent-alignment-coverage description
//   3. amend behavioral-contracts.md § B_AGENT_ALIGNMENT_PROTOCOL location enumeration
//   4. add to AGENTS.md hard NO scope statement
const SKILL_PATHS = ['packages/skills', '.claude/skills'];

// Universal-required B_* acknowledgments (per AAP — every Class A skill must include these minimum)
const UNIVERSAL_REQUIRED_CONTRACTS = ['B_AI_PROFESSIONAL_VOICE', 'B_VALIDATE_BEFORE_ASSUME'];

// AAP mandatory fields per agent_class A
const AAP_REQUIRED_FIELDS = [
  'csps_aligned',
  'aap_version',
  'agent_class',
  'acknowledged_contracts',
  'respects_quality_gates',
  'output_contract',
  'trust_tier',
];

const QG_FULL_SET = ['QG1', 'QG2', 'QG3', 'QG4'];

function extractFrontmatter(content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) return null;
  const end = content.indexOf('\n---', 4);
  if (end === -1) return null;
  return content.slice(content.indexOf('\n') + 1, end);
}

function checkAap(fmText) {
  const errors = [];

  // Field presence
  for (const f of AAP_REQUIRED_FIELDS) {
    if (!new RegExp(`^${f}\\s*:`, 'm').test(fmText)) {
      errors.push(`missing field "${f}"`);
    }
  }

  // csps_aligned MUST be true
  const aligned = fmText.match(/^csps_aligned\s*:\s*(true|false)/m);
  if (aligned && aligned[1] !== 'true') {
    errors.push(`csps_aligned must be true (found: ${aligned[1]})`);
  }

  // agent_class A | B | C | D
  const cls = fmText.match(/^agent_class\s*:\s*([ABCD])/m);
  if (!cls) errors.push('agent_class must be A | B | C | D');

  // Universal-required contracts present
  for (const c of UNIVERSAL_REQUIRED_CONTRACTS) {
    if (!fmText.includes(c)) {
      errors.push(`missing universal-required acknowledged_contract "${c}"`);
    }
  }

  // QG full set respected (or partial with explicit not-applicable)
  for (const qg of QG_FULL_SET) {
    if (!fmText.includes(qg)) {
      errors.push(`missing respects_quality_gates entry "${qg}"`);
    }
  }

  // trust_tier closed enum
  const tier = fmText.match(/^trust_tier\s*:\s*(quarantine|vendored|platform-owned)/m);
  if (!tier) errors.push('trust_tier must be quarantine | vendored | platform-owned');

  return errors;
}

async function findSkillMdFiles(rootRel) {
  const root = resolve(ROOT, rootRel);
  const found = [];
  try { await stat(root); } catch { return found; }
  let entries;
  try { entries = await readdir(root, { withFileTypes: true }); } catch { return found; }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillMd = join(root, entry.name, 'SKILL.md');
    try {
      await stat(skillMd);
      found.push(skillMd);
    } catch { /* no SKILL.md in this dir */ }
  }
  return found;
}

async function main() {
  const allSkillFiles = [];
  for (const p of SKILL_PATHS) {
    allSkillFiles.push(...(await findSkillMdFiles(p)));
  }

  const reports = [];
  let aligned = 0;
  let missing = 0;

  for (const file of allSkillFiles) {
    const rel = file.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
    const content = await readFile(file, 'utf8');
    const fmText = extractFrontmatter(content);
    if (!fmText) {
      reports.push({ file: rel, errors: ['no frontmatter detected'] });
      missing++;
      continue;
    }
    const errors = checkAap(fmText);
    if (errors.length === 0) {
      aligned++;
    } else {
      reports.push({ file: rel, errors });
      missing++;
    }
  }

  const summary = `[validate-aap-frontmatter] scanned=${allSkillFiles.length} missing=${missing} aligned=${aligned}`;

  if (missing > 0) {
    console.error(`\n${missing} SKILL.md file(s) missing AAP frontmatter:`);
    for (const r of reports) {
      console.error(`\n  ✗ ${r.file}:`);
      for (const e of r.errors) console.error(`      · ${e}`);
    }
    console.error(`\n${summary}`);
    process.exit(1);
  }

  console.log(`✓ all ${aligned} SKILL.md files AAP-aligned`);
  console.log(summary);
  process.exit(0);
}

main().catch((err) => {
  console.error('[validate-aap-frontmatter] fatal:', err);
  process.exit(2);
});
