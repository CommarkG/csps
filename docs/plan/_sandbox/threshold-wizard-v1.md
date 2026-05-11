---
id: csps.sandbox.threshold-wizard.v1
name: threshold-wizard-v1
description: Sandbox spec v1 for the CSPS Threshold Wizard — the AI-mediated intent clarification system. Open question → AI interpretation → 1-3 targeted questions → verified template match → ratified path declaration.
version: 1
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
simulation_status: pending
ratified_by: ~
ratified_at: ~
sandbox_for: Threshold Wizard — browser page at /schema/wizard + routing.config.ts AI engine
threshold_route: ux.onboarding-flow
intent_crystallized: true
ux_principle: jtbd-outcome-first
---

## §CONTEXT

**What this designs:** An interactive wizard that helps anyone — developer, business user, or external visitor — clarify their true intent before starting any work. The wizard replaces vague verbal descriptions with a verified, declared routing path.

**The JTBD outcome:** "When this wizard exists, a developer or business user can go from 'I have an idea' to 'I know exactly which protocols to follow and which pillars to consult' in under 3 minutes — without needing to know CSPS vocabulary in advance."

**Why this matters:** Accurate goal setting prevents multiple drifts. One clarification at the start saves 3-4 sessions of rework.

**Surface:** Browser page at `/schema/wizard` — public, no auth required. Works for: developers building on CSPS, business users requesting features, external users exploring what CSPS does.

---

## §SPEC

### SCREEN 0 — Entry (always visible, no interaction needed)

