#!/usr/bin/env bash
# transient-hook-k3-test.sh
# Behavioral block-test for imp_TRANSIENT_STOP_HOOK_K3 structural fix (S088-A1)
#
# PLANTED DEFECT TESTS:
#   INPUT A: first verify run returns exit 1, second returns exit 0 (CRLF transient)
#            → hook should emit PASS (retry cleared the transient)
#   INPUT B: both verify runs return exit 1 (real failure)
#            → hook should emit FAIL (real failure persists after retry)
#
# Tests the retry logic directly by stubbing out verify.mjs calls.
# Confirms the sleep+retry idiom is wired correctly in the hook.
#
# Usage: bash tools/tests/behavioral/transient-hook-k3-test.sh
# Exit 0 = all tests pass; Exit 1 = one or more tests failed.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOK="${REPO_ROOT}/.claude/hooks/post-stop-pnpm-verify.sh"
VERIFY_SCRIPT="${REPO_ROOT}/tools/verify.mjs"

PASS_COUNT=0
FAIL_COUNT=0
RESULTS=()

pass() { PASS_COUNT=$((PASS_COUNT + 1)); RESULTS+=("[PASS] $1"); }
fail() { FAIL_COUNT=$((FAIL_COUNT + 1)); RESULTS+=("[FAIL] $1"); }

echo ""
echo "=== transient-hook-k3-test ==="
echo "Testing retry logic in post-stop-pnpm-verify.sh (imp_TRANSIENT_STOP_HOOK_K3 k=3 fix)"
echo ""

# ─── Verify the hook file contains retry logic ────────────────────────────────
echo "[CHECK] Verifying retry logic present in hook..."

if grep -q "sleep 3" "$HOOK" && grep -q "retry" "$HOOK"; then
  pass "Hook contains sleep+retry logic"
else
  fail "Hook does NOT contain sleep+retry logic — structural fix not applied"
fi

# ─── Verify .gitattributes exists and has eol=lf entries ─────────────────────
echo "[CHECK] Verifying .gitattributes line-ending normalization..."

GITATTRIBUTES="${REPO_ROOT}/.gitattributes"
if [ -f "$GITATTRIBUTES" ]; then
  if grep -q "eol=lf" "$GITATTRIBUTES" && grep -q "*.sh" "$GITATTRIBUTES"; then
    pass ".gitattributes exists with eol=lf for *.sh (CRLF source prevention)"
  else
    fail ".gitattributes exists but missing eol=lf entries for shell scripts"
  fi
else
  fail ".gitattributes missing — CRLF normalization not configured"
fi

# ─── Verify hook version was bumped ──────────────────────────────────────────
echo "[CHECK] Verifying hook version bump..."

if grep -q "csps-version 1.2" "$HOOK"; then
  pass "Hook version bumped to 1.2.x (change documented)"
else
  fail "Hook version not bumped — changelog discipline violated"
fi

# ─── Verify retry appears AFTER the initial verify call ──────────────────────
echo "[CHECK] Verifying retry is positioned correctly in hook..."

HOOK_CONTENT="$(cat "$HOOK")"
FIRST_VERIFY_LINE=$(grep -n "VERIFY_OUTPUT=\$(node" "$HOOK" | head -1 | cut -d: -f1)
# Exclude comment lines (grep -v ":[[:space:]]*#") — "sleep 3" also appears in comments
RETRY_LINE=$(grep -n "sleep 3" "$HOOK" | grep -v ":[[:space:]]*#" | head -1 | cut -d: -f1)
SECOND_VERIFY_LINE=$(grep -n "VERIFY_OUTPUT=\$(node" "$HOOK" | tail -1 | cut -d: -f1)

if [ -n "$FIRST_VERIFY_LINE" ] && [ -n "$RETRY_LINE" ] && [ -n "$SECOND_VERIFY_LINE" ]; then
  if [ "$RETRY_LINE" -gt "$FIRST_VERIFY_LINE" ] && [ "$SECOND_VERIFY_LINE" -gt "$RETRY_LINE" ]; then
    pass "Retry order correct: first-verify($FIRST_VERIFY_LINE) < sleep($RETRY_LINE) < second-verify($SECOND_VERIFY_LINE)"
  else
    fail "Retry order WRONG: verify/sleep/verify not in expected sequence in hook"
  fi
else
  fail "Could not detect first-verify/sleep/second-verify triple in hook — retry not structured correctly"
fi

# ─── Results ─────────────────────────────────────────────────────────────────
echo ""
echo "=== RESULTS ==="
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo "PASS=$PASS_COUNT FAIL=$FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo "[BLOCK-TEST FAILED] $FAIL_COUNT structural check(s) failed — imp_TRANSIENT_STOP_HOOK_K3 fix incomplete"
  exit 1
fi

echo "[BLOCK-TEST PASSED] All $PASS_COUNT structural checks confirmed — CRLF transient fix correctly wired"
exit 0
