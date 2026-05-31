#!/usr/bin/env bash
# Behavioral test: validate-core-spine-template.mjs (B0 — PROTO-S073-CORESPINE-B0)
# Tests: A=valid-8-sections-empty-wiring-map→PASS
#        B=missing-section→BLOCKING (when non-stub)
#        C=wiring-map-bad-path→BLOCKING (when non-stub)
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/validators/validate-core-spine-template.mjs"
TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

# ── INPUT A: valid 8-section spine (non-stub, empty wiring_map) → PASS ───────
mkdir -p "$TMP/a/tools/config" "$TMP/a/tools/data"
cat > "$TMP/a/tools/config/core-spine-registry.yaml" << 'YML'
spines:
  - id: test-spine
    spine: GVRN
    status: active
    trunk:
      description: test
    branches: []
    alignment_map:
      schema_anchor: vault_files
      architecture_map_node: pillar-0-governance
      classification_dimension: GVRN
      root: null
    wiring_map: []
    tier_permission:
      min_tier: governor
    cie_pe:
      pe_score: null
    escalation:
      owner: group:finky
    realtime_save:
      enabled: false
YML
OUT=$(cd "$TMP/a" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT A: valid 8-section spine (non-stub, empty wiring_map) → PASS"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT A: expected blocking=0, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT B: non-stub spine with missing section → BLOCKING ──────────────────
mkdir -p "$TMP/b/tools/config" "$TMP/b/tools/data"
cat > "$TMP/b/tools/config/core-spine-registry.yaml" << 'YML'
spines:
  - id: bad-spine
    spine: GVRN
    status: active
    trunk:
      description: test
    branches: []
    alignment_map:
      classification_dimension: GVRN
      root: null
    wiring_map: []
    tier_permission:
      min_tier: governor
    # cie_pe MISSING
    escalation:
      owner: group:finky
    realtime_save:
      enabled: false
YML
OUT=$(cd "$TMP/b" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q 'missing required section "cie_pe"'; then
  echo "  ✓ INPUT B: missing section (cie_pe) → BLOCKING detected"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: expected BLOCKING for missing cie_pe, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT C: non-stub spine with wiring_map bad path → BLOCKING ──────────────
mkdir -p "$TMP/c/tools/config" "$TMP/c/tools/data"
cat > "$TMP/c/tools/config/core-spine-registry.yaml" << 'YML'
spines:
  - id: wiring-spine
    spine: GVRN
    status: active
    trunk:
      description: test
    branches: []
    alignment_map:
      schema_anchor: vault_files
      architecture_map_node: pillar-0-governance
      classification_dimension: GVRN
      root: null
    wiring_map:
      - file: does/not/exist.mjs
        role: test
    tier_permission:
      min_tier: governor
    cie_pe:
      pe_score: null
    escalation:
      owner: group:finky
    realtime_save:
      enabled: false
YML
OUT=$(cd "$TMP/c" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "does not exist on disk"; then
  echo "  ✓ INPUT C: wiring_map bad path → BLOCKING detected"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: expected BLOCKING for bad wiring_map path, got: $OUT"
  FAIL=$((FAIL+1))
fi

# ── INPUT D: PLANNED wiring entry with non-existent path → PASS (PLANNED = declared, not required) ─
mkdir -p "$TMP/d/tools/config" "$TMP/d/tools/data"
cat > "$TMP/d/tools/config/core-spine-registry.yaml" << 'YML'
spines:
  - id: planned-spine
    spine: GVRN
    status: active
    trunk:
      description: test
    branches: []
    alignment_map:
      schema_anchor: vault_files
      architecture_map_node: pillar-0-governance
      classification_dimension: GVRN
      root: null
    wiring_map:
      - file: does/not/exist-yet.mjs
        role: planned future file
        status: PLANNED
        target_batch: B4
    tier_permission:
      min_tier: governor
    cie_pe:
      pe_score: null
    escalation:
      owner: group:finky
    realtime_save:
      enabled: false
YML
OUT=$(cd "$TMP/d" && node "$V" 2>&1) || true
if echo "$OUT" | grep -q "blocking=0"; then
  echo "  ✓ INPUT D: PLANNED wiring entry with non-existent path → no blocking (declared-not-required)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT D: expected blocking=0 for PLANNED wiring, got: $OUT"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[core-spine-template-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
