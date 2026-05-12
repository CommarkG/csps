#!/usr/bin/env node
/**
 * validate-comprehensive-response.mjs — Catches SP-003: Comprehensive Response Default
 *
 * ROOT CAUSE TARGETED: "Cover all listed items at equal depth. Thoroughness = quality."
 * When the Governor sends multiple tasks, training equates "covered everything mentioned"
 * with quality. CSPS governance requires SEQUENCED depth: PE-score items, focal point
 * on Band 1, vault the rest to raw-thoughts-queue. Partial solutions to 3 things
 * < complete solution to 1 thing.
 *
 * Sample pair: SP-003 (sample-library.yaml)
 * Teaching moment: "What is the ONE thing that, if done well, makes everything else easier?
 *   PE-score the rest and vault them. Partial solutions < complete solution to 1 thing."
 *
 * What it checks (Phase 1 advisory):
 *   1. sonnet-turn.md INTENT ABSORBED: T3 trigger vocabulary without PE scores nearby
 *   2. sonnet-turn.md Done sections: 5+ done items without PE ordering notation
 *   3. raw-thoughts-queue.md: populated at session open (positive enforcement — vaulting is happening)
 *   4. HANDOFF Zone B: mandate items have PE= annotations (positive check)
 *
 * What it does NOT check: legitimate summaries of completed work (sessions cover many items
 *   by design — only flags when done items lack any PE ordering evidence)
 *
 * Phase 2 (S028): scan session transcripts for T3 trigger + no-PE-score response pairs
 *
 * Audit slug: comprehensive-response
 * Part of "Drive Don't Fight" CHUNK 5 enforcement roadmap (enforcement-coverage.md)
 * PE=70 | Targets 33%→36% enforcement rate
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md');
const HANDOFF_DIR = join(ROOT, 'docs/plan/_handoff');
const RAW_THOUGHTS = join(ROOT, 'docs/plan/_intake/raw-thoughts-queue.md');

// T3 trigger vocabulary (comprehensive response — scope expansion without PE scoring)
const T3_TRIGGERS = [
  /could you also\b/i,
  /while you['']?re at it\b/i,
  /\band also\b/i,
  /\boh[,.]?\s+and\b/i,
  /\balso consider\b/i,
  /\beverything about\b/i,
  /\bfull explanation\b/i,
  /\bcomplete list\b/i,
  /\bin addition[,\s]/i,
  /\bfurthermore[,\s]/i,
];

// PE score indicators that make comprehensive response acceptable (scoring was done)
const PE_SCORE_INDICATORS = [
  /PE[=:]\s*\d+/i,
  /\bBand [1-4]\b/i,
  /\bfocal point[:\s]/i,
  /\bvaulted to\b/i,
  /\bdeferred to\b/i,
  /\braw-thoughts-queue\b/i,
  /\bPE scoring/i,
];

// Heuristic: a "Done" section with many items suggests comprehensive response
// Advisory if 5+ items listed with no PE scores anywhere in the section
const DONE_ITEM_THRESHOLD = 5;

const advisories = [];

function hasPEScoreNearby(text, matchIdx, windowSize = 400) {
  const surrounding = text.slice(Math.max(0, matchIdx - 100), matchIdx + windowSize);
  return PE_SCORE_INDICATORS.some(ind => ind.test(surrounding));
}

// Check 1: T3 trigger vocabulary in sonnet-turn.md without PE scores nearby
if (existsSync(SONNET_TURN)) {
  const content = readFileSync(SONNET_TURN, 'utf8');

  // Only check INTENT ABSORBED sections (where scope decisions happen)
  const intentSections = [];
  const intentRegex = /# Sonnet Session S\d+ — INTENT ABSORBED/gi;
  let m;
  while ((m = intentRegex.exec(content)) !== null) {
    const end = content.indexOf('\n---\n', m.index + 1);
    intentSections.push(content.slice(m.index, end > 0 ? end : m.index + 2000));
  }

  for (const section of intentSections) {
    for (const trigger of T3_TRIGGERS) {
      const triggerRegex = new RegExp(trigger.source, trigger.flags + 'g');
      let match;
      while ((match = triggerRegex.exec(section)) !== null) {
        if (!hasPEScoreNearby(section, match.index)) {
          const lineNum = content.slice(0, content.indexOf(section) + match.index).split('\n').length;
          advisories.push({
            file: 'tools/council/sonnet-turn.md',
            line: lineNum,
            trigger: match[0],
            issue: `T3 comprehensive trigger "${match[0]}" without PE score nearby (SP-003). Add: "PE scoring: [item]=PE=XX. Focal point: [Band 1 item]. Vaulted: [rest]."`,
          });
        }
      }
    }
  }
}

// Check 2: Done sections with 5+ items and zero PE annotations (heuristic)
if (existsSync(SONNET_TURN)) {
  const content = readFileSync(SONNET_TURN, 'utf8');
  const lastReportIdx = content.lastIndexOf('# Sonnet Report');
  if (lastReportIdx >= 0) {
    const reportSection = content.slice(lastReportIdx);
    const doneLines = (reportSection.match(/^(\d+\.|[-*])\s+.+DONE/gim) || []).length;
    const hasPEInReport = PE_SCORE_INDICATORS.some(ind => ind.test(reportSection));
    if (doneLines >= DONE_ITEM_THRESHOLD && !hasPEInReport) {
      advisories.push({
        file: 'tools/council/sonnet-turn.md',
        trigger: `${doneLines} DONE items in latest report`,
        issue: `SP-003 heuristic: ${doneLines} items completed without PE ordering noted. Consider adding PE scores to show sequential depth vs. comprehensive coverage.`,
      });
    }
  }
}

// Check 3: HANDOFF Zone B mandate — verify PE annotations present (positive check)
let handoffPeCount = 0;
let handoffMissingPe = [];
if (existsSync(HANDOFF_DIR)) {
  const handoffFiles = readdirSync(HANDOFF_DIR)
    .filter(f => f.startsWith('HANDOFF-') && f.endsWith('.md'))
    .sort().slice(-1); // most recent only

  for (const hf of handoffFiles) {
    const content = readFileSync(join(HANDOFF_DIR, hf), 'utf8');
    // Find Zone B — mandate section
    const zoneBIdx = content.indexOf('## Zone B');
    if (zoneBIdx >= 0) {
      const zoneB = content.slice(zoneBIdx, zoneBIdx + 1500);
      const mandateLines = zoneB.split('\n').filter(l => l.match(/^[-*]\s+.{10,}/));
      mandateLines.forEach(line => {
        if (/PE[=:]\s*\d+/i.test(line)) {
          handoffPeCount++;
        } else if (line.includes('PE=') === false && line.length > 20) {
          // Mandate line without PE score — advisory
          handoffMissingPe.push(line.trim().slice(0, 60));
        }
      });
    }
  }
}

// Check 4: raw-thoughts-queue.md populated? (positive enforcement — vaulting active)
let rawThoughtsPopulated = false;
let rawThoughtsEntries = 0;
if (existsSync(RAW_THOUGHTS)) {
  const content = readFileSync(RAW_THOUGHTS, 'utf8');
  const entries = (content.match(/^## /gm) || []).length;
  rawThoughtsEntries = entries;
  rawThoughtsPopulated = entries > 0;
  if (!rawThoughtsPopulated) {
    advisories.push({
      file: 'docs/plan/raw-thoughts-queue.md',
      trigger: 'empty raw-thoughts-queue',
      issue: 'SP-003: raw-thoughts-queue.md is empty — lower-PE items should be vaulted here. If all queued items are complete, add a cleared note with session reference.',
    });
  }
}

// Output results
if (advisories.length > 0) {
  advisories.slice(0, 6).forEach(a => {
    console.log(`  ⚠ [SP-003] ${a.file}:${a.line || ''} "${a.trigger}": ${a.issue}`);
  });
  if (advisories.length > 6) console.log(`  ... and ${advisories.length - 6} more`);
  console.log('[validate-comprehensive-response] teaching_moment: "What is the ONE thing that, if done well, makes everything else easier? PE-score the rest. Partial solutions < complete solution to 1."');
} else {
  console.log('[validate-comprehensive-response] no comprehensive-response patterns detected ✓');
}

const positiveEvidence = rawThoughtsPopulated
  ? `raw-thoughts-queue has ${rawThoughtsEntries} entries (vaulting active)`
  : 'raw-thoughts-queue empty';
console.log(`[validate-comprehensive-response] advisories=${advisories.length} | ${positiveEvidence} | handoff_pe_scored=${handoffPeCount}`);
process.exit(0); // advisory
