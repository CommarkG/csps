---
id: csps.handoff.vault.topic-plan.csps-continuous-intelligence-architecture
name: csps-continuous-intelligence-architecture
description: >
  The definitive architecture for CSPS as a continuously self-improving platform.
  Three consolidated processes cover everything: Platform Intelligence Loop (monitoring),
  Platform Wisdom Protocol (AI profiling + extraction), External Inheritance Architecture
  (developer + user facing). Governor directive S022: consolidate, mechanize, formalize.
  No implementation until this plan is complete. Nothing orphaned.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN, VALD, OPER, AI]
schema_anchor: topic_plans
domain_path: platform
tags:
  - domain:architecture
  - domain:governance
  - domain:ai
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S022
execution_mode: deep_quality
intent_crystallized: true
threshold_route: platform.governance
know_how_consulted: true
enforcement_stage: active
topic_id: csps-continuous-intelligence-architecture
priority_score: 98
priority_band: 1
depth_chosen: 5
depth_rationale: |
  Depth-5: constitutional change to how the platform operates. Covers all 5 Core Spines.
  Defines the permanent operating model for CSPS as it builds 30+ apps.
  Every future session operates within this architecture.
impl_status: swift-implemented
ai_defaults_influence: partial
ai_defaults_declared_sections:
  - "§5 External enterprise standards — research-based, see §5 ai_defaults note"
  - "§6 Monitoring technology choices — industry conventions applied"
links:
  - { rel: bedrock, href: ../../../../pillar-0-governance/csps-bedrock.md }
  - { rel: over-system-audit, href: ../over-the-system-audit-S022.md }
  - { rel: flow-audit, href: ../platform-flow-audit-S022.md }
  - { rel: excellence-plan, href: ./platform-excellence-completion-S023.md }
scope_level: S1
context_question: "What is the current depth level of this topic plan, and have all prior depth gates been verified clean before proceeding to the next level?"
---
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]



# CSPS Continuous Intelligence Architecture

> **The Governor's principle:** "Leave as little as possible for the AI to do in real time.
> Once things are protocoled, the AI reads the protocol file at the right stage — not
> reinventing from memory. The platform must witness itself continuously, accumulate wisdom,
> and inherit everything to external layers. Consolidated into 2-3 processes. Nothing orphaned."

---

## §0 — ARCHITECTURE OVERVIEW

Three consolidated processes. Everything the Governor described maps into one of these three.
Nothing falls outside. No orphaned minitrees.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PROCESS 1: Platform Intelligence Loop (PIL)                            │
│  "The Witness" — continuous monitoring, alerting, prevention            │
│  Runs: per-commit (fast) + per-session-close (deep) + weekly (full)     │
├─────────────────────────────────────────────────────────────────────────┤
│  PROCESS 2: Platform Wisdom Protocol (PWP)                              │
│  "The Brain" — AI profiling, extraction, harvesting, protocol evolution  │
│  Runs: per-session (harvest) + per-ratification (CEC) + per-model-update│
├─────────────────────────────────────────────────────────────────────────┤
│  PROCESS 3: External Inheritance Architecture (EIA)                     │
│  "The Bridge" — developer experience + user experience + tier gates     │
│  Runs: per-new-app (template) + per-feature (inheritance check)         │
└─────────────────────────────────────────────────────────────────────────┘

All three feed each other:
  PIL findings → PWP (extract insight) → EIA (add to developer guide)
  EIA gaps → PIL (add validator) → PWP (harvest the solution)
