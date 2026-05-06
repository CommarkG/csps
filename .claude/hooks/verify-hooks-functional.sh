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

# Declared hooks per token-optimization.md §14.4 migration table (Phase 5 ship list)
# + S007 §24+ existing stubs + S007 production hooks. Updated S008 turn 5 (unified-intake topic-plan
# L1 foundation): all 7 §14.4 stubs authored + verify-hooks-functional updated to enumerate full set.
# 10 stubs + 2 production + 2 S012/S014 + 2 ZF-wall-to-wall (S014 ZF audit) = 16 total.
readonly -a DECLARED_HOOKS=(
  # 7 §14.4 Phase 5 migration stubs (authored S008 turn 5)
  "post-tool-use-validate-before-assume.sh"
  "pre-tool-use-rzf-evidence-gate.sh"
  "post-stop-pcr-check.sh"
  "post-stop-link-discipline.sh"
  "post-stop-banned-phrase.sh"
  "user-prompt-submit-governor-prompts.sh"
  "post-stop-pnpm-verify.sh"
  # Self-test hook (this file; S007 turn 4)
  "verify-hooks-functional.sh"
  # S007 §24+ existing stubs (frontmatter-enum-check + skill-aap-required)
  "pre-tool-use-frontmatter-enum-check.sh"
  "pre-tool-use-skill-aap-required.sh"
  # S007 production hooks (active enforcement; not stubs)
  "user-prompt-submit-intake.sh"
  "post-stop-learning-loop.sh"
  # S012 production hook — B_OPTIMAL_NEXT_STEP turn discipline (user directive S012)
  "user-prompt-submit-next-step-reminder.sh"
  # S014 production hook — B_NO_WILD_IMPLEMENTATION plan-coverage gate (user directive S014)
  "pre-tool-use-plan-coverage-gate.sh"
  # S014 ZF-wall-to-wall — mandatory context load at session activation (P-META-020)
  "session-open.sh"
  # S014 ZF-wall-to-wall — CEC trigger on principle/contract ratification (P-META-006)
  "post-tool-use-cec-trigger.sh"
)

echo "[verify-hooks-functional] STUB — token-optimization.md §14.8 cruel-critic Critique 2 mitigation"
echo "[verify-hooks-functional] hooks_dir: ${HOOKS_DIR}"
echo "[verify-hooks-functional] declared: ${#DECLARED_HOOKS[@]} hooks (10 stubs + 2 production + 2 S012/S014 + 2 ZF-wall-to-wall)"
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
