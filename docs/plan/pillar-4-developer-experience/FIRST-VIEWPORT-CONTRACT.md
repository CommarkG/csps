---
id: csps.pillar-4.first-viewport-contract
name: FIRST-VIEWPORT-CONTRACT
description: >
  The First Viewport Contract (FVC) — CSPS governance standard for the first visible screen
  of every route, state, role, and responsive breakpoint. Synthesized from Grok, Haiku, Kimi,
  Gemini, GPT, and CSPS-original research (Governor S089). Hard gate: no screen ships without it.
version: "1.0"
owner: group:finky
authored_by: Sonnet S089 — synthesis of 5 external sources + CSPS-original
core_spine: ARCH
schema_anchor: pillar_4_leaves
diataxis_type: reference
lifecycle: production
lifecycle_state: active
session: S089
impl_status: swift-implemented
gate_level: hard_gate
blocking: true
applies_to:
  - all platform routes
  - all customer journey shell steps
  - all SaaS app first screens
  - all responsive breakpoints
  - all user roles and states
enforcement:
  T1: pre-tool-use hook (pre-build FVC declaration check)
  T2: validate-fvc.mjs (static + responsive + AI semantic)
  T3: this document + ux-parameters.yaml + AGENTS.md hard-NO + oneclick STARTUP AUDIT
