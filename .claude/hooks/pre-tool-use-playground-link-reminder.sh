#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-playground-link-reminder
# @csps-name pre-tool-use-playground-link-reminder
# @csps-description PreToolUse ADVISORY hook — fires before Write to new playground pages.
#   When creating apps/csps-playground/platform/*/index.html, reminds to add the link
#   to the parent index. T2 (validate-playground-links.mjs) is BLOCKING — this T1 is advisory.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces VALIDATE-PLAYGROUND-LINKS

set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
FILE_PATH=$(echo "$TOOL_INPUT" | node -e "
try { let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ try{ console.log(JSON.parse(d).file_path||''); } catch{ console.log(''); } }); } catch{ console.log(''); }
" 2>/dev/null || echo "")

NORMALIZED=$(echo "$FILE_PATH" | tr '\\' '/')
IS_PLATFORM_PAGE=$(echo "$NORMALIZED" | grep -Eq "apps/csps-playground/platform/[^/]+/index\.html$" && echo "true" || echo "false")
FILE_EXISTS=$(test -f "$FILE_PATH" && echo "true" || echo "false")

if [ "$IS_PLATFORM_PAGE" = "false" ] || [ "$FILE_EXISTS" = "true" ]; then exit 0; fi

DIR=$(echo "$NORMALIZED" | sed 's|.*/platform/\([^/]*\)/.*|\1|')
echo "[playground-link-reminder] ADVISORY: Creating new platform page: /platform/$DIR/"
echo "[playground-link-reminder] Add a link to apps/csps-playground/platform/index.html in the same commit."
echo "[playground-link-reminder] T2 validate-playground-links.mjs will BLOCK if missing."

exit 0
