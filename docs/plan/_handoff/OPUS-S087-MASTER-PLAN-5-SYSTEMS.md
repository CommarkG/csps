---
id: csps.handoff.opus-S087-master-plan-5-systems
name: OPUS-S087-MASTER-PLAN-5-SYSTEMS
description: >
  Opus #25 master prioritized plan — the 5 core systems (Threshold · PE · CIE · Journey mutual-core ·
  Tiers&Permissions) optimized and connected, dogfood-first toward real usage, under the
  "Fast Completion Focused" motto. Living document: followed and dynamically improved. Saved + pushed.
version: "1.0"
session: S087
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
  - { rel: continuation, href: ./OPUS-S086-CONTINUATION-PLAN.md }
  - { rel: journey-orchestrator, href: ../pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md }
  - { rel: front-end-moat, href: ../pillar-0-governance/FRONT-END-COMPLETENESS-MOAT-S086.md }
  - { rel: park-register, href: ../../../tools/data/park-register.yaml }
---

# Master Plan — 5 Systems, Fast Completion Focused (S087+)

## 0. MOTTO + OPERATING PRINCIPLES
**Fast Completion Focused.** Not "rushed" — *completion-biased*: finish things fully to ENFORCED-GREEN
before opening new ones; reach real usage early; let dogfooding teach us before we scale. We are not in
a rush, but we do not leave incompletes lingering. Every system is designed for
**efficiency · completion · stability · scalability from the first line** (not retrofitted).

