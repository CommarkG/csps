#!/usr/bin/env node
/**
 * @csps-dna
 * core_spine: VALD
 * governing_principle: P-META-009
 * @csps-enforces B_TOKEN_BUDGET R9 — Token-Efficiency Guardian (T2 EXTENDED)
 * run_tier: EXTENDED
 *
 * validate-token-efficiency.mjs — PROTO-S084-TEG T2 validator
 *
 * Scans all always-on surfaces:
 *   - .claude/hooks/*.sh (per-turn hook execution load)
 *   - .claude/settings.json (UserPromptSubmit/SessionStart injection payload)
 *
 * For each surface:
 *   1. Checks for load_mode: declaration (missing = ADVISORY)
 *   2. Checks eager declaration has justification (missing = BLOCKING)
 *   3. Tracks per-surface file size as proxy for context cost
 *   4. Regression-flags new eager surfaces vs last-green run
 *
 * Two cost audiences per R9:
 *   INNER-PLATFORM: per-turn hook execution + context injection cost to THIS session
 *   EXTERNAL-USER:  per-action overhead if CSPS emits context on behalf of the user
 *
 * Run: node tools/validators/validate-token-efficiency.mjs
 * Tier: EXTENDED (runs with node tools/verify.mjs --extended)
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const HOOKS_DIR = join(ROOT, '.claude/hooks');
const SETTINGS_PATH = join(ROOT, '.claude/settings.json');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-token-efficiency-last-run.json');

let blocking_count = 0;
let advisory_count = 0;
const findings = [];
const surfaces = [];

function addFinding(level, surface, msg) {
  findings.push({ level, surface, msg });
  if (level === 'BLOCKING') {
    blocking_count++;
    console.log(`  ✗ [BLOCKING] ${surface}: ${msg}`);
  } else {
    advisory_count++;
    console.log(`  ⚠ [ADVISORY] ${surface}: ${msg}`);
  }
}

// ── Load previous run for regression-flagging ─────────────────────────────────
let lastRun = null;
if (existsSync(LAST_RUN_PATH)) {
  try {
    lastRun = JSON.parse(readFileSync(LAST_RUN_PATH, 'utf-8'));
  } catch { /* ignore */ }
}
const lastEagerCount = lastRun?.eager_count ?? 0;

// ── Scan .claude/hooks/*.sh ───────────────────────────────────────────────────
console.log('[validate-token-efficiency] scanning .claude/hooks/*.sh ...');

let hookCount = 0;
let loadModePresent = 0;
let eagerCount = 0;
let eagerWithJustification = 0;
let onDemandCount = 0;

