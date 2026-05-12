---
id: csps.handoff.vault.contexts.governance.EXT-20260512-002-A
name: csps-complete-architecture-synthesis
description: >
  Complete architectural synthesis: the unified CSPS processing flow from any input
  to verified delivery. Covers DNA processing consolidation, audit pipeline ZF connection,
  core health + harmonization, developer compliance, app/SaaS hierarchy,
  external user feedback infrastructure, vault philosophy as proactive completion,
  and ZF as the key for maximum stability and scalability.
  Governor directive S024/S025: "everything with ZF — key for completion and maximum stability."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: vault_files
domain_path: platform
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
session: S025
intent_crystallized: true
threshold_intake_level: deep
threshold_participants: [human, ai]
links:
  - { rel: master-plan, href: ../../../csps-master-plan-s025-plus.md }
  - { rel: threshold-protocol, href: ../../../../pillar-0-governance/threshold-intake-protocol.md }
  - { rel: pe-schema, href: ../../../../../tools/templates/priority-engine.schema.yaml }
  - { rel: audit-runner, href: ../../../../pillar-0-governance/audit-runner.md }
---

# CSPS Complete Architecture Synthesis — The Unified Platform Grid

> Governor directive: "Take a deep breath and explore how everything works together, connected to core systems, with a clear hierarchy for all that is going on."

---

## §1 — The Master Processing Flow (Every Input, Every Time)

```
ANY INPUT enters the platform:
  Human directive → Developer question → User feedback → AI insight → External research
        ↓
  [THRESHOLD GATE — P-META-023 9-step coaching protocol]
  Freestyle input → 26-item checklist scan → fill gaps → 5-item agreement
  threshold_intake_level: light | medium | deep
        ↓
  [DNA GATE — P-META-016 15 elements]
  core_spine classified → domain_path declared → DNA elements checked
        ↓
  [CORE SPINE ROUTING — P-ARCH-028]
  GVRN → decision rights   | VALD → validation evidence
  ARCH → data/schema       | OPER → operations/delivery
  AI   → inner-defaults
        ↓
  [PIPELINE ROUTING — routing.config.ts + audit-runner.md 9 pipelines]
  WizardTemplate matched → steps defined → acceptance_criterion per step
        ↓
  [ZF GATE — every pipeline exit requires ZF ACHIEVED]
  Level 1: per-commit | Level 2: per-phase | Level 3: per-session deep
        ↓
  [PE QUEUE — validate-pe-dashboard.mjs]
  Priority scored → band assigned → session mandate ordered
        ↓
  [EXECUTION — plan creation → implementation → verify]
        ↓
  [VAULT — if deferred: raw-thoughts-queue / contexts / know-how]
  Nothing lost. PE-supervised. Trigger-conditioned. Proactive completion.
```

---

## §2 — The Platform Hierarchy (Five Layers)

```
LAYER 0 — CORE FOUNDATION (sealed — never changes for app requirements)
  User / Tenant / UserTenant / AuditEvent / AppendOnlyBase
  libs/policies/schema.zmodel (foundation entities)
  Validators: validate-foundation-schema-drift.mjs (BLOCKING)
  ZF gate: foundation entities must pass ZF Level 3 before any app builds on them

LAYER 1 — PLATFORM SERVICES (shared capabilities, all apps inherit)
  libs/config/  — routing.config.ts, subscription.config.ts, roles.config.ts
  libs/core/    — sealed L1 primitives (Calendar, Notifications, ...)
  libs/integrations/ — webhook, gdpr, errors, idempotency
  libs/policies/— ZenStack schema + RLS policies
  Validators: validate-no-implementation-without-plan.mjs (BLOCKING for new libs/)
  ZF gate: any new libs/ primitive requires ZF Level 3 before app adoption

LAYER 2 — APPS (domain implementations — inherit LAYER 0+1, add domain entities)
  apps/task-mgmt/    — App #1 (business task management)
  apps/budget-planner/ — App #2 (personal finance) ← CURRENT BUILD
  apps/app-N/        — future apps, each a separate domain
  Foundation contract: apps use libs/ primitives without modifying them
  ZF gate: each app layer exit requires pnpm verify + ZF Level 2 (per phase)

LAYER 3 — SAAS SERVICES (deployed apps → paying customers)
  Deployed: each app on its own Vercel/Supabase/Clerk/Stripe stack
  Graduation trigger: $1K MRR → extract to standalone product
  ZF gate: graduation eligibility validator (graduation-pipeline.md)

LAYER 4 — EXTERNAL USERS + FEEDBACK (from SaaS users back to platform)
  User feedback → Threshold intake → Vault → PE → platform improvement
  ZF gate: feedback items resolved or explicitly deferred with VLT
```

