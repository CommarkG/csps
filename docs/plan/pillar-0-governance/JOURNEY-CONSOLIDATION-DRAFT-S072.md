---
id: csps.governance.journey-consolidation-draft-s072
name: JOURNEY-CONSOLIDATION-DRAFT-S072
description: >
  Draft consolidation of all CSPS journeys into a trunk-and-branches model.
  Trunk = universal elements every journey shares. Branches = developer's journey
  (8 INFRA-FLOW steps) and external-user journeys (per-tier). Produced S072
  per PROTO-S072-JOURNEY-CONSOLIDATION-DRAFT (OPUS-15 directive). Status: DRAFT
  for Governor ratification — no build, no new pages, no code.
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: audit-1-complete
core_spine: GVRN
core_spines: [GVRN, AI, OPER]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S072
owner: group:finky
authored_by: Sonnet S072
lifecycle: production
lifecycle_state: active
context_question: "Before designing any new journey element: does it belong in the TRUNK (universal) or a BRANCH (audience-specific)? Is it EXISTS, FRAGMENT, or GREENFIELD? What PART 3/6 dependency does it need?"
governing_principle: P-META-028
inherits_from: "JOURNEY-DOCTRINE.md (ratified S071) + communication-schema.yaml (RATIFIED+IMPLEMENTED) + vocabulary.md §Dev↔User Glossary + developer-journey/01..08 (8 INFRA-FLOW steps ratified)"
links:
  - { rel: journey-doctrine, href: ./JOURNEY-DOCTRINE.md }
  - { rel: communication-schema, href: ./communication-spine/communication-schema.yaml }
  - { rel: vocabulary, href: ./vocabulary.md }
  - { rel: developer-journey-readme, href: ../../../docs/plan/pillar-4-developer-experience/developer-journey/README.md }
  - { rel: platform-observation-doctrine, href: ./PLATFORM-OBSERVATION-DOCTRINE.md }
---

# Journey Consolidation Draft — S072

> **Status: DRAFT** for Governor ratification. No new pages built. No code. This draft exposes the current state, maps trunk vs. branches, and identifies greenfield gaps.

---

## §1 — Playground Journey Link Inventory

Every journey-relevant platform page, verified against source files.

| Route | Source File | What It Currently Shows | Status |
|---|---|---|---|
| `/platform/developer-journey` | `apps/csps-playground/src/app/platform/developer-journey/page.tsx` | 8 INFRA-FLOW steps with Journey Doctrine editable section; PE-scored; fully wired | ✅ LIVE |
| `/platform/user-journey` | `apps/csps-playground/src/app/platform/user-journey/page.tsx` | L2 User Journey option space — 5 stages, BehaviorHub wired (S058). `NOT BUILT` status per pageDNA | ⚠ STUB (live page, placeholder content) |
| `/platform/zero-friction` | `apps/csps-playground/src/app/platform/zero-friction/page.tsx` | Zero Friction intake — Level 0 only; Level 1-4 not built (Phase 1 scope) | ⚠ PARTIAL (Phase 1 only) |
| `/platform/wizard` | `apps/csps-playground/src/app/platform/wizard/page.tsx` + `WizardClient.tsx` | PI-001 onboarding wizard wiring — has client component | ⚠ FRAGMENT |
| `/platform/communication` | `apps/csps-playground/src/app/platform/communication/` | Communication schema dashboard — situations × 6-tier audience hierarchy — live | ✅ LIVE |
| `/platform/profiles` | `apps/csps-playground/src/app/platform/profiles/page.tsx` | Profiles overview | ✅ LIVE |
| `/platform/profiles/developers` | `apps/csps-playground/src/app/platform/profiles/developers/` | Developer profile | ✅ LIVE |
| `/platform/profiles/ai-systems` | `apps/csps-playground/src/app/platform/profiles/ai-systems/` | AI system profile | ✅ LIVE |
| `/platform/simulation` | `apps/csps-playground/src/app/platform/simulation/` | Exists in route list | ❓ CHECK STATUS |
| `/platform/consult` | `apps/csps-playground/src/app/platform/consult/` | Exists in route list | ❓ CHECK STATUS |

