#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-intermediate-capture
 * @csps-name validate-intermediate-capture
 * @csps-description Enforces the capture-must-persist rule (Governor S089). Guards the
 *   intermediate-capture tier (chat/temp-memory -> intermediate-capture.yaml -> park-register).
 *   This is a DIFFERENT enforcement target than existing validators: it does not check content
 *   quality or park disposition — it enforces that deferred/captured work is PERSISTED (saved to
 *   a committed file), not left in temp-memory. A deferral asserted only in chat is nominal capture.
 *
 *   Checks:
 *     1. intermediate-capture.yaml exists + parses (ADVISORY if missing — tier optional when empty).
 *     2. meta.updated_session present (ADVISORY otherwise).
 *     3. every OPEN item has what + resume_pointer + saved_at (ADVISORY per missing field) —
 *        a capture without a resume_pointer is a capture you cannot act on later.
 *     4. surfaces the open-item count so intermediate work cannot be silently lost.
 *
 *   ADVISORY by design: it is a never-lose surfacing gate, not a build blocker. The enforcement is
 *   that open items are made VISIBLE every verify + every session-open (surfacing-as-enforcement).
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_INSIST_ON_COMPLETION B_DECISION_LEDGER
 * @csps-prevention-class NOMINAL-CAPTURE-IN-TEMP-MEMORY
 *
 * load_mode: on-demand
 * # justification: only needed when validating the intermediate-capture tier (not per-turn content).
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const CAP_PATH = resolve(ROOT, 'docs/plan/_handoff/VAULT/intermediate-capture.yaml');

let advisory = 0;
const findings = [];
let openCount = 0;
let totalCount = 0;

if (!existsSync(CAP_PATH)) {
  findings.push('ADVISORY: intermediate-capture.yaml not found (tier optional when nothing is deferred)');
  advisory += 1;
} else {
  let doc = null;
  try {
    doc = yaml.load(readFileSync(CAP_PATH, 'utf8'));
  } catch (e) {
    findings.push(`ADVISORY: intermediate-capture.yaml parse error: ${e.reason || e.message}`);
    advisory += 1;
  }
  if (doc) {
    if (!doc.meta || !doc.meta.updated_session) {
      findings.push('ADVISORY: intermediate-capture.yaml missing meta.updated_session');
      advisory += 1;
    }
    const items = Array.isArray(doc.items) ? doc.items : [];
    totalCount = items.length;
    for (const it of items) {
      const open = !it.status || it.status === 'open';
      if (open) {
        openCount += 1;
        const missing = [];
        if (!it.what) missing.push('what');
        if (!it.resume_pointer) missing.push('resume_pointer');
        if (!it.saved_at) missing.push('saved_at');
        if (missing.length) {
          findings.push(`ADVISORY: ${it.id || '(no id)'} open but missing: ${missing.join(', ')} (a capture without resume_pointer is unactionable later)`);
          advisory += 1;
        }
      }
    }
  }
}

console.log('[validate-intermediate-capture] PASS');
console.log(`  items=${totalCount} open=${openCount} blocking=0 advisory=${advisory}`);
if (openCount > 0) {
  console.log(`  OPEN intermediate captures (surfaced so they are never lost): ${openCount}`);
}
if (findings.length > 0) {
  console.log('\n[validate-intermediate-capture] findings:');
  for (const f of findings) console.log(`  - ${f}`);
}
console.log('\n[validate-intermediate-capture] rule: capture-must-persist — a deferral asserted only');
console.log('  in chat is nominal capture; this tier is the committed home before park-register.');

// ADVISORY-only validator: never blocks.
process.exit(0);
