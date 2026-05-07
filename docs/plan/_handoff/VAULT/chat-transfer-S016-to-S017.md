---
id: csps.handoff.vault.chat-transfer.s016-to-s017
name: chat-transfer-S016-to-S017
description: Context + alignment file for S017. Governor sends 4-line prompt. New AI reads this file, responds with fixed format.
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
session: S016
next_session: S017
template_used: chat-transfer
consolidation_cross_refs:
  - docs/plan/_handoff/HANDOFF-S016-to-S017.md
  - docs/plan/_handoff/VAULT/session-S016-extraction.md
---

# S017 — Context + Alignment

## Read these files first
- [Full state: HANDOFF-S016-to-S017.md](HANDOFF-S016-to-S017.md) — Zone A §CORE-PILLARS (mandatory — read this first)
- [Session extraction: session-S016-extraction.md](session-S016-extraction.md) — 5 major discoveries from S016
- [Bedrock status: csps-bedrock.md](../../../docs/plan/pillar-0-governance/csps-bedrock.md) — 86% complete, ZenStack unblocks the rest
- [Layer separation: csps-layer-separation.md](../../../docs/plan/pillar-0-governance/csps-layer-separation.md) — core vs app, mandatory read

## S017 mandate (one sentence)
Install ZenStack in CSPS project (Option A) → enables DB-level RLS + schema drift validator + foundation-slices L3 closure.

## Critical rules
1. Core-layer only — no app work without explicit Governor directive per specific task ("approved/proceed" ≠ permission)
2. Foundation gate CLEAN required before any phase advance (`validate-phase-exit-criteria.mjs`)
3. B_COMPLETION_OVER_SHINY — ZenStack install >50% done scores 1.5× before any new items

## Start action
`pnpm verify --skip-install` → expect exit_code 0, 40 validators

## Your response format (mandatory)
Start with:
```
Hi previous chat,
I am the new chat continuing your work.
[all is understood — I have all I need. / I have some things to clarify: ...]
```
