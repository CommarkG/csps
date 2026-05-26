#!/usr/bin/env node
/**
 * describe-without-implement-gate.mjs
 *
 * Gate module for pre-commit-describe-without-implement.sh (PreToolUse hook).
 * Blocks commits that use planning language ("Proposed fix", "Structural fix candidate",
 * "Will fix", "Planned fix") in the commit message WITHOUT either:
 *   (a) staged implementation files (.sh/.mjs/.ts/.js/.py) in the same commit, OR
 *   (b) explicit "defer-to-session: S<NNN>" in the commit body
 *
 * R4 reasoning fix: "describe-feels-like-solve" — writing a proposed fix gives
 * psychological closure WITHOUT building it. Per Opus S062 analysis.
 *
 * Exit 0 = allow | Exit 2 = block
 */

import { execSync } from 'child_process';

const ROOT = process.cwd();

// Planning-language patterns that trigger the gate
const PLAN_RE = /\b(Proposed fix|Structural fix candidate|Will fix|Planned fix)\b/i;

// Defer bypass pattern in commit BODY
const DEFER_RE = /defer-to-session:\s*S\d{3,}/i;

// Implementation file extensions (evidence of actual work)
const IMPL_EXTS = /\.(sh|mjs|ts|tsx|js|jsx|py|go|rs|java|kt|swift)$/i;

// Read stdin
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  let d;
  try { d = JSON.parse(chunks.join('')); } catch (e) { process.exit(0); }

  const toolName = d.tool_name || d.toolName || '';
  const command  = (d.tool_input || d.toolInput || {}).command || '';

  // Only fire on Bash tool with git commit
  if (toolName !== 'Bash') process.exit(0);
  if (!command.includes('git commit')) process.exit(0);

  // Extract commit message (the -m value)
  // Handle both -m "msg" and -m 'msg' and heredoc forms
  const msgMatch = command.match(/-m\s+"([^"]+)"/) ||
                   command.match(/-m\s+'([^']+)'/) ||
                   command.match(/-m\s+(\S+)/);
  const msg = msgMatch ? msgMatch[1] : command;

  // Only fire if planning language is present
  if (!PLAN_RE.test(msg)) process.exit(0);

  const trigger = (msg.match(PLAN_RE) || ['Proposed fix'])[0];

  // Check for defer-to-session bypass in commit body
  if (DEFER_RE.test(command)) process.exit(0);

  // Check for implementation files staged in this commit
  let stagedFiles = '';
  try {
    stagedFiles = execSync('git diff --cached --name-only', {
      encoding: 'utf-8',
      cwd: ROOT,
    }).trim();
  } catch (e) {
    // Can't check staged files — fail open
    process.exit(0);
  }

  const hasImpl = stagedFiles.split('\n').some(f => IMPL_EXTS.test(f.trim()));
  if (hasImpl) process.exit(0);

  // No implementation evidence and no defer tag → BLOCK
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason:
      `[describe-without-implement-gate] BLOCKING: Commit contains "${trigger}" but no implementation files are staged.\n\n` +
      `This is the "describe-feels-like-solve" pattern (R4, Opus S062): writing a fix description gives closure without building it.\n\n` +
      `Resolution options:\n` +
      `  1. ADD implementation files to this commit (stage .sh, .mjs, .ts, etc.)\n` +
      `  2. ADD "defer-to-session: S<NNN>" to the commit body if intentionally deferring\n` +
      `  3. REPHRASE commit message to avoid planning language\n\n` +
      `Staged files: ${stagedFiles.split('\n').slice(0, 5).join(', ') || '(none)'}`,
  }));
  process.exit(2);
});
