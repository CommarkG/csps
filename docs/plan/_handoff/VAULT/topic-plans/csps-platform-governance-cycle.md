---
id: csps.handoff.vault.topic-plan.csps-platform-governance-cycle
name: csps-platform-governance-cycle
description: >
  The complete CSPS Platform Governance Cycle — from VLT creation through Opus ratification
  to implementation. Covers ZF enforcement map (all 7 points verified), positive harvesting
  pipeline, recurring scheduled analysis, documentation hub design, documentation template
  system. Governor directive S022: undeniable mechanical ZF, complete pipeline formalization,
  documentation as a first-class platform concern.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: GVRN
core_spines: [GVRN, VALD, ARCH, OPER, AI]
schema_anchor: topic_plans
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S022
execution_mode: deep_quality
intent_crystallized: true
threshold_route: platform.governance
know_how_consulted: true
enforcement_stage: active
topic_id: csps-platform-governance-cycle
priority_score: 99
priority_band: 1
depth_chosen: 5
depth_rationale: Constitutional formalization of how the platform governs itself permanently.
impl_status: swift-implemented
ai_defaults_influence: none
links:
  - { rel: cia-plan, href: ./csps-continuous-intelligence-architecture.md }
  - { rel: over-system-audit, href: ../over-the-system-audit-S022.md }
  - { rel: excellence-plan, href: ./platform-excellence-completion-S023.md }
scope_level: S1
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



# CSPS Platform Governance Cycle

> **The complete, permanent operating model for how CSPS governs itself — from the moment
> a gap is identified through implementation and back into the monitoring system.**

---

## §1 — ZF ENFORCEMENT MAP (Triple-Verified)

All 7 ZF enforcement points. Status verified 2026-05-11.

```
ENFORCEMENT POINT 1: Post-stop pnpm verify (EVERY STOP)
  File: .claude/hooks/post-stop-pnpm-verify.sh
  Status: ACTIVE + UPGRADED S022
  What it does: Runs pnpm verify (59 validators). BLOCKS if any BLOCKING validator fails.
  New in S022: Reads zf_deep_runs_this_session — BLOCKS at >15 iterations without ZF deep run.
  Advisory at >5 iterations. Satisfaction point override enforced mechanically.

ENFORCEMENT POINT 2: Session close ZF deep (CLOSE DETECTION)
  File: .claude/hooks/post-stop-session-close-gate.sh
  Status: ACTIVE + UPGRADED S022 (WAS: reminder injection | NOW: actually runs)
  What it does: Detects close signals → RUNS pnpm zf:deep → BLOCKS if blocking found.
                Also runs validate-session-harvest-readiness → BLOCKS if extraction missing.
  Key change: was "over the system" (reminder). Now "within the system" (runs + blocks).

ENFORCEMENT POINT 3: Write-time ZF level injection (PHASE BOUNDARIES)
  File: .claude/hooks/post-tool-use-zf-level-gate.sh
  Status: ACTIVE
  What it does: Detects phase completion signals in written files → injects required ZF level.
                Prevents phase advancement without ZF at the phase boundary.

ENFORCEMENT POINT 4: Pre-commit RZF gate (GIT COMMITS with DONE claims)
  File: .claude/hooks/pre-tool-use-rzf-evidence-gate.sh
  Status: STUB (exits 0) — Week-4 retirement: assign to Session A of excellence plan
  What it should do: Block git commits with DONE/RATIFIED/VALIDATED/CLOSED claims
                     without paired RZF evidence reference.
  ACTION: Promote in Session A.

ENFORCEMENT POINT 5: RZF evidence validator (EVERY VERIFY RUN)
  File: tools/validators/validate-rzf-evidence.mjs
  Status: ACTIVE (exits 1 when RZF evidence missing in closing-summaries)
  What it does: Checks latest closing-summary for §10.0 block with THIS-SESSION evidence.

ENFORCEMENT POINT 6: Session harvest readiness (EVERY VERIFY RUN)
  File: tools/validators/validate-session-harvest-readiness.mjs
  Status: BLOCKING as of S022 (was advisory, promoted)
  What it does: Exits 1 when validators_checked ≥ 40 AND extraction missing.
                Session cannot be declared DONE without extraction note.

ENFORCEMENT POINT 7: ZF orchestrator self-tracking (EVERY ZF DEEP RUN)
  File: tools/zf-orchestrator.mjs
  Status: ACTIVE + UPGRADED S022
  What it does: Writes zf_deep_runs_this_session to tracker on every level-3 run.
                session-open.sh resets this to 0 at each new session.
```

