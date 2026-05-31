---
id: SIA.UX-PATTERNS-RESEARCH
name: UX-PATTERNS-RESEARCH
description: "SUPERSEDED S072 — content promoted to sealed L2 files. Page types → UX-PAGE-TYPES.md. Developer/user separation → UX-ROLES.md. This file is kept for historical reference. DO NOT USE as authoritative source."
type: architecture
protection_level: protected
status: superseded
superseded_by: "UX-PAGE-TYPES.md + UX-ROLES.md (S072, PROTO-S072-UX-WIRE M2)"
superseded_at: "2026-05-31"
core_spines: [AI, ARCH, OPER]
core_spine: AI
schema_anchor: vault_files
version: "0.1"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: deprecated
next_review_at: "2026-12-01"
diataxis_type: reference
context_question: "Which page type is this component serving? Is it following the correct pattern for that type (landing/dashboard/wizard/form/catalogue/blog/admin)? Are developer and user interfaces clearly separated?"
context_quote: "A page without a type is a page without a job."
inherits_from: "docs/SIA/UX-CORE.md (L1 sealed) + docs/SIA/UI-CORE.md (L1 sealed)"
links:
  - { rel: ux-core, href: UX-CORE.md }
  - { rel: ui-core, href: UI-CORE.md }
  - { rel: ux-ui-standards, href: UX-UI-STANDARDS.md }
  - { rel: design-tokens, href: ../../tools/config/design-tokens.yaml }
  - { rel: voice-profiles, href: VOICE-PROFILE-SYSTEM.md }
awaiting_ratification: true
ratification_questions:
  - "Build UX-PAGE-TYPES.md + UX-DEVELOPER.md as sealed L2 sub-files NOW, or defer to after first app wet trial?"
  - "Should UX-RESPONSIVE.md be its own file or a section in UX-PAGE-TYPES.md?"
  - "Developer vs. User interface separation: should it be UX-DEVELOPER.md + UX-APP-USER.md (per UX-CORE L2 tree) or a single UX-ROLES.md?"
---

# UX/UI Patterns Research
## For Opus Review — Governor Request S059

> DRAFT — not ratified. Governor asked: "do a deep research and find the best UX/UI principles, tips, checklists, validations, templates, proven patterns."
> Compiled by Sonnet S059. Awaiting Opus decision on scope before building.

---

## Part 1 — What CSPS Already Has (avoid duplication)

| Document | Content | Status |
|---|---|---|
| [UX-CORE.md](UX-CORE.md) | 3 laws, 8 mandatory page elements, 5 cognitive load rules, RTL/LTR | ✅ SEALED L1 |
| [UI-CORE.md](UI-CORE.md) | 3 visual laws, typography, spacing, button hierarchy, form anatomy | ✅ SEALED L1 |
| [UX-UI-STANDARDS.md](UX-UI-STANDARDS.md) | 7 rules, pre-ship checklist, S059 learning elements | ✅ ACTIVE |
| [UX-PREVENTION-ARCHITECTURE.md](UX-PREVENTION-ARCHITECTURE.md) | 7 prevention loops (T1 hooks) | ✅ RATIFIED |
| [VOICE-PROFILE-SYSTEM.md](VOICE-PROFILE-SYSTEM.md) | Form language per profile (colleague/professional/mentor) | ✅ RATIFIED |
| [design-tokens.yaml](../../tools/config/design-tokens.yaml) | Color, spacing, typography, radius tokens | ✅ ACTIVE |
| [PageContext.tsx](../../apps/csps-playground/src/components/PageContext.tsx) | 8-question page standard | ✅ BUILT |
| [RelatedPages.tsx](../../apps/csps-playground/src/components/RelatedPages.tsx) | Navigation between pages | ✅ BUILT |

**Gap:** No page-type-specific patterns (landing vs. dashboard vs. wizard vs. form), no explicit responsiveness spec, no developer/user separation doc.

---

## Part 2 — Responsiveness Definition

### Breakpoints (mobile-first)

| Breakpoint | Value | Use case |
|---|---|---|
| Mobile S | 320px | Smallest Android, narrow screens |
| Mobile L | 480px | Most smartphones |
| Tablet | 768px | iPads, large phones landscape |
| Desktop | 1024px | Laptops, small monitors |
| Wide | 1440px | Full desktop monitors |
| Ultrawide | 1920px+ | Large monitors, TV |

### CSPS Responsiveness Rules

1. **Mobile-first design** — design for 320px first, expand up. Never shrink down.
2. **Content hierarchy is layout-independent** — the most important thing on mobile IS the most important thing on desktop.
3. **Touch targets minimum 44×44px** (WCAG) — no small buttons.
4. **No horizontal scroll** on any breakpoint.
5. **Single-column below 768px** — no 2-column grids on mobile.
6. **Navigation collapses to hamburger below 768px** — or persistent bottom nav for app-like experiences.

### Focus vs. Density by breakpoint

