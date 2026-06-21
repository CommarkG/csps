#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-session-close-completeness
 * @csps-name validate-session-close-completeness
 * @csps-description C3 S086 INHERITANCE-LOOP: IZFC at session scope. At session close,
 *   every thread opened this session must land in a committed artifact — chat-only = FAIL.
 *   Checks:
 *   (a) sonnet-turn.md exists and has a THIS-SESSION SROF (session number matches current)
 *   (b) HANDOFF-S<NNN>-to-S<NNN+1>.md or closing-summary-S<NNN>.md exists for this session
 *   (c) session-state.json current_session matches the session-state mandated session
 *
 *   ADVISORY (not BLOCKING) by default — session-close runs at end of session when context
 *   may be high; advisory surfaces the gaps without blocking the final commit.
 *   Promoted to BLOCKING after K=2 incidents of chat-only threads (gap-recurrence-register).
 *
 * run_tier: EXTENDED
 * load_mode: on-demand + session-close
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces P-META-033 PROTO-S086-INHERITANCE-LOOP B_ACTIVATION_STEADY_STATE_VERIFY
 * @csps-prevention-class CHAT-ONLY-THREAD INCOMPLETE-SESSION-CLOSURE
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): HANDOFF/closing-summary exists but SROF missing (relay chain broken)
 *   ADVISORY (exit 0): threads not yet landed in committed artifacts (not yet close time)
 *
 * Exit: 1 if handoff exists but SROF is stale; 0 otherwise
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

let blocking = 0;
let advisory = 0;
const findings = [];

// ── Get current session ────────────────────────────────────────────────────────

let currentSession = 'unknown';
const ssPath = join(ROOT, 'tools/session-state.json');
if (existsSync(ssPath)) {
  try {
    const ss = JSON.parse(readFileSync(ssPath, 'utf-8'));
    currentSession = ss.current_session || 'unknown';
  } catch { /* use unknown */ }
}

// ── Check (a): sonnet-turn.md has THIS-SESSION content ────────────────────────

const sonnetPath = join(ROOT, 'tools/council/sonnet-turn.md');
let sonnetFresh = false;
if (existsSync(sonnetPath)) {
  const text = readFileSync(sonnetPath, 'utf-8');
  sonnetFresh = text.includes(`S${currentSession}`) || text.includes(currentSession);
  if (!sonnetFresh) {
    findings.push({ severity: 'ADVISORY', id: 'sonnet-turn-stale', msg: `sonnet-turn.md does not contain session ${currentSession} — Opus report not yet written for this session` });
    advisory++;
  }
} else {
  findings.push({ severity: 'ADVISORY', id: 'sonnet-turn-missing', msg: 'sonnet-turn.md not found — Opus report channel missing' });
  advisory++;
}

// ── Check (b): HANDOFF or closing-summary exists for this session ──────────────

const handoffDir = join(ROOT, 'docs/plan/_handoff');
let handoffExists = false;
if (existsSync(handoffDir)) {
  const pattern = new RegExp(`HANDOFF-${currentSession}-to-|closing-summary-${currentSession}`, 'i');
  const files = readdirSync(handoffDir).filter(f => pattern.test(f));
  handoffExists = files.length > 0;
}

if (!handoffExists) {
  findings.push({ severity: 'ADVISORY', id: 'handoff-missing', msg: `No HANDOFF-${currentSession}-*.md or closing-summary-${currentSession}.md found — session close artifact not yet written` });
  advisory++;
} else if (!sonnetFresh) {
  // Handoff exists but SROF is stale = relay chain broken
  findings.push({ severity: 'BLOCKING', id: 'handoff-without-srof', msg: `HANDOFF exists for ${currentSession} but sonnet-turn.md does not contain the session report — handoff may be missing Opus relay content` });
  blocking++;
}

// ── Check (c): session-state.json is consistent ────────────────────────────────

if (existsSync(ssPath)) {
  try {
    const ss = JSON.parse(readFileSync(ssPath, 'utf-8'));
    if (!ss.current_session) {
      findings.push({ severity: 'ADVISORY', id: 'session-state-no-current', msg: 'session-state.json missing current_session field' });
      advisory++;
    }
    // Check for open blocking decisions that should have been actioned
    const openBlocking = (ss.blocking_decisions || []).filter(d => d.status !== 'RESOLVED');
    if (openBlocking.length > 0) {
      findings.push({ severity: 'ADVISORY', id: 'open-blocking-decisions', msg: `${openBlocking.length} blocking_decisions still open in session-state.json: ${openBlocking.map(d => d.id || d.vlt).join(', ')}` });
      advisory++;
    }
  } catch { /* parse error */ }
}

// ── Output ────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-session-close-completeness] ${status}`);
console.log(`  session=${currentSession} handoff_exists=${handoffExists} sonnet_fresh=${sonnetFresh}`);
console.log(`  blocking=${blocking} advisory=${advisory}`);

for (const f of findings) {
  if (f.severity === 'BLOCKING') console.error(`  ✗ BLOCKING [${f.id}]: ${f.msg}`);
  else console.warn(`  ⚠ ADVISORY [${f.id}]: ${f.msg}`);
}

if (blocking === 0 && advisory === 0) {
  console.log(`[validate-session-close-completeness] ✓ Session ${currentSession} artifacts complete`);
}

process.exit(blocking > 0 ? 1 : 0);
