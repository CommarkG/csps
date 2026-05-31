---
id: SIA.UX-ROLES
name: UX-ROLES
description: "L2 sealed UX roles — one file with developer-role and app-user-role as variants. Defines the UX requirements that differ by who is using the interface. Inherits from UX-CORE.md L1. Supersedes the developer-vs-user separation section of UX-PATTERNS-RESEARCH.md. Ratified S072 per PROTO-S072-UX-WIRE."
type: architecture
protection_level: protected
status: ratified
ratified_by: "OPUS-15 (S072, PROTO-S072-UX-WIRE R5-c answer)"
ratified_at: "2026-05-31"
core_spine: AI
core_spines: [AI, ARCH, GVRN]
schema_anchor: vault_files
version: "1.0"
session: S072
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
inherits_from: "UX-CORE.md (L1 sealed) + communication-schema.yaml audience_hierarchy"
supersedes: "UX-PATTERNS-RESEARCH.md §developer-vs-user (S059 draft — now SUPERSEDED)"
context_question: "Who is using this interface — a developer building the platform, or an app-user using an app built on the platform? Does the UX match their context, vocabulary, and tolerance for complexity?"
links:
  - { rel: ux-core, href: UX-CORE.md }
  - { rel: comms-schema, href: ../../docs/plan/pillar-0-governance/communication-spine/communication-schema.yaml }
  - { rel: vocabulary, href: ../../docs/plan/pillar-0-governance/vocabulary.md }
  - { rel: ux-page-types, href: UX-PAGE-TYPES.md }
---

# UX Roles — L2 Sealed

> One file. Two role variants. Each variant defines what the shared UX substrate looks like when applied to that role's context.
> Ratified S072 | OPUS-15 | Closes S059 question (c): UX-ROLES.md as ONE file — YES.

---

## The Core Distinction

A **developer** builds the platform or apps ON the platform.
An **app-user** uses an app built on the platform to do a job.

These are not user personas — they are structural role classes. The UX substrate (UX-CORE.md Laws 1-3 + 8 Mandatory Elements) applies to BOTH. This file defines what CHANGES between roles, not what's the same.

---

## ROLE VARIANT A — Developer

### Context
Building CSPS platform core OR building an app on CSPS. Comfortable with technical concepts. Tolerates complexity. Has a goal (build, validate, deploy) — not browsing.

### Vocabulary (canonical per vocabulary.md)
Uses platform-internal terms: `tenant`, `validator`, `spine`, `RZF`, `OPIA`, `pnpm verify`, `frontmatter`, `core_spine:`.
Dev-specific: `git commit`, `session state`, `hook`, `threshold router`, `plan item`.

### UX characteristics (inherits core + adds)
- **Density preference:** compact. More information per screen is better than more screens.
- **Navigation:** keyboard-first. Tab between fields. Enter to submit. No reliance on mouse.
- **Feedback:** technical. Show exit codes, file paths, specific error messages — not "Something went wrong."
- **Trust:** high. Developers trust "this will do what it says." Fewer confirmations needed (except destructive actions).
- **Context retention:** high. Developer remembers last session state. No need to re-explain concepts on each page.
- **CTA language:** action verbs + technical specificity. "Run pnpm verify" not "Check status".
- **Failure messages:** actionable + specific. "validate-frontmatter.mjs exit_code=1: missing `impl_status`" not "Validation failed."

### Developer-specific page requirements (ADD to the 8 mandatory elements)
- [ ] **D1:** Current session context shown — session ID, last verify result, current mandate
- [ ] **D2:** Git state visible — uncommitted changes, unpushed commits count
- [ ] **D3:** Technical output accessible — command output, log lines available without leaving page
- [ ] **D4:** Keyboard shortcuts documented — `?` opens shortcut reference
- [ ] **D5:** Power path available — advanced options accessible without extra clicks

---

## ROLE VARIANT B — App User

### Context
Using an app built on CSPS to accomplish a real-world job. NOT building anything. May have no technical background. Their goal is task completion, not platform understanding.

### Vocabulary (canonical per vocabulary.md)
Uses user-facing terms per Dev↔User Glossary: `workspace` (not `tenant`), `permission level` (not `role`), `sign in` (not `auth`), `activity history` (not `audit_log`).
ZERO platform-internal terms in any user-facing string.

### UX characteristics (inherits core + adds)
- **Density preference:** spacious. Less is more. White space is clarity.
- **Navigation:** pointer-first. Tap targets minimum 44×44px. Clear labels on every control.
- **Feedback:** plain language. "Your changes were saved." "Please try again." Never error codes.
- **Trust:** earned. App-user is skeptical until the app proves itself. Every action needs clear consequence labeling.
- **Context retention:** low. App-user may return after days. State must be recoverable. Journey must restart cleanly.
- **CTA language:** outcome-focused. "Submit your request" not "POST /api/v1/requests".
- **Failure messages:** empathetic + recovery-oriented. "We couldn't save your changes. Please check your connection and try again. [Try again →]"

### App-user-specific page requirements (ADD to the 8 mandatory elements)
- [ ] **U1:** Progress persistence — form data survives browser back, tab switch, accidental navigation
- [ ] **U2:** Success celebration — task completion is visually rewarded (not just "Saved")
- [ ] **U3:** Undo available — every action reversible within the session
- [ ] **U4:** Vocabulary check — every word visible on screen passes the "could a non-engineer understand this?" test
- [ ] **U5:** Mobile-first — designed for phone first, then scaled up (not desktop-first and made responsive)

---

## The Separation Principle (applies everywhere)

> **Developer interfaces and app-user interfaces are NEVER mixed on the same page.**
>
> If a page must serve both: create two distinct modes with explicit switches. The modes have different vocabulary, different density, different CTAs. A page that tries to serve both simultaneously serves neither well.

**Applied to CSPS:**
- `/platform/` routes: developer-facing. Full platform vocabulary permitted.
- App routes (e.g., `/app/debt-collector/`): app-user-facing. Dev vocabulary prohibited.
- Governance tools (this playground): developer-facing with developer UX requirements.

---

*Ratified S072 | OPUS-15 | Closes S059 question (c): single UX-ROLES.md with variants — YES*
