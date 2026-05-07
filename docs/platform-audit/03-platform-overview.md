---
id: csps.platform-audit.overview
name: platform-audit-overview
description: >
  General presentation of CSPS main parts and how they work together. Explains how
  the platform's qualities (security, consistency, AI-awareness, scalability, governance)
  emerge from the interaction of its components — not from any single component alone.
  Includes GRACE architecture, the 5 spines, the PE system, and the quality loop.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD, OPER]
schema_anchor: platform_audit
enforcement_stage: active
tags:
  - domain:governance
  - domain:platform
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ./README.md }
  - { rel: problems, href: ./01-problems.md }
  - { rel: principles, href: ./02-csps-principles.md }
  - { rel: bedrock, href: ../../plan/pillar-0-governance/csps-bedrock.md }
  - { rel: core-manifest, href: ../../plan/pillar-0-governance/csps-core-manifest.md }
---

# CSPS Platform Overview

> **The platform's qualities don't come from any single component. They emerge from the interaction of 5 spines, 5 platform services, 50 behavioral contracts, 41 validators, and a dynamic orchestration layer. This document explains the architecture of that emergence.**

---

## The Three-Layer Model

```
LAYER 0 — Platform Services (cross-cutting, serve all spines)
  Vocabulary | AI Behavior | QC/Audits | Priority Engine | Context Orchestrator

LAYER 1 — Core Spines (the 5 domains, in precedence order)
  GVRN > VALD > ARCH > AI > OPER

LAYER 2 — Application Layer (30 SaaS apps)
  Each app inherits Layer 0 + Layer 1 automatically
  App only writes: domain schema + business logic
```

**The key insight:** An app developer should never write multi-tenancy code, auth handlers, billing triggers, or audit events. They should never configure ZF gates or write behavioral contracts. All of that is Layer 0 + Layer 1. The app inherits it.

---

## The 5 Core Spines

### GVRN — Governance (Precedence: Highest)
*What it governs:* Decision rights, ZF discipline, behavioral contracts, session protocols, the Threshold.

GVRN governs how the platform governs itself. When a GVRN principle conflicts with any other spine, GVRN wins. The Threshold (session-open governance gate) is GVRN. The ZF mandate is GVRN. The handoff protocol is GVRN.

**Key artifacts:** AGENTS.md | behavioral-contracts.md (50 contracts) | zf-mandate-protocol.md | threshold-gate-v2.md | session-state.json

### ARCH — Architecture (Precedence: 3rd)
*What it governs:* Schema design, multi-tenancy, ZenStack RLS, foundation slices, the graduation path.

ARCH governs the data model and infrastructure. Every app's schema inherits from ARCH. Multi-tenant isolation is an ARCH constraint. The ZenStack `@@allow` rules are ARCH. The graduation pipeline (app extracts at $1K MRR) is ARCH.

**Key artifacts:** libs/policies/schema.zmodel | apps/task-mgmt/prisma/schema.prisma | validate-foundation-schema-drift.mjs | csps-layer-separation.md

### AI — AI Behavior (Precedence: 4th)
*What it governs:* How AI instances behave within CSPS — context management, inner-defaults calibration, GRACE architecture, dual-audience design.

AI governs the AI layer itself. B_TOKEN_BUDGET, B_CONCEPT_LOAD, B_COGNITIVE_CONTEXT_DISCIPLINE are all AI spine. The GRACE architecture (graduated resolution) is AI spine. The context orchestrator is AI spine.

**Key artifacts:** inner-ai-defaults/ (10 files) | context-orchestrator.sh | context-loading templates (8) | model-tier-registry.yaml | AGENTS.md

### VALD — Validation (Precedence: 2nd)
*What it governs:* The 41 active validators, ZF levels (1/2/3), 13 audit pipelines, the evidence discipline.

VALD governs how the platform proves it works. Every DONE claim passes through VALD. The ZF orchestrator is VALD. The pre-close verification gate is VALD. The 41 validators are VALD.