---

## §3 — The 9 Audit Pipelines Connected to ZF + Threshold

Each pipeline below has: what it checks, which Threshold route feeds it, which ZF level gates it.

### Pipeline 1 — Pre-Commit Quality
**Threshold input:** Any PR / code change
**Checks:** TypeScript errors, schema drift, frontmatter, file-size ratchet, cognitive complexity
**ZF gate:** Level 1 (per-commit) — all BLOCKING validators = 0 findings before merge
**Key validators:** validate-frontmatter.mjs (BLOCKING), validate-foundation-schema-drift.mjs (BLOCKING)

### Pipeline 2 — Behavioral Discipline
**Threshold input:** AI behavioral corrections / new behavioral contracts
**Checks:** Banned phrases, link discipline, PCR for decisions, B_* contract coverage
**ZF gate:** Level 2 (per-session) — advisory findings disposition documented
**Key validators:** validate-inner-ai-defaults-enforcement-rate.mjs, validate-drift-registry.mjs

### Pipeline 3 — AI Runtime Validation
**Threshold input:** New AI session opening / session close
**Checks:** INTENT ABSORBED present, Sonnet Report present, boundary alignment, PE dashboard
**ZF gate:** Level 2 (per-session) — validate-sonnet-report.mjs + validate-boundary-alignment.mjs
**Key validators:** validate-sonnet-report.mjs, validate-pe-dashboard.mjs, validate-boundary-alignment.mjs

### Pipeline 4 — Integrity
**Threshold input:** Architectural decisions / cross-artifact changes
**Checks:** Nothing-stands-alone, dead links, consolidation pass, core spine compliance
**ZF gate:** Level 2 (per-phase) — no orphaned artifacts, no broken links
**Key validators:** validate-universal-alignment.mjs, validate-audit-slug-coverage.mjs

### Pipeline 5 — Plan + ZF Validation
**Threshold input:** New plans / plan phase advances
**Checks:** Intent crystallization, routing declared, open plan levels, phase exit criteria
**ZF gate:** Level 2 (per-phase) — FOUNDATION_EXIT_GATE clean before advance
**Key validators:** validate-intent-crystallized.mjs, validate-open-plan-levels.mjs, validate-phase-exit-criteria.mjs

### Pipeline 6 — Meta / Governance
**Threshold input:** New principles / contracts / validators / hooks
**Checks:** FSE 5/5 surfaces, principle slice coverage, contract enforcement rate, audit runner sync
**ZF gate:** Level 3 (per-session deep) — governance artifacts require deep ZF
**Key validators:** validate-principle-slices.mjs, validate-aap-frontmatter.mjs, validate-council-coverage.mjs

### Pipeline 7 — Operations + Delivery
**Threshold input:** Deployment / graduation / infrastructure changes
**Checks:** Build order compliance, graduation eligibility, session-harvest
**ZF gate:** Level 2 (per-phase)
**Key validators:** validate-session-harvest-readiness.mjs, validate-simulation-before-implementation.mjs

