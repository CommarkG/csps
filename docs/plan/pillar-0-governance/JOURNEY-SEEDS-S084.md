---
id: csps.governance.journey-seeds-S084
name: JOURNEY-SEEDS-S084
description: >
  The AUTHORED seed anchors (SEED-1..9) for the Journey Orchestrator — the sensitive constitution text,
  contracts, and closed enums that Opus authors BEFORE Sonnet builds. Realizes JOURNEY-ORCHESTRATOR-PLAN §3
  with the §0c rung-4 external consensus (R1–R8) encoded. Each seed = ANCHOR (authored content) + RUNG-4
  DECISION + BUILD HANDOFF (what Sonnet builds) + ALIGNS. Opus authors; Sonnet CROSS-ACCEPTs then builds.
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-22
core_spine: GVRN
diataxis_type: reference
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: architecture-pending
vault_pending:
  vlt: VLT-S084-JOURNEY-SEEDS-BUILD
  retrieve_when: "Sonnet CROSS-ACCEPT audit of the authored seeds passes, then Sonnet builds B1-B5 from SEED-1..9"
precedent_checked: true
links:
  - { rel: build-plan, href: JOURNEY-ORCHESTRATOR-PLAN.md }
  - { rel: id-schema, href: JOURNEY-ID-SCHEMA-S084.md }
  - { rel: core-spine-registry, href: ../../../tools/config/core-spine-registry.yaml }
  - { rel: tab-transfer, href: ../_handoff/OPUS-TAB-TRANSFER-S084-seed-authoring.md }
  - { rel: park-register, href: ../../../tools/data/park-register.yaml }
---

# Journey Orchestrator — Seed Anchors (SEED-1..9), AUTHORED S084

> **What this is:** the Opus-authored ANCHORS that [JOURNEY-ORCHESTRATOR-PLAN §3](JOURNEY-ORCHESTRATOR-PLAN.md)
> requires "committed to repo, survive compaction." The plan §3 says WHAT each seed must contain; THIS file
> is the actual authored content Sonnet builds from. Every §0c rung-4 decision (R1–R8) is encoded and tagged.
> **Boundary:** Opus writes anchors (constitution / contracts / enums). Sonnet builds (DB models, hooks,
> validators, tests, the `journeys` registry entry). **CROSS-ACCEPT is mandatory** — Sonnet audits these
> anchors (STEELMAN-AGAINST + NAME-THE-TELL) and returns findings BEFORE building. Nothing here is sealed
> until Governor ratifies + Sonnet cross-accepts.

## Reading order (R7 ordering fix is load-bearing)
SEED-6 (selector + enums) is an **ENTRY pre-condition of SEED-1**, not a downstream consumer. Read **SEED-6
first**, then SEED-1. The instantiation order is: `classify (SEED-6 selector) → bind versions (SEED-9) →
instantiate (SEED-1) → gate per phase (SEED-2) → ripple on change (SEED-4) → re-run evidence (SEED-5) →
log every event (SEED-8) → aggregate (SEED-7)`.

---

## SEED-6 — closed enums + selector  *(read first; R7)*

**ANCHOR — the closed vocabularies (per vocabulary-canon, no invented values):**

```yaml
# Journey closed enums — frontend-reshapeable rows are CONSTRAINED to these sets.
VariantType:        [fast, standard, governed, exploratory]      # the 4 branch variants
RiskClass:          [low, standard, elevated, critical]          # selector primary output
BranchAxis:         [depth, drive_auto, vocabulary, permission, focal]  # the 5 axes (JOURNEY-ID-SCHEMA)
PersonaTier:        [governor, core_dev, external_dev, account_owner_admin, team_leader, end_user]  # 6-tier (comms-schema)
GateMode:           [blocking, advisory, silent]                 # per gate_mode matrix (SEED-2)
PolicyResult:       [allow, deny, warn, require_approval, auto_upgrade]  # R4 (SEED-2)
RippleSeverity:     [P0, P1, P2, P3]                             # block-activation / block-verify / ticket / log
ChangeClass:        [none, advisory, required_before_next_peg, forced_before_activation, legacy_continues]  # R1 (SEED-9)
Scope:              [platform, tenant]                            # R5 — tenant_extension LOCKED OUT (see SEED-1 C5)
```

**ANCHOR — the SELECTOR rule (risk-class PRIMARY, persona OVERLAY):**

