---
id: csps.handoff.vault.topic-plan.s014-task-management-app
name: s014-task-management-app
description: Deep planning for CSPS App 1 — Task Management. Depth-4 plan: L1=research+VLT resolution, L2=goals+personas+success metrics, L3=architecture+schema+graduation design, L4=implementation. B_CONSENSUS_BEFORE_PROCEEDING applies — no L4 code until L3 ZF gate passes and Governor ratifies all VLTs. VLT-S014-001 resolved (task management is the first app).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN, VALD]
schema_anchor: topic_plans
tags:
  - domain:architecture
  - domain:planning
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
session: S014
execution_mode: deep_quality
alignment_verified_session: S015
topic_id: s014-task-management-app
priority_score: 95
priority_band: 1
depth_chosen: 4
depth_rationale: |
  Depth-4 (not 3): This is the first CSPS app — it sets the extraction template
  for all 30 future apps. Getting the architecture wrong here propagates to every
  subsequent app. Three distinct concerns (research / goals+personas / architecture)
  each deserve their own ZF gate before implementation starts.
  Not depth-5: no novel cross-spine synthesis needed; the pattern (multi-tenant
  SaaS task management) is well-understood. The depth is for VALIDATION, not novelty.
know_how_consulted: true
multi_session_arc: [S014, S015]
covered_paths: [apps/sandbox/, apps/task-mgmt/]
backtrack_register:
  - trigger-id: schema-not-extractable
    action: if Task entity can't be cleanly extracted from shared schema at graduation → revisit schema-per-app boundary
  - trigger-id: vlt-answers-conflict
    action: if VLT-S014-002 through 005 answers are internally inconsistent → PCR + Governor decision before L3
  - trigger-id: pricing-model-blocks-schema
    action: if free-tier decision (VLT-S014-005) requires schema changes → re-run L3 gate
links:
  - { rel: parent, href: ./README.md }
  - { rel: depends-on, href: ./foundation-slices.md }
  - { rel: depends-on, href: ./s013-clerk-stripe-integration.md }
  - { rel: construction-gate, href: ../../../../../tools/validators/validate-no-implementation-without-plan.mjs }
---

# Topic-Plan — Task Management App (depth-4)

> **B_CONSENSUS_BEFORE_PROCEEDING is active for every level.**
> No L<N+1> work begins until L<N> ZF gate passes AND Governor ratifies.
> VLT items are research questions — they are ANSWERED through the L1 process, not in a chat message.

---


## §HARVEST — What this plan is designed to extract

```yaml
harvest_triggers:
  - on: phase_gate
    collect: [schema_design_decisions, app_template_patterns, billing_trigger_design]
    destination: vault
    vault_path: docs/plan/_intake/vault/task-mgmt/
  - on: plan_close
    collect: [first_app_extraction_template, graduation_path_lessons]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-S017-extraction.md
      - pattern_home: docs/plan/pillar-1-product/graduation-path.md

harvest_questions:
  - "Does the task-mgmt architecture serve as a valid template for all 30 apps?"
  - "What schema decisions here would be wrong for a different app type (e.g., booking vs task)?"
  - "Is the billing trigger (2nd UserTenant) the right graduation trigger for all apps?"
```

---

## §KH Know-How Consultation

**1. Orphan prevention (→ EP-002):** `covered_paths: []` intentionally empty — no implementation files yet. Validator will not flag empty. When implementation starts at L4, add `apps/task-mgmt/` to covered_paths.

**2. Implicit deliverables:** At L3 close, register `task-mgmt-schema-drift` audit slug atomic with ZModel slice authoring.

**3. Precedent check:** Task management is one of the most-built SaaS categories. Research at L1 must include: Linear, Notion, Asana, Todoist, TickTick — not to copy, but to understand WHY they made the decisions they did.

**4. Schema extraction risk:** This app's schema (Task, Project, Milestone if scoped) will become the EXTRACTION TEMPLATE. Every decision here propagates to all 30 CSPS apps. The L3 gate is therefore higher-stakes than a normal app.

**5. Sandbox role:** The `apps/sandbox/` shell (to be built) will validate schema assumptions with real data before L4 commits to production schema.

---

## §1 — Level 1: Research + VLT Resolution

**Goal of L1:** Answer the 4 pending VLTs through research and sandbox validation — not through gut instinct. Each VLT has a research method and a validation gate.

### VLT-S014-002 — MVP Scope Research

