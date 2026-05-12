---
id: csps.governance.dna-protocol-making-sure-that
name: dna-protocol-making-sure-that
description: >
  The CSPS DNA Protocol — a constitutional checklist of "Making Sure That..."
  Every item is a guarantee the platform must always satisfy. Mechanically enforced
  through validators, hooks, and contracts. Audited at every session close.
  The Governor stops reminding — the platform monitors itself.
  Governor directive S025.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, VALD, ARCH, AI, OPER]
schema_anchor: pillar_0_governance_leaves
impl_status: swift-implemented
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
session: S025
intent_crystallized: true
threshold_route: platform.governance
links:
  - { rel: threshold-protocol, href: ./threshold-intake-protocol.md }
  - { rel: question-protocol, href: ./question-protocol.md }
  - { rel: csps-platform-dna, href: ./csps-platform-dna.md }
  - { rel: master-plan, href: ../../_handoff/VAULT/csps-master-plan-s025-plus.md }
  - { rel: audit-runner, href: ./audit-runner.md }
diataxis_type: how-to
---

# DNA Protocol — Making Sure That...

> **The platform monitors itself. The Governor stops reminding.**
> Every item below is a governance guarantee. Each has a mechanical enforcer or is
> explicitly pending one. Items without enforcers are gaps — visible, scheduled, PE-scored.
> Read this at every session open. Update when new guarantees are added or closed.

---

## §1 — Input + Threshold Guarantees

### Making sure that... every input goes through Threshold

**Status:** ⚠️ PARTIAL
- **C-type questions (goal_statement):** BLOCKING for S023+ deep_quality plans via `validate-intent-crystallized.mjs` ✅
- **Z-type questions (done_criteria):** BLOCKING for S023+ deep_quality plans ✅
- **M3 (failure_signal):** ADVISORY via `validate-intent-crystallized.mjs` ✅
- **G-type (gap-surfacing):** ADVISORY via `validate-question-coverage.mjs` ✅
- **Full question_register in plan frontmatter:** ❌ NOT YET — S026 Phase 2 target
- **Threshold route declared:** ADVISORY via `validate-routing-declared.mjs` ✅

**Gap:** question_register mandatory in plan frontmatter → `validate-question-coverage.mjs` Phase 2.
**Core seed (S026):** Add question_register field to frontmatter-closed-enums.md → promote to blocking.

---

### Making sure that... all checklist answers are complete before implementation

**Status:** ⚠️ PARTIAL
- **5-item agreement (background/problem/directions/goal/done):** Designed in `plan-creation-protocol.md Step 0a` ✅
- **Pre-implementation gate:** `pre-tool-use-plan-coverage-gate.sh` BLOCKS new libs/ files without plan ✅
- **Simulation before implementation:** `validate-simulation-before-implementation.mjs` active ✅
- **Full 26-item checklist verified:** ❌ NOT YET — validate-threshold-intake.mjs planned S025

**Gap:** validate-threshold-intake.mjs not yet built.
**Core seed (S025):** Build validate-threshold-intake.mjs (advisory) → checks 5-item agreement in S023+ plans.

---

## §2 — Depth Level Guarantees

### Making sure that... every element has a depth level declared

**Status:** ⚠️ PARTIAL
- **Plans:** `depth_chosen` field in gradual-build-plan.template.md ✅; `validate-gradual-bundling.mjs` checks it ✅
- **Implementations (code):** ❌ No depth level in code artifacts
- **Validations (validators):** ❌ No depth level in validator files
- **Governance artifacts:** ❌ depth_levels field in frontmatter not universally enforced

**Gap:** depth_levels / depth_chosen not enforced for non-plan artifacts.
**Core seed (S026):** Add `depth_tier:` to frontmatter-closed-enums.md for governance artifacts (L1/L2/L3 instance level) → validate-universal-alignment.mjs checks it.

---

### Making sure that... partial depth activation is used correctly (no full activation when partial is fine)

**Status:** ⚠️ PARTIAL
- **Gradual build discipline:** `B_GRADUAL_BUILD_BY_FOUNDATIONS` + ZF gate per level ✅
- **PE gating:** Each depth level requires PE score threshold ✅
- **Threshold intake levels (L/M/D):** Designed in threshold-intake-protocol.md ✅
- **Mechanical enforcement:** ❌ validate-threshold-intake.mjs not yet built

**Gap:** Intake level is declared in plan frontmatter but not enforced to match the work scope.
**Core seed (S026):** validate-threshold-intake.mjs checks threshold_intake_level consistency with plan depth.

---

