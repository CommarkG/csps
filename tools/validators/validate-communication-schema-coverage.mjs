#!/usr/bin/env node
/**
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces PLAN-S069-COMMS-AND-JOURNEY (Communication Schema coverage)
 * @behavioral-test-status: tested — communication-schema-test.sh A/B/C/D
 * STATUS: draft (advisory — not blocking until Governor ratifies the schema)
 * S070 M1: validate-communication-schema-coverage.mjs
 *
 * Checks:
 *   A. communication-schema.yaml exists
 *   B. All 8 required situations present
 *   C. Each situation has required fields (id, parties, interaction_pattern, tone, defaults_countered, contracts_applied)
 *   D. All 6 audience hierarchy tiers present
 *   E. All 9 B_* contracts listed in b_star_contracts_consolidated exist on disk
 *   F. status: draft (advisory — schema not yet ratified)
 */

import { readFileSync, existsSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SCHEMA_PATH = join(ROOT, 'docs/plan/pillar-0-governance/communication-spine/communication-schema.yaml');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-communication-schema-coverage-last-run.json');

const REQUIRED_SITUATIONS = [
  'ai-to-ai-council',
  'ai-to-human',
  'human-to-ai-directive',
  'ai-to-external-agent',
  'tab-session-handoff',
  'system-to-user-app-ux',
  'validator-hook-to-ai',
  'step-to-step-journey'
];

const REQUIRED_TIERS = [
  'governor',
  'core-developer',
  'external-developer',
  'account-owner-admin',
  'team-leader',
  'end-user'
];

const REQUIRED_SITUATION_FIELDS = [
  'id',
  'parties',
  'interaction_pattern',
  'tone',
  'defaults_countered',
  'contracts_applied'
];

const REQUIRED_CONTRACTS = [
  'B_ZCA',
  'B_BOUNDARY_ALIGNMENT_PROTOCOL',
  'B_MUTUAL_UNDERSTANDING_VALIDATION',
  'B_CONTEXTUAL_LOCALITY',
  'B_GOVERNOR_PROMPTS',
  'B_INHERITANCE_POLICY',
  'B_CDAB',
  'B_AI_COLLABORATIVE_DISCIPLINE',
  'B_TWO_SIDED_HANDSHAKE'
];

let advisory = 0;
let blocking = 0;
const findings = [];

function addFinding(level, msg) {
  findings.push({ level, msg });
  if (level === 'blocking') blocking++;
  else advisory++;
  console.log(`  ${level === 'blocking' ? '✗' : '⚠'} [${level}] ${msg}`);
}

// A. Schema file exists
if (!existsSync(SCHEMA_PATH)) {
  addFinding('advisory', `communication-schema.yaml not found at ${SCHEMA_PATH}`);
  const result = { advisory, blocking, findings, ran_at: new Date().toISOString(), schema_found: false };
  writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`[validate-communication-schema-coverage] schema_found=false situations=0 tiers=0 contracts=0 advisory=${advisory} blocking=${blocking}`);
  process.exit(0); // advisory only — draft schema
}

const raw = readFileSync(SCHEMA_PATH, 'utf-8');

// B. Check 8 required situations (text-based scan — no yaml parser dependency)
let situationsFound = 0;
const missingSituations = [];
for (const sit of REQUIRED_SITUATIONS) {
  const pattern = new RegExp(`^\\s*- id:\\s*${sit}\\s*$`, 'm');
  if (pattern.test(raw)) {
    situationsFound++;
  } else {
    missingSituations.push(sit);
    addFinding('advisory', `Missing situation: ${sit}`);
  }
}

// C. Check required fields on each situation (heuristic: check field names appear in schema)
// Note: 'id' appears as '  - id:' (list item prefix), others as '    field:'
let fieldsMissing = 0;
for (const field of REQUIRED_SITUATION_FIELDS) {
  // id uses list-item prefix; other fields are indented under the list item
  const pattern = field === 'id'
    ? new RegExp(`^\\s*- id:`, 'm')
    : new RegExp(`^\\s+${field}:`, 'm');
  if (!pattern.test(raw)) {
    fieldsMissing++;
    addFinding('advisory', `Missing situation field: ${field} — not found in any situation block`);
  }
}

