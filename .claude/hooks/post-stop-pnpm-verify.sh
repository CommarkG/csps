#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-pnpm-verify
# @csps-name post-stop-pnpm-verify
# @csps-description PostStop hook stub — fires when AI finishes responding; would detect session-close intent (HANDOFF write OR closing-summary §10.0 fill OR explicit user "close session") and run `pnpm verify` blocking close if exit_code ≠ 0. Mitigates B_PRE_CLOSE_VERIFICATION nominal-RZF accumulation pattern (S005 turn 19 origin). STUB tier (S008 turn 5 unified-intake topic-plan L1 foundation); week-4 promotes to active enforcement per token-optimization §14.4 Phase 5 migration.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-008 B_PRE_CLOSE_VERIFICATION
#
# Engraved S008 turn 5 as Surface 3 of unified-intake topic-plan L1 foundation per token-optimization.md §14.4
# row 7 (B_PRE_CLOSE_VERIFICATION pnpm verify migration; ~300 tokens/turn savings target).
#
# STUB BEHAVIOR (current):
#   Reports check would have run. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Parses transcript JSON for last AI message body + recent tool calls
#   - Detects session-close-intent signals:
#     (a) HANDOFF-S<NNN>-to-S<NNN+1>.md write
#     (b) closing-summary-S<NNN>.md write with §10.0 block
#     (c) explicit "close session" / "session close" / "S<NNN> close" in last AI message
#   - If detected: spawn `pnpm verify --skip-install` subprocess
#   - Captures structured JSON output → emits to AI context
#   - Exit 1 (block) if exit_code ≠ 0 (forces AI to fix before close)
#   - Override: env CSPS_ALLOW_CLOSE_WITHOUT_VERIFY=1 (with audit log entry; only for emergency hot-fix close)
#   - Registered as PostStop hook in .claude/settings.json
#
# Manual invocation: bash .claude/hooks/post-stop-pnpm-verify.sh

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[pnpm-verify-on-close] STUB — session=${SESSION_ID} timestamp=${TIMESTAMP}"
echo "[pnpm-verify-on-close] transcript: ${TRANSCRIPT_PATH:-<not provided>}"
echo "[pnpm-verify-on-close] week-4 promotes to active enforcement: detect session-close intent → run pnpm verify → block on non-zero"
echo "[pnpm-verify-on-close] enforces B_PRE_CLOSE_VERIFICATION — every close cycle requires THIS-SESSION verify exit_code 0"
echo "[pnpm-verify-on-close] STUB tier — exit 0 always"

exit 0
