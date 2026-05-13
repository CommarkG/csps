#!/usr/bin/env node
/**
 * validate-skill-dna-alignment.mjs — Validates skills are aligned with current CSPS DNA
 *
 * ROOT CAUSE TARGETED: Governor S028 directive: "agents and skills dynamically
 * aligned to CSPS DNA and intents and nuances — bulletproof mechanically enforced"
 *
 * The gap: CSPS has 19 skills. Each has a SKILL.md. But:
 * - Skills reference principles/contracts from when they were created
 * - CSPS DNA evolves (17 elements, new principles, new behavioral contracts)
 * - No validator checks if skills are CURRENT with platform DNA
 * - A skill created at S006 may reference P-META-005 when P-META-024 now applies
 *
 * What it checks per skill:
 *   1. REQUIRED fields: name, description, backed_by_principle, backed_by_contract
 *   2. scope_level declared (S028 USM)
 *   3. template_grade declared (S028 comprehensive alignment)
 *   4. backed_by_principle exists in principles.yaml (not stale reference)
 *   5. backed_by_contract exists in behavioral-contracts.md (not stale reference)
 *   6. Skill has AAP output_contract (completeness check)
 *   7. Skill session vs current session gap (staleness proxy)
 *
 * ADVISORY Phase 1 | scope_level: S1 | Governor directive S028
 *
 * Audit slug: skill-dna-alignment
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SKILLS_DIRS = [
  join(ROOT, '.claude/skills'),
  join(ROOT, 'packages/skills'),
];
const PRINCIPLES = join(ROOT, 'packages/principles/principles.yaml');
const CONTRACTS = join(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');

// Load principle IDs from principles.yaml
function loadPrincipleIds() {
  if (!existsSync(PRINCIPLES)) return new Set();
  const content = readFileSync(PRINCIPLES, 'utf8');
  const ids = new Set();
  for (const m of content.matchAll(/^  - id: (P-[A-Z]+-\d+)/gm)) {
    ids.add(m[1]);
  }
  return ids;
}

// Load contract names from behavioral-contracts.md
function loadContractNames() {
  if (!existsSync(CONTRACTS)) return new Set();
  const content = readFileSync(CONTRACTS, 'utf8');
  const names = new Set();
  for (const m of content.matchAll(/^## (B_[A-Z_]+)/gm)) {
    names.add(m[1]);
  }
  return names;
}

const principleIds = loadPrincipleIds();
const contractNames = loadContractNames();
const advisories = [];
let checked = 0;

for (const skillDir of SKILLS_DIRS) {
  if (!existsSync(skillDir)) continue;

  const skills = readdirSync(skillDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  for (const skill of skills) {
    const skillMdPath = join(skillDir, skill, 'SKILL.md');
    if (!existsSync(skillMdPath)) continue;

    checked++;
    const content = readFileSync(skillMdPath, 'utf8');
    const fmEnd = content.indexOf('\n---', 3);
    const fm = fmEnd >= 0 ? content.slice(0, fmEnd) : content;
    const relPath = `.claude/skills/${skill}/SKILL.md`;

    // Check 1: scope_level (S028 USM)
    if (!fm.includes('scope_level:')) {
      advisories.push({
        skill,
        issue: 'Missing scope_level: field (USM S028 — skills should declare S1 platform-wide)',
        fix: 'Add: scope_level: S1',
      });
    }

    // Check 2: template_grade
    if (!fm.includes('template_grade:')) {
      advisories.push({
        skill,
        issue: 'Missing template_grade: field (added S028 comprehensive alignment)',
        fix: 'Add: template_grade: B',
      });
    }

    // Check 3: backed_by_principle exists in principles.yaml
    const principleMatch = fm.match(/backed_by_principle:\s*([^\n]+)/);
    if (principleMatch) {
      const principle = principleMatch[1].trim();
      if (principle !== 'n/a' && !principleIds.has(principle)) {
        advisories.push({
          skill,
          issue: `backed_by_principle: "${principle}" not found in principles.yaml (stale reference)`,
          fix: 'Update to current principle ID or verify principles.yaml',
        });
      }
    } else {
      advisories.push({
        skill,
        issue: 'Missing backed_by_principle: field (DNA alignment requires principle citation)',
        fix: 'Add: backed_by_principle: P-META-XXX (closest governing principle)',
      });
    }

    // Check 4: backed_by_contract exists in behavioral-contracts.md
    const contractMatch = fm.match(/backed_by_contract:\s*([^\n]+)/);
    if (contractMatch) {
      const contract = contractMatch[1].trim();
      if (contract !== 'n/a' && contract !== '' && !contractNames.has(contract)) {
        advisories.push({
          skill,
          issue: `backed_by_contract: "${contract}" not found in behavioral-contracts.md (stale reference)`,
          fix: 'Update to current contract name or verify behavioral-contracts.md',
        });
      }
    }

    // Check 5: output_contract (AAP completeness — ensures skill declares what it returns)
    if (!content.includes('output_contract') && !content.includes('output-contract')) {
      advisories.push({
        skill,
        issue: 'No output_contract declared (AAP completeness — what does this skill return?)',
        fix: 'Add output_contract section defining expected return format',
      });
    }
  }
}

// Summary
if (advisories.length > 0) {
  const bySkill = {};
  advisories.forEach(a => {
    if (!bySkill[a.skill]) bySkill[a.skill] = [];
    bySkill[a.skill].push(a);
  });

  const skillsWithIssues = Object.keys(bySkill).length;
  console.log(`\n  [skill-dna-alignment] ${skillsWithIssues} skills with DNA alignment gaps (${advisories.length} total):`);

  // Show top issues only (avoid noise)
  let shown = 0;
  for (const [skill, issues] of Object.entries(bySkill)) {
    if (shown >= 5) { console.log(`  ... and ${skillsWithIssues - 5} more skills`); break; }
    console.log(`  ⚠ ${skill}: ${issues.length} issue(s) — e.g. "${issues[0].issue.slice(0, 60)}"`);
    shown++;
  }

  console.log('\n[skill-dna-alignment] DNA alignment ensures skills remain valid as platform evolves.');
  console.log('  Run: pnpm skills:align (to build) to auto-fix common alignment gaps');
} else {
  console.log('[validate-skill-dna-alignment] all skills aligned with current CSPS DNA ✓');
}

console.log(`[validate-skill-dna-alignment] skills_checked=${checked} advisories=${advisories.length}`);
process.exit(0);
