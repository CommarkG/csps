#!/usr/bin/env bash
# @csps-id csps.claude.hooks.verify-hooks-functional
# @csps-name verify-hooks-functional
# @csps-description SessionStart hook — ACTIVE S041 (OPEN-048). Verifies critical hooks
# are present + executable. Exits 1 if ANY critical hook is missing or not executable.
# Non-critical hooks report advisory only. The meta-gap closed: the hook that validates
# hooks was STUB exits 0 — meaning a broken post-stop-rzf-reminder.sh would go undetected.
# @csps-version 1.0.0-active
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE B_INHERITANCE_POLICY
#
# AI DEEP INSTRUCTION (DEFAULT-ME-6 override):
# Training default: "platform has 20 hooks → enforcement is present."
# CSPS override: "every specific hook must be individually verified. The gestalt of
# 'lots of hooks' is not evidence that THIS hook is functioning."
#
# OPEN-048 S041 — upgraded from STUB to ACTIVE.
# Critical hooks: those with PRODUCTION/ACTIVE status that enforcement depends on.
# Non-critical hooks: STUB tier — advisory warning, not blocking.

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly HOOKS_DIR="${REPO_ROOT}/.claude/hooks"

# ── Critical hooks (PRODUCTION/ACTIVE — platform breaks without these) ────────
# Exit 1 if any of these are missing or not executable.
readonly -a CRITICAL_HOOKS=(
  "post-stop-rzf-reminder.sh"           # BLOCKING: ZF before response mandate
  "pre-tool-use-plan-coverage-gate.sh"  # BLOCKING: new libs/ require ratified PI
  "pre-tool-use-claude-dir-guard.sh"    # BLOCKING: protects .claude/ directory
  "post-stop-pnpm-verify.sh"            # BLOCKING: verify after code changes
  "post-stop-session-close-gate.sh"     # BLOCKING: session close protocol
  "session-open.sh"                     # PRODUCTION: CAP + governance injection
  "user-prompt-submit-next-step-reminder.sh"  # PRODUCTION: 6 turn disciplines
  "post-stop-link-discipline.sh"        # ACTIVE: EP-ERR-007 detection
  "post-stop-banned-phrase.sh"          # ADVISORY-ACTIVE: phrase detection
)

# ── All declared hooks (S067 STEP 6.5=67; S069 STEP 4=68; S069 T2=69: +pre-commit-plan-coverage; S072 M-CA=70: +council-address-required) ──
# NOTE: commit-msg hook (PROTO-S069-SACRED-T2) is in tools/scripts/git-hooks/ (git hook, not .claude/)
# verified separately: ls tools/scripts/git-hooks/commit-msg (PASS = present)
# Sweeps all .claude/hooks/*.sh files on disk. Closes EXISTS≠DECLARED (OPIA finding).
readonly -a DECLARED_HOOKS=(
  "pre-commit-plan-coverage.sh"
  "pre-tool-use-nodefile-required.sh"
  "cron-weekly-tag-status-deep-audit.sh"
  "depth-marker-creation-gate.sh"
  "post-stop-banned-phrase.sh"
  "post-stop-consolidation-pass.sh"
  "post-stop-directive-rzf-gate.sh"
  "post-stop-dna-sync-check.sh"
  "post-stop-error-harvest.sh"
  "post-stop-exists-not-equals-active.sh"
  "post-stop-learning-loop.sh"
  "post-stop-link-discipline.sh"
  "post-stop-pcr-check.sh"
  "post-stop-pnpm-verify.sh"
  "post-stop-rzf-reminder.sh"
  "post-stop-savings-ssot-coverage.sh"
  "post-stop-session-close-gate.sh"
  "post-stop-token-tracker.sh"
  "post-tool-use-cec-trigger.sh"
  "post-tool-use-design-token-check.sh"
  "post-tool-use-validate-before-assume.sh"
  "post-tool-use-zf-level-gate.sh"
  "pre-commit-bstar-engraving-gate.sh"
  "pre-commit-claim-validator-gate.sh"
  "pre-commit-delete-guard.sh"
  "pre-commit-describe-without-implement.sh"
  "pre-commit-knowledge-writeback-required.sh"
  "pre-commit-proto-core-seed-mandatory.sh"
  "pre-commit-validator-test-required.sh"
  "pre-tool-use-add-not-replace-gate.sh"
  "pre-tool-use-agent-alignment.sh"
  "pre-tool-use-alignment-gate.sh"
  "pre-tool-use-bstar-trio-gate.sh"
  "pre-tool-use-check-existing.sh"
  "pre-tool-use-claude-dir-guard.sh"
  "pre-tool-use-context-question-gate.sh"
  "pre-tool-use-corespine-check.sh"
  "pre-tool-use-external-integration-gate.sh"
  "pre-tool-use-false-assumption-gate.sh"
  "pre-tool-use-frontmatter-enum-check.sh"
  "pre-tool-use-humble-step-gate.sh"
  "pre-tool-use-inventory-scan-required.sh"
  "pre-tool-use-permanence-gate.sh"
  "pre-tool-use-plan-coverage-gate.sh"
  "pre-tool-use-playground-link-reminder.sh"
  "pre-tool-use-rule14-read-before-write.sh"
  "pre-tool-use-rzf-evidence-gate.sh"
  "pre-tool-use-sacred-file-guard.sh"
  "pre-tool-use-sacred-parts-guard.sh"
  "pre-tool-use-schema-registration-gate.sh"
  "pre-tool-use-shape-check.sh"
  "pre-tool-use-skill-aap-required.sh"
  "pre-tool-use-state-claim-gate.sh"
  "pre-tool-use-text-input-standard-gate.sh"
  "pre-tool-use-ux-creation-gate.sh"
  "pre-tool-use-vault-write-gate.sh"
  "pre-tool-use-voice-profile-gate.sh"
  "pre-tool-use-write-dispatcher.sh"
  "pre-tool-use-zf-termination-gate.sh"
  "session-open.sh"
  "user-prompt-submit-ai-profiler.sh"
  "user-prompt-submit-context-orchestrator.sh"
  "user-prompt-submit-governor-prompts.sh"
  "user-prompt-submit-intake.sh"
  "user-prompt-submit-next-step-reminder.sh"
  "user-prompt-submit-raw-comments.sh"
  "user-prompt-submit-token-budget-warning.sh"
  "user-prompt-submit-turn-counter.sh"
  "verify-hooks-functional.sh"
  "pre-tool-use-council-address-required.sh"
  "post-tool-use-proto-inline.sh"
  "post-tool-use-sonnet-relay-inline.sh"
  "pre-tool-use-closure-obligation-required.sh"
  "pre-tool-use-completion-before-new.sh"
  "post-tool-use-handoff-relay-inline.sh"
  "pre-tool-use-bash-governed-write-guard.sh"
  "post-stop-existence-claim-scan.sh"
  "user-prompt-submit-comments-before-code.sh"
)

