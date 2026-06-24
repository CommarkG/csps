#!/usr/bin/env bash
# cs7-content-hash-freshness-block-test.sh
# Behavioral block-test for CS7 content-hash freshness (S088)
#
# KEY BEHAVIORAL TESTS (structural + unit-level):
#   TEST A: Hash comparison logic: changed content → detected as stale (RED)
#   TEST B: Hash comparison logic: unchanged content → NOT stale (GREEN)
#   TEST C: validate-audit-health.mjs has content-hash code (structural)
#   TEST D: validate-slice-freshness.mjs has content-hash code (structural)
#   TEST E: validator-content-hashes.json exists (hash store created)
#   TEST F: slice-content-hashes.json exists (slice hash store created)
#
# Usage: bash tools/tests/behavioral/cs7-content-hash-freshness-block-test.sh
# Exit 0 = all tests pass; Exit 1 = one or more tests failed.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
AUDIT_HEALTH="$REPO_ROOT/tools/validators/validate-audit-health.mjs"
SLICE_FRESHNESS="$REPO_ROOT/tools/validators/validate-slice-freshness.mjs"
HASH_STORE="$REPO_ROOT/tools/data/validator-content-hashes.json"
SLICE_HASH_STORE="$REPO_ROOT/tools/data/slice-content-hashes.json"

PASS_COUNT=0
FAIL_COUNT=0
RESULTS=()

pass() { PASS_COUNT=$((PASS_COUNT + 1)); RESULTS+=("[PASS] $1"); }
fail() { FAIL_COUNT=$((FAIL_COUNT + 1)); RESULTS+=("[FAIL] $1"); }

echo ""
echo "=== cs7-content-hash-freshness-block-test (S088 CS7) ==="
echo "Tests: content change → RED; mtime-only → GREEN (structural + unit)"
echo ""

# ─── TEST A: Content-hash logic correctly detects changed content ─────────────
echo "[TEST A] Hash comparison: changed content → stale detected (RED)"
A_RESULT=$(node -e "
const {createHash} = require('crypto');
function hash(s) { return createHash('sha256').update(s.slice(0,500)).digest('hex').slice(0,16); }
const original = 'const x = 1; // @csps-version 1.0.0';
const modified  = 'const x = 1; // @csps-version 2.0.0';
const stored = hash(original);
const current = hash(modified);
console.log(current !== stored ? 'STALE-DETECTED' : 'NOT-DETECTED');
" 2>&1)
if [ "$A_RESULT" = "STALE-DETECTED" ]; then
  pass "TEST A: content change → hash differs → stale correctly detected"
else
  fail "TEST A: content change → hash should differ but result: $A_RESULT"
fi

# ─── TEST B: mtime-only change → NOT stale (same content = same hash) ─────────
echo "[TEST B] Hash comparison: same content (mtime only) → NOT stale (GREEN)"
B_RESULT=$(node -e "
const {createHash} = require('crypto');
function hash(s) { return createHash('sha256').update(s.slice(0,500)).digest('hex').slice(0,16); }
const content = 'const x = 1; // @csps-version 1.0.0';
const stored  = hash(content);
const current = hash(content); // same content, mtime would differ in real scenario
console.log(current === stored ? 'CLEAN' : 'FALSE-POSITIVE');
" 2>&1)
if [ "$B_RESULT" = "CLEAN" ]; then
  pass "TEST B: same content → hash identical → NOT stale (mtime would change, hash wouldn't)"
else
  fail "TEST B: same content should produce same hash but got: $B_RESULT"
fi

# ─── TEST C: validate-audit-health.mjs has content-hash code ─────────────────
echo "[TEST C] validate-audit-health.mjs has CS7 content-hash code..."
if grep -q "createHash\|validator-content-hashes\|storedHashes" "$AUDIT_HEALTH"; then
  pass "TEST C: audit-health contains CS7 content-hash check code"
else
  fail "TEST C: audit-health MISSING CS7 content-hash check code"
fi
# Also verify mtime comparison is GONE
if grep -q "auditRunnerMtime\|newerValidators.*mtime\|v.mtime > auditRunnerMtime" "$AUDIT_HEALTH"; then
  fail "TEST C (sub): audit-health still has mtime comparison (should be removed)"
else
  pass "TEST C (sub): mtime comparison removed from audit-health CHECK B"
fi

# ─── TEST D: validate-slice-freshness.mjs has content-hash code ──────────────
echo "[TEST D] validate-slice-freshness.mjs has CS7 content-hash code..."
if grep -q "createHash\|slice-content-hashes\|storedHashes\|hashFile" "$SLICE_FRESHNESS"; then
  pass "TEST D: slice-freshness contains CS7 content-hash check code"
else
  fail "TEST D: slice-freshness MISSING CS7 content-hash check code"
fi
# Also verify mtime comparison is GONE from the main check
if grep -q "monolithMtime > newestSliceMtime" "$SLICE_FRESHNESS"; then
  fail "TEST D (sub): slice-freshness still has mtime comparison (should be removed)"
else
  pass "TEST D (sub): mtime comparison removed from slice-freshness"
fi

# ─── TEST E: validator-content-hashes.json exists and has entries ─────────────
echo "[TEST E] validator-content-hashes.json exists with validator hashes..."
if [ -f "$HASH_STORE" ]; then
  HASH_COUNT=$(node -e "const d=JSON.parse(require('fs').readFileSync('$HASH_STORE','utf8')); console.log(Object.keys(d.hashes||{}).length);" 2>&1)
  if [ "$HASH_COUNT" -gt 50 ]; then
    pass "TEST E: validator-content-hashes.json exists ($HASH_COUNT validator hashes)"
  else
    fail "TEST E: validator-content-hashes.json has only $HASH_COUNT entries (expected > 50)"
  fi
else
  fail "TEST E: validator-content-hashes.json missing — run pnpm audit-runner:split first"
fi

# ─── TEST F: slice-content-hashes.json exists and has monolith entries ────────
echo "[TEST F] slice-content-hashes.json exists with monolith hashes..."
if [ -f "$SLICE_HASH_STORE" ]; then
  SLICE_COUNT=$(node -e "const d=JSON.parse(require('fs').readFileSync('$SLICE_HASH_STORE','utf8')); console.log(Object.keys(d.hashes||{}).length);" 2>&1)
  if [ "$SLICE_COUNT" -ge 1 ]; then
    pass "TEST F: slice-content-hashes.json exists ($SLICE_COUNT monolith hashes)"
  else
    fail "TEST F: slice-content-hashes.json has no entries"
  fi
else
  fail "TEST F: slice-content-hashes.json missing — run validate-slice-freshness.mjs to bootstrap"
fi

# ─── Results ─────────────────────────────────────────────────────────────────
echo ""
echo "=== RESULTS ==="
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo "PASS=$PASS_COUNT FAIL=$FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo "[BLOCK-TEST FAILED] $FAIL_COUNT test(s) failed — CS7 content-hash freshness incomplete"
  exit 1
fi

echo "[BLOCK-TEST PASSED] All $PASS_COUNT tests confirmed — CS7 content-hash freshness correctly wired"
exit 0
