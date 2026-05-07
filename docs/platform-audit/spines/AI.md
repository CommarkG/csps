---
id: csps.platform-audit.spine.ai
name: spine-AI
description: >
  Domain card for the AI Core Spine. AI governs how artificial intelligence instances
  behave within CSPS — context management, inner-defaults calibration, the GRACE
  graduated resolution architecture, dual-audience design (human + AI readers),
  and the CDAB (Context Driven AI Behavior) 6-layer model.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: platform_audit
enforcement_stage: active
template_used: domain-card
template_version: "1.0"
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: implementation, href: ../../../plan/pillar-5-ai-systems/ }
  - { rel: inner-ai-defaults, href: ../../../plan/_handoff/VAULT/inner-ai-defaults/ }
  - { rel: context-orchestrator, href: ../platform-services/context-orchestrator.md }
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/inner-ai-defaults/README.md
  - docs/plan/pillar-0-governance/csps-core-manifest.md
  - tools/templates/context-loading/
---

# AI — Artificial Intelligence Spine

## §1 Identity

**What I am:** The layer that governs how AI instances behave inside CSPS. I define what "good AI behavior" means specifically for this platform — not generically, but relative to the CSPS context, conventions, and quality standards.

**Core spine position:** AI (4th precedence, after GVRN/VALD/ARCH).

**Who I am part of:** Platform-level. I govern every AI session that works on CSPS, every subagent spawned, every skill invoked.

**My sub-parts:**
- CDAB (Context Driven AI Behavior) — 6-layer context model
- Inner-AI-Defaults Registry — 10 category files calibrating training defaults
- GRACE Architecture — 5-tier graduated context resolution
- Context Orchestrator — task-class detection + bundle selection
- Dual-Audience Design — single artifacts serving human + AI readers
- B_TOKEN_BUDGET — 8-rule ratified contract for context efficiency
- Escalation Ladders — 4 ladders for adaptive resource management

---

## §2 The Problem I Solve

**Without AI spine:** AI instances bring training defaults into CSPS work:
- Generic naming instead of platform vocabulary
- Reflexive error handling instead of the platform pattern
- Sycophantic agreement instead of principled push-back
- Bulk context loading instead of targeted retrieval
- No memory of session-to-session institutional knowledge

**The compound failure:** An AI that doesn't know the platform builds technically correct code that violates platform conventions. Over 30 apps, this compounds into an unmaintainable platform where each app is slightly different.

**The AI governance gap:** Most AI-integrated platforms don't govern AI behavior. They use AI as a code generator and accept whatever it produces. CSPS treats AI as a governed collaborator — its behavior is declared, calibrated, and validated.

---

## §3 My Principles

**Foundation principles:**
- `P-META-009` — Cognitive Context Architecture (CCA): tokens are investment in reasoning quality; 4 immutable Quality Gates
- `P-META-017` — CSPS-Alignment-Over-Inner-Defaults: training defaults must be registered and overridden when they conflict
- `P-META-020` — Concept-First Governance: context is the compass; CONCEPT_LOAD mandatory before every substantive response

**Key behavioral contracts:**
- `B_TOKEN_BUDGET` (8 rules) — R1 L1-default / R2 model tiering / R3 compact discipline / R4 clear discipline / R5 summary-first / R6 cost measurement / R7 subagent isolation / R8 cache-stable context
- `B_CONCEPT_LOAD` — spine classification mandatory before processing any substantive input
- `B_COGNITIVE_CONTEXT_DISCIPLINE` — 4 Quality Gates immutable
- `B_AI_PROFESSIONAL_VOICE` — direct, push-back when warranted, no sycophancy
- `B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS` — training defaults are calibrated, not accepted

---

## §4 How I Work

**Depth 1 — Executive view:**
Every AI session uses the GRACE architecture: 5 tiers from pre-computed cache (free) to main-context synthesis (full cost). The context orchestrator detects task class on every prompt and injects only the minimum required context bundle. The inner-AI-defaults registry calibrates 10 categories of training behavior against CSPS standards. The 6-layer CDAB model governs what gets loaded when.

**Depth 2 — Operational view:**
On every UserPromptSubmit: the context orchestrator hook fires → detects task class (session-open, engraving, qc-validation, etc.) → reads the matching JSON template → suggests required_artifacts + model_tier. The CONCEPT_LOAD fires → identifies L2 spine domain → activates the relevant conceptual frame. The inner-AI-defaults registry provides reference samples for calibrating behavior in that domain. If the task is heavy (file scanning, validator runs, log analysis), it routes to Tier 3 (Haiku subagent).

**Depth 3 — Implementation view:**
- `user-prompt-submit-context-orchestrator.sh` hook → writes to `tools/context-orchestrator-last-run.json`
- 8 context-loading templates in `tools/templates/context-loading/*.json` (task-class → artifact list)
- `tools/model-tier-registry.yaml` → task_class_to_tier mapping + PE composition → model assignments
- `inner-ai-defaults/*.md` (10 files) → each training default registered with disposition + concept_ref
- B_TOKEN_BUDGET R2: two independent model settings (main session + CLAUDE_CODE_SUBAGENT_MODEL=haiku)
- B_TOKEN_BUDGET R4: /clear only when context >80% (1M context variant — archive value > cache warmth)

---

## §5 Dependencies & Blast Radiuses

