---
id: csps.pillar4.developer-journey.threshold
name: developer-threshold
description: "Stage 1 — Intent crystallization for developers. The highest-PE item in the journey. Nothing can be planned until intent is clear enough to route correctly."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
diataxis_type: how-to
session: S039
pe_score: 107
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../../../../packages/principles/principles/P-META-022-intent-crystallization.yaml }
tags:
  - domain:dx
  - domain:governance
  - type:how-to
  - audience:developer
  - maturity:draft
scope_level: S1
---

# Stage 1 — The Developer Threshold

**PE score: 107** — Highest in the journey. Everything downstream is wrong if intent isn't crystallized here.

---

## Why this is first

A developer who says "I want to build a project management app" cannot be routed correctly. That sentence activates too many conflicting nodes. The planning grid doesn't know:
- Who are the users? (individuals, teams, enterprises?)
- What problem are they solving that existing tools don't?
- What does success look like in 30 days?
- What constraints exist? (team size, timeline, technical skill)

Without answers to these, any plan written is a guess. Any code written is premature.

The Threshold is not a welcome screen. It's the validation that intent is specific enough to build against.

---

## The Developer Threshold Protocol

**Four questions. All four must be answered before any planning begins.**

### Q1 — The Problem (not the feature)

> "What specific problem are you solving, and who has it?"

Wrong: "I want to build a task manager."
Right: "Freelance designers lose track of client revisions. They're using email threads and can't tell which feedback is current."

The problem names a person, a situation, and a friction. If you can't name all three, you're not ready.

**What you produce:** A one-paragraph problem statement in the user's language, not the builder's language.

### Q2 — The Success Signal (specific and observable)

> "What can the user DO in 30 days that they cannot do now?"

Wrong: "Manage their projects better."
Right: "A designer can share a live link with a client, the client adds comments directly to the design, and the designer sees all feedback in one place — no email."

The success signal is behavioral, not attitudinal. It describes an action the user takes, not a feeling they have.

**What you produce:** The `user_journey_test` — the step-by-step sequence that proves the product works. This becomes the primary done criterion for every feature.

### Q3 — The Constraint Set

> "What limits what you can build?"

Wrong: Skip this question.
Right: "Solo developer, 6 weeks, no budget for external APIs, must work with existing Clerk auth."

Constraints determine which planning grid nodes activate and which pipeline is appropriate. Building without constraints means building the wrong things at the wrong scope.

**What you produce:** A constraint declaration that bounds the planning grid's scope.

### Q4 — The Routing Signal

> "Is there an existing CSPS app that covers 70%+ of this? What's the gap?"

Wrong: Build from scratch without checking.
Right: "Budget Planner covers financial tracking. My app covers project revision tracking. The core is different but the auth + tenant model is the same."

This determines whether you're building a new app from template, extending an existing app, or building something that should be a new CSPS product.

**What you produce:** A routing decision (new app / extension / new product) and identification of what's pre-built vs what must be built.

---

## The Threshold Output

After all four questions are answered, the Threshold produces a structured intent object:

```yaml
intent:
  problem: "Freelance designers lose track of client revisions in email threads"
  user_archetype: "freelance_designer"
  user_journey_test: |
    Given: Designer has a project with 3 client revisions in email
    When: Designer imports or uploads the design and shares a link
    Then: Client sees the design + can add comments in context
    And: Designer sees all comments in one timeline, not email
    Success signal: Designer says "I can now reply to clients without checking 3 email threads"
  constraints:
    timeline: 6 weeks
    team: solo developer
    budget: no paid APIs except existing CSPS integrations
  routing: new_app
  template_delta:
    pre_built: [auth, tenant, security, deployment, rate-limiting]
    must_build: [design_file_storage, comment_system, sharing_links, notification_digest]
```

This object is the seed for the planning grid. Nothing in the grid activates without it.

---

## Why the cooling period matters

A Threshold completed in 5 minutes is not crystallized — it's rushed. The satisfaction point fires when the form looks complete, not when the intent is actually clear.

The cooling period (one session between Threshold and ratification) exists because:
- The developer needs to sit with their answers and find the gaps
- OPUS-2 needs to challenge the success signal ("can you actually verify that in 30 days?")
- The routing decision needs to be checked against existing CSPS capabilities

**A Threshold that hasn't been challenged is a draft, not a crystallized intent.**

---

## Ratification signal

The Threshold reaches RATIFIED status when:
1. Governor has reviewed all four questions
2. Governor has explicitly stated "ratified" (not just "proceed" or "looks good")
3. The `user_journey_test` is specific enough to be executable
4. The routing decision is confirmed by checking what already exists

Until RATIFIED: no planning grid activates. No nodes reach SPECIFYING. No code is written.
