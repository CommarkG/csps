---
id: csps.council.architecture
name: council-architecture
description: >
  The CSPS Mini Internal Council system. Defines council types, member roster,
  bundling orchestrator rules, and the Opus ratification sealing protocol.
  Converts ad-hoc AI review into a governed, repeatable council process.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, AI, VALD]
schema_anchor: pillar_0_governance_leaves
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S022
impl_status: swift-implemented
---

# CSPS Mini Internal Council

> **Governor's principle:** "We should have templated the council with different members and
> a bundling orchestrator. If a core council is conducted, Opus should give the final audit
> on the plan before it can be ratified and sealed for execution."

---

## §1 — What the Council Is

The Council is a formal review system where specialized AI personas examine a plan from their
domain lens. The Bundling Orchestrator decides which members to invoke. The Governor triggers
each member. Opus gives the final audit on Core Councils before the plan is sealed.

**Why it matters:** A plan reviewed by one perspective misses what another catches.
The Security Reviewer catches what the SaaS Architect doesn't. Opus catches what both miss.
The council makes those gaps visible before implementation begins — not during it.

**What it is NOT:** The council is not a committee that votes. Each member gives a position.
Opus synthesizes. The Governor ratifies. The plan seals.

---

## §2 — Three Council Types

### Type 1: MINI COUNCIL
**When:** Mid-arc decisions, single-session plans, plan amendments.
**Trigger:** `council_required: mini` in plan frontmatter, OR Governor types "mini council on [topic]"
**Members:** 2-3 domain-specific reviewers (orchestrator selects)
**Opus role:** Advisory — Opus may review but is not mandatory
**Seal:** Not required — Governor ratifies verbally
**Duration:** 1 Governor trigger per member + synthesis

### Type 2: CORE COUNCIL
**When:** depth_chosen ≥ 4, constitutional changes, new platform patterns,
          plans that affect all 30 apps, any plan with `council_required: core`
**Trigger:** `council_required: core` in plan frontmatter, OR Governor types "core council on [topic]"
**Members:** All relevant reviewers (orchestrator selects) + Opus mandatory
**Opus role:** MANDATORY final audit before seal
**Seal:** REQUIRED — plan gets `ratification_status: SEALED` before implementation begins
**Duration:** 1 trigger per member + Opus audit turn + Governor ratification

### Type 3: EXTERNAL COUNCIL
**When:** External domain expertise needed (legal, industry-specific UX, compliance),
          benchmarking against non-CSPS AI systems
**Trigger:** Governor types "external council on [topic]" + names external systems
**Members:** Sonnet as coordinator + defined external AI personas (GPT, Gemini, etc.)
**Opus role:** Reviews external council output, gives final synthesis
**Seal:** Opus must countersign before plan enters implementation
**Duration:** Multiple rounds; Sonnet shuttles between external systems

---

## §3 — Council Member Roster

