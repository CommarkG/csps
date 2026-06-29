---
id: csps.handoff.opus-s089-prevention-learning-principles
name: OPUS-S089-PREVENTION-LEARNING-PRINCIPLES
description: >
  Opus S089 extraction of the core principles surfaced this tab that follow the full chain:
  PREVENTION -> LEARNING LOOP -> HARDWIRED PROCESS -> MEASURABLE RESULT. Honest status per principle
  (built+measurable now vs designed vs parked). Plus the meta-standard: a principle is not complete
  until it ends in a hardwired process that produces a measurable result.
version: "1.0"
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
schema_anchor: handoff_files
diataxis_type: explanation
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
session: S089
---

# Prevention + Learning-Loop Principles (S089 extraction)

## THE META-STANDARD (the lens itself)
A principle is NOT complete until it ends in a HARDWIRED process (T1 hook / T2 validator — not
T3-only memory) that produces a MEASURABLE result. "Wrote the rule" = 0%. "In AGENTS.md" = T3 =
fades. "Advisory validator" = visibility, not enforcement. DONE = the metric moves + the gate blocks.
This standard is itself the highest-value principle; everything below is measured against it.

## THE PRINCIPLES (prevention -> loop -> hardwired -> measurable | honest status)

| Principle | Prevents | Learning loop | Hardwired as | Measurable result | Status |
|---|---|---|---|---|---|
| DONE = ACTIVATION-PROVEN (EXISTS!=ACTIVE) | nominal-done; dead mechanisms | build -> activation block-test -> fix -> retest to 0-nominal | build-audit per-mechanism block-test (PARK-TEST-DRIVE-LOOP) | GAP count -> 0; block-test pass/fail | DESIGNED; a-d run manually, not auto-gated |
| CAPTURE-MUST-PERSIST | nominal capture (chat-only deferrals lost on compact) | defer -> write intermediate-capture -> surface every verify -> graduate/close | intermediate-capture.yaml + validate-intermediate-capture | open-captures count surfaced | BUILT + wired (advisory) |
| COMPLETION-AS-LEDGER | loose ends; forgotten obligations | turn-end -> every thread terminal (built OR un-droppably parked) | validate-completion-gate + validate-park-register | undisposed-obligations = 0 | BUILT + ACTIVE (re-activated this tab) |
| PREVENTION-PERSIST (build prevention, not re-park) | SWIFT-fix-without-prevention recurrence | catch -> fix + schema-tagged prevention -> PE accumulate -> k-threshold auto-plan | close-gate (designed); validate-park-register (the built instance) | prevention-debt/topic; recurrence K | META designed; one instance BUILT |
| VERIFY-BEFORE-ASSUME / SEAL-THE-LIVE-ARTIFACT | nominal seal (claim != live) | claim -> live-fetch verify -> seal only if present | green-receipt (tree_hash) + director-seal-packet | tree_hash match; live-fetch confirm | green-receipt BUILT; live-fetch manual |
| NO B_* WITHOUT T1+T2 | contract-proliferation; T3-fade | propose contract -> require T1+T2 passing -> else CANDIDATE | B_*-declaration gate (OPEN) | % B_* with T1+T2 coverage | RULE set; validator OPEN |
| ENHANCE-NOT-FORK / consult-first | duplication; new-over-active | before create -> dedup scan (Haiku) -> enhance existing | dedup_checked field + validate-park-register (advisory) | duplicate count; dedup_checked coverage | PARTIAL (advisory) |
| THRESHOLD-FIRST (input gating) | native-AI-default routing; mid-plan-injection bypass | input -> classify mandateRelation -> QUEUE-OR-PIVOT gate -> route | router-side gate (NOT built; classifier only) | % inputs gated; mandate-bypass count | TOP GAP (PARK-THRESHOLD-INLINE-GATE) |
| SCOPE-ADAPTIVE + ASK-DON'T-ASSUME (SAGD) | forced depth; shallow-or-overwhelm | classify scope -> ASK -> route depth -> iterate | SAGD in shell | e7 lovability_confirmed | BUILT-COMPLETE; e7 awaits test-drive |
| ADAPTIVE-OVER-STATIC (refresh) | habituation / T3-fade from static re-injection | classify drift -> small/full refresh | cognition-orchestration refresh (parked S082-011) | drift-signal; turns-since-refresh | PARKED |
| FREQUENCY-WEIGHTED VALUE (PE) | optimizing low-leverage work | measure most-repeated actions -> PE boost | PE repetition-value boost (parked) | repetition-leverage score | PARKED |
| HAIKU SCAN -> WEEKLY-ANALYSIS LOOP | stale prompting; un-improved scans | scan -> haiku-scan-log -> weekly analysis -> refine prompts | haiku-scan-log + weekly step (round-8, unbuilt) | scan accuracy trend | DIRECTED, unbuilt |

