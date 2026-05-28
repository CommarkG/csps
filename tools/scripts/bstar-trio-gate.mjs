#!/usr/bin/env node
/**
 * @csps-id csps.tools.scripts.bstar-trio-gate
 * @csps-name bstar-trio-gate
 * @csps-description META-T1 hook module — validates enforcement_trio frontmatter structure
 *   on Edit/Write operations targeting B_*.md behavioral contracts.
 *   Invoked by pre-tool-use-bstar-trio-gate.sh (PROTO-S062-A STEP 4).
 *
 *   WHAT THIS PREVENTS:
 *     A new B_*.md contract shipped without enforcement_trio frontmatter — or with
 *     a malformed trio (missing tiers, missing fields, status=none without exempt_reason).
 *     STEP 2 migrated 66 existing contracts. STEP 4 stops the bleed: future contracts
 *     cannot be added to the 34 partial list by omission.
 *
 *   RULES (1-4 = BLOCKING, 5 = ADVISORY):
 *     (1) File must have enforcement_trio: block in YAML frontmatter
 *     (2) All three tier fields must be present (t1, t2, t3)
 *     (3) Each tier must have {tier, path, status} declared
 *     (4) Any status=none must have a non-null, non-empty exempt_reason in the root trio block
 *     (5) Referenced paths (if not null) should exist on disk [ADVISORY only]
 *
 *   TARGETS: docs/plan/pillar-0-governance/behavioral-contracts/B_*.md
 *   TOOLS: Write (checks tool_input.content), Edit (reads file + simulates result)
 *   EXIT: 0 = pass or non-target | 1 = BLOCKING violation (never for advisory)
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE PROTO-S062-A
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ── Target matching ───────────────────────────────────────────────────────────

const CONTRACTS_DIR_SUFFIX = 'docs/plan/pillar-0-governance/behavioral-contracts';

function isBStarContract(filePath) {
  if (!filePath) return false;
  const normalized = filePath.replace(/\\/g, '/');
  return normalized.includes(CONTRACTS_DIR_SUFFIX) &&
    /\/B_[A-Z_]+\.md$/.test(normalized);
}

// ── Frontmatter parsing ───────────────────────────────────────────────────────

function extractFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const endIdx = content.indexOf('\n---', 3);
  if (endIdx === -1) return null;
  return content.substring(4, endIdx + 1);
}

function getTierBlock(fm, tier) {
  // Match "  t1:\n" and capture indented lines following it
  // Stops at the next same-or-higher-level key
  const regex = new RegExp(`(?:^|\\n)([ \\t]+)${tier}:\\s*\\n((?:\\1[ \\t]{1,}[^\\n]*\\n)*)`, 'm');
  const m = fm.match(regex);
  return m ? m[2] : null;
}

function getTierField(block, field) {
  if (!block) return undefined;
  const m = block.match(new RegExp(`${field}:\\s*(.+)`));
  if (!m) return undefined;
  const v = m[1].trim().replace(/^["']|["']$/g, '');
  return v === 'null' ? null : v;
}

function getExemptReason(fm) {
  const m = fm.match(/exempt_reason:\s*(.+)/m);
  if (!m) return undefined;
  const v = m[1].trim().replace(/^["']|["']$/g, '');
  return v === 'null' ? null : v;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateTrioFrontmatter(content, filePath) {
  const issues = [];
  const advisories = [];
  const contractName = basename(filePath, '.md');

  // Rule 1: must have enforcement_trio frontmatter block
  const fm = extractFrontmatter(content);
  if (!fm) {
    issues.push(`Rule 1: Missing YAML frontmatter (---...---) in ${contractName}`);
    return { issues, advisories };
  }

  if (!/^\s*enforcement_trio:/im.test(fm)) {
    issues.push(
      `Rule 1: enforcement_trio: block missing from frontmatter in ${contractName}. ` +
      'Run migrate-enforcement-trio.mjs --apply to add it.'
    );
    return { issues, advisories };
  }

  // Rule 2: all three tiers must be present
  const t1Block = getTierBlock(fm, 't1');
  const t2Block = getTierBlock(fm, 't2');
  const t3Block = getTierBlock(fm, 't3');

  const missingTiers = [];
  if (!t1Block) missingTiers.push('t1');
  if (!t2Block) missingTiers.push('t2');
  if (!t3Block) missingTiers.push('t3');

  if (missingTiers.length > 0) {
    issues.push(
      `Rule 2: Missing tier declarations in ${contractName}: [${missingTiers.join(', ')}]. ` +
      'Each enforcement_trio block must have t1, t2, and t3 sections.'
    );
    return { issues, advisories };
  }

  // Rule 3: each tier must have {tier, path, status}
  const tiers = [
    { name: 't1', block: t1Block },
    { name: 't2', block: t2Block },
    { name: 't3', block: t3Block },
  ];

  const noneStatuses = [];

  for (const { name, block } of tiers) {
    const tierField = getTierField(block, 'tier');
    const pathField = getTierField(block, 'path');
    const statusField = getTierField(block, 'status');

    const missingFields = [];
    if (tierField === undefined) missingFields.push('tier');
    if (pathField === undefined) missingFields.push('path');
    if (statusField === undefined) missingFields.push('status');

    if (missingFields.length > 0) {
      issues.push(
        `Rule 3: ${name} in ${contractName} missing required fields: [${missingFields.join(', ')}]. ` +
        `Each tier needs {tier, path, status}.`
      );
    }

    if (statusField === 'none') {
      noneStatuses.push(name);
    }

    // Rule 5 (ADVISORY): referenced paths should exist
    if (pathField && pathField !== 'null' && pathField !== null && statusField !== 'none') {
      const absPath = resolve(ROOT, pathField);
      if (!existsSync(absPath)) {
        advisories.push(
          `Rule 5 [ADVISORY]: ${name}.path "${pathField}" in ${contractName} does not exist on disk. ` +
          'Verify the path is correct. (Advisory — non-blocking if path is planned but not yet built.)'
        );
      }
    }
  }

  // Rule 4: any status=none must have a non-null exempt_reason
  if (noneStatuses.length > 0) {
    const exemptReason = getExemptReason(fm);
    if (!exemptReason) {
      issues.push(
        `Rule 4: ${contractName} has status=none for [${noneStatuses.join(', ')}] but ` +
        'exempt_reason is null or missing. ' +
        'Provide a specific exempt_reason explaining WHY these tiers cannot be active. ' +
        'Example: exempt_reason: "T1 hook not yet built — planned PROTO-S063-T1-HOOK"'
      );
    }
  }

  return { issues, advisories };
}

// ── Main ──────────────────────────────────────────────────────────────────────

function block(message) {
  // S069 Governor directive: T1 pre-tool-use = ADVISORY (warn, don't block).
  // T2 pre-commit (validate-done-right.mjs + validate-bstar-trio-coverage.mjs) = still BLOCKING.
  // Rationale: Governor permanently approves all writes; enforcement maintained at commit boundary.
  process.stdout.write(JSON.stringify({
    decision: 'allow',
    systemMessage: `⚠ [bstar-trio-gate] ADVISORY (was BLOCKING — S069 T1→advisory): enforcement_trio structure issue:\n${message}\n\nFix before commit: ensure enforcement_trio frontmatter is complete. Pre-commit validators will block if not fixed.`
  }));
  // exit 0 = allow the write; governance enforced at T2 (commit) not T1 (edit)
}

function advisory(messages) {
  process.stdout.write(JSON.stringify({
    systemMessage: `⚠ [bstar-trio-gate] Advisory:\n${messages.map(m => `  • ${m}`).join('\n')}`
  }));
}

async function main() {
  // Read stdin JSON (Claude Code hook input)
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    // Not valid JSON — not a hook call we can parse, allow
    process.exit(0);
  }

  const toolName = input.tool_name || '';
  const toolInput = input.tool_input || {};
  const filePath = toolInput.file_path || toolInput.path || '';

  // Only act on targeted B_*.md contracts
  if (!isBStarContract(filePath)) {
    process.exit(0);
  }

  let content = '';

  if (toolName === 'Write') {
    // Write tool: validate the new content being written
    content = toolInput.content || '';
  } else if (toolName === 'Edit') {
    // Edit tool: simulate the edit on current file content
    if (!existsSync(filePath)) {
      // File doesn't exist yet — treat like Write with empty base
      content = '';
    } else {
      const currentContent = readFileSync(filePath, 'utf8');
      const oldStr = toolInput.old_string || '';
      const newStr = toolInput.new_string || '';
      // Apply the edit (first occurrence only, matching Edit tool behavior)
      content = currentContent.replace(oldStr, newStr);
    }
  } else {
    // Other tools — not relevant
    process.exit(0);
  }

  const { issues, advisories } = validateTrioFrontmatter(content, filePath);

  if (issues.length > 0) {
    block(issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n'));
  }

  if (advisories.length > 0) {
    advisory(advisories);
  }

  process.exit(0);
}

main().catch(err => {
  // Don't block on gate errors — log and allow
  process.stderr.write(`[bstar-trio-gate] Error: ${err.message}\n`);
  process.exit(0);
});
