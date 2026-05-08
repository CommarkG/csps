#!/usr/bin/env node
/**
 * validate-concept-load-declared.mjs — Concept-Load Declaration Gate
 *
 * ROOT CAUSE TARGETED (inner-ai-defaults/reasoning-patterns.md — reasoning-context-depth-degradation):
 *   Training default: AI processes prompts from training defaults, not CSPS conceptual frame.
 *   Context (the conceptual compass) degrades to symbol (slug, checkbox) across sessions.
 *   CSPS override (P-META-020): before each substantive input, load the governing L2 spine
 *   domain — GVRN/ARCH/AI/VALD/OPER. The concept comes first; validators are reference samples.
 *
 * Coverage Levels:
 *   ✓ Level 1: Check that session artifacts cite CONCEPT_LOAD or the 5 spine domains
 *   ✓ Level 2: Check that closing-summary §10.0k conceptual alignment section is populated
 *   ✗ Level 3: Verify CONCEPT_LOAD fires at correct turn boundaries (requires transcript) → VLT-S021-CONCEPT-BOUNDARIES
 *   ✗ Level 4: Verify spine selection was correct (semantic) → VLT-S021-CONCEPT-QUALITY
 *
 * When this validator exits 0, it proves:
 *   - Recent session artifacts contain CONCEPT_LOAD declarations or P-META-020 spine references
 * When this validator exits 0, it does NOT prove:
 *   - CONCEPT_LOAD fires at correct boundaries within a live session (Level 3)
 *
 * Exit: ADVISORY (0) always
 * Created: S021 per enforcement-rate-uplift topic-plan Track B B4
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const VAULT_DIR = join(ROOT, 'docs/plan/_handoff/VAULT');

// Evidence of CONCEPT_LOAD discipline being applied
const CONCEPT_LOAD_SIGNALS = [
  /CONCEPT_LOAD/,
  /P-META-020/,
  /governing L2 spine/i,
  /\bGVRN L2\b/,
  /\bARCH L2\b/,
  /\bAI L2\b/,
  /\bVALD L2\b/,
  /\bOPER L2\b/,
  /spine selection/i,
  /§10\.0k/,  // closing-summary conceptual alignment section
];

function getRecentClosingSummaries() {
  if (!existsSync(VAULT_DIR)) return [];
  return readdirSync(VAULT_DIR)
    .filter(f => f.startsWith('closing-summary-S') && f.endsWith('.md'))
    .sort().slice(-2)
    .map(f => join(VAULT_DIR, f));
}

async function main() {
  const targets = getRecentClosingSummaries().filter(existsSync);

  if (targets.length === 0) {
    console.log('[validate-concept-load-declared] no closing-summaries found — skipping');
    console.log(`\n[validate-concept-load-declared] files_scanned=0 with_concept_load=0 status=SKIP`);
    process.exit(0);
  }

  const withConceptLoad = [];
  const missing = [];

  for (const filePath of targets) {
    const rel = filePath.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
    const content = readFileSync(filePath, 'utf8');
    const hasSignal = CONCEPT_LOAD_SIGNALS.some(p => p.test(content));

    if (hasSignal) {
      withConceptLoad.push(rel);
    } else {
      missing.push(rel);
    }
  }

  const filesScanned = targets.length;

  if (withConceptLoad.length > 0) {
    console.log(`✓ CONCEPT_LOAD / P-META-020 spine declaration found in ${withConceptLoad.length} closing-summary(ies)`);
  }

  if (missing.length > 0) {
    console.log(`\n⚠ CONCEPT_LOAD NOT DETECTED (${missing.length} closing-summary(ies)):`);
    for (const f of missing) {
      console.log(`  ${f}`);
      console.log(`    No CONCEPT_LOAD declaration or P-META-020 spine reference found`);
    }
    console.log('\n  P-META-020: load governing L2 spine domain before processing each substantive input.');
    console.log('  Closing-summary §10.0k should show conceptual alignment section.');
  }

  console.log(`\n[validate-concept-load-declared] files_scanned=${filesScanned} with_concept_load=${withConceptLoad.length} advisory_gaps=${missing.length} status=${missing.length > 0 ? 'ADVISORY' : 'CLEAN'}`);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-concept-load-declared] fatal:', err);
  process.exit(1);
});
