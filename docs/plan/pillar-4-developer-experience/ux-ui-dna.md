---
id: csps.pillar-4.ux-ui-dna
name: ux-ui-dna
description: CSPS UX/UI DNA — the immutable principles governing every user-facing screen, wizard, and interaction in the platform. Customer-first moat. Strong focus on customers. Governor directive S023.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
core_spines: [ARCH, OPER, GVRN]
schema_anchor: pillar_4_leaves
domain_path: platform
tags:
  - domain:dx
  - domain:ui
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S023
impl_status: swift-implemented
ux_principle: jtbd-outcome-first
jtbd_outcome: "Every developer and user who builds on CSPS ships screens that feel natural and require no explanation"
threshold_route: platform.governance
intent_crystallized: true
links:
  - { rel: parent, href: ./README.md }
  - { rel: routing-config, href: ../../../libs/config/routing.config.ts }
  - { rel: schema-page, href: ../../../apps/task-mgmt/src/app/schema/page.tsx }
scope_level: S1
---

# CSPS UX/UI DNA

> **The platform moat is not just technical — it's experiential.**
> Every screen a CSPS app produces must feel like it was built for the user, not for the developer.
> This document is the contract for how that happens.

---

## §1 — The 7 Immutable UX/UI Principles

These are not guidelines. They are constraints. Every screen shipped from CSPS must satisfy them.

### Principle 1: JTBD-Outcome-First
**What it means:** The screen title, description, and primary call-to-action communicate the OUTCOME the user achieves — not the action they perform.

```
WRONG: "Create Project" (action)
RIGHT: "Start a project your team can track together" (outcome)

WRONG: "Audit Log" (label)
RIGHT: "Everything your team has done — searchable" (outcome)

WRONG: "Settings" (label)
RIGHT: "How your account and team work" (outcome)
```

**Why it's a moat:** Users hire software for outcomes, not features. A platform that communicates outcomes converts better, retains longer, and generates word-of-mouth referrals.

**Mechanical enforcement:** `jtbd_outcome:` required in frontmatter of any UX artifact.

---

### Principle 2: Progressive Disclosure
**What it means:** Show the minimum necessary to accomplish the current goal. Reveal complexity on demand — never all at once.

**The three levels:**
1. **Level 0 (always visible):** The primary action + current state
2. **Level 1 (on click/hover):** Related context and alternatives
3. **Level 2 (advanced):** Configuration, history, exports, admin controls

```
Tasks page example:
  Level 0: Task list + "New task" button
  Level 1: Filter by status/assignee (appears on hover or click)
  Level 2: Audit log, bulk actions, export (hidden behind "..." menu)
```

**Why it's a moat:** Users feel capable at Level 0. Power users discover Levels 1-2 naturally. No one is overwhelmed. This is how Linear, Figma, and Notion retain non-technical users while satisfying power users.

**Mechanical enforcement:** `ux_principle: progressive-disclosure` in page.tsx comment.

---

### Principle 3: Mobile-First Constraint
**What it means:** Design for the smallest screen first. Desktop is an enhancement, not the baseline.

**The constraint liberates:** When forced to fit in 375px × 667px, you eliminate everything non-essential. What remains is the core job. Desktop then gets to add progressive disclosure of Levels 1-2.

**What this means for CSPS apps:**
- Primary actions: large touch targets (min 44px × 44px)
- Navigation: bottom tab bar or hamburger (not sidebar) at mobile
- Forms: one field per screen when possible
- Text: 16px minimum (prevents mobile zoom)

**Why it's a moat:** Most enterprise SaaS is desktop-first and unusable on mobile. A CSPS app that works on mobile captures a segment that competitors ignore.

**Mechanical enforcement:** Mobile layout must be documented before desktop in any new page spec.

---

### Principle 4: One Decision Per Screen
**What it means:** Each screen asks the user to resolve exactly one ambiguity or make exactly one choice. Never put two decisions on the same screen.

```
WRONG: Sign-up form asking name + email + company + role + team size + billing plan
RIGHT: Step 1: Email only. Step 2: Name. Step 3: Are you solo or building for a team?
       (The rest derives from those 3 answers)
```

**The wizard pattern:** Multi-step flows are not friction — they are precision. Each step narrows the path until the destination is unambiguous.

**Why it's a moat:** Cognitive overload causes abandonment. One-decision-per-screen reduces abandonment by ~40% (Baymard Institute research) and produces higher-quality input because each decision gets full attention.

