---
id: csps.governance.long-run-builder-doctrine
name: LONG-RUN-BUILDER-DOCTRINE
description: >
  Canonical "latest version" (S071) consolidation doctrine for the long-run builder pattern:
  within a ratified plan, Sonnet (builder) runs until a REAL stop — never a NOMINAL stop.
  Consolidates B_AUTONOMOUS_BATCH_WITH_PREFLIGHT (S016 CONSTITUTIONAL — the GO side) +
  B_CONSENSUS_BEFORE_PROCEEDING (S011 CONSTITUTIONAL — the STOP side) +
  B_NO_CONFIRMATION_SEEKING (memory + AGENTS.md hard NO) + the 4-condition autonomous-execution
  gate + milestone-run tier (S069-S070 proven) into ONE named taxonomy with explicit mechanical
  enforcement. Closes the EXISTS≠ACTIVE gap: the CONSTITUTIONAL doctrine had T1=none + T2=none
  with an exempt_reason ("no mechanical pattern captures this") that is provably wrong —
  phrase-detection on output IS mechanical (post-stop-banned-phrase.sh demonstrates the pattern).
  Quality is NOT compromised by long-run; quality is protected BY long-run (one ratified plan,
  no per-step approval drift). Numbers are sample/tunable per P-META-028. status: draft pending
  Governor ratification.
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: architecture-pending
vault_pending: vlt-S071-long-run-builder-discipline
retrieve_when: "Governor ratifies → Sonnet authorized to build M0.7 enforcement trio (T1 nominal-stop detector + T2 validator + T3 session-open injection + handoff template extension)"
core_spine: GVRN
core_spines: [GVRN, AI, OPER, VALD]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S071
owner: group:finky
authored_by: OPUS-14
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic, core-maximal]
ns_path: "this → GVRN spine → North Star (one ratified plan, executed to SEAL without nominal stops)"
context_question: "Before I (builder) stop or ask: is this a REAL stop (new design decision · BLOCKING validator · Governor interrupt · sealed-milestone gate · OPIA-COURSE-CORRECT) or a NOMINAL stop (confirmation-seeking · over-cautious pause · per-step approval) the doctrine explicitly forbids?"
context_quote: "Don't compromise quality, AND skip the technical 'stops' that aren't reviewed but technically approved proceeding in the ratified plan. — Governor S071 Turn 6"
inherits_from: "B_AUTONOMOUS_BATCH_WITH_PREFLIGHT (S016 CONSTITUTIONAL) + B_CONSENSUS_BEFORE_PROCEEDING (S011 CONSTITUTIONAL) + B_NO_CONFIRMATION_SEEKING (memory + AGENTS.md hard NO) + 4-condition autonomous-execution gate + milestone-run tier (S069-S070) + P-META-028 cornerstone (context-refined communication) + P-META-006 (RZF)"
links:
  - { rel: go-contract, href: ./behavioral-contracts/B_AUTONOMOUS_BATCH_WITH_PREFLIGHT.md }
  - { rel: stop-contract, href: ./behavioral-contracts/B_CONSENSUS_BEFORE_PROCEEDING.md }
  - { rel: cornerstone, href: ../principles/P-META-028-context-refined-communication.yaml }
  - { rel: rzf-canonical, href: ./RZF-LATEST.md }
  - { rel: existing-banned-phrase-pattern, href: ../../../.claude/hooks/post-stop-banned-phrase.sh }
  - { rel: session-open-injection-point, href: ../../../tools/scripts/session-open-context.mjs }
---

# Long-Run Builder Doctrine · Latest (S071)

> **One sentence:** Within a ratified plan, the builder runs from start to SEAL — pausing ONLY for real stops (new design decision, BLOCKING validator, Governor interrupt, sealed-milestone OPIA, COURSE-CORRECT), never for nominal stops (confirmation-seeking, over-cautious pause, per-step "ready for next?"). Quality is protected BY long-run, not by stops — because every nominal stop is an opportunity for approval drift.

## 1 · Why this matters (the failure mode named)
Without this discipline, the AI inserts "should I proceed?" / "ready for next?" / "shall I continue?" at every milestone boundary even when the milestone is mechanically defined in a ratified plan. The Governor must then say "yes" 5×–10× per session — a turn-by-turn approval loop for ratified mechanical work. This:
- **Compromises quality** — every approval ping requires Governor context-switch; thoughtful directives degrade into rubber-stamping.
- **Compresses session capacity** — a session capable of 9 milestones lands 3 because 60% of turns are nominal acknowledgements.
- **Trains drift** — the AI learns "pings are safe, pings are expected"; the platform's intent (long-run on ratified) silently inverts.

