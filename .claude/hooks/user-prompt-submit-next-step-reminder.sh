#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-next-step-reminder
# @csps-name user-prompt-submit-next-step-reminder
# @csps-description UserPromptSubmit hook — injects FIVE active disciplines per turn:
#   (1) B_OPTIMAL_NEXT_STEP, (2) P-META-020 CONCEPT_LOAD, (3) ZF iteration awareness,
#   (4) single-source navigation warning (reasoning-single-source-navigation S014),
#   (5) config hierarchy warning (config-silent-override S014).
#   Five because each addresses a distinct failure mode observed in S014.
#   WHY five: the triad (P-META-021) requires context+principle+mechanical.
#   These disciplines ARE the context layer — they prevent the satisfaction points
#   that caused: phase advance before ZF, nominal ZF, silent config override,
#   and single-source navigation. User directive S012 + S014 spine audit.
# @csps-version 1.2.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_OPTIMAL_NEXT_STEP P-META-020 P-META-006 P-META-021

set -euo pipefail

printf '{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "TURN DISCIPLINE — SIX ACTIVE ENFORCEMENTS:\\n\\n1. B_OPTIMAL_NEXT_STEP (user directive S012):\\n   End every SUBSTANTIVE response with a \\u25b6 OPTIMAL NEXT STEP block.\\n   Format: action (specific) | context (what it unlocks) | reasoning (why now).\\n   Exempt: pure conversational exchanges with zero actionable work.\\n\\n2. CONCEPT_LOAD — P-META-020 per-input spine selection (mandatory):\\n   Before processing this input, identify the governing L2 spine:\\n     Governor directive / ratification   \\u2192 GVRN L2 (decision rights)\\n     Implementation / schema / code      \\u2192 ARCH L2 (data domain)\\n     AI behavior / inner-defaults        \\u2192 AI L2 (inner-defaults domain)\\n     Validation / evidence / ZF claim    \\u2192 VALD L2 (coverage discipline)\\n     External content / research         \\u2192 AI L2 (alignment) + VAULT_DEFER\\n\\n3. ZF ITERATION AWARENESS:\\n   DONE/COMPLETE/RATIFIED claim requires THIS-SESSION verify evidence.\\n   Memory of earlier runs is NOT evidence. Re-run IS the proof.\\n   Nominal ZF (bypass/timestamp-touch) = primary structural failure mode.\\n\\n4. SINGLE-SOURCE NAVIGATION WARNING (S014 discovery):\\n   For CONSEQUENTIAL decisions, consult ALL signals before proposing advance:\\n     (a) session-state.json mandate (planned sequence)\\n     (b) PENDING VLTs — validate-vlt-blocking (unresolved blockers)\\n     (c) open-plan-levels (open obligations)\\n     (d) PE scoring (current priority ordering)\\n   ALL FOUR must agree. Consulting ONLY session-state = satisfaction point.\\n\\n5. CONFIG HIERARCHY WARNING (S014 canonical discovery):\\n   If this turn creates/modifies any hierarchical config:\\n   EXPLICIT OVER IMPLICIT — every critical field declared at THIS level.\\n   Do NOT assume parent values are inherited. Silent override pattern:\\n     child has OBJECT but not FIELD \\u2192 system uses DEFAULT not parent.\\n\\n6. RZF BEFORE RESPONSE MANDATE (Governor directive S037 — P-META-006 + Rule 9):\\n   ZF = Zero Findings. The cycle TERMINATES only when findings reach zero.\\n   For ANY substantive response: run cycles until you find NOTHING NEW.\\n   Format: \\\"ZF Cycle 1: [finding]. Cycle 2: [re-checked finding 1 area + 0 new]. Status: ZF ACHIEVED.\\\"\\n   NOT: \\\"Cycle 2: 0 new findings.\\\" (nominal — must NAME what was re-examined)\\n   ALSO: Every response to Opus MUST start: \\\"Opus, this is Sonnet.\\\"\\n   Exempt: pure conversational replies with zero actionable claims."
  }
}'

exit 0
