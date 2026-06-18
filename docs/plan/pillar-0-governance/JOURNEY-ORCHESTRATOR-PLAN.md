---
id: csps.governance.journey-orchestrator-plan
name: JOURNEY-ORCHESTRATOR-PLAN
description: >
  The canonical, ratified build plan for the Journey Orchestrator — the platform's core operating method
  (how everything is created/audited/optimized). Consolidates the full S084 design arc (corrected 5-phase
  model + persona core/branches + moat-orchestration + 3 core loops + connectivity+council + ID schema +
  ZF/PE/CIE/threshold hardwire + ZF hardening ladder + ripple pass + loop activation) into one buildable
  plan with explicit Opus-vs-Sonnet job split and the required core seeds. Ratified Governor S084.
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: GVRN
diataxis_type: how-to
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: ratified
ratified_by: "Governor S084 ('i approve all')"
ratified_at: "2026-06-18"
impl_status: audit-1-complete
precedent_checked: true
links:
  - { rel: seed-anchors, href: JOURNEY-SEEDS-S084.md }
  - { rel: corrected-model, href: ../_handoff/VAULT/research/S084-journey-external-consolidation.md }
  - { rel: persona-audit, href: JOURNEY-PERSONA-AUDIT-S084.md }
  - { rel: moat-map, href: JOURNEY-MOAT-MAP-S084.md }
  - { rel: connectivity-council, href: JOURNEY-CONNECTIVITY-AND-COUNCIL-S084.md }
  - { rel: id-schema, href: JOURNEY-ID-SCHEMA-S084.md }
  - { rel: ripple-loops, href: JOURNEY-RIPPLE-AND-LOOPS-S084.md }
  - { rel: trunk-branch, href: P-ARCH-TRUNK-BRANCH-PATTERN.md }
  - { rel: core-spine-registry, href: ../../../tools/config/core-spine-registry.yaml }
---

# Journey Orchestrator — Canonical Build Plan (RATIFIED S084)

> **Purpose:** build the journey as the platform's operating method — a `journeys` core-spine entry whose
> trunk is sealed, whose branches are persona/risk-variant, that orchestrates existing moats per phase,
> feeds the 3 core loops, and hardwires Threshold + ZF + PE + CIE as non-optional gates. Everything below
> is consolidated from 8 ratified S084 design docs (see links). NOTHING here lives only in chat/temp.

## 0. RATIFIED DESIGN (the what — consolidated)
- **Structure:** a `journeys` core-spine-registry ENTRY (8 canon sections). `trunk` = SEALED core
  (invariants C1-C5 + phases P1-P5). `branches` = variants (fast/standard/governed/exploratory) + 5 axes.
- **Selector:** RISK-CLASS primary (Threshold classify); persona = visibility/permission OVERLAY (tier_permission).
- **5 phases**, each with a Phase Exit Gate (PEG): P1 Intent · P2 Audit · P3 Decide · P4 Validate · P5 Activate-Verify-Learn.
- **Hardwire matrix (non-optional, BLOCKING gate-fields on every PEG):** Threshold (entry + every new input)
  · ZF/IZFC (every PEG) · PE (decide + re-rank) · CIE (emit at every PEG).
- **ZF hardening ladder (all ratified):** (1) advisory→BLOCKING now · (2) pre-Write/Edit gate · (3) re-run-at-
  gate + hash-bound evidence (the anti-nominal core) · (4) state-machine code-blocking in advance() · (5) ZF
  at every boundary (PEG/ratify/seal/session-close/ripple) · (6) anti-self-accept (cross-actor ratify-ZF).
- **Orchestrates moats** per phase (JOURNEY-MOAT-MAP) + **feeds 3 core loops** (alignment/optimization/anti-drift).
- **Council** inserted as deliberation layer (inner/expert/external) per phase; deep-dive PARKED (PARK-S084-014).
- **Ripple pass:** on significant change → dep-graph blast-radius → update-matrix → ripple report → gate.
- **Loop activation:** schedule cadence loops (cloud routine or session-open-due trigger) + surface a loops-report.

## 0b. PRE-BUILD CORRECTIONS — 3-WAY EXTERNAL CONSENSUS (Gemini+Claude+GPT, 2026-06-18)
> These SUPERSEDE the "blocking-everywhere + synchronous orchestrator" posture in §0. All three independent
> models converged; three are ARCHITECTURAL (expensive to retrofit). Changed-and-why marked.
- **C1 [CHANGED — supersedes flat hardwire] gate_mode matrix.** Gates are NOT uniformly blocking. Each gate
  carries `gate_mode[risk_class][phase] = blocking | advisory | silent`. Defaults: Threshold blocks entry+P1
  (+ scope-change/activation/cross-tenant), advisory elsewhere · ZF/evidence blocks at P≥3 on Standard/
  Governed (advisory on Fast; depth risk-classed) · PE blocks at Decide only · **CIE NEVER blocks by default —
  emits+logs; blocks ONLY on Critical/Structural findings.** (CIE-as-blocker = compliance theater.)
