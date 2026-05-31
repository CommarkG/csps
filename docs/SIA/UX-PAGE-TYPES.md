---
id: SIA.UX-PAGE-TYPES
name: UX-PAGE-TYPES
description: "L2 sealed UX page archetypes — every CSPS page belongs to one of these types. Each type has mandatory UX requirements + responsiveness rules. Inherits from UX-CORE.md L1. Supersedes the page-type section of UX-PATTERNS-RESEARCH.md (draft since S059). Ratified S072 per PROTO-S072-UX-WIRE."
type: architecture
protection_level: protected
status: ratified
ratified_by: "OPUS-15 (S072, PROTO-S072-UX-WIRE R5-a answer)"
ratified_at: "2026-05-31"
core_spine: ARCH
core_spines: [ARCH, AI, OPER]
schema_anchor: vault_files
version: "1.0"
session: S072
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
inherits_from: "UX-CORE.md (L1 sealed) + UI-CORE.md (L1 sealed)"
supersedes: "UX-PATTERNS-RESEARCH.md §page-types (S059 draft — now SUPERSEDED)"
context_question: "Which page type is this? Does it pass ALL requirements for that type? Is responsiveness handled per the breakpoints defined here?"
links:
  - { rel: ux-core, href: UX-CORE.md }
  - { rel: ui-core, href: UI-CORE.md }
  - { rel: design-tokens, href: ../../tools/config/design-tokens.yaml }
  - { rel: ux-roles, href: UX-ROLES.md }
---

# UX Page Types — L2 Sealed

> Inherits: UX-CORE.md 3 Laws · 8 Mandatory Elements · 5 Cognitive Load Rules
> Every CSPS page declares a type. Unknown type = unshippable.
> Ratified S072 | Opus-15

---

## The 7 Page Types

### TYPE A — Landing / Introduction
**Purpose:** First contact. User arrives with zero context. Must answer WHO/WHAT/WHY in under 10 seconds.
**Primary CTA:** One action — "Get started" or "Learn more" — above the fold.
**What it is NOT:** A feature dump. A marketing brochure with 12 sections.
**Requirements:**
- [ ] Title: 5 words max, names what the user GETS (not what the product IS)
- [ ] Subtitle: 1 sentence, no jargon, outcome-focused
- [ ] Primary CTA: above the fold, highest visual weight on page
- [ ] Social proof or status indicator (one element only)
- [ ] Zero navigation away from the primary CTA path
**Failure mode:** User arrives and doesn't know what to do in 10 seconds → they leave.

---

### TYPE B — Dashboard / Overview
**Purpose:** Current state at a glance. User needs to know: what needs attention, what's working, what's next.
**Primary CTA:** "Fix this" on red items, "Continue" on in-progress items.
**What it is NOT:** A report. A data dump. A list of everything.
**Requirements:**
- [ ] Status visible without reading — one color (green/amber/red) communicates state
- [ ] Every metric is actionable — "Fix this" link on red items, not just the number
- [ ] Time reference shown — "as of [last verify run]" — stale data labeled
- [ ] Drill-down available but not required — summary first, detail on demand (collapsed)
- [ ] Empty states are helpful — "Nothing here yet — start by doing X"
**Failure mode:** User sees numbers but doesn't know what to do about them.

---

### TYPE C — Wizard / Multi-Step Form
**Purpose:** Guide user through a complex task by breaking it into one decision per step.
**Primary CTA:** "Next →" with specific label — never just "Next".
**What it is NOT:** A form with 20 fields. A questionnaire.
**Requirements:**
- [ ] Progress bar: full width, top of content area, colored fill
- [ ] One decision per step (never two independent things at once)
- [ ] Back always works — previous state restored, not blank form
- [ ] CTA: bottom-right, names what happens — "Save draft →" not "OK"
- [ ] Error state: red border on field + red helper text directly below
- [ ] Terminal state clearly defined and shown at completion
**Failure mode:** User submits step 3 and loses step 2 data. User doesn't know when the wizard is "done".

---

### TYPE D — Settings / Configuration
**Purpose:** Persistent configuration that affects system behavior. Changes survive sessions.
**Primary CTA:** "Save changes" — always explicit, never auto-save silently.
**What it is NOT:** A wizard step. A one-time form.
**Requirements:**
- [ ] Read-only items clearly labeled (lock icon + muted field color)
- [ ] Every change requires explicit "Save" — no silent auto-save
- [ ] "Discard changes" always available before save
- [ ] Success feedback: "Saved ✓" for 3 seconds after save
- [ ] Dangerous settings (delete, disable) separated visually with warning color
**Failure mode:** User changes a setting and doesn't know if it was saved.

---

### TYPE E — Catalogue / List
**Purpose:** Browse a collection. Find a specific item. Compare options.
**Primary CTA:** On each item — the most common action for that item.
**What it is NOT:** A report. An infinitely scrolling feed without structure.
**Requirements:**
- [ ] Filter/sort always visible (not behind "Advanced options")
- [ ] Empty state: helpful ("No results for X — try Y")
- [ ] Each item: label + status + primary action (3 elements max visible)
- [ ] Pagination or "Load more" — never infinite scroll without control
- [ ] Search: available, searches visible fields only (no surprise results)
**Failure mode:** User can't find the item they know exists.

---

