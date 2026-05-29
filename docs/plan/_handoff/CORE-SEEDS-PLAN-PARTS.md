---
id: csps.handoff.CORE-SEEDS-PLAN-PARTS
name: CORE-SEEDS-PLAN-PARTS
description: >
  Permanent, inheritable core seeds for every plan part (PARTS 2-8 of MASTER-RE-GATE-PLAN-S068
  + the S069 Communication Schema + Journey Doctrine). Each is a MINI-NODE: an architectural
  anchor + its alignments (what it inherits from / connects to) + status. Authored by OPUS-13
  so any fresh tab inherits aligned intent for each part — building to intent, not to defaults.
  This is the single canonical core-seed index; handoffs reference it (do not re-copy).
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: planned
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: handoff_files
version: "1.0"
session: S069
owner: group:finky
authored_by: OPUS-13
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic, core-maximal]
ns_path: "this → GVRN spine → North Star (build-to-intent via inherited seeds)"
context_question: "Before building any plan part: have I read its core seed here — its anchor + alignments — so I build to intent, not to my defaults?"
context_quote: "Nothing stands alone; every part inherits its DNA + alignment from a declared seed. — CSPS"
inherits_from: "MASTER-RE-GATE-PLAN-S068 + PLAN-S069-COMMS-AND-JOURNEY + INHERITANCE-MODEL + communication-protocol-shared.md"
links:
  - { rel: master-plan, href: MASTER-RE-GATE-PLAN-S068.md }
  - { rel: s069-plan, href: PLAN-S069-COMMS-AND-JOURNEY.md }
  - { rel: opus-directives, href: ../../../tools/council/opus-turn.md }
---

# CORE SEEDS — Plan Parts (mini-nodes)

> Each node: **ANCHOR** (the architectural intent) · **ALIGNS** (inherits-from / connects-to) · **STATUS**. Permanent + inherited at every tab boundary. Reference this; do not re-copy.

## NODE — PART 2 · Threshold
**ANCHOR:** the classification brain — every input's `{spine, pipeline, place, criticality}` decided here. WIRE the existing `routeInput` into `user-prompt-submit` (the 4/532 fix) BEFORE features. Opus-designs-first + 6-persona review incl. **ux** (mis-routing is felt as broken UX).
**ALIGNS:** extend M-42 router (don't rebuild) · CIP `PROPOSED-CHANGE` route sits ON TOP of the wired threshold · no-fit routing = ONE flow (GHG + place-not-found + vault).
**STATUS:** design complete (S068) · **GATED** — awaiting Governor ratification + Opus 6-persona post.

## NODE — PART 3 · Product Schema
**ANCHOR:** 3-layer profile→product; every entity carries `tenant_id` + RLS (mandatory).
**ALIGNS:** foundation slices (User/Tenant/AuditEvent) · Core-Maximal (apps bundle core, build nothing net-new) · audience-hierarchy end-user tier (product comms).
**STATUS:** not started.

## NODE — PART 4 · Governance Constitution
**ANCHOR:** the 10 doctrines unified as one constitution.
**ALIGNS:** Core-Spine precedence GVRN>VALD>ARCH>AI>OPER (P-ARCH-028) · the B_* contracts · P-META/ARCH/OP principles.
**STATUS:** not started.

## NODE — PART 5 · Question Placement
**ANCHOR:** questions are first-class governance artifacts (CAQ) — define where each type lives + when it fires.
**ALIGNS:** RULE 15 CAQ · threshold (questions route) · contextual-locality (question at point of use).
**STATUS:** not started.

## NODE — PART 6 · Page-Type Templates
**ANCHOR:** 10 archetypes (incl. DashboardTemplate) — reusable page contracts.
**ALIGNS:** UX 7-rules · the comms dashboard · Journey Doctrine (a page IS a journey step).
**STATUS:** not started.

## NODE — PART 7 · Frictionless Onboarding
**ANCHOR:** the first journey a participant takes; built on PART 2+3+6.
**ALIGNS:** Journey Doctrine (optimal order · early-win · progressive disclosure) · audience-hierarchy (onboard per tier).
**STATUS:** not started (needs 2+3+6).

## NODE — PART 8 · Developer's Journey
**ANCHOR:** re-walk the 9 INFRA-FLOW steps with the full S069 stack (B_HUMBLE · B_META_QUESTION · D1-D13 · OPIA · NodeFile · Journey Doctrine · activation language) → app-creation-ready. The culmination.
**ALIGNS:** needs PART 2+3+7 · every step embeds the Journey Doctrine · Governor must SEE it to ratify.
**STATUS:** not started (needs 2+3+7).

## NODE — Communication Schema (S069)
**ANCHOR:** communication as first-class core — situations × handling + AI→Human 6-tier audience hierarchy (Governor / core-dev / external-dev / account-owner-admin / team-leader / end-user). Wired to ai-behavior-spine (the AI is the communicator; its defaults distort comms).
**ALIGNS:** extend communication-protocol-shared.md · consolidate the 9 B_* comms contracts under it · threshold classifies audience · the editable /platform/communication dashboard.
**STATUS:** ratified → BUILD NOW (S070 priority X), milestone-run.

## NODE — Journey Doctrine (S069)
**ANCHOR:** what makes a journey good — optimal order, readiness, progressive disclosure, peak-end, the avoid-list. System-wide (onboarding · handoff · session · app-build), not dev-journey-only.
**ALIGNS:** PART 7+8 · comms-schema (a journey IS communication) · CIP (no local-optimization that harms the whole).
**STATUS:** ratified → BUILD (S070 priority Y), then render editable on the dev-journey Vercel page.

## NODE — CIP (Change-Impact Pipeline, S069)
**ANCHOR:** no change lands without STAGE → RIPPLE-QC (multi-direction, never self-test) → NET-IMPACT (net-positive only) → THRESHOLD → TERMINAL. Prevents local-fix-harms-global.
**ALIGNS:** sits ON TOP of the wired threshold (PART 2) · extends prevention-class register + vault + unified-plan.
**STATUS:** ratified → **DEFERRED behind PART 2** (it routes through the threshold; build only after PART 2 wires it). NOT in the S070 active queue.
