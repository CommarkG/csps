---
id: csps.tools.templates.chat-transfer
name: chat-transfer-template
description: >
  Canonical chat-transfer index file. Generated at every session close.
  Contains context links + mandate + 3 rules + start action.
  The Governor sends a 4-line prompt. The new AI reads this file. Always the same structure.
version: 2.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
core_spine: OPER
schema_anchor: templates
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S016
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/protocols.md
links:
  - { rel: parent, href: ./ }
  - { rel: registry, href: ../../docs/plan/_handoff/VAULT/template-registry.md }
---

# Chat Transfer Template v2

---

## PART 1 — What the Governor sends (4 lines, fill session numbers)

```
You are a new chat - your name is S<NEXT>
I am previous chat - last session I handled was S<CURRENT>

Read [docs/plan/_handoff/VAULT/chat-transfer-S<CURRENT>-to-S<NEXT>.md] and comment so I could know you have all the content and context and can make progress!
Awaiting your comment, do not hesitate to ask for clarifications.
```

That's it. Governor types these 4 lines. No copy-paste blocks. No ceremony.

---

## PART 2 — The chat-transfer file (what the new AI reads)

Fill the template below and save as `docs/plan/_handoff/VAULT/chat-transfer-S<CURRENT>-to-S<NEXT>.md`

```markdown
# S<NEXT> — Context + Alignment

## Read these files first
- [Full state](HANDOFF-S<CURRENT>-to-S<NEXT>.md) — Zone A §CORE-PILLARS (mandatory)
- [Session extraction](session-S<CURRENT>-extraction.md) — what was learned
- [Additional context] — add any other relevant files here with one-line descriptions

## S<NEXT> mandate (one sentence)
<mandate>

## Critical rules
1. Core-layer only — no app work without explicit Governor directive per specific task
2. Foundation gate CLEAN required before any phase advance (validate-phase-exit-criteria.mjs)
3. B_COMPLETION_OVER_SHINY — active work >50% complete before new shiny items

## Start action
pnpm verify --skip-install → expect exit_code 0, <N> validators

## Your response format (mandatory)
Start with:
  "Hi previous chat,
   I am the new chat continuing your work.
   [all is understood — I have all I need / I have some things to clarify: ...]"
```

---

## PART 3 — What the new AI MUST say (AGENTS.md enforces this)

The new AI's FIRST response after receiving a chat-transfer MUST start with:

```
Hi previous chat,
I am the new chat continuing your work.
```

Then ONE of:
- `All is understood — I have all I need. [brief confirmation of mandate]`
- `Thanks for the files — I have some things to clarify: [specific questions]`

No other opening is valid. No "I've read the handoff and I'm ready." No summary of what was done. The format is fixed so the Governor can scan in 3 seconds whether the new AI is aligned.

---

**Template signature:** S016-AI-chat-transfer-template-v2-2026-05-07T00:00:00Z