**What I depend on:**
- GVRN (B_CONCEPT_LOAD mandated by GVRN; ZF evidence required by GVRN)
- VALD (validators confirm AI behavior compliance)
- Platform Services: Context Orchestrator (the execution engine of GRACE)
- Platform Services: Priority Engine (determines which work gets main-context attention)

**Blast Radiuses:**
- **BR1 (element-level):** Changing one inner-AI-defaults entry — affects one behavior category
- **BR2 (domain-level):** Changing a B_TOKEN_BUDGET rule — affects all sessions, all turns
- **BR3 (platform-wide):** Changing the CONCEPT_LOAD mandate or CDAB layer model — affects every AI instance working on any CSPS artifact

---

## §6 Personas

**Default persona — Governed AI Collaborator:**
Expert colleague. Direct. Pushes back when warranted. Never sycophantic. Cites evidence for every claim. CONCEPT_LOAD fires before every response. Behavior aligns with platform conventions, not training defaults.

**Sub-personas:**
- **Context Orchestrator:** Detects task class, selects bundle, injects minimum viable context
- **Subagent:** Handles heavy isolated work (file scanning, validator runs); returns only summary to main
- **MCP Client:** Queries the knowledge graph on demand; never bulk-loads

**AI behavior in AI domain** (the meta-level):
- *Spine-level:* Every context decision is explainable; every tier escalation is earned
- *Platform-level:* AI behavior is itself governed — inner-defaults are calibrated, not accepted
- *AI-unique:* The AI spine is the only spine that self-governs — it must prevent its own alignment drift

---

## §7 Human Journeys

**Developer journey (building AI-integrated features):**
1. Understand the CDAB 6-layer model (what gets loaded when)
2. Write domain behavior in inner-ai-defaults format (disposition + concept_ref)
3. Use GRACE tiers explicitly: subagents for heavy work, MCP for knowledge, main for synthesis
4. Run `pnpm schema:generate` for AI-related config changes

**External AI advisor journey:**
1. Read this artifact for full AI spine context
2. Query: `get_inner_defaults("code-patterns")` for current calibration
3. Query: `get_context_bundle("your-task-class")` for what context you'll receive
4. Give advice grounded in the actual AI behavioral contracts

---

## §8 Vocabulary

**Terms I own:**
- `CDAB (Context Driven AI Behavior)` — 6-layer model governing what context gets loaded
- `GRACE (Graduated Resolution Architecture for Context Efficiency)` — 5-tier execution model
- `Inner-AI-Defaults` — training-baked patterns registered with disposition (keep/override/adjust)
- `Dual-Audience Design` — single artifact serving both human readers and AI context loading
- `Task Class` — the semantic category of a user prompt (session-open, engraving, qc-validation, etc.)
- `Context Bundle` — the minimum viable set of artifacts for a given task class

**Terms I use:**
- `ZF` — from GVRN (the evidence mandate applies to AI claims)
- `PE compositions` — from Priority Engine (determine which work gets main-context resources)
- `enforcement_stage` — from GVRN (determines which behavioral contracts are mechanically enforced)

---

## §9 MCP Surface

```
get_inner_defaults("category")             → calibration for that behavior category
get_context_bundle("task-class")           → required_artifacts + model_tier
get_behavioral_contract("B_TOKEN_BUDGET")  → full 8-rule contract
get_cdab_layer("1|2|3|4|5|6")            → what each CDAB layer provides
find_by_spine("AI")                        → all AI-governed elements
```

---

## §10 Current State & Evolution

**Implemented today (enforcement_stage: active
template_used: domain-card
template_version: "1.0"):**
- B_TOKEN_BUDGET v2 (8 rules, Governor-ratified S018)
- B_CONCEPT_LOAD (hard NO in AGENTS.md, audit slug registered)
- Inner-AI-Defaults registry (10 files, concept_ref field added S018)
- Context orchestrator hook (advisory mode — detects task class, writes to last-run.json)
- 8 context-loading templates (task-class → artifact bundle)
- Model-tier-registry.yaml (task_class_to_tier + PE composition mapping)
- GRACE architecture defined (5 tiers, 4 monitors, 4 escalation ladders, 12 triggers)

**Planned (enforcement_stage: week-4 / planned):**
- Automatic context injection (Phase 10 — hook injects bundles, not just logs suggestions)
- Parallel subagent fan-out (Composition C — ZF cycles → 5 parallel Haiku agents)
- Domain card MCP queries (Phase 5 — `get_domain_card()` tool in principles-mcp)
- Continuous PE loop (3-dimension PE recomputing on monitor signals)
- Escalation ladder mechanical enforcement (4 ladders as schema artifacts with validators)

---

## §11 Connection Map

| Connected to | How |
|---|---|
| GVRN | AI behavior is governed by GVRN; B_CONCEPT_LOAD is GVRN-mandated |
| VALD | Validators confirm AI behavior compliance; ZF evidence is AI's primary output |
| ARCH | AI queries ARCH schema via MCP; AI enforces ARCH patterns in generated code |
| OPER | AI manages session lifecycle (OPER artifacts like session-state.json) |
| Context Orchestrator | AI spine IS the context orchestrator's governing doctrine |
| Priority Engine | PE determines which work gets Tier 4 (main) vs Tier 3 (subagent) |
| Vocabulary | AI uses platform vocabulary; naming-policy prevents AI invention |
