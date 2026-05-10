---
id: csps.handoff.vault.session-s014-spine-audit-silent-override
name: session-S014-spine-audit-silent-override
description: Pillar-by-pillar audit of where config-silent-override and reasoning-single-source-navigation patterns harm or could harm CSPS. Per user directive S014 — process major discoveries across all 5 Core Spines.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, VALD, OPER]
schema_anchor: vault_files
know_how_consulted: true
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S014
links:
  - { rel: drift-log, href: ./inner-ai-defaults/continuous-drift-log.md }
  - { rel: session-extraction, href: ./session-S014-extraction.md }
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/inner-ai-defaults/continuous-drift-log.md
  - packages/principles/principles.yaml
domain_path: platform
---

# S014 Spine Audit — Silent Override + Single-Source Navigation

> Two patterns discovered S014. This document walks every spine to find
> where they harm existing processes and where prevention must be added.

---

## Pattern A: `config-silent-override`

**Pattern:** Child configuration with a field's governing OBJECT but without
the specific FIELD causes system to use field's DEFAULT — not parent's value.
Silent. No warning. Invisible until something breaks.

**Why it's dangerous:** The parent set the value for a reason. The child
inherits the structure but not the intent. Every session that uses the child
config is running with degraded governance without knowing it.

---

### GVRN Spine — Decision Rights

| Surface | Risk | Severity | Fix |
|---|---|---|---|
| `.claude/settings.json` (user → project) | **CANONICAL INSTANCE** — fixed S014 | Was BLOCKING | `defaultMode` explicit at project level |
| `session-state.json` (fields vs. defaults) | If a field is missing, validation scripts use default | WARN | Validator should error on missing required fields |
| `protocols.md` (session → chat) | Chat-jump prompts don't inherit ALL governance context | WARN | chat-transfer-protocol now includes ZF iter count (partial fix) |
| B_* contract template inheritance | When a contract is authored from template, missing fields use template defaults not session context | WARN | B_* template has explicit required fields — currently enforced |

**GVRN prevention:** At plan creation, session-open, and chat transfer, explicitly enumerate which governance fields are inherited vs. defaulting. The `gradual-build-plan.template.md §0` triad section now asks explicitly — but it doesn't yet warn about implicit inheritance.

---

### ARCH Spine — Data Architecture

| Surface | Risk | Severity | Fix |
|---|---|---|---|
| ZModel `extends Base` | Base has `@@deny('delete', true)`. Individual models CAN override. A model that has no `@@deny` uses the Base policy — this IS correct inheritance. But if a model extends Base and adds `@@allow('delete', ...)`, it overrides the Base deny silently. | CRITICAL | Each model should explicitly state its delete policy, not rely on Base inheritance |
| Prisma schema `schema.prisma` | When `prisma/schema.prisma` is hand-maintained (pre-ZenStack), models that don't declare relations to tenant may silently lack RLS. | WARN | ZModel → Prisma generation (L3 deferred) catches this |
| `tsconfig.json` paths | Each app's tsconfig must explicitly declare `@csps/integrations` path. Missing = 6-level relative import silently fails on refactor. | WARN | **Fixed for apps/sandbox/. Reminder: every new app needs explicit path declaration.** |
| `next.config.ts` | Next.js config doesn't inherit from parent — missing fields use Next.js defaults. Env vars not explicitly forwarded are silently absent. | WARN | apps/sandbox/next.config.ts is minimal — safe. But when features are added, explicit config is needed. |
| `libs/policies/slices/public/` ZModel models | Each model declares its own `@@allow`/`@@deny`. If a new model is added without these, it inherits ZenStack's default (deny all) — this IS safe but unexpected. | INFO | Document: no ZModel model should be considered "accessible" without explicit policies |

**ARCH prevention:** When writing any ZModel model: require explicit `@@allow` and `@@deny` declarations. No silent inheritance from Base policies. Validator `validate-foundation-schema-drift.mjs` (L3 deferred) will catch ZModel/Prisma divergence.

---

### AI Spine — Intelligence Layer

