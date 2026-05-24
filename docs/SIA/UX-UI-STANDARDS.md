---
id: SIA.UX-UI-STANDARDS
name: UX-UI-STANDARDS
description: "Professional UX/UI standards for all CSPS product interfaces. Research-based framework covering 5 use cases × UX rules + UI specifications. Every new page and component must pass these before shipping. Ratified S059."
type: architecture
protection_level: protected
status: ratified
core_spines: [AI, ARCH, OPER]
core_spine: AI
schema_anchor: vault_files
version: "1.0"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Which use case does this component fall into? Have all rules for that use case been checked? Is the pre-ship checklist passing?"
context_quote: "The difference between an engineer-built page and a user-centered page is that the engineer answers 'what does this do?' while the user asks 'what do I do?'"
inherits_from: "Platform Genome §1 Behavioral Contracts + VOICE-PROFILE-SYSTEM.md + B_UX.md"
links:
  - { rel: ux-contract, href: ../plan/pillar-0-governance/behavioral-contracts/B_UX.md }
  - { rel: voice-profiles, href: VOICE-PROFILE-SYSTEM.md }
  - { rel: page-context, href: ../../apps/csps-playground/src/components/PageContext.tsx }
---

# UX/UI Standards — CSPS Platform

> Research-based. Professional quality. Applies to all product interfaces.
> Source: Nielsen Norman Group heuristics + Interaction Design Foundation laws + S059 session learning.
> Every new page/component: check the relevant use-case list before marking DONE.
> Ratified: Opus-8 | S059

---

## PART 1 — THE 10 UNIVERSAL UX HEURISTICS

Foundation rules that apply to EVERY interface regardless of use case.
Source: Jakob Nielsen, NN/g (industry gold standard since 1994, validated by 30 years of research).

| # | Rule | What it means for CSPS | Test |
|---|---|---|---|
| H1 | **Visibility of system status** | Show current state at all times (loading, processing, saved, error) | "Can the user tell what's happening right now without clicking?" |
| H2 | **Match real-world language** | Use words the user uses, not platform jargon | "Could a non-engineer read every label and understand it?" |
| H3 | **User control and freedom** | Undo, back, cancel are always reachable | "Can the user undo the last action without refreshing?" |
| H4 | **Consistency and standards** | Same thing = same label, same color, same behavior everywhere | "Does [Save] always mean save? Does green always mean good?" |
| H5 | **Error prevention** | Prevent errors before they happen (disable, confirm, warn) | "Can the user destroy work without a confirmation?" |
| H6 | **Recognition over recall** | Show options; don't make users remember them | "Does the user have to memorize anything to use this?" |
| H7 | **Flexibility for different users** | Novice path and power path coexist | "Can an expert skip the guidance? Can a novice find it?" |
| H8 | **Aesthetic minimalism** | Show only what's needed for this task | "Is anything on this page only there because it was easy to add?" |
| H9 | **Error recovery** | When error happens, explain + give the fix | "Does every error message tell the user what to do next?" |
| H10 | **Help and documentation** | Available without leaving the page | "If I'm stuck, where do I find help without leaving?" |

---

## PART 2 — 6 CORE UX LAWS

Research-derived laws about human cognition and behavior. These explain WHY the heuristics work.

### Fitts's Law
**Larger targets are easier to hit. Close targets are easier to hit.**
→ Primary CTA must be the largest interactive element on the page.
→ Related actions must be physically close to the content they affect.
→ CSPS failure: Fork button at top of page, input appeared at page bottom (S059).

### Hick's Law
**More choices = longer decision time.**
→ Limit visible options to 3-5. Additional options go behind "More" or progressive disclosure.
→ In wizards: one question per screen. In dashboards: 3 primary options max.

### Miller's Law
**Working memory holds 7 ± 2 items.**
→ Forms longer than 7 fields need to be broken into steps.
→ Navigation menus: max 7 items per level.
→ CSPS Planning Wizard: 7 sections (at the limit — correct, each on its own screen).

