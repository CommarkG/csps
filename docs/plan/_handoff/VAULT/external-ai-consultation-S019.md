---
id: csps.handoff.vault.external-ai-consultation.S019
name: external-ai-consultation-S019
description: >
  Consultation brief for external AI systems (Perplexity, Gemini, GPT, Claude-external
  or similar). These systems have NO direct access to the CSPS codebase. All context
  must be provided here. The requested response format is: QUESTIONS ONLY — each with
  brief context and reasoning for raising it. This document presents CSPS from first
  principles, starting with fundamentals and expanding outward.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: external_consultations
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S019
links:
  - { rel: parent, href: ./README.md }
  - { rel: opus-brief, href: ./opus-consultation-brief-S019.md }
  - { rel: platform-audit, href: ../../../platform-audit/README.md }
domain_path: platform
---

# External AI Consultation — CSPS Platform Review

---

## Your Persona for This Consultation

You are a **senior technology advisor** who evaluates emerging platforms and infrastructure for scalability, architectural integrity, and long-term viability. You are experienced in: distributed systems, AI-integrated product development, enterprise governance, and SaaS platform architecture.

**Your mandate:** Ask the questions that surface what the platform's creators cannot see from inside the project. You have no emotional investment in CSPS. You have no obligation to be gentle. Your only obligation is to be useful — which means surfacing real concerns, real blind spots, and real contradictions.

**Your style:**
- Questions only (see response format at the end)
- Each question must be specific, answerable, and consequential
- Surface the concerns that WOULDN'T be obvious to someone building the platform
- You are reviewing a design, not validating it

**What you are NOT doing:**
- Suggesting solutions (that's the team's job)
- Validating that the approach is good
- Providing general AI best practices unless they contradict specific CSPS decisions

---

## CRITICAL DECLARATION — Read First

**You are NOT reading about CSP (Core Sights Platform).**

CSP was a prior platform built through 330+ sessions over many months. CSPS (Core Sights Platform **Services**) is a new platform built from scratch, informed by CSP's experience but architecturally distinct.

**Key differences:**
- CSP was discovered and evolved organically. CSPS was designed governance-first from session 1.
- CSP's governance was retrofitted after construction. CSPS's governance is structural — it IS the construction.
- CSPS is built on entirely new technical foundations (Next.js 14, ZenStack, Supabase, ZF orchestrator, 5 Core Spines).
- If you have any knowledge of CSP, set it aside entirely. CSPS shares philosophical lineage but not architecture.

**You have no direct access to the CSPS codebase.** Everything you need to give meaningful feedback is in this document. If you find this document incomplete for your review, note that as a question.

---

## What Is CSPS?

CSPS is a **governed multi-tenant SaaS foundry**. It is not a product — it is the infrastructure that makes building 30+ SaaS products systematically possible.

**The core value proposition:**
An app developer who builds on CSPS should only write: (1) domain schema for their specific app, (2) business logic. Everything else — multi-tenant security, auth, billing, audit, AI governance — is inherited automatically from the platform.

**The current state:**
- 1 app built (apps/task-mgmt) — a team task management SaaS
- Target: 30+ apps, each inheriting the platform's foundation
- Platform bedrock: 95% complete (21/22 items done)

---

## The Fundamental Problem CSPS Solves

Building SaaS products correctly requires solving the same 10 problems every time:

1. **Multi-tenancy** — isolating data between customers so Tenant A never sees Tenant B's data
2. **Authentication** — who is this user? what tenant are they in?
3. **Billing** — when does a subscription activate, expire, change?
4. **Schema migration safety** — adding columns to a live database without breaking existing data
5. **Audit trail** — what happened, when, by whom, for compliance and debugging
6. **AI code generation quality** — AI assistants generate code that violates platform patterns silently
7. **Context preservation** — when the AI working on the platform changes (new session, new chat), institutional knowledge is lost
8. **Alignment drift** — the AI's behavior gradually drifts from platform conventions over time
9. **Evidence discipline** — "I think it's done" ≠ "it's verified done"
10. **Governance debt** — writing rules without mechanical enforcement means rules are suggestions

CSPS solves all 10. The first 5 are infrastructure problems. The last 5 are AI collaboration problems that CSPS treats as first-class governance concerns.

---

## The Architecture — Starting from Fundamentals

### Foundation: The 5 Core Spines

CSPS is organized around 5 Core Spines, each governing a distinct domain. They have a strict precedence order: when spines conflict, higher-precedence wins.

