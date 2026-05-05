#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-rzf-evidence-gate
# @csps-name pre-tool-use-rzf-evidence-gate
# @csps-description PreToolUse hook stub — fires before Bash tool calls matching `git commit*`; would scan the proposed commit message for DONE/RATIFIED/VALIDATED/CLOSED claims AND verify a paired RZF evidence block reference (path to verify-last-run.md / closing-summary §10.0 / similar). Mitigates B_RZF nominal-claim violations. STUB tier (S008 turn 5 unified-intake topic-plan L1 foundation); week-4 promotes to active enforcement per token-optimization §14.4 Phase 5 migration.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-006 B_RZF B_PRE_CLOSE_VERIFICATION
#
# Engraved S008 turn 5 as Surface 3 of unified-intake topic-plan L1 foundation per token-optimization.md §14.4
# row 2 (B_RZF re-run-is-the-proof migration on commit; ~250 tokens/turn savings target).
#
# STUB BEHAVIOR (current):
#   Reports check would have run on $TOOL_INPUT. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Parses tool input JSON for git commit message
#   - Detects DONE/RATIFIED/VALIDATED/CLOSED keywords in commit message body
#   - Verifies one of: (a) `evidence_block_ref:` reference, (b) `pnpm verify` exit_code 0 cite,
#     (c) `verify-last-run.md` path reference, (d) closing-summary §10.0 cite
#   - Exit 1 (block) if claim-keyword present without paired evidence
#   - Override: env CSPS_ALLOW_RZF_BYPASS=1 (with audit log entry)
#   - Registered as PreToolUse hook in .claude/settings.json with matcher: Bash on `git commit*`
#
# Manual invocation: bash .claude/hooks/pre-tool-use-rzf-evidence-gate.sh

set -euo pipefail

readonly TOOL_NAME="${CLAUDE_TOOL_NAME:-unknown}"
readonly TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[rzf-evidence-gate] STUB — tool=${TOOL_NAME} timestamp=${TIMESTAMP}"
echo "[rzf-evidence-gate] tool_input: ${TOOL_INPUT:0:120}..."
echo "[rzf-evidence-gate] week-4 promotes to active enforcement scanning git commit messages for unevidenced claims"
echo "[rzf-evidence-gate] enforces B_RZF — every DONE/RATIFIED claim cites THIS-SESSION validator output"
echo "[rzf-evidence-gate] STUB tier — exit 0 always"

exit 0
