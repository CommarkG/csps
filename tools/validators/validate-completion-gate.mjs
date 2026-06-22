#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-completion-gate
 * @csps-name validate-completion-gate
 * @csps-description B_INSIST_ON_COMPLETION (PROTO-S086-COMPLETION): session-close gate.
 *   At session close, every obligation-lane park item that was OPENED this session must
 *   carry a disposition ∈ {answered, decided, parked+owner+trigger} — a disposition_text
 *   or disposition_session field in park-register.yaml, OR a closed_session value.
 *
 *   No open can drift via assume/guess/avoid-confrontation. Every open thread gets a
 *   disposition (answered/decided/parked-with-owner+trigger) before the session seals.
 *   Delay OK; drift not.
 *
 *   Cross-agent: applies to Opus + Sonnet + Haiku.
 *   Entry-point references: opus-context.md / sonnet-context.md / haiku-spawn-template.md
 *     §7 CROSS-AGENT CONTRACTS.
 *
 *   Checks:
 *   (A) obligation-lane park items with created_session == current_session AND
 *       closed_session: null AND no disposition_text AND no disposition_session → BLOCKING
 *   (B) HANDOFF for current session exists with explicit OPEN THREADS section → ADVISORY if missing
 *   (C) Any HANDOFF open thread referencing AQ (alignment question) without disposition → ADVISORY
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_INSIST_ON_COMPLETION PROTO-S086-COMPLETION
 * @csps-prevention-class OPEN-DRIFT SESSION-CLOSE-INCOMPLETENESS
 *
 * Coverage Levels:
 *   BLOCKING (exit 1): obligation-lane park item from current session has no disposition
 *   ADVISORY (exit 0): HANDOFF missing, AQ without disposition, older items without disposition
 *
 * run_tier: EXTENDED
 * load_mode: on-demand + session-close
 * justification: EXTENDED — reads park-register.yaml + HANDOFF at session close
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

let blocking = 0;
let advisory = 0;
const findings = [];

// ── Get current session ────────────────────────────────────────────────────────

let currentSession = 'unknown';
const ssPath = join(ROOT, 'tools/session-state.json');
if (existsSync(ssPath)) {
  try {
    const ss = JSON.parse(readFileSync(ssPath, 'utf-8'));
    currentSession = ss.current_session || 'unknown';
  } catch { /* use unknown */ }
}

// ── Parse park-register.yaml ───────────────────────────────────────────────────

