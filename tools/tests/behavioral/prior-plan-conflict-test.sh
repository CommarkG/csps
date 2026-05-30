#!/usr/bin/env bash
# prior-plan-conflict-test.sh
#
# Behavioral test for validate-prior-plan-conflict.mjs
# Per B_STRUCTURAL_PREVENTION_DISCIPLINE: structural fix must have behavioral test.
# PROTO-S072-CIP M1 — CIP prior-plan-conflict validator behavioral tests.
#
# Tests:
#   INPUT A: staged change that conflicts with a vault-pending entry → advisory fires
#   INPUT B: staged change with no conflicts → no advisory
#   INPUT C: staged change with cip_required=false → not checked (exempt)
#
# Strategy: swap in a test staging file, run validator, check output, restore original.
#
# Usage: bash tools/tests/behavioral/prior-plan-conflict-test.sh
# Exit: 0 = all pass | 1 = failures found

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

VALIDATOR="tools/validators/validate-prior-plan-conflict.mjs"
STAGING_FILE="tools/data/change-impact-staging.yaml"
STAGING_BACKUP="${STAGING_FILE}.bak"
PASS=0
FAIL=0
ERRORS=()

# Backup real staging file
cp "$STAGING_FILE" "$STAGING_BACKUP" 2>/dev/null || true

echo "[prior-plan-conflict-test] Running behavioral tests..."
echo ""

# ── INPUT A: conflict with existing vault entry ───────────────────────────────
# Staged change mentions keywords that overlap with a vault-pending deferred entry.
# We create a staged entry mentioning "validate-push-status" (recently built) which
# also appears in vault-pending as vlt-S073-push-mandatory-discipline.

cat > "$STAGING_FILE" << 'STAGING_EOF'
---
id: csps.data.change-impact-staging
name: change-impact-staging
description: "Test staging file — INPUT A"
entries:
  - id: cip-test-A-conflict
    proposed_change: "Adds validate-push-status mandatory push discipline enforcement to session-close gate"
    type: validator
    cip_required: true
    ripple_set: []
    directions_checked: []
    net_impact:
      helps: []
      harms: []
    verdict: null
    terminal_state: null
    staged_at: "2026-05-30"
    staged_by: "test"
STAGING_EOF

echo "Input A: staged change with keyword overlap vs vault-pending entry → advisory fires"
OUTPUT=$(node "$VALIDATOR" 2>&1)

if echo "$OUTPUT" | tr -d '\r' | grep -q "\[ADVISORY\]"; then
  echo "  ✓ INPUT A: advisory fired (conflict detected)"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT A: no advisory fired — conflict should have been detected"
  echo "    Output: $(echo "$OUTPUT" | tr -d '\r' | tail -3)"
  FAIL=$((FAIL + 1))
  ERRORS+=("INPUT A: no advisory on conflicting staged change")
fi

# ── INPUT B: clean staged change — no conflict ────────────────────────────────
# Staged change mentions something entirely unrelated to any vault/plan entries.

cat > "$STAGING_FILE" << 'STAGING_EOF'
---
id: csps.data.change-impact-staging
name: change-impact-staging
description: "Test staging file — INPUT B"
entries:
  - id: cip-test-B-clean
    proposed_change: "Adds a completely unrelated XYZ-widget-frombulator thing to the platform"
    type: governance
    cip_required: true
    ripple_set: []
    directions_checked: []
    net_impact:
      helps: []
      harms: []
    verdict: null
    terminal_state: null
    staged_at: "2026-05-30"
    staged_by: "test"
STAGING_EOF

echo ""
echo "Input B: staged change with no keyword overlap → no advisory fires"
OUTPUT=$(node "$VALIDATOR" 2>&1)

if echo "$OUTPUT" | tr -d '\r' | grep -q "\[ADVISORY\]"; then
  echo "  ✗ INPUT B: false positive advisory fired on clean staged change"
  FAIL=$((FAIL + 1))
  ERRORS+=("INPUT B: false positive advisory on clean change")
else
  echo "  ✓ INPUT B: no advisory fired (no conflict — clean staged change)"
  PASS=$((PASS + 1))
fi

# ── INPUT C: cip_required=false — exempt from conflict check ─────────────────

cat > "$STAGING_FILE" << 'STAGING_EOF'
---
id: csps.data.change-impact-staging
name: change-impact-staging
description: "Test staging file — INPUT C"
entries:
  - id: cip-test-C-exempt
    proposed_change: "Adds validate-push-status to mandatory enforcement pipeline immediately"
    type: validator
    cip_required: false
    ripple_set: []
    directions_checked: []
    net_impact:
      helps: []
      harms: []
    verdict: null
    terminal_state: null
    staged_at: "2026-05-30"
    staged_by: "test"
STAGING_EOF

echo ""
echo "Input C: cip_required=false (SHEDDABLE) → exempt, no check run"
OUTPUT=$(node "$VALIDATOR" 2>&1)

if echo "$OUTPUT" | tr -d '\r' | grep -q "no pending staged changes"; then
  echo "  ✓ INPUT C: SHEDDABLE change correctly exempt from conflict check"
  PASS=$((PASS + 1))
else
  echo "  ✗ INPUT C: SHEDDABLE change was not exempted correctly"
  echo "    Output: $(echo "$OUTPUT" | tr -d '\r' | tail -3)"
  FAIL=$((FAIL + 1))
  ERRORS+=("INPUT C: SHEDDABLE change not exempted")
fi

# ── Restore real staging file ─────────────────────────────────────────────────

cp "$STAGING_BACKUP" "$STAGING_FILE" 2>/dev/null || true
rm -f "$STAGING_BACKUP"

# ── Results ───────────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────────────"
echo "[prior-plan-conflict-test] Results: PASS=$PASS FAIL=$FAIL"

if [ "$FAIL" -gt 0 ]; then
  echo "FAILURES: ${ERRORS[*]}"
  exit 1
fi

echo "[prior-plan-conflict-test] ALL PASS ✅"
exit 0
