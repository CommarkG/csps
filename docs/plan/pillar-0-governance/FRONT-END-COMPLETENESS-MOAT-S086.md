---
id: csps.governance.front-end-completeness-moat-S086
name: FRONT-END-COMPLETENESS-MOAT-S086
description: >
  CORE SEED + MOAT (Governor S086, emphatic — "platform standard"). Every CSPS-created page is FUNCTIONALLY
  COMPLETE: every interactive element (button, link, tab, form field, toggle, dropdown, handler, data-fetch,
  toolkit/widget) is wired AND works, verified BY CODE — no lazy "looks done" assumptions. A page with one dead
  element = INCOMPLETE = blocked. This is a MOAT: other platforms ship partial/broken UIs and users waste hours;
  CSPS pages are complete-by-construction. Applies to EVERY way CSPS creates pages — users, developers, internal.
  Opus authors the standard; Sonnet/Haiku build the validation machine.
version: "1.0"
session: S086
owner: group:finky
authored_by: OPUS-25
core_spine: VALD
diataxis_type: reference
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: architecture-pending
vault_pending:
  vlt: VLT-S086-FRONTEND-COMPLETENESS
  retrieve_when: "Sonnet builds validate-page-completeness.mjs (the validation machine) + the creation-gate + page-template enforcement"
precedent_checked: true
links:
  - { rel: izfc, href: ../../../packages/principles/principles/P-META-006-zero-findings-discipline.yaml }
  - { rel: page-dna, href: ../../../tools/validators/validate-page-dna.mjs }
  - { rel: moat-registry, href: moat-registry.md }
---

# Front-End Functional Completeness — Platform Standard + MOAT (S086)

## 0. THE MOAT (why this is load-bearing)
Most platforms ship pages where buttons do nothing, links 404, tabs are empty, fetches hang. The user discovers
the rot by hand, one dead element at a time — hours wasted, trust destroyed. **CSPS's moat: a page cannot ship
with a single non-functional element, because the platform verifies every element BY CODE before it's "done."**
Completeness is not a review step a human does — it is a mechanical gate. This is M-47 (register in moat-registry).

## 1. THE STANDARD (the contract)
A page is FUNCTIONALLY COMPLETE iff **every interactive element is enumerated from the code AND each one is
verified wired + working** — no element is assumed, skipped, or "looks done." One dead element ⇒ page INCOMPLETE
⇒ verify FAIL ⇒ cannot commit/deploy. "DONE = wired + called + verified" is applied PER ELEMENT, not per page.

## 2. ELEMENT TAXONOMY (what must be checked on every page — no lazy omission)
| Element | "Verified working" means (BY CODE) |
|---|---|
| **Button** | has an `onClick`/handler that is non-empty (not TODO/`console.log`-only); the handler's effect resolves (API 200 / state change / navigation) |
| **Link / `<a>` / `<Link>`** | `href`/route RESOLVES to an existing page or a 200 URL — no 404, no `#` dead-link |
| **Tab** | selecting it renders real content (no empty/placeholder panel) |
| **Form field / input / select / toggle** | bound to state + its submit/change handler exists and acts |
| **Data fetch / API call** | the called `/api/*` route returns **200** (not 404/500/**hang**); loading state ALWAYS resolves (no infinite spinner — a timeout + error state required) |
| **Handler / function** | every declared handler is WIRED to an element (no orphan); every element that needs one HAS one (no dead element) |
| **Toolkit / widget / chart / table** | renders with real data + its interactive parts function |
| **Nav / breadcrumb / menu entry** | every entry points somewhere real |

## 3. NO LAZY ASSUMPTIONS (the verification method)
1. **ENUMERATE by code** — static-parse the page/TSX (AST or robust regex) to list EVERY element above. The list is
   evidence; "I reviewed it" is not.
2. **VERIFY each** — for static-checkable ones (link targets, orphan handlers, empty onClick, unbound inputs):
   static analysis. For runtime ones (fetch returns 200, no infinite loading, tab renders): a **runtime smoke**
   against a booted dev server (or a deployed preview) — assert the real response, not the intent.
3. **COUNT + cite** — output: per page, `{elements_found, verified, dead[]}`. A non-empty `dead[]` = FAIL with the
   exact element + file:line. This IS an IZFC sweep at the element level.

## 4. CONNECT TO THE COMPLETION STACK (reuse, don't fork)
- **IZFC / RZF (P-META-006):** page-completeness is an IZFC dimension — sweep every element from independent angles
  (static + runtime); the count is measurement; a "looks done" page is the satisfaction-point trap this kills.
- **Satisfaction points:** "the page renders so it's done" is the canonical satisfaction-point; the machine forces
  per-element evidence instead.
- **DONE = wired + called + verified:** applied per element.
- **Dual-coverage (SEED-C):** the page-completeness audit must be context-independent (runs on cadence + the gate).

## 5. HARDWIRE — applies to ALL page-creation paths (users + developers + internal)
The standard is enforced at the **page-CREATION boundary**, so EVERY page inherits it however it's made:
- **T1 creation-gate:** a new page commit requires an ELEMENT MANIFEST (declared interactive elements + their
  wiring intent) — `pre-tool-use` gate on new `page.tsx`.
- **T2 validator `validate-page-completeness.mjs` (EXTENDED):** the validation machine of §2-§3, in `verify` +
  audit-runner. A dead element = verify FAIL. Block-test: a deliberately-broken page makes verify FAIL.
- **T3 / DNA:** the page TEMPLATE/scaffold (and the journey page-creation phase, and any user/dev page generator)
  embeds the manifest + the standard — so a page CANNOT be scaffolded without the completeness contract. AGENTS.md
  hard-NO ("no page ships with a dead element"). Principle/B_FRONT_END_COMPLETENESS + moat M-47.
- **Journey:** "create a page" is a journey; its P4/validate gate runs the machine; its P5 won't activate a page
  with dead elements.

## 6. DONE (for the build)
validate-page-completeness enumerates every element per platform page + runtime-smokes each fetch/route + BLOCKS
on any dead element (block-test proves it) · in verify + audit-runner · the page scaffold/template enforces the
manifest so all creation paths inherit it · M-47 registered · verify=0. The classification-training page (the
inaugural failure) is the first page brought to 100% under the machine.

## ZF gate (this seed)
- Cycle 1: standard + full element taxonomy + verification method (enumerate→verify→count) + completion-stack
  wiring + 3-direction hardwire + all-creation-paths coverage + DONE. No floating ref.
- Cycle 2 (fresh angle — universality): the hardwire is at the CREATION boundary (template/scaffold/gate), so
  user-built, dev-built, and internally-built pages all inherit it — no page-creation path escapes. Coherent.
