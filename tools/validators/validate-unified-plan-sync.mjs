#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-unified-plan-sync
 * @csps-name validate-unified-plan-sync
 * @csps-description S043-F: checks that tools/data/plan-api.json is fresher than
 *   tools/config/unified-plan.yaml. ADVISORY if stale — run pnpm plan:export.
 *   Prevents Planning Hub from silently showing outdated data.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces P-META-026
 */

import { statSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const PLAN_SOURCE = resolve(ROOT, 'tools/config/unified-plan.yaml');
const PLAN_API = resolve(ROOT, 'tools/data/plan-api.json');

if (!existsSync(PLAN_SOURCE)) {
  console.log('[validate-unified-plan-sync] plan_source_mtime=none api_mtime=none stale=false');
  console.log('[validate-unified-plan-sync] unified-plan.yaml not found — skipping');
  process.exit(0);
}

if (!existsSync(PLAN_API)) {
  console.warn('[validate-unified-plan-sync] plan_source_mtime=exists api_mtime=missing stale=true');
  console.warn('[validate-unified-plan-sync] ADVISORY: plan-api.json does not exist. Run: pnpm plan:export');
  process.exit(0);
}

const sourceMtime = statSync(PLAN_SOURCE).mtimeMs;
const apiMtime = statSync(PLAN_API).mtimeMs;
const stale = sourceMtime > apiMtime;

const sourceStr = new Date(sourceMtime).toISOString();
const apiStr = new Date(apiMtime).toISOString();

console.log(`[validate-unified-plan-sync] plan_source_mtime=${sourceStr} api_mtime=${apiStr} stale=${stale}`);

if (stale) {
  const diffMs = sourceMtime - apiMtime;
  const diffMins = Math.round(diffMs / 60000);
  console.warn(`[validate-unified-plan-sync] ADVISORY: plan-api.json is ${diffMins} minute(s) stale.`);
  console.warn(`[validate-unified-plan-sync] unified-plan.yaml was modified after plan-api.json was generated.`);
  console.warn(`[validate-unified-plan-sync] Fix: run pnpm plan:export to regenerate plan-api.json`);
} else {
  console.log('[validate-unified-plan-sync] plan-api.json is up to date');
}

process.exit(0); // ADVISORY
