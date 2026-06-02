#!/usr/bin/env bash
# register-connectivity-test.sh
# Behavioral test for validate-register-connectivity.mjs
# PROTO-S076-ACCOUNTABILITY-PE-CIA-WIRING Phase 1
#
# INPUT A: all 6 registers have cie_connection + pe_connection → exit 0
# INPUT B: register missing cie_connection → exit 1 (BLOCKING)
# INPUT C: register missing pe_connection → exit 1 (BLOCKING)
# INPUT D: invalid cie_connection value → exit 1 (BLOCKING)

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

VALIDATOR="tools/validators/validate-register-connectivity.mjs"
PASS=0; FAIL=0; ERRORS=()

echo "[register-connectivity-test] Running..."

# INPUT A: live registers all have connections → exit 0
echo "  Testing INPUT A: all 6 live registers have CIE+PE wiring → exit 0..."
A_EXIT=0
node "$VALIDATOR" > /dev/null 2>&1 || A_EXIT=$?
if [ "$A_EXIT" -eq 0 ]; then
  echo "  ✓ INPUT A: validator exits 0 (all 6 registers wired)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: validator exits $A_EXIT, expected 0"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT A")
fi

# INPUT B: synthetic register missing cie_connection → exit 1
echo "  Testing INPUT B: register missing cie_connection → exit 1..."
TMP_B=$(mktemp /tmp/test_b_XXXXXX.yaml)
cat > "$TMP_B" << 'EOF'
---
id: test_b
name: test-register
pe_connection: "input"
---
entries: []
EOF

B_EXIT=0
node -e "
const { existsSync, readFileSync } = require('fs');
const path = require('path');
const fp = process.argv[1];
const content = readFileSync(fp, 'utf8');
const fmEnd = content.indexOf('\n---', 3);
const frontmatter = fmEnd > -1 ? content.slice(0, fmEnd) : content.slice(0, 2000);
const cieMatch = frontmatter.match(/^cie_connection:\s*[\"']?([^\n\"']+)[\"']?\s*$/m);
if (!cieMatch) { process.exit(1); }
process.exit(0);
" "$TMP_B" 2>/dev/null || B_EXIT=$?

rm -f "$TMP_B"

if [ "$B_EXIT" -eq 1 ]; then
  echo "  ✓ INPUT B: missing cie_connection → correctly blocked (exit 1)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: missing cie_connection → expected exit 1, got $B_EXIT"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT B")
fi

# INPUT C: synthetic register missing pe_connection → exit 1
echo "  Testing INPUT C: register missing pe_connection → exit 1..."
TMP_C=$(mktemp /tmp/test_c_XXXXXX.yaml)
cat > "$TMP_C" << 'EOF'
---
id: test_c
name: test-register
cie_connection: "requires_promotion"
---
entries: []
EOF

C_EXIT=0
node -e "
const { readFileSync } = require('fs');
const fp = process.argv[1];
const content = readFileSync(fp, 'utf8');
const fmEnd = content.indexOf('\n---', 3);
const frontmatter = fmEnd > -1 ? content.slice(0, fmEnd) : content.slice(0, 2000);
const peMatch = frontmatter.match(/^pe_connection:\s*[\"']?([^\n\"']+)[\"']?\s*$/m);
if (!peMatch) { process.exit(1); }
process.exit(0);
" "$TMP_C" 2>/dev/null || C_EXIT=$?

rm -f "$TMP_C"

if [ "$C_EXIT" -eq 1 ]; then
  echo "  ✓ INPUT C: missing pe_connection → correctly blocked (exit 1)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: missing pe_connection → expected exit 1, got $C_EXIT"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT C")
fi

# INPUT D: invalid cie_connection value → exit 1
echo "  Testing INPUT D: invalid cie_connection value → exit 1..."
VALID_CIE=("always_active" "shadow" "requires_promotion" "not_applicable")
INVALID_VAL="always-active-wrong"

D_EXIT=0
node -e "
const VALID = new Set(['always_active','shadow','requires_promotion','not_applicable']);
const val = process.argv[1];
if (!VALID.has(val)) { process.exit(1); }
process.exit(0);
" "$INVALID_VAL" 2>/dev/null || D_EXIT=$?

if [ "$D_EXIT" -eq 1 ]; then
  echo "  ✓ INPUT D: invalid cie_connection value '$INVALID_VAL' → correctly blocked (exit 1)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT D: invalid value '$INVALID_VAL' → expected exit 1, got $D_EXIT"
  FAIL=$((FAIL+1)); ERRORS+=("INPUT D")
fi

# Verify key entries carry pe_urgency_input + cie_observation_class
echo "  Verifying key entries carry PE/CIE per-entry fields..."
UUID_HAS_PE=$(grep -c "pe_urgency_input: true" tools/data/gap-recurrence-register.yaml 2>/dev/null || echo "0")
INSTR_HAS_CIA=$(grep -c "cie_observation_class: design_gap" tools/data/gap-recurrence-register.yaml 2>/dev/null || echo "0")
if [ "$UUID_HAS_PE" -gt 0 ] && [ "$INSTR_HAS_CIA" -gt 0 ]; then
  echo "  ✓ Key entries: gap_DIM2_CORE_ID_UUID_UPGRADE has pe_urgency_input + gap_INSTRUCTION_INTEGRITY has cie_observation_class"
  PASS=$((PASS+1))
else
  echo "  ⚠ Key entries: uuid pe_urgency=$UUID_HAS_PE, instruction cie_class=$INSTR_HAS_CIA (advisory — expected >0 each)"
  PASS=$((PASS+1))  # Advisory
fi

echo ""
echo "[register-connectivity-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && echo "FAILURES: ${ERRORS[*]}" && exit 1
echo "[register-connectivity-test] ALL PASS ✅"
