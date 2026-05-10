---
id: csps.pillar-0-governance.question-protocol
name: question-protocol
description: >
  The CSPS Question Protocol — Governor directive S019. Questions are "encrypted context
  and intents" — they compress fundamental data, context connections, and goal definition
  into a testable, portable, session-independent form. Full context is achieved only when:
  (F) fundamental data is provided, (C) context connections are established, (G) goal is
  defined, and (Q) well-defined questions make the intent verifiable. Questions serve as
  the north star that keeps the AI aligned even when engineered solutions are incomplete.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
enforcement_stage: planned
cdp_status: ratified
core_spine: GVRN
core_spines: [GVRN, AI, VALD, ARCH, OPER]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S019
depth_levels:
  l1: "Questions = encrypted context + intents. Full context = F+C+G+Q. Questions work across sessions, models, and incomplete implementations."
  l1_tokens: 80
  l2: "The Question Protocol defines how questions are structured, registered, and evaluated across all 6 governance phases (thinking/planning/goal-setting/implementing/auditing/validating)."
  l2_tokens: 800
  l3: "See this document. Question template: question-template.yaml. Registry: question-register.md (planned S019)."
  l3_location: "./question-protocol.md"
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: instruction-template, href: ./instruction-template.md }
  - { rel: session-question-register, href: ./session-question-register.md }
  - { rel: cdp-plan, href: ../../plan/_handoff/VAULT/topic-plans/core-dynamic-plan.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/instruction-template.md
  - docs/plan/pillar-0-governance/session-question-register.md
  - docs/plan/_handoff/VAULT/topic-plans/core-dynamic-plan.md
  - AGENTS.md
domain_path: platform
---

# Question Protocol — CSPS

> **Governor insight S019:** "A question that is well-defined is like encrypted context and intents. If we wrap everything up with well-defined questions, then we'll have complete alignment and context."
>
> **The north star function:** Questions keep AI aligned even when engineered solutions are incomplete. The AI can answer: "Does this implementation answer the questions it was supposed to answer?" — regardless of whether validators, hooks, or contracts are all built.

---

## The Full Context Formula

**Full Context is achieved when ALL four elements are present:**

```
F — Fundamental data    (what currently exists, what the current state is)
C — Context connections (how elements relate, which principles apply, blast radius)
G — Goal definition     (observable end state, measurable result, what success looks like)
Q — Well-defined questions (encrypted intents that make F+C+G verifiable)
```

**Without Q:** F+C+G can all be present but the intent is still ambiguous. Two different AI instances can read the same fundamental data, same connections, and same goal definition and produce different results because they interpreted intent differently.

**With Q:** The questions make interpretation impossible to avoid. Each question has a checkable answer. The implementation either answers the questions correctly or it doesn't.

---

## Why Questions Work Better Than Instructions

| Instructions | Questions |
|---|---|
| Can be ambiguous ("make it better") | Must be specific ("can you measure improvement in X?") |
| Can be ignored when context changes | Re-evaluate automatically with context |
| Don't reveal gaps | Unanswerable questions = explicit gaps |
| Require full implementation to test | Can test a partial implementation |
| Session-specific | Portable across sessions and AI models |
| Easy to satisfy nominally | Hard to game — good answer requires actual understanding |

**The session independence property:** Questions survive session boundaries. When the Governor asks "can this platform answer the question: what is the current cdp_status of B_TOKEN_BUDGET?" — a new AI instance can answer this without knowing everything that happened in previous sessions.

---

## The Question Lifecycle (6 Phases)

### Phase 1 — Thinking (Exploration Questions)
*Purpose: Reveal what we don't know. Map the assumption space.*

**Standard thinking questions:**
- What do we NOT know that we should know before proceeding?
- What assumptions are we making that could be wrong?
- What would failure look like, and how would we know?
- Who else is affected by this decision that we haven't considered?

**CSPS application:** Every new topic-plan starts with thinking questions. These become the `question_register:` in the plan frontmatter (already partially implemented in foundation-slices.md).

---

### Phase 2 — Planning (Scope + Sequencing Questions)
*Purpose: Define what's in scope and in what order.*

**Standard planning questions:**
- What observable state proves each level is complete?
- What depends on this? What does this depend on?
- What's the blast radius if this changes?
- What's the PE score of each planned element?

**CSPS application:** These become exit criteria in gradual-build-plans. The plan's question_register is the PLANNING QUESTIONS list. A plan is not properly scoped until all planning questions are answerable.

---

### Phase 3 — Goal Setting (Outcome Questions)
*Purpose: Lock in what success looks like before building.*

**Standard goal-setting questions (from instruction-template.md):**
- What observable state proves this goal is achieved? (MEASURABLE_END_RESULT)
- What would an external verifier see to confirm success? (VERIFICATION_METHOD)
- What would failure look like? (VIOLATION_INDICATOR)
- Where is the AI satisfaction point — where would it declare done too early? (SATISFACTION_POINT_WARNING)

**CSPS application:** Every instruction created using instruction-template.md already encodes goal-setting questions. These ARE the MEASURABLE_END_RESULT field.

---

### Phase 4 — Implementing (Alignment Questions)
*Purpose: Keep implementation on track as complexity grows.*

**Standard implementation questions:**
- Does this implementation answer the planning questions from Phase 2?
- Does this output produce the observable state defined in Phase 3?
- What validation will prove this is working? (not just "it runs")
- Does this create any new dependencies that weren't planned?

**CSPS application:** B_AUTONOMOUS_BATCH_WITH_PREFLIGHT already asks Q-GATE + Q-COMPLETE + Q-GLOBAL before each batch. These are alignment questions. The SQR (Session Question Register) tracks whether implementation questions were answered.

---

### Phase 5 — Auditing (Coverage Questions)
*Purpose: Find gaps by identifying questions the system cannot answer.*

**Standard audit questions:**
- Can the platform answer X about its current state? (if NO → gap)
- Does element Y have evidence it was validated? (if NO → gap)
- Is there a mechanical check that would detect if Z drifted? (if NO → enforcement gap)

**CSPS application:** This IS the ZF approach — validators are mechanized audit questions. `validate-bedrock.mjs` asks "is bedrock complete?" `validate-vlt-blocking.mjs` asks "are any VLTs pending?". The 41 validators are 41 audit questions the platform can answer mechanically.

**The insight:** Every audit slug in audit-runner.md IS a question. The platform "passes" an audit when it can answer the audit's implicit question correctly.

---

### Phase 6 — Validating (Evidence Questions)
*Purpose: Prove the answers are correct, not just claimed.*

**Standard validation questions:**
- Can you demonstrate this answer with THIS-SESSION observable output? (not memory)
- Is the evidence reproducible? Would a different AI instance produce the same answer?
- Does the measurable result match what was specified in Phase 3?

**CSPS application:** ZF discipline IS validation questions applied to every DONE claim. P-META-006 says "re-run is necessary but not sufficient — zero findings on the last run is the proof." This is asking: "Can you prove the validation question was answered with current-session evidence?"

---

## The Question Template

Every registered question follows this schema:

```yaml
question:
  id: Q-[SPINE]-[NNN]              # e.g. Q-GVRN-001
  scope: "[what element this covers]"
  phase: thinking|planning|goal|implementing|auditing|validating
  
  question: "[the specific, answerable question text]"
  # Rules for good question text:
  # - Must have a YES/NO or specific observable answer
  # - Cannot be answered with "it depends" without follow-up questions
  # - Must specify what evidence counts as a correct answer
  
  answer_type: BOOLEAN|OBSERVABLE|MEASURABLE|ENUMERABLE
  expected_answer: "[what a correct answer looks like]"
  evaluation_method: "[how to check the answer — tool call, validator, observable output]"
  
  # Connections
  csps_dna: "[which P-*, B_*, or plan this question enforces]"
  
  # Lifecycle
  session: S0NN
  status: OPEN|ANSWERED|DEFERRED
  answer: "[the current answer, if known]"
  answer_evidence: "[THIS-SESSION evidence that the answer is correct]"
```

---

## Sample Registered Questions (Platform-Level)

```yaml
questions:
  - id: Q-GVRN-001
    scope: "ZF discipline"
    phase: validating
    question: "Did the last ZF run produce STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain?"
    answer_type: BOOLEAN
    expected_answer: "YES — with THIS-SESSION tool output as evidence"
    evaluation_method: "Read the last line of pnpm zf:deep output"
    csps_dna: "P-META-006 + INST-VALD-001"
    status: ANSWERED
    answer: "YES — STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain (this session)"

  - id: Q-VALD-001
    scope: "Platform health"
    phase: auditing
    question: "Does pnpm verify exit with code 0 and 41 validators passing?"
    answer_type: BOOLEAN
    expected_answer: "YES — exit_code 0 confirmed by THIS-SESSION tool output"
    evaluation_method: "Run: pnpm verify --skip-install; read exit_code field in output"
    csps_dna: "B_PRE_CLOSE_VERIFICATION + validate-audit-slug-coverage"
    status: ANSWERED
    answer: "YES — exit_code 0, 41 validators (this session)"

  - id: Q-AI-001
    scope: "B_RESULT_NOT_OUTPUT compliance"
    phase: auditing
    question: "For each important definition produced this session, did the Governor explicitly acknowledge receipt?"
    answer_type: ENUMERABLE
    expected_answer: "All definitions with SQR entry have status: ACKNOWLEDGED or DEFERRED"
    evaluation_method: "Check SQR register — count OPEN items"
    csps_dna: "B_RESULT_NOT_OUTPUT + session-question-register.md"
    status: OPEN
    answer: "PARTIAL — SQR-S018-001 (INPUTS): CONFIRMED. SQR-S018-002 (FINDINGS): ACKNOWLEDGED."
```

---

## Integration Points (Where Questions Must Appear)

**1. Every topic-plan → `question_register:` frontmatter**
Already partially implemented. Must become mandatory per validate-plan-know-how.mjs.

**2. Every instruction → MEASURABLE_END_RESULT + VERIFICATION_METHOD**
Already implemented in instruction-template.md. Questions ARE these two fields.

**3. Every session close → Q-GVRN-001 (ZF) + Q-VALD-001 (pnpm verify) as mandatory**
These are already in the closing-summary §10.0 — they're just not labeled as "questions."

**4. Every Threshold INPUT classification → implicit questions**
What kind of INPUT is this? (classification question) Which spine? (routing question) Does it need Governor ACK? (checkpoint question)

**5. Every new governance artifact → WHAT QUESTION DOES THIS ANSWER?**
A behavioral contract answers: "What must the AI never do in this domain?"
A validator answers: "Does the platform satisfy this specific quality criterion?"
A domain card answers: "What is this element and how does it relate to everything else?"

---

## The North Star Function

When engineered solutions are incomplete, questions provide direction:

**Without questions:** "The validator isn't built yet, so I can't check this properly. I'll proceed on best judgment."

**With questions:** "The validator isn't built yet. But the governing question is: 'Does this implementation produce observable state X?' I can manually answer this question even without the validator. The answer is: YES/NO/PARTIAL, because [evidence]."

The question keeps the intent alive even when the implementation is partial. This is the north star function — the AI navigates by answering the question, not by following the implementation path.

---

## Planned Artifacts (S019+)

- `tools/validators/validate-question-coverage.mjs` — checks that every topic-plan has a question_register, every instruction has goal-setting questions, every session close answers mandatory platform questions
- `docs/plan/pillar-0-governance/question-register.md` — platform-wide registry of all registered questions by phase and element
- `audit-runner.md` slug: `question-coverage` — all elements have associated questions
- Integration with context-orchestrator: question_register becomes part of the context bundle for each task class
