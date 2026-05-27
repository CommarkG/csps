#!/usr/bin/env node
/**
 * shape-check-gate.mjs
 * Gate logic for pre-tool-use-shape-check.sh
 * Core Seed pattern per PROTO-S066-WAVE-1
 *
 * Fires: Edit | Write tool calls targeting tools/council/opus-turn.md
 * Filter: new content > 200 chars (skip conversational-tier)
 * Required: SHAPE block matching regex in first 500 chars
 *
 * ADVISORY S066: exit 0 always; emit warning to stderr if SHAPE missing.
 *
 * inherits_from: PROTO-S066-WAVE-1 Core Seed pattern
 */

const SHAPE_RE = /SHAPE:\s+\S.*\|\s+SHAPE-TIER:\s+(substantive|conversational)\s+\|\s+WHY:\s+\S/;
const TARGET_FILE = 'tools/council/opus-turn.md';
const CONTENT_THRESHOLD = 200; // chars — skip conversational writes
const SHAPE_SCAN_WINDOW = 500; // chars — only check first N chars

const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  let d;
  try { d = JSON.parse(chunks.join('')); } catch (e) { process.exit(0); }

  const toolName = d.tool_name || d.toolName || '';
  const input    = d.tool_input || d.toolInput || {};

  // Only fire on Edit/Write tool calls
  if (toolName !== 'Edit' && toolName !== 'Write') process.exit(0);

  // Only fire on writes to opus-turn.md
  const filePath = input.file_path || '';
  if (!filePath.includes(TARGET_FILE)) process.exit(0);

  // Get new content (Write: content field; Edit: new_string field)
  const newContent = input.content || input.new_string || '';

  // Exempt: writes < threshold (conversational fast-path)
  if (newContent.length < CONTENT_THRESHOLD) process.exit(0);

  // Exempt: content declares SHAPE-TIER: conversational
  const scanWindow = newContent.slice(0, SHAPE_SCAN_WINDOW);
  if (scanWindow.includes('SHAPE-TIER: conversational')) process.exit(0);

  // Exempt: Edit where old_string already had SHAPE block (preservation, not new content)
  const oldContent = input.old_string || '';
  if (oldContent && SHAPE_RE.test(oldContent)) process.exit(0);

  // Check for SHAPE block in first 500 chars
  if (SHAPE_RE.test(scanWindow)) {
    // PASSING — shape block found
    process.exit(0);
  }

  // MISSING SHAPE BLOCK — ADVISORY (exit 0 + stderr warning per F-NEW-2)
  process.stderr.write(
    `[shape-check][ADVISORY S066] would BLOCK S067: ${TARGET_FILE} missing SHAPE block.\n` +
    `  Required in first ${SHAPE_SCAN_WINDOW} chars: SHAPE: <type> | SHAPE-TIER: substantive | WHY: <one-line>\n` +
    `  Add to top of new content, or declare SHAPE-TIER: conversational if intentional.\n` +
    `  Content length: ${newContent.length} chars (above ${CONTENT_THRESHOLD} threshold).\n`
  );

  // ADVISORY: exit 0 (not blocking in S066)
  process.exit(0);
});
