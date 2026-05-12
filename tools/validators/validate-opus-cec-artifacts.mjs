#!/usr/bin/env node
/**
 * validate-opus-cec-artifacts.mjs — Validates Opus CEC positive findings cite real artifacts
 *
 * ROOT CAUSE TARGETED: Opus Turn 18 "CEC = extract compound value from positive events."
 * When Opus applies CEC (Complete Extraction Cycle) to a positive event, it should cite
 * specific artifacts updated (commit sha or file path). "Applied YES" without traceable
 * evidence is the CEC equivalent of SP-001 (declaration without demonstration).
 *
 * What it checks:
 *   1. opus-turn.md: ## CEC — POSITIVE sections
 *      - For each "Applied YES" claim: checks for a commit sha or file path cited
 *      - "Applied YES" with no artifact citation: ADVISORY
 *      - "Applied NO" entries: no check needed (gap is acknowledged)
 *
 * ADVISORY Phase 1 — builds the discipline without blocking early sessions
 *
 * Audit slug: opus-cec-artifacts
 * Spec: sonnet-comprehensive-alignment-s027.md P1-2
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const OPUS_TURN = join(ROOT, 'tools/council/opus-turn.md');

const advisories = [];
let cecSectionsFound = 0;
let citedCount = 0;
let appliedYesCount = 0;

if (!existsSync(OPUS_TURN)) {
  console.log('[validate-opus-cec-artifacts] opus-turn.md not found — skipping');
  console.log('[validate-opus-cec-artifacts] sections=0 applied_yes=0 cited=0 advisories=0');
  process.exit(0);
}

const opusContent = readFileSync(OPUS_TURN, 'utf8');

// Find all CEC — POSITIVE sections
const cecRegex = /## CEC — POSITIVE([\s\S]*?)(?=\n##|\n---|\*OPUS-1|$)/g;
let match;
while ((match = cecRegex.exec(opusContent)) !== null) {
  cecSectionsFound++;
  const section = match[1];

  // Find all "Applied YES" claims
  const appliedRegex = /Applied\s+YES\s*[:\-—]?\s*([^\n]*)/gi;
  let aMatch;
  while ((aMatch = appliedRegex.exec(section)) !== null) {
    appliedYesCount++;
    const claim = aMatch[1].trim();

    // Check for traceable artifact: commit sha (7+ hex chars) or file path
    const hasCommitSha = /\b[0-9a-f]{7,40}\b/i.test(claim);
    const hasFilePath = /\.(md|mjs|ts|yaml|json|sh|txt)/.test(claim) ||
                        /docs\/|tools\/|packages\/|apps\/|\.claude\//.test(claim);
    const hasCitation = hasCommitSha || hasFilePath;

    if (!hasCitation && claim.length > 0) {
      advisories.push({
        claim: claim.slice(0, 60),
        issue: `CEC "Applied YES" claim has no traceable artifact (commit sha or file path)`,
        suggestion: 'Cite: "Applied YES — commit abc1234" or "Applied YES — updated [file path]"',
      });
    } else {
      citedCount++;
    }
  }
}

if (advisories.length > 0) {
  advisories.forEach(a => {
    console.log(`  ⚠ [opus-cec-artifacts] "${a.claim}...": ${a.issue}`);
    console.log(`     → ${a.suggestion}`);
  });
} else {
  console.log(`[validate-opus-cec-artifacts] all CEC Applied YES claims cite traceable artifacts ✓`);
}

console.log(`[validate-opus-cec-artifacts] sections=${cecSectionsFound} applied_yes=${appliedYesCount} cited=${citedCount} advisories=${advisories.length}`);
process.exit(0);
