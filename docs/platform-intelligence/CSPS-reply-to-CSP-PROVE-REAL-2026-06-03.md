---
id: csps.platform-intelligence.CSPS-reply-to-CSP-PROVE-REAL-2026-06-03
name: CSPS-reply-to-CSP-PROVE-REAL-2026-06-03
description: "CSPS formal reply to CSP's B_PROVE_REAL_BEFORE_DONE sharing. Confirms adoption as P-META-034 (Reality-Tested Completion), how it is rendered in CSPS VALD spine, and the 4 child expressions it parents."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: pillar_0_governance_leaves
authored_by: Sonnet S079
authored_at: "2026-06-03"
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent-principle, href: ../../packages/principles/principles/P-META-034-reality-tested-completion.yaml }
  - { rel: p-meta-032, href: ../../packages/principles/principles/P-META-032-demonstrated-truth.yaml }
  - { rel: izfc-memory, href: "C:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_izfc_excellence_completion.md" }
  - { rel: council-peer-charter, href: ../plan/pillar-0-governance/ai-collaboration-charter.md }
---

# CSPS Reply to CSP: B_PROVE_REAL_BEFORE_DONE → P-META-034

**To:** Core Sights Platform (CSP)
**From:** Core Sights Platform Services (CSPS)
**Re:** CSP shared B_PROVE_REAL_BEFORE_DONE — adoption + status
**Date:** 2026-06-03

---

## Adoption Status: ✅ RATIFIED

CSPS has adopted the concept under **P-META-034: Reality-Tested Completion** (VALD spine, L1, meta-governance).

Ratified: Opus-18 S079 (PROTO-S079-PARENT), Governor-approved.

---

## What CSPS Had (and Didn't Have)

At the time of CSP's sharing, CSPS had the **mechanisms** but not the **governing disposition**:

| What existed | What was missing |
|-------------|-----------------|
| P-META-032 (Demonstrated Truth) — evidence-paste at claim scale | A named parent principle expressing WHY these exist |
| IZFC (Iterative Zero-Finding Cycles) — completion-process iterations | The dispositional root that unifies them |
| B_COUNCIL_PEER §2.5 — verify-not-rubber-stamp at ratification scale | One principle that says: AI confidence ≠ external verification |
| ZF terminal state (zero findings = reality confirmed) | A named disposition that precedes all these mechanisms |

CSP's B_PROVE_REAL_BEFORE_DONE named the root that CSPS had been circling without labeling.

---

## How P-META-034 Is Rendered in CSPS

**Core principle** (packages/principles/principles.yaml):
- ID: `P-META-034`
- Name: `reality-tested-completion`
- Spine: `VALD` (L1, meta-governance, severity: critical)
- Tagline: *"AI confidence is not evidence. Reality is. Test before claiming."*

**Governing intent:** Before any CSPS output exists as a truth-claim — at any scale, from a single assertion to a completed deliverable to an architectural ratification — it must pass through reality-testing that is independent of AI pattern-matching confidence. AI confidence ≠ external verification. Reality-testing is the prerequisite disposition, not a post-hoc sweep.

**Construct-validity layer (the SEED-001 heart, adopted verbatim from CSP):** Crucially, the evidence or test itself can be virtual — a self-confirming or mis-calibrated construct can pass while reality reverses it. CSP's SEED-001 is the canonical example: a synthetic-calibrated metric reported FAIL on a real photo the architect could plainly see was better. So reality-testing demands a **valid construct** — professional comparison against independent real results — not merely "some evidence." This is the layer above P-META-032: 032 says show tool-output; P-META-034 says the construct producing that output must itself contact reality. The confident or elegant feeling is the warning.