**Missing routes** (no page exists yet):
- `/platform/onboarding` — PART 7 (Frictionless Onboarding) NOT STARTED
- `/platform/canonical-register` — PART 10 / ONE-SOURCE-OF (Q1 HOLD-S072)
- `/platform/observation` — PLATFORM-OBSERVATION L3 (draft, pending ratification)

---

## §2 — TRUNK: Universal Elements Every Journey Shares

Consolidated from existing ratified artifacts. No new elements. Every item cites its source.

### T1 — Threshold / Intake Entry
**Source:** `tools/scripts/threshold-router.mjs` M6 (4/532 fix — SEALED cb925cd1) + `user-prompt-submit-intake.sh` hook
**What it does:** classifies every input into `{spine, pipeline, place, criticality, audience_tier}` before any journey step begins.
**Journey role:** The gate before all journeys. No journey can begin until the threshold knows WHO is entering and what they want.

### T2 — Audience-Aware Messaging (6-tier)
**Source:** `docs/plan/pillar-0-governance/communication-spine/communication-schema.yaml` (RATIFIED+IMPLEMENTED S071)
**Tiers:** Governor · core-developer · external-developer · account-owner-admin · team-leader · end-user
**Journey role:** Shapes HOW each step communicates — language, tone, technical depth — based on who is in the journey.

### T3 — JOURNEY-DOCTRINE 5 Universal Principles
**Source:** `docs/plan/pillar-0-governance/JOURNEY-DOCTRINE.md` (ratified S071, OPUS-13 authored)

| Principle | Source Section | What It Means for Every Journey |
|---|---|---|
| **Optimal Order** | §7 | Dependencies respected; front-load irreversible/foundational; defer reversible/cosmetic |
| **Progressive Disclosure** | §8 | Just-enough, just-in-time; ~7±2 cognitive load chunking; complexity revealed as readiness builds |
| **Early Win / Fast Time-to-Value** | §8 | Place the value/"aha" moment early enough to motivate completion; endowed progress |
| **Peak-End Rule** | §8 | Deliberately design the peak experience AND the ending; both are disproportionately remembered |
| **Avoid-List** | §9 | No dump-everything-at-once; no bare commands; no dead-end steps; no hidden dependencies; no irreversible actions without confirmation |

### T4 — Profiles / Personas
**Source:** `/platform/profiles` + `communication-schema.yaml audience_hierarchy` + `docs/plan/pillar-0-governance/vocabulary.md §Dev↔User Glossary`
**Journey role:** Each journey knows its participant. Profiles are the canonical description of the participant type, cross-referenced by the threshold's `audience_tier`.

### T5 — Zero-Context Assumption at Every Boundary (B_ZCA)
**Source:** `docs/plan/pillar-0-governance/behavioral-contracts/B_ZCA.md` + P-UX-002
**Journey role:** Every step-to-step transition, every tab-session-handoff, every system→user message assumes the receiver has zero prior context. WHO/WHAT/HOW/NOW is the minimum viable context bundle at any crossing.

### T6 — Council Address Protocol (NEW S072 M-CA)
**Source:** `docs/plan/pillar-0-governance/behavioral-contracts/B_ZCA.md` + `pre-tool-use-council-address-required.sh` T1
**Journey role:** Every Opus↔Sonnet council turn entry is addressed. Every communication crossing a tab boundary identifies sender + receiver.

---

## §3 — BRANCHES: Where the Trunk Diverges

### 3A — Developer's Journey (INFRA-FLOW 8 Steps)

**Most mature branch.** All 8 steps authored, PE-scored, `/platform/developer-journey` live.

**What's dev-specific (not in external-user trunk):**
- Technical intent crystallization (Threshold route: `governor_directive`, `implementation_proposal`)
- Planning grid with PE-scoring
- Scaffolding + tooling setup
- Domain design (ZModel / Prisma / RLS / tenant isolation)
- Validation protocol (verify.mjs + ZF cycles)
- Deployment (Vercel cloud-first per B_ZERO_LAPTOP_DEPENDENCY)
- Iteration anchored to CSPS governance (OPIA, CIE, ZF)