## §3 — Bottleneck + Overload Prevention Guarantees

### Making sure that... the platform doesn't create processing bottlenecks

**Status:** ⚠️ PARTIAL
- **Token budget:** `B_TOKEN_BUDGET` + `validate-token-budget.mjs` ✅
- **Subagent delegation:** B_TOKEN_BUDGET R7 (heavy tasks → subagents) ✅
- **Sequential vs parallel tool use:** Inner-AI-defaults tooling-patterns.md ✅
- **Explicit overload detector:** ❌ No validator specifically for bottleneck patterns

**Gap:** No `validate-bottleneck-patterns.mjs` that checks for: serial tool chains that could parallelize, overly large plans, single-session scope that should span sessions.
**Core seed (S027):** validate-bottleneck-patterns.mjs — advisory checks for common overload patterns.

---

## §4 — Splitting + Complexity Guarantees

### Making sure that... elements split when length+complexity threshold is met

**Status:** ⚠️ PARTIAL
- **File size ratchet:** CI pipeline `file-size-ratchet` validator ✅
- **Slice splitting:** `pnpm principles:split`, `pnpm contracts:split`, `pnpm audit-runner:split` ✅
- **Plan splitting trigger:** ❌ No validator that says "this plan is too large — split it"
- **Code splitting trigger:** ❌ No validator for function/file cognitive complexity triggering split

**Gap:** The split mechanisms exist for governance monoliths (principles.yaml → slices). Missing: automatic complexity → split trigger for plans and code.
**Core seed (S026):** Add to `validate-gradual-bundling.mjs` a check for plans with >15 open items AND >depth-4 → advisory "consider splitting this plan."

---

### Making sure that... splitting is part of the governance planning grid

**Status:** ⚠️ PARTIAL
- **Plan creation protocol:** Step 0b (Completion gate) checks if active work >50% complete ✅
- **PE formula:** B dimension (blast_and_complexity) captures this ✅
- **Explicit split protocol:** ❌ No `B_SPLIT_THRESHOLD_DISCIPLINE` contract
- **Audit:** file-size-ratchet catches file-level splits ✅

**Gap:** No behavioral contract for when to split a plan into sub-plans.
**Core seed (S026):** Add `B_SPLIT_THRESHOLD_DISCIPLINE` — defines: plan with >12 open items AND depth-5 must fork a sub-plan for the overflowing scope.

---

## §5 — Platform DNA as Moat Guarantees

### Making sure that... Platform DNA is mentioned everywhere it should be

**Status:** ⚠️ PARTIAL
- **15 (→16) elements defined:** `csps-platform-dna.md` ✅
- **DNA gate in plan creation:** `plan-creation-protocol.md Step 2` checks all 15 elements ✅
- **validate-universal-alignment.mjs:** Checks DNA fields ✅
- **Depth of enforcement:** ❌ DNA gate only checks "considered or N/A" — not actual application

**Gap:** DNA gate confirms elements were considered, not that they were applied correctly.
**Core seed (S026):** For each DNA element, define "application evidence" — what observable artifact proves this element was applied. validate-universal-alignment.mjs checks for evidence, not just acknowledgment.

---

### Making sure that... one source of truth propagates to all service points

**Status:** ⚠️ PARTIAL
- **SSoT model:** threshold-intake-protocol.md, question-protocol.md use SSoT approach ✅
- **Slice architecture:** principles.yaml → slices → all consumers reference ✅
- **Links enforcement:** `validate-universal-alignment.mjs` checks links: array ✅
- **Dead links detected:** ❌ No validate-dead-links.mjs yet

**Gap:** No validator that checks all `links: [{rel:, href:}]` entries resolve to real files.
**Core seed (S026):** `validate-dead-links.mjs` — checks all href values in links: arrays resolve to existing files. BLOCKING for broken links.

---

## §6 — Core Spine Integrity Guarantees

### Making sure that... Core Spine universal→specific hierarchy is never violated

**Status:** ⚠️ PARTIAL
- **Spine precedence:** P-ARCH-028 defines GVRN>VALD>ARCH>AI>OPER ✅
- **L1/L2/L3 doctrine:** validate-corespine-depth-markers.mjs ✅
- **L3 cannot contradict L1:** ❌ No validator that checks this
- **Cross-spine conflicts:** ❌ No conflict detector

**Gap:** An L3 instance could redefine what an L1 sealed element established — no validator catches this.
**Core seed (S027):** `validate-spine-hierarchy.mjs` — for each L3 instance: extract its governing concept → find L1 sealed anchor → check L3 does not contradict L1 definition.

---

## §7 — Documentation Guarantees

