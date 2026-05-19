#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-invariant-coverage
 * @csps-name validate-invariant-coverage
 * @csps-description S044 PROTO-034 Step 3: reads tools/config/invariant-registry.yaml.
 *   For each invariant, checks if T1 hook exists in .claude/hooks/ and T2 validator
 *   exists in tools/validators/. Reports complete/partial/minimal per invariant.
 *   ADVISORY (exits 0 always).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces P-META-027
 *
 * Exit: 0 always (ADVISORY)
 * Output: invariants_checked=N complete=N partial=N minimal=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const require = createRequire(import.meta.url);

const REGISTRY = resolve(ROOT, 'tools/config/invariant-registry.yaml');
const HOOKS_DIR = resolve(ROOT, '.claude/hooks');
const VALIDATORS_DIR = resolve(ROOT, 'tools/validators');

if (!existsSync(REGISTRY)) {
  console.log('[validate-invariant-coverage] invariants_checked=0 complete=0 partial=0 minimal=0');
  console.log('[validate-invariant-coverage] invariant-registry.yaml not found — skipping');
  process.exit(0);
}

let yaml;
try {
  yaml = require('js-yaml');
} catch(e) {
  console.log('[validate-invariant-coverage] js-yaml not available — skipping');
  process.exit(0);
}

const registry = yaml.load(readFileSync(REGISTRY, 'utf-8'));
const invariants = registry.invariants || [];

let checked = 0;
let complete = 0;
let partial = 0;
let minimal = 0;

for (const inv of invariants) {
  checked++;
  const declaredStatus = inv.status || 'unknown';

  // Check T1 hook exists
  const t1 = inv.enforcement?.t1;
  const t1IsReal = t1 && t1 !== 'MISSING' && t1 !== 'none';
  const t1Exists = t1IsReal ? existsSync(resolve(HOOKS_DIR, t1)) : false;

  // Check T2 validator exists
  const t2 = inv.enforcement?.t2;
  const t2IsReal = t2 && t2 !== 'MISSING' && t2 !== 'none';
  const t2Exists = t2IsReal ? existsSync(resolve(VALIDATORS_DIR, t2)) : false;

  // Compute actual status
  let actualStatus;
  if (t1Exists && t2Exists) {
    actualStatus = 'complete';
    complete++;
  } else if (t1Exists || t2Exists) {
    actualStatus = 'partial';
    partial++;
  } else {
    actualStatus = 'minimal';
    minimal++;
  }

  const match = actualStatus === declaredStatus ? '✓' : '⚠';
  const t1Label = t1IsReal ? (t1Exists ? 'EXISTS' : 'MISSING-FILE') : 'NOT-DECLARED';
  const t2Label = t2IsReal ? (t2Exists ? 'EXISTS' : 'MISSING-FILE') : 'NOT-DECLARED';

  if (actualStatus !== 'complete') {
    console.warn(
      `[validate-invariant-coverage] ADVISORY: ${inv.id} (${inv.name}) status=${actualStatus}\n` +
      `  T1 (${t1 || 'none'}): ${t1Label}\n` +
      `  T2 (${t2 || 'none'}): ${t2Label}\n` +
      `  Declared: ${declaredStatus} ${match}\n` +
      (inv.gap ? `  Gap: ${inv.gap}\n` : '') +
      (inv.upgrade_path ? `  Upgrade: ${inv.upgrade_path}` : '')
    );
  }
}

console.log(`[validate-invariant-coverage] invariants_checked=${checked} complete=${complete} partial=${partial} minimal=${minimal}`);

if (minimal > 0 || partial > 0) {
  console.warn(`[validate-invariant-coverage] ADVISORY: ${partial + minimal} invariant(s) need T1 or T2 upgrade.`);
  console.warn(`[validate-invariant-coverage] Reference: tools/config/invariant-registry.yaml + gap/upgrade_path fields.`);
}

process.exit(0);
