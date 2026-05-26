#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-commit-claim-validator-gate
# @csps-name pre-commit-claim-validator-gate
# @csps-description PreToolUse hook — blocks Bash tool calls to git commit that contain
#   DONE/SEALED/COMPLETE/CLOSED/RATIFIED claim keywords UNLESS verify-last-run.md
#   is newer than HEAD commit (i.e., THIS-HEAD verify has passed).
#
#   Structural fix for gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS (K=4, S062).
#   Per P-META-019: K>=2 = mandatory structural fix. K=4 = long overdue.
#
#   Logic (in tools/scripts/claim-validator-gate.mjs):
#     1. Not Bash tool? → allow
#     2. No 'git commit' in command? → allow
#     3. No claim keywords in message? → allow
#     4. verify-last-run.md newer than HEAD? → allow
#     5. Otherwise → BLOCK with fix instructions
#
#   Exit 0 = allow | Exit 2 = block
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_PRE_CLOSE_VERIFICATION B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-019
# gap_fix: gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS K=4 S062

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly GATE_SCRIPT="${REPO_ROOT}/tools/scripts/claim-validator-gate.mjs"

# Pass stdin directly to the Node gate module
node "${GATE_SCRIPT}" "$@"
