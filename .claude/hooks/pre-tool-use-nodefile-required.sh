#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-nodefile-required
# @csps-name pre-tool-use-nodefile-required
# @csps-description ADVISORY pre-tool-use hook for NODEFILE-CONTRACT compliance.
#   Fires on Edit/Write to in-scope NodeFiles (core-spines L1/L2 + pillar headers).
#   Reminds the author that the NodeFile contract requires specific fields.
#   ADVISORY S068 → BLOCKING after PVA (NODEFILE-CONTRACT §105).
#   Does NOT block — emits warning only. wiring_state: active.
#
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces NODEFILE-CONTRACT CSPS-PLANNING-DISCIPLINE-§14 validate-nodefile-compliance

set -euo pipefail

# Parse tool input
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

# Only fire on Edit or Write
if [ "$TOOL_NAME" != "Edit" ] && [ "$TOOL_NAME" != "Write" ]; then
  exit 0
fi

FILE_PATH_NORM="${FILE_PATH//\\//}"

# Scope: core-spines L1/L2 + pillar headers + docs/plan top-level
IS_NODEFILE=false
NODEFILE_PATTERNS=(
  "core-spines/L1_"
  "core-spines/L2_"
  "pillar-0-governance/README"
  "pillar-1-architecture"
  "pillar-2-data"
  "pillar-3-platform"
  "pillar-4-developer"
  "pillar-5-ai-systems"
  "pillar-6-operations"
  "pillar-7-product"
  "docs/plan/README"
  "docs/plan/FOUNDATION"
  "docs/plan/INTAKE"
  "docs/plan/platform-excellence"
)

for pattern in "${NODEFILE_PATTERNS[@]}"; do
  if echo "$FILE_PATH_NORM" | grep -q "$pattern"; then
    IS_NODEFILE=true
    break
  fi
done

[ "$IS_NODEFILE" = false ] && exit 0

# ADVISORY: remind about NodeFile contract fields
echo "[nodefile-required] ADVISORY: Editing NodeFile-scope artifact: $(basename "$FILE_PATH")" >&2
echo "[nodefile-required] Ensure frontmatter declares: id · core_spine · type · inherits_from · links · context_question" >&2
echo "[nodefile-required] Delta fields per NODEFILE-CONTRACT: pillar · element_class · d_level · wiring_state · ripple_seeds · unique_addition" >&2
echo "[nodefile-required] pillar: derivable from path (pillar-N-* → N). ADVISORY S068 → BLOCKING after PVA." >&2

# ADVISORY: exit 0
exit 0
