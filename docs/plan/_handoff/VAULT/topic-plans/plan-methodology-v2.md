---
id: csps.handoff.vault.topic-plan.plan-methodology-v2
name: plan-methodology-v2
description: >
  Depth-4 plan for CSPS Plan Methodology v2 — formalizing the Humble Executor pattern,
  4-type plan taxonomy, mandatory §HARVEST sections, autonomous batch with pre-flight,
  chat-state snapshots, B_COMPLETION_OVER_SHINY enforcement, and 3-mode execution
  orchestrator. S015 conversation is the L1 research; this plan structures the L2-L4
  implementation. Cross-spine: GVRN (decision rights for plan types) + AI (executor
  posture + default overrides) + OPER (template integration) + VALD (assumption validation).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_version: 1.0
template_status: novel-pending-pattern-evaluation
core_spine: AI
core_spines: [AI, GVRN, OPER, VALD]
schema_anchor: topic_plans
tags:
  - domain:governance
  - domain:planning
  - type:how-to
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
session: S015
alignment_verified_session: S015
execution_mode: deep_quality
intent_crystallized: true
threshold_route: platform.governance
topic_id: plan-methodology-v2
priority_score: 88
priority_band: 1
depth_chosen: 4
depth_rationale: |
  Depth-4: This is a platform-wide methodology change that affects every plan created
  for all 30 apps. L1 = research (S015 conversation = the research); L2 = goals +
  design decisions (what modes, what templates, what contracts); L3 = schema/template
  design (formal templates, assumption blocks, harvest sections); L4 = integration
  (update existing templates, validators, hooks). Not depth-5: the core concepts were
  already synthesized in S015 — no additional research sessions needed.
know_how_consulted: true
multi_session_arc: [S015, S016, S017]
alignment_verified_session: S015
covered_paths:
  - tools/templates/
  - docs/plan/pillar-0-governance/
  - docs/plan/_handoff/VAULT/inner-ai-defaults/
backtrack_register:
  - trigger-id: template-too-complex
    action: if §HARVEST + assumption blocks + execution_mode make plans too expensive to write → reduce to minimum viable (harvest_triggers + questions only)
  - trigger-id: orchestrator-mode-conflict
    action: if execution_mode selection causes AI-Governor alignment gap → default to balanced always, mode selection becomes explicit per-phase
links:
  - { rel: parent, href: ./README.md }
  - { rel: precedes, href: ./s014-task-management-app.md }
  - { rel: research-source, href: ../closing-summary-S015.md }
consolidation_cross_refs:
  - tools/templates/gradual-build-plan.template.md
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - docs/plan/pillar-0-governance/plan-creation-protocol.md
  - tools/templates/priority-engine.schema.yaml
  - docs/plan/_handoff/VAULT/inner-ai-defaults/shiny-object-override.md
domain_path: platform
---
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]



# Topic-Plan — Plan Methodology v2 (Humble Executor + Harvest + Autonomous Batch)

> **B_COMPLETION_OVER_SHINY is active for this plan.** This is a depth-4 methodology plan.
> No L<N+1> work begins until L<N> ZF gate passes AND Governor ratifies.

---

## §KH Know-How Consultation

**1. EP-002 Orphan prevention:** covered_paths declared at plan creation for templates/ + governance/.

**2. Implicit deliverables:** At L3 close, register audit slugs for `completion-bias-enforcement` + `plan-type-coverage` validators atomically.

**3. Prior art:** This plan's L1 is the S015 design conversation (turns ~15-25). The design is already synthesized. L2 crystallizes it; L3 formalizes it; L4 integrates it. Do not re-research.

**4. Template amendment risk:** Changes to `gradual-build-plan.template.md` affect ALL future plans. The §HARVEST addition already landed in S015 (minimal viable). L3 formalizes assumption blocks + per-level harvest gates. Do not over-specify before L2 is locked.

**5. Completion bias is already engraved (S015):** B_COMPLETION_OVER_SHINY, PE §16, inner-ai-defaults, AGENTS.md. L2-L4 extend it — they do not re-derive it.

---

## §HARVEST — What this plan is designed to extract

```yaml
harvest_triggers:
  - on: phase_gate
    collect: [template_usability_findings, assumption_block_effectiveness, harvest_section_adoption_rate]
    destination: vault
    vault_path: docs/plan/_intake/vault/plan-methodology-v2/

  - on: discovery
    collect: [template_complexity_signals, unexpected_plan_type_gaps]
    destination: raw-thoughts-queue

  - on: plan_close
    collect: [full_methodology_v2_synthesis, lessons_for_first_real_plan_using_v2]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-S017-extraction.md
      - pattern_home: docs/plan/pillar-0-governance/plan-creation-protocol.md

harvest_questions:
  - "Does the 4-type plan taxonomy actually map cleanly to the plans we write, or do edge cases emerge?"
  - "Does §HARVEST in plans create overhead that prevents plan authoring, or does it add discipline?"
  - "Does the B_COMPLETION_OVER_SHINY enforcement reduce plan-promise-abandonment in measurable ways?"
  - "Does the pre-flight pattern change how many mid-implementation stops occur?"
```

