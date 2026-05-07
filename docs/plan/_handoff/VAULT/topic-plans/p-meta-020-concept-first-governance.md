---
id: csps.handoff.vault.topic-plan.p-meta-020-concept-first-governance
name: p-meta-020-concept-first-governance
description: Topic-plan for P-META-020 (Concept-First Governance). Introduces the methodology where context is the primary navigation tool and rigid elements (contracts, validators, hooks) serve as reference samples that validate conceptual alignment — not as the primary definition of correct behavior. Depth-3 plan with 3 atomic phases. Resolves the fundamental tension between rigid enforcement and context-driven AI navigation that was identified in S014.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: GVRN
core_spines: [GVRN, AI, VALD]
schema_anchor: topic_plans
tags:
  - domain:governance
  - domain:ai
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
know_how_consulted: true
session: S014
alignment_verified_session: S015
topic_id: p-meta-020-concept-first-governance
priority_score: 98
priority_band: 1
depth_chosen: 3
depth_rationale: |
  Depth-3 (not 4/5): the methodology is conceptually novel but structurally
  maps directly onto existing CSPS architecture (Core Spines L1/L2/L3,
  The Threshold, CCA). No novel infrastructure required — only framing +
  wiring + backfill. Three natural phases: canonical anchor (L1) →
  wiring existing artifacts (L2) → backfill + validation (L3).
multi_session_arc: [S014, S015]
covered_paths: []
backtrack_register:
  - trigger-id: p-meta-020-contradicts-p-meta-017
    action: if framing conflict surfaces, explicitly declare P-META-020 as parent frame of P-META-017 in cross_references; P-META-017 statement stays unchanged
  - trigger-id: concept-load-duplicates-cca-layer-1
    action: clarify scope boundary — CCA Layer 1 is session-level constitution; Threshold Step 0 is per-input domain selection; document both in concept-first-governance.md
  - trigger-id: drift-signal-naming-collision
    action: rename any new field to conceptual_sample_of — not drift_signal (existing platform term)
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../../../../../packages/principles/principles.yaml }
  - { rel: composes-with, href: ./p-meta-017-inner-defaults.md }
  - { rel: threshold, href: ../../../../pillar-0-governance/threshold-gate-v2.md }
  - { rel: cca, href: ../../../../pillar-0-governance/cognitive-context-architecture.md }
  - { rel: l1-ai, href: ../../../../../.claude/core-spines/L1_CORE_AI.md }
  - { rel: drift-log, href: ../inner-ai-defaults/continuous-drift-log.md }
  - { rel: master-roadmap, href: ../csps-master-roadmap-s014-plus.md }
---

# Topic-Plan — P-META-020 Concept-First Governance (depth-3)

## §Background — The Problem This Solves

### The fundamental tension

CSPS has been building governance artifacts correctly: validators, behavioral contracts, hooks, Core Spine doctrine. But the enforcement model has been implicitly rule-first: AI output is measured against whether specific rules were followed. When a rule fires → fix the violation. When a new case appears that no rule covers → add a rule.

This produces an endless growth problem. Every new specific case adds a new rule. The rule set grows without bound. At scale (30 apps, 100 tenants, multiple AI model versions) it creates:
- Bottlenecks: every action blocks on all validators
- Overload: O(validators × changes) overhead
- Never-complete: the rule set is always catching up, never ahead

### The insight

Rules are finite. Specific cases are infinite. The rule set cannot enumerate all future situations correctly.

But **contextual understanding of the underlying concept** can navigate new situations without pre-enumerated rules — because it reasons from the concept, not from the rule list.

The correct model: **context is the primary navigation tool. Rigid elements (validators, contracts, hooks) are reference SAMPLES that tell you whether the concept is being honored — not the definition of what's correct.**

When a validator fails, the correct diagnostic is not "fix the rule violation." It is: "my understanding of the underlying concept drifted — re-examine the L2 domain this validator samples."

### Why existing CSPS architecture is the answer

The Core Spine structure already encodes this methodology without naming it:

```
L1 (sealed doctrine)   = THE CONCEPT ITSELF
L2 (domain doctrine)   = HOW THE CONCEPT APPLIES IN A DOMAIN
L3 (instances)         = WHERE THE CONCEPT MANIFESTS (validators, contracts, rules)
```

L3 failure → L2 drift? → L1 concept intact?

This was the INTENDED diagnostic path all along. It was never explicitly stated as the navigation methodology. P-META-020 names it, wires it to The Threshold, and makes it the governing methodology for all AI behavior in CSPS.

---

## §KH Know-How Consultation

**1. Duplication check:** Full scan in S014 confirmed no existing principle covers this framing. P-META-017 (inner-defaults override) is RELATED but addresses the override MAP, not the navigation METHODOLOGY. P-META-020 is the parent frame; P-META-017 is one application of it.

**2. Naming collision:** `drift_signal` already has specific meaning (schema state bypass). New field: `conceptual_sample_of`. Safe.

**3. Scope boundary:** CCA Layer 1 (session-level constitutional load) and Threshold Step 0 (per-input domain selection) address different granularities. Both needed; neither duplicates the other.

**4. P-META-020 frames, not replaces P-META-017.** P-META-017 statement stays unchanged. Cross_references updated.

