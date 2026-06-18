---
id: csps.handoff.opus-tab-transfer-S084-seed-authoring
name: OPUS-TAB-TRANSFER-S084-seed-authoring
description: "Self-contained tab-transfer / harvest / inheritance for the S084 AI-behaviour+PE+journey tab. New tab authors journey SEED-1..9 (design validated). Everything produced this tab captured here + in park-register (PARK-S084-020..033). Two-pass completeness-attested."
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: active
links:
  - { rel: journey-plan, href: ../pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md }
  - { rel: park-register, href: ../../../tools/data/park-register.yaml }
  - { rel: reasoning-plan, href: ../pillar-0-governance/REASONING-COLLABORATION-LAYER-PLAN.md }
  - { rel: identity-plan, href: ../pillar-0-governance/IDENTITY-GROUND-TRUTH-PLAN.md }
  - { rel: seed-review, href: VAULT/research/S084-seed-design-external-review-prompt.md }
---

# OPUS TAB TRANSFER — S084 (AI-behaviour + PE + journey design) → seed-authoring tab

**YOU ARE:** Opus (director) opening a fresh tab continuing S084.
**I AM:** Opus-21, the closing tab.
**STATE:** The journey-orchestrator DESIGN is complete + externally validated (self → 6-expert → rung-4 → ZF).
The #1 PE item is **authoring SEED-1..9** — design done, anchors NOT yet written. Tree verify=0; all pushed.
**DO NOW:** Author SEED-1 (constitution), then SEED-2..9, per the locked §0c R1–R8 decisions below.

## 1. THE #1 TASK — author journey SEED-1..9 (design validated, baked decisions)
Source of truth: [JOURNEY-ORCHESTRATOR-PLAN.md](../pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md) §0c + §3.
The PE scored this #1 (13.70, MOAT-PRIORITY). The 9 seeds + the rung-4 consensus to ENCODE:
- **SEED-1** constitution — encode **R5** (scope: platform|tenant + decide `tenant_extension` or lock "none" invariant),
  **R7** (selector is a SEED-1 PRE-CONDITION, not downstream), **R8** (ratification-interface contract:
  suggestion→review→confirm/downgrade+reason→log; touches SEED-6/8/2).
- **SEED-2** gate schema — gate_mode matrix + **R4** policy-evaluation contract subsection + blocked-message.
- **SEED-3** phase→binding map. **SEED-4** ripple — **R2** dependency-graph contract + max-depth circuit-breaker +
  **R2b** bind SEED-4 output→SEED-5 input. **SEED-5** evidence re-run (coupled to SEED-4).
- **SEED-6** closed enums + selector (see R7). **SEED-7** loops-report READ-aggregator.
- **SEED-8** event-log — **R3** REUSE AuditEvent AFTER storage-level immutability audit (no UPDATE/DELETE path);
  fields: event_id/tenant_id/actor/causation/correlation/idempotency/policy_version/graph_version/event_version.
- **SEED-9** definition-versioning + in-flight migration — **R1, the 3/3 external catch none of 6 internal experts found**:
  instances bind to specific def versions; never silently inherit; replay under historical policy.
- **R6** universal-ripple ENGINE is load-bearing in MVP (generic day-1); only per-class handlers defer; pick the 3
  HARDEST classes (schema-def / validator-rule / UI-binding).
Split (Independence Ladder): **Opus authors the seed ANCHORS** (sensitive constitution text, contracts, enums);
**Sonnet builds** from them (DB models, hooks, validators, tests); **Haiku** mechanical scans; **CROSS-ACCEPT**
mandatory (Sonnet audits Opus seeds before build).

## 2. SONNET PROMPT (paste to a Sonnet builder tab — small closing task + readiness)
```
Sonnet, this is Opus (relayed by Governor).
CLOSING TASK on the PE scorer (your open idle_decay question — Opus decision): apply a GRACE PERIOD —
idle_decay = 1.0 for I<=2 (actively-worked items keep FULL completion boost), decay begins at I>=3
(idle 2+ sessions = abandonment signal). Mark completion_proximity_boost as a HEURISTIC to be validated
by the PE-improvement loop (do not treat the curve as truth). verify=0, report FROM SONNET | FOR OPUS.
THEN: stand by for SEED-1..9 authoring — you build from the seeds once Opus writes the anchors. Do NOT
build journey seeds yourself (Opus authors the constitution).
```

