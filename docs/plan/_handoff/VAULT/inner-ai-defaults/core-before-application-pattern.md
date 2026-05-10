---
id: csps.governance.ai-default.core-before-application-pattern
name: core-before-application-pattern
description: AI default override — core infrastructure must be complete before any application layer. Foundation Exit Gate pattern.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: inner-ai-defaults
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
type: ai-default-override
category: planning
disposition: override
session: S015
engraved: 2026-05-07
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/inner-ai-defaults/reasoning-patterns.md
  - docs/plan/_handoff/VAULT/inner-ai-defaults/continuous-drift-log.md
  - tools/validators/validate-phase-exit-criteria.mjs
  - tools/templates/priority-engine.schema.yaml
domain_path: platform
---

# Core-Before-Application Pattern (FOUNDATION_EXIT_GATE)

## The Default Being Overridden

**AI training default:** Accept session-state mandate at face value. If session-state says "Phase 5 — Build apps/task-mgmt/", proceed to build apps/task-mgmt/.

**Why the default is wrong here:** Session-state records the *intended* next action, not the *validated* next action. A phase advance recorded in session-state is only valid if all predecessor phase exit criteria are checked. The AI's training optimizes for task completion — it does not question whether the task's prerequisites are actually met.

## The Override

**Rule:** Before accepting any phase-advance mandate, run (or check the output of) `validate-phase-exit-criteria.mjs`. If exit code = 1 (BLOCKING), the mandate is overridden regardless of what session-state says.

**Decision hierarchy:**
1. `validate-phase-exit-criteria.mjs` output → FOUNDATION_EXIT_GATE status
2. `validate-vlt-blocking.mjs` → PENDING VLTs
3. `validate-open-plan-levels.mjs` → open obligations
4. `session-state.json` mandate → lowest authority (desired next step, not validated next step)

Session-state is the least authoritative of the four signals. It records intent. Validators record reality.

## Why This Pattern Exists (S015 Discovery)

Session S015 opened with mandate "Phase 5 — Build apps/task-mgmt/". S015-AI accepted this at face value and began planning Phase 5 implementation. Governor challenge surfaced: Phase 3B had 2 unchecked exit criteria. Phase 4 master roadmap had 0 checked criteria. The sandbox had no Task CRUD routes — Phase 4's primary deliverable was never validated.

Root cause: The AI's session-state → mandate framing created a satisfaction point. The comfortable action was to build Phase 5. The correct action was to challenge whether the foundation existed.

**Pattern name:** Single-Source Navigation (S014 Discovery 2 — recurring)
**S015 instance:** session-state only, ignoring phase-exit-criteria state

## The 8 Freestyling Cracks (ZF iteration analysis — S015)

| # | Crack | Severity | Fix |
|---|---|---|---|
| 1 | Session-state bias — mandate accepted without 4-signal check | HIGH | session-open.sh now runs phase-exit-criteria |
| 2 | ZF orchestrator Level 1 didn't run phase-exit-criteria | HIGH | Added to runLevel1() |
| 3 | pnpm verify didn't run phase-exit-criteria | HIGH | Added cycle entry |
| 4 | extractFindings() didn't parse foundation gate output | MED | Added BLOCKING pattern |
| 5 | AGENTS.md missing FOUNDATION_EXIT_GATE hard NO | MED | Added 2 hard NOs |
| 6 | No AI defaults entry for this pattern | MED | This file |
| 7 | PE schema had no FOUNDATION_EXIT_GATE field | MED | Added §FOUNDATION_EXIT_GATE |
| 8 | Handoff didn't require §CORE-PILLARS section | HIGH | AGENTS.md hard NO + slim-handoff update |

**Cracks NOT yet sealed (next session):**
- PE not computed mechanically (pe-compute.mjs runs in syntax-check only, not as scoring validator)
- plan-coverage-gate doesn't warn on foundation gate (write is still allowed if path is covered)
- slim-handoff skill Zone A template not updated with §CORE-PILLARS structure

## How to Apply

At every session open and every consequential decision:
1. Check `validate-phase-exit-criteria.mjs` output — is it CLEAN or BLOCKING?
2. If BLOCKING: PE score for any new phase = 0. Work required = resolve the open exit criteria.
3. Two valid resolutions per open item: (a) complete it, (b) explicitly defer with documented WHY + when.
4. Silent deferral = the item remains blocking at next session.

Never treat "pnpm verify exit_code 0" as equivalent to "all exit criteria are checked." They measure different things. Verify = platform validators pass. Exit criteria = phase promises kept.
