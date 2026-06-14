---
id: csps.governance.essence-extraction-default
name: ESSENCE-EXTRACTION-DEFAULT
description: >
  The CSPS Essence-Extraction Default (EED) — the platform's default behavior for harvesting
  improvable essence from ANY source (discovery, failure, feedback, external input) into improved
  DNA and defaults, wall-to-wall. Trigger = essence EXISTS, not who caught it or how it arrived.
  The journeys are the first application: JOURNEY-TRUNK + developer/user branch specs.
type: governance
diataxis_type: explanation
protection_level: protected
status: draft
impl_status: swift-implemented
ratified_by: "Governor S084 (EED APPROVED)"
ratified_at: "2026-06-14"
core_spine: GVRN
core_spines: [GVRN, AI, VALD, OPER]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S084
authored_by: "Opus-21 (core seed) + Sonnet S084 (Phase 1a)"
owner: group:finky
lifecycle: production
lifecycle_state: active
links:
  - rel: first-application-doctrine
    href: ./JOURNEY-DOCTRINE.md
  - rel: first-application-trunk-page
    href: "../../../apps/csps-playground/src/app/platform/journey/page.tsx"
  - rel: developer-branch-spec
    href: ./DEVELOPER-JOURNEY-SPEC.md
  - rel: user-branch-spec
    href: ./USER-JOURNEY-SPEC.md
  - rel: fragment-1-doctrine
    href: ./JOURNEY-DOCTRINE.md
  - rel: fragment-2-journey-page
    href: "../../../apps/csps-playground/src/app/platform/journey/page.tsx"
  - rel: fragment-3-journey-trunk-redirect
    href: "../../../apps/csps-playground/src/app/platform/journey-trunk/page.tsx"
  - rel: fragment-4-journeys-redirect
    href: "../../../apps/csps-playground/src/app/platform/journeys/page.tsx"
  - rel: fragment-5-developer-journey
    href: "../../../apps/csps-playground/src/app/platform/developer-journey/page.tsx"
  - rel: fragment-6-user-journey
    href: "../../../apps/csps-playground/src/app/platform/user-journey/page.tsx"
  - rel: fragment-7-wizard
    href: "../../../apps/csps-playground/src/app/platform/wizard/page.tsx"
context_question: >
  Before applying EED: what is the essence (not the instance, not the actor, not the polarity)?
  Can it be stated in one sentence that improves the platform regardless of who reads it?
---

# Essence-Extraction Default (EED)

> **By default, the platform harvests improvable essence — regardless of source, polarity, or
> who noticed — into improved DNA/defaults, wall-to-wall. Trigger = essence EXISTS, not who caught it.**
>
> *"The platform gets smarter after every session. Not because we remember failures, but because
> we extract the principle behind them and engrave it into the substrate." — Governor S084*

---

## THE CORE SEED

Most platforms learn from failures by patching the failure site. CSPS extracts the **essence**
of what was learned — the principle, not the instance — and improves the substrate wall-to-wall.
The same insight that prevents one failure propagates to prevent the class of failures.

The distinction that makes this non-trivial: **essence ≠ instance**. An instance is "Sonnet
reported 82 principles when the live count was 78." The essence is "predicted values get labeled
as measured when no provenance tag is present — PREDICTED-AS-MEASURED." Engraving the instance
patches one conversation. Engraving the essence (P-META-032 PROVENANCE LABELS) patches all
future conversations across all boundaries.

---

## THE TRUNK PIPELINE

```
DETECT → EXTRACT → EVALUATE → ENGRAVE → VERIFY
```

### DETECT — Essence Surfaces

**What triggers it:** Any signal carrying improvable content — discovery, failure, feedback,
external input, comparison, Opus OPIA finding, gap-recurrence-register K-count, Governor directive.

**What does NOT trigger it:** Polarity (positive/negative equally valid), actor (Sonnet-caught =
Opus-caught = externally-caught; source does not determine value), size (a one-line insight
can be platform-changing).

