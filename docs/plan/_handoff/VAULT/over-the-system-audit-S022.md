---
id: csps.handoff.vault.over-the-system-audit.S022
name: over-the-system-audit-S022
description: >
  Comprehensive audit of all governance items declared "above the system" (AI memory,
  checklists, planned-week-4) instead of "within the system" (mechanical hooks, blocking
  validators). 49 planned-week-4 items in behavioral-contracts. Resolution protocol +
  categorization + external inheritance audit + consolidated plan addition.
  Governor directive: "find what is over vs within, permanently enforce, use internal personas."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, VALD, ARCH]
schema_anchor: vault_artifacts
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S022
impl_status: swift-implemented
ai_defaults_influence: none
links:
  - { rel: session-extraction, href: ./harvests/session-S022-extraction.md }
  - { rel: platform-plan, href: ./topic-plans/platform-excellence-completion-S023.md }
  - { rel: flow-audit, href: ./platform-flow-audit-S022.md }
scope_level: S1
---

# Over-the-System Audit — S022

> **The central problem:** The CSPS governance framework declared 49 enforcement mechanisms as
> "planned week-4." Week 4 never came. These 49 items are governance theater — written as if
> enforced, running as if optional. This is why ZF cycles, harvesting, PCR, and other critical
> behaviors are inconsistently applied: they rely on AI memory and goodwill, not mechanical force.

---

## §1 — SCALE OF THE PROBLEM

```
Behavioral contracts: 52 total (per Opus Turn 2 R-level classification)
  R1 (constitutionally enforced): 14 contracts
  R2 (planned but partial enforcement): 24 contracts
  R3 (context-conditional, humanly enforced): 10 contracts
  R4 (training-default overrides): 2 contracts
  R5: 0

Of the 14 R1 contracts: ~5 have active mechanical enforcement
Of the 24 R2 contracts: ~3 have active mechanical enforcement

Planned-week-4 items in behavioral-contracts.md: 49
  These represent validators and hooks declared but never built.
  "Week-4" was a debt label that accumulated across sessions S006-S022.
  No week-4 enforcement event ever occurred.

Hooks declared as STUB: 10 of 20 hooks
  Stub hooks exit 0 always — they fire but enforce nothing.
  They LOOK like enforcement but are NOT.
  This creates false confidence in the enforcement rate metric.

Actual enforcement rate (behavioral contracts with live mechanical enforcement):
  Estimated: 10-15% (5-8 contracts actively enforced per session)
  Reported: 29% (enforcement-rate metric counts different things)
  The gap between reported and actual IS the "over the system" problem.
```

---

## §2 — WHAT "OVER THE SYSTEM" MEANS

**Within the system:** A behavior is enforced because a mechanical tool (validator, hook, ZF gate)
STOPS or WARNS before the behavior can be completed without compliance. The AI cannot skip it.
No memory required. No goodwill required.

**Over the system:** A behavior is enforced by:
- A behavioral contract the AI is supposed to remember to apply
- A stub hook that exits 0 and does nothing
- A checklist item that no one checks if it was completed
- A validator that is advisory (exits 0) when it should be blocking
- A "planned week-4" tag on a validator that was never built

The test: **"Could a fresh Sonnet instance, with no session context, skip this behavior without
any mechanical system stopping or warning it?"** If YES → it is OVER the system.

---

## §3 — INTERNAL PERSONA REVIEW

**Persona: Fresh Sonnet, Session Open**

*"I open a new chat. session-state.json loads. I read the mandate. What will I skip?"*

| Behavior | Would I skip? | Why |
|---|---|---|
| Run `pnpm zf:deep` before declaring done | YES | No hook forces this. verify exit_code=0 feels sufficient. |
| Create session extraction note | YES | validate-session-harvest-readiness exits 0 (was advisory until S022 fix) |
| Write §KH section with substance | YES | Validator checks `know_how_consulted: true` (boolean), not content |
| Run PCR for multi-option decisions | SOMETIMES | post-stop-pcr-check.sh is a STUB — exits 0 always |
| Declare ai_defaults_influence on plans | SOMETIMES | validate-plan-ai-defaults is advisory, not blocking |
| Write §17 attestation per-line | SOMETIMES | No validator checks §17 completeness |
| Transcribe each protocol step to TodoWrite | OFTEN NOT | B_PROTOCOL_LITERAL_EXECUTION has no enforcer |
| Check existing decisions before proposing | OFTEN NOT | B_CHECK_EXISTING_DECISIONS_FIRST has no enforcer |
| Run HPFA before handoff | OFTEN NOT | hpfa-pre-handoff-coverage is planned week-4 |
| Run closing-summary template §10-§17 | PARTIALLY | Some sections have validators; most don't |

