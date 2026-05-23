---
id: SIA.FRONTEND-METHODOLOGY
name: FRONTEND-METHODOLOGY
description: "The CSPS way of building frontend — pages, components, journeys. Establishes Tier 2 of the 3-tier CSPS architecture. The playground proves this methodology; libs/ui/ implements it; apps/template/ inherits it."
type: architecture
protection_level: protected
status: draft
core_spines: [ARCH, GVRN, AI]
core_spine: ARCH
schema_anchor: vault_files
version: "0.1"
session: S053
impl_status: swift-implemented
owner: group:finky
lifecycle: experimental
lifecycle_state: active
diataxis_type: reference
links:
  - csps.governance.PLATFORM-GENOME
  - vault.concepts.GRID-CONSCIOUSNESS
  - SIA.INFRA-FLOW-VALIDATION
context_question: "Before building any UI page or component, has the CSPS Frontend DNA been declared — spine, audience, contextQuestion, inheritsFrom?"
context_quote: "The playground is not a demo. It is the proof-of-methodology for every app built after it. Register it as PART OF THE CORE."
inherits_from: "Platform Genome §5 Platform Architecture"
---

# CSPS Frontend Methodology

> The canonical CSPS way of building frontend.
> The same discipline that governs the backend governance layer applies here.
> Every page is a permanent grid node. Every component carries its DNA.

---

## The 3-Tier CSPS Architecture

**Tier 1 — Intelligence Core (backend):**
Behavioral contracts, validators, hooks, Platform Genome, AI behavioral profiling.
HOW the platform thinks and governs.

**Tier 2 — Reference Implementation (playground — CORE):**
The canonical CSPS frontend. Proves the methodology.
HOW CSPS interfaces are built and experienced.
Includes: Developer Journey, Governance Dashboard, Component Library (libs/ui/).

**Tier 3 — App Layer (ephemeral, per-app):**
Inherits from Tier 2. User Journey is app-specific, built on Tier 2 patterns.
HOW end users experience CSPS-built apps.

The playground is Tier 2. It is NOT a demo. It is the proof that the methodology works before any real app uses it.

---

## CSPS Frontend DNA

Every page and component carries this — parallel to vault entry frontmatter.

```typescript
// Declare on every page.tsx and significant component
export const pageDNA = {
  spine: 'GVRN',              // Core Spine (GVRN/ARCH/AI/VALD/OPER)
  audience: 'developer',      // developer | governor | end-user
  purpose: 'monitoring',      // one-sentence description
  inheritsFrom: [             // which Platform Genome sections / libs
    'Platform Genome §4',
    'libs/ui/DataTable'
  ],
  contextQuestion: 'Before reading this page, what must be verified?',
  cspsApproved: false,        // true only after UX review
  dnaVersion: 'S053'          // session when DNA was last applied
};
```

**Why this matters (not a rule — reasoning):**
Without DNA, a page is isolated from the governance infrastructure. A page with DNA is a grid node — it can be audited, it declares its purpose, and its inheritance chain is visible. The validate-page-dna.mjs validator already scans for this. Currently: 6/36 pages compliant.

---

## Page Tiers (parallel to artifact depth levels)

**L1 — Reference Pages**: Used by developers and Governor to understand/monitor the platform.
Examples: /platform/completion/, /platform/simulation/, /platform/ai-behavior/
DNA requirement: Full (spine + audience + contextQuestion + inheritsFrom)

**L2 — Architecture Pages**: Detailed design and SIA documentation in web form.
Examples: /platform/architecture/, /platform/sia/
DNA requirement: Full + links to design docs

**L3 — Journey Pages**: Developer journey and user journey implementations.
Examples: /platform/developer-journey/, /app/[user-journey-routes]/
DNA requirement: Full + persona declaration + journey_step field

---

## Component Library (libs/ui/) — Phase S055

The canonical CSPS UI components. Every app that forks from apps/template/ inherits these.

**Core components (to build):**
- `CSPSPage` — page wrapper with DNA declaration
- `CSPSDataTable` — data display with sort/filter
- `HealthBar` — progress bar with CSPS color semantics (red/amber/yellow/green)
- `GapCard` — gap/improvement card format
- `MetricBadge` — MDPE or coverage % display
- `JourneyStep` — step in a developer/user journey with status

All components are in `libs/ui/`. Apps cannot reimplement them. They import and use. Same rule as vocabulary-service — never reimplemented per-app.

---

## Developer Journey Implementation

The /platform/developer-journey/ page is the CANONICAL reference for "how does a developer build a CSPS app?"

Current state: PROTOCOL_ONLY — 7 steps shown, 2 NOT YET BUILT, 1 PROTOCOL-ONLY.
Target state: Every step is interactive, shows live status, links to artifacts.

The developer journey IS the INFRA-FLOW-VALIDATION test in visual form.
When INFRA-FLOW-VALIDATION passes, the developer journey page can show "VERIFIED — end-to-end complete."

---

## User Journey Pattern

Not yet built. Defined here for inheritance purposes.

The user journey lives in each app (Tier 3). But the PATTERN is defined here (Tier 2):
1. Onboarding (Threshold classification of new user → BehaviorProfile creation)
2. Core action (the app's main value loop)
3. Correction (STT correction → VocabCorrection → vocabulary-service update)
4. Insight (AI learning from corrections → better results next session)

Every app builds its user journey using these 4 stages. Inherited from this methodology, not reinvented.

---

## The Shift Timing

**Now (S054):** Apply Frontend DNA to the 30 missing playground pages. Zero blocking dependencies. Proves the methodology.

**S055:** After playground DNA is complete AND INFRA-FLOW-VALIDATION Steps 1+3 are built:
Build libs/ui/ component library. Update apps/template/ to inherit from it.

**S056+:** First CSPS-correct app build. User Journey implemented. Developer Journey fully interactive.

**The timing test:**
Frontend shift MDPE currently ~120 (readiness=0.5).
After playground DNA: MDPE ~200 (readiness=0.9).
The DNA backfill is the rate-limiter for the frontend shift.

---

## Audit Coverage

validate-page-dna.mjs: already exists, currently advisory — upgrade to BLOCKING for new pages.
validate-ui-completeness.mjs: exists but scans wrong path — fix to scan apps/csps-playground.
Target: validate-frontend-methodology.mjs (S055) — checks libs/ui/ component coverage.

---

*Frontend Methodology | SIA | S053 | v0.1 draft*
*Tier 2 establishes the methodology. Tier 3 inherits it. No app reinvents the wheel.*
