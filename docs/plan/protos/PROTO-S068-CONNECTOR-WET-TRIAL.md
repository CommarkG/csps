---
id: csps.protos.PROTO-S068-CONNECTOR-WET-TRIAL
name: PROTO-S068-CONNECTOR-WET-TRIAL
description: "S068 App #2 wet-trial — 'The Connector' (sales-focused). 5-STEP scaffold per App #1 budget-planner precedent + B_APPS_ARE_TRIALS Component A/B split. Wet-trial target ~2026-05-30. PROTO-SEED authored by Opus-12 ahead of Sonnet build; full STEP expansion + Component B (libs/template) extraction follows Governor #3 priority slot."
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "0.1-SEED"
session: S068
authored_by: Opus-12
date: 2026-05-28
core_spine: ARCH
core_spines: [ARCH, OPER, GVRN]
schema_anchor: protos
plan_item_id: "PCR-3-S067 (App #2 domain ratified by Governor S067 turn 41 — sales-focused)"
core_seed_present: true
gate_tier: full-advance
inherits_from: "App #1 budget-planner pattern + B_APPS_ARE_TRIALS + P-ARCH-030 component-A-B-split + P-META-016 gradual-build-by-foundations + tab-transfer-template + B_META_QUESTION_DISCIPLINE"
links:
  - rel: pcr-source
    href: ../_handoff/HANDOFF-S067-to-S068.md
  - rel: app-1-precedent
    href: ../../../apps/budget-planner
  - rel: component-b-target
    href: ../../../libs/
  - rel: handoff-priority
    href: ../_handoff/HANDOFF-S067-to-S068.md
context_question: "Before scaffolding app code — what specific sales-flow problem does 'The Connector' solve, and what's the smallest wet-trial scope that demonstrates it?"
---

# PROTO-S068-CONNECTOR-WET-TRIAL

**STATUS: SEED** | Session S068 | Sonnet-13 builds | Opus-12 reviews per STEP
**Gate tier:** full-advance (App #2 = first product after App #1 budget-planner — sets the multi-app pattern)
**Per-STEP gate tier:** check-in (Sonnet writes CHECKPOINT after each STEP, Opus acknowledges before next STEP)

---

## CORE SEED — the architectural anchor

App #1 (budget-planner) demonstrated the CSPS app-build pipeline: Vercel + apps/ scaffolding + libs/ shared components + tenant-isolated schema. **App #2 "The Connector" is the first replication** — it proves the CSPS app-pattern is repeatable, not bespoke. Per B_APPS_ARE_TRIALS: the app itself is ephemeral; the **extraction into libs/ shared template** is the permanent deliverable. Wet-trial deadline ~2026-05-30 forces minimal scope.

**Three integrated layers:**

1. **Component A (ephemeral app)** — `apps/connector/` — sales-focused workflow. Wet-trial scope ONLY.
2. **Component B (permanent extraction)** — `libs/app-template-v2/` — anything App #1 + App #2 share gets extracted here. Deletion test: if `apps/connector/` deletes cleanly, Component B is correct.
3. **Wet-trial harness** — Sonnet smoke-tests local + Vercel deploy + 1 real sales-flow run, files findings to gap-recurrence-register.yaml.

---

## ALIGNMENT QUESTIONS — Governor answers before STEP 1

**Q1 — Sales flow specificity:** "Sales-focused" — which flow? Lead capture? Pipeline tracking? Deal-stage progression? Outreach sequencing? Quote/proposal generation?

**Q2 — Wet-trial scope:** Smallest demonstrable slice (Walking Skeleton) — 1 use-case end-to-end, OR multi-stage spec? Per 2-day deadline: recommend Walking Skeleton.

**Q3 — Integration boundaries:** Connect to which external systems for wet-trial? (Salesforce? HubSpot? Gmail? Standalone-only?) Recommend standalone-only for wet-trial (defers integration debt).

**Q4 — Tenant model:** Inherit App #1 Clerk-tenant pattern, or different auth? Recommend inherit (zero-friction).

**Q5 — Component B extraction depth:** Just shared UI primitives? Or also tenant-isolation + audit-log + Vercel-config? Recommend full pattern extraction (this is THE moment — App #1 alone proved nothing about reusability).

---

## STEP 0 — Governor alignment + Opus seed expansion

**DONE WHEN:**
- [x] PROTO-SEED authored (this file, Opus-12)
- [ ] Governor answers Q1-Q5
- [ ] Opus expands SEED → full PROTO with concrete STEPs
- [ ] PROTO core_seed_present field re-validated
- [ ] Sonnet ACKs in sonnet-turn.md

## STEP 1 — Component A scaffold (Sonnet)

**Owner:** Sonnet | **Tier:** check-in
**DONE WHEN:**
- [ ] `apps/connector/` exists with App #1 budget-planner clone structure
- [ ] package.json + next.config.mjs + tsconfig + app/layout.tsx + app/page.tsx
- [ ] Tenant-isolated via Clerk pattern (inherit from App #1)
- [ ] `pnpm --filter @csps/connector typecheck` exit_code=0
- [ ] CHECKPOINT in sonnet-turn.md with commit SHA

## STEP 2 — Walking Skeleton (Sonnet)

**Owner:** Sonnet | **Tier:** check-in
**DONE WHEN:**
- [ ] 1 sales-flow page renders with mock data (per Q1 answer)
- [ ] tenant-scoped read-only query works end-to-end
- [ ] Behavioral test: page renders for authenticated tenant user
- [ ] CHECKPOINT in sonnet-turn.md

## STEP 3 — Component B extraction (Sonnet + Opus pair)

**Owner:** Sonnet (build) + Opus-12 (review extraction boundary) | **Tier:** full-advance
**DONE WHEN:**
- [ ] Shared App #1 + App #2 code moved to `libs/app-template-v2/`
- [ ] `apps/budget-planner` + `apps/connector` both import from libs (no duplication)
- [ ] Deletion test: `rm -rf apps/connector` leaves Component B intact + budget-planner still typechecks
- [ ] CHECKPOINT in sonnet-turn.md

## STEP 4 — Vercel deploy + wet-trial harness (Sonnet)

**Owner:** Sonnet | **Tier:** check-in
**DONE WHEN:**
- [ ] Vercel project created per `docs/external-integrations/vercel.md` 10-rule playbook
- [ ] Deploy succeeds with `apps/connector` Root Dir
- [ ] Wet-trial smoke: 1 sales flow run end-to-end on production
- [ ] CHECKPOINT in sonnet-turn.md

## STEP 5 — Wet-trial findings + SEAL (Sonnet + Opus + Governor)

**Owner:** All | **Tier:** full-advance
**DONE WHEN:**
- [ ] Wet-trial findings filed to `tools/data/gap-recurrence-register.yaml` (with prevention_class)
- [ ] HANDOFF-S068-to-S069 authored per tab-transfer-template (10-item false-assumption checklist)
- [ ] §17 attestation
- [ ] Opus-12 OPIA 15-point audit
- [ ] git push origin main + SESSION CLOSE

---

## CARRY-FORWARDS (S069+)

- Component B v2 extraction (if STEP 3 surfaced patterns not yet extractable)
- App #3 domain selection (extends precedent further)
- Integration adapters (deferred from wet-trial per Q3 recommendation)
