#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-improvement-register
 * @csps-name validate-improvement-register
 * @csps-description Positive improvement pipeline T2 (parallel to validate-gap-recurrence).
 * Reads tools/data/improvement-register.yaml.
 * ADVISORY: k_count >= 2 AND not_yet_propagated non-empty
 * BLOCKING: k_count >= 3 AND status=open AND not_yet_propagated non-empty
 * Exit 0 always. Advisory — positive pipeline is not yet blocking.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: "For each improvement at K>=2 — has CEC been run and are not_yet_propagated items in the current session's work queue?"
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REGISTER_FILE = join(ROOT, 'tools/data/improvement-register.yaml');

if (!existsSync(REGISTER_FILE)) {
  console.log('[validate-improvement-register] improvement-register.yaml not found — positive pipeline not yet initialized');
  console.log('[validate-improvement-register] entries=0 cec_needed=0 blocking=0 status=ADVISORY');
  process.exit(0);
}

const raw = readFileSync(REGISTER_FILE, 'utf-8');

function parseEntries(text) {
  const entries = [];
  const lines = text.split('\n');
  let current = null;
  let inNotYet = false;

  for (const line of lines) {
    if (/^\s{2}-\s+id:\s+/.test(line)) {
      if (current) entries.push(current);
      current = { id: line.replace(/.*id:\s*/, '').trim(), k_count: 0, status: 'open', not_yet_propagated: [] };
      inNotYet = false;
    } else if (current) {
      if (/^\s{4}k_count:/.test(line)) current.k_count = Number(line.replace(/.*k_count:\s*/, '').trim());
      else if (/^\s{4}status:/.test(line)) current.status = line.replace(/.*status:\s*/, '').trim();
      else if (/^\s{4}finding:/.test(line)) current.finding = line.replace(/.*finding:\s*"?([^"]*)"?\s*$/, '$1').trim();
      else if (/^\s{4}not_yet_propagated:/.test(line)) inNotYet = true;
      else if (inNotYet && /^\s{6}-\s+/.test(line)) current.not_yet_propagated.push(line.replace(/.*-\s+/, '').trim());
      else if (inNotYet && !/^\s{6}/.test(line) && line.trim()) inNotYet = false;
    }
  }
  if (current) entries.push(current);
  return entries;
}

const entries = parseEntries(raw);
let blocking = 0;
let cec_needed = 0;

for (const entry of entries) {
  const hasNotYet = entry.not_yet_propagated.length > 0;
  const isOpen = !['closed', 'propagated'].includes(entry.status);

  if (entry.k_count >= 3 && isOpen && hasNotYet) {
    console.error(`[validate-improvement-register] BLOCKING: ${entry.id} — K=${entry.k_count}, status=${entry.status}, not_yet_propagated has ${entry.not_yet_propagated.length} items`);
    console.error(`  CEC REQUIRED: complete extraction cycle — propagate to all surfaces.`);
    blocking++;
  } else if (entry.k_count >= 2 && hasNotYet) {
    console.warn(`[validate-improvement-register] ADVISORY: ${entry.id} — K=${entry.k_count}, not_yet_propagated: ${entry.not_yet_propagated.length} items`);
    console.warn(`  Finding: "${(entry.finding || '').slice(0, 80)}"`);
    console.warn(`  Run CEC — propagate to: ${entry.not_yet_propagated.slice(0, 2).join(', ')}${entry.not_yet_propagated.length > 2 ? ' ...' : ''}`);
    cec_needed++;
  } else if (hasNotYet) {
    console.log(`[validate-improvement-register] TRACKING: ${entry.id} — K=${entry.k_count}, ${entry.not_yet_propagated.length} items to propagate`);
  }
}

console.log(`[validate-improvement-register] entries=${entries.length} cec_needed=${cec_needed} blocking=${blocking} status=ADVISORY`);
process.exit(0);