### Pipeline 8 — Feedback + Learning (External User Feedback entry point)
**Threshold input:** Chat transcripts / AI corrections / external user feedback / errors
**Checks:** Learning loop completeness, catch-to-engraving, positive value extraction
**ZF gate:** Level 2 (per-session) — no catches without engraving, no drift without learning
**Key validators:** validate-plan-ai-defaults.mjs, validate-topic-plan-progress.mjs

### Pipeline 9 — Runtime Health (Core Health Monitor)
**Threshold input:** System metrics / validator health / hook status / moat coverage
**Checks:** Hook lifecycle, validator orphan detection, moat coverage, core spine depth
**ZF gate:** Level 1 (per-commit, advisory) → Level 3 (weekly)
**Key validators:** validate-moat-coverage.mjs, validate-hook-lifecycle-state.mjs, validate-corespine-depth-markers.mjs

---

## §4 — Core Health + Harmonization

### What "core health" means
The core is healthy when:
1. Foundation entities (User/Tenant/AuditEvent) have zero schema drift (Pipeline 1)
2. No two behavioral contracts contradict each other (Pipeline 4 — consolidation)
3. Every principle has a mechanical enforcer (Pipeline 6 — enforcement rate)
4. The ZF cycle shows compounding (fewer findings per session, not more)
5. The PE dashboard top-5 reflects actual platform priorities (not noise)

### Deduplication + contradiction detection (gap — to build S026)
Currently: `validate-consolidation-check.mjs` checks §0 CONSOLIDATION CHECK in plans.
Missing: A validator that checks behavioral contracts against each other for contradictions.

**Architecture:** `validate-contract-harmonization.mjs`
- Reads all B_* contracts from behavioral-contracts.md
- For each contract: checks if it conflicts with any other (same trigger, different action)
- Reports contradictions as BLOCKING
- Reports near-duplicates (>80% overlap) as ADVISORY → consolidation candidate
- ZF gate: Level 3 (constitutional — contradictions in contracts = governance failure)

### Hierarchy enforcement
Every new element must declare its place in the hierarchy:
- `core_spine:` — which spine governs it
- `domain_path:` — which layer (platform / personal.X / business.X)
- `schema_anchor:` — which schema element it anchors to
- `links: [{rel: parent, href: ...}]` — explicit parent relationship

The "nothing stands alone" principle: every governed artifact has at least one link.

---

## §5 — Developer Level Compliance

Every developer interaction enters through the Threshold (P-META-023). For developers:

**When a developer asks "how do I add X?":**
1. Threshold routes to appropriate WizardTemplate (developer.new-entity / developer.new-page / etc.)
2. WizardTemplate defines the exact steps with acceptance_criterion
3. Developer executes steps → runs pnpm verify after each step
4. ZF gate per step before advancing
5. Final pnpm verify + ZF Level 3 before declaring done

**Developer compliance validators (currently active):**
- `validate-no-implementation-without-plan.mjs` — code without plan = advisory
- `validate-intent-crystallized.mjs` — plan without crystallized intent = BLOCKING
- `pre-tool-use-plan-coverage-gate.sh` — new libs/ files without plan = BLOCKING

**Gap: developer cold-start test**
There's no automated test that proves a new developer can follow the golden path. This is the cold-start test that Gate 3 requires. Proposal: `validate-cold-start-path.mjs` — checks if every step in every WizardTemplate has acceptance_criterion + links to actual platform code.

---

## §6 — App Creation + SaaS Maintenance Hierarchy

### App Creation Protocol (every new app, every time)
1. **Threshold intake** → goal_statement + done_criteria + failure_signal + threshold_route: personal.X / business.X
2. **Template fork** → `cp -r apps/template apps/your-app-name`
3. **Foundation contract declaration** → README declares what's inherited, what's added
4. **WizardTemplate creation** → new route in routing.config.ts for this domain
5. **Schema extension** → domain entities in libs/policies/schema.zmodel (NOT in app-local schema)
6. **Threshold Wizard UI** → onboarding flow that runs the 3 crystallization questions
7. **ZF Level 2 per layer** → Layer 1, 2, 3, 4 each have ZF gate before advancing
8. **Graduation plan** → $1K MRR → extract → standalone product

