---
id: csps.protos.PROTO-S068-PART-2-THRESHOLD-COMPLETE
name: PROTO-S068-PART-2-THRESHOLD-COMPLETE
description: "S068 re-gate PART 2. Make the threshold the ONLY gate of inputs — ACTIVE, accurate, scalable. Root cause found: threshold-router + council-dispatcher are tested library functions that the live input flow NEVER calls (dispatch 4/532 = EXISTS≠INVOKED). Design: (1) WIRE routeInput+dispatch into the live input pipeline (user-prompt-submit hook); (2) per-class correct+unique {spine,pipeline,place} — no default-to-unhandled; (3) scalability — stateless + tenant-shard + criticality-at-ingress + fast/slow-path + d_level brownout; (4) place-not-found → pending-node + foreign-element-intake routes. Opus authors design + 6-persona accuracy review BEFORE Sonnet builds (AMENDMENT E)."
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S068
authored_by: Opus-13
date: 2026-05-28
core_spine: ARCH
core_spines: [ARCH, GVRN, VALD, AI, OPER]
schema_anchor: protos
plan_item_id: "MASTER-RE-GATE-PLAN-S068 PART 2 + AMENDMENT E (Threshold-Accuracy Mandate, Governor ratified)"
core_seed_present: true
gate_tier: full-advance
inherits_from: "MASTER-RE-GATE-PLAN AMENDMENT E (Threshold-Accuracy Mandate) + M-42 UNIFIED-THRESHOLD-ROUTER (S067) + research S068-threshold-scalability-and-depth-levels + CSPS-PLANNING-DISCIPLINE §14 (wiring) + CORE-MAXIMAL-DOCTRINE (Template-or-Flag + GHG) + SPINE-PILLAR-MAP"
links:
  - rel: master-plan
    href: ../_handoff/MASTER-RE-GATE-PLAN-S068.md
  - rel: research
    href: ../_handoff/VAULT/research/S068-threshold-scalability-and-depth-levels.md
  - rel: router
    href: ../../../tools/scripts/threshold-router.mjs
  - rel: dispatcher
    href: ../../../tools/scripts/council-invocation-dispatcher.mjs
  - rel: spine-pillar-map
    href: ../pillar-0-governance/SPINE-PILLAR-MAP.md
context_question: "Before any threshold STEP commits: is the router actually INVOKED on live inputs (not just tested)? Does every input class route to a correct + unique {spine, pipeline, place} with no default-to-unhandled? Has the 6-persona accuracy review sealed?"
---

# PROTO-S068-PART-2-THRESHOLD-COMPLETE

**STATUS: DESIGN (Opus authoring) — NOT yet for Sonnet build.** Per AMENDMENT E: Opus authors classification design + 6-persona accuracy review FIRST; Sonnet builds only after the review seals. **Gate tier:** full-advance (the nervous-system brain — highest blast radius).

---

## CORE SEED — the architectural anchor

The threshold is meant to be the **ONLY gate** of inputs into CSPS (Governor S068). **Honest root-cause diagnosis (S068):** the router (`routeInput`) + dispatcher (`dispatch`) are **exported library functions with passing tests that the live input flow NEVER calls** — the only callers are docs, tests, and the coverage validator. Dispatch fired 4 times against 532 intake entries because **nothing in production invokes it.** The threshold is not a gate; it is a bypassed library. This is EXISTS≠INVOKED at the most critical layer.

**The prime directive of PART 2:** make the threshold ACTIVE — wired into the live input pipeline so EVERY input genuinely routes through it — then accurate, then scalable. Wiring before features (§14). **Ripple set (core seeds):** user-prompt-submit hook (the wiring point) · council-registry · pending-nodes · foreign-element-intake · CIE/PE · the daily alignment pass.

---

## 6-PERSONA ACCURACY REVIEW (AMENDMENT E — mandatory, BEFORE build)

