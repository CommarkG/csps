---
id: csps.handoff.s016-to-s017
name: handoff-S016-to-S017
description: >
  Formal handoff S016→S017. S016 = Plan Methodology v2 L2+L3 + CDAB named + layer separation
  + rigid-rule anti-pattern + bedrock defined + VLT-S016-ZENSTACK resolved.
  S017 PRIMARY = ZenStack installation (Option A) + foundation-slices L3 closure.
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
session: S016
next_session: S017
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-160"
  l3_lines: "161-end"
  read_protocol: "Zone A = paste-target (~3 min). Zone B = state delta. Zone C = evidence."
links:
  - { rel: prior-handoff, href: ./HANDOFF-S015-to-S016.md }
  - { rel: session-extraction, href: ./VAULT/session-S016-extraction.md }
  - { rel: bedrock, href: ../pillar-0-governance/csps-bedrock.md }
  - { rel: layer-separation, href: ../pillar-0-governance/csps-layer-separation.md }
domain_path: platform
---

# HANDOFF — Session 016 → Session 017

> Zone A/B/C structured. Zone A = read first (~3 min).

---

## ═══ ZONE A — IMMEDIATE ═══

### §CORE-PILLARS — Foundation Status Gate

| Spine | Phase | Status | Gate |
|---|---|---|---|
| GVRN | Layer separation + CDAB named | COMPLETE S016 | CLEAN |
| ARCH | Bedrock 67% → 86% done | S017 = ZenStack (Layer 2 completion) | CLEAN |
| AI | Plan Methodology v2 L2+L3 | COMPLETE S016 | CLEAN |
| VALD | 40 validators, ZF Level 3 | exit_code 0 | CLEAN |
| OPER | Session-state → S017 | cd1ff55 pushed | CLEAN |

**FOUNDATION_EXIT_GATE:** CLEAN
**Bedrock completion:** 86% (18/21 items done, 3 deferred pending ZenStack)
**PENDING VLTs:** 0
**App layer permission:** EXPLICIT ONLY — specific Governor directive per task required

---

### §0 Paste-target (copy into new chat to activate S017)

```
═══════════════════════════════════════════════════════════
CSPS SESSION HANDOFF — S017 ACTIVATION
From: S016-AI (Claude Sonnet 4.6[1M]) — Session CLOSED
Date: 2026-05-07
═══════════════════════════════════════════════════════════

━━━━ RECEIVER — DECLARE FIRST ━━━━

Type exactly:
"I am [your actual model]. I received S017 mandate: ZenStack installation + foundation-slices L3.
S016-AI-attest-2026-05-07T08:30:00Z-S016-close — receipt confirmed.
I understand: ZF Mandate Protocol active, NEVER Write/Edit on .claude/**,
B_COMPLETION_OVER_SHINY active, B_PLATFORM_FIRST_OPTIMIZATION is the prime directive,
App-layer work requires EXPLICIT Governor directive per specific task (not implied by approved/proceed)."

━━━━ IMMEDIATE START PROTOCOL ━━━━

STEP 1: pnpm verify --skip-install → expect exit_code 0, 40 validators
STEP 2: node tools/validators/validate-vlt-blocking.mjs → expect pending=0
STEP 3: node tools/validators/validate-phase-exit-criteria.mjs → expect CLEAN
STEP 4: node tools/validators/validate-bedrock.mjs → check completion %
STEP 5: node tools/zf-orchestrator.mjs --level 2 → Level 2 ZF gate
STEP 6: Read docs/plan/_handoff/VAULT/topic-plans/foundation-slices.md §3 L3

━━━━ S017 MANDATE ━━━━

ZenStack installation (VLT-S016-ZENSTACK Option A — Governor ratified):
1. Install ZenStack in CSPS project (pnpm add @zenstackhq/runtime + zenstack CLI)
2. Wire ZModel → Prisma generation pipeline (zenstack generate replaces prisma generate)
3. Apply RLS policies from libs/policies/slices/ ZModel @@allow rules
4. Create validate-foundation-schema-drift.mjs + wire into pnpm verify
5. Register foundation-slices-schema-drift audit slug
6. Sign foundation-slices §11 closure attestation

━━━━ THREE OPERATING RULES ━━━━

1. LAYER SEPARATION: AI session mandates are CORE layer only. App-layer work requires
   EXPLICIT Governor directive per specific task. "approved/proceed" ≠ app permission.

2. B_COMPLETION_OVER_SHINY: Active ZenStack work >50% → 1.5× PE weight.
   New shiny items → raw-thoughts-queue → assessed at milestone gate.

3. B_PLATFORM_FIRST_OPTIMIZATION: ZenStack installed ONCE at platform level protects
   all 30 apps. Do not install per-app. libs/policies/ is the canonical location.

━━━━ CDAB STATUS ━━━━

CDAB (Context Driven AI Behavior) is now named in csps-core-manifest.md.
Infrastructure: 40 validators, 48 contracts, 10 inner-ai-defaults files (all with disposition).
Gap: PE computation still manual (S017+). MCP dynamic context still S018+.
The 70% advisory gap is known and tracked — do not add more advisory surfaces without MCP.

━━━━ APP LAYER ━━━━

apps/task-mgmt/ is COMPLETE as a core validation scaffold. Live deployment
(pnpm db:push, dev server) requires explicit Governor directive with credentials.
Do NOT surface app-layer work proactively.
```