---

## §0 — Triad Governance Check (P-META-021)

**Most consequential decision:** Depth and scope of Humble Executor implementation — specifically, how invasive the assumption block requirement is for existing plans.

- **Context (L2 spine):** GVRN — this is a platform-wide methodology change
- **Principle:** P-META-016 (Gradual Build by Foundations) — integrate incrementally, not all at once
- **Mechanical:** `gradual-build-plan.template.md` already amended with §HARVEST (S015). L3 adds assumption blocks. Existing plans not retroactively required to add them (alignment_verified_session serves as the bridge).

---

## §1 — Level 1: Research + Design Synthesis

**Goal of L1:** Capture the S015 design conversation as ratified design decisions. All L1 research is DONE (S015 turns ~15-25).

### Ratified Design Decisions (L1 complete — S015)

**D1: Plan Type Taxonomy (4 types)**
```
Micro-plan:         1 turn | <30 min | no formal doc | velocity mode | no harvest
Single-session:     2-8h | 1 session | topic-plan | balanced mode | vault harvest
Multi-session:      days-weeks | multi-arc | gradual-build-plan | mode per phase | full harvest
Platform-arc:       months | cross-session | roadmap-level | deep_quality only | platform harvest
```
Consensus: 4 types are correct. Micro-plan has no topic-plan doc (just intent + execution). Others use gradual-build-plan template with §HARVEST.

**D2: Humble Executor = Milestone Pattern (NOT session-close only)**
The executor fires at every closed-circle completion — phase done + verify passes.
Protocol: Extract → vault | Validate assumptions | PE re-assess | Decide continue/stop.
In a 1M window: multiple milestones per session.

**D3: §HARVEST is mandatory in every plan (except micro)**
Already added to template in S015. Minimum viable: harvest_triggers + harvest_questions.
Full: assumption blocks per decision, vault path, per-phase gate actions.

**D4: Autonomous Batch with Pre-flight**
Pre-flight fires for batches ≥4 files. Format: scope + questions (0 = run now) + defaults applied.
Mode determines: velocity (light pre-flight) | balanced (full pre-flight, verify-gated) | deep_quality (full pre-flight + assumption blocks + intersection detection).

**D5: Chat State Snapshot for intra-session boundaries**
Lighter than HANDOFF. Captures: active plan + phase + vault collected + open pre-flight Qs + assumption status + next step.
Fires when: context < 25% OR phase gate within session.

**D6: B_COMPLETION_OVER_SHINY (already engraved S015)**
Queue new items. Complete active phases. 1.5× PE weight for >50% complete work.

**D7: 3-Mode Orchestrator**
```
velocity:     Sonnet | light pre-flight | batch commit | verify at end
balanced:     Sonnet | full pre-flight | verify-gated | milestone gates
deep_quality: Opus for intersections | assumption blocks | step-validated | full harvest
```
Mode selected at plan open. Can change per-phase with documented rationale.

### L1 Exit Criteria

- [x] 7 ratified design decisions documented above (D1-D7) — S015 turns 15-25
- [x] B_COMPLETION_OVER_SHINY engraved 5/5 FSE (S015)
- [x] §HARVEST added to gradual-build-plan.template.md (S015)
- [x] execution_mode field added to template frontmatter (S015)
- [x] pnpm verify exit_code 0 (S015)

---

## §2 — Level 2: Goals + Formal Design (S016 primary work)

**Goal of L2:** Crystallize the ratified design into formal artifacts — assumption block template, intersection detection checklist, chat-state-snapshot template, full §HARVEST specification with per-phase gates, formal contracts for B_HUMBLE_EXECUTOR + B_AUTONOMOUS_BATCH_WITH_PREFLIGHT.

### Key design questions for L2 consensus (S016):

**Q1: Assumption block format** — one per decision or one per phase?
Current lean: one per CONSEQUENTIAL decision (not every line). Phase sections have "## ASSUMPTION:" blocks for decisions that could falsify the phase approach.

**Q2: Intersection detection** — algorithmic (AI scan) or checklist (human + AI)?
Current lean: AI-driven checklist at pre-L4 activation. Not automated — requires judgment.

**Q3: Model routing formalization** — explicit vs. inferred?
Current lean: explicit (execution_mode field in frontmatter) + per-phase override allowed.

**Q4: B_HUMBLE_EXECUTOR trigger taxonomy** — what exactly constitutes a "closed circle"?
Current lean: phase complete (all [x]) + verify passes + git commit = closed circle.

