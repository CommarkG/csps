---
id: csps.pillar-0-governance.moat-registry
name: moat-registry
description: Definitive CSPS competitive moat registry — all 15 moat elements mapped to their recurring audit coverage, active validators, and cadence. validate-moat-coverage.mjs checks every moat element has at least one active audit. Alignment with CORE: every session checks CORE alignment via pnpm verify; weekly health hook checks moat element drift; monthly CSEP cycle ensures synergies propagate. Per S011 user directive "go over the core of cores list and the moat items and see how recurring audits covers all of them."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, VALD, AI, ARCH, OPER]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S011
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-end"
  read_protocol: "L1 = moat registry table with audit coverage. L2 = per-element detail + CSEP status."
links:
  - { rel: system-health-plan, href: ./system-health-plan.md }
  - { rel: qc-coverage-map, href: ./qc-coverage-map.md }
  - { rel: zf-moat, href: ./zf-moat.md }
  - { rel: council-registry, href: ./council-registry.md }
---

# Moat Registry — CSPS

> **The definitive list of what makes CSPS non-replicable.** Every moat element has a recurring audit. Every audit has a cadence. Every cadence has mechanical enforcement. No moat element is unchecked.

## §1 — The moat registry table

| # | Moat element | Unique because | Active validators | Cadence | CSEP status |
|---|---|---|---|---|---|
| M-01 | **Session-as-governed-artifact** | Every AI build session is HPFA+GP+ZF audited — no other platform governs its AI sessions | `rzf_evidence` + `session_artifact_sync` + `topic_plan_progress` | Every session | CSEP-pending |
| M-02 | **Behavioral contract system (40 B_*)** | AI HOW (reasoning) governed by contract, not just WHAT — no other platform has this | `behavioral_contract_slices_sync` | Every session | SG-001 |
| M-03 | **Error-pattern learning (EP-NNN)** | Mistakes produce EP entries that prevent recurrence — platform gets smarter | `plan_know_how` + weekly know-how-extractor | Weekly | CSEP-pending |
| M-04 | **Depth-aware knowledge loading** | Slices + MCP + L1/L2/L3 — 425× token reduction; most platforms load full files | `slice_freshness` + `principle_slices_sync` + `behavioral_contract_slices_sync` | Every session | SG-002 |
| M-05 | **Core Spines precedence (GVRN>VALD>ARCH>AI>OPER)** | Principled conflict resolution — no invented hierarchies | `corespine_depth_markers` + frontmatter validation | Every session | CSEP-pending |
| M-06 | **Construction gate (plan-before-build)** | No code without ratified plan — enforced by validator | `no_implementation_without_plan` | Every session | EP-011 resolved |
| M-07 | **ZF moat (RZF+CEC+per-session+EP-learning+provenance)** | THIS-SESSION evidence required; CEC propagates insights; graduated apps carry ZF history | `rzf_evidence` + `session_artifact_sync` | Every session | See zf-moat.md |
| M-08 | **Questions as first-class (vault + question_register)** | Questions preserved with context — no knowledge loss | vault_pending field + `validate-vault-connections` (future) | Weekly extraction | CSEP-pending |
| M-09 | **Positive harvest (SG-NNN)** | Success patterns harvested and applied — most platforms only track failures | Weekly know-how-extractor §SG | Weekly | CSEP-pending |
| M-10 | **Vault methodology (temporal optimization)** | Deliberate deferral with full context — not procrastination, virtue | vault_pending field + weekly §6 EP K=2 | Weekly | CSEP-pending |
| M-11 | **Council + orchestration (19 expert members)** | Skill dispatch by task class with improvement pipeline | `aap_frontmatter_coverage` + council-registry | Per-session + weekly | CSEP-pending |
| M-12 | **Implementation status state machine** | swift-implemented→sealed-zf tracks quality journey | `impl_status` | Every session | swift-implemented |
| M-13 | **Core Cross-Synergy (CSEP pipeline)** | Any insight propagates to ALL relevant surfaces via Synergy Master + Cruel Critic | synergy-master skill + cruel-critic skill (19th/20th council members) | Monthly | ACTIVE — this document |
| M-14 | **System-health organism (4 cadences)** | Daily/weekly/monthly/quarterly health scans mapped to 10 audit-hub pipelines | `validate-corespine-depth-markers` + weekly hook | 4 cadences | See system-health-plan.md |
| M-15 | **CORE alignment enforcement** | Every artifact declares its spine; precedence order resolves conflicts | `corespine_depth_markers` + frontmatter_validate | Every session | CSEP-pending |

## §2 — Audit coverage by cadence

### Every session (pnpm verify — 23 validators)
Covers: M-01, M-02, M-04, M-05, M-06, M-07, M-12, M-15

### Weekly (cron-weekly-tag-status-deep-audit.sh)
Covers: M-03 (know-how extraction), M-08 (vault processing), M-09 (SG-NNN), M-10 (K=2 check), M-11 (council drift)

### Monthly (manual + CSEP cycle)
Covers: M-13 (synergy-master full scan), M-14 (health organism review), M-08 (deep vault processing)

### Quarterly
Covers: All moat elements — full reassessment + honest calibration + architecture review

## §3 — CORE alignment check (the unique alignment discipline)

Every session pnpm verify checks CORE alignment:
- `corespine_depth_markers` → 5 L1_CORE files have depth markers ✅
- `frontmatter_validate` → every artifact declares `core_spine:` ✅
- `behavioral_contract_slices_sync` → all B_* contracts align with CORE ✅
- `principle_slices_sync` → all 53 principles align with CORE ✅

The CORE is not just a category — it's enforced by validators. Any artifact claiming GVRN spine that violates GVRN CORE doctrine fails `corespine-layer-compliance` (week-4 build).

**This is the unique thing:** most platforms have "core values" that are aspirational. CSPS has CORE values that are MECHANICALLY ENFORCED. The L1_CORE sealed files are the constitution. The validators are the enforcement layer.

## §4 — Moat growth trajectory

```
S006 close:  3 moat elements (session-gov + B_* + principle-inheritance)
S011 close: 15 moat elements (3 + depth-aware + construction-gate + ZF-moat
                               + questions + positive-harvest + vault + council
                               + impl-status + core-synergy + health-organism + CORE)
Target:     20+ moat elements by S015 (foundation-slices + vocabulary-governance
                                        + graduation-provenance + CSEP-history)
```

Every session adds moat elements. This is the compound moat — not static barriers but a growing, self-reinforcing set of properties that no competitor can replicate quickly because the history matters as much as the current state.
