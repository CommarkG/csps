---
id: csps.governance.platform-observation-doctrine
name: PLATFORM-OBSERVATION-DOCTRINE
description: >
  Canonical "what is actually happening on the platform" observation + insight-to-improvement
  doctrine. Authored by OPUS-14 S071 Turn 17 per Governor directive ("research and see how it is
  optimal to have automatic sample windows or other recurring processes that will keep what really
  happens monitored, then placed correctly into a processing pipeline making the insights validated
  true proven improvements in the platform"). Consolidates the 4 existing audits + ai-behavior-signals
  + council-invocation-log + the 3-stage intake pipeline (intake-gate → routing → invocation) into
  ONE named observation discipline. Does NOT create parallel machinery — extends existing audit-runner,
  cie-pe-trigger-audit, weekly-persona-trigger-audit, AI-PROFILING OBSERVE+AGGREGATE, validate-nominal-rzf-detector.
  Status: draft. Queued for S072 absorption alongside CIP build + ONE-SOURCE-OF M10 + AI-PROFILING
  ADJUST/INJECT/MEASURE. Numbers are sample/tunable per P-META-028.
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: architecture-pending
vault_pending: vlt-S072-platform-observation-doctrine
retrieve_when: "S072 opens — alongside CIP + ONE-SOURCE-OF + AI-PROFILING absorption. Sonnet builds in PE order: L1 3-stage intake formalization → L2 audit-orchestrator → L3 Platform Observation Board page → L4 ZF-deep auto-trigger → L5 audit findings → CIP staging integration."
core_spine: GVRN
core_spines: [GVRN, VALD, AI, OPER]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S071
owner: group:finky
authored_by: OPUS-14
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic, core-maximal]
ns_path: "this → GVRN+VALD spines → North Star (platform self-observation as compounding ground-truth signal)"
context_question: "Before adding any new monitoring/audit: does the existing audit-runner + cie-pe + weekly-persona + AI-PROFILING + intake-pipeline + signals stream already cover this signal? If yes, extend. If no, declare which stage of the observation pipeline it serves."
context_quote: "Insights are valuable only when they flow back into the platform as ratified improvements. An audit nobody acts on is a satisfaction point (PSP). — Governor S071 Turn 17"
inherits_from: "audit-runner.md + cie-pe-trigger-audit (M5 active) + weekly-persona-trigger-audit (M4 active) + AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md (draft, OBSERVE+AGGREGATE stages built M5) + RZF-LATEST v1.1 (PSP + FCC + DEFERRABLE classification) + ONE-SOURCE-OF-DOCTRINE.md (CIE/PE wiring §5) + CIP design (queued S072) + P-META-028 cornerstone"
links:
  - { rel: audit-runner, href: ./audit-runner.md }
  - { rel: audit-runner-index, href: ./audit-runner-index.yaml }
  - { rel: cie-pe-audit, href: ../../../tools/scripts/cie-pe-trigger-audit.mjs }
  - { rel: persona-audit, href: ../../../tools/scripts/weekly-persona-trigger-audit.mjs }
  - { rel: ai-profiling, href: ./AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md }
  - { rel: rzf-canonical, href: ./RZF-LATEST.md }
  - { rel: one-source, href: ./ONE-SOURCE-OF-DOCTRINE.md }
  - { rel: intake-gate-log, href: ../../../tools/data/threshold-intake-log.yaml }
  - { rel: routing-log, href: ../../../.csps/threshold/intake-log.yaml }
  - { rel: invocation-log, href: ../../../tools/data/council-invocation-log.yaml }
  - { rel: signals-stream, href: ../../../tools/data/ai-behavior-signals.jsonl }
---

# Platform Observation Doctrine · Draft (S071 → S072)

> **One sentence:** Every recurring observation of platform reality (audits, signals, measurements) is classified by cadence + sample window + criticality + audience, and its findings flow through a single named pipeline (OBSERVE → AGGREGATE → CLASSIFY → ROUTE → STAGE → RATIFY → IMPLEMENT → MEASURE-AGAIN) — so insights become ratified improvements, not satisfaction points.

## 1 · Why this exists (the failure mode named)
The platform has accumulated **4 audit scripts + 201 validators + 1 signal stream + 3 intake-pipeline logs + a ZF-deep cadence signal** that mostly run independently. Findings surface in last-run JSONs that nobody aggregates. **The result:** audits produce data that doesn't reach ratification — they become **PSP (Premature Satisfaction Point — RZF-LATEST v1.1 §3.C):** "we measured it, therefore it's handled," without the insight ever closing into a ratified improvement. The S014 single-source-navigation reminder is the inaugural instance; the present scatter across audit outputs is the chronic instance.

The honest test: *"name one audit finding from the last 3 sessions that became a ratified platform improvement."* If the answer is hard, the audits are PSP-machines, not value-machines.

