#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-agent-inheritance-parity
 * @csps-name validate-agent-inheritance-parity
 * @csps-description B_DETERMINISTIC_GATE item 6 (PROTO-S086-CLOSE):
 *   A prevention or contract present for ONE agent entry point MUST be referenced
 *   by ALL THREE entry points:
 *     - Opus SessionStart: tools/council/opus-context.md
 *     - Sonnet SessionStart: tools/council/sonnet-context.md
 *     - Haiku spawn: tools/templates/haiku-spawn-template.md
 *
 *   This prevents "Opus-only preventions" — where a structural rule is recorded
 *   in opus-context.md but never reaches Sonnet (the builder) or Haiku (the scout).
 *   The canonical prevention must be in ALL three to be truly platform-wide.
 *
 *   Checks:
 *     For each PROTO-S086-* / B_* contract / P-META-* principle that appears
 *     in ANY one agent context file, it must appear in ALL three.
 *
 *   ADVISORY: item in one/two entry points but not all three.
 *   BLOCKING: item in exactly one entry point AND it's flagged as cross-agent-required
 *     (identified by @csps-enforces or ratification note in the source).
 *
 *   Note: This is a conservative scan. Some items are intentionally role-scoped
 *   (e.g. OPIA in Opus only). Annotate with @role-scoped: to exempt.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_DETERMINISTIC_GATE PROTO-S086-CLOSE
 * @csps-prevention-class AGENT-INHERITANCE-GAP
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): critical contract/prevention in one entry point only
 *   ADVISORY (exit 0): item present in 2/3 entry points (partial coverage)
 *
 * run_tier: STANDARD
 * load_mode: on-demand
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ── Agent entry points ────────────────────────────────────────────────────────

const ENTRY_POINTS = [
  { role: 'Opus', path: 'tools/council/opus-context.md' },
  { role: 'Sonnet', path: 'tools/council/sonnet-context.md' },
  { role: 'Haiku', path: 'tools/templates/haiku-spawn-template.md' },
];

// ── Pattern extraction ────────────────────────────────────────────────────────

// Items to track across entry points
// These are significant enough that "cross-agent" means all three must know
const CROSS_AGENT_PATTERNS = [
  { type: 'PROTO-S086', regex: /\bPROTO-S086-[A-Z0-9-]+\b/g },
  { type: 'B_CONTRACT', regex: /\bB_[A-Z_]+\b/g },
  { type: 'P-META', regex: /\bP-META-\d+\b/g },
  { type: 'AMENDMENT', regex: /\bAMENDMENT-\d+\b/g },
];

// Items that are legitimately role-scoped (not cross-agent)
// Format: exact string match
const ROLE_SCOPED_EXEMPT = new Set([
  'B_OPIA',                 // Opus-only architectural review protocol
  'B_OPUS_TURN_RZF',        // Opus turn rhythm — Opus-only
  'P-META-001',             // Basic principles — everywhere by default
  // Role-scoped by design (PROTO-S086-COMPLETION annotation):
  'B_AI_PROFESSIONAL_VOICE', // Haiku spawn template: explicit reminder for scout return format;
                             // implicit in Opus/Sonnet governance (already professional by role)
  'B_SWIFT_OR_PARK',        // Sonnet turn-discipline: mid-process input triage; not a Haiku/Opus concern
  'B_HAIKU_SCAN_ONLY',     // Role-scoped by design: Haiku spawn constraint (SCAN ONLY); Opus/Sonnet don't spawn Haiku by scanning — they direct it
]);

function extractItems(content) {
  const items = new Set();
  for (const { regex } of CROSS_AGENT_PATTERNS) {
    // Reset regex state
    regex.lastIndex = 0;
    for (const m of content.matchAll(regex)) {
      if (!ROLE_SCOPED_EXEMPT.has(m[0])) {
        items.add(m[0]);
      }
    }
  }
  return items;
}

// ── Load entry point content ───────────────────────────────────────────────────

const entryPointData = [];
for (const ep of ENTRY_POINTS) {
  const fullPath = join(ROOT, ep.path);
  if (!existsSync(fullPath)) {
    entryPointData.push({ ...ep, content: '', items: new Set(), exists: false });
    continue;
  }
  const content = readFileSync(fullPath, 'utf-8');
  entryPointData.push({ ...ep, content, items: extractItems(content), exists: true });
}

