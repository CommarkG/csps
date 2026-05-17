---
id: csps.pillar4.developer-journey.feature-development
name: developer-feature-development
description: "Stage 5 — Feature development under the planning protocol. Every feature traced to a ratified PI item with user_journey_test. No code without ratification."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
diataxis_type: how-to
session: S039
pe_score: 64
links:
  - { rel: parent, href: ./README.md }
  - { rel: page-creation-checklist, href: ../../../_handoff/VAULT/templates/page-creation-checklist.md }
  - { rel: creation-completeness, href: ../../../../tools/validators/validate-creation-completeness.mjs }
tags:
  - domain:dx
  - domain:architecture
  - type:how-to
  - audience:developer
  - maturity:draft
scope_level: S1
---

# Stage 5 — Feature Development

**PE score: 64** — Must get this right. The satisfaction point fires here. The protocol prevents it.

---

## The planning protocol in practice

Every feature is a PI item. Every PI item must be ratified before implementation begins.

The sequence is always: **REGISTER → IMPLEMENT → WIRE → VERIFY**

Never implement without registering. Never declare done without verifying wiring.

---

## Creating a PI item

```bash
pnpm create:pi --title "Add transaction form" --spine ARCH --pe 75
# Creates: docs/plan/_handoff/VAULT/plan-items/PI-NNN-add-transaction-form.yaml
```

The PI item must contain before ratification:

```yaml
user_journey_test: |
  Given: User is on the dashboard with no transactions
  When: User clicks "Add Transaction"
  Then: A form appears with amount, category, note fields
  And: User fills and submits
  And: Balance updates to reflect the new transaction
  And: Transaction appears in the recent transactions list
  Success signal: User can see their transaction 5 seconds after submitting

ep_err_pre_check:
  - pattern: done-equals-committed
    applicable: true
    mitigation: validate-wiring-completeness.mjs must show form component WIRED
  - pattern: context-fades-mid-session
    applicable: true
    mitigation: all UI states (loading/error/success) specified before coding

enforcement_trio:
  tier1_hook: post-stop-rzf-reminder.sh
  tier2_validator: validate-ui-completeness.mjs
  tier3_session: "Add Transaction form — all states (loading/error/success) must be visible"
  permanence: medium
```

Only the Governor can set `ratified_at`. Not Sonnet. Not OPUS-2. The Governor.

---

## The feature development sequence

**Before writing a single line of code:**
1. PI item created and ratified ✓
2. API route exists or is being created in same PR ✓
3. UI manifest written (every button/form/link declared with its destination) ✓
4. Loading, empty, error states specified ✓

**While writing code:**
Every interactive element connects to a real handler the moment it's written. No `onClick={() => {}}`. No `href="#"`. If the handler doesn't exist yet, create it first, then add the button.

**API routes (create first):**
```typescript
// apps/[name]/src/app/api/transactions/route.ts
// POST → creates transaction, returns updated balance
// GET → returns recent transactions for tenantId
```

The API route is the contract. Write it before the UI that calls it.

**UI pages (create second):**
Fill the page creation checklist first. Declare every interactive element. Then write the JSX that implements the declaration.

```
UI Manifest:
  Button: "Add Transaction" → opens form modal
    API call: POST /api/transactions
    On success: close modal, show success toast, update balance display
    On error: show inline error, form stays open
  
  Form: TransactionForm
    Fields: amount (number, required), category (select from existing), note (text, optional)
    Submit to: POST /api/transactions
    Validation: amount > 0, category must be selected
```

**Wire (connect everything):**
After writing, verify connections:
- Form submits to a real API route that exists and returns a valid response
- API route reads/writes real database models
- Success state shows correct data
- Error state shows actionable message

---

## The done criterion is the user_journey_test

A feature is DONE when a developer can walk through the `user_journey_test` step by step and every step produces the described result.

Not when `pnpm verify` passes. Not when there are no TypeScript errors. Not when "it looks right."

When the user_journey_test can be executed and every observable outcome matches the specification.

If Sonnet is implementing, the implementation turn must end with: "I executed the user_journey_test. Here is what I observed at each step: [evidence]." Evidence is the proof. Declaration is not.

---

## Feature artifact types and their specific requirements

**Pages:**
- Every interactive element has a real handler
- Loading state renders within 100ms
- Empty state tells user what to do (not just "Nothing here")
- Error state is actionable ("Something went wrong" is not actionable)

**Forms:**
- Client-side validation runs before submit (user doesn't wait for a server round-trip to learn their email is invalid)
- Server-side validation protects the API (client validation is not security)
- Duplicate submission is prevented (disable button after first submit)
- Success is confirmed before redirect (don't redirect if the API returned an error)

**Data displays (tables, lists, charts):**
- Paginated or limited (no unbounded queries)
- Sortable on the dimensions users actually care about
- Filterable when the dataset exceeds what fits on screen
- Exportable if users need to take the data somewhere else

**Modals and drawers:**
- Close on Escape key
- Focusable (keyboard navigation works)
- Scrollable if content exceeds viewport
- Loading state within the modal (not a full page reload)

**Navigation:**
- Every nav item goes somewhere real
- Active state shows current page
- Breadcrumbs for nested views
- Back button works as expected