**Mechanical detectors (active):**
- `pre-commit-proto-core-seed-mandatory.sh` — BLOCKS commit without core seed (PROTO-level detect)
- `validate-gap-recurrence.mjs` — K≥2 surfaces structural fix requirement (recurrence detect)
- `.csps/threshold/intake-log.yaml` — every threshold input is a detect candidate
- CIE OBSERVE pipeline (planned) — feeds incoming signals to PE for evaluation

---

### EXTRACT — Essence Not Instance

**The one rule:** State the principle in one sentence that improves the platform regardless of
who reads it, what triggered it, or which session produced it.

**Anti-patterns (extract blockers):**
| Anti-pattern | What it IS | What EXTRACT requires |
|---|---|---|
| "Sonnet reported 82 principles wrong" | Instance | "Predicted values must carry [ASSUMED] labels — P-META-032" |
| "S083 OPIA found a count mismatch" | Actor + session | "Council messages require WARRANT provenance on all numeric claims" |
| "The hook failed because..." | Symptom | "The class of failure is: format enforced, substance absent" |

**Extraction question:** "If I removed all references to who, when, and what specific thing happened
— would the remaining sentence still improve the platform? If yes, that is the essence."

---

### EVALUATE — Worth Engraving?

Before engraving, three gates:

| Gate | Question | Fail → |
|---|---|---|
| **Novelty** | Does this add to what P-META-*, B_*, D-*, or an existing gap-entry already says? | Append to existing, not new principle |
| **Generality** | Does it apply to >1 context, actor, or session? | VAULT as scoped-insight, not platform-wide |
| **Proportionality** | Is the governance overhead proportional to the frequency of the failure? | PARK with trigger condition, not auto-engrave |

**Zero-principles discipline:** Every principle that passes these gates DISPLACES an existing one
or supersedes it. Net count does not grow unbounded. Current: 78 principles [ASSUMED: session-state].
EED by itself does not create new principles — it AMENDS or CROSS-REFS existing ones.

---

### ENGRAVE — 5-Surface (FSE)

Per B_FIVE_SURFACE_ENGRAVING_CYCLE: when an essence passes EVALUATE, it touches all 5 surfaces:

1. **Schema** — principles.yaml (principle) or behavioral-contracts.md (contract) or gap-register (gap)
2. **Validator** — T2 validator that checks the engraved rule is followed
3. **Hook** — T1 act-time gate that blocks or warns at the point of violation
4. **Memory** — `memory/feedback_*.md` cross-session persistence
5. **Contract** — B_* contract body or P-META clause update

EED does NOT require all 5 on every extract. It requires the MINIMUM surfaces that make the
essence mechanically active (not just documented). AP-001 governs: EXISTS ≠ ACTIVE.

---

### VERIFY — Evidence That It Holds

DONE is not: "I wrote the principle." DONE is: a behavioral test exists that PROVES the engraved
rule catches a known violation. Standard: `tools/tests/behavioral/` test passes BOTH:
- INPUT A: violation is caught (exit 1 or advisory fires)
- INPUT B: compliant case passes (exit 0, no noise)

---

## 3-PHASE ROLLOUT

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** — First Application | Journeys: trunk + developer/user branch specs | **ACTIVE S084** (this doc + JOURNEY-TRUNK section below) |
| **Phase 2** — Extend to All 5 Comm Types | Apply EED to all 5 communication applications from COMMUNICATION-CORE | PLANNED |
| **Phase 3** — Self-Applying | EED applied to EED itself: harvest from each extract cycle into improving the pipeline | PLANNED |

---

## THE 7 FRAGMENTS (cross-reference only — do NOT move or delete)

These 7 artifacts are the source material for the journey first-application. They are **not moved**.
This doc is the organizing hub (same pattern as communication-schema.yaml for B_* contracts).

