---
id: csps.handoff.vault.topic-plan.budget-planner-app2
name: budget-planner-app2
description: >
  App #2 — Budget Planner (Personal domain). Proves Gate 3 Foundry Ready: a second
  CSPS app can be built from template in a different domain without platform rewrites.
  Includes Threshold Wizard onboarding as first proven instance of the I→VI protocol
  in a user-facing app. Governor ratified: Personal/Budget Planner, Option B (Threshold
  Wizard included), 2026-05-12.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
core_spine: ARCH
core_spines: [ARCH, AI, OPER, VALD]
schema_anchor: topic_plans
domain_path: personal.budget
depth_chosen: 4
depth_rationale: |
  Depth-4: multi-session app build (template fork → schema → CRUD → Threshold Wizard → deploy).
  Not depth-5 (not constitutional). Not depth-3 (spans more than 3 sessions).
priority_score: 82
priority_band: 2
session: S024
impl_status: swift-implemented
execution_mode: deep_quality
know_how_consulted: true
threshold_intake_level: medium
threshold_participants: [human, ai]
threshold_route: personal.tracking
intent_crystallized: true
intent_crystallized_at: "S024 Governor ratification 2026-05-12"
links:
  - { rel: arc-plan, href: ./opus-advisory-arc-S023.md }
  - { rel: template, href: ../../../../apps/template/ }
  - { rel: wizard-templates, href: ../../../../libs/config/routing.config.ts }
  - { rel: threshold-protocol, href: ../../../../docs/plan/pillar-0-governance/threshold-intake-protocol.md }
goal_statement: >
  A Budget Planner where users track income and expenses, see their balance, and manage
  their personal financial data — built entirely on CSPS platform inheritance (auth, billing,
  tenant isolation, audit) without modifying the foundation code.
done_criteria:
  - "pnpm verify exit_code=0 with budget-planner slice validators passing"
  - "User can sign up, create budget categories, log transactions, and see their current balance"
  - "Tenant isolation proven: one user cannot see another user's transactions"
  - "apps/budget-planner/ forked cleanly from apps/template/ with zero foundation changes"
  - "Threshold Wizard onboarding: user answers 3 crystallization questions before seeing any dashboard"
failure_signal: >
  Foundation code was changed to support the Budget Planner (platform not foundry-ready).
  OR user can access another tenant's transaction data (tenant isolation broken).
  OR Threshold Wizard is skippable (users bypass crystallization and land on blank dashboard).
intake_background: >
  Platform has apps/template/ proven (22/22 bedrock), P-META-022 Tier 1 active (S024),
  libs/ gate blocking for new files (S024). First app was task-management (business-adjacent).
  Budget Planner is Personal domain — different enough to prove platform generalization.
intake_problem: >
  No second app exists. The platform cannot claim "Foundry Ready" (Gate 3) without
  evidence that a new domain can be built using inherited capabilities only.
intake_directions:
  - Personal/Budget Planner with Threshold Wizard onboarding (approved)
  - personal.finance WizardTemplate needed in routing.config.ts before build starts
  - Budget Planner exercises solo_user_flow (auto-org) + GDPR erasure path + personal data isolation
---

# Budget Planner — App #2 Topic Plan

## §0 — CONSOLIDATION CHECK

Searched existing topic-plans for Budget Planner / personal finance / App #2:
- `s014-task-management-app.md` — task-management (different domain, not reusable)
- `platform-excellence-completion-S023.md` — platform readiness (not app-specific)
- No existing plan covers a personal finance / budget tracking app

**Result:** No duplication. This plan is net-new. Budget Planner is a new domain.
CSP carry-forward checked: no prior personal finance app in CSP history.

---

## §0b — Intent Crystallization Record

**Problem (Q1 confirmed):** Build the second CSPS app in the Personal domain to prove the platform can generate a new app without rebuilding the foundation.

**Goal (Q2 confirmed):** "A Budget Planner where users track income and expenses, see their balance, and manage their personal financial data — built entirely on CSPS platform inheritance without modifying the foundation code."

**Done criteria (Q3 confirmed):**
- pnpm verify passes for budget-planner slice
- User can create categories, log transactions, see balance
- Tenant isolation proven
- Threshold Wizard onboarding present and non-skippable

**Failure signal:** Foundation code changed for the Budget Planner, OR cross-tenant data access, OR Threshold Wizard bypassable.

**Crystallization status:** ✅ Human-authored (Governor ratified 2026-05-12)

---

## §1 — PE Scoring

| Factor | Score | Reasoning |
|---|---|---|
| Breadth | 8 | Touches all platform layers (auth, schema, API, UI, billing, audit) |
| Depth | 6 | Multi-session (4-5 sessions), not constitutional |
| Impact | 9 | Gates all 28 remaining apps — proves platform is Foundry Ready |
| Blockers_now | 3 | Threshold Wizard UI design needed; personal.finance template needed |
| PAS | 7 | Directly in arc plan STREAM 8; Governor directive |
| **Total PE** | **82** | **Band 2-HIGH** |

