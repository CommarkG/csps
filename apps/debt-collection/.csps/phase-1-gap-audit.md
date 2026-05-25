---
id: csps.apps.debt-collection.phase-1-gap-audit
name: phase-1-gap-audit
description: "PROTO-S062-K STEP 1 — read-only gap audit for Phase 1 pages (dashboard, create, message) against CSPS governance pre-flight checklist."
type: wet-trial-artifact
app: debt-collection
session: S062
authored_by: Sonnet-10
date: 2026-05-25
proto: PROTO-S062-K
---

# Debt Collection — Phase 1 Gap Audit

> PROTO-S062-K STEP 1 | Read-only assessment | Sonnet-10 | S062

---

## Scope

Phase 1 pages: `dashboard`, `create`, `message`
Phase 1 API routes: `debts`, `generate-message`
Validator runs: `validate-page-dna.mjs`, `validate-ux-audit.mjs`
Manual checks: pageDNA format, force-dynamic, auth guards, voice-profile, relatedPages, use_case

---

## Validator Runs (this session)

| Validator | Result | Detail |
|---|---|---|
| `validate-page-dna.mjs` | ✅ PASS | `tsx_checked=21 tsx_dna_present=21 tsx_dna_missing=0` |
| `validate-ux-audit.mjs` | ✅ PASS | `pages_scanned=21 full_context=21 coverage=100% blocking=0` |
| `validate-voice-profile.mjs` | ❌ NOT FOUND | Validator does not exist — see GAP-1 |
| `pnpm verify` outer | ✅ PASS | `exit_code=0 blocking=0` |

---

## Passing Checks

| Check | Verdict | Evidence |
|---|---|---|
| `const pageDNA` (NOT `export const`) — dashboard | ✅ PASS | `dashboard/page.tsx:15` |
| `const pageDNA` (NOT `export const`) — create | ✅ PASS | `create/page.tsx:11` |
| `const pageDNA` (NOT `export const`) — message | ✅ PASS | `message/page.tsx:12` |
| `validate-page-dna.mjs` passes (tsx) | ✅ PASS | `tsx_dna_missing=0` |
| `validate-ux-audit.mjs` passes | ✅ PASS | `coverage=100% blocking=0` |
| pageDNA has `purpose` field — all 3 pages | ✅ PASS | Lines 16, 12, 13 resp. |
| pageDNA has `voiceProfile: 'colleague'` — all 3 pages | ✅ PASS | Lines 17, 13, 14 resp. |
| pageDNA has `options` array — all 3 pages | ✅ PASS | Lines 18, 14, 15 resp. |
| pageDNA has `nextStep` — all 3 pages | ✅ PASS | Lines 19, 15, 16 resp. |
| Auth guard on `debts/route.ts` (GET + POST) | ✅ PASS | Lines 12-13 + 52-53 |
| Auth guard on `generate-message/route.ts` | ✅ PASS | Lines 12-13 |
| `force-dynamic` on root layout (covers all Phase 1 pages) | ✅ PASS | `layout.tsx:7` |
| `data-voice-profile` attribute on create form | ✅ PASS | `create/page.tsx:130` |
| `data-voice-profile` attribute on message form | ✅ PASS | `message/page.tsx:207` |

---

## Gaps Found

### GAP-1 (P2) — validate-voice-profile.mjs does not exist

**Finding:** `validate-voice-profile.mjs` is missing from `tools/validators/`. The validator is referenced in PROTO-S062-K STEP 1 as a required pre-flight check. Running it returns `MODULE_NOT_FOUND`.

**Current state:** Voice profile IS correctly implemented in the pages — both `create` and `message` pages have `voiceProfile: 'colleague'` in pageDNA AND `data-voice-profile={pageDNA.voiceProfile}` attributes on form/UI elements. The behavior is correct; the mechanical enforcement is absent.

**Why it matters:** Without a validator, any future page can ship without voice-profile compliance and no commit will block it. This is the EXISTS≠ACTIVE gap (AP-001).

**Validator catches:** pages with form elements where `voiceProfile` is missing, wrong value, or `data-voice-profile` attribute absent.

**Resolution options:**
- **Component A**: No app-level fix needed — pages already comply
- **Component B**: Create `tools/validators/validate-voice-profile.mjs` + register in audit-runner.md

**Propagation target:** `validator`
**PE score:** 70 (validator adds permanence; pages are compliant today)
**Defer?:** Flag for Opus review as B_* validator candidate. Sonnet can write implementation — no core seed needed for a validator.
**Phase 1 impact:** Advisory — pages pass manually. No blocking.

---

### GAP-2 (P3) — `create` and `message` pages missing `relatedPages` in pageDNA

**Finding:** `dashboard/page.tsx` pageDNA has `relatedPages: ['/create', '/message']` but `create/page.tsx` and `message/page.tsx` do not have a `relatedPages` field.

**Current state:** Not validated by any current validator (validate-ux-audit only checks `purpose`). Advisory gap.

**Why it matters:** `relatedPages` enables platform-level navigation graph inference and future route audit. Inconsistency across pages in the same app creates debt.

**Fix:** Add `relatedPages: ['/dashboard', '/create']` to message/pageDNA and `relatedPages: ['/dashboard', '/message']` to create/pageDNA.

**Component A:** `apps/debt-collection/src/app/create/page.tsx` + `apps/debt-collection/src/app/message/page.tsx` — add `relatedPages` field to pageDNA
**Component B:** Consider adding relatedPages to `validate-ux-audit.mjs` check (advisory enforcement)

