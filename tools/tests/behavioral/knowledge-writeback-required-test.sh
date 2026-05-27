#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.knowledge-writeback-required-test
# @csps-name knowledge-writeback-required-test
# @csps-description Behavioral test for pre-commit-knowledge-writeback-required.sh (C9 prevention)
#   INPUT A: No staged files → hook silent, exit 0
#   INPUT B: Hook file exists and is executable
#   INPUT C: hook exits 0 on current clean repo state (advisory mode)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOOK=".claude/hooks/pre-commit-knowledge-writeback-required.sh"
PASS=0; FAIL=0

echo "[knowledge-writeback-required-test] Running 3 behavioral inputs..."

# ── INPUT A: no staged files → silent pass ────────────────────────────────────
# The hook reads git diff --cached. With nothing staged, should exit 0 silently.
# We test by running it directly (no staged changes in test context).
OUTPUT_A=$(bash "$HOOK" 2>&1)
EXIT_A=$?
if [ "$EXIT_A" -eq 0 ]; then
  echo "  ✓ INPUT A: no staged files → hook exits 0 (C9 no-op when nothing staged)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: unexpected exit $EXIT_A"
  FAIL=$((FAIL + 1))
fi

# ── INPUT B: hook file exists and is executable ───────────────────────────────
if [ -f "$HOOK" ] && [ -x "$HOOK" ]; then
  echo "  ✓ INPUT B: pre-commit-knowledge-writeback-required.sh exists + executable"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: hook missing or not executable"
  FAIL=$((FAIL + 1))
fi

# ── INPUT C: hook exits 0 (ADVISORY mode — S067) ─────────────────────────────
OUTPUT_C=$(bash "$HOOK" 2>&1)
EXIT_C=$?
if [ "$EXIT_C" -eq 0 ]; then
  echo "  ✓ INPUT C: hook exits 0 (ADVISORY S067 — C9 correct phased rollout)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: unexpected exit $EXIT_C (should be advisory only in S067)"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[knowledge-writeback-required-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
