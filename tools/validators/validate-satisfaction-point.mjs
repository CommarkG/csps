#!/usr/bin/env node
/**
 * validate-satisfaction-point.mjs — Catches SP-001: Declaration without demonstration
 *
 * ROOT CAUSE TARGETED: "I've run pnpm verify and it passes" fires the satisfaction
 * point — the AI reports what it DID instead of showing what EXISTS. Training
 * optimizes for "action taken = task complete." CSPS requires observable state evidence.
 *
 * Sample pair: SP-001 (sample-library.yaml)
 * Teaching moment: "Am I reporting what I DID, or showing what EXISTS as a result?"
 *
 * What it checks (Phase 1 advisory):
 *   1. sonnet-turn.md: T1 trigger phrases followed by period/newline (no evidence)
 *   2. HANDOFF files: "DONE" or "COMPLETE" claims without evidence following
 *   3. pnpm verify claims without output shown (most common drift)
 *
 * What it does NOT check: legitimate use of "done" as status labels (e.g., §5 completions)
 *
 * Phase 2 (S027): scan all session artifacts for satisfaction-point patterns
 *
 * Audit slug: satisfaction-point
 * Part of "Drive Don't Fight" CHUNK 5 enforcement roadmap (enforcement-coverage.md)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md');
const HANDOFF_DIR = join(ROOT, 'docs/plan/_handoff');

// T1 trigger patterns (satisfaction-point — action reported not evidence shown)
const SATISFACTION_PATTERNS = [
  // "I've run X" without paste following
  /I['']?ve run [a-z].*\.\s*$/im,
  // "I've added/updated/created X" without showing content
  /I['']?ve (added|updated|created|modified|implemented|fixed) .{10,50}\.\s*$/im,
  // "pnpm verify passes" or "it passes" without output shown
  /pnpm verify (?:is )?pass(?:ing|es)[^`\n]*\.\s*$/im,
  // "exit_code=0" as assertion without paste (just the claim)
  /^exit_code=0\s*$/im,
];

// Evidence indicators that follow a potential satisfaction point
const EVIDENCE_FOLLOWING = [
  '```',        // code block starts
  'exit_code',  // pasted output
  '✓',          // success indicator
  'PASS',       // explicit pass
  'output:',    // output label
  '\n[',        // tool output start
];

const advisories = [];

function hasEvidenceFollowing(text, matchIdx, windowSize = 300) {
  const after = text.slice(matchIdx + 10, matchIdx + windowSize);
  return EVIDENCE_FOLLOWING.some(ev => after.includes(ev));
}

// Check sonnet-turn.md Sonnet Report section
if (existsSync(SONNET_TURN)) {
  const content = readFileSync(SONNET_TURN, 'utf8');

  // Only check the most recent Sonnet Report section
  const lastReportIdx = content.lastIndexOf('# Sonnet Report');
  const reportSection = lastReportIdx >= 0 ? content.slice(lastReportIdx) : content;

  for (const pattern of SATISFACTION_PATTERNS) {
    const regex = new RegExp(pattern.source, 'gim');
    let m;
    while ((m = regex.exec(reportSection)) !== null) {
      if (!hasEvidenceFollowing(reportSection, m.index)) {
        const lineNum = reportSection.slice(0, m.index).split('\n').length;
        advisories.push({
          file: 'tools/council/sonnet-turn.md',
          line: lineNum,
          match: m[0].trim().slice(0, 60),
          issue: 'T1 satisfaction trigger — "' + m[0].trim().slice(0, 40) + '..." — shows action not evidence. Add: [paste tool output]',
        });
      }
    }
  }
}

// Check recent HANDOFF Zone A for DONE claims without evidence
if (existsSync(HANDOFF_DIR)) {
  const handoffFiles = readdirSync(HANDOFF_DIR)
    .filter(f => f.startsWith('HANDOFF-') && f.endsWith('.md'))
    .sort().slice(-1); // just the most recent

  for (const hf of handoffFiles) {
    const content = readFileSync(join(HANDOFF_DIR, hf), 'utf8');
    // Look for bare "DONE" without commit reference following
    const bareDonesRegex = /\bDONE\b(?!\s+S\d+|\s+commit|\s+✅)/gim;
    let m;
    while ((m = bareDonesRegex.exec(content)) !== null) {
      if (!hasEvidenceFollowing(content, m.index, 100)) {
        advisories.push({
          file: hf,
          match: 'DONE without commit/session reference',
          issue: 'DONE claim without evidence (commit sha or session number). Add: "DONE S<NNN> — commit: <sha>"',
        });
      }
    }
  }
}

if (advisories.length > 0) {
  advisories.slice(0, 6).forEach(a => {
    console.log(`  ⚠ [SP-001] ${a.file}:${a.line || ''}: ${a.issue}`);
  });
  if (advisories.length > 6) console.log(`  ... and ${advisories.length - 6} more`);
  console.log('[validate-satisfaction-point] teaching_moment: "Paste the tool output. The output IS the evidence."');
} else {
  console.log('[validate-satisfaction-point] no satisfaction-point patterns detected ✓');
}

console.log(`[validate-satisfaction-point] advisories=${advisories.length}`);
process.exit(0); // advisory