| # | Fragment | Type | Status | What it contributes to trunk |
|---|---|---|---|---|
| 1 | [JOURNEY-DOCTRINE.md](./JOURNEY-DOCTRINE.md) | Doctrine | Ratified S071 | The 5 design principles + §1-§9 canonical definitions |
| 2 | [/platform/journey page](../../../apps/csps-playground/src/app/platform/journey/page.tsx) | App page | Active | SUBSTRATE (6 invariants) + DEFAULT + VARIETY model |
| 3 | [/platform/journey-trunk](../../../apps/csps-playground/src/app/platform/journey-trunk/page.tsx) | Redirect | Superseded | Redirects to /journey#trunk-model (URL backward-compat) |
| 4 | [/platform/journeys](../../../apps/csps-playground/src/app/platform/journeys/page.tsx) | Redirect | Superseded | Redirects to /journey (cluster landing) |
| 5 | [/platform/developer-journey](../../../apps/csps-playground/src/app/platform/developer-journey/page.tsx) | App page | Active | INFRA-FLOW 7-step dev pipeline (branch 1 source) |
| 6 | [/platform/user-journey](../../../apps/csps-playground/src/app/platform/user-journey/page.tsx) | App page | Active | 5-stage user journey option space (branch 2 source) |
| 7 | [/platform/wizard](../../../apps/csps-playground/src/app/platform/wizard/page.tsx) | App page | Active | 7-section planning wizard (B.2 test-drive instance) |

---

## JOURNEY TRUNK — First Application of EED

*Extracted from fragments 1-7 above. Shared essence of "a journey" — what holds regardless
of whether the participant is a developer or an end-user.*

### What a Journey IS (trunk definition)

**A journey is an ordered, intentional progression of states a participant moves through to reach
an outcome, where each step is designed relative to the participant's evolving readiness.**

It is not a checklist. It is not a feature list. It is an **ordering-and-framing decision**.
The same set of steps done in wrong order = failure. Done in right order = reproducible success.

*Source: JOURNEY-DOCTRINE.md §1 — preserved verbatim, cross-ref only.*

### The 5 Trunk Principles (apply to ALL journeys)

| # | Principle | Statement | Failure mode without it |
|---|---|---|---|
| T1 | **Optimal Order** | Steps respect dependencies; each step builds readiness for the next | Roof before foundation; dependency violations |
| T2 | **Progressive Disclosure** | Cognitive load is managed — only what's needed now, nothing more | Overload-driven abandonment |
| T3 | **Early Win** | The participant gets a meaningful result before they reach a hard step | Loss of trust before commitment is established |
| T4 | **Peak-End Design** | The highest point AND the ending are deliberately designed | Forgettable journey; participants don't return |
| T5 | **ZCA at Every Boundary** | Every step transition treats the participant as if they start from zero | Accumulated assumption debt; participants fall off at boundaries |

*Source: JOURNEY-DOCTRINE.md §6-§8 + /platform/journey page SUBSTRATE T3/T5 — extracted, cross-ref only.*

### The 4 Trunk Invariants (structural, non-negotiable in any branch)

| # | Invariant | What it means |
|---|---|---|
| I1 | **Single Next Action** | Each step gives the participant exactly one thing to do. Never a menu. |
| I2 | **Audience-Tier Awareness** | Language, tone, depth match the participant's tier (6-tier hierarchy from communication-schema.yaml) |
| I3 | **Threshold Entry** | Every journey begins at Threshold — input classified before any step executes |
| I4 | **Reversibility** | Every step is reversible or has a recovery path shown. No irrecoverable step without explicit warning. |

*Source: /platform/journey page SUBSTRATE T1/T2 + JOURNEY-DOCTRINE.md §4 — extracted, cross-ref only.*

### How Branches Inherit

```
JOURNEY TRUNK (5 principles + 4 invariants — universal)
├── DEVELOPER-journey branch  →  DEVELOPER-JOURNEY-SPEC.md (status: draft)
│     Inherits: all 5 principles + all 4 invariants
│     Adds: INFRA-FLOW pipeline specifics (7 steps, developer-tier language)
│
└── USER-journey branch       →  USER-JOURNEY-SPEC.md (status: draft)
      Inherits: all 5 principles + all 4 invariants
      Adds: 5-stage option space (discovery → growth, end-user-tier language)
```

Both branch specs are **status: draft** — Governor ratification required before any implementation.

---

---

## EED HARVEST LOG — Session Extracts

*Each entry = DETECT → EXTRACT step output. EVALUATE + ENGRAVE are tracked separately per entry.*

