#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-governor-prompts
# @csps-name user-prompt-submit-governor-prompts
# @csps-description UserPromptSubmit hook stub — fires before AI sees user message; would auto-create a GP-S<NNN>-<NN> entry stub in docs/plan/_handoff/VAULT/governor-prompts/S<NNN>.md per B_GOVERNOR_PROMPTS (P-META-012). Composes with existing user-prompt-submit-intake.sh (different concern: intake=upload/paste/URL detection; this=substantive-prompt logging). STUB tier (S008 turn 5 unified-intake topic-plan L1 foundation); week-4 promotes to active enforcement per token-optimization §14.4 Phase 5 migration.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-012 B_GOVERNOR_PROMPTS
#
# Engraved S008 turn 5 as Surface 3 of unified-intake topic-plan L1 foundation per token-optimization.md §14.4
# row 6 (B_GOVERNOR_PROMPTS auto-log migration; ~50 tokens/turn savings — already cheap).
#
# COMPOSITION NOTE:
#   This hook DOES NOT replace user-prompt-submit-intake.sh (which handles upload/paste/URL/treasure
#   detection and triggers manual-protocol). This hook handles the COMPLEMENTARY concern of logging
#   every substantive prompt as a GP-S<NNN>-<NN> entry. Both fire on UserPromptSubmit; Claude Code
#   allows multiple hooks per event.
#
# STUB BEHAVIOR (current):
#   Reports check would have run. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Reads $CLAUDE_USER_PROMPT
#   - Determines current session ID from CLAUDE_SESSION_ID env or active session-state file
#   - Determines next GP-S<NNN>-<NN> sequence number from existing governor-prompts/S<NNN>.md
#   - Counterweight: trivial single-word prompts ("ok" / "thanks" / "proceed" without context) skip
#   - Appends GP entry stub with timestamp + verbatim + suggested-tags (heuristic-based) + status:auto-logged
#   - AI extends entry mid-session with cardinal-flag + distribution-targets + final status
#   - Exit 0 always (this is auto-log, not enforcement)
#   - Registered as UserPromptSubmit hook in .claude/settings.json
#
# Manual invocation: bash .claude/hooks/user-prompt-submit-governor-prompts.sh

set -euo pipefail

readonly USER_PROMPT="${CLAUDE_USER_PROMPT:-${1:-}}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
readonly PROMPT_LEN="${#USER_PROMPT}"

echo "[gp-auto-log] STUB — session=${SESSION_ID} timestamp=${TIMESTAMP} prompt_len=${PROMPT_LEN}"
echo "[gp-auto-log] week-4 promotes to active enforcement appending GP-S<NNN>-<NN> entries to governor-prompts/S<NNN>.md"
echo "[gp-auto-log] enforces B_GOVERNOR_PROMPTS — every substantive prompt logged with verbatim + tags + distribution"
echo "[gp-auto-log] composes with user-prompt-submit-intake.sh (different concern; both fire on UserPromptSubmit)"
echo "[gp-auto-log] STUB tier — exit 0 always"

exit 0
