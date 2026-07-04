#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-live-check-advisory
# @csps-name post-stop-live-check-advisory
# @csps-description PostStop hook — ADVISORY. Detects deployment claims without a live-check log entry.
#   When the AI claims a page/route is "live", "deployed", "pushed", or "available at [URL]", it should
#   also log an entry in tools/data/live-check-register.yaml with the WebFetch/screenshot result.
#   This hook surfaces the pattern — "you claimed it's live, did you verify it?" — without blocking.
#   T2 (validate-live-page-check.mjs) does the actual gap enforcement against route-manifest.
#   T1 is advisory only because WebFetch is a model tool (can't run in bash hook), so we cannot
#   programmatically verify URLs here — we can only remind the model to log the check.
#
# G5 PATTERN (CSP S346 — "all/complete/every/fully-covered claims need enumerated set + diff"):
#   This hook guards the CLAIM side: if you say "deployed", you must have also logged it.
#   The T2 validator guards the COVERAGE side: is the register complete vs the target set?
#
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces LIVE-PAGE-COVERAGE-GATE G5-COVERAGE-DIFF
# @csps-prevention-class NOMINAL-DONE COVERAGE-CLAIM-WITHOUT-PROOF

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
  // Detect deployment claims
  const hasDeployClaim = /(pushed to|deployed to|pushed.*main|live at|available at|csps-playground\.vercel\.app|Vercel deploy)/i.test(text);
  if(!hasDeployClaim){ console.log("PASS"); return; }
  // Check if a live-check was also mentioned
  const hasLiveCheck = /(WebFetch|live-check-register|content_signal|HTTP_200|content_confirmed|hard-refresh|screenshot.*live|verified.*live)/i.test(text);
  console.log(hasLiveCheck ? "PASS" : "REMIND");
})();
' "$TRANSCRIPT_PATH" 2>/dev/null || echo "PASS")

if [ "$VERDICT" = "REMIND" ]; then
  echo "" >&2
  echo "[live-check-advisory] ADVISORY — deployment claim detected without a live-check log entry." >&2
  echo "  If you pushed a page to Vercel, add an entry to tools/data/live-check-register.yaml:" >&2
  echo "    url: 'https://csps-playground.vercel.app/platform/X'" >&2
  echo "    route: '/platform/X'" >&2
  echo "    checked_at: 'YYYY-MM-DD'" >&2
  echo "    method: WebFetch | screenshot | manual" >&2
  echo "    result: content_confirmed" >&2
  echo "    content_signal: 'what was visible'" >&2
  echo "  T2 validator (validate-live-page-check.mjs) will BLOCK if coverage drifts > 14 days." >&2
  echo "  (G5 pattern: coverage claims need enumerated set + diff — CSP S346)" >&2
fi
exit 0