### ESSENCE-S084-002: Developer artifacts ≠ User artifacts
*(renamed from -001 — ESSENCE-S084-001 is reserved for the ratification-cadence essence, ratified prior to this harvest log)*
**Source:** Opus-21 OPIA S084 (MEASURED — OPIA course-correct)
**Instance caught:** USER-JOURNEY-SPEC.md incorrectly framed `/platform/wizard` as a user-journey
Stage 2 onboarding instance. The wizard is "INFRA-FLOW Step 3" (WizardClient.tsx:2 — developer
build-planning, not end-user onboarding).
**Essence (extracted, actor-independent):** Artifacts that belong to the DEVELOPER journey
(build-planning, INFRA-FLOW, governance tooling) must not be classified as USER journey instances,
even when they share structural patterns (wizard-style flow, progressive disclosure). The
classification is audience-tier, not UX pattern. Developer-tier artifacts carry platform vocabulary
and are built FOR the developer building the product, not FOR the user using the product.
**Prevention class:** AUDIENCE-TIER-MISCLASSIFICATION
**EVALUATE status:** Passes novelty + generality gates. Proportionality: applies to every
new journey artifact classification. Worth a T3 session-open checklist item: "before classifying
any artifact as user-journey: does it use CSPS vocabulary? If yes → developer-journey."
**ENGRAVE status:** Not yet engraved (Phase 1a — registered only). Phase 2 candidate.

### ESSENCE-S084-003: Substrate-Without-Interface
**Source:** Governor S084 directive ("humans ratify from frontends, not from reading YAML") + Opus-21 B.2 PROTO Option A ratification [MEASURED]
**Instance caught:** DEVELOPER-JOURNEY-SPEC.md + USER-JOURNEY-SPEC.md were created as markdown-only artifacts. No frontend interface existed for humans to view, edit, or ratify them.
**Essence (extracted, actor-independent):** Machine artifacts (YAML/MD specs) are AI substrate — they are the source of truth the AI reads and enforces from. Human ratification happens through frontend interfaces with governed write-back, not through reading specs. Every ratifiable spec must have: (1) a frontend editor where humans can see, edit, and approve; (2) a governed write-back channel that keeps the spec in sync with what the human approved; (3) the AI reads from the spec file, which reflects the human's ratified state.
**Prevention class:** SUBSTRATE-WITHOUT-INTERFACE
**EVALUATE status:** Passes all 3 gates (novelty, generality, proportionality). Applies to every future governance artifact that requires human ratification — principles, contracts, journeys, communication specs, all SPEC.md files.
**ENGRAVE status:** Partially enacted (B.2 journey-admin dashboard built S084 — the first instance). Phase 2: propagate this pattern to communication-schema M3 dashboard + all future SPEC.md files. Full engraving: add to AGENTS.md hard-NO list "never create a ratifiable spec without a frontend editor."
**Cross-ref:** COMMUNICATION-CORE.md §application-registry B1 (Opus↔Sonnet ratification via frontend) · communication-schema.yaml M3 (planned communication dashboard — same pattern).

### PHASE-2 CONSOLIDATION NOTE (do NOT act now — registered per P-META-033)
**5 journey pages exist but only 2 branches:**
- `/platform/journey` — canonical trunk page (SUBSTRATE + DEFAULT + VARIETY)
- `/platform/journey-trunk` — redirect to /journey#trunk-model (superseded, URL backward-compat)
- `/platform/journeys` — redirect to /journey (cluster landing)
- `/platform/developer-journey` — branch 1 (INFRA-FLOW)
- `/platform/user-journey` — branch 2 (5-stage)
Redirects are not branches — they are URL compatibility shims. EED Phase 2 consolidation
target: verify trunk/redirect/branch classification is documented in each page's pageDNA.
No action this session. Registered per P-META-033 No-Lost-Threads.

---

*Authored S084 · Core seed: Opus-21 · Phase 1a: Sonnet S084 · Phase 2-3: planned*
*Journeys ratification deadline: 10 turns of S084 (PARK-S084-007)*