**ZF enforcement is now undeniable** — 5 of 7 points are BLOCKING. Point 4 (pre-commit) is
the only remaining stub (Session A promotion). Point 7 is tracking only.

---

## §2 — POSITIVE HARVESTING PIPELINE (Verified)

The complete cycle from session work → wisdom accumulation:

```
SESSION WORK (implementation, plans, discoveries)
           ↓
SIGNAL DETECTION (validate-session-harvest-readiness.mjs)
  Fires at: validators_checked ≥ 40 AND extraction missing
  Action: BLOCKS verify. Cannot declare DONE.
           ↓
EXTRACTION (session-S{NNN}-extraction.md)
  Required sections:
    §1 MAJOR INSIGHTS (INS-S{NNN}-001 through N)
    §2 CEC WALK (cycle until 0 new opportunities)
    §3 WHAT MUST BE BUILT (from CEC)
  Evidence required: extraction file exists + validate-session-harvest-readiness = HARVEST_DONE
           ↓
CEC WALK (iterate until zero)
  For each insight: "where does this enhance other elements?"
  Output: list of artifacts to update, new validators to build, plans to create
           ↓
INNER-AI-DEFAULTS UPDATE (when AI behavior pattern discovered)
  File: docs/plan/_handoff/VAULT/inner-ai-defaults/continuous-drift-log.md
  Trigger: new AI default observed (session-driven or user-surfaced)
  K=2 promotion: → category file (code/prose/reasoning/tooling)
           ↓
KNOW-HOW ACCUMULATION (when implementation pattern crystallized)
  File: docs/plan/_handoff/VAULT/know-how/{category}/{pattern}.md
  Trigger: new solution, error pattern, or anti-pattern discovered
  Referenced by: §KH in subsequent plans (not optional)
           ↓
PLAN CREATION (when CEC produces build items)
  Template: tools/templates/gradual-build-plan.template.md
  Required: §PRE-IMPLEMENTATION PROTOCOL + §KH + ccg_assessment (if functional)
  DNA gate: all 14 elements checked (csps-platform-dna.md Step 2)
```

**Current harvest status (S022):**
- session-S022-extraction.md: ✅ EXISTS (8 insights, 5 CEC cycles)
- validate-session-harvest-readiness.mjs: ✅ HARVEST_DONE
- inner-ai-defaults: continuous-drift-log.md ready for S022 entries
- know-how: INS-S022-001 through 008 patterns available for registration

---

## §3 — THE COMPLETE GOVERNANCE CYCLE

