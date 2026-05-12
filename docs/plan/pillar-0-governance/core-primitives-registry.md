---
id: csps.pillar-0-governance.core-primitives-registry
name: core-primitives-registry
description: Registry of CSPS Core Primitives — functional capabilities sealed at L1 that all apps inherit. Populated via CCG (Core Classification Gate). Status progression: PROPOSED → RATIFIED → IMPLEMENTED → SEALED.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
core_spines: [ARCH, GVRN]
schema_anchor: pillar_0_governance_leaves
domain_path: platform
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
session: S022
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: architecture-plan, href: ../../plan/_handoff/VAULT/topic-plans/csps-core-primitives-architecture.md }
  - { rel: platform-dna, href: ./csps-platform-dna.md }
diataxis_type: reference
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
---

# CSPS Core Primitives Registry

> Each primitive in this registry is a functional capability sealed at L1.
> Apps inherit these automatically via `libs/core/` — no re-implementation needed.
> Use CCG (Core Classification Gate) to score and add new primitives.

---

## Status Key

| Status | Meaning |
|---|---|
| `PROPOSED` | CCG scored, waiting for Governor + Opus ratification |
| `RATIFIED` | Governor approved, ADR written, ready to implement |
| `IMPLEMENTED` | L1 interface built and tested |
| `SEALED` | Used by 2+ apps, interface frozen (requires ADR to change) |

---

## Registry

| ID | Primitive | L1 Location | CCG Score | Status | Phase |
|----|-----------|-------------|-----------|--------|-------|
| CP-001 | Calendar & Time | `libs/core/calendar/` | 9.08 (revised) | PROPOSED | Phase 1 (Opus: Gregorian-only first) |
| CP-002 | Notifications | `libs/core/notifications/` | 8.6 (revised) | PROPOSED | Phase 1 (Opus: thin wrapper, idempotencyKey, GDPR hook) |

---

## CCG Formula (Opus-revised S022)

```
CCG_SCORE = (PREVALENCE × 0.35) + (COST_OF_NOT_SHARING × 0.35) + (INTERFACE_STABILITY × 0.30)
```

Revised per Opus Turn feedback: Stability increased from 0.25 → 0.30 (premature sealing risk).

**Thresholds:**
- ≥ 7.0 → CORE (sealed L1 implementation)
- 4.0–6.9 → DEVELOPER LAYER (`libs/integrations/`)
- < 4.0 → APP LAYER (build in that app)

---

## Demoted Primitives (not Core after Opus review)

| Primitive | Original Score | Revised Score | Decision |
|---|---|---|---|
| File Storage | 7.5 (CORE) | 5.75 (DEVELOPER) | Use Supabase Storage in `libs/integrations/`. Not worth abstracting commodity API. |

---

## Phase 1 Conditions (from Opus Core Council)

Before CP-001 or CP-002 can move from PROPOSED → RATIFIED:

```
CONDITION 1: CCG formula updated in core-primitives-architecture.md ✅ (done S022)
CONDITION 2: Calendar Phase 1 = Gregorian-only + extensibility design
CONDITION 3: NotificationService L1 must include idempotencyKey + GDPR hook
CONDITION 4: CalendarEngine interface must specify caching strategy + DST handling
CONDITION 5: ADR template must exist at tools/templates/adr.template.md ✅ (done Session 0)
```

---

*Core Primitives Registry v1.0 | S022 | 2026-05-11*
