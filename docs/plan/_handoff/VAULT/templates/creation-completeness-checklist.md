---
id: csps.handoff.vault.templates.creation-completeness-checklist
name: creation-completeness-checklist
description: "Standalone creation completeness checklist — 9 artifact types with Before/Done Criterion fields. Use before creating any governed artifact. Source: OPUS-2 Turn 85 §2."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S037
tags:
  - domain:governance
  - type:template
  - audience:developer
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../../../../packages/principles/principles/P-ARCH-031-completion-seal.yaml }
---

# Creation Completeness Checklist

> **Rule:** Register → Implement → Wire → Verify. Never implement without registering first. Never declare DONE without verifying wiring. (Rule 8 — communication-protocol-shared.md)

---

## COMPONENT (libs/components/src/)

**Before writing code:**
- [ ] Import destination: `apps/*/src/[page].tsx` line [N] — specified
- [ ] Prop interface typed (not `any`)
- [ ] `@csps/components` package.json includes it
- [ ] `enforcement_trio:` → T2: `validate-wiring-completeness.mjs`

**Done criterion:**
`validate-wiring-completeness.mjs` shows WIRED + manual test: renders in running app, produces visible output.

---

## INTEGRATION FUNCTION (libs/integrations/*/index.ts export)

**Before writing code:**
- [ ] Which API routes call it? (list before writing)
- [ ] Graceful passthrough pattern included (check env var → return early if missing)
- [ ] PI-NNN reference exists
- [ ] `enforcement_trio:` → T2: `validate-wiring-completeness.mjs`

**Done criterion:**
Imported + called from real API route in `apps/` + graceful passthrough tested (remove env var → no error).

---

## HOOK (.claude/hooks/*.sh)

**Before writing code:**
- [ ] Registered in `.claude/settings.json` FIRST (before file exists)
- [ ] Hook type decided: PreToolUse / PostToolUse / PostStop / SessionStart / UserPromptSubmit
- [ ] PRODUCTION or STUB? If STUB: expiry session target set
- [ ] Rule it enforces has enforcement_trio T1 = this hook

**Done criterion:**
Fires in real session + produces intended output (not just exit 0) + Governor confirms output makes sense.

---

## VALIDATOR (tools/validators/*.mjs)

**Before writing code:**
- [ ] Wired into `tools/verify.mjs` FIRST (add the cycle entry)
- [ ] Slug added to `audit-runner.md` FIRST (slug must match filename)
- [ ] ADVISORY or BLOCKING decided before seeing results
- [ ] Rule it enforces has enforcement_trio T2 = this validator

**Done criterion:**
Fires in `pnpm verify` + produces ADVISORY/BLOCKING when violation actually exists (tested with deliberate violation).

---

## PRINCIPLE (packages/principles/principles.yaml)

**Before adding:**
- [ ] `enforcement_tier.tier1:` [hook name or null + reason]
- [ ] `enforcement_tier.tier2:` [validator name or null + reason]
- [ ] `enforcement_tier.tier3:` [session injection text]
- [ ] `permanence:` high|medium|low (T3-only = acknowledged drift)

**Done criterion:**
Cannot be violated without something flagging it. `permanence: high` requires T1 or T2.

---

## PI ITEM (docs/plan/_handoff/VAULT/plan-items/PI-NNN.yaml)

**Before ratifying:**
- [ ] `wiring_checklist:` ≥3 entries (specific, no TBD)
- [ ] `enforcement_trio:` (all 3 tiers specified)
- [ ] `questions:` all answered (no `status: unanswered`)
- [ ] `ep_err_pre_check:` — list applicable EP-ERR patterns from error-registry/
- [ ] `done_criterion:` (exact wiring test + validation command)
- [ ] `ratified_at` + `ratified_by` set by Governor

**Done criterion:**
`validate-creation-completeness.mjs` PASS + `validate-pi-questions-answered.mjs` PASS + `validate-persona-chain-complete.mjs` PASS + manual done criterion performed.

---

## ROUTE / PAGE (apps/*/src/app/[route]/page.tsx)

**Before writing code:**
- [ ] Navigation path: how users reach this page from the app
- [ ] Middleware covers it (auth check + tenantId)
- [ ] `@csps/components` used listed
- [ ] Data model specified (ZenStack model + @@allow policy)

**Done criterion:**
Reachable from navigation link + shows correct content for authenticated user + wiring validator confirms DashboardShell/etc. WIRED.

---

## INNGEST FUNCTION (libs/integrations/jobs/functions/*.ts)

**Before writing code:**
- [ ] Added to `allFunctions` in `libs/integrations/jobs/index.ts` FIRST
- [ ] Added to `apps/*/api/inngest/route.ts` FIRST
- [ ] Event trigger typed (not string)
- [ ] Retry count specified

**Done criterion:**
Fires when trigger event sent (tested) + appears in Inngest dashboard + NOT: "it's in allFunctions."

---

## SCHEMA MODEL (libs/policies/schema.zmodel)

**Before adding model:**
- [ ] `@@allow`/`@@deny` policies written
- [ ] `tenantId` field present
- [ ] Soft delete (`deletedAt`) or `@@deny("delete", true)`
- [ ] Which API routes use this model? (listed before creating)
- [ ] `db:push` requirement acknowledged (Governor action)

**Done criterion:**
`db:push` applied + at least one API route uses `enhance(prisma)` with this model + RLS test passes.

---

*Source: OPUS-2 Turn 85 §2 | S037-H | 2026-05-17*
