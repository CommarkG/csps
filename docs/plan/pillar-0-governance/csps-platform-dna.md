---
id: csps.pillar-0-governance.csps-platform-dna
name: csps-platform-dna
description: Canonical formalization of CSPS Platform DNA — 13 DNA elements with definitions + canonical homes + validators + how each flows through platform processes (engrave / audit / plan-create / closing / reassessment / intake). Per S008 turn 12 user directive "formalize the focal points as core part of platform DNA + see how the DNA is involved in the platform's processes." Adapts CSP PLATFORM_DNA_INDEX.md to CSPS structure (5 spines + CSPS-native disciplines). Required pre-engraving consultation per [plan-creation-protocol.md §3 Step 2 DNA gate](./plan-creation-protocol.md).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: novel-pending-pattern-evaluation
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
session: S008
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-260"
  l3_lines: "261-end"
  read_protocol: "L1 = 13 DNA elements catalog + DNA-process integration map. L2 = per-element detail. L3 = mechanical enforcement + references."
links:
  - { rel: parent, href: ./README.md }
  - { rel: plan-creation-protocol, href: ./plan-creation-protocol.md }
  - { rel: context-loss-pains, href: ./context-loss-pains.md }
  - { rel: csp-precedent, href: ../_handoff/VAULT/contexts/governance/agent-discipline/EXT-20260505-002-B-9-element-dna-gate-triple-check-frontmatter-rigidity.md }
domain_path: platform
---

# CSPS Platform DNA — Canonical Formalization

> **Per S008 turn 12 user directive:** *"formalize the focal points as core part of platform DNA + see how the DNA is involved in the platform's processes."* This file is the canonical home for "what counts as CSPS DNA." Every governed artifact passes the DNA gate at creation (per [plan-creation-protocol.md §3 Step 2](./plan-creation-protocol.md)).

## §1 — The 13 CSPS DNA elements (canonical catalog)

