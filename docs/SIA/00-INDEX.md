---
id: SIA.00-INDEX
type: index
protection_level: sacred
status: draft
core_spines: [GVRN, ARCH, AI, OPER, VALD]
context_question: "What is CSPS, what problem does it solve, and what architecture is being designed?"
context_quote: "Context is the palace."
version: "0.1"
session: S050
name: "SIA-index"
description: "Master index and full context briefing for the Structural Intelligence Architecture"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# CSPS — Structural Intelligence Architecture
## Master Index & Full Context Briefing

> **For external readers:** This document is self-contained. No prior context is assumed.
> Read this file completely before opening any sub-file.
> Every sub-file is also designed to be standalone.

---

## PART 1 — What Is CSPS?

**CSPS (CoreSights Platform Services)** is a governed, multi-tenant SaaS foundry.

Its purpose: any developer building on CSPS writes only domain schema and business logic. Everything else — authentication, multi-tenancy, row-level security, audit logging, AI governance, billing infrastructure, deployment pipeline — is inherited automatically at the moment of project creation (called "forking").

The target output: 30+ independent SaaS applications, each inheriting the full platform foundation, each requiring only the unique delta to be written.

**The technical stack:** pnpm monorepo · Next.js 14 · Clerk (auth) · Supabase (database) · ZenStack (multi-tenancy + row-level security) · Vercel (deployment)

**The governance stack:** 140+ automated validators · 22 runtime hooks · behavioral contracts · AI council (Opus as architect, Sonnet as builder) · Governor (human decision authority)

---

## PART 2 — The Problem Space

### What existing platforms do

Most modern platforms — whether developer platforms (Vercel, Railway, Render), governance systems (internal platforms at Stripe, Shopify, Notion), or AI coding assistants — share a structural pattern:

1. **They build layers of enforcement on top of a weak foundation.** Each failure generates a new rule. Each rule generates enforcement. Each enforcement generates overhead. After enough cycles, the governance system consumes more resources than the product it governs.

2. **Documentation is external to the system.** Docs describe the system but are not part of it. Every system change creates documentation debt. Docs rot. Teams stop trusting them. The system diverges from its documentation silently.

3. **Context is loaded, not inherited.** When a developer (or AI model) starts a new session, they load context from external sources. The context fades with time, tab changes, and model updates. Alignment is constantly re-established rather than structurally guaranteed.

4. **Governance is reactive.** Rules are written after violations occur. The violation class is discovered, a rule is written, enforcement is added. This is always at least one violation behind.

5. **AI behavior is unpredictable under pressure.** AI systems trained on general data revert to training defaults when context pressure increases, when sessions change, or when instructions are ambiguous. There is no structural mechanism to prevent this — only hope that instructions hold.

6. **Scaling governance is expensive.** As platforms grow, the governance surface grows. More validators, more rules, more audits. The cost of maintaining integrity scales with the platform, not with computing.

### The core failure pattern

The fundamental issue is architectural: existing platforms treat governance as a layer on top of the system rather than as the structural property of the system itself. This means every element must carry its own enforcement, its own documentation, its own alignment. The overhead compounds.

---

## PART 3 — CSPS's Unique Core Solutions

CSPS is being redesigned (the Structural Intelligence Architecture, or SIA) around a set of architectural innovations that invert the standard governance model.

### Innovation 1: The Palace Model (Context as Governance)

> *"Context is the palace."*

CSPS operates from the insight that rigid rules always fail at the edges because combinatorial option spaces are infinite — you can never write enough rules to cover every case. But if the context is correct and well-maintained, the context itself provides guidance for everything between the explicit guardrails.

The governance model has three components:
- **The Palace:** Context itself — the environment in which everything operates. When context is correct, alignment is natural.
- **The King:** Alignment — the mechanism that prevents vocabulary drift, duplicate naming, and parallel definitions. Everything is part of a system; nothing stands alone.
- **The Queen:** Timing — the intelligence that determines the right moment for each action. Not just priority by value, but the move that creates maximum leverage for everything that follows.

