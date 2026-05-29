#!/usr/bin/env bash
# SACRED-EDIT-APPROVED: M0.7 Long-Run Builder Discipline T1 hook
# @csps-id csps.claude.hooks.pre-tool-use-nominal-stop-detector
# @csps-name pre-tool-use-nominal-stop-detector
# @csps-description PreToolUse ADVISORY: detects N1-N8 nominal-stop patterns from
#   LONG-RUN-BUILDER-DOCTRINE.md section 2. Prior art: post-stop-banned-phrase.sh.
#   ADVISORY in S071; promotes to BLOCKING after 5 exemplar passes (tunable P-META-028).
# @csps-enforces LONG-RUN-BUILDER-DOCTRINE B_AUTONOMOUS_BATCH_WITH_PREFLIGHT

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

# Only scan write/execute operations
case "$TOOL_NAME" in
  Write|Edit|Bash|PowerShell) ;;
  *) exit 0 ;;
esac

if [ -z "$TOOL_INPUT" ]; then exit 0; fi

# Skip Milestone Reports + ASK-OPUS-STOP (false-positive guard per M0.7 directive)
if echo "$TOOL_INPUT" | grep -qiE "MILESTONE REPORT|## M[0-9].*REPORT|ASK-OPUS-STOP|OPTIMAL NEXT STEP" 2>/dev/null; then
  exit 0
fi

# N1-N8 nominal stop patterns (expandable per vlt-S071-nominal-stop-phrase-expansion)
FOUND_PATTERN=""
for PATTERN in "Should I proceed" "Ready for next" "Shall I continue" "Do you want me to continue" "just to be safe, let me ask" "just to confirm before" "shall I start the next" "ready to begin the next" "Let me confirm my understanding" "Do you want me to also" "Would you like me to additionally"; do
  if echo "$TOOL_INPUT" | grep -qi "$PATTERN" 2>/dev/null; then
    FOUND_PATTERN="$PATTERN"
    break
  fi
done

if [ -n "$FOUND_PATTERN" ]; then
  echo "[nominal-stop-detector] WARNING: N1-N8 nominal-stop pattern detected: $FOUND_PATTERN" >&2
  echo "[nominal-stop-detector] Long-run doctrine: proceed through N1-N8; pause only for R1-R9." >&2
  echo "[nominal-stop-detector] See LONG-RUN-BUILDER-DOCTRINE.md section 2 for the full taxonomy." >&2
fi

# ADVISORY -- always exit 0 (S071)
exit 0
