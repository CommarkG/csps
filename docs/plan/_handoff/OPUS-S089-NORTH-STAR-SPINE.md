---
id: csps.handoff.opus-s089-north-star-spine
name: OPUS-S089-NORTH-STAR-SPINE
description: >
  Opus S089 north-star / spine doc — the operating doctrine (completion-as-ledger),
  PE-ranked sequence (pivot to UX/UI journeys; recurrence-stoppers parked-but-scheduled;
  core-seeds/DNA/checklist dogfood hardwiring), simulation/test-build activation map,
  and the verified state. Compaction-safe SSoT for the S089 continuation.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
---

# OPUS S089 — North-Star Spine

## 0. VERIFIED STATE (this tab, not memory)
- HEAD chain S089: churn settled (`26cfe187`/`f4e8ef4e`) → park-register YAML restored
  (`659be661`) → **validate-park-register BUILT + completion-gate re-activated** (`b3f14ed6`)
  → receipt-stabilized (`2f774045`).
- `pnpm verify` exit 0; `validate-green-receipt` PASS (tree=c203ec6c @ 2f774045); tree clean.
- park-register: 100 entries / 82 open / parses OK / guarded by validate-park-register.

## 0b. CANONICAL BUILD PROCESS (read before any build)
No build starts off-spine. The goal-first build process = docs/plan/_handoff/OPUS-S089-CANONICAL-BUILD-PROCESS.md (goal -> exists -> journey -> back-office -> corespine -> UX -> UI -> test-drive -> closure; ratified at every gate; create=prevent mirror). Ratified Governor S089.

## 1. OPERATING DOCTRINE — completion-as-ledger (answers the Governor's tension)
**Completion IS a hidden key to fast progress — but the unit of completion is the LEDGER, not the work.**

- The expensive cost is not "unfinished work" — it is **unfinished work in a place you'll forget**
  (un-prevented recurrence; silently-dead gates). That debt compounds at high interest.
- A turn is COMPLETE when every loose end is in a TERMINAL state: either (a) BUILT + verified,
  or (b) captured in a **mechanically un-droppable** park (owner + trigger + disposition +
  guarded by a gate). There is no legitimate third "fixed-but-prevention-floating" state.
- Therefore: do NOT gold-plate every fix into a validator immediately (that starves the product —
  the balance-expert failure). DO guarantee the prevention is either built or un-droppably parked.
- The one non-negotiable completion is the mechanism that makes parks resurface. Without it,
  "park" = "forget"; with it, "park" = "scheduled." That single mechanism converts the
  completion-vs-progress tradeoff into a non-issue.

**Dogfood proof this session:** I caught a broken-register bug → instead of re-parking the
prevention (the satisfaction-point failure), I BUILT validate-park-register. That act
re-activated validate-completion-gate, which had been **silently blind for 3+ commits** because
the register was unparseable (EXISTS≠ACTIVE). One real completion restored a whole dead gate.

## 2. PE-RANKED SEQUENCE (the pivot)
Governor mandate: *finish what we started, park the rest, move to actual UX/UI journeys and
start building real things.* PE = urgency × impact / SPI.

**P0 — DONE this tab:** validate-park-register + dispositions + green restore. (completion floor)

**P1 — PIVOT: UX/UI developer + user journeys (Sonnet builds; PE-highest, product-bearing).**
Pages already scaffolded (developer-journey, user-journey, zero-friction, design-intelligence).
Sonnet's PE-ranked S3+ order (ratified here):
  1. platform/developer-journey
  2. platform/zero-friction
  3. platform/design-intelligence
  4. platform/simulation  (gated — see §4)
Each page COMPLETE = pageDNA + purpose + the 5 UX-DNA laws + 6 UI principles + state-completeness
+ M-47 honest-error + **core-seeds + DNA-principle + checklist blocks embedded** (§3).

