---
id: csps.pillar-6.open-frontiers
name: open-frontiers
description: Open-frontiers tracker — acknowledged unknowns the platform has not yet locked. Each frontier has a discovery-trigger (when we learn enough to lock it) + an interim posture (how we behave until then). Distinct from blockers (which are immediate-decision-needed) and from open-questions (which are smaller-scope). Migrated from v1.3 §19.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:admin
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: build-order, href: ./build-order.md }
  - { rel: stewardship, href: ../pillar-0-governance/stewardship-protocol.md }
  - { rel: open-questions, href: ../_handoff/VAULT/open-questions-ledger.md }
  - { rel: blockers, href: ../_handoff/VAULT/blockers-S002.md }
created-new-because: |
  No prior leaf consolidated open frontiers. v1.3 §19 had a bullet list. This leaf locks the
  contract: each frontier has a discovery-trigger + interim posture; distinct from immediate
  blockers (BLK-*) and smaller open questions (OQ-*). Acknowledged unknowns must be tracked
  so they're never lost.
domain_path: platform
core_spine: OPER
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Open Frontiers

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The acknowledged unknowns the platform has not yet locked. Each frontier has:

- **What** — the unresolved decision / dimension / pattern
- **Why deferred** — the reason we don't have enough information to lock it
- **Discovery trigger** — what would teach us enough to lock it (event / data / scale milestone)
- **Interim posture** — how we behave until the trigger fires
- **Owner** — who tracks the frontier
- **Next review** — `next_review_at` per stewardship protocol

Frontiers are NOT blockers. Blockers (`BLK-S<NNN>-*`) demand immediate user decision. Frontiers are explicitly "we will live without locking this for now; here's how."

## Why this exists

Without a tracker, acknowledged unknowns rot. They become tribal knowledge ("we always meant to do X about Y"), and tribal knowledge dies when the tribe rotates. The frontier list makes the unknowns mechanical: discoverable, reviewable, surfaceable in stewardship-review.

Per cardinal directive: *"We want to never leave anything floating or orphaned."* Frontiers are the catch-net for things that aren't quite ready to lock but cannot be dropped.

## Frontier registry (S016 additions)

### F-ZENSTACK — ZenStack Installation (DB-level RLS)

**What:** ZenStack installation in CSPS project. Converts current app-level tenant isolation (Prisma WHERE tenantId = JWT tenantId) to DB-level Row Level Security (Postgres RLS policies generated from ZModel @@allow rules).

**Why deferred:** Required apps/task-mgmt/ to exist first (ZenStack runs against a Next.js app). That dependency was met S015.

**Discovery trigger:** Governor ratifies VLT-S016-ZENSTACK with timing decision (S017 first mandate vs. defer further).

**Interim posture:** App-level tenant isolation IS functional and safe for development + staging. No cross-tenant data leak is possible through correct API routes. DB-level RLS adds defense-in-depth for production (SQL injection protection at DB level). Current posture = acceptable for dev; required before real user data.

**Owner:** platform core (foundation-slices topic plan)
**Next review:** S017 open
**Tracking:** VLT-S016-ZENSTACK in session-state.json
**Unlocks:** foundation-slices §11 closure + validate-foundation-schema-drift.mjs + 4 downstream bedrock items

---

## Frontier registry (snapshot at S003 close)

### F1 — Persona drift threshold calibration

- **What:** what numerical drift score triggers a PR-blocking eval failure?
- **Why deferred:** insufficient production data on real persona behavior over time
- **Discovery trigger:** 30 days of production drift-eval data after week 9
- **Interim posture:** drift evals run nightly; warn-only; manual review of every flagged session
- **Owner:** group:finky (engineering) + clinical advisor (when contracted)
- **Next review:** 2026-09-15

### F2 — Stripe customer-transfer at graduation: edge cases

- **What:** how do we handle multi-tenant customers (one Stripe customer paying for multiple Clerk orgs across multiple apps) at graduation?
- **Why deferred:** no real instance yet; first graduation candidate ~Q4 2026
- **Discovery trigger:** first app reaches graduation eligibility per `graduation-pipeline.md` gate
- **Interim posture:** graduation-pipeline assumes 1:1 customer-to-org until proven otherwise
- **Owner:** group:finky
- **Next review:** 2026-12-01 (or first-graduation-eligibility, whichever first)

### F3 — Crisis-detector recall threshold (regulatory)

- **What:** what recall rate is required for legal/regulatory acceptable-use?
- **Why deferred:** no jurisdiction-specific guidance yet; HHS/FDA guidance on AI-mental-health-tools still evolving
- **Discovery trigger:** HHS guidance OR class-action precedent in adjacent platform
- **Interim posture:** target 100% on test corpus; production recall measured; flagged for nightly review
- **Owner:** group:finky + legal counsel (when retained)
- **Next review:** 2026-08-01 (quarterly; correlates with crisis-pattern-review cadence)

### F4 — Multi-tenant cost-attribution accuracy