| # | DNA Element | Canonical home | Validator |
|---|---|---|---|
| 1 | **vocab** (closed-enum frontmatter) | [frontmatter-closed-enums.md](./frontmatter-closed-enums.md) | `validate-frontmatter.mjs` |
| 2 | **naming** (4-rule policy) | [naming-policy.md](./naming-policy.md) | `naming-policy-compliance` (week-4) |
| 3 | **SCHEMA** (frontmatter + state machines) | [tag-status-contract.md](../_intake/tag-status-contract.md) + [frontmatter-closed-enums.md](./frontmatter-closed-enums.md) | `frontmatter_validate` + `tag-status-deep-audit` |
| 4 | **Core Spines** (5: GVRN/ARCH/AI/OPER/VALD; precedence GVRN>VALD>ARCH>AI>OPER) | `.claude/core-spines/L1_CORE_*.md` (5 files) + [P-ARCH-028](../../../packages/principles/principles.yaml) | `corespine_layer_compliance` |
| 5 | **Principles** (P-META-* / P-OP-* / P-ARCH-*) | [principles.yaml](../../../packages/principles/principles.yaml) | `principles_validate` |
| 6 | **Behavioral Contracts** (B_*) | [behavioral-contracts.md](./behavioral-contracts.md) | (PR review + ai-behavior-spine.md cross-check) |
| 7 | **Quality Gates** (QG1-QG4 immutable per CCA) | [P-META-009 + cognitive-context-architecture.md](../../../packages/principles/principles.yaml) | (per CCA discipline) |
| 8 | **Templates** (B_TEMPLATE_FIRST_CREATION) | [tools/templates/*](../../../tools/templates/) + [template-registry.md](../_handoff/VAULT/template-registry.md) | (template-registry registration) |
| 9 | **Five-Surface Engraving** (FSE — schema + validator + hook + memory + contract) | [P-META-007 + ai-behavior-spine.md](../../../packages/principles/principles.yaml) | (per-engraving 5/5 atomic check) |
| 10 | **Depth Levels** (5 semantics — file_depth_markers / depth_levels_invoked / audit_depth / depth_tier_authored / topic-plan depth_chosen) | [depth-discipline.md](./depth-discipline.md) (S009 PCR — pending; per [EXT-20260505-004-A](../_handoff/VAULT/contexts/governance/depth-discipline/EXT-20260505-004-A-four-distinct-depth-level-semantics-and-unified-principle.md)) | `depth_marker_creation_gate` (S009 stub) |
| 11 | **Priority Engine** (5-dim formula: Breadth/Depth/Impact/Blockers_now/PAS) | [gradual-build-plan.template.md §6](../../../tools/templates/gradual-build-plan.template.md) + [priority-engine.schema.yaml](../../../tools/templates/priority-engine.schema.yaml) | `priority-engine-inputs-complete` (week-4) |
| 12 | **Context-Loss Discipline** (22-pain catalog mechanically referenced from every plan) | [context-loss-pains.md](./context-loss-pains.md) (NEW S008 turn 12) | `plan-context-loss-section-present` (week-4) |
| 13 | **LAYER** (CSP_CORE / SOLUTION_<X> / MIXED — adapted from CSP) | (declared in artifact frontmatter) | (per-artifact frontmatter check) |
| 14 | **Domain Primitives** (sealed L1 functional capabilities — Calendar, Notifications, ...) | [core-primitives-registry.md](./core-primitives-registry.md) + `libs/core/` directory | `validate-core-primitive-usage.mjs` (TO BUILD Phase 1) |
| 15 | **Human Intent Crystallization** (Layer 1 → Layer 3 before implementation) | [human-intent-crystallization.md](./human-intent-crystallization.md) | `validate-intent-crystallized.mjs` |
| 16 | **Question Protocol** (questions as mandatory context preservation checkpoints at every surface — 8 types: C/A/G/R/B/Z/P/X) | [question-protocol.md](./question-protocol.md) | `validate-question-coverage.mjs` |
| 17 | **Participant-Aware Communication** (every element declares target participant type — 14 types: governor / developer.platform / developer.app / developer.api / user.solo / user.team / user.enterprise / user.trial / ai.sonnet / ai.opus / ai.haiku / ai.agent / ai.external / mixed) | [participant-protocol.md](./participant-protocol.md) | `validate-participant-declared.mjs` |

**17 elements** (Element 16 added S025 — Question Protocol: questions are the strongest context preservation tool. Element 15 added S023. Element 14 added S022.) (Element 15 added S023 — P-META-022 Human Intent Crystallization. Element 14 added S022 per Opus Core Council approval — Phase 0 proceed). Each has a canonical home. Each has a validator (active or week-4). **Plans pass through DNA gate (Step 2 of [plan-creation-protocol.md](./plan-creation-protocol.md)) confirming all 15 elements considered or explicitly N/A.**

## §2 — DNA process integration map (how DNA flows through platform)

**Per Governor S008 turn 12 directive:** *"see how the DNA is involved in the platform's processes."*

```
                    INTAKE (B_INTAKE_DISCIPLINE)
                         ↓ external content arrives
                    DNA gate (16 elements check)
                         ↓
              ┌────────────┴────────────┐
              ↓                         ↓
        ENGRAVING                   ROUTING
       (B_FIVE_SURFACE)         (route_to extractions / contexts / governor-prompts)
              ↓                         ↓
        5 surfaces atomic         tagged + status + indexed
              ↓                         ↓
              └────────────┬────────────┘
                           ↓
                    PLAN CREATION
              (plan-creation-protocol)
                           ↓
                    Step 1: precedent-check
                    Step 2: DNA gate (THIS FILE)
                    Step 3: template selection
                    Step 4: context-loss-pains checklist
                    Step 5: engraving
                           ↓
                    PLAN EXECUTION
              (per topic-plan §9 + cross-refs)
                           ↓
                    AUDIT (audit-runner / Pipeline 1-10)
                           ↓
                    REASSESSMENT (per CSPS-adapted 5 triggers)
                           ↓
                    CLOSING (B_PRE_CLOSE_VERIFICATION + HPFA)
                           ↓
                    HANDOFF (Zone A/B/C/D + chat-jump LEAN)
                           ↓
                    [next session inherits via DNA-aware handoff]
```

**Per-process DNA touch:**

| Process | DNA elements touched |
|---|---|
| **INTAKE** (B_INTAKE_DISCIPLINE) | vocab + naming + SCHEMA + Context-Loss + LAYER |
| **ENGRAVING** (FSE 5/5 atomic) | All 13 — engraving IS the platform's DNA-replication mechanism |
| **PLAN CREATION** | All 13 (Step 2 DNA gate is mandatory for ALL plans) |
| **PLAN EXECUTION** | Principles (per-step validation) + Behavioral Contracts (per-action) + Quality Gates (per-decision) + Depth Levels (per-read) + Context-Loss (per-batch) |
| **AUDIT** | Validators (per element) + SCHEMA (per artifact) + Naming + Vocab |
| **REASSESSMENT** | Priority Engine (re-fire) + Principles (re-rank) + Templates (re-validate) |
| **CLOSING** | All 13 (HPFA 9-check verifies coverage) |
| **HANDOFF** | All 13 (Zone D §17 attestation cites every DNA element) |

**Why this matters:** without explicit DNA-process map, platform processes drift independently. With this map, every process is DNA-anchored — drift detected at boundary; mechanical enforcement composes.

## §3 — The DNA gate (per plan-creation-protocol.md Step 2)

When authoring a plan / engraving / artifact:

```yaml
dna_gate:
  consulted: docs/plan/pillar-0-governance/csps-platform-dna.md
  elements_checked:
    - vocab: <frontmatter closed-enum compliance verified>
    - naming: <4-rule policy followed>
    - SCHEMA: <required frontmatter fields present>
    - core_spine: <primary spine declared>
    - principles: <relevant P-* principles cited>
    - behavioral_contracts: <relevant B_* contracts cited>
    - quality_gates: <QG1-QG4 respected>
    - templates: <template_used field present>
    - five_surface_engraving: <if engraving, 5/5 atomic compliance>
    - depth_levels: <relevant depth markers declared>
    - priority_engine: <PE inputs declared if multi-session>
    - context_loss_discipline: <PAIN-* IDs cited from context-loss-pains.md>
    - layer: <CSP_CORE / SOLUTION_<X> / MIXED declared>
  not_applicable_with_reason:
    - <element>: <reason>
```

**Validator** `dna-gate-coverage` (week-4) audits every governed artifact has DNA gate evidence in frontmatter or §X header. **Pre-runtime:** AI manually applies.

## §4 — DNA element addition / amendment

**Adding a new DNA element:**

1. **Trigger:** K=2 emergence — element appears as load-bearing in 2+ artifacts without canonical home
2. **PCR-required:** Governor ratification (constitutional change to DNA = high-blast)
3. **Append to §1 catalog** with element + canonical home + validator
4. **Update §2 process map** showing how element flows through processes
5. **Update [plan-creation-protocol.md Step 2](./plan-creation-protocol.md)** with new element
6. **5/5 atomic engraving** per B_FIVE_SURFACE_ENGRAVING

**Example:** S008 turn 12 ADDED Element 12 (Context-Loss Discipline) — emerged across CSP files #2 + #6 + multiple memory entries; Governor ratified via S008 GP-S008-10 directive; canonical home authored same-batch (context-loss-pains.md).

**Amending an existing DNA element:**

1. **Trigger:** definition refinement OR canonical-home migration OR validator change
2. **PCR for non-trivial:** per B_PCR_FOR_DECISIONS
3. **Update §1 catalog row + §2 process map row + composition**
4. **Audit ripple:** validators that consumed prior definition need re-verification

## §5 — Composition with prior CSP DNA + CSPS history

**CSP precedent:** [PLATFORM_DNA_INDEX.md](https://github.com/CommarkG/core-sights-platform/blob/main/.claudecode/PLATFORM_DNA_INDEX.md) declares 9 DNA elements (vocab / naming / SCHEMA / core_spines / spheres-RETIRED / pillars / principles / depth_levels / PE) + LAYER bonus 10th.

**CSPS adaptation:**
- **Adopted from CSP:** vocab / naming / SCHEMA / core_spines / principles / depth_levels / PE / LAYER (8 of 9; spheres-RETIRED N/A — CSPS doesn't have spheres concept)
- **CSPS-native additions:** Behavioral Contracts (B_*) + Quality Gates (QG1-QG4 immutable) + Templates (B_TEMPLATE_FIRST_CREATION) + Five-Surface Engraving (FSE) + Context-Loss Discipline (NEW S008 turn 12)
- **CSPS-deferred:** pillars (CSP has 4: CONTEXT/GOVERNANCE/TIMING/INTEGRITY; CSPS uses 5-spine system instead per [EXT-20260505-001-F](../_handoff/VAULT/contexts/governance/token-optimization/EXT-20260505-001-F-80-10-10-session-rule-and-pillar-balance.md) — defer pillar-layer until ADR-0025 CNST/GVRN split ratifies)

**Total CSPS:** 13 DNA elements (vs CSP 9+1) — richer because CSPS includes operational disciplines (B_* / QG / Templates / FSE / Context-Loss) that CSP keeps separate.

## §6 — Mechanical enforcement summary

| DNA Element | Validator | Status | Activation |
|---|---|---|---|
| 1 vocab | `validate-frontmatter.mjs` | ACTIVE | pnpm verify |
| 2 naming | `naming-policy-compliance` | STUB | week-4 |
| 3 SCHEMA | `frontmatter_validate` + `tag-status-deep-audit` | ACTIVE / STUB | pnpm verify / cron weekly |
| 4 Core Spines | `corespine_layer_compliance` | STUB | week-4 |
| 5 Principles | `principles_validate` | ACTIVE | pnpm verify |
| 6 Behavioral Contracts | (PR review) | MANUAL | per-PR |
| 7 Quality Gates | (per CCA discipline) | MANUAL + memory | continuous |
| 8 Templates | (template-registry registration) | MANUAL | per-authoring |
| 9 FSE | (per-engraving 5/5 check) | MANUAL | per-engraving |
| 10 Depth Levels | `depth_marker_creation_gate` | STUB (S009) | week-4 |
| 11 Priority Engine | `priority-engine-inputs-complete` | STUB | week-4 |
| 12 Context-Loss | `plan-context-loss-section-present` | STUB | week-4 |
| 13 LAYER | (frontmatter check) | STUB | week-4 |

**Active today:** 7 of 17 elements have running validators (vocab / SCHEMA / principles + AAP coverage + Intent Crystallization + Question Protocol + Participant-Aware Communication).
**Week-4 ratchet:** 6 STUB validators activate.
**Manual layer:** Behavioral Contracts + Quality Gates + Templates + FSE + DNA-gate continuous AI discipline.

## §6b — Application evidence per element (S027)

> **What proves each element was APPLIED, not just acknowledged.**
> Source: dna-protocol §5a mandate. Validates that DNA gate is evidence-based, not checklist-based.
> Enforced by: `validate-dna-evidence.mjs` (checks this section is present + non-empty per element)

| # | DNA Element | Observable application evidence |
|---|---|---|
| 1 | **vocab** | `validate-frontmatter.mjs` in pnpm verify exits 0; all closed-enum fields in committed artifacts use exact enum values |
| 2 | **naming** | All new artifacts in current session match kebab-case filenames; `pre-tool-use-frontmatter-enum-check.sh` fires without violations |
| 3 | **SCHEMA** | `validate-frontmatter.mjs` PASS on every artifact; zero `lifecycle_state: draft` in production files; `tag-status-deep-audit` cron clean |
| 4 | **Core Spines** | Every new artifact has `core_spine:` in frontmatter; `corespine_layer_compliance` advisory shows 0 blocking; L1 sealed files unmodified |
| 5 | **Principles** | `validate-principle-count-staleness.mjs` PASS; `principles.yaml` total_count matches slice count; new P-* registered before use |
| 6 | **Behavioral Contracts** | `validate-behavioral-contract-slices.mjs` PASS; no new B_* invoked without registration; post-stop-banned-phrase.sh exits clean |
| 7 | **Quality Gates** | QG1 maintained (hard reasoning in main); QG2 maintained (synthesis in main); QG3 respected (re-read edited files); QG4 respected (cache invalidated on change) |
| 8 | **Templates** | `validate-template-grade.mjs` PASS; new artifacts use `template_used:` field; template-registry.md consulted before authoring |
| 9 | **FSE** | Every engraving in the session touches 5/5 surfaces (schema + validator + hook + memory + contract); CEC trigger fires on every methodology edit |
| 10 | **Depth Levels** | `file_depth_markers:` present in L2+ governance artifacts; `depth_tier:` declared in plans; no L3 artifacts lacking L1 declaration |
| 11 | **Priority Engine** | `validate-pe-dashboard.mjs` PASS; session work executed in PE-score order; lower-PE items vaulted to raw-thoughts-queue with trigger |
| 12 | **Context-Loss** | Plans have `question_register:` field; PAIN-* IDs cited in plans; `validate-question-coverage.mjs` exits 0 |
| 13 | **LAYER** | All apps in `apps/` declare `domain_path`; no cross-layer imports (libs/ → apps/ blocked); `validate-core-seeds.mjs` shows no overdue seeds |
| 14 | **Domain Primitives** | `apps/` import from `libs/` not from each other; no `new PrismaClient` in routes; `validate-bottleneck-patterns.mjs` Class A advisory count tracked |
| 15 | **Human Intent Crystallization** | `validate-intent-crystallized.mjs` PASS; `intent_crystallized: true` in active deep_quality plans; `threshold_route:` declared |
| 16 | **Question Protocol** | `validate-question-coverage.mjs` PASS; topic-plans have `question_register:`; `validate-crystallization-bypass.mjs` exits 0 |
| 17 | **Participant-Aware** | `validate-participant-declared.mjs` PASS; new artifacts have `audience:` tag; PACP DNA-17 participant type declared in plans |

**Application evidence validator:** `validate-dna-evidence.mjs` — checks this §6b table is present, has 17 rows, and each row's evidence column is non-empty. ADVISORY Phase 1; BLOCKING Phase 2 (after K=2 promotion). PE=67 S027.

## §7 — References

- [plan-creation-protocol.md](./plan-creation-protocol.md) — Step 2 DNA gate consults this file
- [context-loss-pains.md](./context-loss-pains.md) — Element 12 canonical home
- [behavioral-contracts.md](./behavioral-contracts.md) — Element 6 canonical home
- [principles.yaml](../../../packages/principles/principles.yaml) — Element 5 canonical home
- [frontmatter-closed-enums.md](./frontmatter-closed-enums.md) — Elements 1 + 3 canonical home
- [tag-status-contract.md](../_intake/tag-status-contract.md) — Element 3 canonical home
- [tools/templates/](../../../tools/templates/) — Element 8 canonical home
- [.claude/core-spines/L1_CORE_*.md](../../../.claude/core-spines/) — Element 4 canonical home (5 files)
- [INDEX.md](../_handoff/VAULT/contexts/INDEX.md) — extraction notes available for usage
- [EXT-20260505-002-B](../_handoff/VAULT/contexts/governance/agent-discipline/EXT-20260505-002-B-9-element-dna-gate-triple-check-frontmatter-rigidity.md) — CSP 9-element DNA gate precedent

**CSPS DNA signature:** `S008-AI-csps-platform-dna-v1.0-2026-05-05`
