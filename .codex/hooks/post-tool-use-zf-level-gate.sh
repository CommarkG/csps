#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-zf-level-gate
# @csps-name post-tool-use-zf-level-gate
# @csps-description PostToolUse hook on Write|Edit — detects phase/batch completion
#   signals and injects the required ZF level. Per zf-mandate-protocol.md:
#   phase boundaries require Level 2 (pnpm zf:phase), plan closes require Level 3.
#   Without this hook, ZF level requirements depend on the AI remembering the mandate.
#   With it: the mandate fires automatically whenever phase signals appear in written files.
#
#   SIGNALS DETECTED (case-insensitive):
#   Phase boundary: "L1 COMPLETE", "L2 COMPLETE", "Phase N complete", "L3 EXIT CRITERIA"
#   Plan complete:  "§11 closure", "topic-plan-CLOSURE", "ALL LEVELS COMPLETE"
#   Batch:          "batch complete", "DONE", exit criteria checkboxes updated
#
#   WHY this prevents the main failure mode: in S014, AI advanced phases without
#   running Level 2 ZF because the mandate existed only in documents. This hook
#   makes the mandate fire at the write-time signal, not at the AI's discretion.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces zf-mandate-protocol P-META-021 B_GRADUAL_BUILD_BY_FOUNDATIONS

set -euo pipefail

# Read file path and content from stdin
PAYLOAD=$(cat)
FILE_PATH=$(echo "$PAYLOAD" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.tool_input?.file_path||'')}catch{process.stdout.write('')}})" 2>/dev/null || echo "")
FILE_CONTENT=$(echo "$PAYLOAD" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(j.tool_input?.content||j.tool_input?.new_string||'')}catch{process.stdout.write('')}})" 2>/dev/null || echo "")

[[ -z "$FILE_PATH" && -z "$FILE_CONTENT" ]] && exit 0

# Combine path + content for signal detection.
# S019 FIX: Only scan content for governance artifacts (handoffs, topic-plans, session-state).
# Documentation files contain governance vocabulary as CONTENT not as SIGNALS.
# Scanning doc content for "§11" or "L1 COMPLETE" produces false-positive ZF mandates.
IS_GOVERNANCE_ARTIFACT=false
if [[ "$FILE_PATH" == *"session-state"* ]] || [[ "$FILE_PATH" == *"HANDOFF-S"* ]] || \
   [[ "$FILE_PATH" == *"closing-summary-S"* ]] || [[ "$FILE_PATH" == *"topic-plans/"* ]] || \
   [[ "$FILE_PATH" == *"session-S"*"extraction"* ]] || [[ "$FILE_PATH" == *"chat-transfer-S"* ]]; then
  IS_GOVERNANCE_ARTIFACT=true
fi

if [[ "$IS_GOVERNANCE_ARTIFACT" == "true" ]]; then
  COMBINED="$FILE_PATH $FILE_CONTENT"
else
  COMBINED="$FILE_PATH"  # doc files: path only, not content
fi

# ─── Level 3 signals (PLAN COMPLETE) ────────────────────────────────────────
LEVEL3_SIGNALS=(
  "§11 closure"
  "topic-plan-CLOSURE"
  "ALL LEVELS COMPLETE"
  "L3.*COMPLETE.*attestation"
  "closure attestation"
)

for signal in "${LEVEL3_SIGNALS[@]}"; do
  if echo "$COMBINED" | grep -Eqi "$signal"; then
    printf '{
      "hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "additionalContext": "ZF MANDATE — LEVEL 3 REQUIRED (Plan close detected)\\n\\nSignal: %s\\nCommand: pnpm zf:deep\\n\\nPer zf-mandate-protocol.md §1 EVENT 6: Plan completion requires Level 3 ZF.\\nExperts required:\\n  cruel-critic: stability + scale questions (30→300, 10→100, 1→10)\\n  synergy-master: CSEP for cross-platform synergies\\n  schema-expert: if schema changed\\n\\nWHY at plan close: this is the moment of maximum value extraction — context is\\nfresh, depth is highest. cruel-critic before §11 attestation = stress-testing\\nbefore the work becomes the foundation for future phases."
      }
    }' "$signal"
    exit 0
  fi
done

# ─── Level 2 signals (PHASE BOUNDARY) ───────────────────────────────────────
LEVEL2_SIGNALS=(
  "L[0-9].*COMPLETE"
  "L[0-9].*complete"
  "Level [0-9].*complete"
  "Phase [0-9].*complete"
  "exit_criteria.*checked"
  "L[0-9] exit criteria"
  "batch complete"
  "\[x\].*exit_code 0"
  "pnpm zf:phase"
)

for signal in "${LEVEL2_SIGNALS[@]}"; do
  if echo "$COMBINED" | grep -Eqi "$signal"; then
    # Check if Level 2 was already run this session
    REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
    TRACKER="${REPO_ROOT}/tools/zf-session-tracker.json"
    LAST_LEVEL=""
    if [ -f "$TRACKER" ]; then
      LAST_LEVEL=$(node -e "try{const d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(String(d.orchestrator_last_level||0))}catch(e){process.stdout.write('0')}" "$TRACKER" 2>/dev/null || echo "0")
    fi

    if [ "$LAST_LEVEL" -ge 2 ] 2>/dev/null; then
      # Level 2 already run — advisory only
      printf '{
        "hookSpecificOutput": {
          "hookEventName": "PostToolUse",
          "additionalContext": "ZF CHECK — Level 2 already run this session (level=%s). Phase signal detected: %s. Current ZF status is valid for phase advance."
        }
      }' "$LAST_LEVEL" "$signal"
    else
      # Level 2 not yet run — inject requirement
      printf '{
        "hookSpecificOutput": {
          "hookEventName": "PostToolUse",
          "additionalContext": "ZF MANDATE — LEVEL 2 REQUIRED (Phase boundary detected)\\n\\nSignal: %s\\nCommand: pnpm zf:phase\\n\\nPer zf-mandate-protocol.md §1 EVENT 3: Phase boundaries are CONSEQUENTIAL decisions.\\nLevel 2 ZF checks:\\n  (1) pnpm verify (35 validators)\\n  (2) validate-instruction-context (WHY reasoning present)\\n  (3) PE re-assessment (is next phase still highest priority?)\\n  (4) Session extraction check (≥1 positive ZF harvested?)\\n\\nWHY Level 2 not Level 1: phase advance without PE re-assessment = the S014\\nPhase 5 advance reflex — AI reads session-state sequence instead of current\\nplatform state. Level 2 forces a PE check before the advance is confirmed."
        }
      }' "$signal"
    fi
    exit 0
  fi
done

exit 0
