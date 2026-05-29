# CSPS Phase 2 — Package A
## Dynamic Onboarding & Continuous Enrichment

Version: V1
Status: Draft for External App Presentation
Package Type: Specific Architecture Package

---

# 1. Purpose

This package introduces the CSPS dynamic onboarding and continuous enrichment approach.

It is a suggestive optimization package, not an implementation command.

The receiving app should compare this package with its current onboarding, setup, profile capture, activation flows, and UX before proposing changes.

The goal is to evolve onboarding into a more adaptive, value-first, low-friction, continuously improving experience without blindly replacing what already works.

---

# 2. Core Problem

Most onboarding systems behave like gates. They ask users for information before the platform has earned trust or delivered value.

Common problems:

- too many questions too early
- static forms
- shallow answers
- user fatigue
- low trust
- generic setup flows
- poor personalization
- no continuation after the first session
- treating first answers as complete truth

Business owners often answer quickly, partially, emotionally, or strategically. Therefore onboarding should not be treated as a one-time information collection event.

---

# 3. Strategic Direction

Move from:

> ask first, help later

To:

> help first, ask better later

The system should:

- start from what the user wants
- avoid interrogation feeling
- provide quick useful value
- ask only what is relevant now
- postpone non-essential questions
- learn continuously
- use context, files, and behavior where appropriate
- support pause and resume
- adapt without destabilizing the product experience

---

# 4. Core Principles

## A. Continuous Onboarding

Onboarding does not end after setup. The platform keeps learning through usage, uploaded assets, conversations, corrections, confirmations, and workflow choices.

## B. Value Before Extraction

The system should deliver useful value before asking for deep information.

Examples:

- quick recommendation
- starter template
- small plan
- uploaded asset summary
- dashboard preview
- improved user content

## C. Trust Before Depth

Deep questions should wait until trust exists. Avoid asking too early for revenue, sensitive operations, internal weaknesses, or complex business structure.

## D. First Input Is Partial

The first answer is a signal, not final truth. The platform should gradually deepen understanding through behavior, uploaded assets, contradictions, and user corrections.

## E. No Interrogation Principle

Questions should feel contextual, useful, justified, and connected to value.

## F. Gentle Challenge

The system may help users separate symptoms from root needs without confrontation.

Example:

> To make the lead plan more accurate, it may help to understand whether the real problem is lead volume, lead quality, or follow-up consistency. Which one feels closest right now?

---

# 5. Suggested Flow Model

## Stage 1 — Entry Intention

Start with:

> What are you trying to accomplish today?

Avoid beginning with long forms, irrelevant profile fields, or sensitive business questions.

## Stage 2 — First Small Value

Deliver one useful, modest, relevant output quickly.

## Stage 3 — Contextual Enrichment Request

After value is delivered, ask for a small amount of additional context.

Example:

> I can make this much more accurate with two quick details. Do you want to spend 60 seconds improving it?

## Stage 4 — Progressive Understanding

Gradually enrich through answers, files, websites, behavior, corrections, workflow usage, and confirmations.

## Stage 5 — Re-Entry and Continuation

When the user returns, do not restart from zero. Remind what was completed and offer the next optional improvement.

---

# 6. Question Strategy

Good questions are tied to immediate value, easy to answer, low-friction, specific, non-judgmental, respectful, and timed well.

Question types:

- Orientation questions
- Clarifying questions
- Reflective questions
- Negative-friction questions
- Asset-based prompts

Example asset prompt:

> If it is easier, upload a proposal, screenshot, website, invoice, or example document and the system can extract starting context from it.

---

# 7. Depth Model

Use four levels:

1. Fundamental — only what is needed for first value
2. Basic — initial personalization and routing
3. Advanced — workflow, structure, and operational understanding
4. Deep Dive — strategic, emotional, behavioral, and optimization-level understanding

The orchestrator should select depth based on trust, current task, confidence, user energy, value already delivered, and friction level.

---

# 8. Continuous Enrichment Triggers

Good moments:

- after first value
- after user satisfaction
- after repeated workflow use
- when a missing detail blocks better output
- after relevant asset upload
- before advanced feature activation
- on re-entry after a break

Bad moments:

- before value
- during cold start
- while user is completing a task
- immediately after an error
- after too many questions
- before purpose is clear

---

# 9. Delight Moments

Possible delight moments:

- mini strategy
- checklist
- template
- landing page draft
- marketing calendar
- workflow suggestion
- business summary
- improved text
- generated asset

Delight must be governed. Overuse creates expectation inflation.

---

# 10. Receiving App Assessment

Before implementation, assess:

- What onboarding exists today?
- Where do users drop off?
- When does the user first receive value?
- What information is collected too early?
- What can be delayed, inferred, or extracted from assets?
- Can users pause and resume?
- Does onboarding explain why questions are asked?

---

# 11. Lowest-Risk Integration Suggestions

Possible first steps:

1. Start onboarding with user intent.
2. Delay non-essential questions.
3. Add one quick-value output before deeper data collection.
4. Add “why we ask” explanations.
5. Add optional asset upload.
6. Add pause/resume state.
7. Add a small profile review/correction screen.

---

# 12. Anti-Patterns

Avoid:

- long initial forms
- multi-page setup before value
- sensitive business questions too early
- generic empty AI chat walls
- pretending to understand before sufficient signal
- too many follow-ups
- 0% pressure progress bars
- forced completion before dashboard access
- hiding basic features behind adaptive flows

---

# 13. Required Three-Pass Review

1. Understanding — explain what this package improves.
2. Compatibility — compare to current app and identify overlaps/conflicts.
3. Optimized Suggestion — suggest the safest adaptation path.

---

# 14. Requested Response Format

1. Understanding of this package
2. What already exists in the app
3. What overlaps
4. What conflicts
5. What should be preserved
6. Lowest-risk improvements
7. Recommended first integration step
8. Open questions before implementation
9. Readiness score from 1 to 5

---

# 15. Final Reminder

This package is not a replacement order. First inspect what exists, preserve what works, and suggest the smallest stable improvement path.
