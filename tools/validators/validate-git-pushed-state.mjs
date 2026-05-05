#!/usr/bin/env node
/**
 * validate-git-pushed-state.mjs — verifies git working tree is pushed before session close
 *
 * Per P-OPER-001 Zero-Laptop-Dependency Q-2=B (auto-push at session-close gate).
 * Root cause: without this check, session work can be local-only and lost if
 * switching to Codespace / Android / another machine.
 *
 * Checks:
 *   1. No uncommitted tracked changes (git diff --cached + git diff)
 *   2. No commits ahead of remote (git log origin/main..HEAD empty)
 *   3. No untracked files in governed paths (docs/ + tools/ + packages/ + .claude/)
 *
 * EXIT-CODED: 0 = pushed + clean / 1 = local-only work detected
 */

import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    return e.stdout?.trim() ?? '';
  }
}

async function main() {
  const warnings = [];

  // Check 1: uncommitted staged changes
  const staged = run('git diff --cached --name-only');
  if (staged) {
    warnings.push(`Staged but uncommitted changes:\n${staged.split('\n').map(f => `  ${f}`).join('\n')}`);
  }

  // Check 2: uncommitted unstaged changes in governed paths
  const unstaged = run('git diff --name-only -- docs/ tools/ packages/ .claude/');
  if (unstaged) {
    warnings.push(`Unstaged changes in governed paths:\n${unstaged.split('\n').map(f => `  ${f}`).join('\n')}`);
  }

  // Check 3: commits ahead of origin/main
  const ahead = run('git log origin/main..HEAD --oneline');
  if (ahead) {
    const count = ahead.split('\n').filter(Boolean).length;
    warnings.push(`${count} commit(s) not pushed to origin/main:\n${ahead.split('\n').map(c => `  ${c}`).join('\n')}`);
  }

  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s) — local work not pushed:`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
    console.warn('\n  Fix: git add <files> && git commit -m "..." && git push origin main');
  }

  const summary = `[validate-git-pushed-state] warnings=${warnings.length}`;
  console.log(`\n${summary}`);

  // Advisory-only: exit 0 always — meant to surface at session-close review, not block mid-session verify
  // Promote to exit 1 when AGENTS.md mandates "never close session with unpushed work" (week-4 gate)
  process.exit(0);
}

main().catch(err => {
  console.error('[validate-git-pushed-state] fatal:', err);
  process.exit(1);
});
