---
id: csps.handoff.vault.proposals
name: proposals-readme
description: "Tier 1 constitutional change proposal process. PROP-NNN files live here. Governor ratifies; OPUS-2 reviews; Sonnet implements after ratification."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S037
scope_level: S1
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: template, href: ../templates/pi-proposal-tier1.yaml }
---

# Tier 1 Constitutional Change Proposals

This directory holds `PROP-NNN` files — formal proposals for constitutional (Tier 1) changes to the CSPS platform. These are changes that touch L1-sealed doctrine, ratify new principles, or modify platform-wide constraints.

## Why this exists

Constitutional changes are high-stakes. A wrong principle costs 5+ sessions to undo. The proposal process provides:
- **OPUS-2 review**: architectural validation before any implementation
- **Cooling period**: one session between ratification and implementation
- **Risk documentation**: explicit what-breaks-if-wrong + rollback path
- **Audit trail**: every ratified constitutional change is tracked here

## The 4-step process

```
1. Propose  → Copy pi-proposal-tier1.yaml → fill all fields → PROP-NNN.yaml
2. Review   → File SROF or present in OPUS-2 turn → opus2_review_turn set
3. Ratify   → Governor sets governor_ratified_at + cooling_period_satisfied
4. Implement → Sonnet builds in a new session after cooling period
```

**Never implement a Tier 1 proposal without `governor_ratified_at` set.**

## Files in this directory

| File | Status | Title |
|---|---|---|
| *(empty — first proposal pending)* | | |

## Template

Use [../templates/pi-proposal-tier1.yaml](../templates/pi-proposal-tier1.yaml) to create new proposals.

Auto-generated candidates from `pnpm sync:universal` appear here for Governor review before any universal-governance addition.

*OPEN-010 | S037-C | 2026-05-16*
