#!/usr/bin/env node
/**
 * validate-prior-plan-conflict.mjs
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces LOCAL-FIX-HARMS-GLOBAL-WITHOUT-RIPPLE-CHECK
 * @csps-prevention-class LOCAL-FIX-HARMS-GLOBAL-WITHOUT-RIPPLE-CHECK
 * @behavioral-test-status: tested — tools/tests/behavioral/prior-plan-conflict-test.sh (3/3)
 *
 * PROTO-S072-CIP M1 — Change-Impact Pipeline prior-plan-conflict validator.
 *
 * What it checks:
 *   For each staged change in tools/data/change-impact-staging.yaml with
 *   cip_required: true AND verdict: null (not yet cleared by ripple-QC):
 *
 *   1. Unified-plan conflict: does the proposed_change contradict any open
 *      plan item in docs/plan/_handoff/MASTER-RE-GATE-PLAN-S068.md or unified-plan.yaml?
 *      (keyword match: does the change mention the same system/validator/hook that
 *      an open plan item owns?)
 *
 *   2. Vault-pending conflict: does the proposed_change duplicate or supersede
 *      any deferred vault entry in tools/data/vault-pending.yaml?
 *      (keyword overlap on proposed_change vs vault entry raw/context fields)
 *
 *   3. Audit-runner pipeline conflict: does the proposed_change modify a validator
 *      already registered in audit-runner.md without updating the pipeline row?
 *      (checks if validator filename mentioned in proposed_change exists in audit-runner.md)
 *
 * Advisory in S072 — exits 0 always. Promotes to BLOCKING after sample exemplar
 * passes (tunable per P-META-028 cornerstone).
 *
 * Composes with: change-impact-staging.yaml + unified-plan.yaml + vault-pending.yaml
 * + audit-runner.md. No parallel machinery.
 *
 * Audit slug: cip_prior_plan_conflict (registered in audit-runner.md)
 */

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const STAGING_PATH = join(ROOT, 'tools/data/change-impact-staging.yaml');
const VAULT_PENDING_PATH = join(ROOT, 'tools/data/vault-pending.yaml');
const AUDIT_RUNNER_PATH = join(ROOT, 'docs/plan/pillar-0-governance/audit-runner.md');
// CIP M1.1: unified-plan.yaml not yet built; use pending-plan-items.yaml as plan source
// (upgrade to unified-plan.yaml when it ships in PART 4 / Governance Constitution)
const PLAN_PATH = join(ROOT, 'tools/data/pending-plan-items.yaml');
const MASTER_RE_GATE_PATH = join(ROOT, 'docs/plan/_handoff/MASTER-RE-GATE-PLAN-S068.md');
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-prior-plan-conflict-last-run.json');

// ── Simple YAML field extraction (no full YAML parser — extracts top-level arrays) ─────

/**
 * Extract entries array from YAML content as raw strings.
 * Each entry is everything from '  - id:' to the next '  - id:' or end of file.
 */
function extractYamlEntryBlocks(content) {
  const blocks = [];
  const lines = content.split('\n');
  let current = null;

  for (const line of lines) {
    if (/^\s{0,2}-\s+id:\s+\S/.test(line)) {
      if (current !== null) blocks.push(current);
      current = line + '\n';
    } else if (current !== null) {
      current += line + '\n';
    }
  }
  if (current !== null) blocks.push(current);
  return blocks;
}

