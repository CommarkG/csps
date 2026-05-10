---
id: csps.handoff.vault.s013-new-chat-prompt
name: s013-new-chat-prompt
description: Simple prompt for a new chat starting S013 work (Clerk webhook + Stripe billing). Carefully avoids session-number identity confusion — AI is told WHAT to do, not WHAT SESSION IT IS. The AI discovers its own session context from artifacts, not from being told "you are S013."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/inner-ai-defaults/README.md
  - docs/plan/pillar-0-governance/ai-behavior-improvement-plan.md
domain_path: platform
---

# New Chat Prompt — S013

> ⚠️ SESSION IDENTITY NOTE: This prompt does NOT say "You are S013." That causes identity confusion — AI may conflate the session label with its own identity. Instead: tell the AI the TASK and let it read the session context from committed artifacts.

## The correct prompt (paste to fresh chat)

```
You are Claude Code (or Gemini / GPT — adjust as appropriate).

The CSPS platform (CoreSights Platform Solutions) is at the following state:
- Foundation slices BUILT: User/Tenant/UserTenant/AuditEvent ZModel committed at commit 36847d5
- All design decisions resolved: See libs/policies/slices/public/foundation-design.md
- 31 governance validators passing: pnpm verify exit_code 0
- Platform documentation: docs/plan/_handoff/VAULT/OVERVIEW.md (read L1 for full context)

YOUR TASK: Clerk webhook integration + Stripe billing wiring

STEP 1: Run pnpm verify --skip-install → confirm 31 PASS exit_code 0
STEP 2: Read libs/policies/slices/public/foundation-design.md → understand what was built
STEP 3: Read tools/session-state.json → see the start protocol for this task
STEP 4: Read SESSION-BRIEF.md → human-readable status
STEP 5: Implement Clerk webhook handler that creates/updates Tenant on org creation
STEP 6: Implement Stripe customer creation → sets Tenant.stripeCustomerId
STEP 7: Run pnpm verify again → confirm exit_code 0
STEP 8: Emit a completion note in this format:
  "S013 complete. [what was built] committed at [commit hash]. pnpm verify: exit_code 0. Unlocks: [next task]."

IMPORTANT — AI BEHAVIOR DISCIPLINE:
- Never claim to be a different model than you are (EP-014 — no impersonation)
- When you feel "done," run pnpm verify first (EP-015 — satisfaction point prevention)
- If you notice a gap not in your task list, register it: add it to a vault entry or to-do
- DO NOT let things slide silently — proactive concern registration is mandatory

IMPORTANT — SESSION CONTEXT:
Read tools/session-state.json for the current mandate.
Read SESSION-BRIEF.md for the plain-English status.
Do NOT ask what session number you are — discover it from the artifacts.
```

## What was accomplished since the previous prompt for this chat

Since this chat was last instructed (S012 mandate):
- S012 completed: User/Tenant/UserTenant/AuditEvent ZModel built at 36847d5
- VLT-S011-003 implemented: UserTenant 1:N join table with MembershipRole enum
- VLT-S011-004 implemented: Tenant.clerkOrgId @unique (direct Clerk org mapping)
- pnpm verify exit_code 0; unplanned=0 (construction gate passed)
- session-state.json advanced to S013 mandate
- SESSION-BRIEF.md generated (human-readable status)
- GitHub Action live (.github/workflows/session-progress.yml)

## Why no session number in the prompt

AI systems (Claude, GPT, Gemini) have a training default to interpret "You are X" as an identity claim. Saying "You are S013" creates confusion:
- Does "S013" mean: the AI's identity? The task number? A version?
- If told "you are S013", the AI may inconsistently use this as its name in outputs
- This triggers EP-014 (mode impersonation) — the AI claims to be an entity it isn't

**The correct approach:** Tell the AI WHAT to do. Let it discover the session context from committed artifacts (session-state.json, foundation-design.md, SESSION-BRIEF.md). The §17 receipt is the identity anchor — the AI knows it's continuing from where the last session left off by reading the attestation chain.