```

**Consolidation principle:**
- If a new process is proposed: first check if it belongs in PIL, PWP, or EIA
- Add it to the right process as a component, not a new process
- Maximum 3 processes forever. Components within each process: unlimited.

---

## §1 — PROCESS 1: Platform Intelligence Loop (PIL)

### §1.1 What PIL Is

PIL is the "witness" — a mechanical system that observes the platform at multiple timescales,
extracts anomalies, surfaces insights, and prevents known problems from recurring.
It is NOT a checklist. It is NOT AI memory. It is mechanical, automatic, and unconditional.

PIL does not wait to be asked. It fires at events. Its output is structured. Its findings
feed PWP (for wisdom accumulation) and drive plan creation (for fixing).

### §1.2 PIL Architecture (3 tiers)

**Tier 1: COMMIT GATE (fires on every git push, ~15 seconds)**
```
What runs: pnpm verify (58 validators)
What it catches: structural violations, broken validators, frontmatter errors, PE gaps
What stops it: exit_code=1 on any BLOCKING validator
Protocol: docs/plan/pillar-0-governance/csps-bedrock.md §5 Mechanical Enforcement
Read at: every commit, before push
Output: pass/fail + list of blocking violations
```

**Tier 2: SESSION CLOSE GATE (fires at every session close, ~5 minutes)**
```
What runs: pnpm zf:deep (node tools/zf-orchestrator.mjs --level 3)
What it catches: advisory findings, advisories that persist across cycles,
                 harvest completeness, RZF evidence, extraction note presence
What stops it: blocking advisories that cannot be addressed or deferred
Protocol: docs/plan/_handoff/VAULT/protocols.md §10
Read at: before writing closing-summary
Output: ZF ACHIEVED status + cycle count + advisory list + deferred list
```

**Tier 3: WEEKLY DEEP AUDIT (fires on schedule, ~30 minutes)**
```
What runs: audit-runner full pass (pnpm audit:run — currently DEFERRED, ships Session B)
What it catches: drift between sessions, stale plans, orphaned processes,
                 PE connectivity gaps, AI-defaults enforcement rate trends,
                 complexity score evolution, enforcement rate evolution