## 2 · What exists (consolidation survey — do NOT duplicate)

| Layer | What | Cadence | Sample window | Output |
|---|---|---|---|---|
| **A. Inputs (3-stage pipeline)** | `tools/data/threshold-intake-log.yaml` (intake-gate) → `.csps/threshold/intake-log.yaml` (routing) → `tools/data/council-invocation-log.yaml` (invocation) | per-input | live | append-only records |
| **B. AI behavior signals** | `tools/data/ai-behavior-signals.jsonl` | per-tool-use | live | append-only D-default firings |
| **C. Per-milestone audits** | `cie-pe-trigger-audit.mjs` (M5) | per-milestone | last-N events | `cie-pe-last-run.json` |
| **D. Weekly audits** | `weekly-persona-trigger-audit.mjs` (M4) · `cron-weekly-tag-status-deep-audit.sh` · `weekly-consolidation-audit.mjs` (queued S072 from ONE-SOURCE-OF §4.P4) | weekly | rolling 7-day | last-run JSON / signal append |
| **E. ZF-deep** | RZF-LATEST §6.I4 cadence signal (currently fires every ~12 turns by signal — no auto-trigger built) | per-N-turns | scope-defined | top-level `$?` cited in commit |
| **F. Audit-runner orchestrator** | `audit-runner.md` + `audit-runner-index.yaml` (28 registered pipelines) | various | various | `audit-runner-last-run.json` |
| **G. validators** | 201 validators wired in `verify.mjs` | per-verify | per-file | last-run JSONs |

**Net:** the OBSERVE layer is rich (A-G). The AGGREGATE-CLASSIFY-ROUTE-STAGE-RATIFY-IMPLEMENT-MEASURE-AGAIN layer is **absent**. That's the gap.

## 3 · The doctrine — single named pipeline for observation → ratified improvement

```
OBSERVE         every layer A-G runs at its cadence (existing — no change)
  ↓
AGGREGATE       a single aggregator reads all last-run JSONs + signal streams + log tails
                emits a Platform Observation Snapshot (POS) per cadence boundary
  ↓
CLASSIFY        each finding gets RZF-LATEST v1.1 §1 severity at surface:
                BLOCKING (fix in current cycle) · ADVISORY (note in PREVENTION, proceed) ·
                DEFERRABLE-to-vault-pending (real value, wrong cycle)
  ↓
ROUTE           through the threshold (PART 2, M6-active) → input_class = 'observation_finding'
                with audience_tier + criticality stamped (per cornerstone)
  ↓
STAGE           BLOCKING findings → fix-this-cycle proto; ADVISORY → PREVENTION named-class
                in next Milestone Report; DEFERRABLE → vault-pending with retrieve_when
  ↓
RATIFY          STAGE = BLOCKING + cross-cuts-multiple-files → Governor ratification gate
                (composes with CIP RIPPLE-QC stage when CIP builds in S072)
  ↓
IMPLEMENT       Sonnet builds in next available milestone; ADD-not-CONTRADICT
  ↓
MEASURE-AGAIN   next cadence cycle's OBSERVE confirms the drift metric drops
                (CIE Continuous Impact Estimation closure — the proof the fix worked)
```

This IS what AI-PROFILING §3 OBSERVE→AGGREGATE→ADJUST→INJECT→MEASURE describes for D-defaults, generalized to all observation classes. Reuses existing CIE/PE wiring. Composes with CIP when CIP builds.

## 4 · The additions (what to build — small, no parallel machinery)

