#!/usr/bin/env node
/**
 * validate-floater-escalation.mjs — Floater Overdue Escalation Gate (Act-Forcing)
 *
 * Opus directive S088: "a floater overdue > N sessions BLOCKS (mirror validate-prevention-coverage k≥3)"
 * Prevention class: FLOATING-ARTIFACT-NEVER-REACHES-TERMINAL
 *
 * BLOCKING:
 *   (a) ANY floater has escalation_state:overdue AND terminal_state:null
 *       AND session gap from closure_by > SESSION_BLOCK_THRESHOLD (default: 3)
 *       → BLOCKS immediately; floaters that survive past 3 sessions overdue are unacceptable
 *   (b) ANY floater has escalation_state:overdue AND terminal_state:null
 *       AND session gap is 0–3 (grace window) → ADVISORY only; closes before overdue clock runs
 *
 * RF-everywhere: surfaces overdue floaters in the act-forcing loop.
 * This validator is the BLOCKING gate; findings-actuator is the session-start advisory.
 *
 * @csps-id csps.validators.validate-floater-escalation
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces FLOATING-ARTIFACT-NEVER-REACHES-TERMINAL floating-artifacts-register
 * @csps-prevention-class FLOATER-ACCUMULATION GOVERNANCE-DEBT
 *
 * run_tier: STANDARD
 * always_rerun: false
 * @determinism-exempt: no clock-based decisions; session numbers are from committed files only.
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const REGISTER = join(ROOT, 'tools/data/floating-artifacts-register.yaml');
const SESSION_STATE = join(ROOT, 'tools/session-state.json');
const LAST_RUN = join(ROOT, 'tools/data/validate-floater-escalation-last-run.json');

const SESSION_BLOCK_THRESHOLD = 3; // sessions overdue before BLOCKING (k≥3 parallel)

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// Parse session number from "S088" → 88, "S074" → 74, "unknown" → null
function parseSessionNum(s) {
  if (!s) return null;
  const m = String(s).trim().match(/S(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

// Parse current session from session-state.json
function getCurrentSession() {
  if (!existsSync(SESSION_STATE)) return null;
  try {
    const d = JSON.parse(readFileSync(SESSION_STATE, 'utf8'));
    return parseSessionNum(d.current_session);
  } catch { return null; }
}

// Parse all overdue entries from register
function parseOverdueEntries(raw) {
  const entries = [];
  const blocks = raw.split(/\n  - id: /);
  for (const block of blocks.slice(1)) {
    const lines = block.split('\n');
    const id = lines[0].trim();
    const get = (key) => {
      const l = lines.find(x => x.trim().startsWith(key + ':'));
      return l ? l.split(':').slice(1).join(':').trim().replace(/^"(.*)"$/, '$1') : null;
    };
    const escalation = get('escalation_state');
    const terminal = get('terminal_state');
    const closureBy = get('closure_by');
    const artifactPath = get('artifact_path');

    if (escalation === 'overdue' && (!terminal || terminal === 'null')) {
      entries.push({ id, artifact_path: artifactPath, closure_by: closureBy });
    }
  }
  return entries;
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[validate-floater-escalation] Floater overdue escalation gate');
console.log('');

if (!existsSync(REGISTER)) {
  WARN('tools/data/floating-artifacts-register.yaml missing — floater register not initialized');
  process.exit(0);
}

let raw;
try {
  raw = readFileSync(REGISTER, 'utf8');
} catch (e) {
  BLOCK(`could not read floating-artifacts-register.yaml: ${e.message}`);
  process.exit(1);
}

const currentSession = getCurrentSession();
if (currentSession) {
  PASS(`current session: S${currentSession}`);
} else {
  WARN('could not determine current session from session-state.json — gap calculation will use 0');
}

const overdueEntries = parseOverdueEntries(raw);

if (overdueEntries.length === 0) {
  PASS('no overdue floaters with terminal_state:null — floater debt is zero');
} else {
  for (const entry of overdueEntries) {
    const closureByNum = parseSessionNum(entry.closure_by);
    const gap = (currentSession && closureByNum)
      ? Math.max(0, currentSession - closureByNum)
      : 999; // unknown session = treat as maximum overdue

    const label = `${entry.id} (path: ${entry.artifact_path}, closure_by: ${entry.closure_by || 'unknown'}, gap: ${gap === 999 ? 'unknown' : gap + ' sessions'})`;

    if (gap > SESSION_BLOCK_THRESHOLD) {
      BLOCK(`floater OVERDUE >${SESSION_BLOCK_THRESHOLD} sessions: ${label} — terminal decision required (RATIFIED|REJECTED|VAULTED|SUPERSEDED)`);
    } else {
      WARN(`floater OVERDUE (grace window ${gap}/${SESSION_BLOCK_THRESHOLD}): ${label} — terminal decision needed`);
    }
  }
}

// ── RESULT ─────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-floater-escalation] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    blocking, advisory, passes, findings,
    current_session: currentSession ? `S${currentSession}` : 'unknown',
    overdue_count: overdueEntries.length,
    block_threshold: SESSION_BLOCK_THRESHOLD,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
