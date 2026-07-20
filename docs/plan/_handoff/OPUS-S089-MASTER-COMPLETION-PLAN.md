---
id: csps.handoff.opus-s089-master-completion-plan
name: OPUS-S089-MASTER-COMPLETION-PLAN
description: >
  The consolidated S089 completion plan — every pending/uncompleted issue, grouped and prioritized,
  governed by the ratified PLAN-PIPELINE-SPINE and the North Star. This is the NAVIGATOR that was
  missing (the freestyling fix): the single ratified plan all consequential work traces to.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: ratified
ns_quality: I2I
precedent_checked: true
session: S089
links:
  - { rel: north-star, href: ../pillar-0-governance/CSPS-NORTH-STAR.md }
  - { rel: spine, href: ../../../tools/data/park-register.yaml }
  - { rel: process, href: ./OPUS-S089-CANONICAL-BUILD-PROCESS.md }
  - { rel: pipeline-design, href: ../../../tools/data/park-register.yaml }
---

# S089 Master Completion Plan — the Navigator

> **North Star (sacred, Version D — ratified S089):** *"CSPS exists to turn intention into reality — not
> approximately, but precisely: to create the most intuitive, stable, scalable, and effective digital
> solutions — systems, apps, and SaaS — for both the developers who build them and the people who use
> them, by having human and AI think together…"* Every item below declares which goal it serves; **no
> answer = no mandate** (the context question). This plan is the single ratified reference the
> PLAN-PIPELINE-SPINE gate checks against.

**Why this exists:** S089 drifted into input-driven freestyling — work executed without a ratified plan
governing it, the mandate untracked. This plan + the ratified PLAN-PIPELINE-SPINE is the structural fix:
one navigator, goal-attached, gate-enforced. Full open-item source = park-register.yaml (open items).
This plan surfaces the ACTIVE + high-priority + this-session threads and orders them.

