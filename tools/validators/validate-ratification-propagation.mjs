#!/usr/bin/env node
/**
 * @determinism-exempt: new Date()/Date.now() used only in last-run JSON metadata (ran_at field).
 * All blocking decisions are structural/deterministic (file presence, key lookup, count checks).
 * No time-dependent logic in any blocking decision path.
 *
 * @csps-dna
 * core_spine: GVRN
 * governing_principle: PROTO-S088-RATIFICATION-PROPAGATION
 * @csps-enforces PROTO-S088-RATIFICATION-PROPAGATION
 * @behavioral-test-status: structurally-proven — PASS path verified (all paths present + all keys in audit-runner);
 *   FAIL path proven by design (if creation_standard.path missing for complete entry → exit 1;
 *   if audit_runner_key not in audit-runner.md for complete entry → exit 1).
 *
 * validate-ratification-propagation.mjs — Pipeline A: ratify → engrave → creation-path → audit
 *
 * Enforces: every ratified platform standard has BOTH:
 *   (a) a creation_standard.path that EXISTS on disk
 *   (b) an audit_entry.audit_runner_key that appears in docs/plan/pillar-0-governance/audit-runner.md
 *
 * BLOCKING: any 'complete' ratified item missing either (a) or (b)
 * ADVISORY: any 'pending' or 'partial' ratified item missing surfaces (informational)
 *
 * Registry: tools/data/ratified-standards.yaml
 * Registered: audit-runner.md `ratification_propagation` (PROTO-S088-RATIFICATION-PROPAGATION)
 *
 * Standing rule (Governor ratified S087):
 *   ratified ⇒ platform standard + audit.
 *   Every ratification triggers: (a) creation-path update, (b) audit-runner entry,
 *   (c) row in tools/data/ratified-standards.yaml.
 *   This validator makes the rule mechanical.
 *
 * @csps-id csps.tools.validators.validate-ratification-propagation
 * @csps-name validate-ratification-propagation
 * @csps-description Pipeline A: every ratified standard has creation-standard + audit-runner entry.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-prevention-class RATIFY-WITHOUT-PROPAGATION
 *
 * load_mode: standard
 * justification: ratification registry changes only when new standards are ratified (infrequent)
 */

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const REGISTRY_PATH    = resolve(ROOT, 'tools/data/ratified-standards.yaml');
const AUDIT_RUNNER_PATH = resolve(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
const LAST_RUN_PATH    = resolve(ROOT, 'tools/data/validate-ratification-propagation-last-run.json');

let blocking = 0;
let advisory = 0;
const findings = [];
const passes = [];
let standards_checked = 0;
let standards_complete = 0;
let standards_pending = 0;

function addBlocking(id, msg) {
  const full = `[${id}] ${msg}`;
  findings.push({ level: 'BLOCKING', id, msg });
  blocking++;
  console.log(`  ✗ [BLOCKING] ${full}`);
}

function addAdvisory(id, msg) {
  const full = `[${id}] ${msg}`;
  findings.push({ level: 'ADVISORY', id, msg });
  advisory++;
  console.log(`  ⚠ [ADVISORY] ${full}`);
}

function addPass(id, msg) {
  passes.push(`[${id}] ${msg}`);
  console.log(`  ✓ [${id}] ${msg}`);
}

console.log('[validate-ratification-propagation] Pipeline A: ratify → engrave → creation-path → audit\n');

// ── PREREQUISITES ─────────────────────────────────────────────────────────────
if (!existsSync(REGISTRY_PATH)) {
  console.log('[validate-ratification-propagation] FAIL: ratified-standards.yaml missing (BLOCKING)');
  const result = { blocking: 1, advisory: 0, findings: [{ level: 'BLOCKING', msg: 'ratified-standards.yaml missing' }], ran_at: new Date().toISOString() };
  writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));
  process.exit(1);
}

if (!existsSync(AUDIT_RUNNER_PATH)) {
  console.log('[validate-ratification-propagation] FAIL: audit-runner.md missing (BLOCKING)');
  const result = { blocking: 1, advisory: 0, findings: [{ level: 'BLOCKING', msg: 'audit-runner.md missing' }], ran_at: new Date().toISOString() };
  writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));
  process.exit(1);
}

const registryRaw = readFileSync(REGISTRY_PATH, 'utf-8').replace(/\r\n/g, '\n');
const auditRunnerRaw = readFileSync(AUDIT_RUNNER_PATH, 'utf-8').replace(/\r\n/g, '\n');

// ── PARSE STANDARD ENTRIES (simple line-scan) ─────────────────────────────────
// Each standard starts with "  - id:" at 2-space indent
// Extract id, propagation_status, creation_standard.path, audit_entry.audit_runner_key

