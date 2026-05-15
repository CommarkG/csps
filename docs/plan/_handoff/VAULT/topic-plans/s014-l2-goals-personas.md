---
id: csps.handoff.vault.topic-plan.s014-l2-goals-personas
name: s014-l2-goals-personas
description: L2 output for S014 task management app. Goals, primary persona, differentiation statement, and success metrics measurable from AuditEvent. Locks the product direction before L3 schema design begins.
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
  - { rel: depends-on, href: ./s014-l1-research.md }
domain_path: platform
scope_level: S1
---

# S014 L2 — Goals, Personas, Success Metrics

> **Status: COMPLETE — Governor-ratified 2026-05-06. L3 is UNLOCKED.**
> Pricing confirmed: $9/month flat per team (up to 5 members).

---

## Primary Persona

**The Small Technical Team Lead** (2–8 person team, dev or product)

| Attribute | Detail |
|---|---|
| **Role** | Developer, designer, or PM leading a small team |
| **Current tool** | Notion (too freeform) or Jira (too heavy) |
| **Core frustration** | Notion has no real task status tracking. Jira requires a full admin setup and feels like enterprise overhead. |
| **Primary workflow** | Creates tasks, assigns to teammates, tracks completion, reviews what's done each week |
| **Pays when** | Team adds a second member — natural moment of "this is now a shared tool" |
| **Upgrade trigger** | Needs collaboration features: assignees, comments, team view |

**Secondary persona (free tier):** Solo developer using as a personal TODO + lightweight project tracker. Provides organic growth. Converts to paid when they add a collaborator.

**Why this persona unlocks the pricing model (VLT-S014-005):**
The free-to-paid transition is exactly "UserTenant count crosses 2" — the solo developer invites a colleague. This happens naturally, not through a paywall, making it the lowest-friction upgrade path.

---

## Primary Goal

> **One sentence:** Give small technical teams a task + project tracker that feels like a developer tool, not enterprise software — fast to set up, zero configuration, works from day 1.

**What "developer tool feel" means concretely:**
- Keyboard-first navigation
- No mandatory onboarding wizard
- Tasks show up within 60 seconds of signup
- Markdown in task descriptions
- Status transitions are explicit (Todo → In Progress → Done) not drag-and-drop boards

---

## Differentiation Statement

> **Why this instead of Notion, Todoist, or Linear:**
> CSPS Task is the **only task manager that bills by team, not by seat** — solo use is free forever, and you pay once when your team joins, not per person. For a 3-person team: Notion = $30/mo, Linear = $30/mo, CSPS = $9/mo flat.

**Pricing: $9/month flat per team (up to 5 members). Governor-confirmed 2026-05-06.**

---

## Success Metrics (all measurable from AuditEvent)

| Metric | Target at graduation ($1K MRR) | AuditEvent source |
|---|---|---|
| Tasks created per active team per week | ≥ 10 | `action: "task.created"` |
| Task completion rate | ≥ 50% | `action: "task.status_changed" data.to: "done"` |
| D30 retention (teams still active 30 days after signup) | ≥ 35% | last login event per tenant within 30 days |
| Free → paid conversion | ≥ 8% (second member joined) | `action: "userTenant.created"` where tenant already has 1 member |
| Teams at $1K MRR | ~12 teams at $9/mo flat OR ~111 at $9/seat/mo | Stripe MRR aggregate |

**Why these metrics and not vanity metrics:**
- Tasks created = product is being used, not just signed up for
- Completion rate = tasks are real work, not just tracked for show
- D30 retention = teams are sticking, not churning after trial
- Conversion = the pricing model actually works
- MRR = graduation gate from VLT-S014-004

---

## Scope Boundary (derived from VLT-S014-002: Tasks + Projects)

**In scope at L4:**
- Task entity: title, status (Todo/InProgress/Done), priority, dueDate, assigneeId, projectId, description (markdown)
- Project entity: name, description, status (Active/Archived)
- TaskComment entity: author, body, createdAt (essential for team collaboration)
- Dashboard: "My Tasks", "Project Tasks", "Team Activity"

**Explicitly out of scope at v1 (add later, no schema changes needed):**
- Milestones (add milestone entity later with FK on Task)
- Sub-tasks (add parentTaskId FK on Task later)
- Custom fields (add TaskMetadata JSON field later)
- Time tracking
- Integrations (GitHub, Slack)
- Recurring tasks

**Schema implication:** The "out of scope" items are additive — they add FKs or new entities but don't change existing ones. This is the extraction-safe design.

---

## L2 Exit Criteria

- [x] Primary persona defined
- [x] Primary goal stated (one sentence)
- [x] Differentiation statement written
- [x] Success metrics defined and measurable from AuditEvent
- [x] Scope boundary explicit (in / out of scope at v1)
- [x] ★ Governor confirmed: $9/mo flat per team (2026-05-06)
- [x] pnpm verify exit_code 0

**L2 COMPLETE. L3 (Task + Project ZModel) is OPEN.**
