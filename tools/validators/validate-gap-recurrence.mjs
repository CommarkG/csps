#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-gap-recurrence
 * @csps-name validate-gap-recurrence
 * @csps-description Gap Recurrence Register enforcement — K count gating per P-META-019.
 * Reads tools/data/gap-recurrence-register.yaml and enforces:
 *   K >= 3 AND status: open AND structural_fix_triggered: false → BLOCKING (P-META-019 fires)
 *   K >= 2 AND status: open AND behavioral_test_exists: false → ADVISORY (structural fix required, no test yet)
 *   K >= 1 AND status: open → report (surfaced, tracking)
 * A gap is RESOLVED only when behavioral_test_exists: true AND status: resolved.
 * "A gap with k_count >= 2 that is only 'documented' is NOT improving — it is accumulating."
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: Are there any gaps at K>=3 with no structural fix triggered? Those block session close.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REGISTER_FILE = resolve(ROOT, 'tools/data/gap-recurrence-register.yaml');

if (!existsSync(REGISTER_FILE)) {
  console.log('[validate-gap-recurrence] gap-recurrence-register.yaml not found — no entries to check');
  console.log('[validate-gap-recurrence] entries=0 k_ge2_no_test=0 k_ge3_no_fix=0 status=ADVISORY');
  process.exit(0);
}

const raw = readFileSync(REGISTER_FILE, 'utf-8');

// Simple YAML entry parser — each entry starts with "  - id:"
function parseEntries(text) {
  const entries = [];
  const lines = text.split('\n');
  let current = null;

  for (const line of lines) {
    if (/^\s{2}-\s+id:\s+/.test(line)) {
      if (current) entries.push(current);
      current = { id: line.replace(/.*id:\s*/, '').trim() };
    } else if (current && /^\s{4}k_count:\s+/.test(line)) {
      current.k_count = Number(line.replace(/.*k_count:\s*/, '').trim());
    } else if (current && /^\s{4}status:\s+/.test(line)) {
      current.status = line.replace(/.*status:\s*/, '').trim();
    } else if (current && /^\s{4}structural_fix_triggered:\s+/.test(line)) {
      current.structural_fix_triggered = line.replace(/.*structural_fix_triggered:\s*/, '').trim() === 'true';
    } else if (current && /^\s{4}behavioral_test_exists:\s+/.test(line)) {
      current.behavioral_test_exists = line.replace(/.*behavioral_test_exists:\s*/, '').trim() === 'true';
    } else if (current && /^\s{4}observation:\s+/.test(line)) {
      current.observation = line.replace(/.*observation:\s*"?([^"]*)"?\s*$/, '$1').trim();
    }
  }
  if (current) entries.push(current);
  return entries;
}

const entries = parseEntries(raw);
let blocking = 0;
let advisory = 0;
let open_count = 0;

for (const entry of entries) {
  const k = entry.k_count ?? 0;
  const isOpen = entry.status === 'open';
  const hasFix = entry.structural_fix_triggered === true;
  const hasTest = entry.behavioral_test_exists === true;

  if (!isOpen) continue;
  open_count++;

  if (k >= 3 && !hasFix) {
    console.error(`[validate-gap-recurrence] BLOCKING: ${entry.id} — K=${k} AND structural_fix_triggered=false`);
    console.error(`  Observation: ${entry.observation ?? '(none)'}`);
    console.error(`  P-META-019 fires: K>=3 open gap with no structural fix = session close blocked.`);
    blocking++;
  } else if (k >= 2 && !hasTest) {
    console.warn(`[validate-gap-recurrence] ADVISORY: ${entry.id} — K=${k}, structural fix exists but no behavioral test`);
    console.warn(`  "A gap with K>=2 that is only documented is NOT improving — it is accumulating."`);
    advisory++;
  } else if (k >= 1) {
    console.log(`[validate-gap-recurrence] TRACKING: ${entry.id} — K=${k}, status=open`);
  }
}

console.log(`[validate-gap-recurrence] entries=${entries.length} open=${open_count} k_ge2_no_test=${advisory} k_ge3_no_fix=${blocking}`);
process.exit(blocking > 0 ? 1 : 0);
