---
id: csps.vault.ux-ui-doctrine-S072
name: ux-ui-doctrine-S072
description: >
  Comprehensive UX/UI doctrine synthesis — S072 Governor session. Consolidates:
  UX-CORE.md (sealed L1) + UI-CORE.md (sealed L1) + UX-UI-STANDARDS.md + UX-PATTERNS-RESEARCH.md (draft)
  + design-tokens.yaml + Governor S072 feedback + Platform Attitude applied to themes/options.
  Status: DRAFT for Opus ratification. NOT yet sealed.
type: governance
protection_level: protected
status: ratified
core_spine: GVRN
core_spines: [GVRN, AI, ARCH]
schema_anchor: vault_files
version: "1.0"
session: S072
ratified_session: S073
ratified_by: "OPUS-15 (R1-R7 verdicts) + Governor (PROTO-S073-SEAL)"
owner: group:finky
lifecycle: production
lifecycle_state: active
authored_by: Sonnet S072
closure_owner: group:finky
closure_decision: "§1-§7 RATIFIED (OPUS-15 R1-R7 verdicts applied in S072-S073). §8 Q1-Q4+Q6-Q7 ANSWERED; Q5 (theme dashboard) vaulted as PI-theme-dashboard."
closure_by: "S073 close (this session — done)"
awaiting_ratification: true
retrieve_when: "Opus ratification session — answer all 7 open questions at bottom before sealing"
context_question: "Before applying any UX or UI decision: does it come from the SUBSTRATE (sealed, inherited automatically) or is it a VARIETY (selectable) or DEFAULT (platform recommendation)?"
links:
  - { rel: ux-core, href: ../../../docs/SIA/UX-CORE.md }
  - { rel: ui-core, href: ../../../docs/SIA/UI-CORE.md }
  - { rel: ux-ui-standards, href: ../../../docs/SIA/UX-UI-STANDARDS.md }
  - { rel: ux-patterns-research, href: ../../../docs/SIA/UX-PATTERNS-RESEARCH.md }
  - { rel: design-tokens, href: ../../../tools/config/design-tokens.yaml }
  - { rel: opus-review-prompt, href: ./opus-review-prompt-ux-ui-S072.md }
---

# UX/UI Doctrine — S072 Synthesis

> **For Opus review and ratification.**
> This document synthesizes all existing UX/UI research with the new concepts from Governor S072 sessions.
> Gaps from S059 ratification questions are answered or explicitly deferred.
> Not yet sealed. Opus ratification required before becoming L1/L2 spine files.

---

## PART 0 — THE RIGIDNESS AGENT (Governs everything below)

**This is the most important principle in this document. It applies to every rule written here and to every rule written in any future CSPS session.**

### The Problem
Rules written by AI systems tend to be prescriptive without reasoning:
> "Every section title has a 1-sentence descriptor inline to the right."

An AI following this perfectly can still produce wrong UX. The rule is brittle. Context breaks it.

### The Rigidness Test
For every rule, ask:
1. Does this rule give the REASONING or just the PRESCRIPTION?
2. Could an AI follow this rule perfectly and still produce the wrong result?
3. Is this still true in edge cases (mobile, RTL, dense data, empty state)?
4. Would removing the prescription and leaving only the reasoning produce BETTER outcomes?

If the answer to 3 or 4 is yes — the rule is rigid. Rewrite it.

### The Rigidness Correction Pattern
```
RIGID:   "Every section title has a 1-sentence descriptor inline to the right."
CORRECT: "Every label earns its cognitive real estate by reducing the user's uncertainty.
          When a label creates uncertainty, the resolution is provided immediately — never elsewhere.
          The FORM of the resolution follows from HOW MUCH uncertainty exists:
          • High uncertainty → collapsible detail panel
          • Moderate uncertainty → inline descriptor
          • Low uncertainty → label alone suffices
          • Obvious context → even the label may be redundant"
```

### Application
The rigidness agent fires:
- **BEFORE**: every rule written in a session (is the reasoning in the rule?)
- **AFTER**: audit of every rule written (would removing the prescription improve it?)
- **At ratification**: Opus applies this test to every principle before sealing

