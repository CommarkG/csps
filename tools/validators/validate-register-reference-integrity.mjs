#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-register-reference-integrity
 * @csps-name validate-register-reference-integrity
 * @csps-description SEED-A: every register-ID referenced in tracked files must resolve
 *   to an entry in its canonical register. Closes the PARK-040 ghost-ref class mechanically.
 *   Makes P-META-033 (no-lost-threads) mechanical for register IDs.
 *
 *   Canonical registers (from SEED-A manifest):
 *     PARK-S###-### -> tools/data/park-register.yaml (entries[].id)
 *     PROTO-S###-*  -> tools/council/opus-turn.md (## PROTO-* headings)
 *     M-NN          -> docs/plan/pillar-0-governance/moat-registry.md (| M-NN |)
 *     VLT-S###-*    -> frontmatter vault_pending.vlt or tools/data/*-vlt*.yaml
 *     imp_*         -> tools/data/improvement-register.yaml (entries[].id)
 *     gap_*         -> tools/data/gap-recurrence-register.yaml (entries[].id)
 *     SEED-N        -> docs/plan/pillar-0-governance/JOURNEY-SEEDS-S084.md (## SEED-N)
 *
 *   ADVISORY: unresolved reference in any tracked file
 *   BLOCKING: unresolved reference in a HANDOFF-S{current_session}-to-*.md file (handoff gate)
 *     "current session" = explicit session ID from tools/session-state.json (NOT mtime<24h)
 *     B_DETERMINISTIC_GATE item 2: time-invariant blocking path. (S086 Opus #25 structural fix)
 *   ROTATING-CHANNEL FIX (S086 Opus #25): PROTO refs in any HANDOFF always ADVISORY
 *     (PROTOs legitimately roll off opus-turn.md when sessions end — expected behavior).
 *   run_tier: EXTENDED (expensive corpus scan)
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-033 SEED-A
 * @csps-prevention-class GHOST-REGISTER-REFERENCE
 *
 * load_mode: on-demand
 * justification: EXTENDED corpus scan, not per-turn
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ── Register loading ──────────────────────────────────────────────────────────

function loadParkIDs() {
  const path = join(ROOT, 'tools/data/park-register.yaml');
  if (!existsSync(path)) return new Set();
  const text = readFileSync(path, 'utf8');
  const ids = new Set();
  for (const m of text.matchAll(/id:\s*"?(PARK-S\d{3}-\d{3})"?/g)) ids.add(m[1]);
  return ids;
}

function loadProtoIDs() {
  const paths = [join(ROOT, 'tools/council/opus-turn.md'), join(ROOT, 'tools/council/sonnet-turn.md')];
  const ids = new Set();
  for (const p of paths) {
    if (!existsSync(p)) continue;
    const text = readFileSync(p, 'utf8');
    for (const m of text.matchAll(/##\s+(PROTO-S\d{3}-[A-Z0-9-]+)/g)) ids.add(m[1]);
    // Also check for PROTO refs in frontmatter or YAML files
    for (const m of text.matchAll(/PROTO-S\d{3}-[A-Z0-9-]+/g)) ids.add(m[0]);
  }
  // Also scan docs/plan/protos/
  const protosDir = join(ROOT, 'docs/plan/protos');
  if (existsSync(protosDir)) {
    for (const f of walkDir(protosDir, ['.md'])) {
      const name = f.split('/').pop().replace(/\.md$/, '');
      if (/^PROTO-S\d{3}-/.test(name)) ids.add(name);
    }
  }
  return ids;
}

function loadMoatIDs() {
  const path = join(ROOT, 'docs/plan/pillar-0-governance/moat-registry.md');
  if (!existsSync(path)) return new Set();
  const text = readFileSync(path, 'utf8');
  const ids = new Set();
  for (const m of text.matchAll(/\|\s*(M-\d{2})\s*\|/g)) ids.add(m[1]);
  for (const m of text.matchAll(/^##\s+(M-\d{2})/gm)) ids.add(m[1]);
  return ids;
}

function loadImpIDs() {
  const path = join(ROOT, 'tools/data/improvement-register.yaml');
  if (!existsSync(path)) return new Set();
  const text = readFileSync(path, 'utf8');
  const ids = new Set();
  for (const m of text.matchAll(/id:\s*(imp_[A-Za-z_]+)/g)) ids.add(m[1]);
  return ids;
}

function loadGapIDs() {
  const path = join(ROOT, 'tools/data/gap-recurrence-register.yaml');
  if (!existsSync(path)) return new Set();
  const text = readFileSync(path, 'utf8');
  const ids = new Set();
  for (const m of text.matchAll(/id:\s*(gap_[A-Za-z0-9_]+)/g)) ids.add(m[1]);
  return ids;
}

function loadSeedIDs() {
  const path = join(ROOT, 'docs/plan/pillar-0-governance/JOURNEY-SEEDS-S084.md');
  if (!existsSync(path)) return new Set();
  const text = readFileSync(path, 'utf8');
  const ids = new Set();
  for (const m of text.matchAll(/##\s+(SEED-\d[A-Z]?)\b/g)) ids.add(m[1]);
  // Add letter seeds (SEED-A, SEED-B, SEED-C from HANDOFF-INTEGRITY-SEEDS-S084.md)
  const seedIntegrityPath = join(ROOT, 'docs/plan/pillar-0-governance/HANDOFF-INTEGRITY-SEEDS-S084.md');
  if (existsSync(seedIntegrityPath)) {
    const t2 = readFileSync(seedIntegrityPath, 'utf8');
    for (const m of t2.matchAll(/##\s+(SEED-[A-Z])\b/g)) ids.add(m[1]);
  }
  return ids;
}

// Walk directory for file extensions
function walkDir(dir, exts, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', 'generated'].includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walkDir(fullPath, exts, results);
    else if (exts.some(e => entry.name.endsWith(e))) results.push(fullPath);
  }
  return results;
}

// ── Load all known IDs ────────────────────────────────────────────────────────
const KNOWN_PARK_IDS = loadParkIDs();
const KNOWN_PROTO_IDS = loadProtoIDs();
const KNOWN_MOAT_IDS = loadMoatIDs();
const KNOWN_IMP_IDS = loadImpIDs();
const KNOWN_GAP_IDS = loadGapIDs();
const KNOWN_SEED_IDS = loadSeedIDs();

// ── Pattern definitions ───────────────────────────────────────────────────────
// rotating: true = register is a per-session channel (opus-turn.md, sonnet-turn.md).
// PROTOs legitimately roll off rotating channels when sessions end. References in
// any HANDOFF (even "current-session") to rotating-channel IDs are capped at ADVISORY.
// Only permanent registers (park, gap, moat, imp, seed) can escalate to BLOCKING.
const PATTERNS = [
  { name: 'PARK', regex: /\bPARK-S\d{3}-\d{3}\b/g, known: KNOWN_PARK_IDS, register: 'tools/data/park-register.yaml' },
  { name: 'PROTO', regex: /\bPROTO-S\d{3}-[A-Z0-9][A-Z0-9-]*\b/g, known: KNOWN_PROTO_IDS, register: 'tools/council/opus-turn.md', rotating: true },
  { name: 'MOAT', regex: /\bM-\d{2}\b/g, known: KNOWN_MOAT_IDS, register: 'docs/plan/pillar-0-governance/moat-registry.md' },
  { name: 'IMP', regex: /\bimp_[A-Za-z_]+\b/g, known: KNOWN_IMP_IDS, register: 'tools/data/improvement-register.yaml' },
  { name: 'GAP', regex: /\bgap_[A-Za-z0-9_]+\b/g, known: KNOWN_GAP_IDS, register: 'tools/data/gap-recurrence-register.yaml' },
  { name: 'SEED', regex: /\bSEED-(\d[A-Z]?|[A-C])\b/g, known: KNOWN_SEED_IDS, register: 'JOURNEY-SEEDS-S084.md + HANDOFF-INTEGRITY-SEEDS-S084.md' },
];

// Files to scan (tracked governance docs)
const SCAN_DIRS = [
  'docs/plan/_handoff',
  'docs/plan/pillar-0-governance',
  '.csps',
];
// Exclude validator/register files themselves from reference check
const EXCLUDE_PATTERNS = [
  'park-register.yaml', 'improvement-register.yaml', 'gap-recurrence-register.yaml',
  'moat-registry.md', 'JOURNEY-SEEDS-S084.md', 'HANDOFF-INTEGRITY-SEEDS-S084.md',
];

let advisory = 0;
let blocking = 0; // Phase 2 (S085 Opus #24-D): BLOCKING for current-session HANDOFF ghost-refs
let files_checked = 0;
const findings = [];

// B_DETERMINISTIC_GATE item 2 (PROTO-S086-CLOSE): "current session" = explicit committed marker.
// Replace mtime<24h gate (wall-clock-dependent, non-deterministic) with explicit session ID check.
// A HANDOFF is "current session" if its filename contains HANDOFF-S{current_session}-to-*.
// current_session is read from tools/session-state.json (committed artifact, not wall-clock).
// @determinism-exempt: The isCurrentSession() function below is TIME-INVARIANT:
//   it reads session-state.json (a committed file) to get the current session ID,
//   then checks if the HANDOFF filename matches that session ID. No Date.now() / mtime involved.
function loadCurrentSession() {
  try {
    const ssPath = join(ROOT, 'tools/session-state.json');
    if (!existsSync(ssPath)) return null;
    const ss = JSON.parse(readFileSync(ssPath, 'utf-8'));
    return ss.current_session || null; // e.g. "S086"
  } catch { return null; }
}
const CURRENT_SESSION = loadCurrentSession(); // e.g. "S086" or null

function isCurrentSession(filePath) {
  if (!CURRENT_SESSION) return false;
  // Match: HANDOFF-S{CURRENT_SESSION}-to-* in filename
  const fileName = filePath.split(/[/\\]/).pop() || '';
  return new RegExp(`HANDOFF-${CURRENT_SESSION}-to-`).test(fileName);
}

for (const scanDir of SCAN_DIRS) {
  const fullDir = join(ROOT, scanDir);
  for (const filePath of walkDir(fullDir, ['.md', '.yaml', '.txt'])) {
    const fileName = filePath.split(/[/\\]/).pop();
    if (EXCLUDE_PATTERNS.some(ex => fileName.includes(ex))) continue;
    const relPath = relative(ROOT, filePath);
    const isHandoff = /HANDOFF-S\d{3}/.test(fileName);
    const isCurrentHandoff = isHandoff && isCurrentSession(filePath);

    let content;
    try { content = readFileSync(filePath, 'utf8'); } catch { continue; }
    files_checked++;

    for (const pattern of PATTERNS) {
      // Reset regex state
      pattern.regex.lastIndex = 0;
      const refs = [...new Set([...content.matchAll(pattern.regex)].map(m => m[0]))];
      for (const ref of refs) {
        if (!pattern.known.has(ref)) {
          // Phase 2 (S085 Opus #24-D): BLOCKING for current-session HANDOFF ghost-refs.
          // Historical HANDOFFs stay ADVISORY (PROTOs rolled off opus-turn.md after S062).
          // S067 ladder: first current-session incident = BLOCKING (not K=2 graduated).
          // STRUCTURAL FIX (S086 Opus #25): rotating-channel registers (opus-turn.md) are
          // capped at ADVISORY even for current-session files. PROTOs legitimately roll off
          // when a session ends — this is expected behavior, not a structural failure.
          // Only PERMANENT register refs (park/gap/moat/imp/seed) can escalate to BLOCKING.
          const severity = (isCurrentHandoff && !pattern.rotating) ? 'BLOCKING' : 'ADVISORY';
          findings.push({ severity, ref, type: pattern.name, file: relPath, register: pattern.register });
          if (severity === 'BLOCKING') blocking++;
          else advisory++;
        }
      }
    }
  }
}

// ── Output ────────────────────────────────────────────────────────────────────
const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-register-reference-integrity] ${status}`);
console.log(`  files_checked=${files_checked} advisory=${advisory} blocking=${blocking}`);
console.log(`  known_ids: PARK=${KNOWN_PARK_IDS.size} PROTO=${KNOWN_PROTO_IDS.size} MOAT=${KNOWN_MOAT_IDS.size} IMP=${KNOWN_IMP_IDS.size} GAP=${KNOWN_GAP_IDS.size} SEED=${KNOWN_SEED_IDS.size}`);

if (findings.length > 0) {
  const top = findings.slice(0, 20);
  console.log(`\n[validate-register-reference-integrity] findings (top ${top.length} of ${findings.length}):`);
  for (const f of top) {
    console.log(`  ${f.severity}: ${f.ref} (${f.type}) in ${f.file} -> register: ${f.register}`);
  }
  if (findings.length > 20) console.log(`  ... and ${findings.length - 20} more`);
}

if (blocking === 0 && advisory === 0) {
  console.log('\n[validate-register-reference-integrity] All register references resolve.');
}

process.exit(blocking > 0 ? 1 : 0);