if (existsSync(HOOKS_DIR)) {
  const hookFiles = readdirSync(HOOKS_DIR)
    .filter(f => f.endsWith('.sh'))
    .sort();

  for (const fname of hookFiles) {
    const fpath = join(HOOKS_DIR, fname);
    let content = '';
    try {
      content = readFileSync(fpath, 'utf-8');
    } catch { continue; }

    hookCount++;
    const sizeBytes = Buffer.byteLength(content, 'utf-8');
    let loadMode = null;
    let hasJustification = false;

    // Extract load_mode from comments (first 40 lines; hook file header)
    const headerLines = content.split('\n').slice(0, 40);
    for (const line of headerLines) {
      const mMode = line.match(/[#\s]load_mode:\s*(eager|on-demand)/);
      if (mMode) {
        loadMode = mMode[1];
        loadModePresent++;
      }
      if (line.match(/#\s*(justification|reason):/i)) {
        hasJustification = true;
      }
    }

    if (loadMode === null) {
      // Missing declaration — ADVISORY (existing hooks grandfathered; T1 prevents new)
      addFinding('ADVISORY', fname, `missing load_mode declaration (add # load_mode: on-demand or eager+justification to header)`);
    } else if (loadMode === 'eager') {
      eagerCount++;
      if (!hasJustification) {
        // BLOCKING: eager without justification (T1 should have caught this at creation)
        addFinding('BLOCKING', fname, `load_mode: eager declared but missing # justification: comment`);
      } else {
        eagerWithJustification++;
      }
    } else {
      onDemandCount++;
    }

    surfaces.push({
      type: 'hook',
      name: fname,
      load_mode: loadMode ?? 'undeclared',
      size_bytes: sizeBytes,
      inner_platform_cost: 'per-turn-exec',  // always fires when trigger matches
      has_justification: loadMode === 'eager' ? hasJustification : null,
    });
  }
}

console.log(`  hooks: total=${hookCount} load_mode_declared=${loadModePresent} eager=${eagerCount} on-demand=${onDemandCount} undeclared=${hookCount - loadModePresent}`);

// ── Scan settings.json injection payload sizes ────────────────────────────────
console.log('[validate-token-efficiency] scanning .claude/settings.json injections ...');

if (existsSync(SETTINGS_PATH)) {
  let settings = {};
  try {
    settings = JSON.parse(readFileSync(SETTINGS_PATH, 'utf-8'));
  } catch (e) {
    addFinding('ADVISORY', 'settings.json', `parse error: ${String(e)}`);
  }

  const hooks = settings.hooks ?? {};

  // Measure total injection payload across all hook events
  for (const [event, matchers] of Object.entries(hooks)) {
    if (!Array.isArray(matchers)) continue;
    for (const matcher of matchers) {
      if (!Array.isArray(matcher.hooks)) continue;
      for (const h of matcher.hooks) {
        const cmd = h.command ?? '';
        // Estimate: command string as proxy for registration overhead
        surfaces.push({
          type: 'settings-hook-registration',
          name: `${event}:${cmd.split('/').pop()}`,
          load_mode: 'eager',  // settings.json hooks fire every matching turn
          size_bytes: cmd.length,
          inner_platform_cost: `per-turn (${event})`,
          has_justification: null,
        });
      }
    }
  }

  const totalRegistered = surfaces.filter(s => s.type === 'settings-hook-registration').length;
  const settingsSize = Buffer.byteLength(readFileSync(SETTINGS_PATH, 'utf-8'), 'utf-8');
  console.log(`  settings.json: ${settingsSize} bytes | ${totalRegistered} hook registrations`);
  surfaces.push({
    type: 'settings-file',
    name: 'settings.json',
    load_mode: 'eager',
    size_bytes: settingsSize,
    inner_platform_cost: 'SessionStart (full file loaded)',
    has_justification: 'platform config — must be eager by nature',
  });
}

// ── Regression flag: new eager surface since last run ───────────────────────
if (eagerCount > lastEagerCount && lastRun !== null) {
  addFinding('ADVISORY', 'regression',
    `eager hook count increased: ${lastEagerCount} → ${eagerCount} (new eager surfaces added since last green run; verify R9 compliance)`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
const totalSurfaces = surfaces.length;
const totalEager = surfaces.filter(s => s.load_mode === 'eager').length;
const totalOnDemand = surfaces.filter(s => s.load_mode === 'on-demand').length;
const totalUndeclared = surfaces.filter(s => s.load_mode === 'undeclared').length;

console.log(`\n[validate-token-efficiency] SUMMARY (2-audience report):`);
console.log(`  INNER-PLATFORM cost per turn: ${hookCount} hooks + settings.json loaded`);
console.log(`  Surfaces: total=${totalSurfaces} eager=${totalEager} on-demand=${totalOnDemand} undeclared=${totalUndeclared}`);
console.log(`  Findings: blocking=${blocking_count} advisory=${advisory_count}`);
console.log(`\n  EXTERNAL-USER cost: surface overhead is indirect (platform context, not per-user payload)`);
console.log(`  Hook execution time is platform-side only; no per-user token overhead from hooks themselves.`);
console.log(`\n[validate-token-efficiency] eager_count=${eagerCount} blocking=${blocking_count} advisory=${advisory_count}`);

const result = {
  surfaces_checked: totalSurfaces,
  hook_count: hookCount,
  eager_count: eagerCount,
  on_demand_count: onDemandCount,
  undeclared_count: totalUndeclared,
  blocking: blocking_count,
  advisory: advisory_count,
  regression_flagged: eagerCount > lastEagerCount && lastRun !== null,
  findings: findings.slice(0, 30),
  surfaces_summary: surfaces.map(s => ({ name: s.name, load_mode: s.load_mode, size_bytes: s.size_bytes })),
  ran_at: new Date().toISOString(),
};

writeFileSync(LAST_RUN_PATH, JSON.stringify(result, null, 2));

if (blocking_count > 0) process.exit(1);
process.exit(0);
