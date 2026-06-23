---
id: csps.governance.tagging-core-index
name: TAGGING-CORE-INDEX
description: >
  The single index that declares: which file is the SSoT for each closed-enum dimension,
  how each dimension is used, and the formally ratified S049/S050 disposition.
  Everything that uses tags, status, vocab, or names inherits from this index.
  Validators MUST import from tools/config/tagging-core-enums.yaml, never re-define.
version: "1.0"
session: S088
authored_by: Sonnet-builder S088 | Opus directive PROTO-S088-HARVEST-GATE BUILD 2
status: draft-awaits-ratification
owner: group:finky
lifecycle: production
lifecycle_state: pending-review
next_review_at: "2026-07-07"
core_spine: GVRN
impl_status: swift-implemented
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
links:
  - { rel: enum-ssot, href: ../../../tools/config/tagging-core-enums.yaml }
  - { rel: frontmatter-closed-enums, href: ./frontmatter-closed-enums.md }
  - { rel: tag-status-contract, href: ../_intake/tag-status-contract.md }
  - { rel: divergence-validator, href: ../../../tools/validators/validate-tagging-core-divergence.mjs }
---

# TAGGING CORE INDEX
## The single SSoT map for every closed-enum dimension in CSPS

> **Status:** DRAFT — for Opus review and ratification
> **Governing intent:** An untagged input or creation has no inheritance parent and is a loose cannon.
> Every artifact, intake, harvest, and creation must carry tags drawn from THIS index.

---

## PART 1 — S049/S050 STATUS RATIFICATION (S088)

The S049/S050 consolidation (2023-S049) proposed replacing `lifecycle_state` with `stage` and `quality_state`. That cutover was never completed — `lifecycle_state` remains in `REQUIRED_FIELDS` in `validate-frontmatter.mjs`.

**S088 RATIFICATION (pending Opus counter-sign):**

| Question | Ratified answer |
|----------|----------------|
| Is `lifecycle_state` still required on ALL artifacts? | **YES** — it is the PRIMARY status field, required by validate-frontmatter.mjs |
| Did `stage` replace `lifecycle_state`? | **NO** — S050 hard cutover never activated. `stage` is an OPTIONAL overlay for process/workstream artifacts ONLY |
| Did `quality_state` replace `impl_status`? | **PARTIAL** — both exist. `quality_state` = evidence quality; `impl_status` = implementation completeness. Keep both as optional overlays |
| Is the S049/S050 cutover complete? | **NO** — ratify as DEFERRED. `lifecycle_state` remains the canonical primary field. |
| What is the one canonical status field for frontmatter? | `lifecycle_state` (from `tools/config/tagging-core-enums.yaml` dimension 1) |

**Implication:** Any artifact using `stage` or `quality_state` uses them as SUPPLEMENTAL dimensions on top of `lifecycle_state`. Validators apply all that are present.

---

## PART 2 — SSoT MAP PER DIMENSION

Each dimension: what it represents, where the canonical enum lives, which validator enforces it.

| Dimension | Field | What it represents | SSoT | Enforced by |
|-----------|-------|-------------------|------|-------------|
| Artifact lifecycle | `lifecycle_state` | Where the artifact IS in its governed lifecycle | `tagging-core-enums.yaml §lifecycle_state` | validate-frontmatter.mjs (REQUIRED) |
| Document stage | `stage` | Process/workstream stage (OPTIONAL — topic-plans, milestones) | `tagging-core-enums.yaml §stage` | validate-frontmatter.mjs (optional field) |
| Evidence quality | `quality_state` | Quality of evidence backing the artifact (OPTIONAL) | `tagging-core-enums.yaml §quality_state` | validate-frontmatter.mjs (optional field) |
| Content pipeline | `cdp_status` | Research/external-input pipeline state (OPTIONAL) | `tagging-core-enums.yaml §cdp_status` | validate-frontmatter.mjs (optional field) |
| Enforcement tier | `enforcement_stage` | How mechanically enforced a rule/validator is | `tagging-core-enums.yaml §enforcement_stage` | validate-frontmatter.mjs (optional field) |
| Knowledge type | `wisdom_class` | Type of knowledge in harvest/research entries | `tagging-core-enums.yaml §wisdom_class` | validate-council-harvest.mjs (optional field) |
| Platform spine | `core_spine` | Which of the 5 platform spines this artifact belongs to | `tagging-core-enums.yaml §core_spine` | validate-frontmatter.mjs (required) |
| Doc taxonomy | `diataxis_type` | Diátaxis documentation type | `tagging-core-enums.yaml §diataxis_type` | validate-frontmatter.mjs (optional) |
| Implementation | `impl_status` | Implementation completeness | `tagging-core-enums.yaml §impl_status` | validate-universal-alignment.mjs |
| Harvest routing | `disposition` | How a harvest entry's insight is routed | `tagging-core-enums.yaml §harvest_disposition` | validate-council-harvest.mjs (required on close) |

