---
id: csps.governance.escalation-ladder
name: escalation-ladder
description: "Escalation ladder for unresolved obligations — T7 of the accountability spine. Maps escalation_state{tracked|overdue|escalated|terminal} to authority levels L1-L4."
type: governance
protection_level: protected
status: ratified
diataxis_type: reference
impl_status: swift-implemented
core_spine: GVRN
schema_anchor: vault_files
version: "1.0"
session: S073
owner: group:finky
authored_by: Sonnet S073
lifecycle: production
lifecycle_state: active
closure_owner: group:finky
closure_decision: "Living document — ratified with T4 (escalation) and T7 of the accountability spine"
closure_by: "ongoing — extend ladder when new authority levels are added"
links:
  - { rel: accountability-spine, href: ../../../tools/config/core-spine-registry.yaml }
  - { rel: floating-artifacts-register, href: ../../../tools/data/floating-artifacts-register.yaml }
  - { rel: anti-float-validator, href: ../../../tools/validators/validate-no-floating-artifacts.mjs }
---

# Escalation Ladder — T7 Accountability Spine

> **Principle (T7):** Unresolved obligations escalate to a higher authority until terminal. No obligation can stay open forever — it either resolves or escalates to a forced decision.

---

## The Ladder

| Level | Authority | Trigger | Action |
|-------|-----------|---------|--------|
| **L1** | Sonnet (builder) | Obligation created / milestone boundary | Reports in milestone report (ZF evidence). Flags in sonnet-turn.md. |
| **L2** | Opus (architectural director) | OPIA boundary | Reviews in OPIA checklist. BLOCKING if acceptance not given. |
| **L3** | Governor (Yariv) | Session close | Ratifies at handoff-attestation. §17 attestation required. |
| **L4** | Session-open block | Past `closure_by` deadline | Obligation injected into session-open context. Blocks new work until decision made. |

## Escalation States

| State | Meaning | Trigger |
|-------|---------|---------|
| `tracked` | In register, deadline in future | Created with closure obligation |
| `overdue` | Past `closure_by`, no terminal state | `closure_by` date passed without resolution |
| `escalated` | Surfaced to L2+ authority | Reached L2 (Opus) or L3 (Governor) review |
| `terminal` | Resolved | One of: RATIFIED+IMPLEMENTED \| REJECTED-with-reason \| VAULTED-with-trigger \| SUPERSEDED |

## Non-Terminal Statuses (trigger ladder activation)

```
draft · proposed · pending-review · awaiting-review · awaiting-ratification · awaiting-governor-ratification
```

## Terminal States (ladder resolves)

```
ratified · validated · sealed · active · superseded · rejected · vaulted · deprecated · done · closed
```

## Decision Queue Format

When an obligation reaches L4 (session-open block), it surfaces in this format:

```
⛔ OVERDUE OBLIGATION — decision required before proceeding:
  id: [af-xxx]
  artifact: [path]
  overdue since: [closure_by value]
  closure_owner: [who must decide]
  options: RATIFY | REJECT | VAULT-with-trigger | SUPERSEDE-with-pointer
```

---

*Escalation Ladder v1.0 | S073 | Accountability Spine T7 | PROTO-S073-B4*
