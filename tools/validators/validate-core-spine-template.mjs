#!/usr/bin/env node
/**
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: VALD
 * governing_principle: P-ARCH-028
 * @csps-enforces PROTO-S073-CORESPINE-B0
 * @behavioral-test-status: tested — core-spine-template-test.sh 3/3
 *
 * validate-core-spine-template.mjs — B0 foundation validator
 *
 * Checks tools/config/core-spine-registry.yaml:
 *   1. Every spine entry has all 8 required sections
 *      (trunk · branches · alignment_map · wiring_map ·
 *       tier_permission · cie_pe · escalation · realtime_save)
 *   2. alignment_map.classification_dimension ∈ {GVRN,VALD,ARCH,AI,OPER}
 *   3. Every wiring_map[] entry with a `file:` key resolves to a real file
 *      on disk (EXISTS≠ACTIVE check)
 *   4. root (if non-null) resolves to a real path
 *
 * BLOCKING (when registry has ≥1 non-stub spine).
 * ADVISORY (all stubs) — to allow bootstrap without false positives.
 *
 * Registered: audit-runner.md pipeline `core-spine-template` (S073 B0).
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REGISTRY_PATH = join(ROOT, 'tools/config/core-spine-registry.yaml');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-core-spine-template-last-run.json');

const REQUIRED_SECTIONS = [
  'trunk', 'branches', 'alignment_map', 'wiring_map',
  'tier_permission', 'cie_pe', 'escalation', 'realtime_save',
];
const VALID_DIMENSIONS = new Set(['GVRN', 'VALD', 'ARCH', 'AI', 'OPER']);

let spines_checked = 0;
let blocking = 0;
let advisory = 0;
const findings = [];

function addFinding(level, msg) {
  findings.push({ level, msg });
  if (level === 'BLOCKING') blocking++;
  else advisory++;
  console.log(`  ${level === 'BLOCKING' ? '✗' : '⚠'} [${level}] ${msg}`);
}

if (!existsSync(REGISTRY_PATH)) {
  console.log('[validate-core-spine-template] registry not found — skip');
  const result = { spines_checked: 0, blocking: 0, advisory: 0, findings: [], ran_at: new Date().toISOString(), registry_found: false };
  writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));
  process.exit(0);
}

const raw = readFileSync(REGISTRY_PATH, 'utf-8');

// ── Parse spine entries (YAML parsed via line-scan — no dependency) ────────────────
// Spines are identified by `  - id:` lines; sections are sub-keys.
// Line scan approach: detect each spine block start/end by indentation.

const spineBlocks = [];
let currentSpine = null;
let currentId = null;

const lines = raw.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Detect spine block start: "  - id: xxx" (2-space indent + list item + id)
  const idMatch = line.match(/^  - id:\s+(\S+)/);
  if (idMatch) {
    if (currentSpine) spineBlocks.push({ id: currentId, lines: currentSpine });
    currentId = idMatch[1];
    currentSpine = [line];
    continue;
  }
  if (currentSpine) currentSpine.push(line);
}
if (currentSpine) spineBlocks.push({ id: currentId, lines: currentSpine });

// Filter out the `schema_version` / `sections_required` / `architecture_map_nodes_valid` etc.
// Only process entries that look like actual spine entries (have a `spine:` field)
const actualSpines = spineBlocks.filter(b => b.lines.some(l => /^\s+spine:\s+/.test(l)));
const stubSpines = actualSpines.filter(b => b.lines.some(l => /^\s+status:\s+stub/.test(l)));
const hasNonStub = actualSpines.length > stubSpines.length;
const mode = hasNonStub ? 'BLOCKING' : 'ADVISORY';

if (actualSpines.length === 0) {
  console.log('[validate-core-spine-template] No spine entries found in registry — skip');
  const result = { spines_checked: 0, blocking: 0, advisory: 0, findings: [], ran_at: new Date().toISOString(), registry_found: true, mode };
  writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));
  process.exit(0);
}

for (const { id, lines: spineLines } of actualSpines) {
  spines_checked++;
  const content = spineLines.join('\n');

  // 1. Check all 8 required sections present
  for (const section of REQUIRED_SECTIONS) {
    // Section appears as "    section:" or "    section:\n" (4-space indent under spine)
    const sectionPattern = new RegExp(`^\\s{4,}${section}:`, 'm');
    if (!sectionPattern.test(content)) {
      addFinding(mode, `spine "${id}": missing required section "${section}"`);
    }
  }

  // 2. Check alignment_map.classification_dimension ∈ valid set
  const dimMatch = content.match(/classification_dimension:\s*(\S+)/);
  if (dimMatch) {
    const dim = dimMatch[1].trim().replace(/['",]/g, '');
    if (!VALID_DIMENSIONS.has(dim)) {
      addFinding(mode, `spine "${id}": alignment_map.classification_dimension="${dim}" not in {GVRN,VALD,ARCH,AI,OPER}`);
    }
  } else {
    addFinding(mode, `spine "${id}": alignment_map.classification_dimension missing`);
  }

  // 3. Check wiring_map[] entries resolve (each "file:" key must point to a real path)
  // B3 extension: status:PLANNED entries are declared-not-required-to-resolve (governed by target_batch).
  // Only status:ACTIVE (or no status field) → existsSync check. Line-by-line block scan.
  const contentLines = content.split('\n');
  for (let li = 0; li < contentLines.length; li++) {
    const fileMatch = contentLines[li].match(/^\s+- file:\s+(\S+)/);
    if (!fileMatch) continue;
    const filePath = fileMatch[1].trim().replace(/['",]/g, '');
    // Look ahead up to 10 lines for status field (stops at next list item or section header)
    let entryStatus = 'ACTIVE';
    for (let lj = li + 1; lj < Math.min(li + 10, contentLines.length); lj++) {
      const nextLine = contentLines[lj];
      // Stop at next wiring entry (another "- file:" or "- id:")
      if (/^\s+- (?:file:|id:)/.test(nextLine)) break;
      const sm = nextLine.match(/^\s+status:\s*(\S+)/);
      if (sm) { entryStatus = sm[1].trim().toUpperCase(); break; }
    }
    if (entryStatus === 'PLANNED') continue; // declared future entry — governed by target_batch
    const resolved = join(ROOT, filePath);
    if (!existsSync(resolved)) {
      addFinding(mode, `spine "${id}": wiring_map ACTIVE entry "file: ${filePath}" does not exist on disk (EXISTS≠ACTIVE). If not yet built, set status:PLANNED.`);
    }
  }

  // 4. Check root resolves (if non-null)
  const rootMatch = content.match(/root:\s+(?!null)(\S+)/);
  if (rootMatch) {
    const rootPath = rootMatch[1].trim().replace(/['",]/g, '');
    if (rootPath !== 'null' && !existsSync(join(ROOT, rootPath))) {
      addFinding(mode, `spine "${id}": alignment_map.root="${rootPath}" does not exist on disk`);
    }
  }
}

const summary = `[validate-core-spine-template] spines_checked=${spines_checked} mode=${mode} blocking=${blocking} advisory=${advisory}`;
console.log(summary);

const result = {
  spines_checked,
  mode,
  blocking,
  advisory,
  findings: findings.slice(0, 30),
  ran_at: new Date().toISOString(),
  registry_found: true,
  note: `mode=${mode}: BLOCKING when ≥1 non-stub spine; ADVISORY during bootstrap (all stubs)`
};
writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));

// Exit 1 only if BLOCKING mode has blocking issues
if (mode === 'BLOCKING' && blocking > 0) process.exit(1);
process.exit(0);
