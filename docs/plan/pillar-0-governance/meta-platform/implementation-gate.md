---
id: csps.governance.meta-platform.implementation-gate
name: implementation-gate
description: "PIG: advisory gate checking that commits touching libs/ or apps/ reference a ratified PI-NNN. Current: advisory. Escalation path: BLOCKING after PI backfill."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: vault_files
diataxis_type: reference
session: S037
depth_level: 2
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: validator, href: ../../../../tools/validators/validate-implementation-gate.mjs }
  - { rel: pi-system, href: ./plan-items.md }
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - maturity:stable
scope_level: S1
---

# Implementation Gate (PIG)

The Implementation Gate (PIG) is the mechanical link between ratified PI items and actual commits. It ensures every change to `libs/` or `apps/` references a ratified plan item.

## Current State: Advisory

`tools/validators/validate-implementation-gate.mjs` reads `git log -1 --name-only`. If the last commit:
- Touches any file in `libs/` or `apps/`
- Does NOT contain `PI-NNN` in the commit message
- Does NOT start with `fix:` / `chore:` / `docs:` (exempt prefixes)

→ ADVISORY: "No PI reference — consider adding PI-NNN to commit message"

Exits 0 always. Registered in `pnpm verify` as advisory.

## Escalation Path: BLOCKING

Per OPUS-2 Turn 62 + PI-003, the gate escalates to BLOCKING after:
1. PI backfill is complete (all existing commits grandfathered via known-deferred-advisories.yaml)
2. Governor ratifies the escalation (PROP-NNN Tier 1 change required)
3. All active PI items are in the register (no orphan implementations)

## Exempt Patterns

| Pattern | Reason |
|---|---|
| `fix:` prefix | Bug fixes on existing implementations |
| `chore:` prefix | Build/tooling changes without implementation |
| `docs:` prefix | Documentation only |
| No libs/apps files touched | Governance-only commits |

## Wiring

```
verify.mjs → validate-implementation-gate.mjs (ADVISORY)
audit-runner.md → implementation-gate slug
pnpm create:pi → creates new PI file
PI-003 → PI item covering this validator
```

*Source: OPUS-2 Turn 62 + PI-003 | S037-D*
