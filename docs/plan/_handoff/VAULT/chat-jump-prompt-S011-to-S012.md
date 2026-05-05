---
id: csps.handoff.vault.chat-jump-prompt-s011-to-s012
name: chat-jump-prompt-S011-to-S012
description: Chat-jump prompt for S012 (minimal + detailed variants). S011 CLOSED — Phase 8 COMPLETE + Phase 9 PARTIAL. S012 PRIMARY = Phase 9 9a-9f completion (validate-token-budget.mjs + pe-compute.mjs + bundling orchestrator + schema-index.md + 10-scenario test + corespine extension).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: chat-jump-prompt
template_status: stable
core_spine: GVRN
schema_anchor: chat_jump_prompts
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: how-to
session: S011
next_session: S012
---

# Chat-Jump Prompt — S011 → S012

## MINIMAL (paste into new chat)

```
S011 CLOSED. You are S012. Phase 8 COMPLETE (principles-mcp slice-reading + 4 tools + build PASS). Phase 9 PARTIAL (8 context-loading templates done; validate-token-budget.mjs + pe-compute.mjs + bundling orchestrator DEFERRED). S012 PRIMARY = Phase 9 9a-9f. Open HANDOFF-S011-to-S012.md at docs/plan/_handoff/ for full scope. Emit §17 receipt first: S012-AI-receipt-<iso>-against-S011-AI-attest-2026-05-05T16:50:00Z-S011-close. Run pnpm verify --skip-install to confirm exit_code 0 before proceeding.
```

## DETAILED (~150 words — self-contained)

```
You are S012 of the CSPS planning project. S011 CLOSED 2026-05-05.

WHAT S011 DELIVERED:
- Phase 8 COMPLETE: packages/principles-mcp/src/index.ts upgraded from skeleton to slice-reading; loads principles-index.yaml at boot; 6 query tools (get_principle/list_principles/find_by_enforcer_layer/find_by_spine + legacy); depth L1/L2/L3; build PASS; L1 ~200 tokens/principle vs 85K monolith
- OVERVIEW.md v3.0: S008-S010 delta tables, schema section updated, stale audience-routing fixed
- CEC walk: 7 stale "Phase 8 (S012)" references fixed across platform
- Phase 9 9g: 8 context-loading JSON templates at tools/templates/context-loading/ + template-registry §6

YOUR PRIMARY WORK (Phase 9 9a-9f):
1. tools/validators/validate-token-budget.mjs — 5-mode validator (§9.10 + EXT-002-A)
2. tools/pe-compute.mjs — PE.read_budget computation (EXT-004-C)
3. tools/pe-context-cache.json — L1 cache structure
4. schema-index.md (EXT-005-C)
5. 10-scenario test (un-defer from S007)
6. corespine_layer_compliance extension (EXT-004-D)

SECONDARY: 16 SKILL.md AAP 9-field backfill + CronCreate weekly-tag-status-deep-audit

STEP 1: Emit §17 receipt: S012-AI-receipt-<iso>-against-S011-AI-attest-2026-05-05T16:50:00Z-S011-close
STEP 2: pnpm verify --skip-install — expect exit_code 0; 53 principles; 17 templates; 130 slices
STEP 3: Open docs/plan/_handoff/HANDOFF-S011-to-S012.md for full scope

Platform: Sonnet[1m] default (Lever 1). Hard NOs: never read principles.yaml monolith (use get_principle or slice). Never read behavioral-contracts.md monolith (use B_NAME.md slice).
```