```
selectVariant(intent, actor) -> { risk_class, variant, persona_overlay, compatibility_check }
  1. risk_class  = Threshold.classify(intent)            # SYSTEM-SUGGESTED, never user-declared (C5)
        auto-UPGRADE to >= elevated on: core-schema | security | billing | cross-tenant touch
  2. variant     = risk_class -> VariantType
        low->fast · standard->standard · elevated->governed · critical->governed
        (exploratory is OPT-IN, never auto-selected — it relaxes gates and must be explicitly chosen)
  3. persona_overlay = actor.tier -> visibility + permission (NOT risk; risk owns the gate)
  4. compatibility_check: low-tier persona on a governed variant -> ESCALATE or NARROW-SCOPE (C5)
  RETURNS to SEED-1 as the instantiation pre-condition. A journey instance CANNOT bind a variant
  before selectVariant has run and its risk_class is RATIFIED (R8 ratification-interface).
```

**RUNG-4 DECISION (R7):** the selector is declared a **SEED-1 pre-condition**, not a downstream consumer —
its output is the input to instantiation. This removes the incompatible-instantiation-assumption between
SEED-1 and SEED-6.

**BUILD HANDOFF (Sonnet):** encode these as the closed enums in the meta-model (Prisma enums + a
`closed-enums.yaml` the validator checks); implement `selectVariant` as the entry function the orchestrator
calls before creating a `Journey` row. Persona overlay reads `tier_permission`.

**ALIGNS:** JOURNEY-ID-SCHEMA-S084 (5 axes + selector) · comms-schema 6-tier audience hierarchy · threshold
classify (M-16/M-42) · vocabulary-canon (closed-enum discipline).

---

## SEED-1 — `journeys` core-spine entry constitution (the SEALED trunk)

**ANCHOR — the entry skeleton (canon 8-section schema; trunk fully written, rest stubbed for Sonnet):**

```yaml
- id: journeys
  spine: GVRN
  status: sandbox            # -> active after Sonnet build + Governor ratification
  authored_by: "OPUS-22 (seed) + Sonnet S084 (build)"
  # ── 1. trunk — THE SEALED CORE (invariants C1-C5 + phases P1-P5) ──
  trunk:
    description: "A journey = a tracked path from a classified intent to verified completion, run through
      5 phases, each closed by a Phase Exit Gate (PEG), with risk-classed gate modes, full event logging,
      and version-bound instances. The trunk is SEALED — changing it is a boundary-crossing event."
    invariants:    # vocab corrected per §0b C2 (no-silent-skip / verify-against-criteria)
      - id: C1
        name: no-silent-skip
        statement: "A phase, gate, or evidence requirement may be compressed, overridden, or marked N/A —
          but NEVER unrecorded. Every skip writes an event (actor, reason, scope) to the log (SEED-8)."
        failure_mode: "Silent skip → the audit log lies; 'done' is not reproducible from events."
      - id: C2
        name: humble-first
        statement: "Every phase begins by consulting what already exists (precedent / prior instances /
          canonical sources) before generating new. Existing-Before-New is a phase pre-step, not advice."
        failure_mode: "Parallel-creation disease — new node when an existing one should have evolved."
      - id: C3
        name: evidence-at-gate
        statement: "No PEG advances without THIS-SESSION evidence bound to the gate (SEED-5). Memory of a
          prior run is not evidence. Re-run (or hash-verify for cheap scopes) IS the proof."
        failure_mode: "Nominal DONE — the next instance rediscovers and re-fails the same thing."
      - id: C4
        name: decide-with-pe-and-cie
        statement: "Every DECIDE (PEG-3) selects among options with a PE score; every PEG emits a CIE
          signal on exit. Neither the decision nor the emission may be silent."
        failure_mode: "Path chosen by recency/authority, not priority; phases close leaving no learning signal."
      - id: C5
        name: verify-against-acceptance-criteria
        statement: "Completion = verified against DECLARED acceptance criteria + a confidence level +
          a monitoring/rollback plan. 'Verify-completely' is false confidence and is BANNED as a claim.
          SCOPE INVARIANT: journeys are scope:platform | scope:tenant ONLY. tenant_extension is LOCKED
          OUT in MVP (no tenant-authored variants). Expansion requires the protocol in §SEED-1 EXPANSION."
        failure_mode: "Unbounded 'fully verified' claim; OR ad-hoc tenant variants with no inheritance rule."
    phases:
      - { id: P1, name: intent,           intent: "Crystallize + classify the goal; selector runs (SEED-6); risk_class ratified (R8)." }
      - { id: P2, name: audit,            intent: "Consult what exists (C2); gather evidence; map the dependency surface." }
      - { id: P3, name: decide,           intent: "Choose the path with a PE score (C4); register non-selected options (no-lost-threads)." }
      - { id: P4, name: validate,         intent: "Run the build/change; ZF evidence at the gate (C3); ripple pass (SEED-4)." }
      - { id: P5, name: activate-verify-learn, intent: "Activate; verify against acceptance criteria (C5); emit CIE; propagate essence (PARK-024)." }
  # ── 2-8. Sonnet fills from SEED-2..9 (stubs, structure declared) ──
  branches:        # from SEED-6 (VariantType + 5 axes); selector = risk-class primary, persona overlay
  alignment_map:   { schema_anchor: vault_files, architecture_map_node: "pillar-0-governance", classification_dimension: GVRN, root: .claude/core-spines/L1_CORE_GVRN.md }
  wiring_map:      # SEED-3 phase->moat/council/loop bindings (real files)
  cie_pe:          # PE at decide + CIE emit per PEG (SEED-2 hardwire matrix)
  tier_permission: # 6-tier persona overlay (SEED-6 PersonaTier); trunk sealed-view-only
  escalation:      # council (inner/expert/external) + R8 ratification-interface ladder
  realtime_save:   # Journey / JourneyStage instance persistence (version-bound per SEED-9)
```

