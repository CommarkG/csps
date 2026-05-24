---
id: SIA.TIER-CONSOLIDATION
name: TIER-CONSOLIDATION
description: "The complete map of CSPS capabilities across all 3 tiers (Intelligence Core / Playground Reference / App Layer). For every backend capability: one canonical source + tier-specific implementations. The SSoT for 'what exists and where in the 3-tier architecture'."
type: architecture
protection_level: protected
status: draft
core_spines: [ARCH, GVRN, VALD]
core_spine: ARCH
schema_anchor: vault_files
version: "0.1"
session: S053
impl_status: swift-implemented
diataxis_type: reference
owner: group:finky
lifecycle: experimental
lifecycle_state: active
links:
  - SIA.FRONTEND-METHODOLOGY
  - csps.governance.PLATFORM-GENOME
  - csps.governance.THE-IDEAL-BUILD
  - SIA.INFRA-FLOW-VALIDATION
context_question: "For every new capability added to any tier — does the one canonical source exist, and are the tier-specific implementations registered?"
context_quote: "The playground is PART OF THE CORE. What backend requires and what frontend requires must be consolidated into one source used by all layers."
inherits_from: "Platform Genome §5 Platform Architecture + §7 Phase Build Order"
---

# TIER CONSOLIDATION MAP

> The canonical map of CSPS across all 3 tiers.
> For every capability: ONE SOURCE (canonical definition) + tier-specific implementations.
> When a new capability is added anywhere — all three tiers must be checked.

---

## The 3-Tier Architecture

```
TIER 1 — INTELLIGENCE CORE (backend governance)
  Sources of truth for: rules, contracts, behavioral patterns, AI defaults
  Format: .mjs validators + .sh hooks + .md contracts + .yaml registers
  Audience: AI systems (Opus, Sonnet), session-open injection

TIER 2 — REFERENCE IMPLEMENTATION (playground = Tier 2 CORE)
  Sources of truth for: how CSPS is experienced, developer journey, frontend patterns
  Format: Next.js pages + React components + libs/ui/
  Audience: Governor, developers, platform operators

TIER 3 — APP LAYER (ephemeral per-app implementations)
  Inherits from Tier 1 (DNA) and Tier 2 (component library, patterns)
  Format: fork of apps/template/ + app-specific customization
  Audience: end users
```

---

## CAPABILITY MAP (canonical source → tier-specific implementations)

### 1. VALIDATION / QUALITY CHECKING

