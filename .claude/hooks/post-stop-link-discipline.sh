#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-link-discipline
# @csps-name post-stop-link-discipline
# @csps-description PostStop hook stub — fires when AI finishes responding; would scan the last AI turn for bare path mentions (file.md / packages/foo / docs/plan/...) lacking [text](path) markdown link wrapper per B_ALWAYS_GIT_LINKS. STUB tier (S008 turn 5 unified-intake topic-plan L1 foundation); week-4 promotes to active enforcement per token-optimization §14.4 Phase 5 migration.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces B_ALWAYS_GIT_LINKS
#
# Engraved S008 turn 5 as Surface 3 of unified-intake topic-plan L1 foundation per token-optimization.md §14.4
# row 4 (B_ALWAYS_GIT_LINKS path-mention scan migration; ~150 tokens/turn savings target).
#
# STUB BEHAVIOR (current):
#   Reports check would have run. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Parses transcript JSON for last AI message body
#   - Detects bare path tokens via regex (e.g., `\b[\w\-./]+\.(md|ts|tsx|sh|json|yaml|mjs)\b` outside markdown link syntax)
#   - Detects bare directory tokens (e.g., `packages/skills/` not wrapped in [...](...))
#   - Verifies each path is wrapped in `[text](path)` markdown link OR inline-code backticks (latter acceptable per AGENTS.md)
#   - Counterweight: code blocks (```...```) and inline-code (`...`) exempt
#   - Exit 1 (warn) if bare paths found
#   - Override: env CSPS_ALLOW_BARE_PATHS=1 (with audit log entry)
#   - Registered as PostStop hook in .claude/settings.json
#
# Manual invocation: bash .claude/hooks/post-stop-link-discipline.sh

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[link-discipline] STUB — session=${SESSION_ID} timestamp=${TIMESTAMP}"
echo "[link-discipline] transcript: ${TRANSCRIPT_PATH:-<not provided>}"
echo "[link-discipline] week-4 promotes to active enforcement detecting bare paths without [text](path) wrapper"
echo "[link-discipline] enforces B_ALWAYS_GIT_LINKS — every path mention is clickable markdown link"
echo "[link-discipline] STUB tier — exit 0 always"

exit 0