---

### §1 Priority-zero (verify first, then proceed)

1. pnpm verify exit_code 0 at cd1ff55 ✅
2. validate-vlt-blocking pending=0 ✅
3. validate-phase-exit-criteria CLEAN ✅
4. ZF Level 3 ACHIEVED ✅
5. Read: foundation-slices.md L3 + session-S016-extraction.md

---

## ═══ ZONE B — STATE DELTA ═══

### S016 Deliverables

| Artifact | Commit | Status |
|---|---|---|
| B_HUMBLE_EXECUTOR (5/5 FSE) | 4c0a23f | ✅ ENGRAVED |
| B_AUTONOMOUS_BATCH_WITH_PREFLIGHT (5/5 FSE) | 4c0a23f | ✅ ENGRAVED |
| Chat State Snapshot template | 4c0a23f | ✅ LIVE |
| Assumption blocks in gradual-build-plan template | e5b9ec8 | ✅ LIVE |
| §7 Intersection Detection in plan-creation-protocol | e5b9ec8 | ✅ LIVE |
| validate-plan-harvest-coverage.mjs (cycle 39) | cd1ff55 | ✅ ACTIVE |
| validate-execution-mode-declared.mjs (cycle 40) | cd1ff55 | ✅ ACTIVE |
| 6 plans §HARVEST retrofitted | cd1ff55 | ✅ DONE |
| csps-bedrock.md + validate-bedrock.mjs | 72380a9 | ✅ ACTIVE |
| csps-layer-separation.md | 1c24e8d | ✅ CANONICAL |
| CDAB named in csps-core-manifest.md | cd1ff55 | ✅ NAMED |
| Rigid-rule anti-pattern (5/5 FSE) | 524bca1 | ✅ ENGRAVED |
| VLT-S016-ZENSTACK RESOLVED (Option A) | fbe48f6 | ✅ RATIFIED |

### Platform State S017 Baseline

```
Validators: 40 active
Contracts: 48 (B_HUMBLE_EXECUTOR + B_AUTONOMOUS_BATCH added)
Open plan items: 51 (down from 70 — plan-methodology-v2 L3 work closed items)
Bedrock completion: 86% (18/21 items done)
Foundation exit gate: CLEAN
Stale plans: 0 unverified
VLTs: 0 PENDING
CDAB: named, 40% mechanical (2 new validators added S016)
```

### Carry-Forwards to S017

| Item | Priority | Nature |
|---|---|---|
| ZenStack installation | HIGH | S017 primary mandate — foundation-slices L3 |
| validate-milestone-assessment.mjs | MED | week-4 (needs session transcript parsing) |
| validate-preflight-coverage.mjs | MED | week-4 (same reason) |
| MCP dynamic context (get_context) | MED | S018 — extends principles-mcp |
| PE mechanical computation | LOW | S017+ — pe-compute.mjs |
| slim-handoff Zone A §CORE-PILLARS template | LOW | .claude/skills/ update needed |

---

## ═══ ZONE C — FULL EVIDENCE ═══

### §17 Attestation

Sender: `S016-AI-attest-2026-05-07T08:30:00Z-S016-close`
Session extraction: `docs/plan/_handoff/VAULT/session-S016-extraction.md` ✅
Last commit: cd1ff55 pushed to github.com/CommarkG/csps main

### ZF Evidence Block

```
ZF Level: 3 (DEEP)
Exit code: 0 (40 validators)
Blocking found: 0
Advisory remaining: 4 (pre-existing + 51 open + future phase + extraction — resolved)
Orchestrator cycles Level 3: 5
Last commit: cd1ff55
Open plan items: 70 → 51
Bedrock: 67% → 86% done
```
