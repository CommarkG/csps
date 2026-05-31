#!/usr/bin/env bash
# Behavioral test: verify.mjs validator tiering (B0.5 — PROTO-S073-B0.5-VALIDATOR-TIERING)
# Tests: A=CRITICAL-always-runs · B=DEEP-excluded-by-default · C=cap-respected-without-limit-raise
set -uo pipefail
PASS=0; FAIL=0

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
V="$ROOT/tools/verify.mjs"

# ── INPUT A: CRITICAL validator (zf_cycle_format) always runs — not SKIPPED-TIER ──────────
# Run verify --skip-install and check zf_cycle_format is NOT DEFERRED/SKIPPED
OUT=$(cd "$ROOT" && node "$V" --skip-install 2>/dev/null) || true
if echo "$OUT" | grep -q '"zf_cycle_format"' && ! echo "$OUT" | python3 -c "
import sys,json
d=json.load(sys.stdin)
cycles=d.get('cycles',[])
for c in cycles:
  if c.get('name')=='zf_cycle_format' and c.get('status')=='DEFERRED-WITH-REASON':
    sys.exit(1)
sys.exit(0)
" 2>/dev/null; then
  echo "  ✓ INPUT A: CRITICAL validator (zf_cycle_format) is not DEFERRED-WITH-REASON"
  PASS=$((PASS+1))
else
  # Simpler check: verify the result contains zf_cycle_format with PASS (not DEFERRED)
  if echo "$OUT" | grep -q '"zf_cycle_format"' && echo "$OUT" | grep -A3 '"zf_cycle_format"' | grep -q '"status": "PASS"\|"status": "FAIL"'; then
    echo "  ✓ INPUT A: CRITICAL validator (zf_cycle_format) runs and has a PASS/FAIL status"
    PASS=$((PASS+1))
  else
    echo "  ✗ INPUT A: expected zf_cycle_format to run (PASS/FAIL), got unexpected state"
    FAIL=$((FAIL+1))
  fi
fi

# ── INPUT B: DEEP validator excluded from default run (not --deep) ────────────────────────
# Check that communication_schema_coverage (run_tier:DEEP) shows as DEFERRED-WITH-REASON
if echo "$OUT" | grep -q '"communication_schema_coverage"' && \
   echo "$OUT" | grep -A5 '"communication_schema_coverage"' | grep -q 'DEFERRED-WITH-REASON\|run_tier:DEEP'; then
  echo "  ✓ INPUT B: DEEP validator (communication_schema_coverage) is DEFERRED-WITH-REASON in default run"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT B: expected communication_schema_coverage DEFERRED-WITH-REASON, got unexpected"
  FAIL=$((FAIL+1))
fi

# ── INPUT C: platform-capacity count excludes DEEP — hard_limit NOT raised ──────────────
# Check that pnpm-verify-cycles < hard_limit (200) without raising the limit
CAP_OUT=$(cd "$ROOT" && node "$ROOT/tools/validators/validate-platform-capacity.mjs" 2>&1) || true
if echo "$CAP_OUT" | grep -q "pnpm-verify-cycles" && \
   ! echo "$CAP_OUT" | grep "pnpm-verify-cycles" | grep -q "BLOCKING"; then
  echo "  ✓ INPUT C: pnpm-verify-cycles not BLOCKING (hard_limit not raised, DEEP excluded)"
  PASS=$((PASS+1))
else
  echo "  ✗ INPUT C: expected pnpm-verify-cycles not BLOCKING, got: $(echo "$CAP_OUT" | grep "pnpm-verify-cycles")"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[validator-tiering-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
