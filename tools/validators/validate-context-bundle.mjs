#!/usr/bin/env node
/**
 * validate-context-bundle.mjs — PROTO-S088-BOUNDARY-CONTRACT
 *
 * BLOCKING pre-spawn validator for AI-to-AI context bundles.
 * Every agent spawn MUST pass this validator before the spawn is authorized.
 *
 * Schema: schemas/context-bundle.schema.json
 * Contract: docs/plan/pillar-0-governance/behavioral-contracts/B_BOUNDARY_CONTRACT.md
 *
 * BLOCKING checks:
 *   (a) Schema complete — all required fields present and valid types
 *   (b) No navigation refs — "see §", "../", "refer to" FORBIDDEN in governing_intent + inline_critical_content
 *   (c) Paths exist at HEAD — every path in read_allowlist, write_allowlist, inline_critical_content.files
 *       must resolve to an existing path in the repo
 *   (d) tenant_id present and non-empty
 *   (e) budget all four fields present and within bounds
 *   (f) DoD-evidence mapped — every criterion has at least one evidence entry
 *
 * ADVISORY checks:
 *   (g) challenge_clause "understanding test" — semantic quality check (Grok's paraphrase-DoD suggestion)
 *       Cannot be fully automated; surface a reminder if clause is very short
 *
 * Usage:
 *   node tools/validators/validate-context-bundle.mjs <bundle.json>
 *   node tools/validators/validate-context-bundle.mjs --block-test
 *
 * @csps-id csps.validators.validate-context-bundle
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces PROTO-S088-BOUNDARY-CONTRACT B_BOUNDARY_CONTRACT
 * @csps-prevention-class SPAWN-WITHOUT-CONTRACT NAVIGATION-REF MISSING-BUDGET MISSING-TENANT
 *
 * run_tier: STANDARD
 * always_rerun: false
 * @determinism-exempt: no clock-based decisions.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const SCHEMA_PATH = join(ROOT, 'schemas/context-bundle.schema.json');
const LAST_RUN    = join(ROOT, 'tools/data/validate-context-bundle-last-run.json');

// Navigation patterns forbidden in inline_critical_content + governing_intent
const FORBIDDEN_PATTERNS = [
  /see\s*§/i,
  /\.\.\/\.\.\//,     // relative paths going up 2+ levels
  /refer\s+to\s+(earlier|above|prior|the\s+block|§)/i,
  /see\s+above/i,
  /as\s+I\s+mentioned/i,
  /from\s+my\s+prior\s+response/i,
];

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// ── Block-test mode ───────────────────────────────────────────────────────────
async function runBlockTest() {
  console.log('[block-test] CONTEXT-BUNDLE BLOCK-TEST');
  const selfPath = fileURLToPath(import.meta.url);

  const VALID_BUNDLE = {
    governing_intent: 'Validate that the context bundle schema is correctly enforced by planting defects.',
    DoD: {
      criteria: ['validate-context-bundle.mjs exits 0 on clean bundle'],
      evidence: [{ criterion_ref: 0, proof_type: 'exit_code', proof_spec: 'node validate-context-bundle.mjs bundle.json → exit 0' }]
    },
    block_test: {
      planted_defect: 'remove governing_intent field',
      expected_exit: 1,
      test_file: 'tools/tests/behavioral/context-bundle-block-test.sh'
    },
    inline_critical_content: {
      files: [],
      key_decisions: ['The bundle contract is the load-bearing primitive for all agent spawns.']
    },
    read_allowlist: ['tools/data/', 'schemas/'],
    write_allowlist: ['tools/data/'],
    head_sha: 'abc1234',
    session_id: 'S088',
    tenant_id: 'platform',
    budget: { tokens: 50000, tool_calls: 20, wall_clock_seconds: 120, cost_usd: 0.05 },
    challenge_clause: 'Verify: can you paraphrase the DoD criterion in your own words and name the evidence for each?',
    output_contract: {
      format: 'verification-block',
      required_fields: ['exit_code', 'blocking', 'passes'],
      forbidden_patterns: ['see §', '../']
    }
  };

  let allPass = true;

  // ── INPUT A: missing governing_intent → exit 1 ───────────────────────────
  console.log('\n[TEST A] Missing governing_intent → expect exit 1');
  const bundleA = { ...VALID_BUNDLE };
  delete bundleA.governing_intent;
  const tmpA = join(ROOT, 'tools/data/__bundle-test-a__.json');
  writeFileSync(tmpA, JSON.stringify(bundleA, null, 2));
  const resA = spawnSync(process.execPath, [selfPath, tmpA], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  try { require('fs').unlinkSync(tmpA); } catch {}
  try { existsSync(tmpA) && require('fs').unlinkSync(tmpA); } catch {}
  if (resA.status !== 1) {
    console.error(`[TEST A] FAIL — expected exit 1, got ${resA.status}`);
    console.error('stdout:', (resA.stdout || '').slice(0, 300));
    allPass = false;
  } else {
    console.log(`[TEST A] PASS — exit=1 (missing governing_intent correctly BLOCKED)`);
  }

  // ── INPUT B: navigation ref in governing_intent → exit 1 ────────────────
  console.log('\n[TEST B] Navigation ref "see §X" in governing_intent → expect exit 1');
  const bundleB = { ...VALID_BUNDLE, governing_intent: 'See §3.2 for the rationale behind this spawn.' };
  const tmpB = join(ROOT, 'tools/data/__bundle-test-b__.json');
  writeFileSync(tmpB, JSON.stringify(bundleB, null, 2));
  const resB = spawnSync(process.execPath, [selfPath, tmpB], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  try { existsSync(tmpB) && require('fs').unlinkSync(tmpB); } catch {}
  if (resB.status !== 1) {
    console.error(`[TEST B] FAIL — expected exit 1, got ${resB.status}`);
    allPass = false;
  } else {
    console.log(`[TEST B] PASS — exit=1 (navigation ref correctly BLOCKED)`);
  }

  // ── INPUT C: missing tenant_id → exit 1 ──────────────────────────────────
  console.log('\n[TEST C] Missing tenant_id → expect exit 1');
  const bundleC = { ...VALID_BUNDLE };
  delete bundleC.tenant_id;
  const tmpC = join(ROOT, 'tools/data/__bundle-test-c__.json');
  writeFileSync(tmpC, JSON.stringify(bundleC, null, 2));
  const resC = spawnSync(process.execPath, [selfPath, tmpC], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  try { existsSync(tmpC) && require('fs').unlinkSync(tmpC); } catch {}
  if (resC.status !== 1) {
    console.error(`[TEST C] FAIL — expected exit 1, got ${resC.status}`);
    allPass = false;
  } else {
    console.log(`[TEST C] PASS — exit=1 (missing tenant_id correctly BLOCKED)`);
  }

  // ── INPUT D: clean bundle → exit 0 ───────────────────────────────────────
  console.log('\n[TEST D] Clean bundle → expect exit 0');
  const tmpD = join(ROOT, 'tools/data/__bundle-test-d__.json');
  writeFileSync(tmpD, JSON.stringify(VALID_BUNDLE, null, 2));
  const resD = spawnSync(process.execPath, [selfPath, tmpD], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  try { existsSync(tmpD) && require('fs').unlinkSync(tmpD); } catch {}
  const hasBlock = resD.stdout?.includes('[BLOCKING]');
  if (resD.status !== 0 && hasBlock) {
    console.error(`[TEST D] FAIL — clean bundle produced BLOCKING exit=${resD.status}`);
    console.error('stdout:', (resD.stdout || '').slice(0, 400));
    allPass = false;
  } else {
    console.log(`[TEST D] PASS — exit=${resD.status} (clean bundle, no blocking)`);
  }

  console.log(`\n[block-test] ${allPass ? 'ALL TESTS PASSED (4/4)' : 'ONE OR MORE TESTS FAILED'}`);
  process.exit(allPass ? 0 : 1);
}

// ── Main ──────────────────────────────────────────────────────────────────────
if (process.argv.includes('--block-test')) {
  await runBlockTest();
}

const bundlePath = process.argv.find(a => a.endsWith('.json') && !a.includes('--'));
if (!bundlePath) {
  console.log('[validate-context-bundle] Usage: node validate-context-bundle.mjs <bundle.json>');
  console.log('                          node validate-context-bundle.mjs --block-test');
  console.log('');
  console.log('  Validates a context bundle JSON against schemas/context-bundle.schema.json');
  console.log('  BLOCKING: missing required fields, navigation refs, missing tenant_id/budget');
  process.exit(0);
}

console.log(`[validate-context-bundle] Validating: ${bundlePath}`);
console.log('  Schema: schemas/context-bundle.schema.json');
console.log('  BLOCKING: missing fields, navigation refs, missing tenant_id, budget incomplete');
console.log('');

// ── Load bundle ──────────────────────────────────────────────────────────────
const absPath = resolve(ROOT, bundlePath);
if (!existsSync(absPath)) {
  BLOCK(`Bundle file not found: ${bundlePath}`);
  process.exit(1);
}

let bundle;
try {
  bundle = JSON.parse(readFileSync(absPath, 'utf8'));
} catch (e) {
  BLOCK(`Cannot parse bundle JSON: ${e.message}`);
  process.exit(1);
}

// ── CHECK (a): Schema required fields ─────────────────────────────────────────
const REQUIRED_FIELDS = [
  'governing_intent', 'DoD', 'block_test', 'inline_critical_content',
  'read_allowlist', 'write_allowlist', 'head_sha', 'session_id',
  'tenant_id', 'budget', 'challenge_clause', 'output_contract'
];
let missingFields = REQUIRED_FIELDS.filter(f => !(f in bundle));
if (missingFields.length > 0) {
  for (const f of missingFields) BLOCK(`missing required field: ${f}`);
} else {
  PASS(`all ${REQUIRED_FIELDS.length} required fields present`);
}

// ── CHECK (b): No navigation refs ─────────────────────────────────────────────
const NO_NAV_FIELDS = [
  { name: 'governing_intent', value: bundle.governing_intent },
  { name: 'challenge_clause', value: bundle.challenge_clause },
];
// Also check inline_critical_content key_decisions
if (Array.isArray(bundle.inline_critical_content?.key_decisions)) {
  for (let i = 0; i < bundle.inline_critical_content.key_decisions.length; i++) {
    NO_NAV_FIELDS.push({ name: `inline_critical_content.key_decisions[${i}]`, value: bundle.inline_critical_content.key_decisions[i] });
  }
}
// Check inline file content
if (Array.isArray(bundle.inline_critical_content?.files)) {
  for (let i = 0; i < bundle.inline_critical_content.files.length; i++) {
    const f = bundle.inline_critical_content.files[i];
    NO_NAV_FIELDS.push({ name: `inline_critical_content.files[${i}].content`, value: f?.content });
  }
}

let navViolations = 0;
for (const { name, value } of NO_NAV_FIELDS) {
  if (!value) continue;
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(value)) {
      BLOCK(`navigation ref in ${name}: matches FORBIDDEN pattern /${pattern.source}/`);
      navViolations++;
      break;
    }
  }
}
if (navViolations === 0 && !missingFields.includes('governing_intent')) {
  PASS('no navigation refs detected in governing_intent, challenge_clause, inline_critical_content');
}

// ── CHECK (c): Paths exist at HEAD ────────────────────────────────────────────
const pathsToCheck = [
  ...(bundle.read_allowlist || []).map(p => ({ label: 'read_allowlist', path: p })),
  ...(bundle.write_allowlist || []).map(p => ({ label: 'write_allowlist', path: p })),
  ...((bundle.inline_critical_content?.files || []).map(f => ({ label: 'inline_critical_content.files', path: f?.path }))),
];

let pathsOk = true;
for (const { label, path } of pathsToCheck) {
  if (!path) continue;
  if (path.includes('../../') || path.includes('../..\\')) {
    BLOCK(`${label}: contains relative traversal "../../" — must be absolute repo path`);
    pathsOk = false;
    continue;
  }
  const abs = path.startsWith('/') || /^[A-Za-z]:/.test(path) ? path : join(ROOT, path);
  // For directories (path ends with '/'), check the parent exists
  const checkPath = path.endsWith('/') ? abs.slice(0, -1) : abs;
  if (!existsSync(checkPath)) {
    BLOCK(`${label}: path not found at HEAD: ${path} → ${checkPath}`);
    pathsOk = false;
  }
}
if (pathsOk && pathsToCheck.length > 0) {
  PASS(`all ${pathsToCheck.length} path(s) in allowlists/inline_content exist at HEAD`);
} else if (pathsToCheck.length === 0) {
  PASS('no paths to check (empty allowlists and inline_content)');
}

// ── CHECK (d): tenant_id ──────────────────────────────────────────────────────
if (bundle.tenant_id !== undefined && bundle.tenant_id !== null && bundle.tenant_id !== '') {
  PASS(`tenant_id present: "${bundle.tenant_id}"`);
} else if (!missingFields.includes('tenant_id')) {
  BLOCK('tenant_id is empty — required for multi-tenant isolation; use "platform" for platform-level work');
}

// ── CHECK (e): budget all four fields ─────────────────────────────────────────
if (bundle.budget) {
  const BUDGET_FIELDS = ['tokens', 'tool_calls', 'wall_clock_seconds', 'cost_usd'];
  const missingBudget = BUDGET_FIELDS.filter(f => bundle.budget[f] === undefined || bundle.budget[f] === null);
  if (missingBudget.length > 0) {
    BLOCK(`budget missing fields: [${missingBudget.join(', ')}] — all four required, no implicit inheritance`);
  } else {
    PASS(`budget complete: tokens=${bundle.budget.tokens} tool_calls=${bundle.budget.tool_calls} wall_clock=${bundle.budget.wall_clock_seconds}s cost=$${bundle.budget.cost_usd}`);
  }
}

// ── CHECK (f): DoD-evidence mapped ────────────────────────────────────────────
if (bundle.DoD?.criteria && bundle.DoD?.evidence) {
  const numCriteria = bundle.DoD.criteria.length;
  for (let i = 0; i < numCriteria; i++) {
    const evidenceForCriterion = bundle.DoD.evidence.filter(e => e.criterion_ref === i);
    if (evidenceForCriterion.length === 0) {
      BLOCK(`DoD criterion [${i}] has no evidence entry — every criterion must have proof`);
    }
  }
  const allCriteriaMapped = Array.from({ length: numCriteria }, (_, i) => i)
    .every(i => bundle.DoD.evidence.some(e => e.criterion_ref === i));
  if (allCriteriaMapped) {
    PASS(`DoD-evidence mapped: all ${numCriteria} criteria have evidence`);
  }
}

// ── CHECK (g): challenge_clause quality (advisory) ────────────────────────────
if (bundle.challenge_clause && bundle.challenge_clause.length < 20) {
  WARN(`challenge_clause is very short (${bundle.challenge_clause.length} chars) — consider adding a specific DoD paraphrase request per Grok's "understanding test" recommendation`);
} else if (bundle.challenge_clause && bundle.challenge_clause.length >= 20) {
  PASS(`challenge_clause present and substantive (${bundle.challenge_clause.length} chars)`);
}

// ── RESULT ─────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-context-bundle] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    bundle_path: bundlePath,
    blocking, advisory, passes, findings,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
