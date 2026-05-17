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
 *   4. FIELD-LEVEL: fields in the generated schema exist in the app schema (per-model)
 *   5. FIELD-LEVEL: fields in the app schema not in generated schema surfaced as ADVISORY
 *
 * Coverage Levels:
 *   ✓ Level 1: Model-level drift (model names cross-checked between generated and app schema)
 *   ✓ Level 2: Field-level drift (fields per model cross-checked) — added S019 L1 opus-lessons
 *   ✗ Level 3: Live-DB vs. code drift (schema.prisma vs. actual Supabase schema) → VLT-S019-LIVEDB
 *   ✗ Level 4: Type annotation drift (@db.Uuid, @default, etc.) → VLT-S019-ANNOTATIONS
 *
 * Exit codes:
 *   0 = clean (generate OK + no drift at covered levels)
 *   1 = generate failed OR model/field BLOCKING drift detected
 *
 * Resolution:
 *   Generate failed: fix the ZModel error shown in output
 *   Model drift: update app schema.prisma OR update libs/policies/schema.zmodel
 *   Field drift (BLOCKING): add missing field to app schema OR to ZMODEL_ONLY_DEFERRED
 *   Field drift (ADVISORY): add field to ZModel OR to APP_ONLY_ACCEPTED_FIELDS
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
const APP_ONLY_ACCEPTED = new Set([]);

// Models that are in the ZModel but intentionally NOT in the app schema yet
// Budget Planner models (BudgetCategory, Transaction) are App #2 domain — not used by task-mgmt
const ZMODEL_ONLY_DEFERRED = new Set([
  'BudgetCategory',    // App #2 Budget Planner — not used by task-mgmt
  'Transaction',       // App #2 Budget Planner — not used by task-mgmt
  'BudgetGoal',        // App #2 Budget Planner wizard completion — not used by task-mgmt
  'Habit',             // App #2 Habit Tracker — not used by task-mgmt
  'HabitLog',          // App #2 Habit Tracker — not used by task-mgmt
]);

// Fields that exist in the app schema but intentionally NOT in ZModel
// Format: "ModelName.fieldName"
// Add here when an app-local field is intentional (e.g., an app-specific extension)
const APP_ONLY_ACCEPTED_FIELDS = new Set([
  // 'Tenant.stripeSubscriptionId',  // Example: uncomment + add VLT when intentionally app-only
]);

// Fields in ZModel/generated that are intentionally absent from app schema
// Format: "ModelName.fieldName"
// Budget Planner relations on Tenant — not needed in task-mgmt app (App #2 domain only)
const ZMODEL_ONLY_DEFERRED_FIELDS = new Set([
  'Tenant.budgetCategories',  // App #2 Budget Planner relation
  'Tenant.transactions',      // App #2 Budget Planner relation
  'Tenant.budgetGoal',        // App #2 Budget Planner wizard relation (optional)
  'Tenant.habits',            // App #2 Habit Tracker relation
  'Tenant.habitLogs',         // App #2 Habit Tracker relation
]);

// ── Model name extraction ───────────────────────────────────────────────────

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
    const m = line.match(/^model\s+(\w+)\s+(?:extends\s+\w+\s*)?\{/);
    if (m) models.push(m[1]);
  }
  return new Set(models);
}

// ── Field extraction ────────────────────────────────────────────────────────

/**
 * Extract field names for a specific model from a Prisma schema text.
 * Handles standard Prisma schema format (not ZModel — use generatedText for comparisons).
 */
function extractFieldsForModel(prismaText, modelName) {
  const lines = prismaText.split('\n');
  const fields = new Set();
  let inModel = false;
  let depth = 0;

  for (const line of lines) {
    if (!inModel) {
      // Match "model ModelName {" (generated Prisma format)
      const m = line.match(/^model\s+(\w+)\s*\{/);
      if (m && m[1] === modelName) {
        inModel = true;
        depth = 1;
        continue;
      }
    }

    if (!inModel) continue;

    // Track brace depth to know when model ends
    for (const ch of line) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }

    if (depth <= 0) break; // End of model block

    const trimmed = line.trim();

    // Skip: empty, block-level attributes (@@), comments, braces
    if (!trimmed || trimmed.startsWith('@@') || trimmed.startsWith('//') ||
        trimmed.startsWith('{') || trimmed.startsWith('}') || trimmed.startsWith('*')) {
      continue;
    }

    // Field definition starts with an identifier followed by whitespace
    const fieldMatch = trimmed.match(/^([a-zA-Z_]\w*)\s+/);
    if (fieldMatch) {
      fields.add(fieldMatch[1]);
    }
  }

  return fields;
}

