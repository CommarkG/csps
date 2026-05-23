---
id: SIA.R2-01-PLATFORM-INTELLIGENCE-ENGINE
type: architecture
protection_level: protected
status: ratified
core_spines: [AI, OPER, ARCH]
context_question: "How does the CSPS Platform Intelligence Engine consolidate isolated intelligence components into one coherent system?"
context_quote: "One central engine. Sub-engines activated by need. Intelligence scales with compute, not with architecture."
version: "1.0"
session: S056
name: "SIA-R2-platform-intelligence-engine"
description: "Central Intelligence Engine consolidating PE, learning loop, scope router, seeds monitor, doc engine"
owner: "group:finky"
lifecycle: "production"
lifecycle_state: "active"
inherits_from: "Platform Genome §3 Priority Engine + §6 Core Seeds + CORE-COMPLETE-EXIT-CRITERIA.md Layer 2"
---

# R2.1 — Platform Intelligence Engine (PIE)

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> PIE consolidates 5 existing isolated CSPS systems into one coherent engine.
> Design: RATIFIED S056 | Build target: S056-S057

---

## 1. The Problem PIE Solves

Five intelligence components currently operate in isolation in CSPS:

| Component | Current state | The gap |
|---|---|---|
| pe-compute.mjs | Ranks items by urgency × impact / SPI | Doesn't know if a high-PE item's architectural foundation exists |
| post-stop-learning-loop.sh | Stub — fires but doesn't extract | K≥2 patterns never feed back into PE scoring |
| findings-categorizer.mjs | Classifies findings as S1/S2/S3 | S3 findings never block S1 fixes from being applied |
| validate-core-seeds.mjs | Checks if seeds are current | Overdue seeds don't escalate to anything |
| audit-hub.md (9 pipelines) | Documents what to audit | Documentation changes have no auto-trigger to sync |

**The result:** the PE ranks items without knowing if they're ready. The learning loop captures patterns that the PE never uses. A K=5 recurring gap doesn't automatically escalate to a structural fix. An app item can start before its Core layer exists.

**PIE solves this** by making all 5 components aware of each other through the CIE root, which holds shared session state and routes signals between sub-engines.

---

## 2. The Architecture — Mini Tree Engine

PIE follows the mini tree model:

```
Central Intelligence Engine (CIE) — root
├── PE Sub-engine        [D1 always active → full activation: session start, new item]
├── Learning Loop        [D1 always active → full activation: session close, K≥2 pattern]
├── Scope Router         [D1 always active → full activation: S3 classification needed]
├── Seeds Monitor        [D1 always active → full activation: seed overdue]
└── Documentation Engine [D1 always active → full activation: node change detected]
```

**D1 = Awareness Layer.** At D1, a sub-engine is present in session context as a status reminder only. No full computation. No loading of full data. Just: "here is my current alert status."

