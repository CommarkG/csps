#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-humble-step-gate
# @csps-name pre-tool-use-humble-step-gate
# @csps-description PreToolUse hook — fires on Write to tools/council/sonnet-turn.md.
#   ADVISORY (not blocking): detects STEP 1 sections with >10 sub-items in PROTO content.
#   Over-scoped STEP 1 is a signal of scope creep. First steps should be minimal.
# @csps-version 1.0.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_HUMBLE_FIRST_STEP P-META-019
# Source: tools/vault/ai-conception/B_HUMBLE_FIRST_STEP.md
# T2: tools/validators/validate-humble-first-step.mjs
# Rollback: remove this file — advisory message removed (no blocking effect)
# NOTE: ADVISORY ONLY. PROTO scope is Governor-ratified. This is a signal, not a gate.

THRESHOLD=10  # Sub-items in STEP 1 above this = advisory

STDIN_JSON=$(cat)

TOOL_NAME=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_name||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

[[ "$TOOL_NAME" != "Write" ]] && exit 0

FILE_PATH=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.file_path||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

if [[ "$FILE_PATH" != */sonnet-turn.md ]] && [[ "$FILE_PATH" != */tools/council/* ]]; then
  exit 0
fi

CONTENT=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_input?.content||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# Find STEP 1 sections in PROTO content
# STEP 1 markers: "STEP 1 —", "STEP 1:", "━━━STEP 1"
# Count items: lines with leading whitespace + content, or list items (- ), or numbered items
STEP1_COUNT=$(echo "$CONTENT" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    const lines = d.split('\n');
    let inStep1 = false;
    let count = 0;
    for (const line of lines) {
      // Detect STEP 1 start
      if (/STEP\s+1[\s:—–]/.test(line)) {
        inStep1 = true;
        continue;
      }
      // Detect STEP 2+ or section separator = end of STEP 1
      if (inStep1 && (/STEP\s+[2-9][\s:—–]/.test(line) || /^[━═─]{10,}/.test(line))) {
        inStep1 = false;
        break;
      }
      // Count sub-items in STEP 1
      if (inStep1 && line.trim() && !/^STEP\s*1/.test(line.trim())) {
        // Count lines that look like content items (indented, list items, or non-empty)
        if (/^\s+\S/.test(line) || /^\s*[-•]\s/.test(line) || /^\s*\d+\./.test(line) || /^\s+[A-Za-z]/.test(line)) {
          count++;
        }
      }
    }
    process.stdout.write(String(count));
  });
" 2>/dev/null || echo "0")

if [ "$STEP1_COUNT" -gt "$THRESHOLD" ] 2>/dev/null; then
  FILE_NAME=$(basename "$FILE_PATH")
  printf '{
    "systemMessage": "HUMBLE FIRST STEP ADVISORY (B_HUMBLE_FIRST_STEP): STEP 1 has %d sub-items (threshold: %d).\nFile: %s\n\nFirst steps should be minimal and achievable in one sitting.\nConsider: split into STEP 1 (core) + STEP 2 (extensions).\n\nLarge STEP 1 signals:\n  - Scope creep: doing too much before proving the core\n  - Brittle execution: many sub-items = more ways to fail\n  - Harder rollback: large first step = harder to revert if wrong\n\nB_HUMBLE_FIRST_STEP: start small. First step proves the concept.\nSee: tools/vault/ai-conception/B_HUMBLE_FIRST_STEP.md\n(Advisory only — PROTO scope is Governor-ratified.)"
  }' "$STEP1_COUNT" "$THRESHOLD" "$FILE_NAME"
fi

exit 0
