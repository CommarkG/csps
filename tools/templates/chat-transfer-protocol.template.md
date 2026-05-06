---
id: csps.tools.templates.chat-transfer-protocol
name: chat-transfer-protocol-template
description: ZERO-DRIFT chat transfer protocol for CSPS task handoffs. Fixes the "common sense does not work on chat transfers" problem — explicit sender/receiver identity, mandatory declaration before action, required output per step, exact completion format, BLOCKED path. Use this for ALL AI-to-AI task transfers. Platform-agnostic — works for Claude, GPT, Gemini, Lovable, Bolt.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: meta-template
template_status: stable
core_spine: GVRN
schema_anchor: tools_templates_meta
template_id: chat-transfer-protocol
tags:
  - domain:governance
  - domain:ops
  - type:how-to
  - audience:ai-agent
  - maturity:stable
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/s013-new-chat-prompt.md    # replaced by this
  - docs/plan/pillar-0-governance/ai-behavior-improvement-plan.md
---

# Chat Transfer Protocol Template — CSPS

> **Zero-drift design.** Every field is mandatory. Every step has a required output. AI cannot drift because there is no space to drift into.

## §1 — Template (fill in [brackets], keep structure exact)

```
═══════════════════════════════════════════════════════════
CSPS TASK TRANSFER — [TASK NAME]
Sender: [S011-AI | Governor Yariv Fink]  Date: [ISO date]
═══════════════════════════════════════════════════════════

━━━━ RECEIVER — DECLARE FIRST, DO NOTHING UNTIL DONE ━━━━

Type exactly:
"I am [your actual model name — Claude / GPT-4o / Gemini-Pro / etc.].
I received task: [TASK NAME].
I will execute steps 1-[N] in order. I will emit the completion format exactly."

If you cannot make that declaration honestly, STOP and report why.

━━━━ PLATFORM STATE (verified by sender) ━━━━

• [State item 1: specific fact with commit/hash if applicable]
• [State item 2]
• Validators: [N] PASS, exit_code 0 at [commit hash]

━━━━ EXECUTE IN ORDER — NO SKIPPING, NO REORDERING ━━━━

STEP 1: [specific command or action]
  → REQUIRED OUTPUT: [exact format — e.g., "exit_code 0 AND N+ validators PASS"]
  → IF FAILS: stop. Report: "BLOCKED at step 1: [reason]. Output: [output]"

STEP 2: [specific command or action]
  → REQUIRED OUTPUT: [exact format]
  → IF FAILS: stop. Report: "BLOCKED at step 2: [reason]"

[repeat for all steps]

━━━━ COMPLETION FORMAT (emit exactly, no variations) ━━━━

[TASK NAME] complete. Built: [list]. Committed: [hash]. pnpm verify: exit_code 0. Unlocks: [next task].

━━━━ NON-NEGOTIABLE ━━━━

• If you feel done before all steps verified: STOP. Run pnpm verify. (EP-015 satisfaction point)
• BLOCKED = stop immediately, report format above, do not continue
• Do not add work not in this list
• Do not rephrase the completion format
```

## §2 — Why this works (zero-drift mechanics)

| Problem | How template fixes it |
|---|---|
| AI doesn't know who it is | DECLARE FIRST block — must type exact statement before any action |
| AI skips to interesting parts | IN ORDER — no skipping, no reordering — explicit |
| AI decides "done" early | EP-015 prevention in NON-NEGOTIABLE + verify-before-done rule |
| AI improvises completion | EXACT completion format — template with [substitution only] |
| AI adds unrequested work | "Do not add work not in this list" — explicit prohibition |
| AI continues past blockage | BLOCKED = stop immediately — no judgement call |

## §3 — S013 filled example

```
═══════════════════════════════════════════════════════════
CSPS TASK TRANSFER — Clerk Webhook + Stripe Billing Wiring (S013)
Sender: S011-AI (Claude Sonnet 4.6[1M]) + Governor Yariv Fink
Date: 2026-05-06
═══════════════════════════════════════════════════════════

━━━━ RECEIVER — DECLARE FIRST, DO NOTHING UNTIL DONE ━━━━

Type exactly:
"I am [your actual model name].
I received task: Clerk webhook + Stripe billing wiring.
I will execute steps 1-5 in order. I will emit the completion format exactly."

━━━━ PLATFORM STATE ━━━━

• Foundation slices BUILT: User/Tenant/UserTenant/AuditEvent at commit 36847d5
• Design: libs/policies/slices/public/foundation-design.md (read STEP 2)
• 31 validators PASS, exit_code 0

━━━━ EXECUTE IN ORDER ━━━━

STEP 1: Run `pnpm verify --skip-install`
  → REQUIRED: exit_code 0 AND 31+ validators PASS
  → IF FAILS: "BLOCKED at step 1: verify failed. Output: [paste output]"

STEP 2: Run `head -80 libs/policies/slices/public/foundation-design.md`
  → REQUIRED: see User/Tenant/UserTenant/AuditEvent ZModel confirmed

STEP 3: Implement Clerk webhook — on org.created → create Tenant (set clerkOrgId); on membership.created → create UserTenant (set role)
  → REQUIRED: webhook handler file created and committed

STEP 4: Implement Stripe — on Tenant create → stripe.customers.create → save to Tenant.stripeCustomerId
  → REQUIRED: Stripe integration file created and committed

STEP 5: Run `pnpm verify --skip-install`
  → REQUIRED: exit_code 0

━━━━ COMPLETION FORMAT ━━━━

S013 complete. Built: [list what you built]. Committed: [git hash]. pnpm verify: exit_code 0. Unlocks: S014.

━━━━ NON-NEGOTIABLE ━━━━

• If done feeling before step 5 verified: STOP. Run pnpm verify. (EP-015)
• BLOCKED = stop immediately, report format above
• Do not add work not listed here
• Completion format: exact template above, [substitutions only]
```