- **cruel-critic:** "The 4/532 proves the worst case already happened — a 'gate' nothing flows through. Don't add features to an uninvoked router. STEP 1 is WIRING it to the live path, or every later STEP is theater." → STEP 1 = wiring; accuracy/scale follow.
- **bottleneck-expert:** "Once wired to EVERY input, a synchronous router becomes the throughput ceiling. Must be stateless + tenant-sharded + fast-path (cheap in-memory classify, common case) / slow-path (deep routing async). Else the only-gate is the only-bottleneck." → scalability is STEP 3, non-optional.
- **schema-expert:** "Inputs need a typed classification result {spine, pipeline, place, criticality}. Stamp criticality at ingress (Google SRE classes) so PE prioritizes + load-shedding is free." → criticality = a classifier output.
- **consolidation-expert:** "Don't build a new router — M-42 routeInput EXISTS. WIRE + complete it. Also consolidate the 2 intake logs (vlt-00009) + the no-fit routing (GHG + place-not-found + vault = ONE flow, vlt-00008)." → extend M-42, unify routing.
- **balance-expert:** "Every input through one classifier could over-govern trivial inputs. Fast-path must let low-criticality/trivial inputs through cheaply; reserve council-dispatch + deep routing for proposal/consequential classes." → tiered by criticality, not uniform.
- **ux-expert:** "Mis-routing is felt as broken behavior. The router must NEVER default-to-unhandled silently — place-not-found is an explicit, visible route (pending-node + notify), per Template-or-Flag." → no silent default; place-not-found is first-class.

**Synthesis (Opus):** all 6 converge — (1) WIRE first (the 4/532 fix), (2) extend M-42 don't rebuild, (3) criticality-at-ingress enables both PE-priority + scalable load-shedding, (4) fast/slow-path tiered by criticality, (5) no silent default — place-not-found is explicit. Accuracy = provably correct+unique per class, verified, not "passes a test."

---

## STEP 0 — design completeness (Opus, this file)
**DONE WHEN:** [x] root-cause diagnosed (4/532 = uninvoked) · [x] 7-persona review embedded (5 in S068 + ux + UI added by OPUS-13 below — the prior "6-persona ✓" was nominal at 5; now real at 7) · [x] core seed + ripple set · [x] classification design authored (OPUS-13, below) · [ ] Governor ratifies design → Sonnet builds.

---

## OPUS-13 FINALIZATION (S069) — classification design + 6th persona (ratification-ready)
> AUTHOR: OPUS-13 | numbers are samples/tunable, the class set is the **current enumeration — expandable** (new classes route to place-not-found, never silently dropped).

### 6th PERSONA — ux-expert (was missing; AMENDMENT E required it)
**ux-expert (6th):** "Mis-routing is felt by the human as a broken product — an input that lands in the wrong place, or silently nowhere, is a UX failure even if no test fails. Every class must route to a place a human can SEE the input went to (visible terminal), and place-not-found must surface, not vanish." → Applied: every class has a visible terminal (place); place-not-found → pending-node + **notify** (no silent drop); criticality drives PE ordering so the human's urgent input isn't shed.

**UI-expert (7th — ux is the flow, UI is the surface):** "A routed input the human can 'see' must be rendered as a clear, scannable surface — which spine / place / criticality, with visual hierarchy + affordances + design-token consistency — not a raw log row. The routing result is a UI artifact, not just data." → Applied: each 'place' terminal has a UI representation (rendered on the relevant dashboard, consistent with design-tokens + the comms dashboard); criticality shown as a visual cue (not just a field); place-not-found surfaces as a visible, actionable item, not a log line. (7-persona review now real.)

### CLASSIFICATION DESIGN (STEP 2 substance — per-class correct+UNIQUE {spine, pipeline, place, criticality})
Current enumerated input classes (expandable; each maps uniquely — no overlap, no default-to-unhandled):

| Input class | spine | pipeline | place (visible terminal) | criticality (sample tiers) |
|---|---|---|---|---|
| Governor directive / ratification | GVRN | decision-rights | opus-turn / council | CRITICAL_PLUS |
| Implementation / schema / code | ARCH | build | proto → Sonnet | CRITICAL |
| AI-behavior / inner-default | AI | alignment | inner-defaults registry | CRITICAL |
| Validation / ZF / evidence | VALD | coverage | verify / last-run | CRITICAL |
| Proposal / consequential decision | (by content) | CIP staging + INVOKE council | change-impact-staging | CRITICAL |
| External content / research | AI | alignment + VAULT_DEFER | vault | SHEDDABLE_PLUS |
| Maintenance / tactical / adjacent | (by content) | VAULT | vault-pending | SHEDDABLE |
| Conversational / SHAPE-TIER | — | PROCESS-NOW fast-path | chat | SHEDDABLE_PLUS |
| **Foreign element** (MCP/skill/agent) | (quarantine) | foreign-element-intake | localization tiers | CRITICAL (untiered → STOP) |
| **place-not-found** (no class matches) | — | pending-node + notify | pending-nodes register | inherits input's criticality |

