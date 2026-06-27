#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-next-step-reminder
# @csps-name user-prompt-submit-next-step-reminder
# @csps-description UserPromptSubmit hook — injects SEVEN active disciplines per turn:
#   (1) B_OPTIMAL_NEXT_STEP, (2) P-META-020 CONCEPT_LOAD, (3) ZF iteration awareness,
#   (4) single-source navigation warning (reasoning-single-source-navigation S014),
#   (5) config hierarchy warning (config-silent-override S014),
#   (6) IZFC completion standard (S078),
#   (7) B_CHALLENGE_ON_MERIT + B_DECISION_LEDGER (S089 CONSTITUTIONAL).
#   WHY seven: each addresses a distinct failure mode observed across sessions.
#   The triad (P-META-021) requires context+principle+mechanical.
#   These disciplines ARE the context layer — they prevent satisfaction points
#   that caused: phase advance before ZF, nominal ZF, silent config override,
#   single-source navigation, blind agreement, and reasoning amnesia.
#   User directive S012 + S014 spine audit + S089 constitutional hardwire.
# @csps-version 1.3.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_OPTIMAL_NEXT_STEP P-META-020 P-META-006 P-META-021 B_CHALLENGE_ON_MERIT B_DECISION_LEDGER

set -euo pipefail

printf '{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "TURN DISCIPLINE — SEVEN ACTIVE ENFORCEMENTS:\\n\\n1. B_OPTIMAL_NEXT_STEP (user directive S012):\\n   End every SUBSTANTIVE response with a \\u25b6 OPTIMAL NEXT STEP block.\\n   Format: action (specific) | context (what it unlocks) | reasoning (why now).\\n   Exempt: pure conversational exchanges with zero actionable work.\\n\\n2. CONCEPT_LOAD — P-META-020 per-input spine selection (mandatory):\\n   Before processing this input, identify the governing L2 spine:\\n     Governor directive / ratification   \\u2192 GVRN L2 (decision rights)\\n     Implementation / schema / code      \\u2192 ARCH L2 (data domain)\\n     AI behavior / inner-defaults        \\u2192 AI L2 (inner-defaults domain)\\n     Validation / evidence / ZF claim    \\u2192 VALD L2 (coverage discipline)\\n     External content / research         \\u2192 AI L2 (alignment) + VAULT_DEFER\\n\\n3. ZF ITERATION AWARENESS:\\n   DONE/COMPLETE/RATIFIED claim requires THIS-SESSION verify evidence.\\n   Memory of earlier runs is NOT evidence. Re-run IS the proof.\\n   Nominal ZF (bypass/timestamp-touch) = primary structural failure mode.\\n\\n4. SINGLE-SOURCE NAVIGATION WARNING (S014 discovery):\\n   For CONSEQUENTIAL decisions, consult ALL signals before proposing advance:\\n     (a) session-state.json mandate (planned sequence)\\n     (b) PENDING VLTs — validate-vlt-blocking (unresolved blockers)\\n     (c) open-plan-levels (open obligations)\\n     (d) PE scoring (current priority ordering)\\n   ALL FOUR must agree. Consulting ONLY session-state = satisfaction point.\\n\\n5. CONFIG HIERARCHY WARNING (S014 canonical discovery):\\n   If this turn creates/modifies any hierarchical config:\\n   EXPLICIT OVER IMPLICIT — every critical field declared at THIS level.\\n   Do NOT assume parent values are inherited. Silent override pattern:\\n     child has OBJECT but not FIELD \\u2192 system uses DEFAULT not parent.\\n\\n6. IZFC — Iterative Zero-Finding Cycles (completion standard; Governor S078; RZF term retired):\\n   A claim is complete when examination from independent ANGLES repeatedly finds nothing new.\\n   Excellence-of-completion is the goal; honesty (no inventing/assuming/papering-over) is its floor.\\n   Each cycle = one fresh sweep from a new orientation; continue until a new sweep finds nothing.\\n   COUNT IS MEASUREMENT — it may be 1 or 7, never a target. Re-checking the prior-cycle area\\n   is NOT a new cycle (this is re-verification). Examples in feedback_izfc_excellence_completion.md\\n   are SAMPLES to reach the essence — NEVER a template to replay. Nominal failure: same count\\n   every turn, or \\"0 new\\" without naming the fresh angle swept, or stopping because completion\\n   felt obvious — that feeling is the trigger to look harder, not to stop.\\n   ALSO: Every response to Opus MUST start: \\"Opus, this is Sonnet.\\"\\n   Exempt: pure conversational replies with zero actionable claims.\\n\\n7. B_CHALLENGE_ON_MERIT + B_DECISION_LEDGER (S089 CONSTITUTIONAL — RIGID):\\n   CHALLENGE-ON-MERIT: PCR on ANY consequential issue, including Governor directives.\\n   Agreement allowed ONLY when it is the meritful conclusion (not because of authority).\\n   Banned structural markers: bare agreement-filler (great point / per your insistence /\\n   agreement without evidence) with NO adjacent merit-reasoning in council comms.\\n   validate-challenge-on-merit.mjs guards council comms (BLOCKING on bare filler).\\n   DECISION LEDGER: every consequential plan must record chosen option +\\n   >=1 rejected option WITH reasoning. Fuel of the Humble Engine (CIE memory).\\n   validate-decision-ledger.mjs guards structural integrity (malformed ledger = BLOCKING).\\n   Exempt: conversational replies with no decisions."
  }
}'

exit 0