D1 output per sub-engine (what's held in minimal context):
- **PE D1:** "Top-3 PE items by score. Any sequencing conflicts with current work? [No / Yes: description]"
- **Learning Loop D1:** "K counts for this session. Session closing? No → tracking only."
- **Scope Router D1:** "Any S3 findings queued? No → monitoring. Yes → escalate."
- **Seeds Monitor D1:** "Any seeds overdue? No → nominal. Yes → alert: [seed name]."
- **Documentation Engine D1:** "Any node changes needing doc sync? No → nominal. Yes → [node list]."

**Full activation** = when D1 alert fires "Yes" OR when the sub-engine's trigger event occurs.

**D-levels defined:**
- D1: awareness — reminder only, no computation
- D2: active scan — check for issues, produce status report
- D3: full activation — compute, propose, generate artifacts

---

## 3. The PE Sub-engine (The Queen Lives Here)

### 3.1 Current PE Formula

```
pe_score = urgency × impact / SPI_estimate
```

4 bands: must-do | should-do | could-do | skip

### 3.2 The Queen — Timing Dimension

The Queen's question: **"What foundational move RIGHT NOW creates maximum forward leverage?"**

This is different from urgency × impact alone. The Queen considers: what move at this moment creates the most enabling conditions for the next moves? An item that unblocks 5 others scores higher than an item with equal PE score that unblocks nothing.

**Queen timing score:**
```
timing_score = (count_of_items_unblocked × 0.3) + (prerequisites_met ? 1.0 : 0.0)
pe_adjusted = pe_base × timing_score
```

Examples:
- INFRA-FLOW-VALIDATION unblocks COMPONENT-LIBRARY + APP-001 + JOURNEY-FRAMEWORK → timing_score boost
- An app item with prerequisites NOT met → timing_score 0 → pe_adjusted = 0 regardless of pe_base

The Queen feeds into PE as a readiness multiplier. An item is not "ready" just because it has a high score — it must also have its prerequisites satisfied.

### 3.3 Conflict Detector

When a new item I arrives in the queue:
1. Check I's dependencies: does I depend on any item J currently in-flight?
2. Check I's enablement: does I enable any item K that is already queued ahead of it?
3. If (2): **SEQUENCING CONFLICT** — I should precede K. Raise to Governor.

Format:
```
PE SEQUENCING CONFLICT: [I] should precede [K].
Reason: [I is an architectural prerequisite for K].
Current queue position: I=[N], K=[M < N].
Governor decision required: reorder or accept risk.
```

This is what caught the S055 re-ordering: APP-001 was queued before Core layers were complete.

### 3.4 Readiness Gate

Before an item moves from `planning` → `implementing`, the Readiness Gate checks its architectural layer:

| Item layer | Gate condition |
|---|---|
| R1 Schema items | No prerequisite — they ARE the foundation |
| R2 Intelligence items | R1 Layer 1 exit criteria: 4/4 must pass |
| R3 Developer Journey items | R2 Layer 2 exit criteria must pass |
| R4 Frontend Inheritance items | R3 Layer 3 must pass |
| App items | R4 Layer 4 must pass + Developer Journey ratified |

Source: `docs/plan/pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md`

If gate fails: item stays in `planning`. Status updated: `blocked_on: LAYER-N-INCOMPLETE`.

---

## 4. The Learning Loop Sub-engine

**Current state:** `post-stop-learning-loop.sh` exists but is a stub — fires on session stop but extracts nothing.

**Target state — the expanding spiral:**
```
Session observation
  → vault entry (gap-recurrence-register.yaml / improvement-register.yaml)
  → K count increments
  → at K≥2: Learning Loop proposes B_* contract draft → pending-plan-items.yaml
  → Opus ratifies
  → T1+T2+T3 enforcement built
  → future sessions behave better
  → richer observations → deeper patterns → expanded governance
```

**Phase 1 build (S056 target):**
1. At session stop: scan gap-recurrence-register.yaml for entries where K≥2 AND no structural fix committed
2. For each: generate a draft entry in pending-plan-items.yaml with:
   - `source: gap_[ID]`
   - `k_count: [N]`
   - `proposed_fix: [structural fix description based on gap note]`
   - `priority: K≥3 = BLOCKING / K=2 = ADVISORY`
3. Scan improvement-register.yaml for entries where K≥2 AND not_yet_propagated is non-empty
4. For each: append to pending-plan-items.yaml as a propagation task
5. Write session summary to `.csps/learning-loop/session-[S].yaml`

**Integration with validate-positive-reflexivity.mjs:** The validator reads pending-plan-items.yaml. Learning Loop Phase 1 writes to it. Closed loop.

---

## 5. The Scope Router Sub-engine

**Built on:** `findings-categorizer.mjs` (if it exists) or gap-recurrence-register.yaml K counts.

**Classification:**
- **S1 (instance):** one-off occurrence — fix locally, no systemic change
- **S2 (process):** category of thing keeps failing — fix the process (new template/checklist)
- **S3 (structural):** architectural gap — redesign the structure (new validator/hook/contract)

**The anti-satisfaction gate:**
- If a K≥2 gap receives an S1 fix → **BLOCKED**
- Reason: K≥2 means it happened twice — the instance fix failed the first time
- Required: S3 analysis → structural fix proposal → Opus ratification
- This is P-META-019 Structural Prevention made mechanical

**D3 activation triggers:** K count increments, session close scope-classification pass

---

## 6. Depth Activation Model (R2.2)

Per session phase, each sub-engine has a default depth:

| Session phase | PE | Learning Loop | Scope Router | Seeds Monitor | Doc Engine |
|---|---|---|---|---|---|
| Session open | D3 | D1 | D2 | D2 | D1 |
| Mid-session (active work) | D2 | D1 | D1 | D1 | D1 |
| Pre-close | D1 | D3 | D3 | D2 | D3 |
| Session close | D1 | D3 | D3 | D2 | D3 |

**D3 at open for PE:** Full priority recompute at session start ensures the Queen's sequencing check runs before any work begins.

**D3 at close for Learning Loop + Scope Router + Doc Engine:** Full extraction happens at session close — this is where patterns are captured, S3 routes are confirmed, and documentation sync runs.

---

## 7. Relationship to Existing CSPS Components

| Existing component | PIE role | Phase |
|---|---|---|
| pe-compute.mjs + pe-agent skill | PE sub-engine UI layer | Existing — wire to CIE |
| validate-plan-readiness.mjs | Feeds the Readiness Gate | Existing — wire to CIE |
| post-stop-learning-loop.sh | Learning Loop trigger | Phase 1 — replace stub |
| findings-categorizer.mjs | Scope Router core | Phase 1 — wire to CIE |
| validate-core-seeds.mjs | Seeds Monitor core | Phase 1 — wire to CIE |
| audit-hub.md (9 pipelines) | Documentation Engine | Phase 2 |
| pending-plan-items.yaml | Learning Loop output queue | Existing — Learning Loop writes here |
| gap-recurrence-register.yaml | Learning Loop input | Existing — Learning Loop reads here |

---

## 8. Open Questions — ANSWERED

**Q1: Should the CIE be a single file or a directory?**
→ **Directory:** `libs/intelligence/` with `index.ts` (CIE root) + one file per sub-engine:
`pe.ts`, `learning-loop.ts`, `scope-router.ts`, `seeds-monitor.ts`, `doc-engine.ts`

**Q2: What is the schema contract at the integration boundary?**
→ Each sub-engine exports:
```typescript
interface EngineStatus {
  engine_id: string;
  d_level: 1 | 2 | 3;
  alert: boolean;
  alert_detail?: string;
  last_run: string; // ISO timestamp
  findings?: string[]; // only populated at D2+
}
```

**Q3: How does CIE maintain state between sessions?**
→ YAML state file at `.csps/intelligence/cie-state.yaml` (parallel to `.csps/profiles/` from behavior-hub). Contains: last PE top-3, last K counts snapshot, last seeds check timestamp, pending Learning Loop findings.

---

*CSPS — SIA | Platform Intelligence Engine v1.0 | RATIFIED S056 | Opus-8*
