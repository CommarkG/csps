#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-pi-questions-answered
 * @csps-name validate-pi-questions-answered
 * @csps-description PI Questions Gate: for each PI-NNN file with status: implementing,
 * checks that the questions: array has zero entries with status: unanswered.
 * ADVISORY if unanswered pre-implementation questions exist — implementation should not
 * proceed until all questions are resolved. Implements OPEN-007.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:developer
 * @csps-enforces P-ARCH-031
 *
 * Coverage Levels:
 *   ✓ Checks: all PI files in plan-items/ with status: implementing
 *   ✓ Detects: questions with status: unanswered
 *   ✗ Does not check: questions with no status field (treated as non-unanswered)
 *   ✗ Does not validate: question quality or relevance
 *
 * Exit: 0 always (ADVISORY only)
 * Output: pi_checked=N implementing=N advisories=N
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLAN_ITEMS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/plan-items');

let piChecked = 0;
let implementing = 0;
let advisories = 0;

if (!existsSync(PLAN_ITEMS_DIR)) {
  console.log(`[validate-pi-questions-answered] plan-items dir not found pi_checked=0 implementing=0 advisories=0`);
  process.exit(0);
}

const files = readdirSync(PLAN_ITEMS_DIR).filter(f => /^PI-\d{3}-.*\.yaml$/.test(f));
piChecked = files.length;

for (const file of files) {
  const content = readFileSync(resolve(PLAN_ITEMS_DIR, file), 'utf-8');

  // Check status: implementing
  if (!/^\s*status:\s*implementing/m.test(content)) continue;
  implementing++;

  const piId = file.match(/^(PI-\d{3})/)?.[1] ?? file;

  // Find unanswered questions
  // Parse simple YAML: look for "status: unanswered" within questions: block
  const questionBlocks = content.split(/(?=\s*-\s*id:\s*Q\d+)/);
  let unansweredCount = 0;

  for (const block of questionBlocks) {
    if (/status:\s*unanswered/.test(block)) {
      unansweredCount++;
    }
  }

  if (unansweredCount > 0) {
    advisories++;
    console.warn(
      `[validate-pi-questions-answered] ADVISORY: ${piId} has ${unansweredCount} unanswered pre-implementation question(s).\n` +
      `  File: docs/plan/_handoff/VAULT/plan-items/${file}\n` +
      `  Fix: answer all questions (set status: answered with answer: text) before proceeding to implementation.\n` +
      `  Rationale: P-ARCH-031 — DONE = built + wired + called + verified. Unanswered questions = unknown DONE criteria.`
    );
  }
}

console.log(`[validate-pi-questions-answered] pi_checked=${piChecked} implementing=${implementing} advisories=${advisories}`);
process.exit(0);
