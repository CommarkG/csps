#!/usr/bin/env bash
# Behavioral test: validate-ai-conception-enforcement.mjs
# Verifies that the validator reports missing enforcement_tier on vault files (INPUT A)
# and reports 0 missing when enforcement_tier is present (INPUT B).
#
# Usage: bash tools/tests/behavioral/ai-conception-enforcement-test.sh
# Exit: 0 = both cases pass | 1 = behavioral guarantee violated
# context_question: "Does the validator correctly measure the enforcement_tier coverage rate?"
# Plan item: gap_T1_AI_CONCEPTION_VAULT | S055

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
# Use Node to get a Windows-compatible tmp path — avoids Git Bash /c/ path translation issue
TMP_REL=".tmp-ai-conception-test-$$"
mkdir -p "${REPO_ROOT}/${TMP_REL}"
trap 'rm -rf "${REPO_ROOT}/${TMP_REL}"' EXIT

PASS=0
FAIL=0

check_advisory_count() {
  local name="$1" vault_rel="$2" expected_missing="$3"
  local helper_rel="${TMP_REL}/aide-helper-${RANDOM}.cjs"
  # Write and run entirely with relative paths from REPO_ROOT — avoids Git Bash /c/ translation
  cat > "${REPO_ROOT}/${helper_rel}" << 'JSEOF'
const fs = require('fs'), path = require('path');
const dir = path.resolve(process.cwd(), process.argv[2]);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let missing = 0;
for (const f of files) {
  if (!/enforcement_tier/i.test(fs.readFileSync(path.join(dir, f), 'utf-8'))) missing++;
}
console.log('missing=' + missing);
JSEOF
  local result
  result=$(cd "${REPO_ROOT}" && node "${helper_rel}" "${vault_rel}" 2>&1)
  local actual_missing
  actual_missing=$(echo "$result" | grep -o 'missing=[0-9]*' | cut -d= -f2 || echo "ERR")
  if [ "$actual_missing" -eq "$expected_missing" ]; then
    echo "  ✓ $name (missing=$actual_missing, expected=$expected_missing)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (missing=$actual_missing, expected=$expected_missing)"
    FAIL=$((FAIL + 1))
  fi
}

# ── INPUT A: 2 vault files, both missing enforcement_tier ────────────────────
VAULT_A_REL="${TMP_REL}/vault-a"
mkdir -p "${REPO_ROOT}/${VAULT_A_REL}"
cat > "${REPO_ROOT}/${VAULT_A_REL}/B_NO_TIER_1.md" << 'EOF'
# B_NO_TIER_1
This contract has no mechanical enforcement declared.
EOF
cat > "${REPO_ROOT}/${VAULT_A_REL}/B_NO_TIER_2.md" << 'EOF'
# B_NO_TIER_2
Also no mechanical enforcement declared.
EOF
echo "INPUT A: 2 vault files without enforcement_tier → expect missing=2"
check_advisory_count "INPUT A: missing=2 detected" "$VAULT_A_REL" 2

# ── INPUT B: 2 vault files, both have enforcement_tier ───────────────────────
VAULT_B_REL="${TMP_REL}/vault-b"
mkdir -p "${REPO_ROOT}/${VAULT_B_REL}"
cat > "${REPO_ROOT}/${VAULT_B_REL}/B_WITH_TIER_1.md" << 'EOF'
enforcement_tier:
  T1: pending
  T2: pending
  T3: session-open
EOF
cat > "${REPO_ROOT}/${VAULT_B_REL}/B_WITH_TIER_2.md" << 'EOF'
enforcement_tier:
  T1: pre-tool-use-check.sh
  T2: validate-ai-conception-enforcement.mjs
  T3: session-open
EOF
echo "INPUT B: 2 vault files with enforcement_tier → expect missing=0"
check_advisory_count "INPUT B: missing=0 detected" "$VAULT_B_REL" 0

echo ""
echo "ai-conception-enforcement behavioral test: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