**RATIFIED THIS ARC (S089 close):** North Star **Version D** (outward-outcome + human-AI synthesis,
CISEM convergence — 359d5505, sacred-edit) · **PLAN-PIPELINE-SPINE** concept (goal-mandatory gate,
scope-tiered) — ratified, awaiting Sonnet build · consequence-escalation axis + North-Star 7th-quality
(Outcome-Serving) — **parked** (blast-fold-into-pipeline; deliberate future ns_quality review). The one
human gate still open: the **goal-screen test-drive** (Governor's felt verdict → releases Stage 2).

---

## BUCKET 0 — THE SPINE (ratified this turn; governs everything below)
**PARK-S089-PLAN-PIPELINE-SPINE [TOP]** — the meta-mechanism. Approved by Governor S089.
- **park-sits-on-schema:** the park references existing primitives (goal_id from goal-record-schema ·
  ns_quality from North Star · core_spine from core-spine-registry · lifecycle_state). Only NEW field =
  `pipeline_state` (intake→triaged→planned→simulated→ratified→authorized→implementing→done). No duplication.
- **goal-always-involved:** every consequential item declares its goal_id (tracing up to the North Star)
  + ns_quality. No goal trace = no mandate = gate blocks. This is the enhancement of the ALREADY-EXISTING
  ns_quality field + context_question, made mechanical — NOT a session-state tracker (that band-aid is dropped).
- **the gate:** flip `validate-no-implementation-without-plan.mjs` ADVISORY→BLOCKING; a consequential
  build commits only if it cites a park-item in ratified/authorized state. **Scope-tiered:** trivial-
  reversible (typo/comment/doc) EXEMPT/swift; consequential (new validator/hook/feature/schema) gated.
- **adjustable dashboard:** `/platform/pipeline` — see parked/planned/ratified/authorized + each item's
  goal-trace to the North Star + tune the gate strictness and the trivial-vs-consequential line (no code).
- DONE = pipeline_state on park schema + gate BLOCKING (scope-tiered) w/ FAIL→PASS proof + dashboard renders + verify green.
- BUILD ORDER: (1) park schema pipeline_state + goal_id/ns_quality required; (2) flip the gate BLOCKING + tiers;
  (3) wire plan/simulate/ratify transitions to existing validators; (4) /platform/pipeline dashboard.

---

## BUCKET 1 — THE PRODUCT (canonical build — the ratified sequence)
**PARK-S089-CANONICAL-BUILD-PROCESS [TOP]** — the 9-stage goal-first spine.
- **NOW (Governor gate):** goal-screen **test-drive** (https://csps-playground.vercel.app) — B1-B4 done,
  field-wiring enforcing, Playwright see-it PROVEN. Awaiting Governor felt verdict → releases Stage 2.
- Then: Stage 2 PRESENT-WHAT-EXISTS → T3 pipeline format · T7 UX checklist · T8 UI checklist · T9-proper (DONE) ·
  T10 pipeline-hardwire. SAGD test-drive (e7 lovability) still open.

---

## BUCKET 2 — GOVERNANCE HARDENING (from the CDS/CSP exchange — deeper builds)
**PARK-S089-CDS-EXCHANGE-DEEPER-BUILDS [HIGH]:** B-A VERIFY-GATE blocking validator (numeric claims
re-derived from ground truth — the biggest lever) · B-B mechanism-status tag {SHIPPED|SPEC|CONCEPT} ·
B-C field-wiring SITE-RESOLUTION (close the stale-reader gap) · B-D coverage-manifest loop · B-E
inherits_dna build-admission gate · B-F typed dispatch contract + B0 · B-G verify-gate risk tiers · B-H
convergence evidence field. Trigger: after goal-screen ships; B-A + B-C soonest.

---

## BUCKET 3 — COLLABORATION (CDS / CSE / CSP)
- **PARK-S089-CDS-CSE-DIRECTION [parked]:** the Gen-2 platform arc + 57 absorbed docs + reply-to-CDS.
- **PARK-S089-CDS-TEMPLATE-HUB-EXTRACTIONS [MED]:** E1-E8 (RTM separation, additive-only B_*, ratification
  phase machine, B_* satisfiability, drift detection, rollback semantics, 80% measurement, L1 self-amendment).
- **PARK-S089-CSP-SHARE-PRODUCT-PATTERNS [MED]:** preserved-state gate, arch model-routing registry,
  measurement discipline, label-map guard, flow-completeness/lying-UI, severity hierarchy, **+ answer CSP's 5 questions**.
- **PARK-S089-SHELL-SYNERGY-SHARE [MED]:** share the Customer Journey Shell to CSP + bi-directional sync.
- Sharing ledger (CSP-CSPS-SHARING-LEDGER.md) tracks inbound/outbound; the CDS review deliverable is SENT.

---

## BUCKET 4 — OPERATING MODEL + INFRA
- **Operating-model shift** (OPUS-S089-OPERATING-MODEL-AND-MODEL-ECONOMY-SEED, review-hardened):
  Part A GO-WITH-CHANGES (spawn-trigger must be a GATE; build `opus-agent-spawn-template` FIRST) ·
  Part B model-economy hardwire (schema-first + governance-locked fields) · Part C local-LLM NO-GO/PARK ·
  Part D dashboard Phase-1 only.
- **Live-deploy** (OPUS-S089-LIVE-DEPLOY-HARDWIRE): `deploy-live-page` skill (blessed path) + `/platform/deploy`
  admin upload→deploy interface (isolated Vercel project, server-side token, admin-gate). §28 one-click.
- **PARK-S089-AGENTS-RULES-CONSOLIDATION [parked]:** extract path-specific rules from AGENTS.md into
  `.claude/rules/` (paths: frontmatter) → shrink AGENTS.md under the 200-line budget. Consolidation, not fork.

---

## BUCKET 5 — RECURRENCE-STOPPERS + META (prevention)
- **PARK-S089-PREVENTION-PERSIST-PE-AUTOPLAN-LOOP [TOP]** · **SSOT-CONSOLIDATION [PRIORITY]** ·
  **STARTUP-AUTO-PROCEED [PRIORITY]** · **HARVEST-TRIGGER-HARDWIRE [PRIORITY]** (harvest before auto-compact) ·
  **THRESHOLD-INLINE-GATE [P1]** · **AUTO-COUNCIL-CYCLE [P1]** (Sonnet↔Opus via Agent, no manual relay) ·
  **PRE-BUILD-IZFC [P1]** · **COMPLETION-DISCIPLINE-METRICS [HIGH]** · **TEST-DRIVE-BUILD-AUDIT-LOOP [HIGH]** ·
  **LEARNING-LOOP-ACCUMULATION-GATE [HIGH]** (no K=1 engraving).
- **Operational friction to fix (new, from this session):** (a) add `validate-park-register` to the
  pre-commit hook — I broke park YAML twice (duplicate `rejected:` keys) and committed it; a pre-commit
  gate makes it structurally impossible. (b) green-receipt circular-deadlock keeps forcing a manual
  bootstrap after every commit — worth a `--refresh-receipt` path so the receipt refreshes on a receipt-only
  failing run instead of deadlocking.

---

## DECISION LEDGER
- CHOSEN: one consolidated navigator plan, governed by the ratified PLAN-PIPELINE-SPINE + North Star,
  surfacing active/high + this-session threads; the register remains the full 102-item source.
- REJECTED: dump all 102 open parks verbatim (noise, not a navigator) — the plan ORDERS; the register HOLDS.
- REJECTED: leave pending work in scattered handoff docs + my head (the freestyling root cause) — a single
  ratified navigator is the fix, and the pipeline gate makes tracing to it mandatory.

## STANDING RULE (installed this session)
Wire the cheap ones, don't park them; park only trigger-gated work. Nothing consequential implements
without tracing to a ratified plan-item + a goal (North Star). No answer = no mandate.
