#!/usr/bin/env node
/**
 * validate-opus-turn-rzf.mjs
 *
 * Checks that every Opus turn in tools/council/opus-turn.md has an RZF
 * verification section before it can be considered complete.
 *
 * Mechanical ZF enforcement for Opus advisory activity.
 * Governor directive S022: "make ZF a mechanically enforced thing about
 * your audits and about all of your activity."
 *
 * Logic:
 *   1. Read tools/council/opus-turn.md
 *   2. Find all "# Opus Turn N" sections
 *   3. For each turn: check for "## RZF VERIFICATION" section
 *   4. Check that RZF section contains "ZF ACHIEVED" or "cycles_run"
 *   5. ADVISORY if any turn is missing RZF evidence
 *   6. BLOCKING (week-4) when promoted from advisory
 *
 * Exempt: turns marked "CONSENSUS REACHED" (closed turns, not working output)
 *         turns in OPUS MODE DECISION (decision tables don't need RZF)
 *
 * Severity: ADVISORY (current) → BLOCKING (week-4 promotion per K=2)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const OPUS_TURN_FILE = resolve('tools/council/opus-turn.md');
const ENFORCEMENT_STAGE = 'advisory'; // advisory | blocking

if (!existsSync(OPUS_TURN_FILE)) {
  console.log('[validate-opus-turn-rzf] tools/council/opus-turn.md not found — skip');
  process.exit(0);
}

const content = readFileSync(OPUS_TURN_FILE, 'utf8');

// Split by turn headers
const turnPattern = /^# Opus Turn (\d+)/gm;
const turns = [];
let match;
let lastIndex = 0;
let lastTurnNum = null;

const lines = content.split('\n');
const turnIndices = [];

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^# Opus Turn (\d+)/);
  if (m) {
    turnIndices.push({ lineIndex: i, turnNum: parseInt(m[1]) });
  }
}

const warnings = [];
const info = [];

for (let i = 0; i < turnIndices.length; i++) {
  const { lineIndex, turnNum } = turnIndices[i];
  const nextLineIndex = turnIndices[i + 1]?.lineIndex ?? lines.length;
  const turnLines = lines.slice(lineIndex, nextLineIndex).join('\n');

  // Skip closed/consensus turns
  if (turnLines.includes('CONSENSUS REACHED') && !turnLines.includes('OPUS MODE')) {
    info.push(`Turn ${turnNum}: consensus turn — exempt from RZF requirement`);
    continue;
  }

  // Skip decision-only turns (PCR tables only)
  if (turnLines.includes('OPUS MODE DECISION') || turnLines.includes('## PCR —')) {
    if (!turnLines.includes('## RZF VERIFICATION')) {
      info.push(`Turn ${turnNum}: decision turn — RZF advisory (not required)`);
      continue;
    }
  }

  // Check for RZF section
  const hasRzfSection = /## RZF VERIFICATION/i.test(turnLines);
  const hasZfAchieved = /ZF ACHIEVED|cycles_run|0 new findings/i.test(turnLines);

  if (!hasRzfSection) {
    warnings.push(`Turn ${turnNum}: missing "## RZF VERIFICATION" section`);
  } else if (!hasZfAchieved) {
    warnings.push(`Turn ${turnNum}: RZF section present but no ZF ACHIEVED evidence (cycles_run or "0 new findings" required)`);
  } else {
    info.push(`Turn ${turnNum}: RZF verified ✓`);
  }
}

// Output
if (info.length > 0 && warnings.length === 0) {
  console.log(`[validate-opus-turn-rzf] All ${info.length} turns have RZF evidence`);
  info.forEach(i => console.log(`  ✓ ${i}`));
}

if (warnings.length > 0) {
  console.log(`${warnings.length} advisory(s) — Opus turns without RZF evidence:`);
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
  info.forEach(i => console.log(`  ℹ ${i}`));
  console.log(`\n[validate-opus-turn-rzf] enforcement_stage=${ENFORCEMENT_STAGE}`);
  console.log('[validate-opus-turn-rzf] Fix: end every Opus turn with "## RZF VERIFICATION" block showing cycles_run + ZF ACHIEVED');

  if (ENFORCEMENT_STAGE === 'blocking') {
    process.exit(1);
  }
  // Advisory: exit 0 but print warning
  process.exit(0);
}

console.log(`[validate-opus-turn-rzf] turns_checked=${turnIndices.length} warnings=${warnings.length} stage=${ENFORCEMENT_STAGE}`);
process.exit(0);
