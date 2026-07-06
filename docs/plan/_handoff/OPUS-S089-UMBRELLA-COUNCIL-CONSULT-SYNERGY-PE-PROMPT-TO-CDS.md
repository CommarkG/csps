---
id: csps.handoff.opus-s089-umbrella-council-consult-synergy-pe-prompt-to-cds
name: OPUS-S089-UMBRELLA-COUNCIL-CONSULT-SYNERGY-PE-PROMPT-TO-CDS
description: >
  CSPS -> CDS expert comment + prompt: a single UMBRELLA feature that unifies internal councils,
  cross-platform consulting, synergy analysis, and artifact sharing under ONE Priority Engine. Grounded
  in existing CSPS council + PE + synergy + sharing assets; folds in the generalizable architecture from
  a peer platform's consulting work (peer-specific products stripped). For CDS to question + refine into
  a detailed draft plan the Governor brings back for review.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: explanation
lifecycle: production
lifecycle_state: active
status: active
ns_quality: Synergetic
precedent_checked: true
session: S089
links:
  - { rel: council-types, href: ../../../tools/council/council-architecture.md }
  - { rel: council-registry, href: ../pillar-0-governance/council-registry.md }
  - { rel: pe-schema, href: ../../../tools/templates/priority-engine.schema.yaml }
  - { rel: sharing-ledger, href: ./CSP-CSPS-SHARING-LEDGER.md }
  - { rel: cse-direction, href: ../../../tools/data/park-register.yaml }
---

# CSPS → CDS — Expert Comment: ONE Umbrella (Councils · Consulting · Synergy · Sharing) under ONE Priority Engine

**To:** CDS (Core Driven Solutions) design team.
**From:** Opus-25, CSPS Director.
**Purpose:** a comprehensive expert comment for you to **question and refine into a detailed draft plan**.
Nothing here is final — it is the richest starting frame I can give you. Ask back freely; sharpen it.
**Note:** peer-platform-specific product names, session numbers, and internal identifiers have been
deliberately removed — this is the generalizable architecture only.

---

## 1. THE CORE INSIGHT — four features are one primitive

Internal **council review**, cross-platform **consulting**, **synergy** analysis, and artifact **sharing**
look like four systems. They are one primitive wearing four hats: a **governed engagement** —

> a SUBJECT is examined / enhanced / exchanged, by PARTICIPANTS at a TRUST TIER, through a defined
> PROTOCOL, prioritized by VALUE, and RATIFIED before it takes effect.

Build four separate systems and you get four prioritizers, four permission models, four dashboards, four
drift surfaces. **Build one umbrella and you get a single ranked queue, one trust model, one glossary,
one improvement loop — and ONE Priority Engine that always answers "what is the single most valuable
engagement to run next?" whether that is a council, a consult, a synergy, or a share.**

The Priority Engine is what makes it an umbrella rather than a bundle: everything competes for attention
in one ranked queue.

---

## 2. WHAT ALREADY EXISTS (grounding — this is not vapor)

CSPS already runs most of the parts in isolation; the umbrella is a **composition**, not a new build:

- **Council TYPES** — three modes: *Mini* (quick, 2-3 reviewers), *Core* (full roster + a mandatory
  senior architect seal before ratification), *External* (a coordinator shuttles to outside AI systems).
- **Council ROSTER + ORCHESTRATOR** — ~17 expert "members" (each a domain lens: security, architecture,
  reliability, over-engineering/balance, developer-experience, etc.), dispatched by a lightweight
  keyword orchestrator on every input. **Each member already carries a PE band.**
- **A Priority Engine** — a ratified schema + formula (urgency × impact / effort) that ranks work.
- **Synergy** — a "how does this ratified element enhance every other part of the platform?" analyzer
  that outputs a cross-synergy enhancement plan for a critical-reviewer pass.
- **Sharing** — a cross-platform ledger tracking inbound/outbound exchanges with absorption decisions.
- **Consulting** — a live pattern already in use: one platform's director produces an expert review of
  another's architecture, holes-first, and the other refines. (This very document is an instance.)
- **An improvement loop** — a know-how extractor that feeds each engagement's outcome back to refine
  the members/protocols. Self-improving after every session.

**The gap is not the parts. It is that they do not share a registry, a trust model, or a prioritizer.**

---

## 3. THE UMBRELLA — proposed shape

**One ENGAGEMENT registry.** Every council/consult/synergy/share is one record:
`{ id, type: review|consult|synergize|share, subject, participants[], trust_tier, protocol/template,
lifecycle_state, pe_score, ratification_state, outcome }`.

**One PRIORITY ENGINE (the spine).** The existing PE, extended to score *every* engagement type on the
same axis (value × urgency / effort), producing a single cross-type ranked queue. Council members' PE
bands become inputs, not a separate system. Result: no four prioritizers — one.

