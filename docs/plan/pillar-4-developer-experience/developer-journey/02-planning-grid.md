---
id: csps.pillar4.developer-journey.planning-grid
name: developer-planning-grid
description: "Stage 2 — Planning grid activation. Nodes activate from the intent object. Cross-validation runs. No code until readiness threshold is met."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
diataxis_type: reference
session: S039
pe_score: 40
links:
  - { rel: parent, href: ./README.md }
  - { rel: threshold, href: ./01-developer-threshold.md }
tags:
  - domain:dx
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:draft
scope_level: S1
---

# Stage 2 — The Planning Grid

**PE score: 40** — High impact, but significant work. Build the Threshold first.

---

## What the planning grid is

A directed graph of specification documents. Each document is a node. Each node has a type, a status, and contracts with other nodes. The intent object from Stage 1 activates a subgraph — the minimum set of nodes that must reach VALIDATED status before any code is written.

The grid is not a project management tool. It is a consistency-checking system. Its job is to surface contradictions, gaps, and orphaned specs BEFORE they become bugs in production.

---

## The node types

### User Model node
**What it specifies:** Who uses this app, in what context, with what goals. The archetypes the OnboardingWizard will capture.

**Contracts with:** Data Model (users must be represented), Auth Model (users must have permissions), UI Flows (users must be the subject of every journey)

**Validation questions:**
- Is every user archetype reachable from the Threshold?
- Does every archetype have at least one user_journey_test?
- Are the archetypes mutually exclusive or do users shift between them?

### Data Model node
**What it specifies:** The entities, relationships, and constraints that represent the domain. Produces the ZenStack schema.

**Contracts with:** User Model (every entity must relate to a tenant), API Surface (every entity must be reachable via API), Business Logic (entities must support the logic)

**Validation questions:**
- Does every entity have tenantId (multi-tenant isolation)?
- Does every entity have a defined lifecycle (create/update/delete/soft-delete)?
- Are there orphaned entities (no API access)?

### API Surface node
**What it specifies:** The operations users can perform. Every endpoint, its input schema, output schema, auth requirement, and which user journey it serves.

**Contracts with:** Data Model (every endpoint reads/writes entities), UI Flows (every endpoint is called from a UI action), Auth Model (every endpoint has a permission)

**Validation questions:**
- Is every entity in the Data Model accessible via at least one endpoint?
- Is every endpoint called from at least one UI action?
- Are there endpoints with no auth requirement that should have one?

### UI Flows node
**What it specifies:** The pages, forms, and interactions users see. Every interactive element connected to its API call. Every state (loading/empty/error/success) specified.

**Contracts with:** API Surface (every action calls a real endpoint), User Model (every flow serves a specific archetype's journey), user_journey_test (every flow is covered by a test)

**Validation questions:**
- Does every UI action have a real API call (not a TODO)?
- Does every page have loading, empty, and error states?
- Does every user_journey_test have corresponding UI coverage?

### Auth Model node
**What it specifies:** What each user archetype can do. ZenStack @@allow/@@deny policies. Multi-tenant boundaries.

**Pre-validated for CSPS apps:** The base auth model (Clerk + ZenStack tenant isolation) is already validated by the platform. Only app-specific permissions need specifying.

**Contracts with:** API Surface (every operation must have an explicit permission), Data Model (tenant isolation must be enforced on every model)

### Business Logic node
**What it specifies:** Rules that govern how data changes in response to events. State machines (invoice: draft → sent → paid → overdue). Calculations (tax estimate, balance). Constraints (budget limit enforcement).

**Contracts with:** Data Model (logic must be encodable in the schema or API layer), API Surface (logic must be triggered by an API call), User Model (logic must serve a user's goal)

**Validation questions:**
- Is every business rule encodable in the system (not requiring manual intervention)?
- Is every state transition explicitly specified (including failure paths)?
- Are there rules that can conflict with each other?

### Deployment Config node
**Pre-validated for CSPS apps.** The standard CSPS Vercel deployment config is already validated. The developer does not need to specify this node — it inherits from the platform standard.

---

## The activation pattern

Different intents activate different subsets of nodes:

**Simple personal tool (single user, no team):**
User Model → Data Model → API Surface → UI Flows
(Auth Model is simplified — no team permissions needed)
(Business Logic may be minimal or absent)

**Multi-tenant SaaS:**
User Model → Data Model → API Surface → UI Flows → Auth Model → Business Logic
(All nodes activate — this is the full CSPS pipeline)

**Adding a feature to an existing app:**
Only the delta nodes activate. Existing validated nodes are referenced, not re-specified.
(If existing Data Model is unchanged, that node stays VALIDATED — no respecification)

**Marketplace (buyers + sellers):**
Two User Models → Two Data Models → Shared API Surface → Separate UI Flows → Complex Auth Model → Escrow Business Logic
(Additional nodes: Payment Flow, Trust Model, Dispute Resolution)

---

## Cross-node validation (what the grid checks)

Before any node advances to VALIDATED, it must pass its cross-node checks:

**Coverage:** Every entity in Data Model is accessible via API Surface. Every API endpoint is called from UI Flows. Every UI action is in a user journey. If anything is disconnected, the grid reports a gap.

**Consistency:** Auth Model permits all operations in API Surface. Data Model supports all operations in Business Logic. No contradictions between nodes.

**Completeness:** Every user_journey_test from Stage 1 is traceable through UI Flows → API Surface → Data Model → Business Logic. If a journey cannot be traced, something is missing.

---

## Grid readiness threshold

The planning grid reaches readiness when all activated nodes reach VALIDATED status. At readiness:

1. Every entity has a home and operations
2. Every operation has a permission and a UI trigger
3. Every UI trigger is covered by a user journey test
4. Every journey test is traceable to working code paths (even if the code doesn't exist yet)

This is the moment implementation can begin. Not before.

The grid does not need to be perfect. It needs to be consistent. Gaps can be noted and deferred explicitly — but they cannot be undiscovered.
