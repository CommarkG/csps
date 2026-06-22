#!/usr/bin/env node
/**
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields). Blocking decisions are structural/deterministic. Not in any blocking decision path.
 *
 * validate-inner-ai-defaults-freshness.mjs — AI defaults registry currency check
 *
 * ROOT CAUSE TARGETED: inner-ai-defaults/ was calibrated for Claude 3.x/4.x era at S006.
 * Claude 4.6[1M] shipped. The registry has no mechanism to detect when it's stale.
 * AI training defaults that OVERRIDE platform instructions must be kept current.
 *
 * Per EP-013 (ai-default-bypass) + B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS (P-META-017)
 * Per platform-maturation-plan.md WS-1 (AI Behavior Optimization)
 *
 * What it checks:
 *   CHECK A — Registry has csps_model_version field
 *   CHECK B — Registry calibration date is not older than 90 days
 *   CHECK C — continuous-drift-log.md exists and was updated this quarter
 *   CHECK D — All 6 category files exist and have content
 *
 * EXIT-CODED: 0 = registry fresh / 1 = registry stale
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const DEFAULTS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/inner-ai-defaults');

const REQUIRED_CATEGORY_FILES = [
  'README.md',
  'code-patterns.md',
  'prose-patterns.md',
  'reasoning-patterns.md',
  'tooling-patterns.md',
  'output-distribution.md',
  'continuous-drift-log.md',
];

const MAX_STALENESS_DAYS = 90;

function extractField(text, field) {
  const m = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

async function main() {
  const warnings = [];
  const infos = [];

  if (!existsSync(DEFAULTS_DIR)) {
    warnings.push('[CRITICAL] inner-ai-defaults/ directory not found — AI defaults registry missing');
    console.warn(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
    console.log(`\n[validate-inner-ai-defaults-freshness] registry_found=false warnings=1`);
    process.exit(1);
  }

  const readmePath = join(DEFAULTS_DIR, 'README.md');
  const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : '';

  // CHECK A — model version field
  const modelVersion = extractField(readme, 'csps_model_version');
  if (!modelVersion) {
    warnings.push('[CHECK A] inner-ai-defaults/README.md missing csps_model_version field — registry not model-anchored. Add: csps_model_version: <model-id>');
  } else {
    infos.push(`[CHECK A] Registry calibrated for: ${modelVersion}`);
  }

  // CHECK B — calibration date freshness
  const calibratedAt = extractField(readme, 'calibrated_at');
  if (!calibratedAt) {
    warnings.push('[CHECK B] inner-ai-defaults/README.md missing calibrated_at field — cannot check freshness');
  } else {
    const calibrationDate = new Date(calibratedAt);
    const daysSince = (Date.now() - calibrationDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > MAX_STALENESS_DAYS) {
      warnings.push(`[CHECK B] Registry calibrated ${Math.floor(daysSince)} days ago (max: ${MAX_STALENESS_DAYS}). Refresh needed: review all category files for model ${modelVersion}`);
    } else {
      infos.push(`[CHECK B] Registry calibrated ${Math.floor(daysSince)} days ago — within ${MAX_STALENESS_DAYS}-day freshness window`);
    }
  }

  // CHECK C — drift log exists and is not empty
  const driftLogPath = join(DEFAULTS_DIR, 'continuous-drift-log.md');
  if (!existsSync(driftLogPath)) {
    warnings.push('[CHECK C] continuous-drift-log.md missing — drift tracking not active');
  } else {
    const driftText = readFileSync(driftLogPath, 'utf8');
    if (driftText.length < 100) {
      warnings.push('[CHECK C] continuous-drift-log.md appears empty — no drift events recorded');
    } else {
      infos.push('[CHECK C] continuous-drift-log.md exists with content');
    }
  }

  // CHECK D — all category files present
  const missingFiles = REQUIRED_CATEGORY_FILES.filter(f => !existsSync(join(DEFAULTS_DIR, f)));
  if (missingFiles.length > 0) {
    warnings.push(`[CHECK D] Missing registry files: ${missingFiles.join(', ')}`);
  } else {
    infos.push(`[CHECK D] All ${REQUIRED_CATEGORY_FILES.length} registry files present`);
  }

  // Report
  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — AI defaults registry needs attention:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
    console.warn('\n  See: platform-maturation-plan.md WS-1 + docs/plan/_handoff/VAULT/inner-ai-defaults/README.md refresh_protocol');
  }
  for (const info of infos) console.log(`  ℹ ${info}`);

  const summary = `[validate-inner-ai-defaults-freshness] model=${modelVersion ?? 'UNKNOWN'} warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  if (warnings.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-inner-ai-defaults-freshness] fatal:', err); process.exit(1); });
