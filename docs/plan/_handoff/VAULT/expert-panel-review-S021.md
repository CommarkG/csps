---
id: csps.handoff.vault.expert-panel-review.S021
name: expert-panel-review-S021
description: >
  8-expert panel review of the full S021 plan: three-axis framework, simulation system,
  naming convention, CCAT, gradual bundling, WisdomVault, completion circle.
  Each expert identifies top gaps and assigns specific tasks to Opus/Sonnet/Haiku.
  Core seeds planted for structural gaps. Backlog updated with model assignments.
version: 1.0
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: GVRN
schema_anchor: platform_plans
session: S021
domain_path: platform
wisdom_class: insight
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: ccat-design, href: ./ccat-when-and-naming-S021.md }
  - { rel: orchestration, href: ./three-axis-orchestration-S021.md }
  - { rel: backlog, href: ../../../../tools/config/platform-update-backlog.yaml }
scope_level: S1
---

# 8-Expert Panel Review — S021 Full Plan
## Work Distributed Between Opus / Sonnet / Haiku

---

> **Council format:** Each expert reviews the full S021 plan from their domain lens.
> Findings rated CRITICAL / IMPORTANT / ADVISORY.
> Each finding assigns work to: Opus (architectural), Sonnet (implementation), Haiku (scanning).
> Core seeds planted where structural placeholders are needed.

---

## Expert 1 — Schema Architect

**Domain:** Data models, ZenStack RLS, multi-tenancy, foundation slices.

**Review focus:** Can the schema support the three-axis taxonomy, CCAT fields, WisdomVault, and domain extension?

### Finding E1-1 — CRITICAL: Schema Has No Domain Extension Protocol
The plan proposes `libs/policies/slices/` as the domain schema directory (ARCH Phase A). But the directory doesn't exist, there's no extension protocol, and there's no validator confirming that app schemas correctly inherit domain slices. The WisdomEntry model also still doesn't exist, even though it was specced in S019 and referenced in multiple S021 documents.

**Assigned:** Sonnet — implement Session 2 (Schema Phase A): create directory + first slice template.

```
// @core-seed: DOMAIN_SLICE_PROTOCOL | plan: platform-excellence-consolidated-S021.md Phase A |
// grows-to: libs/policies/slices/ directory with 3+ domain slice .zmodel files | target: S023
```

### Finding E1-2 — IMPORTANT: CCAT Fields Not in Frontmatter Schema
The CCAT 4D fields (`ccat_who`, `ccat_what`, `ccat_how`, `ccat_when`, `ccat_why`) and the `sequence_requires`/`sequence_unlocks` fields are designed but not in `frontmatter-closed-enums.md`. Without this, the validate-frontmatter.mjs can't validate them and they're effectively invisible.

**Assigned:** Sonnet — add CCAT fields to frontmatter-closed-enums.md after Governor ratifies CCAT WHEN extension.

### Finding E1-3 — ADVISORY: schema_code Field Missing from Schema
The two-layer naming design proposes `schema_code` for machine routing. This field doesn't exist anywhere. The orchestrator currently routes by `domain_path` only.

**Assigned:** Sonnet — add `schema_code` to frontmatter-closed-enums.md alongside CCAT fields. Closed enum: `[SPINE_CODE]-[TYPE_CODE]-S[NNN]`.

---

## Expert 2 — Scale Engineer

**Domain:** Performance at 30 apps × 1,000 tenants × concurrent users.

**Review focus:** What breaks first when the platform hits real scale?

### Finding E2-1 — CRITICAL: pnpm verify Runtime at Scale
Currently: ~30 seconds with 1 app, ~45 validators. At 30 apps, file-walking validators will hit O(N) scaling:
- `validate-core-seeds.mjs`: walks ALL .mjs and .sh files — at 30 apps × 50 files = 1,500 files per run
- `validate-naming-convention.mjs`: scans entire repo for duplicates — O(N²) comparison
- `validate-completion-circle.mjs`: scans all .md in scan directories

Projected verify runtime at 30 apps: 8-12 minutes. Unacceptable.

**Assigned:** Haiku — scan all validators with pattern `readdirSync\|walkDir\|walkForSeeds` to identify all file-walking validators. Report: how many files each walks, estimate scale impact. Return `haiku_scout_return` with pattern_flags.

