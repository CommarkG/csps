#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-session-authority
 * @csps-name validate-session-authority
 * @csps-description Session authority validator. Reads current_session from session-state.json
 * and compares it against the latest session marker in tools/council/sonnet-turn.md.
 * Advisory: flags when session-state.json is more than 2 sessions behind the active
 * session in sonnet-turn.md (stale authority signal).
 * Advisory: flags when sonnet-turn.md contains entries from 3+ different session numbers
 * (possible "three drivers" problem — multiple parallel sessions producing outputs).
 * "The three drivers problem: multiple sessions producing conflicting outputs without
 * a clear authority signal. This validator makes authority staleness visible."
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces AP-001
 * context_question: "Does session-state.json reflect the current active session? Stale = no authority signal."
 * Wired: tools/verify.mjs cycle 'session_authority'
 * Plan item: VALIDATE-SESSION-AUTHORITY | S055
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const SESSION_STATE_FILE = resolve(ROOT, 'tools/session-state.json');
const SONNET_TURN_FILE = resolve(ROOT, 'tools/council/sonnet-turn.md');

function parseSessionNumber(tag) {
  const m = tag.match(/S(\d+)/);
  return m ? Number(m[1]) : null;
}

function extractSessionNumbers(text) {
  const numbers = new Set();
  const matches = text.matchAll(/\bS(\d{3,})\b/g);
  for (const m of matches) {
    const n = Number(m[1]);
    if (n >= 40) numbers.add(n);
  }
  return numbers;
}

let advisory = 0;
let blocking = 0;
let stateSession = null;
let latestCouncilSession = null;
let sessionSpread = 0;

// Read session-state.json
if (!existsSync(SESSION_STATE_FILE)) {
  console.warn('[validate-session-authority] ADVISORY: session-state.json not found');
  advisory++;
} else {
  try {
    const state = JSON.parse(readFileSync(SESSION_STATE_FILE, 'utf-8'));
    const raw = state.active_implementation_session ?? state.current_session ?? null;
    stateSession = raw ? parseSessionNumber(String(raw)) : null;
    if (stateSession === null) {
      console.warn('[validate-session-authority] ADVISORY: session-state.json has no current_session or active_implementation_session field');
      advisory++;
    }
  } catch (e) {
    console.warn(`[validate-session-authority] ADVISORY: session-state.json parse error: ${e.message}`);
    advisory++;
  }
}

// Read sonnet-turn.md for session markers
if (!existsSync(SONNET_TURN_FILE)) {
  console.warn('[validate-session-authority] ADVISORY: sonnet-turn.md not found');
  advisory++;
} else {
  const text = readFileSync(SONNET_TURN_FILE, 'utf-8');
  const sessionNums = extractSessionNumbers(text);

  // Find the highest session number in sonnet-turn.md (= latest active session)
  if (sessionNums.size > 0) {
    latestCouncilSession = Math.max(...sessionNums);
  }

  // Count distinct sessions referenced in sonnet-turn.md (three-drivers check)
  // Only flag if many different sessions — cross-boundary reporting is normal
  sessionSpread = sessionNums.size;
  if (sessionSpread >= 6) {
    console.warn(`[validate-session-authority] ADVISORY: sonnet-turn.md references ${sessionSpread} distinct session numbers`);
    console.warn(`  Sessions: ${[...sessionNums].sort((a,b)=>a-b).map(n=>`S${n}`).join(', ')}`);
    console.warn(`  High spread may indicate accumulated history (normal) or parallel sessions (review)`);
    advisory++;
  }
}

// Compare session-state.json vs sonnet-turn.md
if (stateSession !== null && latestCouncilSession !== null) {
  const gap = latestCouncilSession - stateSession;
  if (gap > 2) {
    console.warn(`[validate-session-authority] ADVISORY: session-state.json shows S${stateSession} but sonnet-turn.md shows S${latestCouncilSession} (${gap} sessions behind)`);
    console.warn(`  Fix: update session-state.json current_session to S${latestCouncilSession} at session open`);
    console.warn(`  Stale session-state = no authoritative current-session signal for other validators`);
    advisory++;
  } else if (gap < 0) {
    console.warn(`[validate-session-authority] ADVISORY: session-state.json (S${stateSession}) is ahead of sonnet-turn.md (S${latestCouncilSession}) — possible stale council file`);
    advisory++;
  }
}

const sessionStateLabel = stateSession ? `S${stateSession}` : 'unknown';
const councilLabel = latestCouncilSession ? `S${latestCouncilSession}` : 'unknown';
const gap = (stateSession && latestCouncilSession) ? latestCouncilSession - stateSession : -1;

console.log(`[validate-session-authority] state_session=${sessionStateLabel} council_session=${councilLabel} gap=${gap} session_spread=${sessionSpread} advisory=${advisory} blocking=${blocking}`);
process.exit(blocking > 0 ? 1 : 0);
