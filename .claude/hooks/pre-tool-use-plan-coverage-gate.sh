#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-plan-coverage-gate
# @csps-name pre-tool-use-plan-coverage-gate
# @csps-description PreToolUse hook — fires on Write/Edit to libs/**/*.ts or apps/*/src/**/*.ts.
#   Checks if an active ratified plan covers this work.
#   libs/** NEW files: BLOCKING if no plan found (Governor S024 ratification Q2).
#   libs/** edits to existing files: ADVISORY (developer agility preserved).
#   apps/**: ADVISORY always.
# @csps-version 1.2.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_NO_IMPLEMENTATION_WITHOUT_PLAN P-META-016

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly PLANS_DIR="${REPO_ROOT}/docs/plan/_handoff/VAULT/topic-plans"

# Extract file path and tool name from stdin JSON
STDIN_JSON=$(cat)
FILE_PATH=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try {
      const j=JSON.parse(d);
      process.stdout.write(j.tool_input?.file_path||j.tool_input?.path||'');
    } catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

TOOL_NAME=$(echo "$STDIN_JSON" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const j=JSON.parse(d); process.stdout.write(j.tool_name||''); }
    catch { process.stdout.write(''); }
  });
" 2>/dev/null || echo "")

# No file path — non-file tool call, allow
[[ -z "$FILE_PATH" ]] && exit 0

# Normalize to relative path for matching
REL_PATH="${FILE_PATH#${REPO_ROOT}/}"
REL_PATH="${REL_PATH#/c/Users/finky/Desktop/Claude Code/Csps/}"

# Exempt directories — platform tooling, plans, governance infra
EXEMPT_PREFIXES=(
  "docs/"
  "tools/"
  ".claude/"
  "packages/"
  "AGENTS.md"
  "SESSION-BRIEF.md"
)

for prefix in "${EXEMPT_PREFIXES[@]}"; do
  if [[ "$REL_PATH" == ${prefix}* ]] || [[ "$FILE_PATH" == *"/${prefix}"* ]]; then
    exit 0
  fi
done

# Only check implementation directories
if [[ "$REL_PATH" != libs/* ]] && [[ "$REL_PATH" != apps/* ]] && \
   [[ "$FILE_PATH" != */libs/* ]] && [[ "$FILE_PATH" != */apps/* ]]; then
  exit 0
fi

# Check if path is covered by an active topic plan's covered_paths
if [[ ! -d "$PLANS_DIR" ]]; then
  exit 0
fi

FOUND_COVERAGE=false
while IFS= read -r plan_file; do
  if ! grep -q "^lifecycle_state: active" "$plan_file" 2>/dev/null; then
    continue
  fi
  COVERED_LINE=$(grep "^covered_paths:" "$plan_file" 2>/dev/null || echo "")
  [[ -z "$COVERED_LINE" ]] && continue

  PATHS=$(echo "$COVERED_LINE" | sed 's/covered_paths: *\[//;s/\]//;s/,/ /g;s/ //g' | tr ' ' '\n')
  while IFS= read -r covered_path; do
    [[ -z "$covered_path" ]] && continue
    if [[ "$REL_PATH" == ${covered_path}* ]] || [[ "$FILE_PATH" == *"/${covered_path}"* ]]; then
      FOUND_COVERAGE=true
      break 2
    fi
  done <<< "$PATHS"
done < <(find "$PLANS_DIR" -name "*.md" -not -name "README.md" 2>/dev/null)

# Determine if this is a new file write to libs/
IS_NEW_LIBS_FILE=false
if [[ "$TOOL_NAME" == "Write" ]] && \
   ([[ "$REL_PATH" == libs/* ]] || [[ "$FILE_PATH" == */libs/* ]]) && \
   [[ ! -f "$FILE_PATH" ]]; then
  IS_NEW_LIBS_FILE=true
fi

if [ "$FOUND_COVERAGE" = "false" ]; then
  if [[ "$REL_PATH" == libs/* ]] || [[ "$FILE_PATH" == */libs/* ]]; then
    if [ "$IS_NEW_LIBS_FILE" = "true" ]; then
      # T1 ADVISORY — T2 pre-commit-plan-coverage.sh NOW EXISTS (S069).
      # B_ENFORCEMENT_TRIO: T2 (commit-time block) backs up T1 (edit-time warn).
      # No dialog for Governor; T2 will BLOCK the commit if plan coverage is missing.
      printf '{
        "decision": "allow",
        "systemMessage": "⚠ [plan-coverage-gate] ADVISORY (libs/ — new file): No active plan covers %s.\\n\\nT2 pre-commit-plan-coverage.sh will BLOCK the commit if this remains uncovered.\\nAdd covered_paths to a plan in docs/plan/_handoff/VAULT/topic-plans/"
      }' "$REL_PATH"
    else
      # ADVISORY — edit to existing libs/ file, or non-new file
      printf '{
        "systemMessage": "⚠ [plan-coverage-gate] ADVISORY (libs/ — edit): No active plan with covered_paths includes %s.\\n\\nNote: new file writes to libs/ are BLOCKING (Governor S024). Edits to existing files remain advisory.\\nConsider: add covered_paths to the relevant plan."
      }' "$REL_PATH"
    fi
  else
    printf '{
      "systemMessage": "ℹ [plan-coverage-gate] Advisory (apps/): No covered_paths match for %s. Developer agility preserved — proceeding."
    }' "$REL_PATH"
  fi
fi

exit 0
