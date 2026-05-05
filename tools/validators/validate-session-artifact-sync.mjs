#!/usr/bin/env node
/**
 * validate-session-artifact-sync.mjs — session artifact staleness detector
 *
 * ROOT CAUSE TARGETED: Phase 9 was completed as a §24++ post-close addendum, but
 * HANDOFF/closing-summary still said "PARTIAL" until deep audit caught it.
 * This validator prevents that pattern from recurring by detecting:
 *
 * CHECK 1 — HANDOFF carry-forward staleness:
 *   Any HANDOFF-S<N>-to-S<M>.md that lists items as "DEFERRED" or "PARTIAL" while
 *   token-optimization.md shows those items as "COMPLETE" → WARN (stale HANDOFF).
 *
 * CHECK 2 — verify count vs active HANDOFF count:
 *   The most recent HANDOFF's verify state (e.g., "9 active validators") should match
 *   the actual count in verify.mjs CYCLES (non-skipped). Divergence → WARN.
 *
 * CHECK 3 — post-close addendum tagging:
 *   Scans recent closing-summary files for §24+ work that lacks explicit
 *   "§24++ post-close addendum" section → WARN.
 *
 * EXIT-CODED: 0 = in-sync / 1 = staleness detected (advisory)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

function findLatestHandoff() {
  const handoffDir = join(ROOT, 'docs/plan/_handoff');
  if (!existsSync(handoffDir)) return null;
  const files = readdirSync(handoffDir)
    .filter(f => f.match(/^HANDOFF-S\d+-to-S\d+\.md$/))
    .sort()
    .reverse();
  return files.length > 0 ? join(handoffDir, files[0]) : null;
}

function countActiveVerifyCycles() {
  const verifyPath = join(ROOT, 'tools/verify.mjs');
  if (!existsSync(verifyPath)) return null;
  const text = readFileSync(verifyPath, 'utf8');
  // Count cycles where skip: true is NOT set
  const cycleBlocks = text.split("name: '").slice(1);
  let activeCount = 0;
  for (const block of cycleBlocks) {
    if (!block.includes('skip: true') && !block.includes("skip: SKIP_INSTALL")) {
      activeCount++;
    }
  }
  return activeCount;
}

function extractHandoffVerifyCount(handoffText) {
  // Look for "N active validators" in the HANDOFF
  const m = handoffText.match(/(\d+)\s+active validators/);
  return m ? Number(m[1]) : null;
}

function detectStalePhaseClaims(handoffText, tokenOptText) {
  const warnings = [];

  // Check for "DEFERRED" markers in HANDOFF that token-optimization says COMPLETE
  const phaseCompleteInOpt = [];
  for (const m of tokenOptText.matchAll(/Phase (\d+)\s+(?:COMPLETE|✅)/g)) {
    phaseCompleteInOpt.push(Number(m[1]));
  }

  for (const phase of phaseCompleteInOpt) {
    // Check if HANDOFF still has "Phase N" + "DEFERRED" or "PARTIAL"
    const pattern = new RegExp(`Phase ${phase}[^.\\n]*(?:DEFERRED|PARTIAL)`, 'i');
    if (pattern.test(handoffText)) {
      warnings.push(`Phase ${phase} is COMPLETE in token-optimization.md but HANDOFF may still show DEFERRED/PARTIAL`);
    }
  }

  return warnings;
}

async function main() {
  const warnings = [];
  let checked = 0;

  const tokenOptPath = join(ROOT, 'docs/plan/pillar-0-governance/token-optimization.md');
  const latestHandoff = findLatestHandoff();

  // CHECK 1 — Phase staleness
  if (latestHandoff && existsSync(tokenOptPath)) {
    checked++;
    const handoffText = readFileSync(latestHandoff, 'utf8');
    const tokenOptText = readFileSync(tokenOptPath, 'utf8');
    const staleWarnings = detectStalePhaseClaims(handoffText, tokenOptText);
    warnings.push(...staleWarnings.map(w => `[CHECK 1 Staleness] ${w}`));
  }

  // CHECK 2 — validator count sync
  if (latestHandoff) {
    checked++;
    const handoffText = readFileSync(latestHandoff, 'utf8');
    const handoffCount = extractHandoffVerifyCount(handoffText);
    const actualCount = countActiveVerifyCycles();
    if (handoffCount !== null && actualCount !== null && handoffCount !== actualCount) {
      warnings.push(
        `[CHECK 2 Validator Count] HANDOFF says "${handoffCount} active validators" but verify.mjs has ~${actualCount} active cycles — update HANDOFF §0 verify state`
      );
    }
  }

  // CHECK 3 — post-close addendum tagging in latest closing-summary
  const vaultDir = join(ROOT, 'docs/plan/_handoff/VAULT');
  if (existsSync(vaultDir)) {
    checked++;
    const closingSummaries = readdirSync(vaultDir)
      .filter(f => f.match(/^closing-summary-S\d+\.md$/))
      .sort()
      .reverse()
      .slice(0, 2); // check 2 most recent
    for (const cs of closingSummaries) {
      const text = readFileSync(join(vaultDir, cs), 'utf8');
      // If file has "§24++" mentions in body but no explicit §24++ section header, warn
      const has24ppWork = text.includes('§24++') || text.includes('post-close addendum');
      const has24ppHeader = text.includes('## §24++ Post-Close Addendum');
      if (has24ppWork && !has24ppHeader) {
        warnings.push(`[CHECK 3 Post-Close] ${cs} mentions §24++ work but missing "## §24++ Post-Close Addendum" section header`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — session artifact staleness detected:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  const summary = `[validate-session-artifact-sync] checks=${checked} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-session-artifact-sync] fatal:', err);
  process.exit(1);
});
