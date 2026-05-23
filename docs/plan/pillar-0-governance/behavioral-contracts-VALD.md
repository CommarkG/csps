---
id: csps.pillar-0-governance.behavioral-contracts-vald
name: behavioral-contracts-VALD
description: "B_* contracts governing verification, validation, and zero-findings discipline"
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: behavioral_contracts_vald
batch: BATCH-A
session: S051
impl_status: swift-implemented
diataxis_type: reference
links:
  - { rel: index, href: behavioral-contracts.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Behavioral Contracts — VALD Spine

> **Shard of behavioral-contracts.md.** 10 contracts — VALD spine.
> Index: [behavioral-contracts.md](behavioral-contracts.md) | Split: `pnpm contracts:split`

---

## B_RZF — Real Zero Findings (defect verification, CSP carry-forward S333)

**Canonical wording:**

> Every artifact reaching DONE / COMPLETE / RATIFIED / VALIDATED / CLOSED status emits an
> RZF evidence block: cycles_run + findings_per_cycle + final_status (ZF-0 ACHIEVED Cycle N) +
> coverage (mechanical / semantic / propagation / user-visible-outcome-when-applicable) +
> validators_run + signature. **Re-run IS the proof — fixing is necessary but NOT sufficient.**
> Memory of an earlier validator run ≠ this-session evidence. Cycle count is MEASUREMENT not TARGET.

**Counterweight:**

> When validators are not yet implemented (week 1-4), the manual protocol substitutes for the
> mechanical layer: AI explicitly enumerates the checks performed + their results + the artifact
> scope. The discipline scales down gracefully but cannot be silent-skipped.

**Source:** CSP S333 (treasure #5 EXT-20260502-005); 330+ sessions of evolution; absorbed into CSPS as P-META-006 RZF.

**Anti-patterns:**

- Validator-pass cited without re-run (S132 / S184 / S227 incidents)
- Mechanical-only declared as RZF (S332 — skipping semantic + propagation)
- TOTAL=0 hides sub-findings (S184 — sum is zero; per-check findings hidden)
- Baseline ≠ zero counted as clean (S278)
- Re-run skipped after fix (S132 — fixing necessary not sufficient)
- Cycle count as target (S227 — process-driven not result-driven)
- Compressed RZF under context pressure (defer not compress)
- **False termination declaration (S050):** declaring ZF ACHIEVED in the same cycle as the last finding. A cycle that finds something is NON-TERMINAL. The TERMINATION CYCLE must itself return zero — it re-examines named areas and finds nothing. "ZF ACHIEVED" is valid only when the most recent cycle's own result was zero.
- **Meta-ZF omission (S050):** when running a ZF pass ACROSS the platform (updating all ZF references, auditing all files), the pass itself is subject to ZF. The platform-scan must complete a termination cycle confirming no additional files were missed. A ZF action must use ZF on itself.

**Mechanical surfaces:**
- schema: every-artifact frontmatter requires `evidence_block_ref:` field at lifecycle_state ∈ {validated, closed}
- validator: `rzf-coverage` audit (PR-blocking, error severity, planned week 4)
- hook: PostStop hook auto-emits evidence-block reminder; UserPromptSubmit hook surfaces RZF state
- memory: `feedback_re_run_is_proof.md` + `feedback_zero_findings_cycle_count_is_measurement.md`
- contract: this entry + `principles.yaml#P-META-006`

**SSoT cross-reference:** [completeness-module.md](./completeness-module.md) §2 — B_RZF is Level 1 (Finding Completeness) in the unified completeness framework.

**Enforcement Trio (S041 OPEN-050 declaration):**
- T1 (hook): `.claude/hooks/post-stop-rzf-reminder.sh` — PRODUCTION BLOCKING. Fires after every response, exits 1 if ZF cycles absent from substantive content. The strongest T1 in the platform — fully operational.
- T2 (validator): `tools/validators/validate-directive-has-rzf.mjs` — ADVISORY. Scans Opus directives for RZF evidence. Partially covers the contract. Full T2: blocking validator that scans all responses for nominal ZF (Cycle 2 without naming). Planned OPEN-049.
- T3 (session): `session-open.sh` — "ZF ITERATION AWARENESS" injected every session. "Cycle 2 MUST name what was re-examined."
- **enforcement_tier:** `{ t1: post-stop-rzf-reminder.sh BLOCKING, t2: validate-directive-has-rzf.mjs ADVISORY, t3: session-open ZF mandate, permanence: high-partial → target: high-full with validate-nominal-rzf.mjs BLOCKING }`

---

## B_CEC — Complete Extraction Cycle (value verification, CSPS extension S002 turn 10)

**Canonical wording:**

> Every ratified artifact (principle / leaf / ADR / behavioral contract / pattern / insight / lesson)
> triggers a CEC walk BEFORE the AI moves to the next priority. Distill essence in ONE sentence;
> walk every category in WALK_SCOPE asking "where does the essence apply / enhance / expose-gap?";
> log applied / not-applicable-with-reason / needs-human-judgment per artifact; iterate until same
> cycle returns ZERO new application opportunities. **Walk-trail evidence required.**

**Counterweight:**

> Some new artifacts have minimal cross-application surface (e.g., a one-off bug fix that doesn't
> generalize). For these, the walk completes quickly with most artifacts marked `not_applicable`.
> The rapid walk is itself the evidence — minimum 1 cycle is required even when essence has
> narrow application; the cycle proves the walk happened.

**Source:** User S002 turn 10 directive — explicit positive-branch extension addressing AI's universal failure pattern of "negative-only validation, ignoring complete extraction." Folded into CSPS P-META-006 as the second half of Zero-Findings Discipline.

**Anti-patterns:**

- Negative-only validation (the universal pattern; CEC IS the counter-discipline)
- Run-forward bias (moving to next priority without walking platform for essence-applications)
- Partial-extraction normalized as complete (applying to obvious places; skipping non-obvious)
- Walk-without-iteration (one walk → apply → declare CEC-0 without re-walking on EXTENDED state)
- Premature CEC-0 (declaring "no further opportunities" without explicit walk-trail evidence)
- Essence-extraction unstated (applying without distilling 1-sentence core; future walks miss applications)
- AI-default "moving on" (the dominant failure mode; counteracted only by mechanical CEC-trigger)

**Mechanical surfaces:**
- schema: ratified-artifact frontmatter requires `cec_walk_trail_ref:` field
- validator: `cec-walk-trail-completeness` audit (PR-blocking warn, planned week 4)
- hook: PostStop hook auto-fires CEC walk on session-close for ratified items this session
- memory: `feedback_complete_extraction_required.md` + `feedback_zero_findings_cycle_count_is_measurement.md`
- contract: this entry + `principles.yaml#P-META-006`

**SSoT cross-reference:** [completeness-module.md](./completeness-module.md) §2 — B_CEC is Level 2 (Value Completeness) in the unified completeness framework.
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_QC_AUDIT — QC audit-list discipline (S002 turn 11 operational layer)

**Canonical wording:**

> Every CSPS artifact carries QC-audit metadata (`qc_audit:` frontmatter block); auditable artifacts
> are registered with negative-issue checklists (NEG-* defects) + positive-issue checklists (POS-*
> un-extracted-value); audits run at every artifact ratification + every session close + continuously
> via cron post-runtime. Findings flow to LearningLoopItem; recurrence triggers K=2 auto-ADR.
> The discipline is ambient — embedded in workflows, not bolted-on.

**Counterweight:**

> Some artifacts (generated files / archived legacy) are exempt via grandfather list per CSP S332 X3.C
> precedent. Exemption is explicit + audit-logged; never silent.

**Source:** User S002 turn 11 directive — operationalize P-META-006 RZF + CEC. Builds on CSP S333 carry-forward (treasure #5 EXT-20260502-005).

**Anti-patterns:**

- Silent-skip QC scan at session close
- Treating QC findings as advisory when severity = error/critical
- Force-fitting NEG findings into "fix later" without explicit BLK-* registry entry
- POS opportunities silently dropped (must route to LearningLoopItem or explicitly defer with reason)
- Compressed scan under context pressure (defer don't compress)

**Mechanical surfaces:**
- schema: every-artifact frontmatter `qc_audit:` block (per `qc-audit-system.md` schema)
- validator: `frontmatter-completeness` + 4 zero-findings audits per `audit-runner.md`
- hook: PostStop emits per-session audit summary; UserPromptSubmit surfaces aged findings
- memory: `feedback_re_run_is_proof.md` + `feedback_complete_extraction_required.md` + `feedback_zero_findings_cycle_count_is_measurement.md`
- contract: this entry + `pillar-0-governance/qc-audit-system.md`

**SSoT cross-reference:** [completeness-module.md](./completeness-module.md) §2 — B_QC_AUDIT is Level 4 (Meta-completeness) in the unified completeness framework.
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_CATCH_TO_ENGRAVING — every observed gap MUST produce persistent artifact within the same session (S002 turn 15)

**Canonical wording:**

> When AI notices a trap, gap, anti-pattern, or missing-execution within a session, the noticing alone is wasted unless converted to a persistent artifact BEFORE session close. Required artifact types: memory entry / behavioral contract / AGENTS.md hard NO / hook / protocol amendment / paste-prompt update / schema-gap registry entry. Minimum: memory entry + AGENTS.md hard NO. Optimal per CSP 5-element pattern: schema + validator + hook + memory + contract.

**Counterweight:**

> Some catches are genuinely one-off (typo unique to a doc; not a pattern). For these, AI states explicitly "one-off catch; not engraving because <reason>." Default-to-engrave when uncertain.

**Source:** S002 turn 15 root-cause. Pattern: AI catches gaps mentally → catches decay at session-end → next session re-discovers + re-fails. Specific incident: S002 turn 1 caught parent-CLAUDE.md wrong-workspace trap → did not engrave → S003 turn 1 hit identical trap.

**Anti-patterns:**

- "I'll deal with it later" — later = next session = re-discovery cost
- "I'll add it if it comes up again" — N=1 is enough; N=2 is too late
- "User caught it; user owns the fix" — AI catches → AI engraves
- Surface in closing summary without engraving artifact path
- Single-surface engraving fails per CSP 5-element pattern

**Mechanical surfaces:**
- schema: closing-summary-template.md mandatory header §10.13b "Catches engraved this session"
- validator: `catch-engraving-coverage` audit (PR-blocking warn, planned week 4)
- hook: PostStop scans session log for catch-language patterns + flags un-engraved
- memory: `feedback_catch_to_engraving.md`
- contract: this entry + AGENTS.md hard NO (turn 15)

**SSoT cross-reference:** [completeness-module.md](./completeness-module.md) §2 — B_CATCH_TO_ENGRAVING is Level 3 (Session Completeness — catch completeness) in the unified completeness framework.

**Enforcement Trio (S041 OPEN-050 declaration):**
- T1 (hook): `.claude/hooks/post-tool-use-cec-trigger.sh` — PARTIAL-ACTIVE. Fires when behavioral-contracts.md is modified, triggers CEC walk. Does not yet scan session log for un-engraved catches.
- T2 (validator): No dedicated T2 exists yet. `validate-rule-has-enforcement.mjs` catches PI items without enforcement_trio but not un-engraved catches. Planned: `validate-catch-engraving-coverage.mjs` per audit-runner slug.
- T3 (session): `session-open.sh` — "B_CATCH_TO_ENGRAVING: every gap → persistent artifact within session." Active since S002.
- **enforcement_tier:** `{ t1: post-tool-use-cec-trigger.sh PARTIAL, t2: none (planned validate-catch-engraving-coverage.mjs), t3: session-open mandate, permanence: low-current → target: medium with T2 built }`

---

## B_FIVE_SURFACE_ENGRAVING — every catch produces a 5-surface delta atomically (S002 turn 17)

**Canonical wording:**

> When AI detects a catch (gap / trap / anti-pattern / failure-mode / missing-execution), the 5-Surface Engraving Cycle fires automatically: (1) Detect — catch identified; (2) Classify — pattern / composition / one-off-typo / new-discipline; (3) Design-delta — what each of the 5 surfaces gains; (4) Apply-atomically — all 5 surfaces in same response/commit; (5) Verify-completeness — meta-RZF cycle on the engraving; (6) Emit-evidence-block — FSE evidence in closing summary; (7) Propagate — paste-prompt template + closing-summary-template inherit. The 5 surfaces are: **schema** (frontmatter / ZModel / closed-enum / state-machine / template-required-header) + **validator** (audit-runner / linter / Postgres-trigger) + **hook** (`.claude/hooks/*.sh` PreToolUse / PostToolUse / Stop / PostStop / UserPromptSubmit) + **memory** (`feedback_*.md` + `MEMORY.md` index) + **contract** (`behavioral-contracts.md` § B_* + `AGENTS.md` hard NO + canonical leaf doc + spine matrix row). Below 2 surfaces engraved = single-surface-engraving anti-pattern. Target: 5/5.

**Counterweight:**

> Some catches are genuinely composition-only (a new application of an existing discipline; no new rule). For these, the engraving target is the application-row in spine matrix + ledger entry — the 5 surfaces of the parent rule already exist. The cycle still runs; the apply-atomically step recognizes "no new rule, only new instance" and short-circuits the schema/validator/hook surfaces if they already cover this discipline.

**Source:** S002 turn 17 user directive — "how can you enhance that once a gap or an error is identified permenet prevention and execution will be mechanically triggered. you realize how much value a system that does that gains? to stability? to scalability? ... cutting time and energy towards uniqueness vs other platforms. formalize the 5 surfaces to be included and used in all relevant places". Rooted in CSP S333 5-element pattern (treasure #1) + extended with mechanical trigger + atomic-application + meta-RZF completeness-verification + FSE evidence block. Compounding-returns mechanism = the platform's structural moat.

**Anti-patterns:**

- "I'll engrave it as memory only" — 1/5; anti-pattern
- "Memory + contract is enough" — 2/5; minimal but acceptable only when other 3 are explicitly-deferred-week-4
- Engraving sequentially (memory then later contract) — must be atomic; same response/commit
- Engraving without verifying completeness (no FSE evidence block in closing)
- Engraving below 2 surfaces silently (without explicit deferral note)
- Treating new discipline as one-off-composition (the cycle's classify step short-circuits 5-surface design when it shouldn't)
- Below-2-surface counted as success (CSP S333 demonstrates single-surface-engravings demonstrably fail)

**Compounding-returns math:**

Without discipline: each session re-discovers up to N patterns; cost = N × correction-time per session. With FSE: each catch engraved once; inherited by every future session; cost = 0 from session 2 onward. Across 100 sessions: without = 100×N×cost; with FSE ≈ N×cost (paid once). The ratio improves monotonically as engraving accumulates. CSPS at session 2 already has 33+ disciplines engraved; CSP took 330+ sessions to evolve to RZF. The mechanism IS the moat.

**Mechanical surfaces:**

- schema: closing-summary-template.md §10.13c mandatory `FSE evidence block` header (surfaces_count + per-surface-status + classify-decision + atomic-flag + meta-RZF-result)
- validator: `catch-engraving-completeness` audit (PR-blocking warn — flags surfaces_count < 2) + `single-surface-engraving-anti-pattern` audit (PR-blocking error — flags new disciplines at 1/5) + `audit-of-audits` meta-RZF on engraving registry itself (planned week 4)
- hook: PostStop scans session log for catch-language ("I notice", "gap surfaced", "this is a trap") + verifies 5-surface artifacts; UserPromptSubmit reminder for the catch-cycle 7 stages
- memory: `feedback_five_surface_engraving.md` (S002 turn 17)
- contract: this entry + `pillar-0-governance/five-surface-engraving.md` (canonical spec) + `principles.yaml#P-META-007` + AGENTS.md hard NO (turn 17) + `ai-behavior-spine.md` row + `_handoff/VAULT/closing-summary-template.md` §10.13c

**Enforcement Trio (S041 OPEN-050 declaration):**
- T1 (hook): `.claude/hooks/post-tool-use-cec-trigger.sh` — PARTIAL-ACTIVE. Fires on behavioral-contracts.md edits, triggers CEC walk. Does not yet count surfaces engraved per session.
- T2 (validator): `catch-engraving-completeness` audit — PLANNED week 4. Does not yet exist in pnpm verify. `validate-rule-has-enforcement.mjs` provides partial coverage for new rules.
- T3 (session): `session-open.sh` — "B_FIVE_SURFACE_ENGRAVING: when catch detected → 5 surfaces atomically in same response/commit." Active since S002.
- **enforcement_tier:** `{ t1: post-tool-use-cec-trigger.sh PARTIAL, t2: none-current (catch-engraving-completeness planned), t3: session-open FSE mandate, permanence: low-current → target: medium with T1 surface-count + T2 BLOCKING }`

---

## B_PRE_CLOSE_VERIFICATION — every closing summary RZF block requires §10.0 cycle evidence (S005 turn 19)

**Canonical wording:**

> Before emitting any closing-summary §10.10 RZF / §10.11 CEC / §10.13c FSE evidence block, the AI MUST run `pnpm verify` (orchestrator at `tools/verify.mjs`) and paste the structured stdout into §10.0 of the closing summary. RZF claims without §10.0 cycle evidence are **NOMINAL-not-actual**; latent bugs accumulate silently across sessions until forced collision. Each cycle in §10.0 carries one of three statuses: **PASS** (validator ran, exit 0), **FAIL** (validator ran, exit non-zero — close blocked + BLK-S<NNN>-* surfaced), **DEFERRED-WITH-REASON** (cycle's implementation not yet shipped — week-4 etc. — explicit reason in inline). **Silent skip is forbidden.** Plans (build-order.md week-N + protocols.md §10 + closing-summary-template §10.0 + HANDOFF §17) MUST enumerate cycles per-step in plan text — never context-dependent AI memory.

**Counterweight:**

> Trivial in-flight microsteps (single-line edit / typo fix / linting auto-fix) don't trigger the full cycle; the cycle is the next batch boundary's responsibility. Discipline targets BATCH/STEP/SESSION boundaries where DONE/RATIFIED claims are emitted. The cost of running `pnpm verify` (~30s for the 4 ship-now cycles) is the price; the cost of nominal-RZF accumulating across N sessions is far higher (S005 evidence: 4 latent bugs from S002 turn 17 took 2+ sessions to surface; would have taken N more without the cycle).

**Source:** S005 turn 19 user directive — *"the way we plan thing [most important — make recurring mandatory things specifically written in the plans, not context dependent — make it mechanical]"*. Triggered by S005 turn 18+ verification cycle finding: 4 latent bugs from S002 turn 17 (YAML quote bug + 2 missing enforcer_layers + isMain check) had been carrying ~2 sessions because the validator never ran. Engraves P-META-008 cycle-mandatory-in-plan as the meta-principle; this contract is its session-close instantiation.

**Anti-patterns:**

- **Nominal-not-actual RZF** — emitting "ZF-0 ACHIEVED" RZF block when the cited validator was never run this session (THE meta-pattern this contract exists to cure)
- **Progress-as-completion** — the AI satisfaction point: after findings decrease (from 5 to 2), declaring "ZF improving" or "only advisories remain" as if this is ZF ACHIEVED. IT IS NOT. **ZF ACHIEVED = THE LAST RUN PRODUCING "STATUS: ZF ACHIEVED ✅ — 0 blocking findings." NO OTHER OUTPUT QUALIFIES.** A run with non-zero findings — even if improved — is not ZF ACHIEVED. Memory of a prior run is not ZF ACHIEVED. Citing "ZF Level 3 was achieved earlier this session" without re-running is NOMINAL. (INST-VALD-001)
- **Context-dependent cycle** — plan says "AI should run X"; AI forgets; debt accumulates (P-META-008 anti-pattern)
- **Latent bug because validator never ran** — S002→S005 example: YAML parse failure + missing enforcer_layers latent 2+ sessions; surfaced only because user-directed verification cycle forced it
- **§10.0 empty or missing** — closing summary INCOMPLETE per closing-summary-template required-header rule
- **Silent skip of cycle** — must be PASS / FAIL / DEFERRED-WITH-REASON; "audit-runner not ready" without DEFERRED-WITH-REASON tag = anti-pattern
- **Pre-close cycle ran ON OLD STATE** — must run AFTER all session edits land; cycle on stale tree gives false PASS

**Mechanical surfaces (all 5; per FSE amendment atomic-validator-registration):**

- schema: `_handoff/VAULT/closing-summary-template.md` §10.0 (NEW S005 turn 19) mandatory header with structured YAML schema for cycle evidence
- validator: `pre-close-cycle-coverage` audit (PR-blocking error; planned week-4) + `nominal-rzf-detection` audit (PR-blocking warn; scans session log for RZF blocks not preceded by §10.0 cycle output) — registered atomically in `audit-runner.md` Meta category per FSE amendment
- hook: `.claude/hooks/post-stop-zf-cycle.sh` (planned week-4) — auto-runs `pnpm verify` at session-close; failure prevents close
- memory: `feedback_pre_close_verification.md` (S005 turn 19) — counterweight composes with `feedback_re_run_is_proof.md` (S002 turn 10) — re-run IS the proof; `pnpm verify` IS the re-run mechanism
- contract: this entry + `AGENTS.md` hard NO (S005 turn 19) + `ai-behavior-spine.md` row + `principles.yaml#P-META-008` + `tools/verify.mjs` orchestrator

**SSoT cross-reference:** [completeness-module.md](./completeness-module.md) §2 — B_PRE_CLOSE_VERIFICATION is Level 3 (Session Completeness — pre-close gate) in the unified completeness framework.

**governing_intent:** Ensures session progress is real, not theatrical — only verified improvements compound, and the platform’s promise to the Governor is that every session delivered something provably real.
- **enforcement_tier:** `{ tier: T1+T3, T1 hook: post-stop-pnpm-verify.sh + post-stop-session-close-gate.sh (ACTIVE), no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low-partial }`

---

## B_POSITIVE_VALUE_EXTRACTION — every significant positive event triggers an iterative cycle (S005 turn 20)

**Canonical wording:**

> When a significant positive event occurs in CSPS work — informal insight / user directive / improvement landed / EXT-ID processed / bug fix integrated / AI self-correction / generator or wizard output batch / meta-finding surfaced — the AI MUST iterate cycles to extract maximum value across all relevant artifacts. CEC (Complete Extraction Cycle) is no longer scoped to FORMAL ratifications only (principle/leaf/ADR/contract); its trigger set extends to all significant positive events (per P-META-006 trigger-cadence amendment turn 20). Each triggered cycle emits a structured walk-trail entry in the closing summary §10.11b "Positive value extracted this session" — same shape as CEC: extracted_essence (1 sentence) + cycles_walked + walk_scope + applications_made + not_applicable + needs_human_judgment + signature.

**Counterweight:**

> Trivial events (single-line edit / typo fix / casual comment) don't trigger the full cycle. The discipline targets SIGNIFICANT events where positive value extraction would otherwise be left on the table. Significance is judgment-based but biased toward OVER-trigger — the cost of an unneeded walk-trail entry is small (~5 lines of yaml); the cost of missed-value-because-not-walked is unbounded (insights silently drop; user directives apply to 1 place when they should have applied to 10).

**Source:** S005 turn 20 user directive — *"add it to insight processing — when you handle a significant improvement, go over the whole up in iterative cycles and enhancing all relevant things; use handling gaps and errors but also to see maximum value is extracted when positive things happen — engrave it in our ai behavior and principles and protocols and wizards and make it mechanical in all places so it will be triggered each time"*.

**Why this matters (the gap closed):**

P-META-006 originally framed CEC as firing on FORMAL ratifications. In practice, AI sessions surface MANY positive events that aren't formal ratifications:
- User directives (substantial behavior shift; should walk every place the directive applies)
- Insights surfaced mid-flight (not yet formalized; still applicable platform-wide)
- Bug fixes (the same bug pattern likely exists elsewhere)
- AI self-corrections (the same error likely was made earlier in the session)
- Generator output (the validator should run on the batch; positive-value extraction means cataloging the new artifacts)
- Meta-findings (e.g., S005 §C3.1 — FSE produces dangling refs by default; this should walk all B_* engravings for instances; without B_POSITIVE_VALUE_EXTRACTION the walk doesn't fire)

S005 evidence: when the FSE-produces-dangling-refs meta-finding was surfaced at turn 9, it triggered ONE backfill (the §C3.1 30-ref documentation). It did NOT walk all B_* contracts to identify instances; that would have been the proper CEC walk on the meta-finding. Result: 30-ref backlog documented but not exhaustively traced. This contract corrects that pattern going forward.

**Cycle pattern per event type:**

| Trigger event | Walk scope | Required output |
|---|---|---|
| Significant insight | principles.yaml + behavioral-contracts + memory + AGENTS hard NOs + every active pillar leaf + closing-summary-template | walk-trail entry; apply / extend / cite |
| User directive | principles + protocols + behavioral-contracts + AGENTS + spine matrix + relevant pillar leaves | identify all places it applies; engrave per FSE 5-surface where applicable |
| Improvement landed | similar-pattern detection across platform | apply or document not-applicable-with-reason |
| EXT-ID processed | manual-protocol.md walk + extraction-ledger update + cross-pillar cite | route + extract + walk-trail |
| Bug fix integrated | grep for similar patterns in codebase + docs | apply same fix or document one-off |
| AI self-correction | scan session log for similar errors already made | self-correction walk-trail |
| Generator/wizard output | RZF-style cycle on the produced artifacts | structured cycle output |
| Meta-finding surfaced | walk all places where the same meta-pattern applies | exhaustive instance list + engraving-applied count |

**Anti-patterns:**

- **only-RZF-no-CEC-on-positive-events** — defects walked but positive value left unwalked
- **ratification-only-CEC** — CEC fires only on formal ratifications; informal insights silently drop (the failure mode this contract cures)
- **one-cycle-and-done** — apply to obvious places; declare cycle complete without iterating on the EXTENDED state
- **fuzzy-essence-no-walk** — insight not distilled to 1-sentence; subsequent walks miss applications because essence-statement is too vague
- **closing-summary-§10.11b-empty** — section forbidden empty; either list walks or explicit `NO_POSITIVE_EVENTS_THIS_SESSION` declaration
- **ai-default-moving-on** — the dominant failure mode (AI's universal "ratify, move on" pattern; counteracted only by mechanical trigger)

**Mechanical surfaces (5/5; per FSE atomic-validator-registration amendment):**

- schema: `_handoff/VAULT/closing-summary-template.md` §10.11b (NEW S005 turn 20) mandatory header — every closing summary lists positive-event walk-trails OR explicit NO_POSITIVE_EVENTS declaration
- validator: `positive-value-extraction-coverage` audit (PR-blocking warn; planned week-4) — registered atomically in `audit-runner.md` Catch+Engraving category
- hook: `.claude/hooks/post-stop-positive-cycle.sh` (planned week-4) — scans session log for positive-event language; verifies §10.11b coverage
- memory: `feedback_positive_value_extraction.md` (S005 turn 20) + MEMORY.md index entry
- contract: this entry + `AGENTS.md` hard NO (S005 turn 20) + `ai-behavior-spine.md` row + `principles.yaml#P-META-006` trigger-cadence amendment

**Composes with:**

- `B_PRE_CLOSE_VERIFICATION` — both mandate §10.X sections in closing summary (§10.0 cycles + §10.11b positive walks)
- `B_RZF` + `B_CEC` — same shape; positive-value branch of the same discipline
- `P-META-008 cycle-mandatory-in-plan` — the umbrella that says "cycles in plan text, not memory"
- `B_FIVE_SURFACE_ENGRAVING` — when meta-finding surfaces (cycle output), the walk may identify need for new engraving; FSE applies
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_STRUCTURAL_PREVENTION_DISCIPLINE — enhance system constantly, never patch instance (S006 turn 8 — Q-2 tweak)

**Canonical:** When an enforcement is skipped, late, or partial — fix the STRUCTURE that allowed the skip, not the instance. Every closing-summary §10.0j header captures enhancement proposals from any enforcement gap discovered this session. Silent empty proposals forbidden — explicit `zero_proposals_declaration` with reason required when no gaps found. Philosophy: enhance the system constantly; never settle for low standards + manual recovery.

**Counterweight:** Trivial single-instance gaps that don't recur (typo in one file; unique config drift caused by external tool change) may be fixed-in-place WITHOUT structural enhancement proposal — but MUST be logged in continuous-drift-log with K=1 status. K=2 promotes to mandatory structural fix.

**Source:** S006 turn 8 user directive verbatim (Q-2 tweak) — "if an enforment was skipped system will mandatory find enhacement to prevent this from happening. the philosophy is to enhance the system constantly".

**Anti-patterns:**
- silent-skip-of-enhancement-scan (§10.0j header missing or zero_proposals without explicit declaration)
- patch-the-instance-without-structural-fix (recurring pattern fixed only in current instance)
- low-standards-acceptance (settling for "we'll fix it later" instead of system enhancement)
- K2-recurring-pattern-not-promoted-to-engraving

**Mechanical surfaces (5/5 declared S006 L2):**
- schema: [closing-summary-template.md §10.0j](../_handoff/VAULT/closing-summary-template.md) — mandatory header with proposal schema + zero_proposals_declaration discipline
- validator (atomic registration): `enhancement-proposal-coverage` + `structural-fix-vs-instance-fix-discipline` (impl week-4)
- hook: `.claude/hooks/post-stop-enhancement-scan.sh` (week-4)
- memory: [feedback_structural_prevention_discipline.md](C:\Users\finky\.claude\projects\c--Users-finky-Desktop-Claude-Code-Csps\memory\feedback_structural_prevention_discipline.md)
- contract: this entry + AGENTS.md hard NO + spine matrix row + `principles.yaml#P-META-019` + element-reviews place

**Cross-references:** P-META-019 / P-META-007 (FSE — the structural-fix surfaces typically span all 5) / P-META-013 (HPFA — checks engraving completeness; this contract makes gaps surface as enhancements) / P-META-016 (gradual-build absorbs structural enhancements as new topic-plan candidates) / P-META-006 (RZF — structural fix discipline IS RZF applied to enforcement coverage).

**Enforcement Trio (S041 OPEN-050 declaration):**
- T1 (hook): None declared yet. Ideal T1: PostStop hook that detects instance-patch language ("fixed this case", "patched here") without accompanying structural fix. Would flag "patch-without-structure" pattern. (OPEN-049 candidate)
- T2 (validator): `enhancement-proposal-coverage` — PLANNED week 4. Not yet in pnpm verify. `structural-fix-vs-instance-fix-discipline` — PLANNED. `validate-rule-has-enforcement.mjs` catches rules without enforcement_tier.
- T3 (session): `session-open.sh` — "B_STRUCTURAL_PREVENTION_DISCIPLINE: when enforcement skipped → fix STRUCTURE not instance." Active since S006.
- **enforcement_tier:** `{ t1: none (planned patch-detector PostStop hook), t2: none (enhancement-proposal-coverage planned), t3: session-open structural-fix mandate, permanence: low-current (T3-only) → target: medium with T1 patch-detector + T2 BLOCKING }`
- **AI deep instruction:** This contract is itself an example of DEFAULT-ME-1: it was declared in S006 as a fully-documented rule. But it has T3-only enforcement. A rule about fixing structures, lacking structural enforcement — the deepest irony in the platform. Adding enforcement_tier to this contract IS the structural fix.

---

---

## B_DONE_RIGHT_FROM_THE_START — verification is evidence, not the mechanism that creates quality (S037 P-OPER-002)

**Canonical:** Verification confirms quality already achieved — it does not create quality. Before building, specify HOW the result will be correct: wiring checklist, DONE criterion, validation path. Build to the specification; run verify as evidence not as a discovery/fix loop. The sequence is: understand → specify → build correctly → verify evidence. NOT: build → verify → patch → verify → patch.

**Governing intent:** Every `pnpm verify exit 1` followed by patching rounds is a signal that the specification was under-determined before building. The fix is earlier specification, not faster iteration. Quality is a design property, not a testing property.

**Composes with:** B_PRE_CLOSE_VERIFICATION (verify evidence must be THIS-SESSION, not memory) + P-ARCH-031 (DONE = wired + called + verified) + P-META-008 (ZF cycle discipline). P-OPER-002 is the philosophy that makes B_PRE_CLOSE_VERIFICATION pass on the first attempt rather than requiring iteration.

**Anti-patterns:**
- Writing code then running verify to "see what's wrong" — spec first, then build
- Treating verify failures as normal build output rather than specification failures
- Iterating patch → verify → patch as the primary quality mechanism

**Source:** OPUS-2 Turn 80 | Ratified 2026-05-16 by Governor (yariv). P-OPER-002 in principles.yaml.

**Mechanical surfaces (2/5 declared S037):**
- memory: `feedback_done_right.md` (survives chat moves)
- principle: P-OPER-002 in principles.yaml
- **enforcement_tier:** `{ tier: session-only, no-hook, no-validator, T3 session-open injection + AGENTS.md hard-NO, permanence: low (T3-only) }`

---

## B_DEFINITION_BEFORE_ENFORCEMENT

**Governing intent:** When enforcement of a rule is failing, sharpen the rule's definition before adding mechanism. A precisely defined rule is self-enforcing. An imprecise rule only accumulates complex scaffolding around the same void.

**Training default being overridden:** "When enforcement fails, add more hooks, validators, and patterns around it."

**Satisfaction point being prevented:** "I have wired T1+T2+T3 → the rule is enforced." When the definition is soft, pattern-matching satisfies all three tiers without closing the gap.

**The test:** Write a single-line validator. If it passes or fails definitively with no judgment call — the definition is precise enough. If it requires reasoning — sharpen the definition first.

**S049 sample (canonical):**
- Problem: inline ZF cycles were nominal — "ZF ACHIEVED" declared by writing the format
- Proposed: rewrite hook to check for validator names + inner-defaults entry + multiple surfaces
- Applied: 4 lines to session-open defining two valid ZF types and what makes a cycle real
- Result: existing hook became meaningful because the definition it checks is now precise

**Applied rule:** Before proposing a new hook or validator, ask: "Is the definition imprecise?" If yes, sharpen it. The enforcement mechanism may already exist.

**Enforcement:**
- T1: `user-prompt-submit-ai-profiler.sh` CAQ MODE — "add enforcement" proposals trigger Scope-3: "is the definition precise first?"
- T2: inherits from `validate-rule-has-enforcement.mjs` (B_STRUCTURAL_PREVENTION)
- T3: This entry + session-open injection

**Ratified:** S049 | **Related:** B_STRUCTURAL_PREVENTION, AP-004, P-META-019