links:
  - { rel: parameters, href: ../../../tools/data/ux-parameters.yaml }
  - { rel: validator, href: ../../../tools/validators/validate-fvc.mjs }
  - { rel: dashboard, href: https://csps-playground.vercel.app/platform/ux-parameters }
  - { rel: parent, href: ./ux-ui-dna.md }
---

# First Viewport Contract (FVC)

## The FVC Gate Law

**No screen is shippable until its first viewport proves orientation, action, recommendation,
help, navigation, input fitness, and responsive continuity.**

This is not a guideline. It is a blocking gate.

---

## 1. Definition

The **First Viewport Contract** is the mandatory UX/UI contract for the first visible screen
of every route, state, role, and responsive breakpoint. It must immediately answer seven
questions a user asks within 3 seconds of landing:

1. **Where am I?** (Location / Context)
2. **What can I do here?** (Available Options)
3. **What is recommended?** (Guided Choice)
4. **Why does this serve my need?** (Value Proposition)
5. **How can I ask for help or correct the system?** (Support Access)
6. **How do I move — back, forward, or out?** (Navigation Control)
7. **How do I perform the task my way?** (Multi-Modal Input)

**Critical distinction:**
- "First screen" = marketing term, too shallow
- "Above the fold" = too desktop-biased
- "Hero section" = too branding-focused
- **FVC** = a contract — signed at creation time, enforced at verification, re-validated at each breakpoint

The FVC is not a "hero section." It is a **cognitive orientation instrument**.

---

## 2. The Seven Pillars

Every FVC must satisfy all seven pillars. A screen that fails any single pillar fails the gate.

| Pillar | Dimension | Review Question | Failure Pattern |
|--------|-----------|----------------|-----------------|
| **P1: Orientation** | Where am I? | Can the user state their location in 2 words without reading? | User asks "Wait, where did I land?" |
| **P2: Navigation** | What are my options? | Are 2–5 options visible and ranked by priority? | Option flood or zero-option blank |
| **P3: Guidance** | What is recommended? | Does the recommended action have 2× visual weight? | Equal-weight options = Hick's Law paralysis |
| **P4: Value Alignment** | Why does this serve me? | Does the headline use a benefit verb, not a feature noun? | "Dashboard Overview" vs "See what needs your attention" |
| **P5: Interactivity** | Can I ask or interact? | Is a help/ask affordance visible — not buried in a hamburger? | User stranded with no escape |
| **P6: Continuity** | Can I move back/forward? | Are back/forward/undo visible or one gesture away? | State loss fear prevents exploration |
| **P7: Multimodality** | Can I execute natively? | Does the primary task support ≥2 input modalities? | Text-only when voice or photo would be faster |

### The Scroll Extension

The seven pillars cascade downward. Every major scroll section (viewport-height of content)
is a **micro-FVC**: it must re-establish context, show section-specific options, maintain
help access, and respect the cognitive budget. "Below the fold" is not secondary — it is a
serial sequence of mini first screens.

Each scroll section must answer:
- What is THIS section for?
- Why am I seeing it NOW?
- What can I do HERE?
- How does it connect to the primary task?
- Can I return to the main action?

---

## 3. Cognitive Baselines (Thresholds)

These are the enforceable numbers. All live in `tools/data/ux-parameters.yaml` and are
adjustable without re-engraving this document.

| Parameter | Value | Basis | Source |
|-----------|-------|-------|--------|
| `orientation_window_seconds` | 3 | Time to resolve "where am I" | Kimi (current research 2026) |
| `value_clarity_window_seconds` | 20 | Time to resolve "is this for me" before bounce | NN/g via GPT |
| `primary_cta_max` | 1 | One primary action per viewport | All sources |
| `secondary_cta_max` | 3 | Secondary actions remain subordinate | GPT FVC-05 |
| `cognitive_chunks_max_primary` | 4 | Miller's Law ±1 for competing attention | Kimi (cognitive science) |
| `cognitive_chunks_max_elements` | 9 | Total interactive elements before warning | Haiku |
| `cognitive_chunks_hard_block` | 12 | Total elements → hard fail | Haiku |
| `thumb_zone_pct` | 67 | Primary action in bottom 2/3 of mobile | Kimi Thumb Rule |
| `lcp_ms` | 2500 | Largest Contentful Paint threshold | Kimi / Core Web Vitals |
| `orientation_render_ms` | 100 | Orientation elements must render in first 100ms | Kimi |
| `bounce_rate_limit` | 0.40 | First-screen bounce alert threshold | Kimi |
| `scroll_recovery_signal` | 0.10 | Upward scroll % = missed critical content | Kimi |
| `time_to_first_interaction_s` | 5 | >70% of users must interact within 5s | Kimi |

---

## 4. Content Carrier Questions (FVC-01 to FVC-18)

These are the questions any AI or developer MUST answer before writing a single line of UI.
They are the creation-time prevention gate. They are also the review checklist.

Organized into the Priority Stack (see §5):

### Layer 1 — Orientation (always first)

| ID | Question | Required Output |
|----|----------|----------------|
| FVC-01 | What is this screen called in user language, not developer language? | Clear title / heading — benefit-focused |
| FVC-02 | Can the user know where they are in the journey/product/task? | Breadcrumb, step label, section marker |
| FVC-03 | What is the user's current need — one sentence? | One-sentence need statement |
| FVC-11 | Does the user know whether this is draft, active, incomplete, blocked, or done? | Status/progress indicator |

### Layer 2 — Decision Gate (ask before showing content)

| ID | Question | Required Output |
|----|----------|----------------|
| FVC-06 | What does the system recommend next, and WHY? | Recommended action + explicit reason |
| FVC-04 | What is the ONE primary task the user is expected to do here? | Primary action — verb-labeled |

**Decision-Tree-First Rule (CSPS-original):**
If the user's next step forks, ask FIRST — then show content only for the chosen route.
Do NOT show content for all routes and then ask the user to choose at the bottom.
This prevents "information dump → then route choice" which is the pattern that failed in
the Governor's test-drive of Step 2.

### Layer 3 — Route-Specific Content (shown only after choice)

| ID | Question | Required Output |
|----|----------|----------------|
| FVC-05 | What are 2–5 secondary legitimate options? (not everything) | Secondary options, visually subordinate |
| FVC-07 | Why does this screen/action advance the user's goal? | Benefit or relevance statement |
| FVC-13 | What proof, source, or confidence signal does the user need? | Trust/evidence carrier |
| FVC-16 | What does this screen show when there is no data, loading, or failure? | Empty/loading/error variants |

### Layer 4 — Depth Options (opt-in, never forced)

| ID | Question | Required Output |
|----|----------|----------------|
| FVC-14 | What must remain visible on mobile, tablet, and desktop? | Breakpoint-specific priority map |
| FVC-15 | When the user scrolls, how does orientation and action continuity persist? | Sticky nav, repeated CTA, section headings |

### Layer 5 — Escape + Help (always available, visually secondary)

| ID | Question | Required Output |
|----|----------|----------------|
| FVC-08 | Can the user override, skip, edit, go back, or choose another path? | Back / edit / alternative route |
| FVC-09 | Can the user ask a question or request help from here? | Help/ask affordance |
| FVC-10 | Can the expected task be done via ≥2 input modalities? | Input-mode decision |
| FVC-12 | What mistake is likely here, and how does the screen prevent it? | Warning, validation, confirmation only when needed |
| FVC-17 | Can the screen be used with keyboard, pointer, screen reader, voice? | Accessibility acceptance checks |
| FVC-18 | How will we VERIFY the user can start or complete the task? | Test scenario (maps to DONE=activation-proven) |

---

## 5. The Priority Stack (CSPS-original)

This is the ordering principle for ALL content on a first viewport.
The ordering determines what the user sees and when.

```
Layer 1: ORIENTATION (always first, always visible)
  → Echo of current location + what just happened (Contextual Continuity)
  → "Where am I" is NEVER below the fold

Layer 2: DECISION GATE (if path forks — ask BEFORE showing content)
  → User chooses route first
  → Content for chosen route appears only AFTER choice
  → NEVER: show all routes → ask user to pick at the bottom

Layer 3: ROUTE-SPECIFIC CONTENT (shown only for the chosen path)
  → What exists / what's recommended / what was found
  → Serves the route the user chose

Layer 4: OPTIONAL DEPTH (always last, always opt-in)
  → "Go deeper" / "See alternatives" / "Want more?"
  → User explicitly opts in — never default-expanded

Layer 5: ESCAPE + HELP (always available, visually secondary)
  → Back / Undo / Help / Ask / Correct
  → Never in Layer 1-4 position
  → Floats independently of scroll position
```

---

## 6. AI Counter-Default Rules

The default behavior of AI (and engineers) optimizes for feature density, recommendations on
first load, and assuming the user has system context. These are all wrong for human users.

**The Human User Model (CSPS Standard):**
- Narrow, focused context (ONE task at a time — not a system map)
- Working memory: 4±1 chunks competing for primary attention
- Interrupted constantly — the first screen is their anchor
- Operates by recognition, not recall (show options, don't make them remember paths)
- Processes left-to-right, top-to-bottom (F-pattern desktop; single column mobile)
- Will leave in 3 seconds if orientation fails, 20 seconds if value is unclear

**AI Rules (hardwired — not suggestions):**

| Rule ID | Default to override | CSPS rule | Example |
|---------|--------------------|-----------|---------| 
| AI-1 | Show all features | ONE primary task per viewport | Single prominent CTA, not 12 options |
| AI-2 | Lead with recommendations | Ask first, recommend after first action | "What do you want to do?" → THEN suggest |
| AI-3 | Assume user has context | Re-establish context on every first screen | Never say "as mentioned above" |
| AI-4 | Text-only interaction | Multi-modal by default | Text + voice + camera present |
| AI-5 | Dense information | 4±1 primary chunks | White space is cognitive load reduction |
| AI-6 | Features described from system perspective | Benefits described from user perspective | "Save your idea" not "Submit form" |
| AI-7 | Engineer/analyst defaults | Single-threaded user model | No analytics dashboards on first screen unless that IS the user's task |
| AI-8 | Recommendations before orientation | R7: orientation → choice → recommendation | "Where am I" before "here's what we recommend" |

**Pre-Build AI Injection (fires before any JSX is written):**

```
FIRST VIEWPORT CONTRACT — MANDATORY PRE-BUILD GATE

Before writing any UI code, answer these 3 questions:
  1. WHERE AM I? (≤10 words — the headline or screen title)
  2. WHAT IS IN IT FOR THE USER? (one benefit sentence)
  3. WHAT IS THE ONE THING THEY DO NEXT? (the single primary CTA)

If you cannot answer all 3 cleanly → STOP. Clarify design before building.

Counter-engineer-defaults:
  ✗ Do not showcase all features on the first screen
  ✗ Do not lead with AI recommendations before user orients
  ✗ Do not assume retained context from prior screens
  ✗ Do not use text-only when voice/image applies
  ✗ Do not show content for routes the user hasn't chosen yet
  ✓ ONE primary action, benefit-labeled
  ✓ Location anchor visible in <100ms
  ✓ Ask before showing route-specific content
  ✓ Re-establish context explicitly on every screen
```

---

## 7. CSPS Integration — Three Levels

### Level 1: All Plans Must Include `first_viewport_contract:`

Every plan (PROTO, HANDOFF, topic-plan, unified-plan item) must declare:

```yaml
first_viewport_contract:
  route_id: "[route or screen identifier]"
  screen_name_user_language: "[what a user calls this — not developer name]"
  user_role: "[who lands here]"
  user_context: "[what they were just doing]"
  f1_where_am_i: "[headline in ≤10 words]"
  f2_primary_task: "[one action — verb-labeled]"
  f3_recommended: "[recommendation + reason]"
  f4_value: "[one sentence — benefit to the user]"
  f5_help: "[how they ask or get help]"
  f6_back_forward: "[navigation options]"
  f7_modalities: [text, voice, file, camera]
  fvc_decision_tree_position: "[does this screen have a route fork? If yes: decision gate is Layer 2 — ask before showing content]"
  responsive_breakpoints:
    mobile_320: "[what is visible without scroll at 320px]"
    tablet_768: "[primary + recommendation visible]"
    desktop_1024: "[full layout — no unnecessary density]"
  empty_loading_error:
    empty: "[what shows when no data]"
    loading: "[what shows while loading]"
    error: "[what shows on failure — always with a next action]"
  verification_test: "[how we prove the user can orient and act]"
```

A plan without `first_viewport_contract:` is **incomplete**. Not a soft warning — a gate.

### Level 2: BUILD-AUDIT Dimension (f) — FVC Gate

Every page build includes a BUILD-AUDIT dimension (f) parallel to a/b/c/d/e:

```
BUILD-AUDIT dimension f — FVC Gate:
  f1: Primary CTA visible without scrolling at 320px? (✓/✗)
  f2: Headline ≤10 words, benefit-focused? (word count)
  f3: Exactly 1 primary CTA, ≤3 secondary? (count)
  f4: Orientation marker present (step indicator, breadcrumb, or title)? (✓/✗)
  f5: Multi-modal input available where core task involves input? (✓/✗)
  f6: One-sentence-test: "This is a screen where I ___ to ___" — completes cleanly? (self-score)
  f7: Empty/loading/error states all declared? (✓/✗)
  f8: Decision-Tree-First applied if path forks? (✓/✗)

ALL f1-f8 must be ✓ for BUILD-COMPLETE claim.
```

### Level 3: Verification Validators

Five validators (to be built as `validate-fvc-*.mjs`):

| Validator | Checks |
|-----------|--------|
| `validate-fvc-orientation.mjs` | pageDNA.journeyPosition present; h1/h2 ≤10 words |
| `validate-fvc-cta.mjs` | Primary CTA count = 1; verb-labeled; high-contrast |
| `validate-fvc-cognitive-load.mjs` | Interactive element count ≤9 (warn), ≤12 (block) |
| `validate-fvc-help.mjs` | Help affordance present; accessible without scroll |
| `validate-fvc-states.mjs` | Empty/loading/error states declared in pageDNA or component |

AI Semantic Verification (run at BUILD-AUDIT):
```
You are reviewing the first viewport. Answer 10 questions:
1. Can a first-time user know where they are?
2. Can they identify the primary task?
3. Is there a recommended next action?
4. Is the reason for the recommendation clear?
5. Are alternative paths available but not competing?
6. Is there a way to ask for help?
7. Can the task be started easily?
8. Does the mobile version (320px) preserve the same contract?
9. Is the Decision-Tree pattern applied if routes fork?
10. Is anything shown because it is technically available rather than user-needed?
Verdict: PASS / FAIL / PASS-WITH-FIXES
```

---

## 8. What Was NOT Included — And Why

*(Governor S089 governance directive: every summary and plan must include what was rejected and why.)*

| What was considered | Source | Why REJECTED / not adopted |
|--------------------|--------|---------------------------|
| "Above the fold" / "hero section" terminology | All 5 sources | Too marketing-focused; doesn't convey contract/governance nature; "FVC" adopted instead |
| Haiku's ≤9 element limit as primary threshold | Haiku | Replaced with Kimi's 4±1 (Miller's Law — cognitive science basis is stronger); ≤9 kept as secondary implementation guidance |
| Gemini's "≤3 competing data points" as hard block | Gemini | Too aggressive for complex admin/governance screens where the user's actual task IS data-dense; demoted to advisory flag |
| Grok's 5-10 second first impression window | Grok | Replaced with Kimi's 3-second orientation threshold (more current) + GPT/NN/g's 20-second value clarity window (they measure different things) |
| Leading with recommendations on first screen | Grok, Haiku (implied) | Rejected via R7 principle: recommendations after the user's first orienting action, not before; prevents "recommendations before orientation" anti-pattern |
| Single time threshold for all first screens | All sources suggested one number | Different things have different windows: 3s for orientation, 20s for value clarity, 5s for first interaction; consolidated into 3 separate parameters |
| A new "cognitive orientation zone" term | Kimi | FVC is a better term for CSPS (aligns with B_* contract pattern); "cognitive orientation zone" is too long and doesn't imply enforcement |
| Merging all 20+ questions from all sources into one flat list | Grok/Haiku/Kimi/GPT each had their own list | Consolidated into 18 FVC questions organized by the Priority Stack (5 layers) — structured, not flat |
| Dashboard as real-time YAML editor (full CRUD) | Governor direction | Phase 2; Phase 1 is read-only display with "edit via file" note; building live YAML editing UI requires auth + file-write API not yet in platform |
| Decision-Tree-First principle | NOT in any external source | CSPS-original, kept because it addresses the specific failure observed in Governor's Step 2 test-drive (content dump then route choice — wrong order) |
| Contextual Continuity requirement | NOT in any external source | CSPS-original, K=2 (Gemini's "Context Continuity over Context Dumps" confirms the pattern); kept as CSPS DNA that external sources haven't named |

---

## 9. YAML Schema — `first_viewport_contract`

This is the machine-readable form. Every component declaring FVC compliance uses this shape:

```yaml
first_viewport_contract:
  # Identity
  route_id: string                  # e.g., "platform/developer-journey"
  screen_name_user_language: string # e.g., "Build Your App — Step by Step"
  user_role: string                 # e.g., "developer"
  user_context: string              # e.g., "just described their idea in Step 1"

  # Layer 1: Orientation
  f1_where_am_i: string             # ≤10 words
  f2_location_marker: string        # breadcrumb | step-indicator | title | spatial
  f11_status_visible: boolean       # draft/active/blocked/done shown?

  # Layer 2: Decision Gate
  f4_primary_task: string           # verb-labeled, one action
  f3_recommended: string            # recommendation + explicit reason
  fvc_decision_tree: boolean        # does this screen fork? if true: ask before content
  fvc_fork_routes: list             # the routes the user can choose (if fork)

  # Layer 3: Route-Specific Content
  f5_secondary_options: list        # 2-5 options, ordered by priority
  f7_value: string                  # benefit statement
  f13_trust_evidence: string        # proof/source/confidence signal
  f16_empty_state: string           # what shows when no data
  f16_loading_state: string         # what shows while loading
  f16_error_state: string           # what shows on failure (always with next action)

  # Layer 4: Depth Options
  f14_responsive_priority:
    mobile_320: list                # must-be-visible elements at 320px
    tablet_768: list
    desktop_1024: list
  f15_scroll_continuity: string     # sticky nav / repeated CTA / section headings

  # Layer 5: Escape + Help
  f8_back_forward: string           # navigation recovery
  f9_help: string                   # help/ask affordance
  f10_modalities: list              # [text, voice, file, camera]
  f12_error_prevention: string      # validation / warning / smart default
  f17_accessibility: string         # keyboard / screen reader / voice check
  f18_verification_test: string     # how we prove orientation + task completion

  # SAGD integration (CSPS-specific)
  sagd_applies: boolean             # does this screen offer depth choice?
  sagd_depth_default: string        # light | deep | none

  # Cognitive parameters (overrides from ux-parameters.yaml if declared)
  cognitive_chunks_override: null   # null = use ux-parameters.yaml defaults
```

---

*FIRST-VIEWPORT-CONTRACT v1.0 | S089 | 2026-06-28*
*Synthesized from: Grok + Haiku + Kimi + Gemini + GPT + CSPS-original*
*Gate level: hard_gate | blocking: true | ratified by: Governor S089*
*"No screen is shippable until its first viewport proves orientation, action, recommendation, help, navigation, input fitness, and responsive continuity."*
