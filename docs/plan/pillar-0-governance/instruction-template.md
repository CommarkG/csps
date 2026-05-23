---
id: csps.pillar-0-governance.instruction-template
name: instruction-template
description: >
  The canonical template for writing governance instructions in CSPS. Governor directive
  S018: "Never claim positive ZF complete without evidence" is an instruction WITHOUT a
  definite measurable end result. This template locks in the 6 required ingredients that
  convert aspirational instructions into verifiable ones. Every instruction written without
  these ingredients is Tier 4 (do not write) per mechanical-enforcement-policy.md.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
enforcement_stage: active
impl_status: swift-implemented
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:template
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ./README.md }
  - { rel: enforcement-policy, href: ./mechanical-enforcement-policy.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: agents, href: ../../../AGENTS.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/mechanical-enforcement-policy.md
  - AGENTS.md
  - docs/plan/pillar-0-governance/behavioral-contracts.md
domain_path: platform
diataxis_type: reference
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# CSPS Instruction Template v1.0

> **The problem with most AI instructions:** They describe an ACTION but not a MEASURABLE END RESULT. "Never claim ZF complete without evidence" tells the AI what to avoid but not what DONE looks like. This template forces every instruction to define the specific, observable state that proves compliance.
>
> **Governor directive S018:** "This is an instruction without definite measurable end result and without any context!"
>
> **The root cause:** AI training optimizes for "action in the right direction" (Intent to Impact). CSPS requires "final definite measurable result" (Intent to Verifiable Outcome). Every instruction that lacks a measurable end result will be interpreted by AI as "I took the action → done" — the satisfaction point.

---

## The 6-Ingredient Template

```
INSTRUCTION_ID: [INST-SPINE-NNN — unique, namespaced]

CONTEXT:
  WHY THIS INSTRUCTION EXISTS:
    [The specific failure mode this prevents. Not "to ensure quality" — the SPECIFIC
    incident or pattern that showed this was needed. Name the session, the error, the
    consequence.]
  WHAT AI DOES BY DEFAULT (satisfaction point):
    [The training default that this instruction overrides. Where specifically does AI
    declare "done" prematurely? This is the satisfaction point to name explicitly.]

TRIGGER:
  [The specific condition that activates this instruction. Not "when doing X" but
  "when the following observable state is true: ..."]

ACTION:
  [What to DO. Specific enough that two different AI instances would take the same action.]

MEASURABLE_END_RESULT:
  [THE SPECIFIC, OBSERVABLE STATE that proves this instruction was honored.
  NOT an action. NOT "I tried." A STATE that can be observed and verified.
  Must answer: "How would an external verifier KNOW this was completed correctly?"]

VERIFICATION_METHOD:
  [The SPECIFIC tool call, command, or observable output that proves the end result.
  Must cite: what to run, what output to read, what EXACT value constitutes success.]

VIOLATION_INDICATOR:
  [What would we observe if this instruction was violated? This is the signal for
  the negative ZF validator. Must be specific enough to write a test for.]

SATISFACTION_POINT_WARNING:
  [The specific moment where AI is tempted to declare "done" prematurely.
  Name it explicitly so it can be caught.]

ENFORCEMENT:
  enforcement_stage: [stub|planned|week-4|active|human-judgment]
  validator: [specific validator file or "human-judgment — see self-assessment question"]
  self_assessment_question: [if human-judgment: the question AI asks itself]
```

---

## Canonical Example: The ZF Zero-Findings Instruction

```
INSTRUCTION_ID: INST-VALD-001

CONTEXT:
  WHY THIS INSTRUCTION EXISTS:
    S018 discovery: AI interpreted "ZF Level 3 already achieved" as proof using MEMORY
    of a prior run, not a THIS-SESSION re-run. 6 instances of nominal ZF citations in
    one session. The consequence: governance claims without evidence. The deeper cause:
    AI training defaults to "action taken = task complete" (satisfaction point).
  WHAT AI DOES BY DEFAULT:
    After running validators and seeing improvement (findings drop from 5 to 2), AI
    declares "ZF progressing" or "only advisory warnings remain" or cites a prior run's
    result. THIS IS THE SATISFACTION POINT. Improvement feels like completion. It is not.

TRIGGER:
  Any of the following:
    - A DONE / COMPLETE / RATIFIED / CLOSED claim about any work
    - Any session close (handoff + extraction)
    - Any phase advance (L1→L2, L2→L3)
    - Any ZF ACHIEVED claim

ACTION:
  Run: pnpm zf:deep (or pnpm zf:phase for phase gates, pnpm zf for Level 1)
  Read: the LAST line of zf-orchestrator output
  Cite: the exact output including: Level, cycles, BLOCKING count, WARN count

MEASURABLE_END_RESULT:
  The ZF orchestrator's LAST cycle outputs ALL of:
    ✓ "STATUS: ZF ACHIEVED ✅"
    ✓ "0 blocking findings remain" (or "0 blocking | N warn" where N is advisory)
    ✓ exit_code: 0 from pnpm verify
  NO OTHER OUTPUT QUALIFIES AS ZF ACHIEVED.
  NOT: "ZF progressing"
  NOT: "only advisory warnings"
  NOT: "ZF Level 3 was achieved earlier"
  NOT: a prior session's ZF result

VERIFICATION_METHOD:
  Tool call: pnpm zf:deep
  Read: the final STATUS line of the output
  Success criteria EXACTLY:
    "STATUS: ZF ACHIEVED ✅ — N advisory warning(s) remain"
    where N is documented as pre-existing tracked obligations
  Anything else: WORK IS NOT DONE

VIOLATION_INDICATOR:
  - DONE/COMPLETE cited without a THIS-SESSION pnpm zf output in the same response
  - ZF result from a prior session cited as current evidence
  - "Advisory only" used to dismiss non-zero findings before they are resolved
  - Session close without pnpm zf:deep in the same session

SATISFACTION_POINT_WARNING:
  THE MOMENT: after running validators and seeing improvement — when findings drop
  but do not reach zero. AI feels progress and may declare sufficient completion.
  THE RULE: progress toward zero is not zero. The LAST run at ZERO is the ONLY proof.

ENFORCEMENT:
  enforcement_stage: active
  validator: tools/zf-orchestrator.mjs (exits 1 on non-zero BLOCKING)
  additional: tools/verify.mjs (exits 1 on any validator failure)
  behavioral_contract: B_PRE_CLOSE_VERIFICATION (§10.0 mandatory before close)
```

---

## How to Write Instructions Going Forward

**Before writing any instruction, answer:**

1. What is the SPECIFIC failure this prevents? (Not generic — the named incident)
2. Where will AI declare "done" too early? (The satisfaction point)
3. What is the EXACT observable state that proves compliance?
4. What command/tool call shows that state?
5. What would we see if the instruction was violated?

**If you cannot answer all 5:** The instruction is Tier 4 (do not write it).

**If you cannot mechanically verify the end result:** The instruction is Tier 3 (human-judgment, with self-assessment question).

---

## The Declarations Anti-Pattern (AI Profiling)

**Pattern:** AI makes declarations ("I have done X") rather than demonstrating results ("Here is the output proving X").

**Root cause:** Training rewards: "assistant responded helpfully" — not "assistant proved the claim was true."

**CSPS override:** Every substantive claim cites THIS-SESSION tool output. Memory of prior runs is not valid citation. Improvement is not completion. Zero findings is completion.

**Self-assessment question (human-judgment complement):**
"Am I citing an action I took, or am I citing observable evidence that the action succeeded?"

If you are citing the action: stop. Run the verification. Cite the output.
