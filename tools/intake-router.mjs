#!/usr/bin/env node
/**
 * intake-router.mjs — universal input router for CSPS unified-intake architecture
 *
 * Per unified-intake topic-plan L3 + EXT-20260505-004-C PE.read_budget extension.
 * Reads an IntakeEvent envelope and routes to the appropriate target:
 *   SWIFT_EXECUTE → logs event + emits execution suggestion to stdout
 *   COUNCIL_REVIEW → logs event + emits review request to stderr
 *   VAULT_DEFER → logs event to JSONL intake-log + writes stub to _handoff/VAULT/
 *   DROP → logs event with drop reason
 *
 * Also composes with PE.read_budget: for VAULT_DEFER + COUNCIL_REVIEW, includes
 * read_budget recommendation based on mini_tree_layer of the input content.
 *
 * Usage:
 *   echo '{"source_class":"chat-channel",...}' | node tools/intake-router.mjs
 *   node tools/intake-router.mjs --event-file <path>
 *   node tools/intake-router.mjs --dry-run  (logs routing decision without side effects)
 */

import { readFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LOG_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/intake-log');

const DRY_RUN = process.argv.includes('--dry-run');

// ── Read input ────────────────────────────────────────────────────────────

async function readEvent() {
  const args = process.argv.slice(2);
  const eventFileIdx = args.indexOf('--event-file');
  if (eventFileIdx >= 0) {
    const file = args[eventFileIdx + 1];
    if (!file || !existsSync(file)) { console.error('--event-file path not found'); process.exit(1); }
    return JSON.parse(readFileSync(file, 'utf8'));
  }
  // Stdin
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  if (!raw.trim()) { console.log('[intake-router] no input; exiting'); process.exit(0); }
  return JSON.parse(raw.trim());
}

// ── Validate event minimally ──────────────────────────────────────────────

function validateEvent(event) {
  const required = ['source_class', 'route_to', 'state_machine_pos'];
  for (const f of required) {
    if (!event[f]) throw new Error(`IntakeEvent missing required field: ${f}`);
  }
}

// ── Log to JSONL ──────────────────────────────────────────────────────────

function logToJSONL(event, sessionId) {
  if (DRY_RUN) { console.log(`[DRY-RUN] would append to ${sessionId}.jsonl`); return; }
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
  appendFileSync(join(LOG_DIR, `${sessionId}.jsonl`), JSON.stringify(event) + '\n');
}

// ── Route decision ────────────────────────────────────────────────────────

function route(event) {
  const sessionId = event.dialog_thread_id ?? event.id?.match(/S\d+/)?.[0] ?? 'S000';

  switch (event.route_to) {
    case 'SWIFT_EXECUTE':
      logToJSONL({ ...event, state_machine_pos: 'routed' }, sessionId);
      console.log(JSON.stringify({
        decision: 'SWIFT_EXECUTE',
        id: event.id,
        classified_type: event.classified_type,
        action: '4-condition gate passed — execute autonomously',
        evidence_required: 'Emit paired tool-call evidence per B_VALIDATE_BEFORE_ASSUME',
      }));
      break;

    case 'COUNCIL_REVIEW':
      logToJSONL({ ...event, state_machine_pos: 'routed' }, sessionId);
      process.stderr.write(JSON.stringify({
        decision: 'COUNCIL_REVIEW',
        id: event.id,
        classified_type: event.classified_type,
        source_class: event.source_class,
        action: 'Surface to Governor for direction before executing',
        read_budget_hint: event.mini_tree_layer ?? 'L1',
      }) + '\n');
      break;

    case 'VAULT_DEFER':
      logToJSONL({ ...event, state_machine_pos: 'deferred' }, sessionId);
      if (!DRY_RUN) {
        const vaultPath = join(ROOT, 'docs/plan/_handoff/VAULT/deferred');
        if (!existsSync(vaultPath)) mkdirSync(vaultPath, { recursive: true });
        appendFileSync(join(vaultPath, `deferred-${Date.now()}.json`), JSON.stringify(event, null, 2));
      }
      console.log(JSON.stringify({
        decision: 'VAULT_DEFER',
        id: event.id,
        classified_type: event.classified_type,
        action: 'Parked in _handoff/VAULT/deferred/ for next session review',
        deep_dive_schedule: event.deep_dive_schedule ?? 'next-session',
      }));
      break;

    case 'DROP':
      logToJSONL({ ...event, state_machine_pos: 'dropped' }, sessionId);
      console.log(JSON.stringify({
        decision: 'DROP',
        id: event.id,
        classified_type: event.classified_type,
        action: 'Explicitly out-of-scope — logged for audit trail only',
      }));
      break;

    default:
      throw new Error(`Unknown route_to: ${event.route_to}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const event = await readEvent();
  validateEvent(event);
  route(event);
}

main().catch(err => {
  console.error('[intake-router] fatal:', err);
  process.exit(1);
});