```
GVRN (Governance) — HIGHEST PRECEDENCE
  Governs: decision rights, behavioral contracts, session protocols, the Threshold
  
VALD (Validation) — 2nd
  Governs: 41 active validators, ZF discipline, 13 audit pipelines, evidence standards

ARCH (Architecture) — 3rd
  Governs: schema design, ZenStack RLS, multi-tenancy, foundation slices

AI (Artificial Intelligence) — 4th
  Governs: AI behavior calibration, GRACE context architecture, inner-AI-defaults

OPER (Operations) — LOWEST
  Governs: build order, graduation pipeline, zero-laptop discipline, cost management
```

**How they work together:** GVRN makes the rules. VALD proves the rules are being followed. ARCH defines the data structures the rules govern. AI governs how the AI assistant building the platform behaves. OPER governs how the platform ships.

---

### Layer 1: The Schema (What Data Looks Like)

The platform uses **ZenStack** + **Prisma** for database access.

**ZModel** (ZenStack's schema language) defines:
- Every entity in the database
- The policies controlling who can see/modify what (@@allow/@@deny)

```
// Example: Tenant isolation via ZModel policy
model Task extends Base {
  tenantId     String
  title        String
  @@schema("public")
  @@allow("read",   auth().tenantId == tenantId)
  @@allow("create", auth().tenantId == tenantId)
  @@deny("delete",  true)  // soft-delete only
}
```

**Foundation slices** (permanent, shared across all 30 apps):
- User, Tenant, UserTenant, AuditEvent

**App slices** (specific to one app, extract at graduation):
- Project, Task, TaskComment (for the task management app)

**The drift validator** (validate-foundation-schema-drift.mjs): confirms the ZModel matches the Prisma schema. If they diverge, the security policies are silently broken.

---

### Layer 2: The ZF Discipline (How We Know Things Work)

**ZF = Zero Findings.** This is the evidence discipline that makes claims verifiable rather than aspirational.

**The only valid ZF proof:** The LAST run of pnpm zf:deep producing exactly:
`STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain`

No other output qualifies. Progress toward zero is not zero. Memory of a prior run is not evidence. (This is the most important single rule in the platform. It prevents "I think it works" from being confused with "it's verified.")

**Three ZF levels:**
- Level 1: per-commit (pnpm verify, ~30 seconds)
- Level 2: per-phase boundary (adds PE checks, ~60 seconds)
- Level 3: per-session close (full deep cycle, ~300 seconds)

**41 validators** run automatically at Level 1. They check everything from TypeScript compilation to schema drift to behavioral contract coverage to ZenStack policy consistency.

---

### Layer 3: The Behavioral Contract System (How AI Behaves)

**52 behavioral contracts** (B_*) govern how the AI assistant building the platform must and must never behave.

Selected examples:
- `B_TOKEN_BUDGET` (8 rules): how context is managed — L1 default depth, model tiering, /compact at batch boundaries, /clear only at >80% context saturation
- `B_RESULT_NOT_OUTPUT`: transmission ≠ receipt. A claim is complete only when the receiver demonstrates comprehension, not just acknowledges receipt.
- `B_HUMBLE_EXECUTION_PIPELINE`: ratification ≠ proven. Every ratified plan requires Stage 1 proof (1-3 real cases) before full-scope deployment.
- `B_CONCEPT_LOAD`: before processing any input, the AI must declare which governance spine domain applies.
- `B_PRE_CLOSE_VERIFICATION`: no session closes without ZF evidence — no exceptions.

**Why this matters:** AI assistants have training defaults that conflict with platform conventions (generic naming, eager agreement, declaring done before verification). The contracts override these defaults mechanically.

---

### Layer 4: The GRACE Architecture (How AI Context Is Managed)

GRACE = Graduated Resolution Architecture for Context Efficiency

**The problem:** Loading all governance context on every prompt is too expensive. Loading nothing means the AI operates on training defaults. GRACE resolves this with 5 tiers:

```
Tier 0 — Pre-computed cache    ($0 runtime)   session-state.json, verify results
Tier 1 — MCP query             (~50 tokens)    "what does P-META-006 say?"
Tier 2 — Skill injection       (~500 tokens)   structure (PCR format, ZF framework)
Tier 3 — Subagent isolation    (separate ctx)  file scanning, validator runs (Haiku)
Tier 4 — Main synthesis        (full cost)     Governor interaction, multi-domain reasoning
```

**The anatomy check:** before any task executes, classify it → route to the right tier. Same task type = same tier = predictable cost.

**The context orchestrator** (user-prompt-submit-context-orchestrator.sh): detects task class from every prompt → selects the right context bundle (8 predefined templates) → injects only what's needed.

---

### Layer 5: The CDP — Core Dynamic Plan (How Elements Track Their State)

Every major platform element has a unified lifecycle state:

```
raw → pipeline-intake → pending-ratification → ratified → 
implementing → implemented → zf-achieved → measured → sealed
```

This `cdp_status:` field replaces 5 scattered lifecycle fields that previously made "what is the current state of this contract?" require reading 5 different files.

The CDP connects to the Threshold (the governance routing mechanism) and the Priority Engine (PE) — which sequences all work by scoring every element across 3 dimensions (Work PE × Execution PE × Model PE) and 4 compositions (governance-mode, build-mode, growth-mode, emergency-mode).

---

### Layer 6: The Platform Services (Cross-Cutting Concerns)

5 services serve ALL 5 spines simultaneously:

| Service | What it provides |
|---|---|
| Vocabulary | Every term defined before use — language as governance |
| AI Behavior | CDAB 6-layer calibration, inner-AI-defaults, dual-audience design |
| QC/Audits | 41 validators, 13 pipelines, 4 escalation ladders |
| Priority Engine | 3-dimensional PE, 4 compositions, continuous scoring |
| Context Orchestrator | GRACE tiers, monitors, triggers, escalation |

---

### Layer 7: New Architectural Concepts (S018-S019 Additions)

**Gradual Depth Engine (GDE):** Every element must have predefined L1/L2/L3 depth representations. L1 = executive view (~100 tokens). L2 = operational view (~1500 tokens). L3 = implementation detail (full document). The context orchestrator selects the right depth automatically.

**Question Protocol:** Full Context = F (fundamental data) + C (context connections) + G (goal) + Q (well-defined questions). A well-defined question is "encrypted context and intent" — it preserves the intent even when the implementation is incomplete.

**Core Seeds:** Structured placeholders in code (`// @core-seed: NAME | plan: X | grows-to: Y | target: S0NN`) that make the gap between "designed" and "implemented" visible and auditable.

**Development vs Production Mode:** Two distinct operational contexts that must never be confused. Development mode = tokens as investment in quality. Production mode = tokens as operational cost requiring GRACE optimization.

**Governor Insights Archive:** Accumulating, deduplicated repository of all Governor insights across sessions, connected to CSPS DNA.

---

## How Everything Connects

```
Governor prompt arrives
  → Threshold fires (classifies INPUT, assigns cdp_status: pipeline-intake)
  → CONCEPT_LOAD (which spine governs this?)
  → Context orchestrator (which tier? which bundle?)
  → Priority Engine (what's highest PE? which composition?)
  → Work happens (with appropriate model tier, context depth)
  → ZF validates (did the work produce measurable results?)
  → CEC extracts (what positive discoveries should propagate?)
  → Session close (extraction + HANDOFF + push — nothing lost)
  → Next session opens (HANDOFF is read, state is fresh, nothing re-established from scratch)
```

---

## Current Platform Numbers

| Metric | Value |
|---|---|
| Active validators | 41 |
| Behavioral contracts | 52 |
| Moat elements | 18 |
| Audit slugs registered | 265+ (most at week-4 deferred) |
| Bedrock completion | 95% (21/22 items) |
| Apps built | 1 (apps/task-mgmt — full CRUD, ZenStack RLS active) |
| Domain cards (§1-§11) | 11 (all at template v1.1 with depth_levels) |
| Context window | 1M tokens (Sonnet 4.6) |
| Platform target | 30 SaaS apps |
| Git repository | https://github.com/CommarkG/csps |

---

## Requested Response Format

**Answer with QUESTIONS ONLY.**

Not suggestions, not critiques, not assessments — questions. Each question should be answerable (not rhetorical) and should surface a specific concern, blind spot, or assumption worth examining.

**Format for each question:**
```
Q[N]: [The specific question]
Context: [One sentence — what prompted this question]
Reasoning: [One sentence — why this matters for the platform's success]
```

**Focus areas (but not limited to):**
- Architectural integrity: where are there structural weaknesses?
- Scale: what breaks at 30 apps, 10 developers, 10,000 tenants?
- AI alignment: where is behavioral drift most likely despite the contracts?
- Complexity: where is the overhead unjustified?
- Missing pieces: what important concern is completely absent?
- Contradictions: where do stated goals conflict with current architecture?

**Important:** You are reviewing a PLATFORM under ACTIVE DEVELOPMENT. The goal is to surface what we don't know we don't know — the gaps that won't be visible from inside the project. Be thorough. Be direct. The Governor wants real questions, not gentle ones.
