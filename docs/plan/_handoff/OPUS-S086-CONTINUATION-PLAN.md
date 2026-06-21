---
id: csps.handoff.opus-S086-continuation-plan
name: OPUS-S086-CONTINUATION-PLAN
description: >
  Opus #25 comprehensive continuation + detailed multi-session plan for S086→S087 (Governor approved all
  recommendations). Decision: NEW TAB (per PARK-045 compact-vs-new-tab — boundary + ratifiable checkpoint +
  high compaction-debt). Contains: the enhanced dependency-ordered plan, the full CORE SEEDS list (placed +
  pending + where), the approved decisions locked, open parks 038-047, pending items, and a ZF-deep.
version: "1.0"
session: S086
owner: group:finky
authored_by: OPUS-25
core_spine: GVRN
diataxis_type: how-to
schema_anchor: handoff_files
lifecycle: production
lifecycle_state: active
status: active
precedent_checked: true
links:
  - { rel: journey-seeds, href: ../pillar-0-governance/JOURNEY-SEEDS-S084.md }
  - { rel: handoff-integrity, href: ../pillar-0-governance/HANDOFF-INTEGRITY-SEEDS-S084.md }
  - { rel: front-end-moat, href: ../pillar-0-governance/FRONT-END-COMPLETENESS-MOAT-S086.md }
  - { rel: park-register, href: ../../../tools/data/park-register.yaml }
---

# Opus #25 — S086 Continuation + Detailed Plan (Governor-approved)

## 0. TAB DECISION — NEW TAB (not compact)
Per PARK-045: state externalized (git) → chat disposable · we're at a boundary (pre-db-push) → a durable
ratifiable checkpoint is worth it · long arc + high compaction-debt → clean context wins. This doc IS that checkpoint.

