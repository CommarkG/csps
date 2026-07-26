#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: B_CONSENSUS_BEFORE_CODE
 * behavioral_contract: B_CONSENSUS_BEFORE_CODE
 * role: BLOCKS if this session has implementation-shaped commits with ZERO matching activity
 *       in tools/data/consensus-queue.yaml this session. Presence-of-attempt check ONLY (same
 *       shape as validate-challenge-on-merit.mjs / validate-wiring-sweep-coverage.mjs) — cannot
 *       mechanically verify that a specific diff was genuinely pre-discussed, only that the
 *       consensus-queue mechanism was used at all this session.
 * @csps-enforces B_CONSENSUS_BEFORE_CODE
 *
 * @csps-id csps.tools.validators.validate-consensus-before-code
 * @csps-name validate-consensus-before-code
 * @csps-version 1.0.0 (S089)
 *
 * Governor: "all starts with conversation. no automatic coding ever. consolidate and offer
 * when significant enough coding is accumulated and makes sense to launch together."
 *
 * BOOTSTRAP EXEMPTION: the consensus-queue mechanism's own files (this validator, the queue,
 * the launch-state file, and this session's standard governance-record files already governed
 * by B_IMPLEMENTATION_WIRING_CYCLE) are exempt — they ARE the consensus-recording mechanism,
 * not implementation requiring prior consensus through it.
 *
 * HONEST LIMITATION: cannot verify a SPECIFIC commit's content was discussed first, only that
 * the queue was touched this session. A human (or a future stricter PreToolUse hard-block, not
 * yet built — deliberately, to avoid a bootstrapping self-lock risk) is still the real guard.
 *
 * Output: implementation_commits=N queue_entries_this_session=N blocking=N advisory=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { load } from 'js-yaml';

const ROOT = process.cwd();

const IMPLEMENTATION_PATH_PATTERNS = [
  /^apps\//,
  /^libs\//,
  /^tools\/validators\//,
  /^tools\/scripts\//,
  /^\.claude\/skills\//,
  /^\.claude\/hooks\//,
];

// Bootstrap exemption — the mechanism's own files never require a prior queue entry.
const EXEMPT_FILES = new Set([
  'tools/data/consensus-queue.yaml',
  'tools/data/batch-launch-state.json',
  'tools/validators/validate-consensus-before-code.mjs',
  'tools/data/wiring-sweep-log.yaml',
  'tools/data/hardwire-register.yaml',
  'tools/data/satisfaction-point-registry.yaml',
  'tools/data/park-register.yaml',
  'tools/verify.mjs',
  'docs/plan/pillar-0-governance/audit-runner.md',
]);

let currentSession = null;
try {
  const state = JSON.parse(readFileSync(`${ROOT}/tools/session-state.json`, 'utf-8'));
  currentSession = state.current_session || null;
} catch (e) {
  console.log('implementation_commits=0 queue_entries_this_session=0 blocking=0 advisory=0');
  process.exit(0);
}

if (!currentSession) {
  console.log('implementation_commits=0 queue_entries_this_session=0 blocking=0 advisory=0');
  process.exit(0);
}

let implementationCommits = [];
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
    if (nonExemptImplFiles.length > 0) {
      implementationCommits.push({ sha, files: nonExemptImplFiles });
    }
  }
} catch (e) {
  implementationCommits = [];
}

let queueEntriesThisSession = 0;
const queuePath = `${ROOT}/tools/data/consensus-queue.yaml`;
if (existsSync(queuePath)) {
  try {
    const doc = load(readFileSync(queuePath, 'utf-8'));
    queueEntriesThisSession = (doc.entries || []).filter(
      e => e.proposed_date === currentSession || e.confirmed_date === currentSession || e.batch_id === currentSession
    ).length;
  } catch (e) {
    console.log(`[validate-consensus-before-code] consensus-queue.yaml parse error: ${e.message}`);
  }
}

let blocking = 0;
if (implementationCommits.length > 0 && queueEntriesThisSession === 0) {
  blocking = 1;
  console.log(`  ✗ BLOCKING: session ${currentSession} has ${implementationCommits.length} implementation commit(s) (e.g. ${implementationCommits[0].sha}: ${implementationCommits[0].files[0]}) but 0 consensus-queue.yaml activity this session.`);
  console.log(`    → B_CONSENSUS_BEFORE_CODE: discuss first, record in tools/data/consensus-queue.yaml, get an explicit batch-launch go-ahead, THEN implement.`);
}

console.log(`[validate-consensus-before-code] implementation_commits=${implementationCommits.length} queue_entries_this_session=${queueEntriesThisSession} blocking=${blocking} advisory=0`);
process.exit(blocking > 0 ? 1 : 0);