**Key artifacts:** tools/verify.mjs | tools/zf-orchestrator.mjs | tools/validators/*.mjs (41) | audit-runner.md | audit-hub.md

### OPER — Operations (Precedence: Lowest)
*What it governs:* Build order, graduation pipeline, cost management, zero-laptop discipline, delivery.

OPER governs how the platform ships and scales. The 12-week build order is OPER. The graduation pipeline ($1K MRR trigger) is OPER. The per-tenant cost attribution is OPER.

**Key artifacts:** pillar-6-operations-and-delivery/ | build-order.md | graduation-pipeline.md | cost-economics.md | validate-git-pushed-state.mjs

---

## The 5 Platform Services

These are cross-cutting elements that serve ALL 5 spines simultaneously. They have no spine allegiance — they are the connective tissue.

| Service | What it provides | Canonical home |
|---|---|---|
| **Vocabulary** | Every term defined before use. Language as governance. | vocabulary.md + naming-policy |
| **AI Behavior** | CDAB 6 layers. Inner-defaults calibration. Dual-audience design. | inner-ai-defaults/ |
| **QC & Audits** | 41+ validators, 13 pipelines, escalation ladders. Evidence gates. | audit-runner.md + audit-hub.md |
| **Priority Engine** | Continuous work sequencing. 3-dimension PE. 4 compositions. | pe-compute.mjs + model-tier-registry.yaml |
| **Context Orchestrator** | GRACE 5-tier architecture. Monitors, triggers, escalation. | context-orchestrator.sh + context-loading templates |

---

## The GRACE Architecture

GRACE (Graduated Resolution Architecture for Context Efficiency) governs how computational resources are allocated. Every task earns its tier by proving a cheaper tier is insufficient.

```
TIER 0 — Pre-computed cache     ($0 runtime)    Session-state, PE ranking, verify status
TIER 1 — MCP query              (~50 tokens)    Principle lookup, domain card query
TIER 2 — Skill injection        (~500 tokens)   PCR structure, cruel-critic framework
TIER 3 — Subagent isolation     (separate ctx)  File scanning, validator runs, log analysis
TIER 4 — Main context synthesis (full cost)     Governor interaction, multi-domain synthesis
```

The context orchestrator detects task class on every prompt → selects the minimum viable context bundle → injects it. The PE determines what gets Tier 4 attention vs Tier 3 isolation.

---

## The Quality Loop

Platform quality doesn't come from writing good code once. It comes from a continuous loop:

```
BUILD something (ARCH)
  ↓
VALIDATE it (VALD — pnpm verify, ZF gate)
  ↓
EXTRACT discoveries (AI — CEC positive, catch-to-engraving negative)
  ↓
ENGRAVE them (GVRN — behavioral contracts, validators, AGENTS.md)
  ↓
OPERATE with them (OPER — new capability in production)
  ↓
BUILD the next thing on a stronger foundation
  ↓
[loop]
```

Each iteration of the loop makes the next iteration faster, safer, and more capable. This is why CSPS can inherit from CSP's 330+ sessions of learning in 2 sessions — the extraction + engraving mechanism compounds.

---

## The Bedrock Model

Before any app is built, the bedrock must be complete. Bedrock = the set of platform capabilities every app inherits automatically.

```
BEDROCK (what every app gets for free)
  Layer 1: Governance Core      ✅ COMPLETE (S016)
    - 5 Core Spines + 55 principles + 50 contracts + 41 validators + 19 hooks
  
  Layer 2: Schema Security Core ✅ 9/9 (S017-S018)
    - ZenStack 2.22.1 + foundation slices + ZModel @@allow + drift validator
  
  Layer 3: Auth + Billing Core  ✅ COMPLETE
    - Clerk webhooks + JWT tenantId + Stripe billing trigger + AuditEvent
  
  Layer 4: App Template Core    95% (ZenStack-integrated template pending = S018)
    - Next.js 14 + Tailwind + Clerk + Stripe + Prisma + ZenStack
  
  Layer 5: Build Methodology    ✅ COMPLETE (S016)
    - gradual-build template + ZF orchestrator + B_HUMBLE_EXECUTOR
```

**When bedrock is 100% complete:** An app developer forks the template, defines their domain schema, writes business logic, and ships — with multi-tenancy, auth, billing, audit, ZenStack RLS, and governance already working.

---

## How the Platform Produces Its Qualities

| Quality | How it emerges |
|---|---|
| **Multi-tenant security** | ZenStack @@allow rules (ARCH) + foundation slices (ARCH) + JWT tenantId (OPER) |
| **Consistency** | Vocabulary canon (Platform Service) + 50 behavioral contracts (GVRN) + 41 validators (VALD) |
| **AI-awareness** | CDAB 6 layers (AI) + B_CONCEPT_LOAD (AI) + dual-audience design (AI) |
| **Scalability** | GRACE architecture (AI) + Tier 3 subagent isolation (AI) + PE compositions (Platform Service) |
| **Governance** | ZF discipline (VALD) + Triad Governance (GVRN) + catch-to-engraving loop (GVRN) |
| **Compounding** | CEC positive extraction (GVRN) + structural prevention discipline (GVRN) + learning loop (AI) |

No quality is produced by one component. Each quality is an emergent property of multiple components interacting correctly. This is why CSPS is more than "a Next.js starter kit with good docs" — the docs are enforced, the enforcement is validated, the validation is evidenced.

---

## The Innovation Frontier

The platform-core-alignment plan (S018) defines the next layer of innovation already in progress:

1. **Domain Card Architecture** — every element is self-describing through a structured schema artifact that serves both human and AI readers simultaneously
2. **GRACE full activation** — pre-computation, parallel subagent fan-out, MCP knowledge graph as query backbone
3. **Continuous PE** — 3-dimensional PE with 4 compositions selected by escalation ladder signals
4. **Escalation Ladders** — 4 defined ladders (context pressure, blocking event, task complexity, blast radius) making orchestration adaptive not reactive

These are the next platform generation. Current platform is the foundation they build on.