- **C2 [CHANGED] invariants reworded (vocab — see PARK vocab-realignment):** "no-skip" → **no-silent-skip**
  (compression/override/N-A allowed, never UNRECORDED) · "verify-completely" → **verify against acceptance
  criteria + confidence + monitoring/rollback** (complete verification is usually false confidence).
- **C3 [CRITICAL — architectural] decouple workspace from registry.** Real-time workspace (drafts/saves/
  sessions) → fast parallel store; heavy recursive graph checks (ripple, evidence gates) run ONLY on explicit
  PEG transaction as an ASYNC batch commit. Orchestrator = EVENTED services (Journey/Policy/Evidence/Ripple/
  CIE/Notification/Audit-event-store), NOT a synchronous master gatekeeper.
- **C4 [CRITICAL — architectural] Ripple Pass = typed + versioned + severity + concurrency-safe pipeline:**
  static-declared graph validated continuously (not inferred at fire-time) · TYPED edges each with an
  invalidation rule · SEVERITY P0(block-activation)/P1(block-verify)/P2(ticket)/P3(log) — gate only on P0/P1,
  not the whole matrix · SEPARATE detect/compute/execute (human-confirm between compute+execute on Governed) ·
  CYCLE DETECTION → freeze+surface (loops make circular ripples likely) · VERSIONED SNAPSHOT at fire-time +
  graph-version check before commit (TOCTOU fix; no silent merge) · expand→migrate→contract for schema/API ·
  upstream publishes new version, downstream pinned + flagged (decoupled tasks, not blocking the initiator).
- **C5 risk-class = system-SUGGESTED + PA-ratifiable** (NOT user-declared) · downgrade needs reason+permission
  +log · auto-UPGRADE on core-schema/security/billing touch · reclassify on new-input/dep-expand/criteria-
  change/permission-cross · aggregate risk per batch · **branch-persona compatibility check at entry** (low-tier
  persona on Governed task → escalate/narrow-scope).
- **C6 health = 3 layers, log-first:** L1 session-close structured log (queryable, no UI) · L2 weekly digest
  (≤5 metrics) · L3 event-driven breach alert (Governed bypass-rate >threshold/48h). NO dashboard before 30 sessions.
- **C7 BUILD ORDER [CHANGED — supersedes §2 "build it all"]: MVP-NARROW spine first.** Build: 5-phase state
  machine + risk-selector + persona overlay + PEG evidence + policy-result model (allow/deny/warn/require-
  approval/log) + Ripple for 2-3 TYPED artifact classes + Owner Health Brief (L1) + append-only event log.
  DEFER: full CIE automation · universal ripple coverage · dashboards · auto-remediation · L2/L3 health.
- **10 NON-NEGOTIABLES (GPT):** every event has id · every artifact versioned · gate records policy-version ·
  ripple records graph-version · saves use optimistic concurrency · every blocker has ONE owner+severity+expiry ·
  every override logged (actor/reason/scope) · async workers idempotent · "done" reproducible from event log.

