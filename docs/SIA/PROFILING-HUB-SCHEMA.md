---
id: SIA.PROFILING-HUB-SCHEMA
type: architecture
protection_level: protected
status: draft
core_spines: [ARCH, AI, OPER]
core_spine: ARCH
schema_anchor: vault_files
context_question: "Before building any per-user AI behavioral feature, which of the 3 BehaviorProfile phases are implemented and validated?"
context_quote: "The Hub converts fixes into permanent intelligence. Each correction makes the platform smarter for that user in every app."
version: "0.1"
session: S052
name: "SIA-PROFILING-HUB-SCHEMA"
description: "BEHAVIOR-HUB behavioral intelligence schema — two-layer vocabulary, AI layer, Human layer"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
impl_status: swift-implemented
links:
  - SIA.R1-04-THRESHOLD
  - vault.concepts.OPTIMAL-BUILD-ORDER-S050
consolidation_cross_refs:
  - docs/SIA/R1-04-THRESHOLD.md
  - docs/SIA/R1-06-AI-BEHAVIORAL-PROFILE.md
---

# BEHAVIOR-HUB — Behavioral Intelligence Schema

> The platform's per-user behavioral intelligence layer.
> Two dimensions: what the AI knows about this user (AI Layer),
> and what the platform knows about how this user behaves (Human Layer).
>
> Closes the CSPS learning loop: each user correction becomes permanent
> platform intelligence that improves every subsequent interaction.

## Why This Hub Must Exist First

| Feature | Depends on BEHAVIOR-HUB |
|---|---|
| STT Correction (per-user vocabulary) | UserVocabulary (global) + AppVocabulary (app-scoped) |
| Human Psychology Hub | Human Layer: motivation_patterns + friction_points |
| Combinatorial Engine per-user | Both layers: full profile reads |
| A/B testing per-user | Stable userId across BehaviorProfile |
| AI Default Overrides per-user | AI Layer: ai_default_overrides |

Without BEHAVIOR-HUB, all features are global (same behavior for every user).
With BEHAVIOR-HUB, CSPS apps adapt to each individual — and compound that learning
across all 30 apps via the global vocabulary layer.

---

## Ratified Architectural Decisions (Governor S052 — OPUS-7 Turn 5)

**Decision 1 — Storage: YAML Phase 1, ZModel Phase 2**
Phase 1 (S053): YAML vault files per user per app (buildable today, zero DB dependency).
Phase 2 (S053 gate): Promote to ZenStack ZModel (Prisma + Supabase) when DB
infrastructure is live. YAML field names are designed to match ZModel field names —
promotion is a migration, not a rewrite.
Promotion gate: Phase 3 features (AIDefaultOverride, CE) are BLOCKED until ZModel
migration is complete. A plan item in unified-plan.yaml enforces this.

**Decision 2 — Vocabulary: Two-layer (global + per-app)**
UserVocabulary (global): corrections universal to the user — name pronunciations,
common mis-hearings that apply in any context. Stored in @csps/vocabulary-service
(libs/) and shared across all apps the user uses.
AppVocabulary (per-app): corrections specific to this app's domain. Scoped by
appSlug — full PRIVATE-BUSINESS-SILOS isolation. App-specific corrections OVERRIDE
global corrections when the same misrecognized token appears.
Result: platform intelligence compounds across apps, domain privacy stays intact.

**Decision 3 — Profile creation: First app visit**
BehaviorProfile is created automatically on a user's first visit to any app.
An empty profile is a valid state — it means "no behavioral data yet."
This eliminates null-checks across every feature built on this hub.
Implementation: middleware or session hook on first authenticated page load.

---

## Core Schema

### BehaviorProfile (root — one per user × app)

```
BehaviorProfile
  userId:        string    # CSPS user ID
  appSlug:       string    # PRIVATE-BUSINESS-SILOS isolation key
  createdAt:     DateTime  # set on first app visit
  updatedAt:     DateTime
  ai_profile:    AIBehaviorProfile
  human_profile: HumanBehaviorProfile
```

