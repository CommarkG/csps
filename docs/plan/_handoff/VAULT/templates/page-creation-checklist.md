---
id: csps.handoff.vault.templates.page-creation-checklist
name: page-creation-checklist
description: "Mandatory checklist for every new page or component. Fill BEFORE writing code. Ensures every interactive element is connected, every form submits, every button acts."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: vault_files
diataxis_type: reference
session: S039
tags:
  - domain:architecture
  - domain:ui
  - type:template
  - audience:developer
  - maturity:stable
links:
  - { rel: parent, href: ./README.md }
  - { rel: validator, href: ../../../../tools/validators/validate-ui-completeness.mjs }
  - { rel: principle, href: ../../../../packages/principles/principles/P-ARCH-031-completion-seal.yaml }
---

# Page Creation Checklist

> **Fill this BEFORE writing a single line of JSX.**
> Every interactive element must have a real destination before the page exists.
> A page with placeholder buttons is not a page — it's a wireframe.

---

## Step 1 — UI Manifest (declare every interactive element)

```
Page route: /[route-here]
Page type: server-component | client-component

BUTTONS:
  □ [Button label] → [action: what happens when clicked]
    Handler: [function name in this file]
    API call: [POST/GET/PATCH/DELETE /api/route]
    API route exists: YES | NO (create it first if NO)

FORMS:
  □ [Form name] → [what it submits]
    Fields: [field1: type, field2: type, ...]
    Validation schema: [Zod schema name or "inline"]
    Submit to: [API endpoint]
    On success: [what happens — redirect? toast? state update?]
    On error: [where is the error shown?]

LINKS/NAVIGATION:
  □ [Link text] → [/route]
    Route exists: YES | NO (create it first if NO)

DATA FETCHED:
  □ [Data name] from [API route or server query]
    Refresh on: [event that should trigger re-fetch]
    Loading state: [what shows while loading]
    Empty state: [what shows when no data]
    Error state: [what shows on fetch failure]
```

---

## Step 2 — Connectivity Verification

Before writing JSX, verify each of the above:

- [ ] Every button has a named handler function (not `() => {}`)
- [ ] Every form has an `onSubmit` that calls a real API route
- [ ] Every link points to a route that exists (or is being created in this PR)
- [ ] Every API call has an existing route handler (`apps/*/src/app/api/*/route.ts`)
- [ ] Every data source has been fetched and its type is defined
- [ ] Loading, empty, and error states are specified (not TODO)

---

## Step 3 — Done Criterion

Fill this BEFORE writing code. This is the P-ARCH-031 DONE criterion for UI:

```
DONE when:
  □ validate-ui-completeness.mjs shows 0 advisories for this file
  □ All buttons visibly respond (no empty handlers in DevTools)
  □ Form submits reach the API route and return a response
  □ Navigation links resolve to real pages (no 404)
  □ Loading/empty/error states render correctly
```

---

## Step 4 — Implementation Order (Rule 8: Register → Implement → Wire → Verify)

1. **Create API routes first** — if any button calls `/api/X`, create that route before the page
2. **Create Zod schemas** — define request/response types before the form
3. **Write the page** — with all handlers connected, all routes wired
4. **Test interactively** — click every button, submit every form, follow every link
5. **Run validator** — `node tools/validators/validate-ui-completeness.mjs` → 0 advisories

---

## Anti-patterns (caught by validate-ui-completeness.mjs)

| Pattern | What the validator catches | Fix |
|---|---|---|
| `onClick={() => {}}` | Empty click handler | Connect to real action |
| `href="#"` | Dead link | Use real route |
| `<form>` without `onSubmit` | Unsubmittable form | Add `onSubmit` handler |
| `// TODO:` in JSX | Placeholder UI | Implement before shipping |
| `fetch('/api/X')` with no route | Missing API | Create route first |

---

*validate-ui-completeness.mjs LIVE — scans new page files on every commit*
*P-ARCH-031 applies to UI: a page without working interactions is not done*
