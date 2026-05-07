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

# INJECT the §10 closing protocol requirements
printf '{
  "systemMessage": "[SESSION-CLOSE-GATE] Close signal detected: %s\n\nCLOSING PROTOCOL REQUIRED (per governance-session skill + protocols.md §10):\n\nWas the governance-session skill invoked for close? If NOT, invoke it now:\n  /governance-session (close S<NNN>)\n\nMINIMUM REQUIRED ARTIFACTS (invoke skill to get exact format):\n  1. docs/plan/_handoff/VAULT/governor-prompts/S<NNN>.md\n  2. docs/plan/_handoff/VAULT/closing-summary-S<NNN>.md (all §10 sections)\n  3. docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md (Zone A/B/C)\n\nMINIMUM §10 SECTIONS:\n  §10.0 ZF orchestrator evidence (pnpm zf:deep + tracker)\n  §10.0e Governor-prompts summary\n  §10.0f HPFA 7-check walk\n  §10.0j Enhancement proposals\n  §10.0m Session extraction artifact\n  §17 Two-sided attestation\n\nPer B_PROTOCOL_LITERAL_EXECUTION: freestyle closes violate governance integrity.\nThe protocol exists because ad-hoc closes lose critical context every session."
}' "$CLOSE_REASON"

exit 0
