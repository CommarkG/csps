---
id: csps.handoff.vault.topic-plan.s014-l1-research
name: s014-l1-research
description: L1 research output for S014 task management app. Competitor analysis + VLT-S014-002 through 005 research findings and recommendations. Governor must ratify before L3 schema work begins.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: deprecated
priority_score: 30
priority_band: 4
template_used: pillar-leaf
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN]
schema_anchor: topic_plans
tags:
  - domain:planning
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
know_how_consulted: true
session: S014
alignment_verified_session: S016
links:
  - { rel: parent, href: ./s014-task-management-app.md }
domain_path: platform
scope_level: S1
context_question: "What is the current depth level of this topic plan, and have all prior depth gates been verified clean before proceeding to the next level?"
---

# S014 L1 Research — VLT Resolution + Competitor Analysis

> **Status: RATIFIED — Governor approved all 4 recommendations on 2026-05-06.**
> VLT-002: B | VLT-003: A | VLT-004: B ($1K MRR) | VLT-005: C
> L3 schema design is now UNLOCKED.

---

## Competitor V1 Analysis

| Tool | Launch year | V1 scope | Pricing model | Workspace |
|---|---|---|---|---|
| **Linear** | 2020 (1yr private beta) | Issues + Projects + Cycles | Free tier (2 teams) → $10/user/mo | 1 org = 1 workspace |
| **Notion** | 2016 v1, 2018 v2 | Blocks + Pages + 30 templates | Freemium → $10/user/mo | Multiple workspaces per account (causes billing confusion) |
| **Asana** | 2011 free, 2012 paid | Tasks + Projects (list-based) | Free → commercial after PMF | 1 workspace per org, teams within |
| **Todoist** | 2007 | Tasks + Projects (grouping only) | Freemium from day 1 ($29/year) | No teams; personal-first |
| **ClickUp** | 2017 | Tasks + Spaces + Lists | Freemium aggressive | Workspaces with Spaces within |

**Key pattern from all 5:** Every successful v1 launched with **Tasks + Projects** as the minimum. Pure "tasks only" exists only in personal tools (Things, Reminders). A collaborative paid product needs the Tasks→Projects relationship from day 1.

---

## VLT-S014-002 — MVP Scope

**Research finding:**

Tasks-only (Option A) fails for two reasons:
1. No differentiation from free personal apps (Apple Reminders, Google Tasks)
2. No natural upgrade trigger — what do you pay for if tasks is the ceiling?

Tasks + Projects + Milestones (Option C) is too much for v1 because:
1. Milestones require a release management mental model most teams don't have at onboarding
2. Linear didn't ship Milestones until 2022 — 2 years after launch
3. More entity types = more schema = more schema decisions that must be right before L3 lock

**Recommendation: Option B — Tasks + Projects.**

Minimum viable schema:
- `Task` entity (title, status, priority, dueDate, assigneeId, projectId)
- `Project` entity (name, tenantId, description, status)
- `ProjectMember` or derived from `UserTenant` (who can see which projects)

This is reversible: adding Milestones later = add `Milestone` entity with `milestoneId` FK on Task. No existing schema changes.

**Governor ratification needed:** Confirm B, or override with A (simpler) or C (if Milestones are a day-1 requirement).

---

## VLT-S014-003 — Workspace Model

**Research finding:**

Notion's multiple-workspace model is the cautionary tale:
- Billing is per workspace (not per org) → customers pay N times for N workspaces → confusion
- Content can't be linked between workspaces → silos
- Notion themselves say "use the fewest workspaces possible"

Linear's model (1 org = 1 workspace) is cleaner:
- All teams live within one org/workspace
- Billing is per org (Tenant in CSPS)
- Teams/groups are sub-resources within the workspace

**Critical CSPS-specific finding:** The current Tenant model already implements the "1 org = 1 workspace" pattern. `Tenant.clerkOrgId` maps one Clerk org to one Tenant. Adding multiple workspaces would require either:
- `Workspace` entity with `tenantId` FK (adds a whole new join)
- OR redefining `Tenant` to mean "workspace" (breaks VLT-S011-004 resolution)

