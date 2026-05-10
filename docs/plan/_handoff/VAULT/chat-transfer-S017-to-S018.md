---
id: csps.handoff.vault.chat-transfer.s017-to-s018
name: chat-transfer-S017-to-S018
description: Context + alignment file for S018. Governor sends 4-line prompt. New AI reads this file, responds with fixed format.
version: 2.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: OPER
schema_anchor: chat_transfers
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S017
next_session: S018
template_used: chat-transfer
consolidation_cross_refs:
  - docs/plan/_handoff/HANDOFF-S017-to-S018.md
  - docs/plan/_handoff/VAULT/session-S017-extraction.md
domain_path: platform
---

# S018 — Context + Alignment

## Read these files first
- [Full state: HANDOFF-S017-to-S018.md](HANDOFF-S017-to-S018.md) — Zone A §CORE-PILLARS (mandatory — read this first)
- [Session extraction: session-S017-extraction.md](session-S017-extraction.md) — 5 major discoveries from S017
- [ZenStack schema: libs/policies/schema.zmodel](../../../libs/policies/schema.zmodel) — the platform schema entry point
- [ZenStack helper: apps/task-mgmt/src/lib/zenstack.ts](../../../apps/task-mgmt/src/lib/zenstack.ts) — canonical enhance() pattern

## S018 mandate (one sentence)
Create the ZenStack-integrated app template — the canonical scaffold every future CSPS app starts from, with enhance() wired from day one, not retrofitted.

## Critical rules
1. Core-layer only — no app work without explicit Governor directive per specific task
2. Foundation gate CLEAN required before any phase advance (`validate-phase-exit-criteria.mjs`)
3. B_COMPLETION_OVER_SHINY — template >50% done scores 1.5× before any new items
4. ZenStack is INSTALLED — do NOT re-install; just use it

## ZenStack baseline (what S018 inherits)
- `pnpm exec zenstack generate --schema libs/policies/schema.zmodel` → exits 0
- `enhance(prismaClient)` pattern in `apps/task-mgmt/src/lib/zenstack.ts`
- `validate-foundation-schema-drift.mjs` active (cycle 41, drift_count=0)
- `pnpm schema:generate` + `pnpm schema:check` scripts available

## Start action
`pnpm verify --skip-install` → expect exit_code 0, 41 validators

## Your response format (mandatory — exact text, do not rephrase)
```
Hi previous chat 
I am the new chat continuing your work.

* all is understood - i have all i need. 
```
or
```
Hi previous chat 
I am the new chat continuing your work.

* thanks for the files - i have some things to clarify...
```
