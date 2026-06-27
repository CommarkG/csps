#!/usr/bin/env node
/**
 * generate-oneclick.mjs — Auto-generate the CSPS session resume oneclick
 *
 * WHAT IT SOLVES:
 *   The oneclick was hand-written in chat → compacted away → had to be reconstructed each
 *   time. This is a G5 permanence failure: chat-only = ephemeral. Fix: generate from
 *   machine-readable state → write to .csps/oneclick.md (committed, permanent) →
 *   inject at every session-open automatically. Never stale, never lost.
 *
 * CALLED BY:
 *   1. tools/verify.mjs — after every exit_code=0 verify pass (auto-regenerate)
 *   2. Standalone: node tools/generate-oneclick.mjs
 *   3. session-open.sh — READS the output file (does not call this script directly)
 *
 * OUTPUT: .csps/oneclick.md
 *   → Committed to repo → survives compaction, tab changes, context resets
 *   → Displayed at every session-open (injected into startup context)
 *   → Governor pastes verbatim into a new tab for instant resume
 *
 * INHERITANCE: session-open.sh reads this file → inherited to ALL future tabs
 *
 * @csps-id csps.tools.generate-oneclick
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces B_SESSION_CONTINUITY B_ONECLICK_FRESHNESS
 * @csps-prevention-class G5-PERMANENCE-FAILURE CONTEXT-LOSS COMPACTION-BLINDSPOT
 *
 * @determinism-exempt: Date.now() used only for generated_at timestamp in output file.
 *   All blocking/advisory decisions are purely structural (file existence checks).
 *   The oneclick content is derived from committed git state only.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUTPUT = join(ROOT, '.csps/oneclick.md');

// ── Read git state ────────────────────────────────────────────────────────────

function git(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const HEAD_FULL = git('git rev-parse HEAD');
const HEAD = HEAD_FULL.slice(0, 12);
const LAST_COMMIT = git('git log -1 --format=%s');
const BRANCH = git('git rev-parse --abbrev-ref HEAD');
const SESSION_TAG = (() => {
  // Extract S0NN from last commit message or branch name
  const m = LAST_COMMIT.match(/\[(S\d+)\]/) || LAST_COMMIT.match(/(S\d{3})/);
  return m ? m[1] : git('git log -5 --format=%s').match(/S\d{3}/)?.[0] ?? 'S???';
})();

// ── Read verify state ─────────────────────────────────────────────────────────

let verifyState = { exit_code: '?', blocking: '?', ts: null, validators_run: '?' };
const receiptPath = join(ROOT, 'tools/data/green-receipt.json');
if (existsSync(receiptPath)) {
  try {
    const r = JSON.parse(readFileSync(receiptPath, 'utf8'));
    verifyState = {
      exit_code: r.exit_code ?? '?',
      // green-receipt has no blocking_count — it stores blocking_set_hash (not a count).
      // Use 'stable' when exit_code=0 (meaning 0 blocking found), '?' otherwise.
      blocking: r.exit_code === 0 ? '0' : '?',
      ts: r.ts ?? r.generated_at ?? null,
      validators_run: r.validators_run ?? '?',
    };
  } catch { /* non-fatal */ }
}

// ── Read floater queue (pending items) ────────────────────────────────────────

