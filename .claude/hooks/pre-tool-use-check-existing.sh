#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-check-existing
# @csps-name pre-tool-use-check-existing
# @csps-description PreToolUse hook — fires before Write to docs/ or tools/ directories,
#   AND before AskUserQuestion or EnterPlanMode tool calls.
#   Injects: PREVENTION GATE — did you check what exists before creating/naming/proposing this?
#   Core prevention: B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK was T3-only.
#   This T1 makes the "check first" requirement fire mechanically at creation time.
#   Training default: "if a task appears, start building." Override: check first.
#   S076 CQS EXTENSION: also fires on AskUserQuestion + EnterPlanMode — any proposal of options
#   or new framing must cite vocabulary/glossary/principles search first (CQS PP0: "does this exist?")
#   Governor directive: "any ? → check what exists" — mechanical embodiment.
#   ADVISORY mode — exits 0 always. Promotes to BLOCKING after 3 false-positive-free sessions.
# @csps-version 1.1.0 S076-CQS: + AskUserQuestion/EnterPlanMode trigger + PP0 injection
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK P-META-019 CQS-PP0

set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
TOOL_NAME="${CLAUDE_TOOL_NAME:-}"

# S076 EXTENSION: fire on AskUserQuestion + EnterPlanMode (new framing/options = check first)
if [ "$TOOL_NAME" = "AskUserQuestion" ] || [ "$TOOL_NAME" = "EnterPlanMode" ]; then
  echo ""
  echo "[CQS-PP0] ADVISORY: You are about to propose options or a new framing (${TOOL_NAME})."
  echo "[CQS-PP0] CQS Universal Question PP0 applies:"
  echo "[CQS-PP0]   'Does this concept, term, or mechanism ALREADY EXIST in CSPS?'"
  echo "[CQS-PP0]   (Cite the search result BEFORE naming anything new.)"
  echo "[CQS-PP0] Run: node tools/scripts/platform-inventory-scan.mjs --exhaustive | grep <concept>"
  echo "[CQS-PP0] Run: grep -r '<term>' packages/principles/ tools/vault/ | head -10"
  echo "[CQS-PP0] If search returns nothing: proceed with new concept."
  echo "[CQS-PP0] If search returns something: USE IT or explicitly cross-reference it."
  echo "[CQS-PP0] B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK + CQS PP0 (cqs-sets.yaml)"
  echo ""
  exit 0
fi

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
echo "[prevention-gate] CQS PP0: does this concept already exist? (cite search or withdraw)"
echo "[prevention-gate] Search: git grep '$CONCEPT' | head -20"
echo "[prevention-gate] Search: ls tools/validators/ | grep -i '$CONCEPT'"
echo "[prevention-gate] Search: grep -r '$CONCEPT' docs/plan/pillar-0-governance/"
echo "[prevention-gate] If you checked and nothing exists: proceed."
echo "[prevention-gate] If you found something similar: use it or cross-reference it."
echo "[prevention-gate] B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK + CQS PP0 — T1 enforcement active."

exit 0