---

## PART 1 — SUBSTRATE (sealed, inherited by all)

*From UX-CORE.md (sealed L1) + UI-CORE.md (sealed L1). These cannot be overridden.*

### UX Substrate — The 3 Laws

**Law 1: Context Before Content**
Every page answers WHY before showing WHAT. The user understands the page's purpose before processing any data.
*Context question: "Would a first-time user know what to do in the next 10 seconds?"*

**Law 2: Progressive Disclosure by Default**
Start with the minimum the user needs to take ONE action. Everything else is available on demand.
*Context question: "Is anything visible on this page that the user didn't ask for yet?"*

**Law 3: Clarity Over Completeness**
A page that shows 3 things clearly outperforms a page that shows 10 things accurately.
*Context question: "If I removed this element, would the user's ability to act decrease?"*

### UI Substrate — The 3 Visual Laws

**Law 1: Tokens, Not Literals**
No hardcoded color, size, or spacing in component code. All values come from design-tokens.yaml.
*Context question: "If I change the brand color tomorrow, does this component update automatically?"*

**Law 2: Hierarchy Is Visible**
The most important element is visually dominant. Nothing competes for first position.
*Context question: "Which element is the user's eye drawn to first? Is that the right element?"*

**Law 3: States Are Explicit**
Every interactive element has 4 states: default, hover, active, disabled.
Every data element has 3 states: loading, empty, error.
*Context question: "What does this component look like when it fails? When it's empty? When it's loading?"*

### Mandatory Page Elements (8/8 required to ship)

| # | Element | What it gives the user | Rigidness-corrected implementation |
|---|---|---|---|
| 1 | Identity | "What is this place?" | The title names the USER'S ACTION, not the system name |
| 2 | Position | "Where am I in the flow?" | Breadcrumb or pipeline position — one of these, not both |
| 3 | Status | "What is the current state?" | One color (green/amber/red) — visible without reading |
| 4 | Purpose | "Why am I here?" | One plain-language sentence, no jargon |
| 5 | Options | "What can I do?" | 2-4 labeled options; additional options collapsed |
| 6 | Primary CTA | "What should I do NOW?" | Above the fold, highest visual weight, names the action |
| 7 | Next Step | "Where do I go after?" | One link at the bottom — the obvious continuation |
| 8 | Help | "Where do I learn more?" | "?" available per section — opens help without page change |

### Design Token Reference
Source: `tools/config/design-tokens.yaml` (single source of truth for all values)

```
Status colors:   success #16a34a · warning #d97706 · danger #dc2626 · info #1d4ed8
Text:            primary #111111 · secondary #374151 · muted #6b7280
Surfaces:        card #ffffff · page #f9fafb
Border:          default #e5e7eb
Typography:      H1 18/700 · H2 15/700 · H3 13/600 · body 14/400 · caption 12/400
Spacing:         4px base · 8 · 12 · 16 · 24 · 32 · 48 · 64
Radius:          4px small · 6px default · 8px card · 12px large
```

---

## PART 2 — THE THEME SYSTEM (Platform Attitude applied to visual identity)

### Corrected Model
*Dark mode is NOT a variety. Themes are varieties. The platform has a theme registry.*

```
SUBSTRATE:  Design tokens (color semantics, spacing, typography — universal)
DEFAULT:    Platform-selected theme based on context logic
VARIETY:    Theme alternatives the user or app can select
```

### What a Theme Contains
A theme is a COMPLETE visual identity. It is NOT just colors. It contains:
- Color palette (semantic + brand expressions)
- Typography choices (font family, weight preferences)
- Spacing density (compact / comfortable / spacious)
- Component style (flat / elevated / bordered / minimal)
- Motion preferences (immediate / subtle / expressive)
- Dark/Light variant (WITHIN a theme — not a separate theme choice)

### Theme Registry

