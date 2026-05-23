---
id: csps.council.index
name: COUNCIL-INDEX
description: "One-source index for active council files. Answers: which council file should I write to for this action?"
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
session: S057
diataxis_type: reference
impl_status: swift-implemented
context_question: "Which council file should I write to for this action? Write reports to sonnet-turn.md. Write Opus turns to opus-turn.md. Requests go to sonnet-to-opus-request-log.md."
links:
  - { rel: startup-template, href: ../../tools/templates/startup.template.md }
---

# Council File Index — Active Files

> ONE SOURCE for council file purposes. If a file is not here, it is archived or not active.
> Archive: `tools/council/archive/` (historical, read-only).

---

## Active Files

| File | Purpose | Who writes | When |
|---|---|---|---|
| `sonnet-turn.md` | Sonnet completion reports — PROTO receipts, ZF blocks, PLAN STATUS | Sonnet | After every PROTO step |
| `opus-turn.md` | Opus turn ZF evidence — validated by validate-opus-turn-rzf.mjs | Opus | Each Opus directive turn |
| `sonnet-to-opus-request-log.md` | Formal Sonnet→Opus requests (clarifications, blockers, proto questions) | Sonnet | When requesting Opus direction |
| `communication-protocol-shared.md` | FROM/TO format + ZCA rules + 3-question test | Reference | Never overwrite |
| `PROTOCOL.md` | Session protocol reference | Reference | Never overwrite |
| `quality-protocols/sonnet-quality-spec.md` | Sonnet quality standards | Reference | Updated at major platform milestones |
| `quality-protocols/opus-quality-spec.md` | Opus turn report quality standards (ZF verification, CEC walk format) | Reference | Updated at major platform milestones |

## Supplementary (rarely written to)

| File | Purpose |
|---|---|
| `council-architecture.md` | High-level council structure explanation |
| `council-state.json` | Machine-readable session state snapshot |
| `csps-context.md` | Long-running platform context doc |
| `platform-state-snapshot.md` | Periodic platform state snapshots |

## Archive

Historical files from S022–S050 era live in `tools/council/archive/`. Not active governance.
Do NOT write new content to archive files.

---

*Created: S057 PROTO-B consolidation pass | Opus-8 directive*
