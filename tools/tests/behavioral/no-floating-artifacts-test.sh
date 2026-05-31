#!/usr/bin/env bash
# Behavioral test: validate-no-floating-artifacts.mjs (B4 ANTI-FLOAT T2)
# Tests: A=missing-closure-obligation→advisory · B=obligation-not-overdue→pass · C=overdue→advisory
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-no-floating-artifacts.mjs"
TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

# ── INPUT A: draft file missing closure obligation → advisory ─────────────────
mkdir -p "$TMP/a/docs/plan/test" "$TMP/a/tools/data"
cat > "$TMP/a/docs/plan/test/floater.md" << 'YML'
---
status: draft
---
# Test floater — no closure obligation
YML
echo '{}' > "$TMP/a/tools/data/floating-artifacts-register.yaml"
OUT=$(cd "$TMP/a" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "lacks closure obligation"; then
  echo "  ✓ INPUT A: draft without closure obligation → advisory"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: expected advisory for missing closure, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT B: draft file WITH closure obligation (obligation present) → no flag ─
mkdir -p "$TMP/b/docs/plan/test" "$TMP/b/tools/data"
cat > "$TMP/b/docs/plan/test/governed.md" << 'YML'
---
status: draft
closure_owner: group:finky
closure_decision: "Ratify or vault"
closure_by: "S074"
---
# Test governed draft
YML
echo '{}' > "$TMP/b/tools/data/floating-artifacts-register.yaml"
OUT=$(cd "$TMP/b" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "missing_obligation=0"; then
  echo "  ✓ INPUT B: draft WITH closure obligation → no missing_obligation flag"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: expected missing_obligation=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT C: file in register with escalation_state:overdue → advisory escalate
mkdir -p "$TMP/c/docs/plan/test" "$TMP/c/tools/data"
cat > "$TMP/c/docs/plan/test/overdue.md" << 'YML'
---
status: pending-review
---
# Test overdue floater
YML
cat > "$TMP/c/tools/data/floating-artifacts-register.yaml" << 'YML'
entries:
  - id: test-overdue
    artifact_path: docs/plan/test/overdue.md
    escalation_state: overdue
YML
OUT=$(cd "$TMP/c" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "ESCALATED.*overdue"; then
  echo "  ✓ INPUT C: overdue register entry → ESCALATED advisory"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: expected ESCALATED advisory for overdue, got: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[no-floating-artifacts-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