### TYPE F — Reference / Documentation
**Purpose:** Answer a specific question. User already knows what they're looking for.
**Primary CTA:** "Copy" or "View example" — not navigation away.
**What it is NOT:** A tutorial. A marketing page. A sales pitch.
**Requirements:**
- [ ] Table of contents or jump links — user can navigate without scrolling
- [ ] Every section is independently useful (can land on it directly)
- [ ] Code examples: copyable, syntax-highlighted, tested
- [ ] "Last updated" visible — stale docs labeled
- [ ] Related pages: 2-4 links at the bottom, specific and relevant
**Failure mode:** User finds the page but can't find their specific answer within it.

---

### TYPE G — Creation / Builder
**Purpose:** Produce a new artifact. User starts from intention and ends at a defined output.
**Primary CTA:** "Create [artifact type]" — names what is being created.
**What it is NOT:** A settings page. A form. A wizard (though it may use wizard steps internally).
**Requirements:**
- [ ] Live preview: artifact shown as it's being built
- [ ] Save draft: auto-save every N changes (sample — tunable), with timestamp
- [ ] Validation: inline, immediate, specific ("Missing title" not "Required field")
- [ ] Output clearly defined: user knows what the artifact will be when done
- [ ] Revision history: can undo last N changes
**Failure mode:** User builds for 20 minutes and loses work. User doesn't know what they produced.

---

## Responsiveness Rules

*Section answering OPUS-15 S072 ratification question R5-b: responsiveness inside this file, not its own file.*

### Breakpoints (3 tiers)

```
Desktop:  ≥1024px — full layout, sidebars, multi-column
Tablet:   768px–1023px — sidebars collapse, single-column main, stacked sections
Mobile:   <768px — single column, nav collapsed to hamburger, primary CTA pinned to bottom
```

### Per-type responsiveness rules

| Page Type | Desktop | Tablet | Mobile |
|---|---|---|---|
| A — Landing | Full hero + CTA | Stack hero, CTA below fold OK | CTA pinned bottom, hero image hidden |
| B — Dashboard | Multi-column metrics | 2 columns, metrics reflow | 1 column, most critical metric first |
| C — Wizard | Side panel + content | Full-width content, side panel collapses | Full-width, step indicator at top |
| D — Settings | 2-column: nav + content | Accordion nav | All sections collapsed by default |
| E — Catalogue | 3-column grid | 2-column grid | 1-column list |
| F — Reference | TOC sidebar + content | TOC collapses to top dropdown | TOC hidden, jump links at top |
| G — Creator | Split: preview + form | Tabs: preview \| form | Form only, preview on "Preview" tab |

### Non-negotiable mobile rules (apply to ALL types)
1. Touch targets: minimum 44px × 44px
2. Text: minimum 16px for body (no pinch-zoom required)
3. Primary CTA: reachable without scrolling on first view OR pinned
4. No horizontal scroll (content wraps or collapses)
5. Forms: one field visible at a time on mobile (wizard pattern auto-applies)

---

## Cross-cutting Pattern: Collapsibility

*Implements UX-CORE Law 2 — Progressive Disclosure by Default (L1 substrate, sealed). This section
adds the IMPLEMENTATION STANDARD at L2. It does not modify UX-CORE.md.*

> **Information depth should match user readiness, not author pride.**
>
> A page that contains full reasoning AND is navigable is better than a page that shows full
> reasoning (overwhelming) or hides it behind another page (frustrating). Collapsibility achieves
> both: full scope available, displayed on demand.
>
> *Source: ux-ui-doctrine-S072.md PART 5 — PROTO-S073-M3.3-REFINED (OPUS-15, S073)*

### Implementation Standard (applies to all 7 page types)

| Content type | Default state | Expand trigger |
|---|---|---|
| Primary action and purpose | VISIBLE — always | N/A |
| Supporting context / "why" | COLLAPSED — `▸ Why this matters` | Click |
| Technical details / evidence | COLLAPSED — `▸ Technical detail` | Click |
| Historical / audit trail | COLLAPSED — `▸ History` | Click |
| Related pages | VISIBLE but minimal (1 line each) | Click for detail |
| Platform alignment questions | COLLAPSED — `▸ Alignment context (N)` | Click |
| Help / toolkit | COLLAPSED — `?` icon | Click |

### Application per page type

| Type | Collapsibility priority | What to collapse first |
|---|---|---|
| A — Landing | Low — keep it open, minimal content | Secondary proof points |
| B — Dashboard | High — metrics first, drill-down on demand | Per-item evidence and logs |
| C — Wizard | Medium — one step at a time (built-in) | Per-step alignment questions |
| D — Settings | Medium — group sections, collapse dangerous ones | Rarely-changed settings |
| E — Catalogue | Medium — item detail on click | Item metadata beyond label+status |
| F — Reference | High — section nav, content collapsed until scrolled to | Non-primary code examples |
| G — Creator | High — AI messages, platform inventory, alignment Qs | Inventory results, help panels |

### Non-negotiable collapsibility rules (apply to ALL types)
1. **Expand trigger is text or icon, never just hover** — keyboard accessible
2. **Collapsed state shows a summary (1 line max)**, not just a chevron
3. **Expand/collapse state persists within a session** — collapse what user collapsed
4. **Nested collapsibility maximum: 2 levels** — beyond 2 = wrong information architecture

---

*Ratified S072 | OPUS-15 | Closes S059 ratification question (a): UX-PAGE-TYPES as sealed L2 — YES*
*Cross-cutting collapsibility pattern added S073 | OPUS-15 | PROTO-S073-M3.3-REFINED*