### SaaS Maintenance
- Platform improvements propagate to all apps automatically (libs/ changes)
- App-specific changes stay isolated in apps/your-app-name/
- Cross-app pattern graduation: if app-specific code would benefit all apps → extract to libs/ → all apps inherit
- ZF gate for extraction: `validate-consolidation-check.mjs` flags the pattern → Governor ratifies → extract

### What the hierarchy prevents
- Foundation changes for app requirements (Gate 3 failure signal)
- App-specific code that reinvents platform primitives
- Cross-tenant data access (ZenStack RLS prevents this mechanically)
- Unmaintained apps (graduation tracking + deprecation pipeline)

---

## §7 — External User Feedback Infrastructure

### The feedback flow (new — to build S027)
```
External user (SaaS app) → feedback form / in-app mechanism
  ↓
Structured feedback entry: { type: feature|bug|insight, content, app, user_id, date }
  ↓
VAULT/feedback/ directory (tagged by app + type)
  ↓
Pipeline 8 (Feedback + Learning) → Threshold intake (Light level)
  ↓
26-item checklist (abbreviated for feedback): B1 (who) + C1 (which app) + I1 (what) + M1 (done signal)
  ↓
PE scoring: feature request = PE based on frequency + impact; bug = PE based on severity
  ↓
PE queue → surfaces in next relevant session mandate
  ↓
If bug: VLT raised → BLOCKING in pipeline until fixed
If feature: vaulted with PE score → surfaces when conditions met
```

### Vault locations for feedback
```
VAULT/
  feedback/
    [app-name]/
      features/    — feature requests, PE-scored, trigger-conditioned
      bugs/        — bug reports, VLT-linked
      insights/    — user observations that may inform platform improvement
```

### The feedback → Threshold protocol
Feedback is treated as a Threshold input with:
- `threshold_route: ux.onboarding-flow` (if UX friction)
- `threshold_route: developer.new-entity` (if missing feature)
- `threshold_route: platform.governance` (if platform-level insight)

Pipeline 8 is the mandatory entry point. Feedback that doesn't go through Pipeline 8 = governance bypass.

---

## §8 — The Vault Philosophy — Proactive Completion

### The vault is not an archive
A vault is a PE-supervised holding area. Everything in it:
1. Has a reason for deferral (explicit, not implicit)
2. Has a trigger condition for surfacing
3. Has a PE score that positions it in the priority queue
4. Has an expiry/review date (after which it surfaces as advisory)

**The vault is the answer to "new shiny object" drift.** When an idea arises that doesn't match the current PE priority, it goes into the vault — not ignored, not forgotten, not acted on immediately. The vault ensures PE ordering is respected without losing any idea.

### Vault types in CSPS
| Vault | Contents | Trigger | Review |
|---|---|---|---|
| `raw-thoughts-queue.md` | Ideas, half-formed thoughts, tangents | PE rises above threshold | Per session |
| `VAULT/contexts/` | External research, vaulted insights | Referenced in session mandate | Per topic-plan |
| `VAULT/know-how/` | Error patterns, success patterns, insights | Referenced by type | Quarterly |
| `VAULT/topic-plans/` | Full plans, PE-scored | PE dashboard | Every session |
| `VAULT/feedback/` | External user feedback | Bug=immediate; Feature=PE cycle | Per Pipeline 8 run |
| `VAULT/cseps/` | Cross-Synergy Enhancement Plans | Governor ratification | Per proposal |

### The proactive completion mechanism
The vault is only useful if items don't stay there forever. The proactive completion mechanism:

1. **validate-pe-dashboard.mjs** surfaces top items from ALL active plans + vault triggers
2. **session-open.sh** shows PE top-5 including high-PE vault items
3. **review cadence**: quarterly vault audit (validate-vault-completeness.mjs — to build) checks all vault items for stale entries
4. **Trigger conditions**: every vault entry has a trigger field: `trigger: "when App #3 builds" / "when PE > 70" / "when ZF Level 3 passed for X"`
5. **Nothing silent**: an item without a trigger = ADVISORY (validate-pe-dashboard.mjs flags it)

### Vault philosophy principle (to register as P-META-024 or extend P-META-016)
> "Nothing is abandoned. Everything is deferred with intent. The vault is a queue, not a graveyard.
> Every vault item has a PE score, a trigger condition, and an expiry review date.
> The PE dashboard is the vault's heartbeat — it makes deferred work visible at the right time."

---

## §9 — ZF as the Key for Maximum Stability and Scalability

ZF (Zero Findings) is not just a metric. It is the platform's quality standard. ZF means:
- **No finding goes unaddressed.** Every blocking finding is resolved. Every advisory finding is either resolved or explicitly deferred with documented reason.
- **Evidence required.** "I think it passes" is not ZF. "Here is the validator output showing 0 blocking findings" IS ZF.
- **Compounding.** Each ZF cycle leaves the platform cleaner than before. Over 30 apps × 100 sessions, this compounds into a platform that actively self-improves.

### ZF at each layer
| Layer | ZF level | Trigger |
|---|---|---|
| Per-commit | Level 1 | Any code change |
| Per-phase | Level 2 | Phase gate advance |
| Per-session | Level 3 | Session close |
| Per-week | Level 3 extended | Weekly cadence (deep audit) |
| Per-quarter | Level 3 constitutional | Behavioral contract + principle review |

### The ZF-Threshold connection
Every Threshold acceptance_criterion IS a ZF gate:
- Step 1 acceptance: "no similar entity found OR existing confirmed insufficient" → run validate-consolidation-check.mjs
- Step 3 acceptance: "entities in schema.zmodel, zenstack generate passes" → pnpm verify
- Step 6 acceptance: "pnpm verify + ZF Level 3 pass" → explicit ZF evidence required

### The ZF-Vault connection
ZF findings that can't be resolved in this session → go to vault with:
- The finding verbatim
- Why it can't be resolved now
- A trigger condition for when it can be
- A PE score (blocking findings get PE ≥ 80 automatically)

---

## §10 — What Exists That Can Be Enhanced Now

| Element | Enhancement needed | Impact | Session |
|---|---|---|---|
| `validate-universal-alignment.mjs` | Add threshold_route cross-check (artifact's threshold_route must match core_spine) | DNA gate integrity | S026 |
| `validate-consolidation-check.mjs` | Extend to check B_* contracts against each other for contradictions | Core harmonization | S026 |
| `raw-thoughts-queue.md` | Add PE score + trigger condition fields to every PENDING item | Vault proactive completion | S025 |
| Pipeline 8 (learning loop) | Make it the explicit entry for external user feedback | Feedback infrastructure | S027 |
| `validate-pe-dashboard.mjs` | Add vault item surfacing (items with met trigger conditions) | Proactive completion | S026 |
| `validate-moat-coverage.mjs` | Add M-18 (Question Protocol = threshold-intake-protocol.md §14 coverage) | Moat completeness | S025 |
| `session-open.sh` | Add raw-thoughts-queue PENDING count with trigger status | Session orientation | S025 |
| All WizardTemplate steps | Ensure every acceptance_criterion references a specific validator | ZF-Threshold connection | S026 |

---

*Authored: S025 | Governor directive: "deep dive into everything working together with ZF as key"*
*Vault type: architectural synthesis | Level: Deep | Participants: human + ai*
*Next: create topic plan → implement §10 enhancements → build feedback infrastructure*