```
┌────────────────────────────────────────────────────────────────────────┐
│  ENTRY: Gap/Opportunity identified (via audit, Governor, user, AI)     │
└───────────────────────────┬────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │  CLASSIFICATION│
                    │   (CCG Gate)  │ ← validate-ccg-declared.mjs
                    │ Core|Dev|App  │
                    └───────┬───────┘
                            ↓
           ┌────────────────┴─────────────────┐
           ↓                                  ↓
    CORE CANDIDATE              DEVELOPER/APP LAYER
    (VLT required)              (plan + Governor approval)
    VLT registered              Plan created directly
           ↓                                  ↓
           └────────────────┬─────────────────┘
                            ↓
                    ┌───────────────┐
                    │  ANALYSIS     │
                    │  GATE (ZF)    │ ← pnpm verify (59 validators)
                    │               │ ← validate-vlt-blocking.mjs
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  RECURRING    │
                    │  SCHEDULED    │ ← Weekly deep audit (PIL Tier 3)
                    │  ANALYSIS     │ ← Identifies items left incomplete
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  ZF CYCLES    │ ← pnpm zf:deep (level 3)
                    │  ON ALL       │ ← ZF on schema changes
                    │  SURFACES     │ ← ZF on new validators
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  EXTRACTION   │ ← session-S{NNN}-extraction.md
                    │  + HARVEST    │ ← CEC walk to zero
                    │               │ ← inner-ai-defaults update
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  PLAN         │ ← gradual-build-plan template
                    │  CREATION     │ ← §PRE-IMPLEMENTATION PROTOCOL
                    │               │ ← ccg_assessment required
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  PATTERN      │ ← AI behavior insight → drift-log
                    │  IDENTIFICATION│ ← know-how entry
                    │               │ ← INS-S{NNN} extracted
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  SIZE CHECK   │ ← Is plan > depth-3?
                    │               │ ← Constitutional? (affects 30+ apps)
                    └───────┬───────┘
                 YES↓              ↓NO
        ┌──────────────┐   ┌──────────────┐
        │  OPUS REVIEW │   │ GOVERNOR     │
        │  REQUIRED    │   │ APPROVAL     │
        │              │   │ ONLY         │
        └──────┬───────┘   └──────┬───────┘
               ↓                  ↓
        OPUS RATIFICATION         │
        (6-member council         │
         for constitutional)      │
               ↓                  │
               └──────────────────┘
                            ↓
                    ┌───────────────┐
                    │  HUMAN        │ ← Governor reviews Opus output
                    │  RATIFICATION │ ← Batch Q-## decisions
                    │               │ ← Flexibility doctrine applied
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  IMPLEMENT    │ ← Opus: complex/constitutional
                    │               │ ← Sonnet: standard implementation
                    │               │ ← Plan's §PRE-IMPL PROTOCOL
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  CLOSE GATE   │ ← pnpm zf:deep BLOCKING
                    │  (mandatory)  │ ← validate-session-harvest
                    │               │ ← git push (B_ZERO_LAPTOP)
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  PIL LOOP     │ ← Back to monitoring
                    │  (continuous) │ ← New session inherits via DNA
                    └───────────────┘
```

---

## §4 — RECURRING SCHEDULED ANALYSIS (PIL Tier 3)

The "witness" that runs without being asked:

```
WEEKLY DEEP AUDIT (every Monday, first session of week):
  PRE-SESSION READING: docs/plan/pillar-0-governance/pe-situation-registry.md
  → Confirm active situation, PE auto-rules

  STEP 1: Run full audit pipeline (when audit-runner:run is built, Session B)
  STEP 2: Run validate-pe-connectivity.mjs → update PE scores on stale plans
  STEP 3: Run validate-orphaned-processes.mjs → identify new orphans
  STEP 4: Check inner-ai-defaults enforcement rate → flag if < 40%
  STEP 5: Check complexity score → flag if approaching 25 (yellow zone)
  STEP 6: Scan continuous-drift-log.md → promote K=2 entries to category files
  STEP 7: Identify items left "in-progress" or "partial" from prior sessions
           → For each: classify as DONE (close) | DEFERRED (document why) | BLOCKED (new VLT)

  OUTPUT: Weekly audit report → filed as docs/plan/_handoff/VAULT/weekly-audit-S{NNN}.md
          (template: tools/templates/weekly-audit.template.md — TO BUILD Session C)

SWAP MECHANISM (items identified as incomplete from prior sessions):
  When weekly audit finds "items left without completion":
    1. Classify: DONE (just not marked) | NEEDS MORE WORK | BLOCKED | DEFERRED
    2. For NEEDS MORE WORK: add to Session backlog with context
    3. For BLOCKED: register VLT
    4. For DEFERRED: document WHY + when-trigger
  This prevents the accumulation of "open items" across sessions
```

---

## §5 — DOCUMENTATION HUB

**The Documentation Hub** is a queryable index of all CSPS documentation.

### §5.1 Hub Design

```
CSPS DOCUMENTATION HUB
Location: docs/INDEX.md (the entry point for ALL documentation)

Structure:
  TIER 1 — Platform Foundation (always read)
    csps-platform-dna.md          — 14 DNA elements
    csps-bedrock.md                — 22 bedrock items
    pe-situation-registry.md       — active situation
    behavioral-contracts.md        — 52 contracts

  TIER 2 — Process Protocols (read for specific activities)
    plan-creation-protocol.md      — how to create plans
    protocols.md                   — session protocols §10-§17
    csps-platform-governance-cycle.md — THIS FILE

  TIER 3 — Domain Reference (read for specific domains)
    domain-taxonomy.md             — 3-tier domain taxonomy
    frontmatter-closed-enums.md    — all closed enums
    core-primitives-registry.md    — platform primitives

  TIER 4 — Plans + Extractions (read for context)
    topic-plans/                   — all active plans
    session-S{NNN}-extraction.md   — session wisdom
    over-the-system-audit-S022.md  — gap classification

  TIER 5 — Know-How (read before implementing)
    know-how/INDEX.md              — error patterns, solutions
    inner-ai-defaults/             — AI behavior registry

EXTRACTION API (how to get specific documentation):
  Full: docs/INDEX.md → everything
  By spine: docs/plan/pillar-0-governance/ (GVRN) etc.
  By topic: use tags in frontmatter + validate-frontmatter.mjs
  By session: session-S{NNN}-extraction.md → that session's wisdom
  By domain: docs/plan/pillar-{N}-{domain}/ → domain content
```

