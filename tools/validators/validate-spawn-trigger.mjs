#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: B_SPAWN_TRIGGER_GATE
 * behavioral_contract: B_SPAWN_TRIGGER_GATE
 * role: BLOCKS if this session has a HIGH-SCOPE Opus-agent dispatch (tools/data/opus-dispatch-log.yaml)
 *       recorded with verdict_recorded=false or an empty opus_verdict_ref, OR has HIGH-SCOPE
 *       governance implementation commits this session with ZERO opus-dispatch-log.yaml activity.
 *       Presence-of-attempt check ONLY (same shape as validate-consensus-before-code.mjs /
 *       validate-wiring-sweep-coverage.mjs) — cannot mechanically verify that a specific
 *       Opus-agent dispatch or verdict genuinely occurred, only that the dispatch-log mechanism
 *       was used at all this session.
 * @csps-enforces B_SPAWN_TRIGGER_GATE
 *
 * @csps-id csps.tools.validators.validate-spawn-trigger
 * @csps-name validate-spawn-trigger
 * @csps-version 1.0.0 (S089)
 *
 * Context: one-tab operating discipline — the persistent Opus director tab dispatches bounded
 * Sonnet-tier Agent() build work via tools/templates/opus-agent-spawn-template.md and performs
 * the sealing write (stage+verify+commit) itself, NEVER the ephemeral agent — the two tabs share
 * one physical git index, so an agent staging/committing races the other tab. HIGH-SCOPE
 * dispatches (constitutional / corespine / cross-cutting / depth>=4 governance work) must cite a
 * recorded Opus-agent verdict before the persistent tab seals the commit, or this gate BLOCKS.
 *
 * BOOTSTRAP EXEMPTION: the dispatch-log mechanism's own files (this validator, the dispatch log,
 * the opus-agent-spawn-template, verify.mjs, audit-runner.md) are exempt — they ARE the
 * dispatch-recording mechanism, not implementation requiring a prior recorded verdict.
 *
 * HONEST LIMITATION: cannot verify a SPECIFIC Opus-agent verdict was genuinely reached before a
 * specific commit, only that the dispatch log was touched this session and its HIGH-SCOPE
 * entries carry verdict_recorded=true + a non-empty ref. A human (or a future stricter
 * PreToolUse hard-block, not yet built — deliberately, to avoid a bootstrapping self-lock risk)
 * is still the real guard. Mirrors the honest-limitation shape of B_CONSENSUS_BEFORE_CODE.
 *
 * Output: high_scope_dispatches=N unverified=N high_scope_commits=N dispatch_entries_this_session=N blocking=N advisory=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { load } from 'js-yaml';

const ROOT = process.cwd();

// Scope tiers a director dispatch may declare. HIGH set requires a recorded verdict.
const HIGH_SCOPE_TIERS = new Set(['constitutional', 'corespine', 'cross-cutting', 'depth-ge-4']);
// trivial-reversible (and any other tier not in HIGH_SCOPE_TIERS) is exempt from the
// verdict-required check — it still gets logged for the activity signal in condition 2.

// Bootstrap exemption — the mechanism's own files never require a prior dispatch-log entry.
const EXEMPT_FILES = new Set([
  'tools/data/opus-dispatch-log.yaml',
  'tools/validators/validate-spawn-trigger.mjs',
  'tools/templates/opus-agent-spawn-template.md',
  'tools/verify.mjs',
  'docs/plan/pillar-0-governance/audit-runner.md',
]);

