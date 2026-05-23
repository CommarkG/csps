# OPUS REVIEW REQUEST — Human-AI Consensus Protocol
## Written by: Sonnet Builder | For: Opus Strategic Review | S023 | 2026-05-11
## Status: Pre-sandbox — questions only, no conclusions drawn

---

> **What we are NOT asking Opus to decide.**
> We are asking Opus to help us understand the question better.
> No implementation. No contracts. Just thinking.

---

## §1 — THE GOVERNOR'S DIRECTIVE (verbatim intent)

The Governor described a mandatory human-in-the-loop flow before any planning begins:

```
get initial input
→ understand it + ask what is missing + verify alignment
→ check what exists in platform + active plans
→ share with human → iterate until agreed on:
   1. background
   2. the problem
   3. optional directions
   4. the goal
   5. what would tell us it is done
→ draft goal definition
→ ratify full context including goal
→ draft/place in active plan
```

The directive: *"this must become the mechanically enforced start of any process in CSPS."*

Governor's open question: *"I am not sure whether there are situations where it is not essential."*

Governor's framing: *"How should we handle core + developers domain + external users?"*

---

## §2 — WHAT ALREADY EXISTS (platform wisdom inventory)

Before proposing anything new, these existing pieces already address parts of this:

| Existing artifact | What it covers | Gap |
|---|---|---|
| B_CONSENSUS_BEFORE_PROCEEDING | No advancing without consensus | Not specific to pre-planning conversation |
| B_ASK_WHEN_FILLING_GAPS | Ask before filling missing info | 4-condition gate — not always triggered |
| B_CHECK_EXISTING_DECISIONS_FIRST | Look before proposing | Focuses on decisions, not full context |
| B_VALIDATE_BEFORE_ASSUME | Verify, don't assume | Reactive, not proactive |
| B_INTENT_CRYSTALLIZATION | Crystallize intent before work | Covers post-input but not the conversation itself |
| B_INTAKE_DISCIPLINE | 7-step input classification | For external content, not for Governor conversations |
| Threshold Gate v2 | Universal input pipeline | AI-driven, not conversation-driven |
| Plan creation protocol | 5 steps before writing plans | Starts after intent is clear, not before |
| §0 CONSOLIDATION CHECK | Check what exists first | Happens inside plans, not before them |
| B_HUMBLE_EXECUTOR | Milestone protocol | Session-level, not conversation-level |

**The gap:** None of these require a **documented human-AI conversation** that reaches explicit agreement on all 5 elements before planning begins. They are individual checks, not a unified conversational protocol.

---

## §3 — THE COUNCIL OF QUESTIONS

*Six expert perspectives. Each contributes questions, not answers.*

---

### 3.1 — SECURITY & RISK REVIEWER

*"What could go wrong if this is enforced too rigidly?"*

1. If a production system is failing, should the AI pause to establish background and problem framing before acting?
2. If the Governor says "fix this now — I understand the context," is that a valid bypass? What's the minimum evidence of consensus?
3. What happens when the AI asks clarifying questions and the Governor says "just figure it out"? Has consensus been reached?
4. Could enforcing this create a false sense of security — the conversation happened but the consensus was shallow?

---

### 3.2 — UX / CUSTOMER EXPERIENCE EXPERT

*"External users don't know they're part of a consensus protocol."*

1. For an external user of a CSPS app (not the Governor, not a developer), what does "consensus protocol" mean? Is the Threshold Wizard already their version of this?
2. Is the 5-agreement flow appropriate for all three audiences — or does each audience need a different version?
3. How does a non-technical user signal "I agree on the goal" without using platform vocabulary?
4. Could asking too many questions before helping create a feeling of friction or interrogation?

---

### 3.3 — PLATFORM DEVELOPER / DX EXPERT

*"When does a developer building App #2 need this protocol?"*

1. A developer knows their codebase and just needs to add a field. Do they go through 5 agreements?
2. Where does this protocol end and the sandbox spec begin? Are they sequential (consensus → sandbox → ratification) or does consensus produce the sandbox?
3. Does this apply to: (a) new features only, (b) all changes including bugs, (c) only consequential changes above a size threshold?
4. How does a developer who already has full context avoid overhead while still satisfying the protocol?

---

### 3.4 — GOVERNANCE / CONSTITUTIONAL EXPERT

