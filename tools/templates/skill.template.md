---
id: csps.tools.templates.skill
name: skill-template
description: Canonical template for new SKILL.md authoring at any CSPS skill location (packages/skills/<name>/SKILL.md OR .claude/skills/<name>/SKILL.md OR libs/agents/<name>/agent.zmodel week-6+). Embeds full AAP frontmatter scaffolding per B_AGENT_ALIGNMENT_PROTOCOL no-wildcards mandate (S005 turn 25 + S007 §24+ multi-location coverage amendment). Closes the "future skills mechanical alignment" gap at AUTHOR-TIME — validator catches AFTER write; this template prevents the gap at write-time. Per B_TEMPLATE_FIRST_CREATION (P-META-015) every new SKILL.md MUST cite `template_used: skill-aap` in its description.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: standard
template_grade: A  # Opus Turn 15 S026
core_spine: AI
core_spines: [AI, GVRN]
template_id: skill-aap
template_version: 1.0
applicability_trigger: |
  New SKILL.md authored at any CSPS skill-authoring location:
  - packages/skills/<name>/SKILL.md (platform skills)
  - .claude/skills/<name>/SKILL.md (Claude Code auto-load)
  - libs/agents/<name>/agent.zmodel (Mastra runtime; week-6+)
  - Any future location added via SKILL_PATHS glob expansion (per B_AGENT_ALIGNMENT_PROTOCOL §24+ procedure)
validators_atomic:
  - agent-alignment-coverage
  - skill-location-coverage-completeness
escape_hatch: |
  template_status: novel-pending-pattern-evaluation
  Promoted to stable after K=2 successful uses with no AAP-coverage failures
schema_anchor: tools_templates_meta
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S007
links:
  - { rel: parent, href: ./ }
  - { rel: target-locations, href: ../../packages/skills }
  - { rel: target-locations-claude-code, href: ../../.claude/skills }
  - { rel: discipline, href: ../../docs/plan/pillar-0-governance/agent-alignment-protocol.md }
  - { rel: validator, href: ../validators/validate-aap-frontmatter.mjs }
  - { rel: registry, href: ../../docs/plan/_handoff/VAULT/template-registry.md }
---

# SKILL.md Template — AAP-aligned (no-wildcards)

> Use this template when authoring a new SKILL.md at ANY CSPS skill location. Every Class A skill MUST embed full AAP frontmatter per B_AGENT_ALIGNMENT_PROTOCOL — non-aligned skills are wildcards that damage platform integrity. Validator [`validate-aap-frontmatter.mjs`](../validators/validate-aap-frontmatter.mjs) scans all locations in `SKILL_PATHS` glob and refuses skills with missing AAP fields.

## Required structure

```markdown
---
name: <kebab-case-skill-name>
description: When <trigger-phrase> — <what-skill-does>. Triggers on <keyword-1>, <keyword-2>, <keyword-3>. (≥3 trigger phrases for matcher accuracy per token-optimization §14.5 10-scenario test)
allowed_tools: [<list of tool names OR empty>]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: <P-XXX-NNN>
backed_by_contract: <B_XXX>
lifecycle: experimental | beta | production | deprecated
lifecycle_state: active
next_review_at: <YYYY-MM-DD>
# ─── AAP frontmatter (MANDATORY per B_AGENT_ALIGNMENT_PROTOCOL) ───
csps_aligned: true
aap_version: 1.0
agent_class: A   # A=CSPS-built skill | B=Claude-Code-builtin | C=Mastra runtime week-6+ | D=third-party imported
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE       # universal-required (every Class A minimum)
  - B_VALIDATE_BEFORE_ASSUME      # universal-required (every Class A minimum)
  # Add additional B_* contracts this skill enforces or composes with
  - <additional-B_*>
respects_quality_gates: [QG1, QG2, QG3, QG4]   # all 4 mandatory
output_contract:
  returns: <output-type-description>
  max_tokens: <N>
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned   # closed enum: quarantine | vendored | platform-owned
eval_baseline:
  test_corpus_path: tests/skills/<name>/test-fixtures.json   # planned with skill-eval-Worker
  expected_pass_rate: <0.0-1.0>
preflight_check_required: true
# ─── S010 amendment — 9-field AAP frontmatter (Phase 1: OPTIONAL warn-level; Phase 2 S012: REQUIRED error-level) ───
# Per B_AGENT_ALIGNMENT_PROTOCOL S010 amendment + EXT-20260505-002-B 9-element DNA gate.
# New SKILL.md authored S010+ SHOULD include these 2 fields immediately (OPTIONAL warn-level Phase 1).
# 16 existing SKILL.md retrofitted in S011 backfill pass; validator promotes warn → error in S012.
principle_compliance:                    # array of P-* IDs; minimum: P-META-010 + P-META-002 (universal-required)
  - P-META-010                           # AAP itself (universal-required for every Class A)
  - P-META-002                           # principles-travel-with-artifacts (universal-required)
  # - <additional P-* per skill's scope, e.g., P-META-007 for engraving-discipline / P-META-015 for template skills>
consolidation_cross_refs:                # array of artifact paths whose discipline this skill overlaps with — per B_CONSOLIDATION_PASS
  - docs/plan/pillar-0-governance/<canonical-home>.md   # cross-reference per 5-step protocol
  # - <additional paths> OR [] for genuinely-novel skills with no canonical-home overlap
---

# /<skill-name> — <one-line-description>

## When to invoke

- <trigger-context-1>
- <trigger-context-2>
- <trigger-context-3>

## When to skip (counterweight per b-star-contract template)

<1-3 sentences naming trivial-reversibles OR boundary cases that don't trigger this skill>

## Quick reference

<the on-demand content the skill loads when triggered — schema spec / discipline rules / closed-enum tables / patterns>

## Industry lineage (optional)

<external precedent if applicable; cite source>

## Backed by

<P-XXX-NNN> + <B_XXX> + <full canonical doc path>
```