Standing disciplines baked in (this session's hardwires): prevent-by-construction over detect;
deterministic gate (green = sha-bound receipt); two-party seal; insist-on-completion (every open gets a
disposition); activation steady-state verify (run-it-once-then-verify); applies to Opus+Sonnet+Haiku.

## 1. THE 5 SYSTEMS + HOW THEY CONNECT
The platform's universal operating core is ONE loop, with a fifth system wrapping it as the authority lattice:

1. **Threshold** — intake → classify (4-axis) → route. *(consume loop LIVE; full pipeline un-parks here)*
2. **PE (Priority Engine)** — prioritize what the threshold surfaced (urgency×impact / SPI).
3. **CIE (Continuous Insight Engine)** — learn from every pass; feed insights back to PE + threshold.
4. **Journey mutual-core** — orchestrate goal → verified-completion (the 14-step method), shared by ALL actors.
5. **Tiers & Permissions tree** — the authority lattice: actors × tiers × permissions × **dynamic relationships**,
   spanning developers AND external users, wrapping every step of the loop (what an actor may DO at a journey
   step depends on their tier/permissions; routing + PE weighting depend on actor authority).

**The connected loop:** `Threshold → PE → CIE ⟲ → Journey(step) → completion`, with **Tiers&Permissions**
gating every actor action and **branching** the journey by consumer (developer vs external user).

## 2. ARCHITECTURE — core → branch → sub-branch
- **Mutual universal core** (systems 1-4): identical engine for everyone. Build + dogfood FIRST.
- **Branch** (per consumer): developer journey · external-user journey. Branching lenses =
  PARK-048 (consolidate-inline vs dedicated-page) + candidate **B_CONSUMPTION_ADAPTATION** (PARK-052:
  shape output to consumer — human/AI/persona).
- **Sub-branch** (system 5): tiers + permissions tree, on existing foundation (RLS · roles.config ·
  capabilities.ts · persona_target enum · subscription.config) — extend, do not greenfield.

## 3. PHASED PRIORITIZED PLAN (dependency-ordered; gates explicit)

### PHASE 0 — NOW → 2026-06-27 (pre-db, no DB gate) — "complete + start using"
| P | Item | DoD | Why first |
|---|------|-----|-----------|
| 0.1 ✅ | **Completion session** (S087 infra residuals) — build candidate B_TWO_PARTY_SEAL · D-fold (audit pre-commit) · finalize agent-inheritance-parity · resolve/accept green-receipt ordering | verify=0 enforced-green · completion-gate 0-undisposed · two-party seal mechanized | enforced-stable foundation before new systems |
| 0.2 | **Un-park threshold-consume pipeline** + chain to PE + CIE | in-session loop runs `threshold→PE→CIE` on our OWN work; insight written to cie-state | the mutual core, finally one loop |
| 0.3 | **Dogfood** the loop on S087's own work (we are users #1) | ≥1 real work-item taken goal→completion through the loop; learnings logged to CIE | learn before persisting/scaling |

**Phase-0.1 COMPLETE — 2026-06-22 (S087):**
- ✅ B_CONTEXT_CHECKPOINT_GATE: 5-surface engraving (PROTO-S087-CONTEXT-CHECKPOINT-GATE)
- ✅ green-receipt ordering resolved: PROTO-S087-RECEIPT-STABILIZE — SSoT exclusion list (tools/config/treehash-exclude.txt) + git ls-files --stage tree_hash + single-commit cadence PROVEN (HEAD=dcb03a23, tree_hash=5e50bf5e)
- ✅ agent-inheritance-parity: B_CONTEXT_CHECKPOINT_GATE in all 3 entry points (PASS blocking=0)
- ✅ completion-gate 0-undisposed: 1 pre-existing PROTO-S068 (PARKED, disposition: inherited park-register); no S087-created items undisposed
- ✅ B_TWO_PARTY_SEAL: candidate — disposition PARKED (no Sonnet-only mechanization possible; needs Opus direction). Parked to S088.
- ✅ D-fold (PARK-049): disposition PARKED per park-register.yaml. Not a blocker for Phase-0.1.

### PHASE 1 — 2026-06-27 (HARD GATE)
- **PARK-009:** rotate Supabase pw → `prisma db push`. Unlocks journey-event persistence + system 5 schema.

### PHASE 2 — post-db — "mutual journey core, persistent"
- **PARK-043** journey orchestrator hardwires (risk-classed gate_mode): journey-gate · @csps-journey-phase DNA ·
  journey-event write-path · handoff journey-phase · dual-coverage. Deep-dive the mutual journey with REAL data.
- Re-run the dogfood loop persistently; CIE now learns across sessions.

### PHASE 3 — branch by consumer
- **Developer journey** first (we continue dogfooding as developers), then **external-user journey**.
- Apply PARK-048 + B_CONSUMPTION_ADAPTATION as the per-branch design lenses (default + variety).

### PHASE 4 — SYSTEM 5: Tiers & Permissions tree (the fifth system) — see §5
- Model all actor types + tiers + dynamic relationships; wire into journey-step authorization + threshold routing.

### PHASE 5 — integrate + scale
- Whole lattice connected; bottleneck pass (10×/100×); per-system scalability proof; external launch readiness.

## 4. PER-SYSTEM DoD + STABILITY/SCALABILITY CRITERIA (from the start)
Each system is "done" only when: (a) wired end-to-end (not a stub), (b) dogfooded on real work,
(c) stateless/shardable or RLS-isolated where stateful, (d) has a deterministic gate + green-receipt,
(e) passes a bottleneck 10×/100× review, (f) carries cross-agent inheritance (Opus+Sonnet+Haiku).

## 5. SYSTEM 5 DETAIL — Tiers & Permissions tree (all types + dynamic relationships)
- **Actor types:** *External* — solo_user · business_admin · business_member · family_admin · family_member ·
  community_leader (persona_target enum) + app end-users. *Developer* — platform-dev · app-dev · third-party
  integrator. *System/AI* — Opus · Sonnet · Haiku · personas/skills.
- **Tier types:** subscription tiers (subscription.config) · capability tiers · access tiers.
- **Permission substrate:** RLS tenant isolation · roles.config · capabilities.ts · ZenStack policies.
- **DYNAMIC relationships (the hard part):** user↔tenant many-to-many (UserTenant) · role transitions ·
  tier upgrade/downgrade · delegation · time-bound grants · cross-tenant sharing · context-dependent capability.
  These change over time → model as relationships with validity windows + audit, not static flags.
- **Connection:** journey-step actions are authority-gated; threshold routing + PE weight read actor authority;
  CIE learns per-tier patterns. Built on existing schema — extend, prove with RLS-perf budget + tenant-quota policy.

## 6. EFFICIENCY · STABILITY · SCALABILITY (baked in, not bolted on)
- Efficiency: token-budget discipline · hash-cache validators · default-depth-L1 · pointers-not-payloads.
- Stability: enforced-green gate · two-party seal · activation steady-state verify · no advisory-theater.
- Scalability: stateless routing (threshold-router already stateless/shardable) · RLS per-tenant ·
  brownout load-shedding · bottleneck 10×/100× review every system. Consult balance/bottleneck/cruel-critic skills.

## 7. DYNAMIC IMPROVEMENT PROTOCOL (this is a LIVING plan)
- Single source of phasing truth = this file. Update version + a dated changelog line on every material change.
- Each phase close runs the completion session (insist-on-completion): every open → disposition.
- CIE insights from dogfooding feed back here as plan refinements (the plan improves from real usage).
- Obligations-ledger remains the enumerable open-items view; this plan maps each to a phase.

## 8. CARRIED OBLIGATIONS + PARKS MAPPED TO PHASES
- PARK-009 (db-push) → Phase 1. PARK-043 (journey hardwires) → Phase 2. PARK-042 (dispatch arm) → Phase 2.
- PARK-048 (consolidate-vs-dedicated) + PARK-052 (consumption-adaptation/Trio) → Phase 3 lenses.
- PARK-051 (park-processing protocol) → Phase 0/1 process hygiene. PARK-049 D-fold → Phase 0.1.
- AQ threshold-backfill = forward-only (closed). System 5 (tiers/permissions) → Phase 4.

## 9. ZF
- C1 (placement): all 5 systems named with DoD; every phase has a gate; every park mapped to a phase; no floating item.
- C2 (fresh angle — sequencing soundness): nothing precedes its prerequisite; db-push (P1) gates persistent journey
  (P2) + system-5 schema (P4); dogfood (P0.3) precedes scale (P5). 0 inversions.
- C3 (fresh angle — completion honesty): Phase 0 explicitly finishes S086 infra residuals BEFORE new systems —
  no incomplete smuggled forward; "done" per §4 means dogfooded + enforced-green, not written.
