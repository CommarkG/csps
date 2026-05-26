#!/usr/bin/env node
/**
 * claim-validator-gate.mjs
 *
 * Gate module for pre-commit-claim-validator-gate.sh (PreToolUse hook).
 * Reads JSON from stdin (Claude Code tool event), checks if a git commit
 * with claim keywords is being attempted without a THIS-HEAD verify pass.
 *
 * Exit 0 = allow | Exit 2 = block
 *
 * Structural fix for gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS (K=4, S062).
 * Per P-META-019: K>=2 = mandatory structural fix.
 *
 * Logic:
 *   1. If not Bash tool call → allow
 *   2. If command doesn't include 'git commit' → allow
 *   3. If commit message has no claim keywords → allow
 *   4. If verify-last-run.md is NEWER than HEAD commit → allow
 *   5. Else → BLOCK
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const VERIFY_FILE = join(ROOT, 'tools', 'verify-last-run.md');

// Read stdin
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  let d;
  try {
    d = JSON.parse(chunks.join(''));
  } catch (e) {
    // Malformed JSON — fail open (allow)
    process.exit(0);
  }

  const toolName = d.tool_name || d.toolName || '';
  const command  = (d.tool_input || d.toolInput || {}).command || '';

  // Only fire on Bash tool with git commit
  if (toolName !== 'Bash') process.exit(0);
  if (!command.includes('git commit')) process.exit(0);

  // Extract commit message from -m flag (handles single/double quotes)
  const msgMatch = command.match(/-m\s+["']([^"']*(?:["'][^"']*["'][^"']*)*?)["']/) ||
                   command.match(/-m\s+["']([^"']+)["']/) ||
                   command.match(/-m\s+'([^']+)'/) ||
                   command.match(/-m\s+"([^"]+)"/) ||
                   command.match(/-m\s+(\S+)/);
  const msg = msgMatch ? msgMatch[1] : command;

  // Check for claim keywords (case-insensitive word boundary)
  const CLAIM_RE = /\b(COMPLETE|SEALED|DONE|CLOSED|RATIFIED)\b/i;
  if (!CLAIM_RE.test(msg)) process.exit(0);

  const keyword = (msg.match(CLAIM_RE) || ['CLAIM'])[0].toUpperCase();

  // Check verify-last-run.md vs HEAD commit timestamp
  try {
    const headTimeStr = execSync('git log -1 --format=%ct', {
      encoding: 'utf-8',
      cwd: ROOT,
    }).trim();
    const headTime = parseInt(headTimeStr, 10);

    if (!existsSync(VERIFY_FILE)) {
      block(keyword, 'verify-last-run.md does not exist — run: node tools/verify.mjs --skip-install 2>&1 | tail -30');
    }

    const runTime = Math.floor(statSync(VERIFY_FILE).mtimeMs / 1000);

    if (runTime <= headTime) {
      const staleSec = headTime - runTime;
      block(keyword,
        `verify-last-run.md is stale by ${staleSec}s. ` +
        `Verify ran at ${new Date(runTime * 1000).toISOString()}, ` +
        `HEAD committed at ${new Date(headTime * 1000).toISOString()}. ` +
        `Fix: node tools/verify.mjs --skip-install 2>&1 | tail -30`
      );
    }

    // Allow
    process.exit(0);

  } catch (e) {
    // Fail open — can't check → allow commit (don't break git on tool errors)
    process.exit(0);
  }
});

function block(keyword, detail) {
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason:
      `[claim-validator-gate] BLOCKING: Commit claims ${keyword} but verify is STALE.\n\n` +
      `${detail}\n\n` +
      `After fixing:\n` +
      `  node tools/verify.mjs --skip-install 2>&1 | tail -30\n` +
      `  (when exit_code=0) retry the commit\n\n` +
      `Root: gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS K=4 S062. THIS-HEAD verify required for all DONE/SEALED/COMPLETE/CLOSED/RATIFIED claims.\n` +
      `B_PRE_CLOSE_VERIFICATION + P-META-019.`,
  }));
  process.exit(2);
}