Either path adds significant schema complexity for a benefit that every competitor warns against at v1.

**Recommendation: Option A — one workspace per tenant.**

The workspace IS the tenant. Teams/groups within the tenant can be added later as `TeamGroup` entities if needed. This is already implemented via the foundation slices.

**Governor ratification needed:** Confirm A. The flexibility question ("what if a company wants separate workspaces for Dev and Marketing?") is answered by: they create two Clerk orgs = two Tenants. Clean separation, separate billing.

---

## VLT-S014-004 — Graduation Trigger

**Research finding:**

Comparing metrics:

| Metric | Measurable from AuditEvent? | Gaming risk | Meaning |
|---|---|---|---|
| 10 paying users | Via Stripe webhooks → AuditEvent | High (can use personal emails) | Weak — doesn't validate business value |
| $1K MRR | Via Stripe webhooks → AuditEvent | Low | Strong — real money, real retention signal |
| 50 DAU | Via login/task events | Medium | Activity ≠ payment. Users can be active without paying |
| Governor manual | N/A | None | Maximum flexibility; requires Governor attention |

$1K MRR is the strongest signal because:
1. It's measurable automatically from Stripe webhooks (already wired in S013)
2. It validates willingness to pay — the core hypothesis
3. It's a common SaaS benchmark (ramen profitability tier)
4. It's not gameable without actual payment

**Recommendation: Option B — $1K MRR, with Governor manual override always available.**

Implementation: Stripe webhook `invoice.paid` → AuditEvent → nightly job sums MRR per tenant → when threshold crossed, flag in session-state.json.

**Governor ratification needed:** Confirm $1K MRR threshold, or set a different number. Manual override is always available regardless.

---

## VLT-S014-005 — Free Tier

**Research finding:**

Conversion rate benchmarks:
- **Freemium:** 2–5% conversion (industry average), 5–8% for exceptional products
- **Free trial (no CC):** 8–18% conversion
- **Free trial (CC required):** 31–48% conversion

Task management specific:
- Todoist: Freemium from day 1. Built to 40M users over 15 years. Slow but organic.
- Linear: Launched with free tier, now has 4 tiers. Dev-tool market accepts paid faster.
- Asana: Free launch → commercial once PMF proven.

**Architectural finding:** Stripe is already wired (S013). `Tenant.stripeCustomerId` is nullable — a null `stripeCustomerId` already models "free tier" without schema changes. Free tier costs nothing to implement architecturally.

**The real question is the upgrade trigger design:**
- Option A (N tasks free): simple, predictable, tasks is the natural unit
- Option B (paid from day 1): maximizes revenue but limits growth
- Option C (free for individuals, paid for teams): most complex to implement (need to define "team" = >1 user in UserTenant)

Option C (free individual / paid team) maps perfectly to the UserTenant model:
- 1 UserTenant record per tenant = free
- 2+ UserTenant records per tenant = paid

This is the "viral team adoption" model (Slack, Figma, Notion). Free users recruit teammates, triggering payment.

**Recommendation: Option C — free for solo use, paid when team (2+ members) joins.**

Schema implication: add `subscriptionStatus` to `Tenant` enum (`free | trialing | active | cancelled`). Stripe billing triggers when 2nd UserTenant is created for a tenant.

**Governor ratification needed:** Confirm C, or simplify to A (task limit). C is more complex to implement but creates stronger network effects.

---

## Summary for Governor Ratification

| VLT | Recommendation | Alternative if wrong |
|---|---|---|
| **002 MVP scope** | **B: Tasks + Projects** | A (tasks only) if team wants fastest build |
| **003 Workspace** | **A: One workspace per tenant** | Already implemented; changing would break VLT-S011-004 |
| **004 Graduation** | **B: $1K MRR** | Any number; Governor manual override always available |
| **005 Free tier** | **C: Free solo, paid team (2+ members)** | A (N tasks free) if C feels too complex |

**Answer format:** `VLT-002: [A/B/C] | VLT-003: [A/B] | VLT-004: [B or number] | VLT-005: [A/B/C]`

Once ratified, these answers lock L3 schema decisions. L3 cannot start until this document is updated with Governor answers.
