#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-existence-claim-scan
# @csps-name post-stop-existence-claim-scan
# @csps-description Stop hook — S075 G2. Scans recent AI output for existence-claim
#   language without ECA (Existing-Coverage Attestation). ADVISORY: surfaces the D12
#   default firing so the next turn can inject correction. Closes the "chat hole" —
#   all other gates key on Write/Edit; this catches claims made only in prose.
#   Pattern: "CSPS already has / I reviewed / found that / more mature than" without
#   tool call citation in same block. ADVISORY (not blocking) — false-positive risk too high
#   to block all prose unconditionally. Promotes to BLOCKING after K=3 per session.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-029 D12-assumed-coverage

set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
[ -z "$TRANSCRIPT_PATH" ] && exit 0
[ ! -f "$TRANSCRIPT_PATH" ] && exit 0

# Get D12 K-count from tracker
D12_K=0
TRACKER="${REPO_ROOT}/tools/zf-session-tracker.json"
if [ -f "$TRACKER" ]; then
  D12_K=$(node -e "try{const t=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(String((t.d_default_k_counts||{}).D12||0));}catch{process.stdout.write('0');}" "$TRACKER" 2>/dev/null || echo "0")
fi

# Scan last assistant message for existence-claims without tool call
CLAIM_FOUND=$(node -e "
const fs=require('fs');
try{
  const lines=fs.readFileSync(process.argv[1],'utf8').split('\n').filter(Boolean);
  const phrases=['already has','the system already','csps already','more mature than','i reviewed','we have','turns out','found that','platform has'];
  for(let i=lines.length-1;i>=0;i--){
    try{
      const e=JSON.parse(lines[i]);
      if(e.role==='assistant'||(e.type&&e.type.includes('assistant'))){
        const txt=JSON.stringify(e).toLowerCase();
        const hasExistence=phrases.some(p=>txt.includes(p));
        const hasTool=txt.includes('tool_use')||txt.includes('bash(')||txt.includes('read(');
        process.stdout.write(hasExistence&&!hasTool?'1':'0');
        break;
      }
    }catch{}
  }
  process.stdout.write('0');
}catch{process.stdout.write('0');}
" "$TRANSCRIPT_PATH" 2>/dev/null || echo "0")

[ "$CLAIM_FOUND" != "1" ] && exit 0

MSG="[POST-STOP-EXISTENCE-CLAIM] ⚠ ADVISORY [D12]: Existence-claim language detected in last response without tool-call attestation. (D12 K=${D12_K})\nP-META-029: inventory-first. Next turn: cite which tool you ran to verify this claim.\nFor K>=${D12_K}: ECA required in next Write to PROTO/plan files."

printf '{"systemMessage":"%s"}' "$(echo "$MSG" | tr '\n' '|' | sed 's/|/\n/g')"
exit 0
