#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.record-user-journey-test
 * @csps-name record-user-journey-test
 * @csps-description Records the result of a manual user journey test to the UJT vault.
 * Reads the existing UJT-NNN.yaml, updates actual_result and tested_at, writes back.
 * Creates the file if it doesn't exist (initializes with pending state).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance domain:ux audience:developer
 * @csps-enforces P-ARCH-031
 *
 * Usage:
 *   node tools/scripts/record-user-journey-test.mjs --test UJT-001 --result pass --observation "User saw wizard, completed it, reached dashboard with balance"
 *   node tools/scripts/record-user-journey-test.mjs --test UJT-001 --result fail --observation "Wizard appeared but redirect after completion went to 404"
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const UJT_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/user-journey-tests');

const args = process.argv.slice(2);
function getArg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const testId = getArg('--test');
const result = getArg('--result');
const observation = getArg('--observation');

if (!testId || !result || !observation) {
  console.error('[record-ujt] ERROR: --test, --result, and --observation are all required');
  console.error('  Usage: node tools/scripts/record-user-journey-test.mjs --test UJT-001 --result pass --observation "..."');
  process.exit(1);
}

if (!['pass', 'fail', 'partial', 'blocked'].includes(result)) {
  console.error('[record-ujt] ERROR: --result must be: pass | fail | partial | blocked');
  process.exit(1);
}

if (!existsSync(UJT_DIR)) mkdirSync(UJT_DIR, { recursive: true });

const filePath = resolve(UJT_DIR, `${testId}.yaml`);

if (!existsSync(filePath)) {
  console.error(`[record-ujt] ERROR: ${testId}.yaml not found at ${filePath}`);
  console.error('  Create the UJT file first, then record results against it.');
  process.exit(1);
}

const content = readFileSync(filePath, 'utf-8');
const testedAt = new Date().toISOString();

let updated = content;

// Update actual_result
if (/^actual_result:\s*/m.test(content)) {
  updated = updated.replace(/^actual_result:\s*.*/m, `actual_result: "${result}"`);
} else {
  updated = updated.trimEnd() + `\nactual_result: "${result}"\n`;
}

// Update tested_at
if (/^tested_at:\s*/m.test(content)) {
  updated = updated.replace(/^tested_at:\s*.*/m, `tested_at: "${testedAt}"`);
} else {
  updated = updated.trimEnd() + `\ntested_at: "${testedAt}"\n`;
}

// Update observation
const obsLine = `observation: "${observation.replace(/"/g, '\\"')}"`;
if (/^observation:\s*/m.test(content)) {
  updated = updated.replace(/^observation:.*$/m, obsLine);
} else {
  updated = updated.trimEnd() + `\n${obsLine}\n`;
}

// Update status in frontmatter
updated = updated.replace(/^status:\s*pending/m, `status: ${result}`);

writeFileSync(filePath, updated, 'utf-8');
console.log(`[record-ujt] ${testId} recorded: result=${result} at ${testedAt}`);
console.log(`[record-ujt] observation: ${observation.slice(0, 100)}${observation.length > 100 ? '...' : ''}`);
console.log(`[record-ujt] file: docs/plan/_handoff/VAULT/user-journey-tests/${testId}.yaml`);
