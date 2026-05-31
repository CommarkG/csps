---
id: csps.governance.accountability-hub-plan-s072
name: ACCOUNTABILITY-HUB-PLAN-S072
description: >
  Detailed plan + core seed for the CSPS Accountability Hub — the consolidation that
  guarantees intent reaches the finish line. NOT a new parallel spine: it consolidates the
  existing GVRN accountability domain (L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY) + the
  scattered accountability limbs (threshold, CIP, ANTI-FLOAT, RZF, OPIA, handoff-attestation,
  gap/improvement registers) into one hub. Platform-attitude: a general always-on default
  accountability spine + a variety of actor-class branches (inner-platform / developer /
  external-user). Saved as the prerequisite to PROTO-S072-ACCOUNTABILITY-HUB (Governor: plan
  before proto).
type: governance
diataxis_type: explanation
protection_level: protected
status: draft
lifecycle_state: pending-review
quality_state: draft
impl_status: swift-implemented
next_review_at: "2026-06-30"
core_spine: GVRN
core_spines: [GVRN, VALD, OPER, AI]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S072
owner: group:finky
authored_by: OPUS-15
lifecycle: production
governing_principle: P-META-006
context_question: "Before this plan is built: has every intent class a tracked path from threshold-intake to a terminal state, with a named accountable party at every handoff?"
inherits_from: "L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY.md + threshold-router.mjs + PROTO-S072-ANTI-FLOAT + PLATFORM-OBSERVATION-DOCTRINE.md + RZF-LATEST.md + audit-hub.md + feedback_platform_attitude_default_plus_variety"
closure_owner: Governor (Yariv) — ratifies; OPUS-15 drives to PROTO
closure_decision: "Governor ratifies plan → OPUS-15 issues PROTO-S072-ACCOUNTABILITY-HUB; OR rejects/MODIFIES with named changes"
closure_by: "S073 open (trigger: next session start) — escalate if still draft"
links:
  - { rel: existing-domain, href: ../../../.claude/core-spines/L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY.md }
  - { rel: anti-float, href: ../../../tools/council/opus-turn.md }
  - { rel: platform-observation, href: ./PLATFORM-OBSERVATION-DOCTRINE.md }
  - { rel: audit-hub, href: ./audit-hub.md }
  - { rel: threshold, href: ../../../tools/scripts/threshold-router.mjs }
---

# Accountability Hub — Plan + Core Seed (S072)

> **Status: DRAFT — pending Governor ratification.** This is the saved plan + core seed required BEFORE PROTO-S072-ACCOUNTABILITY-HUB (per Governor S072: "saved detailed plan and core seed in place" before proto). It carries its own closure obligation (frontmatter) — it cannot float.

## CORE SEED
**Accountability = a tracked path from threshold-intake to a terminal state, with a NAMED accountable party at every handoff, for every class of intent.** The platform already has the limbs (threshold routes, CIP stages changes, ANTI-FLOAT closes artifacts, RZF proves done, OPIA accepts, handoff-attestation passes the baton, gap/improvement registers track debt) — but no HUB that (a) guarantees each limb hands off to the next, and (b) names WHO is accountable at each transition. The hub is the consolidation, under the existing GVRN accountability domain — **not a new spine, not parallel machinery.** Lived instance it would have caught: UX-PATTERNS-RESEARCH draft floating since S059 (no accountable owner, no closure trigger) — and my own S072 hooks/PROTOs created without routing through threshold/CIP (parallel creation).

## WHY THIS IS NOT A NEW SPINE (the anti-parallel-creation discipline)
`L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY.md` already exists under the GVRN spine. The hub is its **operational consolidation layer** — it gathers the scattered accountability artifacts under one navigable home and wires the handoffs. Adding a 6th core spine would itself be the parallel-creation error. Accountability stays GVRN (decision rights + traceability); the hub is a GVRN leaf that references VALD (coverage), OPER (workflow), AI (inner-defaults) as it touches them.

## PLATFORM-ATTITUDE STRUCTURE (default + variety — per ratified S072 attitude)
**GENERAL / DEFAULT (always-on, every actor, every intent):** the universal accountability spine —
1. **Named owner** at creation (no orphan intent — RACI "Accountable" = exactly one).
2. **Threshold-routed** — every intent enters via `threshold-router.mjs`, gets an `input_class` + pipeline.
3. **Terminal-state required** — RATIFIED+IMPLEMENTED | REJECTED | VAULTED-with-trigger | SUPERSEDED (CIP/ANTI-FLOAT taxonomy).
4. **Handoff-attestation** — every boundary crossing (Opus↔Sonnet, session→session, AI→human) emits WHO-hands-to-WHO + receipt (B_ZCA + council-address + §17 attestation).
5. **Aging + escalation** — anything past its closure_by escalates to a decision queue (ANTI-FLOAT pipeline).
6. **Evidence at closure** — RZF: terminal claims cite this-session verify (no nominal done).

