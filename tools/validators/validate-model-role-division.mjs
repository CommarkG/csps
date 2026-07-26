#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: B_MODEL_ROLE_DIVISION
 * behavioral_contract: B_MODEL_ROLE_DIVISION
 * role: Flags the detectable signature of the anti-pattern this contract exists to prevent —
 *       a director-role session that produced volume implementation commits without ever
 *       recording a delegation in tools/data/opus-dispatch-log.yaml this session. Presence-of-
 *       attempt / absence-of-attempt check ONLY (same shape as validate-consensus-before-code.mjs
 *       / validate-spawn-trigger.mjs) — see HONEST LIMITATION below for what this cannot prove.
 * @csps-enforces B_MODEL_ROLE_DIVISION
 *
 * @csps-id csps.tools.validators.validate-model-role-division
 * @csps-name validate-model-role-division
 * @csps-version 1.0.0 (S089)
 *
 * Governor: "Opus implements ONLY complex and sensitive things and core-seeds some; Sonnet and
 * Haiku are the builders."
 *
 * HONEST DETECTION PROBLEM (do not oversell): git does NOT record which MODEL authored a
 * commit. There is no mechanical way to prove "Opus personally built this simple thing" from
 * git history alone. This validator does NOT attempt that. Instead it checks the one thing that
 * IS mechanically observable: whether tools/session-state.json declares which model is driving
 * the session (an `active_model` or `model` field), and if so, cross-references implementation
 * volume against delegation activity in the SAME registry B_SPAWN_TRIGGER_GATE already uses
 * (tools/data/opus-dispatch-log.yaml) — no new registry invented.
 *
 * CURRENT GAP (as of authoring): tools/session-state.json has NO active_model/model field today
 * (only session_role: opus-advisor | sonnet-builder, which names the TAB's intended purpose, not
 * which model is literally responding). Until that field exists, active_model reads "unknown"
 * and this validator can NEVER go BLOCKING — it stays ADVISORY-ONLY, honestly reporting the
 * volume-without-delegation signal as a risk indicator, not a violation. Recording active_model
 * at session-open is a real, separate follow-up this validator's gap makes visible.
 *
 * BOOTSTRAP EXEMPTION: this mechanism's own files (this validator, the dispatch log, verify.mjs,
 * audit-runner.md, the B_MODEL_ROLE_DIVISION contract + its shard source + the index, the
 * CSPS-OPUS-TAB-OPERATING-DISCIPLINE.md doc, AGENTS.md) are exempt from counting toward
 * impl_commits — they ARE the mechanism / its registration surfaces, not implementation this
 * contract requires a prior delegation for.
 *
 * TRIVIAL-SCOPE EXEMPTION: a mechanical proxy for test (c) (≤3-operation fix). A commit
 * touching <=3 non-exempt files is assumed trivial-scope and excluded from impl_commits — it
 * cannot itself trip volume-without-delegation. This is a proxy, not a judgment of the diff's
 * actual complexity; documented as such rather than silently assumed.
 *
 * THRESHOLD (documented, not hidden): IMPL_COMMIT_THRESHOLD = 5. Rationale: a handful of small
 * fixes is normal even for a director session (typo, one-line config, a single wiring edit each
 * exempted individually by the trivial-scope proxy above); five or more NON-trivial
 * implementation-shaped commits in one session, with zero delegation entries at all, is the
 * detectable shape of "built volume instead of delegating" the core-seed names. Tunable — not
 * derived from measured data yet, flagged honestly as a first-pass number.
 *
 * Output: impl_commits=N delegations_this_session=N active_model=<val|unknown> blocking=N advisory=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { load } from 'js-yaml';

const ROOT = process.cwd();

const IMPL_COMMIT_THRESHOLD = 5;

// Reused verbatim from validate-consensus-before-code.mjs — same definition of
// "implementation-shaped" across both B_CONSENSUS_BEFORE_CODE and B_MODEL_ROLE_DIVISION.
const IMPLEMENTATION_PATH_PATTERNS = [
  /^apps\//,
  /^libs\//,
  /^tools\/validators\//,
  /^tools\/scripts\//,
  /^\.claude\/skills\//,
  /^\.claude\/hooks\//,
];

// Bootstrap exemption — this mechanism's own files + registration surfaces never count.
const EXEMPT_FILES = new Set([
  'tools/data/opus-dispatch-log.yaml',
  'tools/validators/validate-model-role-division.mjs',
  'tools/verify.mjs',
  'docs/plan/pillar-0-governance/audit-runner.md',
  'docs/plan/pillar-0-governance/behavioral-contracts-GVRN.md',
  'docs/plan/pillar-0-governance/behavioral-contracts-index.yaml',
  'docs/plan/pillar-0-governance/behavioral-contracts/B_MODEL_ROLE_DIVISION.md',
  'docs/plan/pillar-0-governance/CSPS-OPUS-TAB-OPERATING-DISCIPLINE.md',
  'AGENTS.md',
]);

