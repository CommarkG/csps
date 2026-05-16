#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-skill-aap-required
# @csps-name pre-tool-use-skill-aap-required
# @csps-description PreToolUse hook stub — fires before Write/Edit on **/SKILL.md files; refuses commit if AAP frontmatter is incomplete (csps_aligned + aap_version + agent_class + acknowledged_contracts + respects_quality_gates + output_contract + trust_tier). Mitigates skill-as-wildcard hazard per B_AGENT_ALIGNMENT_PROTOCOL no-wildcards mandate (S007 §24+ post-close addendum). STUB tier; week-4 promotes to active enforcement.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance audience:developer
# @csps-enforces P-META-010 B_AGENT_ALIGNMENT_PROTOCOL
#
# Engraved at S007 §24+ post-close addendum as Surface 3 of multi-location-AAP-coverage 5/5 atomic.
# Per user directive: "non aligned agent and skills are wild cards that could destroy and damage
# a lot of what we built here". The validator validate-aap-frontmatter.mjs now scans both
# packages/skills/ AND .claude/skills/ AND libs/agents/ (week-6+); this hook is the pre-write
# enforcement angle.
#
# STUB BEHAVIOR (current):
#   Reports check would have run on $TARGET_FILE if active. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA (extended S010 — 9-field AAP amendment per B_AGENT_ALIGNMENT_PROTOCOL):
#   - Parses frontmatter of $TARGET_FILE
#   - Phase 1 ERROR-level (7 original fields): csps_aligned + aap_version + agent_class +
#     acknowledged_contracts (universal-required B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME) +
#     respects_quality_gates [QG1-QG4] + output_contract + trust_tier — exit 1 if missing
#   - Phase 1 WARN-level (2 new fields S010 amendment): principle_compliance (P-* IDs; minimum
#     P-META-010 + P-META-002) + consolidation_cross_refs (artifact paths per B_CONSOLIDATION_PASS) —
#     log warning but exit 0 (preserves verify continuity for 16 existing SKILL.md)
#   - Phase 2 (S012 target): warn → error after S011 backfill pass; new SKILL.md REQUIRED to declare 9 fields
#   - Override original 7: env var CSPS_ALLOW_SKILL_WILDCARD=1 (with audit log)
#   - Registered as PreToolUse hook in .claude/settings.json with matchers: Write|Edit on **/SKILL.md
#
# Manual invocation: bash .claude/hooks/pre-tool-use-skill-aap-required.sh <target-file>

set -euo pipefail

readonly TARGET_FILE="${1:-}"

if [[ -z "${TARGET_FILE}" ]]; then
  echo "[skill-aap-required] STUB — no target file passed (week-4 wires up via PreToolUse matcher)"
  exit 0
fi

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly VALIDATOR="${REPO_ROOT}/tools/validators/validate-aap-frontmatter.mjs"

echo "[skill-aap-required] STUB — target=${TARGET_FILE}"
echo "[skill-aap-required] validator: ${VALIDATOR}"
echo "[skill-aap-required] week-4 promotes to active enforcement using same AAP_REQUIRED_FIELDS as validator"
echo "[skill-aap-required] no-wildcards mandate: skill without AAP frontmatter is wildcard hazard"
echo "[skill-aap-required] STUB tier — exit 0 always"

exit 0