The CSP S317 P-GOV-25 absorption + S006's PE Alignment Guardian + S016's B_AUTONOMOUS_BATCH all named pieces of this. None named the **taxonomy** + **mechanical enforcement** + **inheritance** together.

## 2 · The taxonomy (mechanical — this is what the validator checks)

### REAL STOPS (builder MUST pause here)
| # | Trigger | Why it's real | Resume condition |
|---|---|---|---|
| R1 | Governor explicitly interrupts | New direction surfaced by the human | Governor's new directive |
| R2 | `pnpm verify` returns **BLOCKING** (exit ≠ 0, not advisory) | Plan's quality bar failed | Fix until exit_code=0 |
| R3 | New design decision **not in the ratified plan** | Out-of-scope architectural choice | Governor ratifies the deviation OR plan amendment |
| R4 | ASK-OPUS-STOP trigger fires (named in directive) | The directive itself enumerated this as Opus-only | Opus answers OR alters directive |
| R5 | Sealed-milestone OPIA returns **COURSE-CORRECT** | The director's verification failed | Apply correction; re-run; re-OPIA |
| R6 | Context < 20% free (hard limit) | Mechanical capacity ceiling | New tab + handoff |
| R7 | Sacred-edit denied (SACRED-EDIT-APPROVED token absent for sacred path) | Permission gate, not approval gate | Acquire token |
| R8 | TypeScript / runtime error requiring **design choice** (not syntax fix) | Design = ratification-required | Governor decides |
| R9 | Discovered gap that re-shapes the ratified plan | Plan integrity gate | Plan amendment + Governor ratifies |

### NOMINAL STOPS (builder MUST NOT pause here — proceed)
| # | Pattern | Why it's nominal | What to do instead |
|---|---|---|---|
| N1 | "Should I proceed?" / "Ready for next?" / "Shall I continue?" | Confirmation-seeking on ratified work | Proceed; report inline at next milestone |
| N2 | "Just to be safe, let me ask…" | Over-cautious pause | Note the concern in §15 3-scope; proceed |
| N3 | End-of-milestone-but-not-end-of-plan acknowledgement requests | milestone-run already handles this | Emit Milestone Report + start next milestone |
| N4 | Mid-batch status check on a `≥ 4 file` batch (pre-flight already resolved) | B_AUTONOMOUS_BATCH duplicates this | Continue batch; status at end |
| N5 | Validator returns **ADVISORY** (not BLOCKING) | Advisory ≠ stop | Note in PREVENTION; proceed |
| N6 | TypeScript typo / formatting / lint fixable without design choice | Mechanical fix | Fix + continue |
| N7 | "Let me confirm my understanding…" mid-execution on a ratified directive | Director's directive is the source of truth | Proceed; if mis-understood, the milestone report surfaces it |
| N8 | "Do you want me to also…?" suggesting scope creep | Scope creep ≠ ratified plan | Vault as proposal; do NOT execute; continue ratified scope |

### Edge cases (use Q-context, default to PROCEED)
- A validator finding that *might* be design vs *might* be syntax → if a 60-second mechanical fix resolves it, fix + continue (N6). If it requires choosing between architectural alternatives, STOP (R8).
- A user comment in chat that's ambiguous (could be interrupt, could be ack) → treat as ack and continue (default to long-run); a real interrupt will be explicit (R1).
- A new prevention-class candidate discovered → name it in the Milestone Report (mandatory field per milestone-run); do NOT stop to discuss it (N2 + N3).

## 3 · The mechanical enforcement (closes EXISTS≠ACTIVE)

The existing CONSTITUTIONAL contract `B_AUTONOMOUS_BATCH_WITH_PREFLIGHT` declares enforcement_trio T1=none + T2=none with `exempt_reason: "Preflight reasoning discipline — judgment about whether work is authorized. No mechanical pattern captures this."` **The exempt_reason is provably wrong.** `.claude/hooks/post-stop-banned-phrase.sh` is the prior-art proof — phrase-detection on output IS mechanical and IS already deployed.

The enforcement trio for THIS doctrine (to be built in S071 M0.7, see opus-turn.md v1.4):
- **T1 hook** — `.claude/hooks/pre-tool-use-nominal-stop-detector.sh` (advisory) — scans Sonnet's pending output for N1–N8 patterns when the response is NOT a Milestone Report + the current session-state is mid-milestone. Warns; does not block (yet).
- **T2 validator** — `tools/validators/validate-no-nominal-stops-mid-milestone.mjs` (advisory → blocking after sample exemplar pass count = 5 — tunable). Scans `tools/council/sonnet-turn.md` recent entries; flags nominal-stop patterns inside milestone-run blocks (heuristic: pattern in section that is NOT a Milestone Report header AND NOT a real-stop block).
- **T3 inheritance** — `tools/scripts/session-open-context.mjs` extended to inject this doctrine + the 2 inherited B_* contracts + the R/N taxonomy at every tab boundary. The current B_AUTONOMOUS_BATCH T3 claim ("session-open injection") is upgraded to actually-injected.
- **Template** — `tools/templates/startup.template.md` SONNET STARTUP BLOCK gains a one-line "Long-run discipline: pause only for R1–R9 (real stops); proceed through N1–N8 (nominal stops)."
- **AGENTS.md hard NO** — *"Inserting nominal-stop phrases (N1–N8) mid-milestone in a ratified plan."*

