#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-proto-inline
# @csps-version 6.1.0 S074: file-read + mtime guard (only fires if opus-turn.md modified within 60s)
# @csps-enforces B_PRESENT_PROTO_INLINE AP-001
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OPUSFILE="${REPO_ROOT}/tools/council/opus-turn.md"
[ -f "$OPUSFILE" ] || exit 0
MTIME=$(stat -c %Y "$OPUSFILE" 2>/dev/null || echo "0")
NOW=$(date +%s)
AGE=$((NOW - MTIME))
[ "$AGE" -gt 60 ] && exit 0
command -v node >/dev/null 2>&1 || exit 0
node -e "
const fs=require('fs');
try{
  const content=fs.readFileSync(process.argv[1],'utf8');
  const isProto=/(^|\n)#\s*PROTO-/.test(content)||/THIS IS:[^\n]*(PROTO|COURSE-CORRECT|directive)/i.test(content);
  if(!isProto)process.exit(0);
  if(!fs.existsSync('.csps'))fs.mkdirSync('.csps',{recursive:true});
  fs.writeFileSync('.csps/last-proto-relay.txt',content);
  process.stdout.write(JSON.stringify({systemMessage:'⚠ MANDATORY [B_PRESENT_PROTO_INLINE]: PROTO written to opus-turn.md. Present FULL block inline — fenced, verbatim, paste-ready for Governor. Auto-saved: .csps/last-proto-relay.txt'})+'\n');
}catch(e){}
" "$OPUSFILE" 2>/dev/null || true
exit 0
