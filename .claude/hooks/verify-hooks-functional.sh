#!/usr/bin/env bash
# @csps-id csps.claude.hooks.verify-hooks-functional
# @csps-name verify-hooks-functional
# @csps-description SessionStart self-test hook — verifies all declared hooks under .claude/hooks/ are present + executable. Mitigates cruel-critic Critique 2 from token-optimization.md v0.3 §14.8 ("hooks-replacing-injection assumes hook reliability"). STUB tier (S007 turn 4); week-4 promotes to active enforcement once 7 hook scripts ship per token-optimization Phase 5.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-009 B_TOKEN_BUDGET B_COGNITIVE_CONTEXT_DISCIPLINE
#
# Engraved at S007 turn 4 as Surface 3 of B_TOKEN_BUDGET 5/5 atomic engraving.
# Per token-optimization.md v0.3 §9.4 Phase 3 + §14.8 cruel-critic Critique 2 mitigation.
#
# STUB BEHAVIOR (current):
#   Reports declared-hook list + presence/absence + executable bit. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - 7 hook scripts shipped per token-optimization.md §14.4 migration table
#   - This script promoted to: enumerate declared hooks → check presence + +x bit → fire warn on missing → exit 1 if any critical hook missing
#   - .claude/settings.json registers this script as SessionStart hook
#
# Manual invocation: bash .claude/hooks/verify-hooks-functional.sh

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly HOOKS_DIR="${REPO_ROOT}/.claude/hooks"

# Declared hooks per token-optimization.md §14.4 migration table (Phase 5 ship list).
# 7 hooks + this self-test = 8 total expected at week-4 close.
readonly -a DECLARED_HOOKS=(
  "post-tool-use-validate-before-assume.sh"
  "pre-tool-use-rzf-evidence-gate.sh"
  "post-stop-pcr-check.sh"
  "post-stop-link-discipline.sh"
  "post-stop-banned-phrase.sh"
  "user-prompt-submit-governor-prompts.sh"
  "post-stop-pnpm-verify.sh"
  "verify-hooks-functional.sh"
)

echo "[verify-hooks-functional] STUB — token-optimization.md §14.8 cruel-critic Critique 2 mitigation"
echo "[verify-hooks-functional] hooks_dir: ${HOOKS_DIR}"
echo "[verify-hooks-functional] declared: ${#DECLARED_HOOKS[@]} hooks (7 functional + 1 self-test)"
echo ""

declare -i present=0
declare -i missing=0
declare -i not_executable=0

for hook in "${DECLARED_HOOKS[@]}"; do
  hook_path="${HOOKS_DIR}/${hook}"
  if [[ -f "${hook_path}" ]]; then
    present=$((present + 1))
    if [[ -x "${hook_path}" ]]; then
      printf "  ✓ %s (present + executable)\n" "${hook}"
    else
      not_executable=$((not_executable + 1))
      printf "  ⚠ %s (present but NOT executable; chmod +x required)\n" "${hook}"
    fi
  else
    missing=$((missing + 1))
    printf "  ✗ %s (missing — declared at token-optimization.md §14.4 Phase 5)\n" "${hook}"
  fi
done

echo ""
echo "[verify-hooks-functional] summary: present=${present} missing=${missing} not_executable=${not_executable} total_declared=${#DECLARED_HOOKS[@]}"
echo "[verify-hooks-functional] STUB tier — exit 0 always (week-4 promotes to fail-on-missing-critical)"

exit 0