## HONEST SUMMARY
- FULLY closes the chain NOW (hardwired + measurable): CAPTURE-MUST-PERSIST · COMPLETION-AS-LEDGER ·
  VERIFY/green-receipt · (one instance of) PREVENTION-PERSIST = validate-park-register.
- DESIGNED but not yet auto-gated/measurable: DONE=ACTIVATION-PROVEN · NO-B_*-WITHOUT-T1+T2 ·
  ENHANCE-NOT-FORK (advisory only).
- The most crucial GAP: THRESHOLD-FIRST is a classifier, not a gate — the platform does not yet
  mechanically govern its own intake. This is the foundation; recommend building it before more UX.
- PATTERN: we are strong at DESIGNING prevention principles, weaker at HARDWIRING them to a measured
  result. The meta-standard above + PARK-COMPLETION-DISCIPLINE-METRICS is the fix: no principle is
  "done" until its metric moves.

## PREVENTION CONCLUSIONS — what went wrong HERE (S089 UX scatter), structurally
Honest, self-included (Opus shares blame — I kept ruling+relaying instead of forcing the build, and
did not push back hard enough on opening new arcs while the foundation was unfinished).
- P-A UNIFY-BEFORE-ENRICH: we enriched ~7 scattered journey pages (FVC, pageDNA, SAGD) instead of
  unifying the FRAME first -> deepened the scatter = the Governor's confusion. PREVENT: a shell/frame
  must wrap the surfaces BEFORE per-surface enrichment. Hardwire: a scatter-check — if N>1 pages serve
  ONE journey with no unifying shell, flag/block further per-page enrichment. METRIC: journey-pages-
  without-shell.
- P-B RATIFIED-BUT-UNBUILT limbo: the route consolidation was RATIFIED (round-12) then sat UNBUILT for
  rounds, silently, behind a gate. PREVENT: every ratified STRUCTURAL decision gets a build-or-
  explicit-defer disposition (completion-as-ledger applied to DECISIONS, not only parks). METRIC:
  ratified-decisions-without-build-status.
- P-C HUMAN-GATE BOTTLENECK ACCUMULATION: the SAGD test-drive gated Item-3 for ~6 rounds; we kept
  building AROUND it. PREVENT: when a human gate blocks a dependency >2 turns, escalate it OR
  explicitly re-sequence the dependent work — do not silently accumulate behind it. METRIC: turns-
  blocked-on-human-gate.
- P-D SCOPE SPRAWL / no WIP limit: new arcs (CDS, CSE, refresh, research, PE-freq) opened while the UX
  foundation was unfinished. PREVENT: WIP limit + foundation-first; the DIRECTOR must push back on
  new-arc-opening when the foundation is incomplete (challenge-on-merit on pace, even the Governor's).
  METRIC: open-arcs vs finished-foundations.
- P-E LOOP-HAS-NO-MEMORY: going BACK loses entered state. PREVENT: state-persistence across navigation
  (UX-LAW-7). METRIC: back-nav state-loss.
- P-F ENGRAVE-NOT-REMEMBER: "fixed going forward" fades. PREVENT: engrave into the file every run reads.
DEEPEST: the scatter is the symptom of P-A + P-B. The cure is the Governor's own sequence: WRAP a
shell over existing functions -> REFINE -> CONSOLIDATE (do not enrich or delete until the shell wraps).

## DECISION LEDGER
- CHOSEN: extract + persist the principles with HONEST built/designed/parked status + name the
  meta-standard (hardwired+measurable = the completion bar for a principle).
- REJECTED: list principles without status (would imply they are all live = the nominal-governance
  failure this very extraction warns against).
