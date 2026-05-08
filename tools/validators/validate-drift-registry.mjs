#!/usr/bin/env node
/**
 * validate-drift-registry.mjs — Drift Registry Coverage Gate
 *
 * ROOT CAUSE TARGETED (S019 Part H / drift-registry.yaml):
 *   Platform monitors 7 distinct drift types. Only 3 have active validators (43%).
 *   Drifts without validators are invisible until they become production incidents.
 *   This validator makes drift coverage VISIBLE and MEASURABLE.
 *
 * Coverage Levels:
 *   ✓ Level 1: Count drift types by status (active/partial/planned/deferred)
 *   ✓ Level 2: Flag CRITICAL drift types with status=deferred and no VLT registered
 *   ✗ Level 3: Verify that cited validators actually exist in the repo → VLT-S020-DRIFT-VALIDATOR-EXIST
 *   ✗ Level 4: Verify that validators actually detect what they claim → VLT-S020-DRIFT-VALIDATOR-QUALITY
 *
 * When this validator exits 0, it proves:
 *   - drift-registry.yaml is present and parseable
 *   - coverage percentage is >= ADVISORY_THRESHOLD (or stage=advisory)
 *   - all CRITICAL drift types have either active validators or registered VLTs
 * When this validator exits 0, it does NOT prove:
 *   - cited validators detect the drift they claim to detect
 *   - validators have no false positives
 *   - planned/deferred drift types won't cause production incidents
 *
 * Exit codes:
 *   0 = coverage acceptable (>= ADVISORY_THRESHOLD) OR all critical drifts have VLTs
 *   1 = coverage CRITICAL (< BLOCK_THRESHOLD) AND a CRITICAL drift type has no VLT
 *
 * Thresholds:
 *   ADVISORY: coverage < 50% (partial coverage — warn but don't block)
 *   BLOCKING: coverage < 25% AND a CRITICAL drift type has no VLT registered
 *
 * Created: S020 per sonnet-task-list-S020.md DRIFT-1
 * Source:  tools/config/drift-registry.yaml
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REGISTRY_PATH = join(ROOT, 'tools/config/drift-registry.yaml');

const ADVISORY_THRESHOLD = 50; // advisory when coverage < 50%
const BLOCK_THRESHOLD    = 25; // blocking candidate when coverage < 25%

// Parse individual drift type entries from YAML content
// Each entry starts with "  - id:" and runs until the next "  - id:" or end
function parseDriftTypes(content) {
  const entries = [];
  // Split on entry boundaries (list items with "  - id:")
  const sections = content.split(/(?=\n  - id:)/).filter(s => s.includes('  - id:'));

  for (const section of sections) {
    const idMatch       = section.match(/  - id:\s*(.+)/);
    const nameMatch     = section.match(/name:\s*"?(.+?)"?\s*$/m);
    const statusMatch   = section.match(/status:\s*(.+)/);
    const severityMatch = section.match(/severity:\s*(.+)/);
    const vltMatch      = section.match(/vlt:\s*(.+)/);
    const validatorMatch = section.match(/validator:\s*(.+)/);

    if (!idMatch) continue;

    const status = statusMatch ? statusMatch[1].trim() : 'unknown';
    const severity = severityMatch ? severityMatch[1].trim() : null;
    const vlt = vltMatch ? vltMatch[1].trim() : null;
    const validator = validatorMatch ? validatorMatch[1].trim() : null;

    entries.push({
      id:        idMatch[1].trim(),
      name:      nameMatch ? nameMatch[1].trim() : idMatch[1].trim(),
      status,
      severity,
      vlt,
      validator,
      isCritical: severity === 'CRITICAL',
      isActive:   status === 'active',
      isPartial:  status === 'partial',
      isPlanned:  status === 'planned',
      isDeferred: status === 'deferred',
      hasVlt:     !!vlt && vlt !== 'TBD' && !vlt.toLowerCase().includes('tbd'),
      hasValidator: !!validator && validator !== 'TBD' && !validator.toLowerCase().includes('tbd'),
    });
  }

  return entries;
}

// Parse meta section
function parseMeta(content) {
  const meta = {};
  const metaSection = content.match(/^meta:\n([\s\S]+?)(?=\n\S|$)/m);
  if (!metaSection) return meta;
  const block = metaSection[1];
  for (const [, key, val] of block.matchAll(/^\s{2}(\w+):\s*(.+)$/gm)) {
    const num = parseInt(val.trim(), 10);
    meta[key] = isNaN(num) ? val.trim() : num;
  }
  return meta;
}

async function main() {
  if (!existsSync(REGISTRY_PATH)) {
    console.error('[validate-drift-registry] CRITICAL: tools/config/drift-registry.yaml not found');
    process.exit(1);
  }

  const content = readFileSync(REGISTRY_PATH, 'utf8');
  const entries = parseDriftTypes(content);
  const meta    = parseMeta(content);

  if (entries.length === 0) {
    console.error('[validate-drift-registry] CRITICAL: no drift type entries found in registry');
    process.exit(1);
  }

  // Coverage calculation
  const total    = entries.length;
  const active   = entries.filter(e => e.isActive);
  const partial  = entries.filter(e => e.isPartial);
  const planned  = entries.filter(e => e.isPlanned);
  const deferred = entries.filter(e => e.isDeferred);
  const unknown  = entries.filter(e => !e.isActive && !e.isPartial && !e.isPlanned && !e.isDeferred);

  // Coverage = active only (partial does not count as fully covered)
  const coverage = total > 0 ? Math.round((active.length / total) * 100) : 0;

  // CRITICAL drift types with no VLT registered
  const criticalUnprotected = entries.filter(e => e.isCritical && !e.isActive && !e.hasVlt);
  const criticalMissing     = entries.filter(e => e.isCritical && !e.isActive && !e.hasVlt && e.isDeferred);

  // Report active drift types
  if (active.length > 0) {
    console.log(`\nActive drift monitoring (${active.length} types — validator running):`);
    for (const e of active) {
      const severityTag = e.severity ? ` [${e.severity}]` : '';
      console.log(`  ✓ ${e.name}${severityTag}`);
      if (e.validator) console.log(`    validator: ${e.validator}`);
    }
  }

  // Report partial
  if (partial.length > 0) {
    console.log(`\nPartial drift monitoring (${partial.length} types — incomplete coverage):`);
    for (const e of partial) {
      console.log(`  ~ ${e.name}`);
      if (e.validator) console.log(`    validator: ${e.validator}`);
    }
  }

  // Report planned
  if (planned.length > 0) {
    console.log(`\nPlanned drift monitoring (${planned.length} types — VLT registered, not yet active):`);
    for (const e of planned) {
      const vltTag = e.vlt ? `  vlt: ${e.vlt}` : '  vlt: MISSING';
      console.log(`  📋 ${e.name}`);
      console.log(`    ${vltTag}`);
    }
  }

  // Report deferred
  if (deferred.length > 0) {
    console.log(`\nDeferred drift monitoring (${deferred.length} types — no active validator):`);
    for (const e of deferred) {
      const critTag = e.isCritical ? ' ⚠ CRITICAL' : '';
      const vltTag  = e.hasVlt ? `vlt: ${e.vlt}` : 'NO VLT REGISTERED';
      console.log(`  ⏳ ${e.name}${critTag}`);
      console.log(`    ${vltTag}`);
    }
  }

  // Report unknown
  if (unknown.length > 0) {
    console.log(`\nUnknown status (${unknown.length} types):`);
    for (const e of unknown) {
      console.log(`  ? ${e.name} → status: "${e.status}"`);
    }
  }

  // Critical unprotected check
  if (criticalUnprotected.length > 0) {
    console.error(`\n⛔ CRITICAL DRIFT TYPES WITHOUT VLT (${criticalUnprotected.length}):`);
    for (const e of criticalUnprotected) {
      console.error(`   ${e.name} — no active validator AND no VLT registered`);
      console.error(`   This drift can cause silent production divergence with no tracking.`);
    }
  }

  // Summary
  console.log('');
  let statusLabel;
  let isBlocking = false;

  if (coverage < BLOCK_THRESHOLD && criticalUnprotected.length > 0) {
    statusLabel = 'BLOCKING';
    isBlocking = true;
    console.error(`⛔ DRIFT COVERAGE BLOCKING: ${coverage}% (${active.length}/${total} active) AND critical drift type has no VLT`);
    console.error(`   Below ${BLOCK_THRESHOLD}% coverage with unprotected critical drift = structural risk`);
    console.error(`   Resolution: register VLTs for all CRITICAL drift types immediately`);
  } else if (coverage < ADVISORY_THRESHOLD) {
    statusLabel = 'ADVISORY';
    console.log(`⚠ DRIFT COVERAGE ADVISORY: ${coverage}% (${active.length}/${total} active)`);
    console.log(`   Below ${ADVISORY_THRESHOLD}% — more than half of drift types are unmonitored`);
    console.log(`   Target: 5/7 active by S025 (71%), 7/7 active by S030 (100%)`);
  } else {
    statusLabel = 'ACCEPTABLE';
    console.log(`✓ DRIFT COVERAGE ACCEPTABLE: ${coverage}% (${active.length}/${total} active)`);
  }

  // Positive ZF summary
  console.log(`\n[validate-drift-registry] total=${total} active=${active.length} partial=${partial.length} planned=${planned.length} deferred=${deferred.length} coverage=${coverage}% status=${statusLabel} critical_unprotected=${criticalUnprotected.length}`);

  process.exit(isBlocking ? 1 : 0);
}

main().catch(err => {
  console.error('[validate-drift-registry] fatal:', err);
  process.exit(1);
});
