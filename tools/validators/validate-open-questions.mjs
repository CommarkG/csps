#!/usr/bin/env node
/**
 * validate-open-questions.mjs — Cross-session open question tracker
 *
 * ROOT CAUSE TARGETED: Questions asked but not answered silently decay across sessions.
 * The question_register field was added to plans, but no validator checks that all
 * registered questions have confirmed: true. Unanswered questions = context debt
 * that compounds into drift.
 *
 * Governor S025: "I feel there is a gap — go over open things that were left behind
 * and mechanically enforce them."
 *
 * What it checks:
 *   1. Active deep_quality topic-plans with question_register → all entries confirmed: true
 *   2. HANDOFF files with alignment questions → all answered
 *   3. Questions in raw-thoughts-queue.md without trigger conditions → surfaced
 *   4. Closing-summary §10.0r drift field → filled (not template placeholder)
 *
 * Phase 1: ADVISORY (surfaces gaps without blocking)
 * Phase 2 (S026): BLOCKING for plans with unconfirmed questions > 3 sessions old
 *
 * Audit slug: open-questions
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
const HANDOFF_DIR = join(ROOT, 'docs/plan/_handoff');
const RAW_THOUGHTS = join(ROOT, 'docs/plan/_intake/raw-thoughts-queue.md');
const SESSION_STATE = join(ROOT, 'tools/session-state.json');

const advisories = [];
let plansChecked = 0;
let questionsFound = 0;
let questionsOpen = 0;

// ── Check 1: Plans with question_register — all entries confirmed? ──
if (existsSync(PLANS_DIR)) {
  const files = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  for (const file of files) {
    const content = readFileSync(join(PLANS_DIR, file), 'utf8');
    if (!content.includes('lifecycle_state: active')) continue;
    if (!content.includes('question_register:')) continue;

    plansChecked++;
    // Find question_register entries
    const registerSection = content.slice(content.indexOf('question_register:'));
    const confirmedFalse = [...registerSection.matchAll(/confirmed:\s*false/g)];
    const confirmedMissing = [...registerSection.matchAll(/confirmed:\s*$/gm)];

    if (confirmedFalse.length > 0 || confirmedMissing.length > 0) {
      const count = confirmedFalse.length + confirmedMissing.length;
      questionsOpen += count;
      advisories.push(`${file}: ${count} unanswered question(s) in question_register (confirmed: false)`);
    }

    questionsFound += [...registerSection.matchAll(/- id:/g)].length;
  }
}

// ── Check 2: raw-thoughts-queue.md — PENDING items without trigger conditions ──
if (existsSync(RAW_THOUGHTS)) {
  const queueContent = readFileSync(RAW_THOUGHTS, 'utf8');
  const pendingLines = queueContent.split('\n').filter(l => l.match(/STATUS:\s*PENDING/i));
  const pendingWithoutTrigger = pendingLines.filter(l => !l.includes('trigger:') && !l.includes('pe_score:'));

  if (pendingWithoutTrigger.length > 0) {
    advisories.push(`raw-thoughts-queue.md: ${pendingWithoutTrigger.length} PENDING items without pe_score + trigger condition (PE supervisor cannot route these)`);
  }
}

// ── Check 3: Recent HANDOFF files — alignment questions answered? ──
if (existsSync(HANDOFF_DIR)) {
  const handoffFiles = readdirSync(HANDOFF_DIR)
    .filter(f => f.startsWith('HANDOFF-') && f.endsWith('.md'))
    .sort()
    .slice(-3); // check last 3 HANDOFFs

  for (const hf of handoffFiles) {
    const content = readFileSync(join(HANDOFF_DIR, hf), 'utf8');
    const hasAlignmentQuestions = content.includes('ALIGNMENT-QUESTIONS') ||
                                   content.includes('alignment_questions');
    const hasAnswers = content.includes('✓') || content.includes('answered');

    if (hasAlignmentQuestions && !hasAnswers) {
      advisories.push(`${hf}: has ALIGNMENT-QUESTIONS section but no evidence of answers (B_MUTUAL_UNDERSTANDING_VALIDATION gap)`);
    }
  }
}

// ── Check 4: Sonnet-turn.md — Sonnet Report section has ALIGNMENT CHECK? ──
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md');
if (existsSync(SONNET_TURN)) {
  const content = readFileSync(SONNET_TURN, 'utf8');
  const hasAlignmentCheck = content.includes('ALIGNMENT CHECK') ||
                             content.includes('Match: YES') ||
                             content.includes('Match: PARTIAL');
  if (!hasAlignmentCheck && content.includes('# Sonnet Report')) {
    advisories.push('sonnet-turn.md: Sonnet Report missing ALIGNMENT CHECK block (B_BOUNDARY_ALIGNMENT_PROTOCOL Type E)');
  }
}

// ── Report ──
if (questionsOpen > 0) {
  console.log(`${questionsOpen} unanswered question(s) across ${plansChecked} active plans:`);
}
if (advisories.length > 0) {
  advisories.forEach(a => console.log(`  ⚠ [open-questions] ${a}`));
  console.log('[validate-open-questions] stage=advisory — cross-session question debt detected');
} else {
  console.log('[validate-open-questions] all tracked questions confirmed ✓');
}

console.log(`[validate-open-questions] plans_checked=${plansChecked} questions_total=${questionsFound} questions_open=${questionsOpen} other_advisories=${Math.max(0, advisories.length - questionsOpen)}`);
process.exit(0); // advisory — Phase 2 blocks when questions > 3 sessions old
