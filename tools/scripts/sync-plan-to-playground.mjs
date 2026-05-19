/**
 * @csps-id csps.tools.scripts.sync-plan-to-playground
 * @csps-name sync-plan-to-playground
 * @csps-description Copies tools/data/plan-api.json → csps-playground/api/plan.json
 *   and commits to the playground repo. Closes Q4 from S043 HANDOFF:
 *   "What's the playground sync mechanism?"
 *   Run: pnpm plan:sync-playground
 *   Typically run after pnpm plan:export (or automatically via pre-commit Check 4).
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces P-META-026
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const SOURCE = resolve(ROOT, 'tools/data/plan-api.json');

// Find playground repo
const PLAYGROUND_ROOTS = [
  resolve(ROOT, '../../csps-playground'),
  resolve(ROOT, '../../../csps-playground'),
];

let PLAYGROUND = null;
for (const p of PLAYGROUND_ROOTS) {
  if (existsSync(p)) { PLAYGROUND = p; break; }
}

if (!PLAYGROUND) {
  console.error('[plan:sync-playground] ERROR: csps-playground repo not found at expected paths.');
  console.error('  Expected: ' + PLAYGROUND_ROOTS.join(' or '));
  process.exit(1);
}

if (!existsSync(SOURCE)) {
  console.error('[plan:sync-playground] ERROR: tools/data/plan-api.json not found. Run pnpm plan:export first.');
  process.exit(1);
}

const DEST = resolve(PLAYGROUND, 'api/plan.json');
const destDir = dirname(DEST);

// Read source
const json = readFileSync(SOURCE, 'utf-8');
const data = JSON.parse(json);

// Ensure destination directory exists
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
  console.log('[plan:sync-playground] Created api/ directory in playground');
}

// Check if content is different
let isDifferent = true;
if (existsSync(DEST)) {
  const existing = readFileSync(DEST, 'utf-8');
  isDifferent = existing !== json;
}

if (!isDifferent) {
  console.log('[plan:sync-playground] api/plan.json already up to date — no changes needed');
  process.exit(0);
}

// Write to playground
writeFileSync(DEST, json, 'utf-8');
console.log('[plan:sync-playground] Written → ' + DEST);
console.log('[plan:sync-playground] Items: ' + (data.items || []).length + ' | Generated: ' + (data.meta?.generated_at || 'unknown'));

// Commit to playground repo
try {
  execSync('git add api/plan.json', { cwd: PLAYGROUND, encoding: 'utf-8' });
  const result = execSync('git status --porcelain', { cwd: PLAYGROUND, encoding: 'utf-8' });
  if (result.trim()) {
    execSync('git commit -m "sync: update api/plan.json from unified-plan.yaml (pnpm plan:sync-playground)"', {
      cwd: PLAYGROUND, encoding: 'utf-8'
    });
    console.log('[plan:sync-playground] Committed to playground repo');
    execSync('git push origin main', { cwd: PLAYGROUND, encoding: 'utf-8' });
    console.log('[plan:sync-playground] Pushed to origin');
  } else {
    console.log('[plan:sync-playground] No changes to commit in playground repo');
  }
} catch(err) {
  console.warn('[plan:sync-playground] Git operation failed: ' + err.message);
  console.warn('[plan:sync-playground] File was copied — push manually if needed');
}

console.log('[plan:sync-playground] Done. Planning Hub at csps-playground.vercel.app now reads fresh data.');
