---
id: csps.governance.zero-findings-discipline
name: zero-findings-discipline
description: The CSPS Zero-Findings Discipline — umbrella for two compositional disciplines that together convert "I think it's done" into "evidence shows it's done + maximally extracted". RZF (Real Zero Findings — defect verification) absorbed verbatim from CSP S333 (330+ sessions of evolution); CEC (Complete Extraction Cycle — value verification) is the CSPS extension addressing AI's universal failure pattern of negative-only validation. Both share cycle-count-is-measurement + re-run-is-proof + evidence-based-completion mechanics. Mandatory at every principle ratification, every leaf migration, every batch close, every chat boundary.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
  - security
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: enforcement-architecture, href: ./mechanical-enforcement.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: spine, href: ./ai-behavior-spine.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: source-csp, href: ../_intake/processed/EXT-20260502-005-rzf-discipline-from-csp/raw.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Zero-Findings Discipline — RZF + CEC

> **The cost of ONE false-clean is far greater than the cost of N validator runs. Mechanical re-execution is the only proof that holds.** — CSP S333 (treasure #5 EXT-20260502-005)

> **AI systems are programmed to: avoid audit and run forwards / be satisfied with partial results / declare done when not done / focus on negative validation and ignore complete extraction. The cure is making complete extraction mechanical.** — User S002 turn 10

## What this document locks

The umbrella discipline binding two compositional sister-disciplines that survive across sessions, vendors, and AI assistants:

- **RZF (Real Zero Findings)** — defect verification: re-run validators / scans / cross-checks until ZERO new findings across all check types. Adopted verbatim from CSP S333 (330+ sessions of evolution).
- **CEC (Complete Extraction Cycle)** — value verification: when a new principle / insight / pattern / lesson emerges, walk the platform asking *"where does the essence of this enhance other elements?"* until ZERO new application opportunities surface. CSPS-specific extension addressing AI's universal failure pattern of negative-only validation.

Both are **mandatory** at:
- every principle ratification
- every leaf migration
- every batch close
- every chat boundary
- every artifact reaching DONE / COMPLETE / RATIFIED status

## The shared mechanics (RZF + CEC)

| Mechanic | RZF | CEC |
|---|---|---|
| **Cycle structure** | Re-read scope → run checks → log findings → fix → return to step 1 | Walk platform asking essence-application question → log opportunities → apply → return to step 1 |
| **Cycle count** | MEASUREMENT not TARGET (1 cycle returning zero = done; 11 cycles to reach zero = also done) | Same — count is data not goal |
| **Termination condition** | Same cycle returns 0 defects across all check types | Same cycle returns 0 new application opportunities |
| **Evidence required** | Cycle output (findings_count + coverage tokens + timestamp) | Walk-trail (each leaf scanned + decision: applied / not-applicable / declared-novel) |
| **Forbidden** | Declaring done after FIX without re-running | Declaring extracted after some-application without re-walking |
| **Re-run IS the proof** | Re-execute validators on the FIXED artifact | Re-walk platform on the EXTENDED knowledge |

## RZF — Real Zero Findings (defect verification)

Adopted from CSP S333 verbatim. CSPS adapts the 4 check types per the Csps porting guide.

### The 4 check types (CSPS extends CSP's 3 with USER-VISIBLE OUTCOME)

#### MECHANICAL

**What:** run all relevant automated checks — validators, linters, type-checkers, schema parsers, structural-integrity scripts. Capture exit codes + findings counts.

**Sufficiency test:** every check returned `findings_count = 0` AND every exit code = 0.

**CSPS implementation (planned week 4 audit-runner):** the 47+ audit checks across 11 categories per `audit-runner.md`. Each registered audit has structured exit code + findings count. Findings auto-write to (planned) `findings_pipeline.json`.

#### SEMANTIC

**What:** verify references resolve, field parity holds across schema/validator/contract layers, cross-file consistency makes sense to a fresh reader. The "does it cohere?" check.

**Sufficiency test:** every cross-reference resolves; schema fields named in validator code exist in schema files; contract description matches validator behavior.

**CSPS implementation:** anchor-before-synthesis discipline (per CSP convention) — every substantive claim backed by verbatim quote of source. Per-file: read end-to-end + verify field references + cross-link consistency.

#### PROPAGATION

**What:** grep changed terms / new contracts / new validators across the entire repo. Verify all expected places reference + zero stale references to removed/renamed.

**Sufficiency test:** new term surfaces in every place it should; zero stale references to removed/renamed surface.

**CSPS implementation:** at every leaf migration / contract addition / vocabulary change, run `grep -ri` across the docs+code tree + audit `vale-prose` + `eslint-naming` + `glossary-codegen-fresh`.

#### USER-VISIBLE OUTCOME (CSPS-specific 4th type, per Csps porting guide)

**What:** for customer-facing changes, verify the change ACTUALLY changes user experience as intended.

**Sufficiency test:** human screenshot OR sub-agent verification confirms user can perform intended action; outcome holds 5+ minutes (time-stable).

**CSPS implementation:** per the dashboard plan, every change to `apps/admin/*` or customer-facing surfaces in apps/<scope>/<name>/ requires this fourth check.

### The RZF cycle structure

```
SCOPE_DEFINED
    ↓
RUN_MECHANICAL (validators + linters + type-checks)
    ↓
RUN_SEMANTIC (cross-ref + field parity)
    ↓
RUN_PROPAGATION (grep + stale-ref + impact)
    ↓
RUN_USER_VISIBLE_OUTCOME (when applicable)
    ↓
COLLECT_FINDINGS
    ↓
[findings > 0] → FIX_FINDINGS → RETURN_TO_RUN_MECHANICAL (new cycle)
    ↓
[findings == 0] → ZF-0_DECLARED + EVIDENCE_BLOCK_EMITTED
    ↓
ARTIFACT_PUSHABLE
```

**Forbidden transitions:**
- COLLECT_FINDINGS → ARTIFACT_PUSHABLE without ZF-0 declaration
- FIX_FINDINGS → ZF-0_DECLARED without RETURN_TO_RUN_MECHANICAL re-execution
- ZF-0_DECLARED without EVIDENCE_BLOCK_EMITTED

### Evidence block format (every ZF-0 declaration emits)

```yaml
ZF VALIDATION:
  cycles_run: <integer>
  findings_per_cycle:
    - cycle_1: <integer>
    - cycle_2: <integer>
    - ...
    - cycle_N: 0
  final_status: ZF-0 ACHIEVED Cycle N
  coverage:
    mechanical: <bool>
    semantic: <bool>
    propagation: <bool>
    user_visible_outcome: <bool>          # CSPS 4th type, when applicable
  validators_run: [<list of validator names + exit codes + findings_count>]
  artifacts_audited: [<list of files / scope IDs / commits>]
  signature: <session-id + timestamp>
```

## CEC — Complete Extraction Cycle (value verification)

The CSPS-specific extension. Addresses the user-stated AI failure pattern: *"focus on validation of negative aspect !! and ignore Complete extraction."*

### What CEC asks

When a new artifact is ratified (principle / pattern / insight / lesson / contract / leaf doc):

> **"Where does the essence of this enhance other elements of the platform? Where does it expose a previously-unsurfaced gap? What existing artifacts now warrant update / consolidation / supersession?"**

Walk the platform iteratively. Every iteration produces a list of application opportunities. Apply each. Re-walk. Continue until same cycle returns ZERO new opportunities.

### The CEC cycle structure

```
NEW_ARTIFACT_RATIFIED
    ↓
EXTRACT_ESSENCE (what is the core insight / mechanism / lesson?)
    ↓
WALK_PLATFORM_ITERATION_N
    ↓ (for each artifact in CSPS scope: principles.yaml / pillars / vault / intake / contracts / memory)
    │
    ├─→ ASK: does the essence apply / enhance / expose-gap here?
    │   ├─→ YES → log as application_opportunity
    │   ├─→ NO → log as not_applicable_with_reason
    │   └─→ UNCLEAR → log as needs_human_judgment
    ↓
COLLECT_OPPORTUNITIES
    ↓
[opportunities > 0] → APPLY_EACH → RETURN_TO_WALK_PLATFORM_ITERATION_N+1
    ↓
[opportunities == 0] → CEC-0_DECLARED + WALK_TRAIL_EMITTED
    ↓
ARTIFACT_FULLY_EXTRACTED
```

**Forbidden transitions:**
- COLLECT_OPPORTUNITIES → ARTIFACT_FULLY_EXTRACTED without CEC-0 declaration
- APPLY_EACH → CEC-0_DECLARED without RETURN_TO_WALK re-execution
- CEC-0_DECLARED without WALK_TRAIL_EMITTED

### CEC walk-trail format (every CEC-0 declaration emits)

```yaml
CEC VALIDATION:
  ratified_artifact: <path or ID of the ratified thing>
  extracted_essence: |
    <one-paragraph distillation of the core insight / mechanism / lesson>
  cycles_walked: <integer>
  opportunities_per_cycle:
    - cycle_1: <integer>
    - cycle_2: <integer>
    - ...
    - cycle_N: 0
  final_status: CEC-0 ACHIEVED Cycle N
  walk_scope:
    - principles.yaml: scanned
    - pillar-0/*.md: scanned (10 leaves)
    - pillar-1/*.md: scanned (9 leaves)
    - pillar-2/*.md: scanned (4 leaves)
    - pillar-3/*.md: scanned (5 leaves)
    - _handoff/VAULT/*.md: scanned
    - _intake/*.md: scanned
    - behavioral-contracts.md: scanned
    - ai-behavior-spine.md: scanned
    - memory/*.md: scanned
  applications_made: [<list of paths-modified + diff summary>]
  not_applicable: [<list of paths-scanned-but-no-application + reason>]
  needs_human_judgment: [<list of paths flagged for user decision>]
  signature: <session-id + timestamp>
```

### Why CEC is necessary (not just RZF)

RZF catches defects. CEC catches **un-extracted value**.

The user's directive surfaces a real AI failure pattern: when a new principle/insight emerges, AI defaults to "ratify it, move on." This leaves value-extraction incomplete:
- Principle X ratifies for problem A
- Principle X also applies to problems B, C, D — but AI doesn't notice unless explicitly asked
- Sessions later, B/C/D resurface as new "discoveries" or remain blind spots

CEC mechanically forces the walk. The discipline is: **after ratification, before "moving on", run CEC**.

This is the positive-branch counterpart to RZF's negative-branch defect verification. Together they form Zero-Findings Discipline: zero defects AND zero un-extracted value.

## When the disciplines fire (mandatory triggers)

| Trigger | RZF fires? | CEC fires? | Why |
|---|---|---|---|
| Every principle ratification | YES | YES | New principle → defect-check + propagation walk |
| Every leaf migration | YES | YES (if new patterns) | Migrated content → defect-check + check whether the migration surfaces new applicability for other leaves |
| Every batch close | YES | YES (if batch ratified new artifacts) | Per CSP CC-051 D-2 + CSPS extension |
| Every chat boundary (close + open) | YES (per protocols.md §17 handshake) | YES (per CEC walk-on-fresh-input at session-open) | Catch under-reporting + surface un-applied opportunities |
| Every ADR landing | YES | YES | New ADR → both branches |
| Every external input ratified into platform | YES | YES | Treasures fall here |
| Every behavioral contract addition | YES | YES | Contract change → propagation walk + defect verification |
| Every audit-runner check addition | YES | (NO — CEC is for value, audits are mechanism) | Audit-of-audits per CSP precedent |
| Mid-session before commit | YES | NO (commit is sub-batch; CEC fires at batch boundary) | Catches commits that would land broken |
| Manual user invocation ("DEEP ZF" / "CEC walk") | YES (DEEP ZF) | YES (CEC walk) | Trigger phrases per protocols.md |

## Composition with sister disciplines

Zero-Findings Discipline does NOT operate alone. It composes:

| Sister discipline | How it composes with RZF + CEC |
|---|---|
| **B_DONE** | RZF/CEC provide the EVIDENCE that B_DONE requires for any ✓/PASS/COMPLETE claim |
| **B_TWO_SIDED_HANDSHAKE** (S002 turn 6 + CSP) | RZF runs at session close; verbatim output captured to `S{N}_close-validator-snapshot.md`; opening AI re-runs + diffs |
| **P-META-004 Stewardship** | RZF detects regressions (BUILT-but-surface-missing); stewardship tracks pending state |
| **P-META-005 Learning Loop** | CEC walks integrate with K=2 recurrence — if CEC surfaces same essence-application 2× within 90 days, auto-creates ADR for permanent enhancement |
| **B_FIVE_PLACES_PRESENCE** (CSP carry-forward) | CEC verifies all 5 surfaces (schema/validator/hook/memory/contract) were considered when ratifying class-level disciplines |
| **B_CRITICAL_REVIEW** | RZF + CEC give AI the obligation to challenge its own "I think it's clean / extracted" claims |
| **Mechanical Enforcement Decision Framework** | RZF cycle data feeds Gate 3 PERMANENCE check (5+ ADVISORY clean cycles + 0 FP before FAIL_CLOSED ratchet) |
| **B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK** (S002 turn 7) | CEC surfaces existing applicable artifacts BEFORE invention |
| **B_CHECK_EXISTING_DECISIONS_FIRST** (S002 turn 7) | CEC's walk IS the existing-decisions check applied recursively |

## Anti-patterns this discipline resists

### RZF-specific anti-patterns (from CSP S333)

1. **Validator-pass cited without re-run** — "I think it's clean based on the earlier run" (S132 / S184 / S227)
2. **Mechanical-only declared as RZF** — ran validators; skipped semantic + propagation (S332)
3. **TOTAL=0 hides sub-findings** — sum is zero but individual checks have YELLOW/RED (S184)
4. **Baseline ≠ zero counted as clean** — "all expected" without explicit acknowledgment (S278)
5. **Re-run skipped after fix** — "I fixed it, moving on" (S132)
6. **Cycle count as target** — "Run 3 cycles regardless of findings" (S227)
7. **Compressed RZF under context pressure** — defer to next session, do NOT compress

### CEC-specific anti-patterns (CSPS S002 turn 10)

8. **Negative-only validation** — checking "is this defect-free?" without asking "is this maximally extracted?"
9. **Run-forward bias** — moving to next priority without walking platform for essence-applications
10. **Partial-extraction normalized as complete** — applying essence to 2 obvious places + declaring done while 5 non-obvious places remain unchecked
11. **Walk-without-iteration** — one walk produces N opportunities; AI applies them; declares CEC-0 without re-walking on the EXTENDED state
12. **Premature CEC-0** — declaring "no further opportunities" without explicit walk-trail evidence
13. **Essence-extraction unstated** — applying without explicitly distilling the core insight; subsequent walks miss applications because the essence-statement is fuzzy
14. **AI-default "moving on"** — the dominant failure mode; counteracted only by mechanical CEC-trigger at every ratification

## Anti-patterns checklist (printable, before declaring ZF-0 OR CEC-0)

Before any declaration, AI must verify NONE of these apply:

**RZF checklist:**
- [ ] I am citing a remembered validator output rather than this-session re-run
- [ ] I ran some validators but skipped others "because they're not relevant"
- [ ] I summed findings to TOTAL=0 without checking per-check coverage
- [ ] I treated baseline non-zero as "expected" without explicit user acknowledgment
- [ ] I fixed findings but did not RE-RUN the cycle
- [ ] I declared mechanical-clean as "RZF" without semantic + propagation
- [ ] I am under context pressure and considered compressing the cycle

**CEC checklist:**
- [ ] I distilled the essence in <1 sentence (forces clarity; fuzzy essence = bad walks)
- [ ] I walked every category in WALK_SCOPE explicitly (not "I think I covered it")
- [ ] I logged each artifact's status: applied / not-applicable-with-reason / needs-human-judgment
- [ ] I re-walked AFTER applying the first round of opportunities
- [ ] I am not silently moving on to next priority
- [ ] I am not normalizing partial extraction as "good enough"
- [ ] I am surfacing opportunities even when applying them adds scope (the user pushed back on this in S002 turn 10 — applying is not optional)

If any box checked: STOP. Either re-run cleanly OR defer to next session with explicit BLK-* registry entry. Compressed Zero-Findings Discipline is worse than no Zero-Findings Discipline.

## Implementation in CSPS — what's mechanical now vs week 4+

### Mechanical now (S002 close)

- **AGENTS.md hard NOs** binding both disciplines (3 new NOs added S002 turn 10)
- **behavioral-contracts.md** entries for B_RZF + B_CEC
- **principles.yaml#P-META-006** registers the umbrella discipline with full enforcer map
- **ai-behavior-spine.md** discipline matrix has 2 new rows for B_RZF + B_CEC
- **Memory entries** at `~/.claude/projects/.../memory/feedback_re_run_is_proof.md` + `feedback_complete_extraction_required.md` + `feedback_zero_findings_cycle_count_is_measurement.md`
- **protocols.md §10** mandates RZF + CEC at session close
- **manual-protocol.md** triggers CEC at every new-principle / new-leaf ratification
- **proactive-completion.md F9** adds CEC walk as 9th forcing function (extends F8 Discovery-queue review)

### Mechanical post-runtime (week 4+)

- **`audit-runner.md`** registers `rzf-coverage` audit (PR-blocking, error severity) — every artifact reaching DONE has an evidence block; missing = fail
- **`audit-runner.md`** registers `cec-walk-trail-completeness` audit (PR-blocking, warn severity) — every ratified principle / leaf has a CEC walk-trail; missing = warn
- **`audit-runner.md`** registers `audit-of-audits` (per CSP precedent) — verify the audit registry itself is healthy
- **PostStop hook** auto-fires CEC walk on session end (in addition to learning-loop-extract)
- **UserPromptSubmit hook** surfaces RZF + CEC state at session-open (banner: "open ZF-pending: N items / open CEC-walks: M items")
- **Dashboard** `/admin/intake/rzf` page surfaces cycle counts + findings trends per artifact (extension to dashboard-plan.md)
- **`tools/rzf-cycle-runner.ts`** orchestrates the full cycle (run validators → collect → fix → re-run → emit evidence block)

## CEC application TO THIS DOC — Cycle 1 walk-trail

Per the discipline this doc proposes, the AI ran a CEC walk on the input EXT-20260502-005 at intake time. The 12 findings + applications:

| # | CSPS artifact | Application made |
|---|---|---|
| 1 | `principles.yaml` | Add P-META-006 Zero-Findings Completion (this turn) |
| 2 | `behavioral-contracts.md` | Add B_RZF + B_CEC + B_DONE-extension entries (this turn) |
| 3 | `ai-behavior-spine.md` | Add 2 discipline rows (this turn) |
| 4 | `proactive-completion.md` | Add F9 CEC propagation cycle (this turn) |
| 5 | `manual-protocol.md` | Add CEC step at every ratification trigger (this turn) |
| 6 | `_handoff/VAULT/protocols.md` §10 | Add RZF mandatory before close (this turn) |
| 7 | `AGENTS.md` | Add 3 new hard NOs (this turn) |
| 8 | `learning-loop.md` | Document CEC propagation events flowing into K=2 detection (this turn) |
| 9 | `stewardship-protocol.md` | Document RZF cycle counts as state-transition metadata (this turn) |
| 10 | `validation-pass-S002.md` template | Future passes include RZF + CEC coverage column |
| 11 | `audit-runner.md` | Add `rzf-coverage` + `cec-walk-trail-completeness` audit kinds |
| 12 | `dashboard-plan.md` | Add `/admin/intake/rzf` page surfacing cycle counts + findings trend |

Cycle 2 (after applications): re-walk the same scope with the EXTENDED state. Cycle 2 will surface any new findings from the cross-references created in Cycle 1.

**Cycle counts will be reported in this turn's closing summary** (per RZF evidence-block format).

## Why this discipline cuts at AI's universal failure pattern

The user's S002 turn 10 directive explicitly named four AI failures:

1. **Avoid audit and run forwards** — RZF mechanically prevents (re-run is proof)
2. **Be satisfied with partial results** — RZF cycle-count-is-measurement + CEC complete-walk prevent
3. **Declare done when not done** — B_DONE composition + RZF evidence block prevent
4. **Focus on negative validation, ignore complete extraction** — CEC IS the answer to this; the user's literal framing

These four failures are NOT CSPS-specific or even Claude-specific. They are universal AI defaults. Mechanical enforcement is the only durable counter.

## S005 amendments — extended trigger set + B_POSITIVE_VALUE_EXTRACTION + B_PRE_CLOSE_VERIFICATION

User S005 turn 19-22 surfaced two structural failure modes the original P-META-006 framing didn't fully cover:

### Failure mode A — Nominal-not-actual RZF (S005 turn 18-19)

Even with the original RZF discipline, RZF claims could be NOMINAL (validator cited but never re-run this session). Latent bugs accumulate silently across N sessions. Demonstrated S002→S005: YAML quote bug + 4 missing enforcer_layers + isMain bug latent ~2 sessions because validator never ran.

**Cure:** [`B_PRE_CLOSE_VERIFICATION`](./behavioral-contracts.md#B_PRE_CLOSE_VERIFICATION) + [P-META-008 cycle-mandatory-in-plan](../../../packages/principles/principles.yaml). Plans (closing-summary-template §10.0 + protocols.md §10 + build-order.md per-week) MUST enumerate cycles in plan text — never context-dependent AI memory. The orchestrator [`tools/verify.mjs`](../../../tools/verify.mjs) runs cycles mechanically; § 10.0 captures structured evidence; nominal-RZF is mechanically impossible.

### Failure mode B — Ratification-only-CEC (S005 turn 20-22)

CEC's original trigger set was FORMAL ratifications only (principle / leaf / ADR / behavioral contract / pattern / insight / lesson). Informal positive events (insights surfaced mid-flight / user directives / improvements landed / EXT-IDs / bug-fixes / AI self-corrections / generator-output / meta-findings) didn't trigger systematic walk → value left on the table.

**Cure:** [`B_POSITIVE_VALUE_EXTRACTION`](./behavioral-contracts.md#B_POSITIVE_VALUE_EXTRACTION) + extended P-META-006 trigger-cadence. The `mandatory_at` config now includes 8 new positive-event triggers in addition to the original ratification triggers. Closing-summary §10.11b "Positive value extracted this session" mandatory header captures walk-trails. The discipline composes with:

- **manual-protocol.md step 6c** — every EXT-ID processed triggers the cycle (intake-time positive event)
- **proactive-completion.md F9** — 9th forcing function (positive-event branch parallel to F1-F8 defect-recurrence)
- **learning-loop.md** — positive-events fire walk; K=2 mechanism backstops opportunity-recurrence
- **stewardship-protocol.md** — state transitions that represent positive progress fire the cycle
- **generators.md** — generator/wizard output batches trigger RZF + walk-trail in §10.11b

### Failure mode C — Partial-extraction-self-cured-by-cycling

The S005 turn 22 self-audit surfaced this one: even with the discipline engraved, AI declared B_POSITIVE_VALUE_EXTRACTION "done" after 5-surface engraving + did NOT walk to manual-protocol / proactive-completion / learning-loop / stewardship / generators. The user-prompted re-walk found 5 missing-reference files; cycle-2 found 1 more (this very leaf — zero-findings-discipline.md). The fix is meta-recursive: **the cure for partial-extraction is iterating cycles until the same cycle returns 0 new opportunities, not declaring done after the first walk**.

This S005 turn 22 amendment is cycle 3 on the B_POSITIVE_VALUE_EXTRACTION engraving itself; cycle 4 (next) verifies zero new opportunities.

## Sources

- [CSP S333 RZF discipline doc](../_intake/processed/EXT-20260502-005-rzf-discipline-from-csp/raw.md) — verbatim treasure #5
- [CSP B_DONE / `07_BC_BUILD.md`](https://github.com/CommarkG/core-sights-platform/blob/main/.claudecode/planning-vault/07_BC_BUILD.md) — done = evidence
- [CSP CC_ABSORPTION_PROTOCOL Batch 4 ZF VALIDATION](https://github.com/CommarkG/core-sights-platform/blob/main/.claudecode/planning-vault/CC_ABSORPTION_PROTOCOL.md) — cycle structure
- [pillar-0/mechanical-enforcement.md](./mechanical-enforcement.md) — defense-in-depth + 5-element pattern
- [pillar-0/learning-loop.md](./learning-loop.md) — K=2 forcing function CEC composes with
- [pillar-0/stewardship-protocol.md](./stewardship-protocol.md) — lifecycle_state RZF cycles inform
- [pillar-0/ai-behavior-spine.md](./ai-behavior-spine.md) — discipline matrix this doc adds rows to
- [pillar-0/behavioral-contracts.md](./behavioral-contracts.md) — B_RZF + B_CEC live there
- [_intake/proactive-completion.md](../_intake/proactive-completion.md) — F9 CEC integrates
- User S002 turn 10 directive — CEC framing + mechanical-not-memory mandate
