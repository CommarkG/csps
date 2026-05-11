#!/usr/bin/env node
// validate-sandbox-lifecycle.mjs — checks sandbox specs follow correct lifecycle order
// SANDBOX → SIMULATED → RATIFIED → IMPLEMENTING → IMPLEMENTED
// No skipping stages. ADVISORY for lifecycle violations.
// Audit slug: sandbox-lifecycle

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const SANDBOX_DIR = join(ROOT, 'docs/plan/_sandbox');

const VALID_TRANSITIONS = {
  'sandbox':      ['simulated', 'sandbox'],  // can stay sandbox or advance to simulated
  'simulated':    ['ratified', 'sandbox'],   // can be ratified or sent back to sandbox
  'ratified':     ['implementing'],          // must go to implementing
  'implementing': ['implemented'],           // must complete
  'implemented':  [],                        // terminal
};

function main() {
  if (!existsSync(SANDBOX_DIR)) {
    console.log('[validate-sandbox-lifecycle] docs/plan/_sandbox/ not found — no sandboxes yet');
    process.exit(0);
  }

  const files = readdirSync(SANDBOX_DIR).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('[validate-sandbox-lifecycle] No sandbox files yet — policy is ready');
    process.exit(0);
  }

  const advisory = [];
  let checked = 0;

  for (const f of files) {
    const content = readFileSync(join(SANDBOX_DIR, f), 'utf8');
    if (!content.startsWith('---')) continue;
    checked++;

    const fmEnd = content.indexOf('\n---', 3);
    const fm = content.slice(0, fmEnd);

    const stateMatch = fm.match(/^lifecycle_state:\s*(.+)$/m);
    const state = stateMatch ? stateMatch[1].trim() : 'sandbox';

    const simStatusMatch = fm.match(/^simulation_status:\s*(.+)$/m);
    const simStatus = simStatusMatch ? simStatusMatch[1].trim() : 'pending';

    const ratifiedByMatch = fm.match(/^ratified_by:\s*(.+)$/m);
    const ratifiedBy = ratifiedByMatch ? ratifiedByMatch[1].trim() : null;

    // Validate stage consistency
    if (state === 'simulated' && simStatus !== 'pass') {
      advisory.push({ file: f, issue: `lifecycle_state: simulated but simulation_status: ${simStatus} (must be pass)` });
    }
    if (state === 'ratified' && (!ratifiedBy || ratifiedBy === '~' || ratifiedBy === 'null')) {
      advisory.push({ file: f, issue: `lifecycle_state: ratified but no ratified_by declared` });
    }
    if ((state === 'implementing' || state === 'implemented') && simStatus !== 'pass') {
      advisory.push({ file: f, issue: `lifecycle_state: ${state} but simulation was never passed` });
    }

    console.log(`  ${advisory.some(a => a.file === f) ? '⚠' : '✅'} ${f}: state=${state}, sim=${simStatus}`);
  }

  if (advisory.length > 0) {
    console.log(`\n${advisory.length} advisory — lifecycle violations:`);
    for (const a of advisory) console.log(`  ⚠ ${a.file}: ${a.issue}`);
  }

  console.log(`\n[validate-sandbox-lifecycle] checked=${checked} advisory=${advisory.length}`);
  process.exit(0); // Always advisory
}

main();
