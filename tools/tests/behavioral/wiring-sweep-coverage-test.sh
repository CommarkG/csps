#!/usr/bin/env bash
# Behavioral test: validate-wiring-sweep-coverage.mjs
# Tests: A=implementation-commit+no-sweep-entry→BLOCKING · B=implementation-commit+sweep-entry→PASS ·
#        C=no-implementation-commits-this-session→PASS
# HARDWIRE-011 — S089 B_IMPLEMENTATION_WIRING_CYCLE
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-wiring-sweep-coverage.mjs"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

setup_repo() {
  rm -rf "$TMP"/.git "$TMP"/tools
  mkdir -p "$TMP/tools/data" "$TMP/tools/validators"
  cd "$TMP" || exit 1
  git init -q
  git config user.email "test@test.com"
  git config user.name "test"
  echo '{"current_session":"TESTSESS"}' > tools/session-state.json
  git add tools/session-state.json
  git commit -q -m "[TESTSESS] initial commit"
}

# ── INPUT A: implementation-shaped commit, zero sweep entries → BLOCKING ─────
setup_repo
echo "// test validator" > tools/validators/fake-validator.mjs
git add tools/validators/fake-validator.mjs
git commit -q -m "[TESTSESS] add fake validator"
cat > tools/data/wiring-sweep-log.yaml << 'YML'
entries: []
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=1"; then
  echo "  ✓ INPUT A: implementation commit + 0 sweep entries → BLOCKING"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: expected blocking=1, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT B: same commit, matching sweep entry exists → PASS ────────────────
cat > tools/data/wiring-sweep-log.yaml << 'YML'
entries:
  - session: TESTSESS
    implementation: "fake validator"
    angles_swept: ["test"]
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT B: implementation commit + matching sweep entry → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: expected blocking=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT C: no implementation-shaped commits this session → PASS ───────────
setup_repo
cat > tools/data/wiring-sweep-log.yaml << 'YML'
entries: []
YML
OUT=$(cd "$TMP" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0" && echo "$OUT" | grep -q "implementation_commits=0"; then
  echo "  ✓ INPUT C: no implementation-shaped commits → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: expected blocking=0 implementation_commits=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[wiring-sweep-coverage-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