| Surface | Risk | Severity | Fix |
|---|---|---|---|
| `inner-ai-defaults` registry | Registry has 5 categories. A NEW category of default not yet registered = silent AI behavior using training defaults. | WARN | `validate-inner-ai-defaults-freshness.mjs` catches model version drift but not new-category gaps |
| `session-state.json` mandate | Mandate field seen by AI as authoritative single source → single-source navigation (Pattern B) | CRITICAL | session-open.sh now injects Q5 explicitly. ZF level gate adds PE check. |
| AI behavior spine (GVRN > VALD > ARCH > AI > OPER) | Lower-priority spine defaults silently apply when higher-priority spine doesn't explicitly address a case | WARN | Spine precedence is documented in L1_CORE_GVRN; each new situation should explicitly identify governing spine |
| `closing-summary-template` fields | Missing fields in closing summary use implicit empty defaults — silent absence = SKIPS_NOT_AUDITED | WARN | Template now has explicit sections; §10.0 blocks close if missing |
| B_* contracts - mechanical surface | If a contract lists only 3/5 surfaces, missing 2 use implicit zero enforcement. | WARN | FSE discipline + validate-instruction-context catches this |

**AI prevention:** The 10 decision hygiene questions (session-open.sh Q1-Q10) address single-source navigation. The key addition: Q5 "Is my next step based on PE scoring or session-state sequence?" explicitly breaks the single-source satisfaction point.

---

### VALD Spine — Validation

| Surface | Risk | Severity | Fix |
|---|---|---|---|
| `pnpm verify` cycle (Level 1 only) | Level 1 passes → AI assumes ZF achieved → proposes advance. But Level 2 (PE check, extraction check) not consulted. | CRITICAL | ZF Mandate Protocol: Level 2 mandatory at phase boundaries. `post-tool-use-zf-level-gate.sh` injects Level 2 requirement. |
| `validate-open-plan-levels.mjs` (advisory) | Exit 0 always → AI reads "PASS" → doesn't see the 112 advisory items as obligations. | WARN | Upgraded to inject P-META-021 context in every warning. Now explicitly explains THEY ARE OBLIGATIONS. |
| `validate-vlt-blocking.mjs` | Warns on PENDING VLTs. But if session-state.json has VLTs removed (vs. marked resolved), validator sees 0 and passes silently. | WARN | Resolution format: status must be "RESOLVED" not deletion. Current format is correct. |
| Audit-runner Pipeline 1 as sole verification | AI treats exit_code 0 from `pnpm verify` as "validation complete" when it's only 1 of 3 required levels. | WARN | closing-summary §10.0 now requires `pnpm zf:deep` not just `pnpm verify`. |

**VALD prevention:** The ZF Orchestrator (3 levels) structurally prevents treating Level 1 as complete validation. The VALD spine's core principle: evidence must be specific to THIS session and THIS level — not inherited from "the last time I checked."

---

### OPER Spine — Operations

| Surface | Risk | Severity | Fix |
|---|---|---|---|
| `.env` → `.env.local` → `.env.production` | Same silent-override pattern: `.env.local` doesn't need to redeclare all vars, but if it redeclares an OBJECT-like env var without a specific key, it uses the env's default. | WARN | `.env.example` documents ALL required vars explicitly. Each deployment should verify vars explicitly. |
| Supabase connection (DATABASE_URL → DIRECT_URL) | If only DATABASE_URL is set (pool URL), DIRECT_URL defaults to empty, and Prisma migrations fail silently at run time. | WARN | `.env.example` now shows both with explicit WHY comment (VLT-S015-003 resolution). |
| GitHub Actions workflow inheritance | `on: workflow_call` workflows can inherit secrets silently. Missing explicit `secrets: inherit` = silent empty secrets. | WARN | CSPS doesn't use GitHub Actions reuse yet. Flag for S015+. |
| `package.json` script inheritance | Monorepo root scripts don't inherit to sub-packages unless explicitly declared. `pnpm zf` in root works but not in apps/. | INFO | Expected. Document: pnpm commands must be run from repo root. |

**OPER prevention:** Infrastructure config (connection strings, env vars, secrets) must be verified end-to-end at deployment, not assumed inherited. The sandbox `.env.example` pattern (explicit all vars + WHY) should be the standard for every app.