**Finding:** A fresh session could execute an entire implementation session, declare it complete,
write a closing-summary, and push — WITHOUT running ZF deep, without harvesting, without PCR
on key decisions, without §KH consultation. The system would not stop it. The verify would pass.

This is not a hypothetical. This is exactly what happened in S022 Sessions 3-6.

---

## §4 — RESOLUTION PROTOCOL

**The "Over → Within" Protocol:**

```
For each item that is currently "over the system":

1. CLASSIFY it:
   A: MUST-WITHIN-NOW — R1 contracts, critical gates. Build immediately.
   B: MUST-WITHIN-NEXT — R2 contracts. Schedule in Sessions B-D.
   C: DECLARE-NEVER-MECHANICAL — R3 contracts. Be honest: this is human-judgment.
   D: CONSOLIDATE — overlapping items. Merge into one stronger enforcement.

2. BUILD A MECHANICAL ENFORCEMENT (for A and B):
   Minimum: a validator that exits 1 when behavior is skipped
   Preferred: a hook that fires at the right lifecycle point
   Ideal: both validator + hook + the behavior is impossible to skip

3. RETIRE "WEEK-4":
   Every remaining "planned week-4" label must become one of:
     - A session assignment ("planned S023-SessionB")
     - Or a "human-judgment" explicit declaration
   "Week-4" as a label is retired. It was a debt mechanism, not a plan.

4. DEMONSTRATE (not just declare):
   For each enforcement built: produce evidence that it actually fires and blocks.
   "The hook exists" ≠ evidence. "The hook fired and stopped this behavior" = evidence.
```

---

## §5 — CATEGORIZED INVENTORY (Top 25 of 49)

### CLASS A: MUST-WITHIN-NOW (Build in Session A of excellence plan)

| Item | What it enforces | Current state | Fix |
|---|---|---|---|
| ZF deep before DONE declaration | B_RZF + B_PRE_CLOSE_VERIFICATION | Advisory only | validate-rzf-evidence exits 1 when DONE claim without ZF output |
| Session extraction before close | B_CEC + B_POSITIVE_VALUE_EXTRACTION | Advisory only | validate-session-harvest-readiness exits 1 |
| §KH content, not just flag | B_KNOW_HOW_DISCIPLINE | Boolean check | validate-plan-know-how checks §KH section has non-empty content |
| PCR on multi-option decisions | B_PCR_FOR_DECISIONS | Stub hook | post-stop-pcr-check.sh promoted from stub |
| AI-defaults declaration on plans | B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS | Advisory | validate-plan-ai-defaults exits 1 for `dominant` without ratification |
| Closing-summary completeness | B_PRE_CLOSE_VERIFICATION | Partial | validate-closing-summary-completeness checks all §10 sections present |

### CLASS B: MUST-WITHIN-NEXT (Session B of excellence plan)

| Item | What it enforces | Current state | Session |
|---|---|---|---|
| Webhook idempotency check | B_VALIDATE_BEFORE_ASSUME | Missing | validate-webhook-idempotency (Session B) |
| HPFA before handoff | B_HANDOFF_PRE_FLIGHT_AUDIT | Planned week-4 | hpfa-pre-handoff-coverage (Session B) |
| Protocol step transcription | B_PROTOCOL_LITERAL_EXECUTION | No enforcer | validate-protocol-literal-execution (Session B) |
| RZF coverage audit | B_RZF | Planned week-4 | rzf-coverage (Session B) |
| CEC walk trail completeness | B_CEC | Planned week-4 | cec-walk-trail-completeness (Session B) |
| Governor prompt log | B_GOVERNOR_PROMPTS | Stub | governor-prompt-coverage (Session C) |

### CLASS C: DECLARE-HUMAN-JUDGMENT (Explicitly non-mechanical)

