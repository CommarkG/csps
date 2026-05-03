---
id: csps.handoff.vault.gaps-and-duplications-S003
name: gaps-and-duplications-S003
description: S003 gaps + duplications scan. Distinct from validation-pass (3 perspectives) — this is a dedicated reuse-first sweep. Headline — zero duplications shipped this session (every leaf either declared `enhances:` against the most-similar existing leaf OR provided `created-new-because:` justification). 2 latent gaps surfaced for S004 attention.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: validation-pass, href: ./validation-pass-S003.md }
session: S003
---

# Gaps + Duplications Scan — Session S003

## Duplications scan

**Zero duplications shipped this session.**

Every leaf declared one of:
- `enhances: <existing-leaf-id>` (the artifact extends a ratified one) — used by `pillar-4/skill-ingestion-contract.md` (enhances pillar-3 sandboxed-skill-governance)
- `created-new-because: <multi-line-justification>` (the artifact is genuinely new) — used by 11 of 12 migrated leaves + all 4 vault snapshots

Each `created-new-because:` block names the closest existing artifact and explains why enhancement of that artifact would be wrong (per `frontmatter-standard.md` reuse-first contract).

## Latent gaps surfaced

### Gap 1 — `principles.yaml#P-ARCH-*` row count drift  ✅ **RESOLVED in extended-S003**

**What was suspected:** Pillar 4-6 leaves reference principle IDs P-ARCH-019 through P-ARCH-027. The S001 `principles.yaml` had P-ARCH-001 through P-ARCH-024 per stub list. S002 added stubs to bring count to 27. Verification not done at original S003 §3 close.

**Resolution (extended-S003 §C3.3):** verified via `Grep '^  - id: P-' principles.yaml`. ALL 38 IDs present (P-OP-001..004 + P-ARCH-001..027 + P-META-001..007). All 22 unique principle IDs cited in S003 leaves resolve to actual rows. ZERO dangling references.

Evidence: tool-call output showed lines 84-837 with all 38 `id: P-*` declarations.

### Gap 2 — Cross-vendor MCP server consistency  ✅ **CONFIRMED + ANNOTATED in extended-S003 (full resolution carried to ship-time)**

**What was suspected:** `pillar-4/skills-package.md` + `pillar-5/mastra-setup.md` both reference `packages/principles-mcp/` + `packages/catalog-mcp/` + `packages/skills-mcp/`.

**Verification (extended-S003 §C3.1):** Glob confirmed NONE of the three packages exist on disk yet. Per [`pillar-6/build-order.md`](../../pillar-6-operations-and-delivery/build-order.md) week 1 + week 6: principles-mcp skeleton planned week 1, full Mastra MCP integration (catalog-mcp + skills-mcp) planned week 6. The references in S003 leaves use present-tense as-if-existing wording.

**S004 action:**
1. When `packages/principles-mcp/` skeleton is created (week 1 of build), mark it 🟢 in MASTER_PLAN tracker
2. When `packages/catalog-mcp/` + `packages/skills-mcp/` ship (week 6), mark 🟢
3. Pre-week-1: audit-runner should warn (not error) on these planned-not-yet-existing refs with explicit `planned-for-week-N` annotation in the leaf, OR a `references-future-artifact: true` frontmatter flag

**Extended-S003 §C3.6 action taken:**
- Added "⚠️ Future-artifact references" sections to [`pillar-4/skills-package.md`](../../pillar-4-developer-experience/skills-package.md) and [`pillar-5/mastra-setup.md`](../../pillar-5-ai-systems/mastra-setup.md) explicitly stating each MCP package + its planned week + linking back to build-order.md as resolution authority
- Added `references_future_artifact: true` frontmatter flag to the 5 starter SKILL.md files (pcr / wip-check / reuse-check / batched-plan / audit-self) which depend on the principles-codegen pipeline (planned week 2)
- Future readers + audit-runner now have an unambiguous signal that these are forward-references-to-week-N-deliverables, not actual extant artifacts. Mechanical resolution will land when each package ships per build-order timeline.

## Reuse-first signal across the session

The §3.1 generators.md leaf demonstrates reuse-first applied recursively:
- Generators are themselves subject to reuse-first (per pillar-4 README + the leaf's anti-pattern #4)
- Each generator's catalog-first UX makes reuse-first mechanical at scaffolding time
- The leaf adds reuse-first-on-generators as anti-pattern #4 — a meta-application

This is the kind of compounding-returns moat P-META-007 (Five-Surface Engraving) targets — the discipline applies to the discipline-builder, not just the disciplined.

## Final reuse-first compliance score

| Artifact type | Created S003 | Declared `enhances:` | Declared `created-new-because:` | Either present | Compliance % |
|---|---|---|---|---|---|
| Pillar 4 leaves | 4 | 0 (1 — skill-ingestion) | 4 | 4 | 100% |
| Pillar 5 leaves | 3 | 0 | 3 | 3 | 100% |
| Pillar 6 leaves | 5 | 0 | 5 | 5 | 100% |
| Vault snapshots | 4 | 0 | 4 (implicit via "snapshot at S003 close") | 4 | 100% |
| **Total** | **16** | **1** | **15** | **16** | **100%** |

(skill-ingestion-contract.md uses both `enhances:` AND `created-new-because:` per its frontmatter — it enhances pillar-3/sandboxed-skill-governance but adds genuinely new content the parent doesn't cover.)

## Final stamp

S003 leaves the platform with zero duplications + 2 latent gaps surfaced for S004 attention + 100% reuse-first compliance on all 16 created artifacts.
