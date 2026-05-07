---
id: csps.platform-audit.spine.oper
name: spine-OPER
description: >
  Domain card for the OPER (Operations) Core Spine. OPER governs how the platform
  ships, runs, and scales — the 12-week build order, graduation pipeline (apps
  spinning off at $1K MRR), cost management, zero-laptop discipline, and delivery.
  Lowest precedence spine; never overrides GVRN/VALD/ARCH/AI.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: OPER
schema_anchor: platform_audit
enforcement_stage: active
tags:
  - domain:ops
  - domain:platform
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ../README.md }
  - { rel: implementation, href: ../../../plan/pillar-6-operations-and-delivery/ }
  - { rel: build-order, href: ../../../plan/pillar-6-operations-and-delivery/build-order.md }
  - { rel: graduation, href: ../../../plan/pillar-6-operations-and-delivery/graduation-pipeline.md }
consolidation_cross_refs:
  - docs/plan/pillar-6-operations-and-delivery/build-order.md
  - docs/plan/pillar-6-operations-and-delivery/graduation-pipeline.md
  - docs/plan/pillar-6-operations-and-delivery/cost-economics.md
---

# OPER — Operations Spine

## §1 Identity

**What I am:** The delivery layer of CSPS. I govern how the platform moves from concept to production, how apps graduate from the platform to standalone products, how costs are tracked, and how the platform remains accessible from any device.

**Core spine position:** OPER (lowest precedence). Every OPER decision yields to GVRN, VALD, ARCH, and AI.

**Who I am part of:** Platform-level. I govern the temporal dimension — what happens in which week, when an app graduates, when infrastructure costs trigger tier changes.

**My sub-parts:**
- Build Order (12-week roadmap with dependency graph)
- Graduation Pipeline (app extraction at $1K MRR trigger)
- Zero-Laptop Discipline (Codespaces-first, push-to-remote-always)
- Cost Management (per-tenant attribution, tier thresholds)
- Session Lifecycle (session-state.json, S<NNN> governance)
- Bootstrap Script (empty repo → running platform in one run)

---

## §2 The Problem I Solve

**Without OPER:** Platform development is unsequenced. Teams build the dashboard before the auth. They add features before fixing the foundation. Apps never graduate — they accumulate in the monorepo forever, increasing cognitive load with each addition. Developers are laptop-locked — a dead battery stops all work.

**What breaks specifically:**
- Apps built before bedrock is complete carry 27% debt forward into every feature (67% bedrock = 33% debt per app)
- No graduation path means the platform becomes a graveyard of 60%-complete apps
- No cost attribution means nobody knows which tenant is driving 90% of compute
- Laptop dependency means the platform is one hardware failure away from lost velocity

---

## §3 My Principles

**Foundation principles:**
- `P-OPER-001` — Zero-Laptop-Dependency: all work accessible from any browser via Codespaces
- `P-META-016` — Gradual-Build-By-Foundations: build order is a dependency graph, not a preference

**Key behavioral contracts:**
- `B_ZERO_LAPTOP_DEPENDENCY` — 4/5 surfaces active (hook surface deferred week-4)
- `B_PLATFORM_FIRST_OPTIMIZATION` — OPER cost decisions benefit all 30 apps

---

## §4 How I Work

**Depth 1 — Executive view:**
The 12-week build order is a directed acyclic graph — governance before slices, slices before generators, generators before apps. Apps follow the graduation pipeline: build in CSPS → reach $1K MRR → extract to standalone product (2-3 day extraction, not 2-3 month surgery). All work is git-pushed before session close. GitHub Codespaces enables development from any device.

**Depth 2 — Operational view:**
`build-order.md` governs which weeks contain which capabilities. `validate-bedrock.mjs` enforces that bedrock is complete before app #2. `graduation-pipeline.md` defines the extraction protocol at the $1K MRR trigger — which slices stay shared, which extract with the app, what the migration path looks like. `validate-git-pushed-state.mjs` (advisory, week-4 blocks) ensures no local commits remain before session close.

**Depth 3 — Implementation view:**
- `tools/bootstrap.ps1` — idempotent setup script (empty repo → running platform)
- `.devcontainer/devcontainer.json` — Node 20 + pnpm preconfigured for Codespaces
- `CLAUDE_CODE_SUBAGENT_MODEL=haiku` in settings.json — cost-optimized subagent routing
- Session lifecycle: session-state.json updated at close → pushed to main → next session reads it
- GitHub Free tier: 60 Codespace hours/month (sufficient for solo dev stage)
- Cost decision documented: upgrade to Pro ($4/month, 180 hours) when regularly exceeding 60 hours/month

---