```
Mobile (320-768):  ONE primary action visible. Minimal cognitive load. No sidebar.
Tablet (768-1024): Content + light sidebar OR 2-column layout. Secondary nav accessible.
Desktop (1024+):   Full density allowed. Sidebar + main + detail pane (3-column for admin/dashboard).
```

---

## Part 3 — Page Type Patterns

### Pattern 1 — Landing Page

**Primary job:** Convert a visitor into a user in one visit.  
**Audience:** External users who don't know you yet.

| Element | Rule |
|---|---|
| Headline | Problem-focused, 7 words max, above fold |
| Sub-headline | Outcome-focused, what changes for the user |
| Social proof | 3 trusted names or 1 number (10,000 users, etc.) |
| Primary CTA | One button, action verb + benefit ("Start building free") |
| Navigation | Minimal or hidden — don't let them leave |
| Scroll behavior | Each section answers one objection |
| Exit | One last CTA at bottom (for scrollers) |

**Anti-patterns:** Multiple CTAs competing, navigation to unrelated pages, asking for too much info upfront, generic "Learn More" button.

**CSPS alignment:** B_PAGE_CONTEXT (Q6 — primary CTA visible above fold) + UX-CORE Law 1 (context before content).

---

### Pattern 2 — Dashboard

**Primary job:** Give the user situational awareness at a glance.  
**Audience:** Returning users who know the system.

| Element | Rule |
|---|---|
| Status summary | Top row: 3-5 numbers that matter RIGHT NOW |
| Primary action | Most urgent thing the user should do |
| Data tables | Sortable, filterable, paginated (never infinite on desktop) |
| Empty states | Explicit: "Nothing here — start by doing X" |
| Alerts | Top of page, dismissible, red/amber/green |
| Time context | Always show "last updated" for live data |

**Anti-patterns:** Data dump without hierarchy, no empty state, generic welcome message, alerts buried at bottom.

**CSPS alignment:** HealthBar + MetricBadge components + PageContext status chip + UX-CORE CL-1 (max 3 expanded options).

---

### Pattern 3 — Wizard / Multi-step Form

**Primary job:** Guide user through a complex task without losing them.  
**Audience:** User completing a one-time or infrequent task.

| Element | Rule |
|---|---|
| Progress indicator | Always visible — steps N/total, no surprises |
| One question per step | Never more than 3 fields per step |
| Previous button | Always available — users make mistakes |
| Save state | Auto-save or "Save draft" — never lose progress |
| Guard questions | One verification question per step |
| Completion | Explicit "you're done" state with next action |

**Anti-patterns:** No progress indicator, can't go back, session timeout without warning, unclear which fields are required.

**CSPS alignment:** WizardClient.tsx (voiceProfile + 7 sections) + GuardQuestionForm component + UX-CORE Law 2 (progressive disclosure).

---

### Pattern 4 — Form / Data Entry

**Primary job:** Collect structured input from the user.  
**Audience:** User performing a task (registration, checkout, config).

| Element | Rule |
|---|---|
| Labels | Above field, always visible (not inside field) |
| Placeholders | Example only, never instructions |
| Validation | Inline, immediate, specific ("Email must contain @") |
| Submit | One primary button, clear label ("Save" not "Submit") |
| Error recovery | Field-level errors, not page-level only |
| Voice profile | Colleague = friendly; Professional = formal; Mentor = exploratory |

**Anti-patterns:** Labels inside fields (disappear on focus), generic "Error" without explaining what, form reset on error.

**CSPS alignment:** VOICE-PROFILE-SYSTEM.md + UI-CORE Form UI Laws + pre-tool-use-voice-profile-gate.sh (T1 enforcement).

---

### Pattern 5 — Catalogue / Browse

**Primary job:** Let user find what they need from a large set.  
**Audience:** User exploring, not yet decided.

| Element | Rule |
|---|---|
| Search | Visible, prominent, instant results |
| Filters | Left sidebar (desktop) / sheet (mobile), always collapsible |
| Cards | Consistent size, one primary action per card |
| Sort | Default = most relevant, not alphabetical |
| Pagination | Numbered (not infinite scroll) for task-oriented browse |
| Empty result | Helpful: "No results for X — try Y instead" |

**Anti-patterns:** No search, filters buried, results with no images, infinite scroll when user needs to remember position.

**CSPS alignment:** CSPSDataTable component + UX-CORE CL-4 (related content colocated).

---

### Pattern 6 — Blog / Content

**Primary job:** Deliver information and establish trust.  
**Audience:** Reader who arrived from search or reference.

| Element | Rule |
|---|---|
| Title | Clear, specific, SEO-compatible |
| Reading time | "5 min read" — respect the user's time |
| Table of contents | For articles > 1000 words |
| Author + date | Trust signals — who and when |
| Related content | 3 links at bottom — keep the user |
| CTA | Soft: subscribe, share, explore more (not hard sell) |

**Anti-patterns:** No author, no date, intrusive popups mid-scroll, wall of text without headings.

---

### Pattern 7 — Design / Admin Page

**Primary job:** Let experienced users configure system state.  
**Audience:** Power users, developers, admins.

