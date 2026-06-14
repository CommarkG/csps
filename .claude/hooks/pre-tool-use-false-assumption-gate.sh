#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-false-assumption-gate
# @csps-name pre-tool-use-false-assumption-gate
# @csps-description B_META_QUESTION_DISCIPLINE T1 hook.
#   Fires on Write/Edit to tab-transfer artifacts (HANDOFFs, sonnet-turn.md,
#   startup-blocks). ADVISORY S067: warns if content lacks ## False Assumptions
#   section with ≥10 items. BLOCKING S068: prevents write without checklist.
#
#   WHAT THIS PREVENTS: Tab-transfer artifacts emitted without the constitutional
#   "What are the false assumptions here?" checklist. S067 startup block v2
#   demonstrated the pattern works — this hook makes it mechanical.
#
#   TAB-TRANSFER ARTIFACTS (targets):
#   - docs/plan/_handoff/HANDOFF-*.md
#   - tools/council/sonnet-turn.md (CHECKPOINTs)
#   - .csps/startup-blocks/*.txt
#   - docs/plan/_handoff/STEP-6-implementation-plan.md
#
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_META_QUESTION_DISCIPLINE P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE

set -euo pipefail

# Parse tool input from stdin
TOOL_INPUT=$(cat)

TOOL_NAME=$(echo "$TOOL_INPUT" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try { const d = JSON.parse(chunks.join('')); process.stdout.write(d.tool_name || d.name || ''); }
  catch { process.stdout.write(''); }
});" 2>/dev/null <<< "$TOOL_INPUT" || echo "")

FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try { const d = JSON.parse(chunks.join('')); process.stdout.write(d.tool_input?.file_path || d.file_path || ''); }
  catch { process.stdout.write(''); }
});" 2>/dev/null <<< "$TOOL_INPUT" || echo "")

# Only fire on Edit or Write tools
if [ "$TOOL_NAME" != "Edit" ] && [ "$TOOL_NAME" != "Write" ]; then
  exit 0
fi

# Normalize path
FILE_PATH_NORM="${FILE_PATH//\\//}"

# Check if file is a tab-transfer artifact
IS_TAB_TRANSFER=false
TAB_TRANSFER_PATTERNS=(
  "HANDOFF-"
  "sonnet-turn.md"
  "startup-blocks"
  "STEP-6-implementation-plan"
  "tab-transfer-template"
  "chat-jump-prompt"
)

for pattern in "${TAB_TRANSFER_PATTERNS[@]}"; do
  if echo "$FILE_PATH_NORM" | grep -q "$pattern"; then
    IS_TAB_TRANSFER=true
    break
  fi
done

[ "$IS_TAB_TRANSFER" = false ] && exit 0

# Get content being written
CONTENT=$(echo "$TOOL_INPUT" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try {
    const d = JSON.parse(chunks.join(''));
    const c = d.tool_input?.content || d.content || d.tool_input?.new_string || d.new_string || '';
    process.stdout.write(c);
  } catch { process.stdout.write(''); }
});" 2>/dev/null <<< "$TOOL_INPUT" || echo "")

# S084 PREV-1(b): P-META-032 PROVENANCE LABELS check — ADVISORY
# Fires when a number appears on the same line as 'verified' or 'confirmed'
# but the line does NOT contain '[MEASURED:' provenance tag.
# Matches S067→S068 advisory ladder (advisory only; promotion at K=2 incidents).
# Prevention class: PREDICTED-AS-MEASURED.
PROV_MISLABEL_COUNT=0
if [ -n "$CONTENT" ]; then
  PROV_MISLABEL_COUNT=$(printf '%s
' "$CONTENT" | grep -iE '\b(verified|confirmed)\b' | grep -E '[0-9]' | grep -cv '\[MEASURED:' 2>/dev/null || echo "0")
fi
if [ "${PROV_MISLABEL_COUNT:-0}" -gt 0 ]; then
  echo "[provenance-gate] ADVISORY: ${PROV_MISLABEL_COUNT} line(s) in $(basename "$FILE_PATH") have a number adjacent to 'verified'/'confirmed' without [MEASURED:...] tag" >&2
  echo "[provenance-gate] P-META-032 PROVENANCE LABELS (S084): use [MEASURED:<tool>] for measured values, [PREDICTED] or [ASSUMED] for others" >&2
  echo "[provenance-gate] 'verified'/'confirmed' reserved for [MEASURED] values ONLY. ADVISORY — not blocking." >&2
fi

# Check for false-assumption section in content being written
HAS_FA_SECTION=0
FA_ITEM_COUNT=0
FA_NN_COUNT=0
MAX_COUNT=0

if echo "$CONTENT" | grep -qiE "false.assumption|False Assumption|WHAT ARE THE FALSE|false_assumption" 2>/dev/null; then
  HAS_FA_SECTION=1
fi
FA_ITEM_COUNT=$(echo "$CONTENT" | grep -o '❌' 2>/dev/null | wc -l | tr -d '[:space:]' || echo "0")
FA_NN_COUNT=$(echo "$CONTENT" | grep -oE 'FA-[0-9]{2}' 2>/dev/null | sort -u | wc -l | tr -d '[:space:]' || echo "0")
if [ "${FA_ITEM_COUNT:-0}" -gt "${FA_NN_COUNT:-0}" ]; then MAX_COUNT="${FA_ITEM_COUNT:-0}"; else MAX_COUNT="${FA_NN_COUNT:-0}"; fi

if [ "$HAS_FA_SECTION" -gt 0 ] && [ "$MAX_COUNT" -ge 10 ]; then
  # Has checklist with ≥10 items — allow
  exit 0
fi

if [ "$HAS_FA_SECTION" -gt 0 ] && [ "$MAX_COUNT" -lt 10 ]; then
  echo "[B_META_QUESTION-gate] ADVISORY: tab-transfer artifact has FA section but only ${MAX_COUNT} items (minimum 10)" >&2
  echo "[B_META_QUESTION-gate] File: $(basename "$FILE_PATH")" >&2
  echo "[B_META_QUESTION-gate] Add items: ❌ '<assumption>' / REALITY: <truth> / Fix: <action>" >&2
  # ADVISORY S067 — exit 0
  exit 0
fi

# No FA section at all — more severe advisory
echo "[B_META_QUESTION-gate] ADVISORY: tab-transfer artifact missing false-assumption checklist" >&2
echo "[B_META_QUESTION-gate] File: $(basename "$FILE_PATH")" >&2
echo "[B_META_QUESTION-gate] Required: '## WHAT ARE THE FALSE ASSUMPTIONS HERE?' + ≥10 ❌ items" >&2
echo "[B_META_QUESTION-gate] B_META_QUESTION_DISCIPLINE — ADVISORY S067 / BLOCKING S068" >&2
echo "[B_META_QUESTION-gate] Template: tools/templates/tab-transfer-template.md" >&2
# ADVISORY S067 — exit 0
exit 0
