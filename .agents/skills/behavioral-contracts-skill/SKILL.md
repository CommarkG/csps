---
name: behavioral-contracts-skill
description: When user asks about a B_* contract OR what the AGENTS.md hard NOs are OR which discipline applies — full B_* lookup + AGENTS.md hard-NO mapping + cross-references. Triggers on "B_", "behavioral contract", "hard NO", "what discipline", "which contract", "AGENTS.md", "absolute prohibition".
allowed_tools: [Read, Grep, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-007
backed_by_contract: B_FIVE_SURFACE_ENGRAVING
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_FIVE_SURFACE_ENGRAVING
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-contract-lookup-or-hard-no-mapping
  max_tokens: 2500
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
scope_level: S1
---

# /behavioral-contracts-skill — B_* Contract Lookup

## When to invoke

- User asks "what does B_X mean?" or "show me the AGENTS.md hard NOs" or "which contract governs Y?"
- During an engraving discussion when need to verify discipline composition
- When AGENTS.md hard NO interpretation is ambiguous

## When to skip (counterweight)

If the user is actively engraving (use `/engraving-discipline` instead) OR running session protocols (use `/governance-session`), those more-specific skills win.

## Quick reference

### B_* contracts registry (26 active per S007 turn 4)

Full canonical: [behavioral-contracts.md](../../../docs/plan/pillar-0-governance/behavioral-contracts.md). Each contract has: Canonical / Counterweight / Source / Anti-patterns / 5/5 Mechanical Surfaces / Cross-references.

**Universal-required (all agents acknowledge):**
- B_AI_PROFESSIONAL_VOICE — top-expert voice; no sycophancy
- B_VALIDATE_BEFORE_ASSUME — every state-claim cites tool call

**Cognitive context (P-META-009 + extensions):**
- B_COGNITIVE_CONTEXT_DISCIPLINE — 5-layer + 4 QGs immutable
- B_TOKEN_BUDGET (S007 turn 4) — 5 operating rules R1-R5

**Engraving + ZF discipline:**
- B_FIVE_SURFACE_ENGRAVING — 5/5 atomic per FSE
- B_RZF — re-run IS the proof
- B_PRE_CLOSE_VERIFICATION — `pnpm verify` mandatory at §10.0
- B_CATCH_TO_ENGRAVING — every catch produces persistent artifact

**Communication boundaries:**
- B_MUTUAL_UNDERSTANDING_VALIDATION — every boundary closes I→I loop
- B_PROTOCOL_LITERAL_EXECUTION — execute every documented step
- B_GOVERNOR_PROMPTS — every prompt logged
- B_HANDOFF_PRE_FLIGHT_AUDIT — 9-check whole-session walk

**Decision + presentation:**
- B_PCR_FOR_DECISIONS — Pros/Cons/Recommendation 3-block
- B_ALWAYS_GIT_LINKS — clickable markdown links
- B_NO_CONFIRMATION_SEEKING — 4-condition autonomous gate

**Architecture + naming:**
- B_CORE_SPINE_DISCIPLINE — 5 spines + 3-layer doctrine
- B_NAMING_POLICY — 4 rules + ALL-during-rename
- B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK
- B_TEMPLATE_FIRST_CREATION — template registry consultation
- B_GRADUAL_BUILD_BY_FOUNDATIONS — depth ∈ {3,4,5}; per-layer ZF gate

**Governance / quality:**
- B_AGENT_ALIGNMENT_PROTOCOL — AAP 9-check per agent class
- B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS — alignment registry
- B_PE_ALIGNMENT_GUARDIAN (CONSTITUTIONAL) — anti-sycophancy structured deflection
- B_STRUCTURAL_PREVENTION_DISCIPLINE — Q-2 fix structure not instance; K=2 mandate
- B_POSITIVE_VALUE_EXTRACTION — every positive event triggers cycle
- B_ASK_WHEN_FILLING_GAPS — narrow questions for under-spec'd directives

**Operations:**
- B_ZERO_LAPTOP_DEPENDENCY — git canonical + Codespaces; auto-push at session-close
- B_INTAKE_DISCIPLINE — manual-protocol on every external input

### Hard NO map → behavioral-contracts.md sections

35+ hard NOs in [AGENTS.md](../../../AGENTS.md) map to B_* canonical sections in [behavioral-contracts.md](../../../docs/plan/pillar-0-governance/behavioral-contracts.md). When in doubt: grep AGENTS.md for the topic + follow the cited (B_X — P-Y) reference.

## Backed by

P-META-007 Five-Surface Engraving + B_FIVE_SURFACE_ENGRAVING (S002 turn 17). Each B_* contract has 5/5 mechanical surfaces (schema + validator + hook + memory + contract). Full registry: [behavioral-contracts.md](../../../docs/plan/pillar-0-governance/behavioral-contracts.md) + [ai-behavior-spine.md matrix](../../../docs/plan/pillar-0-governance/ai-behavior-spine.md).