const standardBlocks = [];
const lines = registryRaw.split('\n');
let currentBlock = null;
let inStandards = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect "standards:" section
  if (line.trim() === 'standards:') {
    inStandards = true;
    continue;
  }
  if (!inStandards) continue;

  // New standard entry
  const idMatch = line.match(/^  - id:\s+(.+)$/);
  if (idMatch) {
    if (currentBlock) standardBlocks.push(currentBlock);
    currentBlock = {
      id: idMatch[1].trim(),
      raw: line + '\n',
      propagation_status: 'complete',   // default: complete means both surfaces must be wired
      creation_path: null,
      audit_key: null,
    };
    continue;
  }

  if (!currentBlock) continue;
  currentBlock.raw += line + '\n';

  // Extract propagation_status
  const statusMatch = line.match(/^\s+propagation_status:\s+(.+)$/);
  if (statusMatch) {
    currentBlock.propagation_status = statusMatch[1].trim().replace(/['"]/g, '');
  }

  // Extract creation_standard.path (line after "    path:")
  const pathMatch = line.match(/^      path:\s+(.+)$/);
  if (pathMatch) {
    const val = pathMatch[1].trim().replace(/['"]/g, '');
    if (val !== 'null') {
      // Only capture the FIRST path line (creation_standard.path, not audit_entry's path if any)
      if (currentBlock.creation_path === null) {
        currentBlock.creation_path = val;
      }
    }
  }

  // Extract audit_entry.audit_runner_key
  const keyMatch = line.match(/^\s+audit_runner_key:\s+(.+)$/);
  if (keyMatch) {
    const val = keyMatch[1].trim().replace(/['"]/g, '');
    if (val !== 'null') {
      currentBlock.audit_key = val;
    }
  }
}
if (currentBlock) standardBlocks.push(currentBlock);

console.log(`Checking ${standardBlocks.length} ratified standard(s):\n`);

// ── CHECK EACH STANDARD ────────────────────────────────────────────────────────
for (const std of standardBlocks) {
  standards_checked++;
  const isPending = ['pending', 'partial'].includes(std.propagation_status);

  if (isPending) {
    standards_pending++;
    addAdvisory(std.id, `propagation_status=${std.propagation_status} — creation-standard and audit not yet wired`);
    continue;
  }

  // propagation_status: complete → BOTH surfaces must be wired → BLOCKING if missing
  standards_complete++;
  let stdOk = true;

  // (a) creation_standard.path must exist on disk
  if (!std.creation_path) {
    addBlocking(std.id, 'creation_standard.path is null or missing (complete entry requires a real path)');
    stdOk = false;
  } else {
    const fullPath = resolve(ROOT, std.creation_path);
    if (!existsSync(fullPath)) {
      addBlocking(std.id, `creation_standard.path not found on disk: ${std.creation_path}`);
      stdOk = false;
    } else {
      addPass(std.id, `creation_standard.path exists: ${std.creation_path}`);
    }
  }

  // (b) audit_runner_key must appear in audit-runner.md
  if (!std.audit_key) {
    addBlocking(std.id, 'audit_entry.audit_runner_key is null or missing (complete entry requires an audit key)');
    stdOk = false;
  } else {
    // Check for key in audit-runner.md (as backtick-wrapped key in a table row)
    const keyPattern = `\`${std.audit_key}\``;
    if (!auditRunnerRaw.includes(keyPattern)) {
      addBlocking(std.id, `audit_runner_key "${std.audit_key}" not found in audit-runner.md`);
      stdOk = false;
    } else {
      addPass(std.id, `audit_runner_key "${std.audit_key}" found in audit-runner.md`);
    }
  }

  if (stdOk) {
    addPass(std.id, 'BOTH creation-standard and audit-runner wired ✓');
  }
}

// ── RESULT ────────────────────────────────────────────────────────────────────
const result = {
  blocking,
  advisory,
  passes: passes.length,
  standards_checked,
  standards_complete,
  standards_pending,
  findings,
  ran_at: new Date().toISOString(),
};

writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));

console.log('');
console.log(`[validate-ratification-propagation] standards_checked=${standards_checked} complete=${standards_complete} pending=${standards_pending}`);
if (blocking > 0) {
  console.log(`[validate-ratification-propagation] FAIL blocking=${blocking} advisory=${advisory}`);
  process.exit(1);
} else {
  console.log(`[validate-ratification-propagation] PASS blocking=0 advisory=${advisory} passes=${passes.length}`);
  process.exit(0);
}