```
DEVELOPER BRANCH (8 INFRA-FLOW steps)
├── Step 01: Intent Crystallization → Threshold classifies (RATIFIED · 01-developer-threshold.md)
├── Step 02: Planning Grid → PE scoring + depth selection (RATIFIED · 02-planning-grid.md)
├── Step 03: Scaffolding & Tooling → nx g platform:page + pnpm (RATIFIED · 03-scaffolding-and-tooling.md)
├── Step 04: Domain Design → ZModel · Prisma · RLS · tenant_id (RATIFIED · 04-domain-design.md)
├── Step 05: Feature Development → libs-first; app imports (RATIFIED · 05-feature-development.md)
├── Step 06: Validation Protocol → verify.mjs · ZF cycles · OPIA (RATIFIED · 06-validation-protocol.md)
├── Step 07: Deployment → Vercel --prod · no localhost (RATIFIED · 07-deployment.md)
└── Step 08: Iteration & Growth → CIE · PE re-score · extract to libs/ (RATIFIED · 08-iteration-and-growth.md)
```

**Gap in developer branch:** Step 02 (Planning Grid) references a PE-scoring integration that is currently manual. Automated PE integration from `validate-pe-dashboard.mjs` is described but not wired into the journey page. **PART 3/6 dependency: no.**

---

### 3B — External-User Journey (Sub-Trunk + Per-Tier Branches)

**Least mature branch.** PART 7 (Frictionless Onboarding) NOT STARTED. Only fragments exist.

#### External-User Sub-Trunk (universal across all 3 external tiers)

These elements apply to ALL external users (account-owner-admin, team-leader, end-user):

- **ZERO jargon** — no platform-internal terms (validator, ZModel, tenant) in UI
- **Single next action** — never a menu; always one clear "what to do now"
- **Visible progress** — completion percentage or step indicator always shown
- **Goal-gradient effect** — show proximity to goal (Zeigarnik)
- **Forgiving / reversible** — every action can be undone; confirm before destructive
- **System→User messaging** per `communication-schema.yaml` situation `system-to-user`
- **Frictionless entry** via `/platform/zero-friction` wizard (PHASE 1 only — Level 0 currently)

#### Per-Tier Branches

```
EXTERNAL-USER BRANCH
│
├── Sub-Trunk: Universal (all external tiers — see above)
│   ├── Zero jargon
│   ├── Single next action
│   ├── Visible progress
│   ├── Goal-gradient
│   └── Forgiving/reversible
│
├── account-owner-admin branch (tenant owner)
│   ├── Entitlements + billing focus
│   ├── User management / role assignment
│   ├── Security posture (audit log = "activity history")
│   ├── Business-outcome language ("workspace" not "tenant")
│   ├── Friction tolerance: MEDIUM (used to admin tasks)
│   └── Data scope: full tenant visibility
│
├── team-leader branch
│   ├── Delegation / team-role assignment
│   ├── Team progress / status
│   ├── Business + delegation language
│   ├── Friction tolerance: MEDIUM-LOW
│   └── Data scope: own team only
│
└── end-user branch
    ├── Single task completion (job-to-be-done focus)
    ├── No permission decisions surfaced
    ├── Encouraging + plain-language tone
    ├── Friction tolerance: LOWEST (any friction = abandonment)
    └── Data scope: own data only
```

**Key tier differences:**

| Element | account-owner-admin | team-leader | end-user |
|---|---|---|---|
| Auth perception | "security / access control" | "who can do what" | "sign in / log in" |
| Error messages | business-impact framing | delegation-context framing | plain-English + recovery step |
| Data shown | all users + billing | their team | their own tasks/data |
| Onboarding depth | Medium (configure workspace) | Light (join + start) | Minimal (start job) |
| Journey entry | Usually invited by Governor/owner | Invited by owner/team-leader | Invited by team-leader/end-user invite |

---

## §4 — EXISTS vs GREENFIELD Ledger

