---
id: csps.handoff.vault.plan-s075-go-over-what-exists
name: PLAN-S075-GO-OVER-WHAT-EXISTS
description: "Consolidated S075 plan — HARDWIRE 'go over what exists' (Governor S074 directive: pretended/partial survey presented as complete is a root cause of duplication/contradiction/bloat) + refined significance-engine sandbox (Option C) + S074 close. Connects existing organs (P-META-029, inventory-scan, check-existing, validate-before-assume, D* profiler), does NOT mint parallel governance."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
core_spines: [AI, VALD, GVRN]
schema_anchor: vault_files
session: S075
links:
  - { rel: principle, href: ../../principles/P-META-029-humble-consolidation-discipline.md }
  - { rel: default-registry, href: ../../../../tools/data/default-correction-registry.yaml }
  - { rel: significance-engine, href: ../../../../tools/data/improvement-register.yaml }
  - { rel: prior-extraction, href: session-S074-extraction.md }
tags: [domain:ai, domain:governance, type:reference, audience:ai-agent]
---

# PLAN-S075 — Go-Over-What-Exists (HARDWIRE) + Significance Engine (C) + S074 close

## The failure that triggered this (hansei — reflect honestly)
OPUS-16 (S074) made existence-claims about the platform ("CSPS already has X", "governor-insights died S018",
"the system is more mature than I credited") after a SHALLOW survey, presenting them as if a real review had
been performed. This is the **assumed/pretended-coverage** false-assumption. It is a primary engine of
duplication, contradiction, overload, and bloat — and it is especially dangerous from an AI that touches every
process, because the default re-asserts on every turn. Governor S074: "going over what exists might be the most
important thing in the platform today and for days to come." This plan makes it a default-by-default, hardwired.

## What already exists (verified S074, file evidence — NOT from memory)
| Artifact | Tier | Trigger | What it does | Gap |
|---|---|---|---|---|
| pre-tool-use-inventory-scan-required.sh | ADVISORY (S067) | Write/Edit w/ proposal-language | suggests platform-inventory-scan.mjs | advisory; Write/Edit-only; no attestation |
| pre-tool-use-check-existing.sh | advisory | Write to docs/ tools/ | nudges check-existing | no attestation; no prose coverage |
| pre-tool-use-state-claim-gate.sh / humble-step-gate.sh | T1 | Write to sonnet-turn.md ONLY | claim discipline on Sonnet | not opus-turn; not chat prose |
| post-tool-use-validate-before-assume.sh | ADVISORY | after every tool | scans for assumption language | advisory; post-hoc |
| validate-inventory-scan-coverage.mjs | T2 | verify | inventory-scan coverage | doesn't check claim-attestation |
| platform-inventory-scan.mjs | tool | manual | the scan engine | single-pass; not exhaustive |
| P-META-029 + B_HUMBLE_CONSOLIDATION | principle/contract | — | the doctrine | enforcement advisory + Write-only |

**The 3 confirmed holes:** (1) no gate fires on existence-claims made in CHAT/prose (all key on tool_name);
(2) no ATTESTATION of the reviewed set is required (mentioning a scan ≠ doing it exhaustively); (3) no ≥4-pass
exhaustive survey requirement; and (4) no registered AI-default for pretended-coverage.

## WORKSTREAM 1 — HARDWIRE "go over what exists" (PRIORITY — Governor prime directive)
Apply the S074 HARDWIRE 4-layer model to P-META-029. Connect/promote existing organs; do not create parallel ones.