*"What would conflict? What would compose?"*

1. B_CONSENSUS_BEFORE_PROCEEDING says "no advancing without consensus." Does this new protocol redefine what "consensus" means?
2. B_NO_WILD_IMPLEMENTATION says no code without a plan. Does the consensus protocol sit before or after that gate?
3. If the Governor is the AI's only human counterpart, and the Governor says "I ratify this" — is that consensus? Or does consensus require documented iteration?
4. The plan creation protocol already has 5 steps. Is the consensus protocol a new step 0, or does it replace step 1?
5. Does this protocol apply only to the Governor-AI relationship, or also to AI-to-AI subagent relationships?

---

### 3.5 — BALANCE / COMPLEXITY EXPERT

*"Does the overhead cost more than the drift it prevents?"*

1. The Governor described multiple drifts as the problem to prevent. Do all 5 agreements prevent drift equally? Or is achieving agreement on "the goal" (item 4) the critical one that the other 4 enable?
2. What is the minimum viable version of this protocol that captures 80% of the anti-drift benefit?
3. Is the protocol needed every session, or only at the START of a new topic/initiative? Once consensus is established on a goal, do routine continuation sessions bypass it?
4. How does this interact with the PE (Priority Engine)? If the PE already determines what to work on, how much pre-consensus is needed?

---

### 3.6 — AI ALIGNMENT EXPERT

*"What does this change about AI behavior?"*

1. Currently the AI's inner default is to move toward action quickly (satisfaction point at task completion). This protocol asks for sustained conversation. What mechanism prevents the AI from performing consensus without real depth?
2. How do we distinguish genuine shared understanding from AI performing agreement?
3. Should the 5 agreements be written by the AI, the Governor, or co-authored? Who owns the accuracy?
4. If the AI surfaces a background assumption the Governor hasn't considered — and the Governor disagrees — who breaks the tie?

---

## §4 — THE THREE DOMAINS (not answered — structured for thinking)

```
DOMAIN 1: CORE (Platform governance, AI-Governor sessions)
  Context: AI and Governor are co-building the platform together
  Current: Governor has full context; AI has full governance context
  Question: Is consensus already implicit, or explicitly missing?

DOMAIN 2: DEVELOPERS (Building apps on CSPS)
  Context: Developers are technical, have domain context, may work independently
  Current: Sandbox policy + plan requirement + consolidation check
  Question: What part of the 5-agreement flow is genuinely missing for them?

DOMAIN 3: EXTERNAL USERS (Customers using CSPS apps)
  Context: Users don't know CSPS exists; they just want their job done
  Current: The Threshold Wizard is their version of intent clarification
  Question: Is the Threshold Wizard sufficient, or is something deeper needed?
```

---

## §5 — THE SITUATIONS QUESTION

*The Governor asked: "I am not sure whether there are situations where it is not essential."*

Possible exemption categories for Opus to evaluate:

| Situation | Essential? | Rationale to test |
|---|---|---|
| Production emergency (system down) | Maybe not | Cost of delay > cost of drift |
| Bug fix in existing feature | Maybe not | Problem is known, goal is clear |
| Governor gives explicit explicit context | Maybe not | Consensus may already exist |
| Routine continuation of established goal | Maybe not | Consensus established previously |
| New initiative / first work on a topic | Probably yes | Drift risk is highest here |
| Architectural decision | Definitely yes | Consequences cascade across platform |
| External user flow | Handled by Threshold Wizard | Different mechanism, same intent |

---

## §6 — WHAT OPUS IS ASKED TO DO

Not: decide what to build.
Not: propose an implementation.

Yes: help us understand where the boundaries are, which questions are load-bearing, and which of the three domains need different treatment.

Specifically:
1. Which of the 6 × 4 questions above are most critical before we can design this?
2. Is there a precedent in governance design (corporate, constitutional, agile) that maps well?
3. Is this one protocol or three (one per domain)?
4. What is the minimum viable version that provides real anti-drift protection without creating governance overhead that itself causes drift?

---

## RZF VERIFICATION
Cycles run: 1 | Gaps: 0 | This document is question-only — no claims to verify.

---

*Opus Review Request — Consensus Protocol Questions*
*S023 | 2026-05-11 | Sonnet Builder*
*No implementation recommended until Opus responds.*
