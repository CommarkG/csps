#!/usr/bin/env node
/**
 * validate-decision-ledger.mjs — Decision Ledger Structural Gate
 *
 * B_DECISION_LEDGER (S089 — CONSTITUTIONAL): every consequential decision/plan must carry
 * a Decision Ledger: chosen option + ≥1 rejected option WITH reasoning.
 *
 * BLOCKING:
 *   Any file with a "Decision Ledger" section that has NO rejected options with reasoning.
 *   (Malformed ledger = worse than no ledger — false confidence in recorded decisions.)
 *
 * ADVISORY:
 *   An Opus-authored plan file (OPUS-S*.md in docs/plan/_handoff/) that has no
 *   Decision Ledger section at all. (New requirement — grace for existing plans.)
 *
 * MUST NOT block new research — only checks that prior-art was reviewed FIRST
 * (the ledger records what was considered; it does NOT prohibit fresh research).
 *
 * Block-test: plant a plan with Decision Ledger section + no rejected entries → exits 1.
 *
 * @csps-id csps.validators.validate-decision-ledger
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_DECISION_LEDGER
 * @csps-prevention-class REASONING-AMNESIA STALE-REUSE REDUNDANT-RESEARCH
 *
 * run_tier: STANDARD
 * always_rerun: false
 * @determinism-exempt: Date.now() used only for last-run JSON metadata (ran_at timestamp).
 *   No blocking or advisory decisions are time-dependent. Session numbers come from committed
 *   files only. All blocking logic is purely structural (file content patterns).
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const LAST_RUN = join(ROOT, 'tools/data/validate-decision-ledger-last-run.json');

// Directories containing Opus-authored plan files that require Decision Ledger sections
const PLAN_DIR = join(ROOT, 'docs/plan/_handoff');

let blocking = 0, advisory = 0, passes = 0;
const findings = [];

function PASS(msg)  { passes++;   console.log(`  [PASS] ${msg}`); }
function BLOCK(msg) { blocking++; findings.push(`[BLOCKING] ${msg}`); console.log(`  [BLOCKING] ${msg}`); }
function WARN(msg)  { advisory++; findings.push(`[ADVISORY] ${msg}`); console.log(`  [ADVISORY] ${msg}`); }

// ── Decision Ledger detection ─────────────────────────────────────────────────

/**
 * Returns true if content has a Decision Ledger section heading.
 * Matches: ## Decision Ledger / ## DECISION LEDGER / ### Decision Ledger (and table variants).
 */
function hasDecisionLedgerSection(content) {
  return /^##+ .*decision ledger/im.test(content);
}

/**
 * Returns true if content inside the Decision Ledger section has ≥1 rejected option
 * with actual reasoning text (not just a column header).
 *
 * Structural markers accepted:
 *   - Table row with "REJECTED" in the second column and non-empty fourth cell
 *   - Table row where any cell contains "rejected" (case-insensitive) with adjacent text
 *   - A markdown list item or table cell with "Rejected:" prefix and following text
 */
function hasRejectedOptionWithReasoning(content) {
  // Isolate the Decision Ledger section body
  const sectionMatch = content.match(/^##+ .*decision ledger.*$/im);
  if (!sectionMatch) return false;
  const sectionStart = content.indexOf(sectionMatch[0]);
  // Find next same-level heading (## or ###)
  const afterSection = content.slice(sectionStart + sectionMatch[0].length);
  const nextHeadingMatch = afterSection.match(/^##+ /m);
  const sectionBody = nextHeadingMatch
    ? afterSection.slice(0, afterSection.indexOf(nextHeadingMatch[0]))
    : afterSection;

  // Table row check: must have "REJECTED" or "Rejected" as non-header content
  // AND the row must have non-empty content beyond just the word "rejected"
  const tableRowPattern = /^\|[^|]*\|[^|]*\*{0,2}REJECTED\*{0,2}[^|]*\|[^|]+\|[^|]+\|/im;
  if (tableRowPattern.test(sectionBody)) return true;

  // Alternative: any cell contains "rejected" keyword AND the cell has substantive text (>10 chars total)
  const rows = sectionBody.split('\n').filter(l => l.includes('|'));
  for (const row of rows) {
    if (/rejected/i.test(row) && !/^[\s|:-]+$/.test(row) && row.replace(/\|/g, '').trim().length > 20) {
      // Not a header row (header separators are |---|) and has real content
      if (!/^[\s|:_-]+$/.test(row.replace(/[|]/g, '').trim())) {
        return true;
      }
    }
  }

  // List item check: "- **Rejected**:" or "Rejected option:" with following text
  if (/[-*]\s+\*{0,2}[Rr]ejected\*{0,2}.*:.{10,}/m.test(sectionBody)) return true;

  return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('[validate-decision-ledger] Decision Ledger structural gate');
console.log('');

if (!existsSync(PLAN_DIR)) {
  WARN(`Plan directory not found: ${PLAN_DIR}`);
  process.exit(0);
}

// Scan Opus-authored plan files in docs/plan/_handoff/
const planFiles = readdirSync(PLAN_DIR)
  .filter(f => f.match(/^OPUS-S\d+.*\.md$/) || f.match(/^HANDOFF-S\d+.*\.md$/))
  .map(f => join(PLAN_DIR, f));

if (planFiles.length === 0) {
  WARN('No plan files found in docs/plan/_handoff/ — nothing to check');
} else {
  for (const filePath of planFiles) {
    let content;
    try {
      content = readFileSync(filePath, 'utf8');
    } catch (e) {
      WARN(`Could not read ${basename(filePath)}: ${e.message}`);
      continue;
    }

    const hasSection = hasDecisionLedgerSection(content);

    if (!hasSection) {
      // New requirement — advisory only for plans that predate B_DECISION_LEDGER
      WARN(`${basename(filePath)}: no Decision Ledger section (B_DECISION_LEDGER requires chosen+rejected-with-reasoning in all consequential plans)`);
      continue;
    }

    const hasRejected = hasRejectedOptionWithReasoning(content);

    if (!hasRejected) {
      // Decision Ledger exists but is malformed — BLOCKING
      BLOCK(`${basename(filePath)}: Decision Ledger section exists but has NO rejected option with reasoning — empty ledger creates false confidence. Add ≥1 rejected option entry.`);
    } else {
      PASS(`${basename(filePath)}: Decision Ledger present with rejected-option(s) and reasoning`);
    }
  }
}

// ── RESULT ─────────────────────────────────────────────────────────────────────
console.log('');
console.log(`[validate-decision-ledger] blocking=${blocking} advisory=${advisory} passes=${passes}`);

try {
  mkdirSync(join(ROOT, 'tools/data'), { recursive: true });
  writeFileSync(LAST_RUN, JSON.stringify({
    ran_at: new Date().toISOString(),
    blocking, advisory, passes, findings,
    plan_files_checked: planFiles.length,
  }, null, 2));
} catch { /* non-fatal */ }

process.exit(blocking > 0 ? 1 : 0);