**Mechanical enforcement:** `ux_principle: one-decision-per-screen` in page.tsx comment.

---

### Principle 5: Example-Driven Classification
**What it means:** Never ask users to name their category. Give them 3-5 concrete examples and let them recognize their situation.

```
WRONG: "Are you building a B2C or B2B product?"
RIGHT: "Which is closest to what you're building?
  → A task manager for my team at work
  → A personal habit tracker
  → A tool I want to sell to other businesses
  → A platform feature for my SaaS"
```

**Why it's a moat:** Users don't know industry vocabulary. Examples don't require domain knowledge. This works for a first-time SaaS founder AND a senior developer equally.

**Mechanical enforcement:** Any wizard template that asks users to classify themselves MUST use examples, not labels. See routing.config.ts clarifying_questions format.

---

### Principle 6: Wizard-of-Oz Validation Before Building
**What it means:** Before automating any wizard or flow, manually simulate it 3-5 times. Watch where real users diverge from the expected path. Redesign before building.

**The protocol:**
1. Describe the flow on paper
2. Play the role of the system manually (3-5 sessions)
3. Document every divergence: "User said X when I expected Y"
4. Revise the flow based on divergences
5. THEN build

**Why it's a moat:** Automated wizards built on wrong assumptions waste build time and create abandonment. One hour of Wizard-of-Oz prevents a week of rework.

**Mechanical enforcement:** `ux_principle: wizard-of-oz-validated` declares that this was done. Template step 1 in 'ux.onboarding-flow' requires it.

---

### Principle 7: Error Prevention Over Error Correction
**What it means:** Design to prevent wrong choices rather than to handle errors after they happen.

```
WRONG: Show all options, then error if incompatible choice
RIGHT: Show only compatible options (incompatible ones hidden or disabled)

WRONG: Let user enter text then validate on submit
RIGHT: Inline validation as they type, with helpful examples as placeholder text

WRONG: Delete button with confirmation modal after click
RIGHT: Soft-delete (recoverable) with clear "undo" option, no scary modal
```

**Why it's a moat:** Error messages are UX failures. Every error message is a design flaw that should have been prevented. CSPS apps that prevent errors are trusted — users feel smart rather than corrected.

**Mechanical enforcement:** All write routes use requireWriteSubscription() BEFORE showing the write UI (not after submission). Role checks happen before form renders.

---

## §2 — UX/UI Build Protocol (mandatory sequence)

For every new screen or wizard in a CSPS app:

```
STEP 1: JTBD Statement (before any design)
  "When this screen/flow exists, [user type] can [accomplish what] in [how long]"
  → Declare as jtbd_outcome: in plan frontmatter

STEP 2: Principle Selection (before any wireframing)
  Which UX principle governs this screen?
  → Declare as ux_principle: in page.tsx top comment

STEP 3: Mobile-First Spec (before desktop)
  What does this look like at 375px × 667px?
  → Document the mobile layout first

STEP 4: Progressive Disclosure Map (before building)
  Level 0 (always): ___
  Level 1 (on click): ___
  Level 2 (advanced): ___

STEP 5: One-Decision Audit
  Count: how many distinct decisions does this screen ask?
  If > 1: split into multiple steps

STEP 6: Wizard-of-Oz Simulation (if wizard/multi-step flow)
  3 simulations minimum before building

STEP 7: Build (only after 1-6 are documented)
  Mobile → Desktop → Progressive Disclosure layers

STEP 8: Validate
  pnpm verify exit_code=0
  TypeScript 0 errors
  ux_principle comment present in page.tsx
```

---

## §3 — The Threshold + UX Connection

Every UI entry point connects to The Threshold:

```
User arrives at CSPS app
         ↓
What's on your plate today? (open question)
         ↓
AI interprets + asks 1-3 questions (CLARIFICATION ENGINE)
         ↓
Template matched (WIZARD_TEMPLATES in routing.config.ts)
         ↓
Wizard begins (applying all 7 UX principles)
         ↓
Goal crystallized → implementation begins
         ↓
Outcome delivered (what was promised in JTBD statement)
```

The Threshold IS the first UX interaction. Every app built on CSPS inherits this pattern automatically.

---

## §4 — Anti-Patterns (forbidden in CSPS apps)

