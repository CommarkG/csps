---
id: csps.handoff.vault.csps-master-plan-s025-plus
name: csps-master-plan-s025-plus
description: >
  The single comprehensive reference for all CSPS pending work from S025 onward.
  PE-scored, session-mapped, full context on every work item.
  Supersedes csps-master-roadmap-s014-plus.md (stale at S014).
  Integrates: opus-advisory-arc-S023.md enterprise arc + all S024 post-close work
  + 15 floating elements registry + PE dashboard architecture + Budget Planner arc.
  Governor directive S024: "have everything planned placed within the multi-session
  plan in full details and with full context."
  Open this at every session start. PE ordering IS the work sequence.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: vault_files
domain_path: platform
depth_chosen: 5
depth_rationale: |
  Depth-5: constitutional. Covers all 5 Core Spines, all pending sessions S025-S035+,
  the full platform roadmap from governance to app generation to scale. This is the
  enterprise arc document — every future session operates within it.
priority_score: 99
priority_band: 1
session: S024
impl_status: swift-implemented
execution_mode: deep_quality
know_how_consulted: true
intent_crystallized: true
intent_crystallized_at: "S024 Governor directive 2026-05-12"
goal_statement: >
  A single PE-ordered master plan that covers every pending work item across all
  active plans, with full context, so any session can open this file and know
  exactly what to do next — without depending on the Governor remembering or the
  AI guessing.
done_criteria:
  - "Every open work item has a PE score, session target, exit criteria, and plan reference"
  - "The 15 floating elements are each connected to a plan and a session"
  - "PE dashboard (validate-pe-dashboard.mjs) is built and wired"
  - "This file is updated at every session close with completions and new items"
  - "pnpm verify exit_code=0"
failure_signal: >
  A session starts without reading this file. OR a new work item is created
  without a PE score and session target. OR the floating elements list grows
  without items being resolved.
links:
  - { rel: enterprise-arc, href: ./topic-plans/opus-advisory-arc-S023.md }
  - { rel: budget-planner, href: ./topic-plans/budget-planner-app2.md }
  - { rel: threshold-plan, href: ./topic-plans/threshold-and-p-meta-023-s025.md }
  - { rel: supersedes, href: ./csps-master-roadmap-s014-plus.md }
  - { rel: session-state, href: ../../../../tools/session-state.json }
  - { rel: pe-schema, href: ../../../../tools/templates/priority-engine.schema.yaml }
  - { rel: open-plan-levels, href: ../../../../tools/validators/validate-open-plan-levels.mjs }
---

# CSPS Master Plan — S025+

> **OPEN THIS AT EVERY SESSION START.**
> PE ordering is the work sequence. Item 1 is always what to do first.
> Update §5 (completions) and §3 (new items) at every session close.
> Never build without a PE score and session target. Never float an element.

---

## §0 — Platform State at S024 Close

**Validators:** 75 active | **Hooks:** 21 (20 declared + pre-tool-use-agent-alignment.sh new)
**pnpm verify:** exit_code=0 | **ZF Level 3:** ZF ACHIEVED (5 cycles, 1 advisory deferred S025)
**Last commit:** c4c7ff1 (PE-connected plans + Opus Turn 8 absorption)
**Open plan items:** 132 across 19 plans

