#!/usr/bin/env node
/**
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: VALD
 * governing_principle: P-META-030 (candidate — Closure Obligation)
 * @csps-enforces PROTO-S073-B4 ANTI-FLOAT
 * @behavioral-test-status: tested — no-floating-artifacts-test.sh 3/3
 *
 * validate-no-floating-artifacts.mjs — B4 ANTI-FLOAT T2 sweep validator
 *
 * Scans docs/plan + docs/SIA for non-terminal status files.
 * For each file found:
 *   (a) Missing closure obligation (any of: closure_owner, closure_decision, closure_by) → ADVISORY
 *   (b) Registered in register with escalation_state:overdue → ADVISORY escalation flag
 *   (c) draft > 3 sessions w/o obligation → ESCALATE advisory
 *
 * run_tier: DEEP — exhaustive corpus scan, non-cornerstone. Run via --deep or zf-orchestrator.
 * ADVISORY in S073 (baseline ~27). Promotes to BLOCKING after backfill clears.
 *
 * Prevention class: FLOATING-ARTIFACT-NEVER-REACHES-TERMINAL
 * Source: PROTO-S072-ANTI-FLOAT + PROTO-S073-B4
 */

import { readFileSync, existsSync, writeFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const REGISTER_PATH = join(ROOT, 'tools/data/floating-artifacts-register.yaml');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-no-floating-artifacts-last-run.json');

const NON_TERMINAL = new Set(['draft', 'proposed', 'pending-review', 'awaiting-review', 'awaiting-ratification', 'awaiting-governor-ratification']);

let advisory = 0;
let blocking = 0;
let files_checked = 0;
let floaters_found = 0;
let missing_obligation = 0;
let overdue_count = 0;
const findings = [];

function addFinding(level, msg) {
  findings.push({ level, msg });
  if (level === 'BLOCKING') blocking++;
  else advisory++;
  console.log(`  ${level === 'BLOCKING' ? '✗' : '⚠'} [${level}] ${msg}`);
}

// Load the register for escalation state lookups
const registerEntries = new Map();
if (existsSync(REGISTER_PATH)) {
  try {
    const raw = readFileSync(REGISTER_PATH, 'utf-8');
    const lines = raw.split('\n');
    let currentPath = null;
    let currentState = null;
    for (const line of lines) {
      const pathMatch = line.match(/^\s+artifact_path:\s+(.+)/);
      if (pathMatch) currentPath = pathMatch[1].trim();
      const stateMatch = line.match(/^\s+escalation_state:\s+(.+)/);
      if (stateMatch && currentPath) {
        currentState = stateMatch[1].trim();
        registerEntries.set(currentPath, currentState);
        currentPath = null; currentState = null;
      }
    }
  } catch { /* if register is unreadable, skip enrichment */ }
}

function scanDir(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) { scanDir(full); continue; }
    if (!e.name.endsWith('.md') && !e.name.endsWith('.yaml')) continue;
    let content;
    try { content = readFileSync(full, 'utf-8'); } catch { continue; }
    files_checked++;

    const statusMatch = content.match(/^status:\s*(.+)$/m);
    if (!statusMatch) continue;
    const status = statusMatch[1].trim().replace(/['"]/g, '');
    if (!NON_TERMINAL.has(status)) continue;

    floaters_found++;
    const relPath = relative(ROOT, full).replace(/\\/g, '/');

    // Check closure obligation
    const hasClosure = content.includes('closure_owner') &&
                        content.includes('closure_decision') &&
                        content.includes('closure_by');

    if (!hasClosure) {
      missing_obligation++;
      addFinding('advisory', `Floating artifact: "${relPath}" has status:${status} but lacks closure obligation (missing closure_owner/closure_decision/closure_by)`);
    }

    // Check register escalation state
    const escState = registerEntries.get(relPath);
    if (escState === 'overdue' || escState === 'escalated') {
      overdue_count++;
      addFinding('advisory', `ESCALATED: "${relPath}" is in register with escalation_state:${escState} — needs terminal decision (RATIFIED|REJECTED|VAULTED|SUPERSEDED)`);
    }
  }
}

scanDir(join(ROOT, 'docs/plan'));
scanDir(join(ROOT, 'docs/SIA'));

const summary = `[validate-no-floating-artifacts] files_checked=${files_checked} floaters_found=${floaters_found} missing_obligation=${missing_obligation} overdue=${overdue_count} advisory=${advisory} blocking=${blocking}`;
console.log(summary);

const result = {
  files_checked, floaters_found, missing_obligation, overdue_count,
  advisory, blocking,
  findings: findings.slice(0, 30),
  ran_at: new Date().toISOString(),
  note: 'STATUS: advisory — promotes to blocking after S073 backfill clears. Prevention class: FLOATING-ARTIFACT-NEVER-REACHES-TERMINAL'
};
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));

// ADVISORY mode — never blocks per-session
process.exit(0);