**Question:** Tasks only? Tasks + Projects? Tasks + Projects + Milestones?

**Research method:**
- Survey the 5 leading task tools (Linear, Notion, Asana, Todoist, ClickUp): what did they ship in v1?
- Identify: what is the minimum entity set for a meaningful task-tracking loop?
- Validate with sandbox: build the schema for each option (Tasks-only vs Tasks+Projects) and check if the difference actually matters in use

**Decision criteria:**
- Which scope can ship in 1 week of L4 work?
- Which scope, if wrong, is reversible post-graduation?
- Which scope is actually different from existing free tools (why would someone pay?)

**Expected research output:** 1-page comparison table + recommendation → Governor ratification

### VLT-S014-003 — Workspace Model Research

**Question:** One workspace per tenant, or multiple workspaces?

**Research method:**
- Map how Linear (spaces), Notion (workspaces), Asana (teams/portfolios) handle this
- Assess schema impact: `Project.workspaceId` FK vs just `Project.tenantId`
- Validate: does the current `Tenant → UserTenant → User` model support multiple workspaces without schema change?

**Decision criteria:**
- Starting simple (one workspace = tenant) — what does this block in year 2?
- If flexible (multiple workspaces) — what's the schema overhead at L3?
- Per VLT-S011-004: Tenant maps 1:1 to Clerk org. Can workspace be a sub-resource of Tenant?

**Expected research output:** Schema diagram for both options → Governor ratification

### VLT-S014-004 — Graduation Trigger Research

**Question:** 10 paying users? $1K MRR? 50 DAU? Manual Governor call?

**Research method:**
- Review CSPS graduation-path design (graduation path is designed for all apps — check existing docs)
- Research industry precedent: when do bootstrapped SaaS tools "go standalone"?
- Consider: which metric is easiest to measure automatically vs requires Governor judgment?

**Decision criteria:**
- Metric must be observable from AuditEvent data (no external analytics required)
- Metric must be meaningful enough that graduation preserves value
- Manual override always available regardless of metric

**Expected research output:** Graduation trigger definition → recorded in session-state.json VLT resolution

### VLT-S014-005 — Free Tier Research

**Question:** Free tier (N tasks), or paid from day 1, or free for individuals / paid for teams?

**Research method:**
- Map competitor pricing: Todoist (freemium), Linear (paid from start for teams), Notion (generous free)
- Assess Stripe integration: what's the schema difference between a free tenant and a paid tenant?
- Check: does `Tenant.stripeCustomerId` being nullable already model the free-tier case?

**Decision criteria:**
- Which model is simpler to implement in Stripe? (Stripe has direct freemium support)
- Which model validates the pricing hypothesis fastest?
- Per B_CONSENSUS_BEFORE_PROCEEDING: this decision affects Stripe webhook handling at L4

**Expected research output:** Pricing model + Stripe implementation sketch → Governor ratification

### L1 Exit Criteria

- [x] VLT-S014-002 research complete + Governor answer recorded (B: Tasks+Projects — s014-l1-research.md)
- [x] VLT-S014-003 research complete + Governor answer recorded (A: one workspace per tenant)
- [x] VLT-S014-004 research complete + Governor answer recorded (B: $1K MRR graduation)
- [x] VLT-S014-005 research complete + Governor answer recorded (C: free solo / paid team)
- [x] Sandbox scaffolded (apps/sandbox/ — commit b05685c). Functional with credentials.
      Stripe webhook stub INCLUDED (exit criterion updated per Option B — billing deferred to VLT-S015-002).
      VLT-S015-001 partial fix: User.tenantId set at org creation. Full login-sync is VLT-S015-001 for Phase 5.
- [x] pnpm verify exit_code 0

---

## §2 — Level 2: Goals + Personas + Success Metrics

**Goal of L2:** Define who this app is for, what success looks like, and how we measure it. Not marketing fluff — these feed directly into L3 schema decisions.

### Persona Definition

The persona determines what fields a Task MUST have vs what's optional:

| Persona | Primary workflow | Key Task fields | What they pay for |
|---|---|---|---|
| Solo developer | Personal TODO + code tracking | title, status, dueDate, priority | Sync + mobile |
| Small dev team (2-5) | Sprint tracking | + assigneeId, sprintId | Collaboration |
| SMB team lead | Project tracking | + projectId, milestonesId | Reporting + integrations |