**5. No new infrastructure required.** The Threshold, Core Spines, CCA, inner-ai-defaults registry all exist. This plan wires and reframes.

---

## §1 — Level 1: Canonical Anchor (Tier 1 — atomic)

**Goal:** Three artifacts that make P-META-020 real and referenceable. Can't be done piecemeal — all three in one commit.

| Artifact | Action |
|---|---|
| `packages/principles/principles.yaml` | Add P-META-020 with full statement, counterweight, cross_references to P-META-017/018/019 |
| `docs/plan/pillar-0-governance/concept-first-governance.md` | Author methodology doc: the concept-compass model, L1/L2/L3 diagnostic path, CONCEPT_LOAD at Threshold, reference sampling vs rule enforcement, composition with all P-META-01x |
| `docs/plan/pillar-0-governance/threshold-gate-v2.md` | Add CONCEPT_LOAD as Step 0 of the 8-step pipeline; define scope boundary vs CCA Layer 1 |

**After L1:** Run `pnpm principles:codegen` → AGENTS.md regenerates with P-META-020 included.

**L1 Exit Criteria:**
- [x] P-META-020 in principles.yaml with valid schema (54 principles total — commit f8189d5)
- [x] concept-first-governance.md exists with §Background + methodology + composition map
- [x] threshold-gate-v2.md PREAMBLE added with CCA Layer 1 scope boundary defined
- [x] `pnpm principles:codegen` succeeds — 54 principles split + codegen PASS
- [x] pnpm verify exit_code 0

---

## §2 — Level 2: Wiring (Tier 2)

**Goal:** Existing artifacts updated to carry the new methodology's language. Each update is additive — no existing content removed.

| Artifact | Action |
|---|---|
| `tools/templates/b-star-contract.template.md` | Add optional `conceptual_sample_of:` field pointing to the L2 domain the contract samples |
| `docs/plan/pillar-0-governance/audit-runner.md` + split | Add `conceptual_sample_of` column to validator table (which L2 domain does this validator sample?) |
| `docs/plan/_handoff/VAULT/inner-ai-defaults/README.md` | Reframe: "calibration instrument for concept alignment" not "override gate"; update per-entry schema to add `concept_ref:` |
| `docs/plan/pillar-0-governance/audit-hub.md` | Add CONCEPT_LOAD as prerequisite step in Pipeline 1 description |
| `docs/plan/pillar-0-governance/behavioral-contracts/B_INTENT_TO_IMPACT.md` | Add `cross_references: [P-META-020]` — composes via intent = the concept; impact = whether concept was honored |

**L2 Exit Criteria:**
- [ ] b-star-contract template carries `conceptual_sample_of:` field (optional)
- [ ] audit-runner.md has `conceptual_sample_of` column for ≥5 high-value validators (rest deferred to L3)
- [ ] inner-ai-defaults README reframed as calibration instrument
- [ ] audit-hub.md Pipeline 1 references CONCEPT_LOAD step 0
- [ ] pnpm verify exit_code 0 (after audit-runner split regenerated)

---

## §3 — Level 3: Backfill + Validation

**Goal:** All existing artifacts backfilled; mechanical validator built to enforce going forward.

| Artifact | Action |
|---|---|
| All 43 B_* contracts | Backfill `conceptual_sample_of:` pointing to parent L2 domain |
| All validators in audit-runner.md (~34) | Backfill `conceptual_sample_of` column |
| 5 L2 domain files | Add `conceptual_anchor:` FK to their L1 parent |
| `tools/validators/validate-open-plan-levels.mjs` | NEW — reads all active topic plans, surfaces levels with incomplete exit criteria as warnings in pnpm verify |
| Post-implementation re-assessment discipline | NEW — after any commit that closes a plan level, force PE re-evaluation before proposing next step |
| Closing summary template | Add §10.0k — "Conceptual alignment check: any L3 failures that indicated L2/L1 drift?" |

**L3 Exit Criteria:**
- [ ] All 43 contracts have `conceptual_sample_of:` populated
- [ ] All validators in audit-runner.md have `conceptual_sample_of` populated
- [x] validate-open-plan-levels.mjs in pnpm verify, exit 0
- [ ] Post-implementation re-assessment in CLAUDE.md instruction
- [ ] Closing summary template updated
- [ ] pnpm verify exit_code 0

---

## §6 Priority Engine

```yaml
priority_engine:
  topic_id: p-meta-020-concept-first-governance
  depth_chosen: 3
  inputs_per_level:
    L1_canonical_anchor:
      breadth: 3     # 3 artifacts, tightly coupled
      depth: 9       # novel methodology; every word must be precise
      impact: 10     # frames ALL future governance work
      dep_satisfied: 1  # no blockers — everything needed exists
      multi_session_cost: 0.5
      priority_score: 98
    L2_wiring:
      breadth: 5     # 5 artifacts, additive
      depth: 5       # mechanical updates — no new concepts
      impact: 8      # makes methodology visible in daily tooling
      dep_satisfied: 0  # depends on L1
      multi_session_cost: 0.5
      priority_score: 88
    L3_backfill:
      breadth: 80    # 43 contracts + 34 validators + 3 new tools
      depth: 3       # mechanical backfill + new validator
      impact: 7      # completes the coverage
      dep_satisfied: 0  # depends on L2
      multi_session_cost: 2.0
      priority_score: 75
```