### Innovation 2: Node Inheritance Architecture

Every element in CSPS is a **node**. Every node:
- Inherits DNA (core spines, behavioral contracts, vocabulary) from its parent node at creation
- Has an attached living document that IS the node (not a description of it)
- Carries a `context_question` and a `context_quote` — mandatory context anchors
- Has a depth level (how much context it loads) and a mini-tree weight (how it participates in context selection)

When a node is created, it is structurally aligned by inheritance. Not by external enforcement. Not by a subsequent audit. By design, at the moment of creation.

This means alignment does not need to be maintained — it is inherited.

### Innovation 3: Threshold as Universal Intake

Every input to the CSPS system — every idea, every instruction, every error, every insight — passes through **Threshold** before touching any platform element.

Threshold classifies, tags, vaults, and routes. It does not process content immediately — it ensures every input lands in the correct predefined pipeline. Nothing is lost. Nothing is processed out of order. Nothing touches the wrong element.

This is not a feature. It is the architectural boundary that makes everything else coherent.

### Innovation 4: The Platform Intelligence Engine (PIE)

Rather than isolated tools (a PE scorer here, a validator there, a learning loop somewhere else), CSPS is building a single Central Intelligence Engine that houses all platform intelligence:

- **Priority Engine:** scores and sequences work by value, readiness, and timing
- **Conflict Detector:** when new insight arrives, flags if it should precede in-flight work
- **Learning Loop:** extracts patterns from sessions and feeds them back into governance
- **Scope Router:** classifies every finding as S1 (instance fix), S2 (process fix), or S3 (structural redesign) — and blocks S1 answers for recurring patterns
- **Seeds Monitor:** tracks architectural promises planted in the codebase

The engine holds all sub-engines at minimal depth by default and activates full depth only when triggered. This prevents cognitive overload while maintaining awareness of everything.

### Innovation 5: Living Documentation

Documentation is not external to the system. Every node has exactly one document. The document IS the node. When the node changes, the document is flagged for update by a propagation hook. When documentation sections are `sealed`, modification requires explicit ratification.

This eliminates documentation debt structurally. The system always describes itself accurately because the document and the system are the same thing.

### Innovation 6: AI Behavioral Profiling

CSPS profiles AI systems — their triggers, their defaults, their satisfaction points. This profile informs how all protocols and contracts are written, so that instructions structurally avoid activating unwanted AI defaults.

The AI satisfaction problem: AI systems are trained to mark things as understood/complete and move on. CSPS builds structural blocks against premature satisfaction — recurring problems must receive structural (S3) solutions, not instance fixes.

This extends to profiling users and adjusting the platform's behavior for different user types.

### Innovation 7: The Mini Tree — Efficiency Through Chunking

Context is organized as a tree. The Platform Intelligence Engine selects which nodes to include (Mini Tree selection) and at what depth level (Depth Level selection) for each task.

These are orthogonal: a node can be included at minimal depth (reminder only) or full depth. The PIE specifies both. This prevents cognitive overload while ensuring that peripheral elements remain accessible as reminders.

---

## PART 4 — Architecture Being Designed (SIA Rounds)

The SIA (Structural Intelligence Architecture) is organized into 4 rounds, each building on the previous.

### Round 1 — Core Foundation
*"What must be true for everything else to be coherent?"*

- **R1.0:** Posture Framework — big questions first, always
- **R1.1:** Protocol (node schema + file type registry + propagation rules)
- **R1.2:** Documentation Architecture (living docs + mini tree within docs)
- **R1.3:** Creation Gate (node without document = blocked)
- **R1.4:** Threshold (all inputs classified, tagged, routed)
- **R1.5:** Tab Type Taxonomy (ARCH-SESSION / MIXED-SESSION / EXEC-SESSION)
- **R1.6:** AI Behavioral Profile (triggers, defaults, satisfaction points, anti-satisfaction contracts)
- **R1.7:** 6th Core Spine (vocabulary + naming + UX/UI + design + timing — name pending Governor ratification)

