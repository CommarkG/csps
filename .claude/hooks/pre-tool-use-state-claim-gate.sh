#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-state-claim-gate
# @csps-name pre-tool-use-state-claim-gate
# @csps-description PreToolUse hook — fires on Write to tools/council/sonnet-turn.md.
#   ADVISORY (not blocking): detects numeric state claims without visible verification evidence.
#   Complements post-tool-use-validate-before-assume.sh (PostToolUse).
#   This is T1 PreToolUse — catches BEFORE the file is written.
# @csps-version 1.0.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_VALIDATE_BEFORE_ASSUME P-META-006
# Source: tools/vault/ai-conception/B_VALIDATE_BEFORE_ASSUME.md
# T2: tools/validators/validate-state-claims.mjs
# Rollback: remove this file — advisory message removed (no blocking effect)
# NOTE: Always exits 0. ADVISORY ONLY. Never blocks — too many legitimate state claims.

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

# Only fires on Write
[[ "$TOOL_NAME" != "Write" ]] && exit 0

# Extract file path
FILE_PATH=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.file_path||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Only fires on sonnet-turn.md or council/ files
if [[ "$FILE_PATH" != */sonnet-turn.md ]] && [[ "$FILE_PATH" != */tools/council/* ]]; then
  exit 0
fi

# Extract new content
CONTENT=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.content||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Check for state claims (numeric evidence patterns)
HAS_STATE_CLAIMS=false
CLAIMS_FOUND=""
if echo "$CONTENT" | grep -qE 'validators=[0-9]+|exit_code=[0-9]+|blocking=[0-9]+|advisory=[0-9]+|K=[0-9]+'; then
  HAS_STATE_CLAIMS=true
  CLAIMS_FOUND=$(echo "$CONTENT" | grep -oE 'validators=[0-9]+|exit_code=[0-9]+|blocking=[0-9]+|advisory=[0-9]+|K=[0-9]+' | head -3 | tr '\n' ', ' | sed 's/, $//')
fi

# Also check for commit SHA claims
if echo "$CONTENT" | grep -qE 'commit:\s*[a-f0-9]{7,40}|commit [a-f0-9]{7,40}'; then
  HAS_STATE_CLAIMS=true
  if [ -n "$CLAIMS_FOUND" ]; then
    CLAIMS_FOUND="${CLAIMS_FOUND}, commit-sha"
  else
    CLAIMS_FOUND="commit-sha"
  fi
fi

# If no state claims, pass
[[ "$HAS_STATE_CLAIMS" != "true" ]] && exit 0

# Check for verification evidence words in the overall content
HAS_EVIDENCE=false
if echo "$CONTENT" | grep -qiE 'Confirmed|per Sonnet report|from this-session|node tools/|git log|git rev-parse|verify.*exit_code|pnpm verify|this-session run'; then
  HAS_EVIDENCE=true
fi

# Advisory message if claims without evidence
if [ "$HAS_EVIDENCE" = "false" ]; then
  FILE_NAME=$(basename "$FILE_PATH")
  printf '{
    "systemMessage": "STATE CLAIM ADVISORY (B_VALIDATE_BEFORE_ASSUME): Numeric claims found in %s without visible verification evidence.\nClaims detected: %s\n\nState claims must cite THIS-SESSION tool output:\n  exit_code=0 → show node tools/verify.mjs output in this response\n  validators=N → show grep of verify-last-run.md in this response\n  commit: [sha] → show git rev-parse HEAD in this response\n\nMemory of earlier verification is not evidence. Re-run IS the proof.\nSee: tools/vault/ai-conception/B_VALIDATE_BEFORE_ASSUME.md\n(Advisory only — not blocking. Week-4 target: promote to blocking.)"
  }' "$FILE_NAME" "$CLAIMS_FOUND"
fi

# Always exit 0 — advisory only
exit 0