**VARIETY (actor-class branches — selectable specifics on top of the default):**
- **B1 — Inner-platform (Sonnet↔Opus, both directions):** PROTO→build→OPIA→ADVANCE/COURSE-CORRECT loop; receipt-before-PROTO; council-address; sonnet-turn/opus-turn channel integrity; OPIA acceptance is the accountability gate (Sonnet cannot self-accept; Opus cannot skip review). Metric: directives issued → terminal verdicts (no PROTO without an OPIA close).
- **B2 — Developer accountability (building the platform core):** plan-item ownership (unified-plan.yaml), DoD per milestone, RZF evidence, register-before-wire, FWWS (no half-built milestone), engraving completeness (5-surface). Metric: committed work → verified+wired+closed.
- **B3 — External-user accountability (the apps' end users):** consent/entitlement scope, audit-event trail (who did what — "activity history" per tier), data-scope boundaries, reversible actions + confirmation, SLA on support/response. Metric: user action → traceable + reversible + tier-appropriate. (Substrate: comms-schema 6-tier + product-schema PART 3 — flag: B3 build needs PART 3.)

## RESEARCH — validated accountability frameworks (mapped to CSPS, not invented)
- **RACI / DACI** (responsibility assignment) → CSPS: exactly-one Accountable per intent (the `closure_owner`); Consulted = cross-review personas; Informed = handoff-attestation receivers. DACI's "Driver" = OPUS for PROTOs.
- **Definition of Done (Agile/Scrum)** → CSPS already has it as RZF + OPIA DONE-WHEN; the hub makes DoD mandatory per intent class.
- **SLA / SLO + ticket-aging + escalation ladders (ITIL/SRE)** → CSPS: `closure_by` deadline + ANTI-FLOAT aging/escalation + the decision queue. Aging WIP is the #1 validated signal of accountability failure.
- **RAID log (Risks/Assumptions/Issues/Dependencies)** → CSPS: gap-recurrence-register + improvement-register + vault-pending consolidated as the hub's issue ledger.
- **Kanban WIP limits + cycle-time / aging** → CSPS: cap open non-terminal artifacts; aging report at session-open.
- **OKR/KPI closure metrics** → CSPS: the hub's dashboard metric per branch (intent→terminal conversion rate; floater count; mean-time-to-terminal).
- **Two-way-door vs one-way-door (Bezos) + reversibility** → CSPS: criticality at threshold ingress + B3 reversible-by-default.

## DNA-INHERITANCE ENFORCEMENT (the "always inherited" guarantee — Governor S072)
Every created artifact — especially external-user/app artifacts — must inherit CSPS DNA (principles like new-over-active, the contracts, the prevention classes). A BRANCH of the hub, built on EXISTING machinery (strengthen, never fork):
**EXISTS:** `tools/config/dna-registry.yaml` (source) · `validate-new-file-dna.mjs` (BLOCKING libs/>50L) · `validate-page-dna` · `validate-dna-evidence` · `validate-skill-dna-alignment` · `post-stop-dna-sync-check.sh` · `dna-protocol-making-sure-that.md`.
**GAPS (what lets DNA escape):** (1) apps/ + external-user artifacts = ADVISORY not BLOCKING — can ship DNA-less; (2) no pre-creation gate (checked at verify, not at write); (3) no principle-COVERAGE check (detects ANY signal, not that a SPECIFIC principle is inherited); (4) no recurring DNA-coverage audit.
**MULTI-DIRECTION FIX (the enforcement arsenal applied):**
1. **Registry** — add new-over-active + S072 principles to `dna-registry.yaml` as inherited entries (the canonical set every artifact carries).
2. **Pre-creation gate (T1)** — `pre-tool-use-dna-required.sh` BLOCKS Write of a governed artifact (libs/ + apps/ + pages) lacking a DNA signal.
3. **Verify (T2)** — extend `validate-new-file-dna.mjs` to BLOCK apps/ + external-user pages (not advisory) + add a principle-COVERAGE check (the named set is present, not just "a" signal).
4. **Templates (creation-time)** — `apps/templates` + the page generator carry DNA at birth (Core-Maximal: apps BUNDLE DNA, inherit not author). External-user artifacts inherit here.
5. **Recurring audit** — `cron-weekly-dna-coverage` + an audit-runner pipeline scans ALL artifacts vs the registry; routes gaps to the decision queue (ANTI-FLOAT).
6. **Post-stop** — promote `post-stop-dna-sync-check.sh` from advisory reminder to a coverage gate.
7. **Session-open (T3)** — inject current DNA-coverage debt at tab start.
**External-user specifically:** apps inherit DNA via Component-B/templates (apps-are-trials + Core-Maximal) — no external-user artifact ships without the DNA set. This is the B3 branch's integrity layer.

## INTEGRATION — how it consolidates the limbs (NO parallel; the consolidation map)
| Existing limb | Role in the hub | Hub adds |
|---|---|---|
| threshold-router.mjs | INTAKE (classify + route every intent) | a `native_issue` route is confirmed (see Q-answer below) |
| CIP / change-impact-staging | terminal-state engine for *changes* | hub generalizes terminal-state to *all* intent |
| PROTO-S072-ANTI-FLOAT | closes floating *artifacts* | hub is the parent; ANTI-FLOAT is its artifact-limb |
| RZF-LATEST | evidence at closure | hub mandates RZF as the DONE gate per class |
| OPIA | inner-platform acceptance gate | hub names it the B1 accountability gate |
| handoff §17 attestation | boundary receipts | hub names it the universal handoff requirement |
| gap-recurrence / improvement registers | issue/debt ledger | hub consolidates into one RAID-style ledger |
| audit-hub.md | recurring audits | hub routes audit findings → terminal (closes PSP-audits-never-close) |

## ANSWERS TO GOVERNOR'S TWO QUESTIONS (baked into the design)
**Q: How does a native issue go through the threshold?** A native issue (a gap I notice, a floating draft, a new element I want to build) is an INPUT like any other. It must be submitted to `threshold-router.mjs` with `type` (observation_finding / proposal / maintenance / ai_behavior) → it gets an `input_class` + a pipeline route → staged (CIP or vault) → owner + closure_by assigned → driven to terminal. The hub's rule: **no native issue is acted on directly; it is routed first.** This stops me from building parallel one-offs (my S072 hooks should have entered this way).
**Q: How do created elements mechanically evolve?** Each created element gets a lifecycle (`stage: draft→validated→activated→certified`) + a closure obligation + a registration in its schemas (AP-003) + an enforcement_tier if it's a rule. "Evolve" = advance through the lifecycle via gates, tracked by the hub. An element that can't name its next gate is a floater.

## MILESTONES (for the FUTURE PROTO — do NOT build until Governor ratifies this plan)
- **M1** — Accountability Hub doc (consolidation home) under GVRN: the default spine + 3 branches + the consolidation map; cross-ref every limb; register in audit-runner.
- **M2** — `native_issue` intake path made explicit + a thin `account-intake.mjs` wrapper so ANY intent (incl. Opus/Sonnet creations) routes through threshold before build (closes parallel-creation).
- **M3** — Accountability ledger: consolidate gap/improvement/floater registers into one RAID-style `accountability-ledger.yaml` + aging/escalation + session-open injection + `/platform/accountability` dashboard (metric per branch).
- **M4** — Engrave principle (candidate, Governor-assigned id) + B_ACCOUNTABILITY with enforcement_tier; the 3 branches each get their gate.

## OPEN (for Governor — minimal)
- Principle id for the accountability law (stub; ratify by exception).
- B3 (external-user) is PART 3-dependent — confirm B3 is design-only until PART 3 ships.

## SELF-DOGFOOD NOTE
This plan is itself routed: logged as a threshold intake (type=proposal_consolidation) + carries closure_owner/closure_decision/closure_by in frontmatter (cannot float). If I had done this for the S072 hooks, they'd have entered the same way. That is the behavior change you demanded.

*Status: DRAFT — pending Governor ratification. closure_by: S073 open. — OPUS-15, S072, 2026-05-31*

---

# ADDENDUM S073 — Core-Spine Engine: mandatory template, real-time-save, threshold wiring, batches, core seeds

## MANDATORY CORE-SPINE TEMPLATE (8 sections — every core spine carries ALL; validator-enforced)
1. TRUNK (undebatable universals) · 2. BRANCHES (recursive sub-cores) · 3. ALIGNMENT MAP (schema anchor + architecture-map node + classification dimension + root) · 4. WIRING MAP (the validators/hooks/pages/registries that REALIZE it — each must resolve to a real file: EXISTS≠ACTIVE) · 5. TIER & PERMISSION (default + variety; never one-size) · 6. CIE + PE INVOLVEMENT · 7. ESCALATION (the breach/overdue ladder) · 8. **REAL-TIME-SAVE / RESUMABLE PROCESS** (Governor S073 — every process auto-persists each step; re-entry resumes exactly; a paused process = a non-terminal artifact with a resume-trigger = ANTI-FLOAT integration).

## REAL-TIME-SAVE (universal process requirement — not accountability-only)
Every CSPS process (spine creation, onboarding, journey, any wizard) continuously persists state (debounced) to a resumable store keyed by {user, process, session}. Battery dies / user leaves mid-process → on return, resume at the exact step. Shared `libs/process-state` so apps inherit it (Core-Maximal). Synergy: a paused process IS a floating artifact with a resume closure-trigger → governed by ANTI-FLOAT. Closes UX-doctrine FL5 (no save/resume).

## THRESHOLD CONNECTION (the front door for the engine — no parallel intake)
Every engine action routes through `threshold-router.mjs`: creating a spine (input_class=creation/proposal) · an accountability obligation (→ closure pipeline) · a process resume (re-entry) · a breach (→ escalation). Threshold classifies {spine, pipeline, criticality, audience_tier} → routes. The core-spine-creator must call routeInput, not act directly. This is how "it all connects to the threshold."

## PERSONA-HARDENING PASS (iterated — findings folded in)
- cruel-critic: WIRING MAP risks becoming aspirational → validator must verify each entry resolves to a real file (EXISTS≠ACTIVE). FOLDED into section 4.
- bottleneck-expert: routing every intent + per-keystroke save = throughput/storage risk → debounce auto-save; threshold fast-path for trivial; criticality at ingress. FOLDED.
- consolidation-expert: core-spine-registry must NOT fork schema-registry / SPINE-PILLAR-MAP → reuse/extend them. FOLDED into BATCH 0.
- synergy-master: real-time-save = universal trait, lives in the template (every process), synergizes with ANTI-FLOAT (paused=non-terminal+resume-trigger). FOLDED into section 8.
- balance-expert: 8 mandatory sections risks nobody creating spines → the ENGINE auto-generates the scaffolding (5 of 8); the human supplies only intent. FOLDED.
- naive-persona: "battery died, lost my spine" + "what's a wiring map?" → real-time-save fixes the first; plain-language prompts fix the second. FOLDED.

## CORE SEEDS (Opus-authored — the intent anchors Sonnet builds from)
- SEED-ENGINE: "A core spine is CREATED, not authored — the engine reads the registry, routes intent through threshold, auto-scaffolds the 8 mandatory sections, and persists every step (resumable). Human supplies intent; platform supplies structure + reuse."
- SEED-ACCT-TRUNK: the 7 invariants (single-owner · path-to-terminal · evidence-at-closure · trigger+aging · handoff-receipt · conversion-not-activity · ESCALATION).
- SEED-SAVE: "No process loses state. Every step auto-persists; re-entry resumes exactly. A paused process is a non-terminal artifact with a resume trigger (ANTI-FLOAT)."

## OPTIMAL BATCHES (sequenced — each its own milestone with closure obligation)
- BATCH 0 — FOUNDATION [VALD/ARCH]: designate/extend SPINE-PILLAR-MAP as the Platform Architecture Map + `tools/config/core-spine-registry.yaml` (8-section schema) + mandatory-template validator (8 sections present + wiring-map entries resolve + alignment resolves). BLOCKING after baseline.
- BATCH 1 — ENGINE WIRING [ARCH/OPER]: wire core-spine-creator to READ the registry (kill hardcoded arrays) + route through threshold (routeInput) + CIE/PE hooks.
- BATCH 2 — REAL-TIME-SAVE [ARCH/OPER]: `libs/process-state` resumable store + apply to the creator + make it template section 8 + ANTI-FLOAT integration (paused=non-terminal+resume-trigger).
- BATCH 3 — ACCOUNTABILITY AS FIRST SPINE [GVRN]: author accountability THROUGH the wired engine — trunk(7) + branches(B1-B3) + tier/permission + escalation ladder + CIE/PE + wiring map + /platform/accountability dashboard.
- BATCH 4 — ANTI-FLOAT RELEASED [VALD]: build ANTI-FLOAT as accountability's artifact-closure limb (generated from the L2, not pre-forked).

*Addendum closure_by: S073 — Governor ratifies batches + template → OPUS issues BATCH 0 PROTO. — OPUS-15, S073, 2026-05-31*