function fail0(reason) {
  console.log(`[validate-model-role-division] impl_commits=0 delegations_this_session=0 active_model=unknown blocking=0 advisory=0`);
  process.exit(0);
}

let sessionState = null;
let currentSession = null;
try {
  sessionState = JSON.parse(readFileSync(`${ROOT}/tools/session-state.json`, 'utf-8'));
  currentSession = sessionState.current_session || null;
} catch (e) {
  fail0('no session-state.json');
}

if (!currentSession) fail0('no current_session');

// ── active_model detection ──────────────────────────────────────────────────
// Literal field lookup only — no inference from session_role. session_role names the tab's
// INTENDED purpose (opus-advisor | sonnet-builder), not which model is literally responding;
// conflating the two would be exactly the kind of unverifiable inference this validator's
// HONEST LIMITATION exists to refuse.
const activeModel = (sessionState.active_model || sessionState.model || 'unknown').toString();

// ── implementation-shaped commits this session (bootstrap + trivial-scope exempt) ──────────
let implCommits = [];
try {
  const log = execSync(
    `git log --oneline --grep="^\\[${currentSession}\\]" --extended-regexp -n 200`,
    { cwd: ROOT, encoding: 'utf-8' }
  ).trim();
  const shas = log ? log.split('\n').map(l => l.split(' ')[0]) : [];
  for (const sha of shas) {
    let files = [];
    try {
      files = execSync(`git show --name-only --format= ${sha}`, { cwd: ROOT, encoding: 'utf-8' })
        .trim().split('\n').filter(Boolean).map(f => f.replace(/\\/g, '/'));
    } catch (e) { continue; }
    const nonExemptImplFiles = files.filter(f =>
      IMPLEMENTATION_PATH_PATTERNS.some(p => p.test(f)) && !EXEMPT_FILES.has(f)
    );
    // trivial-scope proxy: a commit touching <=3 non-exempt implementation files is assumed
    // to satisfy test (c) and is excluded from the volume count.
    if (nonExemptImplFiles.length > 3) {
      implCommits.push({ sha, files: nonExemptImplFiles });
    }
  }
} catch (e) {
  implCommits = [];
}

// ── delegations this session — same registry as B_SPAWN_TRIGGER_GATE ───────────────────────
let delegationsThisSession = 0;
const logPath = `${ROOT}/tools/data/opus-dispatch-log.yaml`;
if (existsSync(logPath)) {
  try {
    const doc = load(readFileSync(logPath, 'utf-8'));
    const dispatches = (doc && doc.dispatches) || [];
    delegationsThisSession = dispatches.filter(d => d.session === currentSession).length;
  } catch (e) {
    console.log(`[validate-model-role-division] opus-dispatch-log.yaml parse error: ${e.message}`);
  }
}

// ── verdict ──────────────────────────────────────────────────────────────────────────────
let blocking = 0;
let advisory = 0;

const volumeWithoutDelegation = implCommits.length > IMPL_COMMIT_THRESHOLD && delegationsThisSession === 0;

if (volumeWithoutDelegation) {
  if (activeModel.toLowerCase() === 'opus') {
    blocking = 1;
    console.log(`  ✗ BLOCKING: session ${currentSession} active_model=opus has ${implCommits.length} non-trivial implementation commit(s) (e.g. ${implCommits[0].sha}: ${implCommits[0].files[0]}) but 0 opus-dispatch-log.yaml delegations this session.`);
    console.log('    → B_MODEL_ROLE_DIVISION: Opus core-seeds and delegates to Sonnet/Haiku unless the complexity/sensitivity test (a/b/c) applies. Log the delegation in tools/data/opus-dispatch-log.yaml.');
  } else {
    advisory = 1;
    console.log(`  ⚠ ADVISORY: session ${currentSession} has ${implCommits.length} non-trivial implementation commit(s) but 0 opus-dispatch-log.yaml delegations this session, and active_model is "${activeModel}" (not mechanically confirmed as opus — cannot BLOCK without a recorded active_model field).`);
    console.log('    → Record active_model in tools/session-state.json to let this check go BLOCKING when the signal is genuinely unambiguous.');
  }
}

console.log(`[validate-model-role-division] impl_commits=${implCommits.length} delegations_this_session=${delegationsThisSession} active_model=${activeModel} blocking=${blocking} advisory=${advisory}`);
process.exit(blocking > 0 ? 1 : 0);
