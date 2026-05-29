---
id: csps.communication.communication-spine-readme
name: communication-spine-README
description: >
  Index for the CSPS communication-spine/ — the core home for communication-as-first-class-governance.
  Houses the Communication Schema (situations × handling + AI→Human 6-tier hierarchy).
  Inherits from communication-protocol-shared.md. Wired to ai-behavior-spine (D1-D13).
type: governance
diataxis_type: reference
protection_level: protected
status: draft
core_spine: AI
schema_anchor: communication
version: "1.0"
session: S070
owner: group:finky
lifecycle: production
lifecycle_state: active
---

# CSPS Communication Spine

> Communication is the platform's most crucial core element. It is the layer where
> intent becomes outcome — or becomes drift. The primary communicator is an AI whose
> training defaults (D1-D13) distort communication. This spine ensures every CSPS
> communication situation has an explicit handling spec, explicit audience awareness,
> and explicit default-suppression wiring.
>
> — Governor S069, PLAN-S069-COMMS-AND-JOURNEY.md

---

## What Lives Here

| File | Purpose | Status |
|---|---|---|
| [communication-schema.yaml](./communication-schema.yaml) | **The schema** — 8 situations × handling specs + 6-tier audience hierarchy + 9 B_* cross-refs | draft |
| [JOURNEY-DOCTRINE.md](../JOURNEY-DOCTRINE.md) | Journey Doctrine (M4, system-wide) — §1-§9 + 4 comms demos | draft (S070) |

---

## How This Relates to Other Communication Infrastructure

| File | Relationship |
|---|---|
| [communication-protocol-shared.md](../../../../tools/council/communication-protocol-shared.md) | **RULE 0-15** — the canonical rules. This schema EXTENDS and ORGANIZES them; does not duplicate. |
| [ai-behavior-spine/](../ai-behavior-spine/) | **D1-D13 defaults** — each situation/tier in this schema declares which defaults to counter. M2 will wire these explicitly. |
| [behavioral-contracts/](../behavioral-contracts/) | **9 B_* comms contracts** — scattered. This schema is the organizing hub: see `b_star_contracts_consolidated` in communication-schema.yaml. |
| [/platform/communication](../../../../apps/) | **Dashboard** (M3 — TODO) — full editor for this schema: edit definitions, reorder, manage hierarchy, upload/download, see live state. |

---

## Build Milestones (PLAN-S069 §BUILD SEQUENCE)

| Milestone | Goal | Status |
|---|---|---|
| **M1** | Core home + `communication-schema.yaml` (8 situations + 6-tier hierarchy) + 9 B_* consolidation + coverage validator (advisory) | ✅ DONE S070 |
| **M2** | AI-behavior wiring — each situation/tier → ai-behavior-spine D-defaults + activation language | TODO |
| **M3** | `/platform/communication` dashboard (full editor: definitions/order/hierarchies/upload/download/see-built/templates) | TODO |
| **M4** | Journey Doctrine engraved (`pillar-0-governance/JOURNEY-DOCTRINE.md`) + dev-journey Vercel section (editable) | ✅ DONE S070 |

---

## Why "Communication as Core"

From PLAN-S069:
> Word choice, intent, and nuance determine whether pipelines deliver intent or drift.
> The AI is the communicator. Its training defaults:
> - D2 = authority-pleasing (distorts tone toward the powerful)
> - D3 = surface-completeness (over-explains to lower tiers, leaks internals to externals)
> - D6 = verbal-cleverness (obscures meaning)
> - D7 = action-bias (assumes audience wants options, not the task done)
> - D10 = cooperative-disagreement-aversion (suppresses push-back in council)
> - D11 = debugging-wrong-layer (validator output without enough context)
>
> Every situation/tier in this schema declares which defaults it must suppress.
> This is the CSPS-unique 7th layer beyond standard message contracts.

---

## Key Design Decision: Consolidation Model

The 9 B_* comms contracts are **not moved**. They stay in `behavioral-contracts/`.
This schema is the **organizing hub**: go to `communication-schema.yaml`
`b_star_contracts_consolidated` section to find which contracts govern which situation.

**Why not move them:** behavioral-contracts/ is auto-generated from behavioral-contracts.md.
Moving would break the generator. Instead, the schema cross-references them bi-directionally
(M2 will add the reverse reference from the ai-behavior-spine entries).

---

*Built S070 · Authored OPUS-13 (design) + Sonnet S070 (implementation)*
