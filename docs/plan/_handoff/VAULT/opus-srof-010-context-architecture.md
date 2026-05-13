---
id: csps.handoff.vault.opus-srof-010-context-architecture
name: opus-srof-010-context-architecture
description: >
  SROF-010: Deep dive on context architecture in CSPS. 8-question Governor brief on:
  context in AI behavior, where context should be but isn't, questions as context carriers,
  syncing/empowering all elements, mechanical enforcement, SSoT, stability, chat integration.
  Prepared by Sonnet S028. Scheduled while Governor works on Vercel.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
core_spines: [AI, GVRN, ARCH]
schema_anchor: opus_consultations
diataxis_type: explanation
session: S028
scope_level: S0
pe: 82
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: p-meta-020, href: ../../pillar-0-governance/concept-first-governance.md }
  - { rel: p-meta-022, href: ../../pillar-0-governance/human-intent-crystallization.md }
  - { rel: question-protocol, href: ../../pillar-0-governance/question-protocol.md }
  - { rel: virtual-opus-audit, href: ../../pillar-0-governance/virtual-opus-audit.md }
  - { rel: cca, href: ../../pillar-0-governance/cognitive-context-architecture.md }
---

# SROF-010: Context Architecture Deep Dive
## Governor Brief: 8 Questions on Context in CSPS
## PE=82 | Scheduled S028 | Sonnet preparation for Opus review

> **Governor's 8 questions:**
> 1. How is context handled in AI behavior?
> 2. Where should context be but isn't?
> 3. How are questions as "context carriers"? Are you really aware and understand it?
> 4. How do we optimally sync and empower all elements with context definitions and protocols?
> 5. How can we mechanically enforce context + questions in any file and element?
> 6. How can this have one source of truth?
> 7. How can it be stable toward anything created here and in the future?
> 8. How can it be integrated to this chat? Sensitive and proactive on context gaps, avoiding guessing and assumptions?

---

## §A — What CSPS Currently Has on Context

### A.1 — The Principles (what's ratified)

| Principle | What it governs | Status |
|---|---|---|
| P-META-020 (Concept-First) | Context is the compass; validators are reference samples | SEALED |
| P-META-022 (Human Intent) | L1→L3 intent gap; context defines meaning at each layer | SEALED |
| P-META-023 (I→VI) | Every AI boundary closes the loop with context | SEALED |
| P-META-024 (Multi-topic) | Multiple contexts in one prompt require decomposition | SEALED |
| P-META-009 (CCA) | 5-layer context model for AI | SEALED |
| B_COGNITIVE_CONTEXT_DISCIPLINE | Token investment in quality context | ACTIVE |
| B_CDAB | Per-task context depth selection | RATIFIED |

### A.2 — The 5-Layer Context Model (CCA, P-META-009)

```
Layer 1: Permanent Constitution — AGENTS.md + core behavioral contracts
Layer 2: Session Contract — active plans + current mandate + HANDOFF
Layer 3: Active Work — specific files being edited + validators
Layer 4: MCP queries — on-demand governance knowledge
Layer 5: Subagent-delegated — isolated specific tasks
```

**Current enforcement:** B_TOKEN_BUDGET (R1 = L1 only by default, L2-L3 require justification)

### A.3 — Questions as Context Carriers (question-protocol.md)

8 question types, each serving a different context function:

| Type | What context it carries |
|---|---|
| C-type (goal_statement) | Intent crystallization — what success looks like |
| Z-type (done_criteria) | Completion context — how we know it's done |
| G-type (gap-surfacing) | Unknown-unknown context — what we might be missing |
| R-type (risk-surfacing) | Risk context — what could go wrong |
| B-type (background) | Historical context — what shaped this decision |
| A-type (assumption-check) | Assumption context — what we're taking for granted |
| P-type (precedent) | Prior-art context — what exists that informs this |
| X-type (cross-cutting) | Cross-domain context — what other areas are affected |

**The Governor's insight:** Questions ARE the primary mechanism for context transfer between human (Governor) and AI. They force the human to externalize context they have internally. They force the AI to surface assumptions it's making silently.

---

## §B — Where Context Should Be But Isn't

### B.1 — The Gaps (Sonnet pre-analysis)

**Gap 1: At the moment of PROPOSAL.**
When the AI proposes an implementation, it should declare the context it's operating from.
Current: proposals are generated without explicit context declaration.
Should be: "Governing context: [principle] at [scope]. Operating assumption: [assumption]. If this assumption is wrong: [alternative]."

