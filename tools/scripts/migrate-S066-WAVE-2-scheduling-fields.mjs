#!/usr/bin/env node
/**
 * migrate-S066-WAVE-2-scheduling-fields.mjs
 * IDEMPOTENT migration — adds 4 scheduling fields to all open entries in:
 *   - tools/data/improvement-register.yaml
 *   - tools/data/gap-recurrence-register.yaml
 *
 * Fields added per PROTO-S066-WAVE-2 Core Seed:
 *   must_address_by_session: S<first_found_num + 5>
 *   age_escalation_status: on-time
 *   explicit_defer_reason: null
 *   fix_commit_sha: null
 *
 * Idempotency: if must_address_by_session is already present for an entry, SKIP.
 * Safe to re-run at any time — no existing fields are overwritten.
 *
 * Usage: node tools/scripts/migrate-S066-WAVE-2-scheduling-fields.mjs
 * Output: patch summary to stdout
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REGISTERS = [
  join(ROOT, 'tools', 'data', 'improvement-register.yaml'),
  join(ROOT, 'tools', 'data', 'gap-recurrence-register.yaml'),
];

// Closed statuses — don't add scheduling fields to these
const CLOSED_STATUSES = new Set(['closed', 'resolved', 'propagated', 'fix_committed_retroactive']);

// Extract session number from S<NNN> string
function sessionNum(sessionStr) {
  const m = String(sessionStr).match(/S(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// Format session as S<NNN> with zero-padding to 3 digits
function sessionFmt(num) {
  return `S${String(num).padStart(3, '0')}`;
}

let total_entries = 0, patched = 0, skipped_already_have = 0, skipped_closed = 0;

for (const regPath of REGISTERS) {
  let content = readFileSync(regPath, 'utf-8');
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  let changed = false;

  while (i < lines.length) {
    const line = lines[i];

    // Detect start of an entry block
    if (/^\s{2}- id:/.test(line)) {
      total_entries++;
      // Collect the full entry block
      const entryLines = [line];
      i++;
      while (i < lines.length && !/^\s{2}- id:/.test(lines[i]) && !/^entries:/.test(lines[i]) && !/^```/.test(lines[i]) && !/^---/.test(lines[i])) {
        entryLines.push(lines[i]);
        i++;
      }
      const entryBlock = entryLines.join('\n');

      // Check status
      const statusMatch = entryBlock.match(/^\s+status:\s*(\S+)/m);
      const status = statusMatch ? statusMatch[1].replace(/['"]/g, '') : '';

      if (CLOSED_STATUSES.has(status)) {
        skipped_closed++;
        result.push(entryBlock);
        continue;
      }

      // Check if already has must_address_by_session
      if (/must_address_by_session:/.test(entryBlock)) {
        skipped_already_have++;
        result.push(entryBlock);
        continue;
      }

      // Get first_found to compute default must_address_by_session
      const firstFoundMatch = entryBlock.match(/^\s+first_found:\s*(\S+)/m);
      const firstFound = firstFoundMatch ? firstFoundMatch[1].replace(/['"]/g, '') : null;
      const firstNum = firstFound ? sessionNum(firstFound) : null;
      const mustAddressNum = firstNum ? firstNum + 5 : null;
      const mustAddressFmt = mustAddressNum ? sessionFmt(mustAddressNum) : 'S070';

      // Inject 4 new fields after the status line
      // Find the right insertion point (after status: line)
      const statusLineIndex = entryBlock.split('\n').findIndex(l => /^\s+status:/.test(l));
      if (statusLineIndex < 0) {
        result.push(entryBlock);
        continue;
      }

      const entryLinesArr = entryBlock.split('\n');
      const indent = '    '; // 4 spaces (entry indent level)
      const newFields = [
        `${indent}must_address_by_session: "${mustAddressFmt}"`,
        `${indent}age_escalation_status: on-time`,
        `${indent}explicit_defer_reason: null`,
        `${indent}fix_commit_sha: null`,
      ];
      entryLinesArr.splice(statusLineIndex + 1, 0, ...newFields);
      result.push(entryLinesArr.join('\n'));
      patched++;
      changed = true;
      continue;
    }

    result.push(line);
    i++;
  }

  if (changed) {
    writeFileSync(regPath, result.join('\n'), 'utf-8');
    console.log(`Patched: ${regPath.replace(ROOT + '/', '')}`);
  } else {
    console.log(`No changes: ${regPath.replace(ROOT + '/', '')}`);
  }
}

console.log(`\nMigration complete: total_entries=${total_entries} patched=${patched} skipped_already_have=${skipped_already_have} skipped_closed=${skipped_closed}`);
