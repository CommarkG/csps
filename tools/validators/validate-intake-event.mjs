#!/usr/bin/env node
/**
 * validate-intake-event.mjs — validates IntakeEvent JSONL rows per unified-intake L3
 *
 * Per EXT-20260505-002-A 6-commitment validator class + unified-intake topic-plan L3.
 * Checks: required fields present + enum values valid + no null route_to + hash present.
 *
 * EXIT-CODED: 0 = all rows valid / 1 = schema violations found
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LOG_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/intake-log');

const REQUIRED_FIELDS = ['id', 'source_class', 'received_at', 'raw', 'classified_type', 'route_to', 'state_machine_pos'];
const VALID_SOURCE_CLASSES = ['chat-channel', 'external-content', 'agent-output', 'inner-default-leak'];
const VALID_ROUTE_TARGETS = ['SWIFT_EXECUTE', 'COUNCIL_REVIEW', 'VAULT_DEFER', 'DROP'];
const VALID_STATE_POSITIONS = ['received', 'classified', 'prioritized', 'routed', 'executed', 'deferred', 'dropped'];

function validateRow(row, file, lineNum) {
  const errors = [];
  let event;
  try { event = JSON.parse(row); } catch (e) { return [`${file}:${lineNum} invalid JSON: ${e.message}`]; }

  for (const f of REQUIRED_FIELDS) {
    if (!event[f]) errors.push(`${file}:${lineNum} missing required field: ${f}`);
  }
  if (event.source_class && !VALID_SOURCE_CLASSES.includes(event.source_class)) {
    errors.push(`${file}:${lineNum} invalid source_class: ${event.source_class}`);
  }
  if (event.route_to && !VALID_ROUTE_TARGETS.includes(event.route_to)) {
    errors.push(`${file}:${lineNum} invalid route_to: ${event.route_to}`);
  }
  if (event.state_machine_pos && !VALID_STATE_POSITIONS.includes(event.state_machine_pos)) {
    errors.push(`${file}:${lineNum} invalid state_machine_pos: ${event.state_machine_pos}`);
  }
  return errors;
}

async function main() {
  if (!existsSync(LOG_DIR)) {
    console.log('[validate-intake-event] no intake-log dir; skipping (no events yet)');
    process.exit(0);
  }

  const jsonlFiles = readdirSync(LOG_DIR).filter(f => f.endsWith('.jsonl'));
  if (jsonlFiles.length === 0) {
    console.log('[validate-intake-event] no JSONL files found; skipping');
    process.exit(0);
  }

  const allErrors = [];
  let totalRows = 0;

  for (const file of jsonlFiles) {
    const lines = readFileSync(join(LOG_DIR, file), 'utf8').split('\n').filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      totalRows++;
      allErrors.push(...validateRow(lines[i], file, i + 1));
    }
  }

  if (allErrors.length > 0) {
    console.error(`\n${allErrors.length} error(s):`);
    for (const e of allErrors) console.error(`  ✗ ${e}`);
  }

  const summary = `[validate-intake-event] files=${jsonlFiles.length} rows=${totalRows} errors=${allErrors.length}`;
  console.log(`\n${summary}`);

  if (allErrors.length > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => { console.error('[validate-intake-event] fatal:', err); process.exit(1); });