**One TRUST-TIER model.** Three tiers govern who may read/write/approve an engagement:
- **Admin** — internal, full trust, full read/write/approve.
- **Trusted** — partner platforms, scoped read/write, approve-with-cosign.
- **External** — untrusted; output treated as a CLAIM to be independently reproduced, never truth,
  until aligned (a customs-border/immune-system check on any foreign capability).
(This generalizes the council's Mini/Core/External modes AND a cross-platform 3-tier consulting model
into ONE tier ladder.)

**One TRANSLATION layer.** A shared glossary that maps each platform's native vocabulary to a common
canon, so cross-platform engagements don't silently drift on terminology. Every foreign term is
translated to the canon before it acts. (Applies equally to onboarding an external AI reviewer or a
partner platform's artifact.)

**One CAPABILITY registry (add / delete / prioritize).** The set of "capabilities" each participant
offers — reviewer lenses, consult categories, synergy types, shareable artifacts — is itself a managed
registry: capabilities can be added, retired (with a deprecation record), and prioritized. An approval
workflow (owner + a designated coordinator) moves a capability DRAFT → APPROVED → ACTIVE.

**One IMPROVEMENT loop.** Every engagement outcome feeds back to refine participants, protocols, and PE
weights — the system is more accurate each cycle.

**One HUB + adjustable DASHBOARD.** A single surface to see all engagements (ranked by the one PE),
their trust tier, lifecycle, and the shared glossary — and to *tune* the PE weights, the trust-tier
boundaries, and the capability set without touching code.

**A designated iteration COORDINATOR (rotating or appointed).** For multi-platform cycles, one party
holds the central hub (the cycle log, glossary, consensus record, escalations, mutual-learnings) so
cross-platform iteration has a single conductor. The role is a *position*, not a fixed platform.

---

## 4. WHY ONE PE ENGINE IS THE KEYSTONE

Without a single PE, "which council?", "which consult?", "which synergy?", "which share?" are answered by
four disconnected heuristics, and the platform cannot say what its single next-best move is. With one PE:
- Every engagement — internal or cross-platform — competes in one queue on one value axis.
- Capacity is allocated to the highest-value engagement regardless of its type.
- The trust tier feeds the PE (external/unverified engagements carry a verification cost that lowers
  their effective score until reproduced) — so trust and priority are one calculation, not two.
- The improvement loop tunes ONE set of PE weights, so learning compounds in one place.

---

## 5. OPEN QUESTIONS FOR CDS (please question + refine these into the plan)

1. **PE formula for cross-type ranking.** Is a single `value × urgency / effort` enough to fairly rank a
   security council against a cross-platform share? What normalization makes types comparable? Should
   trust-tier be a multiplier on effort, on value, or a separate term?
2. **Trust-tier boundaries.** Where exactly is the Trusted/External line for a partner platform — per
   engagement, per capability, or per platform? What is the minimal "aligned" bar before an External
   participant's output can be trusted without full reproduction?
3. **Translation layer ownership.** Who owns the shared glossary, and how is a term-conflict resolved
   when two platforms use the same word differently? Is the coordinator the tiebreaker, or a consensus?
4. **Capability lifecycle.** What is the exact DRAFT→APPROVED→ACTIVE workflow, and who are the required
   approvers for a capability that will act cross-platform?
5. **Coordinator selection.** Rotating vs appointed — what triggers a handover, and what does the hub
   contain at minimum (cycle log, glossary, consensus, escalations, mutual-learnings)?
6. **Engagement lifecycle states.** Confirm the state machine (proposed → prioritized → convened →
   ratified → applied → learned) and which transitions require a human vs are mechanical.
7. **Dashboard adjustability.** Which knobs are safe to expose to an admin (PE weights, tier lines,
   capability toggles) vs governance-locked (who can approve a cross-platform action)?
8. **Scope tiering.** Trivial engagements should not need the full protocol — where is the line between a
   swift engagement and one that needs full ratification?

---

## 6. HOW TO USE THIS

Take this frame, ask me (via the Governor) anything that is underspecified, and **refine it into a
detailed draft plan** — engagement schema, the one PE scoring model, the trust-tier matrix, the
translation-layer design, the capability workflow, the hub/dashboard, and a phased build order. The
Governor will bring your draft back here for CSPS review, and we iterate. Nothing builds on either side
until the plan is ratified.

---

## DECISION LEDGER
- CHOSEN: one umbrella (engagement registry + ONE PE + trust tiers + translation + capability registry +
  improvement loop + hub) unifying councils/consulting/synergy/sharing; composed from existing CSPS
  assets; generalizable peer architecture folded in with peer-specifics stripped.
- REJECTED: four separate systems (four prioritizers/permission-models/dashboards/drift-surfaces; the
  platform can't name its single next-best move).
- REJECTED: keep peer-platform product names / session numbers in the CDS-facing content (Governor
  directive: strip peer-specifics; give CDS the generalizable architecture only).
