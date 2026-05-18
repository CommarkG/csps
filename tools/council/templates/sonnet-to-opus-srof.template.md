---
id: csps.council.templates.sonnet-to-opus-srof-template
name: sonnet-to-opus-srof-template
description: "Canonical template for Sonnet→Opus SROF (Structured Review and Opinion Format) messages. Use for any architectural review, ratification, or multi-session planning decision. Copy-paste and fill."
version: 1.1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S040
---

# Sonnet → Opus SROF Template

> **When to use:** Any time Sonnet needs Opus-level architectural review, ratification, or multi-session planning decisions. This IS the canonical format — no other format needed.
>
> **How to use:** Copy this template → fill every field → paste to Opus tab. All sections are mandatory. Missing a section = malformed SROF = Opus will flag before answering.

---

## THE TEMPLATE

```
[PROTOCOL: SROF-[NNN] | STEP: 1 of 1 | MODE: REVIEW + REFINE]

YOU ARE: OPUS-[N] (Claude Opus), the architectural advisor for CSPS.
         You are in a separate Claude Code tab from Sonnet.
         You have no memory of previous sessions — read this entire prompt before responding.

I AM: Sonnet (S[NNN], builder), reporting architectural decisions that require Opus review.
      Governor: Yariv Fink.
      Platform: github.com/CommarkG/csps | [live URL if applicable].
      Last commit: [SHA] ([what was done]).

THIS IS THE SITUATION: [2-3 sentences max: what was built, what problem was found,
      what decision is needed. State urgency if applicable.]

YOUR TASK: Review the [NUMBER] SROF questions below. Answer each with architectural
      recommendation + rationale. Then provide a Turn [N] directive to Sonnet.

---

WHAT: [What Sonnet built or completed — brief list, not exhaustive]
- [Item 1]
- [Item 2]
- [Item 3]

HOW (what Opus needs to do — numbered):
(1) [Specific Opus action]
(2) [Specific Opus action]
(3) [Specific Opus action]

NOW: [File path of main plan/document to read]. CSPS verify exit_code=[0|1].

---

[OPTIONAL CONTEXT SECTIONS — add as needed, remove if not needed]

WHAT WAS BUILT (detailed):
[Subsections as needed for complex builds]

STRUCTURAL GAPS FOUND:
[C1, C2, C3 format — numbered structural gaps]

INHERITANCE / ARCHITECTURE NOTES:
[Any architectural constraints Opus needs to know before answering]

---

SROF QUESTIONS ([NUMBER] — please answer all):

Q1 [[Category]]: [Question — specific, answerable, consequential.]
   [Sub-context if needed — what went wrong without the right answer.]

Q2 [[Category]]: [Question]

Q3 [[Category]]: [Question]

[Continue to Q6 max per SROF. If more questions needed: split into two SROFs.]

---

ALIGNMENT QUESTIONS (confirm before responding):

AQ1: [Verification question — does Opus have the key file in context?]
AQ2: [Context freshness check]
AQ3: [Scope check — is the summary sufficient or more detail needed?]

Sonnet, reporting S[NNN] state, awaiting Turn [N] directive.
```

---

## FIELD GUIDE

| Field | Required | Notes |
|---|---|---|
| PROTOCOL header | YES | SROF-NNN increments per SROF. Step is always 1 of 1 (SROFs are atomic). |
| YOU ARE / I AM / THIS IS / YOUR TASK | YES | Rule 10 — mandatory on all cross-boundary messages |
| WHAT / HOW / NOW | YES | Concise. NOW includes file path and verify state. |
| SROF QUESTIONS | YES | Max 6 per SROF. [Category] tag is mandatory — classifies question type |
| ALIGNMENT QUESTIONS | YES | Always 3. AQ1=context check, AQ2=freshness, AQ3=scope |
| Closing line | YES | "Sonnet, reporting S[NNN] state, awaiting Turn [N] directive." |
| Detailed context sections | NO | Add only if the concise sections are insufficient |

## QUESTION CATEGORIES (use in Q[N] [[Category]] tags)

| Category | When to use |
|---|---|
| `[Architecture]` | System design, contract scope, dependency order |
| `[Schema]` | Data model, field types, enum vs free-form |
| `[Enforcement]` | T1/T2/T3 assignment, hook vs validator, blocking vs advisory |
| `[Session order]` | PE scoring, build sequence, dependency ordering |
| `[Scope]` | One initiative vs two, platform vs app, universal vs CSPS-specific |
| `[UX]` | User experience, flow, friction, discoverability |
| `[Risk]` | Reversibility, blast radius, production impact |

## OPUS TURN RESPONSE FORMAT

When Opus responds to a SROF, the response should follow:

```
[OPUS TURN [N] — SROF-[NNN] RESPONSE]

ALIGNMENT CONFIRMATIONS:
AQ1: [Yes/No + note]
AQ2: [Yes/No + note]
AQ3: [Yes/No + note]

SROF ANSWERS:

Q1 [[Category]] — [One-line architectural recommendation]
[Rationale: 2-4 sentences. Why this choice? What failure does the alternative cause?]

Q2 [[Category]] — [Recommendation]
[Rationale]

[Continue for all questions]

TURN [N] DIRECTIVE:
[What Sonnet should do next — specific, actionable, in PROTO format if implementation needed]

OPEN ITEMS REGISTERED:
- OPEN-[NNN]: [item]
- OPEN-[NNN]: [item]
```

---

## CANONICAL EXAMPLES

See:
- `tools/council/opus-briefing-S040-consolidation.md` — Opus briefing document format
- `tools/council/multi-session-plan-S040-playground-inheritance.md` — what Sonnet reviews
- Sonnet's SROF-013 prompt (S040) — first canonical use of this template
