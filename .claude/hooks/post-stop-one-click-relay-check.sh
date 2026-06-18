#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-one-click-relay-check
# @csps-name post-stop-one-click-relay-check
# @csps-description PostStop hook — BLOCKING (exit 2). The 100x-recurring failure fix (Governor S084).
#   Scans the last AI response. If it gives the Governor a RELAY / PASTE imperative
#   (paste this / into a tab / relay to Sonnet / send to a builder tab / handoff to a new tab)
#   but contains NO fenced ``` code block (i.e. nothing one-click-copyable, or it points to a
#   file to "go read") → BLOCK with exit 2 and force the response to re-emit as a single
#   self-contained fenced one-click block. ACTION = Communication-Core Element 3.
#   WHY BLOCKING not advisory: advisory (T3) drifted 100x. AP-001 EXISTS != ACTIVE.
#   node-based (python3 is absent on this host — the older python hooks silently no-op here).
#   Fail-open on any parse error (never wedge the session on a hook bug).
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_ZERO_NAVIGATION_FOR_GOVERNOR COMMUNICATION-CORE-element-3 one-click-relay
set -euo pipefail

TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
[ -z "$TRANSCRIPT_PATH" ] && exit 0
[ ! -f "$TRANSCRIPT_PATH" ] && exit 0
command -v node >/dev/null 2>&1 || exit 0

VERDICT=$(node -e '
const fs=require("fs");
(function(){
  let text="";
  try{
    const lines=fs.readFileSync(process.argv[1],"utf8").split("\n").filter(l=>l.trim());
    for(let i=lines.length-1;i>=0;i--){
      let m; try{m=JSON.parse(lines[i]);}catch(e){continue;}
      if(m.type==="assistant"){
        const c=m.message&&m.message.content;
        if(Array.isArray(c)) text=c.filter(x=>x&&x.type==="text").map(x=>x.text).join("\n");
        else if(typeof c==="string") text=c;
        break;
      }
    }
  }catch(e){ console.log("PASS"); return; }
  if(!text||text.length<40){ console.log("PASS"); return; }
  const relay=/(paste this|paste the box|paste block|paste ?[①②③]|paste into|copy this into|copy the block|relay this|relay the block|relay it to|into a (fresh |new |sonnet |opus |builder )?tab|to a (sonnet|builder|opus|fresh|new) tab|send (this|it) to sonnet|hand ?off (this|to)|open a (fresh|new) .{0,12}tab)/i.test(text);
  if(!relay){ console.log("PASS"); return; }
  const hasFence=/```/.test(text);
  console.log(hasFence ? "PASS" : "BLOCK");
})();
' "$TRANSCRIPT_PATH" 2>/dev/null || echo "PASS")

if [ "$VERDICT" = "BLOCK" ]; then
  echo "" >&2
  echo "[one-click-relay] BLOCK — you gave a RELAY/PASTE instruction with NO fenced one-click block." >&2
  echo "  The Governor RELAYS your output; he does not navigate or 'go read a file'." >&2
  echo "  RE-EMIT the relayed content as a SINGLE self-contained fenced \`\`\` block — one click to copy," >&2
  echo "  nothing to fetch. One block per recipient. (COMMUNICATION-CORE Element 3 — BLOCKING, S084.)" >&2
  exit 2
fi
exit 0
