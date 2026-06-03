#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-decision-residue-capture
# @csps-name post-stop-decision-residue-capture
# @csps-description Stop hook — advisory check that PCR/option-set turns registered their residue.
#   P-META-033: every decision registers non-selected + deferred items to threshold before proceeding.
#   ADVISORY ONLY (exit 0 always). Zero verify-cycle cost (Stop hook, not a validator).
#   What it does: looks for PCR/option-set/decision markers in the last AI response; if found,
#   reminds that non-selected options should be in improvement-register/gap-register/floater-queue.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces P-META-033 (no-lost-threads)

set -euo pipefail

# Read last AI response from CLAUDE_LAST_RESPONSE (available in Stop hooks)
RESPONSE=
if [[ -z "$RESPONSE" ]]; then
  exit 0
fi

# Detect if the turn contained a decision/option-set/PCR block
PCR_DETECTED=false
if echo "$RESPONSE" | grep -qiE '(## pros|## cons|recommendation|option [A-Z]:|PCR for|options:|alternatives:|choose between|should we|which.*approach)'; then
  PCR_DETECTED=true
fi

if [[ "$PCR_DETECTED" == "true" ]]; then
  # Check if any register entry was mentioned (advisory — cannot inspect actual register state)
  if ! echo "$RESPONSE" | grep -qiE '(improvement-register|gap-register|floater-queue|HOLD list|queued|registered|deferred.*register)'; then
    printf '
[P-META-033 ADVISORY] Decision/option-set detected but no register entry observed.
' >&2
    printf '  Non-selected options should be in improvement-register/gap-register/floater-queue.
' >&2
    printf '  Disposition + decision back-ref required per P-META-033 (no-lost-threads).
' >&2
  fi
fi

# Always advisory — never block
exit 0
