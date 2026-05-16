#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.sync-universal-governance
 * @csps-name sync-universal-governance
 * @csps-description Scans packages/principles/principles.yaml for principles ratified
 * after the last sync timestamp in tools/config/universal-sync-state.json. For each new
 * principle NOT already in universal-governance.md: creates a PROP-NNN candidate file in
 * docs/plan/_handoff/VAULT/proposals/ for Governor review. Does NOT auto-add to universal
 * governance — Governor ratifies proposals. Updates sync state after scan.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:developer
 * @csps-enforces P-OPER-001
 *
 * Usage:
 *   node tools/scripts/sync-universal-governance.mjs
 *   node tools/scripts/sync-universal-governance.mjs --universal-path /path/to/universal-governance.md
 *   UNIVERSAL_GOVERNANCE_PATH=/path/to/file pnpm sync:universal
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ─── Args ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const UNIVERSAL_PATH =
  getArg('--universal-path') ||
  process.env.UNIVERSAL_GOVERNANCE_PATH ||
  null; // null = skip existence check, still generate candidates

const PRINCIPLES_FILE = resolve(ROOT, 'packages/principles/principles.yaml');
const SYNC_STATE_FILE = resolve(ROOT, 'tools/config/universal-sync-state.json');
const PROPOSALS_DIR = resolve(ROOT, 'docs/plan/_handoff/VAULT/proposals');

// ─── Load state ───────────────────────────────────────────────────────────────

const syncState = JSON.parse(readFileSync(SYNC_STATE_FILE, 'utf-8'));
const lastSync = new Date(syncState.last_sync);
const alreadySynced = new Set(syncState.synced_principles || []);

console.log(`[sync-universal-governance] last_sync=${syncState.last_sync} synced=${alreadySynced.size}`);

// ─── Load universal governance (if path provided) ─────────────────────────────

let universalContent = '';
if (UNIVERSAL_PATH && existsSync(UNIVERSAL_PATH)) {
  universalContent = readFileSync(UNIVERSAL_PATH, 'utf-8');
  console.log(`[sync-universal-governance] universal-governance loaded from ${UNIVERSAL_PATH}`);
} else if (UNIVERSAL_PATH) {
  console.warn(`[sync-universal-governance] WARN: --universal-path ${UNIVERSAL_PATH} not found — will generate proposals without existence check`);
} else {
  console.log(`[sync-universal-governance] no --universal-path provided — candidates generated without universal check`);
  console.log(`[sync-universal-governance] tip: set UNIVERSAL_GOVERNANCE_PATH or pass --universal-path to check existing entries`);
}

// ─── Parse principles.yaml for new ratifications ──────────────────────────────

const principlesRaw = readFileSync(PRINCIPLES_FILE, 'utf-8');

// Extract principles with ratified_at newer than last sync
const principleBlocks = principlesRaw.split(/(?=  - id: P-)/);
const newPrinciples = [];

for (const block of principleBlocks) {
  const idMatch = block.match(/id:\s*(P-[\w-]+)/);
  const nameMatch = block.match(/name:\s*(\S+)/);
  const ratifiedMatch = block.match(/ratified_at:\s*"?(\d{4}-\d{2}-\d{2})"?/);
  const ratifiedByMatch = block.match(/ratified_by:\s*(\S+)/);
  const statementMatch = block.match(/statement:\s*\|?\n([\s\S]*?)(?=\n\s{4}\w|\n  - id:|\n\n|\z)/);

  if (!idMatch || !ratifiedMatch) continue;

  const id = idMatch[1];
  const name = nameMatch?.[1] ?? id;
  const ratifiedAt = new Date(ratifiedMatch[1]);
  const ratifiedBy = ratifiedByMatch?.[1] ?? 'unknown';

  if (ratifiedAt <= lastSync) continue;
  if (alreadySynced.has(id)) continue;

  // Check if already in universal governance
  const inUniversal = universalContent && (
    universalContent.includes(id) || universalContent.includes(name)
  );

  if (inUniversal) {
    console.log(`[sync-universal-governance] ${id} already in universal-governance — skipping`);
    alreadySynced.add(id);
    continue;
  }

  newPrinciples.push({ id, name, ratifiedAt: ratifiedMatch[1], ratifiedBy });
}

