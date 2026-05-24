#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-humble-first-step
 * @csps-name validate-humble-first-step
 * @csps-description T2 for B_HUMBLE_FIRST_STEP. Scans tools/council/sonnet-turn.md for
 *   PROTO-* sections where STEP 1 has more than 10 sub-items.
 *   Over-scoped first steps indicate scope creep (B_HUMBLE_FIRST_STEP).
 *   ADVISORY ONLY — counts and reports. Upgrade to BLOCKING when pattern K>=2 in
 *   ux-violation-register.yaml.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_HUMBLE_FIRST_STEP P-META-019
 * context_question: "Do any PROTO STEP 1 sections have more than 10 sub-items? If yes, scope was too large."
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const THRESHOLD = 10; // sub-items above this = advisory

const SCAN_FILES = [
  resolve(ROOT, 'tools/council/sonnet-turn.md'),
];

let protosChecked = 0;
let overscoped = 0;
let advisory = 0;

for (const filePath of SCAN_FILES) {
  if (!existsSync(filePath)) continue;
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let inStep1 = false;
  let step1Count = 0;
  let currentProto = 'unknown';

  for (const line of lines) {
    // Detect PROTO headers
    if (/PROTO-[A-Z\d]+/.test(line) && /FROM SONNET|FOR OPUS/.test(line)) {
      const m = line.match(/PROTO-([A-Z\d]+)/);
      currentProto = m ? `PROTO-${m[1]}` : 'unknown';
    }

    // Detect STEP 1 start
    if (/STEP\s+1[\s:—–]/.test(line)) {
      if (inStep1 && step1Count > THRESHOLD) {
        // Report previous STEP 1 if it was overscoped
        protosChecked++;
        overscoped++;
        advisory++;
        console.warn(`[validate-humble-first-step] ADVISORY: ${currentProto} STEP 1 has ${step1Count} sub-items (threshold: ${THRESHOLD}).`);
        console.warn(`  Consider splitting into STEP 1 (core) + STEP 2 (extensions).`);
        console.warn(`  B_HUMBLE_FIRST_STEP: first steps should be minimal and achievable.`);
      } else if (inStep1) {
        protosChecked++;
      }
      inStep1 = true;
      step1Count = 0;
      continue;
    }

    // Detect STEP 2+ or separator = end of STEP 1
    if (inStep1 && (/STEP\s+[2-9][\s:—–]/.test(line) || /^[━═─]{10,}/.test(line))) {
      if (step1Count > THRESHOLD) {
        protosChecked++;
        overscoped++;
        advisory++;
        console.warn(`[validate-humble-first-step] ADVISORY: ${currentProto} STEP 1 has ${step1Count} sub-items (threshold: ${THRESHOLD}).`);
        console.warn(`  Consider splitting into STEP 1 (core) + STEP 2 (extensions).`);
      } else if (step1Count > 0) {
        protosChecked++;
      }
      inStep1 = false;
      step1Count = 0;
    }

    // Count sub-items within STEP 1
    if (inStep1 && line.trim() && !/STEP\s+1/.test(line)) {
      if (/^\s+\S/.test(line) || /^\s*[-•]\s/.test(line) || /^\s*\d+\./.test(line)) {
        step1Count++;
      }
    }
  }

  // Handle file-end with open STEP 1
  if (inStep1 && step1Count > 0) {
    protosChecked++;
    if (step1Count > THRESHOLD) {
      overscoped++;
      advisory++;
      console.warn(`[validate-humble-first-step] ADVISORY: ${currentProto} STEP 1 has ${step1Count} sub-items (threshold: ${THRESHOLD}).`);
    }
  }
}

console.log(`[validate-humble-first-step] protos_checked=${protosChecked} overscoped=${overscoped} advisory=${advisory}`);
console.log(`[validate-humble-first-step] (Advisory only — B_HUMBLE_FIRST_STEP scope discipline.)`);

process.exit(0);
