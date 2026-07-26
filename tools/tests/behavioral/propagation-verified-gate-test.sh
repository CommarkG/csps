#!/usr/bin/env bash
# Behavioral test: validate-propagation-verified-gate.mjs
# Tests: A=unverified+required→BLOCKING · B=verified→PASS · C=opted-out-with-reason→PASS ·
#        D=no-field-at-all(grandfathered)→PASS
# HARDWIRE-012 — S089 Weekly Evolution Engine
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-propagation-verified-gate.mjs"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

mkdir -p "$TMP/tools/data"

write_gap_register() {
  cat > "$TMP/tools/data/gap-recurrence-register.yaml" << YML
---
id: test
---
entries:
$1
YML
  # Empty improvement register so only gap-register entries are under test
  cat > "$TMP/tools/data/improvement-register.yaml" << 'YML'
---
id: test
---
entries:
YML
}

# ── INPUT A: propagation_required:true, propagation_verified:false, terminal status → BLOCKING
write_gap_register "  - id: gap_A
    status: resolved
    propagation_required: true
    propagation_verified: false
"
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1" && echo "$OUT" | grep -q "gap_A"; then
  echo "  ✓ INPUT A: unverified + required + terminal → BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: expected blocking=1 for gap_A, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT B: propagation_required:true, propagation_verified:true → PASS
write_gap_register "  - id: gap_B
    status: resolved
    propagation_required: true
    propagation_verified: true
"
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT B: verified → PASS (no blocking)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: expected blocking=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT C: propagation_required:false with reason → PASS, no advisory
write_gap_register "  - id: gap_C
    status: resolved
    propagation_required: false
    propagation_not_required_reason: \"single-spot fix, nothing to propagate\"
"
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0 advisory=0"; then
  echo "  ✓ INPUT C: opted-out with reason → PASS, no advisory"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: expected blocking=0 advisory=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT D: no propagation_required field at all (grandfathered legacy entry) → PASS
write_gap_register "  - id: gap_D
    status: resolved
    k_count: 5
"
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0 advisory=0"; then
  echo "  ✓ INPUT D: no field at all (grandfathered) → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT D: expected blocking=0 advisory=0 (grandfathered), got: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[propagation-verified-gate-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
