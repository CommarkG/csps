---
id: csps.pillar-0-governance.depth-discipline
name: depth-discipline
description: Canonical home for ALL CSPS depth semantics. 5 distinct semantics use L1/L2/L3 nomenclature on different domains and must be disambiguated BEFORE Phase 6 spawn templates author new artifacts. Adapts CSP file #4 (DEPTH_LEVELS_AND_BUNDLING_ORCHESTRATOR_REPORT) 4 semantics + adds CSPS-native 5th (`depth_chosen` topic-plan layer count). Composes with mechanical-creation discipline (5-step process with placeholders) per EXT-20260505-004-B at L1.2 governed-artifact-frontmatter.template.md. Without this disambiguation Phase 6+ would invent its own field semantics = drift. Per S009 L1.1 engraving (token-optimization §9.0 synthesized order; Q1=A — proceed with EXT-004-A as canonical).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: novel-pending-pattern-evaluation
core_spine: ARCH
core_spines: [ARCH, GVRN, AI, OPER, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S009
file_depth_markers:
  l1_lines: "1-90"
  l2_lines: "91-220"
  l3_lines: "221-end"
  read_protocol: "L1 = 5-semantics disambiguation table + unified principle. L2 = per-semantic detail + creation gate. L3 = composition + mechanical enforcement + references."
context_loss_prevention:
  consulted: docs/plan/pillar-0-governance/context-loss-pains.md
  applies_to_this_plan:
    - PAIN-OVERREAD: "depth markers enable PE.read_budget L1-only default per B_TOKEN_BUDGET R1"
    - PAIN-D5: "explicit semantics prevent continuity-bias replication of wrong fields in Phase 6 spawn templates"
    - PAIN-CLOSED-ENUM-DRIFT: "depth_chosen enum {3,4,5} canonical here; cross-validates frontmatter-closed-enums.md"
  not_applicable:
    - PAIN-N-TO-1-CHAT: "leaf authoring; no chat-vs-session boundary"
links:
  - { rel: parent, href: ./README.md }
  - { rel: csps-dna, href: ./csps-platform-dna.md }
  - { rel: plan-creation-protocol, href: ./plan-creation-protocol.md }
  - { rel: context-loss-pains, href: ./context-loss-pains.md }
  - { rel: frontmatter-closed-enums, href: ./frontmatter-closed-enums.md }
  - { rel: source-extract, href: ../_intake/contexts/governance/depth-discipline/EXT-20260505-004-A-four-distinct-depth-level-semantics-and-unified-principle.md }
  - { rel: creation-gate-source, href: ../_intake/contexts/governance/depth-discipline/EXT-20260505-004-B-mechanical-creation-discipline-with-placeholders.md }
  - { rel: bundling-orchestrator-source, href: ../_intake/contexts/governance/depth-discipline/EXT-20260505-004-C-bundling-orchestrator-pe-read-budget-extension.md }
domain_path: platform
---

# Depth Discipline — CSPS Canonical Home

> **Canonical disambiguation of 5 CSPS depth semantics that all use L1/L2/L3 nomenclature on different domains.** Per S009 L1.1 engraving (token-optimization §9.0 synthesized order). Without this disambiguation Phase 6+ spawn templates would invent their own field semantics = D5 continuity-bias drift. CSPS DNA Element 10 (per [csps-platform-dna.md](./csps-platform-dna.md)).

## §1 — The 5 CSPS depth semantics (canonical disambiguation table)

Each semantic uses L1/L2/L3 nomenclature on a DIFFERENT domain. Naming-collision is the source of drift; this table is the SSoT that prevents it.

| # | Semantic | Field name | Domain | Values | Required when |
|---|---|---|---|---|---|
| 1 | **File-internal line ranges** | `file_depth_markers` | Per-document line ranges | `{l1_lines, l2_lines, l3_lines, read_protocol}` | File >300 lines (PR-blocking warn at threshold per EXT-002-F) |
| 2 | **DNA element depths invoked** | `depth_levels_invoked` | Which DNA element depths the artifact uses | Subset of `{L1, L2, L3}` | Artifact participates in PE.read_budget bundling |
| 3 | **Audit situation escalation** | (audit-internal field; deferred S010-S011) | L1 SCSE / L2 Domain Deep Dive / L3 Expert Panel | `{L1_SCSE, L2_DOMAIN, L3_EXPERT}` | Audit invocation; not yet engraved (per EXT-002-E) |
| 4 | **Author tier** | `depth_tier_authored` | Which tier the author wrote at (CSP CC-083 analog) | `{l1_essence, l2_detail, l3_deep_dive}` | Author needs to declare authoring tier (multi-tier docs) |
| 5 | **Topic-plan layer count** (CSPS-native; not in CSP) | `depth_chosen` | gradual-build-plan layer count | `{3, 4, 5}` | Multi-session topic-plan authoring (per B_GRADUAL_BUILD_BY_FOUNDATIONS) |

**Mnemonic:** semantics 1+2+4 are PER-ARTIFACT static declarations (frontmatter). Semantic 3 is RUNTIME audit-invocation only (deferred). Semantic 5 is TOPIC-PLAN-SPECIFIC (gradual-build-plan layer arc).

**Naming-drift caveat (open Q from EXT-004-A):** semantics 2 (`depth_levels_invoked`) and 5 (`depth_chosen`) both reference depth but operate at different scales. **Disambiguation rule:** `depth_chosen` is ONLY for topic-plan files at `_handoff/VAULT/topic-plans/<topic-id>.md`; all other artifacts use `depth_levels_invoked`. Validators enforce per-path scope.

## §2 — The unified principle (per-artifact + per-session aggregation)

Per EXT-20260505-004-A §5 verbatim:

> *Per-artifact declaration — each artifact declares its own depth structure. Static; declared at authoring time.*
> *Per-session aggregation — at session start + per-task, the bundling orchestrator aggregates depth declarations across all referenced/loaded artifacts. Dynamic; computed per task per session.*
> *Why coordinated: without per-artifact declaration, the orchestrator has no input data. Without per-session aggregation, per-artifact declarations sit unused.*

**Both layers required for energy optimization to materialize.** L1.1 covers Layer 1 (per-artifact declaration); Layer 2 (bundling orchestrator = PE.read_budget) lands at Phase 9 (S012) per token-optimization.md §9.0 + EXT-004-C. **NOTE: Phase 8 (S011 ✅ COMPLETE) = principles-mcp slice-reading + depth-aware L1/L2/L3 query tools; Phase 9 = bundling orchestrator.**

## §3 — Mechanical creation gate (placeholders allowed)

Per EXT-20260505-004-B §6 — 5-step mechanical-creation process. **Authored at L1.2 same-batch as `tools/templates/governed-artifact-frontmatter.template.md`** (token-optimization §9.0 synthesized order):

1. **Frontmatter template at creation time** — every new governed artifact starts from a template that pre-includes `file_depth_markers` (REQUIRED if >300 lines projected) + `depth_levels_invoked` + `depth_tier_authored` with `TBD-S<NNN>` placeholders allowed
2. **Pre-tool-use hook check** — `.claude/hooks/depth-marker-creation-gate.sh` (STUB; activation L1.6 batch per popup discipline) — fires on Write of governed artifacts; warns if >300 lines + missing `file_depth_markers`
3. **Author fills placeholders before content stabilizes** — at first refactor / first reassessment, placeholders MUST be filled with real values
4. **Validator catches stale placeholders** — flags artifacts with `TBD-S<NNN>` patterns AND age >5 sessions; forces backfill
5. **Bundling orchestrator consumes real values** — once placeholders are real, PE.read_budget starts using them for energy optimization (Phase 9 S012 — EXT-004-C)

**Why placeholders OK:** content structure isn't stable until first refactor. Pre-stabilization, real depth markers would be wrong. Placeholders signal *"depth discipline acknowledged; values pending stabilization."*

**Threshold ratification (open Q from EXT-004-B):** 300-line threshold adopted from CSP verbatim; CSPS-calibration deferred to Phase 9 measurement validator (S013) — re-evaluate once empirical CSPS data exists.

**Staleness window ratification:** 5-session window adopted from CSP verbatim; CSPS cadence may differ — re-evaluate at first K=2 stale-placeholder fire.

## §4 — Composition with existing CSPS DNA elements

| DNA Element | Composition with depth-discipline |
|---|---|
| 1 vocab (closed-enums) | `depth_chosen` enum `{3,4,5}` ratified here; cross-listed in [frontmatter-closed-enums.md](./frontmatter-closed-enums.md) tag dimensions section (extension week-4) |
| 3 SCHEMA | `file_depth_markers` + `depth_levels_invoked` + `depth_tier_authored` formalized as frontmatter-required-when fields |
| 7 Quality Gates | QG3 (mid-session edited files re-read) consumes `file_depth_markers` to scope re-reads to relevant line range |
| 8 Templates | L1.2 `governed-artifact-frontmatter.template.md` pre-includes all 4 depth fields |
| 9 FSE | This engraving IS 5/5 atomic per FSE: schema (this leaf) + validator (`depth_marker_creation_gate` audit slug) + hook (`.claude/hooks/depth-marker-creation-gate.sh` STUB; L1.6 batch) + memory (`feedback_depth_discipline.md`) + contract surface (AGENTS.md "Where things live" row) |
| 10 Depth Levels | THIS ELEMENT — canonical home declared |
| 11 Priority Engine | `depth_chosen` semantic 5 is gradual-build-plan input; PE.read_budget consumes semantic 1+2 outputs (Phase 9 S012) |
| 12 Context-Loss Discipline | PAIN-OVERREAD + PAIN-D5 mitigated via depth markers enabling L1-only default reads |

## §5 — Anti-patterns

| Pattern | Detection | Mitigation |
|---|---|---|
| **Semantic conflation in prose** (CSP file #4 §4 Duplication #3) | Mentioning "L1/L2/L3" without naming which semantic | Always cite the field name (`file_depth_markers` vs `depth_levels_invoked`) |
| **Restating depth-discipline rules across docs** (CSP file #4 §4 Duplication #2) | "files >300 lines should declare depth markers" appearing in 4+ docs | Every doc REFERENCES this leaf; never restates per [B_CONSOLIDATION_PASS](./behavioral-contracts.md) (L1.3) |
| **Semantic 2 (`depth_levels_invoked`) overloaded** (CSP file #4 §4 Duplication #1) | Same field name carrying different semantics in different artifacts | Validator `depth-field-semantic-consistency` (week-4 stub) catches divergence |
| **Bulk-backfill old artifacts** (CSP file #3 counter-case 6) | Mass-edit existing files to add depth markers | Apply mechanical-creation gate going-forward only; backfill at next-touch-anyway |
| **Phase 6 spawn template invents its own depth fields** (D5 continuity-bias) | Spawn template adds `nested_depth: ...` instead of `depth_levels_invoked` | L1.2 template pre-defines fields; Phase 6 spawn templates inherit |

## §6 — Mechanical enforcement (validators)

| Validator | Cadence | Status | Activation |
|---|---|---|---|
| `depth_marker_creation_gate` | PR + per-session | STUB (S009 atomic this batch) | week-4 (hook activation gated by L1.6 settings.json batch) |
| `depth-field-semantic-consistency` | PR | STUB | week-4 |
| `placeholder-staleness-detection` | weekly | STUB | week-4 (5-session window) |
| `depth_chosen-scope-violation` | PR | STUB | week-4 (rejects `depth_chosen` outside topic-plan files) |

**Pre-runtime:** AI manually applies. **Post-runtime (week-4+):** mechanical via audit-runner Pipeline 3 (governance) + audit-hub.md.

## §7 — Open questions (carry-forward register)

Per EXT-004-A + EXT-004-B open Qs — declared NOT resolved this batch:

1. **Audit-depth semantic (#3)** engrave NOW or defer? — DEFERRED S010-S011 per EXT-002-E (audit-depth is constitutional change; foundation-stability per B_GRADUAL_BUILD)
2. **5 semantics OR consolidate to 3?** — KEPT 5 this batch; reassess at Phase 9 once bundling orchestrator empirically validates (S012)
3. **300-line threshold CSPS-calibration** — DEFERRED Phase 10 measurement validator (S013)
4. **5-session staleness window CSPS-calibration** — DEFERRED first K=2 stale-placeholder fire
5. **Pre-push hook OR pre-tool-use OR both?** — DECIDED both: pre-tool-use catches AI-authored (this batch); pre-push catches commit-time (week-4 layered defense)

## §8 — References

- [csps-platform-dna.md](./csps-platform-dna.md) — DNA Element 10 (this leaf is the canonical home)
- [plan-creation-protocol.md](./plan-creation-protocol.md) — Step 2 DNA gate consults this for plans
- [context-loss-pains.md](./context-loss-pains.md) — PAIN-OVERREAD + PAIN-D5 mitigation cross-ref
- [frontmatter-closed-enums.md](./frontmatter-closed-enums.md) — `depth_chosen` enum cross-listed (extension week-4)
- [token-optimization.md §9.0](./token-optimization.md) — synthesized order; this leaf is L1.1 prerequisite for Phase 6
- [tools/templates/governed-artifact-frontmatter.template.md](../../../tools/templates/governed-artifact-frontmatter.template.md) — L1.2 sister-leaf (creation-gate template)
- [EXT-20260505-004-A](../_intake/contexts/governance/depth-discipline/EXT-20260505-004-A-four-distinct-depth-level-semantics-and-unified-principle.md) — source extract (5 semantics + unified principle)
- [EXT-20260505-004-B](../_intake/contexts/governance/depth-discipline/EXT-20260505-004-B-mechanical-creation-discipline-with-placeholders.md) — source extract (5-step creation gate)
- [EXT-20260505-004-C](../_intake/contexts/governance/depth-discipline/EXT-20260505-004-C-bundling-orchestrator-pe-read-budget-extension.md) — source extract (Phase 8 bundling orchestrator)

**Depth-discipline signature:** `S009-AI-depth-discipline-v1.0-2026-05-05`
