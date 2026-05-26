#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-commit-bstar-engraving-gate
# @csps-name pre-commit-bstar-engraving-gate
# @csps-description PreToolUse hook — Check-In gate for newly authored B_*.md contracts.
#   When the Write tool creates a new B_*.md in behavioral-contracts/, checks that
#   frontmatter contains opus_reviewed_seed: <SHA> — proving Opus has reviewed the
#   contract's core-seed text before it's engraved.
#   EXEMPT: Edit tool (modified existing contracts), slice-regenerated files.
#   Per Opus-10 Q1 answer S064: field name = opus_reviewed_seed, Check-In tier.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_FIVE_SURFACE_ENGRAVING P-META-007

set -euo pipefail
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
node "${REPO_ROOT}/tools/scripts/bstar-engraving-gate.mjs" "$@"
