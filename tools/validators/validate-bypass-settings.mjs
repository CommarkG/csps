#!/usr/bin/env node
/**
 * validate-bypass-settings.mjs
 * @csps-dna
 * core_spine: GVRN
 * @csps-enforces PERMISSION-BYPASS-PERMANENT B_PRACE
 * @csps-prevention-class PERMISSION-PROMPTS-FROM-SETTINGS-DRIFT
 * @behavioral-test-status: inline — corrupt settings.local.json → exit 1
 *
 * T2 validator for HARDWIRE-003 (permission bypass).
 * Checks that BOTH settings files are in the correct bypass state:
 *   1. ~/.claude/settings.local.json has defaultMode:bypassPermissions
 *   2. .claude/settings.local.json (project) is {} or has NO permissions key
 *   3. .claude/settings.json has defaultMode:bypassPermissions
 *
 * Root cause of recurring permission prompts (S069, recurring):
 *   settings.local.json at project level gets permissions content → shadows settings.json →
 *   prompts appear because defaultMode is missing from the shadowing object.
 *   CONFIG HIERARCHY: child has permissions object but NOT defaultMode → system uses
 *   Claude Code's DEFAULT (prompt-on-everything) not the parent's bypassPermissions.
 *
 * Source: HARDWIRE-003 · S074 · Governor directive.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';

const ROOT = resolve(process.cwd());
const PROJECT_LOCAL = join(ROOT, '.claude/settings.local.json');
const PROJECT_SETTINGS = join(ROOT, '.claude/settings.json');
const GLOBAL_LOCAL = join(homedir(), '.claude/settings.local.json');

let blocking = 0;
let advisory = 0;
const findings = [];

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// ── Check 1: project settings.local.json ─────────────────────────────────────
if (existsSync(PROJECT_LOCAL)) {
  const local = readJson(PROJECT_LOCAL);
  if (local === null) {
    advisory++;
    findings.push(`[ADVISORY] .claude/settings.local.json: parse error — ensure it is valid JSON (should be {})`);
  } else if (local.permissions) {
    // Has permissions key — check if it has defaultMode
    if (local.permissions.defaultMode !== 'bypassPermissions') {
      blocking++;
      findings.push(
        `BLOCKING: .claude/settings.local.json has "permissions" object WITHOUT "defaultMode:bypassPermissions".` +
        ` This SHADOWS .claude/settings.json's bypass settings → permission prompts appear.` +
        ` Fix: set .claude/settings.local.json to {} (session-open.sh does this at tab open)`
      );
    }
  }
  // {} is correct — no finding needed
} else {
  advisory++;
  findings.push(`[ADVISORY] .claude/settings.local.json missing — session-open.sh will create it`);
}

// ── Check 2: project settings.json ───────────────────────────────────────────
if (existsSync(PROJECT_SETTINGS)) {
  const proj = readJson(PROJECT_SETTINGS);
  if (!proj) {
    blocking++;
    findings.push(`BLOCKING: .claude/settings.json parse error — required for permission bypass`);
  } else {
    if (proj.permissions?.defaultMode !== 'bypassPermissions') {
      blocking++;
      findings.push(
        `BLOCKING: .claude/settings.json "permissions.defaultMode" is not "bypassPermissions" (got: ${proj.permissions?.defaultMode || 'missing'}).` +
        ` This WILL cause permission prompts. Fix: add "defaultMode": "bypassPermissions" to .claude/settings.json`
      );
    }
    if (proj.skipDangerousModePermissionPrompt !== true) {
      advisory++;
      findings.push(`[ADVISORY] .claude/settings.json: skipDangerousModePermissionPrompt not set to true`);
    }
  }
} else {
  blocking++;
  findings.push(`BLOCKING: .claude/settings.json not found — required`);
}

// ── Check 3: global settings.local.json ──────────────────────────────────────
if (existsSync(GLOBAL_LOCAL)) {
  const global = readJson(GLOBAL_LOCAL);
  if (!global) {
    advisory++;
    findings.push(`[ADVISORY] ~/.claude/settings.local.json parse error`);
  } else if (global.permissions?.defaultMode !== 'bypassPermissions') {
    blocking++;
    findings.push(
      `BLOCKING: ~/.claude/settings.local.json "permissions.defaultMode" is not "bypassPermissions" (got: ${global.permissions?.defaultMode || 'missing'}).` +
      ` This is the global bypass — session-open.sh sets it, but it has drifted.` +
      ` Fix: session-open.sh will repair this on next tab open.`
    );
  }
} else {
  blocking++;
  findings.push(
    `BLOCKING: ~/.claude/settings.local.json missing — global bypass not set.` +
    ` session-open.sh will create it at next tab open.`
  );
}

// ── Output ────────────────────────────────────────────────────────────────────
for (const f of findings) {
  if (f.startsWith('BLOCKING')) console.log(`  ✗ ${f}`);
  else console.log(`  ${f}`);
}

console.log(`[validate-bypass-settings] blocking=${blocking} advisory=${advisory}`);

if (blocking > 0) process.exit(1);
process.exit(0);