let floaterLines = [];
const floaterPath = join(ROOT, '.csps/floater-decision-queue.txt');
if (existsSync(floaterPath)) {
  try {
    const content = readFileSync(floaterPath, 'utf8');
    const overdueLine = content.includes('Overdue: 0') ? 'floaters: all terminal ✓' : null;
    // Extract overdue items if any
    const overdueSection = content.match(/## OVERDUE ITEMS[^\n]*\n([\s\S]*?)(?:##|$)/)?.[1] ?? '';
    const overdueItems = overdueSection.split('\n')
      .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'))
      .map(l => l.trim())
      .slice(0, 3);
    floaterLines = overdueLine ? [overdueLine] : overdueItems.length ? overdueItems : ['floaters: all terminal ✓'];
  } catch {
    floaterLines = ['floater-decision-queue.txt unreadable'];
  }
}

// ── Read open park count ──────────────────────────────────────────────────────

let openParkCount = '?';
const parkPath = join(ROOT, 'tools/data/park-register.yaml');
if (existsSync(parkPath)) {
  try {
    const content = readFileSync(parkPath, 'utf8');
    const matches = content.match(/closed_session: null/g);
    openParkCount = matches ? matches.length : '?';
  } catch { /* non-fatal */ }
}

// ── Read last session state (session number + pending Opus seal) ──────────────

let opusSealNote = '';
const sealPath = join(ROOT, 'tools/data/two-party-seal-last-run.json');
if (existsSync(sealPath)) {
  try {
    const s = JSON.parse(readFileSync(sealPath, 'utf8'));
    if (s.seal_status === 'pending-opus-counter-sign') {
      opusSealNote = `\nOPUS SEAL PENDING: ${s.seal_id ?? 'SROF'} — Opus must counter-sign before S-next build`;
    }
  } catch { /* non-fatal */ }
}

// ── Build oneclick content ────────────────────────────────────────────────────

const generatedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
const verifyLine = `exit_code=${verifyState.exit_code} | blocking=${verifyState.blocking} | validators=${verifyState.validators_run}`;

// The PASTE-READY block — what goes into a new tab
const pasteBlock = `${SESSION_TAG} continuation (post-compact resume). Context:

HEAD = ${HEAD} (${LAST_COMMIT})
branch: ${BRANCH}
verify: ${verifyLine} — stable

OPEN PARKS: ~${openParkCount} items in park-register.yaml (see tools/data/park-register.yaml)
${floaterLines.map(l => `  ${l}`).join('\n')}
${opusSealNote}
STANDING PRINCIPLES: threshold-first · B_CHALLENGE_ON_MERIT · B_DECISION_LEDGER
  IZFC · two-party-seal · PCR-on-merit · session-open inherits these

ROLES: Sonnet = builder. Opus = director. Haiku = sub-agent scout (never a UI tab).
  Sonnet → Opus council comms start: "Opus, this is Sonnet."
  Opus → Sonnet council comms start: "Sonnet, this is Opus."
  Model default: claude-sonnet-4-6[1m] (set in .claude/settings.json — no /model needed per tab).

STARTUP AUDIT (permanent — Governor S089 directive — check before first build each session):
  ONE-SOURCE MANDATE: NO protocol, rule, or config duplicated across multiple files.
  CHECK: model/tab config → SSoT = .claude/settings.json ONLY (never re-declared in oneclick/HANDOFF/chat)
  CHECK: live relay+assignment → SSoT = tools/council/opus-turn.md ONLY (never restated in startup)
  CHECK: operating doctrine → SSoT = OPUS-S089-NORTH-STAR-SPINE.md ONLY (never copied inline)
  CHECK: B_* contracts → SSoT = docs/behavioral-contracts/ ONLY (not inline in HANDOFF or memory)
  CHECK: AI defaults/overrides → SSoT = .claude/session-startup-architecture.md (not in multiple injections)
  CONSOLIDATION SCAN: flag ANY element defined in >1 location before starting build work:
    → parallel protocol files (same workflow in 2+ docs) → merge to canonical
    → parallel instruction sets (same rule in AGENTS.md + memory file + hook) → keep T1+T2 only
    → scattered B_* declarations (informal rule + formal contract existing together) → delete informal
    → parallel tab/model instructions (settings + oneclick + HANDOFF all saying same thing) → collapse
  IF SCATTERED FOUND: propose consolidation via sonnet-turn.md with PCR (chosen/rejected/reasoning).
    Opus grants before SSoT change. B_CONSOLIDATION_PASS: never build ON TOP of a scattered element.
    Never delete the wrong copy — identify canonical, then delete duplicates.
Await Governor relay of next directive. Stand by.`;

// Full file content
const content = `<!-- AUTO-GENERATED by tools/generate-oneclick.mjs — do NOT edit manually -->
<!-- Regenerated after every clean verify pass. Last: ${generatedAt} -->
<!-- Source: git HEAD=${HEAD} | verify: ${verifyLine} -->

# CSPS Session Resume — OneClick

**Paste the block below verbatim into a new tab after compaction.**
This file is auto-generated from committed state — always current, never lost.

---

\`\`\`
${pasteBlock}
\`\`\`

---

<!-- Meta (for reference only — not for pasting) -->
- Generated: ${generatedAt}
- HEAD: ${HEAD_FULL}
- Session: ${SESSION_TAG}
- Verify: ${verifyLine}
- Open parks: ~${openParkCount}
- Source: tools/generate-oneclick.mjs
`;

// ── --emit-startup mode: print paste-ready block to stderr (for session-open.sh) ───

const EMIT_STARTUP = process.argv.includes('--emit-startup');

if (EMIT_STARTUP) {
  // Called by session-open.sh to display the current oneclick content.
  // If oneclick.md exists, read and emit the paste block. Otherwise generate + emit.
  const existing = existsSync(OUTPUT) ? (() => { try { return readFileSync(OUTPUT, 'utf8'); } catch { return null; } })() : null;
  if (existing) {
    const m = existing.match(/```\n([\s\S]*?)\n```/);
    if (m) {
      process.stderr.write(m[1] + '\n');
      process.exit(0);
    }
  }
  // Fallback: emit the freshly-generated block directly
  process.stderr.write(pasteBlock + '\n');
  process.exit(0);
}

// ── Write ─────────────────────────────────────────────────────────────────────

try {
  mkdirSync(join(ROOT, '.csps'), { recursive: true });
  writeFileSync(OUTPUT, content, 'utf8');
  process.stdout.write(`[generate-oneclick] written: .csps/oneclick.md (HEAD=${HEAD} session=${SESSION_TAG})\n`);
} catch (err) {
  process.stderr.write(`[generate-oneclick] ERROR writing .csps/oneclick.md: ${err.message}\n`);
  process.exit(1);
}