### Round 2 — Central Intelligence Engine
*"What intelligence does the platform need to serve itself?"*

- **R2.1:** Central Intelligence Engine (CIE + 5 sub-engines at mini-tree depth)
- **R2.2:** Depth Activation Model (which nodes, at what depth, for each task)
- **R2.3:** Planning Hub Wiring (session decisions → automatically registered in platform)
- **R2.4:** AI Conception Vault (how the AI models its own role and decision architecture)
- **R2.5:** Skills-as-Lens Model (skills as activatable session modes, not helper tools)

### Round 3 — Journey Framework
*"What is the complete option space for every journey type?"*

- **R3.1:** L1 Journey Principles (sealed framework)
- **R3.2:** L2 Option Space (all options for developer journey + user journey)
- **R3.3:** L3 Orchestrated Bundles (persona profile → AI-selected bundle from L2)

### Round 4 — Scale and Product
*"How does the platform serve external users at enterprise scale?"*

- **R4.1:** Multi-Tenant Engine (mini tree: core engine + domain sub-engines)
- **R4.2:** Sub-Engine Creation Protocol
- **R4.3:** Dynamic Documentation Audit

---

## PART 5 — Sacred Files and Protection Levels

CSPS uses a protection hierarchy for its architectural documents:

| Level | Meaning | Change protocol |
|---|---|---|
| `draft` | Being designed — subject to change | No restriction |
| `active` | In use — changes require session ratification | Session ratification |
| `protected` | Stable — changes require Governor directive | Governor directive |
| `sacred` | Constitutional — changes require double review + Governor explicit authorization | Governor authorization + verification cycle |

Sacred files are platform invariants. AI systems must not modify them without explicit authorization. This file is marked `sacred` (draft) — meaning it is proposed as sacred, pending Governor ratification of the mechanism.

---

## PART 6 — Reading Guide

**For comprehensive understanding (recommended order):**
1. This file (00-INDEX.md) — full context ✓ you are here
2. [01-MASTER-CONTEXT.md](01-MASTER-CONTEXT.md) — technical deep background
3. [PHI-01-PALACE-PHILOSOPHY.md](PHI-01-PALACE-PHILOSOPHY.md) — the governing philosophy
4. [R1-01-NODE-SCHEMA.md](R1-01-NODE-SCHEMA.md) — the foundational data model
5. [R1-04-THRESHOLD.md](R1-04-THRESHOLD.md) — the intake/routing system
6. [R2-01-PLATFORM-INTELLIGENCE-ENGINE.md](R2-01-PLATFORM-INTELLIGENCE-ENGINE.md) — the intelligence layer

**For specific topics:**

| Topic | File |
|---|---|
| Core Spines (5+1 framework) | [META-01-CORE-SPINES.md](META-01-CORE-SPINES.md) |
| AI behavioral profiling | [R1-06-AI-BEHAVIORAL-PROFILE.md](R1-06-AI-BEHAVIORAL-PROFILE.md) |
| Mini Tree + Depth Levels | [META-02-MINI-TREE-DEPTH.md](META-02-MINI-TREE-DEPTH.md) |
| Journey architecture (L1/L2/L3) | [R3-01-JOURNEY-FRAMEWORK.md](R3-01-JOURNEY-FRAMEWORK.md) |
| Session types (ARCH/MIXED/EXEC) | [META-03-TAB-TYPES.md](META-03-TAB-TYPES.md) |
| Planning methodology (8 phases) | [META-04-PLANNING-METHODOLOGY.md](META-04-PLANNING-METHODOLOGY.md) |
| Sacred files protocol | [META-05-SACRED-FILES.md](META-05-SACRED-FILES.md) |
| What already exists in CSPS | [META-06-EXISTING-FOUNDATION.md](META-06-EXISTING-FOUNDATION.md) |

---

*CSPS — CoreSights Platform Services | SIA v0.1 | S050 | Protection: sacred (proposed)*
