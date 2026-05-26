#!/usr/bin/env bash
# bstar-engraving-gate-test.sh
# Behavioral test for bstar-engraving-gate.mjs
# INPUT A: new B_*.md WITHOUT opus_reviewed_seed → exit=2 (BLOCK)
# INPUT B: new B_*.md WITH opus_reviewed_seed → exit=0 (ALLOW)
# INPUT C: Edit to existing B_PRACE.md → exit=0 (ALLOW, exempt)
# INPUT D: Non-B_*.md Write → exit=0 (ALLOW)

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

GATE="tools/scripts/bstar-engraving-gate.mjs"
PASS=0; FAIL=0; ERRORS=()

run_test() {
  local name="$1" input="$2" expected="$3"
  local actual=0
  echo "$input" | node "$GATE" > /dev/null 2>&1 || actual=$?
  if [ "$actual" = "$expected" ]; then
    echo "  ✓ $name (exit=$actual)"; PASS=$((PASS+1))
  else
    echo "  ✗ $name — expected $expected, got $actual"; FAIL=$((FAIL+1)); ERRORS+=("$name")
  fi
}

echo "[bstar-engraving-gate-test] Running..."

# INPUT A: new B_*.md without opus_reviewed_seed → BLOCK
run_test "INPUT A: new B_TEST without opus_reviewed_seed → BLOCK" \
  '{"tool_name":"Write","tool_input":{"file_path":"docs/plan/pillar-0-governance/behavioral-contracts/B_NEW_CONTRACT.md","content":"---\nenforcement_trio:\n  t1:\n    tier: hook\n    path: null\n    status: none\n---\n# B_NEW_CONTRACT"}}' 2

# INPUT B: new B_*.md with opus_reviewed_seed → ALLOW
run_test "INPUT B: new B_TEST with opus_reviewed_seed → ALLOW" \
  '{"tool_name":"Write","tool_input":{"file_path":"docs/plan/pillar-0-governance/behavioral-contracts/B_NEW_CONTRACT.md","content":"---\nopus_reviewed_seed: abc1234def5678901234567890123456789012ef\nenforcement_trio:\n  t1:\n    tier: hook\n    path: null\n    status: none\n---\n# B_NEW_CONTRACT"}}' 0

# INPUT C: Edit to existing B_PRACE.md (not Write) → ALLOW
run_test "INPUT C: Edit to existing B_PRACE.md → ALLOW (exempt)" \
  '{"tool_name":"Edit","tool_input":{"file_path":"docs/plan/pillar-0-governance/behavioral-contracts/B_PRACE.md","old_string":"x","new_string":"y"}}' 0

# INPUT D: Write to non-B_*.md → ALLOW
run_test "INPUT D: Write to tools/README.md → ALLOW" \
  '{"tool_name":"Write","tool_input":{"file_path":"tools/README.md","content":"# Tools\nsome content"}}' 0

# INPUT E: Write B_TEST_FAKE.md (placeholder stem) → ALLOW
run_test "INPUT E: B_TEST_FAKE.md (placeholder) → ALLOW" \
  '{"tool_name":"Write","tool_input":{"file_path":"docs/plan/pillar-0-governance/behavioral-contracts/B_TEST_FAKE.md","content":"---\nenforcement_trio:\n  t1:\n    tier: hook\n    path: null\n    status: none\n---\n# B_TEST"}}' 0

echo ""
echo "[bstar-engraving-gate-test] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -gt 0 ] && echo "FAILURES: ${ERRORS[*]}" && exit 1
echo "[bstar-engraving-gate-test] ALL PASS ✅"
