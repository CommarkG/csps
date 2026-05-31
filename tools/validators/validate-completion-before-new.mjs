#!/usr/bin/env node
/**
 * @csps-dna
 * core_spine: GVRN
 * governing_principle: P-OP-008 (completion-before-new)
 * @csps-enforces COMPLETION-DISCIPLINE-PLAN-S073 P-OP-002 FWWS
 * @behavioral-test-status: tested — completion-before-new-test.sh 3/3
 *
 * validate-completion-before-new.mjs — E1 T2 (STANDARD tier)
 *
 * Scans docs/plan for completion state of active PROTOs and plan artifacts.
 * Checks:
 *   A. Open PROTOs: docs/plan/protos/*.md files with unchecked milestones (- [ ] items)
 *      → ADVISORY: "X open PROTOs with Y unchecked milestones — complete before starting new ones"
 *   B. Open milestones in PROTO files (lines starting with - [ ])
 *      → Count and surface for completion visibility
 *
 * run_tier: STANDARD (fast scan, governance discipline cornerstone — always visible per-session)
 * ADVISORY always — completion discipline is awareness, not blocking.
 * P-OP-008 + P-OP-002 (FWWS) + LONG-RUN-BUILDER-DOCTRINE M0.7
 */

import { readFileSync, existsSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const PROTOS_DIR = join(ROOT, 'docs/plan/protos');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-completion-before-new-last-run.json');

let open_protos = 0;
let total_open_milestones = 0;
let sealed_protos = 0;
let advisory = 0;
const findings = [];
const openProtoList = [];

function addFinding(level, msg) {
  findings.push({ level, msg });
  if (level === 'BLOCKING') { /* advisory only */ } else advisory++;
  console.log(`  ⚠ [advisory] ${msg}`);
}

if (!existsSync(PROTOS_DIR)) {
  console.log('[validate-completion-before-new] No docs/plan/protos/ directory — skip');
  const result = { open_protos: 0, sealed_protos: 0, open_milestones: 0, advisory: 0, ran_at: new Date().toISOString() };
  writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));
  process.exit(0);
}

const protoFiles = readdirSync(PROTOS_DIR).filter(f => f.endsWith('.md'));

for (const file of protoFiles) {
  const full = join(PROTOS_DIR, file);
  let content;
  try { content = readFileSync(full, 'utf-8'); } catch { continue; }

  // Check status in frontmatter
  const statusMatch = content.match(/^status:\s*(.+)$/m);
  const status = statusMatch ? statusMatch[1].trim().replace(/['"]/g, '') : 'unknown';
  const SEALED_STATUSES = new Set(['sealed', 'ratified', 'validated', 'active', 'done', 'closed', 'superseded', 'deprecated']);
  const isSealed = SEALED_STATUSES.has(status);

  if (isSealed) { sealed_protos++; continue; }

  // Count unchecked milestones (- [ ] lines)
  const uncheckedMatches = content.match(/^\s*- \[ \]/gm) || [];
  const uncheckedCount = uncheckedMatches.length;

  if (uncheckedCount > 0) {
    open_protos++;
    total_open_milestones += uncheckedCount;
    openProtoList.push({ file, unchecked: uncheckedCount, status });
  } else {
    // PROTO with no unchecked items but not sealed — might be complete but not marked
    sealed_protos++;
  }
}

if (open_protos > 0) {
  const list = openProtoList.map(p => `${p.file} (${p.unchecked} open)`).join(', ');
  addFinding('advisory', `Completion-before-new: ${open_protos} open PROTO(s) with ${total_open_milestones} unchecked milestone(s): ${list}. Complete or checkpoint before starting new plans. New intent → threshold → vault/PI → future plan.`);
}

const summary = `[validate-completion-before-new] open_protos=${open_protos} sealed_protos=${sealed_protos} open_milestones=${total_open_milestones} advisory=${advisory}`;
console.log(summary);

const result = {
  open_protos, sealed_protos, open_milestones: total_open_milestones,
  open_proto_list: openProtoList, advisory,
  ran_at: new Date().toISOString(),
  note: 'P-OP-008 completion-before-new discipline. ADVISORY always. Complete active plan before starting new ones.'
};
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));

// ADVISORY: always exits 0
process.exit(0);