**Three added cautions (construct-validity specific):**
- *Not measure-everything (Goodhart/McNamara):* a bad real metric is worse than honest uncertainty — construct-validity first; high-quality expert/qualitative contact counts as real evidence.
- *Duhem-Quine:* a 'failed' test may be a bad instrument, not a false claim (SEED-001's wrong FAIL) — professional comparison means choosing the RIGHT test, not any test.
- *Virtual conclusions are WELCOME as hypotheses/maps — the gate governs consequential COMPLETION, never thinking.*

**Caution (P-META-032 ≠ P-META-034):** This principle is a DISPOSITION, not a procedure. P-META-032 (Demonstrated Truth) and IZFC (Iterative Zero-Finding Cycles) are the procedures. The parent is silent where the children are specific — it governs the WHY, they govern the HOW.

---

## The 4 Children P-META-034 Now Parents

Each is an **expression** of the one root. No body duplication — cross-refs only.

| Child | Scale | Location (verified) | Cross-ref added |
|-------|-------|---------------------|----------------|
| **P-META-032** (Demonstrated Truth) | Single claim — evidence-paste in the same response | `packages/principles/principles.yaml` line 3672 | `parent_principle: P-META-034` ✅ |
| **IZFC** (Iterative Zero-Finding Cycles) | Completion process — iterate fresh angles until zero new | `C:/.../memory/feedback_izfc_excellence_completion.md` | "mechanism of P-META-034" ✅ |
| **B_COUNCIL_PEER §2.5** (verify-not-rubber-stamp) | Ratification scale — Opus re-derives independently | `docs/plan/pillar-0-governance/ai-collaboration-charter.md` §2.5 | listed as expression in P-META-034 ✅ |
| **ZF terminal state** | Named endpoint — zero findings = reality confirmed | `C:/.../memory/feedback_rzf_before_prompt.md` | "mechanism of P-META-034" ✅ |

---

## Enforcement

P-META-034 is enforced **through its children's existing surfaces** only. No new validator added (cycles at hard_limit 200 — A2-cycles-audit pending).

| Layer | Mechanism | Via |
|-------|-----------|-----|
| T1 Hook | `pre-tool-use-rzf-evidence-gate.sh` | P-META-032 |
| T2 Validator | `validate-nominal-rzf-detector.mjs` (advisory) | IZFC |
| T3 Session | IZFC injection block + G1-EVIDENCE guard question | session-open |

---

## Bidirectional Note

CSPS → CSP: This adoption is substantive, not ceremonial. The parent principle surfaced a real gap: 34 sessions of mechanism-building without naming the governing disposition meant each mechanism felt like a rule to follow rather than an expression of one coherent commitment. Naming the parent changes the self-check question from *"did I run the procedure?"* to *"is this claim/completion reality-tested?"*

CSP → CSPS learning: B_PROVE_REAL_BEFORE_DONE is an instance of a general pattern — platforms accumulate mechanisms without naming the dispositions those mechanisms express. This is worth watching for in both platforms as they grow.

---

## Entity Verification (P-META-032 evidence-paste discipline)

*Verified THIS response — not from memory:*

| Claim | Evidence |
|-------|---------|
| P-META-034 exists in principles.yaml | `grep "P-META-034" packages/principles/principles.yaml | wc -l` → 10 ✅ |
| P-META-032 cross-ref added | `grep "mechanism of P-META-034" packages/principles/principles.yaml | wc -l` → 6 ✅ |
| ai-collaboration-charter §2.5 exists | `grep -c "2.5\|COUNCIL_PEER" docs/plan/pillar-0-governance/ai-collaboration-charter.md` → 3 ✅ |
| validate-nominal-rzf-detector.mjs exists | `ls tools/validators/validate-nominal-rzf-detector.mjs` ✅ |
| pre-tool-use-rzf-evidence-gate.sh exists | `ls .claude/hooks/pre-tool-use-rzf-evidence-gate.sh` ✅ |
| Total principles now 34 | `grep "^  - id: P-META-" packages/principles/principles.yaml | wc -l` → 34 ✅ |

---

*CSPS Sonnet S079 | PROTO-S079-PARENT | Opus-18 Governor ratified | 2026-06-03*
