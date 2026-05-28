---
id: csps.governance.core-maximal-doctrine
name: CORE-MAXIMAL-DOCTRINE
description: "Governor-ratified S068 doctrine. CSPS is core-maximal: L0 Core Intelligence → L1 Core Pillars → L2/L3 Sub-cores of Sub-pillars (unlimited granularity) → Apps (bundles). Apps = 80% pre-created core + 20% personalized config. Holds P-ARCH-031 (Core-Maximal Composition) + P-ARCH-032 (Gap-Harmonization-Gate: no perfect fit → STOP+NOTIFY+co-build+RATIFY, never guess-fill-silent). Consolidates 4 existing contracts (B_ASK_WHEN_FILLING_GAPS / B_NO_FORCE_FIT / B_BLOCKER_NO_SILENT_DROP / B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK) into one mechanical gate. Templates everywhere + one-sensible-default. Node-connectivity contract."
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, ARCH, AI]
schema_anchor: vault_files
version: "1.0"
session: S068
owner: group:finky
lifecycle: production
lifecycle_state: active
ns_quality: [core-maximal, core-first, governed-without-rigidity, synergetic]
ns_path: "this doctrine → North Star Core-maximal quality → GVRN spine → North Star Version C"
context_question: "Before building/bundling anything for an app: does a perfect-fit core element exist? If not — did the system STOP and ratify a harmonized addition, or did it silently guess-fill (forbidden)?"
context_quote: "We are building a massive, predefined, verified stack of elements — but the key is orchestration and bundling and CIE and Priority Engine activating only what is required with minimum effort."
inherits_from: "CSPS-NORTH-STAR Core-maximal quality + B_APPS_ARE_TRIALS (P-ARCH-030) + B_ASK_WHEN_FILLING_GAPS + B_NO_FORCE_FIT + B_BLOCKER_NO_SILENT_DROP + B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK + P-META-029 humble-consolidation + P-ARCH-028 core-spine-discipline"
links:
  - { rel: north-star, href: CSPS-NORTH-STAR.md }
  - { rel: apps-trials, href: behavioral-contracts/B_APPS_ARE_TRIALS.md }
  - { rel: master-plan, href: ../_handoff/MASTER-RE-GATE-PLAN-S068.md }
---

# CORE-MAXIMAL DOCTRINE

> **Ratified S068 by Governor Yariv.** The architectural North Star for how CSPS grows and how apps are produced.
> Holds two principles (P-ARCH-031, P-ARCH-032). Formal principles.yaml + validator + hook registration: PART 1 of [MASTER-RE-GATE-PLAN-S068](../_handoff/MASTER-RE-GATE-PLAN-S068.md). This doc is the canonical mention; PART 1 is the mechanical enforcement.

---

## P-ARCH-031 — Core-Maximal Composition

CSPS is **core-maximal**. The architecture:

```
L0  CORE INTELLIGENCE        CIE + Priority Engine + Learning Loop — the brain
L1  CORE PILLARS             governance / arch / data / services / DX / AI / ops
L2  SUB-CORES of SUB-PILLARS specialized core capability
L3+ SUB-BRANCHES + LEAVES    UNLIMITED granularity — no depth limit
─────────────────────────────────────────────────────────────────
APPS = bundles: compositions of core components configured for one need
```

**The rules:**

1. An app is a **composition of core components configured for a need** — not an independent build.
2. **Apps = 80% pre-created core + 20% personalized config.** Example: an app needing tiers + permissions uses **core-level** tiers/permissions; if it's an education app, it draws from a **private-domain** education sub-core; within education, sub-categories; and a **middle level** may exist that defines the *universal elements* every branch below it reuses. Universal-elements-at-each-level is the pattern: define once at the highest level where it's shared, reuse in all branches below.
3. Building capability **inside an app instead of the core** creates a **parallel path** — the primary structural failure mode.
4. **Unlimited granularity is intentional and safe.** We are NOT building a monolith nobody can lift. We are building a massive, predefined, verified stack where the key is **orchestration + bundling + CIE + Priority Engine activating only what each need requires, with minimum effort.** Most of the stack is dormant until bundled. Code duplication for ready-to-deploy bundles is acceptable for now (handled later).
5. **Lifecycle:** apps may TRIAL to discover needed core components ([B_APPS_ARE_TRIALS](behavioral-contracts/B_APPS_ARE_TRIALS.md)); at production they are pure bundles. **Discovery flows inward to the core; the core bundles outward to apps.**