console.log(`[sync-universal-governance] new_principles=${newPrinciples.length}`);

if (newPrinciples.length === 0) {
  console.log(`[sync-universal-governance] nothing to propose — universal governance is current`);
  // Update sync timestamp
  syncState.last_sync = new Date().toISOString();
  syncState.synced_principles = [...alreadySynced];
  writeFileSync(SYNC_STATE_FILE, JSON.stringify(syncState, null, 2) + '\n', 'utf-8');
  process.exit(0);
}

// ─── Auto-increment PROP-NNN ──────────────────────────────────────────────────

if (!existsSync(PROPOSALS_DIR)) mkdirSync(PROPOSALS_DIR, { recursive: true });

const existingProposals = readdirSync(PROPOSALS_DIR)
  .filter(f => /^PROP-\d{3}-/.test(f))
  .map(f => parseInt(f.match(/^PROP-(\d{3})-/)?.[1] ?? '0', 10))
  .filter(n => n > 0);

let nextN = existingProposals.length > 0 ? Math.max(...existingProposals) + 1 : 1;
const created = [];

for (const principle of newPrinciples) {
  const propId = `PROP-${String(nextN).padStart(3, '0')}`;
  const titleKebab = principle.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const filename = `${propId}-universal-candidate-${titleKebab}.yaml`;
  const filepath = resolve(PROPOSALS_DIR, filename);

  const content = `---
# Auto-generated by sync-universal-governance.mjs — ${new Date().toISOString()}
# This is a CANDIDATE for universal-governance.md. Governor must ratify before adding.

id: ${propId}
title: "Universal governance candidate: ${principle.id} ${principle.name}"
status: draft
created_at: "${new Date().toISOString().split('T')[0]}"
created_by: sync-universal-governance
core_spine: GVRN
tier: 1

principle_proposed: "${principle.id}"
rationale: |
  ${principle.id} (${principle.name}) was ratified in CSPS on ${principle.ratifiedAt} by ${principle.ratifiedBy}.
  If this principle governs AI behavior universally (not just in CSPS), it should be added
  to universal-governance.md so it applies across all projects, not just this repo.

what_breaks_if_wrong: |
  If this principle doesn't belong in universal governance, adding it would impose CSPS-specific
  constraints on other projects. Only add principles that are genuinely universal — not CSPS-specific.

rollback_path: |
  Remove the entry from universal-governance.md. No code changes needed.

opus2_review_turn: null
opus2_verdict: null
governor_ratified_at: null
cooling_period_satisfied: false
implementation_session: null
implementation_commit: null

links:
  - { rel: parent, href: ./README.md }
  - { rel: source-principle, href: ../../../../packages/principles/principles/P-OPER-002-done-right-from-the-start.yaml }
---
`;

  writeFileSync(filepath, content, 'utf-8');
  console.log(`[sync-universal-governance] created ${propId} → ${filename}`);
  alreadySynced.add(principle.id);
  created.push(propId);
  nextN++;
}

// ─── Update sync state ────────────────────────────────────────────────────────

syncState.last_sync = new Date().toISOString();
syncState.last_sync_principle_count = (syncState.last_sync_principle_count || 0);
syncState.synced_principles = [...alreadySynced];
syncState.pending_proposals = [...(syncState.pending_proposals || []), ...created];
writeFileSync(SYNC_STATE_FILE, JSON.stringify(syncState, null, 2) + '\n', 'utf-8');

console.log(`[sync-universal-governance] proposals_created=${created.length} sync_state_updated=true`);
console.log(`[sync-universal-governance] review proposals in docs/plan/_handoff/VAULT/proposals/ before Governor ratifies`);
