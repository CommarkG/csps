#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-north-star-gate
 * @csps-name validate-north-star-gate
 * @csps-description T2 validator for North Star Presence Protocol (NSPP) gates.
 *   Checks that Gate 1 (startup injection) is active and Gate 2 (ADVANCE/HOLD/DRIFT
 *   session classification) is being applied. Advisory during adoption period (S060).
 *   Blocking when gap_NSPP_MISSING reaches K≥2 in gap-recurrence-register.yaml.
 *   Design: docs/plan/pillar-0-governance/CSPS-NORTH-STAR.md §3 NSPP Gates
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:util domain:governance audience:platform
 * @csps-enforces CSPS-NORTH-STAR.md NSPP-GATE-1 NSPP-GATE-2
 * @csps-ns_quality core-first, governed-without-rigidity
 *
 * ALIGNMENT:
 *   WHO: pnpm verify orchestrator + CI pipeline
 *   WHAT: Verify North Star gates are mechanically enforced, not advisory-only
 *   PREVENTS: North Star becoming T3-only (text in templates) → drifts within 3 sessions
 *   RISK: Advisory now → blocking when K=2 gap registered
 *   SCOPE: Reads session artifacts only; no network calls
 *
 * CHECKS:
 *   1. Gate 1 (T1): Is northStar block in session-open-context.mjs output? (structural)
 *   2. Gate 2 (T2): Does tools/council/sonnet-turn.md contain ADVANCE/HOLD/DRIFT recently?
 *      → Advisory if 0 instances in last 5 Opus receipts
 *   3. Gap register: gap_NSPP_MISSING with K≥2 → BLOCKING
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const errors = [];
const warnings = [];
let nsppGate1Active = false;
let nsppGate2SessionsWithout = 0;

// ── CHECK 1: Gate 1 — northStar block in session-open-context.mjs ─────────────
try {
  const contextPath = join(ROOT, 'tools/scripts/session-open-context.mjs');
  if (!existsSync(contextPath)) {
    warnings.push('session-open-context.mjs not found — Gate 1 cannot be verified');
  } else {
    const src = readFileSync(contextPath, 'utf8');
    // Look for the northStar key in the JSON output
    if (/northStar\s*:/.test(src) && /versionC\s*:/.test(src) && /gate1\s*:/.test(src)) {
      nsppGate1Active = true;
    } else {
      warnings.push(
        'NSPP Gate 1 NOT ACTIVE — northStar block missing from session-open-context.mjs output. ' +
        'Add northStar:{versionC,gate1,gate2_instruction,source} to JSON output. ' +
        'Without this, Opus sees no North Star question at session start. ' +
        'Ref: docs/plan/pillar-0-governance/CSPS-NORTH-STAR.md §3 Gate 1'
      );
    }
  }
} catch (e) {
  warnings.push(`Gate 1 check failed: ${e.message}`);
}

// ── CHECK 2: Gate 2 — ADVANCE/HOLD/DRIFT in recent Opus receipts ──────────────
try {
  const turnPath = join(ROOT, 'tools/council/sonnet-turn.md');
  if (!existsSync(turnPath)) {
    warnings.push('tools/council/sonnet-turn.md not found — Gate 2 cannot be verified');
  } else {
    const content = readFileSync(turnPath, 'utf8');

    // Count ADVANCE/HOLD/DRIFT occurrences (Gate 2 classifications)
    const classifications = (content.match(/\b(ADVANCE|HOLD|DRIFT)\b/g) ?? []);
    const classificationCount = classifications.length;

    if (classificationCount === 0) {
      nsppGate2SessionsWithout = 5; // unknown — treat as 5+ sessions without
      warnings.push(
        'NSPP Gate 2 — no ADVANCE/HOLD/DRIFT session classification found in sonnet-turn.md. ' +
        'Session close requires one of: ADVANCE / HOLD / DRIFT. ' +
        'Missing classification = no feedback loop on North Star alignment. ' +
        'Ref: docs/plan/pillar-0-governance/CSPS-NORTH-STAR.md §3 Gate 2'
      );
    } else {
      nsppGate2SessionsWithout = 0;
      // Gate 2 is being applied — confirm
    }
  }
} catch (e) {
  warnings.push(`Gate 2 check failed: ${e.message}`);
}

// ── CHECK 3: Gap register — gap_NSPP_MISSING with K≥2 → BLOCKING ─────────────
try {
  const gapPath = join(ROOT, 'tools/data/gap-recurrence-register.yaml');
  if (existsSync(gapPath)) {
    const gapContent = readFileSync(gapPath, 'utf8');
    // Find gap_NSPP_MISSING with k_count >= 2 and status: open
    const nsppGapMatch = gapContent.match(
      /id:\s*gap_NSPP_MISSING[\s\S]*?k_count:\s*(\d+)[\s\S]*?status:\s*(\w+)/
    );
    if (nsppGapMatch) {
      const kCount = parseInt(nsppGapMatch[1]);
      const status = nsppGapMatch[2];
      if (kCount >= 2 && status === 'open') {
        errors.push(
          `BLOCKING: gap_NSPP_MISSING K=${kCount} status=open — ` +
          'North Star absence pattern recurred. Structural fix required before proceeding. ' +
          'K≥2 open gap = structural enforcement needed, not advisory.'
        );
      }
    }
  }
} catch (e) {
  warnings.push(`Gap register check failed: ${e.message}`);
}

// ── OUTPUT ─────────────────────────────────────────────────────────────────────

const summary = [
  `[validate-north-star-gate]`,
  `  nspp_gate1_active: ${nsppGate1Active}`,
  `  nspp_gate2_sessions_without: ${nsppGate2SessionsWithout}`,
  `  advisory: ${warnings.length} | blocking: ${errors.length}`,
].join('\n');

if (warnings.length > 0) {
  warnings.forEach(w => console.warn(`  ⚠ ${w}`));
}
if (errors.length > 0) {
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.error(summary);
  process.exit(1);
}

console.log(summary);
process.exit(0);