```
// @core-seed: VALIDATOR_MANIFEST_CACHE | plan: bottleneck-and-gradual-structures-S019.md |
// grows-to: tools/config/validator-manifest.json — pre-computed file list per validator,
// eliminates redundant filesystem walks | target: S025
```

### Finding E2-2 — IMPORTANT: AuditEvent Table Without Partitioning
AuditEvent is append-only and grows indefinitely. At 10,000 users × 10 writes/day = 100,000 rows/day. Without table partitioning, Postgres queries on AuditEvent degrade at 6 months (approximately 18M rows). No partitioning strategy is documented anywhere.

**Assigned:** Sonnet — add to csps-bedrock.md: `[ ] AuditEvent partitioning strategy defined → VLT-S022-AUDIT-PARTITIONING`.

### Finding E2-3 — ADVISORY: WisdomVault Cross-Domain Queries at Scale
When WisdomVault is built, cross-domain queries (sleep + work + relationships) will JOIN across multiple domain schemas. Without proper materialized views or pre-aggregation, a query touching 5 domains × 1,000 tenants × 1 year of data will timeout.

**Assigned:** Opus — design the WisdomVault query architecture (materialization strategy, privacy-preserving aggregation) before Phase C implementation begins.

---

## Expert 3 — Security & Compliance

**Domain:** HIPAA, GDPR, COPPA, SOC2, data privacy, PHI handling.

**Review focus:** What legal liabilities exist in the current architecture?

### Finding E3-1 — CRITICAL: GDPR Erasure Still Not Built After 3 Sessions of Being Specced
The erasure service (`libs/gdpr.ts`) was specced in S019, listed as UPDATE-005 in the backlog, and still not built. If even one EU user signs up for task-mgmt (which is live-database-ready), GDPR Article 17 applies immediately. The liability is active NOW.

**Assigned:** Sonnet — implement `libs/integrations/gdpr.ts` (UPDATE-005) as Session 3 task. This is P1. Cannot be deferred further.