- **What:** at what tenant scale does per-tenant cost attribution stop being accurate (shared infra cost allocation gets fuzzy)?
- **Why deferred:** no measurement yet; depends on tenant cohort profile
- **Discovery trigger:** ≥10 paying tenants OR ≥1000 free-tier active users
- **Interim posture:** attribute compute + LLM-tokens accurately; allocate shared infra by row-count proxy
- **Owner:** group:finky
- **Next review:** 2026-12-01

### F5 — Vendor lock-in: Clerk vs SuperTokens vs Auth.js

- **What:** if Clerk's pricing changes adversely or M&A occurs, what's the fallback?
- **Why deferred:** Clerk is currently delivering; fallback selection requires a real trigger
- **Discovery trigger:** ≥30% pricing increase OR M&A announcement OR critical security incident
- **Interim posture:** Clerk-as-default; Mastra dispatcher abstracts auth-validator interface so future swap is feasible (~2 weeks effort)
- **Owner:** group:finky
- **Next review:** 2026-08-01 (annual minimum; or trigger event)

### F6 — Audit retention per regulatory regime

- **What:** what retention windows apply per region (GDPR vs CCPA vs HIPAA-adjacent)?
- **Why deferred:** depends on customer profile; no health-data customer yet
- **Discovery trigger:** first regulated customer signed
- **Interim posture:** 7-year retention default (the regulatory floor for crisis events); per-event retention configurable
- **Owner:** group:finky + legal counsel
- **Next review:** 2026-12-01

### F7 — Graduation triggering: revenue threshold calibration

- **What:** what monthly revenue / margin threshold makes graduation rational vs staying on CSPS?
- **Why deferred:** no graduation candidates yet; threshold depends on cohort cost model
- **Discovery trigger:** first 3 apps reach product-market fit
- **Interim posture:** graduation-pipeline gate uses placeholder ($X) until calibrated
- **Owner:** group:finky
- **Next review:** 2027-03-01

### F8 — Cross-app shared persona library: how shared is shared?

- **What:** if persona X is useful in apps A + B + C, do we vendor it 3 times or expose it as a shared library?
- **Why deferred:** depends on persona-divergence rate post-app-customization
- **Discovery trigger:** 2 apps shipping the "same" persona but with materially divergent customizations
- **Interim posture:** vendor (copy-paste) per app; track divergence; promote to shared library when divergence stays < 20%
- **Owner:** group:finky
- **Next review:** 2026-12-01

### F9 — RZF/CEC mechanical-audit thresholds (P-META-006 measurement)

- **What:** at what cycle-count is RZF/CEC saturating vs still finding value? (Cycle count is measurement not target per zero-findings-discipline.md)
- **Why deferred:** insufficient production data on the discipline
- **Discovery trigger:** 90 days of session data with RZF + CEC running
- **Interim posture:** track cycle counts; surface in qc-audit-results; no hard threshold imposed
- **Owner:** group:finky
- **Next review:** 2026-09-01

## Frontier vs blocker vs open-question (the distinction)

| Type | Decision-needed? | Owner-action? | Lifecycle |
|---|---|---|---|
| **Blocker** (BLK-S<NNN>-*) | Yes — immediate | User decision required | open → answered → resolved |
| **Open question** (OQ-*) | Yes — soon | Smaller scope; engineering can frame and resolve | open → resolved |
| **Frontier** (F<N>) | No — deferred until trigger | Watching for trigger event | open → triggered → locked |

Frontiers move to "triggered" state when their discovery-trigger fires; the platform team then drafts a PCR / ADR to lock the answer; lock-decision moves frontier to "locked."

## Stewardship integration

Per P-META-004 (Stewardship Protocol):
- Every frontier has `lifecycle_state: active` + `next_review_at`
- `/admin/stewardship-review` surfaces frontiers due for review
- A frontier without movement at next_review_at gets surfaced as "review overdue" (not auto-promoted; just surfaced for human decision)

## Anti-patterns

1. **Frontier without discovery-trigger** — refused; "we'll know it when we see it" rots
2. **Frontier without interim posture** — refused; we must explicitly say how we behave today
3. **Frontier living past 2 missed review dates** — surfaced as critical-stale; either trigger-fired or lock-decision required
4. **Open questions migrated to frontier without explicit reason** — refused; downgrade requires reason audit
5. **Blocker masquerading as frontier** — caught by stewardship review; immediate-decision-needed items don't get the deferred-trigger pattern

## Enforcement

- `principles.yaml#P-META-004` (Stewardship — frontier lifecycle_state surfaces in review)
- `audit-runner.md#frontier-trigger-defined` (PR-blocking; every frontier has a discovery-trigger)
- `audit-runner.md#frontier-interim-posture-defined` (PR-blocking; every frontier has interim behavior)
- `audit-runner.md#frontier-stale-2-cycles` (warn; 2 missed reviews escalates to critical)
- `_handoff/VAULT/open-questions-ledger.md` (the OQ-* registry — distinct surface)

## Sources

- v1.3 §19 (the original open-frontiers bullet list)
- [pillar-0/stewardship-protocol.md](../pillar-0-governance/stewardship-protocol.md) — P-META-004; the lifecycle_state machine frontiers participate in
- [_handoff/VAULT/open-questions-ledger.md](../_handoff/VAULT/open-questions-ledger.md) — sibling surface for smaller-scope items
