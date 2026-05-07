---
id: csps.tools.templates.chat-transfer
name: chat-transfer-template
description: >
  Canonical minimal paste-target for chat-to-chat (C<N>→C<N+1>) and session-to-session
  (S<NNN>→S<NNN+1>) transfers. 12-line maximum. Super simple, super clear. Full state
  in the HANDOFF document — this file is only the paste-target. Generated at every
  session close. Lives at docs/plan/_handoff/VAULT/chat-transfer-S<NNN>-to-S<NNN+1>.md.
  Mechanically checked by post-stop-session-close-gate.sh and validate-session-artifact-sync.mjs.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
core_spine: OPER
core_spines: [OPER, GVRN]
schema_anchor: templates
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S016
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/protocols.md
  - docs/plan/pillar-0-governance/plan-creation-protocol.md
links:
  - { rel: parent, href: ./ }
  - { rel: registry, href: ../../docs/plan/_handoff/VAULT/template-registry.md }
  - { rel: protocol, href: ../../docs/plan/_handoff/VAULT/protocols.md }
---

# Chat Transfer Template

> **Zero copy-paste required.** The Governor types one line. The AI reads the file.
> Generated at every session close at a predictable path the AI can find directly.

---

## How it works

**Primary path (session-open.sh fires automatically):**
Open new Claude Code chat in the CSPS workspace → session-open.sh injects the mandate + context → AI is already briefed. Type nothing. Or just type: `proceed.`

**Explicit start (one line, no copy-paste):**
```
S<NNN>: read docs/plan/_handoff/VAULT/chat-transfer-S<NNN-1>-to-S<NNN>.md
```
The AI reads the file via Read tool and proceeds. No clipboard operation.

---

## The File Content (what the AI reads — not what the Governor copies)

```
CSPS <S_NEXT> — CHAT TRANSFER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are:  <S_NEXT>-AI (new chat — read this fully before responding)
I am:     <S_CURRENT>-AI (CLOSED — last commit <COMMIT_HASH>)

MANDATE:  <one sentence — the primary work for S_NEXT>
START:    pnpm verify --skip-install → expect exit_code 0, <N> validators
CONTEXT:  HANDOFF-<S_CURRENT>-to-<S_NEXT>.md → Zone A §CORE-PILLARS

DECLARE:
  "I am [your actual model]. S<N> mandate received: <mandate_brief>.
   Receipt: <S_CURRENT>-AI-attest-<ISO>-<S_CURRENT>-close confirmed."

RULES: Core-layer only | No app work without explicit Governor directive | Foundation gate CLEAN required
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full state: docs/plan/_handoff/HANDOFF-<S_CURRENT>-to-<S_NEXT>.md
```

---

## Rules for generating this file

1. **Maximum 12 lines** between the two horizontal rules. No exceptions.
2. **MANDATE** = one sentence. Not a paragraph. If you can't say it in one sentence, the mandate isn't clear yet.
3. **DECLARE** = the exact text the new AI types back to confirm receipt. Standardized. Not creative.
4. **RULES** = always these exact three. Never add a fourth.
5. **Full state pointer** = always the HANDOFF path. That's where details live.

## What NOT to include

- Do NOT include session history
- Do NOT include the full list of open items
- Do NOT include principles or contracts
- Do NOT include multi-step start protocols
- Do NOT include "critical operating rules" sections
- Do NOT vary the format

The HANDOFF document is where everything else lives. This file is a door, not a room.

---

**Template signature:** S016-AI-chat-transfer-template-2026-05-07T00:00:00Z
