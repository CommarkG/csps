---
id: csps.governance.user-journey-spec
name: USER-JOURNEY-SPEC
description: >
  USER-journey branch spec — how an end-user moves through a CSPS-built product.
  Inherits the journey trunk (5 principles + 4 invariants). Adds 5-stage option space
  with end-user-tier language (zero jargon) and audience-appropriate governance.
  STATUS DRAFT — Governor ratification required before any implementation changes.
  Part of EED Phase 1a (PROTO-S084-EED first application).
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: swift-implemented
ratified_by: "PENDING — Governor ratification required (10-turn deadline: PARK-S084-007)"
core_spine: GVRN
core_spines: [GVRN, OPER, AI]
schema_anchor: pillar_0_governance_leaves
version: "0.1-draft"
session: S084
authored_by: "Sonnet S084 (draft from fragments 1+6)"
owner: group:finky
lifecycle: production
lifecycle_state: active
links:
  - rel: trunk
    href: ./ESSENCE-EXTRACTION-DEFAULT.md
  - rel: doctrine
    href: ./JOURNEY-DOCTRINE.md
  - rel: fragment-user-page
    href: "../../../apps/csps-playground/src/app/platform/user-journey/page.tsx"
  - rel: communication-schema-audience
    href: "./communication-spine/communication-schema.yaml"
context_question: >
  Which stage is this user in? Does the proposed interaction respect their starting readiness
  (zero jargon, zero platform context)? Is this design-mode or live-mode?
---

# USER-JOURNEY-SPEC
## STATUS: DRAFT — Awaiting Governor Ratification

> **Inherits:** Journey trunk (5 principles + 4 invariants from ESSENCE-EXTRACTION-DEFAULT.md §JOURNEY TRUNK)
>
> **This branch is for:** End-users moving through a CSPS-built product.
> Not for developers building on CSPS (see DEVELOPER-JOURNEY-SPEC.md).

---

## WHO THIS JOURNEY SERVES

| Participant | End-user of any CSPS-built product |
|---|---|
| Starting state | Lands on app. No CSPS context. No platform vocabulary. ZCA at maximum. |
| Ending state | Completes a meaningful task; returns; recommends. |
| Audience tier | `end-user` (ZERO jargon; in-context help only; plain language throughout) |
| Cognitive load | Must be MINIMIZED — this user did not sign up to learn a platform |

---

## THE 5-STAGE OPTION SPACE

*Extracted from [/platform/user-journey](../../../apps/csps-playground/src/app/platform/user-journey/page.tsx). Cross-ref only — page is canonical option source.*

### Stage 1 — DISCOVERY
**The participant finds the product.**

| Trunk principle | T1 Optimal Order: discovery options must not create false expectations |
|---|---|
| Exit criteria | User lands on app homepage. Bounce rate < 80%. |
| Default option | Direct URL (returning or invited — highest trust, lowest friction) |
| Avoid | Overloaded landing pages; jargon in first sentence; no clear next action |

Key options (per /platform/user-journey page): organic search · referral · direct URL · API integration

---

### Stage 2 — ONBOARDING
**The participant gains enough context to start.**

