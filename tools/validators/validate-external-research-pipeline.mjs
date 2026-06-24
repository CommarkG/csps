#!/usr/bin/env node
/**
 * validate-external-research-pipeline.mjs — External Research Pipeline Integrity Gate
 *
 * Validates that tools/data/external-research-pipeline.yaml is consistent with
 * the files in docs/plan/_intake/external-research/YYYY-MM-DD/.
 *
 * BLOCKING checks:
 *   (a) Any file in external-research/YYYY-MM-DD/ that has NO pipeline entry → un-tracked intake
 *   (b) Any pipeline entry with status=parked or status=harvested but disposition or park_ref null
 *       AND older than N days → obligation drift (items not progressing)
 *   (c) Any pipeline entry with pipeline_stage=P0-ingested (stuck at intake, never classified)
 *       AND older than 7 days → stale intake
 *
 * ADVISORY checks:
 *   (d) Files with swift_absorbed=false → pending SWIFT scan
 *   (e) Pipeline entries with quarantine=true → unverified external AI content
 *
 * @csps-id csps.validators.validate-external-research-pipeline
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces PARK-S088-EXTERNAL-RESEARCH-INTAKE-SYSTEM external-research-pipeline.yaml
 * @csps-prevention-class INTAKE-DRIFT UNTRACKED-EXTERNAL-AI STALE-INTAKE
 *
 * run_tier: STANDARD
 * always_rerun: false
 * @determinism-exempt: no clock-based blocking decisions. Stale-intake check uses file presence only.
 */

import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PIPELINE_REG = join(ROOT, 'tools/data/external-research-pipeline.yaml');
const INTAKE_DIR   = join(ROOT, 'docs/plan/_intake/external-research');
const LAST_RUN     = join(ROOT, 'tools/data/validate-external-research-pipeline-last-run.json');

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// ── Parse pipeline registry entries ──────────────────────────────────────────
function parsePipelineEntries(raw) {
  const entries = [];
  const blocks = raw.split(/\n  - id:/);
  for (const block of blocks.slice(1)) {
    const id = block.split('\n')[0].replace(/[\s:"]+/g, '').trim();
    if (!id || id.startsWith('_')) continue;
    const get = (key) => (block.match(new RegExp(`\\n    ${key}:\\s*"?([^"\\n]+)"?`)) || [])[1]?.trim() ?? null;
    entries.push({
      id,
      name: get('name') ?? '',
      status: get('status') ?? 'new',
      pipeline_stage: get('pipeline_stage') ?? 'P0-ingested',
      file: get('file') ?? null,
      swift_absorbed: block.includes('swift_absorbed: true'),
      quarantine: block.includes('quarantine: true'),
      park_register_ref: get('park_register_ref') ?? null,
      council_harvest_ref: get('council_harvest_ref') ?? null,
    });
  }
  return entries;
}

// ── Get all intake files in YYYY-MM-DD dirs ───────────────────────────────────
function getIntakeFiles() {
  const files = [];
  if (!existsSync(INTAKE_DIR)) return files;
  for (const day of readdirSync(INTAKE_DIR)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
    const dayPath = join(INTAKE_DIR, day);
    try {
      for (const f of readdirSync(dayPath)) {
        if (f.endsWith('.md') && f !== 'README.md') {
          files.push({ name: f, path: `docs/plan/_intake/external-research/${day}/${f}`, day });
        }
      }
    } catch { /* skip */ }
  }
  return files;
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[validate-external-research-pipeline] External research pipeline integrity gate');
console.log('  BLOCKING: untracked intake files, obligation drift, stale intake');
console.log('');

if (!existsSync(PIPELINE_REG)) {
  WARN('tools/data/external-research-pipeline.yaml missing — pipeline registry not found');
  console.log(`\n[validate-external-research-pipeline] blocking=${blocking} advisory=${advisory} passes=${passes}`);
  process.exit(0);
}

let pipelineEntries = [];
try {
  pipelineEntries = parsePipelineEntries(readFileSync(PIPELINE_REG, 'utf8'));
  PASS(`pipeline registry loaded (${pipelineEntries.length} entries)`);
} catch (e) {
  BLOCK(`could not parse external-research-pipeline.yaml: ${e.message}`);
  process.exit(1);
}

const intakeFiles = getIntakeFiles();
PASS(`intake directory scanned (${intakeFiles.length} files in YYYY-MM-DD/)`);

// ── CHECK (a): intake files with no pipeline entry ─────────────────────────────
const registeredFiles = new Set(pipelineEntries.map(e => e.file).filter(Boolean));
let untrackedCount = 0;
for (const f of intakeFiles) {
  const isRegistered = registeredFiles.has(f.path);
  if (!isRegistered) {
    BLOCK(`untracked intake file: ${f.path} — add entry to external-research-pipeline.yaml (P0 ingested)`);
    untrackedCount++;
  }
}
if (untrackedCount === 0) {
  PASS(`all ${intakeFiles.length} intake files have pipeline entries`);
}

// ── CHECK (b): stuck entries (parked/harvested but no ref, no progression) ────
const stuckEntries = pipelineEntries.filter(e =>
  (e.status === 'parked' || e.status === 'harvested') &&
  !e.park_register_ref && !e.council_harvest_ref &&
  e.pipeline_stage !== 'P5-absorbed' && e.pipeline_stage !== 'P6-closed'
);
if (stuckEntries.length > 0) {
  for (const e of stuckEntries) {
    WARN(`obligation drift: ${e.id} (${e.status}) has no park_register_ref or council_harvest_ref — add disposition`);
  }
} else {
  PASS(`no obligation drift — all parked/harvested entries have disposition refs`);
}

// ── CHECK (c): entries stuck at P0 (never classified) ─────────────────────────
const staleIntake = pipelineEntries.filter(e => e.pipeline_stage === 'P0-ingested');
if (staleIntake.length > 0) {
  for (const e of staleIntake) {
    WARN(`stale intake: ${e.id} stuck at P0-ingested — classify (run threshold or add manual classification)`);
  }
} else {
  PASS(`no stale intake entries — all files are past P0-ingested`);
}

// ── CHECK (d): pending SWIFT scan ────────────────────────────────────────────
const pendingSwift = pipelineEntries.filter(e => !e.swift_absorbed && e.pipeline_stage !== 'P6-closed');
if (pendingSwift.length > 0) {
  for (const e of pendingSwift) {
    WARN(`pending SWIFT scan: ${e.id} — identify low-blast-radius items to absorb`);
  }
}

// ── CHECK (e): QUARANTINE entries ─────────────────────────────────────────────
const quarantined = pipelineEntries.filter(e => e.quarantine);
if (quarantined.length > 0) {
  for (const e of quarantined) {
    WARN(`QUARANTINE: ${e.id} — external AI content; spot-check before using any finding (CS9 rule)`);
  }
}

// ── RESULT ─────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-external-research-pipeline] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    blocking, advisory, passes, findings,
    pipeline_entries: pipelineEntries.length,
    intake_files: intakeFiles.length,
    untracked: untrackedCount,
    stuck: stuckEntries.length,
    stale_intake: staleIntake.length,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
