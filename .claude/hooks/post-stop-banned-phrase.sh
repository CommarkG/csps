#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-banned-phrase
# @csps-name post-stop-banned-phrase
# @csps-description PostStop hook stub — fires when AI finishes responding; would scan the last AI turn for banned confirmation-seeking phrases per B_NO_CONFIRMATION_SEEKING (memory feedback_no_confirmation_seeking.md). Banned set: "shall I", "should I proceed", "would you like me to", "do you want me to", "let me know if", "is that OK", "ready for me to". STUB tier (S008 turn 5 unified-intake topic-plan L1 foundation); week-4 promotes to active enforcement per token-optimization §14.4 Phase 5 migration.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces B_NO_CONFIRMATION_SEEKING
#
# Engraved S008 turn 5 as Surface 3 of unified-intake topic-plan L1 foundation per token-optimization.md §14.4
# row 5 (B_NO_CONFIRMATION_SEEKING phrase scan migration; ~100 tokens/turn savings target).
#
# STUB BEHAVIOR (current):
#   Reports check would have run. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Parses transcript JSON for last AI message body
#   - Detects banned phrases via case-insensitive regex set
#   - Counterweight: when 4-condition autonomous gate FAILS (cross-actor / not-ratified / irreversible / non-mechanical),
#     the AI legitimately needs to ask — these cases get explicit-ask label and skip the warn
#   - Exit 1 (warn) if banned phrase found without legitimate-ask label
#   - Override: env CSPS_ALLOW_CONFIRMATION_SEEKING=1 (with audit log entry)
#   - Registered as PostStop hook in .claude/settings.json
#
# Manual invocation: bash .claude/hooks/post-stop-banned-phrase.sh

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[banned-phrase] STUB — session=${SESSION_ID} timestamp=${TIMESTAMP}"
echo "[banned-phrase] transcript: ${TRANSCRIPT_PATH:-<not provided>}"
echo "[banned-phrase] week-4 promotes to active enforcement detecting confirmation-seeking phrases"
echo "[banned-phrase] enforces B_NO_CONFIRMATION_SEEKING — execute under 4-condition gate; don't ask 'should I proceed?'"
echo "[banned-phrase] STUB tier — exit 0 always"

exit 0