**ns_quality:** core-maximal, core-first.

---

## P-ARCH-032 — Gap-Harmonization-Gate (GHG)

> **Governor S068: "if defined, solves everything; if not mentioned, a hole that creates multiple drifts over time. This holds the DNA of the system forever."**

**The failure mode it prevents:** When the platform bundles core components for a need and finds an aspect with **no perfect-fit pre-created element**, the AI's training defaults (D1 eager-helpfulness, D3 surface-completeness, D7 action-bias) drive it to **guess, fill the gap, and not tell the human.** This silently injects un-ratified, non-compliant elements — the seed of every future drift.

**The mandatory mechanical workflow — on ANY no-perfect-fit:**

```
1. STOP        — do not proceed, do not guess, do not force-fit
2. NOTIFY      — surface the gap explicitly to the human developer
3. CO-BUILD    — design a harmonized solution WITH the human (in-context collaboration)
4. RATIFY      — human approves the new core element at its correct pillar/sub-pillar
5. PROCEED     — only now bundle/build; the gap is now a ratified core element
```

**Why this is the heart of the collaboration:** Rigid boundaries are the guardrails; the *gap-fill decision* is explicitly OUT of AI autonomy and IN the human-AI collaboration. This grows the platform **gradually and organically**, every gap becoming a ratified, fully-compliant core element. Perfect compliance is maintained by construction.

**Consolidates (this gate gives mechanical teeth to 4 existing behavioral contracts):**
- [B_ASK_WHEN_FILLING_GAPS](behavioral-contracts/B_ASK_WHEN_FILLING_GAPS.md) — the "ask" behavior
- [B_NO_FORCE_FIT](behavioral-contracts/B_NO_FORCE_FIT.md) — the "don't force" behavior
- [B_BLOCKER_NO_SILENT_DROP](behavioral-contracts/B_BLOCKER_NO_SILENT_DROP.md) — the "don't silent-drop" behavior
- [B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK](behavioral-contracts/B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK.md) — the "don't invent" behavior

These 4 become the behavioral surfaces of ONE enforced gate. No 5th parallel contract created (humble-consolidation).

**AI-default overrides:** D1 (eager-helpfulness) + D3 (surface-completeness) + D7 (action-bias) — all three drive silent gap-filling; GHG overrides all three.

**Mechanical enforcement (built in PART 1 + recurring audit):**
- **Pending-gaps register** — `tools/data/pending-nodes.yaml` upgraded from a passive log to a STOP-gate: a gap writes a row AND halts the bundling/build until ratified.
- **Hook** — `pre-tool-use-gap-harmonization-gate.sh` (PART 1) blocks creation of an app-bundled element that has no ratified core precedent.
- **Recurring nightly audit** — re-scans the platform for silently-filled gaps (elements lacking a ratified-core lineage); flags any to the Opus-review-queue. This is what "holds the DNA forever."

**ns_quality:** governed-without-rigidity (FAIL-CLOSED on gaps; human override is the ratify step), core-maximal.

---

## P-ARCH-032 §B — The Universal Operating Mode: TEMPLATE-OR-FLAG

> **Governor S068: "This must become the ONLY way CSPS does things — not by native AI defaults, because they are not governed by CSPS."**

The Gap-Harmonization-Gate is not only a build-time gate. It is the platform's **universal operating mode** for EVERY attitude-of-use. Native AI defaults are NOT a fallback — they are ungoverned and therefore forbidden as a source of behavior.