## AAP fields — 9-field shape per S010 amendment

Per B_AGENT_ALIGNMENT_PROTOCOL Phase 1 (S010): 7 fields are REQUIRED (PR-blocking error if missing); 2 fields are OPTIONAL warn-level (S010 amendment — REQUIRED in Phase 2 S012 after S011 backfill).

### Phase 1 REQUIRED (error-level; missing fails PR via `agent-alignment-coverage` validator)

| Field | Purpose | Closed enum / format |
|---|---|---|
| `csps_aligned` | declares intent to comply | MUST be `true` (literal) |
| `aap_version` | AAP version used | currently `1.0` |
| `agent_class` | which class governs this | `A` \| `B` \| `C` \| `D` |
| `acknowledged_contracts` | which B_* this skill respects | array; MUST include B_AI_PROFESSIONAL_VOICE + B_VALIDATE_BEFORE_ASSUME minimum |
| `respects_quality_gates` | which CCA QGs binding | MUST include all 4: `[QG1, QG2, QG3, QG4]` |
| `output_contract` | output shape declaration | object with `returns` + `max_tokens` + `no_synthesis_outside_main` + `no_ratification_claims` |
| `trust_tier` | Quarantine→Vendored→Platform-owned tier | closed enum: `quarantine` \| `vendored` \| `platform-owned` |

### Phase 1 OPTIONAL warn-level (S010 amendment; Phase 2 S012 promotes to REQUIRED error-level)

| Field | Purpose | Format / minimum |
|---|---|---|
| `principle_compliance` | Array of P-* IDs this skill acknowledges compliance with | Array; MUST include `P-META-010` + `P-META-002` minimum (universal-required); agent-specific principles append |
| `consolidation_cross_refs` | Array of artifact paths whose discipline this skill overlaps with — per [B_CONSOLIDATION_PASS](../../docs/plan/pillar-0-governance/behavioral-contracts.md) | Array of paths (cross-references); empty `[]` valid for genuinely-novel skills |

**Phase 1 → Phase 2 trajectory:** Per [B_AGENT_ALIGNMENT_PROTOCOL S010 amendment](../../docs/plan/pillar-0-governance/behavioral-contracts.md). New SKILL.md authored S010+ should include the 2 new fields immediately (warn fires if missing); 16 existing SKILL.md retrofitted in S011 dedicated backfill pass; S012 validator promotes warn → error and 9 fields become PR-blocking.

## Universal-required acknowledged_contracts

Per AAP — every Class A skill minimum:
- `B_AI_PROFESSIONAL_VOICE` (top-expert voice; no sycophancy)
- `B_VALIDATE_BEFORE_ASSUME` (every state-claim cites tool call evidence)

Skills covering specific domains add domain-specific B_* contracts (e.g., engraving-discipline adds B_FIVE_SURFACE_ENGRAVING; pcr-rendering adds B_PCR_FOR_DECISIONS).

## Where to author

Choose location based on skill audience:

| Location | Audience | When |
|---|---|---|
| `packages/skills/<name>/SKILL.md` | Platform skills (existing 7) | When skill is bundled with codegen / MCP exposure / formal generator |
| `.claude/skills/<name>/SKILL.md` | Claude Code auto-load | When skill should auto-trigger on description-matcher in any session |
| `libs/agents/<name>/agent.zmodel` (week-6+) | Mastra runtime | When skill becomes part of agent runtime persona-composition |

**Adding a NEW location:** per B_AGENT_ALIGNMENT_PROTOCOL §24+ procedure — add path to `validate-aap-frontmatter.mjs#SKILL_PATHS` glob + update audit-runner.md + amend behavioral-contracts.md location enumeration + update AGENTS.md + atomic commit.

## Composition

Composes with B_AGENT_ALIGNMENT_PROTOCOL (P-META-010) + B_TEMPLATE_FIRST_CREATION (P-META-015 — this template IS the discovery gate) + B_FIVE_SURFACE_ENGRAVING (P-META-007 — skill authoring is Surface 5 contract per discipline) + B_STRUCTURAL_PREVENTION_DISCIPLINE (P-META-019 Q-2 — template prevents wildcard at write-time vs validator catching after).

## Existing instances (16 as of S007 §24+ post-close)

- 7 at `packages/skills/`: `pcr` / `wip-check` / `reuse-check` / `audit-self` / `batched-plan` / `learning-loop-extract` / `stewardship-review`
- 9 at `.claude/skills/`: `governance-session` / `behavioral-contracts-skill` / `engraving-discipline` / `zf-validation` / `pcr-rendering` / `cc-absorption-csps` / `slim-handoff` / `vocabulary-canon` / `swift-build`

All 16 PASS `agent-alignment-coverage` validator (S007 §24+ post-close addendum confirmed scanned=16 missing=0 aligned=16).

---

**Template signature:** `S007-AI-skill-aap-template-2026-05-05-§24++`
