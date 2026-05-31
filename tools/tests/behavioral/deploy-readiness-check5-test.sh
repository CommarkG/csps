#!/usr/bin/env bash
# Behavioral test: validate-app-deploy-readiness.mjs CHECK 5 (root_dir-exists BLOCKING)
# Tests: A=missing-root_dir→BLOCKING · B=existing-root_dir→PASS · C=no-targets-yaml→PASS
# FLAWLESS-DEPLOY P1 M1 — PROTO-S073-PARALLEL
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-app-deploy-readiness.mjs"
TMP="$(mktemp -d)"

cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

# ── INPUT A: deploy-targets.yaml with missing root_dir → BLOCKING ────────────
mkdir -p "$TMP/a/tools/config" "$TMP/a/apps/real-app"
cat > "$TMP/a/tools/config/deploy-targets.yaml" << 'YML'
targets:
  - app: missing-app
    root_dir: apps/missing-app
    status: active
  - app: real-app
    root_dir: apps/real-app
    status: active
YML
touch "$TMP/a/apps/real-app/package.json"
OUT=$(cd "$TMP/a" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "BLOCKING.*missing-app"; then
  echo "  ✓ INPUT A: missing root_dir → BLOCKING detected"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: expected BLOCKING for missing-app, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT B: deploy-targets.yaml with existing root_dir → PASS (no blocking) ─
mkdir -p "$TMP/b/tools/config" "$TMP/b/apps/existing-app"
cat > "$TMP/b/tools/config/deploy-targets.yaml" << 'YML'
targets:
  - app: existing-app
    root_dir: apps/existing-app
    status: active
YML
touch "$TMP/b/apps/existing-app/package.json"
OUT=$(cd "$TMP/b" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT B: existing root_dir → no blocking"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: expected blocking=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT C: no deploy-targets.yaml → passes silently (apps/ dir missing) ────
mkdir -p "$TMP/c"
OUT=$(cd "$TMP/c" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "not found\|apps_checked=0\|blocking=0"; then
  echo "  ✓ INPUT C: no apps/ or deploy-targets.yaml → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: unexpected output: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[deploy-readiness-check5-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