| Trunk principle | T2 Progressive Disclosure (only what's needed to start — nothing more) + T3 Early Win |
|---|---|
| Exit criteria | BehaviorProfile has ≥1 signal. AI has context to begin. |
| Default option | Context-capture (3 questions — personalization-heavy) |
| Avoid | Lengthy setup wizards before first value; asking for info the product doesn't use |

Key options: context-capture (3Q) · role-calibration · problem-statement · preference-setup · skip

**IMPORTANT CLASSIFICATION:** The planning wizard at `/platform/wizard` is NOT a user-journey
instance. It belongs to the **DEVELOPER journey** (INFRA-FLOW Step 3 per WizardClient.tsx:2).
Developer planning tools are developer-journey artifacts, not end-user onboarding.

**Canonical user-journey Stage 2 instance:** The task-mgmt trial app (`apps/_trials-vaulted/task-mgmt`)
onboarding flow — user authenticates via Clerk, lands on tasks dashboard, zero-jargon UI, no
platform terminology visible. Stage 2 exit: user has seen their task list (BehaviorProfile context:
empty state or pre-seeded tasks). This is the first real end-user onboarding instance in CSPS.

---

### Stage 3 — FIRST VALUE MOMENT
**The participant gets the result that makes them think "this is for me."**

| Trunk principle | T3 Early Win — THE most critical moment in the entire journey |
|---|---|
| Exit criteria | User completes first core task. Clear sense of product value established. |
| Default option | Single direct action with instant visible result |
| Avoid | Walls of features before first outcome; requiring setup before first value |

The first value moment must be reachable in <3 actions from Stage 2 completion (I1 Single Next Action applied ×3).

**Canonical Stage 3 instance:** task-mgmt trial — user creates first task or marks one complete.
The visible result (task appears in list, green checkmark fires) IS the first value moment.
AuditEvent fires in Supabase (system-layer confirmation), invisible to user (correct).

---

### Stage 4 — CORE LOOP ENGAGEMENT
**The participant finds reason to return.**

| Trunk principle | T1 Optimal Order (core loop accessible only after Stage 3) + I2 Audience-Tier Awareness |
|---|---|
| Exit criteria | User returns ≥1 time without prompt. Core loop is self-sustaining. |
| Avoid | Core loop requires platform vocabulary to navigate; features introduced before user needs them |

---

### Stage 5 — GROWTH + EXPANSION
**The participant expands scope or invites others.**

| Trunk principle | T4 Peak-End Design (growth = the designed peak; expansion = the designed end that opens a new journey) |
|---|---|
| Exit criteria | User invites a team member OR unlocks a higher-tier feature OR completes a second core task category |
| Avoid | Abrupt growth prompts (upsell before value established); invitations before user trusts the product |

---

## BRANCH-SPECIFIC INVARIANTS (adds to trunk I1-I4)

| # | Invariant | User-journey expression |
|---|---|---|
| UI1 | **Zero-Jargon Floor** | No CSPS-internal term appears in any user-facing string. Enforced by audience-tier check. |
| UI2 | **3-Action Ceiling** | First value moment reachable in ≤3 actions from onboarding completion |
| UI3 | **Recovery-Path Visible** | Every error state shows exactly what to do next. Never a dead end. |
| UI4 | **BehaviorProfile-Seeded** | Onboarding stage seeds at least 1 BehaviorProfile signal before Stage 3 begins |

---

## VARIANTS (from /platform/journey page VARIETY section)

| Variant | Audience | What changes from default 5-stage |
|---|---|---|
| Admin Config-Heavy | account-owner-admin | Inserts tenant config / billing / user-roles between Stages 2 and 3 |
| Team Invite | team-leader | Entry: invite flow → team setup → first delegation (Stage 2 = team-first) |
| End-User Minimal | end-user (power) | Strip all config — straight to Stage 3, lowest friction |

---

## RATIFICATION CHECKLIST (Governor)

Before ratifying this spec, confirm:
- [ ] The 5 stages match the current user-journey page option space (live source)
- [ ] Branch invariants UI1-UI4 don't conflict with existing UX contracts (B_CONTEXTUAL_LOCALITY, B_ZCA)
- [ ] The planning wizard (/platform/wizard) is correctly labeled DEVELOPER journey (INFRA-FLOW Step 3), NOT a user-journey instance
- [ ] Variants (admin-config-heavy / team-invite / end-user-minimal) align with communication-schema.yaml audience tiers
- [ ] UI2 (3-action ceiling) is a design constraint, not a validator (no new cycle added)

*Status will move from `draft` to `ratified` only after Governor confirmation.*

---

*Draft S084 · Extracted from fragment 6 via EED Phase 1a*
*Trunk source: ESSENCE-EXTRACTION-DEFAULT.md §JOURNEY TRUNK*