**P2 — core-seeds / DNA / checklist DOGFOOD hardwiring (the Governor's "maintain alignment" key).**
ENHANCE existing surfaces, do not fork: `validate-core-seeds.mjs` already exists. Make core-seeds +
DNA-principle + checklist presence MECHANICAL across planning/implementing/verifying — see §3.

**P3 — Recurrence-stoppers (parked, PCR'd, build-ready; Opus-seed → Sonnet AFTER UX/UI batch).**
PREVENTION-PERSIST-PE-AUTOPLAN-LOOP (TOP) · THRESHOLD-INLINE-GATE · STARTUP-AUTO-PROCEED.
All dispositioned in park-register (owner + trigger). The 9-question PCR is recorded in opus-turn.md.

## 3. CORE-SEEDS / DNA / CHECKLIST HARDWIRE (P2 — how it becomes mechanical, not assumed)
Goal (Governor): core-seeds + DNA-principles + detailed checklists placed all over the platform =
the alignment-maintenance method. Make it un-skippable in plan + implement + verify.
- **PLAN surface:** every plan/handoff doc carries a `core_seeds:` block + a per-part checklist.
  Enforce via validate-decision-ledger's sibling (extend or add core-seeds presence check on
  OPUS-*/HANDOFF-* docs). RULE-SCOPE: CONCEPT=core-seeds-everywhere · SCOPE=consequential plan
  docs + platform pages · ESCAPE HATCH=trivial-reversible docs exempt.
- **IMPLEMENT surface:** every platform page declares `pageDNA` + embeds the relevant DNA-law +
  a visible checklist (the UX page already does laws+checklist; generalize to all pages).
- **VERIFY surface:** `validate-core-seeds.mjs` (exists) → extend to assert core-seeds/DNA/checklist
  presence per page + per plan doc; wire BLOCKING after a backfill grace. FSE 5-surface for any new
  rule (T1 hook on write + T2 validator + T3 memory + T4 contract + T5 AGENTS.md) — committed atomically.
- **HONESTY:** this is PLANNED, not yet built. Do not claim done until validate run is green on it.

## 4. SIMULATION / TEST-BUILD ACTIVATION MAP (Governor: "activate all potentially ready")
- **task-mgmt** — LIVE (app-layer tenantId + Postgres RLS). Active.
- **simulation scenarios** (3: onboarding-solo, cross-domain-sleep-work, task-mgmt-live) +
  `validate-simulation-before-implementation` PASS (sandbox specs ratified). READY in substance.
- **platform/simulation page** — GATED on VLT-S022-ZENSTACK-GENERATE-PATH (open since S022).
  **Likely-cheap de-gate:** the VLT note says `zenstack generate` SUCCEEDS from the ROOT schema
  path; the bug fires only on sub-package generate (pnpm path conflict). Candidate fix = "always
  generate from root" — a <1-session spike (the VLT's own flip-condition). RECOMMEND: timebox the
  root-generate spike; if it flips, de-gate simulation and activate it in the P1 batch.
- **trials** (budget-planner, debt-collection, habit-tracker, voice-sorting) — EPHEMERAL TRIALS;
  do not promote without a build-wizard pass (PARK-S089-BUILD-WIZARD-PLAYBOOK).

## 5. DECISION LEDGER (this spine)
- CHOSEN: pivot to UX/UI journeys (P1) as primary; recurrence-stoppers parked-but-scheduled (P3);
  core-seeds hardwiring as P2 mechanical work; simulation de-gate via cheap root-generate spike.
- REJECTED build all recurrence-stoppers before UX/UI: contradicts Governor pivot + starves the
  product; the parks are now un-droppable (dispositioned + guarded), so deferring is safe.
- REJECTED keep core-seeds as memory-only guidance: T3-only drifts within 2 sessions (AI-PROFILER);
  must be T1+T2 mechanical.
- REJECTED treat simulation as blocked-indefinitely: the VLT has a likely-cheap root-generate fix.