| Item | Why non-mechanical |
|---|---|
| vale-prose linter | AI voice quality is semantic — no linter captures it correctly |
| cognitive-context-discipline | Which model tier to use is judgment-dependent per task |
| cache-content-hash fresh | Cache invalidation logic requires semantic understanding |
| muv-cross-chat-handshake | Alignment verification requires human reading |

**These items get `enforcement_stage: human-judgment` with a self-assessment question defined.**

### CLASS D: CONSOLIDATE

Several duplicate or overlapping planned items:
- `rzf-coverage` + `pre-close-cycle-coverage` + `nominal-rzf-detection` → MERGE into one RZF audit
- `catch-engraving-completeness` + `catch-engraving-coverage` → MERGE into one FSE audit
- Multiple agent-alignment validators → MERGE into existing `validate-aap-frontmatter.mjs` extension

---

## §6 — EXTERNAL INHERITANCE AUDIT

**Question:** When App #2 is built, does the platform's wisdom automatically reach the developer?

**What currently reaches them:**

| Wisdom | How it reaches | Completeness |
|---|---|---|
| R1 behavioral contracts | AGENTS.md (14 contracts) | ✅ Reaches session AI |
| Architectural principles | Not in template | ❌ |
| ZF discipline | Not documented for app developers | ❌ |
| pgbouncer + Prisma version | .env.example (if copied) | ⚠️ Partial |
| Clerk JWT template config | No guide | ❌ |
| Webhook idempotency pattern | Not documented | ❌ |
| Solo user flow requirement | Not documented | ❌ |
| Schema ZModel patterns | Not documented for app layer | ❌ |
| AuditEvent pattern | Only in app code, no guide | ⚠️ Partial |
| Role enforcement pattern | Not documented | ❌ |

**Root cause:** Platform wisdom lives in AI session context (skills, CLAUDE.md) and governance docs
(behavioral-contracts.md, principles.yaml). It does NOT live in developer-facing artifacts.
A developer building App #2 without an AI session would have no access to this wisdom.

**What must be built for proper inheritance:**

### EXTERNAL-1: `apps/template/CSPS_DEVELOPER_GUIDE.md`

5 critical sections developers MUST know:
```
1. ISOLATION: How tenant isolation works (ZenStack + RLS). Never trust tenantId from request body.
   Always read tenantId from JWT (sessionClaims.tenantId). Always filter by tenantId in queries.

2. AUTHENTICATION: The Clerk JWT setup. pubkey + secret key + JWT template claims + 
   public_metadata.tenantId. The 4-step setup checklist before the app will work.

3. DATABASE: DATABASE_URL must have ?pgbouncer=true for port 6543. DIRECT_URL for migrations.
   Never use db:push in production — use prisma migrate deploy.

4. WEBHOOKS: Every webhook case must check existence before creating. 
   user.created → check if User exists. org.created → check if Tenant exists. Etc.

5. ZF DISCIPLINE: Before declaring any feature "done": run pnpm verify (58 validators).
   Run pnpm zf:deep (cycles to zero blocking). Create a brief extraction note.
```

### EXTERNAL-2: Schema inheritance pattern

When App #2 adds domain entities, it must:
```
1. Add to libs/policies/schema.zmodel (shared schema)
2. Add @@allow("read", auth().tenantId == tenantId) minimum
3. Run zenstack generate + pnpm verify
4. Mirror in apps/{app}/prisma/schema.prisma (exact column names, exact types)
5. Run pnpm db:push on development DB
6. validate-foundation-schema-drift.mjs must exit 0
```

This sequence is not currently documented anywhere the developer can find it.

### EXTERNAL-3: Pattern library for App #2

The `libs/` directory contains reusable patterns. App #2 developers need to know:
- `libs/integrations/clerk/` — how auth works (webhook handlers + session context)
- `libs/integrations/stripe/` — how billing works
- `libs/integrations/gdpr.ts` — how erasure works
- `libs/config/subscription.config.ts` — all billing values in one file
- `libs/config/roles.config.ts` — all permission values in one file

These are the inheritance points. They must be explicitly surfaced in the developer guide.

### EXTERNAL-4: The "secrets" concern

The Governor said: "not exposing the secrets of the core, but inheriting the way things are built."

What is a "secret of the core":
- Governance governance (behavioral contracts, protocols) — internal AI discipline
- Session numbering + session-state.json — AI handoff mechanism
- The 22 Opus turn transcripts — strategic planning artifacts
- Inner AI defaults registry — AI self-calibration

