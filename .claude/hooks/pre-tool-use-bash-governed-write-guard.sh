#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-bash-governed-write-guard
# @csps-name pre-tool-use-bash-governed-write-guard
# @csps-description PreToolUse hook — BLOCKS Bash commands that write directly to governed
#   paths (tools/council/ primarily) instead of using the Write/Edit tool.
#   Root cause (S074 BATCH 3): Bash writes to council files bypass post-tool-use hooks,
#   preventing last-proto-relay.txt from updating and breaking the one-click relay mechanism.
#   CARVE-OUT: .claude/ files are exempt (ZERO-DIALOG-RULE requires Bash for those).
#   CARVE-OUT: cat HOOKEOF/EOF heredocs writing to .claude/ hooks are also exempt.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces FORMAL-PROTO-CHANNEL B_PRESENT_PROTO_INLINE HARDWIRE-002
set -euo pipefail

STDIN_JSON=$(cat)
TOOL_NAME=$(echo "$STDIN_JSON" | node -e "
let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
  try{const j=JSON.parse(d);process.stdout.write(j.tool_name||'');}catch{process.stdout.write('');}
});" 2>/dev/null || echo "")

[ "$TOOL_NAME" != "Bash" ] && exit 0

BASH_CMD=$(echo "$STDIN_JSON" | node -e "
let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
  try{const j=JSON.parse(d);process.stdout.write(j.tool_input?.command||j.command||'');}catch{process.stdout.write('');}
});" 2>/dev/null || echo "")

[ -z "$BASH_CMD" ] && exit 0

# Check if this Bash command writes to governed paths
# Governed: tools/council/ files (opus-turn.md, sonnet-turn.md)
# CARVE-OUT: .claude/ writes (ZERO-DIALOG-RULE)
WRITES_TO_COUNCIL=false
if echo "$BASH_CMD" | grep -qE '(tools/council/opus-turn\.md|tools/council/sonnet-turn\.md)'; then
  # Check it's a WRITE operation (>, >>, tee, printf.*>, cat.*>)
  if echo "$BASH_CMD" | grep -qE '(>>|[^>]>[^>]|tee |printf.*>|cat.*>)'; then
    # CARVE-OUT: if it's a HOOKEOF/EOF heredoc writing to .claude/ — allow
    if echo "$BASH_CMD" | grep -qE '\.claude/'; then
      exit 0
    fi
    WRITES_TO_COUNCIL=true
  fi
fi

if [ "$WRITES_TO_COUNCIL" = "true" ]; then
  printf '{
    "systemMessage": "[BASH-GOVERNED-WRITE-GUARD] BLOCKED: Bash write to tools/council/ detected.\n\nUse the Write or Edit TOOL instead of Bash for council files.\nReason: Bash bypasses post-tool-use hooks → last-proto-relay.txt never updates → one-click relay broken.\n\nUse: Write tool with file_path=tools/council/opus-turn.md\nOr: Edit tool with file_path=tools/council/opus-turn.md\n\nCarve-out: .claude/** files MAY use Bash (ZERO-DIALOG-RULE).",
    "continue": false,
    "stopReason": "Bash write to council file — use Write/Edit tool instead"
  }'
  exit 1
fi

exit 0
