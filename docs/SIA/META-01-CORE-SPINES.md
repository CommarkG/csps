---
id: SIA.META-01-CORE-SPINES
type: governance
protection_level: sacred
status: draft
core_spines: [GVRN, ARCH]
context_question: "What are the Core Spines of CSPS, what does each govern, and what is the proposed 6th spine?"
context_quote: "Every element belongs to a spine. Every spine belongs to the system."
version: "0.1"
session: S050
name: "SIA-META-core-spines"
description: "The 5 existing Core Spines plus proposed 6th spine definition"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# META-01 — Core Spines

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> Core Spines are the primary classification framework for all CSPS elements.
> Precedence (when spines conflict): GVRN > VALD > ARCH > AI > OPER

---

## 1. The 5 Existing Core Spines

| Spine | Full Name | Governs | Precedence |
|---|---|---|---|
| GVRN | Governance | Decision rights, protocols, ratification, session management | 1st |
| VALD | Validation | Evidence, verification, coverage, audit | 2nd |
| ARCH | Architecture | Data models, schemas, code structure, inheritance | 3rd |
| AI | AI Behavior | Inner defaults, alignment, AI council, profiling | 4th |
| OPER | Operations | Runtime, deployment, infrastructure, scalability | 5th |

### 1.1 The 3-Layer Doctrine

Each spine operates at 3 levels:
- **L1 (Sealed):** Core principles that never change. Governor ratification to create or modify.
- **L2 (Domain):** Domain-specific implementations of the L1 principles.
- **L3 (Instances):** Specific artifacts, validators, contracts generated from L2.

L3 is not designed by hand — it is GENERATED from L2. This is the key to scalability.

---

## 2. The Proposed 6th Core Spine

[DRAFT — Governor names and ratifies scope]

**Concept:** The 5 existing spines cover governance, validation, architecture, AI behavior, and operations. What's missing is the spine that governs how the platform expresses itself, communicates, and presents its understanding.

**Proposed scope:**
- Vocabulary and naming (consistent terms across the entire platform)
- UX/UI principles (how the platform presents information to humans)
- Visual design and hierarchy (the rendered understanding layer)
- Questions as context capsules (recurring questions embedded in nodes)
- Quotes as stability anchors (recurring phrases that orient every element)
- Timing (the Queen — when and how things are presented, not just whether)

**Why a separate spine (not absorbed into existing ones):**
[TO FILL: argument for why this scope doesn't fit cleanly in GVRN, ARCH, or OPER]

**Candidate names for Governor consideration:**
[TO FILL: do not name until Governor ratifies — list candidate concepts without committing to a name]

---

## 3. How Spines Interact

[TO FILL: Spine precedence in practice. When a decision involves multiple spines, which wins? How cross-spine artifacts are classified. The "primary spine + secondary spines" model.]

---

## 4. Spines and the Mini Tree

[TO FILL: At D1, a node loads its primary spine's core principle. At D3, it loads the spine's full L2 domain context. At D5, it loads all spine intersections. The depth level determines how much spine context is active for a given node at a given time.]

---

## 5. Spine Assignments for SIA Components

| SIA Component | Primary Spine | Secondary Spines |
|---|---|---|
| R1.0 Posture Framework | GVRN | AI |
| R1.1 Protocol / Node Schema | ARCH | GVRN |
| R1.2 Documentation Architecture | ARCH | VALD |
| R1.3 Creation Gate | GVRN | ARCH |
| R1.4 Threshold | GVRN | ARCH, OPER |
| R1.5 Tab Types | GVRN | AI |
| R1.6 AI Behavioral Profile | AI | GVRN |
| R1.7 6th Spine | [TBD] | — |
| R2.1 PIE / CIE | AI | OPER, ARCH |
| R3 Journey Framework | ARCH | OPER, 6th Spine |
| Palace Philosophy | GVRN | AI |

---

*CSPS — SIA | Core Spines v0.1 | S050 | Protection: sacred (proposed)*
