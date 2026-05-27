#!/usr/bin/env bash
# Hook: pre-commit-validator-test-required.sh
# Fires: pre-commit (git commit) — intercepted via PreToolUse on Bash tool
# Reads: git diff --cached --name-only (staged files)
# Filters: staged tools/validators/validate-*.mjs files
# Validates: matching behavioral test in same commit OR advisory-exempt declared
# Exits: 1 BLOCKING if validator staged without test and not exempt; 0 otherwise
#
# F-NEW-4: STAGING DISCIPLINE — validator + test must be in SAME commit.
#   If test is in separate commit, first commit BLOCKS (correct behavior, not a bug).
#   Stage both together: git add tools/validators/validate-X.mjs tools/tests/behavioral/X-test.sh
#
# BLOCKING from S066 (Sonnet Expert C BUILD_TEST_COMMIT_MANDATE — closes 3.6% behavioral test gap)
#
# @csps-id csps.claude.hooks.pre-commit-validator-test-required
# @csps-name pre-commit-validator-test-required
# @csps-description PreCommit git hook — BLOCKING gate for new/modified validators.
#   Requires matching behavioral test in SAME commit, OR @behavioral-test-status: advisory-exempt
#   comment + entry in tools/data/behavioral-test-exempt-registry.yaml.
#   F-NEW-4: validator + test MUST be in same commit.
#   Closes gap_VALIDATOR_BEHAVIORAL_TEST_COVERAGE K=1. PROTO-S066-WAVE-1 STEP 3.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE M-41 P-META-019
# inherits_from: PROTO-S066-WAVE-1 Core Seed pattern
# wave: WAVE-1-STEP-3

set -euo pipefail

readonly REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
readonly EXEMPT_REGISTRY="${REPO_ROOT}/tools/data/behavioral-test-exempt-registry.yaml"
readonly BEHAVIORAL_DIR="${REPO_ROOT}/tools/tests/behavioral"
VALIDATOR_PATTERN='^tools/validators/validate-.*\.mjs$'

# Gather ALL staged files (for same-commit check)
all_staged=$(git diff --cached --name-only 2>/dev/null || true)

# Filter to staged validator files
validators_staged=$(printf '%s\n' "$all_staged" | grep -E "$VALIDATOR_PATTERN" || true)

if [ -z "$validators_staged" ]; then
  exit 0  # No validators staged — nothing to check
fi

FOUND_VIOLATIONS=false

for validator in $validators_staged; do
  # Derive expected behavioral test filename
  # Pattern: validate-<base-name>.mjs → tools/tests/behavioral/<base-name>-test.sh
  # Example: validate-shape-check.mjs → shape-check-test.sh
  base_name=$(basename "$validator" .mjs | sed 's/^validate-//')
  expected_test="tools/tests/behavioral/${base_name}-test.sh"
  also_expected="${base_name}-test.sh"  # bare filename for flexible matching

  # Check 1: Is matching test staged in the same commit?
  test_staged=$(printf '%s\n' "$all_staged" | grep -F "$expected_test" || true)
  if [ -n "$test_staged" ]; then
    continue  # Test is staged — passes
  fi

  # Check 2: Does the test already exist on disk? (already shipped, not a new file)
  if [ -f "${REPO_ROOT}/${expected_test}" ]; then
    continue  # Test already exists — passes (test pre-existed this validator)
  fi

  # Check 3: Is the validator explicitly advisory-exempt?
  validator_file="${REPO_ROOT}/${validator}"
  if [ -f "$validator_file" ] && grep -q '@behavioral-test-status: advisory-exempt' "$validator_file" 2>/dev/null; then
    # Also check registry
    if [ -f "$EXEMPT_REGISTRY" ] && grep -q "$base_name" "$EXEMPT_REGISTRY" 2>/dev/null; then
      continue  # Explicitly exempt — passes
    fi
  fi

  # Violation found
  FOUND_VIOLATIONS=true
  echo "[validator-test-required] BLOCKING: ${validator} has no matching behavioral test." >&2
  echo "  Required: ${expected_test} in same commit (F-NEW-4: stage validator + test together)" >&2
  echo "  OR declare advisory-exempt via @behavioral-test-status: advisory-exempt comment + exempt-registry entry" >&2
  echo "  Fix: create tools/tests/behavioral/${base_name}-test.sh with INPUT A/B/C, then git add both" >&2
  echo "  Reference: tools/tests/behavioral/done-claim-validator-gate-test.sh (existing example)" >&2
done

if [ "$FOUND_VIOLATIONS" = "true" ]; then
  exit 1
fi

exit 0
