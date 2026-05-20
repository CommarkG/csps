---
id: csps.plan.universal-logic-framework.csps-mapping
name: CSPS → Universal Logic Engine Mapping
description: "How CSPS's existing vocabulary and infrastructure maps to the Universal
  Combinatorial Logic Engine framework. CSPS IS an implementation of this engine —
  applied to the domain of software platform governance. This document makes
  the correspondence explicit."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: apps_planning
batch: BATCH-B
session: S047
---

# CSPS Mapping
## How CSPS Implements the Universal Combinatorial Logic Engine

> **Purpose:** CSPS is one specific implementation of the universal framework.
> This document shows the mapping between universal concepts and CSPS vocabulary.
> It also identifies where CSPS has NOT yet implemented the universal pattern —
> these are the gaps the framework reveals.

---

## CORE ARCHITECTURE MAPPING

| Universal Concept | CSPS Vocabulary | Implementation Status |
|---|---|---|
| Universal Core (sealed axioms) | L1_CORE_*.md sealed files | ✅ Implemented |
| Domain Template | L2_DOMAIN_*.md + behavioral contracts | ✅ Implemented |
| Instance Configuration | Plan items in unified-plan.yaml | ✅ Implemented |
| Edge Case Extension | OPEN-NNN intake items | ✅ Implemented |
| Dependency Matrix | inheritance-registry.yaml | ⚠️ Partial — only 5 entries |
| GRAVITY axis | pe_score field in unified-plan.yaml | ⚠️ Partial — single number, not multi-field |
| VELOCITY axis | epoch assignment + status | ❌ Not built — no urgency decay |
| INHERITANCE axis | batch field + parent_template | ⚠️ Partial — declared but not computed |
| Multi-conclusion output | PCR (Pros/Cons/Recommendation) skill | ⚠️ Manual — not automated |
| Reasoning trace | ZF evidence blocks | ⚠️ Manual — not structured output |

---

## SIX PILLARS IN CSPS

| Pillar | CSPS Equivalent | Status |
|---|---|---|
| General Prioritization | PE (Priority Engine) + unified-plan.yaml pe_score | ✅ Working |
| Deep Multi-discipline | Core Council (Opus + Sonnet + Governor) | ⚠️ Manual relay process |
| Task Management | unified-plan.yaml status lifecycle | ✅ Working |
| Data Extraction/Analysis | findings-categorizer.mjs S1/S2/S3 routing | ✅ Working |
| Coding | PROTO directives + Sonnet tab | ✅ Working |
| Core Councils | Opus/Sonnet advisory protocol | ✅ Working but not automated |

---

## ABSORPTION LAYER IN CSPS

| Universal Concept | CSPS Vocabulary | Gap |
|---|---|---|
| Fragmented input capture | Session-start prompts + HANDOFF Zone A | Gap: no voice/photo capture |
| Three-state holding | lifecycle_state (intake/planning/ratified) | Close match |
| Anti-guessing policy | B_VALIDATE_BEFORE_ASSUME | ✅ Implemented |
| Cognitive offloading | DNA bundle + session-open injection | ✅ Implemented |
| Behavioral verification | ZF cycle + re-run requirement | ✅ Implemented |
| Trust ladder | T1→T2→T3 enforcement progression | ✅ Strong match |
| Sensitivity calibration | Not implemented | ❌ Missing |

---

## TEMPLATE SYSTEM IN CSPS

| Universal Concept | CSPS Vocabulary | Status |
|---|---|---|
| Template inheritance | governed-artifact-frontmatter.template.md → extensions | ✅ Implemented |
| Template registry | template-registry.md | ✅ Implemented |
| Template suggestion agent | consolidation-expert skill (partial) | ⚠️ Partial |
| Template validity check | validate-frontmatter.mjs | ✅ Implemented |
| K=2 promotion rule | template_status: novel-pending-pattern-evaluation | ✅ Implemented |

---

## WHAT CSPS IS MISSING (The Gaps the Framework Reveals)

1. **VELOCITY axis:** CSPS has no urgency decay function. Items don't become more urgent over time — they stay at their declared pe_score. This means the engine cannot compute "this item was pe_score=75 last week but is now critical because its deadline is in 2 days."

2. **Combinatorial gravity computation:** The inheritance-registry.yaml has 5 entries. A real dependency matrix would have all 33 plan items with their dependencies mapped. Currently CSPS cannot compute "if BATCH-B is delayed, what is the combined risk to BATCH-H?"

3. **Multi-conclusion output automation:** The PCR skill produces three conclusions when invoked manually. It should be invoked automatically for every decision above a certain gravity threshold.

4. **Sensitivity calibration:** CSPS has one communication tone for all outputs. The sensitivity ladder (tone/depth/urgency calibration per recipient) is not implemented.

5. **Private/business silo (for end users):** CSPS is a developer-facing system so this doesn't apply internally. But any CSPS-built app must implement this — it's a core requirement from the framework.

6. **Behavioral verification cycle:** CSPS validates execution (ZF/RZF) but does not verify "is the behavior consistent with the stated plan?" There's no detection of when actual session behavior diverges from session-state.json mandate.

---

## APP-001 CRYSTALLIZATION QUESTIONS — CSPS ANSWERS

*Applying the crystallization questions from crystallization-questions.md to APP-001:*

**A.1.1 — Primary use case:**
"Turn fragmented voice thoughts captured while driving into structured, clarifiable task items — for construction contractors and ADHD professionals."

**A.1.3 — Gravity unit:**
"Number of downstream items that block if this chunk is not clarified. A chunk about a material delivery blocks the entire delivery sequence if it stays in STATE 2."

**A.1.4 — Velocity unit:**
"Hours before irreversibility. A permit expiration is measured in days. A cash flow gap is measured in days to payroll. A missed supplier window is measured in hours."

**A.1.5 — Irreversible loss:**
"A commitment made (verbally or in writing) that was not captured and therefore not honored. The contractor's reputation is the irreversible loss."

**B.1.13 — Cognitive state at input:**
"Driving. Both hands occupied. Visual attention on road. Maximum cognitive load from multi-site project management."
→ Implication: voice is the ONLY viable primary input channel.

**B.2.19 — User's biggest fear:**
"The AI will send something on my behalf that I didn't approve and will embarrass me with a client or supplier."
→ Implication: Nothing external without explicit approval. Trust Ladder Rung 3 is the maximum for MVP.

**D.1.31 — Private data in this domain:**
"Family conflicts that influenced a business decision. Personal health that affects work capacity. Financial stress that explains a client negotiation stance."
→ Must never appear in business outputs.

---

*Document version: 1.0 | Session: S047*
