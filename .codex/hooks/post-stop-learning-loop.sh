#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-stop-learning-loop
# @csps-name post-stop-learning-loop
# @csps-description PostStop hook — positive ZF pipeline: captures insights,
#   decisions, and gap-fixes from each AI response before they degrade to
#   invisible context. Enforces P-META-005 Learning Loop. Without this,
#   every insight that isn't explicitly extracted is lost at session boundary,
#   compounding into the same structural failures across sessions. Captures
#   to local JSONL until LearningLoopItem DB ships (weeks 2-6); then routes
#   to API. Per B_POSITIVE_VALUE_EXTRACTION: when positive events occur,
#   extract maximum value across all artifacts.
# @csps-version 1.1.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-005 B_POSITIVE_VALUE_EXTRACTION

set -euo pipefail

CAPTURE_LOG="${CSPS_LEARNING_LOOP_CAPTURE_LOG:-${HOME}/.claude/learning-loop-capture.jsonl}"
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"

mkdir -p "$(dirname "$CAPTURE_LOG")" 2>/dev/null || true

# Append session-end record (becomes curl POST to /api/learning-loop/extract once DB ships)
printf '{"event":"learning-loop.post-stop","session_id":"%s","timestamp":"%s","transcript":"%s","status":"captured-pending-extraction"}\n' \
  "$SESSION_ID" "$TIMESTAMP" "$TRANSCRIPT_PATH" >> "$CAPTURE_LOG" 2>/dev/null || true

# Inject positive ZF requirement into AI context
printf '{
  "systemMessage": "[positive-ZF] Learning Loop capture — session %s at %s\\n\\nPOSITIVE ZF OBLIGATION (P-META-005 + B_POSITIVE_VALUE_EXTRACTION):\\nEvery substantive session must extract ≥1 of these positive ZF outputs:\\n  A) New drift-log entry (continuous-drift-log.md) — new pattern observed\\n  B) Reasoning-patterns.md promotion — K=2 pattern reached\\n  C) Memory entry updated — insight worth carrying forward\\n  D) CEC propagation — new element enhanced existing surfaces\\n  E) VLT created — blocking decision surfaced for Governor\\n\\nIF this turn had none: add explicit declaration:\\n  \\"Positive ZF: no new patterns this turn — reason: [mechanical/routine/deferred]\\"\\n\\nWHY THIS MATTERS (not just a rule):\\nInsights that are not explicitly extracted are lost at session boundary.\\nThe plan-promise-abandonment pattern was invisible for 3 sessions because\\nno one extracted the pattern and named it. Naming it in the drift-log was\\nwhat made the structural fix (validate-open-plan-levels.mjs) possible.\\nEvery session that extracts ≥1 insight compounds the platform. Sessions\\nthat extract 0 miss the positive ZF cycle entirely."
}' "$SESSION_ID" "$TIMESTAMP"

exit 0
