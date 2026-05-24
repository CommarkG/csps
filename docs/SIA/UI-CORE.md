---
id: SIA.UI-CORE
name: UI-CORE
description: "L1 sealed UI principles — universal visual laws for all components, all pages, all app types. Parallel to UX-CORE.md: UX defines WHAT the user experiences, UI defines HOW it looks and behaves. Every UX decision has a UI implementation here."
type: architecture
protection_level: sacred
status: ratified
core_spines: [AI, ARCH, OPER]
core_spine: ARCH
schema_anchor: vault_files
version: "1.0"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Does this visual decision inherit from a principle here? If it invents a new color, spacing, or component pattern without referencing UI-CORE — it is creating design debt."
context_quote: "Consistency is not boring. It is trust. Every element that looks the same behaves the same."
inherits_from: "UX-CORE.md + tools/config/design-tokens.yaml"
links:
  - { rel: ux-core, href: UX-CORE.md }
  - { rel: design-tokens, href: ../../tools/config/design-tokens.yaml }
  - { rel: voice-profiles, href: VOICE-PROFILE-SYSTEM.md }
  - { rel: ui-components, href: UI-COMPONENTS.md }
  - { rel: ui-patterns, href: UI-PATTERNS.md }
  - { rel: ui-rtl, href: UI-RTL.md }
---

# UI Core — L1 Universal Visual Laws

> SEALED. These laws apply to every component, every page, every audience.
> Sub-files (L2, L3) extend these laws for specific contexts.
> Token values live in tools/config/design-tokens.yaml — this file governs HOW to use them.
> Ratified: Opus-8 | Governor: Yariv Fink | S059

---

## The 3 Fundamental Visual Laws

### Law 1 — Tokens, Not Literals
No hardcoded color hex, no hardcoded pixel value, no hardcoded font size in component code.
Every visual value references a token from design-tokens.yaml.
Why: 30 apps share one design system. Change a token = all apps update. Hardcode = design debt.
Exception: transition durations, box-shadow values (documented exceptions in component).

### Law 2 — Hierarchy Is Visible
The most important element is visually dominant. The second most important is secondary.
Nothing competes for first position.
Implementation: one primary button per screen. One heading at the top. One status chip.
If two elements look equally important — the design is wrong.

### Law 3 — States Are Explicit
Every interactive element has 4 visible states: default, hover, active, disabled.
Every data element has 3 states: loading, empty, error.
A component without all states is unfinished regardless of how the default looks.

---

## The UX → UI Translation Table

Every UX rule from UX-CORE.md has a UI implementation here:

| UX Rule | UI Implementation |
|---|---|
| Primary CTA must stand out | `background: #111, color: #fff, font-weight: 600, padding: 10px 20px, border-radius: 6px` |
| Status must be visible | Status chip: 11px uppercase, colored bg+border per design-tokens chip.variants |
| Progressive disclosure | Collapsible section: `▸ Show more` text link, 12px, #1d4ed8, rotates on open |
| Options panel (2-4 items) | Options list: each row has label (600 weight) + description (400, muted) + optional CTA |
| Help icon | Round button: 20px × 20px, `?` text, 1px border #888, popover on click (280px width) |
| Related Pages | Bottom section: 1px top border, "Related Pages" label (11px uppercase muted), 2-col grid |
| Recommended CTA | Accent button + "RECOMMENDED" chip (10px, uppercase, accent background) above button |
| Next step hint | Footer link: `→ [destination]`, 12px, #1d4ed8, bottom of page |

---

## Visual Hierarchy Rules

### Typography Hierarchy (4 levels)
```
H1 — Page title:       18px, 700 weight, #111, line-height 1.2
H2 — Section title:    15px, 700 weight, #111, line-height 1.3
H3 — Card title:       13px, 600 weight, #374151, line-height 1.4
Body — Standard text:  14px, 400 weight, #374151, line-height 1.5
Caption — Muted text:  12px, 400 weight, #6b7280, line-height 1.4
Quote — Italic:        12px, 400 weight, #9ca3af, font-style italic
```

### Color Hierarchy (semantic, not decorative)
```
Primary action:  #111 (dark) — the single most important interactive element
Success/Active:  #16a34a — things that are working, good state
Warning/Partial: #d97706 — things that need attention but aren't broken
Error/Blocked:   #dc2626 — things that are broken or require immediate action
Info/Link:       #1d4ed8 — clickable, navigational, informational
Muted:           #6b7280 — secondary text, labels, captions
Border:          #e5e7eb — subtle separators, card outlines
Surface:         #ffffff — card backgrounds
Surface-alt:     #f9fafb — page background, alternating rows
```

### Spacing Hierarchy (4px base)
```
xs: 4px   — icon-text gap, tight inline elements
sm: 8px   — button padding (vertical), field label gap
md: 12px  — inner padding for small cards, related element gap
lg: 16px  — card padding (standard), form field gap
xl: 24px  — section separation, card external margin
xxl: 32px — major page section separation
```

---

## Component State Laws

### Interactive States (all 4 required)
```
Default:  base style as defined in component
Hover:    background shift (usually +10% lighter or surface-alt)
Active:   border highlight or compressed scale (transform: scale(0.98))
Disabled: opacity: 0.5 + cursor: not-allowed + pointer-events: none
Focus:    2px outline in #1d4ed8 (keyboard accessibility — non-negotiable)
```

