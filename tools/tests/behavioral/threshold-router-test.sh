#!/usr/bin/env bash
# threshold-router-test.sh
# Behavioral test for threshold-router.mjs
# PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 3
#
# INPUT A: governor directive → PROCESS-NOW
# INPUT B: internal-low-weight → VAULT
# INPUT C: high-weight constitutional → ESCALATE
# INPUT D: proposal-class with reusable surface → INVOKE:consolidation-expert

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

ROUTER="tools/scripts/threshold-router.mjs"
PASS=0; FAIL=0; ERRORS=()

echo "[threshold-router-test] Running..."

run_test() {
  local name="$1" args="$2" expected="$3"
  local actual
  actual=$(node $ROUTER $args 2>/dev/null | node -e "
    process.stdin.setEncoding('utf8');
    let d='';
    process.stdin.on('data',c=>d+=c);
    process.stdin.on('end',()=>{try{process.stdout.write(JSON.parse(d).route);}catch(e){process.stdout.write('ERROR');}});
  " 2>/dev/null || echo "ERROR")
  if [ "$actual" = "$expected" ]; then
    echo "  ✓ $name → $actual"
    PASS=$((PASS+1))
  else
    echo "  ✗ $name → got '$actual', expected '$expected'"
    FAIL=$((FAIL+1)); ERRORS+=("$name")
  fi
}

# INPUT A: governor directive + in-mandate → PROCESS-NOW
run_test "INPUT A: governor directive" \
  "--type=governor_directive --spine=GVRN --urgency=high --content=fix-session-detection" \
  "PROCESS-NOW"

# INPUT B: maintenance/tactical → VAULT
run_test "INPUT B: internal low-weight" \
  "--type=maintenance --spine=OPER --urgency=low" \
  "VAULT"

# INPUT C: constitutional scope directive → ESCALATE
run_test "INPUT C: constitutional" \
  "--type=governor_directive --spine=GVRN --urgency=high --content=B_CONSTITUTIONAL_GATE" \
  "ESCALATE"

# INPUT D: proposal with reusable surface → INVOKE:consolidation-expert
run_test "INPUT D: proposal+reusable" \
  "--type=proposal --spine=ARCH --urgency=medium --content=check-existing-validators" \
  "INVOKE:consolidation-expert"

# INPUT E: SHAPE-TIER conversational fast-path → PROCESS-NOW (no full routing)
run_test "INPUT E: SHAPE-TIER conversational" \
  "--type=question --spine=GVRN --urgency=low --shapeTier=true" \
  "PROCESS-NOW"

echo ""
echo "[threshold-router-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && echo "FAILURES: ${ERRORS[*]}" && exit 1
echo "[threshold-router-test] ALL PASS ✅"
