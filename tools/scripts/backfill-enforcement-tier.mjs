/**
 * OPEN-049: Backfill enforcement_tier field on behavioral contracts.
 * Adds enforcement_tier to all contracts that don't have it.
 * Contracts with known T1 hooks get T1+T3 format.
 * All others get T3-only format.
 * Run: node tools/scripts/backfill-enforcement-tier.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const FILE = resolve(ROOT, 'docs/plan/pillar-0-governance/behavioral-contracts.md');
const DRY_RUN = process.argv.includes('--dry-run');

// Contracts with identified T1 hooks (name → hook)
// Conservative — only include contracts where hook-to-contract mapping is unambiguous
const T1_MAP = {
  'B_ALWAYS_GIT_LINKS': 'post-stop-link-discipline.sh (ADVISORY — S040)',
  'B_PCR_FOR_DECISIONS': 'post-stop-pcr-check.sh (ADVISORY — S040)',
  'B_GOVERNOR_PROMPTS': 'user-prompt-submit-governor-prompts.sh (STUB→ADVISORY S042)',
  'B_PRE_CLOSE_VERIFICATION': 'post-stop-pnpm-verify.sh + post-stop-session-close-gate.sh (ACTIVE)',
  'B_AGENT_ALIGNMENT_PROTOCOL': 'pre-tool-use-skill-aap-required.sh (ACTIVE)',
  'B_GRADUAL_BUILD_BY_FOUNDATIONS': 'pre-tool-use-plan-coverage-gate.sh (partial — new libs/apps files)',
  'B_TEMPLATE_FIRST_CREATION': 'pre-tool-use-frontmatter-enum-check.sh (partial — enum drift only)',
  'B_ZERO_LAPTOP_DEPENDENCY': 'pre-commit git hook via validate-laptop-patterns.mjs (ACTIVE — BLOCKING)',
  'B_HANDOFF_PRE_FLIGHT_AUDIT': 'post-stop-session-close-gate.sh (partial)',
  'B_NAMING_POLICY': 'pre-tool-use-frontmatter-enum-check.sh (partial — enum enforcement)',
};

const content = readFileSync(FILE, 'utf-8');

// Split by contract boundaries — keep the delimiter
const parts = content.split(/(?=^## B_)/m);
const header = parts[0]; // frontmatter + intro before first ## B_
const contractSections = parts.slice(1);

const SKIP_IF_HAS = /enforcement_tier/;
const hasT1 = (body) => /T1\s*(hook|:|\s+[`])/.test(body) || /tier1_hook/.test(body) || /\bT1\b/.test(body);
const hasT2 = (body) => /T2\s*(valid|:|\s+[`])/.test(body) || /tier2_valid/.test(body) || /\bT2\b/.test(body);
const hasT3 = (body) => /T3\s*(sess|inject|:|\s+[`])/.test(body) || /tier3_sess/.test(body) || /\bT3\b/.test(body);

let added = 0, skipped = 0, alreadyHas = 0;
const report = [];

const newSections = contractSections.map(section => {
  // Extract contract name from ## B_ heading
  const nameMatch = section.match(/^## (B_[A-Z0-9_]+)/);
  if (!nameMatch) return section;
  const name = nameMatch[1];

  // Skip if already has enforcement_tier
  if (SKIP_IF_HAS.test(section)) {
    alreadyHas++;
    report.push(`  SKIP (already has): ${name}`);
    return section;
  }

  // Check current T1/T2/T3 state
  const t1 = hasT1(section);
  const t2 = hasT2(section);
  const t3 = hasT3(section);
  const total = (t1 ? 1 : 0) + (t2 ? 1 : 0) + (t3 ? 1 : 0);

  if (total === 3) {
    // Validator already sees full trio — skip
    alreadyHas++;
    report.push(`  SKIP (full_trio detected): ${name}`);
    return section;
  }

  // Determine what to add
  const knownT1 = T1_MAP[name];
  let tierLine;

  if (knownT1) {
    // Has a T1 hook — T1+T3 format
    tierLine = `\n- **enforcement_tier:** \`{ tier: T1+T3, T1 hook: ${knownT1}, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low-partial }\`\n`;
    report.push(`  ADD T1+T3: ${name} → ${knownT1}`);
  } else {
    // T3-only — no T1 or T2
    tierLine = `\n- **enforcement_tier:** \`{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }\`\n`;
    report.push(`  ADD T3-only: ${name}`);
  }

  added++;
  // Append tier line before trailing newlines at end of section
  const trimmed = section.trimEnd();
  return trimmed + tierLine;
});

const result = header + newSections.join('');

console.log(`[backfill-enforcement-tier] DRY_RUN=${DRY_RUN}`);
console.log(`[backfill-enforcement-tier] Contracts processed: ${contractSections.length}`);
console.log(`[backfill-enforcement-tier] Already have enforcement_tier: ${alreadyHas}`);
console.log(`[backfill-enforcement-tier] Added enforcement_tier: ${added}`);
console.log(`[backfill-enforcement-tier] Breakdown:`);
report.forEach(r => console.log(r));

if (!DRY_RUN) {
  writeFileSync(FILE, result, 'utf-8');
  console.log(`[backfill-enforcement-tier] Written to ${FILE}`);
} else {
  console.log(`[backfill-enforcement-tier] Dry run — no file written`);
}
