---
id: csps.platform-audit.service.priority-engine
name: service-priority-engine
description: >
  Domain card for the Priority Engine platform service. Governs work sequencing
  across all 5 spines using a continuous 3-dimensional PE formula with 4 composition
  modes. The PE is not a one-time ranking — it is a live score that recalculates
  on every monitor signal. Cross-cutting: every spine's work is PE-scored.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: platform_audit
enforcement_stage: active
template_used: domain-card
template_version: "1.1"
depth_levels:
  l1: "3-dimensional PE formula, 4 compositions, continuous PE loop driven by monitor signals"
  l1_tokens: 120
  l2: "Work PE × Execution PE × Model PE, governance/build/growth/emergency compositions"
  l2_tokens: 1500
  l3: "See full document. Connection map at §11."
  l3_location: "./priority-engine.md#section"
tags:
  - domain:governance
  - domain:platform
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: implementation, href: ../../../../../tools/pe-compute.mjs }
  - { rel: model-tier-registry, href: ../../../../../tools/model-tier-registry.yaml }
consolidation_cross_refs:
  - tools/pe-compute.mjs
  - tools/model-tier-registry.yaml
  - docs/plan/_handoff/VAULT/topic-plans/platform-core-alignment.md
---

# Priority Engine — Platform Service

## §1 Identity

**What I am:** The work sequencing layer of CSPS. I determine what gets done next, where it gets executed, and with which AI capability level. I am continuously involved in every orchestration decision — not a one-time ranking.

**Service type:** Cross-cutting — every spine's work is PE-scored. GVRN spine owns me (decisions are sequenced); every spine is sequenced by me.

**My sub-parts:**
- 3-Dimension PE Formula (Work PE × Execution PE × Model PE)
- 4 PE Compositions (governance-mode / build-mode / growth-mode / emergency-mode)
- Escalation Multipliers (ladder rungs modify PE scores in real-time)
- B_COMPLETION_OVER_SHINY (active work gets 1.5× weight)
- B_PE_ALIGNMENT_GUARDIAN (anti-sycophancy: deflects when misaligned with PE top)

---


## §6 Personas

**Default persona:** Platform operator / AI instance working in the Priority Engine domain.

**AI personas operating here:**
- **Persona 1 (Governed AI Collaborator)** — executes all Priority Engine work
- **Persona 2 (ZF Orchestrator)** — validation cycles for this domain
- **Persona 3 (Haiku Scout)** — mechanical scans and lookups
- **Persona 4 (Expert Council)** — advisory reviews via skills

See [ai-personas.md](../ai-personas.md) for full definitions.

**AI behavior in this domain:**
- *Spine-level:* Follows the domain's principle hierarchy
- *Platform-level:* CONCEPT_LOAD mandatory; B_RESULT_NOT_OUTPUT governs handoffs
- *Domain-unique:* Per §3 principles

---

## §7 Human Journeys

**Developer journey:** Apply Build Alignment Protocol (goal → architecture → user journeys → ZF gate).

**External AI advisor journey:** Receive context package → answer 3 comprehension questions → structured review → Governor review before integration.

See [ai-personas.md Persona 5](../ai-personas.md).

---
## §2 The Problem I Solve

**Without PE:** Work is driven by what feels urgent or what the AI is excited about. Shiny new items displace 80%-complete work. Foundation items lose to features. Governance loses to coding. Each session the platform makes progress in one direction while accumulating debt in three others.

**The shiny-object failure mode:** AI starts a new feature while 80%-complete work sits idle. The new feature hits 80% and gets abandoned for the next shiny thing. Platform has 12 half-done features and no shipped capabilities.

---

## §3 The 3-Dimension PE Formula

```
PE_final = (Work PE × composition_weight)
         × (Execution PE)
         × (Model PE)
         × escalation_multiplier

Work PE = breadth × depth × impact ÷ dep_satisfied ÷ multi_session_cost
        × 1.5 if active work >50% (B_COMPLETION_OVER_SHINY)
        × 0 if BLOCKING VLT (emergency-mode override)

Execution PE = task_complexity × cross_domain_refs × real_time_decision_required

Model PE = task_class_tier_rating × blast_radius_tier_modifier
```

**Dimension 1 — Work PE (what to do next):**
Traditional PE. Breadth (how many things benefit) × depth (how fundamental) × impact (value delivered) ÷ dep_satisfied (how many dependencies met) ÷ multi_session_cost (how many sessions needed).

