#!/usr/bin/env bash
# Behavioral test: validate-zf-cycle-format.mjs
# Verifies that the validator catches nominal ZF cycles (INPUT A)
# and passes file-citing ZF cycles (INPUT B).
#
# Usage: bash tools/tests/behavioral/zf-cycle-format-test.sh
# Exit: 0 = both cases pass | 1 = behavioral guarantee violated
#
# This is CSPS's first behavioral test. A solution that hasn't been tested
# against a known violation is a description, not a solution.
# context_question: Does the validator catch 'areas'/'no new findings' without file names?

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="${REPO_ROOT}/tools/validators/validate-zf-cycle-format.mjs"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

PASS=0
FAIL=0

check() {
  local name="$1" expected_exit="$2" file="$3"
  local actual_exit=0
  node "$VALIDATOR" "$file" 2>/dev/null || actual_exit=$?
  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit, expected=$expected_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (exit=$actual_exit, expected=$expected_exit)"
    FAIL=$((FAIL + 1))
  fi
}

# ── INPUT A: NOMINAL ZF (VIOLATING) ────────────────────────────────────────
# This is the exact pattern that K=6 has accumulated.
# Cycle 2 says "re-examined areas" — no file names. Claims ZF ACHIEVED.
# Expected: validator exits 1 (BLOCKING)
cat > "${TMP_DIR}/input-a.md" << 'EOF'
# Test: Nominal ZF pattern

ZF Cycle 1: found issues with the session close process.
Cycle 2: re-examined areas — no new findings. ZF ACHIEVED.
EOF

# ── INPUT B: COMPLIANT ZF (FILE-CITING) ───────────────────────────────────
# Cycle 2 names specific files with extensions.
# Expected: validator exits 0 (CLEAN)
cat > "${TMP_DIR}/input-b.md" << 'EOF'
# Test: Compliant ZF pattern

ZF Cycle 1: found that GRID-CONSCIOUSNESS.md lacked context_quote field at line 17.
Cycle 2: re-examined GRID-CONSCIOUSNESS.md line 17 and DEFAULT-STORAGE-IS-EPHEMERAL.md line 16 — both confirmed present. ZF ACHIEVED.
EOF

echo ""
echo "validate-zf-cycle-format.mjs behavioral test"
echo ""
check "INPUT A (nominal: 'areas' + no file names) → BLOCKING (exit=1)" 1 "${TMP_DIR}/input-a.md"
check "INPUT B (file-citing: GRID-CONSCIOUSNESS.md named) → CLEAN (exit=0)" 0 "${TMP_DIR}/input-b.md"

echo ""
echo "$((PASS + FAIL)) test(s): $PASS passed, $FAIL failed"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BEHAVIORAL GUARANTEE VIOLATED: validate-zf-cycle-format.mjs is not catching nominal ZF cycles."
  echo "Gap gap_ZF_NOMINAL_CYCLES (K=6) is NOT structurally fixed — the validator is a description."
  exit 1
fi

echo "Behavioral guarantee confirmed: nominal ZF cycles are detected, compliant cycles pass."
exit 0
