---
name: core-spine-expert
description: When classifying a new artifact into the correct Core Spine (GVRN/ARCH/AI/OPER/VALD) OR resolving cross-spine conflicts OR maintaining L1/L2/L3 doctrine OR checking that core_spine + schema_anchor are correct OR auditing spine precedence violations — apply the 5-spine model with GVRN>VALD>ARCH>AI>OPER precedence. Triggers on "core_spine", "which spine", "spine classification", "GVRN or ARCH", "spine conflict", "L1 sealed", "L2 domain", "L3 instances", "precedence", "spine precedence", "core spine". Never guess — consult L1_CORE sealed files and P-ARCH-028 before classifying.
allowed_tools: [Read, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-ARCH-028
backed_by_contract: B_CORE_SPINE_DISCIPLINE
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_CORE_SPINE_DISCIPLINE
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: spine-classification-with-rationale-and-cross-spines
  max_tokens: 1000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: false
principle_compliance:
  - P-META-010
  - P-META-002
  - P-ARCH-028    # csps-core-spines
consolidation_cross_refs:
  - .claude/core-spines/L1_CORE_GVRN.md
  - .claude/core-spines/L1_CORE_ARCH.md
  - .claude/core-spines/L1_CORE_AI.md
  - .claude/core-spines/L1_CORE_OPER.md
  - .claude/core-spines/L1_CORE_VALD.md
  - docs/plan/pillar-0-governance/csps-core-manifest.md
template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
scope_level: S1
batch: BATCH-C
lifecycle_state: active
template_depth: L2
parent_template: skill-base
---

# /core-spine-expert — Spine classification, doctrine, conflict resolution

## Quick classification guide

| If the artifact primarily governs... | Spine |
|---|---|
| HOW the platform is built (principles, contracts, audits) | GVRN |
| WHAT the platform is built on (schema, monorepo, templates) | ARCH |
| HOW the AI behaves during construction | AI |
| HOW operations work (Vercel, Codespaces, build order) | OPER |
| THAT things meet standards (validators, ZF, audits) | VALD |

## The precedence ordering (memorize this)
```
GVRN > VALD > ARCH > AI > OPER
```
When two spines conflict: higher-precedence spine wins. An artifact claiming GVRN spine overrides OPER spine declarations.

## How to classify correctly
1. Read the artifact's PURPOSE statement (description field)
2. Ask: which ONE concern is primary? (governance / architecture / AI-behavior / operations / validation)
3. Check: does the L1_CORE file for that spine include this concern?
4. If cross-cutting: declare primary `core_spine:` + secondary `core_spines:` array
5. Never leave core_spine empty — that's an orphan artifact

## Cross-spine classification examples
- `threshold-gate.md` → GVRN (primary: governs all inputs) + OPER (operations) + AI + VALD
- `schema-index.md` → GVRN (primary: SSoT for schemas) + ARCH (architecture)
- `validate-impl-status.mjs` → VALD (primary: validates impl quality) + GVRN (governance)
- `council-registry.md` → AI (primary: governs AI council) + GVRN + OPER

## Sealed L1_CORE files (consult before any constitutional change)
- `.claude/core-spines/L1_CORE_GVRN.md` — governance core doctrine (sealed S006)
- `.claude/core-spines/L1_CORE_ARCH.md` — architecture core doctrine (sealed S006)
- `.claude/core-spines/L1_CORE_AI.md` — AI systems core doctrine (sealed S006)
- `.claude/core-spines/L1_CORE_OPER.md` — operations core doctrine (sealed S006)
- `.claude/core-spines/L1_CORE_VALD.md` — validation core doctrine (sealed S006)


---

## Identity (SKILL-BASE compliance — S050)

- **Name:** core-spine-expert
- **Role:** When classifying a new artifact into the correct Core Spine (GVRN/ARCH/AI/OPER/VALD) OR resolving cross-spine conflicts OR maintaining L1/L2/L3 doctrine OR checking that core_spine + schema_anchor are correct OR auditing spine precedence violations — apply the 5-spine model with GVRN>VALD>ARCH>AI>OPER precedence.
- **Scope:** S1 | **Trust tier:** platform-owned

## AAP Alignment

- **B_AI_PROFESSIONAL_VOICE:** active — direct, evidence-based output, no sycophancy
- **B_VALIDATE_BEFORE_ASSUME:** active — every state claim cites tool output in current response
- **Additional contracts:** B_AI_PROFESSIONAL_VOICE, B_VALIDATE_BEFORE_ASSUME, B_CORE_SPINE_DISCIPLINE

## Input Contract

Trigger keywords defined in frontmatter description. Pre-condition: Governor/Sonnet task context loaded.

## Output Contract

returns: structured output (see frontmatter output_contract)

## ZF Requirement

Before any substantive output: name what is being examined, cite tool evidence, iterate until 0 new findings.
Exempt: trivial lookups with no actionable claims.

## Enforcement Trio

- **T1:** `.claude/hooks/pre-tool-use-skill-aap-required.sh` — validates AAP preamble before invocation
- **T2:** `validate-aap-frontmatter.mjs` — checks csps_aligned + acknowledged_contracts present
- **T3:** session-open.sh + AGENTS.md skill reference table
- **Backed by:** P-ARCH-028 + B_CORE_SPINE_DISCIPLINE
