---
id: csps.know-how.checklists.pre-plan-close
name: pre-plan-close-checklist
description: Mandatory gate before declaring any plan complete. Runs AFTER pnpm verify exit_code 0. Every item is an observed gap from real sessions. If any item fails, plan is NOT closed — fix first.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_checklists
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Pre-Plan-Close Checklist

> Run this AFTER `pnpm verify --skip-install` exits 0. Every unchecked item = plan NOT closed.

## Structural completeness

- [ ] **All L-level artifacts exist on disk** — every path listed in L1/L2/L3 tables has a real file
- [ ] **All exit criteria checked** — every `- [ ]` in the plan is now `- [x]` OR has explicit carry-forward note
- [ ] **§11 closure attestation section added** to plan body with timestamp + session ID
- [ ] **multi_session_arc updated** to include the current session
- [ ] **lifecycle_state** correct — `active` if L2/L3 still pending; `production` if fully done

## Registration completeness (→ EP-003)

- [ ] **Every new validator has its audit slug** in audit-runner.md (run `node tools/validators/validate-audit-slug-coverage.mjs` — must exit 0)
- [ ] **Every new validator is in verify.mjs** CYCLES array
- [ ] **Every new behavioral contract** has slice regenerated (`pnpm contracts:split`)
- [ ] **Every new principle** has slice regenerated (`pnpm principles:split`)

## Artifact update propagation (→ EP-001)

- [ ] **HANDOFF §B4** rows for this plan marked DONE ✅
- [ ] **token-optimization.md §9.0** Phase marker updated if this was a Phase N plan
- [ ] **OVERVIEW.md** latest-update callout mentions this plan's completion
- [ ] **closing-summary** honest_gaps updated (items delivered → removed from gaps)

## Code quality (→ EP-006)

- [ ] **Every new .mjs smoke-tested** with real invocation (not just node --check)
- [ ] **Cache paths exercised** if any caching was implemented
- [ ] **No require() in .mjs files** (ESM — use import from 'node:fs' etc.)

## Session tracking (→ EP-004, EP-007)

- [ ] **GP count matches user turns** (§10.0e governor-prompts count is accurate)
- [ ] **If post-close work done:** §24++ addendum section added to closing-summary
- [ ] **user-intents.md updated** if any cardinal directives were given during plan execution

## ZF evidence

- [ ] **pnpm verify exit_code 0** run IN THIS RESPONSE (not cached from prior run) — paste output hash
- [ ] **validate-topic-plan-progress.mjs passes** — this plan no longer appears as ORPHAN
- [ ] **0 persistent warnings** from prior sessions now resolved OR explicitly documented as LEGACY_YELLOW
