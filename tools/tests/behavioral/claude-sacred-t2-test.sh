#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.claude-sacred-t2-test
# @csps-name claude-sacred-t2-test
# @csps-description Behavioral test for commit-msg claude-sacred-t2 guard (PROTO-S069-SACRED-T2)
#   INPUT A: L1_CORE_GVRN.md staged + NO approval token → exit 2 (block)
#   INPUT B: L1_CORE_GVRN.md staged + SACRED-EDIT-APPROVED token → exit 0 (pass)
#   INPUT C: non-sacred file (tools/*.mjs) staged → exit 0 (no check)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOOK="tools/scripts/git-hooks/commit-msg"
L1_GVRN=".claude/core-spines/L1_CORE_GVRN.md"
PASS=0; FAIL=0

echo "[claude-sacred-t2-test] Running 3 behavioral inputs (stage=commit-msg, SACRED set=7 paths)..."

# ── INPUT A: L1_CORE sacred staged + NO token → exit 2 ──────────────────────
echo "  Testing INPUT A: L1_CORE_GVRN.md staged + no approval token → blocked..."
# Add a comment line (quickly reversible)
echo "# T2-test-marker" >> "$L1_GVRN"
git add "$L1_GVRN" 2>/dev/null

TMPFILE=$(mktemp)
echo "fix: routine maintenance" > "$TMPFILE"
EXIT_A=0; bash "$HOOK" "$TMPFILE" 2>/dev/null || EXIT_A=$?
rm -f "$TMPFILE"

# Restore immediately
git checkout HEAD -- "$L1_GVRN" 2>/dev/null
git reset HEAD "$L1_GVRN" 2>/dev/null || true

if [ "$EXIT_A" -eq 2 ]; then
  echo "  ✓ INPUT A: L1_CORE_GVRN.md staged + no token → exit 2 (BLOCKED)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: expected exit 2, got $EXIT_A (check if L1_CORE staged correctly)"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: sacred staged + SACRED-EDIT-APPROVED token → pass ──────────────
echo "  Testing INPUT B: L1_CORE_GVRN.md staged + approval token → pass..."
echo "# T2-test-marker-B" >> "$L1_GVRN"
git add "$L1_GVRN" 2>/dev/null

TMPFILE=$(mktemp)
echo "feat: L1 amendment SACRED-EDIT-APPROVED:ADR-approved architectural amendment" > "$TMPFILE"
EXIT_B=0; bash "$HOOK" "$TMPFILE" 2>/dev/null || EXIT_B=$?
rm -f "$TMPFILE"

git checkout HEAD -- "$L1_GVRN" 2>/dev/null
git reset HEAD "$L1_GVRN" 2>/dev/null || true

if [ "$EXIT_B" -eq 0 ]; then
  echo "  ✓ INPUT B: L1_CORE staged + approval token → exit 0 (PASSED with token)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: expected exit 0, got $EXIT_B"
  FAIL=$((FAIL + 1))
fi

# ── INPUT C: non-sacred (tools/validators/) staged → pass ───────────────────
echo "  Testing INPUT C: non-sacred tools/ file staged → pass..."
# Use the nodefile validator (known to exist)
echo "// T2-test-comment" >> tools/validators/validate-nodefile-compliance.mjs
git add tools/validators/validate-nodefile-compliance.mjs 2>/dev/null

TMPFILE=$(mktemp)
echo "fix: minor validator improvement" > "$TMPFILE"
EXIT_C=0; bash "$HOOK" "$TMPFILE" 2>/dev/null || EXIT_C=$?
rm -f "$TMPFILE"

git checkout HEAD -- tools/validators/validate-nodefile-compliance.mjs 2>/dev/null
git reset HEAD tools/validators/validate-nodefile-compliance.mjs 2>/dev/null || true

if [ "$EXIT_C" -eq 0 ]; then
  echo "  ✓ INPUT C: non-sacred file staged → exit 0 (not in sacred set)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: expected exit 0, got $EXIT_C"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[claude-sacred-t2-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
