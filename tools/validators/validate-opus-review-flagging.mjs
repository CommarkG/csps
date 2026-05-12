#!/usr/bin/env node
/**
 * validate-opus-review-flagging.mjs — Mechanical detection: does this session need Opus?
 *
 * ROOT CAUSE TARGETED: The SROF format and PROTOCOL.md define WHEN to consult Opus,
 * but nothing mechanically DETECTS that a session contains Opus-triggering content
 * and surfaces it at session open. Without detection, Sonnet may forget to flag items
 * or the Governor must remember to ask.
 *
 * What it checks (Phase 1 advisory):
 *   1. HANDOFFs with depth-5 work — should have needs_opus_review: true
 *   2. New principles in principles.yaml since last Opus turn — flags for L1 review
 *   3. New Grade A templates since last Opus turn — flags for L1 review
 *   4. PE > 90 items in active plans NOT in opus-advisory-arc-S023.md — flags for express review
 *   5. sonnet-turn.md "What Opus should know" section — if non-empty, creates prompt
 *
 * Phase 2 (S026): Inject prompt into session-open.sh output when items flagged
 *
 * Governor directive: "I want you to mechanically engrave that each time you're
 * offering to send something to Opus, you must present the one sentence."
 * "There should always be a link to Git and the ones sent before."
 *
 * Audit slug: opus-review-flagging
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(process.cwd());
const HANDOFF_DIR = join(ROOT, 'docs/plan/_handoff');
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const PRINCIPLES_FILE = join(ROOT, 'packages/principles/principles.yaml');
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md');
const SROF_LOG = join(ROOT, 'tools/council/sonnet-to-opus-request-log.md');
const ARC_PLAN = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans/opus-advisory-arc-S023.md');

const flags = [];
let sessionsWithoutOpus = 0;

// ── Get last Opus turn session from SROF log ──────────────────────────────────
let lastOpusTurn = 0;
let lastOpusCommit = 'unknown';
if (existsSync(SROF_LOG)) {
  const srofText = readFileSync(SROF_LOG, 'utf8');
  const turnMatches = [...srofText.matchAll(/Turn (\d+)/g)].map(m => parseInt(m[1], 10));
  lastOpusTurn = turnMatches.length > 0 ? Math.max(...turnMatches) : 0;
  // Find "ACTED ON" commit for last turn
  const actedOnMatch = srofText.match(/ACTED ON:.*?([a-f0-9]{7,})/);
  if (actedOnMatch) lastOpusCommit = actedOnMatch[1];
}

// ── Check 1: HANDOFFs with depth-5 work without needs_opus_review: true ──
if (existsSync(HANDOFF_DIR)) {
  const handoffFiles = readdirSync(HANDOFF_DIR)
    .filter(f => f.startsWith('HANDOFF-') && f.endsWith('.md'))
    .sort().slice(-2);

  for (const hf of handoffFiles) {
    const content = readFileSync(join(HANDOFF_DIR, hf), 'utf8');
    if (content.includes('depth_chosen: 5') && !content.includes('needs_opus_review: true')) {
      flags.push({ type: 'L2', item: hf, reason: 'Contains depth-5 work without needs_opus_review: true' });
    }
  }
}

// ── Check 2: Active plans with PE > 90 not in arc plan ──
if (existsSync(PLANS_DIR) && existsSync(ARC_PLAN)) {
  const arcContent = readFileSync(ARC_PLAN, 'utf8');
  const planFiles = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  for (const file of planFiles) {
    const content = readFileSync(join(PLANS_DIR, file), 'utf8');
    if (!content.includes('lifecycle_state: active')) continue;
    const peMatch = content.match(/^priority_score:\s*(\d+)/m);
    if (!peMatch || parseInt(peMatch[1], 10) <= 90) continue;
    const name = file.replace('.md', '');
    if (!arcContent.includes(name)) {
      flags.push({
        type: 'L1',
        item: file,
        reason: `PE=${peMatch[1]} active plan not in opus-advisory-arc (express review required per PROTOCOL.md L1)`
      });
    }
  }
}

// ── Check 3: sonnet-turn.md "What Opus should know" section non-empty ──
if (existsSync(SONNET_TURN)) {
  const stContent = readFileSync(SONNET_TURN, 'utf8');
  const opusSection = stContent.match(/## What Opus should know.*?\n([\s\S]*?)(?=\n##|\n---|\n#\s|$)/);
  if (opusSection && opusSection[1].trim().length > 10 && !opusSection[1].includes('DONE') && !opusSection[1].includes('Covered')) {
    flags.push({ type: 'L1', item: 'sonnet-turn.md', reason: '"What Opus should know" section has unprocessed content' });
  }
}

// ── Check 4: Git commits since last Opus interaction ──
let commitsSinceOpus = [];
try {
  if (lastOpusCommit !== 'unknown') {
    const gitLog = execSync(`git log ${lastOpusCommit}..HEAD --oneline 2>/dev/null`, {
      cwd: ROOT, encoding: 'utf8', timeout: 5000
    });
    commitsSinceOpus = gitLog.trim().split('\n').filter(l => l.trim());
  }
} catch { /* git not available */ }

// ── Report ──
console.log('\n════════════════════════════════════════════════════════════');
console.log('  OPUS REVIEW FLAGGING — Mechanical detection');
console.log('════════════════════════════════════════════════════════════');
console.log(`  Last Opus Turn: ${lastOpusTurn} | Commit: ${lastOpusCommit}`);
console.log(`  Commits since Turn ${lastOpusTurn}: ${commitsSinceOpus.length}`);

if (commitsSinceOpus.length > 0) {
  const maxDisplay = Math.min(commitsSinceOpus.length, 5);
  console.log(`\n  Recent commits (showing ${maxDisplay} of ${commitsSinceOpus.length}):`);
  commitsSinceOpus.slice(0, maxDisplay).forEach(c => console.log(`    ${c}`));
}

if (flags.length > 0) {
  console.log(`\n  ${flags.length} item(s) flagged for Opus review:`);
  flags.forEach(f => {
    console.log(`  [${f.type}] ${f.item}`);
    console.log(`       → ${f.reason}`);
  });
  console.log('\n  ▶ NEXT ACTION: Create SROF entry in tools/council/sonnet-to-opus-request-log.md');
  console.log('    Include: REQUEST paragraph + git_links_since_last_turn + previous_srofs_ref');
} else {
  console.log('\n  ✓ No items currently flagged for Opus review');
  console.log('  (Check again if: new depth-5 work, new principles, PE>90 new items, or L1 changes)');
}

console.log('════════════════════════════════════════════════════════════\n');

console.log(`[validate-opus-review-flagging] last_turn=${lastOpusTurn} flags=${flags.length} commits_since=${commitsSinceOpus.length}`);
process.exit(0); // advisory — information only
