#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-check-existing
# @csps-name pre-tool-use-check-existing
# @csps-description PreToolUse hook — fires before Write to docs/ or tools/ directories.
#   Injects: PREVENTION GATE — did you check what exists before creating this?
#   Core prevention: B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK was T3-only.
#   This T1 makes the "check first" requirement fire mechanically at creation time.
#   Training default: "if a task appears, start building." Override: check first.
#   ADVISORY mode — exits 0 always. Promotes to BLOCKING after 3 false-positive-free sessions.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK P-META-019
# @core-seed: PREVENTION_T1_GATE | plan: prevention-framework (unified-plan.yaml) | grows-to: pre-tool-use-check-existing.sh BLOCKING after 3 false-positive-free sessions | target: S044

set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
try {
  let d = '';
  process.stdin.on('data', c => d += c);
  process.stdin.on('end', () => {
    try {
      const j = JSON.parse(d);
      console.log(j.file_path || j.path || '');
    } catch { console.log(''); }
  });
} catch { console.log(''); }
" 2>/dev/null || echo "")

# Only fire for new files in docs/ or tools/
if [ -z "$FILE_PATH" ]; then exit 0; fi

IS_DOCS=$(echo "$FILE_PATH" | grep -Eq "^docs/|/docs/|docs\\\\" && echo "true" || echo "false")
IS_TOOLS=$(echo "$FILE_PATH" | grep -Eq "^tools/|/tools/|tools\\\\" && echo "true" || echo "false")
FILE_EXISTS=$(test -f "$FILE_PATH" && echo "true" || echo "false")

# Only fire for NEW files in governed directories
if [ "$FILE_EXISTS" = "true" ]; then exit 0; fi
if [ "$IS_DOCS" = "false" ] && [ "$IS_TOOLS" = "false" ]; then exit 0; fi

# Extract filename concept for search suggestion
CONCEPT=$(basename "$FILE_PATH" | sed 's/\.[^.]*$//' | sed 's/[-_]/ /g')

echo "[prevention-gate] ADVISORY: Creating new file in governed directory: $FILE_PATH"
echo "[prevention-gate] Before creating: did you check what already exists?"
echo "[prevention-gate] Search: git grep '$CONCEPT' | head -20"
echo "[prevention-gate] Search: ls tools/validators/ | grep -i '$CONCEPT'"
echo "[prevention-gate] Search: grep -r '$CONCEPT' docs/plan/pillar-0-governance/"
echo "[prevention-gate] If you checked and nothing exists: proceed."
echo "[prevention-gate] If you found something similar: use it or cross-reference it."
echo "[prevention-gate] B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK — T1 enforcement active."

exit 0