| Anti-pattern | Why forbidden | Correct alternative |
|---|---|---|
| Feature enumeration ("Here's everything you can do!") | Overwhelms, no guidance | Progressive disclosure: show what they need NOW |
| Category labels without examples | Requires domain vocabulary | Example-driven classification |
| Form-then-validate | Error after effort = frustration | Inline validation + smart defaults |
| "Are you sure?" modals | Creates anxiety, slows action | Soft-delete with undo |
| Desktop-only sidebar nav | Mobile unusable | Responsive: bottom bar on mobile |
| Free-text intent capture only | Users don't know what they want | Open question → AI interpretation → template match |
| Success page with no next step | User is left stranded | Always: what do you want to do next? |

---

---

## §5 — P-UX-001: Internal Tools = External UX Standard (Governor S089 — CONSTITUTIONAL)

**"There is no lower UX bar for internal-facing surfaces."**

Every tool built for core developers — governance platform, playground pages, admin interfaces, session tooling — must comply with the same UX/UI standards as external-facing SaaS products built on CSPS.

**Why:** A developer using an internal tool IS a user. Treating internal tooling as exempt from UX discipline produces exactly the thing we claim to prevent: interfaces that require you to remember which page is what and why, with no journey coherence, no felt experience, no lovability.

**What this means in practice:**
- Every internal platform page must have `pageDNA` with `purpose`, `journeyPosition`, `feltOutcome`
- Every internal page must pass the same LOVABILITY rubric (§5 below) — self-score + test-drive
- Every internal tool must declare its journey position (where it sits in the developer flow)
- The Journey Shell pattern (see: `/` homepage shell) is the standard: one coherent flow, module pages as back-end, embedded module links for deep-dive
- BUILD-AUDIT for internal pages includes lovability dimension (e) — not just a/b/c/d mechanical checks

**Escape hatch:** Trivially-reversible scratch/debug pages exempt. Any page linked from the TopNav or the Journey Shell is NOT exempt.

**Enforcement:** validate-ux-audit.mjs (T2) · BUILD-AUDIT §e · LOVABILITY self-score + Governor test-drive

---

## §6 — LOVABILITY Rubric (S089 Opus §9 — BUILD-AUDIT dimension e)

**Source:** Ratified by Opus #25 S089. Extends BUILD-AUDIT (a/b/c/d) with a felt-experience dimension that machine validators cannot replace.

**Purpose:** Lovability is a property of the FLOW, not the page. Page-by-page principle compliance produces correct pages that do not add up to a loved journey.

**Method:** Sonnet self-scores (1-6) on each dimension after building. Governor confirms by test-driving the journey-coherent slice. Governor test-drive is the ACCEPTANCE TEST — machine score is preliminary only.

**6 Lovability Dimensions:**

| # | Dimension | What it means | PASS signal | Common GAP |
|---|-----------|---------------|-------------|------------|
| 1 | First-screen value | Value visible before any input (UX Law 1) | Purpose + concrete example above the fold | Page opens with blank form, no context |
| 2 | Zero-friction | Fewest steps to core action; no dead-ends; ≤2 clarifying questions | Single primary action; voice/file options | 5-field form on first touch |
| 3 | Honest state | Empty/loading/error/success all present + truthful (M-47) | All 4 states explicit; no silent blank | Submit → nothing visible; error = blank |
| 4 | Flow-coherence | Connects to page before/after in journey; no orphan | Bidirectional RelatedPages; journey declared in pageDNA | Page stands alone, no entry/exit |
| 5 | Delight | One intentional delight moment (micro-copy/motion/smart default) | Specific named delight mechanism | Generic placeholder text; no personality |
| 6 | Trust/reversibility | User can undo/edit; no dark patterns | "Start over" / undo always visible; costs disclosed early | Submit is one-way; no escape |

**Scoring:** Each dimension scored 1-5 or PASS/GAP. Total /30. Governor confirms felt score after test-drive.

**Engraving (how this becomes DNA, not a one-off):**
- This rubric is part of every BUILD-AUDIT for UX pages (alongside mechanical checks a-d)
- validate-ux-audit.mjs should be extended to assert lovability self-score present in the page (ADVISORY)
- Journey position + felt outcome declared in pageDNA BEFORE building (not after)

**JOURNEY-POSITION discipline (per pageDNA):**
Every UX page must declare in its `pageDNA` object:
- `journeyPosition`: where in the flow this page sits (e.g., "ENTRY — before wizard")
- `feltOutcome`: the single felt outcome the user should leave with

---

*CSPS UX/UI DNA v1.1 | S089 | 2026-06-27 — §5 Lovability Rubric added (Opus #25 ratified)*
*v1.0: S023 | 2026-05-11*
*"Strong focus on customers" — Governor directive*
*This document is constitutional: changes require ADR.*
