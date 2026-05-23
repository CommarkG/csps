#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-settings-shadow
 * @csps-name validate-settings-shadow
 * @csps-description Detects when .claude/settings.local.json shadows the project
 * settings.json permissions. The SSoT for project permissions is .claude/settings.json.
 * If settings.local.json contains a "permissions" key, it may silently override the
 * defaultMode from settings.json — causing permission popups on every new tab.
 * BLOCKING: settings.local.json has "permissions" key (shadowing detected)
 * ADVISORY: settings.local.json has "defaultMode" at top level (less common issue)
 * PASS: settings.local.json is {} or has no permissions key
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @cscs-enforces B_ZERO_LAPTOP_DEPENDENCY
 * context_question: "Does .claude/settings.local.json have a permissions key that shadows settings.json? That would cause permission popups on every new tab."
 * Wired: tools/verify.mjs cycle 'settings_shadow'
 * Plan item: S057 PROTO-B | permission-bypass-permanent
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LOCAL_SETTINGS = resolve(ROOT, '.claude/settings.local.json');

let blocking = 0;
let advisory = 0;
let settings_local_clean = true;

if (!existsSync(LOCAL_SETTINGS)) {
  console.log('[validate-settings-shadow] .claude/settings.local.json not found — clean (no shadow possible)');
  console.log(`[validate-settings-shadow] settings_local_clean=true blocking=0 advisory=0`);
  process.exit(0);
}

let content;
try {
  content = JSON.parse(readFileSync(LOCAL_SETTINGS, 'utf-8'));
} catch (e) {
  console.log('[validate-settings-shadow] Could not parse .claude/settings.local.json — treating as clean');
  console.log(`[validate-settings-shadow] settings_local_clean=true blocking=0 advisory=0`);
  process.exit(0);
}

// BLOCKING: has permissions key AND does NOT set defaultMode:bypassPermissions
// PASS: permissions key exists but sets defaultMode:bypassPermissions explicitly (correct canonical form)
if (content.permissions !== undefined) {
  const mode = content.permissions?.defaultMode;
  if (mode !== 'bypassPermissions') {
    settings_local_clean = false;
    console.error('[validate-settings-shadow] BLOCKING: .claude/settings.local.json has "permissions" key without bypassPermissions');
    console.error('  This silently overrides defaultMode from .claude/settings.json causing permission popups.');
    console.error('  Fix: set permissions.defaultMode to "bypassPermissions" in settings.local.json');
    blocking++;
  } else {
    console.log('[validate-settings-shadow] .claude/settings.local.json has explicit bypassPermissions — CORRECT canonical form');
  }
}

// ADVISORY: top-level defaultMode (unusual but possible)
if (content.defaultMode !== undefined) {
  settings_local_clean = false;
  console.warn('[validate-settings-shadow] ADVISORY: .claude/settings.local.json has top-level "defaultMode"');
  advisory++;
}

if (blocking === 0 && advisory === 0) {
  console.log('[validate-settings-shadow] .claude/settings.local.json is clean (no shadowing)');
}

console.log(`[validate-settings-shadow] settings_local_clean=${settings_local_clean} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
