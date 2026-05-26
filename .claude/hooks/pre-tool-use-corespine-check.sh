#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-corespine-check
# @csps-name pre-tool-use-corespine-check
# @csps-description PreToolUse hook — fires on Write to .md governance files.
#   Advisory: warns if core_spine or schema_anchor missing from frontmatter.
#   Never blocks (exit 0 always) — promotes awareness during adoption period.
#   B_CORE_SPINE_DISCIPLINE T1 (partial) — PROTO-S063-CORESPINE-T1-HOOK S063.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_CORE_SPINE_DISCIPLINE P-ARCH-028

set -euo pipefail
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
node "${REPO_ROOT}/tools/scripts/corespine-check-gate.mjs" "$@"