## 3. HARVEST — what this tab produced (all pushed, never-drop)
**Ratified/engraved:**
- **B_SWIFT_OR_PARK** (new-input-during-active-process triage; memory `feedback_swift_or_park`; FSE parked PARK-023).
- **IGT** (identity = assignment vs assertion; IDENTITY-GROUND-TRUTH-PLAN ratified).
- **Reasoning-Collaboration-Layer** (5 mechanisms: MIRROR/INTENT-ECHO/STEELMAN-AGAINST/NAME-THE-TELL/CROSS-ACCEPT;
  ratified; D11 = the root of "100 rigid-rule attempts failed").
- **PE design decisions A/B/C** (completion=graduated-multiplier-gated-by-base+idle-decay, NOT base dim; depth-scope
  modulates B+D; PARK as first-class {DO/PARK/DROP} output).
- **PE is now a real 5-dim scorer** (`node tools/pe-compute.mjs --score`; ranking is live + reproducible).
- **Journey design** fully validated + §0c rung-4 consensus folded (R1–R8); 9 seeds spec'd.
**Live PE ranking** (use the engine, not recency): journey-seed #1 (13.70) · pe-improvement-loop #2 · reasoning-collab #3
· igt #4 · audit-ladder #5 · pe-interface #6 (PARK).

## 4. PARKS — never-drop register (PARK-S084-020..033), see [park-register.yaml](../../../tools/data/park-register.yaml)
- 020 Independence Ladder (roster = Model-PE dim 3) · 021 PE config interface/UI · 022 cost-adaptive audit ladder
  (Haiku→Sonnet→Opus) · 023 B_SWIFT_OR_PARK full FSE hardwire · 024 essence propagation (improvements→all journeys,
  mandatory P5 output) · 025 test-drive (verify-produces-intended) · **026 PE-improvement loop (the parent learning arc;
  outcome-vault doesn't exist yet)** · 027 scopes-weight deepdive (+short/med/long-term reasoning) · 028 rung-4 protocol
  fix (blind→reconcile) · 029 AI-profiling rewire · **030 AI-behaviour triggers/defaults/satisfaction-points = HIGHEST-
  priority class** · 031 test-drive the actual journeys after build · 032 tab-move universal harvest→threshold input
  pipeline (SWIFT outputs + parks + harvests = INPUTS through threshold) · 033 CSPS-DNA audit schema.

## 5. OPEN THREADS (not lost)
- **Reasoning-collab B1 pilot** (MIRROR + CROSS-ACCEPT) — gated behind #1, parked.
- **External rung-4** — Gemini/GPT/Claude returned; consensus folded into §0c. DONE.
- **idle_decay calibration** — decided (grace I≤2); Sonnet to apply (§2); curve validated later by PE-loop.

## 6. TWO-PASS COMPLETENESS ATTESTATION (Governor "go twice over the tab")
**Pass 1 (artifacts pushed?):** journey plan §0c+SEED-8/9, reasoning + identity plans, PE scorer, external prompt,
parks 020–033, memory (B_SWIFT_OR_PARK + IGT), this transfer doc — all committed to main, verify=0. [to confirm at push]
**Pass 2 (Governor asks captured?):** every directive this tab → a park or a plan edit (checked: profiling→029,
short/med/long→027, ai-behaviour-high→030, journey-testdrive→031, harvest/threshold→032, DNA-audit-schema→033,
SWIFT→B_SWIFT_OR_PARK+023, scopes-weight→027). 0 dropped.
**Inheritance:** a fresh tab reading THIS doc + park-register + JOURNEY-ORCHESTRATOR-PLAN has everything to author SEED-1..9.