What is NOT a secret (and should inherit):
- The 5 principles above (isolation, auth, DB, webhooks, ZF)
- The schema.zmodel patterns (ZenStack policies)
- The libs/ integration patterns
- The validation system (pnpm verify + what each validator checks)
- The role permission pattern (hasPermission())

The inheritance boundary: everything in `libs/` and `apps/template/` is developer-facing.
Everything in `docs/plan/` and `.claude/` is AI-session-facing.

---

## §7 — WHAT "PERMANENT PROCESS" LOOKS LIKE

The Governor wants: "a professional, profound process that covers all bases."

```
THE UNIFIED SESSION LIFECYCLE (mechanical, not aspirational):

PRE-SESSION GATE (fired by session-open.sh):
  ✓ pnpm verify → exit_code=0 required
  ✓ validate-vlt-blocking → pending=0 required
  ✓ Situation registry loaded (what mode are we in?)
  ✓ Priority Engine trajectory displayed (what is next?)

DURING SESSION:
  ✓ Pre-tool hooks fire on every Write/Edit/Agent call
  ✓ Post-tool hooks fire after every response
  ✓ PCR fired on multi-option decisions (promoted from stub)
  ✓ AI-defaults declaration checked on plan creation (advisory → blocking for dominant)
  ✓ §KH consulted on implementation sessions (validated for content, not flag)

PRE-CLOSE GATE (fired by post-stop-session-close-gate.sh — currently stub):
  ✓ pnpm verify → exit_code=0 REQUIRED
  ✓ pnpm zf:deep → ZF ACHIEVED REQUIRED (will block if advisories unaddressed)
  ✓ validate-session-harvest-readiness → HARVEST_DONE REQUIRED
  ✓ validate-rzf-evidence → RZF evidence present REQUIRED
  All four must pass before writing closing-summary is allowed.

POST-CLOSE:
  ✓ Closing-summary written using template
  ✓ All §10-§17 sections present (validate-closing-summary-completeness)
  ✓ Git push before handoff (B_ZERO_LAPTOP_DEPENDENCY)
  ✓ Handoff written with HPFA (hpfa-pre-handoff-coverage)

BETWEEN SESSIONS:
  ✓ pnpm verify passes (CI/CD gate — no regression)
  ✓ Situation registry reflects current mode
  ✓ PE trajectory updated
```

This is the target. Not all of this is mechanical today. Session A of the excellence plan builds the missing parts.

---

## §8 — CONSOLIDATED ADDITION TO EXCELLENCE PLAN

The `platform-excellence-completion-S023.md` should be updated to add:

**Session E: "Week-4" Retirement (PE_SCORE=8.5 | Band 1)**

Close all CLASS A items from §5. Retire "week-4" label from all remaining items.
Classify each: BUILD-NOW (A), BUILD-NEXT (B), HUMAN-JUDGMENT (C).

This session runs BEFORE Sessions A-D in the excellence plan because:
- CLASS A items ARE the process hardening
- Sessions A-D specify what to build
- Session E (added here) is the systematic triage that feeds Sessions A-D

**Revised PE ordering:**
```
Session 0 (this document + triage): week-4 retirement classification
Session A (process hardening): 6 CLASS A items built + closing template updated
Session B (system stability): 6 system-level gaps + 4 CLASS B items
Session C (monitoring infrastructure): 6 new validators + external inheritance guide
Session D (app template + GDPR): all external-facing inheritance artifacts
```

---

## §9 — EVIDENCE GATE FOR THIS AUDIT

This audit is COMPLETE when:

```
□ Every "planned week-4" item in behavioral-contracts.md has been reclassified to:
    A (session assignment) | B (session assignment) | C (human-judgment with SQ) | D (consolidated)
□ validate-inner-ai-defaults-enforcement-rate.mjs reports enforcement_rate > 50%
    (measuring ACTIVE enforcement, not declared)
□ The 10 STUB hooks are either: promoted to advisory/active OR explicitly retired
□ External inheritance artifacts exist: CSPS_DEVELOPER_GUIDE.md + schema pattern docs
□ session-E extraction note written for the week-4 retirement session
```

---

*Over-the-System Audit v1.0 | S022 | 2026-05-11*
*ai_defaults_influence: none — all derived from code audit + internal persona review + Governor directive*
