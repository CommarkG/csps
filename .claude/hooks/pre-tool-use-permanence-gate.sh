#!/usr/bin/env bash
# pre-tool-use-permanence-gate.sh
# PROTO-NORTHSTAR-1 follow-on | S060 Permanence-by-Default
#
# T1 GATE: Fires before Write/Edit tool calls on governance artifacts.
# PURPOSE: Make permanence the DEFAULT at creation time, not an afterthought.
#
# WHAT IT CHECKS:
#   1. New B_*.md files: must include T1/T2/T3 declarations ("Mechanical surfaces")
#   2. New principle entries in principles.yaml: must include enforcement_tier
#   3. New entries in behavioral-contracts.md shards: must have mechanical surfaces
#
# WHAT IT DOES ON VIOLATION:
#   Outputs advisory message (exit 0 — never blocks, by design).
#   Governor + Sonnet SEE the warning and know to add enforcement.
#
# WHY EXIT 0 (ADVISORY):
#   T2 (validate-permanence-coverage.mjs) is the real gate.
#   T1 advisory prevents the "I forgot" pattern — the author sees the warning
#   at write time, not discover days later at pnpm verify.
#
# DESIGN: docs/plan/_handoff/VAULT/inner-ai-defaults/permanence-mechanics.md
#   "T1 is the ONLY enforcement that fires BEFORE a violation enters the codebase."
set -euo pipefail

TOOL_NAME="${TOOL_NAME:-}"
TOOL_INPUT="${TOOL_INPUT:-}"

# Only care about Write and Edit tool calls
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Extract file_path from tool input (JSON)
FILE_PATH=$(node -e "try{const i=JSON.parse(process.env.TOOL_INPUT||'{}');process.stdout.write(i.file_path||i.path||'');}catch(e){}" 2>/dev/null || echo "")

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# ── Check 1: New B_* behavioral contract ──────────────────────────────────────
if echo "$FILE_PATH" | grep -Eq "behavioral-contracts/B_[A-Z_]+\.md$"; then
  # Get content being written (new_content for Write, new_string for Edit)
  CONTENT=$(node -e "
try{
  const i = JSON.parse(process.env.TOOL_INPUT || '{}');
  const c = i.content || i.new_string || '';
  process.stdout.write(c.slice(0, 2000));
}catch(e){}
" 2>/dev/null || echo "")

  # Check for mechanical surfaces declarations
  HAS_MECHANICAL=$(echo "$CONTENT" | grep -qi "mechanical surfaces\|enforcement_trio\|- hook:\|- validator" && echo "yes" || echo "no")

  if [ "$HAS_MECHANICAL" = "no" ] && [ -n "$CONTENT" ]; then
    echo "[permanence-gate] ⚠ NEW B_* contract without Mechanical surfaces block"
    echo "[permanence-gate]   File: $FILE_PATH"
    echo "[permanence-gate]   Missing: T1 hook + T2 validator + T3 schema/memory declarations"
    echo "[permanence-gate]   Required: 'Mechanical surfaces (5/5 declared)' section with:"
    echo "[permanence-gate]     - hook: .claude/hooks/pre-tool-use-NAME.sh"
    echo "[permanence-gate]     - validator (atomic): \`validate-NAME.mjs\`"
    echo "[permanence-gate]     - schema: [field or pattern]"
    echo "[permanence-gate]     - memory: feedback_NAME.md"
    echo "[permanence-gate]     - contract: this entry + AGENTS.md hard NO"
    echo "[permanence-gate]   Permanence mechanics: docs/plan/_handoff/VAULT/inner-ai-defaults/permanence-mechanics.md"
  fi
fi

# ── Check 2: principles.yaml entry ───────────────────────────────────────────
if echo "$FILE_PATH" | grep -Eq "principles\.yaml$"; then
  CONTENT=$(node -e "
try{
  const i = JSON.parse(process.env.TOOL_INPUT || '{}');
  const c = i.content || i.new_string || '';
  process.stdout.write(c.slice(0, 2000));
}catch(e){}
" 2>/dev/null || echo "")

  # Only check if adding a new principle entry (has an 'id:' field)
  HAS_NEW_PRINCIPLE=$(echo "$CONTENT" | grep -q "^- id:\|^  id:" && echo "yes" || echo "no")
  HAS_ENFORCEMENT=$(echo "$CONTENT" | grep -q "enforcement_tier:\|enforcement_location:" && echo "yes" || echo "no")

  if [ "$HAS_NEW_PRINCIPLE" = "yes" ] && [ "$HAS_ENFORCEMENT" = "no" ]; then
    echo "[permanence-gate] ⚠ New principle entry missing enforcement_tier"
    echo "[permanence-gate]   File: $FILE_PATH"
    echo "[permanence-gate]   Required: enforcement_tier: T1|T2|T3|T1+T2|T1+T2+T3"
    echo "[permanence-gate]   Reference: permanence-mechanics.md §2"
  fi
fi

# ── Check 3: Behavioral contract shard modification ──────────────────────────
if echo "$FILE_PATH" | grep -Eq "behavioral-contracts-(GVRN|ARCH|AI|OPER|VALD)\.md$"; then
  CONTENT=$(node -e "
try{
  const i = JSON.parse(process.env.TOOL_INPUT || '{}');
  const c = i.content || i.new_string || '';
  process.stdout.write(c.slice(0, 3000));
}catch(e){}
" 2>/dev/null || echo "")

  # Check if this is adding a new B_* section
  HAS_NEW_BSTAR=$(echo "$CONTENT" | grep -q "^## B_" && echo "yes" || echo "no")
  HAS_MECHANICAL=$(echo "$CONTENT" | grep -qi "mechanical surfaces\|enforcement_trio" && echo "yes" || echo "no")

  if [ "$HAS_NEW_BSTAR" = "yes" ] && [ "$HAS_MECHANICAL" = "no" ]; then
    echo "[permanence-gate] ⚠ New B_* section in shard without Mechanical surfaces"
    echo "[permanence-gate]   File: $FILE_PATH"
    echo "[permanence-gate]   Add 'Mechanical surfaces (5/5 declared)' section to every new contract"
  fi
fi

exit 0
