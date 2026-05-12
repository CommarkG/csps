#!/usr/bin/env node
/**
 * validate-opus-rzf-gap-tracking.mjs — Tracks Opus RZF negative findings to platform artifacts
 *
 * ROOT CAUSE TARGETED: Opus Turn 18 ZF production chain discipline.
 * "ZF is not a format — it is a production chain: FINDING → TRACKING → RESOLUTION."
 * When Opus finds gaps in RZF VERIFICATION sections, those findings must be tracked
 * to specific platform artifacts (backlog items, SROF entries, session-state blockers).
 * Untracked findings = governance debt with no home = will be forgotten.
 *
 * What it checks:
 *   1. opus-turn.md: ## RZF VERIFICATION — NEGATIVE sections
 *      - Has "Tracked: " field with a tracking ID
 *      - Tracking ID exists in sonnet-to-opus-request-log.md OR platform-update-backlog.yaml
 *        OR session-state.json blocking_decisions
 *   2. Reports untracked findings as ADVISORY
 *
 * ADVISORY Phase 1 | BLOCKING at K=2 (after 2 sessions of untracked findings)
 *
 * Audit slug: opus-rzf-gap-tracking
 * Spec: sonnet-comprehensive-alignment-s027.md P1-2
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const OPUS_TURN = join(ROOT, 'tools/council/opus-turn.md');
const SROF_LOG = join(ROOT, 'tools/council/sonnet-to-opus-request-log.md');
const SESSION_STATE = join(ROOT, 'tools/session-state.json');
const BACKLOG = join(ROOT, 'tools/config/platform-update-backlog.yaml');

const advisories = [];
let negativeSectionsFound = 0;
let trackedCount = 0;

if (!existsSync(OPUS_TURN)) {
  console.log('[validate-opus-rzf-gap-tracking] opus-turn.md not found — skipping');
  console.log('[validate-opus-rzf-gap-tracking] sections=0 tracked=0 advisories=0');
  process.exit(0);
}

const opusContent = readFileSync(OPUS_TURN, 'utf8');
const srofContent = existsSync(SROF_LOG) ? readFileSync(SROF_LOG, 'utf8') : '';
const sessionContent = existsSync(SESSION_STATE) ? readFileSync(SESSION_STATE, 'utf8') : '';
const backlogContent = existsSync(BACKLOG) ? readFileSync(BACKLOG, 'utf8') : '';

// Find all RZF VERIFICATION — NEGATIVE sections
const negRegex = /## RZF VERIFICATION — NEGATIVE([\s\S]*?)(?=\n##|\n---|\*OPUS-1|$)/g;
let match;
while ((match = negRegex.exec(opusContent)) !== null) {
  negativeSectionsFound++;
  const section = match[1];

  // Extract tracked field
  const trackedMatch = section.match(/Tracked:\s*\[([^\]]+)\]/);
  if (!trackedMatch) {
    // No Tracked field at all
    const findingsMatch = section.match(/Findings:\s*(\d+)/);
    const findings = findingsMatch ? Number(findingsMatch[1]) : 0;
    if (findings > 0) {
      advisories.push({
        issue: 'RZF NEGATIVE section has findings but no "Tracked: [ID]" field',
        findings,
        suggestion: 'Add: Tracked: [SROF-NNN or backlog-item-id or session_state_blocker_id]',
      });
    }
    continue;
  }

  const trackingId = trackedMatch[1].trim();
  if (trackingId === '' || trackingId === 'TBD' || trackingId === 'pending') {
    advisories.push({
      issue: `RZF finding tracked as "${trackingId}" — not a real tracking artifact`,
      suggestion: 'Reference a specific SROF entry, backlog item, or session-state blocker',
    });
    continue;
  }

  // Check tracking ID exists in known locations
  const exists = srofContent.includes(trackingId) ||
                 sessionContent.includes(trackingId) ||
                 backlogContent.includes(trackingId);
  if (!exists && !trackingId.startsWith('DEFER:')) {
    advisories.push({
      issue: `Tracking ID "${trackingId}" not found in SROF log, session-state, or backlog`,
      suggestion: 'Add to sonnet-to-opus-request-log.md, session-state.json blocking_decisions, or tools/config/platform-update-backlog.yaml',
    });
  } else {
    trackedCount++;
  }
}

if (advisories.length > 0) {
  advisories.forEach(a => console.log(`  ⚠ [opus-rzf-gap-tracking] ${a.issue}\n     → ${a.suggestion}`));
} else {
  console.log('[validate-opus-rzf-gap-tracking] all RZF NEGATIVE findings are tracked ✓');
}

console.log(`[validate-opus-rzf-gap-tracking] sections=${negativeSectionsFound} tracked=${trackedCount} advisories=${advisories.length}`);
process.exit(0);
