#!/usr/bin/env node
/**
 * validate-decision-frame-citation.mjs — PCR Frame Citation Gate
 *
 * ROOT CAUSE TARGETED (inner-ai-defaults entries):
 *   (1) prose-naked-question: "What would you like to do?" without options + recommendation
 *   (2) reasoning-implicit-decision-no-PCR: choose option silently when multiple exist
 *   Both stem from the same training default: converge to one option before surfacing it.
 *   CSPS override: B_PCR_FOR_DECISIONS — multi-option decisions require explicit PCR block.
 *
 * Coverage Levels:
 *   ✓ Level 1: Detect multi-option discussions in closing-summaries without PCR markers
 *   ✓ Level 2: Scan session artifacts for PCR structure (Pros:/Cons:/Recommendation: blocks)
 *   ✗ Level 3: Detect trivial-reversible skip violations (need semantic understanding) → VLT-S021-PCR-TRIVIAL
 *   ✗ Level 4: Validate PCR completeness (load-bearing factor + what-would-flip present) → VLT-S021-PCR-QUALITY
 *
 * When this validator exits 0, it proves:
 *   - Recent session artifacts with multi-option markers have PCR structure present
 * When this validator exits 0, it does NOT prove:
 *   - PCR skips in live chat are absent (Level 3 — semantic)
 *   - PCR quality meets standard (load-bearing factor named) (Level 4)
 *
 * Exit: ADVISORY (0) always
 * Created: S021 per enforcement-rate-uplift topic-plan Track B B2
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// Signals that a multi-option decision is being discussed
const MULTI_OPTION_SIGNALS = [
  /Option [AB1-9]\b/i,
  /\bVLT-\w+-\d+\b/,                 // VLT decisions are multi-option by nature
  /\bOption A\b|\bOption B\b/i,
  /\bapproach [12]\b/i,
  /\bshould we\b/i,
  /\bX vs Y\b|\bvs\./i,
  /\balternatives?:/i,
];

// PCR structure markers — a valid PCR has all three
const PCR_PROS = /\*\*Pros[:\*]|\bPros:\s|\n- Pro\b/i;
const PCR_CONS = /\*\*Cons[:\*]|\bCons:\s|\n- Con\b/i;
const PCR_REC  = /\*\*Recommendation[:\*]|\bRecommendation:\s|\bRecommend:/i;

function hasPCRStructure(content) {
  return PCR_PROS.test(content) && PCR_CONS.test(content) && PCR_REC.test(content);
}

function hasMultiOptionSignal(content) {
  return MULTI_OPTION_SIGNALS.some(p => p.test(content));
}

function getRecentArtifacts() {
  const vaultDir = join(ROOT, 'docs/plan/_handoff/VAULT');
  const artifacts = [];
  if (!existsSync(vaultDir)) return artifacts;

  for (const entry of readdirSync(vaultDir)) {
    if ((entry.startsWith('closing-summary-S') || entry.startsWith('HANDOFF-S')) && entry.endsWith('.md')) {
      artifacts.push(join(vaultDir, entry));
    }
  }
  return artifacts.sort().slice(-3); // 3 most recent
}

async function main() {
  const findings = [];
  const pcr_present = [];

  const targets = getRecentArtifacts().filter(existsSync);

  for (const filePath of targets) {
    const rel = filePath.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
    const content = readFileSync(filePath, 'utf8');

    if (hasMultiOptionSignal(content)) {
      if (hasPCRStructure(content)) {
        pcr_present.push(rel);
      } else {
        findings.push({ file: rel, signal: 'multi-option discussion detected; PCR structure (Pros/Cons/Recommendation) not found' });
      }
    }
  }

  const filesScanned = targets.length;

  if (pcr_present.length > 0) {
    console.log(`✓ PCR structure found in ${pcr_present.length} artifact(s) with multi-option decisions`);
  }

  if (findings.length > 0) {
    console.log(`\n⚠ DECISION-FRAME CITATION ADVISORY (${findings.length} artifact(s)):`);
    for (const f of findings) {
      console.log(`  ${f.file}`);
      console.log(`    ${f.signal}`);
    }
    console.log('\n  B_PCR_FOR_DECISIONS: multi-option decisions need Pros/Cons/Recommendation block.');
  } else {
    console.log(`✓ No naked multi-option decisions detected in ${filesScanned} scanned artifact(s)`);
  }

  console.log(`\n[validate-decision-frame-citation] files_scanned=${filesScanned} with_pcr=${pcr_present.length} advisory_gaps=${findings.length} status=${findings.length > 0 ? 'ADVISORY' : 'CLEAN'}`);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-decision-frame-citation] fatal:', err);
  process.exit(1);
});
