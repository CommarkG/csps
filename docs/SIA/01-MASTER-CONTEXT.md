---
id: SIA.01-MASTER-CONTEXT
type: master_context
protection_level: sacred
status: draft
core_spines: [GVRN, ARCH, AI, OPER, VALD]
context_question: "What is the full technical and philosophical background of CSPS and the SIA design?"
context_quote: "A well-calibrated core allows prompt and accurate build."
version: "0.1"
session: S050
name: "SIA-master-context"
description: "Full technical background for CSPS and the SIA design"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# CSPS — Master Technical Context

> **Standalone document.** Full background for external review.
> See [00-INDEX.md](00-INDEX.md) for reading guide and overview.

---

## 1. The Platform

### 1.1 What CSPS Builds

CSPS is a **multi-tenant SaaS foundry**. It is not a single application. It is the infrastructure from which 30+ applications are generated, each inheriting the platform's complete foundation.

A developer building on CSPS writes:
- A ZenStack domain schema (the data model for their specific domain)
- Business rules and UI components specific to their use case

A developer on CSPS does NOT write:
- Authentication (Clerk, fully configured)
- Multi-tenancy and row-level security (ZenStack + Supabase RLS)
- Audit logging (automatic event capture)
- AI governance layer (Opus/Sonnet relay model)
- Deployment pipeline (Vercel + Supabase, pre-configured)
- Billing infrastructure (inherited)
- Governance validators (140+ run at every commit)

### 1.2 The Technical Stack

| Layer | Technology | Role |
|---|---|---|
| Monorepo | pnpm workspaces | Single repo for platform + all apps |
| Framework | Next.js 14 (App Router) | Every app inherits this |
| Auth | Clerk | Users, sessions, organizations |
| Database | Supabase (PostgreSQL) | Data storage with RLS |
| ORM + tenancy | ZenStack | Multi-tenancy, permissions, RLS generation |
| Deployment | Vercel | Auto-deploy per app |
| AI Council | Opus (architect) + Sonnet (builder) | Governance through AI relay model |

### 1.3 The Relay Model

CSPS uses a **Governor-mediated relay model** for development:

```
Governor (Yariv Fink — human)
    ↕ pastes messages between tabs
Opus tab (Claude Opus) ←→ Sonnet tab (Claude Sonnet)
```

- **Opus:** Architectural advisor. Designs plans (called PROTOs). Does NOT implement.
- **Sonnet:** Builder. Executes ratified plans. Does NOT make strategic decisions.
- **Governor:** Human decision authority. Relays between tabs. Ratifies all decisions.

This model is token-efficient: Opus context stays clean (pure architectural reasoning), Sonnet context stays clean (pure execution). The Governor is the integration layer.

---

## 2. The Governance System

### 2.1 What Exists Today (S050 baseline)

| Component | Count/State | Purpose |
|---|---|---|
| Validators (.mjs) | 140+ | Catch violations at every commit |
| Hooks (.sh) | 22 | Runtime enforcement before AI acts |
| Behavioral contracts | ~57K tokens | Rules for AI behavior |
| Core Spines | 5 (+ 1 proposed) | Architectural domain classification |
| Principles | 30+ (P-META-, P-ARCH-, P-OPER-) | Ratified operating principles |
| Invariants | 5 (complete) | Non-negotiable platform properties |
| Core Seeds | Active (tracked) | Architectural promises in code |
| Planning Hub | Live at Vercel | Visual planning layer |

### 2.2 The 5 Core Spines (Current)

Every CSPS artifact belongs to one primary Core Spine. Precedence: GVRN > VALD > ARCH > AI > OPER.

| Spine | Domain | Governs |
|---|---|---|
| GVRN | Governance | Decision rights, protocols, ratification |
| ARCH | Architecture | Data models, schemas, code structure |
| AI | AI behavior | Inner defaults, alignment, AI council |
| OPER | Operations | Runtime, deployment, infrastructure |
| VALD | Validation | Evidence, verification, coverage |

A 6th Core Spine is under design (see [META-01-CORE-SPINES.md](META-01-CORE-SPINES.md)) — covering vocabulary, naming, UX/UI, visual design, and timing. Name pending Governor ratification.

### 2.3 The DNA System

Every file created in CSPS must carry a `@csps-dna` block — a structured comment that registers the file's governance properties. This block is checked by validators at every commit.

Core Seeds (`@core-seed`) are planted in code when architectural promises are made at the planning level. The seed persists in git — it cannot be lost when tabs close or sessions end. `validate-core-seeds.mjs` tracks which seeds are unfulfilled.

