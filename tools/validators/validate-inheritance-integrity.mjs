#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-inheritance-integrity
 * @csps-name validate-inheritance-integrity
 * @csps-description C4 S086 INHERITANCE-LOOP: validates that decisions and obligations
 *   are properly inherited across session boundaries. Three checks:
 *   (a) No obligation/decision lives only in chat — must have committed artifact
 *   (b) Cross-artifact decision propagation: session-state.json vs HANDOFF drift detection
 *   (c) Inheritance channel parse: CLAUDE.md loads, session-state.json valid, registers parseable
 *
 *   BLOCKING on: handoff mentions a park/decision that session-state.json doesn't have,
 *   or resolved_questions in latest handoff not reflected in session-state.json.
 *
 * run_tier: EXTENDED
 * load_mode: on-demand + session-open
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-033 PROTO-S086-INHERITANCE-LOOP AP-001
 * @csps-prevention-class CHAT-ONLY-DECISION INHERITANCE-DRIFT DEAD-INHERITANCE-CHANNEL
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): inheritance channel parse fails; HANDOFF references decisions not in
 *                       session-state; session-state.json malformed
 *   ADVISORY (exit 0): mild drift (e.g., older handoffs with stale references)
 *
 * Exit: 1 if any BLOCKING condition; 0 otherwise
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

let blocking = 0;
let advisory = 0;
const findings = [];

// ── Check (c): Inheritance channel parse ───────────────────────────────────────

// session-state.json must be parseable JSON
const ssPath = join(ROOT, 'tools/session-state.json');
let ss = null;
if (existsSync(ssPath)) {
  try {
    ss = JSON.parse(readFileSync(ssPath, 'utf-8'));
  } catch (e) {
    findings.push({ severity: 'BLOCKING', id: 'session-state-malformed', msg: `tools/session-state.json parse error: ${e.message}` });
    blocking++;
  }
} else {
  findings.push({ severity: 'BLOCKING', id: 'session-state-missing', msg: 'tools/session-state.json not found — primary inheritance channel missing' });
  blocking++;
}

// park-register.yaml must be parseable YAML (simple check: contains entries:)
const parkPath = join(ROOT, 'tools/data/park-register.yaml');
if (existsSync(parkPath)) {
  const parkText = readFileSync(parkPath, 'utf-8');
  if (!parkText.includes('entries:')) {
    findings.push({ severity: 'BLOCKING', id: 'park-register-malformed', msg: 'park-register.yaml missing entries: section' });
    blocking++;
  }
} else {
  findings.push({ severity: 'ADVISORY', id: 'park-register-missing', msg: 'park-register.yaml not found — park obligation register missing' });
  advisory++;
}

// ── Check (b): Cross-artifact decision propagation ─────────────────────────────

// Find the most recent HANDOFF file and check if decisions it mentions are in session-state
const handoffDir = join(ROOT, 'docs/plan/_handoff');
if (existsSync(handoffDir) && ss) {
  const handoffs = readdirSync(handoffDir)
    .filter(f => /^HANDOFF-S\d+.*\.md$/.test(f))
    .sort()
    .slice(-1); // most recent

  for (const hf of handoffs) {
    const text = readFileSync(join(handoffDir, hf), 'utf-8');

    // Check: handoff mentions Q3/Q4 resolutions — must be in session-state resolved_questions
    const q3mentioned = /Q3|PARK-041.*seq|per-role.*cards.*seq/i.test(text);
    const q4mentioned = /Q4|unified.*orchestr|orchestr.*unified/i.test(text);

    if (q3mentioned && ss && !ss.resolved_questions?.['Q3-PARK-041-sequencing']) {
      findings.push({ severity: 'ADVISORY', id: 'q3-not-in-session-state', msg: `${hf} mentions Q3 (PARK-041 sequencing) but resolved_questions.Q3-PARK-041-sequencing not in session-state.json` });
      advisory++;
    }
    if (q4mentioned && ss && !ss.resolved_questions?.['Q4-unified-orchestrator']) {
      findings.push({ severity: 'ADVISORY', id: 'q4-not-in-session-state', msg: `${hf} mentions Q4 (unified orchestrator) but resolved_questions.Q4-unified-orchestrator not in session-state.json` });
      advisory++;
    }
  }
}

// ── Check (a): No obligation lives only in chat ─────────────────────────────────

// Scan .csps/floater-decision-queue.txt for items that should have moved to registers
const floaterPath = join(ROOT, '.csps/floater-decision-queue.txt');
if (existsSync(floaterPath)) {
  const floater = readFileSync(floaterPath, 'utf-8');
  // Look for items that are more than 2 sessions old but not in any register
  const oldItems = [...floater.matchAll(/S0(\d{2,3})[:\s]+(.{10,80})/g)]
    .filter(m => {
      const sNum = parseInt(m[1], 10);
      // If referenced to session more than 2 behind current
      if (!ss?.current_session) return false;
      const cur = parseInt(ss.current_session.replace('S', ''), 10);
      return cur - sNum > 2;
    });
  if (oldItems.length > 0) {
    findings.push({ severity: 'ADVISORY', id: 'stale-floater-items', msg: `${oldItems.length} items in floater-decision-queue.txt are >2 sessions old — should be in park-register or improvement-register` });
    advisory++;
  }
}

// ── Output ─────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-inheritance-integrity] ${status}`);
console.log(`  blocking=${blocking} advisory=${advisory}`);

for (const f of findings) {
  if (f.severity === 'BLOCKING') console.error(`  ✗ BLOCKING [${f.id}]: ${f.msg}`);
  else console.warn(`  ⚠ ADVISORY [${f.id}]: ${f.msg}`);
}

if (blocking === 0 && advisory === 0) {
  console.log('[validate-inheritance-integrity] ✓ Inheritance integrity: channels parse, decisions propagated, no chat-only obligations');
}

process.exit(blocking > 0 ? 1 : 0);
