#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.cross-tab-diff-review
 * @csps-name cross-tab-diff-review
 * @csps-description M-43 Cross-Tab Diff-Review — reads last-review-markers.json,
 *   runs git log <last-reviewed>..HEAD for the calling role, prints changed files
 *   and summaries, then advances the marker. Converts "I hope you read my commits"
 *   into mechanical mutual-awareness. Closes the honest 6/10 gap in cross-tab handoffs.
 *
 *   USAGE:
 *     node tools/scripts/cross-tab-diff-review.mjs --role sonnet   # Sonnet reviews Opus commits
 *     node tools/scripts/cross-tab-diff-review.mjs --role opus     # Opus reviews Sonnet commits
 *     node tools/scripts/cross-tab-diff-review.mjs --role sonnet --advance   # review + advance marker
 *     node tools/scripts/cross-tab-diff-review.mjs --role sonnet --dry-run  # show only, no advance
 *
 *   DISCIPLINE (CSPS-PLANNING-DISCIPLINE §8):
 *     Both Opus and Sonnet run this on receiving any cross-tab handoff.
 *     The caller's role sees what the OTHER role committed since the last review.
 *     session-open.sh injection reminds both to run it every tab start.
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces M-43 CSPS-PLANNING-DISCIPLINE §8 B_META_QUESTION_DISCIPLINE
 * @csps-inherits-from M-43 moat-entry (cd22b9d3) + CSPS-PLANNING-DISCIPLINE §8
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const MARKERS_FILE = resolve(ROOT, 'tools/data/last-review-markers.json');

// ── Argument parsing ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const roleArg = args.find(a => a.startsWith('--role='))?.split('=')[1] ||
                args[args.indexOf('--role') + 1];
const advance = args.includes('--advance') || (!args.includes('--dry-run') && !args.includes('--no-advance'));
const dryRun = args.includes('--dry-run');

if (!roleArg || !['opus', 'sonnet'].includes(roleArg)) {
  console.error('[cross-tab-diff-review] Usage: node cross-tab-diff-review.mjs --role <opus|sonnet> [--advance|--dry-run]');
  console.error('[cross-tab-diff-review] --role opus    = Opus reviews what Sonnet committed since Opus last looked');
  console.error('[cross-tab-diff-review] --role sonnet  = Sonnet reviews what Opus committed since Sonnet last looked');
  process.exit(1);
}

// ── Load markers ───────────────────────────────────────────────────────────────

let markers = { opus: null, sonnet: null };
if (existsSync(MARKERS_FILE)) {
  try { markers = JSON.parse(readFileSync(MARKERS_FILE, 'utf8')); }
  catch { console.error('[cross-tab-diff-review] Warning: markers file malformed, using null markers'); }
}

const myMarker = markers[roleArg];
const currentHead = execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();

console.log(`[cross-tab-diff-review] Role: ${roleArg.toUpperCase()}`);
console.log(`[cross-tab-diff-review] Reviewing commits since: ${myMarker?.slice(0, 8) || '(none — full history)'}`);
console.log(`[cross-tab-diff-review] Current HEAD: ${currentHead.slice(0, 8)}`);
console.log('');

// ── Check if up to date ────────────────────────────────────────────────────────

if (myMarker && myMarker === currentHead) {
  console.log(`[cross-tab-diff-review] ✓ Already up to date — no new commits since last review.`);
  process.exit(0);
}

// ── Get new commits ────────────────────────────────────────────────────────────

const range = myMarker ? `${myMarker}..HEAD` : 'HEAD';
let commitLog;
try {
  commitLog = execSync(`git log --oneline ${range}`, { cwd: ROOT }).toString().trim();
} catch (e) {
  console.error(`[cross-tab-diff-review] Error running git log: ${e.message}`);
  process.exit(1);
}

if (!commitLog) {
  console.log(`[cross-tab-diff-review] ✓ No new commits in range ${range}.`);
  if (advance && !dryRun) {
    markers[roleArg] = currentHead;
    writeFileSync(MARKERS_FILE, JSON.stringify(markers, null, 2));
    console.log(`[cross-tab-diff-review] Marker advanced to ${currentHead.slice(0, 8)}`);
  }
  process.exit(0);
}

const commits = commitLog.split('\n');
console.log(`[cross-tab-diff-review] NEW COMMITS (${commits.length}) since ${roleArg.toUpperCase()} last reviewed:`);
console.log('─'.repeat(70));
console.log(commitLog);
console.log('─'.repeat(70));
console.log('');

// ── Changed files summary ──────────────────────────────────────────────────────

let filesChanged;
try {
  filesChanged = execSync(
    `git diff --stat ${range} --no-color`,
    { cwd: ROOT }
  ).toString().trim();
} catch (e) {
  filesChanged = '(unable to compute diff stat)';
}

if (filesChanged) {
  console.log('[cross-tab-diff-review] FILES CHANGED:');
  console.log(filesChanged);
  console.log('');
}

// ── Key files highlight (governance-critical) ──────────────────────────────────

const KEY_PATTERNS = [
  'pillar-0-governance/',
  'PROTO-',
  'moat-registry',
  'session-open.sh',
  'improvement-register',
  'principles/',
  'behavioral-contracts/B_',
  'PLANNING-DISCIPLINE',
  'MASTER-RE-GATE',
  'NODEFILE',
  'SPINE-PILLAR',
  'CORE-MAXIMAL',
];

let changedFiles;
try {
  changedFiles = execSync(
    `git diff --name-only ${range}`,
    { cwd: ROOT }
  ).toString().trim().split('\n').filter(Boolean);
} catch (e) {
  changedFiles = [];
}

const keyFiles = changedFiles.filter(f => KEY_PATTERNS.some(p => f.includes(p)));
if (keyFiles.length > 0) {
  console.log('[cross-tab-diff-review] ⚠ KEY GOVERNANCE FILES CHANGED — read these before acting:');
  for (const f of keyFiles) console.log(`  • ${f}`);
  console.log('');
}

// ── Advance marker ─────────────────────────────────────────────────────────────

if (!dryRun && advance) {
  markers[roleArg] = currentHead;
  markers.updated_at = new Date().toISOString().slice(0, 10);
  writeFileSync(MARKERS_FILE, JSON.stringify(markers, null, 2));
  console.log(`[cross-tab-diff-review] ✓ Marker for ${roleArg.toUpperCase()} advanced to ${currentHead.slice(0, 8)}`);
} else if (dryRun) {
  console.log(`[cross-tab-diff-review] Dry-run: marker NOT advanced (would set ${roleArg}=${currentHead.slice(0, 8)})`);
} else {
  console.log(`[cross-tab-diff-review] Note: use --advance to advance the marker (default: advances)`);
}

console.log('');
console.log(`[cross-tab-diff-review] commits_reviewed=${commits.length} files_changed=${changedFiles.length} key_files=${keyFiles.length}`);
