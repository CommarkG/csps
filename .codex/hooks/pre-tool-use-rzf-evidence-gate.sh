#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-rzf-evidence-gate
# @csps-name pre-tool-use-rzf-evidence-gate
# @csps-description PreToolUse hook ADVISORY — fires before Bash tool calls matching git commit.
#   Scans the ZF session tracker: if zf_deep_runs_this_session=0 AND commit message
#   contains DONE/RATIFIED/VALIDATED/CLOSED keywords → ADVISORY warning injected.
#   NOT BLOCKING (advisory only — week-4 promotion to blocking after K=2 incidents).
#   Promotes from STUB per Session 0 Opus brief S022.
# @csps-version 0.2.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-006 B_RZF B_PRE_CLOSE_VERIFICATION

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly TRACKER="${REPO_ROOT}/tools/zf-session-tracker.json"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

# Read commit message from tool input
TOOL_INPUT=$(cat 2>/dev/null || echo "")
COMMIT_CMD=$(echo "$TOOL_INPUT" | node -e "
  let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
    try{const j=JSON.parse(d);process.stdout.write(j.tool_input?.command||'')}
    catch{process.stdout.write('')}
  })
" 2>/dev/null || echo "")

# Only check git commit commands
if ! echo "$COMMIT_CMD" | grep -qi "git commit"; then
  exit 0
fi

# Check for DONE/RATIFIED/VALIDATED/CLOSED claims in the commit message
CLAIM_KEYWORDS="DONE|RATIFIED|VALIDATED|CLOSED|COMPLETE|SESSION.*COMPLETE"
HAS_CLAIM=false
if echo "$COMMIT_CMD" | grep -Eqi "$CLAIM_KEYWORDS"; then
  HAS_CLAIM=true
fi

[ "$HAS_CLAIM" = "false" ] && exit 0

# Check ZF deep run status from tracker
ZF_DEEP_RUNS=0
ZF_DEEP_RUNS=$(node -e "
  const fs=require('fs'),path=require('path');
  try{const d=JSON.parse(fs.readFileSync(path.join('${REPO_ROOT}','tools/zf-session-tracker.json'),'utf8'));
  process.stdout.write(String(d.zf_deep_runs_this_session||0))}catch(e){process.stdout.write('0')}
" 2>/dev/null || echo "0")

if [ "$ZF_DEEP_RUNS" -eq 0 ] 2>/dev/null; then
  # ADVISORY: DONE claim without ZF deep evidence
  printf '{
    "systemMessage": "⚠ [rzf-evidence-gate] ADVISORY: Commit contains DONE/RATIFIED/COMPLETE claim but ZF deep cycle has NOT been run this session (zf_deep_runs_this_session=0).\\n\\nPer B_RZF: THIS-SESSION evidence required. Run: node tools/zf-orchestrator.mjs --level 3\\nThen re-commit with ZF output referenced.\\n\\nProceeding (ADVISORY, not blocking). Promotion to BLOCKING at K=2 incidents."
  }'
fi

exit 0