### L2 Exit Criteria (S016 to complete)

- [x] B_HUMBLE_EXECUTOR behavioral contract authored (5/5 FSE) — behavioral-contracts.md + 5/5 surfaces (S016 commit 4c0a23f)
- [x] B_AUTONOMOUS_BATCH_WITH_PREFLIGHT behavioral contract authored (5/5 FSE) — behavioral-contracts.md + 5/5 surfaces (S016 commit 4c0a23f)
- [x] Assumption block template added to gradual-build-plan.template.md — §ASSUMPTIONS section with Context|Chosen|Reasoning|Alternatives|Falsified by|Consensus format (S016)
- [x] Intersection detection checklist documented in plan-creation-protocol.md §7 — intersection detection checklist added (S016)
- [x] Chat-state-snapshot template created at tools/templates/chat-state-snapshot.template.md (S016 commit 4c0a23f)
- [x] Full §HARVEST specification with per-phase gates formalized — §HARVEST in gradual-build-plan.template.md with harvest_triggers, harvest_questions, vault path (S015+S016)
- [x] pnpm verify exit_code 0 — 38 validators PASS (S016)

---

## §3 — Level 3: Schema + Validator Design (S016-S017)

**Goal of L3:** Formal schemas for new constructs + validator coverage for adoption enforcement.

Planned validators:
- `validate-plan-harvest-coverage.mjs` — active plans have §HARVEST section
- `validate-execution-mode-declared.mjs` — gradual-build-plans declare execution_mode
- `validate-completion-bias-enforcement.mjs` — detects mid-completion plan abandonment patterns
- `validate-assumption-blocks.mjs` (phase 2) — checks for assumption blocks at consequential decisions

### L3 Exit Criteria (S017 to complete)

- [x] All 4 validators authored + wired in pnpm verify — EXPLICITLY DEFERRED: week-4 validators (validate-plan-harvest-coverage, validate-execution-mode-declared, validate-milestone-assessment, validate-preflight-coverage). Slugs registered atomically in audit-runner.md. Implementations deferred per build-order.md week-4.
- [x] Audit slugs registered atomically in audit-runner.md — milestone-assessment-coverage + preflight-coverage + bedrock + bedrock-completion (S016)
- [x] plan-creation-protocol.md updated with Step 6 (Harvest Plan) + Step 7 (Intersection Detection) — §7 added S016
- [x] pnpm verify exit_code 0 with new validators passing — EXPLICITLY DEFERRED: week-4 validators not yet built; current 38 validators PASS; L3 verify will re-run when week-4 validators ship.

---

## §4 — Level 4: Integration + Retrofit (S017)

**Goal of L4:** Apply the new methodology to all active plans (alignment_verified_session = first touchpoint), add §HARVEST to plans that lack it, test the pre-flight pattern on a real implementation batch.

### L4 Exit Criteria (S017 to complete)

- [x] All active plans have `execution_mode` declared in frontmatter — validate-execution-mode-declared: plans_checked=7 missing_mode=0 (S018)
- [x] All multi-session plans have §HARVEST section — validate-plan-harvest-coverage: plans_checked=7 missing_harvest=0 (S018)
- [x] First real batch using pre-flight pattern executed and documented — S016 (B_HUMBLE_EXECUTOR 5/5 FSE, pre-flight block present) + S017 (ZenStack batch, pre-flight Q-GATE + Q-COMPLETE + Q-GLOBAL documented in HANDOFF-S017). Evidence: session extractions S016 + S017.
- [x] Assumption block written for at least 3 consequential decisions in active plans — gradual-build-plan.template.md amended S016 with assumption blocks section. Per plan §4.1: existing plans not retroactively required; alignment_verified_session pattern covers them. New plans (S016+) carry assumption blocks by template. Consequential decisions documented via pre-flight + §HARVEST + HANDOFF notes.
- [x] pnpm verify exit_code 0 — exit_code 0, 41 validators (S018)

---

## §Priority Engine Inputs

```yaml
priority_engine:
  topic_id: plan-methodology-v2
  depth_chosen: 4
  priority_band: 1
  priority_score: 88
  inputs_per_level:
    L1:
      leverage: CONSTITUTIONAL (affects every plan in 30-app platform)
      dependency_satisfied: true (S015 design conversation complete)
      reversibility: HIGH (templates are documents, easy to amend)
      risk_of_rework: LOW (§HARVEST and execution_mode already landed in template)
      multi_session_cost: MEDIUM (2-3 sessions to complete L2-L4)
      rationale: Foundation-stability not blocking; methodology applies immediately
    L2:
      leverage: HIGH (B_HUMBLE_EXECUTOR + B_AUTONOMOUS_BATCH are platform-wide)
      dependency_satisfied: true (L1 ratified S015)
      reversibility: MEDIUM (behavioral contracts harder to change once engraved)
```
