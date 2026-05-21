---
id: csps.pillar-0-governance.behavioral-contracts-shard-plan
name: behavioral-contracts-shard-plan
description: "Shard plan for behavioral-contracts.md. 64 B_* contracts at ~57K tokens (hard limit 60K). Plan: split by Core Spine into 5 domain files. Ratified PROTO-050 S050."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
batch: BATCH-A
session: S050
template_depth: L3
parent_template: governed-artifact-frontmatter
diataxis_type: reference
impl_status: swift-implemented
links:
  - { rel: shard-target, href: behavioral-contracts.md }
  - { rel: capacity-monitor, href: audit-runner.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - docs/plan/pillar-0-governance/audit-runner.md
---

# Behavioral Contracts Shard Plan

**Current state:** 64 B_* contracts | ~57K tokens | hard limit: 60K | margin: 3K
**Trigger:** PROTO-050 (S050) — within 3K tokens of hard limit; any new contract breaches it.
**Ratified by:** OPUS-6 PROTO-050

---

## Proposed Shard Structure (by Core Spine)

| Shard File | Core Spine | Contracts | Approximate tokens |
|---|---|---|---|
| `behavioral-contracts-AI.md` | AI | B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME, B_NO_AI_IMPERSONATION, B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS, B_COGNITIVE_CONTEXT_DISCIPLINE, B_CONCEPT_LOAD, B_DEVELOPMENT_VS_PRODUCTION, B_TOKEN_BUDGET, B_AI_COLLABORATIVE_DISCIPLINE | ~12K |
| `behavioral-contracts-GVRN.md` | GVRN | B_GOVERNOR_PROMPTS, B_CONSENSUS_BEFORE_PROCEEDING, B_BOUNDARY_ALIGNMENT_PROTOCOL, B_MUTUAL_UNDERSTANDING_VALIDATION, B_TRIAD_GOVERNANCE, B_PRACE, B_INHERITANCE_POLICY, B_ZERO_NAVIGATION_FOR_GOVERNOR, B_PE_ALIGNMENT_GUARDIAN, B_PCR_FOR_DECISIONS | ~14K |
| `behavioral-contracts-ARCH.md` | ARCH | B_NO_IMPLEMENTATION_WITHOUT_PLAN, B_INTENT_CRYSTALLIZATION, B_SANDBOX_BEFORE_IMPLEMENTATION, B_APPS_ARE_TRIALS, B_CORE_SPINE_DISCIPLINE, B_TEMPLATE_FIRST_CREATION, B_GRADUAL_BUILD_BY_FOUNDATIONS, B_NAMING_POLICY, B_CONSOLIDATION_PASS, B_SAVINGS_AND_SSOT_UNIFIED | ~12K |
| `behavioral-contracts-VALD.md` | VALD | B_RZF, B_CEC, B_PRE_CLOSE_VERIFICATION, B_POSITIVE_VALUE_EXTRACTION, B_CATCH_TO_ENGRAVING, B_FIVE_SURFACE_ENGRAVING, B_STRUCTURAL_PREVENTION_DISCIPLINE, B_DONE_RIGHT_FROM_THE_START, B_DEFINITION_BEFORE_ENFORCEMENT, B_QC_AUDIT | ~10K |
| `behavioral-contracts-OPER.md` | OPER | B_INTAKE_DISCIPLINE, B_PROTOCOL_LITERAL_EXECUTION, B_HANDOFF_PRE_FLIGHT_AUDIT, B_AUTONOMOUS_BATCH_WITH_PREFLIGHT, B_HUMBLE_EXECUTOR, B_HUMBLE_EXECUTION_PIPELINE, B_CONTEXTUAL_LOCALITY, B_ZCA, B_ZERO_LAPTOP_DEPENDENCY, B_AGENT_ALIGNMENT_PROTOCOL + remaining | ~9K |

**Total after shard:** ~57K across 5 files → each file ≤14K tokens → within per-file soft limit of 40K.

---

## Migration Steps (S051)

1. **Create 5 shard files** with frontmatter + B_* sections moved by spine
2. **Update behavioral-contracts.md** to become an index: header + table of all 64 B_* with spine + shard-file link
3. **Update validate-behavioral-contract-slices.mjs** to recognize shard files
4. **Update split-behavioral-contracts.mjs** generator to produce slices from each shard file
5. **Update all cross-references** (AGENTS.md hard NOs + audit-runner.md + validate-frontmatter.mjs) to link shard files
6. **Run pnpm contracts:split** → verify all slices regenerate from shard files
7. **Gate:** `pnpm verify exit_code=0` + `validate-platform-capacity.mjs behavioral-contracts-tokens` clears soft limit

---

## Blocking Threshold

> **DO NOT add new B_* contracts to behavioral-contracts.md monolith until this shard plan is executed.**
> New B_* contracts in S051+ go directly into the appropriate shard file.
> The monolith is FROZEN for new contract additions.

---

## Why Core Spine (not chronological or alphabetical)

Core Spine sharding aligns with:
- P-ARCH-028 + B_CORE_SPINE_DISCIPLINE: every artifact maps to its governing spine
- The 5-spine precedence (GVRN>VALD>ARCH>AI>OPER) mirrors how contracts are applied
- Developers searching for AI behavior contracts look in AI spine, not in a chronological list
- Future AI tabs loading context load only the relevant spine's contract file (context efficiency)

---

## @core-seed

# @core-seed: BEHAVIORAL_CONTRACTS_SHARD | plan: behavioral-contracts-shard-plan.md | grows-to: 5 shard files replacing behavioral-contracts.md monolith | target: S051
# planted_by: S050
# pmi_gate: PROTO-050