**Foundation gates before first commit:**
- [x] P-META-022 Tier 1 active (S024 DONE)
- [x] libs/ gate BLOCKING for new files (S024 DONE)
- [ ] personal.finance WizardTemplate registered in routing.config.ts (S025)
- [ ] Threshold Wizard ratification (Governor confirmed Option B — UI design needed)
- [x] apps/template/ complete (22/22 bedrock items DONE)

---

## §2 — Build Sequence

### Layer 1 — Foundation Gates + Template Fork (S025)
**Exit criteria:**
- [ ] personal.finance WizardTemplate added to routing.config.ts
- [ ] apps/budget-planner/ forked from apps/template/
- [ ] pnpm build passes on forked app
- [ ] validate-no-implementation-without-plan.mjs: budget-planner covered

### Layer 2 — Schema + CRUD (S025 schema done; S026 API routes)
**Specific validators (double-protected: in plan + in protocol):**
- [x] `validate-foundation-schema-drift.mjs`: `generate_ok=true, drift=0` — DONE S025 (run: `node tools/validators/validate-foundation-schema-drift.mjs`)
- [x] `libs/policies/schema.zmodel`: BudgetCategory + Transaction with `@@allow read/create/update` + `@@deny delete` — DONE S025
- [x] `BudgetCategoryType` enum: `income|expense @@schema("public")` — DONE S025
- [x] `apps/budget-planner/src/app/api/budget/categories/route.ts`: GET=tenant-scoped+ZenStack; POST=create+AuditEvent; 401/403/402 enforced — DONE S025
- [x] `apps/budget-planner/src/app/api/budget/transactions/route.ts`: GET=tenant-scoped; POST=create immutable+AuditEvent; subscription gate — DONE S025
- [x] `apps/budget-planner/src/app/api/budget/balance/route.ts`: GET returns `{income,expenses,balance,byCategory}` — DONE S025
- [x] `requireWriteSubscription()`: cancelled=402 `subscription_inactive`; free/trialing/active=proceed — DONE S025
- [x] `writeAuditEvent()`: `budget.category.created` + `budget.transaction.created` — DONE S025
- [x] `getEnhancedDb()`: ZenStack isolation (@@allow auth().tenantId == tenantId) — DONE S025
- [x] `pnpm verify exit_code=0` — DONE S025
- [x] Tiers: cancelled=read-only (402 on writes); free/trialing/active=full write — DONE S025
- [ ] Permissions: admin-only category creation — deferred Layer 4 (pending user feedback on who should create categories)

**ZF gate Layer 2 — ACHIEVED S025:**
`validate-foundation-schema-drift.mjs: generate_ok=true` ✅ + 3 route files exist ✅ + `pnpm verify exit_code=0` ✅

### Layer 3 — Threshold Wizard Onboarding (S026-S027)
**Exit criteria:**
- [ ] Onboarding wizard: 3 crystallization questions (problem / goal / done signal)
- [ ] Questions use personal.finance template clarifying_questions
- [ ] Dashboard not accessible until wizard complete (non-skippable gate)
- [ ] Wizard stores budget goal in user profile

### Layer 4 — Feature Complete + Validation (S027-S028)
**Exit criteria:**
- [ ] Balance calculation: income - expenses per category
- [ ] Solo user flow: auto-org creation on sign-up
- [ ] GDPR erasure path: user data fully deletable
- [ ] pnpm verify exit_code=0 (full platform + budget-planner slice)
- [ ] Cold-start test: new developer can run `pnpm dev` with zero manual fixes
- [ ] Tenant isolation adversarial test: cross-tenant access blocked

---

## §3 — Platform Inheritance Contract

The Budget Planner inherits the following WITHOUT modification:
- Auth (Clerk + tenant context)
- Billing (Stripe + requireWriteSubscription())
- Tenant isolation (ZenStack RLS + tenant_id on all entities)
- Audit trail (AuditEvent via writeAuditEvent())
- AppendOnlyBase (soft-delete pattern)
- GDPR erasure service (libs/integrations/gdpr.ts)
- Error format (CspsError shape)
- Solo user flow (auto-org creation in webhook route)

**If any of these need modification for the Budget Planner — STOP. Raise VLT. The platform is not yet Foundry Ready for this case.**

---

## §4 — Threshold Wizard Design (Option B — Governor ratified S024)

The Budget Planner's onboarding IS the first live proof of the I→VI discipline (P-META-023) in a user-facing app.

Wizard questions:
1. "What's your biggest money challenge right now?" → Q1 (problem framing)
2. "What would feeling financially in control look like for you in 30 days?" → Q2 (goal)
3. "Pick 2-3 numbers that would tell you you're on track" → Q3 (done signal → budget targets)

The wizard stores: `budget_goal` (text, human's words), `budget_targets` (list of category+amount pairs).

Personal.finance WizardTemplate in routing.config.ts must be created before this UI is built.

---

## §5 — Open Items Carry-Forward

| Item | Carries to | Why deferred |
|---|---|---|
| personal.finance WizardTemplate | S025 Layer 1 | Needs routing.config.ts edit + test before app fork |
| Threshold Wizard UI spec | S025 | Need personal.finance template first |
| GDPR erasure integration | S026 | Builds on Layer 2 schema |
| Cold-start test | S028 end | Requires full feature set |
