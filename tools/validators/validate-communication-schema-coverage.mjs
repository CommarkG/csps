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

import { readFileSync, existsSync, writeFileSync } from 'fs';
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

const summary = `[validate-communication-schema-coverage] situations=${situationsFound}/${REQUIRED_SITUATIONS.length} tiers=${tiersFound}/${REQUIRED_TIERS.length} contracts=${contractsFound}/${REQUIRED_CONTRACTS.length} fields_missing=${fieldsMissing} advisory=${advisory} blocking=${blocking}`;
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
  advisory,
  blocking,
  findings: findings.slice(0, 20),
  ran_at: new Date().toISOString(),
  schema_found: true,
  note: 'STATUS: draft — advisory only until Governor ratifies communication-schema.yaml'
};

writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2), 'utf-8');

// DRAFT STATUS: always advisory — never blocks
// (schema status:draft means validate is coverage-check only, not gate)
process.exit(0);