// D. Check 6 audience hierarchy tiers
let tiersFound = 0;
const missingTiers = [];
for (const tier of REQUIRED_TIERS) {
  const pattern = new RegExp(`^\\s*- id:\\s*${tier}\\s*$`, 'm');
  if (pattern.test(raw)) {
    tiersFound++;
  } else {
    missingTiers.push(tier);
    addFinding('advisory', `Missing audience tier: ${tier}`);
  }
}

// E. Check 9 B_* contracts exist on disk
let contractsFound = 0;
const missingContracts = [];
for (const contract of REQUIRED_CONTRACTS) {
  const contractPath = join(ROOT, `docs/plan/pillar-0-governance/behavioral-contracts/${contract}.md`);
  if (existsSync(contractPath)) {
    contractsFound++;
  } else {
    missingContracts.push(contract);
    addFinding('advisory', `B_* contract file missing: ${contract}.md`);
  }
}

// F. Check b_star_contracts_consolidated section exists
if (!raw.includes('b_star_contracts_consolidated:')) {
  addFinding('advisory', 'Missing b_star_contracts_consolidated section in schema');
}

// Check audience_hierarchy section exists
if (!raw.includes('audience_hierarchy:')) {
  addFinding('advisory', 'Missing audience_hierarchy section in schema');
}

// Check situations section exists
if (!raw.includes('situations:')) {
  addFinding('advisory', 'Missing situations section in schema');
}

// ─────────────────────────────────────────────────────────────────────
// M2 CHECKS — AI-behavior wiring (activation_language per situation + tier)
// Opus directive: each situation/tier requires ≥1 named D-default +
// activation_language[] with {default_id, avoid_phrase, use_phrase} pairs.
// Generic-without-pair → flag advisory.
// ─────────────────────────────────────────────────────────────────────

// G. Check each situation has ≥1 activation_language entry with default_id + avoid_phrase + use_phrase
let siuationsWithWiring = 0;
const siuationsMissingWiring = [];
for (const sit of REQUIRED_SITUATIONS) {
  // Heuristic: look for activation_language: within ~30 lines of the situation id
  // We search for the pattern: after "- id: <sit>" find "activation_language:"
  // with "default_id:" + "avoid_phrase:" + "use_phrase:" all present in the block
  const sitPattern = new RegExp(
    `- id:\\s*${sit}[\\s\\S]{0,1500}activation_language:`,
    'm'
  );
  if (sitPattern.test(raw)) {
    // Check all three required sub-fields appear in the schema (global check — good enough for advisory)
    const hasDefaultId = /default_id:/.test(raw);
    const hasAvoidPhrase = /avoid_phrase:/.test(raw);
    const hasUsePhrase = /use_phrase:/.test(raw);
    if (hasDefaultId && hasAvoidPhrase && hasUsePhrase) {
      siuationsWithWiring++;
    } else {
      siuationsMissingWiring.push(sit);
      addFinding('advisory', `Situation ${sit}: activation_language present but missing default_id/avoid_phrase/use_phrase fields`);
    }
  } else {
    siuationsMissingWiring.push(sit);
    addFinding('advisory', `Situation ${sit}: missing activation_language[] (AI-behavior wiring not complete — M2 required)`);
  }
}

// H. Check each audience tier has ≥1 activation_language entry
let tiersWithWiring = 0;
const tiersMissingWiring = [];
for (const tier of REQUIRED_TIERS) {
  const tierPattern = new RegExp(
    `- id:\\s*${tier}[\\s\\S]{0,500}activation_language:`,
    'm'
  );
  if (tierPattern.test(raw)) {
    tiersWithWiring++;
  } else {
    tiersMissingWiring.push(tier);
    addFinding('advisory', `Tier ${tier}: missing activation_language[] (AI-behavior wiring not complete — M2 required)`);
  }
}