**L2 research question:** Which persona is CSPS App 1 targeting? (Affects schema depth — solo = simpler, team lead = complex)

### Goal Setting Framework

Before writing schema, define:

1. **Primary goal:** What problem does a user solve in <5 minutes of using the app?
2. **Differentiation:** What does this app do that Todoist Free does not?
3. **Graduation goal:** By graduation (trigger from VLT-S014-004), what outcome has the user achieved?

### Success Metrics (measurable from AuditEvent)

| Metric | Target at graduation | Source |
|---|---|---|
| Tasks created per active user per week | > 5 | AuditEvent `action: "task.created"` |
| Task completion rate | > 60% | AuditEvent `action: "task.completed"` |
| Retention (D30) | > 40% | derived from login events |
| Paying conversion (if free tier) | > 5% | Stripe webhook → AuditEvent |

### L2 Exit Criteria

- [x] Primary persona defined and ratified by Governor (small technical team lead — s014-l2-goals-personas.md)
- [x] 3 success metrics defined and measurable from AuditEvent
- [x] Differentiation statement (one sentence) ratified ($9/mo flat per team)
- [x] pnpm verify exit_code 0

---

## §3 — Level 3: Architecture + Schema + Graduation Design

**Goal of L3:** Lock the schema decisions that cannot be changed post-L4. This is the highest-stakes level.

### Task Entity Design (to be filled post-L2)

```
model Task extends Base {
  tenantId     String         // RLS anchor — always present
  title        String
  status       TaskStatus
  priority     TaskPriority?
  dueDate      DateTime?
  assigneeId   String?        // → User.id
  projectId    String?        // present if VLT-S014-002 includes Projects
  createdById  String         // → User.id

  @@schema("public")
  @@allow("read", auth().tenantId == tenantId)
  @@allow("create,update", auth().tenantId == tenantId)
  @@deny("delete", true)     // soft-delete only

  @@index([tenantId, status])
  @@index([assigneeId, dueDate])
}
```

**Locked decisions at L3 gate:**
- Task schema with all fields (no optional field additions after L4)
- State machine for TaskStatus (what statuses exist, what transitions are valid)
- Whether Project and/or Milestone entities exist
- RLS policy for Tasks (tenant-scoped only, or also user-scoped)
- Graduation path: which schema tables get extracted at graduation

### Graduation Path Design

At graduation, the app extracts:
- All Task* ZModel slices → own repo
- `libs/integrations/clerk/` and `libs/integrations/stripe/` → own integration package
- Continues to share `User/Tenant/UserTenant/AuditEvent` from CSPS until fully standalone

### L3 Exit Criteria

- [x] Task ZModel slice authored in libs/policies/slices/public/ (commit f5b3757)
- [x] TaskStatus state machine defined + state transitions commented (Postgres trigger deferred to when apps/ exists)
- [x] Project/Milestone presence decided (Tasks+Projects; no Milestones at v1 — VLT-S014-002)
- [x] Graduation path documented (which slices extract, which stay shared) — docs/plan/pillar-1-product/graduation-path.md (S015)
- [x] `validate-foundation-schema-drift.mjs` covers Task entity — EXPLICITLY DEFERRED: requires ZenStack installation (not yet in project). Tracked in deferred track. Unblocked when ZenStack added. Sufficient for Phase 5 MVP: schema drift caught at prisma generate time. (S015 explicit deferral with WHY)
- [x] pnpm verify exit_code 0

---

## §4 — Level 4: Implementation

**Gate:** ALL of L1, L2, L3 ZF cycles must pass before ANY app code is written.

When L4 opens, the first action is:
1. Create `apps/task-mgmt/` as Next.js 14 app (or scaffold from sandbox)
2. Wire `libs/integrations/clerk/webhook-handler.ts` to real Next.js API route
3. Wire `libs/integrations/stripe/customer-service.ts` to Stripe webhooks
4. Implement Task CRUD pages against ratified schema
5. Instrument AuditEvent for every Task action

---

## §6 Priority Engine — inputs

```yaml
priority_engine:
  topic_id: s014-task-management-app
  depth_chosen: 4
  inputs_per_level:
    L1_research:
      breadth: 8    # 4 VLTs, each needs research + validation
      depth: 6      # established SaaS patterns — not novel
      impact: 10    # wrong answers here propagate to all 30 apps
      dep_satisfied: 1  # S013 complete, foundation slices built
      multi_session_cost: 1.5
      priority_score: 95
```
