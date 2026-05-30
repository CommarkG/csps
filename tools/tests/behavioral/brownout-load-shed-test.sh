#!/usr/bin/env bash
# brownout-load-shed-test.sh — M8 S071 PART 2 STEP 3 behavioral test
# Tests: load-shed sheds lowest criticality first under brownout.
# Test 3/3:
#   A: SHEDDABLE input (maintenance) under brownout → VAULT:defer (not PROCESS-NOW)
#   B: CRITICAL input (governor_directive) under brownout → PROCESS-NOW (not shed)
#   C: brownout inactive → SHEDDABLE routes normally (VAULT not forced)
#
# Usage: bash tools/tests/behavioral/brownout-load-shed-test.sh
# Exit 0 = all tests pass; Exit 1 = failure

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
PASS=0
FAIL=0

test_case() {
  local id="$1"
  local desc="$2"
  local expected="$3"
  local got="$4"
  if echo "$got" | grep -q "$expected"; then
    echo "  ✓ $id: $desc"
    ((PASS++))
  else
    echo "  ✗ $id FAIL: $desc"
    echo "    expected: $expected"
    echo "    got: $got"
    ((FAIL++))
  fi
}

echo "[brownout-load-shed-test] Running M8 behavioral test 3/3..."
echo ""

# Test A: SHEDDABLE input (maintenance) under brownout → VAULT:defer
RESULT_A=$(ROUTE_CONTENT="fix typo in docs" ROUTE_TYPE="maintenance" ROUTE_SPINE="OPER" \
  ROUTE_URGENCY="low" ROUTE_SCOPE="tactical" \
  node -e "
import('./tools/scripts/threshold-router.mjs').then(({routeInput, CRITICALITY}) => {
  const r = routeInput({type:'maintenance',spine:'OPER',urgency:'low',scope:'tactical',content:'fix typo in docs',brownout:true});
  process.stdout.write(JSON.stringify({route:r.route,criticality:r.criticality,class:r.input_class}));
}).catch(e => process.stdout.write('ERROR: '+e.message));
" 2>/dev/null)
test_case "A" "SHEDDABLE(maintenance)+brownout → VAULT:defer" "VAULT:defer" "$RESULT_A"

# Test B: CRITICAL input (governor_directive) under brownout → PROCESS-NOW (not shed)
RESULT_B=$(node -e "
import('./tools/scripts/threshold-router.mjs').then(({routeInput}) => {
  const r = routeInput({type:'governor_directive',spine:'GVRN',urgency:'high',scope:'operational',content:'proceed with M8',brownout:true});
  process.stdout.write(JSON.stringify({route:r.route,criticality:r.criticality,class:r.input_class}));
}).catch(e => process.stdout.write('ERROR: '+e.message));
" 2>/dev/null)
test_case "B" "CRITICAL_PLUS(governor)+brownout → still routes (PROCESS-NOW/ESCALATE)" "PROCESS-NOW\|ESCALATE" "$RESULT_B"

# Test C: brownout inactive → SHEDDABLE routes normally (not forced to VAULT)
RESULT_C=$(node -e "
import('./tools/scripts/threshold-router.mjs').then(({routeInput}) => {
  const r = routeInput({type:'maintenance',spine:'OPER',urgency:'low',scope:'tactical',content:'fix typo in docs',brownout:false});
  process.stdout.write(JSON.stringify({route:r.route,criticality:r.criticality,class:r.input_class}));
}).catch(e => process.stdout.write('ERROR: '+e.message));
" 2>/dev/null)
test_case "C" "brownout=false → maintenance routes normally (VAULT, not VAULT:defer)" "\"route\":\"VAULT\"" "$RESULT_C"

echo ""
echo "[brownout-load-shed-test] pass=$PASS fail=$FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
