#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: GVRN
 * governing_principle: B_IMPLEMENTATION_WIRING_CYCLE
 * behavioral_contract: B_IMPLEMENTATION_WIRING_CYCLE
 * role: BLOCKS if this session recorded an implementation-shaped commit with zero matching entry
 *       in tools/data/wiring-sweep-log.yaml. Presence-of-attempt check ONLY (same shape as
 *       validate-challenge-on-merit.mjs / validate-decision-ledger.mjs) — never judges sweep quality.
 * @csps-enforces B_IMPLEMENTATION_WIRING_CYCLE
 *
 * @csps-id csps.tools.validators.validate-wiring-sweep-coverage
 * @csps-name validate-wiring-sweep-coverage
 * @csps-version 1.0.0 (S089)
 *
 * "New implementation without a wiring-update cycle is a crippled one — wiring related elements
 * is as essential as the implementation itself." (Governor S089)
 *
 * Detection: current_session (tools/session-state.json) + `git log` commits prefixed `[<session>]`
 * touching an implementation-shaped path. If any exist AND tools/data/wiring-sweep-log.yaml has
 * zero entries for that session -> BLOCKING.
 *
 * Output: implementation_commits=N sweep_entries=N blocking=N advisory=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { load } from 'js-yaml';

const ROOT = process.cwd();

const IMPLEMENTATION_PATH_PATTERNS = [
  /^tools\/validators\//,
  /^tools\/scripts\//,
  /^\.claude\/skills\//,
  /^\.claude\/hooks\//,
  /^tools\/data\/.*-register\.yaml$/,
  /^tools\/data\/.*-registry\.yaml$/,
  /^docs\/plan\/pillar-.*\/behavioral-contracts.*/,
  /^docs\/adr\//,
];

let currentSession = null;
try {
  const state = JSON.parse(readFileSync(`${ROOT}/tools/session-state.json`, 'utf-8'));
  currentSession = state.current_session || null;
} catch (e) {
  console.log('[validate-wiring-sweep-coverage] session-state.json unreadable — skipping (advisory)');
  console.log('implementation_commits=0 sweep_entries=0 blocking=0 advisory=0');
  process.exit(0);
}

if (!currentSession) {
  console.log('implementation_commits=0 sweep_entries=0 blocking=0 advisory=0');
  process.exit(0);
}

// Find commits this session (prefix "[S089]") touching implementation-shaped paths.
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
        .trim().split('\n').filter(Boolean);
    } catch (e) { continue; }
    if (files.some(f => IMPLEMENTATION_PATH_PATTERNS.some(p => p.test(f.replace(/\\/g, '/'))))) {
      implementationCommits.push(sha);
    }
  }
} catch (e) {
  // git not available or no matching commits — treat as 0, non-fatal
  implementationCommits = [];
}

let sweepEntries = 0;
const logPath = `${ROOT}/tools/data/wiring-sweep-log.yaml`;
if (existsSync(logPath)) {
  try {
    const doc = load(readFileSync(logPath, 'utf-8'));
    sweepEntries = (doc.entries || []).filter(e => e.session === currentSession).length;
  } catch (e) {
    console.log(`[validate-wiring-sweep-coverage] wiring-sweep-log.yaml parse error: ${e.message}`);
  }
}

let blocking = 0;
if (implementationCommits.length > 0 && sweepEntries === 0) {
  blocking = 1;
  console.log(`  ✗ BLOCKING: session ${currentSession} has ${implementationCommits.length} implementation-shaped commit(s) (e.g. ${implementationCommits[0]}) but 0 wiring-sweep-log entries.`);
  console.log(`    → Add an entry to tools/data/wiring-sweep-log.yaml per B_IMPLEMENTATION_WIRING_CYCLE: angles_swept + elements_updated + elements_deferred.`);
}

console.log(`[validate-wiring-sweep-coverage] implementation_commits=${implementationCommits.length} sweep_entries=${sweepEntries} blocking=${blocking} advisory=0`);
process.exit(blocking > 0 ? 1 : 0);