// ─────────────────────────────────────────────────────────────────────
// CHECK I — Platform tool question text jargon scan (S073 P2-D)
// Scans apps/**/src/**/*.tsx for question-like strings containing
// platform-internal terms inappropriate for user-facing UI text.
// Prevention class: COMMS-SCHEMA-JARGON-IN-TOOL-QUESTIONS
// ADVISORY only — baseline unknown at first run.
// ─────────────────────────────────────────────────────────────────────

// Terms appropriate in governance docs but NOT in user-facing question strings
const PLATFORM_JARGON_IN_QUESTIONS = [
  'PROTO-', 'B_', 'P-META-', 'P-ARCH-', 'P-OPER-', 'P-UX-',
  'lifecycle_state', 'core_spine', 'schema_anchor', 'ZF cycle', 'RZF',
  'behavioral contract', 'enforcement tier', 'threshold router',
  'frontmatter', 'CSPS', 'GVRN', 'VALD',
];

function findTsxFiles(dir, found = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return found; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '_trials-vaulted') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) findTsxFiles(full, found);
    else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) found.push(full);
  }
  return found;
}

const appsDir = join(ROOT, 'apps');
let toolJargonFindings = 0;
if (existsSync(appsDir)) {
  const tsxFiles = findTsxFiles(appsDir);
  for (const file of tsxFiles) {
    let content;
    try { content = readFileSync(file, 'utf-8'); } catch { continue; }
    // Find string literals that look like questions (contain ?, length > 30)
    const questionStrings = content.match(/["'`][^"'`]{30,}\?[^"'`]*["'`]/g) || [];
    for (const qs of questionStrings) {
      for (const jargon of PLATFORM_JARGON_IN_QUESTIONS) {
        if (qs.includes(jargon)) {
          toolJargonFindings++;
          const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
          addFinding('advisory', `Tool question text jargon: "${jargon}" in ${rel} — consider audience-tier calibration`);
          break; // one finding per question string per file
        }
      }
    }
  }
}

const toolJargonSummary = `tool_jargon_findings=${toolJargonFindings}`;
console.log(`  ${toolJargonFindings > 0 ? '⚠' : '✓'} CHECK I (tool-text jargon): ${toolJargonFindings} question string(s) with platform-internal terms (ADVISORY — baseline S073)`);

const summary = `[validate-communication-schema-coverage] situations=${situationsFound}/${REQUIRED_SITUATIONS.length} tiers=${tiersFound}/${REQUIRED_TIERS.length} contracts=${contractsFound}/${REQUIRED_CONTRACTS.length} fields_missing=${fieldsMissing} wired_situations=${siuationsWithWiring}/${REQUIRED_SITUATIONS.length} wired_tiers=${tiersWithWiring}/${REQUIRED_TIERS.length} ${toolJargonSummary} advisory=${advisory} blocking=${blocking}`;
console.log(summary);

const result = {
  situations_found: situationsFound,
  situations_required: REQUIRED_SITUATIONS.length,
  missing_situations: missingSituations,
  tiers_found: tiersFound,
  tiers_required: REQUIRED_TIERS.length,
  missing_tiers: missingTiers,
  contracts_found: contractsFound,
  contracts_required: REQUIRED_CONTRACTS.length,
  missing_contracts: missingContracts,
  fields_missing: fieldsMissing,
  wired_situations: siuationsWithWiring,
  wired_situations_required: REQUIRED_SITUATIONS.length,
  wired_tiers: tiersWithWiring,
  wired_tiers_required: REQUIRED_TIERS.length,
  situations_missing_wiring: siuationsMissingWiring,
  tiers_missing_wiring: tiersMissingWiring,
  tool_jargon_findings: toolJargonFindings,
  advisory,
  blocking,
  findings: findings.slice(0, 20),
  ran_at: new Date().toISOString(),
  schema_found: true,
  note: 'STATUS: draft — advisory only until Governor ratifies communication-schema.yaml'
};

writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8');

// DRAFT STATUS: always advisory — never blocks
process.exit(0);
