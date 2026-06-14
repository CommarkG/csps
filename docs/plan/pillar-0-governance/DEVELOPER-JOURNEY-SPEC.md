---
id: csps.governance.developer-journey-spec
name: DEVELOPER-JOURNEY-SPEC
description: >
  DEVELOPER-journey branch spec — how a developer builds on CSPS, from first idea to live app.
  Inherits the journey trunk (5 principles + 4 invariants). Adds INFRA-FLOW 7-step pipeline
  specifics with developer-tier language and governance gates.
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
authored_by: "Sonnet S084 (draft from fragments 1+5+7)"
owner: group:finky
lifecycle: production
lifecycle_state: active
links:
  - rel: trunk
    href: ./ESSENCE-EXTRACTION-DEFAULT.md
  - rel: doctrine
    href: ./JOURNEY-DOCTRINE.md
  - rel: fragment-developer-page
    href: "../../../apps/csps-playground/src/app/platform/developer-journey/page.tsx"
  - rel: fragment-wizard
    href: "../../../apps/csps-playground/src/app/platform/wizard/page.tsx"
context_question: >
  At which INFRA-FLOW step is the current developer? Is that step ACTIVE or still PLANNED?
  Does the proposed action match the step's DONE criteria, or is it premature?
---

# DEVELOPER-JOURNEY-SPEC
## STATUS: DRAFT — Awaiting Governor Ratification

> **Inherits:** Journey trunk (5 principles + 4 invariants from ESSENCE-EXTRACTION-DEFAULT.md §JOURNEY TRUNK)
>
> **This branch is for:** A developer (internal or external) building an application on CSPS.
> Not for end-users of CSPS-built apps (see USER-JOURNEY-SPEC.md).

---

## WHO THIS JOURNEY SERVES

| Participant | The developer (internal: Yariv; future external: app-builder on CSPS) |
|---|---|
| Starting state | Has an idea, no implementation. Zero CSPS context assumed (ZCA — Invariant I3). |
| Ending state | Live, governed, validated app on Vercel, inheriting platform DNA. |
| Audience tier | `core-developer` (CSPS vocabulary OK; full file:line depth) |
| Cognitive load | HIGH — foundation concepts + governance + tooling all unfamiliar at start |

---

## THE 7-STEP INFRA-FLOW PIPELINE

*Extracted from [/platform/developer-journey](../../../apps/csps-playground/src/app/platform/developer-journey/page.tsx). Cross-ref only — page is canonical status source.*

*Step numbering note: WizardClient.tsx labels itself "INFRA-FLOW Step 3" (1-indexed). The developer-journey page uses 0-based `n:` field (wizard = n:2). This table uses 0-based indexing matching the page. WizardClient's "Step 3" = this table's "Step 2". Both refer to the same artifact.*

| Step (0-based) | INFRA-FLOW label | Name | Trunk principle applied | DONE criteria | Status |
|---|---|---|---|---|---|
| 0 | Step 1 | **THRESHOLD INTAKE** | T1 Optimal Order (classify before act) | Input classified → {spine, pipeline, audience_tier} | ACTIVE (S056) |
| 1 | Step 2 | **7 CREATION QUESTIONS** | T2 Progressive Disclosure (questions crystallize intent before code) | Intent crystallized → planning wizard ready | ACTIVE (S057) |
| 2 | **Step 3** | **7-SECTION PLANNING WIZARD** | T3 Early Win (wizard = first concrete output) + T2 | Wizard complete → YAML plan item produced | ACTIVE (/platform/wizard) |
| 3 | **FORK + DELTA** | T1 Optimal Order (fork only after plan ratified) | apps/template/ forked → package renamed → DNA blocks added | ACTIVE (fork-app.mjs S056) |
| 4 | **VALIDATE** | I4 Reversibility (validate before shipping) | pnpm verify exit_code=0 | ACTIVE (138 validators [ASSUMED]) |
| 5 | **DEPLOY** | T4 Peak-End (deploy = the peak moment) | Vercel live, domain resolved, first user visit logged | PLANNED (Phase B.2 GATED) |
| 6 | **ITERATE + GROW** | T4 Peak-End design (post-launch iterations maintain momentum) | Second app build cycle initiated with lessons from first | PLANNED |

---

## BRANCH-SPECIFIC INVARIANTS (adds to trunk I1-I4)

| # | Invariant | Developer-specific expression |
|---|---|---|
| DI1 | **Governance-Before-Code** | Every step produces a governance artifact (plan item, PROTO, handoff) before code is committed |
| DI2 | **Validate-at-Each-Gate** | `pnpm verify exit_code=0` required before declaring any step DONE |
| DI3 | **Inherit-Don't-Fork** | New apps inherit from `apps/template/` — they do not start from scratch |
| DI4 | **Threshold-First** | Every new idea during the journey re-enters through Threshold, not directly into implementation |

---

## THE B.2 INSTANCE

The current Phase B.2 (thin-slice test-drive, first live Vercel deploy) is an **instance** of Step 5
(INFRA-FLOW Step 6 / 1-indexed) of this developer journey. It is not a separate process — it is
the journey reaching its deploy step.

The bottleneck analysis for B.2 surfaces 5 design-ins that apply at Step 3 (0-based) / INFRA-FLOW Step 4 (FORK + DELTA):
- D1: Gap-Int ordering for JourneyStage.order (O(N²) reorder prevention)
- D2: `unstable_cache` strategy (thundering-herd prevention)
- D3: tenantId guard helper (correctness at multi-tenant scale)

These D1/D2/D3 are **step-3 implementation decisions**, not journey-level decisions.

---

## VARIANTS (from /platform/journey page VARIETY section)

| Variant | When to use | Delta from default 7-step |
|---|---|---|
| Depth-3 (velocity) | Time-boxed build; exploratory | Abbreviated governance checkpoints |
| Depth-4 (quality) | Standard production build | Add explicit Opus review at Steps 1, 3, 4 |
| Depth-5 (platform) | Platform-extending build (new validators, principles) | Add 5-surface engraving + OPIA at each step |

---

## RATIFICATION CHECKLIST (Governor)

Before ratifying this spec, confirm:
- [ ] The 7 steps match the current developer-journey page status (live source)
- [ ] Branch invariants DI1-DI4 don't conflict with existing B_* contracts
- [ ] Variants (depth-3/4/5) align with gradual-build discipline (gradual-depth-engine.md)
- [ ] B.2 instance framing is accurate (Step 5 = the deploy phase)

*Status will move from `draft` to `ratified` only after Governor confirmation.*

---

*Draft S084 · Extracted from fragments 5+7 via EED Phase 1a*
*Trunk source: ESSENCE-EXTRACTION-DEFAULT.md §JOURNEY TRUNK*