// ── Main ────────────────────────────────────────────────────────────────────

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

  // ── Step 2: Parse schemas ───────────────────────────────────────────────────
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

  // ── Step 3: Model-level drift ───────────────────────────────────────────────
  const blocking = [];
  const warnings = [];

  for (const m of generatedModels) {
    if (!appModels.has(m) && !ZMODEL_ONLY_DEFERRED.has(m)) {
      blocking.push(`[MODEL-DRIFT] Model '${m}' in ZModel/generated but missing from apps/task-mgmt/prisma/schema.prisma`);
    }
  }

  for (const m of appModels) {
    if (!generatedModels.has(m) && !APP_ONLY_ACCEPTED.has(m)) {
      warnings.push(`[ADVISORY] Model '${m}' in app schema but not in platform ZModel (acceptable if app-local)`);
    }
  }

  // ── Step 4: Field-level drift (Level 2 coverage — S019 L1 opus-lessons) ────
  // For each model present in BOTH schemas, compare fields.
  const fieldBlocking = [];
  const fieldAdvisory = [];

  const modelsInBoth = [...generatedModels].filter(m => appModels.has(m));

  for (const modelName of modelsInBoth) {
    const generatedFields = extractFieldsForModel(generatedText, modelName);
    const appFields       = extractFieldsForModel(appText, modelName);

    // Fields in generated (ZModel) but missing from app schema → BLOCKING
    for (const field of generatedFields) {
      const key = `${modelName}.${field}`;
      if (!appFields.has(field) && !ZMODEL_ONLY_DEFERRED_FIELDS.has(key)) {
        fieldBlocking.push(
          `[FIELD-DRIFT BLOCKING] ${modelName}.${field} — in ZModel/generated but missing from app schema`
        );
      }
    }

    // Fields in app schema but missing from generated (ZModel) → ADVISORY
    for (const field of appFields) {
      const key = `${modelName}.${field}`;
      if (!generatedFields.has(field) && !APP_ONLY_ACCEPTED_FIELDS.has(key)) {
        fieldAdvisory.push(
          `[FIELD-DRIFT ADVISORY] ${modelName}.${field} — in app schema but NOT in ZModel (add to ZModel or APP_ONLY_ACCEPTED_FIELDS)`
        );
      }
    }
  }

  // ── Step 5: Report ──────────────────────────────────────────────────────────
  if (blocking.length > 0) {
    console.error('\n⛔ FOUNDATION SCHEMA MODEL-DRIFT DETECTED:');
    for (const b of blocking) console.error('  ' + b);
    console.error('\nResolution: update app schema.prisma to match ZModel OR add model to ZMODEL_ONLY_DEFERRED');
  }

  if (fieldBlocking.length > 0) {
    console.error('\n⛔ FOUNDATION SCHEMA FIELD-DRIFT DETECTED (BLOCKING):');
    for (const b of fieldBlocking) console.error('  ' + b);
    console.error('\nResolution: add the missing field to apps/task-mgmt/prisma/schema.prisma');
    console.error('OR add the field key ("ModelName.fieldName") to ZMODEL_ONLY_DEFERRED_FIELDS in this validator');
  }

  if (fieldAdvisory.length > 0) {
    console.log('\n⚠ FIELD-DRIFT ADVISORY (app has fields not in ZModel):');
    for (const a of fieldAdvisory) console.log('  ' + a);
    console.log('\nResolution options:');
    console.log('  (a) Add the field to libs/policies/schema.zmodel (preferred — keeps ZModel as SSoT)');
    console.log('  (b) Add the field key to APP_ONLY_ACCEPTED_FIELDS if intentionally app-local');
  }

  if (warnings.length > 0) {
    console.log('\nAdvisory (app-local models — may be expected):');
    for (const w of warnings) console.log('  ' + w);
  }

  const totalBlocking = blocking.length + fieldBlocking.length;
  const status = totalBlocking > 0 ? 'DRIFT' : 'CLEAN';

  console.log(`\n[validate-foundation-schema-drift] generate_ok=true zmodel_models=${generatedModels.size} app_models=${appModels.size} model_drift=${blocking.length} field_blocking=${fieldBlocking.length} field_advisory=${fieldAdvisory.length} advisory=${warnings.length} status=${status}`);

  process.exit(totalBlocking > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[validate-foundation-schema-drift] fatal:', err);
  process.exit(1);
});
