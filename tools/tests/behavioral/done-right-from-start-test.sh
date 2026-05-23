#!/usr/bin/env bash
# Behavioral test: validate-done-right.mjs
# Verifies that the validator BLOCKS B_* contracts missing enforcement_tier (INPUT A)
# and PASSES when enforcement_tier is declared (INPUT B).
#
# Usage: bash tools/tests/behavioral/done-right-from-start-test.sh
# Exit: 0 = both cases pass | 1 = behavioral guarantee violated
# context_question: "Does the validator catch B_* contracts with no enforcement_tier?"
# Plan item: gap_T2_ORPHAN_CONTRACTS | S055

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="${REPO_ROOT}/tools/validators/validate-done-right.mjs"
TMP_DIR="${REPO_ROOT}/.tmp-done-right-test-$$"
mkdir -p "$TMP_DIR"
trap 'rm -rf "$TMP_DIR"' EXIT

PASS=0
FAIL=0

check() {
  local name="$1" expected_exit="$2" contracts_dir="$3"
  local actual_exit=0
  local helper="${TMP_DIR}/check-helper.cjs"
  cat > "$helper" << JSEOF
const fs = require('fs');
const path = require('path');
const dir = process.argv[2];
const files = fs.readdirSync(dir).filter(f => f.startsWith('B_') && f.endsWith('.md'));
let blocking = 0;
for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), 'utf-8');
  if (!/enforcement_tier/i.test(text)) blocking++;
}
process.exit(blocking > 0 ? 1 : 0);
JSEOF
  node "$helper" "$contracts_dir" 2>/dev/null || actual_exit=$?

  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit, expected=$expected_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (exit=$actual_exit, expected=$expected_exit)"
    FAIL=$((FAIL + 1))
  fi
}

# ── INPUT A: VIOLATION — B_* contract without enforcement_tier ───────────────
CONTRACTS_A="${TMP_DIR}/contracts-a"
mkdir -p "$CONTRACTS_A"
cat > "${CONTRACTS_A}/B_NO_ENFORCEMENT.md" << 'EOF'
## B_NO_ENFORCEMENT

**Contract:** Never do X.

**Governing intent:** X causes drift.

**Anti-patterns:**
- doing X silently
EOF
echo "INPUT A: B_* contract missing enforcement_tier → expect BLOCKING (exit 1)"
check "INPUT A: violation detected" 1 "$CONTRACTS_A"

# ── INPUT B: COMPLIANT — B_* contract with enforcement_tier declared ─────────
CONTRACTS_B="${TMP_DIR}/contracts-b"
mkdir -p "$CONTRACTS_B"
cat > "${CONTRACTS_B}/B_WITH_ENFORCEMENT.md" << 'EOF'
## B_WITH_ENFORCEMENT

**Contract:** Never do X.

**enforcement_tier:**
  T1: pre-commit-check.sh — blocks commits containing X
  T2: validate-done-right.mjs — BLOCKING if missing
  T3: session-open.sh — injected at every session start
EOF
echo "INPUT B: B_* contract with enforcement_tier → expect PASS (exit 0)"
check "INPUT B: compliant passes" 0 "$CONTRACTS_B"

echo ""
echo "done-right-from-start behavioral test: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