| Theme ID | Name | Context logic | Status |
|---|---|---|---|
| `csps-light` | CSPS Professional Light | DEFAULT for all governance/developer tools | ACTIVE |
| `csps-dark` | CSPS Dark | User preference override | VALIDATED |
| `csps-high-contrast` | High Contrast | Accessibility requirement | VALIDATED |
| `medical-calm` | Medical Calm | App purpose: healthcare | DRAFT |
| `finance-pro` | Finance Professional | App purpose: financial | DRAFT |
| `consumer-bright` | Consumer Bright | Audience: end users, consumer | DRAFT |

### Default Selection Logic
```
1. App declares purpose context → theme registry maps purpose → default theme
2. User sets preference → overrides default (stored in user profile)
3. System preference (OS dark mode) → applied as dark/light variant of active theme
4. No signal → platform default (csps-light)
```

### Theme Statuses
DRAFT → VALIDATED (passes contrast audit + all 8 mandatory elements) → ACTIVE → DEPRECATED

### Theme Dashboard Requirements
The theme management dashboard must support:
- [ ] View all themes with status chips
- [ ] Preview any theme live (side-by-side with current)
- [ ] Create new theme (fork from existing → modify → validate → activate)
- [ ] Edit theme tokens (with live preview)
- [ ] Run validation (contrast audit, accessibility check, mandatory elements)
- [ ] Promote status (DRAFT → VALIDATED → ACTIVE)
- [ ] Deprecate (with migration path to replacement)
- [ ] Download theme as JSON/YAML
- [ ] Upload theme file to import
- [ ] Set as default (with context logic configuration)

---

## PART 3 — R4 CORRECTED: VISUAL COMMUNICATION AS BEHAVIORAL CONTRACT

*Previously stated too narrowly. Corrected with reasoning.*

### The Deeper Principle

> **Every visual element telegraphs what it requires from the user.**
>
> The visual presentation of a UI element communicates the required user response
> before any text is read. Appearance = behavioral instruction. If the appearance
> is ambiguous about what response is expected — the design is broken.

### The Four Response Types (visual treatment must distinguish these)

| Response required | Visual treatment | Not this |
|---|---|---|
| **None** (status, information) | Flat, no cursor change, no border highlight | Same as interactive |
| **Input** (question, answer expected) | Cursor affordance visible, input field or response area shown below/nearby | Looks like status |
| **Action** (do something) | Interactive element visible, button or link present | Buried in text |
| **Approval** (irreversible, consequential) | Higher visual weight, confirmation language, destructive action styled differently | Looks like regular button |

### Applied to Core Spine Creator (illustration)
- "Platform scan complete — no related elements found" → **None** (status) → flat card, grey border
- "Who is the primary human user?" → **Input** (question) → different border color, response area shown, "Your answer..." placeholder visible
- "Ratify vocabulary" → **Approval** (consequential) → stronger visual weight, accent fill, naming what will be locked

*Context question for every message/element: "What does the user need to DO after seeing this? Does the visual make that obvious without reading?"*

---

## PART 4 — FOCUSED ISSUES vs FLOWS

*These require different analytical approaches and review points.*

### Focused Issues
**Definition:** A specific, contained problem with a clear owner and a single fix point.
*Examples: button contrast is 2.1:1 (must be 4.5:1), the "→" button doesn't name its action, a spinner has no label.*

**Analysis approach:**
1. Name the violation (cite the rule it breaks)
2. Categorize it (contrast / information architecture / CTA / consistency / state)
3. Name the fix (specific, testable)
4. Verify (before/after measurable)

**Review points:** Can be caught by automated linting, screenshot review, or a single-pass checklist.

### Flows
**Definition:** A sequence of user interactions spanning multiple steps, screens, or states.
*Examples: the onboarding wizard, creating a core spine, the developer's 8-step INFRA-FLOW.*

**Analysis approach:**
1. Map the full sequence (every step, every decision, every branch)
2. Walk it as each persona type (Governor, developer, end user)
3. Identify friction points (where does the user pause, hesitate, or fail?)
4. Optimize the SEQUENCE (not individual elements — the ORDER matters most in flows)
5. Test peak and ending deliberately (JOURNEY-DOCTRINE §8)
6. Iterate until friction is below threshold

