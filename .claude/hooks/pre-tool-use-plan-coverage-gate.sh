#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-plan-coverage-gate
# @csps-name pre-tool-use-plan-coverage-gate
# @csps-description PreToolUse hook — blocks Write/Edit to implementation directories
#   (libs/, apps/) that are not covered by an active ratified topic plan.
#   Enforces B_NO_WILD_IMPLEMENTATION: no code written without a Governor-ratified plan.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_NO_WILD_IMPLEMENTATION P-META-016
#
# Exempt paths (no plan required): docs/ tools/ .claude/ packages/

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

# Exempt directories — platform tooling, plans, and governance infra
EXEMPT_PREFIXES=(
  "docs/"
  "tools/"
  ".claude/"
  "packages/"
  "AGENTS.md"
  "SESSION-BRIEF.md"
  "CSPS"
  "README"
)

for prefix in "${EXEMPT_PREFIXES[@]}"; do
  if [[ "$REL_PATH" == ${prefix}* ]] || [[ "$FILE_PATH" == *"/${prefix}"* ]]; then
    exit 0
  fi
done

# Only gate implementation directories
if [[ "$REL_PATH" != libs/* ]] && [[ "$REL_PATH" != apps/* ]] && \
   [[ "$FILE_PATH" != */libs/* ]] && [[ "$FILE_PATH" != */apps/* ]]; then
  exit 0
fi

# Check if path is covered by an active topic plan's covered_paths
if [[ ! -d "$PLANS_DIR" ]]; then
  exit 0  # No plans dir — advisory only
fi

while IFS= read -r plan_file; do
  # Only check active plans
  if ! grep -q "^lifecycle_state: active" "$plan_file" 2>/dev/null; then
    continue
  fi

  # Extract covered_paths values
  COVERED_LINE=$(grep "^covered_paths:" "$plan_file" 2>/dev/null || echo "")
  [[ -z "$COVERED_LINE" ]] && continue

  # Parse paths from covered_paths: [libs/policies/, libs/integrations/]
  PATHS=$(echo "$COVERED_LINE" | sed 's/covered_paths: *\[//;s/\]//;s/,/ /g;s/ //g' | tr ' ' '\n')

  while IFS= read -r covered_path; do
    [[ -z "$covered_path" ]] && continue
    if [[ "$REL_PATH" == ${covered_path}* ]] || [[ "$FILE_PATH" == *"/${covered_path}"* ]]; then
      exit 0  # Covered — allow
    fi
  done <<< "$PATHS"
done < <(find "$PLANS_DIR" -name "*.md" -not -name "README.md" 2>/dev/null)

# Not covered by any active plan — BLOCK
printf '{"continue": false, "stopReason": "BLOCKED by plan-coverage-gate: No active ratified topic plan covers %s. Add covered_paths entry to the relevant topic plan first (B_NO_WILD_IMPLEMENTATION)."}\n' "$REL_PATH"
exit 1
