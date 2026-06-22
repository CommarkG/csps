---
id: csps.governance.journey-persona-audit-S084
name: JOURNEY-PERSONA-AUDIT-S084
description: >
  Naive + expert persona audit of the Journey-as-Process (the platform's 14-step operating method).
  Answers: what is the universal CORE (trunk), and WHERE + WHY there must be persona-specific BRANCHES.
  Run per NAIVE-PERSONAS-DOCTRINE (audit from below, not only architect-altitude).
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: GVRN
diataxis_type: explanation
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: audit-1-complete
links:
  - { rel: naive-personas, href: NAIVE-PERSONAS-DOCTRINE.md }
  - { rel: journey-doctrine, href: JOURNEY-DOCTRINE.md }
  - { rel: trunk-branch, href: P-ARCH-TRUNK-BRANCH-PATTERN.md }
  - { rel: comm-tiers, href: communication-spine/communication-schema.yaml }
---

# Journey Persona Audit (S084)

> The Journey = the platform's operating method (14 steps: goal → humble-understanding → survey-what-exists
> → align/consolidate → gap-draft → PCR options (fast→thorough) → PE/CIE decide → ≥3 simulations →
> research → draft+iterate → test-drives+iterate → activate → verify-completely).
> This audit runs that method through 5 personas spanning the trust/expertise gradient, auditing FROM BELOW.

## Personas (real, from profiles.ts + the actor-class model)
- **P1 Governor** (DEV-001) — full authority; focal point = platform-wide alignment + optimization.
- **P2 Core developer** — builds the platform; technical; focal point = correct, wired build.
- **P3 Platform-builder developer** — builds their OWN products on the platform; focal point = ship their product.
- **P4 Business admin / team-leader** — manages a tenant; low tech; focal point = team outcome.
- **P5 End-user** (USER-001 Alex, cognitive-offload) — zero jargon; focal point = achieve my task, min friction.

## The CORE (trunk — universal across ALL personas; never branches)
The audit's central finding: the **14-step SEQUENCE + its integrity rules are invariant** — they are the
method's spine and must be identical for everyone (only their EXPRESSION branches):
- **C1** The ordered sequence itself (goal→…→verify) — no actor may reorder or skip a step.
- **C2** Humble-understanding BEFORE acting (survey-what-exists precedes building) — universal.
- **C3** Evidence/WARRANT at every step (each step cites real evidence; no step passes on assertion).
- **C4** Decision via PCR→PE/CIE (options before commit; the optimal path is chosen, not defaulted).
- **C5** Verify-completely at the end (IZFC) — "done" = wired + called + verified, for everyone.
Why these are core: they are what makes a journey a *journey* and not a guess. Removing any one = the
method degrades to ad-hoc action. The trunk is SEALED-equivalent (constitution), per Trunk+Branch P-ARCH.

## WHERE + WHY there must be BRANCHES (5 branch axes, persona-selected)
The SAME 14-step trunk runs for everyone, but its EXPRESSION branches on 5 axes. The branch SELECTOR is
the persona tier (comm-schema 6-tier / 5-actor model).

| # | Branch axis | P1 Gov | P2 Core-dev | P3 Builder | P4 Admin | P5 End-user | WHY it must branch |
|---|---|---|---|---|---|---|---|
| **B1 DEPTH** (fast↔thorough) | thorough/platform-wide | thorough | medium | fast | fastest | focal point differs: platform-integrity vs task-completion. The PCR "fast→thorough" spectrum IS this axis. |
| **B2 DRIVE vs AUTO** (who runs the middle steps) | drives all | drives most | drives some | platform auto-runs most | platform auto-runs ALL middle steps | cognitive load + expertise. A naive user CANNOT consciously run survey/gap/PCR/sim — the platform runs them in the background; the user experiences goal→[magic]→confirm. |
| **B3 VOCABULARY** (jargon tier) | full internal | full | API-level | business terms | ZERO jargon | comprehension (comm-schema 6-tier). "crystallized_intent" to Gov = fine; to Alex = opaque. |
| **B4 PERMISSION/RATIFY scope** | ratify+seal anything | core artifacts | own products only | own tenant | own instance only | trust/authority (5-actor tier model, PARK-S084-011). |
| **B5 FOCAL POINT** (what "completion" means) | platform aligned+optimized | correct+wired | product shipped | team outcome met | my goal achieved | success is defined differently per actor; verify-completely (C5) checks against THEIR focal point. |

## The decisive naive-persona finding (audit-from-below)
The architect (Opus) sees the 14-step journey as elegant. **P5 (Alex) sees it as overwhelming and abandons.**
Therefore the **end-user branch MUST auto-collapse the trunk**: the 14 steps run *underneath*, but the
SURFACE Alex experiences is ~3 steps — "What do you want to do? → [platform runs survey/gap/PCR/PE/sim/
draft for you] → here's the path, confirm? → done + verified." The journey is NOT removed for the naive
user; it is RUN FOR THEM. The expert (P1/P2) enters and drives the full 14; the naive user (P5) gets the
same trunk auto-driven behind a 1-question door. **B2 (drive-vs-auto) is the most important branch axis** —
it is the difference between a tool experts love and a platform ordinary users can actually use.

## Architecture implication (for the orchestrator)
- ONE journey trunk (the 14-step method) — built once, governed, SEALED.
- A **persona-tier selector** that sets the 5 branch axes (depth / drive-vs-auto / vocabulary / permission / focal-point).
- The orchestrator runs the trunk; the branch config determines how much the actor drives vs the platform
  auto-runs, in what words, to what depth, with what rights, toward whose definition of done.
- The journey-admin dashboard is ONE surface (expert/driver view). The end-user surface is a DIFFERENT
  branch of the SAME trunk (the 1-question door). Same method, different expression.

## Gaps surfaced by this audit (for the orchestrator build)
- G1 No persona-tier SELECTOR exists that maps an actor → the 5 branch-axis settings.
- G2 No AUTO-RUN capability — the middle steps (survey/gap/PCR/PE/sim) are expert-driven only; nothing
  runs them for a naive user. This is the biggest build gap (B2).
- G3 No "focal-point" field on a journey instance — verify-completely (C5) can't yet check against the
  actor's definition of done (B5).
- G4 vocabulary tiering exists in comm-schema but is not wired to journey-step rendering (B3).

— OPUS-21, S084 (per NAIVE-PERSONAS-DOCTRINE, audit-from-below)
