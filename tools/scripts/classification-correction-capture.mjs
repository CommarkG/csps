#!/usr/bin/env node
/**
 * classification-correction-capture.mjs
 * PARK-040 classifier-training loop — correction capture arm. Built S086.
 *
 * Modes:
 *   --review   (default): show recent classifications + generate review block for Governor
 *   --apply "id:axis:value"  (repeatable): write a correction back to golden-set.yaml
 *   --apply-file <yaml-file>: batch-apply corrections from a YAML corrections file
 *   --status: show golden-set accuracy state + rule candidates
 *
 * Governor flow:
 *   1. Run `node tools/scripts/classification-correction-capture.mjs --review`
 *   2. Governor reads the review block in chat, types corrections
 *   3. Run `node tools/scripts/classification-correction-capture.mjs --apply "gs-005:intent:conversational"` per correction
 *   4. Run `node tools/validators/validate-classification-accuracy.mjs` to see updated accuracy
 *
 * Mis-pattern escalation:
 *   When the same axis is wrong 2+ times across different entries → flag as rule-candidate.
 *   Rule-candidates are written to classification-golden-set.yaml rule_candidates[].
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const GOLDEN_SET_PATH = join(ROOT, 'tools/data/classification-golden-set.yaml');
const INTAKE_LOG_PATH = join(ROOT, 'tools/data/threshold-intake-log.yaml');

const args = process.argv.slice(2);
const mode = args[0] || '--review';

// ── Simple YAML helpers ─────────────────────────────────────────────────────────

function parseGoldenSet(text) {
  const entries = [];
  const history = [];
  const ruleCandidates = [];
  let inEntries = false, inHistory = false, inRuleCandidates = false;
  let current = null;
  let inCorrect = false, inInputCtx = false;

  for (const rawLine of text.split('\n')) {
    const line = rawLine;
    const trimmed = line.trim();

    if (trimmed === 'entries:') { inEntries = true; inHistory = false; inRuleCandidates = false; continue; }
    if (trimmed === 'accuracy_history:') { inEntries = false; inHistory = true; inRuleCandidates = false; continue; }
    if (trimmed === 'rule_candidates:') { inEntries = false; inHistory = false; inRuleCandidates = true; continue; }

    if (inEntries) {
      if (/^  - id: /.test(line)) {
        if (current) entries.push(current);
        current = { id: trimmed.replace(/^- id:\s*/, '').replace(/^["']|["']$/g, '') };
        inCorrect = false; inInputCtx = false;
      } else if (current) {
        if (trimmed === 'correct:') { inCorrect = true; inInputCtx = false; continue; }
        if (trimmed === 'input_context:') { inInputCtx = true; inCorrect = false; continue; }
        // Reset sub-block flags when returning to 4-space field (after the sub-block ends)
        if ((inCorrect || inInputCtx) && /^\s{4}\w/.test(line) && !/^\s{6}\w/.test(line)) {
          inCorrect = false; inInputCtx = false;
        }
        if (inCorrect && /^\s{6}\w/.test(line)) {
          const m = trimmed.match(/^(\w+):\s*(.+)/);
          if (m) { current.correct = current.correct || {}; current.correct[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
          continue;
        }
        if (inInputCtx && /^\s{6}\w/.test(line)) {
          const m = trimmed.match(/^(\w+):\s*(.+)/);
          if (m) { current.input_context = current.input_context || {}; current.input_context[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
          continue;
        }
        if (/^\s{4}\w/.test(line) && !inCorrect && !inInputCtx) {
          const m = trimmed.match(/^(\w+):\s*(.*)/);
          if (m && m[1] !== 'correct' && m[1] !== 'input_context') {
            current[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
          }
        }
      }
    }
    if (inHistory && trimmed.startsWith('- ') && trimmed !== '- ') {
      history.push(trimmed.replace(/^- /, ''));
    }
    if (inRuleCandidates && trimmed.startsWith('- ') && trimmed !== '- ') {
      ruleCandidates.push(trimmed.replace(/^- /, ''));
    }
  }
  if (current) entries.push(current);
  return { entries, history, ruleCandidates };
}

// ── Review mode ──────────────────────────────────────────────────────────────────

function review() {
  if (!existsSync(GOLDEN_SET_PATH)) {
    console.log('[correction-capture] classification-golden-set.yaml not found — run with --review after creating it');
    return;
  }
  const { entries } = parseGoldenSet(readFileSync(GOLDEN_SET_PATH, 'utf-8'));

  const tbd = entries.filter(e => e.review_status === 'TBD');
  const ready = entries.filter(e => e.review_status === 'ready');

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  CLASSIFICATION GOLDEN SET — Review Block for Governor  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\nTotal: ${entries.length} entries | ready: ${ready.length} | TBD: ${tbd.length}\n`);

  if (tbd.length === 0) {
    console.log('✓ All entries reviewed. Run validate-classification-accuracy.mjs to measure accuracy.');
    return;
  }

  console.log('═════════════════════════════════════════════════════════════');
  console.log('  PENDING REVIEW — paste corrections back as:');
  console.log('  node tools/scripts/classification-correction-capture.mjs --apply "gs-NNN:field:value"');
  console.log('═════════════════════════════════════════════════════════════\n');

  for (const e of tbd) {
    console.log(`[${e.id}] ${e.review_status === 'TBD' ? 'TBD' : '✓'}`);
    console.log(`  PROMPT: "${(e.prompt_excerpt || '').slice(0, 100)}..."`);
    console.log(`  INPUT:  type=${e.input_context?.type || '?'} spine=${e.input_context?.spine || '?'} urgency=${e.input_context?.urgency || '?'}`);
    console.log(`  CORRECT (pre-filled): scope=${e.correct?.scope || 'TBD'} intent=${e.correct?.intent || 'TBD'} mandate=${e.correct?.mandate_relation || 'TBD'} route=${e.correct?.route || 'TBD'}`);
    if (e.notes) console.log(`  NOTE: ${e.notes}`);
    console.log(`  → correct? [y] or correct with: --apply "${e.id}:scope:X" --apply "${e.id}:intent:Y" etc.`);
    console.log('');
  }

  // Also show recent log classifications if any have preview
  if (existsSync(INTAKE_LOG_PATH)) {
    const logText = readFileSync(INTAKE_LOG_PATH, 'utf-8');
    const withPreview = [];
    let cur = null;
    for (const line of logText.split('\n')) {
      if (/^  - id:/.test(line)) { if (cur) withPreview.push(cur); cur = {}; }
      if (cur) {
        const m = line.match(/^\s{2}(\w+):\s*(.*)/);
        if (m) cur[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
      }
    }
    if (cur) withPreview.push(cur);
    const recent = withPreview.filter(e => e.input_preview && e.input_preview.length > 10 && e.scope).slice(-5);
    if (recent.length > 0) {
      console.log('\n═════════════════════════════════════════════════════════════');
      console.log('  RECENT LOG CLASSIFICATIONS (last 5 with preview):');
      console.log('═════════════════════════════════════════════════════════════\n');
      for (const e of recent) {
        console.log(`[${e.id}] session=${e.session}`);
        console.log(`  PREVIEW: "${e.input_preview.slice(0, 100)}"`);
        console.log(`  CLASSIFIED: scope=${e.scope} intent=${e.intent} mandate=${e.mandate_relation} route=${e.route}`);
        console.log(`  → correct? If not, add to golden set with: node classification-correction-capture.mjs --apply-new ...`);
        console.log('');
      }
    }
  }
}

// ── Apply correction mode ─────────────────────────────────────────────────────────

function applyCorrections(corrections) {
  if (!existsSync(GOLDEN_SET_PATH)) {
    console.error('[correction-capture] ERROR: golden set not found');
    process.exit(1);
  }

  let text = readFileSync(GOLDEN_SET_PATH, 'utf-8');
  const { entries, ruleCandidates } = parseGoldenSet(text);

  const correctionsMade = [];
  const misPatterns = {}; // axis:wrongValue → count

  for (const c of corrections) {
    // Format: "id:field:value"
    const m = c.match(/^(gs-\d+):(\w+):(.+)$/);
    if (!m) {
      console.warn(`[correction-capture] Skipping invalid correction: "${c}" (format: gs-NNN:field:value)`);
      continue;
    }
    const [, id, field, value] = m;
    const entry = entries.find(e => e.id === id);
    if (!entry) {
      console.warn(`[correction-capture] Entry ${id} not found in golden set`);
      continue;
    }

    const oldValue = entry.correct?.[field];
    if (oldValue === value) {
      console.log(`[correction-capture] ${id}.${field} already = ${value} (no change)`);
      continue;
    }

    // Track mis-patterns (classifier-predicted value vs correct value)
    if (oldValue && oldValue !== 'TBD' && oldValue !== value) {
      const key = `${field}:${oldValue}→${value}`;
      misPatterns[key] = (misPatterns[key] || 0) + 1;
    }

    // Apply correction in YAML text (simple string replacement)
    // Find the entry block and update the field under correct:
    const entryStart = text.indexOf(`\n  - id: "${id}"`);
    if (entryStart === -1) {
      console.warn(`[correction-capture] Could not locate entry ${id} in YAML text`);
      continue;
    }
    const nextEntry = text.indexOf('\n  - id: ', entryStart + 1);
    const entryBlock = text.slice(entryStart, nextEntry === -1 ? undefined : nextEntry);

    // Find the field in the correct: block
    const fieldRegex = new RegExp(`(    ${field}: ).+`);
    if (fieldRegex.test(entryBlock)) {
      const newBlock = entryBlock.replace(fieldRegex, `$1${value}`);
      text = text.slice(0, entryStart) + newBlock + (nextEntry === -1 ? '' : text.slice(nextEntry));
      correctionsMade.push({ id, field, oldValue, newValue: value });
      console.log(`[correction-capture] ✓ ${id}.correct.${field}: ${oldValue} → ${value}`);
    } else {
      console.warn(`[correction-capture] Field ${field} not found in ${id}.correct block`);
    }
  }

  // Update review_status for fully-reviewed entries
  for (const { id } of correctionsMade) {
    const entry = entries.find(e => e.id === id);
    if (entry && entry.review_status === 'TBD') {
      // Check if all TBD fields are now filled
      const c = entry.correct || {};
      const allFilled = ['scope', 'intent', 'mandate_relation', 'route'].every(
        f => c[f] && c[f] !== 'TBD'
      );
      if (allFilled) {
        text = text.replace(
          new RegExp(`(  - id: "${id}"[\\s\\S]*?    review_status: )TBD`),
          `$1ready`
        );
        console.log(`[correction-capture] ${id} → review_status: ready`);
      }
    }
  }

  // Check for rule-candidate escalation (K≥2 same mis-pattern)
  const newCandidates = Object.entries(misPatterns)
    .filter(([, count]) => count >= 2)
    .map(([pattern]) => pattern)
    .filter(p => !ruleCandidates.includes(p));

  if (newCandidates.length > 0) {
    console.log(`\n[correction-capture] ⚠ RULE-CANDIDATE: K≥2 mis-pattern(s) detected:`);
    for (const c of newCandidates) {
      console.log(`  → ${c} — classifier consistently wrong on this pattern`);
    }
    // Append to rule_candidates in YAML
    const rcPos = text.indexOf('\nrule_candidates: []');
    if (rcPos !== -1) {
      const candidateLines = newCandidates.map(c => `  - "${c}"`).join('\n');
      text = text.replace('\nrule_candidates: []', `\nrule_candidates:\n${candidateLines}`);
    } else {
      const rcBlockPos = text.indexOf('\nrule_candidates:');
      if (rcBlockPos !== -1) {
        const candidateLines = newCandidates.map(c => `  - "${c}"`).join('\n');
        text = text.slice(0, rcBlockPos + '\nrule_candidates:'.length) +
               '\n' + candidateLines +
               text.slice(rcBlockPos + '\nrule_candidates:'.length);
      }
    }
  }

  writeFileSync(GOLDEN_SET_PATH, text);
  console.log(`\n[correction-capture] ${correctionsMade.length} correction(s) applied to golden set.`);
  if (correctionsMade.length > 0) {
    console.log('Run: node tools/validators/validate-classification-accuracy.mjs to update accuracy %.');
  }
}

// ── Status mode ───────────────────────────────────────────────────────────────────

function status() {
  if (!existsSync(GOLDEN_SET_PATH)) {
    console.log('[correction-capture] golden set not found');
    return;
  }
  const { entries, history, ruleCandidates } = parseGoldenSet(readFileSync(GOLDEN_SET_PATH, 'utf-8'));
  const ready = entries.filter(e => e.review_status === 'ready');
  const tbd = entries.filter(e => e.review_status === 'TBD');
  console.log(`[correction-capture] golden-set status:`);
  console.log(`  total=${entries.length} ready=${ready.length} TBD=${tbd.length}`);
  console.log(`  rule_candidates=${ruleCandidates.length} accuracy_history_entries=${history.length}`);
  if (ruleCandidates.length > 0) {
    console.log('  Rule-candidates (classifier unreliable):');
    ruleCandidates.forEach(c => console.log('    → ' + c));
  }
  if (history.length > 0) {
    console.log('  Accuracy history:');
    history.slice(-3).forEach(h => console.log('    ' + h));
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────────

if (mode === '--review' || mode === 'review') {
  review();
} else if (mode === '--apply' || mode === 'apply') {
  const corrections = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--apply' && args[i + 1]) corrections.push(args[++i]);
  }
  applyCorrections(corrections);
} else if (mode === '--status' || mode === 'status') {
  status();
} else {
  console.log('Usage: node classification-correction-capture.mjs [--review | --apply "gs-NNN:field:value" | --status]');
  console.log('  --review: show golden-set TBD entries + recent log classifications');
  console.log('  --apply "gs-005:scope:constitutional": apply a single correction');
  console.log('  --status: show accuracy state + rule candidates');
}
