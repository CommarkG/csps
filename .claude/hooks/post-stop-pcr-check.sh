#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-pcr-check
# @csps-name post-stop-pcr-check
# @csps-description PostStop hook stub — fires when AI finishes responding; would scan the last AI turn for non-trivial multi-option decisions lacking a Pros/Cons/Recommendation 3-block (per B_PCR_FOR_DECISIONS). Trigger keywords: "should we", "X vs Y", "option A/B/C", "decide between", "alternatives", "either... or...". STUB tier (S008 turn 5 unified-intake topic-plan L1 foundation); week-4 promotes to active enforcement per token-optimization §14.4 Phase 5 migration.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-OP-003 B_PCR_FOR_DECISIONS
#
# Engraved S008 turn 5 as Surface 3 of unified-intake topic-plan L1 foundation per token-optimization.md §14.4
# row 3 (B_PCR_FOR_DECISIONS trigger detection migration; ~200 tokens/turn savings target).
#
# STUB BEHAVIOR (current):
#   Reports check would have run. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Parses transcript JSON for last AI message body
#   - Detects multi-option decision patterns (regex on trigger keyword set)
#   - Verifies presence of 3-block PCR structure (Pros: / Cons: / Recommendation:)
#   - Verifies "what would flip" clause present per B_PCR_FOR_DECISIONS
#   - Counterweight: explicit "trivial-reversible — skipping PCR per <reason>" inline note allows skip
#   - Exit 1 (warn) if multi-option decision detected without PCR or skip-note
#   - Override: env CSPS_ALLOW_PCR_BYPASS=1 (with audit log entry)
#   - Registered as PostStop hook in .claude/settings.json
#
# Manual invocation: bash .claude/hooks/post-stop-pcr-check.sh

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[pcr-check] STUB — session=${SESSION_ID} timestamp=${TIMESTAMP}"
echo "[pcr-check] transcript: ${TRANSCRIPT_PATH:-<not provided>}"
echo "[pcr-check] week-4 promotes to active enforcement detecting multi-option decisions without PCR 3-block"
echo "[pcr-check] enforces B_PCR_FOR_DECISIONS — Pros/Cons/Recommendation + what-would-flip clause mandatory"
echo "[pcr-check] STUB tier — exit 0 always"

exit 0
