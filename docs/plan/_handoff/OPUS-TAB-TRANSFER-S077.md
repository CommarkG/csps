---
id: csps.handoff.opus-tab-transfer-s077
name: OPUS-TAB-TRANSFER-S077
description: >
  OPUS-17 → OPUS-18 director tab-transfer (S077, at the foundation-complete boundary). Self-contained: a fresh Opus
  director tab resumes cold from this without re-absorbing session history (Design-Goal-6: orient from wired state).
  Clean cut = the PHASE TRANSITION — foundation sealing → developer/user journeys (Governor's completion directive).
version: 1.0
session: S077
owner: group:finky
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD]
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
layer: scaffold
disposable_if: arrangement_changes
links:
  - { rel: prior-transfer, href: OPUS-TAB-TRANSFER-S076.md }
  - { rel: handoff, href: HANDOFF-S076-to-S077.md }
  - { rel: dim4-spec, href: VAULT/sandbox-specs/SANDBOX-multi-tenant-scale-readiness-spec-S076.md }
---

# OPUS-17 → OPUS-18 — director tab-transfer (S077, foundation-complete boundary)

## WHO/NOW (orient from the WIRED SYSTEM, not this narrative — Design-Goal-6)
You are OPUS-18, architectural DIRECTOR (Sonnet builds; you direct + independently verify). Linear council.
Cold-start: M-43 → `node tools/verify.mjs --skip-install` (expect exit_code=0) → read `tools/council/opus-turn.md`
TOP + `tools/council/sonnet-turn.md` TOP. That + this file = full context. HEAD ≈ 9e2934b8 (or later after S4).
VERIFY-BEFORE-CONCUR (HARDWIRE-008): every OPIA verdict cites a THIS-TURN re-run. Re-run IS the proof.

## ZONE A — State (S077)
verify exit_code=0 · 78 hooks · S076 SEALED (90b0a9e0). Foundation: dim-1 ✅ · dim-2 ✅ · dim-3 ✅ (structural;
behavioral pending) · dim-4 ◑ **4/5 sealed (S1·S2·S3·S5 ✅), S4 (k6 load harness) = FINAL surface, in Sonnet's hands.**
When S4 seals → dim-4 SEAL → **FOUNDATION COMPLETE.** Sonnet compacted late-S077 (context saturated).

## ZONE B — THE PIVOT (this is why the tab turns here)
After dim-4 seals, the Governor's standing directive fires: **STOP governance accretion; pivot to DEVELOPER & USER
JOURNEYS — with the Governor IN THE LOOP (not just Opus↔Sonnet).** Apps unlock only after foundation complete.
GATE: the Governor RATIFIES each journey + its ADMIN DASHBOARD **before any test-drive** (feedback_journeys_ratify_before_testdrive).

## ZONE C — Active / immediate
- dim-4 Surface 4 OPIA: k6 N×M load harness. SEAL BAR (honest, Free tier): harness + a representative run green at
  Free-tier scale; the FULL 30-app load gate is DEFERRED to the boundary-003 tier-upgrade (Free can't host 30 — correct).
  → OPIA → dim-4 SEAL = foundation complete.
- THEN: open the journeys phase. First Governor decision: which developer+user journey first. Design journey + admin
  dashboard → Governor ratify → test-drive.

## ZONE D — Carry-forward (all registered)
| Item | Where | Condition |
|---|---|---|
| dim-3 behavioral keystone | FINDING-S076-DIM3-01 | clean window + Q3 rzf-detector ADVISORY→BLOCKING, ONE commit |
| gap_PROGRESS_DISCIPLINE_CLUSTER | gap-register, due 2026-06-16 | the 4 focus concepts (conditional-ladder/resistance, plan-vs-exec, progress-monitoring, mid-plan-threshold) |
| boundary-003 tier-upgrade | boundaries-register | Free→paid before app scale-out (trigger ~80% pool headroom) |
| HOLD list (no new governance) | memory project_s077_queued_ideas + project_cqs_alignment_layer | CQS Phase-1, process core-spine, threshold front-end, build-from-1-and-100 — all queued, NOT built |

## GOVERNOR DIRECTIVES — internalize (these shaped S076-S077, read the memories)
- **Completion-focus:** finish the foundation, then journeys; do NOT keep building governance machinery. Sonnet flagged
  completion 3× before convergence — heed it early. (feedback_mid_plan_injection_to_threshold)
- **Mid-plan injections → threshold:** when the Governor/user drops a NEW concept mid-active-plan, REGISTER it (queue),
  do NOT auto-absorb. Flag "active plan = X; new — queue or explicit-pivot?".
- **Governor is NOT a system expert:** for any CLI/DB task HE runs, guide TRUE beginner step-by-step, define terms,
  flag destructive ops, one step at a time. (user_governor_non_expert)
- **Minimal-now + schedule-upgrade:** pick minimal to unblock, but register the best-infra upgrade as a dated obligation.
- **PCR always** (incl. AskUserQuestion option-sets). **?-trigger:** before proposing options/new terms, search vocabulary first.

## DISCIPLINES INHERITED
verify-before-concur (HARDWIRE-008) · Opus PLANS + core-seeds + sensitive plan text; Sonnet does FULL build-out
(seed-vs-build line) · FOCUS: one thrust, rest = conditional queue (no sprawl) · go-over-what-exists before creating ·
apply-path for migrations on this db-push-managed DB = raw SQL via db execute on DIRECT_URL (NOT migrate deploy → P3005).

## ALIGNMENT QUESTIONS (for fresh OPUS-18)
Q1 verify exit_code=0 this turn? (re-run, cite). Q2 has dim-4 S4 sealed yet (check opus-turn/sonnet-turn TOP)?
Q3 if S4 sealed → foundation complete → has the journeys pivot begun + which journey did the Governor choose?
Q4 HOLD list still held (no new governance crept in)?

— OPUS-17 · S077 · 2026-06-02 · 140K remaining; Governor directed a fresh Opus tab at the foundation-complete
boundary. Clean cut: foundation sealing → journeys phase. The platform is one surface (S4) from foundation-complete.
