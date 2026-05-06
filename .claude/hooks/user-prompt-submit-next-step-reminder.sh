#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-next-step-reminder
# @csps-name user-prompt-submit-next-step-reminder
# @csps-description UserPromptSubmit hook — injects "Optimal Next Step" turn discipline
#   into Claude's context before every response. Enforces B_OPTIMAL_NEXT_STEP: every
#   substantive response ends with a ▶ OPTIMAL NEXT STEP block (specific action +
#   platform context + one-sentence core reasoning). User directive S012.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_OPTIMAL_NEXT_STEP
#
# Mechanism: outputs hookSpecificOutput.additionalContext which Claude Code injects
# into the AI's context window before generating the response for this turn.
# This is the correct enforcement surface — fires PRE-generation, not post.
#
# Skip condition: pure conversational exchanges (no actionable work) are exempt.
# The AI applies judgement — the hook supplies the reminder, not the enforcement logic.

set -euo pipefail

printf '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"TURN DISCIPLINE — B_OPTIMAL_NEXT_STEP (user directive S012): End every substantive response with a ▶ OPTIMAL NEXT STEP block. Format: action (specific, not generic) | context (what it unlocks in the platform) | reasoning (one sentence: why now, not later). Exempt: pure conversational exchanges with zero actionable work. Silent skip = anti-pattern."}}'

exit 0