## §5 Dependencies & Blast Radiuses

**What I depend on:**
- GVRN (session lifecycle is GVRN-governed; OPER can't close a session without GVRN ZF)
- ARCH (graduation pipeline depends on ARCH schema-per-app isolation being clean)
- VALD (git-pushed-state is a VALD validator that OPER requires to be clean)

**Blast Radiuses:**
- **BR1 (element-level):** Changing a build-order week assignment — affects scheduling of that week's features
- **BR2 (app-level):** Triggering graduation for one app — affects that app's schema extraction and infrastructure separation
- **BR3 (platform-wide):** Changing the graduation trigger ($1K MRR) or the build order dependency graph — affects all future app builds and graduation timelines

---

## §6 Personas

**Default persona — Platform Operator:**
Knows the build order. Understands graduation triggers. Monitors costs. Ensures sessions are closed cleanly with state pushed. Manages the 12-week roadmap.

**Sub-personas:**
- **Release Manager:** Manages app graduation (schema extraction, infrastructure separation)
- **Cost Analyst:** Tracks per-tenant costs, subscription tier thresholds
- **DevOps:** Manages Supabase tiers, Vercel deployments, Codespaces configuration

**AI behavior in OPER domain:**
- *Spine-level:* OPER decisions are lowest precedence; never override GVRN/VALD/ARCH constraints for operational convenience
- *Platform-level:* Cost decisions must benefit all 30 apps, not just the current one
- *OPER-unique:* Session-close is the primary OPER ritual — nothing ships without clean git state, Level 3 ZF, extraction note, and handoff

---

## §7 Human Journeys

**Developer journey:**
1. `git clone` → `tools/bootstrap.ps1` → platform running locally
2. Work on feature → push to main at every IMPL_BATCH boundary
3. Session close: pnpm zf:deep → extraction → handoff → push
4. Alternative: GitHub Codespaces (no local setup needed)

**App graduation journey:**
1. App reaches $1K MRR trigger
2. Graduation review: which slices stay shared, which extract?
3. Schema extraction (2-3 day process using graduation-pipeline.md)
4. Infrastructure split: own Supabase project, own Vercel deployment
5. Platform retains shared foundation slices (User, Tenant, UserTenant, AuditEvent)

---

## §8 Vocabulary

**Terms I own:**
- `Graduation` — the moment an app extracts from CSPS to standalone product ($1K MRR trigger)
- `Bootstrap` — the process of going from empty repo to running platform in one idempotent run
- `Build Order` — the dependency graph governing which week introduces which capabilities
- `IMPL_BATCH` — a coherent implementation unit that ends in a commit-worthy event

**Terms I use:**
- `session-state.json` — from GVRN (session lifecycle artifact)
- `ZF Level 3` — from VALD (required before session close)
- `pnpm verify` — from VALD (the gate OPER must clear before pushing)

---

## §9 MCP Surface

```
get_build_order_week("1-12")        → what's in scope for that week
get_graduation_status("app-name")   → graduation readiness for that app
get_cost_summary("tenant-id")       → per-tenant cost attribution
get_session_state()                 → current S<NNN> + mandate + platform stats
find_by_spine("OPER")               → all OPER-governed elements
```

---

## §10 Current State & Evolution

**Implemented today (enforcement_stage: active):**
- `validate-git-pushed-state.mjs` — advisory (promotes to blocking week-4)
- `.devcontainer/devcontainer.json` — Codespaces-ready
- Session lifecycle: session-state.json updated + pushed at every session close
- `pillar-6-operations-and-delivery/` — build-order, graduation-pipeline, cost-economics, bootstrap-script, multi-machine-parity, android-workflow
- B_ZERO_LAPTOP_DEPENDENCY: 4/5 surfaces (hook surface deferred week-4)

**Planned (enforcement_stage: planned/week-4):**
- Per-tenant cost dashboard (pillar-6/cost-economics.md — stub, pending real data)
- `git-pushed-state-clean` → blocking (week-4 promotion)
- Codespace boot test (Governor action — test from browser)
- CLAUDE_CODE_SUBAGENT_MODEL → active in settings (cost optimization R2 GRACE)

---

## §11 Connection Map

| Connected to | How |
|---|---|
| GVRN | Session lifecycle is GVRN-governed; OPER delivers it but GVRN owns the protocol |
| ARCH | Graduation pipeline depends on ARCH schema-per-app isolation being extraction-ready |
| VALD | Session close requires VALD Level 3 ZF; git-pushed-state is a VALD validator |
| AI | Context orchestrator manages OPER session artifacts (session-state.json, last-run files) |
| Priority Engine | Build order is an OPER artifact that feeds PE sequencing |
