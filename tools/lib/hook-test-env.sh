#!/usr/bin/env bash
# tools/lib/hook-test-env.sh — Canonical Claude Code hook test environment.
# E-fold: AMENDMENT-1 S086 — B_DETERMINISTIC_GATE companion.
#
# PURPOSE: Documents and exports all environment variables that Claude Code sets
# in the UserPromptSubmit hook environment. Use this in test harnesses to match
# the real runtime environment exactly (so smoke tests find what hooks expect).
#
# WHY THIS EXISTS (S086 reactive fix → structural fix):
#   validate-hook-activation-smoke.mjs spawned hooks without REPO_ROOT set.
#   Hooks use `set -euo pipefail` + `$REPO_ROOT` → all exited non-zero → 5 BLOCKING
#   false positives. The fix was reactive (add REPO_ROOT to spawnSync env). This file
#   makes the canonical hook env explicit so future test code picks it up.
#
# USAGE — in Node.js (e.g. validate-hook-activation-smoke.mjs):
#   import { resolve } from 'node:path';
#   const ROOT = resolve(__dirname, '../..');
#   // Load canonical hook env
#   const HOOK_ENV = {
#     ...process.env,
#     ...getCanonicalHookEnv(ROOT),
#   };
#   // Use HOOK_ENV in spawnSync/execSync
#
# USAGE — in bash (source this file before calling a hook under test):
#   source "$REPO_ROOT/tools/lib/hook-test-env.sh"
#   # All CSPS_HOOK_* vars are now exported

# ── Variables Claude Code sets in UserPromptSubmit hook environment ─────────────
# Documented from Claude Code hook input model (S086 investigation):
# Source: https://docs.anthropic.com/en/docs/claude-code/hooks

# REPO_ROOT: absolute path to the repo root (set by Claude Code, matches git root)
# This is the most critical one — hooks use $REPO_ROOT to build all paths.
export REPO_ROOT="${REPO_ROOT:-$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel 2>/dev/null || echo "")}"

# PATH: inherited from the host shell (Claude Code passes parent PATH through)
# No override needed — hooks inherit PATH from the Claude Code process.

# HOME: user home directory (inherited, standard)
# USER / USERNAME: current user (inherited)
# SHELL: current shell (inherited)

# ── Variables NOT set by Claude Code (common misconceptions) ─────────────────
# CLAUDE_USER_PROMPT: NOT set by Claude Code. The prompt arrives via STDIN JSON
#   as {"prompt":"..."}, NOT as an env var. Hooks that use CLAUDE_USER_PROMPT as
#   primary source will always get empty string. (Root cause of S086 AMENDMENT-1.)
# CLAUDE_API_KEY: NOT passed to hooks (security boundary).
# CLAUDE_SESSION: NOT set. Use tools/lib/session-source.mjs instead.

# ── Test harness usage from Node.js ──────────────────────────────────────────
# In validate-hook-activation-smoke.mjs (or any Node test that spawns hooks):
#
#   const CANONICAL_HOOK_ENV = {
#     ...process.env,
#     PATH: process.env.PATH,
#     REPO_ROOT: ROOT,             // <-- critical: must match hook's expected $REPO_ROOT
#     // Do NOT set CLAUDE_USER_PROMPT — hooks must source hook-read-prompt.sh instead
#   };
#
#   spawnSync('bash', [hookPath], {
#     input: '{"prompt":"SMOKE-test"}',
#     encoding: 'utf-8',
#     cwd: ROOT,
#     env: CANONICAL_HOOK_ENV,
#   });

# ── Validation note ───────────────────────────────────────────────────────────
# If a hook fails in validate-hook-activation-smoke.mjs but passes manually,
# check: does it use an env var listed under "NOT set by Claude Code" above?
# If yes → fix the hook to use hook-read-prompt.sh / session-source.mjs instead.

echo "[hook-test-env] REPO_ROOT=${REPO_ROOT}"
echo "[hook-test-env] canonical env documented; source this file or use CANONICAL_HOOK_ENV in Node.js"