---

## Pattern B: `reasoning-single-source-navigation`

**Pattern:** AI consults one authoritative-seeming signal for a consequential
decision. The signal satisfies the internal check. Secondary signals are not
consulted. Advance is proposed.

### Where this harms each spine:

| Spine | Risk scenario | Prevention already active |
|---|---|---|
| GVRN | AI reads VLT as "RESOLVED" (one signal) without checking if the resolution is a real Governor ratification or just a status field update | validate-vlt-blocking.mjs checks status field; but doesn't verify WHO set it |
| ARCH | AI reads ZModel file as "schema complete" (one signal) without checking Prisma schema consistency or ZenStack generate | validate-foundation-schema-drift.mjs (L3 deferred) — gap until ZenStack installs |
| AI | AI reads session-state.json mandate (one signal) without checking VLT status, PE score, open-plan-levels | **Q5 in session-open.sh 10 questions. Level 2 ZF (PE re-assessment). post-tool-use-zf-level-gate.sh** |
| VALD | AI runs pnpm verify (one signal = Level 1) and proposes advance | **ZF Mandate Protocol — Level 2 mandatory at phase boundaries** |
| OPER | AI reads .env.example as deployment checklist (one signal) without checking actual deployed env vars | Not yet addressed — deployment checklist needed for S015 |

---

## §3 — Protocol Updates Required

### Planning protocols (gradual-build-plan.template.md):
**Add to §0 Triad Check:** "Before each level boundary, explicitly verify NO silent inheritance from parent configs. Name every config file this plan touches and confirm critical fields are explicit at this level."

### Implementation protocols:
**Add to pre-implementation checklist:** "For any config file being created or modified: (1) identify all parent-level configs, (2) enumerate fields that could silently override, (3) explicitly declare all critical fields at THIS level."

### Validation protocols (zf-mandate-protocol.md Level 2):
**Add to Level 2 checks:** "Config hierarchy check: any new config file has all critical fields explicitly declared?"

### Session protocols (session-open.sh):
**Already has Q5 (single-source navigation check). Add Q11:** "Is there any configuration hierarchy in this session's work where a child might silently use defaults instead of parent values?"

### Chat transfer protocol:
**Already requires Level 2 ZF (which includes PE check). That's the single-source navigation prevention. Also add:** "ZF iter count from tracker — proves real multi-signal verification was done."

---

## §4 — Mechanical Enforcement Gaps (New)

### Not yet mechanically enforced:

1. **Config hierarchy check** — no validator scans settings files for missing fields
   - Gap: `validate-config-inheritance-gaps.mjs` not yet built
   - Priority: MEDIUM (discovery K=1; will escalate at K=2)
   - Register: drift-log K=1, audit-runner slug registered

2. **ZModel explicit policy check** — no validator requires `@@allow`/`@@deny` on every model
   - Gap: ZenStack not installed yet; validator deferred to L3
   - Priority: HIGH for Phase 5 when ZenStack installs

3. **Multi-signal navigation verification** — validate-vlt-blocking + open-plan-levels + PE are separate checks; no COMBINED check exists
   - Gap: The ZF orchestrator Level 2 runs these sequentially but doesn't fail if AI navigates from session-state alone
   - The Q5 in session-open.sh is CONTEXT, not MECHANICAL
   - Priority: MEDIUM — the hook approach (post-tool-use-zf-level-gate) addresses the most common case

---

## §5 — Summary

The silent-override pattern is the same pattern at CONFIG level, SCHEMA level, AI BEHAVIOR level, and VALIDATION level:

```
PARENT sets X = value A (with intention and context)
CHILD has the PARENT OBJECT but not field X
SYSTEM uses X = DEFAULT (no warning; context lost)
RESULT: Parent's intention is silently discarded
```

At every level of CSPS, the prevention is the same:
**EXPLICIT OVER IMPLICIT. Never assume inheritance. Always declare.**

The ZF Orchestrator multi-direction check is exactly the multi-signal
navigation equivalent: don't assume PASS from one direction means ZF achieved.
Check all directions. Terminate only at zero findings across all.
