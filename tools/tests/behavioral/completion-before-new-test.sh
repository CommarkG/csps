#!/usr/bin/env bash
# Behavioral test: validate-completion-before-new.mjs (E1 — COMPLETION-DISCIPLINE-PLAN-S073)
# Tests: A=open-proto-with-unchecked→advisory · B=all-sealed→pass · C=no-protos-dir→pass
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-completion-before-new.mjs"
TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

# ── INPUT A: open PROTO with unchecked milestones → advisory ─────────────────
mkdir -p "$TMP/a/docs/plan/protos" "$TMP/a/tools/data"
cat > "$TMP/a/docs/plan/protos/PROTO-TEST-OPEN.md" << 'YML'
---
status: draft
---
# Test PROTO with open milestones
- [ ] M1: not done yet
- [x] M0: already done
YML
OUT=$(cd "$TMP/a" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "open_protos=1" && echo "$OUT" | grep -q "advisory=1"; then
  echo "  ✓ INPUT A: open PROTO with unchecked milestone → advisory"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: expected open_protos=1 advisory=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT B: all PROTOs sealed → no advisory ─────────────────────────────────
mkdir -p "$TMP/b/docs/plan/protos" "$TMP/b/tools/data"
cat > "$TMP/b/docs/plan/protos/PROTO-TEST-SEALED.md" << 'YML'
---
status: sealed
---
# Sealed PROTO
- [x] M1: done
- [x] M2: done
YML
OUT=$(cd "$TMP/b" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "open_protos=0" && echo "$OUT" | grep -q "advisory=0"; then
  echo "  ✓ INPUT B: all PROTOs sealed → no advisory"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: expected open_protos=0 advisory=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT C: no docs/plan/protos/ directory → pass silently ──────────────────
mkdir -p "$TMP/c/tools/data"
OUT=$(cd "$TMP/c" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "skip\|open_protos=0"; then
  echo "  ✓ INPUT C: no protos dir → pass silently"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: unexpected output: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[completion-before-new-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
