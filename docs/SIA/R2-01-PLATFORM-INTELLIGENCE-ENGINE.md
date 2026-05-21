---
id: SIA.R2-01-PLATFORM-INTELLIGENCE-ENGINE
type: architecture
protection_level: protected
status: draft
core_spines: [AI, OPER, ARCH]
context_question: "How does the CSPS Platform Intelligence Engine consolidate isolated intelligence components into one coherent system?"
context_quote: "One central engine. Sub-engines activated by need. Intelligence scales with compute, not with architecture."
version: "0.1"
session: S050
name: "SIA-R2-platform-intelligence-engine"
description: "Central Intelligence Engine consolidating PE, learning loop, scope router, seeds monitor, doc engine"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# R2.1 — Platform Intelligence Engine (PIE)

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> PIE consolidates 5 existing isolated CSPS systems into one engine.

---

## 1. The Problem PIE Solves

[TO FILL: Five intelligence components currently operate in isolation in CSPS. None knows the others exist. Each makes decisions in a vacuum. The result: the PE ranks items without knowing if they're ready; the learning loop captures patterns that the PE never uses; the scope router sends S3 findings to threshold but threshold has no pipeline to the PE.]

---

## 2. The Architecture — Mini Tree Engine

PIE follows the mini tree model:

```
Central Intelligence Engine (CIE) — root
├── PE Sub-engine        [D1 always active → full activation: session start, new item]
├── Learning Loop        [D1 always active → full activation: session close, K≥2 pattern]
├── Scope Router         [D1 always active → full activation: S3 classification]
├── Seeds Monitor        [D1 always active → full activation: seed overdue]
└── Documentation Engine [D1 always active → full activation: node change]
```

[TO FILL: What "D1 always active" means for each sub-engine. What information is held at D1 vs. what requires full depth activation.]

---

## 3. The PE Sub-engine (The Queen Lives Here)

### 3.1 Current PE Formula

```
pe_score = urgency × impact / SPI_estimate
```

4 bands: must-do | should-do | could-do | skip

### 3.2 The Missing Dimension — Timing (The Queen)

[TO FILL: The Queen's question: "What is ready NOW that creates maximum leverage for everything that follows?" This is different from pure urgency × impact scoring. The Queen considers: what move at this moment creates the most enabling conditions for the next moves?]

### 3.3 Conflict Detector (New Component)

[TO FILL: When a new item arrives, the conflict detector checks: does this item have dependency relationships with items currently in the execution queue? If a new item should PRECEDE in-flight work, a SEQUENCING CONFLICT is raised to the Governor.

Format: "PE SEQUENCING CONFLICT: [New item] may need to precede [in-flight item]. Reason: [architectural dependency]. Governor decision required."]

### 3.4 Readiness Gate (New Component)

[TO FILL: Before any item can execute, the readiness gate checks: is this item's architectural foundation established and stable? PMI gate is the existing item-level check. This is the layer-level check: is Round 1 established before Round 2 items can execute?]

---

## 4. The Learning Loop Sub-engine

[TO FILL: Current state — post-stop-learning-loop.sh exists but is likely a stub. Target state: full session extraction + pattern detection + contract proposal pipeline.

The expanding spiral: session observation → vault → pattern extraction (K≥2) → B_* contract proposal → T1/T2/T3 enforcement → future sessions behave better → richer observations → deeper patterns → expanded governance]

---

## 5. The Scope Router Sub-engine

[TO FILL: Built on findings-categorizer.mjs. S1/S2/S3 classification. The anti-satisfaction gate: S1 answer for a K≥2 recurring pattern → BLOCKED → S3 path required. The King's mechanism: the scope router is how alignment is maintained over time.]

---

## 6. Depth Activation Model (R2.2)

[TO FILL: Each task specifies for each sub-engine: (a) include in Mini Tree? (b) if yes, at what depth?

Example task configuration:
- PE Sub-engine: D3 (full scoring for this session's items)
- Learning Loop: D1 (reminder only — session not closing)
- Scope Router: D1 (reminder — no findings to classify yet)
- Seeds Monitor: D2 (check overdue seeds but don't load full seed specs)
- Documentation Engine: D1 (not modifying docs this session)

This prevents cognitive overload while ensuring all components remain "present" in awareness.]

---

## 7. Relationship to Existing CSPS Components

| Existing component | PIE role |
|---|---|
| pe-agent skill (unified-plan.yaml) | Becomes the PE sub-engine's UI layer |
| validate-plan-readiness.mjs | Feeds the readiness gate |
| findings-categorizer.mjs | Becomes the scope router sub-engine core |
| validate-core-seeds.mjs | Becomes the seeds monitor sub-engine core |
| post-stop-learning-loop.sh | Becomes the learning loop sub-engine trigger |
| audit-hub.md (9 pipelines) | Connects to the documentation engine sub-engine |

---

## 8. Open Questions

1. Should the CIE be a single file or a directory of coordinated files?
2. What is the schema contract at the integration boundary between sub-engines?
3. How does CIE maintain state between sessions? (Core seeds? YAML state files?)

---

*CSPS — SIA | Platform Intelligence Engine v0.1 | S050 | Protection: protected (proposed)*
