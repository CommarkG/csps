---
id: csps.handoff.vault
name: handoff-vault
description: Vault index — supplementary handoff content separated out so each per-session HANDOFF-S<NNN>-to-S<NNN+1>.md file stays scannable. The vault contains insights synthesized from sessions, research index, canonical protocols (closing/fresh-chat/session-naming), and the open-questions ledger. The session handoff is the foundation; the vault expands it.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ../HANDOFF-S001-to-S002.md }
  - { rel: stewardship, href: ../../pillar-0-governance/stewardship-protocol.md }
  - { rel: learning-loop, href: ../../pillar-0-governance/learning-loop.md }
domain_path: platform
---

# Handoff Vault — Index

> **Chat "jumps" are where golden coins fall off pockets and never retrieved. This document is the pocket-seal.**

## What this directory holds

The session handoff (`docs/plan/_handoff/HANDOFF-S<NNN>-to-S<NNN+1>.md`) is the **per-session record** — what the previous session accomplished, what the next session must do, the FWWS-pending list, the state snapshot. The VAULT is the **persistent supplementary content** that doesn't change session-to-session.

```
docs/plan/_handoff/
├── HANDOFF-S<NNN>-to-S<NNN+1>.md     ← per-session (S001→S002, S002→S003, …)
└── VAULT/
    ├── README.md                      ← this file (vault index)
    ├── insights.md                    ← synthesized insights from sessions
    ├── research-index.md              ← all research streams + sources
    ├── protocols.md                   ← canonical closing/fresh-chat/naming protocols
    └── open-questions-ledger.md       ← Open Questions extracted from leaf docs (P-META-004 tracked items)
```

Future expansions (per HANDOFF-S001-to-S002.md §8) — to be added as sessions accumulate:

- `principles-snapshot.md` — point-in-time snapshot of `principles.yaml` at each session close
- `decisions-snapshot.md` — locked decisions per session
- `pending-work.md` — historical record of FWWS-pending lists
- `user-intents.md` — verbatim quotes vault (the cardinal directives, preserved across sessions)

## Why the split

Per the user's "nothing stands alone — every input has a place + a predefined process" directive: the per-session handoff has a clear lifecycle (created, read once by the next session, eventually retired to historical-only). The VAULT entries are evergreen — referenced across many sessions, updated incrementally.

Splitting them means:
- Per-session handoff stays focused on **what differs** between sessions
- Vault stays focused on **what persists** across sessions
- Audit cadences differ (per-session handoff: read-once → archive; vault: continuous review per P-META-004 stewardship)

## Stewardship of vault content

Each file in this directory is governed by P-META-004 — declares `lifecycle_state: active` and is reviewed under the `active-stale` 90-day cadence. When a vault file is superseded, mark it `lifecycle_state: deprecated` (terminal) and reference the successor.

## How to use this vault

| You're … | Read … |
|---|---|
| A fresh AI assistant starting S<NNN+1> | The latest `HANDOFF-S<NNN>-to-S<NNN+1>.md` (priority zero). Then this vault as needed. |
| Looking up a research finding from a prior session | `research-index.md` |
| Looking up the canonical closing protocol | `protocols.md` §10 |
| Looking up the canonical fresh-chat protocol | `protocols.md` §11 |
| Reviewing open questions across the project | `open-questions-ledger.md` |
| Synthesizing a new insight or distillation | Add to `insights.md` (don't create a new file) |

## Cross-references

- [stewardship-protocol.md](../../pillar-0-governance/stewardship-protocol.md) — the principle the vault implements
- [learning-loop.md](../../pillar-0-governance/learning-loop.md) — the sibling principle for things-that-should-be-saved-but-might-not-be
- [HANDOFF-S001-to-S002.md](../HANDOFF-S001-to-S002.md) — the foundational handoff that established this vault
