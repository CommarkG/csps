#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-classification-accuracy
 * @csps-name validate-classification-accuracy
 * @csps-description PARK-040 classifier-training loop — accuracy arm.
 *   Runs the threshold classifier (routeInput) over every golden-set entry
 *   that has a fully-filled correct: block (review_status: ready).
 *   Reports: accuracy % per axis + overall + mis-classified list.
 *   Tracks accuracy session-over-session (appends to golden-set accuracy_history).
 *
 *   Low-confidence escalation path:
 *   When a classification differs from golden-set correct: on 2+ axes,
 *   the entry is flagged as "escalate-to-llm" — the classifier is unreliable here.
 *   These entries feed the few-shot LLM classify call (Component 4, PARK-040 Phase 2).
 *
 * run_tier: EXTENDED (on-demand + --extended flag; not a per-turn cycle)
 * load_mode: on-demand
 * justification: golden-set scan, not per-turn; run after Governor corrections or session-close.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces PARK-040 (Learning Orchestrator — classification arm)
 * @csps-prevention-class CLASSIFIER-DRIFT
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): accuracy < 50% on any axis (classifier systematically wrong)
 *   ADVISORY (exit 0): any misclassification, accuracy < 80%, entries needing LLM escalation
 *
 * Exit: 1 if accuracy < 50% on any axis; 0 otherwise
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const GOLDEN_SET_PATH = join(ROOT, 'tools/data/classification-golden-set.yaml');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-classification-accuracy-last-run.json');

// ── Simple YAML parser for golden set ────────────────────────────────────────────