**Accuracy mandate (the two catch-alls make it exhaustive):** every input either matches a class above OR falls to `place-not-found` (explicit, notified) — there is NO silent default-to-unhandled. `validate-threshold-exhaustive.mjs` (STEP 2) proves zero unhandled paths. Audience tier (from communication-schema.yaml) is stamped alongside criticality so System→User routing knows the recipient tier.

### S069 COUPLINGS (so Sonnet builds consistent)
- CIP `PROPOSED-CHANGE` route sits ON TOP of this — build PART 2 wiring (STEP 1) first, then CIP adds its class.
- The cornerstone principle (context-refined communication): each class's routing message is context-wrapped, not a bare code.
- "place" = the journey/comms "visible terminal" — ties to the ratification pipeline's INSPECT step.

## STEP 1 — WIRE the threshold into the live input path (the 4/532 fix)
**Owner:** Sonnet | **Tier:** full-advance
**DONE WHEN:**
- [ ] `user-prompt-submit` hook (or the canonical input entry) CALLS `routeInput()` on every input
- [ ] routeInput result drives `dispatch()` for proposal/consequential classes
- [ ] council-invocation-log shows invocations tracking intake (not 4/532) — measured
- [ ] behavioral test: a live-shaped input flows router→dispatch end-to-end
- [ ] wiring_state: active · CHECKPOINT + 3-scope feedback (§15)

## STEP 2 — exhaustive + accurate classification (no default-to-unhandled)
**DONE WHEN:**
- [ ] every input class → correct + UNIQUE {spine, pipeline, place, criticality}; enumerate all classes
- [ ] `validate-threshold-exhaustive.mjs` — zero `default-fallback-to-unhandled` paths; in verify pipeline
- [ ] place-not-found → pending-node row + notify (explicit route, Template-or-Flag); foreign-element-intake route present
- [ ] consolidate 2 intake logs → ONE (vlt-00009); unify no-fit routing → ONE flow (vlt-00008)
- [ ] CHECKPOINT + 3-scope feedback

## STEP 3 — scalability (stateless + sharded + criticality + brownout)
**DONE WHEN:**
- [ ] router is stateless + tenant-shardable (no shared mutable state in hot path)
- [ ] criticality stamped at ingress (CRITICAL_PLUS/CRITICAL/SHEDDABLE_PLUS/SHEDDABLE) → PE consumes
- [ ] fast-path (in-memory classify) / slow-path (async deep routing) split
- [ ] d_level brownout lever: under load, route at D1 only (graceful degradation)
- [ ] behavioral test: load-shed sheds lowest criticality first; verify
- [ ] CHECKPOINT + 3-scope feedback

## STEP 4 — SEAL
**DONE WHEN:** all STEPs active+wired+measured · verify --strict=0 · Opus OPIA (REAL not nominal) · council-invocation tracking intake (the 4/532 fixed, measured) · PART 2 marked SEALED · push.

---

## DONE WHEN (whole PART)
The threshold is the ACTIVE only-gate: every live input routes through it (measured, not 4/532); every class routes correct+unique with no silent default; scalable (stateless/sharded/criticality/brownout); place-not-found + foreign-element routes explicit. verify=0; Opus OPIA confirms REAL.

## ZF gate
Sonnet ZF cycles per STEP cite: the wiring point (which hook calls routeInput) + measured invocation count (was 4/532) + per-class routing proof + load-shed test exit. Opus 15-point OPIA before SEAL — verifying the router is INVOKED (not just tested), the accuracy mandate met, scalability proven.

## NEXT
On SEAL → the threshold is the only gate; foreign-element-intake + pending-node + research-pipeline all route through it. PART 3 (Product Schema) proceeds with the threshold live.