Protocol: docs/plan/pillar-0-governance/audit-hub.md (when built)
Read at: beginning of each week's first session
Output: structured report → feeds into PWP harvest if significant findings
```

### §1.3 PIL Component Registry

| Component | Tier | Current state | What it checks |
|---|---|---|---|
| pnpm verify (58 validators) | 1 | ACTIVE | All BLOCKING structural checks |
| validate-frontmatter.mjs | 1 | ACTIVE | Frontmatter schema compliance |
| validate-vlt-blocking.mjs | 1 | ACTIVE | No pending VLTs |
| validate-pe-connectivity.mjs | 1 | ACTIVE | PE scoring on all active plans |
| validate-plan-ai-defaults.mjs | 1 | ACTIVE | AI-defaults declared on plans |
| validate-bedrock.mjs | 1 | ACTIVE | Bedrock 22/22 |
| validate-session-harvest-readiness.mjs | 1→2 | ADVISORY (promote to BLOCKING in Session A) | Extraction note present |
| validate-rzf-evidence.mjs | 2 | ADVISORY (promote to BLOCKING in Session A) | ZF evidence in session close |
| pnpm zf:deep | 2 | RUN MANUALLY (wire to hook in Session A) | Full ZF cycle |
| pnpm audit:run | 3 | DEFERRED (Session B) | Full audit pipeline |
| validate-prisma-version-alignment.mjs | 1 | TO BUILD (Session B) | Version drift |
| validate-webhook-idempotency.mjs | 1 | TO BUILD (Session B) | Idempotency gaps |
| validate-isolation-layers.mjs | 1 | TO BUILD (Session C) | ZenStack + RLS active |
| validate-orphaned-processes.mjs | 3 | TO BUILD (Session C) | Minitrees without connections |
| Complexity score monitor | 3 | PARTIAL (tools/zf-session-tracker.json) | Platform complexity |
| PE enforcement rate tracker | 3 | PARTIAL (validate-inner-ai-defaults-enforcement-rate.mjs) | Governance coverage |

### §1.4 PIL Orphaned Process Detection (NEW)

**The "minitree" problem:** Sub-processes are created (splitting, generation, validators) but
lose their connection to the main system over time. PIL must detect these.

**`validate-orphaned-processes.mjs` — what it checks:**
```
1. Every .mjs in tools/ that is NOT in verify.mjs → ADVISORY (orphan candidate)
2. Every generator in tools/generators/ that has no split command in package.json → ADVISORY
3. Every hook in .claude/hooks/ that is not declared in AGENTS.md → ADVISORY
4. Every audit slug in audit-runner.md that has no corresponding .mjs validator → ADVISORY
5. Every topic-plan with lifecycle_state: active and no open plan items → ADVISORY (stale plan)
```

**Current orphans (found this session):**
- `tools/stamp-domain-path.mjs` — one-time script, committed to main, no recurring trigger
- `apps/task-mgmt/seed-test.mjs` — diagnostic script in production app, no purpose after S022
- `apps/task-mgmt/test-create.mjs` — diagnostic script in production app
- `apps/task-mgmt/test-zenstack-policy.mjs` — diagnostic script in production app
- `tools/copy-zenstack-output.mjs` — permanent workaround, not wired to session-open

**Resolution protocol for orphans:**
```
On discovery: classify as one of:
  PROMOTE: make it a permanent validator (add to verify.mjs)
  ARCHIVE: move to docs/plan/_handoff/VAULT/archive/ with rationale note
  DELETE: if no value (diagnostic scripts after they've served their purpose)
  WIRE: add to the right trigger (hook, script, cron)
```

---

## §2 — PROCESS 2: Platform Wisdom Protocol (PWP)

### §2.1 What PWP Is

PWP is the mechanism by which the platform accumulates wisdom — learnings from each session,
from AI behavior patterns, from external insights — and makes that wisdom permanently available
WITHOUT requiring the AI to remember it.

The key insight: "once things are protocoled, the AI reads the protocol file at the right stage."
PWP is the protocol creation and maintenance system.

### §2.2 PWP Architecture (4 streams)

**Stream 1: Session Harvest (per session close)**
```
Trigger: session close gate (mandatory, blocks closing-summary)
What happens:
  1. Identify major insights from the session (code discoveries, pattern learnings, gap discoveries)
  2. Write session-SNNN-extraction.md
  3. Run CEC walk: for each insight, ask "where does this enhance other elements?"
  4. Iterate until CEC returns 0 new opportunities
  5. For each enhancement found: add to §3 "What must be built"
Protocol file: READ docs/plan/pillar-0-governance/plan-creation-protocol.md §4 before harvest
Output: session-SNNN-extraction.md + CEC walk trail ref

MANDATORY EVIDENCE BEFORE SESSION DECLARED DONE:
  validate-session-harvest-readiness.mjs → status=HARVEST_DONE
```

**Stream 2: AI Profile Maintenance (per model update OR quarterly)**
```
Trigger: csps_model_version changes OR 90 days pass OR validate-inner-ai-defaults-freshness warns
What happens:
  1. Review all 13 inner-ai-defaults files for changed behavior
  2. Update continuous-drift-log.md with new observations
  3. Promote K=2 patterns to category files
  4. Re-run enforcement rate check
  5. Update calibrated_at + csps_model_version in README.md
Protocol file: READ docs/plan/_handoff/VAULT/inner-ai-defaults/README.md before update
Output: Updated category files + drift log entries + enforcement_rate metric

WITHIN THE SYSTEM (not over it):
  Every session: CONCEPT_LOAD checks inner-ai-defaults at Threshold
  Every plan: ai_defaults_influence declared in frontmatter
  Every session close: drift log checked for new observations
  These are enforced by: validate-plan-ai-defaults.mjs + validate-inner-ai-defaults-freshness.mjs
```

**Stream 3: Protocol Evolution (per new discipline or K=2 catch)**
```
Trigger: a new behavioral discipline is discovered AND K=2 (second occurrence)
What happens:
  1. FSE (5-Surface Engraving Cycle) — all 5 surfaces updated atomically:
     Surface 1: schema (frontmatter-closed-enums.md or principle)
     Surface 2: validator (new .mjs added to verify.mjs)
     Surface 3: hook (new .sh in .claude/hooks/)
     Surface 4: memory (feedback file in memory/)
     Surface 5: contract (behavioral-contracts.md entry)
  2. After engraving: run pnpm verify → exit_code=0
  3. Add to session extraction: this is a positive event (B_POSITIVE_VALUE_EXTRACTION)
Protocol file: READ docs/plan/pillar-0-governance/behavioral-contracts.md §B_FIVE_SURFACE_ENGRAVING
Output: 5 artifacts updated atomically, pnpm verify passes

WITHIN THE SYSTEM:
  validate-catch-completeness.mjs catches when catch happened without engraving
  validate-rzf-evidence.mjs catches when engraving declared without ZF evidence
```

**Stream 4: Know-How Accumulation (per implementation session)**
```
Trigger: any session with code implementation
What happens:
  1. Before implementation: READ docs/plan/_handoff/VAULT/know-how/INDEX.md
  2. Check for relevant patterns (error-patterns/, solution-patterns/, anti-patterns/)
  3. Write §KH section in plan with: what was found, how it influenced the approach
  4. After implementation: if new pattern discovered, add to know-how/
Protocol file: READ docs/plan/_handoff/VAULT/know-how/INDEX.md before §KH
Output: §KH section with substance (not just know_how_consulted: true flag)

WITHIN THE SYSTEM:
  validate-plan-know-how.mjs checks §KH exists AND is non-empty (Session A upgrade)
```

### §2.3 PWP — "Week-4" Retirement Protocol

**Every "planned week-4" item must be reclassified. No more open debt.**

Classification rule (applied in Session 0 of excellence plan):
```
For each of the 49 items:
  R1 contract + no active enforcement → CLASS A (build in Session A)
  R2 contract + planned validator → CLASS B (assign session S023-B through D)
  R3 contract (context-conditional) → CLASS C (human-judgment with self-assessment question)
  Duplicate of existing → CLASS D (consolidate, reference existing)
  Genuinely non-mechanical → CLASS C + retire the "planned week-4" promise

Resulting output:
  behavioral-contracts.md: each entry updated with session assignment OR human-judgment declaration
  audit-runner.md: each "planned week-4" slug updated with session assignment or retired
  "week-4" label: RETIRED from the platform vocabulary
```

### §2.4 AI Profiling — Within the System

**Current state:** Inner-AI-defaults registry exists (13 files). Enforcement rate: 29% (partial).
The registry is referenced at Threshold (CONCEPT_LOAD) but not enforced at other lifecycle points.

**Target: Full lifecycle integration**

```
LIFECYCLE POINT → WHAT THE AI CHECKS → MECHANICAL ENFORCEMENT

Session open:
  → Load inner-ai-defaults README (active situation context)
  → Display: "Active overrides: [list of disposition=override entries]"
  → Enforced by: session-open.sh (currently partial)

Plan creation:
  → Declare ai_defaults_influence in frontmatter BEFORE writing
  → Label [AI-DEFAULT] sections inline
  → Enforced by: validate-plan-ai-defaults.mjs (ACTIVE)

Implementation start:
  → CONCEPT_LOAD fires (L2 spine selection)
  → Match to inner-ai-defaults category (code/prose/reasoning/tooling)
  → Apply relevant overrides
  → Enforced by: pre-tool-use-frontmatter-enum-check.sh (partial)

Session close:
  → Scan turn history for untriggered-default patterns
  → Add to continuous-drift-log.md if new
  → Enforced by: post-stop-learning-loop.sh (STUB → promote in Session A)

Model update:
  → Trigger full inner-ai-defaults review
  → Enforced by: validate-inner-ai-defaults-freshness.mjs (ACTIVE)
```

**The key principle (Governor's words):** "Working WITH AI nature, not against it, using context
and reasoning, with rigid guardrails."
- WITH: AI's tendency to pattern-match is used (inner-ai-defaults registry gives it CSPS patterns)
- AGAINST: AI's tendency to invent/improvise is blocked (ai_defaults_influence validation blocks unratified values)
- RIGID GUARDRAILS: R1 contracts cannot be overridden; ai_defaults_influence: dominant is blocking

---

## §3 — PROCESS 3: External Inheritance Architecture (EIA)

### §3.1 What EIA Is

EIA ensures that everything the CSPS core knows (55 principles, 52 contracts, 8 INS insights,
58 validators) reaches the right audience at the right time — without exposing the internal
governance machinery.

**The inheritance boundary:**
```
AI-session facing (CSPS internal):        Developer facing (EIA):
  behavioral-contracts.md                   apps/template/ + CSPS_DEVELOPER_GUIDE.md
  session-state.json + session protocols    libs/ integration patterns
  inner-ai-defaults/                        Schema ZModel patterns
  protocols.md §10-§17                     pnpm verify discipline (simplified)
  Opus turn transcripts                     Enterprise UX patterns
```

### §3.2 Enterprise Research Findings

**[AI-DEFAULT note: This section contains industry research — values are starting points, not ratified.**
**Governor should review; all specific tool choices require ratification before implementation.]**

**Developer Experience (DX) — enterprise standards:**

| Standard | Best practice example | CSPS current | Gap |
|---|---|---|---|
| Interactive API docs | Stripe dashboard → API explorer | None | HIGH |
| Code samples per language | Stripe, Twilio | None | MEDIUM |
| Webhook testing tool | Stripe CLI | None | MEDIUM |
| SDK generation | From OpenAPI spec | None | LOW (future) |
| Status page | GitHub status.github.com | None | LOW |
| Changelog / versioning | Linear changelog | None | LOW |

**Permission management (enterprise UX) — what users expect:**

| Feature | Best example | CSPS current | Gap |
|---|---|---|---|
| "Who can do what" table visible to admin | Google Workspace | None | HIGH |
| In-app member invitation | Linear, Notion | None (Clerk only) | HIGH |
| Role assignment UI | GitHub Organizations | None | HIGH |
| Permission change audit trail | GitHub Enterprise | AuditEvent (no UI) | MEDIUM |
| Just-in-time elevated access | AWS IAM | Not designed | LOW |

**Subscription management (enterprise UX):**

| Feature | Best example | CSPS current | Gap |
|---|---|---|---|
| Current plan visible to admin | Stripe customer portal | None | HIGH |
| Seat count + usage | GitHub, Linear | None | MEDIUM |
| Upgrade/downgrade CTA | Stripe | None | HIGH |
| Invoice history | Stripe customer portal | None | MEDIUM |
| Cancel subscription flow | Linear | None | LOW (code handles it) |

**Data portability + GDPR (enterprise requirement):**

| Feature | Standard | CSPS current | Gap |
|---|---|---|---|
| Export all data (CSV/JSON) | Notion, Linear | None | HIGH |
| GDPR erasure button | Any EU-compliant SaaS | eraseUser() exists, no UI | HIGH |
| Cookie consent | Required EU | None | MEDIUM |
| Privacy policy link | Required | None | LOW |

**Monitoring / Observability (enterprise ops):**

| Layer | Industry standard | CSPS current | Gap |
|---|---|---|---|
| Error tracking | Sentry (free tier available) | None | HIGH |
| Product analytics | PostHog (free tier, open-source) | None | MEDIUM |
| Performance monitoring | Sentry Performance | None | MEDIUM |
| Audit log analytics | Custom from AuditEvent | None | LOW |
| Uptime monitoring | Betterstack (free tier) | None | LOW |

### §3.3 EIA Architecture (4 inheritance layers)

**Layer 1: Developer Scaffold Inheritance**
```
What: Everything a new app developer MUST know is in the scaffold, not in documentation they
      might not read.
How:
  apps/template/ contains:
    - Working examples of every pattern (webhook, ZenStack, subscription, role check)
    - .env.example with pgbouncer annotation + required vars listed
    - CSPS_DEVELOPER_GUIDE.md: 5 critical patterns (isolation, auth, DB, webhooks, ZF)
    - middleware.ts with tenant isolation wired
    - pnpm verify runs and passes out of the box

Validation: validate-app-template-completeness.mjs (to build in Session D)
Protocol: READ docs/plan/pillar-1-product/app-build-guide.md (to build in Session D)
```

**Layer 2: Schema Pattern Inheritance**
```
What: When App #2 adds domain entities, the correct pattern is documented inline.
How:
  libs/policies/schema.zmodel: comments on each model explaining the pattern
  Example:
    // PATTERN: Every entity must extend Base (soft-delete) or AppendOnlyBase (immutable).
    // PATTERN: @@allow("read", auth().tenantId == tenantId) minimum on every model.
    // PATTERN: Mirror exactly in apps/{app}/prisma/schema.prisma — run validate-foundation-schema-drift.mjs
  docs/plan/pillar-1-product/schema-extension-guide.md (to build in Session D)

Validation: validate-foundation-schema-drift.mjs (ACTIVE)
Protocol: READ libs/policies/schema.zmodel comments + schema-extension-guide.md
```

**Layer 3: Permission + Tier Inheritance**
```
What: Every app inherits the correct permission + subscription model.
How:
  libs/config/subscription.config.ts: all values in config (DONE)
  libs/config/roles.config.ts: all permissions in config (DONE)
  apps/template/ imports from libs/config (to wire in Session D)
  CSPS_DEVELOPER_GUIDE.md §5: "How permissions work in CSPS apps"
  
Future (enterprise standard): RBAC → ABAC migration path documented
  Current: role-based (owner/admin/member)
  Next: resource-level permissions (can edit this specific project)
  Later: attribute-based (can edit projects in domain=business.finance)
  Protocol: see docs/plan/pillar-1-product/permissions-evolution.md (to create)
```

**Layer 4: UX + UI Pattern Inheritance**
```
What: Enterprise-quality user experiences are standardized across all CSPS apps.
How:
  UI pattern library (future): shared Tailwind components for common patterns
  Standard pages every CSPS app must have:
    /settings/account: GDPR erasure + subscription + profile
    /settings/members: invite, role assignment, remove (admin only)
    /settings/billing: current plan, seat count, upgrade CTA (admin only)
    /audit: audit log viewer (admin only)
  These pages live in apps/template/src/app/settings/ (to build in Session D)
  
Permission visibility standard:
  When a user cannot do something → show WHY (not just a disabled button)
  Error format: { error, required_role, ui_message } (to add in Session A)
```

---

## §4 — PROCESS INTEGRATION (How the 3 talk to each other)

```
EVENT: New security gap discovered in App #2 code review
  PIL catches it → validate-isolation-layers.mjs ADVISORY fires
  PIL feeds PWP → Stream 1 harvest: write as INS-S{NNN}-{N}
  PWP runs CEC → finds it should enhance: app template + developer guide + bedrock checklist
  PWP updates → app template gets the fix pattern
  EIA inherits → every future app gets the pattern automatically
  PIL validates → new validator checks the pattern is present in all apps
  CLOSED: the gap cannot recur undetected

EVENT: AI uses a training default instead of CSPS pattern
  PIL misses it (no validator for semantic content)
  PWP catches it → post-stop-learning-loop.sh fires (when promoted from stub)
  PWP records → continuous-drift-log.md entry added
  PWP promotes at K=2 → category file updated
  PIL validates → validate-inner-ai-defaults-enforcement-rate.mjs tracks improvement
  EIA inherits → if pattern is user-facing, add to developer guide

EVENT: New app is being planned
  EIA activates → validate-app-template-completeness.mjs runs
  EIA checks → all 4 inheritance layers complete before app build begins
  PIL gates → pnpm verify must pass for app template first
  PWP informs → know-how consulted for app type
```

---

## §5 — PLAN DISCIPLINE REQUIREMENT

**The Governor's directive:** "Plans must say: read this file at this stage."

From this session forward, every plan must include a `§PRE-IMPLEMENTATION PROTOCOL` section:

```markdown
## §PRE-IMPLEMENTATION PROTOCOL

Before executing any step in this plan:

**Session open:**
1. READ docs/plan/_handoff/VAULT/inner-ai-defaults/README.md
   → Load active overrides for current model version
2. READ docs/plan/pillar-0-governance/pe-situation-registry.md
   → Confirm active situation and its PE auto-rules
3. RUN node tools/validators/validate-session-harvest-readiness.mjs
   → Confirm previous session's harvest is complete before adding work
4. RUN pnpm verify → confirm exit_code=0 baseline

**Before each implementation step:**
5. READ docs/plan/_handoff/VAULT/know-how/INDEX.md
   → Check for relevant patterns before implementing
6. DECLARE ai_defaults_influence in any plan section being written

**Before declaring any step DONE:**
7. RUN pnpm verify → exit_code=0 REQUIRED
8. RUN node tools/zf-orchestrator.mjs --level 3 → ZF ACHIEVED REQUIRED
9. PASTE outputs verbatim into session notes

**Before writing closing-summary:**
10. RUN node tools/validators/validate-session-harvest-readiness.mjs → HARVEST_DONE REQUIRED
    If HARVEST_READY: create session-S{NNN}-extraction.md first
11. PASTE all three validation outputs into §10.0 of closing-summary
```

**This §PRE-IMPLEMENTATION PROTOCOL section is MANDATORY in every future plan.**
Plans without it have `ai_defaults_influence: dominant` (the discipline was skipped).

---

## §6 — ORPHANED PROCESS CLEANUP PLAN

**Current orphans to resolve (from PIL §1.4 + scan):**

| Orphan | Resolution | Session |
|---|---|---|
| `tools/stamp-domain-path.mjs` | ARCHIVE → one-time script, reference in session-S022-extraction.md | Session 0 |
| `apps/task-mgmt/seed-test.mjs` | DELETE → served its purpose (S022 seed), data now in DB | Session 0 |
| `apps/task-mgmt/test-create.mjs` | DELETE → diagnostic script for pgbouncer debugging | Session 0 |
| `apps/task-mgmt/test-zenstack-policy.mjs` | ARCHIVE → valuable as template for ZenStack tests, move to tools/ | Session 0 |
| `tools/copy-zenstack-output.mjs` | WIRE → add to session-open.sh as optional pre-check | Session A |
| 49 "planned week-4" items | CLASSIFY → see PWP §2.3 Week-4 Retirement | Session 0 |

---

## §7 — IMPLEMENTATION SEQUENCE (PE-ordered)

```
Session 0: Orphan cleanup + week-4 retirement classification (PE 9.5)
  Protocol: READ over-the-system-audit-S022.md §5 before starting
  Deliverables: orphans resolved, 49 items classified A/B/C/D, behavioral-contracts.md amended

Session A: Process hardening — 6 CLASS A items (PE 9.25)
  Protocol: READ platform-excellence-completion-S023.md §2 Session A
  Deliverables: ZF gate enforced, harvest gate enforced, PCR promoted, §KH validated, closing template

Session B: System stability + PIL validators (PE 8.35)
  Protocol: READ platform-excellence-completion-S023.md §2 Session B + platform-flow-audit-S022.md §3
  Deliverables: webhook idempotency, migration strategy, validate-prisma-version-alignment.mjs

Session C: Monitoring infrastructure + EIA validators (PE 7.9)
  Protocol: READ csps-continuous-intelligence-architecture.md §1.3 + §3.3
  Deliverables: 6 new validators, PIL Tier 3 audit-runner, validate-orphaned-processes.mjs

Session D: App template + external inheritance (PE 7.15)
  Protocol: READ csps-continuous-intelligence-architecture.md §3.2 + §3.3
  Deliverables: apps/template/, CSPS_DEVELOPER_GUIDE.md, GDPR API, solo user flow

App #2 kickoff: ONLY after Sessions 0-D complete (PE 6.8)
  Protocol: READ docs/plan/pillar-1-product/app-build-guide.md
  Prerequisite: validate-app-template-completeness.mjs passes, pnpm verify passes
```

---

## §8 — EVIDENCE GATE (this plan is COMPLETE when)

Before any implementation begins, all of §§0-7 must be validated:
```
□ pnpm verify exit_code=0 (baseline)
□ pe-situation-registry.md shows APP_BUILD_MODE ACTIVE
□ session-state.json active_situation = "APP_BUILD_MODE"
□ over-the-system-audit-S022.md §9 evidence gate satisfied
□ session-S022-extraction.md exists (HARVEST_DONE)
□ This plan has been reviewed by Opus (recommended before Session 0)
```

**ZF gate for this plan:**
```
node tools/zf-orchestrator.mjs --level 3
Must show: STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain
```

---

*CSPS Continuous Intelligence Architecture v1.0 | S022 | 2026-05-11*
*Governor directive: consolidate, mechanize, formalize. No implementation without plan.*
*ai_defaults_influence: partial (§3.2 Enterprise research, §3.3 Layer 4 UX)*