---

### @csps/vocabulary-service (libs/ package — shared across all apps)

Two tables per the two-layer decision:

```
UserVocabulary              # global — shared across all apps
  userId:         string
  misrecognized:  string    # what STT heard
  intended:       string    # what user meant
  scope:          "global"
  confidence:     Float     # 0.0–1.0
  frequency:      Int       # times correction occurred

AppVocabulary               # per-app — PRIVATE-BUSINESS-SILOS
  userId:         string
  appSlug:        string    # isolation key
  misrecognized:  string
  intended:       string
  scope:          "app"
  confidence:     Float
  frequency:      Int
```

Lookup order: AppVocabulary first (app-specific wins), then UserVocabulary (global fallback).
This service is a libs/ package. Apps import it — they do not implement vocabulary logic.
That is B_PLATFORM_FIRST_OPTIMIZATION applied: 30 apps share one vocabulary service.

---

### AIBehaviorProfile

```
AIBehaviorProfile
  tone_preferences:        TonePreference[]
  ai_default_overrides:    AIDefaultOverride[]    # Phase 3
  satisfaction_thresholds: JsonObject             # Phase 3
```

### HumanBehaviorProfile

```
HumanBehaviorProfile
  motivation_patterns: MotivationPattern[]       # Phase 2
  friction_points:     FrictionPoint[]           # Phase 2
  usage_patterns:      UsagePattern[]            # Phase 2
  correction_history:  CorrectionEvent[]         # Phase 2
```

---

## Phase Build Plan

| Phase | Session | What gets built |
|---|---|---|
| Phase 1 | S053 | BehaviorProfile root + @csps/vocabulary-service YAML (UserVocabulary + AppVocabulary) |
| Phase 2 | S053-gate | ZModel promotion (YAML → Prisma). HumanBehaviorProfile added. |
| Phase 3 | S054+ | AIDefaultOverride + satisfaction_thresholds. CE + A/B testing integration. |

Phase 3 is BLOCKED until Phase 2 ZModel promotion is complete.
The promotion gate plan item must exist in unified-plan.yaml before any Phase 3 work begins.

---

## PRIVATE-BUSINESS-SILOS Guarantee

`appSlug` in BehaviorProfile + AppVocabulary is the isolation key.
When using ZModel: RLS policy enforces `WHERE app_slug = current_app_slug()`.
When using YAML (Phase 1): file path includes appSlug → `./profiles/{userId}/{appSlug}.yaml`.
Cross-app intelligence is provided by UserVocabulary only, which is explicitly global.
No app-level data crosses the silo boundary.

---

## The Learning Loop

```
User interaction (any CSPS app)
→ STT correction → @csps/vocabulary-service writes UserVocabulary or AppVocabulary
→ Threshold harvest (session_harvest event → LEARNING_LOOP pipeline)
→ BehaviorProfile.ai_profile updated
→ Next session: AI pre-loaded with this user's vocabulary
→ Better results → fewer corrections → signal quality improves
```

Each correction makes the AI smarter for that user in all apps. This is the
compounding value that differentiates a CSPS app from a standalone app.

---

## Relationship to Existing Components

| Component | BEHAVIOR-HUB relationship |
|---|---|
| R1-04-THRESHOLD.md | Routes correction events to AI_PROFILE pipeline → BehaviorProfile update |
| apps/voice-sorting/ | First app to generate VocabCorrection entries (Phase 1 specimen) |
| habit-tracker, budget-planner | Input specimens — compared to first CSPS-correct build |
| validate-activation-coverage.mjs | Contracts for BehaviorProfile model must be activated at Phase 2 |
| @csps/vocabulary-service | Lives in libs/ — imported by all CSPS apps, never reimplemented per-app |

---

*BEHAVIOR-HUB | SIA | S052 | Protection: protected (draft)*
