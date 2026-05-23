#!/usr/bin/env bash
# Behavioral test: validate-apps-are-trials.mjs
# Verifies that the validator BLOCKS when an app reimplements a @csps/* libs package (INPUT A)
# and PASSES when apps/ contains only app-specific code (INPUT B).
#
# Usage: bash tools/tests/behavioral/apps-are-trials-test.sh
# Exit: 0 = both cases pass | 1 = behavioral guarantee violated
# context_question: "Does the validator catch apps/* reimplementing @csps/* packages?"
# Plan item: gap_T2_ORPHAN_CONTRACTS | S055

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="${REPO_ROOT}/tools/validators/validate-apps-are-trials.mjs"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

PASS=0
FAIL=0

check() {
  local name="$1" expected_exit="$2"
  shift 2
  local actual_exit=0
  CSPS_TEST_ROOT="$TMP_DIR" node "$VALIDATOR" 2>/dev/null || actual_exit=$?
  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit, expected=$expected_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (exit=$actual_exit, expected=$expected_exit)"
    FAIL=$((FAIL + 1))
  fi
}

# ── INPUT A: VIOLATION — app reimplements a @csps/* package ─────────────────
# An apps/ subdirectory has a package.json that names a @csps/* package.
# This means the app is reimplementing permanent platform code.
# Expected: validator exits 1 (BLOCKING)
mkdir -p "${TMP_DIR}/apps/bad-app"
cat > "${TMP_DIR}/apps/bad-app/package.json" << 'EOF'
{
  "name": "@csps/libs-ui",
  "version": "0.0.1",
  "description": "Reimplementing the libs UI package inside an app"
}
EOF
mkdir -p "${TMP_DIR}/libs"
echo "INPUT A: app reimplements @csps/* package → expect BLOCKING (exit 1)"
check "INPUT A: violation detected" 1
rm -rf "${TMP_DIR}/apps" "${TMP_DIR}/libs"

# ── INPUT B: COMPLIANT — app has its own package.json with app-specific name ─
# An apps/ subdirectory has a package.json that does NOT name a @csps/* package.
# Expected: validator exits 0 (no platform reimplementation)
mkdir -p "${TMP_DIR}/apps/good-app"
cat > "${TMP_DIR}/apps/good-app/package.json" << 'EOF'
{
  "name": "csps-habit-tracker",
  "version": "0.0.1",
  "description": "App-specific package name — not reimplementing @csps/*"
}
EOF
mkdir -p "${TMP_DIR}/libs"
echo "INPUT B: app-specific package.json → expect PASS (exit 0)"
check "INPUT B: compliant passes" 0

echo ""
echo "apps-are-trials behavioral test: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
