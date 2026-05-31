#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-handoff-relay-inline
# @csps-version 6.0.0 S074: read file directly after write
# @csps-enforces B_TAB_TRANSFER_REVIEW AP-001
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
command -v node >/dev/null 2>&1 || exit 0
# Find most recently modified HANDOFF or chat-jump-prompt file
HANDOFF_FILE=$(ls -t "${REPO_ROOT}/docs/plan/_handoff/HANDOFF-S"*.md "${REPO_ROOT}/docs/plan/_handoff/VAULT/chat-jump-prompt-"*.md 2>/dev/null | head -1 || echo "")
[ -z "$HANDOFF_FILE" ] || [ ! -f "$HANDOFF_FILE" ] && exit 0
# Only fire if file was modified within last 30 seconds
MTIME=$(stat -c %Y "$HANDOFF_FILE" 2>/dev/null || echo "0")
NOW=$(date +%s)
AGE=$((NOW - MTIME))
[ "$AGE" -gt 30 ] && exit 0
node -e "
const fs=require('fs'),path=require('path');
try{
  const content=fs.readFileSync(process.argv[1],'utf8');
  if(!content.trim())process.exit(0);
  if(!fs.existsSync('.csps'))fs.mkdirSync('.csps',{recursive:true});
  fs.writeFileSync('.csps/last-handoff-draft.txt',content);
  const fn=path.basename(process.argv[1]);
  process.stdout.write(JSON.stringify({systemMessage:'⚠ MANDATORY [TAB-TRANSFER-REVIEW]: '+fn+' written. Present inline for OPUS-16 review before Governor pastes. Auto-saved: .csps/last-handoff-draft.txt'})+'\n');
}catch(e){}
" "$HANDOFF_FILE" 2>/dev/null || true
exit 0
