---
id: P-ARCH-TRUNK-BRANCH-PATTERN
name: Trunk-Branch Pattern for Multi-Persona Content
description: "Formal pattern for multi-persona content: sealed Governor-owned trunk (shared constitution) + persona-scoped editable branches. First instance: journey admin. Candidate P-ARCH principle pending ratification."
version: "0.1"
status: draft
maturity: seed
core_spine: ARCH
owner: group:finky
lifecycle: experimental
lifecycle_state: active
diataxis_type: reference
session: S084
author: Opus-21 (seed) + Sonnet S084 (authoring)
ratified_by: PENDING — Governor ratification required
candidate_p_arch_number: TBD (assign on ratification)
first_instance: journey-admin (csps-playground)
related_parks: ["PARK-S084-011"]
---

# P-ARCH: Trunk-Branch Pattern for Multi-Persona Content

> STATUS: SEED — authored for Governor ratification. Not yet a sealed principle.
> First instance observed: the Journey Admin dashboard (S084 B.3).

---

## Core Insight

CSPS content that must be (a) universally shared AND (b) persona-specific simultaneously follows
a recurring shape: a **Trunk** of sealed constitutive principles, with persona-scoped **Branches**
that extend and specialize.

This is not a new invention — it is the pattern already present in:
- **Journey specs**: Trunk (T1-T5 principles + I1-I4 invariants) → Developer Branch + User Branch
- **Communication schema**: 6-tier audience hierarchy with shared core semantics
- **EED pipeline**: consolidate-to-essence (trunk) → branch-specific extraction (branches)

The pattern deserves a formal name so it can be referenced, enforced, and consistently applied.

---

## Pattern Definition

```
TRUNK
  ├── Sealed constitutive elements (read-only — Governor-owned)
  ├── Inherited by ALL branches automatically
  ├── Governance state: SEALED (equivalent)
  └── Examples: journey T1-T5, comm-schema core semantics, EED consolidation output

BRANCH (one per persona class)
  ├── Inherits all trunk elements implicitly
  ├── Adds persona-specific stages / content / rules
  ├── Editable by persona-class actors (governed by tier model)
  ├── Governance states: draft → in_review → ratified → sealed
  └── Examples: developer-journey, user-journey, comm developer-persona, EED actor-specific
```

---

## Governing Intent

The Trunk-Branch pattern exists because:
1. **Shared principles must be non-negotiable** — you cannot build a platform where each persona's journey contradicts the core.
2. **Persona-specific content must be flexible** — what a Governor needs to know to build CSPS is radically different from what an end-user needs to onboard.
3. **Separation prevents drift** — without a trunk, each branch drifts independently until they contradict each other.

---

## Design Rules (candidates — ratification required)

**R1 — Trunk is Governor-owned, Branch is role-owned**
Only the Governor can modify trunk content. Branch owners are determined by the tier model (PARK-S084-011).

**R2 — Trunk is SEALED by default**
Trunk content cannot be modified via UI. Re-opening requires the boundary-crossing protocol (P-META-037 equivalent).

**R3 — Branch inherits trunk implicitly**
Branches do not list trunk elements — they inherit them. Listing trunk items in a branch = duplication = violation.

**R4 — Branch persona maps to the audience tier model**
Each branch corresponds to exactly one tier in the 5-actor-class model (PARK-S084-011). No branch without a named audience.

**R5 — Ratification gradient applies per branch**
Each branch transitions independently: `draft → in_review → ratified → sealed`. The trunk's ratification state does not block branch ratification.

---

## Permission Overlay (seed — detail in PARK-S084-011)

| Actor class | Trunk access | Branch access |
|---|---|---|
| Core admin / Governor | Read + Write (via boundary-crossing) | Read + Write + Ratify + Seal |
| Core developer | Read only | Read + Write (own branch) |
| Scoped external developer | Read only | Read only (assigned branch scope) |
| Platform-builder developer | Read only | Read + Write (their product branches) |
| End-user | Read only (summary) | None (consumer only) |

---

## First Instance: Journey Admin

| Trunk element | Branch element |
|---|---|
| T1-T5 Journey Principles | Developer Journey (7 stages) |
| I1-I4 Journey Invariants | User Journey (5 stages) |
| Sealed — UI read-only | Editable — drag/reorder/ratify |

The journey admin dashboard at `/platform/journey-admin` is the canonical first implementation.
All future Trunk-Branch surfaces should follow its UX precedent (trunk collapsed by default,
branches as tabs, ratify button per branch, stage status as interactive dropdown).

---

## Related Patterns

- **Communication Core** (COMM-CORE): 6-tier audience hierarchy uses trunk-branch implicitly
- **EED Pipeline**: consolidate-to-essence = trunk building; actor-specific extraction = branch building
- **Permission Tiers** (PARK-S084-011): the 5-actor-class model governs who edits which layer
- **Boundary-Crossing Protocol**: the gate for modifying sealed trunk content

---

## Ratification Gate

Before this becomes a sealed P-ARCH principle:
1. Governor reviews and approves the 5 design rules
2. A candidate P-ARCH number is assigned
3. The tier model (PARK-S084-011) is formally designed (the permission overlay above is a seed)
4. At least 2 instances are built (currently: 1 — journeys)

*S084 seed · Governor ratification pending*
