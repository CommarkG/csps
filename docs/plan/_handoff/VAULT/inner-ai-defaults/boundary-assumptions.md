---
id: csps.handoff.vault.inner-ai-defaults.boundary-assumptions
name: boundary-assumptions
description: "Inner-AI-default: boundary-context-assumption — ZCA override. Claude assumes shared context at every boundary; CSPS requires WHO/WHAT/HOW/NOW at every crossing."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: inner-ai-defaults
session: S036
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ./README.md }
  - { rel: template, href: ../templates/ai-transfer-template.md }
  - { rel: protocol, href: ../../../../tools/council/communication-protocol-shared.md }
context_question: "Is this AI default still the active training default, or has CSPS overridden it? Check enforcement_stage before assuming it is active."
---

# Inner-AI-Default: Boundary Context Assumption

Per the [inner-ai-defaults registry schema](./README.md#per-entry-schema):

```yaml
---
id: ai-boundary-context-assumption
category: reasoning
default_pattern: |
  Claude assumes shared context when communicating within what feels like
  "the same project" — referencing "what we discussed", "per the plan",
  "as you know", when the receiver may be a completely new instance with no memory.
csps_aligned_pattern: |
  At every boundary crossing: assume zero. Every SROF, every chat-jump,
  every API response, every EKEP exchange — provide WHO/WHAT/HOW/NOW.
  The receiver is always a stranger until proven otherwise.
disposition: override
concept_ref: "AI L2 inner-defaults"
reason: |
  Every cross-boundary communication in CSPS has failed when context was assumed.
  S036 incident: chat-jump sent to new Sonnet assumed it knew what OPUS-2 is,
  what CSPS is, what S036 means, what the 3-party triangle is. New Sonnet had none
  of this context. Governor caught it: "Do not falsely assume it knows the basics."
  ZCA = the concept that closes this gap at ALL boundary types permanently.
caught_by_validator: validate-boundary-alignment.mjs (LIVE — boundary alignment checks)
example_default: |
  Chat-jump prompt: "Continue S036 work. OPUS-2 is in the other tab."
  (Assumes receiver knows who OPUS-2 is, what S036 is, what work is in progress.)
example_aligned: |
  Chat-jump prompt with full WHO/WHAT/HOW/NOW per ai-transfer-template.md:
  WHO: roles + relationships; WHAT: CSPS project + stack; HOW: 3-party triangle
  + communication rules; NOW: last commit + active directive INLINE.
discovered_in_session: S036
last_validated: 2026-05-16
status: active
---
```

## The 7 boundary types where ZCA applies

| Boundary | Example | What new receiver doesn't know |
|---|---|---|
| AI tab → AI tab | OPUS-2 chat → Sonnet chat | What CSPS is, what roles are, current state |
| AI → AI system | CSPS → Lovable API | What CSPS is, what schema applies |
| AI → external developer | API response, error message | What the system does, how to fix it |
| AI → new session | Session start briefing | Everything — full zero start |
| AI → audit log | AuditEvent data field | Why the action happened, what it means |
| AI → external AI agent | EKEP exchange | Architecture, vocabulary, expectations |
| Sonnet → Governor (SROF) | Report on work done | Context of what was asked, why |

## The 4 essentials (WHO-WHAT-HOW-NOW)

1. **WHO** — who is the sender, who is the receiver, what roles do they play
2. **WHAT** — what is the project/system, what technology, what purpose
3. **HOW** — how the collaboration works, communication rules, the pattern
4. **NOW** — current state, what's active, what's next, the concrete action

**The test:** "Could a knowledgeable person with NO background on this project understand this completely?" If no → the boundary is not crossed correctly.

## Template

Use [ai-transfer-template.md](../templates/ai-transfer-template.md) for all AI-to-AI transfers.

*OPUS-2 Turn 77 | S036 | 2026-05-16*