---

## PART 3 — THE FOUR TAGGING SURFACES (where tags must appear)

Every artifact entering or produced by the platform carries tags at these four surfaces:

### Surface 1: Frontmatter (all governed artifacts)

Every `.md` file with CSPS frontmatter carries:
- REQUIRED: `id`, `name`, `description`, `version`, `owner`, `lifecycle`, `lifecycle_state`, `core_spine`
- REQUIRED conditional: `next_review_at` (when lifecycle_state ≠ active), `impl_status` (when artifact is a governed implementation)
- OPTIONAL overlays: `stage`, `quality_state`, `cdp_status`, `enforcement_stage`, `wisdom_class`, `diataxis_type`

### Surface 2: Threshold Intake (every routed input)

Every entry in `tools/data/council-invocation-log.yaml` carries:
- REQUIRED: `id`, `timestamp`, `session`, `route`, `spine`, `scope`, `personas`
- The `spine` value MUST match a valid `core_spine` enum

### Surface 3: Council Harvest (every harvested output)

Every entry in `tools/data/council-harvest.yaml` carries (per §9 of COUNCIL-WISDOM-HARVEST-DESIGN.md):
- REQUIRED: `id`, `trigger`, `question`, `provenance`, `spine`, `domain`, `wisdom_class`
- REQUIRED on close: `conclusion`, `disposition`
- All values from closed enums in this index (no free-text)

### Surface 4: Ratified Standards (every promoted standard)

Every entry in `tools/data/ratified-standards.yaml` carries:
- REQUIRED: `id`, `name`, `ratified_session`, `ratified_by`, `description`
- REQUIRED for propagation: `creation_standard` + `audit_entry` (both directions wired)

---

## PART 4 — INHERITANCE LAW

1. Any artifact created WITHOUT all required tags from Surface 1 is an **orphan** (no parent, no DNA). `validate-frontmatter.mjs` BLOCKS commits with orphaned artifacts.

2. Any harvest entry WITHOUT a valid `wisdom_class` and `spine` from the SSoT is **un-governed output**. `validate-council-harvest.mjs` BLOCKS.

3. Any validator that hardcodes enum values NOT from `tools/config/tagging-core-enums.yaml` introduces **SSoT drift**. `validate-tagging-core-divergence.mjs` BLOCKS.

4. When an artifact changes `lifecycle_state`, the new value MUST be in the enum. No freestyle status values. No "in-progress", "done", "complete" — use the canonical enum.

---

## PART 5 — DIVERGENCE PREVENTION (the enforcement)

**T2 validator:** `validate-tagging-core-divergence.mjs` (STANDARD tier, BLOCKING)
- Reads `tools/config/tagging-core-enums.yaml` (the SSoT)
- Reads `validate-frontmatter.mjs` to extract its hardcoded enum arrays
- Compares: if any enum value in the code is NOT in the SSoT (or vice versa), BLOCK
- Block-test: plants a divergence (adds a value to the SSoT that's not in the code) → exit 1; plants a value in the code not in the SSoT → exit 1; clean state → exit 0

**T3:** This file (session-open injection once linked to SEED-C)

**Migration path for existing enum hardcodes:**
The immediate fix is the divergence check — it catches drift. The longer-term refactoring (validators actually import from the YAML file) is scheduled as a consolidation pass. Both are tracked in gap-recurrence-register.yaml.

---

## PART 6 — WHAT THIS INDEX DOES NOT DO

- Does NOT change existing enum values (backward-compatible)
- Does NOT complete the S049/S050 migration (formally deferred)
- Does NOT require validators to immediately import from YAML (tracked separately)
- Does NOT retire `stage`, `quality_state`, or `cdp_status` fields

What it DOES:
- Declares `tools/config/tagging-core-enums.yaml` as the ONE SSoT for all enum values
- Ratifies that `lifecycle_state` remains the primary required field
- Creates a divergence gate so new enums cannot be added in code without updating the SSoT
- Provides a map for everything that uses tags, so no dimension is "loose cannon"

---

*For Opus: The key question is whether the S049/S050 ratification in Part 1 aligns with your governance intent. If `lifecycle_state` stays primary, the S049/S050 deferred-forever is clean. If you want to complete the cutover (`stage` replaces `lifecycle_state`), that's a multi-session consolidation — need a PARK + PE-score + sequencing.*
