#!/usr/bin/env bash
# pre-tool-use-sacred-file-guard.sh
# ─────────────────────────────────────────────────────────────────────────────
# SACRED FILE GUARD — protection_level enforcement
# Reads target file's frontmatter. Blocks writes to sacred files without
# explicit Governor authorization. Warns on protected files.
#
# PROTECTION LEVELS:
#   sacred    → EXIT 2 (BLOCK). Requires Governor explicit authorization.
#   protected → EXIT 0 with WARNING. Advisory — session ratification needed.
#   active    → EXIT 0, silent pass.
#   draft     → EXIT 0, silent pass.
#
# AUTHORIZATION BYPASS: If the TOOL_INPUT contains the phrase
#   "AUTHORIZED: [reason]" — sacred file block is bypassed.
#   This phrase must appear in the Governor's message, not AI-generated.
# ─────────────────────────────────────────────────────────────────────────────

TARGET_FILE="${TOOL_INPUT_file_path:-${TOOL_INPUT_path:-}}"

# Only run if we have a target file path
if [ -z "$TARGET_FILE" ]; then
  exit 0
fi

# Only check .md files (sacred files are always markdown)
if [[ "$TARGET_FILE" != *.md ]]; then
  exit 0
fi

# File must exist to check its protection level (new files = no protection yet)
if [ ! -f "$TARGET_FILE" ]; then
  exit 0
fi

# Extract protection_level from frontmatter (first 30 lines)
PROTECTION=$(head -30 "$TARGET_FILE" | grep "^protection_level:" | head -1 | sed 's/protection_level:[[:space:]]*//' | tr -d '"'"'" | tr -d '[:space:]')

if [ -z "$PROTECTION" ]; then
  exit 0
fi

# Check for authorization bypass in tool context
# The hook has access to the conversation context via TOOL_INPUT
if echo "${TOOL_INPUT:-}" | grep -qi "AUTHORIZED:"; then
  echo "[sacred-guard] Authorization phrase detected — bypass permitted for $TARGET_FILE"
  exit 0
fi

case "$PROTECTION" in
  sacred)
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              SACRED FILE — WRITE BLOCKED                    ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║ File: $(basename "$TARGET_FILE")"
    echo "║ Protection: SACRED"
    echo "║"
    echo "║ This file is a platform invariant. Modifications require"
    echo "║ explicit Governor authorization."
    echo "║"
    echo "║ TO AUTHORIZE: Governor must include in their message:"
    echo "║   AUTHORIZED: [reason for modification]"
    echo "║"
    echo "║ Without this phrase, all writes to this file are blocked."
    echo "╚══════════════════════════════════════════════════════════════╝"
    exit 2
    ;;
  protected)
    echo ""
    echo "⚠ PROTECTED FILE: $(basename "$TARGET_FILE")"
    echo "  protection_level: protected"
    echo "  Advisory: This file requires session ratification before modification."
    echo "  Ensure Opus has approved this change before proceeding."
    echo ""
    exit 0
    ;;
  *)
    # active, draft, or unknown — silent pass
    exit 0
    ;;
esac