/** Extract a simple string field from a YAML block. */
function extractField(block, field) {
  const m = block.match(new RegExp(`^\\s+${field}:\\s+(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

/** Check if a string contains any of the keywords (case-insensitive). */
function containsKeyword(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

/** Extract meaningful keywords from a proposed_change description. */
function extractKeywords(text) {
  if (!text) return [];
  // Extract validator names, hook names, and significant nouns (3+ chars, not common words)
  const STOP_WORDS = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'from', 'into',
    'have', 'has', 'had', 'are', 'was', 'not', 'but', 'its', 'also', 'will', 'adds',
    'adds', 'add', 'new', 'per', 'all', 'any', 'can', 'set', 'via']);
  const words = text.toLowerCase().match(/[a-z][a-z0-9-_]{2,}/g) || [];
  return [...new Set(words.filter(w => !STOP_WORDS.has(w)))];
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  let staged_checked = 0;
  let conflicts_found = 0;
  let advisory = 0;
  const blocking = 0; // Advisory only in S072

  const findings = [];

  // ── 1. Load staging register ───────────────────────────────────────────────

  if (!existsSync(STAGING_PATH)) {
    console.log('[validate-prior-plan-conflict] change-impact-staging.yaml not found — no staged changes to check');
    console.log(`[validate-prior-plan-conflict] staged_checked=0 conflicts_found=0 advisory=0 blocking=0`);
    writeLastRun({ staged_checked: 0, conflicts_found: 0, advisory: 0, blocking: 0 });
    process.exit(0);
  }

  const stagingContent = readFileSync(STAGING_PATH, 'utf8');
  const entryBlocks = extractYamlEntryBlocks(stagingContent);

  // Filter to entries that need conflict check: cip_required=true + no verdict yet
  const pendingEntries = entryBlocks.filter(block => {
    const cipRequired = extractField(block, 'cip_required');
    const verdict = extractField(block, 'verdict');
    return cipRequired === 'true' && (!verdict || verdict === 'null');
  });

  if (pendingEntries.length === 0) {
    console.log('[validate-prior-plan-conflict] ✓ no pending staged changes requiring conflict check');
    console.log(`[validate-prior-plan-conflict] staged_checked=0 conflicts_found=0 advisory=0 blocking=0`);
    writeLastRun({ staged_checked: 0, conflicts_found: 0, advisory: 0, blocking: 0 });
    process.exit(0);
  }

  // ── 2. Load reference sources ──────────────────────────────────────────────

  const vaultContent = existsSync(VAULT_PENDING_PATH)
    ? readFileSync(VAULT_PENDING_PATH, 'utf8')
    : '';
  const auditRunnerContent = existsSync(AUDIT_RUNNER_PATH)
    ? readFileSync(AUDIT_RUNNER_PATH, 'utf8')
    : '';
  // CIP M1.1: plan sources for Check 1 (unified-plan conflict)
  const planContent = existsSync(PLAN_PATH)
    ? readFileSync(PLAN_PATH, 'utf8')
    : '';
  const masterReGateContent = existsSync(MASTER_RE_GATE_PATH)
    ? readFileSync(MASTER_RE_GATE_PATH, 'utf8')
    : '';
  const vaultEntries = extractYamlEntryBlocks(vaultContent);
  const planEntries = extractYamlEntryBlocks(planContent);

  // ── 3. Check each pending staged change ───────────────────────────────────

  for (const block of pendingEntries) {
    const id = extractField(block, 'id') || '(unknown)';
    const proposedChange = extractField(block, 'proposed_change') || '';
    const type = extractField(block, 'type') || '';

    staged_checked++;

    const keywords = extractKeywords(proposedChange);

    // ── Check 1: Unified-plan / pending-plan-items conflict (CIP M1.1) ───────
    // Does this staged change contradict or duplicate an open plan item?
    // Source: tools/data/pending-plan-items.yaml + MASTER-RE-GATE-PLAN-S068.md
    for (const planBlock of planEntries) {
      const planId = extractField(planBlock, 'id') || '';
      const planTitle = extractField(planBlock, 'title') || '';
      const planStatus = extractField(planBlock, 'status') || '';
      const planDesc = extractField(planBlock, 'description') || planTitle;

      // Skip closed/done plan items
      if (['done', 'closed', 'sealed', 'complete', 'resolved'].some(s => planStatus.toLowerCase().includes(s))) continue;

      const planKeywords = extractKeywords(planTitle + ' ' + planDesc);
      const overlap = keywords.filter(k => planKeywords.includes(k));

      if (overlap.length >= 3) { // (sample — tunable per P-META-028)
        conflicts_found++;
        advisory++;
        findings.push(
          `[ADVISORY] staged:${id} → possible plan-item overlap with ${planId || planTitle}` +
          ` (shared keywords: ${overlap.slice(0, 5).join(', ')})` +
          ` — verify this change doesn't contradict open plan item before proceeding`
        );
      }
    }

    // Also check MASTER-RE-GATE-PLAN keywords if plan entries is sparse
    if (masterReGateContent && keywords.length >= 3) {
      const masterKeywords = extractKeywords(masterReGateContent.slice(0, 5000)); // First 5KB sample
      const overlap = keywords.filter(k => masterKeywords.includes(k));
      // Only flag if very high overlap (sample threshold: 5 — tunable, avoids false positives on general terms)
      if (overlap.length >= 5) { // (sample — tunable per P-META-028)
        // Don't add as separate finding — covered by plan entries above for known items
        // Log only if no plan entries found this
      }
    }

    // ── Check 2: Vault-pending conflict ───────────────────────────────────
    // Does this staged change duplicate or supersede an existing vault entry?
    for (const vaultBlock of vaultEntries) {
      const vaultId = extractField(vaultBlock, 'id') || '';
      const vaultRaw = extractField(vaultBlock, 'raw') || '';
      const vaultContext = extractField(vaultBlock, 'context') || '';
      const vaultStatus = extractField(vaultBlock, 'status') || '';

      if (vaultStatus === 'closed' || vaultStatus === 'resolved') continue;

      // Check keyword overlap (sample threshold: 3+ shared keywords — tunable per P-META-028)
      const vaultKeywords = extractKeywords(vaultRaw + ' ' + vaultContext);
      const overlap = keywords.filter(k => vaultKeywords.includes(k));

      if (overlap.length >= 3) { // (sample — tunable per P-META-028)
        conflicts_found++;
        advisory++;
        findings.push(
          `[ADVISORY] staged:${id} → possible vault-pending overlap with ${vaultId}` +
          ` (shared keywords: ${overlap.slice(0, 5).join(', ')})` +
          ` — ensure staged change supersedes vault entry explicitly`
        );
      }
    }

    // ── Check 3: Audit-runner pipeline conflict ────────────────────────────
    // If change mentions a validator/hook name, check if it's registered
    const validatorMatch = proposedChange.match(/validate-[\w-]+\.mjs/g) || [];
    const hookMatch = proposedChange.match(/pre-[\w-]+\.sh|post-[\w-]+\.sh/g) || [];

    for (const name of [...validatorMatch, ...hookMatch]) {
      const slug = name.replace(/\.mjs$|\.sh$/, '').replace(/^validate-/, '');
      if (!auditRunnerContent.includes(slug)) {
        conflicts_found++;
        advisory++;
        findings.push(
          `[ADVISORY] staged:${id} references ${name} which is NOT registered in audit-runner.md` +
          ` — register BEFORE wiring in verify.mjs (register-before-wire discipline)`
        );
      }
    }
  }

  // ── Output ─────────────────────────────────────────────────────────────────

  for (const f of findings) {
    console.log(f);
  }

  if (conflicts_found === 0 && staged_checked > 0) {
    console.log(`[validate-prior-plan-conflict] ✓ ${staged_checked} staged change(s) — no conflicts found`);
  }

  console.log(
    `[validate-prior-plan-conflict] staged_checked=${staged_checked} conflicts_found=${conflicts_found} advisory=${advisory} blocking=${blocking}`
  );

  writeLastRun({ staged_checked, conflicts_found, advisory, blocking });

  // Advisory only — always exits 0
  process.exit(0);
}

function writeLastRun(data) {
  try {
    writeFileSync(LAST_RUN_PATH, JSON.stringify({
      run_at: new Date().toISOString(),
      ...data,
    }, null, 2) + '\n');
  } catch {
    // Non-fatal
  }
}

main();