**ANCHOR — R8 RATIFICATION-INTERFACE CONTRACT (the human surface; touches SEED-6/8/2):**

```
ratify(suggested_risk_class, evidence) -> { ratified_risk_class, decision, reason, logged_event_id }
  STAGE 1 SUGGESTION : system emits suggested_risk_class + WHY (selector reason codes)  [from SEED-6]
  STAGE 2 REVIEW     : PA/owner sees the suggestion + the why + the gate consequences   [renders SEED-2 gate_mode]
  STAGE 3 CONFIRM    : confirm  -> ratified_risk_class = suggested
            DOWNGRADE: downgrade -> REQUIRES reason + permission-tier check (C5); upgrade is always allowed
  STAGE 4 LOG        : every confirm/downgrade writes an immutable event (actor, from, to, reason)  [to SEED-8]
  GATE DEPENDENCY    : SEED-2 gate_mode reads the RATIFIED risk_class, never the raw suggestion.
```

**RUNG-4 DECISIONS:**
- **R5 (DECIDED by Opus, delegated):** `Scope` enum = `[platform, tenant]`. **tenant_extension is LOCKED OUT
  as sealed invariant C5** for MVP. Rationale: MVP-narrow (§0b C7); no tenant has requested custom variants;
  the inheritance/versioning machinery it depends on (SEED-9) is itself MVP-minimal. Reversible — the
  §SEED-1 EXPANSION protocol below is the declared, non-ad-hoc path to add it. **⚑ FLIP-POINT for Governor:**
  if tenants WILL author custom journey variants in the near term, say so at ratification and I add the third
  enum value (`tenant_extension` + `parent_platform_def_id` + `compatibility_version` + `inheritance_rule`) now.
- **R7:** selector (SEED-6) is the entry pre-condition; the `branches` binding happens AFTER `selectVariant`.
- **R8:** ratification-interface contract anchored above; SEED-2/6/8 all read the RATIFIED risk-class.

**§SEED-1 EXPANSION (declared protocol so "none" is decided, not a dead-end):** to add `tenant_extension`
later — (1) add the enum value + the 3 fields; (2) a tenant-authored variant binds `parent_platform_def_id`
and a `compatibility_version`; (3) inheritance rule = tenant variants may TIGHTEN gates, never relax a
platform invariant; (4) the change runs through SEED-9 versioning (it is a `forced_before_activation` def change).

