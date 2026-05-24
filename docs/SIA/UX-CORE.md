---
id: SIA.UX-CORE
name: UX-CORE
description: "L1 sealed UX principles — universal across all audiences, all pages, all app types. Every UX sub-file (UX-DEVELOPER.md, UX-APP-USER.md, etc.) inherits from this. Nothing here can be overridden — only extended."
type: architecture
protection_level: sacred
status: ratified
core_spines: [AI, ARCH, OPER]
core_spine: AI
schema_anchor: vault_files
version: "1.0"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Does this UX decision inherit from a principle here? If it contradicts a principle here — it is wrong."
context_quote: "A page without purpose answers what it is, not what the user does."
inherits_from: "Platform Genome §1 Behavioral Contracts + UX-UI-STANDARDS.md"
links:
  - { rel: role-schema, href: ../plan/pillar-0-governance/USER-ROLE-SCHEMA.md }
  - { rel: ux-ui-standards, href: UX-UI-STANDARDS.md }
  - { rel: voice-profiles, href: VOICE-PROFILE-SYSTEM.md }
  - { rel: ux-developer, href: UX-DEVELOPER.md }
  - { rel: ux-app-user, href: UX-APP-USER.md }
---

# UX Core — L1 Universal Principles

> SEALED. These principles apply to every page, every component, every audience.
> Sub-files (L2, L3) may add audience-specific rules but CANNOT contradict these.
> Ratified: Opus-8 | Governor: Yariv Fink | S059

---

## The 3 Fundamental Laws

### Law 1 — Context Before Content
Every page answers WHY before showing WHAT.
The user must understand the page's purpose before processing any data.
Implementation: title + one-sentence description + options panel ABOVE any data display.

### Law 2 — Progressive Disclosure by Default
Start with the minimum the user needs to take ONE action.
Everything else collapses — available on demand, never forced.
Implementation: 1 primary CTA + "more options ▸" link, not all options expanded.

### Law 3 — Clarity Over Completeness
A page that shows 3 things clearly outperforms a page that shows 10 things accurately.
Choose: what does this user need to DO? Show that. Hide the rest.
Implementation: every item on the page must earn its place. If removing it doesn't change the user's ability to act — remove it.

---

## The 8 Mandatory Page Elements (PageContext standard)

Every page must answer all 8 before shipping:

1. **Identity:** Title — plain language, 5 words max. Not the system name. What the user does here.
2. **Position:** Where am I in the flow? Pipeline position or breadcrumb.
3. **Status:** What is the current state? One color (green/amber/red) communicates this.
4. **Purpose:** Why am I here? One sentence. User-facing plain language, no jargon.
5. **Options:** What can I do? 2-4 labeled options, collapsed by default beyond the first.
6. **Primary CTA:** What should I do NOW? Bold, accent color, above the fold.
7. **Next Step:** Where do I go after? One link at the bottom.
8. **Help:** Where can I learn more? "?" icon on every section, opens help panel in one click.

Scoring: 8/8 = shippable. ≤6/8 = not ready.

---

## The 5 Cognitive Load Rules

### CL-1: Maximum 3 expanded options
More than 3 visible options = cognitive overload. Use "Show more ▸" for 4+.

### CL-2: Collapsed > Expanded for secondary information
Technical details, evidence, source files, session names — always collapsed by default.
Plain language first, technical details on demand.

### CL-3: One primary action per screen
Never show two equally-prominent CTAs. One is primary (accent color). Others are secondary (ghost style).

### CL-4: Related content is colocated
Help for a field is directly below that field. Source documentation is next to the thing it documents. Never "see above" or "refer to section X."

### CL-5: Jargon = failed clarity
If the user needs to know your internal system terminology to use the page — the page has failed. Every system term must be translatable to plain language. Test: could a non-technical person understand this without asking?

---

## Mandatory Elements Per Page

| Element | Required? | When missing |
|---|---|---|
| Title (plain language) | Always | NOT SHIPPABLE |
| Help icon (?) | Every section | Advisory — must be added |
| Related Pages section | Every page | Advisory — must be added |
| Voice profile declaration | Every form/wizard | BLOCKED by Loop 2 hook |
| pageDNA with purpose field | Every page | BLOCKED by Loop 1 hook |
| Primary CTA (accent color) | Every page | Advisory — must be added |
| Progressive disclosure | Every page with >3 options | Advisory |

---

## RTL/LTR Layout Rules

**English (LTR):**
- Navigation: left side or top
- Primary CTAs: right-aligned or centered
- Status chips: top-right
- Next step: bottom-right

**Hebrew / Arabic / RTL languages:**
- Navigation: right side or top (mirrored)
- Primary CTAs: left-aligned or centered
- Status chips: top-left
- Next step: bottom-left

Implementation: CSS `dir="rtl"` + `[dir="rtl"]` selector overrides in UI-RTL.md (L2 sub-file).
The theme sets direction at the app level — components inherit automatically.

---

## The UX Mini-Tree Architecture

```
UX-CORE.md (this file — L1 SEALED)
├── UX-DEVELOPER.md        ← L2: Governor + Core/Contributing Developers
├── UX-APP-USER.md         ← L2: Account Owner through Guest
│   ├── UX-ONBOARDING.md   ← L3: first-time user flows
│   ├── UX-DASHBOARD.md    ← L3: returning user experience
│   └── UX-MOBILE.md       ← L3: mobile-specific patterns
└── UX-PLATFORM.md         ← L2: internal platform tooling (PDI, completion, audit)
```

Every L2 file MUST:
- Declare `inherits_from: UX-CORE.md`
- List which L1 principles it extends (never contradicts)
- Add audience-specific rules only

Every L3 file MUST:
- Declare `inherits_from: [parent L2 file]`
- Focus on one specific pattern (onboarding, dashboard, mobile)

---

## The CSPS UX Slogan

**"80% prevention during creation."**

Tabs are functional or they don't exist.
Help is available or the feature isn't shipped.
The primary action is obvious or the design isn't done.
Prevention happens in the design spec — not in the post-launch audit.

---

*UX Core v1.0 | SEALED | S059 | Opus-8*
*To change a principle here: requires Governor ratification + new version.*