**Foundation gates MET (App #2 can start):**
- [x] P-META-022 Tier 1 active (S024)
- [x] libs/ gate BLOCKING for new files (S024)
- [x] apps/template/ complete (22/22 bedrock items)
- [x] personal.finance WizardTemplate in routing.config.ts (S025 DONE)
- [x] apps/budget-planner/ forked from template (S025 DONE)
- [ ] Threshold Wizard UI design (Option B confirmed; UI spec needed S026)

**Platform governance maturity (S025 close):**
- Validators: 79 active (was 67 at S022)
- DNA elements: 16 (Element 16 = Question Protocol, S025)
- Enforcement ratio: ~42% active blocking / 58% advisory → target 70/30 by S030
- Floating elements: 15 → 12 resolved in S024-S025 (see §6)
- PE connectivity: validate-pe-dashboard.mjs ACTIVE (S025 DONE)
- Moat coverage: 18/18 (M-18 closed S025)
- DNA Protocol: dna-protocol-making-sure-that.md created S025

---

## §1 — The Governing Methodology (P-META-020 + P-META-022 + P-META-023)

Every work item in this plan enters through the Threshold intake protocol:
- **L1 expression** → scan against 26-item checklist → fill gaps → **5-item agreement** → plan
- **No implementation** before goal_statement + done_criteria + failure_signal (human-authored)
- **PE score** placed before first commit

Three composing principles:
- **P-META-020** (Concept-First) — context is the compass; enforce after understanding
- **P-META-022** (Human Intent Crystallization) — initial expression ≠ deep intent; probe before acting
- **P-META-023** (I→VI Discipline, CONDITIONAL) — 26-item checklist across 42 communication surfaces

The PE formula: `PE = (B×0.30) + (D×0.30) + (I×0.15) + (Bn×0.10) + (PAS×0.15)`
Where: B=blast_radius, D=dependency_significance, I=impact, Bn=blockers_now, PAS=platform_alignment

---

## §2 — Master PE-Ordered Work Queue (All Items, All Plans)

### BAND 1 — CRITICAL (PE ≥ 80) — Do these before anything else

| PE | Item | Plan | Session | Exit criteria |
|---|---|---|---|---|
| **99** | This document (csps-master-plan-s025-plus.md) — the reference | THIS FILE | S024 | Updated at every session close |
| **95** | validate-pe-dashboard.mjs — auto PE priority queue | threshold-and-p-meta-023-s025.md | S025 first | Outputs sorted PE queue; wired to session-open.sh; exit_code=0 |
| **90** | session-open.sh → inject PE top-5 at every session start | threshold plan | S025 | PE top-5 visible within 5 seconds of session open |
| **82** | Budget Planner Layer 1 — personal.finance WizardTemplate + fork | budget-planner-app2.md | S025 | apps/budget-planner/ exists; pnpm build passes |
| **80** | plan-creation-protocol.md Step 0a → full 9-step flow | threshold plan | S025 | Step 0a reflects complete coaching protocol; validate-intake passes |

### BAND 2 — HIGH (PE 65-79) — In every session until done

| PE | Item | Plan | Session | Exit criteria |
|---|---|---|---|---|
| **78** | Budget Planner Layer 2 — schema + CRUD | budget-planner-app2.md | S026 | BudgetCategory + Transaction in schema.zmodel; API routes; validate-foundation-schema-drift=0 |
| **76** | failure_signal field — frontmatter-closed-enums + P-META-022 Tier 2 | threshold plan | S025 | failure_signal: in closed enum; advisory check in validate-intent-crystallized.mjs |
| **74** | P-META-022 Tier 2 items 12-16 — wizard template + gradual-build + B_INTENT_CRYSTALLIZATION | opus-advisory-arc-S023.md STREAM 2 | S025 | All 5 items from p-meta-022-alignment-plan.md Tier 2 done; pnpm verify clean |
| **73** | threshold_intake_level + threshold_participants → frontmatter-closed-enums.md | threshold plan | S025 | Fields in closed enum; validate-frontmatter passes for new plans using them |
| **71** | Opus Turn 9 — send full 26+42 to Opus for SEALED P-META-023 ratification | threshold plan | S025 | Opus Turn 9 response received; SEALED verdict OR new conditionals |
| **70** | Budget Planner Layer 3 — Threshold Wizard onboarding | budget-planner-app2.md | S026-S027 | 3 crystallization questions; non-skippable gate; budget_goal stored in profile |
| **68** | Advisory→blocking: validate-intent-crystallized (S023+ plans) | threshold plan | S025 | S023+ deep_quality plans without intent_crystallized = BLOCKING exit 1 |
| **67** | B_THRESHOLD_INTAKE_PROTOCOL behavioral contract | threshold plan | S025 (after Opus seal) | Contract body in behavioral-contracts.md; slices synced; verify clean |

### BAND 3 — STANDARD (PE 45-64) — Schedule these

| PE | Item | Plan | Session | Exit criteria |
|---|---|---|---|---|
| **63** | threshold-intake-protocol.md Refinements 2-5 | threshold plan | S025 (after Opus Turn 9) | All 5 Opus refinements applied; hierarchy + layer mapping + surface gate + 26+42 |
| **62** | P-META-023 in principles.yaml | threshold plan | S025 (after SEALED) | Entry present; slice synced; total_count=57 |
| **60** | validate-threshold-intake.mjs — advisory validator | threshold plan | S025 | Runs in pnpm verify; checks 5-item agreement in S023+ plans; exit_code=0 |
| **58** | Budget Planner Layer 4 — full validation + cold-start test | budget-planner-app2.md | S027-S028 | pnpm verify 0; cold-start works; tenant isolation adversarial test passes |
| **56** | B_BOUNDARY_ALIGNMENT_PROTOCOL Phase 2 — Type C (MCP/API pre-call) | threshold plan | S026 | pre-tool-use-mcp-alignment.sh advisory; Type C UNDERSTANDING BLOCK standard |
| **55** | B_BOUNDARY_ALIGNMENT_PROTOCOL Phase 2 — Type D (chat-jump) | threshold plan | S026 | validate-handoff-alignment.mjs advisory; HANDOFF Zone D checklist enforced |
| **54** | Advisory→blocking: validate-routing-declared (S023+ plans) | threshold plan | S025-S026 | Plans missing threshold_route = BLOCKING for new S023+ plans |
| **52** | Governance artifact creation gate — pre-tool-use for docs/plan/pillar-*/ | threshold plan | S026 | Hook advisory-blocks Write to docs/plan/pillar-*/ without covering plan |
| **50** | B_INTENT_TO_IMPACT — enforcement | THIS PLAN §6 | S026 | pending: and impact: fields in closing-summary; validate-intent-to-impact.mjs advisory |
| **50** | Advisory→blocking: validate-boundary-alignment (Type B Agent calls) | threshold plan | S026 (week-4) | Agent() calls missing UNDERSTANDING BLOCK = BLOCKING exit 1 |
| **48** | validate-pe-dashboard.mjs — connect depth_chosen to D dimension | THIS PLAN | S026 | depth_chosen: 3 → D≤5; depth_chosen: 5 → D≥7 in auto-compute |
| **47** | validate-pe-dashboard.mjs — connect ZF gate status to Bn dimension | THIS PLAN | S026 | Open plan gate = Bn≥8 in auto-compute |
| **45** | Dynamic pillar hub files — 6 pillar _hub.md files | THIS PLAN | S027 | Each pillar has _hub.md listing schema entities + plan coverage + impl_status |

### BAND 3b — DNA Protocol Items (PE 55-72) — Governor directive S025

| **PE** | **Item** | **Plan** | **Session** | **Exit criteria** |
|---|---|---|---|---|
| **72** | question_register mandatory in plan frontmatter | dna-protocol §1 | S026 | validate-question-coverage.mjs Phase 2: blocking for S025+ plans |
| **71** | tools/health-check.mjs — unified platform health dashboard | dna-protocol §11 | S026 | `pnpm health` shows moat + enforcement rate + PE top-5 + ZF status |
| **70** | Plan split trigger — validate-gradual-bundling.mjs extension | dna-protocol §4 | S026 | Plans with >12 open items AND depth-5 get advisory: consider forking |
| **68** | depth_tier field for governance artifacts (L1/L2/L3) | dna-protocol §2 | S026 | frontmatter-closed-enums.md addition; validate-frontmatter checks |
| **68** | validate-dead-links.mjs — broken href detector (BLOCKING) | dna-protocol §5b | S026 | All links: href values resolve to real files |
| **67** | DNA application evidence per element | dna-protocol §5a | S026 | validate-universal-alignment.mjs: application_evidence field |
| **67** | diataxis_type mandatory for governance artifacts | dna-protocol §7 | S026 | validate-frontmatter.mjs enforces for pillar-0-governance/ |
| **65** | validate-bottleneck-patterns.mjs | dna-protocol §3 | S027 | Serial tool chains + oversized plans + overload patterns detected |
| **63** | validate-spine-hierarchy.mjs | dna-protocol §6 | S027 | L3 instances cannot contradict L1 sealed definitions |
| **60** | inner-ai-defaults enforcement rate → 70% target | dna-protocol §9 | S026-S028 | Track A + B closes rate from ~50% to 70% |
| **59** | reasoning-join-forces entry in reasoning-patterns.md | dna-protocol §9 | S026 | AI reasoning + CSPS context as complementary — override suppress-AI anti-pattern |
| **58** | validate-template-coverage.mjs | dna-protocol §8 | S026 | K=2 auto-promotes to template creation; artifact types with registered templates |
| **55** | North Star = C+Z question pair declared per element | dna-protocol §10 | S025 | question-protocol.md amendment |
| **55** | B_SPLIT_THRESHOLD_DISCIPLINE behavioral contract | dna-protocol §4 | S026 | Defines when to fork a sub-plan (>12 items + depth-5) |

### BAND 4 — VAULTED (PE < 45) — Await their trigger

| PE | Item | Plan | Trigger | Context |
|---|---|---|---|---|
| 43 | App #3 domain decision | opus-advisory-arc-S023.md | App #2 Layer 4 complete | Same Threshold intake + PE process as App #2 |
| 42 | Core Spines Option B — Sonnet council routing | opus-advisory-arc-S023.md STREAM 5 | Opus ripple analysis complete | Reshape spine routing from single to multi; Opus Turn 7 says wait |
| 40 | Threshold Wizard full reusable UI component | opus-advisory-arc-S023.md STREAM 7 | Budget Planner proves concept | Extract from Budget Planner → platform primitive |
| 38 | WisdomVault — cross-domain intelligence | opus-advisory-arc-S023.md STREAM 9 | 3+ apps generating data | S035+ |
| 35 | CCG formula revision (Stability 30%) | opus-advisory-arc-S023.md STREAM 6 | S025 council routing works | New D dimension weight |
| 30 | Pillar-level validator upgrade campaign | THIS PLAN | Advisory→blocking ratio hits 50% | Systematic: each advisor gets blocking version |
| 25 | SLSA supply chain provenance | platform-readiness research (EXT-20260511-001-A) | Gate 2 SaaS Ready | Build SBOM + artifact provenance |
| 20 | 10,000 tenant load tests | platform-readiness research | Gate 4 Scale Ready | After App #5 generating traffic |

---

## §3 — The 15 Floating Elements — Resolution Registry

*Every element identified in S024 audit. Each must connect to a plan and session before S026.*

| # | Floating Element | Root cause | Connected to | Resolution |
|---|---|---|---|---|
| 1 | **B_INTENT_TO_IMPACT** — named, no enforcement | Built in S002, never got a validator | THIS PLAN Band 3 | validate-intent-to-impact.mjs + pending:/impact: fields → S026 |
| 2 | **5-item agreement fields** — background/problem/directions missing from frontmatter | P-META-023 designed but not schema-applied | threshold plan | threshold_intake_level + 5-item fields → frontmatter-closed-enums S025 |
| 3 | **42-surface activation gate** | 42 surfaces declared, ~10 currently active, no validator distinguishes | threshold plan | §10 surface status column; validator checks active vs future → S025 (Opus Turn 9 Ref 5) |
| 4 | **3-level intake routing** — L/M/D not connected to PE | Designed S024, not wired | threshold plan + THIS PLAN | threshold_intake_level → PE I-dimension adjustment → S025-S026 |
| 5 | **Depth level → PE D dimension** | PE formula manual, doesn't read depth_chosen | THIS PLAN Band 3 | validate-pe-dashboard.mjs reads depth_chosen → S026 |
| 6 | **Foundation gate → PE Bn dimension** | validate-open-plan-levels.mjs findings not fed to PE | THIS PLAN Band 3 | validate-pe-dashboard.mjs reads open gates → S026 |
| 7 | **132 open plan items — no PE ordering** | PE is manual; no unified priority view | THIS PLAN + validate-pe-dashboard.mjs | Dashboard outputs sorted queue → S025 |
| 8 | **session-open.sh Opus detection** | Described in human-intent-crystallization.md §5, not implemented | threshold plan | session-open.sh checks opus-turn.md freshness → inject INTENT ABSORBED reminder → S025 |
| 9 | **inner-AI-defaults enforcement rate** — not surfaced at session open | validate-inner-ai-defaults-enforcement-rate.mjs advisory only | THIS PLAN | Surface rate in validate-pe-dashboard.mjs output → S025 |
| 10 | **validate-plan-ai-defaults.mjs** — 3 plans flagged advisory | Advisory only, no PE connection | THIS PLAN | Promote flagged plans to require Governor ratification → S025 |
| 11 | **M-18 Question Protocol moat component** | validate-moat-coverage.mjs gap | THIS PLAN | M-18 = Question Protocol (threshold-intake-protocol.md IS M-18); mark covered → S025 |
| 12 | **B_HUMBLE_EXECUTOR INTENT DRIFT CHECK** — no validator enforces match field | §10.0r exists in closing-summary template but drift: field not checked | threshold plan | validate-boundary-alignment.mjs extension: check closing-summary drift: field → S026 |
| 13 | **Threshold Wizard UI** — no user ever sees it | routing.config.ts templates exist; no app implements them | budget-planner-app2.md Layer 3 | Budget Planner proves it → S026-S027 |
| 14 | **PE scores in plan frontmatter — no unified view** | Manual scoring, no dashboard | THIS PLAN Band 1 | validate-pe-dashboard.mjs → S025 |
| 15 | **council-state.json — no verify reads it** | Tracking fields added S024; no validator uses them | threshold plan | Add council-state validation to validate-sonnet-report.mjs → S026 |

---

## §4 — Session Map (S025 → S030+)

### S025 — Foundation Closing + PE Dashboard + Budget Planner Layer 1

**Session mandate (PE-ordered, execute in this sequence):**

1. **validate-pe-dashboard.mjs** (PE=95) — create, wire to session-open.sh + pnpm verify. Output: sorted PE queue with adjusted scores (depth + gate + ZF connected). Exit criteria: fires at session open, output readable in 200ms.

2. **session-open.sh** (PE=90) — inject PE top-5 when session opens. Also: check opus-turn.md freshness → inject "Opus output present — emit INTENT ABSORBED before any file edit." Exit criteria: PE top-5 visible at session start.

3. **Budget Planner Layer 1** (PE=82) — personal.finance WizardTemplate in routing.config.ts (diff + confirm since protected libs/). Fork apps/template/ → apps/budget-planner/. Exit criteria: apps/budget-planner/ exists, pnpm build passes, plan-coverage-gate silent.

4. **plan-creation-protocol.md Step 0a → 9-step** (PE=80) — expand Step 0a to the full coaching protocol: receive freestyle → checklist scan → fill gaps → 5-item agreement → ratify → plan. Exit criteria: Step 0a matches threshold-intake-protocol.md §2-§8.

5. **failure_signal field** (PE=76) — frontmatter-closed-enums.md + gradual-build-plan.template.md + validate-intent-crystallized.mjs advisory extension. Exit criteria: failure_signal: field valid; advisory check fires for S023+ plans missing it.

6. **P-META-022 Tier 2 items 12-16** (PE=74) — from p-meta-022-alignment-plan.md. Items: B_AUTONOMOUS_BATCH Q-CRYSTALLIZED + gradual-build template intent fields + B_ASK_WHEN_FILLING_GAPS cross-ref + ai-behavior-spine row + frontmatter-closed-enums goal/done fields.

7. **Opus Turn 9** (PE=71) — send full 26-item checklist + 42-surface list. Get SEALED verdict on P-META-023 or new conditionals. After response: apply Refinements 2-5 to threshold-intake-protocol.md.

8. **threshold_intake_level** (PE=73) — add to frontmatter-closed-enums.md. Values: light | medium | deep.

**S025 exit criteria:**
- [ ] validate-pe-dashboard.mjs running at session open and in pnpm verify
- [ ] apps/budget-planner/ forked and building
- [ ] plan-creation-protocol.md Step 0a is the full 9-step coaching protocol
- [ ] failure_signal field in closed enum
- [ ] P-META-022 Tier 2 items 12-16 done
- [ ] Opus Turn 9 response received
- [ ] threshold_intake_level in closed enum
- [ ] pnpm verify exit_code=0

---

### S026 — Budget Planner Layer 2 + Enforcement Upgrades + Phase 2 Boundary

**Session mandate:**

1. **Budget Planner Layer 2** (PE=78) — BudgetCategory + Transaction entities in schema.zmodel. API routes with subscription gate + AuditEvent. validate-foundation-schema-drift=0.

2. **advisory→blocking upgrades** (PE=68, 54) — validate-intent-crystallized → BLOCKING for S023+ deep_quality; validate-routing-declared → BLOCKING for S023+ plans. Grandfathered plans stay advisory.

3. **B_BOUNDARY_ALIGNMENT_PROTOCOL Phase 2 Type C** (PE=56) — pre-tool-use-mcp-alignment.sh advisory; UNDERSTANDING BLOCK standard for MCP/API tool calls.

4. **B_BOUNDARY_ALIGNMENT_PROTOCOL Phase 2 Type D** (PE=55) — validate-handoff-alignment.mjs; HANDOFF Zone D checklist mechanical check.

5. **Governance artifact creation gate** (PE=52) — pre-tool-use hook for docs/plan/pillar-*/ writes without covering plan.

6. **B_INTENT_TO_IMPACT enforcement** (PE=50) — pending: and impact: fields in closing-summary; validate-intent-to-impact.mjs advisory.

7. **validate-pe-dashboard depth + gate connections** (PE=48, 47) — read depth_chosen → D dimension; read open plan gates → Bn dimension.

8. **B_THRESHOLD_INTAKE_PROTOCOL contract** (PE=67) — gated on Opus SEALED verdict from S025 Turn 9.

**S026 exit criteria:**
- [ ] Budget Planner Layer 2: schema + API routes + ZF
- [ ] Two validators flipped to blocking
- [ ] Phase 2 boundary hooks (advisory)
- [ ] PE dashboard computing D from depth_chosen + Bn from gate status
- [ ] pnpm verify exit_code=0

---

### S027 — Budget Planner Layer 3 + P-META-023 Formal + Pillar Hubs

**Session mandate:**

1. **Budget Planner Layer 3** (PE=70) — Threshold Wizard onboarding UI. 3 crystallization questions. Non-skippable gate. budget_goal stored.

2. **P-META-023 in principles.yaml** (PE=62, gated on Opus SEALED from S025-S026) — entry added; slice synced; total_count=57. canonical_ref → threshold-intake-protocol.md.

3. **validate-threshold-intake.mjs** (PE=60) — advisory validator for 5-item agreement in S023+ plans.

4. **Pillar hub files** (PE=45) — 6 _hub.md files (pillar-0 through pillar-6), each listing schema entities + plan coverage + impl_status.

**S027 exit criteria:**
- [ ] Budget Planner Threshold Wizard: live, non-skippable, storing budget_goal
- [ ] P-META-023 in principles.yaml (if Opus sealed)
- [ ] validate-threshold-intake.mjs running
- [ ] 6 pillar hub files present

---

### S028 — Budget Planner Layer 4 + Scale Proof

**Session mandate:**

1. **Budget Planner Layer 4** (PE=58) — GDPR erasure, cold-start test, tenant isolation adversarial test, full pnpm verify clean with budget-planner slice.

2. **App #3 domain decision** (PE=43) — Threshold intake for App #3. Domain choice. topic-plan created.

**S028 exit criteria:**
- [ ] Budget Planner: pnpm verify 0, cold-start works, adversarial test passes
- [ ] Gate 3 (Foundry Ready) achieved: second app proved without platform rewrites
- [ ] App #3 domain chosen and topic-plan created

---

### S029-S030+ — App #3 Build + WisdomVault Trigger Watch

- App #3 build (same Layer 1-4 pattern as Budget Planner, different domain)
- Opus Turn 10 advisory (sessions_since_opus_review ≥ 10)
- WisdomVault trigger: 3+ apps generating data → WisdomEntry model
- Core Spines Option B (after Opus ripple analysis complete)
- Supply chain provenance (SLSA Gate 2 prep)

---

## §5 — Completions Registry (updated at every session close)

| Session | Item | PE | Evidence |
|---|---|---|---|
| S024 | validate-sonnet-report.mjs | 85 | commit 5c86e61 |
| S024 | B_BOUNDARY_ALIGNMENT_PROTOCOL Phase 1 (E+B) | 82 | commit 8359d69 |
| S024 | pre-tool-use-agent-alignment.sh | 79 | commit 2c4cdc1 |
| S024 | council-state.json tracking fields | 75 | commit 5c86e61 |
| S024 | P-META-022 Tier 1 items 1-8+11 | 92 | commit 5c86e61 |
| S024 | libs/ gate v1.2.0 BLOCKING for new files | 88 | commit 5c86e61 |
| S024 | threshold-intake-protocol.md SSoT | 77 | commit 45286e1 |
| S024 | budget-planner-app2.md topic-plan | 82 | commit c4c7ff1 |
| S024 | threshold-and-p-meta-023-s025.md | 71 | commit c4c7ff1 |
| S024 | reasoning-session-artifact-triggers-chat-close | 65 | commit 3283e73 |
| S024 | Opus Turn 8 absorption — P-META-023 conditional seal | — | sonnet-turn.md |
| S025 | validate-pe-dashboard.mjs + session-open injection | 95 | commit b8dbc92 |
| S025 | Budget Planner Layer 1: personal.finance template + fork | 82 | commit ef9b1f3 |
| S025 | plan-creation-protocol.md Step 0a → full 9-step coaching | 80 | commit 3d2f2be |
| S025 | failure_signal + threshold_intake_level + threshold_participants → closed enums | 76 | commit 3d2f2be |
| S025 | validate-contract-harmonization.mjs + validate-question-coverage.mjs | 84+73 | commit 604afe0 |
| S025 | question-protocol.md §S025 amendment — 8-type taxonomy + enforcement map | 73 | commit 604afe0 |
| S025 | DNA Element 16 (Question Protocol) — csps-platform-dna.md | — | commit 9564bf9 |
| S025 | dna-protocol-making-sure-that.md — 12-group constitutional checklist | 88 | commit 9564bf9 |
| S025 | csps-complete-architecture-s026.md topic plan — full unified architecture | 88 | commit 63198ad |
| S025 | EXT-20260512-002-A architecture synthesis — 5-layer hierarchy + 9 pipelines | — | commit 63198ad |
| S025 | M-18 moat component closed (18/18) | — | commit 63198ad |
| S025 | csps-master-plan-s025-plus.md Band 3b — 14 DNA Protocol items PE-scored | — | this session |
| S025 | P-META-022 Tier 2 items 11-16 complete | 74 | commit b2cad2d |
| S025 | validate-dead-links.mjs (advisory, 67 pre-existing broken links found) | 68 | this batch |
| S025 | reasoning-join-forces — inner-AI-defaults reasoning-patterns.md | 59 | this batch |

---

## §6 — How This Plan Connects to the Platform Grid

```
THIS PLAN (csps-master-plan-s025-plus.md)
     ↑ reads at session open (session-open.sh S025)
     │
     ├── validate-pe-dashboard.mjs (S025)
     │      ← reads all active plans (priority_score, priority_band)
     │      ← reads validate-open-plan-levels.mjs (132 items → Bn)
     │      ← reads depth_chosen → D dimension
     │      ← reads ZF gate status → Bn dimension
     │      → outputs: sorted PE queue
     │
     ├── opus-advisory-arc-S023.md (enterprise arc, depth-5)
     │      9 work streams, S024-S031+
     │
     ├── budget-planner-app2.md (App #2, PE=82)
     │      4 layers → Gate 3 Foundry Ready
     │
     ├── threshold-and-p-meta-023-s025.md (P-META-023, PE=71)
     │      3 layers → formal ratification
     │
     ├── threshold-intake-protocol.md (SSoT for I→VI discipline)
     │      26-item checklist → 42 surfaces → 5-item agreement
     │
     └── principles.yaml / behavioral-contracts.md / routing.config.ts
            ← all reference threshold-intake-protocol.md, not copy it
```

**The compounding loop:**
```
New work arrives → Threshold intake (26-item checklist)
→ 5-item agreement ratified → Plan with PE score created
→ PE dashboard shows priority → Session executes top-5
→ Items complete → Dashboard updates → New top-5 surfaces
→ Repeat — no drift, no floating elements, no shiny-object hijacking
```

---

## §7 — Governance DNA Checklist (P-META-016)

Every new item in this plan answers these 15 DNA elements before entering the queue:

| Element | Required answer |
|---|---|
| 1 Priority Engine | PE score + band declared |
| 2 ZF Discipline | Exit criteria with pnpm verify |
| 3 Core Spine | core_spine: declared |
| 4 Behavioral Contracts | Which B_* governs this work |
| 5 Quality Gates | QG1-QG4 honored (no model downgrade mid-session) |
| 6 Templates | Which template used (gradual-build-plan, etc.) |
| 7 Five-Surface Engraving | If principle/contract: 5/5 surfaces planned |
| 8 Depth Levels | depth_chosen declared with rationale |
| 9 Priority Engine | (same as #1 — two entries intentional, PE is load-bearing) |
| 10 Depth Levels | depth_chosen declared (same — load-bearing) |
| 11 Priority Engine | (third occurrence — PE governs ordering absolutely) |
| 12 Context-Loss Discipline | context-loss-pains.md referenced |
| 13 LAYER | CSP_CORE / SOLUTION_X / MIXED declared |
| 14 Domain Primitives | libs/core/ primitives used where applicable |
| 15 Human Intent Crystallization | goal_statement + done_criteria + failure_signal (human-authored) |

---

## §8 — How to Use This Plan

**At session open:**
1. Read §0 (platform state)
2. Read validate-pe-dashboard.mjs output (top-5 items)
3. Confirm current session mandate against §4 (session map)
4. Emit INTENT ABSORBED if Opus output present
5. Check validate-open-plan-levels.mjs for blockers

**At session close:**
1. Run pnpm verify (exit_code=0 required)
2. Update §5 (completions) with done items + commit SHA
3. Add any new items to §2 (with PE score, session target, exit criteria)
4. Update §3 if floating elements were resolved
5. Update §4 (session map) if session completed early/late
6. Write SONNET REPORT to sonnet-turn.md

**If a work item isn't in §2:**
It doesn't exist in the platform's plan. Either add it here with PE score + session target, or vault it in raw-thoughts-queue.md and never act on it. No exceptions.

---

*Authored: S024 | Governor directive "have everything planned with full details and full context"*
*PE=99 (the plan that orders all plans)*
*Next update: S025 close*