**Review points:** Cannot be caught by automated tools. Requires persona walkthrough. Requires measuring task completion time and error rate.

### The Category Map for Core Spine Creator Issues

**FOCUSED ISSUES (specific, fixable now):**
- F1: Contrast — platform message bubbles fail 4.5:1 minimum
- F2: Identical visuals — status messages and questions look the same
- F3: CTA labels — "→" does not name its action
- F4: Co-location — progress bar and stage label separated across header
- F5: Help gap — no "?" per section, no toolkit

**FLOW ISSUES (require sequence analysis):**
- FL1: Alignment questions are out of flow — sidebar is secondary; questions belong adjacent to what they clarify
- FL2: No phase intro — user enters clarification phase without knowing what clarification means
- FL3: Ratification weight is same as "add item" — the most consequential action looks the same as the least consequential
- FL4: No persistent understanding — user can't see their growing spine definition while filling it in
- FL5: No save/resume — if user closes the page, all progress is lost

---

## PART 5 — COLLAPSIBILITY AS A STANDARD PATTERN

*Every page in CSPS should be able to contain its full scope while not overwhelming the user.*

### The Principle (rigidness-corrected)

> **Information depth should match user readiness, not author pride.**
>
> A page that contains full reasoning AND is navigable is better than a page
> that shows full reasoning (overwhelming) or hides it behind another page (frustrating).
> Collapsibility is the mechanism that achieves both: full scope available, displayed on demand.

### Implementation Standard

| Content type | Default state | Expand trigger |
|---|---|---|
| Primary action and purpose | VISIBLE — always | N/A |
| Supporting context / "why" | COLLAPSED — `▸ Why this matters` | Click |
| Technical details / evidence | COLLAPSED — `▸ Technical detail` | Click |
| Historical / audit trail | COLLAPSED — `▸ History` | Click |
| Related pages | VISIBLE but minimal (1 line each) | Click for detail |
| Platform alignment questions | COLLAPSED — `▸ Alignment context (3)` | Click |
| Help / toolkit | COLLAPSED — `?` icon | Click |

### Applied to Core Spine Creator
Every phase of the creator should show:
- The platform's message (VISIBLE, large)
- The user's input area (VISIBLE, prominent)
- Alignment questions (`▸ 3 alignment questions` — collapsed, click to expand)
- Platform inventory (`▸ Platform inventory` — collapsed, click to expand)
- Help for this phase (`?` icon — collapsed, click to expand)

This eliminates the sidebar entirely. Everything is co-located in the main flow. Collapsed sections keep it clean. Nothing is hidden — it's organized.

---

## PART 6 — OPTION SETS WITH PLATFORM ATTITUDE

*Options are versioned quality offerings, not decision points. Each has a status track.*

### Status Track for All Options
`DRAFT` → `REFINED` → `VALIDATED` → `SEALED` → `DEPRECATED`

**What each status means:**
- **DRAFT**: proposed, not yet tested
- **REFINED**: feedback incorporated, clearer but not yet verified
- **VALIDATED**: tested with real use, measurably better than alternatives
- **SEALED**: ratified by Governor + Opus, becomes the platform's DEFAULT or VARIETY
- **DEPRECATED**: superseded, migration path defined

### OPTION SET 1 — Contrast + Theme [REFINED]

**Baseline:** UX-CORE.md Law 1 (Context Before Content) + UI-CORE.md Law 1 (Tokens, Not Literals) + WCAG AA 4.5:1 minimum.

| Option | Description | Status | Pros | Cons |
|---|---|---|---|---|
| **1A — Contrast fix now** | Raise all existing playground text to 4.5:1. Add dark/light toggle. Dark remains default. | DRAFT | Fastest. No refactor. | Doesn't implement full theme system. Leaves playground as dark-default. |
| **1B — Light default, theme system** | Flip default to `csps-light`. Build theme registry. Dark = VARIETY. All playground pages refactored. | REFINED | Implements Platform Attitude correctly. Prepares for 30-app theme inheritance. | Large refactor. 2-3 sessions of work. |
| **1C — System preference default** | DEFAULT = OS setting (prefers-color-scheme). Both light + dark tokens complete. Theme registry parallel. | DRAFT | Most technically correct for Platform Attitude. | Requires complete dual-token system. Complex. |