### L1 · 3-Stage Intake Pipeline formalization (resolves vlt-S068-00009 properly)
- Add `pipeline_stage:` field to each of the 3 intake logs: `intake-gate` / `routing` / `invocation`.
- Cross-link via shared `id` (intake.id → routing.parent_id → invocation.parent_id).
- ADD-only — no schema break. ~30 min build.
- **NOT a merge** (the original PROTO-S068-PART-2 STEP 2 directive's "merge to ONE" was based on the false-duplicate assumption — see vault-pending vlt-S068-00009 routing_decision).

### L2 · `tools/scripts/platform-observation-aggregator.mjs`
- Reads: every `tools/data/*-last-run.json` + `ai-behavior-signals.jsonl` tail + the 3 intake-stage logs + `council-invocation-log.yaml`.
- Emits: `tools/data/platform-observation-snapshot.json` (the POS — point-in-time aggregate).
- Cadence: runs at every Milestone Report close + weekly cron + on demand.
- ADD-only — does NOT modify any audit's individual output.
- ~2 hour build.

### L3 · `/platform/observation` Vercel page (per the Vercel-mirror rule M3, scoped to ratifiable user-facing)
- Renders POS aggregated view: top-N findings by severity, recent drift metrics, sample-window currency per layer, "stale audit" warnings.
- SSR-bundled JSON; governed-path write-back; NO live writes.
- Cross-link FROM `/platform/rzf` (FCC/PSP detector view) + `/platform/communication` (AI-profiling drift view).
- ~3 hour build. Composes with the S072-queued `/platform/ai-profile` + `/platform/canonical-register`.

### L4 · ZF-deep auto-trigger (RZF-LATEST §6.I4 build)
- Currently RZF-LATEST §6.I4 proposes: when ZF deep signal crosses tunable N=12 turns without firing, schedule + fire automatically.
- Build: extend `cron-weekly-tag-status-deep-audit.sh` (or audit-runner pipeline) to also trigger on the `iter N` threshold crossing.
- Converts the "always overdue" pattern (we hit iter 16 this session — the recurring trap) into a triggered event.
- ~1 hour build.

### L5 · Audit findings → CIP staging integration
- When CIP builds (S072), audit findings classified BLOCKING route as input_class `proposed-change` into CIP staging — composing CIE/PE with CIP RIPPLE-QC.
- Closes the loop: observation → CIP → ratify → implement → measure-again.
- Depends on CIP M3 (the threshold route class) — so L5 is the LAST item in S072.

## 5 · Standardized observation frontmatter (extends existing — applies to L2+ artifacts)
Every audit script + signal stream + validator with cadence > per-tool-use declares in its frontmatter:
```yaml
observation_cadence: "per-input | per-tool-use | per-milestone | daily | weekly | monthly | quarterly"
sample_window: "live | last-N | rolling-7-day | rolling-30-day | session-bounded"  # tunable per P-META-028
emits_to: "<canonical output path>"
classifies_into: "BLOCKING | ADVISORY | DEFERRABLE-to-vault-pending"  # which severity classes it surfaces
audience_tier_visible_to: [governor | core-dev | external-dev | account-owner-admin | team-leader | end-user]
prevention_class: "<named class from prevention-class register>"  # the failure mode this audit catches
```
This is the **only new frontmatter convention** the doctrine introduces. Everything else extends existing infrastructure.

## 6 · Composition with what's queued for S072
| S072 item | How this doctrine composes |
|---|---|
| **CIP build (M3 PROPOSED-CHANGE route)** | L5 routes audit findings through CIP; CIE/PE consume; closes the ratification loop |
| **ONE-SOURCE-OF M10 + canonical-register page** | L3 `/platform/observation` cross-links to `/platform/canonical-register` (both render audit-state); the CSR row for each audit declares its `pipeline_stage` (per L1) |
| **AI-PROFILING ADJUST/INJECT/MEASURE** | The MEASURE stage is the AI-PROFILING I5 dashboard; this doctrine's MEASURE-AGAIN closes the same loop generalized |
| **P-META-029 backfill** | The aggregator (L2) reads `principles-index.yaml` total_count — surfaces the partial-engraving as a MEMORY-VS-DISK-DRIFT BLOCKING finding |

## 7 · Discipline + scope
- **No parallel machinery.** Every layer (A-G) stays as-is; the additions are L1-L5 only.
- **One named pipeline.** OBSERVE → AGGREGATE → CLASSIFY → ROUTE → STAGE → RATIFY → IMPLEMENT → MEASURE-AGAIN. Anything outside this pipeline is PSP-by-construction.
- **Sample windows are tunable per P-META-028 cornerstone.** No silent caps.
- **CIE/PE existing wiring is the engine.** Don't rebuild — extend.
- **PE-ordered build (L1 cheap-first):** L1 (~30min) → L4 (~1h) → L2 (~2h) → L3 (~3h) → L5 (after CIP). Total ~6-7h spread across S072 sessions.

## 8 · Status & gates
- Design status: **draft pending Governor ratification.**
- Queue: **S072 absorption alongside CIP + ONE-SOURCE-OF + AI-PROFILING ADJUST**.
- S071 impact: **ZERO** (drafted + saved at end of plan per Governor S071 Turn 17 directive; does NOT interrupt M7→M9 execution).
- Vault entry: `vlt-S072-platform-observation-doctrine`.

## 9 · Honest cruel-critic note
- This doctrine's biggest failure mode: it itself becomes a PSP if AGGREGATE runs but the snapshot is never read. Mitigation: L3 `/platform/observation` page renders it for the Governor; weekly cadence pings "POS snapshot stale > 7 days" as a BLOCKING audit finding.
- Second failure mode: the 6 layers (A-G) currently run at uncoordinated cadences. Cycle-2 of the doctrine build should audit cadence alignment — but that's a v1.1 concern.
- Third: criticality stamping at every layer requires every emitter to set it. L2 aggregator should default-imputeand log a warning rather than blocking — advisory-first per the cornerstone.

— OPUS-14 (S071 Turn 17 · authored for S072 absorption · 2026-05-30)
