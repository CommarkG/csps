#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.capture-session-evidence
 * @csps-name capture-session-evidence
 * Basic session evidence capture — INFRA-FLOW-VALIDATION Step 9 (PARTIAL).
 * Reads verify-last-run.md, sonnet-turn.md, gap register, layer progress.
 * Writes structured evidence to .csps/evidence/session-<S0NN>-evidence.yaml
 * Usage: node tools/scripts/capture-session-evidence.mjs --session=S056
 * Plan item: INFRA-FLOW-VALIDATION | S056 | Layer 3
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const EVIDENCE_DIR = join(ROOT, '.csps', 'evidence');
const VERIFY_LAST_RUN = join(ROOT, 'tools/verify-last-run.md');
const SONNET_TURN = join(ROOT, 'tools/council/sonnet-turn.md');
const GAP_REGISTER = join(ROOT, 'tools/data/gap-recurrence-register.yaml');
const CORE_CRITERIA = join(ROOT, 'docs/plan/pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md');

const args = process.argv.slice(2);
const sessionArg = args.find(a => a.startsWith('--session='));
const session = sessionArg?.replace('--session=', '').trim() ?? 'unknown';

function readSafe(path, fallback = '') {
  return existsSync(path) ? readFileSync(path, 'utf-8') : fallback;
}

// Extract verify stats from verify-last-run.md
function getVerifyStats() {
  const text = readSafe(VERIFY_LAST_RUN);
  const exitCode = text.match(/"exit_code":\s*(\d+)/)?.[1] ?? '?';
  const validators = text.match(/"validators_checked":\s*(\d+)/)?.[1] ?? '?';
  const ranAt = text.match(/ran_at: ([^\n]+)/)?.[1]?.trim() ?? '?';
  return { exit_code: Number(exitCode), validators_checked: Number(validators), ran_at: ranAt };
}

// Extract K counts from gap register
function getGapSnapshot() {
  const text = readSafe(GAP_REGISTER);
  const entries = [];
  let current = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\r$/, '');
    if (/^\s{2}-\s+id:/.test(line)) {
      if (current) entries.push(current);
      current = { id: line.replace(/.*id:\s*/, '').trim() };
    } else if (current && /^\s{4}k_count:/.test(line)) {
      current.k = Number(line.replace(/.*k_count:\s*/, '').trim());
    } else if (current && /^\s{4}status:/.test(line)) {
      current.status = line.replace(/.*status:\s*/, '').trim();
    }
  }
  if (current) entries.push(current);
  return entries.filter(e => e.k >= 2).map(e => `${e.id} K=${e.k} (${e.status})`);
}

// Extract layer progress from CORE-COMPLETE-EXIT-CRITERIA.md
function getLayerProgress() {
  const text = readSafe(CORE_CRITERIA);
  const layers = {};
  let current = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\r$/, '');
    const lm = line.match(/^## (Layer \d+)/);
    if (lm) { current = lm[1]; layers[current] = { checked: 0, total: 0 }; }
    if (current) {
      if (/^- \[x\]/i.test(line)) { layers[current].checked++; layers[current].total++; }
      else if (/^- \[ \]/.test(line)) layers[current].total++;
    }
  }
  return Object.entries(layers).map(([k, v]) => `${k}: ${v.checked}/${v.total}`).join(', ');
}

// Get recent Sonnet turn summary (first 3 lines of top block)
function getSonnetSummary() {
  const text = readSafe(SONNET_TURN);
  const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 3);
  return lines.join(' | ').slice(0, 200);
}

const verify = getVerifyStats();
const gapSnapshot = getGapSnapshot();
const layerProgress = getLayerProgress();
const sonnetSummary = getSonnetSummary();

const evidence = {
  session,
  captured_at: new Date().toISOString(),
  verify: {
    exit_code: verify.exit_code,
    validators_checked: verify.validators_checked,
    ran_at: verify.ran_at,
  },
  layer_progress: layerProgress,
  gap_snapshot_k2: gapSnapshot,
  sonnet_summary: sonnetSummary,
};

if (!existsSync(EVIDENCE_DIR)) mkdirSync(EVIDENCE_DIR, { recursive: true });
const outPath = join(EVIDENCE_DIR, `session-${session}-evidence.yaml`);
writeFileSync(outPath, JSON.stringify(evidence, null, 2), 'utf-8');

console.log(`[capture-session-evidence] session=${session}`);
console.log(`[capture-session-evidence] verify: exit_code=${evidence.verify.exit_code} validators=${evidence.verify.validators_checked}`);
console.log(`[capture-session-evidence] layers: ${layerProgress}`);
console.log(`[capture-session-evidence] gaps_k2: ${gapSnapshot.length} entries`);
console.log(`[capture-session-evidence] output: .csps/evidence/session-${session}-evidence.yaml`);