### Finding E3-2 — CRITICAL: Family Domain Will Trigger COPPA
The Family sub-tree (personal.family.children.*) includes accounts for children under 13. When built, this triggers COPPA (Children's Online Privacy Protection Act) — parental consent required, no behavioral tracking, no data retention beyond operational necessity. There is zero COPPA infrastructure in CSPS.

**Assigned:** Opus — design the COPPA schema pattern before family domain is built. The pattern must be encoded as a schema constraint, not just a policy document.

```
// @core-seed: COPPA_SCHEMA_PATTERN | plan: platform-excellence-consolidated-S021.md Phase B |
// grows-to: libs/compliance/coppa.zmodel — age_verified_at field + parental_consent_at +
// age-gating ZenStack policy | target: S025
```

### Finding E3-3 — IMPORTANT: No Security Classification Document
The plan references "security-classification.md" (Phase B of the consolidated plan) as defining which domains require which compliance profiles. This document does not exist. Without it, every new domain schema will be built without knowing its compliance requirements.

**Assigned:** Sonnet — create `docs/plan/pillar-0-governance/security-classification.md` with initial domain → compliance tier mapping.

---

## Expert 4 — UX / Product Designer

**Domain:** User journeys, onboarding, completion states, developer experience.

**Review focus:** Can a real user or developer actually use what's been built?

### Finding E4-1 — CRITICAL: Zero External User Surfaces After 21+ Sessions
The completion circle validator shows 19 artifacts with no `developer_surface` or `user_value`. The platform has zero UI, zero onboarding wizard, zero empty states, zero error states. From the user's perspective, CSPS doesn't exist. Completion circle = 5% of full closed circle.

**Assigned:** Opus — the CCAT WHEN framework for UX should mandate: no domain schema advances to `proven` until an empty state design exists for it.

### Finding E4-2 — IMPORTANT: Onboarding Has No Defined Sequence
The consolidated plan has Phase H (external surfaces) but no onboarding sequence design. For a platform targeting multiple personas (solo_user, business_admin, family_admin), the first 3 minutes of onboarding are critical. Each persona needs a different path.

**Assigned:** Sonnet — create `tools/simulations/onboarding-journey-solo-user.yaml` as first simulation scenario. This IS Phase Sim-1 starting.

### Finding E4-3 — ADVISORY: Developer Experience Gap
Developers building on CSPS have no documentation, no SDK, no example app beyond task-mgmt, and no domain schema templates. Phase H addresses this but it's 8 sessions away. The developer experience gap is wide and widens with each new domain added without docs.

**Assigned:** Add `VLT-S021-DEVELOPER-DOCS` to tracking. Document: every new domain slice must include a README.md showing how to use it.

---

## Expert 5 — AI Systems Architect

**Domain:** AI behavioral governance, GRACE, context management, multi-agent coordination.

**Review focus:** Is the AI governance system actually governing AI behavior, or just documenting it?

### Finding E5-1 — CRITICAL: Enforcement Rate Is 29% After Significant Investment
After S019's 15 lessons, S020's enforcement rate uplift, and S021's work — the enforcement rate is 29%. This means 71% of behavioral overrides remain advisory only. The system LOOKS governed but isn't mechanically governed. This is the central AI governance gap.

**Root cause:** Each new validator takes a session to build. With 31 overrides and 2 sessions of validator work, the math doesn't close. A different approach is needed: instead of building one validator per override, build META-VALIDATORS that cover classes of behaviors.

**Assigned:** Opus — design 3 meta-validators that each cover 5-7 behavioral overrides:
1. `validate-declaration-vs-demonstration.mjs` — covers satisfaction point, premature completion, nominal-ZF (3 overrides)
2. `validate-scope-discipline.mjs` — covers finish-fast-urge, arbitrary-N-split, batching-unrelated (3 overrides)
3. `validate-governance-triad.mjs` — covers single-layer-reliance, context-depth-degradation, ratification-as-proof (3 overrides)

```
// @core-seed: META_BEHAVIORAL_VALIDATORS | plan: sonnet-capability-injection-S019.md L11 |
// grows-to: 3 meta-validators each covering 5-7 inner-AI-defaults overrides,
// targeting enforcement_rate >= 50% | target: S024
```

### Finding E5-2 — IMPORTANT: CCAT WHEN Is Not Yet in Context Orchestrator
The context orchestrator detects task_class and recommends a bundle. But it doesn't know:
- Which domain schema is needed (WHAT)
- Which interaction pattern applies (HOW)
- What dependencies must be satisfied (WHEN)

The orchestrator is a one-dimensional task router. The three-axis framework makes it three-dimensional but the orchestrator hasn't been updated.

**Assigned:** Sonnet — add `ccat_routing` section to context-loading templates. Each template declares which (WHO, WHAT, HOW, WHEN) coordinates it serves.

### Finding E5-3 — ADVISORY: Haiku Pattern Library Has 7 Patterns but No Recall Mechanism
`haiku-pattern-library.yaml` defines 7 patterns. But nothing ensures Haiku actually uses them. A Haiku task could be spawned without including the relevant patterns from the library.

**Assigned:** Sonnet — extend `haiku-spawn-template.md` to include a mandatory "relevant_patterns" section that the spawner MUST populate from haiku-pattern-library.yaml before launching the task.

---

## Expert 6 — Platform Economist

**Domain:** Moat, monetization, value creation, compounding returns.

**Review focus:** Is CSPS building genuine compound value or accumulating elegant documentation?

### Finding E6-1 — CRITICAL: The Moat Is Theoretical — No Real Users Yet
After 21 sessions, the platform has: 1 app (task-mgmt), 0 real users, 0 tenant data, 0 WisdomVault insights. Every architectural advantage is theoretical. The WisdomVault compounds with users; at 0 users, it compounds nothing. **The moat only works when real users contribute.**

This is the single most important business finding: **the platform is an architectural sculpture with no audience.** Session 1 (live DB connection) is not just a technical milestone — it is the moment the moat starts accumulating.

**Assigned:** Governor + Sonnet — Session 1 (AppendOnlyBase + pnpm db:push) is not optional. The Supabase credentials question must be resolved NOW.

### Finding E6-2 — IMPORTANT: CouncilOS Is the Highest-Value Adjacent Product
The multi-model council infrastructure (tools/council/) is the embryo of a product that would pay for the platform. But it's been "Phase Council-1" for 3 sessions with no forward motion.

**Assigned:** Opus — at the next Opus audit session, prioritize: what is the minimum viable CouncilOS that demonstrates the value proposition? What needs to exist before it can be shown to a paying customer?

### Finding E6-3 — ADVISORY: The Research Registry Creates Real Compound Value
`research-registry.yaml` with 7 entries is the beginning of a knowledge asset. If every session adds 1-2 research findings, at session 50 the registry has 50-100 research findings across 7 categories. This IS the "accumulated wisdom" that makes the platform smarter. The value compounds.

**Assigned:** Make research registry update MANDATORY at session close (not optional): "Add any new findings from this session to research-registry.yaml before closing."

---

## Expert 7 — DevOps / Reliability Engineer

**Domain:** Deployment, observability, live propagation, system integrity.

**Review focus:** When something goes wrong in production, how quickly can it be detected and fixed?

### Finding E7-1 — CRITICAL: The Learning Loop JSONL Has No Consumer
`post-stop-learning-loop.sh` has written session metadata to `~/.claude/learning-loop-capture.jsonl` every session since S011. That's potentially 10+ sessions of data. **Nothing reads it.** This is the platform's highest-capacity observability pipeline writing to /dev/null effectively.

**Assigned:** Sonnet — build a consumer: `tools/scripts/process-learning-loop.mjs` that reads the JSONL, extracts session_ids and timestamps, and surfaces:
- Sessions with unusually high blocking_found_total (potential problems)
- Sessions with 0 verify_runs (ZF never ran)
- Sessions with high orchestrator_cycles (complex sessions worth reviewing)

This is the first step toward L15's self-improvement architecture.

```
// @core-seed: LEARNING_LOOP_CONSUMER | plan: opus-lessons-S019/part2-spines-ai-and-vision.md L15 |
// grows-to: tools/scripts/process-learning-loop.mjs — reads JSONL, generates session
// quality report, feeds into pattern registry | target: S023
```

### Finding E7-2 — IMPORTANT: No Observability on What pnpm verify Measures Over Time
`verify-last-run.md` records the current state. But there's no HISTORY. We can't see that enforcement_rate went from 6% (S019) to 29% (S021) without reading multiple session documents. A time-series of key metrics would make platform improvement visible and measurable.

**Assigned:** Sonnet — create `tools/config/platform-metrics-history.yaml` — appended at every session close with snapshot of: enforcement_rate, drift_coverage, sessions_since_opus_review, backlog_pending. This makes the trend visible.

### Finding E7-3 — ADVISORY: 12 Hooks Still STUB
12 of 20 hooks exit 0 without doing anything. This means 60% of the hook infrastructure is dead weight. The `verify-hooks-functional.sh` reports them as "present + executable" — both true, both misleading (present but not functional).

**Assigned:** Opus — run the planned hook audit (OPUS-003 from backlog): classify which 3-4 should be promoted, which should be formally deactivated.

---

## Expert 8 — Learning Systems / Knowledge Graph Expert

**Domain:** Knowledge accumulation, cross-domain intelligence, learning progressions.

**Review focus:** Is the knowledge architecture designed to grow smarter over time?

### Finding E8-1 — CRITICAL: Simulation Is Phase 0 — Needs Phase 1 Now
The Governor correctly identified simulation as the planning sandbox. Phase 0 exists (template). Phase 1 (scenario files) has been recommended twice but not built. Without scenario files, the simulation template is a blank form. The planning sandbox has no content.

**Assigned:** Sonnet — create 3 initial scenarios in `tools/simulations/`:
1. `scenario-health-domain.yaml` — what must exist before personal.health can go live?
2. `scenario-onboarding-solo.yaml` — what does a solo_user experience from signup to first value?
3. `scenario-cross-domain-sleep-work.yaml` — what must exist for WisdomVault to surface sleep→work correlation?

These 3 scenarios immediately reveal which gaps are on the critical path.

### Finding E8-2 — IMPORTANT: The WisdomVault Has No Privacy Architecture
The WisdomVault vision (cross-domain intelligence, aggregated insights) requires a privacy architecture that was designed but not specified concretely. "Privacy-preserving aggregation" is a phrase, not a protocol. Without the protocol, the WisdomVault will either:
(a) Be built insecurely (aggregate without consent)
(b) Not be built at all (blocked by undefined privacy requirements)

**Assigned:** Opus — design the WisdomVault privacy protocol: opt-in model, consent schema, aggregation minimum (N≥100), differential privacy approach. This is a constitutional decision that affects every WisdomEntry ever created.

```
// @core-seed: WISDOMVAULT_PRIVACY_PROTOCOL | plan: platform-excellence-consolidated-S021.md Phase C |
// grows-to: libs/wisdom/privacy-protocol.md + WisdomEntry.privacy_level enforcement +
// tenant opt-in schema | target: S026
```

### Finding E8-3 — ADVISORY: Research Registry Needs Cross-Research Relationships
The research registry has 7 entries. Each is a silo. The `connects_to`, `unexpected_combinations`, and `future_vectors` fields were designed in `ccat-when-and-naming-S021.md` but not added to `research-registry.yaml`. Without cross-research connections, the registry can't surface emergent insights.

**Assigned:** Sonnet — add the new fields to `research-registry.yaml` for all 7 existing entries. This transforms the registry from a list into a knowledge graph.

---

## Consolidated Task Assignment Table

| Task | Expert | Assigned To | Priority | Core Seed? | Session |
|---|---|---|---|---|---|
| Domain slice directory + first template | E1 | Sonnet | P1 | ✓ DOMAIN_SLICE_PROTOCOL | S023 |
| CCAT fields in frontmatter-closed-enums | E1 | Sonnet | P1 | — | S022+ |
| schema_code field | E1 | Sonnet | P2 | — | S022+ |
| Validator file manifest cache | E2 | Haiku scan → Sonnet | P2 | ✓ VALIDATOR_MANIFEST_CACHE | S025 |
| AuditEvent partitioning VLT | E2 | Sonnet | P2 | — | S022 |
| WisdomVault query architecture | E2 | Opus | P3 | — | S026 |
| GDPR erasure service | E3 | Sonnet | P1 | — | Session 3 |
| COPPA schema pattern design | E3 | Opus | P2 | ✓ COPPA_SCHEMA_PATTERN | S025 |
| Security classification doc | E3 | Sonnet | P2 | — | S022 |
| CCAT WHEN → no domain proven without empty state | E4 | Opus | P2 | — | Council |
| First simulation scenario (onboarding) | E4 | Sonnet | P1 | — | S022 |
| VLT-S021-DEVELOPER-DOCS | E4 | Sonnet | P3 | — | S022 |
| 3 meta-behavioral validators design | E5 | Opus | P1 | ✓ META_BEHAVIORAL_VALIDATORS | S024 |
| CCAT routing in context-loading templates | E5 | Sonnet | P2 | — | S022+ |
| Haiku pattern recall mechanism | E5 | Sonnet | P2 | — | S022 |
| Session 1: live DB (Supabase) | E6 | Governor + Sonnet | P1 | — | S022 NOW |
| CouncilOS MVP design | E6 | Opus | P3 | — | Future |
| Research registry mandatory at close | E6 | Sonnet | P2 | — | S022 |
| Learning loop consumer script | E7 | Sonnet | P1 | ✓ LEARNING_LOOP_CONSUMER | S023 |
| Platform metrics history | E7 | Sonnet | P2 | — | S022 |
| Hook audit (OPUS-003) | E7 | Opus | P2 | — | Next Opus |
| 3 simulation scenarios | E8 | Sonnet | P1 | — | S022 |
| WisdomVault privacy protocol | E8 | Opus | P2 | ✓ WISDOMVAULT_PRIVACY_PROTOCOL | S026 |
| Research registry cross-connections | E8 | Sonnet | P2 | — | S022 |

---

## The CRITICAL Finding Across All 8 Experts

**Every expert identified the same root issue from their own domain:**

> The platform is architecturally sound and strategically brilliant.
> **But it has zero real users and zero production data.**

The WisdomVault is empty. The learning loop captures but nothing reads it. The moat compounds nothing because there are no users to compound from. Every additional architectural improvement before Session 1 (live DB) delays the moment the moat starts working.

**The consensus recommendation of all 8 experts: Session 1 (live DB + first real user) is the highest-priority action available to the Governor. All architectural work after that is more valuable because it builds on real evidence.**

---

*8 experts. One conclusion. Execute Session 1.*
*S021 | 2026-05-09*