### Making sure that... documentation exists at every element and is ever-improving

**Status:** ❌ WEAK
- **diataxis_type field:** In frontmatter-closed-enums.md ✅ but not enforced for most artifacts
- **Every element has a doc:** ❌ No validator
- **Context-export mechanism:** ❌ Not built
- **Documentation as improving system:** ❌ No cadence for doc review/update

**Gap:** Large. Documentation is optional everywhere except where the Governor explicitly demanded it.
**Core seed (S026):** Add `diataxis_type:` as mandatory field for all governance artifacts (currently optional) → `validate-frontmatter.mjs` checks its presence and valid value. This creates the documentation spine.

**Context-export:** Every element should be exportable as `{frontmatter} + {content}` for cross-session context bundles. The context-orchestrator.sh is the start of this → enhance it to be the export mechanism.

---

## §8 — Template Guarantees

### Making sure that... templates are used before creating new artifacts

**Status:** ⚠️ PARTIAL
- **B_TEMPLATE_FIRST_CREATION:** Active behavioral contract ✅
- **template-registry.md:** Exists ✅
- **Automatic template detection:** ❌ No validator that says "this artifact should have used template X"
- **Template creation enforcement:** ❌ No protocol for when a template should be created

**Template Groups (Research → Efficiency → Proactive Creation):**

| Group | Templates that exist | Gap |
|---|---|---|
| **Plans** | gradual-build-plan.template.md, closing-summary-template.md, HANDOFF template | No plan complexity level template (L1/L2/L3 micro vs full) |
| **Governance** | instruction-template.md, adr.template.md, audit-row.template.md | No behavioral-contract.template.md |
| **Session artifacts** | chat-transfer-protocol.template.md, priority-engine.schema.yaml | No session-open-checklist.template.md |
| **App artifacts** | No app-feature.template.md, no api-endpoint.template.md | Large gap |
| **Validators** | No validator.template.mjs | Every validator written from scratch |
| **Wizards/UI** | No component.template.tsx, no page.template.tsx | Large gap |

**The Template Protocol (new — to engrave):**
1. Before creating any new artifact → check template-registry.md
2. If template exists → USE IT; adjustments only for required specs; document what was adjusted and why
3. If no template exists → check if this artifact type will recur (≥2 times predicted)
   - If YES → create template FIRST → register in template-registry.md → then create artifact
   - If NO → create directly but add to template-registry.md with "K=1 tracking"
4. K=2 rule: when same artifact type appears twice without a template → REQUIRE template creation
5. AI override: template-first is mandatory; AI's training default ("just create the artifact") is OVERRIDDEN by B_TEMPLATE_FIRST_CREATION

**Gap → core seed (S025-S026):**
- Add `behavioral-contract.template.md` (B_* contracts are the most frequently created governance artifact without a template)
- Add `validator.template.mjs` (75 validators — each written from scratch)
- validate-template-coverage.mjs: checks if artifact type has a registered template

---

## §9 — AI Behavior + Inner-Defaults Guarantees

### Making sure that... AI works with platform context, not inner defaults

**Status:** ⚠️ PARTIAL
- **Inner-AI-defaults registry:** 6 category files, ~30 entries ✅
- **validate-inner-ai-defaults-enforcement-rate.mjs:** Active ✅ (but only ~50% covered)
- **B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS:** Ratified ✅
- **Real enforcement:** ❌ Most registry entries are "advisory" — AI can still drift

**Expert opinion on the tension (AI natural powers vs. guardrails):**

The tension is real. Two failure modes:
1. **Over-constrained AI:** Every output goes through so many checks that AI becomes a checklist executor, losing the reasoning capability that makes it valuable
2. **Under-constrained AI:** AI acts on training defaults, producing generic-AI-output instead of platform-aligned output

The resolution is not a choice between them — it's **hierarchical context loading**:
- L1 (Permanent Constitution): AGENTS.md + core behavioral contracts → loaded always
- L2 (Session Context): Active plans + current mandate → loaded at session open
- L3 (Active Work): Specific files being edited → loaded per-task

When L1-L3 are loaded correctly, the AI doesn't need to be *told* to override defaults — the context makes platform-aligned behavior the natural choice. The inner-AI-defaults registry is the diagnostic tool, not the enforcement mechanism. The enforcement mechanism is context loading quality.

**The "join forces" principle:** AI's training capability (pattern recognition, synthesis, reasoning) + CSPS context (platform DNA, behavioral contracts, principles) → better than either alone. Don't suppress the AI's reasoning — point it at the right inputs. The platform's job is to provide so much relevant context that the AI's natural reasoning arrives at the aligned conclusion.