| Element | Status | Cite | What's Missing |
|---|---|---|---|
| Threshold intake | **EXISTS** | `threshold-router.mjs` M6 (cb925cd1) | — |
| 6-tier audience hierarchy | **EXISTS** | `communication-schema.yaml` + `vocabulary.md §Dev↔User Glossary` | — |
| JOURNEY-DOCTRINE 5 principles | **EXISTS** | `JOURNEY-DOCTRINE.md` (ratified S071) | — |
| Developer's journey 8 steps | **EXISTS** | `docs/plan/pillar-4-developer-experience/developer-journey/01-08` | Planning grid PE-integration (minor) |
| `/platform/developer-journey` | **EXISTS** | Playground page (live) | — |
| `/platform/communication` | **EXISTS** | Playground page (live) | — |
| `/platform/profiles` | **EXISTS** | Playground page (live) | — |
| Council address (B_ZCA T1) | **EXISTS** | `pre-tool-use-council-address-required.sh` (S072 M-CA) | — |
| `/platform/zero-friction` | **FRAGMENT** | Phase 1 only — Level 0 intake | Levels 1-4 (require PART 3 product schema + PART 6 page templates) |
| `/platform/wizard` | **FRAGMENT** | PI-001 wiring partial | Full wizard build blocked by PART 6 |
| `/platform/user-journey` | **STUB** | Page exists, `NOT BUILT` status | Entire L2 option space — requires PART 7 |
| Frictionless onboarding | **GREENFIELD** | PART 7 not started | BLOCKED: requires PART 2 (SEALED ✓) + PART 3 (product schema) + PART 6 (page templates) |
| Per-tier external journeys | **GREENFIELD** | Doctrine only — no built pages | BLOCKED: requires PART 3 + PART 6 + PART 7 |
| External-user sub-trunk | **GREENFIELD** | Principle only (JOURNEY-DOCTRINE §8) | No page/component exists |
| `/platform/onboarding` | **GREENFIELD** | Does not exist | BLOCKED: PART 3 + PART 6 prerequisite |
| canonical-register | **GREENFIELD** | Q1 HOLD-S072 | BLOCKED: Governor Q1 ratification pending |

**Headline greenfield gap:** Frictionless onboarding (PART 7) and all external-user journey pages are entirely unbuilt. The trunk (PART 2 sealed + comms-schema + JOURNEY-DOCTRINE) is ready. The branches need PART 3 (product schema) and PART 6 (page templates) before build can begin.

---

## §5 — PART Dependencies Map (NO BUILD in this draft)

Before any journey branch can be built beyond fragments:

| Build Target | Requires PART | Requires |
|---|---|---|
| Frictionless onboarding page | PART 3 (product schema) + PART 6 (page templates) | Product entities (user/tenant/plan) + DashboardTemplate |
| Per-tier user journey pages | PART 3 + PART 6 + PART 7 | See above + PART 7 onboarding flow itself |
| External-user sub-trunk component | PART 6 | PageTemplate for zero-jargon + single-next-action |
| `/platform/zero-friction` Level 1-4 | PART 3 (product schema) | Product tier classification after Level 0 intent |
| Canonical surface register | Governor Q1 ratification | ONE-SOURCE-OF M10 (HOLD-S072) |
| Platform observation board | Governor ratification + CIP M3 | PLATFORM-OBSERVATION L3 |

**What CAN be built before PART 3/6:**
- This draft (done)
- Journey trunk documentation as a dedicated `/platform/journey-trunk` page (no data dependencies)
- External-user sub-trunk principle page (static, no schema)
- Tree diagram page (static visualization of this draft)

---

## §6 — Open Questions for Governor Ratification

Q1 — Is the trunk-and-branches framing correct? Or should it be a 3-layer model (universal trunk → audience trunk → audience branches)?
Q2 — Does the external-user sub-trunk (zero-jargon + single-next-action + visible-progress) belong as a separate `/platform/external-user-journey-trunk` page, or should it live inside `/platform/user-journey`?
Q3 — `/platform/simulation` and `/platform/consult` routes exist in the route list — do they belong in the journey taxonomy? (Not verified this session.)
Q4 — Should the developer's journey page at `/platform/developer-journey` be updated to embed the TRUNK elements explicitly (T1-T6), or is it correct as-is (journey-specific content only)?
Q5 — PART 7 sequencing: does Governor want to build frictionless onboarding before PART 3 is complete (light prototype using mock data) or only after PART 3 ships?

---

*Status: DRAFT — not RATIFIED. Present to OPUS-15 for review before Governor ratification.*
*Authored: Sonnet S072 · 2026-05-30 · PROTO-S072-JOURNEY-CONSOLIDATION-DRAFT per OPUS-15 directive*
