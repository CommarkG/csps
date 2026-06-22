#!/usr/bin/env node
/**
 * validate-ts-compile.mjs — BLOCKING TypeScript compilation gate for csps-playground
 *
 * PROTO-S088-PHASE-0.3-404-FIX | S088
 * Root cause: page.tsx had protectionLevel="sealed" but ProtectionLevel type only had
 *   'sacred'|'protected'|'active'|'draft' — TS2322 type error silently fails Vercel build → 404.
 * Prevention: run tsc --noEmit on every verify, block if any TS errors exist.
 *
 * BLOCKING if: tsc reports any errors (exit code ≠ 0)
 * PASSES if: tsc --noEmit exits 0 (no type errors)
 *
 * Runs as: node tools/validators/validate-ts-compile.mjs
 * From:     repo root (c:\...\Csps)
 *
 * @csps-dna core_spine: VALD
 * @csps-id csps.validators.validate-ts-compile
 * @csps-prevention-class TS-BUILD-FAILURE PAGE-404-FROM-TYPE-ERROR
 * @csps-enforces B_PAGE_COMPLETE PROTO-S088-PHASE-0.3-404-FIX
 * @csps-version 1.0.0
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:build audience:ai-agent
 *
 * run_tier: STANDARD
 * always_rerun: true  (submodule file state changes outside parent file content)
 */

import { execSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '../..');
const APP_DIR   = join(ROOT, 'apps/csps-playground');
const LAST_RUN  = join(ROOT, 'tools/data/validate-ts-compile-last-run.json');

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// ─── CHECK 1: app directory exists ──────────────────────────────────────────
console.log('[validate-ts-compile] TypeScript compilation gate for csps-playground');
console.log('  BLOCKING: any tsc type error');
console.log('');

if (!existsSync(APP_DIR)) {
  BLOCK(`csps-playground directory missing: ${APP_DIR} — submodule not checked out?`);
  writeLastRun();
  process.exit(1);
}

const tsconfig = join(APP_DIR, 'tsconfig.json');
if (!existsSync(tsconfig)) {
  BLOCK('apps/csps-playground/tsconfig.json missing — cannot run type check');
  writeLastRun();
  process.exit(1);
}

PASS('apps/csps-playground exists with tsconfig.json');

// ─── CHECK 2: run tsc --noEmit ──────────────────────────────────────────────
let tscOutput = '';
let tscExitCode = 0;

try {
  // Use npx tsc to pick up the local TypeScript version in csps-playground
  tscOutput = execSync(
    'npx tsc --noEmit 2>&1',
    {
      cwd: APP_DIR,
      encoding: 'utf8',
      timeout: 60000,
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );
  // If we get here without throw, tsc exited 0 — no errors
  PASS('tsc --noEmit exits 0 — no TypeScript errors in csps-playground');
} catch (e) {
  tscExitCode = e.status ?? 1;
  tscOutput = (e.stdout || '') + (e.stderr || '') + (e.message || '');

  // Parse the error lines for reporting
  const errorLines = tscOutput
    .split('\n')
    .filter(l => l.includes('error TS'))
    .slice(0, 10); // cap at 10 for readability

  if (errorLines.length > 0) {
    for (const line of errorLines) {
      BLOCK(line.trim());
    }
    if (tscOutput.split('\n').filter(l => l.includes('error TS')).length > 10) {
      BLOCK(`...and ${tscOutput.split('\n').filter(l => l.includes('error TS')).length - 10} more errors`);
    }
  } else {
    BLOCK(`tsc --noEmit failed (exit ${tscExitCode}) — check output:\n    ${tscOutput.slice(0, 400)}`);
  }
}

console.log('');
console.log(`[validate-ts-compile] blocking=${blocking} advisory=${advisory} passes=${passes}`);

writeLastRun();
process.exit(blocking > 0 ? 1 : 0);

function writeLastRun() {
  const lastRun = {
    ran_at: new Date().toISOString(),
    blocking,
    advisory,
    passes,
    findings,
    tsc_exit_code: tscExitCode,
    app_dir: APP_DIR.replace(ROOT, '').replace(/\\/g, '/'),
  };
  try {
    mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
    writeFileSync(LAST_RUN, JSON.stringify(lastRun, null, 2));
  } catch { /* non-fatal */ }
}