- **G1 — Register D12 `assumed-coverage`.** Add to default-correction-registry.yaml + inner-ai-defaults vault.
  Detection: existence-claim language ("already has / exists / I reviewed / found that / more mature than /
  turns out") WITHOUT a cited coverage-attestation in the same turn. Counter-instruction: "D12 DETECTED: you are
  claiming what exists. Did you EXHAUSTIVELY survey it THIS turn? Cite the reviewed set (files/scan output) or
  retract the claim. Partial survey presented as complete = duplication/bloat." K-gate 2 → session interrupt.
  Profiler (user-prompt-submit-ai-profiler.sh) gets the detection + same-turn correction (L3 arm, already built).
- **G2 — Existing-Coverage Attestation (ECA) — the structural fix for the chat hole.** Define ECA: any
  existence-claim about the platform must cite the inventory actually performed. Enforce on all THREE process
  points the Governor named: CREATION (promote inventory-scan-required ADVISORY→BLOCKING + require an attestation
  block, not just a scan mention); IMPLEMENTATION (extend pre-commit-proto-core-seed to require "checked-against"
  set); EXAMINATION (a post-stop prose scan flags existence-claim language lacking an ECA — closes the chat gap).
  Extend state-claim-gate to opus-turn.md too (Opus is not exempt).
- **G3 — ≥4-pass exhaustive inventory (RZF/CEC pattern for inventory).** Upgrade platform-inventory-scan.mjs to
  sweep ≥4 surfaces (hooks / validators / principles+contracts / memories+vault / tools) and iterate until a pass
  yields ZERO new existing artifacts; emit a coverage-attestation artifact that ECA cites. Inventory is "done"
  only when a pass finds nothing new — measurement, not a fixed count (cf. RZF cycle-count is measurement).
- **G4 — L2 + L4 (permanence).** L2: weekly-hardwire-audit re-tests "did ECAs actually cover the set" synthetically.
  L4: validate-hardwire-dna-coverage extended — new artifacts must declare what they were checked-against at birth.
  Register a hardwire-register row "go-over-what-exists" with block-test output.
- **Block-tests (per HARDWIRE):** (G1) emit an existence-claim with no attestation → D12 fires correction;
  (G2) attempt a Write with proposal-language and no ECA → BLOCKED exit 2; (G2-chat) post-stop prose scan flags an
  unattested claim; (G3) run exhaustive scan → coverage report shows all surfaces + zero-new termination.

## WORKSTREAM 2 — Significance Engine sandbox (Option C, REFINED) — ordered AFTER WS1
Per Governor order ("once finished I order you to do C and make sure it will be refined"). Write the engine as a
DRAFT→SANDBOX spec (sandbox-before-implementation), simulate 3 scenarios against real S074 data, bring to council
for ratification before code. REFINEMENT mandate: the engine must itself obey go-over-what-exists — MOVE 1 capture
and MOVE 2 significance must survey existing ledger entries before adding (dogfood), and the engine must be subject
to L2 recurring re-test of its OWN capture freshness (it must not decay like governor-insights did at S018).
Tracked: improvement-register DRAFT-S074-SIGNIFICANCE-ENGINE. Recommended first concrete step: read-only
significance VIEW over existing data (gap-recurrence + improvement-register + extractions).

## WORKSTREAM 3 — S074 close + carry
S074 is closeable (Sonnet SEAL: HARVEST_DONE, verify=0, OPIA ACCEPT-WITH-ONE-GATE satisfied, commits 648318e4→
f360da8e). Close via §10 (close-gate checks §10.H1+H2+H3 + harvest). Carry into S075: Opus Q1-Q4 (D11 /
governing_intent / ZF-fix) from sonnet-turn.md; PART 3 product schema; floater backlog (26, triage 3/session).

## Sequencing & cadence
WS1 (G1→G4) FIRST (prime directive) → WS2 (C sandbox spec) → WS3 close threads alongside. Multi-batch long-run,
R-class stops only, ONE SEAL report. Each batch DONE = block-test output pasted (gate fired), not content written.

## Connection-not-creation attestation
This plan adds exactly ONE new artifact class (D12 default + its detection) and otherwise PROMOTES/EXTENDS
existing organs (inventory-scan advisory→blocking, state-claim-gate→opus-turn, platform-inventory-scan→exhaustive,
proto-core-seed→checked-against, weekly-audit + dna-coverage→ECA). Reviewed set cited in "What already exists"
table above (7 artifacts, file-verified S074). No parallel governance minted.

## STATUS UPDATE (S075, post-SEAL)
- WS1 G1-G4 SEALED (d5dfcdf7) · WS2 significance sandbox + WS3 S074 close SEALED (cfc5d393) · verify=0/0-FAIL.
- Overlap audit done (6d71e086): F2 default-signal disambiguation FIXED; F1 relay-trio + F3 stub/structural →
  DRAFT-S075-STRUCTURAL-OVERLAP-PREVENTION.
- Self-profiling (Governor-directed) DONE: D12 promoted to inner-ai-defaults/D12-assumed-coverage-default.md +
  continuous-drift-log S075 entry (D7:2, D12:2 from zf-session-tracker). Positive counter-patterns logged.

## WS5 — HARDWIRE-006 governing_intent (Q1-Q4 resolution; EXTEND, don't mint)
D11 = meta-genus "proxy-satisfaction" (D3/D5/D6/D12 = species); keep ID, refine name. governing_intent field
REQUIRED on NEW rules (L4 DNA-at-birth) + BACKFILL existing BY SIGNIFICANCE (significance-engine's first consumer,
not a 72-principle big-bang). validate-governing-intent-coverage (advisory+promotion-path) FOLDED INTO
weekly-hardwire-audit (no new cron). ZF fix = governing_intent + SP floor + extend nominal-rzf-detector (no new
rigid rule). HARDWIRE-006 = P-META-025 hardwired.

## WS4 — structural-overlap prevention (the hardwired prevention against parallel-prevention/bloat)
EXTEND consolidation-pattern-detector to structural overlap (≥2 hooks/validators/defaults on one concern) +
promote post-stop-consolidation-pass STUB→active (Governor blast-radius timing) + widen inventory gate to
new-artifact creation (R1) + fix D11-double-file / D13-overlap from self-profiling.

## SEQUENCING: WS5 → WS4 → significance-engine council ratification → PART 3. Long-run, R-class stops only.

## WS6 — Reasoned-Adoption + D14 deference-acceptance (rubber-stamp)  [Governor S075]
Built this turn (Opus authorship): D14 `deference-acceptance` registered (adopted_value=independent-corroboration,
reasoning+reframe fields) + REASONED-ADOPTION-PRINCIPLE-S075.md (candidate P-META-031). Where rubber-stamp occurs:
SEAL acceptance · "verify=0" claims · "hooks present" · subagent results. Build (Sonnet): D14 detection in
ai-profiler + counter-instruction; RETROFIT D1-D13 counter_instructions to the reasoned+reframed shape (BY
SIGNIFICANCE, not big-bang — significance-engine consumer); ratify P-META-031. Enforce-the-floor-reason-the-ceiling.

## WS7 — The unified learning loop (consolidate; outcome = better authoring, VERIFIED)
ONE pipeline (connect existing organs, mint nothing parallel): TRIGGER-gather (council/ZF/friction/CADENCE-AUDIT +
ai-profiler signals) → DEFAULT-register (default-correction-registry + drift-log) → SAVE properly (K=2 → category
file; this turn: D12 promoted, D14 added) → SIGNIFICANCE-weight (significance-engine: recurrence+reactivation+
link-density+outcome; decay) → CRYSTALLIZE on threshold (governing_intent backfill + reasoned-adoption retrofit +
HARDWIRE) → OUTCOME-VERIFY. The outcome metric is the Governor's bar: "verified to be improved in the way the
platform WRITES instructions/protocols/wizards." Measure on artifacts authored AFTER the loop: (a) override entries
carry reasoning+reframe+enforcement (not prohibition-only); (b) governing_intent present; (c) recurrence of
D11/D12/D14 incidents DROPS session-over-session. Folded into weekly-hardwire-audit (no new cron).

## FINDING (this turn, routed): verify/orchestrator concurrency cry-wolf
`pnpm verify`=0/0-FAIL but `zf-orchestrator --level 3` cycle-2 reported 1 BLOCKING (`"status":"FAIL"` count);
reproduced FAIL=0 twice at HEAD → TRANSIENT from two AIs writing the same working tree (torn-state scan). A
flaky/cry-wolf gate TRAINS rubber-stamping (D14) — so it matters. Route to WS4 (gate-determinism / concurrency guard).

## SEQUENCING v2: WS6 (reasoned-adoption, partly done) → WS5 (governing_intent) → WS4 (overlap+concurrency) →
significance ratification → PART 3.

## CONSOLIDATION (S075 — Sonnet's 2 checkpoints folded in; OPUS-16 verified)
**HARDWIRE-006 (Vercel health): OPIA ✅ ACCEPTED** (verified by OPUS-16: verify=0/0-FAIL re-run · validate-vercel-
projects.mjs registered verify.mjs:1271 · vercel-health-check.mjs + tools/config/deploy-targets.yaml present ·
hardwire-006 row · budget-planner vaulted to apps/_trials-vaulted/). No course corrections.

**NUMBERING FIX (collision caught):** hardwire-006 = Vercel (built). governing_intent (the D11 meta-fix) is
RE-ASSIGNED HARDWIRE-007 (prior PROTO wrongly also called it 006). Parallel-numbering = the WS4 disease; corrected here.

**CORE INSIGHT ACCEPTED (Sonnet, strong): EXTERNAL-INTEGRATION-REGISTRATION-STALENESS** — "a service registration
correct at T0 goes stale at T+N without live verification; no proactive detection until production fails." This is
EXACTLY the HARDWIRE **L2 recurring-synthetic-re-test** layer, applied to EXTERNAL services. Build it as an
EXTENSION of the L2 pattern (weekly-hardwire-audit family), NOT a parallel system. 7 integrations exposed: Vercel
(fixed) · Clerk · Supabase · ZenStack · GitHub submodule · Stripe · Anthropic API.

## WS8 — External-Integration-Health (= L2 for external services). PE-ranked proposals P1-P6:
- P1 external-integration-registry.yaml (extend tools/config/deploy-targets to all 7 services) — HIGH, first.
- P2 validate-external-integration-health.mjs (generic CRITICAL; the L2 re-test for external) — HIGH, with P1.
- P4 integration-gate ADVISORY→BLOCKING (contextual scope) — MED (EXISTS≠ACTIVE fix; pairs with WS4 promotion).
- P3 Clerk + Supabase health-check scripts — MED, after P1/P2 (consumers of the generic validator).
- P5 HUB.md refresh S028→S075 — LOW.
- P6 significance-view top-3 in session-open — GATED on significance scoring-formula ratification (Governor).

## CONSOLIDATED BUILD ORDER (optimal batches — all pending merged):
WS6 Reasoned-Adoption + D14 (foundational: changes HOW every later override is written) → WS5/HARDWIRE-007
governing_intent (D11 meta-fix, Q1-Q4) → WS8 External-Integration-Health (P1→P2→P4→P3→P5) → WS4 structural-
overlap + concurrency guard → significance scoring-formula ratification → P6 → PART 3 product schema.
BALANCE NOTE (honest): governance hardening is now large; PART 3 (product) must not be infinitely deferred —
it stays top-of-order after this consolidated governance batch.

## GOVERNOR-RATIFIED ORDER (2026-06-01): B1 (Reasoned-Adoption + D14 unverified-agreement) → B2 (HARDWIRE-007
governing_intent, ROOT fix for all D*) → PART 3 product schema (pulled forward) → B3-LEAN (P1 active-only registry
+ P2 generic health validator; DEFER P3) → B4 (loud concurrency guard, surface-not-mask) → B5 significance
ratification → P6. Collaboration outcome (Sonnet S075 comments accepted): D14 renamed unverified-agreement;
P-META-031 now requires a cited SP per reasoned override (else D11); B3 scoped to active integrations only.
