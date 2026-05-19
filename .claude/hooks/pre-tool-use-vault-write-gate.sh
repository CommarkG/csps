#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-vault-write-gate
# @csps-name pre-tool-use-vault-write-gate
# @csps-description PreToolUse hook — fires before Write to docs/plan/_handoff/VAULT/.
#   Injects: VAULT WRITE GATE — did you check template-registry.md for an existing template?
#   Pattern: same as pre-tool-use-check-existing.sh but VAULT-specific.
#   Fires ONLY for new file creation (not edits to existing vault artifacts).
#   Does NOT fire for template-registry.md itself (circular write guard).
#   Training default: "new artifact → just write it." Override: check template-registry first.
#   ADVISORY mode — exits 0 always. Promotes to BLOCKING after 3 false-positive-free sessions.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_TEMPLATE_FIRST_CREATION P-META-015

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

if [ -z "$FILE_PATH" ]; then exit 0; fi

# Normalize path separators for matching
NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')

# Only fire for VAULT writes
IS_VAULT=$(echo "$NORMALIZED" | grep -Eq "_handoff/VAULT/" && echo "true" || echo "false")
if [ "$IS_VAULT" = "false" ]; then exit 0; fi

# Do not fire for template-registry.md itself (circular guard)
BASENAME=$(basename "$NORMALIZED")
if [ "$BASENAME" = "template-registry.md" ]; then exit 0; fi

# Only fire for NEW files (not overwriting existing vault artifacts)
FILE_EXISTS=$(test -f "$FILE_PATH" && echo "true" || echo "false")
if [ "$FILE_EXISTS" = "true" ]; then exit 0; fi

echo "[vault-write-gate] ADVISORY: Creating new VAULT artifact: $BASENAME"
echo "[vault-write-gate] Before creating: did you check _handoff/VAULT/template-registry.md?"
echo "[vault-write-gate] Search: grep -r '$BASENAME' docs/plan/_handoff/VAULT/template-registry.md"
echo "[vault-write-gate] Search: ls docs/plan/_handoff/VAULT/ | grep -i '$(echo "$BASENAME" | sed "s/\.[^.]*$//" | cut -c1-10)'"
echo "[vault-write-gate] If template found: use it or cross-reference it."
echo "[vault-write-gate] If no match: proceed. B_TEMPLATE_FIRST_CREATION — T1 enforcement active."

exit 0