**Gap 2: At scope level transitions.**
When work moves from S0 → S1 → S2, context must be explicitly transferred.
Current: no context transfer mechanism at scope level transitions.
Should be: `context_transfer: from_scope: S0 → to_scope: S1 | transferred: [what was inherited] | added: [what is new at this scope]`

**Gap 3: In the Governor Request Ledger.**
Requests are tracked with PE but not with the CONTEXT that generated them.
Should be: each request captures the Governor's context at time of request (what problem prompted it, what they were seeing, what assumption they were making).

**Gap 4: In skill invocations.**
When a skill is invoked, it has no visibility into the session's current context.
The cruel-critic skill invoked at session start operates with different context than one invoked mid-session.
Should be: skills receive a context snapshot at invocation.

**Gap 5: In the virtual-opus-audit self-check.**
Q1-Q6 are pattern questions, not context-grounding questions.
Q0 should be: "What is my current L2 spine domain? What is the governing principle? What context am I operating from that the Governor doesn't know I'm assuming?"

### B.2 — The Missing Mechanics

| Where | What's missing | PE |
|---|---|---|
| Every AI response | Context declaration before proposals | 80 |
| Scope transitions (S0→S1→S2) | Explicit context transfer | 75 |
| Governor Request Ledger | Request context capture | 65 |
| Skill invocations | Context snapshot at invocation | 70 |
| Virtual Opus Audit Q0 | Context-grounding pre-check | 72 |
| Chat integration | Real-time context gap detection | 85 |

---

## §C — Questions as Context Carriers — The Full Picture

### C.1 — Why Questions ARE Context

A question like "What specific problem are we solving?" (Q1c crystallization) does not just gather information. It FORCES the human to:
1. Activate the full context they have internally
2. Select what's most relevant
3. Externalize it in language
4. Make it available to the AI

Without the question, the Governor has 100% context; the AI has 5%. With the question answered, the AI can reach 70%+ of the relevant context.

**This is why P-META-022 (Human Intent Crystallization) is S0 (Constitutional).** Context transfer is not optional — it's the primary mechanism by which the platform operates correctly.

### C.2 — The Current Question Coverage

- **Enforced (BLOCKING):** C-type (goal_statement) + Z-type (done_criteria) for S023+ deep_quality plans
- **Advisory:** G-type (gap-surfacing) via validate-question-coverage.mjs
- **Not enforced:** B/A/P/R/X types in most contexts

**The gap:** 6 of 8 question types are not mechanically enforced. Only the "what success looks like" and "how we know it's done" contexts are required.

### C.3 — The Context Carrier Chain That Should Exist

```
Governor prompt → P-META-024 (decompose N topics)
                → per-topic → P-META-022 (crystallize intent)
                           → Q1-Q3 (extract context)
                           → session_context_record.md (capture)
                           → skills (inherit at invocation)
                           → validators (cross-reference)
                           → artifacts (declare in frontmatter)
                           → closing (verify context was honored)
```

Currently: the chain exists in principle but not in practice. P-META-022/023/024 are ratified. The mechanical chain between them is incomplete.

---

## §D — Mechanical Enforcement Vision

### D.1 — One Source of Truth for Context

**Proposed: `session-context-record.md`** (per session, auto-generated)

```markdown
# Session Context Record — S028
Generated: 2026-05-13

## Active governing contexts
- Platform scope: S1 (Platform-wide build session)
- Active principle: B_ZERO_LAPTOP_DEPENDENCY (S0 — constitutional)
- Current PE top-3: Gate 3 (PE=78) | Accountability tracking (PE=70) | Skill DNA (PE=68)
- Open requests: 4 items in governor-request-ledger.yaml

## Context gaps identified this session
- S028-CTX-001: Budget Planner deployment scope not declared before proposal
- S028-CTX-002: Level-awareness flop (S2 proposal for S1 requirement)

## Questions asked → context captured
- Q1c: "Is Gate 3 dependent on schema governance?" → INDEPENDENT (E2)
- Q2: "Universal file for credentials?" → ANSWERED: .env.platform + sync script (S1 scope)
```

This file is:
- Auto-populated by the session-open.sh hook
- Updated by each substantive exchange
- Read by the closing-summary gate
- Referenced in HANDOFF for next session

### D.2 — In-Chat Context Gap Detection

**What the Governor is asking for:** The AI should be sensitive to when it's missing context and proactively ask, rather than guessing.