### Jakob's Law
**Users expect your interface to work like other interfaces they know.**
→ Use standard patterns: breadcrumbs, save buttons bottom-right, search top-right.
→ Don't invent new interaction patterns without a compelling reason.
→ "← Back" is the universal pattern. "← Previous" is non-standard (S059 failure).

### Law of Proximity
**Things close together look related. Things far apart look unrelated.**
→ Labels must be directly above (or beside) their fields — never separated.
→ Action buttons must be within 100px of the content they act on.
→ Cause-effect must be colocated (S059 failure: button at top, result at bottom).

### Progressive Disclosure Law
**Show only what's needed NOW. Add complexity on demand.**
→ Default state: primary action visible, everything else collapsed.
→ Advanced options: hidden behind "Advanced" toggle.
→ CSPS failure: 7 expanded accordion sections = wall of fields (S059).

---

## PART 3 — USE-CASE CHECKLISTS

### USE CASE A: Wizard / Multi-Step Form
(Planning Wizard, onboarding flows, app creation)

**UX Rules:**
- [ ] One section/question visible at a time (not all 7 at once)
- [ ] Progress indicator always visible (Step N of N)
- [ ] Previous/Next navigation — both always reachable
- [ ] Current answer saved before advancing (no data loss on back)
- [ ] Completion % or "N of N complete" shown
- [ ] First step immediately actionable (no blocking intro text)
- [ ] Plain-language labels (no technical jargon in any field label)
- [ ] Each step explains WHY this information matters (one sentence)
- [ ] Guard questions shown as tips, not interrogations
- [ ] Save state works (refresh = same state)
- [ ] Final review before submit (show what will be created)
- [ ] Submit action is clear and irreversible-warning if needed

