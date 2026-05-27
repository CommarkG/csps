#!/usr/bin/env bash
# Hook: pre-tool-use-shape-check.sh
# Fires: pre-tool-use (Edit | Write tool calls)
# Reads: tool args via stdin JSON (CLAUDE_HOOK_INPUT)
# Filters: writes to tools/council/opus-turn.md > 200 chars
# Validates: SHAPE block in first 500 chars of new content
# Exits: 0 (ADVISORY mode S066) + stderr warning if missing; 0 silently if exempt or passing
#
# ADVISORY S066 / BLOCKING S067 — exit 0 always in S066 (F-NEW-2)
# After 5 clean Opus turns under shape-check, flip to exit 1 in S067.
#
# @csps-id csps.claude.hooks.pre-tool-use-shape-check
# @csps-name pre-tool-use-shape-check
# @csps-description PreToolUse hook — ADVISORY S066 shape-check for opus-turn.md writes.
#   Substantive Opus responses (>200 chars) must contain SHAPE block in first 500 chars.
#   SHAPE: <type> | SHAPE-TIER: substantive | WHY: <one-line>
#   Advisory mode: exit 0 + stderr warning. Will be BLOCKING in S067 after 5 clean turns.
#   Closes Q2 (Opus output shape drift surface). PROTO-S066-WAVE-1 STEP 1.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-019
# inherits_from: PROTO-S066-WAVE-1 Core Seed pattern
# wave: WAVE-1-STEP-1

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly GATE_SCRIPT="${REPO_ROOT}/tools/scripts/shape-check-gate.mjs"

# Defensive: never gate on the hook's own file path (future-filter-expansion guard)
# (F-NEW-3: self-skip line required even though current filter is opus-turn.md only)
target_file="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"
[[ "$target_file" == ".claude/hooks/pre-tool-use-shape-check.sh" ]] && exit 0

node "${GATE_SCRIPT}" "$@"
