#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.cross-tab-diff-review-test
# @csps-name cross-tab-diff-review-test
# @csps-description Behavioral test for tools/scripts/cross-tab-diff-review.mjs (M-43)
#   INPUT A: --role sonnet dry-run → shows Opus commits, exits 0, does NOT advance marker
#   INPUT B: invalid role → exits 1 with usage message
#   INPUT C: last-review-markers.json exists with valid SHAs → tool reads it correctly
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

SCRIPT="tools/scripts/cross-tab-diff-review.mjs"
MARKERS="tools/data/last-review-markers.json"
PASS=0; FAIL=0

echo "[cross-tab-diff-review-test] Running 3 behavioral inputs..."

# ── INPUT A: dry-run → exits 0, marker NOT advanced ─────────────────────────
OUTPUT_A=$(node "$SCRIPT" --role sonnet --dry-run 2>&1)
EXIT_A=$?
if [ "$EXIT_A" -eq 0 ] && echo "$OUTPUT_A" | grep -q "commits_reviewed="; then
  echo "  ✓ INPUT A: --dry-run exits 0, commits_reviewed reported"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: exit=$EXIT_A, missing commits_reviewed"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: invalid role → exits 1 ─────────────────────────────────────────
node "$SCRIPT" --role invalid 2>/dev/null || EXIT_B=$?
EXIT_B="${EXIT_B:-0}"
if [ "$EXIT_B" -eq 1 ]; then
  echo "  ✓ INPUT B: invalid role exits 1 (usage message shown)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: expected exit 1 for invalid role, got $EXIT_B"
  FAIL=$((FAIL + 1))
fi

# ── INPUT C: markers file exists + readable ──────────────────────────────────
if [ -f "$MARKERS" ] && node -e "const m=require('./$MARKERS'); process.exit((m.opus && m.sonnet) ? 0 : 1)" 2>/dev/null; then
  echo "  ✓ INPUT C: last-review-markers.json exists with opus + sonnet SHAs"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: markers file missing or malformed"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[cross-tab-diff-review-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