## 1. APPROVED DECISIONS (locked S086, Governor "i approve all")
- **Q1 (clarify-first) = B + SWIFT:** the full *threshold-consume pipeline* parks until threshold is stable+ratified
  (it depends on a stable threshold); the lightweight **clarify-first gate** starts now (doesn't touch threshold internals).
- **Q2 (clarify-first scope) = B:** fires only on `mandate_relation = new-request` inputs — never on proceed/ratify/ack.
- **Q4 (orchestrator) = UNIFIED concept / incremental build** via `B_ORCHESTRATOR_CONTRACT` (PARK-043 spine,
  PARK-040 = P5 learning, PARK-042 = dispatch). **Q3 = PARK-041 pre-db-push, PARK-043 post.**
- **MERGE-B refined** (042 kept distinct, cross-linked — not absorbed).
- **Accounting domain** = core-spine, harvest-not-fork, tier-gated bundling (PARK-047, deferred).

## 2. DETAILED MULTI-SESSION PLAN (dependency-ordered, completion-first)

### PHASE 1 — pre-db-push (no DB gate) — IN PROGRESS
| # | Item | DoD | Status |
|---|---|---|---|
| 1 | **Threshold stabilization** (un-droppable, Governor-ratified) | consumption loop live + Governor ratifies on a GREEN tree (logic done; was nominal-DONE on red — confirm verify=0 first) | logic live; **awaiting green + ratification** |
| 2 | **Page-Validation Machine** (M-47, FRONT-END-COMPLETENESS) | enumerate+verify every element · BLOCK on dead element · block-test · in verify+audit-runner · M-47 registered | **DONE (af8dc0dc)** — caught+fixed 3 real dead elements [MEASURED]; **RESIDUAL→S087:** T1 creation-gate (element manifest on new page.tsx) + full-HTTP-200 runtime-smoke (static proxy only now) |
| 3 | **P-META-005 cornerstone DNA elevation** | is_cornerstone:true + model_uplift/classification/team_coverage arms + dormant .ts enforcers re-homed to live mechanisms (no phantoms) | **PENDING** (only classification arm built) |
| 4 | **Clarify-first gate (SWIFT)** | new-request input cannot be parked/built without ≥1 clarifying question + verified intent | **PENDING (approved, build now)** |
| 5 | PARK-041 per-role cards + SEED-D validated startup template | 3 cards + role-aware validate-handoff-completeness | classification arm done; cards pending |
| 6 | Classifier golden-set labeling (Governor) + page fix | ~20 TBD entries labeled + training page loads both envs | **awaiting Governor labels** |

### PHASE 2 — 2026-06-27 (hard gate)
- **PARK-009:** rotate Supabase password FIRST → then `prisma db push`. Unlocks all of Phase 3.

### PHASE 3 — post-db-push (B5/B6 — journey nervous system)
- **PARK-043** 5 hardwires (risk-classed gate_mode, NOT uniform): journey-gate T1 · @csps-journey-phase DNA ·
  journey-event API write-path · handoff journey-phase · dual-coverage obligation #9.
- **B_ORCHESTRATOR_CONTRACT** → PARK-042 dispatch + PARK-040 learning as journey P5 (unified, incremental).
- **Threshold-consume pipeline** (Q1 parked half): input→classify→clarify→verified-intent→PE→route→park-with-context.

### PHASE 4 — after journey operational
- PARK-044 governed-interface #1 (threshold-queue for Opus access).
- PARK-047 **accounting core-spine** (harvest Blnk/ERPNext/OpenAccountants-MCP; tier-gated bundling; needs PARK-011).
- AI-behaviour cluster (029/030) · essence-propagation + test-drive (024/025) · remaining clusters by PE.

## 3. CORE SEEDS — list + placement
**PLACED this session (Opus #22-#25, committed):**
1. `JOURNEY-SEEDS-S084.md` — SEED-1..9 journey orchestrator anchors (cross-accepted F1-F11 folded).
2. `HANDOFF-INTEGRITY-SEEDS-S084.md` — SEED-A register-ref-integrity · SEED-B moat-in-handoff · SEED-C dual-coverage/
   context-independence · SEED-D per-role startup-block standard (Opus/Sonnet/Haiku; Haiku-minimal).
3. `TEAM-LEARNING-LOOP-S084.md` — Haiku ability battery T1-T10 + bidirectional team loop + coverage metric.
4. `FRONT-END-COMPLETENESS-MOAT-S086.md` — M-47 page functional-completeness standard.
5. `opus-turn.md` — PROTO-S084-TEG (token guardian) + PROTO-S084-HASH-CACHE (anti-nominal cache).

**PENDING core seeds (place next tab / per phase):**
6. **CLARIFY-FIRST + THRESHOLD-CONSUME** seed — author the contract (new-request → ≥1 question → verified intent →
   PE → route); SWIFT the gate now, full pipeline post-db-push. (Approved.)
7. **P-META-005 cornerstone** expansion text (model_uplift + classification + team_coverage + honest enforcer re-homing).
8. **Page-Validation Machine** spec is in FRONT-END-COMPLETENESS-MOAT §2-§6 (Sonnet building).
9. **Accounting core-spine** seed — per PARK-047 ITER-1/2/3 pointers (future domain).

## 4. OPEN PARKS (038-047) — all registered, never-drop
038 anchor-placeholder validator · 039 Haiku/MCP block · 040 Learning Orchestrator (→ P-META-005) ·
041 per-role cards + startup template · 042 usage orchestrator · 043 journey-as-container (5 hardwires) ·
044 governed Opus interface · 045 compact-vs-new-tab mechanism · 046 consolidation-safety harness (BUILT) ·
047 accounting core-spine. Plus the consolidation: MERGE-A/C/D applied; PHASEB-BUNDLE; drops 005/015/041.

## 5. KEY CONTEXT for the next tab (no re-derivation)
- **The meta-lesson:** CSPS is an *advisory overlay* on the native AI, not its substrate. The session's through-line
  = convert advisory→mechanical at every boundary (one-click gate, push-on-green, clarify-first next). Hooks gate
  *boundaries*, not *thinking* — so density of mechanical gates is how CSPS becomes "default."
- **Recurring trap:** relay/report files (sonnet-turn.md, opus-turn.md preamble) ship without layer-comment +
  I AM/YOU ARE/DO NOW headers → red tree. Fix = the structural auto-classify (carried).
- **Push discipline:** gate push on GREEN (`&& grep -q exit_code:0`), never the `;` chain (I slipped 3×; now hardwired).
- **Haiku envelope (measured):** reliable = count/single-pattern/presence/judgment-refusal; UNreliable = cross-file set-ops (route to Sonnet). Haiku returns carry WHO/WARRANT/ACTION.
- **Team = peers not ladder:** authority from evidence not rank (Sonnet corrected Opus 3× this session).

## 6. ZF-DEEP (iter-18 requirement)
- **Cycle 1 (placement):** every seed in §3 cites a committed file; every plan item in §2 has a DoD + status; every
  park 038-047 listed. No floating reference.
- **Cycle 2 (fresh angle — completion honesty):** flagged the 3 NOT-done items that Sonnet's reports framed as
  "complete": P-META-005 elevation (pending), page-machine (in flight), threshold ratification (needs green). S086
  is NOT "all complete" — these carry to S087. No nominal-DONE smuggled into the plan.
- **Cycle 3 (fresh angle — dependency soundness):** Phase 3 (PARK-043) correctly gated on Phase 2 (db-push); the
  threshold-consume half of clarify-first correctly gated on threshold stability; accounting (Phase 4) gated on the
  journey orchestrator + PARK-011. No item sequenced before its prerequisite. 0 new findings.
