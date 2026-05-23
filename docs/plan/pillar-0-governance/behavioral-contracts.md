---
id: csps.governance.behavioral-contracts
name: behavioral-contracts
description: The full-text of every B_* behavioral contract bound to AI behavior in CSPS. Each contract has a canonical wording, a counterweight clause, a mechanical-enforcement map, and anti-patterns. Companion to ai-behavior-spine.md (the matrix); this file holds the prose. Distilled from CSP carry-forwards + S002 self-audit + user directives.
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
  - { rel: spine, href: ./ai-behavior-spine.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: agents-md, href: ../../../AGENTS.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Behavioral Contracts (B_*) — Index

> **This file is now an index.** All B_* contract content has been moved to 5 spine-based shard files.
> Monolith token count was approaching the hard limit (57K/60K).
>
> **To load a specific spine's contracts:** read the shard file.
> **To load a specific contract:** read the slice at `behavioral-contracts/B_NAME.md`.
> **Split command:** `pnpm contracts:split` (reads from shard files, generates 64 slices).

---

## Shard Files

| Shard | Spine | Contracts | Approx tokens |
|---|---|---|---|
| [behavioral-contracts-GVRN.md](behavioral-contracts-GVRN.md) | GVRN | 12 | ~14K |
| [behavioral-contracts-AI.md](behavioral-contracts-AI.md) | AI | 12 | ~12K |
| [behavioral-contracts-ARCH.md](behavioral-contracts-ARCH.md) | ARCH | 12 | ~12K |
| [behavioral-contracts-VALD.md](behavioral-contracts-VALD.md) | VALD | 10 | ~10K |
| [behavioral-contracts-OPER.md](behavioral-contracts-OPER.md) | OPER | 18 | ~9K |

**Total: 64 contracts distributed across 5 files.**

---

## Contract Index

| Contract | Spine | Shard |
|---|---|---|
| [B_UX](behavioral-contracts/B_UX.md) | AI | [shard](behavioral-contracts/B_UX.md) |
| [B_AI_PROFESSIONAL_VOICE](behavioral-contracts/B_AI_PROFESSIONAL_VOICE.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK](behavioral-contracts/B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_VALIDATE_BEFORE_ASSUME](behavioral-contracts/B_VALIDATE_BEFORE_ASSUME.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_CHECK_EXISTING_DECISIONS_FIRST](behavioral-contracts/B_CHECK_EXISTING_DECISIONS_FIRST.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_ASK_WHEN_FILLING_GAPS](behavioral-contracts/B_ASK_WHEN_FILLING_GAPS.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_AUTONOMY_4_CONDITIONS](behavioral-contracts/B_AUTONOMY_4_CONDITIONS.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_CHECKPOINT_8_CATEGORIES](behavioral-contracts/B_CHECKPOINT_8_CATEGORIES.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_INTAKE_DISCIPLINE](behavioral-contracts/B_INTAKE_DISCIPLINE.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_BLOCKER_NO_SILENT_DROP](behavioral-contracts/B_BLOCKER_NO_SILENT_DROP.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_TWO_SIDED_HANDSHAKE](behavioral-contracts/B_TWO_SIDED_HANDSHAKE.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_INTENT_TO_IMPACT](behavioral-contracts/B_INTENT_TO_IMPACT.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_NO_FORCE_FIT](behavioral-contracts/B_NO_FORCE_FIT.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_RZF](behavioral-contracts/B_RZF.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_CEC](behavioral-contracts/B_CEC.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_QC_AUDIT](behavioral-contracts/B_QC_AUDIT.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_PROTOCOL_LITERAL_EXECUTION](behavioral-contracts/B_PROTOCOL_LITERAL_EXECUTION.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_CATCH_TO_ENGRAVING](behavioral-contracts/B_CATCH_TO_ENGRAVING.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_VALIDATE_BEFORE_ASSUME](behavioral-contracts/B_VALIDATE_BEFORE_ASSUME.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_FIVE_SURFACE_ENGRAVING](behavioral-contracts/B_FIVE_SURFACE_ENGRAVING.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_ALWAYS_GIT_LINKS](behavioral-contracts/B_ALWAYS_GIT_LINKS.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_PCR_FOR_DECISIONS](behavioral-contracts/B_PCR_FOR_DECISIONS.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_PRE_CLOSE_VERIFICATION](behavioral-contracts/B_PRE_CLOSE_VERIFICATION.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_POSITIVE_VALUE_EXTRACTION](behavioral-contracts/B_POSITIVE_VALUE_EXTRACTION.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_COGNITIVE_CONTEXT_DISCIPLINE](behavioral-contracts/B_COGNITIVE_CONTEXT_DISCIPLINE.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_CDAB](behavioral-contracts/B_CDAB.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_AGENT_ALIGNMENT_PROTOCOL](behavioral-contracts/B_AGENT_ALIGNMENT_PROTOCOL.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_GOVERNOR_PROMPTS](behavioral-contracts/B_GOVERNOR_PROMPTS.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_HANDOFF_PRE_FLIGHT_AUDIT](behavioral-contracts/B_HANDOFF_PRE_FLIGHT_AUDIT.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_MUTUAL_UNDERSTANDING_VALIDATION](behavioral-contracts/B_MUTUAL_UNDERSTANDING_VALIDATION.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_BOUNDARY_ALIGNMENT_PROTOCOL](behavioral-contracts/B_BOUNDARY_ALIGNMENT_PROTOCOL.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_TEMPLATE_FIRST_CREATION](behavioral-contracts/B_TEMPLATE_FIRST_CREATION.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_GRADUAL_BUILD_BY_FOUNDATIONS](behavioral-contracts/B_GRADUAL_BUILD_BY_FOUNDATIONS.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS](behavioral-contracts/B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_PE_ALIGNMENT_GUARDIAN](behavioral-contracts/B_PE_ALIGNMENT_GUARDIAN.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_STRUCTURAL_PREVENTION_DISCIPLINE](behavioral-contracts/B_STRUCTURAL_PREVENTION_DISCIPLINE.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_CORE_SPINE_DISCIPLINE](behavioral-contracts/B_CORE_SPINE_DISCIPLINE.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_ZERO_LAPTOP_DEPENDENCY](behavioral-contracts/B_ZERO_LAPTOP_DEPENDENCY.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_NAMING_POLICY](behavioral-contracts/B_NAMING_POLICY.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_TOKEN_BUDGET](behavioral-contracts/B_TOKEN_BUDGET.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_CONSOLIDATION_PASS](behavioral-contracts/B_CONSOLIDATION_PASS.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_SAVINGS_AND_SSOT_UNIFIED](behavioral-contracts/B_SAVINGS_AND_SSOT_UNIFIED.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_KNOW_HOW_DISCIPLINE](behavioral-contracts/B_KNOW_HOW_DISCIPLINE.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_AI_COLLABORATIVE_DISCIPLINE](behavioral-contracts/B_AI_COLLABORATIVE_DISCIPLINE.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_NO_AI_IMPERSONATION](behavioral-contracts/B_NO_AI_IMPERSONATION.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_CONSENSUS_BEFORE_PROCEEDING](behavioral-contracts/B_CONSENSUS_BEFORE_PROCEEDING.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_CONCEPT_LOAD](behavioral-contracts/B_CONCEPT_LOAD.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_TRIAD_GOVERNANCE](behavioral-contracts/B_TRIAD_GOVERNANCE.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_VERBATIM_HUMAN_TEXT](behavioral-contracts/B_VERBATIM_HUMAN_TEXT.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_PLATFORM_FIRST_OPTIMIZATION](behavioral-contracts/B_PLATFORM_FIRST_OPTIMIZATION.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_COMPLETION_OVER_SHINY](behavioral-contracts/B_COMPLETION_OVER_SHINY.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_DEVELOPMENT_VS_PRODUCTION](behavioral-contracts/B_DEVELOPMENT_VS_PRODUCTION.md) | AI | [shard](behavioral-contracts-AI.md) |
| [B_HUMBLE_EXECUTION_PIPELINE](behavioral-contracts/B_HUMBLE_EXECUTION_PIPELINE.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_HUMBLE_EXECUTOR](behavioral-contracts/B_HUMBLE_EXECUTOR.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_AUTONOMOUS_BATCH_WITH_PREFLIGHT](behavioral-contracts/B_AUTONOMOUS_BATCH_WITH_PREFLIGHT.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_NO_IMPLEMENTATION_WITHOUT_PLAN](behavioral-contracts/B_NO_IMPLEMENTATION_WITHOUT_PLAN.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_INTENT_CRYSTALLIZATION](behavioral-contracts/B_INTENT_CRYSTALLIZATION.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_SANDBOX_BEFORE_IMPLEMENTATION](behavioral-contracts/B_SANDBOX_BEFORE_IMPLEMENTATION.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_APPS_ARE_TRIALS](behavioral-contracts/B_APPS_ARE_TRIALS.md) | ARCH | [shard](behavioral-contracts-ARCH.md) |
| [B_CONTEXTUAL_LOCALITY](behavioral-contracts/B_CONTEXTUAL_LOCALITY.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_ZCA](behavioral-contracts/B_ZCA.md) | OPER | [shard](behavioral-contracts-OPER.md) |
| [B_DONE_RIGHT_FROM_THE_START](behavioral-contracts/B_DONE_RIGHT_FROM_THE_START.md) | VALD | [shard](behavioral-contracts-VALD.md) |
| [B_INHERITANCE_POLICY](behavioral-contracts/B_INHERITANCE_POLICY.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_PRACE](behavioral-contracts/B_PRACE.md) | GVRN | [shard](behavioral-contracts-GVRN.md) |
| [B_DEFINITION_BEFORE_ENFORCEMENT](behavioral-contracts/B_DEFINITION_BEFORE_ENFORCEMENT.md) | VALD | [shard](behavioral-contracts-VALD.md) |

---

*Sharded S051 PROTO-S051-1 Step 1. Monolith preserved in git history.*
