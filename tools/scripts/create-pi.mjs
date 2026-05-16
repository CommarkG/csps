#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.create-pi
 * @csps-name create-pi
 * @csps-description Creates a new Plan Item (PI) YAML file in docs/plan/_handoff/VAULT/plan-items/.
 * Auto-increments PI-NNN from existing files. Uses PI-001 structure as canonical template.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:developer
 * @csps-enforces P-ARCH-031
 *
 * Usage:
 *   node tools/scripts/create-pi.mjs --title "My feature" [--category governance] [--spine ARCH] [--pe 75]
 *   pnpm create:pi --title "My feature"
 */

import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const PLAN_ITEMS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/plan-items');

// ─── Arg parsing ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const title = getArg('--title');
const category = getArg('--category') || 'implementation';
const spine = getArg('--spine') || 'ARCH';
const pe = getArg('--pe') || '70';
const id = getArg('--id'); // optional override

if (!title) {
  console.error('[create-pi] ERROR: --title is required');
  console.error('  Usage: node tools/scripts/create-pi.mjs --title "My feature" [--spine ARCH] [--pe 75]');
  process.exit(1);
}

// ─── Auto-increment NNN ───────────────────────────────────────────────────────

if (!existsSync(PLAN_ITEMS_DIR)) {
  mkdirSync(PLAN_ITEMS_DIR, { recursive: true });
}

let nextN = 1;
if (!id) {
  const existing = readdirSync(PLAN_ITEMS_DIR)
    .filter(f => /^PI-\d{3}-/.test(f))
    .map(f => parseInt(f.match(/^PI-(\d{3})-/)?.[1] ?? '0', 10))
    .filter(n => n > 0);
  if (existing.length > 0) nextN = Math.max(...existing) + 1;
}

const piId = id || `PI-${String(nextN).padStart(3, '0')}`;
const titleKebab = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const filename = `${piId}-${titleKebab}.yaml`;
const filepath = resolve(PLAN_ITEMS_DIR, filename);
const today = new Date().toISOString().split('T')[0];

// ─── Template ─────────────────────────────────────────────────────────────────

const yaml = `---
id: ${piId}
name: ${piId}-${titleKebab}
description: "${title}"
version: 1.0.0
owner: group:finky
lifecycle: experimental
lifecycle_state: active

# Classification
core_spine: ${spine}
depth_level: 2
tags: [${category}]

# Prioritization
pe_score: ${pe}
spi_estimate: 0.20
urgency: normal
impact: platform-wide

# Status
status: ratified
ratified_at: ${today}
ratified_by: yariv
implementation_session: null
implementation_commit: null
done_at: null

# Dependencies
depends_on: []
unlocks: []

# Schema impact
schema_impact:
  models_modified: []
  migration_required: false
  note: ""

# Wiring checklist (DONE = all boxes checked)
wiring_checklist:
  - "TODO: list wiring criteria"

# Plan summary
plan_summary: |
  TODO: describe what this PI item covers and what DONE means.

  DONE criterion: TODO

linked_principle: P-ARCH-031
linked_contract: null
---
`;

writeFileSync(filepath, yaml, 'utf-8');
console.log(`[create-pi] ${piId} created at ${filepath.replace(ROOT + '/', '')}`);
