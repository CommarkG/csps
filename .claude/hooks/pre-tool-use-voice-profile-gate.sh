#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-voice-profile-gate
# @csps-name pre-tool-use-voice-profile-gate
# @csps-description PreToolUse hook — fires on Write/Edit to .tsx files.
#   Blocks if content contains form/input/textarea/WizardClient/GuardQuestionForm
#   without a voiceProfile prop or useVoiceProfile hook call.
#   Prevents form components with hardcoded exam language from being created.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:ux audience:ai-agent
# @csps-enforces B_PAGE_CONTEXT VOICE-PROFILE-SYSTEM
# Source: docs/SIA/UX-PREVENTION-ARCHITECTURE.md Loop 2
# Rollback: remove this file — all form writes immediately unblocked

STDIN_JSON=$(cat)

# Extract tool name
TOOL_NAME=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_name||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on Write or Edit
[[ "$TOOL_NAME" != "Write" ]] && [[ "$TOOL_NAME" != "Edit" ]] && exit 0

# Extract file path
FILE_PATH=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.file_path||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on .tsx files
[[ "$FILE_PATH" != *.tsx ]] && exit 0

# Extract content (Write: content field; Edit: new_string field)
CONTENT=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try {
      const j=JSON.parse(d);
      const c = j.tool_input?.content || j.tool_input?.new_string || '';
      process.stdout.write(c);
    } catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Check if content contains form/input/textarea or wizard components
HAS_FORM=false
if echo "$CONTENT" | grep -qE '<form|<input|<textarea|WizardClient|GuardQuestionForm'; then
  HAS_FORM=true
fi

# If no form/input elements, this hook doesn't apply
[[ "$HAS_FORM" != "true" ]] && exit 0

# Check if content includes voice profile usage
HAS_VOICE_PROFILE=false
if echo "$CONTENT" | grep -qE 'voiceProfile|useVoiceProfile'; then
  HAS_VOICE_PROFILE=true
fi

if [ "$HAS_VOICE_PROFILE" = "false" ]; then
  FILE_NAME=$(basename "$FILE_PATH")
  printf '{
    "decision": "block",
    "systemMessage": "VOICE PROFILE GATE [BLOCKING]: This form/wizard has no voice profile.\nFile: %s\n\nForms without a voice profile use hardcoded exam language.\nBefore writing this component, add one of:\n\n  voiceProfile=\"colleague\"     — conversational, example-driven\n  voiceProfile=\"professional\"   — formal, structured\n  voiceProfile=\"mentor\"         — exploratory, scaffolded\n\nOr use: const vp = useVoiceProfile('"'"'colleague'"'"')\n\nSee: docs/SIA/VOICE-PROFILE-SYSTEM.md §4 Component Integration."
  }' "$FILE_NAME"
  exit 1
fi

exit 0
