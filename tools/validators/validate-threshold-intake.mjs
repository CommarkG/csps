#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-threshold-intake
 * @csps-name validate-threshold-intake
 * @csps-description THRESHOLD R1.4.1 T2 — advisory report on intake log.
 * Reads tools/data/threshold-intake-log.yaml if it exists.
 * Reports: total entries, type distribution, session counts.
 * Exit 0 always. Advisory only.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:threshold audience:ai-agent
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE
 * context_question: What does this validator report and why is it advisory?
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LOG_FILE = resolve(ROOT, 'tools/data/threshold-intake-log.yaml');

if (!existsSync(LOG_FILE)) {
  console.log('[validate-threshold-intake] log not found — no entries yet (threshold intake starts on first governor prompt)');
  console.log('[validate-threshold-intake] total_entries=0 sessions=0 status=ADVISORY');
  process.exit(0);
}

const raw = readFileSync(LOG_FILE, 'utf-8');

// Count entries (each starts with "- id:")
const entries = (raw.match(/^- id:/gm) || []).length;

// Count by type
const typeMap = {};
const typeMatches = raw.matchAll(/^\s+type:\s+(\S+)/gm);
for (const m of typeMatches) {
  const t = m[1];
  typeMap[t] = (typeMap[t] || 0) + 1;
}

// Count unique sessions
const sessionSet = new Set();
const sessionMatches = raw.matchAll(/^\s+session:\s+"?([^"\n]+)"?/gm);
for (const m of sessionMatches) {
  sessionSet.add(m[1].trim());
}

const typeSummary = Object.entries(typeMap)
  .sort((a, b) => b[1] - a[1])
  .map(([t, n]) => `${t}:${n}`)
  .join(' ');

console.log(`[validate-threshold-intake] THRESHOLD R1.4.1 intake log report`);
console.log(`[validate-threshold-intake] total_entries=${entries} sessions=${sessionSet.size} type_distribution="${typeSummary}"`);
console.log(`[validate-threshold-intake] status=ADVISORY`);
process.exit(0);
