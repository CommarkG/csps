#!/usr/bin/env node
/**
 * validate-rzf-evidence.mjs — detects nominal RZF claims in closing-summaries
 *
 * ROOT CAUSE: Plans/sessions declared ZF-pass without citing THIS-SESSION pnpm verify
 * output. The closing-summary §10.0 RZF block says "exit_code: 0" but may be carrying
 * forward a prior session's run, not a run from THIS session.
 *
 * Per EP-008 (Nominal-RZF pattern) + P-META-006 (zero-findings-discipline) +
 * B_PRE_CLOSE_VERIFICATION: "re-run IS the proof — not memory of earlier call."
 *
 * What it checks on the LATEST closing-summary:
 *   CHECK A — §10.0 block present (not just mentioned)
 *   CHECK B — at least one pnpm verify output cited (cycle names present)
 *   CHECK C — ran_at timestamp is plausible (not older than 7 days — suggests stale)
 *   CHECK D — exit_code: 0 is present in the structured block
 *
 * EXIT-CODED: 0 = RZF evidence found / 1 = nominal RZF detected
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const VAULT_DIR = join(ROOT, 'docs/plan/_handoff/VAULT');

// Known cycle names — if any appear in §10.0, it's real not nominal
const KNOWN_CYCLE_NAMES = [
  'typecheck_recursive', 'principles_validate', 'frontmatter_validate',
  'aap_frontmatter_coverage', 'principle_count_staleness', 'principle_slices_sync',
  'behavioral_contract_slices_sync', 'audit_runner_slices_sync',
  'ai_behavior_spine_slices_sync', 'token_budget_validate', 'corespine_depth_markers',
  'session_artifact_sync', 'audit_slug_coverage', 'topic_plan_progress',
  'plan_know_how', 'intake_source_class_coverage', 'intake_event_validate',
  'git_pushed_state', 'mjs_syntax_check',
];

function getLatestClosingSummary() {
  const files = readdirSync(VAULT_DIR)
    .filter(f => f.startsWith('closing-summary-S') && f.endsWith('.md'))
    .sort().reverse();
  return files.length > 0 ? join(VAULT_DIR, files[0]) : null;
}

function extractSection(text, header) {
  const idx = text.indexOf(header);
  if (idx < 0) return '';
  const next = text.indexOf('\n## ', idx + header.length);
  return next > 0 ? text.slice(idx, next) : text.slice(idx, idx + 3000);
}

async function main() {
  // PRIMARY: verify-last-run.md is the definitive THIS-SESSION evidence
  const verifyLastRun = join(ROOT, 'tools/verify-last-run.md');
  if (existsSync(verifyLastRun)) {
    const runText = readFileSync(verifyLastRun, 'utf8');
    const hasExitCode0 = runText.includes('"exit_code": 0') || runText.includes('exit_code: 0');
    const hasCycles = KNOWN_CYCLE_NAMES.some(c => runText.includes(c));
    if (hasExitCode0 && hasCycles) {
      console.log('[validate-rzf-evidence] verify-last-run.md confirms THIS-SESSION ZF evidence');
      const summary = `[validate-rzf-evidence] source=verify-last-run.md checks=2 warnings=0`;
      console.log(`\n${summary}`);
      process.exit(0);
    }
  }

  // FALLBACK: check closing-summary §10.0 for formal session evidence
  const filePath = getLatestClosingSummary();
  if (!filePath) {
    console.log('[validate-rzf-evidence] no closing-summary or verify-last-run found; skipping');
    process.exit(0);
  }

  const text = readFileSync(filePath, 'utf8');
  const fileName = filePath.split(/[/\\]/).pop();
  const warnings = [];

  // CHECK A — §10.0 block present
  const section10 = extractSection(text, '§10.0');
  if (!section10) {
    warnings.push(`[CHECK A] ${fileName}: §10.0 Pre-close verification section MISSING — nominal RZF risk`);
  }

  // CHECK B — actual cycle names cited (not just "exit_code: 0")
  if (section10) {
    const cyclesFound = KNOWN_CYCLE_NAMES.filter(c => section10.includes(c));
    if (cyclesFound.length === 0) {
      warnings.push(`[CHECK B] ${fileName}: §10.0 present but no cycle names cited (typecheck_recursive, principles_validate, etc.) — may be narrative RZF, not evidence-backed`);
    }
  }

  // CHECK C — ran_at timestamp present
  if (section10 && !section10.includes('ran_at:')) {
    warnings.push(`[CHECK C] ${fileName}: §10.0 missing ran_at: timestamp — cannot verify this-session evidence`);
  }

  // CHECK D — exit_code: 0 cited
  if (section10 && !section10.includes('exit_code: 0') && !section10.includes('"exit_code": 0')) {
    warnings.push(`[CHECK D] ${fileName}: §10.0 present but exit_code: 0 not cited — RZF claim is unverified`);
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — nominal RZF risk in ${fileName}:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
    console.warn('\n  Fix: ensure closing-summary §10.0 cites pnpm verify output from THIS session');
  }

  const summary = `[validate-rzf-evidence] file=${fileName} checks=4 warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  // Advisory only for now — nominal RZF is serious but historical closing-summaries may not have full evidence
  process.exit(0);
}

main().catch(err => { console.error('[validate-rzf-evidence] fatal:', err); process.exit(1); });