### §5.2 Documentation Hub Implementation (Session C)

```
STEP HUB-1: Create docs/INDEX.md (the hub file)
  Content: tiered table of contents with all CSPS documentation
  Links: to every canonical file in docs/plan/pillar-0-governance/
  Format: Tier 1-5 structure above

STEP HUB-2: Create tools/templates/docs/documentation-hub.template.md
  Template for creating hub files for specific sub-domains
  Used when: a new pillar or domain needs its own documentation index

STEP HUB-3: validate-documentation-hub.mjs (new validator)
  Checks: docs/INDEX.md exists + all Tier 1 files linked + all plans in Tier 4
  Advisory: if linked files don't exist or are deprecated
```

---

## §6 — DOCUMENTATION TEMPLATE SYSTEM

**The Governor's request:** Every documentation file follows a template. Mini-tree format when multiple templates needed.

### §6.1 Template Taxonomy (Mini-Tree)

```
DOCUMENTATION TEMPLATES
  tools/templates/docs/
    ├── governance/
    │   ├── behavioral-contract.template.md      (B_* contract)
    │   ├── principle.template.md                (P-* principle)
    │   ├── audit-runner-entry.template.md       (audit slug)
    │   └── vlt.template.md                      (Value-Level Threshold)
    ├── plans/
    │   ├── gradual-build-plan.template.md       (EXISTS — multi-session)
    │   ├── single-session-task.template.md      (single session)
    │   ├── element-review.template.md           (element review)
    │   └── weekly-audit.template.md             (weekly scheduled)
    ├── session/
    │   ├── session-extraction.template.md       (CEC harvest)
    │   ├── closing-summary.template.md          (EXISTS — §10-§17)
    │   └── handoff.template.md                  (session handoff)
    ├── architecture/
    │   ├── adr.template.md                      (Architecture Decision Record)
    │   ├── core-primitive.template.md           (L1 interface design)
    │   └── domain-slice.template.md             (domain schema slice)
    └── platform/
        ├── app-manifest.template.md             (app declaration)
        └── graduation-checklist.template.md     ($1K MRR milestone)
```

### §6.2 Documentation Checklist (What Every File Must Have)

```yaml
# MANDATORY FRONTMATTER (all governed docs):
id: csps.<area>.<slug>              # dotted-lowercase
name: <slug>                         # matches filename
description: >                       # one paragraph
version: "1.0"                       # semver
owner: group:finky                   # current owner
lifecycle: production|beta|experimental|deprecated
lifecycle_state: active|pending-review|...
core_spine: <primary-spine>          # GVRN|ARCH|AI|OPER|VALD
schema_anchor: <anchor>              # from schema
domain_path: platform|business|...  # from closed enum
tags:                                # at minimum: domain + type + audience + maturity
  - domain:<value>
  - type:<value>
  - audience:<value>
  - maturity:<value>
session: S<NNN>                      # when created
impl_status: <value>                 # for implementation artifacts
ai_defaults_influence: none|partial|dominant

# MANDATORY BODY SECTIONS (by artifact type):
# All plans: §PRE-IMPLEMENTATION PROTOCOL + §KH + ccg_assessment
# Session extractions: §1 Insights + §2 CEC Walk + §3 What Must Be Built
# Closing summaries: §10.0 through §17 per protocols.md
# Behavioral contracts: definition + CSPS use + mechanic + 5/5 surfaces
# ADRs: context + decision + status + consequences
```

### §6.3 validate-documentation-template.mjs (new)

```
Checks every governed .md file for:
1. All MANDATORY FRONTMATTER fields present
2. Correct closed enum values (delegates to validate-frontmatter.mjs)
3. Correct body sections for the artifact's type (detected from tags.type)
4. §PRE-IMPLEMENTATION PROTOCOL present in all plans (lifecycle_state: active + type: how-to)

Severity: ADVISORY for existing files (grandfather), BLOCKING for new files
```