| Element | Rule |
|---|---|
| Density | HIGH — admins are experts, show all the information |
| Preview | Always show what the change will look like |
| Undo / cancel | Every destructive action has recovery path |
| Confirmation | "Are you sure?" for irreversible actions (with specific consequences) |
| Technical language | Allowed — admins know the system |
| Keyboard shortcuts | Supported — admins value speed |

**Anti-patterns:** No preview of changes, no undo, confirmation dialogs without naming what will happen.

**CSPS alignment:** VoiceProfilesClient.tsx (Fork/Deprecate/Delete with confirmation) + UX-CORE mandatory elements.

---

## Part 4 — Developer vs. User Interface Separation

### The Principle

One dataset. Two presentation layers. Never the same page for both.

```
Developer/Governor:
  - Can handle density (tables, JSON, technical status)
  - Understands system terminology
  - Needs precision over prettiness
  - Primary metric: efficiency
  
External User:
  - Needs clarity over completeness
  - Jargon forbidden
  - Emotional journey matters
  - Primary metric: confidence
```

### CSPS Implementation

| Interface | Location | Audience | Examples |
|---|---|---|---|
| Developer | `apps/csps-playground/` | Governor, Sonnet, contributors | Dashboard, completion page, audit tools |
| External User | `apps/[app-name]/` | Customers of individual apps | Debt Collection app UI, Voice Sorting UI |

### The Separation Rules

1. **Developer pages CAN:** show raw numbers, JSON state, validator output, error codes
2. **User pages CANNOT:** show raw numbers without context, system terminology, technical status codes
3. **Shared components** (PageContext, RelatedPages, HealthBar) are architecture-neutral — they inherit their language from the voice profile
4. **Never build one page that serves both** — if it feels like a compromise, it IS a compromise

### Developer Interface Patterns (UX-DEVELOPER.md scope)

- Pipeline status views (like developer-journey/page.tsx)
- Audit dashboards (like design-intelligence/page.tsx audit tab)
- Configuration pages (like voice-profiles CRUD)
- Completion tracking (like completion/page.tsx)

### User Interface Patterns (UX-APP-USER.md scope)

- Onboarding flows (guided, persona-aware)
- Feature landing pages (outcome-focused)
- Task completion flows (wizard pattern)
- Account management (settings, billing, profile)

---

## Part 5 — Validated Checklists

### Pre-Ship Checklist (per page)

```
IDENTITY (Q1):
  □ Title answers "what does the user DO here" (not system name)
  □ Title ≤ 5 words (plain language)

POSITION (Q2):
  □ Pipeline indicator or breadcrumb present
  □ User knows where they are in the flow

STATUS (Q3):
  □ One status chip (green/amber/red) — not both green AND amber
  □ Status message explains the state in plain language

PURPOSE (Q4):
  □ One sentence: why am I here? No jargon.
  □ If non-technical person can't understand it — rewrite it

OPTIONS (Q5):
  □ 2-4 options maximum visible
  □ Options use action verbs ("Start building", not "Option 1")

PRIMARY CTA (Q6):
  □ One button above the fold
  □ Accent color — visually dominant
  □ Label describes the OUTCOME ("Save my plan", not "Submit")

NEXT STEP (Q7):
  □ One link at page bottom
  □ Points to the logical next page

HELP (Q8):
  □ ? icon on every section header
  □ Tooltip opens inline (not new tab)
```

### Page-type specific additions

**For landing pages add:**
  - Social proof visible above fold?
  - Navigation links removed (distraction)?
  - CTA repeated at end of page?

**For dashboards add:**
  - "Last updated" timestamp shown?
  - Empty states handled (not blank)?
  - Alerts dismissible?

**For wizards add:**
  - "← Previous" button always available?
  - Progress indicator shown?
  - Draft save working?

**For forms add:**
  - Voice profile declared (`voiceProfile="colleague"`)?
  - Validation inline (not page-level)?
  - Labels above fields (not inside)?

---

## Part 6 — Ratification Questions for Opus

1. **Scope:** Build all 4 L2 files (UX-PAGE-TYPES, UX-DEVELOPER, UX-APP-USER, UX-RESPONSIVE) in one PROTO, or phase?

2. **Timing:** Build now (PROTO-UX-L2) or defer until after first app wet trial?

3. **Format:** Sealed L2 docs (like UX-CORE) or active living docs that evolve with each app?

4. **Validator:** Should there be a `validate-page-type-compliance.mjs` that checks pages against their declared type pattern? Or advisory-only during adoption?

5. **Developer/User separation:** Create `UX-DEVELOPER.md` + `UX-APP-USER.md` as separate files (matching UX-CORE mini-tree), or a single `UX-ROLES.md`?

---

*Compiled by Sonnet 4.6 | S059 | Governor request: "do a deep research and find the best UX UI"*  
*Status: DRAFT — awaiting Opus ratification*  
*Source: UX-CORE.md + UI-CORE.md + UX-UI-STANDARDS.md + general UX knowledge + CSPS pattern analysis*
