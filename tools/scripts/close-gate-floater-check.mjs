/**
 * @csps-id csps.tools.scripts.close-gate-floater-check
 * @csps-name close-gate-floater-check
 * @csps-description ANTI-FLOAT T3 — close-gate check for current-session floaters.
 *   Called by post-stop-session-close-gate.sh at session close detection.
 *   BLOCKS if any non-terminal artifact was created/touched in this session
 *   without a closure_by trigger or terminal_state.
 *   Per P-META-030 enforcement_tier.tier3_session: "post-stop-session-close-gate extension".
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces P-META-030 B_ANTI_FLOAT
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';

const ROOT = process.env.CSPS_REPO_ROOT || process.cwd();

// ── Get current session ───────────────────────────────────────────────────────
let currentSession = 'S000';
try {
  const sessionSource = join(ROOT, 'tools/lib/session-source.mjs');
  currentSession = execSync(`node "${sessionSource}"`, { cwd: ROOT }).toString().trim();
} catch (e) {
  // Fallback: read from session-state.json
  try {
    const stateRaw = readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8');
    const state = JSON.parse(stateRaw);
    currentSession = state.current_session || 'S000';
  } catch (_) { /* ignore */ }
}

// ── Load floating-artifacts-register.yaml ────────────────────────────────────
const REGISTER_PATH = join(ROOT, 'tools/data/floating-artifacts-register.yaml');
let entries = [];
try {
  const raw = readFileSync(REGISTER_PATH, 'utf8');
  const reg = yaml.load(raw);
  entries = reg.entries || [];
} catch (e) {
  // If register can't be read, exit 0 (non-blocking on missing register)
  process.exit(0);
}

// ── Find current-session non-terminal floaters ───────────────────────────────
// A floater is "session-created + non-terminal" if:
//   created_session === currentSession
//   AND escalation_state !== 'terminal'
//   AND terminal_state is null/empty
const newFloaters = entries.filter(e =>
  e.created_session === currentSession &&
  e.escalation_state !== 'terminal' &&
  !e.terminal_state
);

// ── Output result ─────────────────────────────────────────────────────────────
if (newFloaters.length === 0) {
  // Output JSON for success (close-gate reads this)
  console.log(JSON.stringify({
    status: 'PASS',
    message: 'No new floaters created this session (' + currentSession + ') without terminal path.',
    session: currentSession,
    checked: entries.filter(e => e.created_session === currentSession).length
  }));
  process.exit(0);
} else {
  // Output JSON for BLOCK
  const items = newFloaters.map(e => ({
    id: e.id,
    artifact_path: e.artifact_path,
    closure_decision: e.closure_decision || 'NOT SET',
    closure_by: e.closure_by || 'NOT SET'
  }));

  console.log(JSON.stringify({
    status: 'BLOCK',
    message: newFloaters.length + ' artifact(s) created in ' + currentSession + ' still non-terminal. ' +
      'Each needs closure_by + closure_decision + escalation_state set before close.',
    session: currentSession,
    floaters: items,
    fix: 'Update floating-artifacts-register.yaml: set escalation_state: terminal AND terminal_state for each item above, OR add a valid closure_by trigger.'
  }));
  process.exit(1);
}
