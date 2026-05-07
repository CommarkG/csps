---
id: csps.platform-audit.service.ai-behavior
name: service-ai-behavior
description: >
  Domain card for the AI Behavior platform service. Cross-cutting element that calibrates
  how AI instances behave across all 5 spines — CDAB 6-layer model, inner-defaults
  registry, dual-audience design, and the B_CONCEPT_LOAD governance entry. Every spine
  benefits from correctly calibrated AI behavior.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: platform_audit
enforcement_stage: active
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
  - { rel: inner-ai-defaults, href: ../../../../plan/_handoff/VAULT/inner-ai-defaults/ }
  - { rel: cdab, href: ../../../../plan/pillar-0-governance/csps-core-manifest.md }
  - { rel: agents, href: ../../../../AGENTS.md }
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/inner-ai-defaults/README.md
  - AGENTS.md
  - docs/plan/pillar-0-governance/behavioral-contracts.md
---

# AI Behavior — Platform Service

## §1 Identity

**What I am:** The calibration layer for AI behavior across all CSPS domains. Every AI instance working on CSPS — whether on governance, schema, validation, or operations — uses me to align its training defaults with platform conventions.

**Service type:** Cross-cutting — serves all 5 spines. The AI spine owns me; every spine benefits from me.

**My sub-parts:**
- CDAB (Context Driven AI Behavior) — 6-layer model
- Inner-AI-Defaults Registry — 10 category files
- Dual-Audience Design Protocol — single artifacts serving human + AI
- B_CONCEPT_LOAD — mandatory spine classification before every response
- B_AI_PROFESSIONAL_VOICE — direct, push-back, no sycophancy

---

## §2 The Problem I Solve

**Without AI Behavior calibration:** AI training defaults silently override platform conventions. Generic naming appears. Reflexive try/catch is added. Sycophantic agreement replaces principled push-back. Context is bulk-loaded instead of selectively retrieved. Each session, the drift compounds — the AI is gradually working on a different (imaginary) version of the platform.

---

## §3 The CDAB 6-Layer Model

| Layer | What it loads | When |
|---|---|---|
| L1 Static context | AGENTS.md + session-state.json | Always (session-open) |
| L2 Override registry | Inner-AI-Defaults (relevant category) | On CONCEPT_LOAD |
| L3 Decision-time | ZModel policies, validators, domain-specific constraints | When task requires |
| L4 Milestone | Session extractions, handoff context | At phase gates |
| L5 Principle (MCP) | Targeted principle queries on demand | When cited or needed |
| L6 Phase gates | Foundation exit gate, bedrock completion | At phase boundaries |

Currently: Layers 1-4 are advisory (loaded manually). Layer 5 (MCP) is a skeleton. Layer 6 is mechanical (validators). Full GRACE activation makes Layers 1-4 automatic.

---

## §4 Inner-AI-Defaults Registry

10 categories of training behavior, each with disposition (keep/override/adjust) and concept_ref:

| Category | Key override | Concept ref |
|---|---|---|
| code-patterns | No generic naming; use platform vocabulary | ARCH L2 |
| prose-patterns | No narrative comments; no sycophancy | AI L2 |
| reasoning-patterns | No false verification; re-run is proof | VALD L2 |
| output-distribution | Summary first, evidence second, raw last | AI L2 |
| tooling-patterns | No breadth-first tool exploration; targeted reads | AI L2 |
| shiny-object-override | B_COMPLETION_OVER_SHINY governs new items | GVRN L2 |
| core-before-application | Bedrock first, apps after | GVRN L2 |
| rigid-rule-anti-pattern | Rules need WHY + SCOPE + ESCAPE HATCH | GVRN L2 |
| continuous-drift-log | Track model-version-specific behavioral changes | AI L2 |
| push-back-duty | Push-back mandatory when evidence contradicts Governor | AI L2 |

---

## §5 Dual-Audience Design

**The principle:** Every CSPS governance artifact is written to serve both:
- Human readers (context, narrative, why-this-matters)
- AI readers (structured data, explicit relationships, machine-parseable)

**The implementation:** The domain card schema (§1-§11 template) is the dual-audience artifact. It contains narrative context (for humans) and structured fields (for AI context loading and MCP queries). One source, two consumption patterns.

**Current gap:** Most existing artifacts are written for humans. Platform-audit artifacts (this file is one) are the beginning of systematic dual-audience coverage.

---

## §6 Vocabulary

**Terms I own:**
- `CDAB (Context Driven AI Behavior)` — 6-layer model for what gets loaded when
- `Inner-AI-Defaults` — training-baked patterns calibrated for CSPS alignment
- `Dual-Audience Design` — artifacts serving human + AI readers simultaneously
- `Calibration Instrument` — what the inner-ai-defaults registry IS (not a gate; a compass)

---

## §7 MCP Surface

```
get_inner_defaults("category")         → disposition + concept_ref + examples
get_cdab_layer("1-6")                  → what that layer provides + load trigger
get_dual_audience_pattern("artifact")  → human vs AI consumption of that artifact
find_behavior_by_spine("AI")           → all AI-behavioral elements
```

---

## §8 Current State & Evolution

**Active:** Inner-AI-Defaults registry (10 files) + concept_ref field added (S018) + B_CONCEPT_LOAD (hard NO + audit slug registered)

**Planned:** Full MCP Layer 5 (principles-mcp extended with domain cards) + automatic CDAB loading via GRACE injection + dual-audience generation from domain card schema

---

## §9 Connection Map

| Connected to | How |
|---|---|
| All spines | Every spine's AI behavior is calibrated by this service |
| GVRN | B_CONCEPT_LOAD is GVRN-mandated; AI behavior contracts are GVRN-ratified |
| VALD | AI behavior compliance is VALD-validated (inner-ai-defaults freshness validator) |
| Context Orchestrator | AI Behavior service feeds the context orchestrator's bundle selection |
| Vocabulary | AI behavior calibration uses platform vocabulary; never invents terms |
