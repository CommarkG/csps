#!/usr/bin/env bash
# @csps-id csps.claude.hooks.executor-relay-inline
# @csps-version 7.0.0 S076-Phase-B: executor-agnostic relay — any executor relay uses this format
# @csps-enforces HARDWIRE-009 (executor relay format) B_PRESENT_SONNET_RELAY_INLINE AP-001
# Phase B S076: de-roled from Sonnet-specific to executor-agnostic.
# Still fires on sonnet-turn.md writes (scaffold channel name unchanged); format enforcement is system-layer.
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
  process.stdout.write(JSON.stringify({systemMessage:'⚠ MANDATORY [HARDWIRE-009 EXECUTOR-RELAY]: relay channel written. Present FULL paste-ready block inline NOW — I AM/YOU ARE/THIS IS/DO NOW header + fenced content. ONE-CLICK copy for Governor. Executor-agnostic format (any model). Auto-saved: .csps/last-sonnet-relay.txt'})+'\n');
}catch(e){}
" "$SONNETFILE" 2>/dev/null || true
# S084 COMM-CORE S7: Also fire on opus-turn.md PROTO writes (ELEMENT 3 ACTION)
# When Opus writes a PROTO to opus-turn.md, surface one-click relay block requirement.
# Prevents drift: Opus writes PROTO → Governor cannot one-click relay → ELEMENT 3 ACTION lost.
OPUSFILE="${REPO_ROOT}/tools/council/opus-turn.md"
if [ -f "$OPUSFILE" ]; then
  OPUS_MTIME=$(stat -c %Y "$OPUSFILE" 2>/dev/null || echo "0")
  OPUS_AGE=$((NOW - OPUS_MTIME))
  if [ "$OPUS_AGE" -le 60 ] 2>/dev/null; then
    node -e "
      const fs=require('fs');
      try{
        const c=fs.readFileSync(process.argv[1],'utf8');
        if(!c.includes('═══')&&!c.includes('PROTO-S'))process.exit(0);
        process.stdout.write(JSON.stringify({systemMessage:'⚠ MANDATORY [COMM-CORE ELEMENT 3]: PROTO written to opus-turn.md. Emit ONE-CLICK relay block for Governor before closing. Format: From OPUS | For SONNET TAB + fenced content. Prevents lost ACTION at boundary.'})+" ");
      }catch(e){}
    " "$OPUSFILE" 2>/dev/null || true
  fi
fi

exit 0