---
id: csps.handoff.vault.chat-jump-prompt-s011-to-s012
name: chat-jump-prompt-S011-to-S012
description: Chat-jump prompt for S012 (minimal + detailed variants). S011 CLOSED — Phase 8 COMPLETE + Phase 9 COMPLETE (§24++ post-close addendum). Final verify 2026-05-05T18:28:55Z; 14 validators PASS; 0 warnings. S012 PRIMARY = Phase 10 activation + context-orchestrator hook + 10-scenario user-verification.
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
S011 CLOSED. You are S012. ALL BLOCKING RESOLVED (VLT-S011-003 + VLT-S011-004). pnpm verify: 31 validators PASS exit_code 0. TWO KEY DECISIONS: (1) User/Tenant = 1:N via UserTenant join table. (2) Clerk org → Tenant = direct 1:1 (Tenant.clerkOrgId). ZModel design committed at libs/policies/slices/public/foundation-design.md — READ THIS FIRST before writing any code. S012 PRIMARY = Foundation slices L1 (User/Tenant/UserTenant/AuditEvent ZModel). Step 1: emit §17 receipt. Step 2: pnpm verify --skip-install. Step 3: read foundation-design.md. Step 4: build the 4 ZModel files. §17: S012-AI-receipt-<iso>-against-S011-AI-attest-2026-05-05T16:50:00Z-S011-close
```

## DETAILED (~150 words — self-contained)

```
You are S012 of the CSPS planning project. S011 CLOSED 2026-05-05.

WHAT S011 DELIVERED (Phase 8 + Phase 9 BOTH COMPLETE):
- Phase 8 COMPLETE: principles-mcp slice-reading; 6 query tools; depth L1/L2/L3; ~200 tokens/principle vs 85K monolith
- Phase 9 COMPLETE (§24++ post-close addendum): validate-token-budget.mjs (5-mode) + pe-compute.mjs + pe-context-cache.json + schema-index.md (24 rows) + validate-corespine-depth-markers.mjs + 5 L1_CORE backfilled + 8 context-loading templates + 5 audit slugs registered
- pnpm verify: 11 active validators PASS (was 9)
- OVERVIEW.md v3.0 + CEC walk + QC sweep + audit-runner Phase 9 slugs registered

YOUR PRIMARY WORK (Phase 10):
1. Phase 10 activation (token-optimization §9.11): weekly-tag-status-deep-audit hook ACTIVE + HONEST CALIBRATION measurement + topic-plan §11 closure
2. user-prompt-submit-context-orchestrator.sh hook — task-class detection making context-loading templates mechanical
3. 10-scenario user-verification (tools/test-scenarios/token-optimization-10-scenario.json) — run manually; ≥9/10 PASS = Phase 4d complete

SECONDARY: 16 SKILL.md AAP 9-field backfill + CronCreate weekly-tag-status-deep-audit

STEP 1: Emit §17 receipt: S012-AI-receipt-<iso>-against-S011-AI-attest-2026-05-05T16:50:00Z-S011-close
STEP 2: pnpm verify --skip-install — expect exit_code 0; 53 principles; 17 templates; 130 slices; 14 validators; 0 warnings
STEP 3: Open docs/plan/_handoff/HANDOFF-S011-to-S012.md for full scope

Platform: Sonnet[1m] default (Lever 1). Hard NOs: never read principles.yaml monolith (use get_principle or slice). Never read behavioral-contracts.md monolith (use B_NAME.md slice).
```
