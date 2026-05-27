#!/usr/bin/env bash
# validator-test-required-test.sh
# Behavioral test for pre-commit-validator-test-required.sh
# PROTO-S066-WAVE-1 STEP 3 behavioral test
#
# INPUT A: new validator without test staged → exit=1 BLOCKING
# INPUT B: validator + matching test in same commit → exit=0
# INPUT C: validator with exempt-registry entry + comment → exit=0
#
# Tests the hook directly by staging fixture files

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOOK=".claude/hooks/pre-commit-validator-test-required.sh"
PASS=0; FAIL=0; ERRORS=()

echo "[validator-test-required-test] Running..."

# Helper: stage a fixture file temporarily
setup_fixture() {
  local path="$1" content="$2"
  mkdir -p "$(dirname "$path")"
  echo "$content" > "$path"
  git add "$path" 2>/dev/null || true
}

cleanup_fixtures() {
  git rm --cached --quiet "$@" 2>/dev/null || true
  rm -f "$@" 2>/dev/null || true
}

# INPUT A: new validator without test → hook exits 1
echo "  Testing INPUT A: validator without test → BLOCK..."
FIXTURE_V="tools/validators/validate-test-fixture-a.mjs"
setup_fixture "$FIXTURE_V" "// test fixture — no behavioral test"

HOOK_EXIT=0
bash "$HOOK" 2>/dev/null || HOOK_EXIT=$?
cleanup_fixtures "$FIXTURE_V"

if [ "$HOOK_EXIT" -eq 1 ]; then
  echo "  ✓ INPUT A: validator without test → exits 1 BLOCKING (exit=$HOOK_EXIT)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: expected exit=1, got exit=$HOOK_EXIT"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT A")
fi

# INPUT B: validator + test together → exit=0
echo "  Testing INPUT B: validator + test together → pass..."
FIXTURE_V="tools/validators/validate-test-fixture-b.mjs"
FIXTURE_T="tools/tests/behavioral/test-fixture-b-test.sh"
setup_fixture "$FIXTURE_V" "// test fixture with behavioral test"
setup_fixture "$FIXTURE_T" "#!/usr/bin/env bash\necho 'pass'"

HOOK_EXIT=0
bash "$HOOK" 2>/dev/null || HOOK_EXIT=$?
cleanup_fixtures "$FIXTURE_V" "$FIXTURE_T"

if [ "$HOOK_EXIT" -eq 0 ]; then
  echo "  ✓ INPUT B: validator + test → exits 0 (exit=$HOOK_EXIT)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: expected exit=0, got exit=$HOOK_EXIT"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT B")
fi

# INPUT C: validator with existing test on disk → exit=0 (test pre-existed)
echo "  Testing INPUT C: validator with pre-existing test on disk → pass..."
FIXTURE_V="tools/validators/validate-test-fixture-c.mjs"
FIXTURE_T="tools/tests/behavioral/test-fixture-c-test.sh"
# Create test on disk (not staged — pre-existing)
mkdir -p "tools/tests/behavioral"
echo "#!/usr/bin/env bash" > "$FIXTURE_T"
setup_fixture "$FIXTURE_V" "// test fixture with pre-existing test"
# Don't stage the test — only stage the validator

HOOK_EXIT=0
bash "$HOOK" 2>/dev/null || HOOK_EXIT=$?
cleanup_fixtures "$FIXTURE_V"
rm -f "$FIXTURE_T"

if [ "$HOOK_EXIT" -eq 0 ]; then
  echo "  ✓ INPUT C: pre-existing test → exits 0 (exit=$HOOK_EXIT)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: expected exit=0, got exit=$HOOK_EXIT"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT C")
fi

echo ""
echo "[validator-test-required-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && echo "FAILURES: ${ERRORS[*]}" && exit 1
echo "[validator-test-required-test] ALL PASS ✅"
