#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-validate-before-assume
# @csps-name post-tool-use-validate-before-assume
# @csps-description PostToolUse hook — ADVISORY. Fires after every tool use. Scans recent
#   transcript for assistant messages that contain state-claim keywords (DONE/RATIFIED/VALIDATED/
#   CLOSED/VERIFIED/exit_code=0/COMPLETE/PASS) WITHOUT accompanying tool_use blocks in the
#   same message. Pattern: AI saying "exit_code=0" from memory without running verify this turn.
#   Enforces B_VALIDATE_BEFORE_ASSUME — re-run IS the proof; memory of earlier call ≠ validation.
# @csps-version 1.0.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-006 B_VALIDATE_BEFORE_ASSUME
#
# Upgraded STUB→ADVISORY S042. Pattern from post-stop-banned-phrase.sh.
# Week-4: promote to BLOCKING (exit 1) on violation.
#
# ADVISORY behavior (current):
#   Scans last 20 transcript entries for text-only assistant messages containing state-claim
#   keywords. Text-only = no tool_use items in same message content array. If found → warn.
#   Exit 0 always (ADVISORY mode).
#
# BLOCKING criteria (week-4):
#   Same logic + exit 1 when state-claim in text-only message detected.
#   Override: env CSPS_ALLOW_VALIDATE_BYPASS=1 (with audit log entry)

set -euo pipefail

readonly TRANSCRIPT_PATH="${CLAUDE_TRANSCRIPT_PATH:-}"
readonly TOOL_NAME="${CLAUDE_TOOL_NAME:-unknown}"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[validate-before-assume] scanning — tool=${TOOL_NAME} timestamp=${TIMESTAMP}"

# No transcript → skip
if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  echo "[validate-before-assume] no transcript — skipping scan"
  exit 0
fi

# Scan last 20 transcript entries for text-only assistant messages with state-claim keywords.
# Text-only = assistant message has no tool_use items in its content array.
# These are the risky messages where AI asserts state without same-turn tool evidence.
RESULT=$(python3 -c "
import json, sys

STATE_CLAIMS = [
  'DONE', 'RATIFIED', 'VALIDATED', 'CLOSED', 'VERIFIED',
  'exit_code=0', 'PASS', 'COMPLETE', 'confirmed', 'works correctly',
  'all validators pass', 'ZF ACHIEVED', 'verified at'
]

try:
    with open('${TRANSCRIPT_PATH}') as f:
        lines = [l.strip() for l in f if l.strip()]

    # Check last 20 entries for text-only assistant messages with state claims
    findings = []
    for line in lines[-20:]:
        try:
            msg = json.loads(line)
            if msg.get('type') != 'assistant':
                continue
            content = msg.get('message', {}).get('content', [])
            if not isinstance(content, list):
                continue

            has_tool_use = any(
                c.get('type') == 'tool_use'
                for c in content if isinstance(c, dict)
            )
            text = ' '.join(
                c.get('text', '')
                for c in content
                if isinstance(c, dict) and c.get('type') == 'text'
            )

            # Only flag text-only messages (no tool_use = no same-turn evidence)
            if not has_tool_use and text:
                found = [claim for claim in STATE_CLAIMS if claim.lower() in text.lower()]
                if found:
                    findings.extend(found)
        except:
            pass

    if findings:
        unique = list(dict.fromkeys(findings))  # deduplicate, preserve order
        print('ADVISORY:' + '|'.join(unique))
    else:
        print('CLEAN')
except Exception as e:
    print('ERROR:' + str(e))
" 2>/dev/null || echo "ERROR:scan_failed")

if [[ "$RESULT" == ADVISORY:* ]]; then
  CLAIMS="${RESULT#ADVISORY:}"
  echo ""
  echo "⚠ [validate-before-assume] B_VALIDATE_BEFORE_ASSUME — state claims in text-only message (no tool evidence):"
  echo "  Claims detected: ${CLAIMS//|/, }"
  echo ""
  echo "  Rule: State claims (DONE/VERIFIED/exit_code=0) require a tool call IN THE SAME RESPONSE."
  echo "  Memory of an earlier tool call ≠ validation. Re-run IS the proof."
  echo "  Fix: Run the verification tool in THIS response, not a prior one."
  echo "  Ref: P-META-006 RZF | B_VALIDATE_BEFORE_ASSUME | feedback_validate_before_assume.md"
  echo ""
  echo "  Week-4: this becomes exit 1 (BLOCKING)"
  echo ""
elif [[ "$RESULT" == CLEAN ]]; then
  echo "[validate-before-assume] CLEAN — no text-only state claims detected (tool=${TOOL_NAME})"
elif [[ "$RESULT" == ERROR:* ]]; then
  echo "[validate-before-assume] scan error: ${RESULT#ERROR:} — skipping"
else
  echo "[validate-before-assume] unexpected result: ${RESULT}"
fi

exit 0