---

## 3. The Problems Being Addressed

### 3.1 Context Drift

AI systems revert to training defaults when:
- Context pressure increases (long sessions)
- Tabs are closed and reopened
- Sessions transfer to new chats
- Instructions are ambiguous

The current CSPS solution: always_include DNA bundles, session-open hooks (T3 enforcement), 25-turn refresh. These work but consume resources on every activation.

**The SIA target:** Alignment is structural (part of the node), not contextual (loaded from outside). A newly created node inherits alignment from its parent. The alignment does not need to be maintained — it is inherited.

### 3.2 Governance Overhead

The current platform has 140+ validators and 22 hooks. Each adds overhead. The pattern: violation discovered → rule written → validator added → more overhead. After enough cycles, governance consumes more resources than the platform.

**The SIA target:** Prevention over detection. The creation gate (R1.3) blocks the violation before it exists. When creation is structurally correct, detection is unnecessary.

### 3.3 Documentation Debt

Documentation describes the system but is not part of it. Every change creates documentation debt. After enough changes, documentation is unreliable.

**The SIA target:** Documentation IS the node. The document and the system are the same artifact. Changing one requires changing the other — mechanically enforced.

### 3.4 Lost Architectural Insights

When sessions end or tabs close, insights discussed in conversation are not automatically captured in the platform. Important decisions are made in chat and never formalized.

**The SIA target:** Threshold + Session Harvest. Every session ends with an automated extraction pass that classifies and routes all insights into the correct pipeline. Nothing is lost.

### 3.5 Isolation of Intelligence Components

The platform has multiple intelligence components that operate in isolation:
- PE scorer (ranks work)
- PMI gate (checks plan maturity)
- findings-categorizer (classifies scope)
- core seeds monitor (tracks promises)
- learning loop (captures session patterns)
- audit hub (9 pipelines, 0 currently running)

None know the others exist.

**The SIA target:** Platform Intelligence Engine (PIE) — a single central engine housing all intelligence components as sub-engines. Each runs at minimal depth by default; full depth activated by trigger.

---

## 4. The SIA Architecture — Summary

The Structural Intelligence Architecture is organized into 4 rounds. Each round is a prerequisite for the next.

**Round 1 — Core Foundation** *(current work)*
Everything starts here. The node schema, the protocol for creating nodes, the Threshold intake system, the AI behavioral profile, the tab type taxonomy. Without Round 1, nothing in Round 2 is coherent.

**Round 2 — Central Intelligence Engine**
The isolated intelligence components consolidated into one engine. The learning loop feeds the AI conception vault. Planning hub wired to session decisions. Skills-as-lens model formalized.

**Round 3 — Journey Framework**
Complete option space for developer journey and user journey. All options exist as nodes. An orchestrator selects bundles per persona profile. Specific journeys (e.g., Alex's cognitive offload app) are L3 instances generated from the L2 option space.

**Round 4 — Scale and Product**
Multi-tenant engine with sub-engine architecture. Scale limited only by compute, not by architectural decisions.

---

## 5. Key Principles (Ratified)

| Principle | Statement |
|---|---|
| P-META-025 | Rules are proxies for intent. Numbers are evidence not targets. Context over data. |
| P-META-026 | Planning before implementing. Never build without a ratified plan. |
| P-ARCH-COMPLETE-DEFAULT | Maximum specification by default. Sub-elements are declared deactivations. |
| B_GRADUAL_BUILD_BY_FOUNDATIONS | Multi-session topics enter via gradual build plan. Each round is a prerequisite. |

---

## 6. Open Questions (As Of S050)

These questions are unresolved and are part of what external review should address:

1. **6th Core Spine:** What is the correct scope and name for the spine covering vocabulary, naming, UX/UI, visual design, and timing?

2. **Node schema:** What fields are truly universal (every node must have them) vs. optional per node type?

3. **Threshold routing:** What is the complete set of predefined pipelines? How does routing stay flexible as the platform grows?

4. **Sacred file enforcement:** The creation gate (R1.3) blocks nodes without documents. What blocks AI from modifying sacred files? Is a hook sufficient, or is a validator + hook + session-open required?

5. **Living documentation synchronization:** When a node changes, how does the system detect which documentation sections need review? What is the propagation model?

6. **AI behavioral profiling:** What is the canonical list of AI triggers, defaults, and satisfaction points? How does this list stay current as models evolve?

---

*CSPS — CoreSights Platform Services | SIA Master Context v0.1 | S050 | Protection: sacred (proposed)*