**UI Rules:**
- One section per screen (not full accordion)
- Section title: 18px bold
- Field labels: 14px semi-bold, directly above field
- Placeholder: example value (not instruction) — 13px, #9ca3af
- Tip/hint: 12px, #6b7280, below field, italic — collapsed by default if long
- Guard text: 12px, blue-left-border (#3b82f6), shown on focus not by default
- Progress bar: full width, top of content area, colored fill
- CTA: bottom-right, dark (#111), "Next →" or specific action verb
- Back: bottom-left, ghost button, "← [Section name]"
- Error state: red border on field + red helper text directly below

---

### USE CASE B: Dashboard / Status Page
(Completion tracker, Developer Journey, platform health)

**UX Rules:**
- [ ] Most important metric is the FIRST thing visible (above fold, no scroll)
- [ ] Status at a glance: one color (green/amber/red) tells you if action is needed
- [ ] Every metric is actionable (not just readable) — "Fix this" link on red items
- [ ] Time reference shown: "as of [last pnpm verify run]" — stale data labeled
- [ ] Drill-down available but not required — summary first, detail on demand
- [ ] Empty states are helpful ("Nothing here yet — start by doing X")
- [ ] Mobile-friendly: most important info at top, works on small screen

**UI Rules:**
- Page-level status banner: green/amber/red strip at top with 1-sentence summary
- Primary metric: 32px+ number, high contrast, no decoration
- Secondary metrics: smaller (20px), grey label above
- Status chips: 11px, uppercase, pill shape, colored background
- Progress bars: full width of their container, 8px height, rounded
- Drill-down: "See details →" link, 12px, right-aligned
- Section headers: 13px, semi-bold, uppercase, #6b7280 (label treatment)
- Card borders: 1px #e5e7eb, 8px radius, 16-24px padding

---

### USE CASE C: Config / Settings Panel
(Voice Profiles dashboard, any CRUD interface)

**UX Rules:**
- [ ] Three-zone layout: list (select) + editor (modify) + preview (verify)
- [ ] Non-destructive: changes don't save until explicit [Save] action
- [ ] Unsaved changes warning if user tries to navigate away
- [ ] Destructive actions (Delete, Deprecate) require confirmation
- [ ] Read-only items clearly labeled (lock icon + muted field color)
- [ ] Fork/clone available on locked items — never frustrate with "you can't edit this"
- [ ] Every field change immediately reflected in preview pane (live preview)
- [ ] Undo/cancel always available before save
- [ ] Success feedback: "Saved ✓" for 3 seconds after save
- [ ] Keyboard accessible: Tab moves through fields, Enter saves

**UI Rules:**
- List panel: 180-220px, scrollable, item = name + status chip
- Selected item: highlighted background (#f0f9ff or similar)
- Editor panel: flex 1, scrollable independently
- Preview panel: 200-280px, fixed height, scroll internally
- Save button: bottom-right of editor, always visible (sticky if needed)
- Cancel: text button, left of Save
- Delete: red text button, separated by 24px gap from Cancel
- Lock indicator: 🔒 emoji or SVG icon, right of item name
- Fork button: on read-only item, secondary style, "Fork to edit"
- Field sections: collapsible accordions, expand one at a time

---

### USE CASE D: Navigation / Wayfinding
(TopNav, breadcrumbs, in-page navigation)

**UX Rules:**
- [ ] User always knows where they are (breadcrumb or highlighted nav item)
- [ ] Back button works and goes where expected
- [ ] No dead ends — every page has at least one "go somewhere" link
- [ ] Consistent placement: primary nav always same position
- [ ] Current page NOT linked in breadcrumb (it's where you are)
- [ ] Nav labels describe what the page IS (not what it DOES)
- [ ] Max 7 items per nav level (Miller's Law)
- [ ] Mobile: hamburger or simplified nav — don't try to fit all desktop nav

**UI Rules:**
- TopNav height: 44px, sticky, white background, 1px bottom border
- Logo/home: leftmost, 700 weight, 13px
- Nav items: 12px, 600 weight, 4px horizontal gap
- Dropdown: white, 1.5px border, 6px radius, 4px shadow, 180px min-width
- Active/current: blue text or highlighted background
- Breadcrumb: 12px, #6b7280, "/" separator, current page in #111

---

### USE CASE E: First-Time User / Onboarding
(First visit to any app, empty states, new user flows)

**UX Rules:**
- [ ] Empty state is NEVER just a blank area — always has: illustration/icon + explanation + one CTA
- [ ] First meaningful action achievable in under 60 seconds
- [ ] No jargon in the first screen — plain language only
- [ ] Social proof or context: "1,234 apps have been planned this way"
- [ ] Skip option always available for experienced users
- [ ] Progress visible: "Step 1 of 3 — takes about 2 minutes"
- [ ] First value moment before asking for input (show, then ask)

**UI Rules:**
- Empty state illustration: centered, 40-60px icon or SVG
- Empty state title: 16px bold
- Empty state description: 13px, #6b7280, max 2 lines
- Primary CTA: 100% width on mobile, centered on desktop
- Onboarding steps: horizontal dots (●○○) for progress
- Skip link: right-aligned, 12px, #6b7280

---

## PART 4 — UI SYSTEM CONSTANTS

Single source of truth for visual properties. These must not be invented per-component.

### Colors
```
Green (success/active):   #16a34a   background: #dcfce7   border: #86efac
Amber (warning/partial):  #d97706   background: #fef3c7   border: #fcd34d
Red (error/blocked):      #dc2626   background: #fee2f2   border: #fca5a5
Blue (interactive/info):  #1d4ed8   background: #eff6ff   border: #93c5fd
Muted (secondary text):   #6b7280
Border (default):         #e5e7eb
Surface (cards):          #ffffff
Surface-alt (rows):       #f9fafb
Text primary:             #111111
Text secondary:           #374151
```

### Typography Scale
```
Page title:    18px, 700 weight, #111
Section title: 15px, 700 weight, #111
Label:         13px, 600 weight, #374151
Body:          13-14px, 400 weight, #374151, line-height 1.5
Caption:       11-12px, 400 weight, #6b7280
Code/mono:     13px, monospace, #111, background #f5f5f5
```

### Spacing System (4px base)
```
xs: 4px   — icon gaps, tight inline
sm: 8px   — field padding, button padding (vertical)
md: 12px  — section padding (inner), gap between related elements
lg: 16px  — card padding, field gaps
xl: 24px  — section gaps, card margins
2xl: 32px — page section separations
```

### Interactive Elements
```
Button primary:   background #111, color #fff, hover: #333, 600 weight, 6px radius
Button secondary: background transparent, border 1px #e5e7eb, hover: #f5f5f5
Button ghost:     no background, no border, colored text, hover: underline
Button danger:    border #dc2626, text #dc2626, hover: background #fee2f2
Button padding:   10px 20px (standard), 6px 14px (compact), 14px 28px (large)
Link:             color #1d4ed8, no underline by default, underline on hover
Input padding:    8px 12px, border 1px #e5e7eb, 6px radius, focus: blue border
```

### Status Chips
```
Format: uppercase text, 11px, 600 weight, pill shape (20px height, 8px radius)
Active:    #1d4ed8 text, #eff6ff background, #93c5fd border
Complete:  #16a34a text, #dcfce7 background, #86efac border
Partial:   #d97706 text, #fef3c7 background, #fcd34d border
Draft:     #6b7280 text, #f5f5f5 background, #e5e7eb border
Blocked:   #dc2626 text, #fee2f2 background, #fca5a5 border
```

---

## PART 5 — PRE-SHIP CHECKLIST (consolidated)

Every new page/component must pass ALL of these before the commit is done.

### The 8 Context Questions (from PageContext standard)
- [ ] Q1: Title answers "What is this page?" (plain language, not a system name)
- [ ] Q2: Pipeline position shown (if part of a flow)
- [ ] Q3: Status visible without scrolling
- [ ] Q4: Purpose in one plain-language sentence
- [ ] Q5: Options listed (2-4, not buried in content)
- [ ] Q6: Primary CTA visible above fold
- [ ] Q7: Next step shown at page bottom
- [ ] Q8: Toolkit available for deeper context

### The 7 S059 Colocation Rules (from Sonnet self-correction)
- [ ] Cause-effect colocated (input within 100px of trigger button)
- [ ] Primary action above fold (no scroll to find main CTA)
- [ ] Progressive disclosure (complex content starts collapsed)
- [ ] Navigation text unchanged without Governor directive
- [ ] ADD not REPLACE (existing page content preserved)
- [ ] Visual hierarchy clear (eye goes to primary action first)
- [ ] Affordances visible (every clickable thing looks clickable)

### The 4 Voice Profile Rules
- [ ] No exam language in any label or placeholder
- [ ] Tips are examples, not tests
- [ ] Guard questions appear as contextual hints, not required fields
- [ ] Voice profile declared (colleague/professional/mentor)

---

## PART 6 — USE CASE × RULE MATRIX

Which rules apply to which use case:

| Rule | Wizard | Dashboard | Config | Nav | Onboarding |
|---|---|---|---|---|---|
| H1 Status visibility | ✅ progress bar | ✅ status banner | ✅ save state | — | ✅ step count |
| H2 Real-world language | ✅ labels | ✅ metric names | ✅ field names | ✅ nav labels | ✅ everything |
| H3 User freedom | ✅ back button | — | ✅ cancel/undo | ✅ back works | ✅ skip option |
| H5 Error prevention | ✅ confirm before reset | ✅ confirm actions | ✅ confirm delete | — | — |
| H8 Minimalism | ✅ one section | ✅ drill-down | ✅ 3-panel | ✅ max 7 items | ✅ empty state |
| Fitts's Law | ✅ CTA size | ✅ primary metric | ✅ colocation | ✅ click targets | ✅ big CTA |
| Hick's Law | ✅ one step | ✅ max 5 metrics | ✅ 3 panels | ✅ max 7 | ✅ one action |
| Progressive Disclosure | ✅ one question | ✅ summary→detail | ✅ accordions | — | ✅ step-by-step |

---

*CSPS — UX/UI Standards v1.0 | RATIFIED S059 | Opus-8*
*Source: Nielsen Norman Group + Interaction Design Foundation + S059 CSPS session learning*
*Update when: new use case introduced, new failure observed, Governor directive*