**Propagation target:** `app-only` (fix) + `validator` (advisory enforcement enhancement)
**PE score:** 40 (low impact, easy fix)
**Phase 1 impact:** Advisory. Fix in STEP 2 alongside other small pageDNA gaps.

---

### GAP-3 (P3) — API routes missing explicit `force-dynamic`

**Finding:** `apps/debt-collection/src/app/api/generate-message/route.ts` and `apps/debt-collection/src/app/api/debts/route.ts` lack `export const dynamic = 'force-dynamic'`.

**Current state:** Both routes use `await auth()` from Clerk, making them implicitly dynamic in Next.js 14+. The root `layout.tsx` has `force-dynamic` which applies to page components. Route handlers inherit dynamic rendering through `auth()` usage — not through layout config.

**Risk:** Low for now. If auth() is refactored to a non-request-scoped function, the route could silently become statically cached.

**Fix:** Add `export const dynamic = 'force-dynamic'` to both route files.

**Component A:** Both route files — 1-line addition each
**Component B:** Consider adding to `validate-force-dynamic.mjs` (if it exists) to enforce on all API routes using auth()

**Propagation target:** `app-only` (fix) + `validator` (enhancement to existing validator if present)
**PE score:** 50 (low risk, trivial fix, better defense-in-depth)
**Phase 1 impact:** Advisory. Recommended fix in STEP 2.

---

### GAP-4 (P4, DEFER) — pageDNA missing `use_case` field

**Finding:** PROTO-S062-K STEP 1 lists `use_case` as a required pageDNA field for the UX audit pre-flight. None of the 3 Phase 1 pages have `use_case` in their pageDNA. However, `validate-ux-audit.mjs` does NOT currently enforce this field — it only checks `purpose`. The validator passes at 100%.

**Current state:** Pages pass the actual validator. The PROTO spec references a stricter field set than the current validator enforces. Gap is between spec-intent and validator-coverage.

**Fix path:** Two options — (A) add `use_case` to each page's pageDNA as a Phase 1 fix, or (B) update `validate-ux-audit.mjs` to add `use_case` check (validator enhancement).

**Decision:** Defer to `validate-ux-audit.mjs` enhancement in S063. Adding `use_case` to pages without a validator that enforces it is documentation-theater (AP-001 EXISTS≠ACTIVE). Fix the validator first; pages follow.

**Propagation target:** `validator` (update validate-ux-audit.mjs)
**PE score:** 30 (low urgency — no blocking, validator pass confirmed)
**Phase 1 impact:** Deferred to S063. Not blocking.

---

### GAP-5 (P5, PHASE 2) — No per-userId data isolation in debts YAML store

**Finding:** `apps/debt-collection/src/lib/debts.ts` — `readDebts()`, `writeDebts()` operate on a single shared YAML file (`apps/debt-collection/.csps/debts.yaml`) with no userId-based isolation or filtering.

**Current state:** API routes check `auth()` and return 401 for unauthenticated requests. But authenticated requests from any userId read/write the same YAML file. In a multi-user deployment this means User A can see User B's debts (if they know to call the API).

**Why Phase 2 (not Phase 1):** The wet trial is single-user by design (Governor is the test user). The YAML store exists explicitly because Phase 1 is a demonstrable flow prototype — not a production data layer. Phase 2 migration: ZenStack + Prisma with row-level security (userId tenant isolation).

**Phase 1 mitigation:** Document explicitly that the YAML store is single-tenant. The Phase 2 plan (FOUNDATION-COMPLETION-PLAN.md) should include `libs/data-layer` migration as a Phase 2 prerequisite.

**Propagation target:** `wontfix` for Phase 1 / `b-contract-candidate` for Phase 2 data layer
**PE score:** 20 for Phase 1 (intentionally deferred)
**Phase 1 impact:** Deferred to Phase 2. Document in Phase 2 plan.

---

## Gap Priority Table (STEP 2 work order)

| ID | Gap | Type | PE | Resolution | Phase |
|---|---|---|---|---|---|
| GAP-1 | `validate-voice-profile.mjs` missing | validator missing | 70 | Create validator (Component B) | Phase 1 |
| GAP-3 | API routes missing `force-dynamic` | advisory defensive | 50 | 1-line fix × 2 files (Component A) | Phase 1 |
| GAP-2 | `relatedPages` missing on create + message | pageDNA completeness | 40 | Add field (Component A) | Phase 1 |
| GAP-4 | `use_case` field not in pageDNA or validator | spec vs validator gap | 30 | Defer — fix validator first (S063) | S063 |
| GAP-5 | No per-userId YAML isolation | architecture | 20 | Defer to Phase 2 data layer | Phase 2 |

---

## STEP 2 Action Plan

**Phase 1 gaps to close (3 items):**

1. **GAP-3** (5 min) — Add `export const dynamic = 'force-dynamic'` to `debts/route.ts` + `generate-message/route.ts`
2. **GAP-2** (10 min) — Add `relatedPages` to `create/page.tsx` + `message/page.tsx` pageDNA
3. **GAP-1** (45 min) — Write `tools/validators/validate-voice-profile.mjs` + register in audit-runner.md

**Component B extract from GAP-1:** The voice-profile validator is platform-wide — every CSPS app with forms should pass it. This belongs in `tools/validators/` as a shared enforcement mechanism.

**After STEP 2:** Gap list = 0 Phase 1 items → STEP 3 (end-to-end demonstrable flow).

---

*STEP 1 complete. Commit this file as evidence. Await Opus ADVANCE for STEP 2.*
