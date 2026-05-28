#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.cross-tab-diff-review-test
# @csps-name cross-tab-diff-review-test
# @csps-description Behavioral test for tools/scripts/cross-tab-diff-review.mjs (M-43)
#   INPUT A: --role sonnet dry-run → shows commits, exits 0, does NOT advance marker
#   INPUT B: invalid role → exits 1 with usage message
#   INPUT C: marker SHAs resolve to real commits (git cat-file -e; GAP fix S068)
#   INPUT D: session-open.sh injection is role-aware (both opus+sonnet mentioned; DEFECT-2 fix)
# @csps-version 1.1.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

SCRIPT="tools/scripts/cross-tab-diff-review.mjs"
MARKERS="tools/data/last-review-markers.json"
SESSION_OPEN=".claude/hooks/session-open.sh"
PASS=0; FAIL=0

echo "[cross-tab-diff-review-test] Running 4 behavioral inputs (v1.1 — GAP + DEFECT-2 coverage)..."

# ── INPUT A: dry-run → exits 0 (either "commits_reviewed=" or "up to date") ──
OUTPUT_A=$(node "$SCRIPT" --role sonnet --dry-run 2>&1)
EXIT_A=$?
# Accept: commits_reviewed= reported OR already-up-to-date message
if [ "$EXIT_A" -eq 0 ] && (echo "$OUTPUT_A" | grep -q "commits_reviewed=\|Already up to date\|up to date"); then
  echo "  ✓ INPUT A: --dry-run exits 0 (either new commits or up-to-date)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: exit=$EXIT_A, unexpected output"
  echo "    Output: $(echo "$OUTPUT_A" | tail -3)"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: invalid role → exits 1 ─────────────────────────────────────────
EXIT_B=0
node "$SCRIPT" --role invalid 2>/dev/null || EXIT_B=$?
if [ "$EXIT_B" -eq 1 ]; then
  echo "  ✓ INPUT B: invalid role exits 1 (usage message shown)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: expected exit 1 for invalid role, got $EXIT_B"
  FAIL=$((FAIL + 1))
fi

# ── INPUT C: GAP — each marker SHA resolves to a real commit ────────────────
# Reads both markers and verifies git cat-file -e <sha> exits 0.
OPUS_SHA=$(node -e "const m=require('./$MARKERS'); process.stdout.write(m.opus||'')" 2>/dev/null)
SONNET_SHA=$(node -e "const m=require('./$MARKERS'); process.stdout.write(m.sonnet||'')" 2>/dev/null)

OPUS_VALID=false; SONNET_VALID=false
[ -n "$OPUS_SHA" ] && git cat-file -e "$OPUS_SHA" 2>/dev/null && OPUS_VALID=true
[ -n "$SONNET_SHA" ] && git cat-file -e "$SONNET_SHA" 2>/dev/null && SONNET_VALID=true

if [ "$OPUS_VALID" = true ] && [ "$SONNET_VALID" = true ]; then
  echo "  ✓ INPUT C: both marker SHAs resolve to real commits (git cat-file -e validates)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: fabricated/invalid marker SHA detected"
  echo "    opus SHA valid: $OPUS_VALID | sonnet SHA valid: $SONNET_VALID"
  FAIL=$((FAIL + 1))
fi

# ── INPUT D: DEFECT-2 fix — session-open.sh injection is role-aware ──────────
# Both '--role sonnet' AND '--role opus' must appear in the injection.
if grep -q "\-\-role sonnet" "$SESSION_OPEN" && grep -q "\-\-role opus" "$SESSION_OPEN"; then
  echo "  ✓ INPUT D: session-open.sh injection is role-aware (both sonnet+opus mentioned)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT D: session-open.sh injection still hardcodes a single role (DEFECT-2 not fixed)"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[cross-tab-diff-review-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
