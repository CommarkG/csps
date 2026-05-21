#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-session-close-gate
# @csps-name post-stop-session-close-gate
# @csps-description Stop hook — detects session-close intent and injects the full
#   §10 closing protocol requirements. Without this hook, session close requires the
#   Governor to manually invoke the governance-session skill. With it: any response that
#   signals session-close intent (HANDOFF writing, "session close", "closing summary",
#   §17 attestation) automatically gets the closing protocol injected.
#   Per B_PROTOCOL_LITERAL_EXECUTION: the protocol must be followed completely, not
#   from memory. This hook makes the protocol APPEAR when needed.
#   Per P-META-021: this is the MECHANICAL layer of the session-close triad.
#   The CONTEXT is loaded by session-open.sh. The PRINCIPLE is protocols.md §10.
#   This hook IS the mechanical enforcement.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_PROTOCOL_LITERAL_EXECUTION B_PRE_CLOSE_VERIFICATION P-META-008 P-META-021

set -euo pipefail

# S016 REQUIREMENT: generate chat-transfer-S<NNN>-to-S<NNN+1>.md at every session close
# Template: tools/templates/chat-transfer.template.md (12 lines max, CANONICAL — never vary)
# Path: docs/plan/_handoff/VAULT/chat-transfer-S<NNN>-to-S<NNN+1>.md
# This is the paste-target for the new chat. Checked by protocols.md §10.
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Read transcript to detect session-close signals (stdin JSON)
TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"

# Session-close signal detection — check if recent AI output suggests close intent
CLOSE_SIGNALS=(
  "closing summary"
  "session close"
  "HANDOFF.*to.*S0"
  "§17.*attestation"
  "§10.0.*MANDATORY GATE"
  "governance-session.*close"
  "S[0-9][0-9][0-9].*COMPLETE.*close"
)

# Check recent commits for HANDOFF or closing-summary writes
RECENT_FILES=$(git -C "$REPO_ROOT" diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
CLOSE_DETECTED=false
CLOSE_REASON=""

for pattern in "${CLOSE_SIGNALS[@]}"; do
  if echo "$RECENT_FILES" | grep -Eqi "HANDOFF|closing-summary"; then
    CLOSE_DETECTED=true
    CLOSE_REASON="HANDOFF or closing-summary file detected in recent commits"
    break
  fi
done

# If no commit signal, check if session has been running long (proxy: verify_runs > 5)
if [ "$CLOSE_DETECTED" = "false" ]; then
  TRACKER="${REPO_ROOT}/tools/zf-session-tracker.json"
  if [ -f "$TRACKER" ]; then
    ITER=$(node -e "try{const d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(String(d.verify_runs||0))}catch(e){process.stdout.write('0')}" "$TRACKER" 2>/dev/null || echo "0")
    if [ "$ITER" -gt 10 ] 2>/dev/null; then
      CLOSE_DETECTED=true
      CLOSE_REASON="High iteration count (${ITER} verify runs) — session may be nearing close"
    fi
  fi
fi

# If no session-close signal, exit silently
[ "$CLOSE_DETECTED" = "false" ] && exit 0

# ─── WITHIN THE SYSTEM: Actually run ZF deep + harvest check ───────────────
# This is not a reminder. This IS the enforcement.

ZF_DEEP_STATUS="NOT_RUN"
ZF_DEEP_OUTPUT=""
ZF_DEEP_EXIT=0

# Run ZF deep orchestrator (level 3) — this IS the mechanical gate
# First run verify.mjs to clear any stale state, then run orchestrator
node "${REPO_ROOT}/tools/verify.mjs" > /dev/null 2>&1 || true
ZF_DEEP_OUTPUT=$(node "${REPO_ROOT}/tools/zf-orchestrator.mjs" --level 3 2>&1) || ZF_DEEP_EXIT=$?

if echo "$ZF_DEEP_OUTPUT" | grep -q "ZF ACHIEVED"; then
  ZF_DEEP_STATUS="ACHIEVED"
  # Update tracker
  node -e "
const fs=require('fs'),path=require('path');
const f=path.join('${REPO_ROOT}','tools/zf-session-tracker.json');
try{
  const d=JSON.parse(fs.readFileSync(f,'utf8'));
  d.zf_deep_runs_this_session=(d.zf_deep_runs_this_session||0)+1;
  d.zf_deep_last_run_at=new Date().toISOString();
  d.zf_deep_last_status='ZF_ACHIEVED';
  fs.writeFileSync(f,JSON.stringify(d,null,2));
}catch(e){}
" 2>/dev/null || true
else
  ZF_DEEP_STATUS="BLOCKING_FOUND"
fi

# Check harvest readiness
HARVEST_STATUS="UNKNOWN"
HARVEST_OUTPUT=$(node "${REPO_ROOT}/tools/validators/validate-session-harvest-readiness.mjs" 2>&1) || true
if echo "$HARVEST_OUTPUT" | grep -q "HARVEST_DONE"; then
  HARVEST_STATUS="DONE"
  node -e "
const fs=require('fs'),path=require('path');
const f=path.join('${REPO_ROOT}','tools/zf-session-tracker.json');
try{
  const d=JSON.parse(fs.readFileSync(f,'utf8'));
  d.harvest_done_this_session=true;
  d.harvest_done_at=new Date().toISOString();
  fs.writeFileSync(f,JSON.stringify(d,null,2));
}catch(e){}
" 2>/dev/null || true
else
  HARVEST_STATUS="MISSING"
fi

# BLOCK if ZF deep found blocking items OR harvest missing
if [ "$ZF_DEEP_STATUS" = "BLOCKING_FOUND" ] || [ "$HARVEST_STATUS" = "MISSING" ]; then
  ZF_SUMMARY=$(echo "$ZF_DEEP_OUTPUT" | tail -15 | tr '\n' '|' || echo "see output")
  printf '{
    "systemMessage": "[SESSION-CLOSE-GATE] ⛔ CLOSE BLOCKED: %s\n\nZF DEEP STATUS: %s\nHARVEST STATUS: %s\n\nZF output (last 15 lines): %s\n\nFIX REQUIRED:\n  ZF: Resolve all BLOCKING findings, then re-run: node tools/zf-orchestrator.mjs --level 3\n  HARVEST: Create session-S<NNN>-extraction.md first\n\nPer INS-S022-003: These are NOT reminders. This hook runs ZF deep automatically.\nThe satisfaction point at pnpm-verify-pass is overridden by this gate.",
    "continue": false,
    "stopReason": "Session close blocked: ZF=%s, Harvest=%s"
  }' "$CLOSE_REASON" "$ZF_DEEP_STATUS" "$HARVEST_STATUS" "$ZF_SUMMARY" "$ZF_DEEP_STATUS" "$HARVEST_STATUS"
  exit 1
fi

# ZF ACHIEVED + HARVEST DONE → surface closing protocol
printf '{
  "systemMessage": "[SESSION-CLOSE-GATE] ✅ ZF ACHIEVED + HARVEST DONE\nClose signal: %s\n\nNOW complete the §10 closing protocol:\n  1. Paste ZF output (above) into §10.0 of closing-summary\n  2. Run governance-session skill: /governance-session close S<NNN>\n  3. Write closing-summary + HANDOFF artifacts\n  4. git push before handoff (B_ZERO_LAPTOP_DEPENDENCY)\n\nThe ZF deep cycle ran automatically. Paste its output verbatim."
}' "$CLOSE_REASON"

exit 0
