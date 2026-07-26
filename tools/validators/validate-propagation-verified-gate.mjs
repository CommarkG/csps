#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: VALD
 * governing_principle: B_IMPLEMENTATION_WIRING_CYCLE
 * behavioral_contract: B_IMPLEMENTATION_WIRING_CYCLE
 * role: BLOCKS a gap-recurrence/improvement-register entry from being marked terminal
 *       (resolved/closed/propagated/fix_committed/structural_fix_committed) if it explicitly
 *       declares propagation_required: true but propagation_verified is not true.
 * @csps-enforces B_IMPLEMENTATION_WIRING_CYCLE
 *
 * @csps-id csps.tools.validators.validate-propagation-verified-gate
 * @csps-name validate-propagation-verified-gate
 * @csps-version 1.0.0 (S089)
 *
 * Layer 4 of the Weekly Evolution Engine (GOVERNANCE-SELF-IMPROVEMENT-PLAYBOOK-from-CDS-2026-07-26.md
 * Part 2): "A finding cannot be marked RESOLVED until propagation_verified=true (or
 * propagation_required=false with a stated reason)."
 *
 * GRANDFATHER CLAUSE: entries with NO propagation_required field at all (the entire pre-existing
 * corpus — this is a NEW gate) are exempt. Only entries that EXPLICITLY opt in by declaring
 * propagation_required: true are checked. This mirrors CSPS's own established rollout pattern
 * (STATUS-CONSOLIDATION S049, B_APPS_ARE_TRIALS grahpify hardwire-010) — new gates are never
 * retroactively punitive against the historical corpus.
 *
 * Output: gap_checked=N imp_checked=N blocking=N advisory=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const GAP_REGISTER = resolve(ROOT, 'tools/data/gap-recurrence-register.yaml');
const IMP_REGISTER = resolve(ROOT, 'tools/data/improvement-register.yaml');

const TERMINAL_STATUSES = new Set([
  'resolved', 'closed', 'propagated', 'fix_committed',
  'structural_fix_committed', 'behavioral_test_passing', 'sealed',
]);

function parseEntries(raw) {
  const entries = [];
  const blocks = raw.split(/\n  - id:/);
  for (const block of blocks.slice(1)) {
    const id = block.split('\n')[0].replace(/^[\s:]+/, '').replace(/"/g, '').trim();
    const status = (block.match(/\n    status:\s*([^\n]+)/) || [])[1]?.trim().replace(/"/g, '') || 'unknown';
    const propRequiredMatch = block.match(/\n    propagation_required:\s*(true|false)/);
    const propVerifiedMatch = block.match(/\n    propagation_verified:\s*(true|false)/);
    const propReasonMatch = block.match(/\n    propagation_not_required_reason:\s*"?([^"\n]*)"?/);
    if (id) {
      entries.push({
        id,
        status,
        hasPropField: !!propRequiredMatch,
        propRequired: propRequiredMatch ? propRequiredMatch[1] === 'true' : null,
        propVerified: propVerifiedMatch ? propVerifiedMatch[1] === 'true' : false,
        propReason: propReasonMatch ? propReasonMatch[1].trim() : '',
      });
    }
  }
  return entries;
}

let blocking = 0;
let advisory = 0;
let gapChecked = 0;
let impChecked = 0;
const findings = [];

for (const [label, path] of [['gap-recurrence-register', GAP_REGISTER], ['improvement-register', IMP_REGISTER]]) {
  if (!existsSync(path)) continue;
  const raw = readFileSync(path, 'utf-8');
  const entries = parseEntries(raw);
  if (label === 'gap-recurrence-register') gapChecked = entries.length;
  else impChecked = entries.length;

  for (const e of entries) {
    if (!e.hasPropField) continue; // grandfathered — never opted in
    if (!TERMINAL_STATUSES.has(e.status)) continue; // not claiming done yet
    if (e.propRequired === false) {
      if (!e.propReason) {
        advisory++;
        findings.push({ severity: 'ADVISORY', register: label, id: e.id, message: `propagation_required:false with no propagation_not_required_reason — declare why` });
      }
      continue; // explicitly opted out with (or without) reason — not blocking either way
    }
    if (e.propRequired === true && !e.propVerified) {
      blocking++;
      findings.push({ severity: 'BLOCKING', register: label, id: e.id, message: `status=${e.status} but propagation_required:true and propagation_verified is not true` });
    }
  }
}

for (const f of findings) {
  const icon = f.severity === 'BLOCKING' ? '✗' : '⚠';
  console.log(`  ${icon} [${f.register}] ${f.id}: ${f.message}`);
}

console.log(`[validate-propagation-verified-gate] gap_checked=${gapChecked} imp_checked=${impChecked} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
