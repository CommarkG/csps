---
id: csps.handoff.vault.sonnet-council-brief.S022
name: sonnet-council-brief-S022
description: >
  Briefing for Sonnet in the two-tab council setup. Explains the situation,
  the roles, and exactly what Sonnet needs to do. Sonnet reads this file and
  responds to Q1-Q6 before any implementation begins.
version: 1.0
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: GVRN
schema_anchor: opus_consultations
session: S021
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: council-plan, href: ./implementation-plan-council-S022.md }
  - { rel: session-state, href: ../../../../tools/session-state.json }
domain_path: platform
---

# Sonnet Council Brief — S022

## The Situation

The Governor has two browser tabs open right now:

**Tab 1 — Opus tab (not you):**
A Claude session running in Opus-designated review mode. It has been doing
architectural review of CSPS across this entire conversation. It produced:
- 15 architectural lessons (opus-lessons-S019)
- A consolidated platform excellence plan
- An implementation plan with a sequence recommendation

**Tab 2 — Your tab (this one):**
You are Sonnet. You have been executing the implementation work: VOCAB-1, HAIKU-1,
HAIKU-2, DRIFT-1, enforcement rate uplift from 6% to 29%, drift coverage 57% to 71%.
You are the builder. Opus is the architect.

**These are two different AI instances. You are not Opus. Opus is not you.**

---

## What the Governor Is Trying to Do

The Governor wants a "mini council" — a structured discussion between your perspective
(Sonnet as builder) and the Opus perspective (Opus as architect) before implementation
of the next phase begins.

The goal: reach consensus on the implementation sequence before any code is written.

---

## What You Need to Read

One file: [implementation-plan-council-S022.md](https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/VAULT/implementation-plan-council-S022.md)

That file contains:
- The Opus recommendation (B first → VLT ratification → Schema → Infrastructure → Governance)
- Full session-by-session implementation specs
- The split decision (4 sessions, not bundled)
- **6 council questions (Q1-Q6) that Opus wants YOUR answer to**

---

## What You Do

**Step 1 — Read** `docs/plan/_handoff/VAULT/implementation-plan-council-S022.md`

**Step 2 — Answer Q1 through Q6** from §5 of that document.
Each answer should be: your position + 1-2 sentences of reasoning.
Do not agree just to agree. Push back if you see something Opus missed.
You were IN the S020-S022 implementation sessions. Opus was not.

**Step 3 — State your overall position:**
Do you agree with Opus's recommended sequence (B → VLT → Schema → Infrastructure → Governance)?
Or do you recommend a different order? State it clearly.

**Step 4 — Flag anything the plan misses:**
You have context from the actual implementation work (S020-S022) that Opus does not have.
If something in the plan is wrong, impractical, or contradicts what you learned
during implementation — say so explicitly.

---

## What You Do NOT Do

- Do not implement anything yet. This is a discussion, not an execution session.
- Do not defer to Opus just because it's labeled "Opus-designated." You have equal standing.
- Do not summarize the plan back at the Governor — they've read it. Answer the questions.
- Do not add scope. Answer Q1-Q6, state your position, flag gaps. That's it.

---

## The Output Format

```
SONNET COUNCIL POSITION — S022

Q1 — Sequence (Live DB vs. Schema first):
[your answer + reasoning]

Q2 — AppendOnlyBase timing:
[your answer + reasoning]

Q3 — GDPR now vs. defer:
[your answer + reasoning]

Q4 — Session 4 (governance) blocking anything?:
[your answer + reasoning]

Q5 — VLT ratification now vs. wait:
[your answer + reasoning]

Q6 — What does the plan not account for?:
[specific things you know from S020-S022 that Opus doesn't]

OVERALL POSITION:
[agree / partially agree / disagree with Opus sequence, stated clearly]
[if different sequence: state it]
```

---

## One Sentence Summary

Opus architected a plan. You implemented it. Now you discuss it.
Answer Q1-Q6, push back if needed, reach consensus.
