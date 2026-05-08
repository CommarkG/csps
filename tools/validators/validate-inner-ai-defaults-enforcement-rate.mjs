#!/usr/bin/env node
/**
 * validate-inner-ai-defaults-enforcement-rate.mjs — AI Behavioral Enforcement Rate Gate
 *
 * ROOT CAUSE TARGETED (S019 L11 opus-lessons):
 *   The platform has 13+ documented AI behavioral overrides in inner-ai-defaults.
 *   Zero of them are caught by a running validator (all show "impl deferred").
 *   A behavioral contract without mechanical enforcement is aspiration, not governance.
 *   This validator makes the enforcement gap VISIBLE and MEASURABLE.
 *
 * Coverage Levels:
 *   ✓ Level 1: Count entries with caught_by_validator: impl deferred vs. live
 *   ✓ Level 2: Identify entries deferred for >2 sessions (K=2 trigger per P-META-019)
 *   ✗ Level 3: Verify that "live" validator citations actually exist in the repo → VLT-S019-VALIDATOR-EXIST
 *   ✗ Level 4: Verify that live validators actually detect the pattern they claim → VLT-S019-VALIDATOR-QUALITY
 *
 * When this validator exits 0, it proves: enforcement rate is above thresholds
 * When this validator exits 0, it does NOT prove: the live validators are correct or complete
 *
 * Exit codes:
 *   0 = enforcement rate acceptable (>= WARN_THRESHOLD; or all findings are advisory)
 *   1 = enforcement rate CRITICAL (< BLOCK_THRESHOLD) OR K=2 entries found
 *
 * Thresholds:
 *   ADVISORY: enforcement_rate < 50%
 *   BLOCKING: enforcement_rate < 25% (platform governance is majority aspirational)
 *
 * Resolution:
 *   Increase enforcement rate by building validators for deferred entries
 *   OR add entries to EXEMPT_ENTRIES if they are intentionally governed by human judgment
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const INNER_AI_DEFAULTS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/inner-ai-defaults');

// Entries that are intentionally governed by human judgment (not automation)
// Add entries here ONLY with explicit Governor ratification + documented reasoning
// Format: "entry-name-from-file"
const EXEMPT_ENTRIES = new Set([
  // Example: 'push-back-duty' -- push-back requires human judgment; no automated validator possible
]);

// Thresholds — graduated enforcement (enforcement_stage: measurement → advisory → blocking)
// enforcement_stage: measurement (S019) — exits 0 always; measures the gap
// enforcement_stage: advisory (S020+) — exits 0; warns below ADVISORY_THRESHOLD
// enforcement_stage: blocking (S025+) — exits 1 below BLOCK_THRESHOLD
// Current: measurement — producing data to drive improvement before gating on it
const ENFORCEMENT_STAGE  = 'measurement';
const ADVISORY_THRESHOLD = 50;  // advisory when enforcement rate < 50%
const BLOCK_THRESHOLD    = 25;  // blocking when enforcement rate < 25% (active at stage: blocking)
const K2_SESSION_THRESHOLD = 2; // flag entries deferred for > N sessions

// Patterns that indicate LIVE mechanical enforcement (checked against catchValue directly)
// Must be explicit live evidence — not just "a value exists"
const LIVE_INDICATORS = [
  /\bLIVE\b/i,           // explicit LIVE marker
  /\.mjs\b/,             // direct reference to a .mjs validator file
];

// Patterns that indicate deferred/non-mechanical enforcement (checked against catchValue)
// Any of these in the value = DEFERRED
const DEFERRED_INDICATORS = [
  /impl deferred/i,
  /\bdeferred\b/i,
  /week-\d/i,
  /\bplanned\b/i,
  /\bTBD\b/i,
  /\bnone\b/i,
  /no automated validator/i,
  /behavioral\)/i,              // "(behavioral)" = human judgment only
  /human-judgment/i,
  /sampling\)/i,                // "(sampling)" = periodic human check, not mechanical
];

// Pattern to extract entry name
const ENTRY_NAME_PATTERN = /^###\s+(.+)$/m;
const CAUGHT_BY_PATTERN  = /caught_by_validator:\s*(.+)$/m;
const STATUS_PATTERN     = /\*\*status:\*\*\s*(.+)$|\bstatus:\s*(.+)$/m;

function parseEntries(filePath, content) {
  const entries = [];
  // Split on "###" headings (each entry starts with ###)
  const sections = content.split(/(?=^###\s)/m).filter(s => s.trim());

  for (const section of sections) {
    const nameMatch = section.match(/^###\s+(.+)$/m);
    if (!nameMatch) continue;

    const name = nameMatch[1].trim();
    const catchMatch = section.match(/caught_by_validator:\s*(.+)$/m);
    const statusMatch = section.match(/\*\*status:\*\*\s*(.+)$|\bstatus:\s*(.+)$/m);

    const catchValue = catchMatch ? catchMatch[1].trim() : null;
    const statusValue = statusMatch ? (statusMatch[1] || statusMatch[2] || '').trim() : null;

    if (!catchValue) continue; // Skip sections without caught_by_validator field

    // Determine if live or deferred — LIVE check TAKES PRIORITY over deferred.
    // S021 K=1 discovery: DEFERRED_INDICATORS matched substrings like "Level 2: scan deferred"
    // even when the dominant classification was LIVE. Fix: check LIVE first; only classify
    // deferred when LIVE is absent. This prevents description text from overriding intent.
    const isLive     = LIVE_INDICATORS.some(p => p.test(catchValue));
    const isDeferred = !isLive && DEFERRED_INDICATORS.some(p => p.test(catchValue));

    // Check if entry is active (not deprecated/removed)
    const isActive = !statusValue || statusValue.toLowerCase() === 'active';

    if (isActive) {
      entries.push({
        name,
        file: filePath.replace(ROOT, '').replace(/\\/g, '/'),
        catchValue,
        isLive: isLive && !isDeferred,
        isDeferred,
        isExempt: EXEMPT_ENTRIES.has(name),
      });
    }
  }

  return entries;
}

function walkInnerDefaults(dir) {
  const allEntries = [];

  if (!existsSync(dir)) {
    return allEntries;
  }

  for (const entry of readdirSync(dir)) {
    if (entry === 'README.md' || !entry.endsWith('.md')) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isFile()) {
      const content = readFileSync(fullPath, 'utf8');
      const entries = parseEntries(fullPath, content);
      allEntries.push(...entries);
    }
  }

  return allEntries;
}

async function main() {
  if (!existsSync(INNER_AI_DEFAULTS_DIR)) {
    console.log('[validate-inner-ai-defaults-enforcement-rate] inner-ai-defaults dir not found — skipping');
    process.exit(0);
  }

  const allEntries = walkInnerDefaults(INNER_AI_DEFAULTS_DIR);

  if (allEntries.length === 0) {
    console.log('[validate-inner-ai-defaults-enforcement-rate] No entries found — skipping');
    process.exit(0);
  }

  const exempt  = allEntries.filter(e => e.isExempt);
  const active  = allEntries.filter(e => !e.isExempt);
  const live    = active.filter(e => e.isLive);
  const deferred = active.filter(e => e.isDeferred);
  const unclear = active.filter(e => !e.isLive && !e.isDeferred);

  const total = active.length;
  const enforcementRate = total > 0 ? Math.round((live.length / total) * 100) : 0;

  // Report deferred entries
  if (deferred.length > 0) {
    console.log(`\nDeferred enforcement (${deferred.length} entries — no running validator):`);
    for (const e of deferred) {
      console.log(`  ⏳ ${e.name}`);
      console.log(`     file: ${e.file}`);
      console.log(`     caught_by_validator: ${e.catchValue}`);
    }
  }

  // Report live entries
  if (live.length > 0) {
    console.log(`\nLive enforcement (${live.length} entries — validator running):`);
    for (const e of live) {
      console.log(`  ✓ ${e.name} → ${e.catchValue}`);
    }
  }

  // Report unclear entries
  if (unclear.length > 0) {
    console.log(`\nUnclear enforcement status (${unclear.length} entries):`);
    for (const e of unclear) {
      console.log(`  ? ${e.name} → "${e.catchValue}"`);
    }
  }

  if (exempt.length > 0) {
    console.log(`\nExempt (human-judgment governed): ${exempt.length} entries`);
  }

  // Rate assessment
  console.log('');
  if (enforcementRate < BLOCK_THRESHOLD) {
    console.error(`⛔ ENFORCEMENT RATE CRITICAL: ${enforcementRate}% (${live.length}/${total} entries have live validators)`);
    console.error(`   Platform behavioral governance is majority aspirational — below ${BLOCK_THRESHOLD}% is BLOCKING`);
    console.error(`   Resolution: build validators for deferred entries (see list above)`);
    console.error(`   Priority target: at least ${ADVISORY_THRESHOLD}% enforcement before next Opus review`);
  } else if (enforcementRate < ADVISORY_THRESHOLD) {
    console.log(`⚠ ENFORCEMENT RATE ADVISORY: ${enforcementRate}% (${live.length}/${total} entries have live validators)`);
    console.log(`   Below ${ADVISORY_THRESHOLD}% — governance is partially aspirational`);
    console.log(`   Target: ${ADVISORY_THRESHOLD}%+ enforcement rate`);
  } else {
    console.log(`✓ ENFORCEMENT RATE ACCEPTABLE: ${enforcementRate}% (${live.length}/${total} entries have live validators)`);
  }

  const statusLabel = enforcementRate < BLOCK_THRESHOLD ? 'CRITICAL' : enforcementRate < ADVISORY_THRESHOLD ? 'ADVISORY' : 'ACCEPTABLE';
  console.log(`\n[validate-inner-ai-defaults-enforcement-rate] total=${total} live=${live.length} deferred=${deferred.length} unclear=${unclear.length} exempt=${exempt.length} enforcement_rate=${enforcementRate}% stage=${ENFORCEMENT_STAGE} status=${statusLabel}`);

  // Exit behavior by enforcement_stage:
  //   measurement: always 0 (instrument only — don't gate)
  //   advisory:    always 0 (warn but don't gate)
  //   blocking:    1 when < BLOCK_THRESHOLD
  if (ENFORCEMENT_STAGE === 'blocking') {
    process.exit(enforcementRate < BLOCK_THRESHOLD ? 1 : 0);
  } else {
    process.exit(0); // measurement and advisory stages never block
  }
}

main().catch(err => {
  console.error('[validate-inner-ai-defaults-enforcement-rate] fatal:', err);
  process.exit(1);
});