echo "[verify-hooks-functional] ACTIVE S041 — checking ${#DECLARED_HOOKS[@]} hooks"
echo "[verify-hooks-functional] hooks_dir: ${HOOKS_DIR}"
echo ""

declare -i present=0
declare -i missing=0
declare -i not_executable=0
declare -i critical_failures=0

for hook in "${DECLARED_HOOKS[@]}"; do
  hook_path="${HOOKS_DIR}/${hook}"
  is_critical=false
  for ch in "${CRITICAL_HOOKS[@]}"; do
    [[ "$hook" == "$ch" ]] && is_critical=true && break
  done

  if [[ -f "${hook_path}" ]]; then
    present=$((present + 1))
    git_mode=$(git ls-files --format='%(objectmode)' -- "${hook_path}" 2>/dev/null || echo "")
    if [[ -x "${hook_path}" ]] || [[ "${git_mode}" == "100755" ]]; then
      printf "  ✓ %s%s\n" "${hook}" "$($is_critical && echo ' [CRITICAL]' || echo '')"
    else
      not_executable=$((not_executable + 1))
      if $is_critical; then
        critical_failures=$((critical_failures + 1))
        printf "  ✗ %s [CRITICAL — not executable: chmod +x required]\n" "${hook}"
      else
        printf "  ⚠ %s (not executable — advisory)\n" "${hook}"
      fi
    fi
  else
    missing=$((missing + 1))
    if $is_critical; then
      critical_failures=$((critical_failures + 1))
      printf "  ✗ %s [CRITICAL — MISSING: enforcement gap]\n" "${hook}"
    else
      printf "  ⚠ %s (missing — non-critical, advisory)\n" "${hook}"
    fi
  fi
done

echo ""
echo "[verify-hooks-functional] summary: present=${present} missing=${missing} not_executable=${not_executable} total_declared=${#DECLARED_HOOKS[@]}"

if [[ ${critical_failures} -gt 0 ]]; then
  echo ""
  echo "[verify-hooks-functional] ✗ BLOCKING: ${critical_failures} critical hook(s) missing or not executable."
  echo "  Critical hooks are PRODUCTION enforcement surfaces."
  echo "  Platform enforcement is degraded without them."
  echo "  DEFAULT-ME-6 override: 'hooks exist' ≠ 'this specific hook is functional.'"
  echo "  Fix: verify .claude/hooks/ and run git ls-files --format='%(objectmode)' -- .claude/hooks/<hook>"
  exit 1
fi

echo "[verify-hooks-functional] ✓ All critical hooks present and executable"
exit 0
