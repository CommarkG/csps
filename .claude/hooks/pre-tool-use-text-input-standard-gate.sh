#!/usr/bin/env bash
# pre-tool-use-text-input-standard-gate.sh
# Q1 Governor directive S060: voice + file upload MANDATORY on all free text fields
#
# T1 GATE: Fires before Write/Edit to page.tsx files
# PURPOSE: Enforce that every textarea/text input has VoiceFileInput wrapper OR explicit exemption
#
# WHAT IT CHECKS:
#   1. New page.tsx with <textarea or <input type="text": must use VoiceFileInput or declare exemption
#   2. Exemption: // @voice-exempt [reason] comment in the file
#
# PLATFORM STANDARD: Every free-text field must offer voice input + file upload
# per Governor Q1 directive S060. Users should never face a text-only input.
#
# ADVISORY (exit 0) — T2 validator is the gate. T1 surfaces the reminder at write time.

set -euo pipefail

TOOL_NAME="${TOOL_NAME:-}"
TOOL_INPUT="${TOOL_INPUT:-}"

if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

FILE_PATH=$(node -e "try{const i=JSON.parse(process.env.TOOL_INPUT||'{}');process.stdout.write(i.file_path||i.path||'');}catch(e){}" 2>/dev/null || echo "")

# Only check page.tsx files
if ! echo "$FILE_PATH" | grep -q "page\.tsx$"; then
  exit 0
fi

CONTENT=$(node -e "
try{
  const i = JSON.parse(process.env.TOOL_INPUT || '{}');
  const c = i.content || i.new_string || '';
  process.stdout.write(c.slice(0, 5000));
}catch(e){}
" 2>/dev/null || echo "")

# Check if file has textarea or text input
HAS_TEXT_INPUT=$(echo "$CONTENT" | grep -qE '<textarea|<input[^>]*type=["\x27]text' && echo "yes" || echo "no")

if [ "$HAS_TEXT_INPUT" = "no" ]; then
  exit 0
fi

# Check if voice standard is applied
HAS_VOICE_STANDARD=$(echo "$CONTENT" | grep -qE 'VoiceFileInput|voice-file-input|VoiceInput|@voice-exempt' && echo "yes" || echo "no")

if [ "$HAS_VOICE_STANDARD" = "no" ]; then
  echo "[text-input-standard-gate] ⚠ FREE TEXT INPUT without voice + file upload standard"
  echo "[text-input-standard-gate]   File: $FILE_PATH"
  echo "[text-input-standard-gate]   Governor Q1 S060: ALL text inputs must offer voice input + file upload"
  echo "[text-input-standard-gate]   Fix option 1: Replace <textarea> with <VoiceFileInput> from libs/ui/src/VoiceFileInput.tsx"
  echo "[text-input-standard-gate]   Fix option 2: Add '// @voice-exempt [reason]' comment if input genuinely cannot support voice"
  echo "[text-input-standard-gate]   Standard: docs/plan/pillar-0-governance/TEXT-INPUT-VOICE-STANDARD.md"
fi

exit 0