// HIGH-SCOPE governance path detection. Explicit surfaces + a depth>=4 heuristic for the
// broader pillar-0-governance tree (3+ path segments nested beneath pillar-0-governance/).
function isHighScopeGovernancePath(f) {
  if (/^docs\/plan\/pillar-0-governance\/behavioral-contracts\//.test(f)) return true;
  if (/^\.claude\/core-spines\//.test(f)) return true;
  if (f === 'CSPS-NORTH-STAR.md') return true;
  const m = f.match(/^docs\/plan\/pillar-0-governance\/(.+)$/);
  if (m && m[1].split('/').length >= 4) return true; // depth-ge-4 heuristic
  return false;
}

let currentSession = null;
try {
  const state = JSON.parse(readFileSync(`${ROOT}/tools/session-state.json`, 'utf-8'));
  currentSession = state.current_session || null;
} catch (e) {
  console.log('[validate-spawn-trigger] high_scope_dispatches=0 unverified=0 high_scope_commits=0 dispatch_entries_this_session=0 blocking=0 advisory=0');
  process.exit(0);
}

if (!currentSession) {
  console.log('[validate-spawn-trigger] high_scope_dispatches=0 unverified=0 high_scope_commits=0 dispatch_entries_this_session=0 blocking=0 advisory=0');
  process.exit(0);
}

let dispatches = [];
const logPath = `${ROOT}/tools/data/opus-dispatch-log.yaml`;
if (existsSync(logPath)) {
  try {
    const doc = load(readFileSync(logPath, 'utf-8'));
    dispatches = (doc && doc.dispatches) || [];
  } catch (e) {
    console.log(`[validate-spawn-trigger] opus-dispatch-log.yaml parse error: ${e.message}`);
  }
}

const dispatchesThisSession = dispatches.filter(d => d.session === currentSession);
const highScopeDispatchesThisSession = dispatchesThisSession.filter(d => HIGH_SCOPE_TIERS.has(d.scope_tier));
const unverified = highScopeDispatchesThisSession.filter(
  d => d.verdict_recorded !== true || !d.opus_verdict_ref || String(d.opus_verdict_ref).trim() === ''
);

let blocking = 0;

// BLOCKING condition 1: a HIGH-SCOPE dispatch this session without a recorded verdict.
if (unverified.length > 0) {
  blocking = 1;
  console.log(`  ✗ BLOCKING: session ${currentSession} has ${unverified.length} HIGH-SCOPE dispatch(es) (e.g. ${unverified[0].dispatch_id || 'unknown'}) with verdict_recorded=false or empty opus_verdict_ref.`);
  console.log('    → B_SPAWN_TRIGGER_GATE: record the Opus-agent verdict (verdict_recorded:true + opus_verdict_ref) before the persistent tab seals the commit.');
}

// BLOCKING condition 2 (mirror consensus-before-code): HIGH-SCOPE governance commits this
// session but ZERO dispatch-log activity at all this session.
let highScopeCommits = [];
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
    const nonExemptHighScopeFiles = files.filter(f => isHighScopeGovernancePath(f) && !EXEMPT_FILES.has(f));
    if (nonExemptHighScopeFiles.length > 0) {
      highScopeCommits.push({ sha, files: nonExemptHighScopeFiles });
    }
  }
} catch (e) {
  highScopeCommits = [];
}

if (highScopeCommits.length > 0 && dispatchesThisSession.length === 0) {
  blocking = 1;
  console.log(`  ✗ BLOCKING: session ${currentSession} has ${highScopeCommits.length} HIGH-SCOPE governance commit(s) (e.g. ${highScopeCommits[0].sha}: ${highScopeCommits[0].files[0]}) but 0 opus-dispatch-log.yaml activity this session.`);
  console.log('    → B_SPAWN_TRIGGER_GATE: log the dispatch in tools/data/opus-dispatch-log.yaml with a recorded verdict before implementing HIGH-SCOPE governance changes. (Honest limitation: a self-logged mechanism cannot prove a specific dispatch happened, only that the log was touched.)');
}

console.log(`[validate-spawn-trigger] high_scope_dispatches=${highScopeDispatchesThisSession.length} unverified=${unverified.length} high_scope_commits=${highScopeCommits.length} dispatch_entries_this_session=${dispatchesThisSession.length} blocking=${blocking} advisory=0`);
process.exit(blocking > 0 ? 1 : 0);