### Data States (all 3 required for every data display)
```
Loading:  skeleton placeholder (animated grey bars at content positions)
Empty:    centered icon + explanation + one CTA ("Nothing here yet — start by doing X")
Error:    red border indicator + plain-language message + recovery action link
```

A component without skeleton loading and empty state is not complete. Ship only when all 3 exist.

---

## Button Hierarchy (4 levels — never mix levels for same action)

```
Level 1 — Primary (one per screen):
  background: #111, color: #fff, hover: #333
  padding: 10px 20px, font-weight: 600, border-radius: 6px

Level 2 — Secondary (supporting actions):
  background: transparent, border: 1px solid #e5e7eb, hover bg: #f9fafb
  padding: 10px 20px, font-weight: 500, border-radius: 6px

Level 3 — Ghost (tertiary, inline):
  background: transparent, border: none, color: #1d4ed8
  hover: text underline, no box change

Level 4 — Danger (destructive actions only):
  background: transparent, border: 1px solid #dc2626, color: #dc2626
  hover bg: #fee2f2 — ALWAYS separated from other buttons by 24px gap
```

---

## Form UI Laws

### Field Anatomy (all required)
```
Label:       13px, 600 weight, #374151, directly above field (4px gap)
Field:       padding: 8px 12px, border: 1px solid #e5e7eb, radius: 6px
Placeholder: example value (not instruction), 13px, #9ca3af
Tip/Hint:    12px, #6b7280, below field (6px gap), italic optional
Guard text:  12px, left-border 3px solid #1d4ed8, background: #eff6ff
Error state: red border + red helper text 12px directly below field
Success:     green border + checkmark indicator
```

### Voice Profile → Field UI Mapping
```
colleague    → Labels: short, friendly. Tips: example-based. Guard: supportive question
professional → Labels: complete sentence. Tips: criteria/target. Guard: structured prompt
mentor       → Labels: exploratory question. Tips: reflection prompt. Guard: thinking trigger
```

---

## Card and Container Laws

### Standard Card
```
background: #fff
border: 1px solid #e5e7eb
border-radius: 8px
padding: 16px (standard) | 24px (large)
box-shadow: none by default | 0 2px 8px rgba(0,0,0,0.06) on hover
```

### Section Separator
```
border-top: 1px solid #e5e7eb
margin: 24px 0
```

### Collapsible Section
```
Header: cursor: pointer + ▸ icon (rotates to ▾ when open)
Transition: max-height animation 200ms ease
Collapsed: show only header row
Expanded: show full content with 12px top padding
```

---

## Motion Laws (minimal — cognitive load)

```
Transitions: 150ms ease (fast interactions: hover, focus)
Animations:  200ms ease (medium interactions: expand/collapse, appear)
Loading:     1.5s pulse animation on skeleton placeholders
No motion:   when user has prefers-reduced-motion — all animations → instant
```

---

## Navigation UI Laws

### TopNav (all apps inherit this pattern)
```
Height: 44px, sticky, position: fixed top
Background: #fff, border-bottom: 1.5px solid #e5e5e5, z-index: 200
Logo: 700 weight, 13px, leftmost (LTR) / rightmost (RTL)
Items: 12px, 600 weight, dropdown on click
Dropdown: white, 1.5px border, 6px radius, 4px shadow, 180px min-width
CTA (rightmost): Primary button style, "Take action" label
```

### Status Chips (semantic — consistent across all apps)
```
Shape: pill (9999px radius), 20px height, 11px uppercase, 700 weight
Spacing: 4px 8px padding
Active/Complete: #1d4ed8 text, #eff6ff bg, #93c5fd border (or #16a34a for done)
Partial/Building: #d97706 text, #fef3c7 bg, #fcd34d border
Blocked/Error: #dc2626 text, #fee2f2 bg, #fca5a5 border
Draft/Planning: #6b7280 text, #f5f5f5 bg, #e5e7eb border
```

---

## The UI Mini-Tree Architecture

```
UI-CORE.md (this file — L1 SEALED)
├── UI-COMPONENTS.md    ← L2: component library catalog (which components exist, their anatomy)
├── UI-PATTERNS.md      ← L2: layout patterns (wizard, dashboard, config, onboarding)
├── UI-VOICE.md         ← L2: voice profile → field UI mapping in detail
└── UI-RTL.md           ← L2: right-to-left CSS overrides (Hebrew, Arabic apps)
```

UX-CORE.md (sister file) and UI-CORE.md always travel together:
- UX defines the experience requirement
- UI defines the visual implementation
- Neither is complete without the other

---

## UI Core ↔ UX Core Pairing (the core loop)

| UX-CORE rule | UI-CORE implementation |
|---|---|
| 8 mandatory page elements | PageContext component anatomy + spacing |
| 5 cognitive load rules | Collapsible sections, skeleton states, button hierarchy |
| RTL/LTR layout rules | UI-RTL.md CSS overrides |
| Progressive disclosure | Collapsible section component (300ms, max-height animation) |
| Voice profile mandate | UI-VOICE.md field anatomy per profile |
| Contextual help (?) | 20px round button, ? symbol, popover 280px width |
| Related Pages | Bottom section with 2-col card grid (see RelatedPages.tsx) |

---

*UI Core v1.0 | SEALED | S059 | Opus-8*
*Parallel to UX-CORE.md. To change a law here: Governor ratification + new version.*
*Token values: tools/config/design-tokens.yaml. Patterns: UI-PATTERNS.md (L2).*
