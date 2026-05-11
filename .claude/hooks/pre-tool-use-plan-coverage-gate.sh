#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-plan-coverage-gate
# @csps-name pre-tool-use-plan-coverage-gate
# @csps-description PreToolUse hook ADVISORY — fires on Write/Edit to libs/**/*.ts or apps/*/src/**/*.ts.
#   Checks if an active ratified plan covers this work.
#   libs/**: ADVISORY if no plan found (warn, don't block — developer agility).
#   apps/**: ADVISORY always.
#   NOT BLOCKING (advisory only — week-4 promotion to blocking after plan scope audit).
#   Promoted from BLOCKING to ADVISORY per Session 0 Opus brief S022.
# @csps-version 1.1.0-advisory
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_NO_IMPLEMENTATION_WITHOUT_PLAN P-META-016

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly PLANS_DIR="${REPO_ROOT}/docs/plan/_handoff/VAULT/topic-plans"

# Extract file path from stdin JSON
FILE_PATH=$(node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try {
      const j=JSON.parse(d);
      process.stdout.write(j.tool_input?.file_path||j.tool_input?.path||'');
    } catch { process.stdout.write(''); }
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

if [ "$FOUND_COVERAGE" = "false" ]; then
  # ADVISORY only — not blocking (per Opus Session 0 brief)
  # For libs/**: warn more prominently; for apps/**: light advisory
  if [[ "$REL_PATH" == libs/* ]] || [[ "$FILE_PATH" == */libs/* ]]; then
    printf '{
      "systemMessage": "⚠ [plan-coverage-gate] ADVISORY (libs/): No active plan with covered_paths includes %s.\\n\\nConsider: is this in scope of an existing plan? If yes, add covered_paths to that plan.\\nIf no: create a plan first. Plans at: docs/plan/_handoff/VAULT/topic-plans/\\nProceeding (advisory). Promotion to BLOCKING at week-4 after plan scope audit."
    }' "$REL_PATH"
  else
    printf '{
      "systemMessage": "ℹ [plan-coverage-gate] Advisory (apps/): No covered_paths match for %s. Developer agility preserved — proceeding."
    }' "$REL_PATH"
  fi
fi

exit 0