**Dimension 2 — Execution PE (where to execute):**
Novel CSPS contribution. Low-execution-cost tasks → Tier 0-1 (cache, MCP). High-execution-cost isolatable tasks → Tier 3 (subagent). Cross-domain synthesis → Tier 4 (main context only).

**Dimension 3 — Model PE (which AI capability):**
From model-tier-registry.yaml: MECHANICAL_SCAN (Haiku) → STANDARD_BUILD (Sonnet) → DEEP_REASONING (Opus). Escalates with blast radius. Never downgrades during active work (QG1 immutable).

---

## §4 The 4 PE Compositions

Compositions select the weight matrix that applies. Selected by the context orchestrator based on monitor signals and escalation ladder rungs.

**governance-mode** (trigger: GVRN directive, ZF gate, constitutional decision)
- GVRN × 2.0, VALD × 1.5, ARCH × 1.0, AI × 0.8, OPER × 0.5

**build-mode** (trigger: implementation batch, schema work, coding)
- ARCH × 2.0, VALD × 1.5, GVRN × 1.0, OPER × 0.8, AI × 0.5

**growth-mode** (trigger: app #2+, marketing, revenue, graduation)
- OPER × 2.0, ARCH × 1.5, GVRN × 1.0, VALD × 0.8, AI × 0.5

**emergency-mode** (trigger: BLOCKING validator, new PENDING VLT)
- Blocking items PE = ∞ (override all). All non-blocking PE = 0.
- B_COMPLETION_OVER_SHINY: suspended

---

## §5 Continuous PE Loop

```
MONITOR SIGNAL fires
  ↓
ESCALATION LADDER evaluates
  ↓
PE COMPOSITION selected (based on rung)
  ↓
PE RECOMPUTES (3 dimensions, new composition weights)
  ↓
TIER SELECTION updated (which tier handles this task)
  ↓
EXECUTION (the actual work)
  ↓
OUTCOMES (feed back to monitors)
  ↓
[loop continues on next signal]
```

The PE is not computed once per session. It recalculates whenever:
- A VLT status changes (new PENDING or RESOLVED)
- A phase gate closes (new phase opens)
- Context utilization crosses a ladder threshold
- The Governor provides new priority input

---

## §6 Vocabulary

**Terms I own:**
- `PE composition` — a weight matrix selecting spine priorities for a given context
- `Escalation multiplier` — the PE modifier applied when an escalation ladder rung fires
- `IMPL_BATCH boundary` — the event that triggers PE recomputation and compact
- `Shiny-object trap` — starting new work while active work is >50% complete

---

## §7 MCP Surface

```
get_pe_composition("governance|build|growth|emergency")   → weight matrix
get_current_pe_ranking()                                   → top-N items by PE score
get_escalation_multiplier("ladder-rung")                   → current modifier
get_completion_over_shiny_status()                         → active work + 1.5× items
```

---

## §8 Current State & Evolution

**Active:** B_COMPLETION_OVER_SHINY enforced + B_PE_ALIGNMENT_GUARDIAN + pe-compute.mjs (manual invocation) + model-tier-registry.yaml (task_class_to_tier)

**Planned:**
- 4 PE compositions as schema artifacts (platform-core-alignment L phase)
- Continuous PE loop (recalculates on monitor signals, not just session boundaries)
- PE orchestrator selecting compositions based on escalation ladder states
- `get_pe_ranking()` as MCP tool (real-time queryable)

---

## §9 Connection Map

| Connected to | How |
|---|---|
| GVRN | GVRN decisions are top of the priority queue; PE sequences their execution |
| VALD | Blocking VLTs → emergency-mode PE → all other work PE = 0 |
| AI | PE dimension 3 (Model PE) determines which AI tier handles each work item |
| OPER | Build order provides the dependency graph that PE respects |
| Context Orchestrator | PE composition selection drives context bundle selection |
| QC/Audits | Escalation ladder signals from audits feed PE recalculation |

## §10 Current State & Evolution

**Active:** Core functionality described in §4.

**Planned (enforcement_stage: week-4 / planned):**
- Full §8/§9 vocabulary and MCP expansion (S019)
- AI personas integration (ai-personas.md reference active)

---

## §11 Connection Map

| Connected to | How |
|---|---|
| GVRN | Governed by GVRN principles; ratification required for changes |
| VALD | Validators enforce this domain's quality standards |
| AI | AI personas operate in this domain per ai-personas.md |
| Platform Services | Cross-cutting — connects to all other platform services |
