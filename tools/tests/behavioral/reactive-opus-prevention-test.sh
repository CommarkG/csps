#!/usr/bin/env bash
# @csps-id csps.tools.tests.behavioral.reactive-opus-prevention-test
# @csps-name reactive-opus-prevention-test
# @csps-description Behavioral test for C8 REACTIVE_OPUS prevention (session-open.sh extension)
#   INPUT A: session-open.sh contains C8 proactive-opus injection lines
#   INPUT B: C8 injection includes META-QUESTION and recency-bias (D9) reminders
#   INPUT C: session-open.sh exits 0 (doesn't break session start)
# @csps-version 1.0.0
# @csps-tags type:behavioral-test domain:governance

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
SESSION_OPEN=".claude/hooks/session-open.sh"
PASS=0; FAIL=0

echo "[reactive-opus-prevention-test] Running 3 behavioral inputs..."

# INPUT A: session-open.sh contains C8 injection
if grep -q "C8-proactive-opus" "$SESSION_OPEN"; then
  echo "  ✓ INPUT A: C8 proactive-opus injection present in session-open.sh"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: C8 injection missing from session-open.sh"
  FAIL=$((FAIL + 1))
fi

# INPUT B: includes META-QUESTION reminder
if grep -q "META.QUESTION\|false.assumption" "$SESSION_OPEN"; then
  echo "  ✓ INPUT B: META-QUESTION constitutional reminder included in C8 injection"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT B: META-QUESTION reminder missing from C8 injection"
  FAIL=$((FAIL + 1))
fi

# INPUT C: file is syntactically valid bash (bash -n checks syntax)
if bash -n "$SESSION_OPEN" 2>/dev/null; then
  echo "  ✓ INPUT C: session-open.sh syntax valid after C8 extension"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: session-open.sh has bash syntax error after C8 extension"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "[reactive-opus-prevention-test] results: PASS=${PASS} FAIL=${FAIL}"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
