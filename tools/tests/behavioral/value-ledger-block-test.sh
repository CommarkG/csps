#!/usr/bin/env bash
# value-ledger-block-test.sh — Behavioral block-test for validate-value-ledger.mjs
#
# PLANTED DEFECT TESTS:
#   TEST A: entry missing a required field (delivers_value)      -> BLOCKING (exit 1)
#   TEST B: same entry, field restored, well-formed               -> PASS (exit 0)
#   TEST C: entry with invalid tag enum value                     -> BLOCKING (exit 1)
#   TEST D: well-formed entry tagged DECLARED-ONLY                -> PASS, surfaced as advisory
#   TEST E: well-formed entry, last_reviewed far behind current   -> PASS, surfaced as stale advisory
#   TEST F: no ledger file at all (clean baseline)                -> PASS (exit 0), entries=0
#
# Runs entirely inside an isolated tmp git repo (BLOCK-TEST-CONVENTION.md RULE 2 — cd-first +
# relative paths only, no MSYS absolute paths passed into node -e). The real repo's
# tools/data/value-ledger.yaml is NEVER touched by this script.
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-value-ledger.mjs"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

setup_repo() {
  rm -rf "$TMP"/.git "$TMP"/tools
  mkdir -p "$TMP/tools/data"
  cd "$TMP" || exit 1
  echo '{"current_session":"S089"}' > tools/session-state.json
}

# ── TEST A: missing required field (delivers_value) -> BLOCKING ──────────────────────────
setup_repo
cat > tools/data/value-ledger.yaml << 'YML'
entries:
  - element_id: test-elem
    type: validator
    intended_value: "test"
    active: true
    last_activation_proof: "test proof"
    tag: VERIFIED-ACTIVE
    last_reviewed: S089
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1" && echo "$OUT" | grep -q "missing/empty required field"; then
  echo "  ✓ TEST A: missing required field -> BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST A: expected blocking=1 + missing-field message, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST B: same entry, field restored -> PASS ────────────────────────────────────────────
cat > tools/data/value-ledger.yaml << 'YML'
entries:
  - element_id: test-elem
    type: validator
    intended_value: "test"
    active: true
    last_activation_proof: "test proof"
    delivers_value: "real evidence"
    tag: VERIFIED-ACTIVE
    last_reviewed: S089
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "entries=1"; then
  echo "  ✓ TEST B: well-formed entry -> PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST B: expected blocking=0 entries=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST C: invalid tag enum value -> BLOCKING ────────────────────────────────────────────
cat > tools/data/value-ledger.yaml << 'YML'
entries:
  - element_id: test-elem
    type: validator
    intended_value: "test"
    active: true
    last_activation_proof: "test proof"
    delivers_value: "real evidence"
    tag: SORT-OF-ACTIVE
    last_reviewed: S089
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1" && echo "$OUT" | grep -q "not in {VERIFIED-ACTIVE"; then
  echo "  ✓ TEST C: invalid tag enum -> BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST C: expected blocking=1 + invalid-tag message, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST D: well-formed DECLARED-ONLY entry -> PASS, surfaced as advisory ───────────────
cat > tools/data/value-ledger.yaml << 'YML'
entries:
  - element_id: test-elem
    type: mechanism
    intended_value: "test"
    active: true
    last_activation_proof: "test proof"
    delivers_value: "NOT YET VERIFIED"
    tag: DECLARED-ONLY
    last_reviewed: S089
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "declared_only=1"; then
  echo "  ✓ TEST D: DECLARED-ONLY entry -> PASS, surfaced (not blocked)"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST D: expected blocking=0 declared_only=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST E: last_reviewed far behind current session -> PASS, surfaced as stale ─────────
cat > tools/data/value-ledger.yaml << 'YML'
entries:
  - element_id: test-elem
    type: hook
    intended_value: "test"
    active: true
    last_activation_proof: "test proof"
    delivers_value: "real evidence"
    tag: VERIFIED-ACTIVE
    last_reviewed: S080
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "stale=1"; then
  echo "  ✓ TEST E: stale last_reviewed (S080 vs S089) -> PASS, surfaced as stale"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST E: expected blocking=0 stale=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── TEST F: no ledger file at all -> clean baseline PASS ────────────────────────────────
setup_repo
rm -f tools/data/value-ledger.yaml
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "entries=0"; then
  echo "  ✓ TEST F: no ledger file -> clean baseline PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ TEST F: expected blocking=0 entries=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[value-ledger-block-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