Each member has a DOMAIN LENS (what they see), a TRIGGER CONDITION (when they're invoked),
and a QUESTION SET (what they always ask).

---

### MEMBER: Security Reviewer

**Domain lens:** Auth boundaries, data isolation, attack surface, compliance exposure.
**Invoked when:** Plan touches auth, webhooks, RLS, GDPR, role permissions, JWT, API keys.
**Always asks:**
1. Can a user access another tenant's data? At what layer is this prevented?
2. Does role change in auth provider instantly propagate to enforcement layer?
3. Is every webhook handler idempotent? What happens on duplicate delivery?
4. What PII is stored? Is there an erasure path?
5. What happens if the enforcement layer (ZenStack/RLS) is bypassed?

**Format:** SECURITY REVIEW — [plan] with: PASSED / ADVISORY / BLOCKING per finding.

---

### MEMBER: SaaS Architect

**Domain lens:** Subscription model, billing lifecycle, Stripe integration, monetization.
**Invoked when:** Plan touches subscription status, Stripe events, trial logic, seat limits, billing.
**Always asks:**
1. Is the subscription state machine complete? (free→trialing→active→cancelled lifecycle)
2. What happens at each Stripe event? (subscription.created/updated/deleted, payment.failed)
3. Are hardcoded business values in config or in code?
4. Is trial conversion instrumented? Can the Governor see conversion rate?
5. What is the grace period strategy for payment failure?

**Format:** SAAS REVIEW — [plan] with: subscription state machine coverage table.

---

### MEMBER: Platform Developer

**Domain lens:** Developer experience for whoever builds App #2-30. Does this make apps easy to build?
**Invoked when:** Plan touches app template, libs/ APIs, schema patterns, webhook scaffolding.
**Always asks:**
1. If I fork the template and add a domain model, what do I inherit automatically?
2. Are there any copy-paste patterns (vs. generator/inheritance patterns)?
3. What does an App #2 developer need to know that isn't in the scaffold?
4. Will this pattern still make sense at App #15?
5. What's the blast radius if this API changes in 6 months?

**Format:** DX REVIEW — [plan] with: inheritance checklist (what App #2 gets automatically).

---

### MEMBER: Reliability Engineer

**Domain lens:** Failure modes, idempotency, performance under load, operations at scale.
**Invoked when:** Plan touches webhooks, DB operations, cron jobs, external API calls, migrations.
**Always asks:**
1. What happens if this webhook fires twice? (idempotency)
2. What happens if the external service (Clerk/Stripe) is down during this operation?
3. Is there a DB query here that becomes O(N²) at 10,000 tenants?
4. What monitoring exists to detect if this silently breaks?
5. Is any cron or background job being added? What runs it?

**Format:** RELIABILITY REVIEW — [plan] with: failure scenario table (event → impact → recovery).

---

### MEMBER: Balance Expert

**Domain lens:** Over-engineering detection, complexity score impact, moat vs. overhead.
**Invoked when:** Plan adds new validators, hooks, contracts, or processes. Complexity score > 18.
**Always asks:**
1. What does this add to the complexity score? (validators × hooks × skills × moat × EP)
2. Is this governance overhead or a genuine moat element?
3. Could this be achieved with a simpler mechanism?
4. What was the K-count that triggered this? Is K=1 enough?
5. Is there an existing pattern this extends rather than a new one?

**Format:** BALANCE REVIEW — [plan] with: complexity delta + moat vs. overhead classification.

---

### MEMBER: Opus Advisor (Final Audit Only)

**Domain lens:** Cross-system architectural integrity, compound value, what ALL other members missed.
**Invoked when:** Core Council (mandatory) or when Governor types "Opus audit on [plan]"
**Always applies:** 5 Mental Models (Cross-File, Time Projection, Coverage Enumeration,
                    Self-Referential, Moat Measurement)
**Always asks:**
1. Do the 5 reviewers form a coherent system, or are there gaps between their findings?
2. What does this plan look like at 10× scale (30 apps, 10,000 tenants)?
3. What is NOT proven by this plan that the reader might assume IS proven?
4. Does this governance system obey its own rules (self-referential)?
5. Does this compound (moat) or consume (overhead) across sessions?

**Output:** OPUS FINAL AUDIT — SEALED / CONDITIONAL SEAL / REJECTED

---

## §4 — Bundling Orchestrator

The Orchestrator decides which members to invoke based on plan characteristics.
Currently: Governor-driven (manual). Phase 2: `tools/council/orchestrator.mjs` (automated).

### Orchestrator Decision Rules

```
Read plan frontmatter + §1 findings:

IF core_spines includes ARCH AND (auth OR webhook OR role OR RLS in plan text)
  → INVOKE Security Reviewer

IF plan text contains (subscription OR billing OR Stripe OR trial OR seat)
  → INVOKE SaaS Architect

IF plan text contains (template OR app-build OR App #2 OR new app OR libs/ API)
  → INVOKE Platform Developer

IF plan text contains (webhook OR cron OR DB query OR migration OR external API)
  → INVOKE Reliability Engineer

IF (new validators added > 2) OR (new hooks added > 1) OR (complexity_score > 18)
  → INVOKE Balance Expert

IF council_type = "core" OR depth_chosen >= 4 OR constitutional = true
  → INVOKE Opus Advisor (mandatory final audit)

ALWAYS: minimum 2 members for any formal council
```

### Orchestrator Output Format

```
COUNCIL ORCHESTRATOR — [plan name]
Council type: MINI | CORE | EXTERNAL
Members invoked: [list]
Trigger reason per member: [why each was selected]
Suggested sequence: [which reviews first — dependency order]
Opus audit: required | advisory | not required
```

---

## §5 — Ratification Sealing Protocol

**When a Core Council completes, the plan is SEALED before implementation begins.**

### Sealing Process

```
Step 1: All relevant members complete their reviews
Step 2: Opus produces OPUS FINAL AUDIT
Step 3: Governor reviews Opus audit + all member reviews
Step 4: Governor ratifies OR requests revision
  → Ratified: proceed to Step 5
  → Revision needed: return to relevant member(s) for revised position
Step 5: Opus writes SEAL to plan frontmatter:
  ratification_status: SEALED
  sealed_by: "OPUS-[N] [model] [date]"
  sealed_session: S[NNN]
  council_type: core | mini | external
  members_reviewed: [list]
Step 6: pnpm verify passes with sealed plan
Step 7: Implementation may begin
```

### Seal Invariants (enforced by validator)

- A SEALED plan's §1-§N implementation sections cannot be edited after sealing
- To change a SEALED plan: open a new council of the same type or higher
- Adding a §PATCH section to a SEALED plan is allowed (explicit amendment)
- Sealed plans are immutable — only patches are allowed (AppendOnlyBase pattern applied to governance)

**Validator to build (Sonnet — UPDATE backlog):**
`validate-ratification-sealed.mjs` — checks that SEALED plans in topic-plans/ have not had their core sections edited since `sealed_at` timestamp. ADVISORY severity (warn, don't block — until K=2).

---

## §6 — Council Templates Index

```
tools/council/templates/
  mini-council.template.md        ← 2-3 member quick review
  core-council.template.md        ← full review + Opus seal
  external-council.template.md    ← Sonnet + external AI systems
tools/council/
  opus-brief.template.md          ← OPUS MODE BRIEF 8-part format
  council-architecture.md         ← this file (canonical home)
  PROTOCOL.md                     ← file-relay + council types
```

---

## §7 — How This Composes with Existing Infrastructure

```
EXISTING                          COUNCIL ADDITION
────────────────────────────────────────────────────────────────
opus-turn.md (Opus writes)        ← OPUS FINAL AUDIT goes here
sonnet-turn.md (Sonnet writes)    ← MEMBER responses go here (per member)
council-state.json                ← adds: council_type, members_invoked, seal_status
PROTOCOL.md                       ← adds: orchestrator rules + 3 council type specs
validate-no-implementation-without-plan.mjs ← adds: check seal_status if council_required: core
```

---

## §8 — Example: Core Council on a depth_chosen:5 Plan

```
1. Governor creates plan with council_required: core, depth_chosen: 5
2. Governor runs orchestrator decision rules (§4) → identifies 4 members
3. Governor triggers each member in sequence:
   "Mini council turn — Security Reviewer: read [plan], write position to sonnet-turn.md"
   "Mini council turn — SaaS Architect: read [plan] + Security review, add to sonnet-turn.md"
   ... etc.
4. All member positions collected in sonnet-turn.md
5. Governor triggers Opus: "Core council final audit — read [plan] + sonnet-turn.md"
6. Opus writes OPUS FINAL AUDIT to opus-turn.md
7. Governor ratifies → Opus writes SEAL to plan frontmatter
8. Sonnet sees SEALED status → proceeds with implementation
```

---

*CSPS Mini Internal Council v1.0 | S022 | 2026-05-11*
*Governor directive: templated council + bundling orchestrator + Opus seal before ratification*
*Authority: GVRN L2 + P-META-021 Triad Governance*
