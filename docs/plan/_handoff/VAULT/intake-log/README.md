---
id: csps.handoff.vault.intake-log
name: intake-log
description: Append-only JSONL intake log per session. One row per IntakeEvent normalization. Source of truth for input-processing history. Per unified-intake topic-plan L2 (S011 §24++). Structure defined by packages/schemas/intake-event.ts.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: intake_log
tags:
  - domain:governance
  - domain:ops
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Intake Log — CSPS

> **Append-only JSONL log.** One file per session: `S<NNN>.jsonl`. Each line = one `IntakeEvent` envelope (per `packages/schemas/intake-event.ts`).

## File naming

```
intake-log/
  S007.jsonl    — session 007 events
  S008.jsonl    — session 008 events
  ...
  S<NNN>.jsonl  — current session
```

## JSONL format (one line per event)

```json
{"id":"GP-S011-01","source_class":"chat-channel","received_at":"2026-05-05T15:43:00Z","raw":"You are S011...","classified_type":"session-open-mandate","content_hash":"sha256:...","tags":["domain:governance","type:directive"],"priority_band":1,"route_to":"SWIFT_EXECUTE","state_machine_pos":"executed","dialog_thread_id":"s011-chat-1"}
```

## Discipline

- **Append-only**: never edit existing rows; create new row to amend
- **Session boundary**: new file per session (not per chat)
- **intake-router.mjs** writes rows automatically when processing events
- **validate-intake-event.mjs** validates each row against IntakeEvent schema
