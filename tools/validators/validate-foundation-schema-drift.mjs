#!/usr/bin/env node
/**
 * validate-foundation-schema-drift.mjs — ZModel ↔ Prisma Schema Drift Gate
 *
 * ROOT CAUSE TARGETED (S017 ZenStack mandate):
 *   With ZenStack as the canonical schema layer, the ZModel in libs/policies/
 *   must stay in sync with every app's prisma/schema.prisma. Silent drift means
 *   app schemas diverge from platform policies — security and type bugs compound
 *   across all 30 apps silently.
 *
 * What it checks:
 *   1. zenstack generate exits 0 (ZModel is syntactically valid + policy-valid)
 *   2. Models defined in libs/policies/schema.zmodel exist in apps/task-mgmt/prisma/schema.prisma
 *   3. No unexpected models in app schema that bypass the platform policy layer
 *
 * Exit codes:
 *   0 = clean (generate OK + no drift)
 *   1 = generate failed (ZModel invalid) OR drift detected (models out of sync)
 *
 * Resolution:
 *   Generate failed: fix the ZModel error shown in output
 *   Drift detected: update app schema.prisma OR update libs/policies/schema.zmodel
 *   App-only model (not in ZModel): acceptable if intentional — add to ZMODEL_ONLY_EXCLUSIONS
 */

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const ZMODEL_SCHEMA   = join(ROOT, 'libs/policies/schema.zmodel');
const GENERATED_SCHEMA = join(ROOT, 'libs/policies/generated/schema.prisma');
const APP_SCHEMA       = join(ROOT, 'apps/task-mgmt/prisma/schema.prisma');

// Models that are in the app schema but intentionally NOT in platform ZModel
// (e.g., app-local models that haven't been lifted to platform yet)
const APP_ONLY_ACCEPTED = new Set([]);

// Models that are in the ZModel but intentionally NOT in the app schema yet
// (deferred to future session with explicit tracking)
const ZMODEL_ONLY_DEFERRED = new Set([]);

function extractModels(prismaText) {
  const models = [];
  for (const line of prismaText.split('\n')) {
    const m = line.match(/^model\s+(\w+)\s*\{/);
    if (m) models.push(m[1]);
  }
  return new Set(models);
}

function extractZModelModels(zmodelText) {
  const models = [];
  for (const line of zmodelText.split('\n')) {
    // Match "model X extends Base" or "model X {"
    const m = line.match(/^model\s+(\w+)\s+(?:extends\s+\w+\s*)?\{/);
    if (m) models.push(m[1]);
  }
  return new Set(models);
}

async function main() {
  if (!existsSync(ZMODEL_SCHEMA)) {
    console.log('[validate-foundation-schema-drift] libs/policies/schema.zmodel not found — skipping');
    process.exit(0);
  }

  if (!existsSync(APP_SCHEMA)) {
    console.log('[validate-foundation-schema-drift] apps/task-mgmt/prisma/schema.prisma not found — skipping');
    process.exit(0);
  }

  // ── Step 1: Run zenstack generate ──────────────────────────────────────────
  const result = spawnSync(
    'pnpm',
    ['exec', 'zenstack', 'generate', '--schema', 'libs/policies/schema.zmodel'],
    { cwd: ROOT, encoding: 'utf8', shell: true }
  );

  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || '').split('\n').slice(0, 20).join('\n');
    console.error('\n⛔ ZENSTACK GENERATE FAILED — ZModel is invalid:');
    console.error(err);
    console.error('\nResolution: fix the ZModel error shown above in libs/policies/schema.zmodel');
    console.error('\n[validate-foundation-schema-drift] generate_ok=false status=FAIL');
    process.exit(1);
  }

  // ── Step 2: Parse generated schema ─────────────────────────────────────────
  if (!existsSync(GENERATED_SCHEMA)) {
    console.error('[validate-foundation-schema-drift] Generated schema not found after zenstack generate — unexpected');
    process.exit(1);
  }

  const generatedText = readFileSync(GENERATED_SCHEMA, 'utf8');
  const zmodelText    = readFileSync(ZMODEL_SCHEMA, 'utf8');
  const appText       = readFileSync(APP_SCHEMA, 'utf8');

  const zmodelModels    = extractZModelModels(zmodelText);
  const generatedModels = extractModels(generatedText);
  const appModels       = extractModels(appText);

  // ── Step 3: Check drift ─────────────────────────────────────────────────────
  const blocking = [];
  const warnings = [];

  // ZModel models that should be in app schema (drift = missing)
  for (const m of generatedModels) {
    if (!appModels.has(m) && !ZMODEL_ONLY_DEFERRED.has(m)) {
      blocking.push(`[DRIFT] Model '${m}' in ZModel/generated but missing from apps/task-mgmt/prisma/schema.prisma`);
    }
  }

  // App schema models not in ZModel (may be intentional app-only models)
  for (const m of appModels) {
    if (!generatedModels.has(m) && !APP_ONLY_ACCEPTED.has(m)) {
      warnings.push(`[ADVISORY] Model '${m}' in app schema but not in platform ZModel (acceptable if app-local)`);
    }
  }

  if (blocking.length > 0) {
    console.error('\n⛔ FOUNDATION SCHEMA DRIFT DETECTED:');
    for (const b of blocking) console.error('  ' + b);
    console.error('\nResolution: update app schema.prisma to match ZModel OR add model to ZMODEL_ONLY_DEFERRED list');
  }

  if (warnings.length > 0) {
    console.log('\nAdvisory (app-local models — expected):');
    for (const w of warnings) console.log('  ' + w);
  }

  const status = blocking.length > 0 ? 'DRIFT' : 'CLEAN';
  console.log(`\n[validate-foundation-schema-drift] generate_ok=true zmodel_models=${generatedModels.size} app_models=${appModels.size} drift_count=${blocking.length} advisory=${warnings.length} status=${status}`);

  process.exit(blocking.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[validate-foundation-schema-drift] fatal:', err);
  process.exit(1);
});