**Gap → core seed (S026):**
- validate-inner-ai-defaults-enforcement-rate.mjs: target 70% by S028 (currently ~50%)
- Add `reasoning-join-forces` entry to reasoning-patterns.md: AI explicitly joins platform context with its reasoning capability

---

## §10 — North Star Guarantees

### Making sure that... the North Star function is active at every element

**Status:** ⚠️ PARTIAL (was WEAK — question-protocol.md added the North Star concept)
- **North Star defined:** question-protocol.md §North Star ✅
- **North Star mechanical gate:** ❌ No validator that checks "does this element have a North Star question?"
- **Impact:** Moderate — the concept is present but not mechanically enforced

**The North Star should be the question every element answers:** "Does this implementation answer the questions it was supposed to answer?"

**Core seed (S025 — immediate):** Add to every plan/protocol the concept that the primary Q-type for that element IS its North Star. The North Star is not a separate thing — it IS the C-type (crystallization) + Z-type (completion) questions together.

---

## §11 — System Health Monitoring Guarantees

### Making sure that... system health is monitored continuously, automatically

**Status:** ⚠️ PARTIAL
- **validate-pe-dashboard.mjs:** Priority queue active ✅
- **validate-moat-coverage.mjs:** 18/18 moat components ✅
- **validate-inner-ai-defaults-enforcement-rate.mjs:** Rate tracked ✅
- **Unified health dashboard:** ❌ No single "HEALTH CHECK" command that shows all signals together
- **Continuous monitoring (cron):** ❌ Not set up

**Gap:** Each health signal exists but there's no `node tools/health-check.mjs` that shows the complete platform health picture in one command.

**Core seed (S026):** `tools/health-check.mjs` — runs 5 key validators, aggregates results into a health score, outputs: HEALTHY / DEGRADED / CRITICAL. Runs via: `pnpm health` command.

---

## §12 — The Consolidated "DNA Protocol" Self-Monitoring

### Making sure that... the platform never needs the Governor to remind it

This document IS the answer. Every item above has:
1. A current status (✅ / ⚠️ / ❌)
2. A specific gap description
3. A core seed (the anchoring implementation)
4. A target session

**The monitoring cadence:**
- **Per session:** validate-pe-dashboard.mjs (priority queue) + validate-moat-coverage.mjs (moat health)
- **Per session close:** ZF Level 3 (findings resolved) + this document updated §12 completion registry
- **Weekly:** validate-contract-harmonization.mjs (B_* health) + validate-question-coverage.mjs (question gaps)
- **Monthly:** Full DNA audit (all 16 elements checked against application evidence)

---

## §S025 Completion Registry (update at every session close)

| Group | Gap | Core Seed | Status | Session |
|---|---|---|---|---|
| 1. Questions→Checklist | question_register mandatory | validate-threshold-intake.mjs | ❌ | S025 |
| 2. Depth levels | depth_tier for non-plans | frontmatter-closed-enums addition | ❌ | S026 |
| 3. Bottlenecks | overload validator | validate-bottleneck-patterns.mjs | ❌ | S027 |
| 4. Splitting | plan split trigger | validate-gradual-bundling.mjs extension | ❌ | S026 |
| 5a. DNA moat | application evidence per element | validate-universal-alignment.mjs enhance | ❌ | S026 |
| 5b. SSoT dead links | dead link detector | validate-dead-links.mjs | ⚠️ advisory (67 broken found S025) | S026 blocking |
| 6. Core Spine | L3 vs L1 contradiction check | validate-spine-hierarchy.mjs | ❌ | S027 |
| 7. Documentation | diataxis_type mandatory + context-export | validate-frontmatter.mjs + context-orchestrator | ❌ | S026 |
| 8. Templates | behavioral-contract.template.md + validator.template.mjs | validate-template-coverage.mjs | ❌ | S025-S026 |
| 9. AI behavior | enforcement rate 70% target + join-forces principle | validate-inner-ai-defaults-enforcement-rate.mjs | ⚠️ | S026 |
| 10. North Star | North Star = C+Z question pair per element | question-protocol.md amendment | ⚠️ | S025 |
| 11. Health | unified health dashboard | tools/health-check.mjs | ❌ | S026 |
| 12. Self-monitoring | this document | THIS FILE | ✅ | S025 |

---

*Authored: S025 | Governor directive: "Create a DNA Protocol of Making Sure That..."*
*Every session close: update §S025 Completion Registry with current status.*
*When all rows show ✅ — the platform truly monitors itself.*
