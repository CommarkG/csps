---
id: csps.pillar-0-governance.behavioral-contracts.B_UX
name: B_UX
description: "Frontend UX behavioral contracts for CSPS Tier 2 (playground + apps). Four contracts: Guard Questions, Journey Continuity, Accessible Loading, Error Recovery. Definitions only — validators and hooks planned for S056+."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: behavioral_contracts
session: S055
inherits_from: "Platform Genome §1 AI Conception Vault — §TIER-CONSOLIDATION §2 Tier 2 Core"
enforcement_tier:
  T1: pending (no hook yet — S056 target)
  T2: pending (no validator yet — S056 target)
  T3: session-open injection (via AGENTS.md Hard NO section)
context_question: "Before shipping any Tier 2 page: does it pass all four UX contracts — guard questions present, context not lost on navigation, loading states accessible, error states recoverable?"
governing_intent: "Every Tier 2 page must earn the user's trust on first interaction. Trust = predictable responses, no lost context, accessible states, recoverable errors. A UI that fails any of these four conditions breaks the contract with the user, not just a design guideline."
tags: [frontend, ux, tier-2, contracts, s055, behavioral]
---

# B_UX — Frontend UX Contracts (Tier 2)

> Definitions only. No validators or hooks in this version (S055).
> These four contracts apply to every page in `apps/csps-playground/` and any CSPS Tier 2 app.
> Counterweight: these are BEHAVIORAL contracts, not design specs — they define observable outcomes, not visual implementation details.

---

## B_UX_GUARD_QUESTIONS

**Contract:** Every form action (submit, delete, publish, irreversible state change) has a verification step visible to the user BEFORE the action executes. The user must see what will happen and confirm it.

**Governing intent:** A user who submits confidently is not the same as a user who submitted accidentally. The verification step is the structural difference. Without it, UI is responsive but not trustworthy.

**Positive form:**
- Submit button shows what will happen: "Save draft" not "OK"
- Destructive actions show a confirmation state with the consequence named explicitly: "Delete 'Report Q1' — this cannot be undone"
- Multi-step forms show current position and next step before advancing

**Anti-patterns:**
- Generic "Are you sure?" without naming what will be affected
- Submit fires on first click with no confirmation for destructive actions
- Silent state changes (loading spinner starts, user doesn't know what changed)

**enforcement_tier:** T3 (session-open + AGENTS.md) | T2 pending validate-ux-guard-questions.mjs (S056)
**core_spine:** AI
**inherits_from:** Platform Genome §1 + TIER-CONSOLIDATION §2

---

## B_UX_JOURNEY_CONTINUITY

**Contract:** Navigation within a page flow never loses user context. If the user enters data, that data survives: browser back, tab switch, route change within the same flow, and accidental navigation are all recoverable.

**Governing intent:** Users build context and intent as they interact. Navigation that destroys that context destroys trust. A user who loses a form because they clicked Back is a user who won't fill it again.

**Positive form:**
- Form data persists across route changes within the same wizard or multi-step flow
- "Back" within a flow restores previous state, not a blank form
- Deep-linkable URL state: if the user shares the URL at any point in the flow, the recipient sees the same state

**Anti-patterns:**
- Multi-step form loses all data when user clicks browser Back
- Tab switch clears a text area that was partially filled
- Route change within the same app triggers a full page reload losing scroll position

**enforcement_tier:** T3 (session-open + AGENTS.md) | T2 pending validate-ux-journey-continuity.mjs (S056)
**core_spine:** AI
**inherits_from:** Platform Genome §1 + TIER-CONSOLIDATION §2

---

## B_UX_ACCESSIBLE_LOADING

**Contract:** Every loading state has: (1) a visible indicator, (2) an accessible text alternative (aria-label or sr-only text), and (3) a timeout boundary — if loading exceeds 10 seconds, the user sees an explanation and a recovery path, not an indefinite spinner.

**Governing intent:** A loading spinner is visible. Its meaning is not. Screen reader users, users on slow connections, and users who walked away for 30 seconds need to know what is loading, for how long, and what to do if it doesn't load.

**Positive form:**
- Spinner includes `aria-label="Loading tasks..."` or equivalent
- Long loading (>3s) shows "Still working..." text alongside the spinner
- Timeout (>10s) shows "This is taking longer than expected. [Retry] [Contact support]"

**Anti-patterns:**
- Bare `<div className="spinner" />` with no aria attributes
- Loading state that never resolves without user feedback
- Disabling all interaction during load without explanation

**enforcement_tier:** T3 (session-open + AGENTS.md) | T2 pending validate-ux-accessible-loading.mjs (S056)
**core_spine:** AI
**inherits_from:** Platform Genome §1 + TIER-CONSOLIDATION §2

---

## B_UX_ERROR_RECOVERY

**Contract:** Every error state shows: (1) what went wrong in plain language (not a status code), (2) whether this is the user's fault or the system's fault, (3) a specific recovery path. Silent failures, generic "Something went wrong", and dead-end error states violate this contract.

**Governing intent:** An error that leaves the user confused is worse than no error message at all. The error state is the moment of maximum user frustration — it is also the moment of maximum trust opportunity. A clear error with a recovery path converts a frustrated user into a trusting one.

**Positive form:**
- "Could not save — your session may have expired. [Sign in again]" (user-actionable, blame attributed)
- "The server returned an error. Your data was not lost — [Try again] or [Save a copy]" (system fault, recovery options)
- Validation errors appear inline next to the field that failed, not at the top of a long form

**Anti-patterns:**
- `console.error(e)` without any user-visible error state
- Toast notification that disappears before the user reads it, with no way to see it again
- Error page with no navigation back to a known-good state
- Status codes visible to users: "Error 422 Unprocessable Entity"

**enforcement_tier:** T3 (session-open + AGENTS.md) | T2 pending validate-ux-error-recovery.mjs (S056)
**core_spine:** AI
**inherits_from:** Platform Genome §1 + TIER-CONSOLIDATION §2
