#!/usr/bin/env bash
# @csps-id csps.claude.hooks.depth-marker-creation-gate
# @csps-name depth-marker-creation-gate
# @csps-description PreToolUse hook stub — fires on Write of governed artifacts (docs/plan/**/*.md + tools/templates/*.md + .claude/skills/*/SKILL.md); warns when file projected >300 lines AND missing `file_depth_markers` frontmatter field per [`depth-discipline.md`](../../docs/plan/pillar-0-governance/depth-discipline.md) (S009 L1.1) + [`governed-artifact-frontmatter.template.md`](../../tools/templates/governed-artifact-frontmatter.template.md) (S009 L1.2). Allows TBD-S<NNN> placeholder per EXT-20260505-004-B 5-step creation gate; companion validator `placeholder-staleness-detection` flags TBD-S<NNN> entries age >5 sessions. STUB tier (S009 L1.1); week-4 promotes to active enforcement.
# @csps-version 0.1.0-stub
# @csps-owner group:finky
# @csps-lifecycle experimental
# @csps-lifecycle-state stub
# @csps-tags type:hook domain:governance domain:architecture audience:developer
# @csps-enforces P-META-007 B_FIVE_SURFACE_ENGRAVING B_TEMPLATE_FIRST_CREATION
# @csps-source-extract EXT-20260505-004-A EXT-20260505-004-B
#
# Engraved S009 L1.1 as Surface 3 (hook) of depth-discipline 5/5 atomic FSE.
# Authoring deferred to L1.6 governor-permission ASK batch per popup-discipline
# memory entry 44 (CSP file #6 §3 Pattern A); Option B approved.
#
# STUB BEHAVIOR (current):
#   Reports check would have run. Always exits 0.
#
# WEEK-4 PROMOTION CRITERIA:
#   - Trigger: PreToolUse on Write/Edit tools targeting:
#     * docs/plan/**/*.md (excluding _intake/contexts/**/*.md extraction notes which use mini_tree_layer instead)
#     * tools/templates/*.md
#     * .claude/skills/*/SKILL.md
#     * docs/plan/_handoff/VAULT/topic-plans/*.md (also requires depth_chosen ∈ {3,4,5})
#   - Logic:
#     1. Read target file (existing) OR projected content (new file)
#     2. Compute projected line count (existing line count + new content delta)
#     3. If projected >300 lines AND frontmatter missing `file_depth_markers`:
#        - Emit warning to stderr citing depth-discipline.md §3 (5-step mechanical creation gate)
#        - Suggest TBD-S<NNN> placeholder as acceptable interim per EXT-20260505-004-B
#        - Exit 1 (warn) — non-blocking
#     4. If file <300 lines OR placeholder present: exit 0
#   - Reads frontmatter from line 1-50 (YAML between --- markers) using shell sed/awk OR yq if available
#   - Composition with `frontmatter_validate` (post-write detection): this hook is pre-write coverage
#   - Composition with `placeholder-staleness-detection`: catches stale TBD-S<NNN> >5 sessions later
#   - Settings.json registration: hooks.PreToolUse[].matcher = "Write|Edit" + glob filter
#
# Manual invocation: bash .claude/hooks/depth-marker-creation-gate.sh <target-file-path>

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "[depth-marker-creation-gate] STUB — timestamp=${TIMESTAMP}"
echo "[depth-marker-creation-gate] week-4 promotes to active enforcement: PreToolUse Write/Edit on governed-artifact paths"
echo "[depth-marker-creation-gate] enforces depth-discipline.md 5-step creation gate (S009 L1.1) + B_TEMPLATE_FIRST_CREATION"
echo "[depth-marker-creation-gate] reads frontmatter; warns if file projected >300 lines + missing file_depth_markers; TBD-S<NNN> placeholder acceptable"
echo "[depth-marker-creation-gate] STUB tier — exit 0 always"

exit 0
