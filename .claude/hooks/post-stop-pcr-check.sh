#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-pcr-check
# @csps-name post-stop-pcr-check
# @csps-description PostStop hook — scans last AI response for multi-option decisions
#   without PCR (Pros/Cons/Recommendation) structure. Advisory — exits 0 always.
#   PRACE: Training default = present options without PCR (satisfying to user, incomplete governance).
#          Satisfaction point = "I gave choices." CSPS override = PCR required for non-trivial decisions.
#   Promoted from STUB to ADVISORY S041 Sprint 1 — addresses Core Scopes S3 prevention gap.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-OP-003 B_PCR_FOR_DECISIONS B_PRACE

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  echo "[pcr-check] no transcript path — skipping (session=${SESSION_ID})"
  exit 0
fi

# Read last ~3000 chars of transcript for recent AI content
RECENT=$(tail -c 3000 "$TRANSCRIPT_PATH" 2>/dev/null || echo "")

# Detect multi-option patterns
HAS_OPTIONS=false
if echo "$RECENT" | grep -Eqi '(should we|which approach|Option [A-C]\b|option [0-9]\b|alternatives|either.*or|A vs B|PCR|decide between|choose between)'; then
  HAS_OPTIONS=true
fi

# Detect PCR structure
HAS_PCR=false
if echo "$RECENT" | grep -Eqi '(Pros:|Cons:|Recommendation:|## Pros|## Cons|\*\*Pros|\*\*Cons)'; then
  HAS_PCR=true
fi

# Detect explicit trivial-reversible skip
HAS_SKIP=false
if echo "$RECENT" | grep -Eqi '(trivial.reversible|skipping PCR|skip.*PCR)'; then
  HAS_SKIP=true
fi

if [ "$HAS_OPTIONS" = "true" ] && [ "$HAS_PCR" = "false" ] && [ "$HAS_SKIP" = "false" ]; then
  echo "[pcr-check] ADVISORY: multi-option response detected without PCR structure (session=${SESSION_ID})"
  echo "[pcr-check] B_PCR_FOR_DECISIONS: Pros/Cons/Recommendation required for non-trivial decisions"
  echo "[pcr-check] Add PCR block or note: 'trivial-reversible — skipping PCR per [reason]'"
else
  echo "[pcr-check] ✓ PCR check passed (session=${SESSION_ID} timestamp=${TIMESTAMP})"
fi

exit 0