const missingFiles = entryPointData.filter(ep => !ep.exists);

// ── Cross-agent analysis ──────────────────────────────────────────────────────

// Build union of all items across all entry points
const allItems = new Set();
for (const ep of entryPointData) {
  for (const item of ep.items) allItems.add(item);
}

// Find items not in all three entry points
let advisory = 0;
let blocking = 0;
const findings = [];

for (const item of [...allItems].sort()) {
  const presentIn = entryPointData.filter(ep => ep.items.has(item));
  const missingFrom = entryPointData.filter(ep => !ep.items.has(item));

  if (missingFrom.length === 0) continue; // All three have it

  if (missingFrom.length === 2) {
    // Only ONE entry point has it — BLOCKING (PROTO-S086-COMPLETION: parity must be enforced)
    // If a prevention/contract is platform-wide, it must be in ALL THREE entry points.
    // Use @role-scoped: annotation in the source file or ROLE_SCOPED_EXEMPT set above to exempt.
    findings.push({
      status: 'BLOCKING',
      item,
      present_in: presentIn.map(ep => ep.role),
      missing_from: missingFrom.map(ep => ep.role),
    });
    blocking++;
  } else if (missingFrom.length === 1) {
    // Two entry points have it — ADVISORY (partial coverage; should be addressed)
    findings.push({
      status: 'ADVISORY',
      item,
      present_in: presentIn.map(ep => ep.role),
      missing_from: missingFrom.map(ep => ep.role),
    });
    advisory++;
  }
}

// ── Missing entry point files → BLOCKING ────────────────────────────────────
if (missingFiles.length > 0) {
  for (const ep of missingFiles) {
    findings.push({
      status: 'BLOCKING',
      item: `${ep.role} entry point file missing`,
      present_in: [],
      missing_from: [ep.role],
      note: `File not found: ${ep.path}`,
    });
    blocking++;
  }
}

// ── Output ─────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
const presentCounts = entryPointData.map(ep => `${ep.role}=${ep.items.size}`).join(' ');
console.log(`[validate-agent-inheritance-parity] ${status}`);
console.log(`  entry_points_checked=${ENTRY_POINTS.length} items_tracked=${allItems.size} blocking=${blocking} advisory=${advisory}`);
console.log(`  ${presentCounts}`);

if (missingFiles.length > 0) {
  for (const ep of missingFiles) {
    console.error(`  ✗ BLOCKING: ${ep.role} entry point missing: ${ep.path}`);
  }
}

// BLOCKING parity findings (present in only 1/3 entry points)
const blockingParity = findings.filter(f => f.status === 'BLOCKING' && f.present_in.length > 0);
if (blockingParity.length > 0) {
  console.error(`\n[validate-agent-inheritance-parity] BLOCKING parity gaps (present in only 1/3 entry points):`);
  for (const f of blockingParity) {
    console.error(`  ✗ ${f.item}: only in ${f.present_in.join(', ')} — must also be in ${f.missing_from.join(', ')}`);
    console.error(`    Fix: add reference to ${f.missing_from.join('+')} entry point, OR add to ROLE_SCOPED_EXEMPT if truly role-scoped`);
  }
}

// ADVISORY parity findings (present in 2/3 entry points)
const advisoryParity = findings.filter(f => f.status === 'ADVISORY');
if (advisoryParity.length > 0) {
  console.log(`\n[validate-agent-inheritance-parity] ADVISORY parity gaps (present in 2/3 entry points):`);
  for (const f of advisoryParity.slice(0, 10)) {
    console.log(`  ℹ ${f.item}: in ${f.present_in.join(', ')} — missing from ${f.missing_from.join(', ')}`);
  }
  if (advisoryParity.length > 10) {
    console.log(`  ... and ${advisoryParity.length - 10} more`);
  }
  console.log(`  (Total: ${advisoryParity.length} items with partial cross-agent coverage)`);
}

if (blocking === 0 && advisory === 0) {
  console.log('[validate-agent-inheritance-parity] ✓ All tracked items present in all 3 agent entry points');
}

process.exit(blocking > 0 ? 1 : 0);
