#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-next-step-reminder
# @csps-name user-prompt-submit-next-step-reminder
# @csps-description UserPromptSubmit hook — injects B_OPTIMAL_NEXT_STEP discipline +
#   P-META-020 CONCEPT_LOAD per-input spine selection + ZF iteration reasoning.
#   Three disciplines in one injection: (1) end every turn with specific next step,
#   (2) identify governing L2 spine before processing, (3) understand WHY these
#   disciplines compound into platform quality. User directive S012.
# @csps-version 1.1.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_OPTIMAL_NEXT_STEP P-META-020 P-META-006

set -euo pipefail

printf '{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "TURN DISCIPLINE — THREE ACTIVE ENFORCEMENTS:\\n\\n1. B_OPTIMAL_NEXT_STEP (user directive S012):\\n   End every SUBSTANTIVE response with a \\u25b6 OPTIMAL NEXT STEP block.\\n   Format: action (specific) | context (what it unlocks) | reasoning (why now).\\n   Exempt: pure conversational exchanges with zero actionable work.\\n   Silent skip = anti-pattern caught by post-stop hooks.\\n\\n2. CONCEPT_LOAD — P-META-020 per-input spine selection (mandatory):\\n   Before processing this input, identify which L2 spine domain governs it:\\n     Governor directive / ratification   \\u2192 GVRN L2 (decision rights)\\n     Implementation / schema / code      \\u2192 ARCH L2 (data domain)\\n     AI behavior / inner-defaults        \\u2192 AI L2 (inner-defaults domain)\\n     Validation / evidence / ZF claim    \\u2192 VALD L2 (coverage discipline)\\n     External content / research         \\u2192 AI L2 (alignment) + VAULT_DEFER\\n   WHY: rules are finite, situations are infinite. Only the loaded concept\\n   handles new situations not yet covered by any named rule. This is\\n   the difference between patching instances and navigating from understanding.\\n\\n3. ZF ITERATION AWARENESS:\\n   If this turn produces a DONE/COMPLETE/RATIFIED claim, cite THIS-SESSION\\n   pnpm verify output (exit_code + timestamp) inline. Memory of earlier runs\\n   is NOT evidence. Re-run IS the proof. Nominal ZF (timestamp-touch, bypass)\\n   is the primary structural failure mode in this platform."
  }
}'

exit 0
