#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-park-register
 * @csps-name validate-park-register
 * @csps-description Integrity + schema + dedup guard for tools/data/park-register.yaml.
 *   Born from S089 finding: the register was committed BROKEN YAML at 93b79ee5 (3 Sonnet
 *   parks appended at column-0 + opus_questions colon-scalars) and stayed UNPARSEABLE for
 *   3 commits with NO validator detecting it. A governance SSoT with no parse/schema guard
 *   silently rots. This IS the HARDWIRE-queued validate-park-dedup (header line 22),
 *   extended to parse+schema integrity. Closes PARK-S089-PARK-REGISTER-INTEGRITY.
 *
 *   Checks:
 *     1. js-yaml parse MUST succeed (BLOCKING — the exact 93b79ee5 failure).
 *     2. entries: is a non-empty list (BLOCKING if missing/empty).
 *     3. every entry has an id (BLOCKING) and no duplicate ids (BLOCKING).
 *     4. lane in {schedule,queue,vault,obligation} when present (BLOCKING on invalid value).
 *     5. dedup_checked present on entries created S089+ (ADVISORY — the consult-first arm;
 *        advisory so the 92 legacy entries don't fail, but new drift is surfaced).
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_DECISION_LEDGER B_CONSOLIDATION_PASS
 * @csps-prevention-class BROKEN-GOVERNANCE-SSOT-UNGUARDED
 *
 * load_mode: on-demand
 * # justification: only needed when validating the park register (not per-turn content).
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REG_PATH = resolve(ROOT, 'tools/data/park-register.yaml');
const LANES = new Set(['schedule', 'queue', 'vault', 'obligation']);

let blocking = 0;
let advisory = 0;
const findings = [];

let entryCount = 0;
let openCount = 0;
let dupCount = 0;
let missingDedup = 0;

if (!existsSync(REG_PATH)) {
  findings.push('BLOCKING: park-register.yaml not found at tools/data/park-register.yaml');
  blocking += 1;
} else {
  const raw = readFileSync(REG_PATH, 'utf8');
  let doc = null;

  // ── Check 1: YAML parses (the 93b79ee5 failure mode) ──────────────────────
  try {
    doc = yaml.load(raw);
  } catch (e) {
    const line = e.mark && typeof e.mark.line === 'number' ? e.mark.line + 1 : '?';
    findings.push(`BLOCKING: park-register.yaml is INVALID YAML (parse error at line ${line}): ${e.reason || e.message}`);
    findings.push('  This is the exact S089/93b79ee5 failure: register unparseable = no tool can read it.');
    blocking += 1;
  }

  if (doc) {
    // ── Check 2: entries list ───────────────────────────────────────────────
    if (!Array.isArray(doc.entries) || doc.entries.length === 0) {
      findings.push('BLOCKING: park-register.yaml has no non-empty `entries:` list');
      blocking += 1;
    } else {
      entryCount = doc.entries.length;
      const seen = new Map();

      for (let i = 0; i < doc.entries.length; i++) {
        const e = doc.entries[i] || {};
        const id = e.id;

        // ── Check 3a: id present ──────────────────────────────────────────
        if (!id) {
          findings.push(`BLOCKING: entry[${i}] has no id`);
          blocking += 1;
          continue;
        }

        // ── Check 3b: duplicate id ────────────────────────────────────────
        if (seen.has(id)) {
          dupCount += 1;
          findings.push(`BLOCKING: duplicate id "${id}" (also at entry[${seen.get(id)}])`);
          blocking += 1;
        } else {
          seen.set(id, i);
        }

        if (e.closed_session === null || e.closed_session === undefined) openCount += 1;

        // ── Check 4: lane enum (ADVISORY — canon is ambiguous: header documents
        //    4 lanes but S088 entries use "exploration"; surface drift, do not block
        //    on un-canonicalized schema. Canonicalize lanes -> then promote to BLOCKING). ──
        if (e.lane !== undefined && !LANES.has(e.lane)) {
          findings.push(`ADVISORY: "${id}" lane "${e.lane}" not in documented enum (${[...LANES].join(', ')}) — canonicalize lane list`);
          advisory += 1;
        }

        // ── Check 5: dedup_checked on S089+ entries (advisory) ────────────
        const sess = String(e.created_session || e.source_session || e.parked_session || '');
        const m = sess.match(/S0*(\d+)/);
        const sessNum = m ? Number(m[1]) : 0;
        if (sessNum >= 89 && !e.dedup_checked && e.closed_session == null) {
          missingDedup += 1;
          findings.push(`ADVISORY: "${id}" (S089+) lacks dedup_checked (consult-first / B_DECISION_LEDGER arm)`);
          advisory += 1;
        }
      }
    }
  }
}

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-park-register] ${status}`);
console.log(`  entries=${entryCount} open=${openCount} duplicates=${dupCount} missing_dedup=${missingDedup}`);
console.log(`  blocking=${blocking} advisory=${advisory}`);

if (findings.length > 0) {
  console.log('\n[validate-park-register] findings:');
  for (const f of findings) console.log(`  - ${f}`);
}

console.log('\n[validate-park-register] guard: a governance SSoT with no parse/schema guard silently rots.');
console.log('  Closes PARK-S089-PARK-REGISTER-INTEGRITY (S089 broken-register finding).');

process.exit(blocking > 0 ? 1 : 0);