function parseParkRegister(text) {
  const entries = [];
  let current = null;
  for (const line of text.split('\n')) {
    // Entry start
    const idMatch = line.match(/^\s{2}-\s+id:\s+"?(PARK-[^"'\s]+|PHASEB-[^"'\s]+)"?/);
    if (idMatch) {
      if (current) entries.push(current);
      current = { id: idMatch[1] };
      continue;
    }
    if (!current) continue;
    // Key-value pairs (2-space indent for entry fields)
    const kv = line.match(/^\s{4}(\w+):\s*(.+?)\s*$/);
    if (kv) {
      current[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  if (current) entries.push(current);
  return entries;
}

// ── Check A: obligation-lane park items from this session ──────────────────────

const parkPath = join(ROOT, 'tools/data/park-register.yaml');
let thisSessionUndiposed = 0;
let olderUndiposed = 0;

if (existsSync(parkPath)) {
  const parkText = readFileSync(parkPath, 'utf-8');
  const parkEntries = parseParkRegister(parkText);

  for (const e of parkEntries) {
    if (e.lane !== 'obligation') continue;
    // Only care about open items
    const isClosed = e.closed_session && e.closed_session !== 'null';
    if (isClosed) continue;

    const hasDisposition = (e.disposition_text && e.disposition_text !== 'null') ||
                           (e.disposition_session && e.disposition_session !== 'null');

    const createdThisSession = e.created_session === currentSession;

    if (!hasDisposition) {
      if (createdThisSession) {
        findings.push({
          severity: 'BLOCKING',
          id: `park-no-disposition-${e.id}`,
          msg: `${e.id} (created ${e.created_session}, obligation-lane, open) has no disposition_text or disposition_session. Add disposition before session close.`,
        });
        blocking++;
        thisSessionUndiposed++;
      } else {
        // Older obligation items without disposition → advisory
        findings.push({
          severity: 'ADVISORY',
          id: `park-no-disposition-old-${e.id}`,
          msg: `${e.id} (created ${e.created_session || 'unknown'}, obligation-lane, open) has no disposition — older item, advisory.`,
        });
        advisory++;
        olderUndiposed++;
      }
    }
  }
}

// ── Check B: HANDOFF exists for this session ──────────────────────────────────

const handoffDir = join(ROOT, 'docs/plan/_handoff');
let handoffPath = null;
if (existsSync(handoffDir)) {
  const pattern = new RegExp(`^HANDOFF-${currentSession}-to-`, 'i');
  const match = readdirSync(handoffDir).find(f => pattern.test(f));
  if (match) handoffPath = join(handoffDir, match);
}

if (!handoffPath) {
  findings.push({
    severity: 'ADVISORY',
    id: 'handoff-missing',
    msg: `No HANDOFF-${currentSession}-to-*.md found — session close artifact not written yet`,
  });
  advisory++;
}

// ── Check C: HANDOFF open threads have dispositions ───────────────────────────

if (handoffPath) {
  const handoffText = readFileSync(handoffPath, 'utf-8');
  const openThreadsMatch = handoffText.match(/##\s+OPEN THREADS[^]*?(?=##|$)/);
  if (openThreadsMatch) {
    const openSection = openThreadsMatch[0];
    // Count numbered items that lack disposition annotation
    const itemPattern = /^\d+\.\s+\*\*([^*]+)\*\*/gm;
    let m;
    let undisposedAqs = 0;
    while ((m = itemPattern.exec(openSection)) !== null) {
      const itemTitle = m[1];
      // Check if the item has a disposition annotation (look ahead a few lines)
      const itemPos = m.index;
      const itemContext = openSection.substring(itemPos, itemPos + 500);
      const hasDisposition = /disposition:|→ PARK-|GATED|Governor action|owner:/i.test(itemContext);
      if (!hasDisposition && /AQ\d+/i.test(itemTitle)) {
        undisposedAqs++;
        findings.push({
          severity: 'ADVISORY',
          id: `handoff-aq-undisposed-${itemTitle.replace(/\s+/g, '-')}`,
          msg: `HANDOFF open thread "${itemTitle}" has no disposition annotation — add owner+trigger or mark as answered/decided`,
        });
        advisory++;
      }
    }
  }
}

// ── Output ─────────────────────────────────────────────────────────────────────

const status = blocking > 0 ? 'FAIL' : 'PASS';
console.log(`[validate-completion-gate] ${status}`);
console.log(`  session=${currentSession} blocking=${blocking} advisory=${advisory}`);
console.log(`  this_session_undisposed=${thisSessionUndiposed} older_undisposed=${olderUndiposed}`);

const blockingFindings = findings.filter(f => f.severity === 'BLOCKING');
const advisoryFindings = findings.filter(f => f.severity === 'ADVISORY');

if (blockingFindings.length > 0) {
  console.error('\n[validate-completion-gate] BLOCKING — session cannot close with undisposed opens:');
  for (const f of blockingFindings) {
    console.error(`  ✗ ${f.msg}`);
  }
}

if (advisoryFindings.length > 0 && advisoryFindings.length <= 10) {
  console.log('\n[validate-completion-gate] ADVISORY:');
  for (const f of advisoryFindings) {
    console.log(`  ℹ ${f.msg}`);
  }
} else if (advisoryFindings.length > 10) {
  console.log(`\n[validate-completion-gate] ${advisoryFindings.length} ADVISORY findings (older items without disposition)`);
}

if (blocking === 0 && advisory === 0) {
  console.log(`[validate-completion-gate] ✓ All obligation-lane opens for session ${currentSession} have dispositions`);
}

process.exit(blocking > 0 ? 1 : 0);
