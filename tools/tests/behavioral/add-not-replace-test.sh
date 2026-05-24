#!/usr/bin/env bash
# Behavioral test: pre-tool-use-add-not-replace-gate.sh
# Verifies the hook blocks Write operations that remove >50% of existing content.
#
# Usage: bash tools/tests/behavioral/add-not-replace-test.sh
# Exit: 0 = all cases pass | 1 = behavioral guarantee violated

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOK="${REPO_ROOT}/.claude/hooks/pre-tool-use-add-not-replace-gate.sh"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

PASS=0
FAIL=0

check() {
  local name="$1" expected_exit="$2"
  local json="$3"
  local actual_exit=0
  echo "$json" | bash "$HOOK" > /dev/null 2>&1 || actual_exit=$?
  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo "  ✓ $name (exit=$actual_exit, expected=$expected_exit)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (exit=$actual_exit, expected=$expected_exit)"
    FAIL=$((FAIL + 1))
  fi
}

# Helper: JSON-encode a string (handles newlines, quotes, etc.)
json_encode() {
  echo "$1" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(d)))"
}

# Create a 100-line existing file
EXISTING_FILE="${TMP_DIR}/ExistingPage.tsx"
for i in $(seq 1 100); do echo "// existing line $i"; done > "$EXISTING_FILE"

# Create small content (20 lines) — must be JSON-encoded for valid JSON
SMALL_CONTENT=$(for i in $(seq 1 20); do echo "// new line $i"; done)
SMALL_JSON=$(json_encode "$SMALL_CONTENT")

# Create large content (80 lines) — JSON-encoded
LARGE_CONTENT=$(for i in $(seq 1 80); do echo "// new line $i"; done)
LARGE_JSON=$(json_encode "$LARGE_CONTENT")

# Create a DO NOT REPLACE protected file (100 lines)
PROTECTED_FILE="${TMP_DIR}/ProtectedPage.tsx"
echo "// DO NOT REPLACE without explicit Governor directive" > "$PROTECTED_FILE"
for i in $(seq 2 100); do echo "// protected line $i"; done >> "$PROTECTED_FILE"

# Create medium content (50 lines) for the protected file test
MEDIUM_CONTENT=$(for i in $(seq 1 50); do echo "// replacement line $i"; done)
MEDIUM_JSON=$(json_encode "$MEDIUM_CONTENT")

echo ""
echo "pre-tool-use-add-not-replace-gate.sh behavioral test"
echo ""

# INPUT A: Write to existing 100-line file with 20-line replacement → BLOCK (exit=1)
JSON_A=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$EXISTING_FILE" "$SMALL_JSON")
check "INPUT A (Write existing 100-line with 20-line = 80% reduction) → BLOCK" 1 "$JSON_A"

# INPUT B: Write to existing 100-line file with 80-line update → PASS (exit=0)
JSON_B=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$EXISTING_FILE" "$LARGE_JSON")
check "INPUT B (Write existing 100-line with 80-line = 20% reduction) → PASS" 0 "$JSON_B"

# INPUT C: Write to NEW file (doesn't exist) → PASS (exit=0)
JSON_C=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "${TMP_DIR}/NewFile.tsx" "$SMALL_JSON")
check "INPUT C (Write to new file that doesn't exist) → PASS" 0 "$JSON_C"

# INPUT D: Edit tool (not Write) → PASS (exit=0)
JSON_D=$(printf '{"tool_name":"Edit","tool_input":{"file_path":"%s","old_string":"old","new_string":"new"}}' \
  "$EXISTING_FILE")
check "INPUT D (Edit tool, not Write) → PASS" 0 "$JSON_D"

# INPUT E: Non-.tsx file → PASS (exit=0)
JSON_E=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":"tiny"}}' \
  "${TMP_DIR}/config.yaml")
check "INPUT E (Write to .yaml, not .tsx) → PASS" 0 "$JSON_E"

# INPUT F: Protected file with DO NOT REPLACE → BLOCK even at 50-line replacement
JSON_F=$(printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":%s}}' \
  "$PROTECTED_FILE" "$MEDIUM_JSON")
check "INPUT F (Protected DO NOT REPLACE file with 50-line replacement) → BLOCK" 1 "$JSON_F"

echo ""
echo "$((PASS + FAIL)) test(s): $PASS passed, $FAIL failed"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BEHAVIORAL GUARANTEE VIOLATED: pre-tool-use-add-not-replace-gate.sh is not catching REPLACE operations."
  exit 1
fi

echo "Behavioral guarantee confirmed: ADD not REPLACE gate catches content replacement."
exit 0
