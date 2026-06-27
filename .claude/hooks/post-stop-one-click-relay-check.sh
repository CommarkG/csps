#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-one-click-relay-check
# @csps-name post-stop-one-click-relay-check
# @csps-description PostStop hook — BLOCKING (exit 2). The 100x-recurring failure fix (Governor S084/S086).
#   Scans the last AI response. If it gives the Governor a RELAY / PASTE imperative OR an imperative-relay
#   verb (paste this / into a tab / relay to Sonnet / DIRECT/HAVE/TELL/ASK Sonnet|Haiku|Opus to ...)
#   but contains NO fenced ``` code block (nothing one-click-copyable) → BLOCK exit 2 and force re-emit
#   as a single self-contained fenced one-click block. ACTION = Communication-Core Element 3.
#   S086: added imperative-relay verbs (direct/have/tell/ask <role>) — Opus kept writing "Direct Sonnet to..."
#   in OPTIMAL NEXT STEP instead of a one-click block; advisory memory (feedback_one_click_only) drifted.
#   WHY BLOCKING not advisory: advisory (T3) drifted. AP-001 EXISTS != ACTIVE.
#   node-based (python3 absent on this host). Fail-open on parse error (never wedge the session).
# @csps-version 1.2.0-relay-content-gate
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
  const relay=/(paste this|paste the box|paste block|paste ?[①②③]|paste into|copy this into|copy the block|relay this|relay the block|relay it to|relay (to|this to) (sonnet|haiku|opus)|direct (sonnet|haiku|opus)|have (sonnet|haiku|opus) [a-z]|tell (sonnet|haiku|opus)|ask (sonnet|haiku|opus) to|into a (fresh |new |sonnet |opus |builder )?tab|to a (sonnet|builder|opus|fresh|new) tab|send (this|it) to sonnet|hand ?off (this|to)|open a (fresh|new) .{0,12}tab)/i.test(text);
  if(!relay){ console.log("PASS"); return; }
  // v1.2 — tighter fence detection (root cause: inline backticks false-pass)
  // Problem v1.1: relay_intent + any_backtick → PASS. But inline code (e.g. `sha`) in response body
  // satisfied the fence check while the actual relay used ═══ delimiters (not a fenced block).
  // Fix 1: ═══ PASTE/RELAY markers without a relay-content fenced block → BLOCK
  // Fix 2: require relay-content keywords (HEAD:|verify:|DONE:|RELAY:|TAB|S0NN) INSIDE a fenced block
  const hasEqMarker=/═{3,}/.test(text);
  // Extract all ``` fenced blocks and check if any contain relay-relevant content
  const fenceBlocks=[];
  let fm;const fr=/```[\s\S]*?```/g;
  while((fm=fr.exec(text))!==null)fenceBlocks.push(fm[0]);
  const hasRelayBlock=fenceBlocks.some(b=>/HEAD:|verify:|DONE:|RELAY:|SONNET TAB|OPUS TAB|S0\d\d|Await (Opus|Sonnet|Governor)/i.test(b));
  if(hasEqMarker&&!hasRelayBlock){console.log("BLOCK");return;}// ═══ used without proper fenced relay block
  console.log(hasRelayBlock?"PASS":"BLOCK");// require relay-content inside the fence
})();
' "$TRANSCRIPT_PATH" 2>/dev/null || echo "PASS")

if [ "$VERDICT" = "BLOCK" ]; then
  echo "" >&2
  echo "[one-click-relay] BLOCK — you described a cross-tab action (relay/paste OR direct/have/tell/ask a role) with NO fenced one-click block." >&2
  echo "  The Governor RELAYS your output; he does not navigate, 'go read a file', or re-instruct a tab himself." >&2
  echo "  RE-EMIT the action as a SINGLE self-contained fenced \`\`\` block — one click to copy. One block per recipient." >&2
  echo "  (COMMUNICATION-CORE Element 3 + feedback_one_click_only — BLOCKING, S086.)" >&2
  exit 2
fi
exit 0