**BUILD HANDOFF (Sonnet):** register the `journeys` entry in core-spine-registry.yaml with the trunk written
verbatim above; run `validate-core-spine-template.mjs` (8 sections present); build the `Journey` / `JourneyStage`
meta-model (PhaseDef/GateDef/VariantDef/BranchAxis/*-Binding) from SEED-2/3/6; trunk is sealed-view-only in the
dashboard reshaper.

**ALIGNS:** accountability + simulation + communication spine entries (8-section precedent) · JOURNEY-ID-SCHEMA
(trunk/branch split) · P-ARCH-028 precedence (GVRN sealed) · B_SWIFT_OR_PARK (minimal-now + declared upgrade).

---

## SEED-2 — PEG GateDef schema + gate_mode matrix + R4 policy contract + blocked-message

**ANCHOR — GateDef schema (one per phase, PEG-1..5):**

```yaml
GateDef:
  id: PEG-{1..5}
  phase_id: P{1..5}
  minimum_exit_evidence: []          # list of evidence contracts that must be satisfied (SEED-5)
  gate_mode:                         # per §0b C1 — NOT uniformly blocking
    # gate_mode[risk_class][phase] resolves to: blocking | advisory | silent
    # resolution reads the RATIFIED risk_class (SEED-1 R8), never the raw suggestion
  zf_gate:        { mode: blocking, proof: rerun|hash }   # C3 evidence-at-gate
  threshold_required: bool
  pe_required:    bool               # true only at PEG-3 (decide) by default
  cie_emit:       bool               # true at every PEG
  policy_ref:     POLICY-EVAL        # R4 — the single admission-controller boundary (below)
```

**ANCHOR — gate_mode MATRIX (defaults; reshapeable per deployment within trunk limits):**

| Mechanism | Default mode by risk_class | Hard floor (cannot relax below) |
|---|---|---|
| **Threshold** | blocks entry + P1 (+ scope-change / activation / cross-tenant); advisory elsewhere | blocking at entry, always |
| **ZF / evidence** | blocking at P≥3 on standard/governed; advisory on fast; depth risk-classed | blocking at P4/P5 on governed |
| **PE** | blocking at PEG-3 (decide) only | blocking at PEG-3 on standard+ |
| **CIE** | **never blocks by default — emits + logs**; blocks ONLY on critical/structural findings | never silent (always emits) |

**ANCHOR — R4 POLICY-EVALUATION CONTRACT (admission-controller; ONE boundary; was smeared across SEED-2/6/8):**

```
evaluate(context, policy_version, risk_class, actor, scope, phase, attempted_transition)
  -> { result: PolicyResult, reason_codes[], evidence_required[], audit_payload }
  result   = allow | deny | warn | require_approval | auto_upgrade   # SEED-6 PolicyResult enum
  ENFORCED AT EXACTLY ONE BOUNDARY (the PEG transition). No gate logic anywhere else reads policy.
  records policy_version on every decision (10-non-negotiables) -> audit_payload -> SEED-8 event.
  auto_upgrade fires on core-schema | security | billing | cross-tenant touch (SEED-6 selector rule).
```

**ANCHOR — BLOCKED-MESSAGE structure (every blocker has ONE owner + severity + expiry — 10-non-negotiables):**

```yaml
BlockedMessage:
  gate: PEG-{n}
  result: deny | require_approval
  reason_codes: []           # human-readable, from the policy contract
  owner: <single accountable party>     # exactly one (T1 single-owner)
  severity: P0|P1|P2|P3
  what_unblocks: "<the specific evidence/approval that flips this to allow>"
  expiry: <timestamp>        # blockers age; past-expiry escalates (accountability T4)
```

**RUNG-4 DECISIONS:** **R4** policy contract anchored as a sealed subsection here (admission-controller pattern,
one boundary). gate_mode matrix encodes §0b **C1** (CIE-as-blocker = compliance theater, rejected).

**BUILD HANDOFF (Sonnet):** build GateDef as a meta-model row; implement `evaluate()` as the single admission
controller the orchestrator calls on every PEG transition; PEG enforcement = hook (cannot-advance) + validator
(`validate-journey-gate.mjs`, EXTENDED). Block-test each gate refuses a missing-evidence advance.

**ALIGNS:** JOURNEY-ID-SCHEMA hardwire matrix · §0b C1 + 10-non-negotiables · accountability T1/T4 (single-owner + aging).

---

## SEED-3 — phase → binding map (moats × council × loop)

**ANCHOR:** for each phase, which moats fire, which council type deliberates, which loop emits.

| Phase | Moats fire (M-NN, from JOURNEY-MOAT-MAP) | Council type | Loop emits |
|---|---|---|---|
| **P1 intent** | threshold-router (M-16/M-42) · CAQ class-detect | inner | alignment |
| **P2 audit** | consolidation / precedent (P-META-029) · dep-graph read | inner + expert (on governed) | alignment |
| **P3 decide** | PE scorer (pe-compute) · PCR render · no-lost-threads register | expert (+ external on critical) | optimization |
| **P4 validate** | ZF/IZFC · ripple pass (SEED-4) · simulation (where risk-classed) | inner (+ cross-actor ratify-ZF) | anti-drift |
| **P5 activate-verify-learn** | CIE emit · essence-propagation (PARK-024) · test-drive (PARK-025) | inner + Governor ratify | optimization + anti-drift |

**BUILD HANDOFF (Sonnet):** encode as `wiring_map` bindings in the `journeys` entry (real file paths per moat);
the council-type column drives `escalation`; the loop column drives `cie_pe` emissions.

**ALIGNS:** JOURNEY-MOAT-MAP-S084 · JOURNEY-CONNECTIVITY-AND-COUNCIL-S084 · 3 core loops (JOURNEY-RIPPLE-AND-LOOPS).

---

## SEED-4 — ripple-pass contract + R2 graph contract + circuit-breaker + R2b→SEED-5

**ANCHOR — ripple contract (typed + versioned + severity + concurrency-safe; §0b C4):**

```
ripple(changedNodeId, changeType, graph_version) -> { blastRadius[], updates[], gate, ripple_version }
  TYPED edges  : each edge carries an invalidation_rule (what downstream state it invalidates)
  SEVERITY     : each impacted node tagged P0|P1|P2|P3 — GATE ONLY ON P0/P1 (not the whole matrix)
  SEPARATE     : detect -> compute -> execute (human-confirm between compute+execute on governed)
  SNAPSHOT     : versioned graph snapshot at fire-time; check graph_version before commit (TOCTOU fix)
  CYCLE-DETECT : circular ripple -> FREEZE + surface (loops make circular ripples likely)
```

**ANCHOR — R2 DEPENDENCY-GRAPH CONTRACT (SEED-4 is the only seed operating on INHERITED data, the 518-node graph):**

```yaml
GraphContract:
  owner: <named accountable party for graph accuracy>
  guarantee: "graph is validated CONTINUOUSLY (static-declared edges), NOT inferred at fire-time"
  stale_handling: "if graph snapshot != reality at commit -> ABORT + re-snapshot, never silent-merge"
  circuit_breaker:
    max_depth: <N>           # hard cap on ripple recursion depth
    ttl: <duration>          # ripple->re-run->state-change->ripple is an infinite async loop without this
    on_trip: "FREEZE + surface to owner; do not auto-continue"
```

**ANCHOR — R2b COUPLING (SEED-4 output → SEED-5 input):**

```
SEED-4.blastRadius  ──dictates──▶  SEED-5.scopes_to_rerun
  A ripple invalidates downstream EVIDENCE. SEED-4's blast radius IS the set of SEED-5 live re-runs that
  must fire. They are COUPLED, not independent: ripple(P0/P1) => the invalidated evidence contracts re-run.
```

**RUNG-4 DECISIONS:** **R2** graph contract + max-depth/TTL circuit-breaker anchored. **R2b** SEED-4→SEED-5
binding anchored. **R6** universal-ripple ENGINE is **load-bearing in MVP** (generic from day 1); only the
per-class HANDLERS defer. Prove the pattern on the **3 HARDEST classes**: schema/object-def · validator/policy-rule
· UI/workflow-binding. "Universal ripple" = phased expansion with a defined extension protocol, NOT a simple defer.

**BUILD HANDOFF (Sonnet):** build the generic ripple engine (typed-edge walk + severity tag + snapshot + cycle
detect + circuit breaker) day-1; implement the 3 named handlers; wire `ripple.blastRadius` directly into
`zfGate.scopes` (SEED-5). DONE: a significant change surfaces its full P0/P1 ripple list + blocks until addressed.

**ALIGNS:** JOURNEY-RIPPLE-AND-LOOPS-S084 · §0b C3/C4 · dep-graph (518 nodes) · CIP RIPPLE-QC precedent.

---

## SEED-5 — ZF re-run-at-gate contract (coupled to SEED-4)

**ANCHOR:**

```
zfGate(scope) -> { mode: rerun | hashverify, exit_code, evidence_hash }
  scope        = SEED-4.blastRadius  (R2b — the invalidated evidence dictates what re-runs)
  TIERING RULE :
    cheap / unchanged   -> hashverify  (SHA-bound tracker; pass if hash matches last green)
    high-stakes PEG / ratify / seal / activation -> live re-run (exit_code MUST be 0 THIS session)
  ANTI-NOMINAL : evidence_hash binds the exact tree state; a timestamp-touch or bypass does NOT satisfy it.
  emits exit_code + evidence_hash -> SEED-8 event (policy_version + graph_version stamped).
```

**RUNG-4 DECISIONS:** coupled to SEED-4 per **R2b** (scope comes from blast radius). Encodes ZF ladder #3
(re-run-at-gate + hash-bound evidence — the anti-nominal core) + #1 (advisory→blocking).

**BUILD HANDOFF (Sonnet):** implement `zfGate` over `pnpm verify`; the hashverify tracker reuses the existing
hash-cache pattern (feedback_hash_cache_validators); live re-run path cannot be satisfied by a cached/touched
result. Wire as the `zf_gate` field on every GateDef (SEED-2).

**ALIGNS:** ZF hardening ladder (§0 #1/#3) · RZF-LATEST v1.1 (`verify_top_exit` un-fakeable field) · SEED-4 (R2b).

---

## SEED-8 — event-log + optimistic-concurrency (R3: REUSE AuditEvent AFTER immutability audit)

**ANCHOR — the PRE-CONDITION audit (the gate before reuse; R3):**

```
PRE-CONDITION (Sonnet runs FIRST, before any event wiring):
  Q: Does ANY code path UPDATE or DELETE an AuditEvent row?  (storage-level, not convention)
     - check: RLS policies, Prisma soft-delete (deletedAt), triggers, raw SQL, admin paths.
  IF truly append-only (no UPDATE/DELETE reachable) -> REUSE AuditEvent (entity_type='journey_event').
  IF NOT  -> HARDEN to storage-level immutability (revoke UPDATE/DELETE) OR build a dedicated append-only store.
  This is a STORAGE-level guarantee. "We never update it in app code" is convention, NOT immutability.
```

**ANCHOR — required event fields (the append-only substrate; "done" reproducible from this log):**

```yaml
JourneyEvent:        # entity_type = 'journey_event' on AuditEvent (if audit passes)
  event_id:        uuid            # every event has an id (10-non-negotiables)
  tenant_id:       uuid            # RLS-scoped
  actor_id:        uuid
  causation_id:    uuid            # which event caused this one
  correlation_id:  uuid            # which journey instance / transaction
  idempotency_key: string         # async workers idempotent (10-non-negotiables)
  policy_version:  string          # gate records policy-version (R4)
  graph_version:   string          # ripple records graph-version (R2)
  event_version:   string          # the event schema version
  occurred_at:     timestamptz
  payload:         jsonb
```

**ANCHOR — optimistic concurrency:** every workspace save uses a version/etag check; concurrent write with a
stale version → reject + re-read (no silent last-write-wins). Heavy graph checks run on the explicit PEG
transaction as an async batch commit (§0b C3 — workspace decoupled from registry).

**RUNG-4 DECISIONS:** **R3** — reuse is GATED on the storage-level immutability audit; fields confirmed
(causation/correlation/idempotency/policy_version/graph_version/event_version).

**BUILD HANDOFF (Sonnet):** run the pre-condition audit + PASTE the grep/SQL evidence (no UPDATE/DELETE path)
BEFORE wiring; then reuse-or-harden per the result; add the missing fields; optimistic-concurrency on saves.

**ALIGNS:** AuditEvent (P-ARCH-008 audit-via-triggers) · §0b C3 + 10-non-negotiables · feedback_postgresql_rls.

---

## SEED-9 — definition-versioning + in-flight migration (R1 — the 3/3 external catch)

**ANCHOR — instance↔version binding:**

```yaml
InstanceVersionBinding:    # stamped on every Journey instance at instantiation (SEED-1)
  journey_def:        <version>
  phase_def:          <version>
  gate_def:           <version>
  policy:             <version>     # replay evaluates under THE POLICY IN EFFECT THEN (else the audit log lies)
  selector:           <version>
  evidence_contract:  <version>
  RULE: a running instance NEVER silently inherits a definition edit. It runs its bound versions to terminal.
```

**ANCHOR — the 5-way change classification (what happens to in-flight instances when a def changes):**

```
classifyDefChange(old_def, new_def) -> ChangeClass:
  none                       : cosmetic / non-semantic — in-flight instances unaffected
  advisory                   : in-flight may adopt, surfaced, not forced
  required_before_next_peg   : in-flight must adopt before their NEXT gate transition
  forced_before_activation   : in-flight must adopt before P5 activation (e.g. security/policy fix)
  legacy_continues           : in-flight run to terminal on OLD def; new instances use new def
REPLAY: any audit replay evaluates an instance under its BOUND policy version, never the current one.
```

**RUNG-4 DECISIONS:** **R1** — this entire seed is the 3/3 external addition none of the 6 internal experts
found. Without it, the first edit to a sealed seed = risky backfill OR two incompatible platform versions
running at once.

**BUILD HANDOFF (Sonnet):** stamp the version binding on every `Journey` row at creation; implement
`classifyDefChange` as the gate any definition edit passes through; the replay path reads bound versions.
This is what makes the audit log trustworthy across seed evolution.

**ALIGNS:** SEED-8 (event_version + policy_version stamping) · SEED-1 (instantiation binds versions) ·
§0b C4 (expand→migrate→contract; upstream publishes new version, downstream pinned + flagged).

---

## SEED-7 — loops-report READ-aggregator schema

**ANCHOR — session-close report (READ-ONLY aggregator; writes nothing, derives everything):**

```yaml
LoopsReport:           # surfaced at session-close; pure read over existing registers
  cie_signals:         []   # CIE emissions this session (from SEED-8 events, P5 loop)
  consolidation:       []   # consolidation-expert findings (duplicate/near-duplicate)
  gap_recurrence:      []   # gap-recurrence-register entries with K>=2 (open, no structural fix)
  ripple_backlog:      []   # unaddressed P0/P1 ripple items (from SEED-4)
  moat_drift:          []   # moats whose bound files moved/decayed
  AGGREGATOR CONTRACT: READ-only. It reflects state; it does not mutate it. No write path.
```

**RUNG-4 DECISIONS:** none new — SEED-7 is the L1 health surface (§0b C6: log-first, no dashboard before 30
sessions). It reads SEED-8 events + existing registers.

**BUILD HANDOFF (Sonnet):** build as a read-only aggregator surfaced at session-close (no UI in MVP — structured
log per §0b C6 L1). Reuse existing registers; do not fork new state.

**ALIGNS:** §0b C6 (3-layer health, log-first) · gap-recurrence-register · improvement-register · SEED-8 events.

---

## Cross-seed dependency map (nothing-stands-alone)

```
SEED-6 (selector+enums) ──pre-condition──▶ SEED-1 (instantiate)
SEED-1 ──binds versions──▶ SEED-9 ──stamps──▶ SEED-8 (events)
SEED-1 ──gates per phase──▶ SEED-2 (gate_mode + R4 policy) ──reads ratified risk-class──▶ R8 interface
SEED-2 ──evidence──▶ SEED-5 (zfGate) ◀──scope from blast radius (R2b)── SEED-4 (ripple + R2 graph)
SEED-3 (phase bindings) ──wires──▶ SEED-1.wiring_map
SEED-7 ──reads──▶ SEED-8 events + registers   (READ-only)
R6: universal ripple ENGINE is MVP-load-bearing; 3 hardest handlers prove it.
```

## Authoring ZF gate (this file)
- **Cycle 1 (existence):** 9 seeds authored, each with ANCHOR + RUNG-4 DECISION + BUILD HANDOFF + ALIGNS.
  Every R1–R8 + R2b encoded and tagged. Cross-seed map present. No floating reference (every SEED-N referenced).
- **Cycle 2 (fresh angle — instantiation-order consistency):** re-read for the R7 trap — confirmed SEED-6 is
  read-first and declared SEED-1's pre-condition; SEED-1 `branches` binds AFTER `selectVariant`; no seed assumes
  a variant bound before classification. Confirmed R8 ratified-risk-class is what SEED-2 gate_mode reads (not the
  raw suggestion) in all three places (SEED-1 R8 contract, SEED-2 matrix note, SEED-6 selector return).
- **CROSS-ACCEPT REQUIRED:** these anchors are not sealed until Sonnet audits (STEELMAN-AGAINST) + Governor ratifies.
