#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: VALD
 * governing_principle: AP-001 (EXISTS != ACTIVE), composed at PORTFOLIO scale
 * behavioral_contract: B_CONSOLIDATION_PASS (Enhance-vs-Fork nuance — see decision-ledger entry
 *   in this validator's own header for why this is a justified FORK, not an enhancement, of
 *   flow-activity-monitor.yaml)
 * role: Structural + freshness gate for tools/data/value-ledger.yaml (the Real Value
 *       Verificator / RVV portfolio ledger). Mirrors the shape of
 *       validate-consensus-before-code.mjs: a mechanical presence/structure check, NOT a
 *       verifier of whether "value" was truly delivered — that boundary is documented and
 *       enforced by this validator refusing to grade the PROSE of intended_value/delivers_value,
 *       only the STRUCTURE (required fields present, enum values valid, freshness of
 *       last_reviewed).
 * @csps-enforces AP-001 B_EXISTS_NOT_EQUALS_ACTIVE
 *
 * @csps-id csps.tools.validators.validate-value-ledger
 * @csps-name validate-value-ledger
 * @csps-version 1.0.0 (S089)
 *
 * WHAT THIS CAN PROVE (mechanical, from ground truth of the ledger file itself):
 *   - every entry has all 8 required fields present (schema conformance)
 *   - `type` and `tag` are valid closed-enum values
 *   - `active` is a real boolean, not a string/undefined
 *   - `last_reviewed` is not older than STALE_THRESHOLD_SESSIONS sessions behind
 *     tools/session-state.json's current_session (freshness — ADVISORY only)
 *   - which entries are tagged DECLARED-ONLY (surfaced for the weekly expert, not blocked)
 *
 * WHAT THIS CANNOT PROVE (honest limitation — same class as B_CONSENSUS_BEFORE_CODE's
 * "presence of attempt, not truth of content"):
 *   - whether intended_value / delivers_value PROSE is actually true
 *   - whether an entry tagged VERIFIED-ACTIVE was verified rigorously or superficially
 *   - completeness of the ledger itself (see value-ledger.yaml SCOPE comment — this is a
 *     rate-limited seed, not a full inventory; this validator does not check coverage)
 * A human or the weekly-evolution-batch expert pass is still the real judge of VALUE.
 *
 * Output: entries=N declared_only=N stale=N blocking=N advisory=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { load } from 'js-yaml';

const ROOT = process.cwd();

const REQUIRED_FIELDS = [
  'element_id', 'type', 'intended_value', 'active',
  'last_activation_proof', 'delivers_value', 'tag', 'last_reviewed',
];
const VALID_TYPES = ['validator', 'hook', 'contract', 'agent', 'mechanism'];
const VALID_TAGS = ['VERIFIED-ACTIVE', 'DECLARED-ONLY', 'DORMANT', 'DEAD'];

// Mirrors flow-activity-monitor.yaml's `dormancy_thresholds.weekly: 4` — the platform's
// existing "how stale before it counts as neglected" number for weekly-cadence elements.
// Kept as a local constant (not a cross-file read) to keep this validator's isolated-tmp-repo
// block-test simple; the VALUE the number encodes is intentionally the same one, not a new one.
const STALE_THRESHOLD_SESSIONS = 4;

const LEDGER_PATH = `${ROOT}/tools/data/value-ledger.yaml`;

let entries = [];
if (existsSync(LEDGER_PATH)) {
  try {
    const doc = load(readFileSync(LEDGER_PATH, 'utf-8'));
    entries = (doc && doc.entries) || [];
  } catch (e) {
    console.log(`[validate-value-ledger] value-ledger.yaml parse error: ${e.message}`);
    console.log('[validate-value-ledger] entries=0 declared_only=0 stale=0 blocking=1 advisory=0');
    process.exit(1);
  }
}

let currentSessionNum = null;
try {
  const state = JSON.parse(readFileSync(`${ROOT}/tools/session-state.json`, 'utf-8'));
  const m = /^S0*(\d+)$/.exec(state.current_session || '');
  if (m) currentSessionNum = Number(m[1]);
} catch (e) {
  // No session state — freshness check simply skipped (honest: not an error, not assumed).
}

let blocking = 0;
let advisory = 0;
let declaredOnly = 0;
let stale = 0;

for (const e of entries) {
  const id = (e && e.element_id) || '<missing element_id>';

  // ── Schema conformance (BLOCKING — mechanically provable) ──────────────────────────
  const missing = REQUIRED_FIELDS.filter(f => !(f in (e || {})) || e[f] === null || e[f] === '');
  if (missing.length > 0) {
    blocking++;
    console.log(`  ✗ BLOCKING [schema] ${id}: missing/empty required field(s): ${missing.join(', ')}`);
    continue; // remaining checks need the fields present; don't cascade false positives
  }

  if (!VALID_TYPES.includes(e.type)) {
    blocking++;
    console.log(`  ✗ BLOCKING [schema] ${id}: type "${e.type}" not in {${VALID_TYPES.join('|')}}`);
  }

  if (!VALID_TAGS.includes(e.tag)) {
    blocking++;
    console.log(`  ✗ BLOCKING [schema] ${id}: tag "${e.tag}" not in {${VALID_TAGS.join('|')}}`);
  }

  if (typeof e.active !== 'boolean') {
    blocking++;
    console.log(`  ✗ BLOCKING [schema] ${id}: active must be a real boolean, got ${JSON.stringify(e.active)}`);
  }

  // ── DECLARED-ONLY surfacing (ADVISORY — not blocking; a legitimate honest state) ───
  if (e.tag === 'DECLARED-ONLY') {
    declaredOnly++;
    advisory++;
    console.log(`  ADVISORY [declared-only] ${id}: tagged DECLARED-ONLY — not yet independently re-verified; surface for weekly review.`);
  }
  if (e.tag === 'DORMANT' || e.tag === 'DEAD') {
    advisory++;
    console.log(`  ADVISORY [${e.tag.toLowerCase()}] ${id}: surfaced for weekly review.`);
  }

  // ── Freshness (ADVISORY — not blocking; staleness is a prompt to re-check, not a defect) ──
  if (currentSessionNum !== null) {
    const m = /^S0*(\d+)$/.exec(e.last_reviewed || '');
    if (m) {
      const reviewedSessionNum = Number(m[1]);
      const distance = currentSessionNum - reviewedSessionNum;
      if (distance > STALE_THRESHOLD_SESSIONS) {
        stale++;
        advisory++;
        console.log(`  ADVISORY [stale] ${id}: last_reviewed=S${reviewedSessionNum} is ${distance} sessions behind current S${currentSessionNum} (threshold=${STALE_THRESHOLD_SESSIONS}).`);
      }
    }
    // Non-session last_reviewed formats (e.g. YYYY-Www) are not scored for staleness here —
    // honest gap: this validator does not implement ISO-week arithmetic. See header comment.
  }
}

console.log(`[validate-value-ledger] entries=${entries.length} declared_only=${declaredOnly} stale=${stale} blocking=${blocking} advisory=${advisory}`);
if (blocking > 0) {
  console.log('[validate-value-ledger] Fix: every entry needs all 8 required fields, valid type/tag enums, and active as a real boolean.');
}
process.exit(blocking > 0 ? 1 : 0);
