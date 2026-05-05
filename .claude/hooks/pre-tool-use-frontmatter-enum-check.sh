#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-frontmatter-enum-check
# @csps-name pre-tool-use-frontmatter-enum-check
# @csps-description PreToolUse hook stub — fires before Write/Edit on .md files; warns when frontmatter contains values not in declared closed enums (lifecycle / lifecycle_state / domain / type / tier / audience / maturity tags). Mitigates K=2-promoted closed-enum drift pattern per B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 (S007 turn 5). STUB tier; week-4 promotes to active enforcement once 7 hook scripts ship per token-optimization Phase 5.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-019 B_STRUCTURAL_PREVENTION_DISCIPLINE
#
# Engraved at S007 turn 5 as Surface 3 of K=2 closed-enum drift 5/5 atomic engraving.
# Per B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 K=2 promotion (S007 §10.0j candidate).
#
# STUB BEHAVIOR (current):
#   Reports check would have run on $TARGET_FILE if active. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Parses frontmatter of $TARGET_FILE
#   - Validates each closed-enum field against canonical enum from frontmatter-closed-enums.md
#   - Flags drift candidates (e.g., "maturity:active" → "active not in {draft,review,stable,frozen,deprecated}")
#   - Exit 1 if drift detected; user can override via env var CSPS_ALLOW_FRONTMATTER_DRIFT=1
#   - Registered as PreToolUse hook in .claude/settings.json with matchers: Write|Edit on **/*.md
#
# Manual invocation: bash .claude/hooks/pre-tool-use-frontmatter-enum-check.sh <target-file>

set -euo pipefail

readonly TARGET_FILE="${1:-}"

if [[ -z "${TARGET_FILE}" ]]; then
  echo "[frontmatter-enum-check] STUB — no target file passed (week-4 wires up via PreToolUse matcher)"
  exit 0
fi

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly ENUM_REFERENCE="${REPO_ROOT}/docs/plan/pillar-0-governance/frontmatter-closed-enums.md"

echo "[frontmatter-enum-check] STUB — target=${TARGET_FILE}"
echo "[frontmatter-enum-check] reference: ${ENUM_REFERENCE}"
echo "[frontmatter-enum-check] week-4 promotes to active enforcement parsing frontmatter + validating closed enums"
echo "[frontmatter-enum-check] STUB tier — exit 0 always"

exit 0
