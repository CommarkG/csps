---
enforcement_trio:
  t1:
    tier: hook
    path: null
    status: none
  t2:
    tier: validator
    path: "tools/validators/validate-ux-audit.mjs"
    status: active
  t3:
    tier: memory
    path: "this contract in B_UX.md + AGENTS.md UX Colocation Gate"
    status: active
  exempt_reason: "T1 exempt — UX enforcement is judgment-based; no mechanical pre-tool-use gate covers all UX scenarios. T2 path corrected from missing validate-page-context-coverage.mjs to active validate-ux-audit.mjs (Q5 Opus ruling S062)."
---
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

---

## B_PAGE_CONTEXT

**Contract:** Every new or updated playground page answers 8 questions BEFORE showing any data. A page missing more than 3 of these 8 is not shippable.

**Governing intent:** Pages designed for engineers hide context behind data. The 8 questions ensure every page tells the user: who they are in the system, where they are in the flow, what state they're in, why they came here, what they can do, what they should do now, where next, and where to learn more. A page that only shows data is a dashboard. A page that answers all 8 questions is a tool.

**The 8 questions:**

| # | Question | Component field | Failure if missing |
|---|---|---|---|
| Q1 | What is this page? | `title` | User doesn't know where they are |
| Q2 | Where am I in the flow? | `pipeline` | User doesn't know what came before/after |
| Q3 | What is the current state? | `status` | User doesn't know if things are working |
| Q4 | Why am I here? | `purpose` | User doesn't know the page's job |
| Q5 | What can I do? | `options` | User doesn't know their choices |
| Q6 | What should I do NOW? | `options[recommended]` + `cta` | User doesn't know the primary action |
| Q7 | Where next? | `nextStep` | User gets stuck after completing the task |
| Q8 | Where to learn more? | `toolkit` | User can't get help without leaving the page |

**Positive form:**
- Every page has a `PageContext` component with title + purpose + at least 1 option
- The recommended option has a CTA button, not just a description
- The purpose sentence uses plain language — no acronyms or engineering terms
- Options are named by what the user wants, not by what the feature does

**Anti-patterns:**
- Page that starts with a table/form/list with no context about what it's for
- Status that says only "ACTIVE" without a message explaining what's active
- Options panel with only descriptions and no CTAs (user has to guess what to click)
- Purpose statement that uses internal terms the user hasn't seen yet

**Implementation:**
- Component: `apps/csps-playground/src/components/PageContext.tsx`
- Applied to: /platform/wizard, /platform/voice-profiles, /platform/developer-journey, /platform/completion (S059 PROTO-C)
- Extends: does NOT replace `PageHeader.tsx` — older pages keep PageHeader; new/updated pages use PageContext

**enforcement_tier:**
- T1: pending (hook at file creation — S060 target)
- T2: pending (validate-page-context-coverage.mjs — S060 target)
- T3: this contract in B_UX.md + AGENTS.md UX Colocation Gate
**core_spine:** AI
**inherits_from:** Platform Genome §1 + B_UX_GUARD_QUESTIONS + memory/feedback_ux_ui_discipline.md
**session:** S059 | Governor feedback: "pages built for engineers, not users"