## 0c. RUNG-4 EXTERNAL SEED REVIEW — 3-MODEL CONSENSUS (Gemini+Claude+GPT, 2026-06-18)
> Independent external review of the SEED DESIGN before authoring (PE ranked seeds #1, C1-irreversible).
> Convergence-tagged. R1 was caught by NONE of the 6 internal experts — that is why rung-4 ran. SUPERSEDES §3 where noted.
- **R1 [3/3 — all three models' "one change"] Definition-versioning + in-flight instance migration → NEW SEED-9.**
  Every journey INSTANCE binds to SPECIFIC versions {journey_def, phase_def, gate_def, policy, selector,
  evidence_contract}; running journeys do NOT silently inherit definition edits. A definition change classifies:
  none | advisory | required-before-next-PEG | forced-before-activation | legacy-continues. Replay evaluates
  under the policy version in effect THEN (else the audit log lies). Without this, the first edit to a sealed
  seed = risky backfill OR two incompatible platform versions running at once.
- **R2 [2/3 — SEED-4 = highest risk] dependency-graph CONTRACT.** SEED-4 is the only seed operating on data it
  INHERITS (the 518-node graph) not generates, and that inheritance has no governance. Add: graph owner +
  accuracy/consistency guarantee + what SEED-4 does when the graph is STALE vs reality + a hard Max-Depth
  circuit-breaker/TTL (ripple→re-run→state-change→ripple = infinite async loop under load).
  **R2b [Gemini Q1] SEED-4↔SEED-5 are COUPLED** — a ripple invalidates downstream evidence, so SEED-4's
  blast-radius DICTATES which SEED-5 live re-runs must fire. Bind them (SEED-4 output → SEED-5 input), not independent.
- **R3 [3/3] AuditEvent reuse = YES, GATED.** First audit: does ANY code path UPDATE/DELETE AuditEvent rows?
  (storage-level immutability, not convention). If not truly append-only → harden or build dedicated. Confirm
  fields: causation/correlation/idempotency/policy_version/graph_version/event_version.
- **R4 [2/3] explicit POLICY-EVALUATION contract** (currently smeared across SEED-2/6/8). input(context,
  policy_version, risk_class, actor, scope, phase, attempted_transition) → {allow|deny|warn|require_approval|
  auto_upgrade} + reason codes + evidence requirement + audit payload. Enforce at ONE boundary (admission-
  controller pattern). Sealed subsection of SEED-2, or its own seed.
- **R5 [3/3] scope discriminator CONFIRMED + decide tenant-extension NOW.** scope: platform|tenant — add a third
  `tenant_extension` value (+ parent_platform_def_id + compatibility version + inheritance rule) IF tenants may
  add custom variants; else LOCK "no tenant extensions" as a SEED-1 invariant. Do not leave ad-hoc.
- **R6 [3/3] universal-ripple ENGINE is load-bearing in MVP** (generic from day 1); only per-class HANDLERS defer.
  Pick the 3 HARDEST classes to prove the pattern: schema/object-def · validator/policy-rule · UI/workflow-binding.
  "Universal ripple" = phased expansion with a defined extension protocol, NOT a simple defer.
- **R7 [Claude Q1a] SEED-6 selector is an ENTRY dependency of SEED-1**, not a downstream consumer — a journey
  instance cannot bind a variant before the selector has run. Absorb the selector into SEED-1 or explicitly
  declare it a SEED-1 pre-condition (ordering fix; else SEED-1 and SEED-6 make incompatible instantiation assumptions).
- **R8 [Claude Q1b] missing RATIFICATION-INTERFACE seed** — the human surface where a PA/owner sees a system-
  SUGGESTED risk-class upgrade, reviews the WHY, and confirms or downgrades. NOT pure UX: it touches SEED-6
  (selector output), SEED-8 (the override must be logged), SEED-2 (gate_mode depends on the RATIFIED risk-class).
  Anchor the ratification CONTRACT (suggestion → review → confirm/downgrade+reason → log) or three seeds assume
  incompatible ratification flows.
- **PROCESS [GPT — for the rung-4 PROTOCOL, parked]:** future external prompts = Pass A blind-review THEN Pass B
  reconciliation (don't pre-frame the consensus); strip internal jargon from the relay box; require severity +
  retrofit-cost tags + a Q7 versioning vector. NOTE: GPT still converged with the other two DESPITE the anchoring
  — independent convergence held, which strengthens R1/R3/R5/R6. (→ PARK-S084-028.)

## 1. OPUS JOB vs SONNET JOB (the precision boundary — M-37)
**OPUS (director/architect) — writes ANCHORS only, reviews via OPIA, never routine code:**
- The 7 core seeds (§3) — schemas, contracts, the SEALED trunk text, closed enums, selector rules.
- OPIA acceptance at every phase gate (cross-actor ZF; ratify/seal).
- Conflict/architecture decisions surfaced by ASK-OPUS-STOP.
**SONNET (builder) — full build-out from the seeds:**
- DB models + migration (Journey meta-model: PhaseDef/GateDef/VariantDef/BranchAxis/Bindings).
- The `journeys` core-spine-registry entry (8 sections) wired from SEED-1.
- The dashboard journey-RESHAPER (CRUD on the ID'd meta-model, tier-gated, trunk sealed).
- The PEG enforcement: hooks (can't-advance) + validators (EXTENDED) for ZF/PE/CIE/threshold.
- The ZF ladder builds: promote advisory→blocking; pre-Write/Edit gate; re-run-at-gate + hash-bind.
- The ripple-pass implementation (dep-graph walk + update-matrix + report + gate).
- The loop scheduler + the session-close loops-report surfacing + CIE ADJUST/INJECT/MEASURE wiring.
- Behavioral tests for every new gate (M-31) + reflexive self-run (M-33).
- Reports FROM SONNET | FOR OPUS; numbers tagged [MEASURED]/[PREDICTED]/[ASSUMED]; verify=0 before DONE.

## 2. BUILD PHASES (per-phase Governor/Opus gate; gradual-build)
- **B1 — CORE-SPINE ENTRY + META-MODEL SCHEMA** (from SEED-1, SEED-2, SEED-3, SEED-6): register `journeys`
  entry (trunk sealed); add PhaseDef/GateDef/VariantDef/BranchAxis/*-Binding models; enums. DONE: validate-
  core-spine-template passes · verify=0 · cycles ≤140.
- **B2 — DASHBOARD RESHAPER** (the authoring studio over the meta-model): CRUD on phases/gates/variants/
  bindings, tier-gated, trunk read-only. DONE: reshape a journey end-to-end on the local build.
- **B3 — HARDWIRE GATES** (from SEED-2, SEED-5): PEG enforcement — Threshold/ZF/PE/CIE as BLOCKING gate-
  fields + hooks + validators (EXTENDED). ZF ladder #1 (advisory→blocking) + #3 (re-run-at-gate+hash) +
  #2/#4/#5/#6. DONE: block-tests prove each gate refuses a missing-evidence advance.
- **B4 — RIPPLE PASS** (from SEED-4): dep-graph walk + update-matrix + ripple report + done-gate. DONE:
  a significant change surfaces its full ripple list + blocks until addressed.
- **B5 — LOOP ACTIVATION** (from SEED-7): scheduler/session-open-due trigger + session-close loops-report +
  CIE ADJUST/INJECT/MEASURE wiring. DONE: a real health report is surfaced to the Governor.
- **B6 — COUNCIL DEEP-DIVE** (PARK-S084-014): types × iterations × consulting-depth. GATED — process after B1-B5.

## 3. REQUIRED CORE SEEDS (OPUS writes these BEFORE Sonnet builds — committed to repo, survive compaction)
- **SEED-1 `journeys` entry skeleton** — the 8-section entry with the SEALED trunk fully written (C1-C5
  invariant text + P1-P5 phase names/intents), alignment_map, and section stubs. (Opus writes the constitution.)
- **SEED-2 PEG GateDef schema** — exact fields: `{id, phase_id, minimum_exit_evidence[], zf_gate:{mode:blocking,
  proof:rerun|hash}, threshold_required:bool, pe_required:bool, cie_emit:bool}`. (Locks the hardwire shape.)
- **SEED-3 phase→binding map** — for each P1-P5: which moats (M-NN) fire, which council type, which loop emits.
- **SEED-4 ripple-pass contract** — `ripple(changedNodeId, changeType) → {blastRadius[], updates[], gate}`
  + the update-matrix (add/edit/delete → which surfaces). (Locks the propagation shape.)
- **SEED-5 ZF re-run-at-gate contract** — `zfGate(scope) → {rerun|hashverify, exit_code, evidence_hash}` +
  the tiering rule (cheap=hash-bound tracker; high-stakes PEG/ratify/seal=live re-run). (Locks anti-nominal.)
- **SEED-6 closed enums + selector** — VariantType {fast|standard|governed|exploratory}; the 5 BranchAxis
  names; PersonaTier set; the selector rule (risk-class primary, persona overlay). (Per vocabulary-canon.)
- **SEED-7 loops-report schema** — what the session-close report contains (CIE signals · consolidation
  findings · gap-recurrence K≥2 · ripple backlog · moat drift). (Locks the surfacing.)
- **SEED-8 event-log + optimistic-concurrency contract** (rung-4 R3) — the append-only substrate for the 10
  non-negotiables. REUSE existing AuditEvent (`entity_type='journey_event'`) AFTER the storage-level
  immutability audit (no UPDATE/DELETE path). Fields: event_id · tenant_id · actor_id · causation/correlation_id
  · idempotency_key · policy_version · graph_version · event_version · occurred_at · payload. (Substrate; "done"
  reproducible from this log.)
- **SEED-9 definition-versioning + in-flight migration contract** (rung-4 R1 — THE 3/3 addition) — instance↔version
  binding {journey_def/phase_def/gate_def/policy/selector/evidence_contract} + the 5-way change classification
  (none|advisory|required-before-next-PEG|forced-before-activation|legacy-continues) + replay-under-historical-policy.
  Running journeys never silently inherit definition edits. (Locks audit-trustworthiness across seed evolution.)
- **NOTE:** core-seed count is now **9** (§1's "7 core seeds" supersedes to 9). SEED-2 absorbs the R4 policy-
  evaluation subsection; SEED-4 absorbs the R2 graph-contract + circuit-breaker; SEED-1 absorbs the R5 tenant-
  extension decision.

## 4. CONSTRAINTS
- Consolidate, don't fork (journey = existing 8-section schema; orchestrates existing moats; reuses dep-graph/
  dead-links/slices/CSEP). New validators born run_tier:EXTENDED. verify=0 + cycles ≤140 every phase.
  precedent_checked on all new artifacts. Trunk SEALED (boundary-crossing to change). Per-phase OPIA + Governor gate.

## 5. ZF GATE (this plan + every phase)
- Cycle 1: cite each new file/model by path + verify exit_code + cycles.
- Cycle 2: re-examine (a) hardwire gate-fields BLOCK not warn, (b) ripple-pass gates on real dep-graph,
  (c) no floating new node (every new doc/model referenced). 0 new findings.