**Page location:** `http://localhost:3002/schema/wizard`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  ← Back to Schema                                   │
│                                                     │
│  🧭  The Threshold                                  │
│                                                     │
│  "What's on your plate today?"                      │
│                                                     │
│  Tell us what you're working on — in your own       │
│  words. The platform will figure out the path.      │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Type anything here...                      │   │
│  │                                             │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Examples to get you started:                       │
│  · "I want to track my daily habits"               │
│  · "We need team billing for our SaaS"             │
│  · "I'm building a feature for users to comment"   │
│  · "Something feels off about our onboarding"      │
│                                                     │
│  [  →  What's my path?  ]                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Copy:**
- Page heading: `🧭  The Threshold`
- Sub-heading: `"What's on your plate today?"`
- Body text: `Tell us what you're working on — in your own words. The platform will figure out the path.`
- Placeholder: `Type anything here...`
- Examples heading: `Examples to get you started:`
- Examples:
  - *"I want to track my daily habits"*
  - *"We need team billing for our SaaS"*
  - *"I'm building a feature for users to comment"*
  - *"Something feels off about our onboarding"*
- Button: `→  What's my path?`
- Back link: `← Back to Schema` (goes to /schema)

**Behavior:** User types → clicks button → goes to SCREEN 1

---

### SCREEN 1 — AI Interpretation + Clarification (0-3 questions)

**What happens here:** The platform interprets the user's input and asks the ONE question that resolves the biggest ambiguity. Maximum 3 questions before it commits to a template.

**Layout pattern (repeated up to 3 times):**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Got it. You said:                                  │
│  "[user's exact input quoted here]"                 │
│                                                     │
│  One question to point you in the right direction:  │
│                                                     │
│  [THE QUESTION]                                     │
│                                                     │
│  ○  [Option A — example-driven, concrete]          │
│  ○  [Option B — example-driven, concrete]          │
│  ○  [Option C — example-driven, concrete]   (if 3) │
│  ○  None of these — let me describe more           │
│                                                     │
│  [  ←  Back  ]              [  →  Continue  ]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**The clarification questions (decided at runtime by AI matching intent_signals):**

**Q1 — most common first branch:**

When input contains: track, habit, personal, daily, myself, health, journal, goals
→ Ask: *"Is this something you're tracking for yourself, or something your team will use?"*
→ Options:
  - Just me — I'm tracking something personal
  - My team — we're building this together

When input contains: billing, payment, subscription, seat, team, member, invite, upgrade
→ Ask: *"Are you changing what users can pay for, or who can access what?"*
→ Options:
  - What they pay for (pricing, plans, subscriptions)
  - Who gets access (roles, permissions, team tiers)

When input contains: page, screen, UI, dashboard, view, show, display, button, form
→ Ask: *"Is this screen mainly for reading information or for taking an action?"*
→ Options:
  - Mainly reading / displaying (dashboard, report, list)
  - Mainly doing / submitting (form, wizard, action)

When input contains: model, entity, database, store, schema, field, table
→ Ask: *"Is this new data, or a change to how existing data is stored?"*
→ Options:
  - Brand new data the app doesn't track yet
  - Changing existing data (new field, new relationship)

When input contains: validator, contract, principle, governance, hook, audit, rule, enforce
→ Ask: *"Are you adding a new rule, or enforcing an existing one better?"*
→ Options:
  - New rule or contract that doesn't exist yet
  - The rule exists but isn't mechanical yet

When input contains: onboarding, first time, signup, new user, activation, welcome
→ Ask: *"Where exactly is the friction? When does a user get stuck?"*
→ Options:
  - At sign-up (the account creation flow)
  - After first login (they're in but don't know what to do)
  - When trying to invite teammates
  - I'm not sure — I just know users are dropping off

**Q2 (if needed after Q1 — further narrowing):**

Only asked if Q1 answer still leaves 2+ possible templates. Examples:

After "Just me — I'm tracking something personal":
→ *"How often will you interact with this?"*
→ Options:
  - Multiple times a day (exercise, meals, mood)
  - Once a day (end-of-day reflection, daily goals)
  - When something happens (log an event, not scheduled)

After "Changing who gets access":
→ *"Are you making something more restricted or more open?"*
→ Options:
  - More restricted (admins only, removing access from members)
  - More open (giving members something admins had)

**Q3 (rare — only if 2 questions still leave ambiguity):**
A single yes/no that disambiguates the final 2 templates.

---

### SCREEN 2 — Template Match + Path Declaration

**What happens here:** Based on answers, a template is matched. The user sees their verified path.

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ✅  Your path is clear.                           │
│                                                     │
│  Based on what you shared, you're working on:      │
│                                                     │
│  [TEMPLATE LABEL — human readable]                  │
│                                                     │
│  "When this is done: [JTBD OUTCOME]"                │
│                                                     │
│  ─────────────────────────────────────────────     │
│                                                     │
│  Your route through the platform:                   │
│  Pillar [N] → Pillar [N] → Pillar [N]              │
│  [Pillar badges with icons and names]               │
│                                                     │
│  The steps to follow:                              │
│  1. [STEP 1 TITLE] — [ACCEPTANCE CRITERION]        │
│  2. [STEP 2 TITLE] — [ACCEPTANCE CRITERION]        │
│  3. [STEP 3 TITLE] — [ACCEPTANCE CRITERION]        │
│  ...                                                │
│                                                     │
│  ─────────────────────────────────────────────     │
│                                                     │
│  Declare this path in your plan:                   │
│  ┌───────────────────────────────────────────┐     │
│  │  threshold_route: [template-id]           │ 📋  │
│  │  intent_crystallized: true               │     │
│  │  jtbd_outcome: "[outcome text]"          │     │
│  └───────────────────────────────────────────┘     │
│  [Copy to clipboard]                               │
│                                                     │
│  Not right? [Start over] or [I need a different path]│
│                                                     │
│  [  ←  Back  ]        [  Save as PDF  ]  [  Done ✓]│
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Copy patterns:**
- Top line: `✅  Your path is clear.`
- Intro: `Based on what you shared, you're working on:`
- Template label: `[TEMPLATE LABEL from routing.config.ts]`
- Outcome: `"When this is done: [jtbd_outcome_prompt]"`
- Route section heading: `Your route through the platform:`
- Steps heading: `The steps to follow:`
- Declaration section heading: `Declare this path in your plan:`
- Copy button: `📋` (icon only, tooltip: "Copy to clipboard")
- Escape hatch: `Not right? [Start over] or [I need a different path]`
- Bottom: `[← Back]  [Save as PDF]  [Done ✓]`

**The `[I need a different path]` button:** Shows a dropdown of all 9 templates as human-readable options. User can select directly. This prevents dead-ends.

---

### SCREEN 3 — Fallback (when AI can't classify confidently)

**Trigger:** After 3 questions, confidence is still below threshold OR user clicked "None of these" twice.

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🤔  This one needs a human eye.                   │
│                                                     │
│  The platform couldn't confidently classify your   │
│  work automatically. That's okay — some things     │
│  are genuinely complex.                             │
│                                                     │
│  Pick the closest path manually:                   │
│                                                     │
│  ○  Building a new data entity / model             │
│  ○  Building a new page or screen                  │
│  ○  Adding an API or integration                   │
│  ○  Billing or subscriptions                       │
│  ○  Roles or permissions                           │
│  ○  First-time user experience                     │
│  ○  Platform governance (validator, contract)       │
│  ○  Personal tracking app                          │
│  ○  Documentation or architecture                  │
│  ○  None of these — this is something new          │
│                                                     │
│  [  ←  Back  ]              [  →  Use this path  ] │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## §SCENARIOS

Three scenarios to use during simulation:

**Scenario 1 — Developer building new feature:**
- Input: *"I need to add a way for users to leave comments on tasks"*
- Expected path: developer.new-entity (comment is a new data entity)
- Q1: "Is this new data, or a change to existing data?" → New data
- Expected template: developer.new-entity
- Outcome display: "Building a new data entity / domain model"

**Scenario 2 — Business user with billing concern:**
- Input: *"We want teams to pay for more seats when they grow"*
- Expected path: business.billing
- Q1: "Are you changing what they pay for, or who gets access?" → What they pay for
- Expected template: business.billing
- Outcome display: "Add or modify billing, subscriptions, or pricing"

**Scenario 3 — Non-technical user, personal app:**
- Input: *"Something to help me track my morning routine"*
- Expected path: personal.tracking
- Q1: "Is this for yourself or your team?" → Just me
- Q2: "How often?" → Multiple times a day
- Expected template: personal.tracking
- Outcome display: "Build a personal domain app feature"

---

## §SIMULATION
[TO BE FILLED — after Governor approves the spec]
  Scenario 1 result: pending
  Scenario 2 result: pending
  Scenario 3 result: pending
  simulation_status: pending

---

## §RATIFICATION
[TO BE FILLED — after simulation passes]
  Governor approval: ~
  Date: ~
  Conditions: ~

---

## §OPEN QUESTIONS FOR GOVERNOR

**Q1:** The back-navigation (`← Back to Schema`): should clicking Back go to /schema, or is there a different preferred destination?

**Q2:** The "Save as PDF" button on Screen 2: useful or unnecessary complexity for v1? Could remove.

**Q3:** The examples on Screen 0: are the 4 examples the right ones? Should they be changed to match what's most common in real usage?

**Q4:** Screen 3 (fallback): the 9 template names as human-readable labels — do these feel clear to a non-technical user? "Platform governance (validator, contract)" might be jargon. Suggest: "Improving how the platform works internally"?

---

*Threshold Wizard Sandbox v1 | 2026-05-11 | Sonnet Builder*
*Awaiting Governor review. Change anything. Ask for v2 if needed.*
