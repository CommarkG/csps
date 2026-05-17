---
id: csps.pillar4.developer-journey.iteration
name: developer-iteration
description: "Stage 8 — Iteration and growth. User feedback → new intent → Threshold again. The cycle that never ends. How to grow without breaking what works."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: OPER
diataxis_type: reference
session: S039
pe_score: 20
links:
  - { rel: parent, href: ./README.md }
tags:
  - domain:dx
  - domain:ops
  - type:reference
  - audience:developer
  - maturity:draft
scope_level: S1
---

# Stage 8 — Iteration and Growth

**PE score: 20** — Low urgency (not needed until the app is live), high importance (getting this wrong destroys what works).

---

## The iteration loop

Every iteration starts at the Threshold. Not at "let's add this feature." At the Threshold.

```
User feedback received
    ↓
Threshold: "What specific problem is this feedback revealing?"
    ↓
Planning Grid: which nodes need to change?
    ↓
Delta ratification: only changed nodes go through ratification
    ↓
Implementation: against the ratified delta
    ↓
User_journey_test for the new behavior
    ↓
Deployment
    ↓
User feedback received (next cycle)
```

Skipping the Threshold on iterations is how "quick fixes" become technical debt. The feature that was "just a small change" that broke three other things is always a change that skipped intent crystallization.

---

## What grows vs what stays fixed

**What grows (app-specific, iterates with user feedback):**
- The data model (add fields, add models, add state machine states)
- The API surface (add endpoints, add filters, add aggregations)
- The UI (add pages, add forms, add visualizations)
- The business logic (add rules, add calculations, add workflows)

**What stays fixed (platform primitives, never app-specific):**
- Auth and multi-tenancy (Clerk + ZenStack)
- Security headers
- Rate limiting
- Error patterns (captureException, createError)
- Deployment pipeline

If a "growth decision" requires changing a platform primitive: that's a platform-level change, not an app-level change. It goes through OPUS-2 and a ratified platform principle update — not a quick feature PR.

---

## The extraction signal

As an app grows, some patterns repeat. The same kind of query appears in 3 different API routes. The same validation runs on 4 different forms. The same UI component is copied twice.

When a pattern repeats 3 times (K=3 in CSPS language): extract it to libs/.

**The extraction process:**
1. Identify the repeating pattern
2. Write the generic version in `libs/integrations/` or `libs/components/`
3. Update all 3+ callers to use the extracted version
4. Verify with `validate-wiring-completeness.mjs` that the extracted symbol is WIRED
5. Delete the duplicates

**The extraction test:** After extraction, delete the app. The extracted lib still exists. The pattern is permanent. The app was ephemeral.

---

## The graduation signal

An app is ready to graduate from CSPS (become a standalone product) when:
1. It has paying users who would notice if it disappeared
2. Its domain libs have been extracted (the core is in libs/, not apps/)
3. The team for it is independent enough to manage its own deployment
4. Its data model is stable (not changing every sprint)

Graduation means: the app gets its own repository, its own Vercel project, its own team. It still uses CSPS libs as packages (via npm). But it's no longer part of the monorepo.

Graduation is a business decision, not a technical one. The technical readiness signals are listed above. The business decision is the Governor's.

---

## What gets harder as the app grows

**The things that compound badly if not handled early:**

**Tenant isolation slippage:** As the data model grows, new models are added without reviewing @@allow policies. This is the most dangerous growth failure. Every new model needs RLS review on addition, not after.

**Orphaned endpoints:** As requirements change, API endpoints that no longer serve any UI remain in the codebase. They represent security surface area with no UI coverage. `validate-wiring-completeness.mjs` catches these — run it before every release.

**State machine drift:** Business logic grows informally. The documented state machine diverges from the actual transitions. Fix this by treating the documented state machine as the spec and the code as the implementation — when they diverge, the code is wrong, not the spec.

**User journey abandonment:** Metrics show users starting workflows but not finishing them. The symptom is incomplete user_journey_tests — steps that weren't specified become steps that users get stuck on. When abandonment is discovered, trace back to the PI item's user_journey_test and find which step is missing.
