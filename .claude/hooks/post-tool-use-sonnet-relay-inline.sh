#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-sonnet-relay-inline
# @csps-version 6.1.0 S074: file-read + mtime guard
# @csps-enforces B_PRESENT_SONNET_RELAY_INLINE AP-001
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SONNETFILE="${REPO_ROOT}/tools/council/sonnet-turn.md"
[ -f "$SONNETFILE" ] || exit 0
MTIME=$(stat -c %Y "$SONNETFILE" 2>/dev/null || echo "0")
NOW=$(date +%s)
AGE=$((NOW - MTIME))
[ "$AGE" -gt 60 ] && exit 0
command -v node >/dev/null 2>&1 || exit 0
node -e "
const fs=require('fs');
try{
  const content=fs.readFileSync(process.argv[1],'utf8');
  if(!content.trim())process.exit(0);
  if(!fs.existsSync('.csps'))fs.mkdirSync('.csps',{recursive:true});
  fs.writeFileSync('.csps/last-sonnet-relay.txt',content);
  process.stdout.write(JSON.stringify({systemMessage:'⚠ MANDATORY [B_PRESENT_SONNET_RELAY_INLINE]: sonnet-turn.md written. Present FULL block inline (I AM/YOU ARE/THIS IS/DO NOW). Copy-paste ready for Governor to relay to Opus. Auto-saved: .csps/last-sonnet-relay.txt'})+'\n');
}catch(e){}
" "$SONNETFILE" 2>/dev/null || true
exit 0
