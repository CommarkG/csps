#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-commit-describe-without-implement
# @csps-name pre-commit-describe-without-implement
# @csps-description PreToolUse hook — blocks git commits that contain planning language
#   (Proposed fix / Structural fix candidate / Will fix / Planned fix) WITHOUT
#   implementation files staged OR explicit defer-to-session: S<NNN> in commit body.
#
#   R4 reasoning fix per Opus S062 analysis: "describe-feels-like-solve" pattern
#   gives psychological closure without building the fix. Gate ensures planning
#   commits are accompanied by implementation OR explicit deferral.
#
#   Exit 0 = allow | Exit 2 = block
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-019

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly GATE_SCRIPT="${REPO_ROOT}/tools/scripts/describe-without-implement-gate.mjs"

node "${GATE_SCRIPT}" "$@"
