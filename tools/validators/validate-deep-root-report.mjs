#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: VALD
 * governing_principle: B_DEEP_ROOT_TRIGGER
 * behavioral_contract: B_DEEP_ROOT_TRIGGER
 * role: BLOCKS if this session has a problem/insight-shaped commit (touches
 *       inner-ai-defaults/**, behavioral-contracts/**, gap-recurrence-register.yaml,
 *       improvement-register.yaml, or default-correction-registry.yaml) while council
 *       comms this session are missing one or more of the 7 REPORT SCHEMA field labels
 *       (TRIGGER / DEFAULT REACTION / SATISFACTION POINT / FALSE ASSUMPTION / DEEP ROOT /
 *       PREVENTION / PRESERVATION). Same presence-of-attempt shape as
 *       validate-consensus-before-code.mjs / validate-spawn-trigger.mjs.
 * @csps-enforces B_DEEP_ROOT_TRIGGER
 *
 * @csps-id csps.tools.validators.validate-deep-root-report
 * @csps-name validate-deep-root-report
 * @csps-version 1.0.0 (S089)
 *
 * HONEST LIMITATION (do not oversell): this is a PRESENCE check only, exactly like its
 * siblings. It confirms the 7 REPORT SCHEMA field LABELS appear somewhere in council comms
 * this session (tools/council/sonnet-turn.md + tools/council/opus-turn.md, current content —
 * these files do not preserve a clean per-session diff boundary, so "this session" means
 * "current committed content of the active council files", the same scoping
 * validate-boundary-prompt-format.mjs already relies on for its TOP-entry check).
 * It CANNOT verify:
 *   - that the 7 fields are answered with genuine depth (a shallow one-word answer per
 *     field passes identically to a genuinely root-caused one)
 *   - that the fields sit together in ONE coherent report block rather than scattered
 *     unrelated uses of the same words elsewhere in the file
 *   - that a named D-default is the CORRECT one, or that a new D-default claim is warranted
 *   - that the routing (PRESERVATION target) was actually written to the registry it claims
 * A human (or a future stricter block scoped to a single delimited report section) remains
 * the real depth guard. Reasoning DEPTH is provoked by the always-loaded hook injection
 * (Deliverable 1), never mechanically gated here.
 *
 * BOOTSTRAP EXEMPTION: this validator's own file, and the standard governance-record files
 * already exempted under HARDWIRE-011 (B_IMPLEMENTATION_WIRING_CYCLE), never require a
 * report themselves — they ARE governance record-keeping, not the triggering artifact.
 *
 * Output: trigger_commits=N schema_fields_present=X/7 blocking=N advisory=N
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();

const TRIGGER_PATH_PATTERNS = [
  /^docs\/plan\/_handoff\/VAULT\/inner-ai-defaults\//,
  /^docs\/plan\/pillar-0-governance\/behavioral-contracts\//,
  /^docs\/plan\/pillar-0-governance\/behavioral-contracts-[A-Z]+\.md$/,
  /^tools\/data\/gap-recurrence-register\.yaml$/,
  /^tools\/data\/improvement-register\.yaml$/,
  /^tools\/data\/default-correction-registry\.yaml$/,
];

// Bootstrap exemption — this validator's own file, and the mechanism files already
// exempted platform-wide under HARDWIRE-011, never require a report of themselves.
const EXEMPT_FILES = new Set([
  'tools/validators/validate-deep-root-report.mjs',
  'tools/verify.mjs',
  'docs/plan/pillar-0-governance/audit-runner.md',
  'tools/data/wiring-sweep-log.yaml',
  'tools/data/hardwire-register.yaml',
  'tools/data/satisfaction-point-registry.yaml',
  'tools/data/park-register.yaml',
  '.claude/hooks/user-prompt-submit-next-step-reminder.sh',
]);

const REQUIRED_FIELDS = [
  'TRIGGER',
  'DEFAULT REACTION',
  'SATISFACTION POINT',
  'FALSE ASSUMPTION',
  'DEEP ROOT',
  'PREVENTION',
  'PRESERVATION',
];

const COUNCIL_FILES = [
  'tools/council/sonnet-turn.md',
  'tools/council/opus-turn.md',
];

function readCouncilText() {
  let text = '';
  for (const f of COUNCIL_FILES) {
    const p = `${ROOT}/${f}`;
    if (existsSync(p)) {
      try {
        text += '\n' + readFileSync(p, 'utf-8');
      } catch (e) { /* skip unreadable */ }
    }
  }
  return text;
}

let currentSession = null;
try {
  const state = JSON.parse(readFileSync(`${ROOT}/tools/session-state.json`, 'utf-8'));
  currentSession = state.current_session || null;
} catch (e) {
  console.log('trigger_commits=0 schema_fields_present=0/7 blocking=0 advisory=0');
  process.exit(0);
}

if (!currentSession) {
  console.log('trigger_commits=0 schema_fields_present=0/7 blocking=0 advisory=0');
  process.exit(0);
}

let triggerCommits = [];
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
    const nonExemptTriggerFiles = files.filter(f =>
      TRIGGER_PATH_PATTERNS.some(p => p.test(f)) && !EXEMPT_FILES.has(f)
    );
    if (nonExemptTriggerFiles.length > 0) {
      triggerCommits.push({ sha, files: nonExemptTriggerFiles });
    }
  }
} catch (e) {
  triggerCommits = [];
}

const councilText = readCouncilText();
const missingFields = REQUIRED_FIELDS.filter(f => !councilText.toUpperCase().includes(f));
const presentCount = REQUIRED_FIELDS.length - missingFields.length;

let blocking = 0;
if (triggerCommits.length > 0 && missingFields.length > 0) {
  blocking = 1;
  console.log(`  ✗ BLOCKING: session ${currentSession} has ${triggerCommits.length} problem/insight-shaped commit(s) (e.g. ${triggerCommits[0].sha}: ${triggerCommits[0].files[0]}) but council comms are missing REPORT SCHEMA field(s): ${missingFields.join(', ')}.`);
  console.log(`    → B_DEEP_ROOT_TRIGGER: state all 7 fields (TRIGGER / DEFAULT REACTION / SATISFACTION POINT / FALSE ASSUMPTION / DEEP ROOT / PREVENTION / PRESERVATION) in tools/council/sonnet-turn.md or opus-turn.md for the problem/insight this session engraved.`);
}

console.log(`[validate-deep-root-report] trigger_commits=${triggerCommits.length} schema_fields_present=${presentCount}/7 blocking=${blocking} advisory=0`);
process.exit(blocking > 0 ? 1 : 0);
