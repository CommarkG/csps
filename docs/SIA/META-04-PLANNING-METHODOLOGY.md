---
id: SIA.META-04-PLANNING-METHODOLOGY
type: governance
protection_level: protected
status: draft
core_spines: [GVRN, ARCH]
context_question: "What is the CSPS 8-phase planning methodology, and why is each phase necessary before the next?"
context_quote: "Consensus without a seed is not yet real."
version: "0.1"
session: S050
name: "SIA-META-planning-methodology"
description: "Eight-phase CSPS planning methodology including salting with core seeds"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# META-04 — CSPS Planning Methodology

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.

---

## 1. Why a Methodology Is Needed

[TO FILL: Ad hoc planning creates debt. Without a defined process, every new capability or feature is planned differently. Inconsistency accumulates. Some items get researched thoroughly; others go straight to execution. Some get core seeds planted; others live only in chat history. The methodology ensures every significant piece of work follows the same process.]

---

## 2. The 8 Phases

### Phase 1 — BRAINSTORM
Open exploration. All ideas captured. Nothing discarded at this stage.
Big questions first. The Governor's intuitions and the AI's analysis mix freely.
Output: raw material — unstructured but complete.

---

### Phase 2 — STRUCTURE
The brainstorm output is organized into a notebook using the mini tree format.
Consistent naming. Consistent numbering (horizontal + vertical connectivity).
Each path is marked. First layer defined. Second and third layers where known.
Output: SIA notebook (or equivalent structured document).

---

### Phase 3 — SALT
**Core seeds are planted for all consensus items.**

The salting phase is what makes planning durable across tab changes and session transfers. When the Governor and Opus reach consensus on something during planning, a core seed is planted in the codebase immediately. The seed is a file-based marker that `validate-core-seeds.mjs` tracks.

The principle: *"Consensus without a seed is not yet real."*
The seed survives everything: tab closure, session transfer, memory write failure. It lives in git.

[TO FILL: What a core seed looks like in code. What pipeline it routes to in Threshold. How it connects to the PIE's seeds monitor sub-engine.]

---

### Phase 4 — RESEARCH
External validation before building.
What has been verified as successful? What can we learn from existing solutions?
The research order (highest uncertainty first):

1. Node architecture + documentation patterns (Notion, Obsidian, Logseq, etc.)
2. Threshold / intelligent routing (BPM, event sourcing, workflow engines)
3. Hierarchical engine architectures (CQRS, reactive systems)
4. AI behavioral profiling research
5. Context management + depth-activated systems (RAG, hierarchical memory)

Output: research findings that validate or challenge the notebook.

---

### Phase 5 — ITERATE
Revise the notebook based on research findings.
New consensus items get new seeds (Phase 3 repeat for new items).
Output: revised, research-informed notebook.

---

### Phase 6 — RATIFY
The Governor reviews the revised notebook and approves.
The structure is now authoritative. Changes require explicit ratification.
Output: ratified DESIGN-DOC.

---

### Phase 7 — PILOT
One test node. Apply the protocol to one existing, well-understood CSPS artifact.
Observe what breaks. What did the protocol miss? What assumption was wrong?
Revise the protocol based on the pilot.
Output: validated protocol + pilot node as the reference implementation.

---

### Phase 8 — GENERALIZE
Protocol survives two pilot nodes = ready for broader application.
Rollout to all nodes of that type.
Output: generalized implementation + updated documentation nodes.

---

## 3. Which Session Type Per Phase

| Phase | Session Type |
|---|---|
| 1-3 (Brainstorm + Structure + Salt) | ARCH-SESSION |
| 4 (Research) | ARCH-SESSION (Governor does external research separately) |
| 5-6 (Iterate + Ratify) | ARCH-SESSION |
| 7 (Pilot) | MIXED-SESSION or EXEC-SESSION (depending on scope) |
| 8 (Generalize) | EXEC-SESSION |

---

## 4. The Core Seeds Connection

[TO FILL: How core seeds in Phase 3 connect to the PIE's seeds monitor. How the seeds tracker shows which planning-level consensus items are still unfulfilled. How this gives the Governor visibility into planning debt without reading every chat.]

---

*CSPS — SIA | Planning Methodology v0.1 | S050 | Protection: protected (proposed)*