**Platform recommendation:** 1B — implements the architecture correctly from the start. The refactor is an investment in the foundation the 30 apps inherit from.

---

### OPTION SET 2 — Alignment Questions Placement [REFINED]

**Baseline:** UX-CORE.md Law 2 (Progressive Disclosure) + Law 1 (Context Before Content). Questions that help the user answer a question belong NEAR that question.

| Option | Description | Status | Pros | Cons |
|---|---|---|---|---|
| **2A — Integrated into flow** | Platform shows question → below it: `▸ 3 alignment questions` (collapsed). User clicks to expand before answering. | REFINED | Co-located. No sidebar needed. Platform Attitude: default=collapsed, variety=expanded. | Requires user to know to click. |
| **2B — Phase intro modal** | Before each phase starts, a modal shows: "Phase 3 — Clarification: [3 alignment questions]. Read and click to begin." | DRAFT | Forces reading. Strong pause point. | Interrupts flow. Modal is aggressive. |
| **2C — Persistent drawer** | Right side becomes a collapsible drawer. Closed by default. Toggle in header. | DRAFT | Space efficient. Non-intrusive. | Not co-located with the question it supports. |

**Platform recommendation:** 2A — implements collapsibility standard, keeps everything in the main flow, respects progressive disclosure.

---

### OPTION SET 3 — Message Visual Differentiation [REFINED]

**Baseline:** R4 Corrected — every element telegraphs its required response.

| Option | Description | Status | Pros | Cons |
|---|---|---|---|---|
| **3A — Icon differentiation** | `ℹ` = status (no action) · `?` = question (response needed) · `⚠` = warning (attention needed). Consistent across ALL platform messages. | VALIDATED | Scannable. Universal pattern (recognized everywhere). Matches UI-CORE Law 2. | Requires all existing messages to be updated. |
| **3B — Border color** | Status = grey border · Question = indigo border + "Your response ↓" below · Warning = amber border | REFINED | Clear semantic color system. Already in design-tokens. | Requires learning the color mapping. |
| **3C — Shape + weight** | Status = flat card · Question = slightly elevated card + cursor affordance on response area · Warning = bordered with icon | DRAFT | Shape is more universal than color (works for color-blind users). | More complex to implement consistently. |

**Platform recommendation:** 3A for immediate implementation (icon is fastest and most universal), 3B as the longer-term system (integrates with design tokens). These are complementary, not exclusive.

---

### OPTION SET 4 — Spine Content Dashboard [REFINED]

**Baseline:** Governor directive — manage UX/UI spine content with: change order, edit, delete, add, change hierarchy, sort, collapse, upload file, download parts or all.

| Option | Description | Status | Pros | Cons |
|---|---|---|---|---|
| **4A — Structured table + inline CRUD** | Each spine file = a table page. Rows = principles. Sort by drag. Inline edit. Status chips. Download YAML/JSON. | REFINED | Fast to build. Familiar pattern. Works for governance-focused users. | Table view loses hierarchy context (pillars, layers). |
| **4B — Document-style with blocks** | Each principle = a draggable block. Collapse/expand. Inline edit. Attach uploads. Export section or all. | DRAFT | Preserves hierarchy. Familiar (Notion-like). | More complex to build. |
| **4C — Tree + property panel** | Left: tree of all spines → pillars → principles. Center: selected item's content. Right: metadata + enforcement trio. | DRAFT | Full hierarchy visible. Figma-like experience (which Governor referenced). | Most complex. 3-panel requires careful layout. |

