#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-pnpm-verify
# @csps-name post-stop-pnpm-verify
# @csps-description Stop hook — runs pnpm verify after every AI response and injects
#   ZF evidence + reasoning. If verify fails: blocks with systemMessage.
#   If open-plan-levels > 0: injects ZF iteration reasoning (why nominal ZF is worse
#   than acknowledged failure). Closes the nominal-RZF anti-pattern mechanically.
#   Per P-META-006 (RZF) + P-META-008 (B_PRE_CLOSE_VERIFICATION) + P-META-020.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-006 P-META-008 P-META-020 B_PRE_CLOSE_VERIFICATION B_RZF

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

# Run pnpm verify (skip install for speed)
VERIFY_EXIT=0
VERIFY_OUTPUT=""
VERIFY_OUTPUT=$(node "${REPO_ROOT}/tools/verify.mjs" --skip-install 2>&1) || VERIFY_EXIT=$?

# Extract key metrics
PASS_COUNT=$(echo "$VERIFY_OUTPUT" | grep -c '"status": "PASS"' || echo "0")
FAIL_COUNT=$(echo "$VERIFY_OUTPUT" | grep -c '"status": "FAIL"' || echo "0")

if [ "$VERIFY_EXIT" -ne 0 ] || [ "$FAIL_COUNT" -gt 0 ]; then
  # BLOCK: verify failed — extract failures
  FAILURES=$(echo "$VERIFY_OUTPUT" | grep -A2 '"status": "FAIL"' | grep '"name"' | sed 's/.*"name": "\([^"]*\)".*/\1/' | tr '\n' ', ' || echo "unknown")

  printf '{
    "systemMessage": "[post-stop-pnpm-verify] VERIFY FAILED — exit_code=%s | failing: %s\\n\\nPer P-META-006 RZF: no DONE claim is valid without THIS-SESSION verify exit_code 0.\\nFix the failures before proceeding. Nominal ZF is NOT acceptable.",
    "continue": false,
    "stopReason": "pnpm verify failed (exit %s). Fix before continuing: %s"
  }' "$VERIFY_EXIT" "$FAILURES" "$VERIFY_EXIT" "$FAILURES"
  exit 1
fi

# Check open-plan-levels for advisory state
OPEN_ITEMS=0
OPEN_SUMMARY=""
OPEN_OUTPUT=$(node "${REPO_ROOT}/tools/validators/validate-open-plan-levels.mjs" 2>&1) || true
OPEN_MATCH=$(echo "$OPEN_OUTPUT" | grep "total_open_items=" || echo "total_open_items=0")
OPEN_ITEMS=$(echo "$OPEN_MATCH" | grep -o "total_open_items=[0-9]*" | cut -d= -f2 || echo "0")

if [ "$OPEN_ITEMS" -gt 0 ]; then
  # ADVISORY: inject ZF reasoning — don't block but make visible
  printf '{
    "systemMessage": "[post-stop-pnpm-verify] PASS (exit_code 0, %s active validators) | %s open plan items (advisory)\\n\\nZF DISCIPLINE: %s open items are obligations, not options (P-META-020).\\nNominal ZF = passing by timestamp-touch or bypassing checks = false confidence.\\nReal ZF = each item either resolved or explicitly deferred with documented reasoning.\\nSilent accumulation across sessions = foundation-slices L3 pattern (3 sessions orphaned).\\nNext action: classify each open item as DONE (update checkbox) or DEFERRED (document why)."
  }' "$PASS_COUNT" "$OPEN_ITEMS"
else
  # CLEAN: verify passes, no open items
  printf '{
    "systemMessage": "[post-stop-pnpm-verify] PASS (exit_code 0, %s validators) | 0 open plan items | ZF: CLEAN at %s"
  }' "$PASS_COUNT" "$TIMESTAMP"
fi

exit 0
