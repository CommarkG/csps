#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.plan-coverage-t2-test
# @csps-name plan-coverage-t2-test
# @csps-description Behavioral test for pre-commit-plan-coverage.sh (T2 enforcement)
#   INPUT A: new libs/ file without covered plan → exits 2 (BLOCKS commit)
#   INPUT B: edit to existing libs/ file → exits 0 (passes, edits not checked)
#   INPUT C: new file outside libs/ → exits 0 (only libs/ is gate-checked)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOOK=".claude/hooks/pre-commit-plan-coverage.sh"
PASS=0; FAIL=0

echo "[plan-coverage-t2-test] Running 3 behavioral inputs (T2 pre-commit enforcement)..."

# ── INPUT A: new libs/ file without plan → exit 2 ────────────────────────────
echo "  Testing INPUT A: new libs/ file without covered_paths → blocked..."
echo "// T2 test fixture" > libs/T2-TEST-NOCOVERAGE.ts
git add libs/T2-TEST-NOCOVERAGE.ts 2>/dev/null
EXIT_A=0; bash "$HOOK" 2>/dev/null || EXIT_A=$?
git reset HEAD libs/T2-TEST-NOCOVERAGE.ts 2>/dev/null; rm -f libs/T2-TEST-NOCOVERAGE.ts

if [ "$EXIT_A" -eq 2 ]; then
  echo "  ✓ INPUT A: new libs/ file without plan → exit 2 (BLOCKED)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: expected exit 2, got $EXIT_A"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: edit to existing libs/ file → exit 0 ────────────────────────────
echo "  Testing INPUT B: edit to existing libs/ file → passes (edits not checked)..."
# Stage an edit (not add) to an existing file
EXISTING_LIB=$(find libs/ -name "*.ts" -not -path "*/node_modules/*" | head -1)
if [ -n "$EXISTING_LIB" ]; then
  echo "// T2 test edit marker" >> "$EXISTING_LIB"
  git add "$EXISTING_LIB" 2>/dev/null
  EXIT_B=0; bash "$HOOK" 2>/dev/null || EXIT_B=$?
  git checkout HEAD -- "$EXISTING_LIB" 2>/dev/null
  git reset HEAD "$EXISTING_LIB" 2>/dev/null || true
  if [ "$EXIT_B" -eq 0 ]; then
    echo "  ✓ INPUT B: edit to existing libs/ file → exit 0 (edits not gate-checked)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ INPUT B: expected exit 0, got $EXIT_B"
    FAIL=$((FAIL + 1))
  fi
else
  echo "  ✓ INPUT B: no existing libs/*.ts to test with → skip (advisory pass)"
  PASS=$((PASS + 1))
fi

# ── INPUT C: new file outside libs/ → exit 0 ─────────────────────────────────
echo "  Testing INPUT C: new file outside libs/ → passes (only libs/ gated)..."
echo "// T2 test outside libs" > tools/T2-TEST-OUTSIDE.ts
git add tools/T2-TEST-OUTSIDE.ts 2>/dev/null
EXIT_C=0; bash "$HOOK" 2>/dev/null || EXIT_C=$?
git reset HEAD tools/T2-TEST-OUTSIDE.ts 2>/dev/null; rm -f tools/T2-TEST-OUTSIDE.ts

if [ "$EXIT_C" -eq 0 ]; then
  echo "  ✓ INPUT C: new file outside libs/ → exit 0 (not gate-checked)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: expected exit 0, got $EXIT_C"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[plan-coverage-t2-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