**Platform recommendation:** 4A for MVP (build this session), 4C as the target architecture (matches the Core Spine's hierarchical nature, aligns with Figma reference).

---

### OPTION SET 5 — Wiring Existing Research [REFINED]

**Baseline:** 6 UX/UI files exist, sealed, none wired into enforcement. S059 ratification questions never answered.

| Option | Description | Status | Pros | Cons |
|---|---|---|---|---|
| **5A — Read-only dashboard pages** | `/platform/ux` and `/platform/ui` render the sealed files as readable reference. No editor. | DRAFT | Fast. Makes research visible immediately. | No management capability. |
| **5B — Merge into Core Spine Creator** | Populate the creator's inventory panel with relevant UX/AI principles when user is creating a UX-touching spine. | REFINED | Contextual. Reduces friction in the right moment. | Only visible during creation, not for general reference. |
| **5C — Full governance dashboard + answer S059 questions** | Build `/platform/ux-spine` with full CRUD. Answer the 3 S059 ratification questions Opus never answered. Seal UX-PATTERNS-RESEARCH.md into L2 files. | VALIDATED | Closes the S059 debt. Makes all 6 files governable and manageable. | Requires answering the S059 questions first (Opus decision). |

**Platform recommendation:** 5C — the S059 ratification debt has been open since session 59. UX-PATTERNS-RESEARCH.md itself says "awaiting Opus ratification." Closing this is the highest-value action. 5A as an immediate milestone while 5C is being built.

---

## PART 7 — PROFESSIONAL SOURCES (Beyond Figma)

*Governor noted Figma was a SAMPLE. Best sources for CSPS design standards:*

| Source | What it provides | How CSPS uses it |
|---|---|---|
| **Nielsen Norman Group (nngroup.com)** | 30 years of UX research, 10 heuristics, 300+ research reports | Foundation for UX-CORE.md 3 Laws + 8 Elements |
| **Interaction Design Foundation (IDF)** | Fitts's Law, Hick's Law, Miller's Law, Gestalt laws | UX-UI-STANDARDS.md Part 2 |
| **Apple Human Interface Guidelines (HIG)** | Platform-native patterns, accessibility standards, motion design | Component state standards |
| **Google Material Design 3** | Systematic design tokens, component specifications, adaptive layouts | design-tokens.yaml structure |
| **Vercel's Geist Design System** | Developer-focused, minimal, high-density, monospace-friendly | Playground visual system (most relevant to CSPS) |
| **Radix UI + Tailwind UI** | Accessible primitive components + utility-first patterns | Component library candidates |
| **WCAG 2.1 (W3C)** | Accessibility standards — contrast, keyboard navigation, ARIA | Mandatory compliance floor |
| **Figma Community** | Real-world design system examples, component libraries | Reference implementations |

*CSPS's position:* We pull PRINCIPLES from NNg/IDF (the research base), SPECIFICATIONS from Material/HIG (the implementation base), TOKENS from Geist (the developer-tool aesthetic), and COMPLIANCE from WCAG (the non-negotiable floor).

---

## PART 8 — OPEN QUESTIONS FOR OPUS RATIFICATION

*(These must be answered before any section above can be sealed)*

1. **S059 ratification debt**: The 3 ratification questions in UX-PATTERNS-RESEARCH.md were never answered. Answer now: (a) Build UX-PAGE-TYPES.md as sealed L2? (b) Responsiveness as its own file? (c) UX-DEVELOPER.md + UX-APP-USER.md as separate files?

2. **Theme DEFAULT**: What is CSPS's default theme? `csps-light` (Governor recommendation) or something else?

3. **Option Set status promotion**: Which options above should be promoted from REFINED → VALIDATED → SEALED based on this session? Minimum: 1B, 2A, 3A, 5C.

4. **Rigidness Agent as GVRN principle**: Should this become a formal P-GVRN-NNN principle, a B_* contract, or remain a session-level practice?

5. **Theme dashboard**: Build now (5A MVP) or queue for S073?

6. **Focused issues vs Flows**: Create formal validation protocols for each? Or remain as conceptual distinction?

7. **Collapsibility standard**: Add to UX-CORE.md as Law 4, or create as L2 domain file?

---

*Status: DRAFT — for Opus review and ratification.*
*Authored: Sonnet S072 · 2026-05-31*
*Compiled from: UX-CORE.md + UI-CORE.md + UX-UI-STANDARDS.md + UX-PATTERNS-RESEARCH.md (draft) + design-tokens.yaml + Governor S072 sessions*
