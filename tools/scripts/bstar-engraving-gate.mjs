#!/usr/bin/env node
/**
 * bstar-engraving-gate.mjs
 *
 * Gate module for pre-commit-bstar-engraving-gate.sh (PreToolUse hook).
 * When a NEWLY AUTHORED B_*.md file is being written (Write tool), checks
 * that the frontmatter contains `opus_reviewed_seed: <40-char-SHA>`.
 *
 * SCOPE: Only new B_*.md files (Write tool creating new contracts).
 * EXEMPT: Modified/existing B_*.md (Edit tool) — existing contracts were reviewed.
 * EXEMPT: Slice-regenerated B_*.md (from split-behavioral-contracts.mjs runs).
 *
 * Detection: Write tool + file path matches B_*.md in behavioral-contracts/ +
 *   content has no opus_reviewed_seed field → BLOCK.
 *
 * Per Opus-10 Q1 answer S064: field name = opus_reviewed_seed, matches M-37 Core Seeds vocabulary.
 *
 * Exit 0 = allow | Exit 2 = block
 */

import { basename } from 'path';

const BSTAR_RE = /docs\/plan\/pillar-0-governance\/behavioral-contracts\/B_.*\.md$/;
const SEED_RE = /^\s*opus_reviewed_seed:\s*[a-f0-9]{7,40}/m;
const PLACEHOLDER_STEMS = ['B_TEST_', 'B_FAKE_', 'B_PLACEHOLDER_', 'B_EXAMPLE_'];

// Read stdin
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  let d;
  try { d = JSON.parse(chunks.join('')); } catch (e) { process.exit(0); }

  const toolName = d.tool_name || d.toolName || '';
  const input    = d.tool_input || d.toolInput || {};
  const filePath = input.file_path || '';
  const content  = input.content  || '';

  // Only fire on Write tool (new file creation)
  if (toolName !== 'Write') process.exit(0);

  // Only fire on B_*.md in behavioral-contracts/
  if (!BSTAR_RE.test(filePath)) process.exit(0);

  // Only fire on files with frontmatter (new governance contracts)
  if (!content.includes('---')) process.exit(0);

  // Skip test/placeholder files
  const base = basename(filePath);
  if (PLACEHOLDER_STEMS.some(stem => base.startsWith(stem))) process.exit(0);

  // Check for opus_reviewed_seed field in frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) process.exit(0);

  const fm = fmMatch[1];
  if (SEED_RE.test(fm)) process.exit(0);

  // Missing opus_reviewed_seed → BLOCK
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason:
      `[bstar-engraving-gate] BLOCKING: New B_* contract ${basename(filePath)} missing 'opus_reviewed_seed: <SHA>' in frontmatter.\n\n` +
      `New behavioral contracts require Opus review of the core-seed text before engraving.\n\n` +
      `Steps:\n` +
      `  1. Share the contract's canonical wording with Opus\n` +
      `  2. Get Opus review (a CHECK-IN glance, not full ADVANCE)\n` +
      `  3. Note the commit SHA of Opus's review turn\n` +
      `  4. Add to frontmatter: opus_reviewed_seed: <SHA>\n\n` +
      `Exemption: if this is a SLICE-regenerated file (from split-behavioral-contracts.mjs), ` +
      `the source behavioral-contracts.md should already have opus_reviewed_seed. ` +
      `Add the field there first, then re-run the splitter.\n\n` +
      `B_REVERSIBILITY_GATED_REVIEW Check-In gate — S064 Item 2.1.`,
  }));
  process.exit(2);
});
