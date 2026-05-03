#!/usr/bin/env bash
# ============================================================================
# .claude/hooks/post-stop-learning-loop.sh
# ============================================================================
# PostStop hook — fires at session end. Auto-triggers /learning-loop-extract
# so insights/errors/gaps/decisions captured in the session are routed into
# the LearningLoopItem ledger before the chat closes.
#
# Mechanical enforcer of P-META-005 Learning Loop.
# Source of truth: packages/principles/principles.yaml#P-META-005
# Canonical doc:   docs/plan/pillar-0-governance/learning-loop.md
#
# Status: STUB. The runtime LearningLoopItem table + Mastra-side extractor
# do not ship until weeks 2–6 (see pillar-6/build-order.md). Until they do,
# this hook records the session-end intent to a local capture log so no
# session ends without a learning-loop trigger fire — even if the actual
# extraction is replayed once the runtime is online.
#
# Once the runtime is up:
#   - replace the local-log path with a curl POST to /api/learning-loop/extract
#   - the API endpoint invokes the /learning-loop-extract skill
#   - the skill writes to public.learning_loop_item
# ============================================================================

set -euo pipefail

CAPTURE_LOG="${CSPS_LEARNING_LOOP_CAPTURE_LOG:-${HOME}/.claude/learning-loop-capture.jsonl}"
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"

mkdir -p "$(dirname "$CAPTURE_LOG")"

# Append a session-end record. Once runtime is up, this becomes a curl POST.
cat >> "$CAPTURE_LOG" <<EOF
{"event":"learning-loop.post-stop","session_id":"$SESSION_ID","timestamp":"$TIMESTAMP","transcript":"$TRANSCRIPT_PATH","status":"captured-pending-extraction"}
EOF

# Stdout (visible to AI in PostStop context):
echo "[learning-loop] Session $SESSION_ID end captured at $TIMESTAMP"
echo "[learning-loop] Transcript: ${TRANSCRIPT_PATH:-<not provided>}"
echo "[learning-loop] Status: pending-extraction (runtime ships weeks 2–6)"
echo "[learning-loop] Action: AI must include either ≥1 routed insight OR explicit 'no insights, reason: <X>' in closing summary per P-META-005."

exit 0