**The rule — for every reusable behavior the system reaches for:**

```
ATTITUDE OF USE (any of):
  page template · wizard protocol · questionnaire ·
  external-user communication tone (MUST offer several options) ·
  date/hour presentation · reminder type (developer or end-user) ·
  ...any reusable behavior whatsoever
        │
        ▼
  Does a governed CSPS template/element exist?
        │
   ┌────┴────┐
  YES        NO
   │          │
   ▼          ▼
 USE it    MANDATORY FLAG — do NOT guess, do NOT assume, do NOT invent.
 (one-     Raise: "A new element must be created in the schema."
 sensible-      → route to THRESHOLD → CSPS governed-creation process
 default +      → human ratifies → element becomes governed core
 create-new-    → THEN use it
 template)
```

**This applies even in chat.** If the Governor asks for something that has no governed element, the AI MUST NOT silently produce it from native defaults. It MUST flag: *"Let's define it and run it through the Threshold,"* and offer two paths:

1. **Refine now** — spend a few minutes defining it + route through Threshold immediately (for urgent/immediate needs)
2. **Vault to prioritize** — refine briefly, place core seeds, save to `vault-pending.yaml`, schedule for later prioritization (for non-urgent needs)

**Completing what we are doing at each phase is the backbone of CSPS development.** Placing core seeds on mature-enough placeholders means even a stub reminds the system to handle it later — under cautious ripple-checking audits that verify every addition only enhances and never harms.

**Why native AI defaults are forbidden as a behavior source:** they are not governed by CSPS — no spine, no pipeline, no audit, no precedent. Using them creates exactly the ungoverned parallel paths the platform exists to prevent. The Template-or-Flag mode replaces "AI guesses a sensible default" with "AI uses a governed element OR flags for governed creation." This is the heart of human-AI collaboration: rigid boundaries as guardrails, the gap-fill decision held in collaboration, never in AI autonomy.

**ns_quality:** governed-without-rigidity, core-maximal, core-first.

---

## Templates Everywhere + One-Sensible-Default

**Principle:** Every reusable element in the platform ships with **ONE sensible default** (chosen by common sense for the most common case) AND a **"Create new template"** path. Templates are part of optional bundling — present in whatever exists in the platform.

**Example:** Frictionless onboarding (PART 7) defines ONE default flow for most cases. A user wanting a direct, detailed, in-your-face onboarding uses "Create new template" to define an alternative. The default is not the only option; it is the *unsurprising* option.

This reconciles "one answer" (your deep instructions favor a single sensible path) with extensibility (other options allowed via templates). Default = common sense; deviation = templated + governed.

---

## Node Connectivity (formalized)

Every node in the stack declares, via the NodeFile contract (PART 1), its **stabilized connectivity** to the rest of the system: which sub-core it belongs to, which deeper layers it inherits from, what it uniquely adds, its dependencies, who consumes it, and its CIE + Priority Engine connection. No node stands alone; connectivity is a required, validated field — so orchestration + bundling can traverse the stack deterministically.

---

## Existing Apps — Dogfood Disposition (Governor S068)

The apps built so far (budget-planner, debt-collection, voice-sorting, task-mgmt, habit-tracker, sandbox) were built to "walk the walk." Governor S068: they may be **vaulted and separated from the system entirely** while the infrastructure is built. Once infrastructure is complete, they re-enter as **inputs** — run through the Developer's Journey + the full Gap-Harmonization cycle (the ultimate dogfooding). Mature elements get a ✓ and are processed onward. **(Pending Governor confirm on the physical move — see master plan AMENDMENT B.)**

---

## Verification

- Every app: ≥80% bundled-from-core; ≤20% app-specific config.
- Every gap: stop-notify-ratify evidence (pending-gaps register row + ratification).
- Every node: connectivity fields declared (NodeFile contract).
- Nightly audit: zero silently-filled gaps across the platform.
