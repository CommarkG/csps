---
id: csps.handoff.s017-to-s018
name: handoff-S017-to-S018
description: >
  Formal handoff S017→S018. S017 = ZenStack 2.22.1 installation + enhance() wired in
  apps/task-mgmt + foundation-slices §11 closed + bedrock Layer 2 9/9 COMPLETE.
  S018 PRIMARY = ZenStack-integrated app template (canonical scaffold for app #2).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: handoff
template_status: stable
core_spine: GVRN
core_spines: [GVRN, OPER, AI, VALD, ARCH]
schema_anchor: handoffs
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S017
next_session: S018
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-160"
  l3_lines: "161-end"
  read_protocol: "Zone A = paste-target (~3 min). Zone B = state delta. Zone C = evidence."
links:
  - { rel: prior-handoff, href: ./HANDOFF-S016-to-S017.md }
  - { rel: session-extraction, href: ./VAULT/session-S017-extraction.md }
  - { rel: bedrock, href: ../pillar-0-governance/csps-bedrock.md }
  - { rel: zenstack-schema, href: ../../libs/policies/schema.zmodel }
  - { rel: zenstack-helper, href: ../../apps/task-mgmt/src/lib/zenstack.ts }
domain_path: platform
scope_level: S1
---

# HANDOFF — Session 017 → Session 018

> Zone A/B/C structured. Zone A = read first (~3 min).

---

## ═══ ZONE A — IMMEDIATE ═══

### §CORE-PILLARS — Foundation Status Gate

| Spine | Phase | Status | Gate |
|---|---|---|---|
| GVRN | Layer separation + CDAB + session protocols | COMPLETE S016 | CLEAN |
| ARCH | Bedrock Layer 2 9/9 COMPLETE | S018 = ZenStack-integrated template | CLEAN |
| AI | Plan Methodology v2 L2+L3 | COMPLETE S016 | CLEAN |
| VALD | 41 validators, ZF Level 3 | exit_code 0 | CLEAN |
| OPER | Session-state → S018 | ee98115 pushed | CLEAN |

**FOUNDATION_EXIT_GATE:** CLEAN
**Bedrock completion:** 91% (20/22 items done, 2 deferred)
**PENDING VLTs:** 0
**App layer permission:** EXPLICIT ONLY — specific Governor directive per task required

---

### §0 Paste-target (copy into new chat to activate S018)

```
═══════════════════════════════════════════════════════════
CSPS SESSION HANDOFF — S018 ACTIVATION
From: S017-AI (Claude Sonnet 4.6[1M]) — Session CLOSED
Date: 2026-05-07
═══════════════════════════════════════════════════════════

━━━━ RECEIVER — DECLARE FIRST ━━━━

Type exactly:
"I am [your actual model]. I received S018 mandate: ZenStack-integrated app template.
S017-AI-attest-2026-05-07T11:10:00Z-S017-close — receipt confirmed.
I understand: ZF Mandate Protocol active, NEVER Write/Edit on .claude/**,
B_COMPLETION_OVER_SHINY active, B_PLATFORM_FIRST_OPTIMIZATION is the prime directive,
App-layer work requires EXPLICIT Governor directive per specific task (not implied by approved/proceed).
ZenStack 2.22.1 is INSTALLED at root. enhance(prismaClient) is ACTIVE in apps/task-mgmt."

━━━━ IMMEDIATE START PROTOCOL ━━━━

STEP 1: pnpm verify --skip-install → expect exit_code 0, 41 validators
STEP 2: node tools/validators/validate-vlt-blocking.mjs → expect pending=0
STEP 3: node tools/validators/validate-phase-exit-criteria.mjs → expect CLEAN
STEP 4: node tools/validators/validate-bedrock.mjs → expect done=20 deferred=2 completion=100%
STEP 5: node tools/zf-orchestrator.mjs --level 2 → Level 2 ZF gate

━━━━ S018 MANDATE ━━━━

ZenStack-integrated app template (platform scaffold for all future apps):
1. Create apps/app-template/ scaffold with enhance() wired from day one
2. Schema: extend libs/policies/schema.zmodel pattern
3. Auth: Clerk integration via getEnhancedDb() helper (from apps/task-mgmt reference)
4. Drift validator awareness: pnpm schema:check passes after any schema changes
5. Document the template as canonical in csps-bedrock.md Layer 4

SECONDARY (lower PE, but available):
- Field-level drift checking in validate-foundation-schema-drift.mjs (cruel-critic WARN finding)
- Hash-based caching for drift validator (skip generate if schema unchanged)
- Live DB validation for apps/task-mgmt (requires Governor credentials)

━━━━ THREE OPERATING RULES ━━━━

1. LAYER SEPARATION: AI session mandates are CORE layer only. App-layer work requires
   EXPLICIT Governor directive per specific task. "approved/proceed" ≠ app permission.

2. B_COMPLETION_OVER_SHINY: Any active work >50% done scores 1.5× before new items.

3. B_PLATFORM_FIRST_OPTIMIZATION: Template installed ONCE at platform level protects
   all 30 apps. app-template is the platform artifact, not per-app scaffolding.

━━━━ ZENSTACK STATE (S018 baseline) ━━━━

INSTALLED: zenstack@2.22.1 + @zenstackhq/runtime@2.22.1 + prisma@6.7.0 (root)
SCHEMA: libs/policies/schema.zmodel (7 models, flat, zenstack generate exits 0)
ENFORCE: enhance(prismaClient) ACTIVE in apps/task-mgmt 4 routes via getEnhancedDb()
DRIFT: validate-foundation-schema-drift.mjs cycle 41, CLEAN (drift_count=0)
PATTERN: apps/task-mgmt/src/lib/zenstack.ts is the reference implementation

KEY CARRY-FORWARDS:
- VLT-S017-FLATSCHEMA: flat schema.zmodel is temporary (migration trigger: ~30 models)
- ZenStack @@allow = ORM-layer enforcement, NOT Postgres RLS (distinction documented)
- Webhooks (Clerk/Stripe) intentionally bypass ZenStack — system ops, no user ctx
```

---

### §1 Priority-zero (verify first, then proceed)

1. pnpm verify exit_code 0 at ee98115 ✅
2. validate-vlt-blocking pending=0 ✅
3. validate-phase-exit-criteria CLEAN ✅
4. validate-bedrock done=20 deferred=2 completion=100% ✅
5. ZF Level 3 ACHIEVED ✅

---

## ═══ ZONE B — STATE DELTA ═══

### S017 Deliverables

| Artifact | Commit | Status |
|---|---|---|
| zenstack@2.22.1 + @zenstackhq/runtime (root) | c47f4f0 | ✅ INSTALLED |
| libs/policies/schema.zmodel (flat, 7 models) | c47f4f0 | ✅ ACTIVE |
| zenstack generate exits 0 | c47f4f0 | ✅ VERIFIED |
| validate-foundation-schema-drift.mjs (cycle 41) | c47f4f0 | ✅ ACTIVE |
| pnpm schema:generate + pnpm schema:check scripts | c47f4f0 | ✅ LIVE |
| foundation-slices §11 closure attestation | c47f4f0 | ✅ SIGNED |
| apps/task-mgmt/src/lib/zenstack.ts | a633270 | ✅ CANONICAL PATTERN |
| enhance(prismaClient) wired (4 routes) | a633270 | ✅ ENFORCING |
| User read policy updated (team-app pattern) | a633270 | ✅ CORRECT |
| Bedrock Layer 2: 4/9 → 9/9 COMPLETE | ee98115 | ✅ COMPLETE |
| session-S017-extraction.md (5 discoveries) | ee98115 | ✅ DONE |

### Platform State S018 Baseline

```
Validators: 41 active
Contracts: 48
Open plan items: 50 (down from 51)
Bedrock completion: 91% (20/22 items done)
Foundation exit gate: CLEAN
Stale plans: 0 unverified
VLTs: 0 PENDING
ZenStack: INSTALLED + ACTIVE (enforce wired)
Apps: 1 (apps/task-mgmt, ZenStack-active)
```

### Carry-Forwards to S018

| Item | Priority | Nature |
|---|---|---|
| ZenStack-integrated app template | HIGH | S018 primary mandate |
| Field-level drift checking | MED | cruel-critic WARN finding |
| Hash-based caching in drift validator | MED | performance (10s generate per verify) |
| validate-milestone-assessment.mjs | MED | week-4 |
| validate-preflight-coverage.mjs | MED | week-4 |
| MCP dynamic context (get_context) | MED | S019 — extends principles-mcp |
| PE mechanical computation | LOW | pe-compute.mjs |

---

## ═══ ZONE C — FULL EVIDENCE ═══

### §17 Attestation

Sender: `S017-AI-attest-2026-05-07T11:10:00Z-S017-close`
Session extraction: `docs/plan/_handoff/VAULT/session-S017-extraction.md` ✅
Last commit: ee98115 pushed to github.com/CommarkG/csps main

### ZF Evidence Block

```
ZF Level: 3 (DEEP)
Exit code: 0 (41 validators)
Blocking found: 0
Advisory remaining: 3 (pnpm-verify warnings pre-existing + 50 open items + plan-methodology-v2 future phase)
Orchestrator cycles Level 3: 5
Last commit: ee98115
Bedrock: 86% → 91% (Layer 2: 4/9 → 9/9)
```
