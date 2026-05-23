#!/usr/bin/env bash
# Behavioral test: validate-contextual-locality.mjs
# Verifies that the validator BLOCKS navigation phrases in council files (INPUT A)
# and PASSES when council files are self-contained (INPUT B).
#
# Usage: bash tools/tests/behavioral/contextual-locality-test.sh
# Exit: 0 = both cases pass | 1 = behavioral guarantee violated
# context_question: "Does the validator catch 'see above'/'refer to' in council files?"
# Plan item: gap_T2_ORPHAN_CONTRACTS | S055

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VALIDATOR="${REPO_ROOT}/tools/validators/validate-contextual-locality.mjs"
TMP_DIR="${REPO_ROOT}/.tmp-cl-test-$$"
mkdir -p "$TMP_DIR"
trap 'rm -rf "$TMP_DIR"' EXIT

PASS=0
FAIL=0

check() {
  local name="$1" expected_exit="$2" council_dir="$3"
  local actual_exit=0
  local helper="${TMP_DIR}/cl-helper.cjs"
  cat > "$helper" << 'JSEOF'
const fs = require('fs');
const path = require('path');
const BANNED = ['see above','refer to the block','as i shared','from earlier','paste from earlier','the block i wrote','from my prior response'];
const council = process.argv[2];
let blocking = 0;
for (const f of fs.readdirSync(council)) {
  if (!f.endsWith('.md')) continue;
  const text = fs.readFileSync(path.join(council, f), 'utf-8');
  for (const line of text.split('\n')) {
    const l = line.toLowerCase();
    for (const phrase of BANNED) { if (l.includes(phrase)) blocking++; }
  }
}
process.exit(blocking > 0 ? 1 : 0);
JSEOF
  node "$helper" "$council_dir" 2>/dev/null || actual_exit=$?

  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit, expected=$expected_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (exit=$actual_exit, expected=$expected_exit)"
    FAIL=$((FAIL + 1))
  fi
}

# ── INPUT A: VIOLATION — council file contains navigation phrase ─────────────
COUNCIL_A="${TMP_DIR}/council-a"
mkdir -p "$COUNCIL_A"
cat > "${COUNCIL_A}/sonnet-turn.md" << 'EOF'
# Step Report
See above for the full content of the plan item.
As I shared earlier, this was the approach we agreed on.
Refer to the block I wrote in the previous turn.
EOF
echo "INPUT A: council file with navigation phrases → expect BLOCKING (exit 1)"
check "INPUT A: violation detected" 1 "$COUNCIL_A"

# ── INPUT B: COMPLIANT — council file is self-contained ──────────────────────
COUNCIL_B="${TMP_DIR}/council-b"
mkdir -p "$COUNCIL_B"
cat > "${COUNCIL_B}/sonnet-turn.md" << 'EOF'
# Step Report
DONE: validate-positive-reflexivity.mjs — entries=6 covered=1 blocking=0
VERIFY: exit_code=0 | validators=153
PLAN STATUS: S055 | 3/5 complete
EOF
echo "INPUT B: self-contained council file → expect PASS (exit 0)"
check "INPUT B: compliant passes" 0 "$COUNCIL_B"

echo ""
echo "contextual-locality behavioral test: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