## 4 · How this composes with what exists
- **B_AUTONOMOUS_BATCH_WITH_PREFLIGHT (S016 CONSTITUTIONAL)** — the GO side: pre-flight extracts all decisions upfront; batch runs uninterrupted. This doctrine adopts the 5 termination conditions from B_AUTONOMOUS_BATCH §"Autonomy termination conditions" verbatim as R-class entries (R1, R2, R3, R6, R8 ≈ Autonomy 1-5).
- **B_CONSENSUS_BEFORE_PROCEEDING (S011 CONSTITUTIONAL)** — the STOP side: principal decisions require Governor ratification. R3 + R9 in this taxonomy ARE the consensus-gate triggers. The two contracts are not contradictory — they apply to different surfaces (consensus = decisions; long-run = execution within ratified decisions).
- **B_NO_CONFIRMATION_SEEKING (memory + AGENTS.md hard NO)** — the N1 + N2 + N7 enforcement at the language layer.
- **milestone-run tier (S069-S070 proven)** — N3 is precisely what milestone-run replaced: no per-step ACK, audit + Report at milestone close.
- **4-condition autonomous-execution gate (CSP carry-forward)** — ratified ✓ reversible ✓ mechanical ✓ no-cross-actor ✓ → execute. The 4 conditions are PRE-conditions for entering long-run; the R/N taxonomy is the IN-flight discipline.
- **PE Alignment Guardian (P-META-018)** — N8 (suggesting scope creep) is exactly what P-GOV-25 forbids; this doctrine adds the mechanical surface.
- **RZF-LATEST.md** — each Milestone Report's ZF block is the long-run's evidence checkpoint; nominal-stop interruptions degrade RZF quality (a stop without evidence is nominal-RZF).

## 5 · What it does NOT change
- Real stops are still real. R1–R9 always pause execution. This doctrine does NOT lower the quality bar; it raises it by reserving stop-energy for the cases that need it.
- Governor ratification is still required for principal decisions, plan amendments, and new doctrines. B_CONSENSUS_BEFORE_PROCEEDING is intact.
- Sealed-milestone OPIA from Opus still gates SEALs. M9-style revert-not-amend if OPIA returns COURSE-CORRECT still applies.
- ASK-OPUS-STOP triggers named in each directive still fire.

## 6 · Sample numbers (per P-META-028 — all tunable, none are caps)
- T2 advisory→blocking promotion threshold: **5 sample exemplar passes** (tunable). Below 5 = advisory; the T2 builds confidence before becoming gate-class.
- Mid-batch silence ceiling: **20% context free** (R6 — from B_AUTONOMOUS_BATCH) (tunable per session capacity).
- Nominal-stop phrase set: **N1–N8 enumeration above** (current set — expandable as new patterns surface; vlt-S071-nominal-stop-phrase-expansion).
- Real-stop trigger set: **R1–R9 enumeration above** (current set — expandable).

## 7 · How to ratify + propagate
1. Governor reads §1 + §2 + §3 + §5 (mandatory; the rest is reference).
2. Governor ratifies (`status: draft → ratified` + `ratified_by` + `ratified_at`) via governed-path commit.
3. Sonnet S071 M0.7 builds the T1+T2+T3+template+AGENTS.md surfaces atomically (5-surface engraving per the engraving-discipline skill).
4. M0.7 PVA: 5 sample exemplar advisory passes → T2 promotes to blocking.
5. After ratify + M0.7 SEAL, B_AUTONOMOUS_BATCH_WITH_PREFLIGHT's `enforcement_trio.t1.path` + `.t2.path` + `.exempt_reason` are updated (the exempt_reason is removed — disproven).

## 8 · Status & gates
- Design status: **draft pending Governor ratification.**
- On ratify: Sonnet builds the 5-surface enforcement trio in S071 M0.7 (between M0.5 and M1 per opus-turn.md v1.4).
- All under milestone-run; extends existing infra (post-stop-banned-phrase.sh prior-art); no parallel machinery.

— OPUS-14 (S071) · authored 2026-05-30