**Current state:** The AI has P-META-022 (crystallization) but it's triggered only at session start for new plans, not continuously during conversation.

**Proposed mechanism:** A lightweight context-gap check at every substantive response:
```
Before responding: "Do I have enough context to make this proposal responsibly?
  Missing context indicators:
  - I'm about to propose something that requires knowing X, and X hasn't been stated
  - I'm making an assumption about Y that could change the proposal significantly
  - The Governor's request is ambiguous between interpretations A and B
  
If ANY indicator: surface the gap before proposing, not after."
```

This is not the same as the current Q1-Q3 crystallization. It's ONGOING during the conversation — not just at plan creation.

---

## §E — Stability Toward Future Elements

### E.1 — What Makes Context Definitions Stable

For context architecture to be stable as the platform grows to 30 apps:

1. **Context is declared in frontmatter** — every artifact declares its governing context
2. **Context is tested in validators** — validate-context-declared.mjs (to build)
3. **Context is transferred at scope transitions** — structured context handoff between S0→S1→S2
4. **Context is inherited by skills** — skills receive session context snapshot
5. **Context is verified at session close** — closing gate checks context was honored

**The architectural invariant:** No artifact should be created without declaring what context it serves. This is the extension of `nothing-stands-alone` to the context dimension.

---

## §F — 15 Questions for Opus Review

1. P-META-020 says "context is the compass." How does this translate to a mechanical architecture? What specifically IS the context that should be loaded before every AI turn?

2. The 8 question types (C/Z/G/R/B/A/P/X) each carry different context. Should ALL 8 be required for S0 decisions, or only specific types based on decision class?

3. `session-context-record.md` as an auto-generated per-session SSoT: is this the right abstraction, or should context live in frontmatter fields on existing artifacts?

4. The Governor's request: "integrated to this chat — sensitive and proactive on context gaps while avoiding guessing and assumptions." Is there a precise definition of "context gap" that can be mechanically detected? What signals it?

5. Questions as context carriers: should the platform have a mandatory minimum-context test before any substantive AI proposal? Define that minimum.

6. The context carrier chain (prompt → crystallize → capture → inherit → verify) has 6 steps. Which 2 should be built first to deliver 80% of the value?

7. "One source of truth for context" — is this the session-context-record.md, or the governor-request-ledger.yaml, or something else? Can one file serve both purposes?

8. B_CDAB (Context Depth Alignment Boundary) governs LIGHTWEIGHT vs COMPREHENSIVE context loading. How does this compose with the new session-context-record.md? Do they conflict?

9. "Stable toward anything created here and in the future" — what is the architectural test? For a new artifact created in 2030 by a different AI: would it automatically inherit the right context?

10. The Virtual Opus Audit Q0 (context grounding) should fire before every consequential action. How often is "every consequential"? Is this per-turn, per-decision, or per-plan?

11. P-META-024 (multi-topic decomposition) generates a routing table. Should each routed concern carry its own context declaration? How does context partition when a prompt has 7 concerns?

12. The Governor asks about chat integration — proactive on context gaps. This requires the AI to model its own uncertainty and surface it without being asked. Is this a new inner-defaults entry, or a hook mechanism, or a behavioral contract?

13. External context (what the Governor knows but hasn't said) is the hardest gap to detect. What signals indicate the Governor is operating from context the AI doesn't have?

14. "How questions mechanically enforce context in any file and element" — should `question_register:` become a required frontmatter field for ALL governed artifacts (not just plans)?

15. Context drift: across sessions, the AI's active context shifts. How should the platform track context drift (not just behavioral drift) and surface when context from 5 sessions ago is being used incorrectly?

---

## One Sentence for Opus (SROF-010)

**CSPS has ratified the context-is-the-compass principle (P-META-020) and built intent crystallization (P-META-022/023/024), but has no mechanical architecture for continuous in-session context management — the Governor's 8 questions point to a systematic gap: no session-context-record.md (SSoT), no context-gap detection at proposal time, no context handoff at scope transitions, no inheritance mechanism for skills, and no chat-integrated proactive context surfacing — the architecture needed is: (1) session-context-record.md auto-generated per session, (2) context-gap self-check at every substantive proposal, (3) mandatory minimum-context declaration before proposals, (4) question_register as required field for all artifacts — but the constitutional question is: should context architecture be L1 GVRN CORE (undebatable foundation) or L2 domain (domain-specific implementation)?**

*SROF-010 | PE=82 | Prepared S028 | Governor directive: "deep dive into importance of context in CSPS"*