**One Source:** tools/validators/*.mjs + audit-runner.md (registry)

| Capability | Tier 1 (Backend) | Tier 2 (Playground) | Tier 3 (App Layer) |
|---|---|---|---|
| Schema compliance | validate-frontmatter.mjs ✓ | validate-page-dna.mjs ✓ (6/36 compliant) | via validate-frontmatter.mjs |
| Context carriers | validate-context-question-coverage.mjs ✓ | page contextQuestion in pageDNA | component contextQuestion (to build) |
| ZF compliance | validate-zf-cycle-format.mjs ✓ | N/A (AI behavior) | N/A |
| Platform Genome | validate-platform-genome.mjs ✓ S054 | /platform/simulation/ shows | app-manifest.json (to build) |
| Improvement coverage | validate-improvement-register.mjs ✓ S054 | /platform/simulation/ shows | per-app improvements (to build) |
| DNA inheritance | validate-new-file-dna.mjs ✓ | validate-page-dna.mjs ✓ | validate-app-dna.mjs (to build) |
| Communication quality | validate-communication-quality.mjs ✓ S054 | UI copy quality (to build) | user-facing copy (to build) |
| UI completeness | N/A | validate-ui-completeness.mjs (path fix needed) | per-app UI completeness (to build) |

**Completion**: Tier 1 = 70% | Tier 2 = 25% | Tier 3 = 20%

---

### 2. BEHAVIORAL CONTRACTS / PATTERNS

**One Source:** docs/plan/pillar-0-governance/behavioral-contracts/ (5 shard files)

| Capability | Tier 1 (Backend AI) | Tier 2 (Playground UX) | Tier 3 (App UX) |
|---|---|---|---|
| Communication contracts | B_ZERO_NAVIGATION_FOR_GOVERNOR ✓ | UI navigation clarity (to build) | UX copy contracts (to build) |
| Identity contracts | B_NO_AI_IMPERSONATION ✓ | User identity disclosure (to build) | Login/auth patterns |
| ZF contracts | B_ZF_TERMINATION_DISCIPLINE ✓ | Form validation = ZF (guard questions in UI) | Per-app form validation |
| Apps as trials | B_APPS_ARE_TRIALS ✓ | Shown in /platform/completion/ | Template inheritance |
| Ephemeral storage | DEFAULT-STORAGE-IS-EPHEMERAL ✓ | Page persistence patterns (to build) | State management contracts |

**UX Contracts** (NEW — parallel to AI behavioral contracts, to be created in S055):
- B_UX_GUARD_QUESTIONS: every form action has a verification step
- B_UX_JOURNEY_CONTINUITY: navigation never loses user context
- B_UX_ACCESSIBLE_LOADING: loading states have accessible alternatives
- B_UX_ERROR_RECOVERY: error states always show recovery path

**One Source when created:** docs/plan/pillar-0-governance/behavioral-contracts/B_UX.md (new shard)

**Completion**: Tier 1 = 63 contracts | Tier 2 = 0 UX contracts | Tier 3 = 0 UX contracts

---

### 3. PRIORITY ENGINE / DECISION-MAKING

**One Source:** tools/vault/concepts/MDPE-FORMULA.md + unified-plan.yaml

| Capability | Tier 1 (Backend) | Tier 2 (Playground) | Tier 3 (App) |
|---|---|---|---|
| MDPE scoring | validate-pe-dashboard.mjs ✓ | /platform/completion/ shows PE rank | N/A |
| Gap prioritization | gap-recurrence-register.yaml ✓ | /platform/simulation/ shows K counts | per-app gaps (future) |
| Improvement tracking | improvement-register.yaml ✓ | /platform/simulation/ shows improvements | per-app improvements (future) |

**Completion**: Tier 1 = 100% | Tier 2 = 60% | Tier 3 = 0%

---

### 4. KNOWLEDGE ARCHITECTURE / INHERITANCE

**One Source:** docs/plan/pillar-0-governance/PLATFORM-GENOME.md

| Capability | Tier 1 (Backend) | Tier 2 (Playground) | Tier 3 (App) |
|---|---|---|---|
| Platform index | PLATFORM-GENOME.md ✓ | /platform/architecture/ | app-manifest.json (to build) |
| Core seeds | GRID-CONSCIOUSNESS.md ✓ DEFAULT-STORAGE-IS-EPHEMERAL.md ✓ | Shown in self-validation page | Inherited via session-open |
| Ideal build | THE-IDEAL-BUILD.md ✓ | /platform/sia/ (link) | Template inherits principles |
| Context carriers | context_question + context_quote on 53/430 files | pageDNA.contextQuestion on 6/36 pages | component-level (0%) |
| inherits_from | 25 vault files added S054 | pageDNA.inheritsFrom (partially done) | 0% |

**Completion**: Tier 1 = 25% (53/430) | Tier 2 = 17% (6/36) | Tier 3 = 0%

---

### 5. BEHAVIORAL INTELLIGENCE / USER PROFILING

**One Source:** docs/SIA/PROFILING-HUB-SCHEMA.md + libs/vocabulary-service/

| Capability | Tier 1 (Backend) | Tier 2 (Playground) | Tier 3 (App) |
|---|---|---|---|
| Vocabulary service | @csps/vocabulary-service ✓ Phase 1 YAML | N/A (backend service) | Import from libs/ |
| BehaviorProfile | Schema design ✓, zero code | Shows in developer journey | Inherited from libs/ |
| STT correction | Designed, not built | Shows in developer journey | Per-app VocabCorrection |
| Human Psychology Hub | Designed, not built | Shows in developer journey | Per-app HumanProfile |

**Completion**: Tier 1 = 20% | Tier 2 = 5% | Tier 3 = 0%

---

### 6. DEVELOPER / USER JOURNEY

**One Source:** docs/SIA/INFRA-FLOW-VALIDATION.md (the 9-step test)

| Capability | Tier 1 (Backend) | Tier 2 (Playground) | Tier 3 (App) |
|---|---|---|---|
| Developer journey | INFRA-FLOW-VALIDATION spec ✓ | /platform/developer-journey/ ✓ (PROTOCOL_ONLY for most steps) | N/A |
| User journey | Pattern defined in FRONTEND-METHODOLOGY.md | Not yet implemented | Per-app (Phase S056+) |
| App health | App Health Scanner ✓ tools/scanners/ | /platform/app-health/ ✓ | scan per app |
| INFRA-FLOW-VALIDATION composite test | 4/9 steps active | Shown in developer journey | Test applies per-app |

**Completion**: Tier 1 = 45% | Tier 2 = 30% | Tier 3 = 0%

---

### 7. COMPONENT LIBRARY (NEW — the missing Tier 2→3 connector)

**One Source:** libs/ui/ (TO BUILD — Phase S055)

The canonical CSPS UI components. Every app inherits these at fork.

| Component | Purpose | Status |
|---|---|---|
| CSPSPage | Page wrapper with DNA declaration | NOT BUILT |
| CSPSDataTable | Data display with sort/filter | NOT BUILT |
| HealthBar | CSPS color-semantic progress bar | NOT BUILT |
| GapCard | Gap/improvement display | NOT BUILT |
| MetricBadge | MDPE/coverage % display | NOT BUILT |
| JourneyStep | Step in developer/user journey | NOT BUILT |
| GuardQuestionForm | Form with ZF-style verification | NOT BUILT |

**Completion**: 0% — dependency chain: INFRA-FLOW-VALIDATION Steps 1+3 must be built first

---

## TOTAL COMPLETION SCORECARD

| Tier | Area | % Done | Blocking Deps |
|---|---|---|---|
| 1 | Validation | 70% | — |
| 1 | Audit Pipeline Coverage | 38% | 5/13 running (S059 PROTO-I): pnpm verify + boundary-alignment + communication-quality + agent-calls + quality-alignment |
| 1 | Behavioral contracts | 85% | 9 orphan T2s pending |
| 1 | Priority engine | 90% | — |
| 1 | Knowledge architecture | 25% | context_question backfill |
| 1 | Behavioral intelligence | 20% | BEHAVIOR-HUB code |
| 1 | Platform Genome | 40% | validate-platform-genome ✓ S054 |
| **1 TOTAL** | | **55%** | |
| 2 | Page DNA coverage | 17% | DNA backfill (30 pages) |
| 2 | Frontend methodology | 10% | Methodology doc ✓, zero implementation |
| 2 | Developer journey | 30% | INFRA-FLOW-VALIDATION composite |
| 2 | Self-validation page | 80% | Vercel URL needed |
| 2 | Component library | 0% | S055 |
| **2 TOTAL** | | **20%** | |
| 3 | Template DNA | 10% | libs/ui/ |
| 3 | App layer BEHAVIOR-HUB | 0% | S055 |
| 3 | User journey | 0% | S056 |
| **3 TOTAL** | | **5%** | |
| **PLATFORM TOTAL** | | **~25%** | |

---

## CONSOLIDATION OPPORTUNITIES (things that CAN share one source)

1. **Gap Register**: already shared — gap-recurrence-register.yaml, per-app entries add scope:app field
2. **Improvement Register**: already shared — same pattern
3. **Behavioral Contracts**: ALL contracts shared across tiers. UX contracts go in B_UX.md shard.
4. **Platform Genome**: Tier 1 definition → Tier 2 displays → Tier 3 inherits at fork
5. **Validators**: tools/validators/*.mjs used by all tiers via pnpm verify
6. **Context carriers**: context_question + contextQuestion are the SAME CONCEPT, different syntax (YAML vs TypeScript). One library (QUESTION-LIBRARY.md) serves both.
7. **Inheritance chain**: FRONTEND-METHODOLOGY.md → libs/ui/ → apps/template/ → new apps

---

## BUILD ORDER (optimal sequence for consolidation)

**Phase S054 (current):**
- ✓ validate-platform-genome.mjs
- ✓ validate-improvement-register.mjs
- ✓ Schema backfill (inherits_from on 25 files)
- ✓ Self-validation page
- ⏳ Page DNA backfill (30 playground pages)
- ⏳ Vercel URL confirmation

**Phase S055:**
- libs/ui/ component library (7 components)
- PRIVATE-BUSINESS-SILOS implementation (isolation code)
- UX Contracts (B_UX.md shard)
- validate-frontend-methodology.mjs
- INFRA-FLOW-VALIDATION Steps 1+3 (Threshold + Wizard UI)

**Phase S056:**
- First CSPS-process-correct app build
- User Journey first implementation
- App Health Scanner + MDPE scoring live in production
- COMPONENT-LIBRARY inherited by first app

---

*Tier Consolidation | SIA | S053 | v0.1*
*Updated when: new capability added to any tier → map entry required before implementation*
