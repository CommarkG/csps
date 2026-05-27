#!/usr/bin/env node
/**
 * migrate-S067-prevention-class-field.mjs — PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 7
 * IDEMPOTENT migration — adds prevention_class + structural_fix_plan_session to all open entries.
 *
 * Per APPENDIX C: every finding MUST declare prevention_class (C1-C13 or new).
 * Default: prevention_class: unclassified (requires classification before session-close)
 *
 * CAVEATS: Does NOT override existing prevention_class entries. Idempotent.
 * SAME PATTERN as migrate-S066-WAVE-2-scheduling-fields.mjs.
 *
 * inherits_from: PROTO-S067-MASTER-THRESHOLD-ROUTER APPENDIX C + WAVE-2-STEP-1 migration pattern
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REGISTERS = [
  join(ROOT, 'tools', 'data', 'improvement-register.yaml'),
  join(ROOT, 'tools', 'data', 'gap-recurrence-register.yaml'),
];
const CLOSED = new Set(['closed', 'resolved', 'propagated', 'fix_committed', 'cec_run']);

let total = 0, patched = 0, already_have = 0, skipped_closed = 0;

for (const regPath of REGISTERS) {
  let content = readFileSync(regPath, 'utf-8');
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  let changed = false;

  while (i < lines.length) {
    const line = lines[i];
    if (/^\s{2}- id:/.test(line)) {
      total++;
      const entryLines = [line];
      i++;
      while (i < lines.length && !/^\s{2}- id:/.test(lines[i]) && !/^entries:/.test(lines[i]) && !/^---/.test(lines[i])) {
        entryLines.push(lines[i]);
        i++;
      }
      const block = entryLines.join('\n');
      const statusM = block.match(/^\s+status:\s*(\S+)/m);
      const status = statusM ? statusM[1] : '';

      if (CLOSED.has(status)) { skipped_closed++; result.push(block); continue; }
      if (/prevention_class:/.test(block)) { already_have++; result.push(block); continue; }

      // Add prevention_class after status line
      const statusIdx = entryLines.findIndex(l => /^\s+status:/.test(l));
      if (statusIdx >= 0) {
        entryLines.splice(statusIdx + 1, 0,
          '    prevention_class: unclassified',
          '    structural_fix_plan_session: null',
          '    prevention_design_pending: true'
        );
        result.push(entryLines.join('\n'));
        patched++;
        changed = true;
      } else {
        result.push(block);
      }
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

console.log(`\nMigration: total=${total} patched=${patched} already_have=${already_have} skipped_closed=${skipped_closed}`);