---

## §7 — IMPLEMENTATION ORDER (PE-Scored, Complete)

**Session 0 (PE 9.5 — FIRST):**
- `pre-tool-use-rzf-evidence-gate.sh`: promote from STUB to BLOCKING
- Delete remaining diagnostic scripts (stamp-domain-path.mjs archive)
- Week-4 retirement: classify all 49 items A/B/C/D in behavioral-contracts.md
- PRE-SESSION: READ over-the-system-audit-S022.md §5 before starting
- CLOSE: ZF deep + extraction note + git push

**Session A (PE 9.25):**
- 6 CLASS A items (ZF gate, harvest gate, §KH, PCR, AI-defaults, closing template)
- docs/INDEX.md (documentation hub file)
- §PRE-IMPLEMENTATION PROTOCOL added to gradual-build-plan.template.md
- PRE-SESSION: READ csps-platform-governance-cycle.md §1 (ZF map) + §3 (cycle)
- CLOSE: ZF deep + extraction + git push

**Session B (PE 8.35):**
- Webhook idempotency (SYS-1)
- Prisma migrate baseline (SYS-2)
- validate-prisma-version-alignment.mjs
- validate-db-url-pgbouncer.mjs
- PRE-SESSION: READ platform-excellence-completion-S023.md §2 Session B
- CLOSE: ZF deep + extraction + git push

**Session C (PE 7.9):**
- 6 new validators (isolation layers, orphans, solo user, situation, GDPR path, subscription errors)
- PIL Tier 3 weekly audit infrastructure (weekly-audit.template.md)
- Documentation hub validators (validate-documentation-hub.mjs)
- Documentation template system (tools/templates/docs/ structure)
- validate-documentation-template.mjs
- PRE-SESSION: READ csps-platform-governance-cycle.md §4 + §5 + §6
- CLOSE: ZF deep + extraction + git push

**Session D (PE 7.15):**
- App template scaffold (apps/template/)
- CSPS_DEVELOPER_GUIDE.md (5 critical patterns)
- GDPR erasure API + settings page
- Solo user flow (auto-create personal org)
- PRE-SESSION: READ csps-continuous-intelligence-architecture.md §3.3 + app-build-guide.md
- CLOSE: ZF deep + extraction + git push

**Core Primitives Phase 0 (PE 9.08 after sessions 0-D):**
- DNA Element 14 formally added to csps-platform-dna.md §1
- CCG assessment added to plan-creation-protocol.md Step 2
- core-primitives-registry.md created with CP-001 and CP-002 entries
- ADR template (tools/templates/docs/architecture/adr.template.md) created
- VLT-CCG-CALENDAR registered
- PRE-SESSION: READ csps-core-primitives-architecture.md §12 (Opus 5 conditions)
- CLOSE: ZF deep + extraction + git push

**App #2 (PE 6.8 — only after Sessions 0-D + Core Primitives Phase 0):**
- Governor chooses domain (Business vs Personal)
- Fork apps/template/
- Build on CSPS core with CalendarEngine + NotificationService (if Phase 0 complete)
- PRE-SESSION: READ docs/plan/pillar-1-product/app-build-guide.md
- CLOSE: ZF deep + extraction + git push

---

## §8 — EVIDENCE GATE

This plan is COMPLETE when:
```
□ ZF triple-check: all 7 enforcement points verified (§1 done)
□ Harvest pipeline: validate-session-harvest-readiness → BLOCKING (done)
□ Documentation hub: docs/INDEX.md exists (Session A)
□ Template system: tools/templates/docs/ structure complete (Session C)
□ validate-documentation-template.mjs: active in pnpm verify (Session C)
□ validate-documentation-hub.mjs: active in pnpm verify (Session C)
□ pnpm zf:deep: ZF ACHIEVED + 0 blocking before every session close
□ session extraction: created for every session
```

---

*CSPS Platform Governance Cycle v1.0 | S022 | 2026-05-11*
*ZF enforcement: 5 of 7 points BLOCKING. Harvest: BLOCKING. Documentation: to build.*
*ai_defaults_influence: none — all derived from code audit + Governor directives + Opus review*