function parseGoldenEntries(text) {
  const entries = [];
  let inEntries = false, current = null, inCorrect = false, inInputCtx = false;
  for (const rawLine of text.split('\n')) {
    const trimmed = rawLine.trim();
    if (trimmed === 'entries:') { inEntries = true; continue; }
    if (inEntries && /^rule_candidates:|^accuracy_history:/.test(trimmed)) { inEntries = false; continue; }
    if (!inEntries) continue;

    if (/^  - id: /.test(rawLine)) {
      if (current) entries.push(current);
      current = { id: trimmed.replace(/^- id:\s*/, '').replace(/^["']|["']$/g, '') };
      inCorrect = false; inInputCtx = false;
    } else if (current) {
      if (trimmed === 'correct:') { inCorrect = true; inInputCtx = false; continue; }
      if (trimmed === 'input_context:') { inInputCtx = true; inCorrect = false; continue; }
      // Reset sub-block flags when returning to 4-space field after sub-block ends
      if ((inCorrect || inInputCtx) && /^\s{4}\w/.test(rawLine) && !/^\s{6}\w/.test(rawLine)) {
        inCorrect = false; inInputCtx = false;
      }
      if (inCorrect && /^\s{6}\w/.test(rawLine)) {
        const m = trimmed.match(/^(\w+):\s*(.+)/);
        if (m) { current.correct = current.correct || {}; current.correct[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
        continue;
      }
      if (inInputCtx && /^\s{6}\w/.test(rawLine)) {
        const m = trimmed.match(/^(\w+):\s*(.+)/);
        if (m) { current.input_context = current.input_context || {}; current.input_context[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
        continue;
      }
      if (/^\s{4}\w/.test(rawLine) && !inCorrect && !inInputCtx) {
        const m = trimmed.match(/^(\w+):\s*(.*)/);
        if (m && !['correct', 'input_context'].includes(m[1])) {
          current[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
        }
      }
    }
  }
  if (current) entries.push(current);
  return entries;
}

// ── Run classifier on an entry ────────────────────────────────────────────────────

function classify(entry) {
  // Use the existing route-input-wrapper.mjs
  const wrapperPath = join(ROOT, 'tools/scripts/route-input-wrapper.mjs');
  if (!existsSync(wrapperPath)) return null;

  const env = {
    ...process.env,
    ROUTE_CONTENT: (entry.prompt_excerpt || '').slice(0, 200),
    ROUTE_TYPE: entry.input_context?.type || 'governor_directive',
    ROUTE_SPINE: entry.input_context?.spine || 'GVRN',
    ROUTE_URGENCY: entry.input_context?.urgency || 'medium',
    ROUTE_SCOPE: '',  // let classifier infer from content
    ROUTE_SHAPE: 'false',
  };

  try {
    const output = execSync(`node "${wrapperPath}"`, {
      env,
      encoding: 'utf-8',
      cwd: ROOT,
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(output.trim());
  } catch {
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────────

if (!existsSync(GOLDEN_SET_PATH)) {
  console.warn('[validate-classification-accuracy] classification-golden-set.yaml not found — skipping');
  process.exit(0);
}

const goldenText = readFileSync(GOLDEN_SET_PATH, 'utf-8');
const entries = parseGoldenEntries(goldenText);
const readyEntries = entries.filter(e =>
  e.review_status === 'ready' &&
  e.correct &&
  e.correct.scope && e.correct.scope !== 'TBD' &&
  e.correct.intent && e.correct.intent !== 'TBD' &&
  e.correct.mandate_relation && e.correct.mandate_relation !== 'TBD' &&
  e.correct.route && e.correct.route !== 'TBD'
);

console.log(`[validate-classification-accuracy] golden_entries=${entries.length} ready_for_testing=${readyEntries.length}`);

if (readyEntries.length === 0) {
  console.log('[validate-classification-accuracy] No ready entries — Governor needs to fill in correct: fields.');
  console.log('  Run: node tools/scripts/classification-correction-capture.mjs --review');
  process.exit(0);
}

// ── Evaluate ──────────────────────────────────────────────────────────────────────

const AXES = ['scope', 'intent', 'mandate_relation', 'route'];
const axisCorrect = { scope: 0, intent: 0, mandate_relation: 0, route: 0 };
const misclassified = [];
const llmEscalate = [];
let overallCorrect = 0;

for (const entry of readyEntries) {
  const result = classify(entry);
  if (!result) {
    console.warn(`  [validate-classification-accuracy] SKIP ${entry.id}: classifier returned null`);
    continue;
  }

  const predicted = {
    scope: result.axis_classification?.scope || 'operational',
    intent: result.axis_classification?.intent || 'directive',
    mandate_relation: result.axis_classification?.mandate_relation || 'in-mandate',
    route: result.route || 'PROCESS-NOW',
  };

  const axisResults = {};
  let entryAllCorrect = true;
  let axisMisses = 0;
  for (const axis of AXES) {
    const correct = entry.correct[axis];
    const pred = predicted[axis];
    const match = pred === correct;
    axisResults[axis] = { correct, predicted: pred, match };
    if (match) axisCorrect[axis]++;
    else { entryAllCorrect = false; axisMisses++; }
  }

  if (entryAllCorrect) {
    overallCorrect++;
  } else {
    misclassified.push({
      id: entry.id,
      prompt: (entry.prompt_excerpt || '').slice(0, 80),
      axisResults,
      axisMisses,
    });
    // Flag for LLM escalation if 2+ axes wrong (classifier unreliable)
    if (axisMisses >= 2) {
      llmEscalate.push(entry.id);
    }
  }
}

const n = readyEntries.length;
const axisAccuracy = {};
for (const axis of AXES) axisAccuracy[axis] = n > 0 ? Math.round((axisCorrect[axis] / n) * 100) : 0;
const overallAccuracy = n > 0 ? Math.round((overallCorrect / n) * 100) : 0;

// ── Report ────────────────────────────────────────────────────────────────────────

console.log(`\n[validate-classification-accuracy] ACCURACY REPORT`);
console.log(`  entries_tested=${n} correct_all_axes=${overallCorrect} accuracy=${overallAccuracy}%`);
console.log(`  Per-axis accuracy:`);
for (const [axis, pct] of Object.entries(axisAccuracy)) {
  const bar = '█'.repeat(Math.floor(pct / 10)) + '░'.repeat(10 - Math.floor(pct / 10));
  const warn = pct < 50 ? ' ← BLOCKING' : pct < 80 ? ' ← ADVISORY' : '';
  console.log(`    ${axis.padEnd(20)} ${String(pct).padStart(3)}%  [${bar}]${warn}`);
}

if (misclassified.length > 0) {
  console.log(`\n  Misclassified (${misclassified.length} entries):`);
  for (const m of misclassified) {
    console.log(`    [${m.id}] "${m.prompt}..."`);
    for (const [axis, r] of Object.entries(m.axisResults)) {
      if (!r.match) {
        console.log(`      ${axis}: predicted=${r.predicted} | correct=${r.correct}`);
      }
    }
  }
}

if (llmEscalate.length > 0) {
  console.log(`\n  LLM-escalate candidates (2+ axes wrong — rule-based classifier unreliable):`);
  llmEscalate.forEach(id => console.log(`    → ${id}`));
  console.log('  Feed these to LLM-classify with golden-set few-shot examples (PARK-040 Phase 2).');
}

// ── Blocking check ────────────────────────────────────────────────────────────────

const blockingAxes = Object.entries(axisAccuracy).filter(([, pct]) => pct < 50);
let blocking = 0;
if (blockingAxes.length > 0 && n >= 10) { // Only BLOCKING if we have a meaningful sample (≥10 ready entries)
  console.log(`\n[validate-classification-accuracy] BLOCKING: accuracy < 50% on: ${blockingAxes.map(([a]) => a).join(', ')}`);
  console.log('  Classifier systematically wrong — review threshold-router.mjs rules');
  blocking = blockingAxes.length;
}

// ── Append accuracy to history in golden-set.yaml ───────────────────────────────────

const now = new Date().toISOString().slice(0, 10);
const historyEntry = `${now} | n=${n} overall=${overallAccuracy}% scope=${axisAccuracy.scope}% intent=${axisAccuracy.intent}% mandate=${axisAccuracy.mandate_relation}% route=${axisAccuracy.route}%`;

let updatedGolden = goldenText;
const historyMarker = '\naccuracy_history: []';
const historyBlockMarker = '\naccuracy_history:';
if (updatedGolden.includes(historyMarker)) {
  updatedGolden = updatedGolden.replace(historyMarker, `\naccuracy_history:\n  - "${historyEntry}"`);
} else if (updatedGolden.includes(historyBlockMarker)) {
  updatedGolden = updatedGolden.replace(
    historyBlockMarker,
    `${historyBlockMarker}\n  - "${historyEntry}"`
  );
}
try { writeFileSync(GOLDEN_SET_PATH, updatedGolden); } catch { /* advisory */ }

// ── Save last-run JSON ───────────────────────────────────────────────────────────────

const lastRun = {
  run_at: new Date().toISOString(),
  entries_tested: n,
  overall_accuracy_pct: overallAccuracy,
  axis_accuracy: axisAccuracy,
  misclassified_count: misclassified.length,
  llm_escalate_count: llmEscalate.length,
  llm_escalate_ids: llmEscalate,
  blocking: blocking,
  advisory: misclassified.length > 0 ? misclassified.length : 0,
};
try { writeFileSync(LAST_RUN_PATH, JSON.stringify(lastRun, null, 2)); } catch { /* advisory */ }

console.log(`\n[validate-classification-accuracy] blocking=${blocking} advisory=${misclassified.length}`);
if (blocking === 0) {
  console.log(`[validate-classification-accuracy] ✓ Accuracy acceptable (${overallAccuracy}% overall, ${n} entries tested)`);
  if (n < 10) console.log('  ADVISORY: sample size < 10 — accuracy not yet meaningful. Governor: fill TBD entries.');
}

process.exit(blocking > 0 ? 1 : 0);
