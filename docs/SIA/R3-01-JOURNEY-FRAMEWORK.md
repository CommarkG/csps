---
id: SIA.R3-01-JOURNEY-FRAMEWORK
type: architecture
protection_level: protected
status: ratified
core_spines: [ARCH, OPER]
context_question: "What is the complete option space for developer and user journeys in CSPS, and how does orchestration select the right bundle per persona?"
context_quote: "L3 journeys are not designed by hand. They are generated from the L2 option space by the orchestrator."
version: "1.0"
session: S056
name: "SIA-R3-journey-framework"
description: "L1/L2/L3 journey architecture — complete option space, orchestrated bundles"
owner: "group:finky"
lifecycle: "production"
lifecycle_state: "active"
inherits_from: "Platform Genome §7 Phase Build Order + CORE-COMPLETE-EXIT-CRITERIA.md Layer 3 + R2-01-PLATFORM-INTELLIGENCE-ENGINE.md §5 Scope Router"
---

# R3 — Journey Framework

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> Design: RATIFIED S056 | Build target: S057-S058

---

## 1. Why L1→L2→L3 Matters

**The problem with designing specific journeys:** Design for persona A → persona B arrives → journey is wrong → redesign. Persona C → redesign again. CSPS builds 30 apps, each serving multiple personas. Manual per-persona journey design = unsustainable combinatorial explosion.

**The SIA solution:** Design the full L2 option space once. The orchestrator generates L3 journeys from it. When a new persona arrives, the orchestrator selects a different combination of existing L2 options — no new design required, only new selection.

**The analogy to Template Bundle System (R1-08):** Instead of rebuilding capabilities for each app, you seal them into bundles and apps inherit. Journeys follow the same principle: seal options into the L2 option space, orchestrate L3 instances at runtime.

**What changes when the L2 option space is complete:**
- Adding persona X costs ~0 design work (select existing options, weight them)
- Adding a new stage option costs 1 design decision (add to L2, all personas benefit)
- Every journey is testable because it's a combination of known, bounded options

---

## 2. L1 — Journey Principles (Sealed)

Universal principles applying to every journey — developer and user:

1. **Entry condition:** A journey only starts when a defined trigger fires. No trigger = no journey. The trigger is explicit, not implicit.

2. **Stages:** Every journey is a linear sequence of named stages. Each stage has:
   - `entry_condition`: what must be true for this stage to activate
   - `option_space`: 2–5 discrete options, each tagged
   - `exit_condition`: what must be true to advance to the next stage
   - `failure_mode`: what happens if the stage is abandoned

3. **Option tagging:** Every option in every stage carries:
   ```yaml
   activatable: true | false
   friction_score: 1-5  # 1=frictionless, 5=high effort
   value_delivered: 1-5  # 1=minimal, 5=high
   persona_weights: { [persona_id]: 0.0-1.0 }
   ```

4. **First value moment rule:** The first `value_delivered ≥ 4` option must occur within the first 3 stages. If no stage in positions 1-3 delivers value ≥ 4 for a given persona, the journey is structurally broken.

5. **Exit condition:** Every journey terminates in one of: `goal_achieved` | `churned` | `transformed`. No journey is open-ended.

6. **Orchestration hook:** At every stage transition, the PIE Scope Router can re-evaluate the persona signal and adjust the next stage selection. Journeys adapt mid-flow.

---

## 3. L2 — The Developer Journey Option Space

**Entry condition:** A developer accesses the CSPS platform for the first time (or starts a new app build).

### Stage 1 — ORIENT

| Option | Friction | Value | When to select |
|---|---|---|---|
| Read Platform Genome | 2 | 3 | Returning developers, governance-focused |
| Explore Playground | 1 | 4 | Visual learners, first-timers |
| Cold start | 1 | 2 | Experienced CSPS developers, repeat builds |

**Exit condition:** Developer can answer "what does CSPS build?" without reading docs.

### Stage 2 — PLAN

| Option | Friction | Value | When to select |
|---|---|---|---|
| Full 7-section wizard | 4 | 5 | New apps, unknown domain |
| Lightweight 4-section wizard | 2 | 4 | Familiar domain, clear idea |
| Fork-from-existing | 1 | 3 | Near-duplicate of existing app |
| Minimal stub | 1 | 2 | Internal experiments only |

Threshold appears here: every plan item passes through Threshold intake before entering the wizard. Input → classify → PE score → wizard pre-populated.

**Exit condition:** Plan item with all required sections + PMI 5/5.

### Stage 3 — BUILD

| Option | Friction | Value | When to select |
|---|---|---|---|
| Fork from template | 2 | 5 | Standard new app |
| Fork from existing app | 1 | 4 | Near-duplicate |
| Green field | 4 | 3 | Platform infrastructure only |

**Exit condition:** First `pnpm --filter @csps/[app] build` passes.

### Stage 4 — VALIDATE

| Option | Friction | Value | When to select |
|---|---|---|---|
| Full pnpm verify | 2 | 5 | Always (standard) |
| Quick smoke test | 1 | 3 | Micro-fixes only |

**Exit condition:** `pnpm verify exit_code=0` with new app included.

### Stage 5 — DEPLOY

| Option | Friction | Value | When to select |
|---|---|---|---|
| Vercel auto-deploy | 1 | 5 | Standard (Gate 3 Vercel config) |
| Staging only | 1 | 3 | Pre-production review required |

**Exit condition:** Production URL responds 200. No Vercel build errors.

### Stage 6 — EVALUATE

| Option | Friction | Value | When to select |
|---|---|---|---|
| Activate monitoring | 2 | 4 | First users expected |
| A/B test variant | 3 | 5 | Multiple design hypotheses |
| Silent observation | 1 | 2 | Internal testing phase |

**Exit condition:** ≥1 session evidence captured. Build added to evidence registry.

---

## 4. L2 — The User Journey Option Space

**Entry condition:** A user lands on any CSPS-built app.

### Stage 1 — DISCOVERY

| Option | Friction | Value | When to select |
|---|---|---|---|
| Organic search | 1 | 3 | SEO-optimized apps |
| Referral | 1 | 5 | Word of mouth (highest trust) |
| Direct URL | 1 | 4 | Returning or invited users |
| API integration | 2 | 4 | Developer-facing apps |

**Exit condition:** User lands on app homepage. Bounce_rate < 80%.

### Stage 2 — ONBOARDING

| Option | Friction | Value | When to select |
|---|---|---|---|
| Context-capture (3 questions) | 2 | 5 | Personalization-heavy apps |
| Role-calibration | 1 | 4 | Apps with distinct user types |
| Problem-statement | 2 | 4 | Solution-seeking users |
| Preference-setup | 2 | 3 | UX-preference-sensitive apps |
| Skip | 0 | 1 | Power users, developer testing |

**Exit condition:** BehaviorProfile has ≥1 signal. AI has enough context to start.

### Stage 3 — FIRST VALUE MOMENT

| Option | Friction | Value | When to select |
|---|---|---|---|
| Auto-categorized result | 0 | 5 | Apps with intelligent sorting |
| Guided first action | 1 | 4 | Apps with complex core loop |
| Curated example | 1 | 3 | Apps where blank state is confusing |

**L1 rule check:** This is stage 3. value_delivered must be ≥ 4 for the selected option or the journey is broken.

**Exit condition:** User visibly reacts to the first result ("this is for me" moment).

### Stage 4 — HABIT FORMATION

| Option | Friction | Value | When to select |
|---|---|---|---|
| Daily reminder | 1 | 4 | Attention-management apps |
| Streak tracking | 1 | 4 | Behaviour-change apps |
| Progress visualization | 1 | 5 | Goal-tracking apps |
| Autonomous (no reminders) | 0 | 3 | Power users, low-friction preference |

**Exit condition:** User initiates app action WITHOUT a prompt (3+ times).

### Stage 5 — TRANSFORMATION

| Option | Friction | Value | When to select |
|---|---|---|---|
| Power user migration | 2 | 5 | Heavy users hitting limits |
| Team expansion | 2 | 5 | Business apps |
| API access | 3 | 4 | Developer-adjacent users |
| Ambassador | 1 | 5 | High-satisfaction users |

**Exit condition:** User brings others OR extends the product OR graduates to standalone.

---

## 5. L3 — Orchestrated Bundles

The PIE Scope Router generates L3 bundles at runtime:

1. **Signal intake:** BehaviorProfile from libs/behavior-hub/ provides persona signals
2. **Scoring:** For each stage, score all options against persona weights
3. **Selection:** Pick highest-scoring option per stage
4. **Output:** L3 bundle = `{stage_id: selected_option_id}` × N_stages
5. **Cache:** Store bundle at `.csps/journeys/{userId}/{appSlug}-journey.yaml`
6. **Adapt:** At each stage transition, Scope Router can re-score if new signals arrive

**Example — cognitive-offload-professional L3 developer bundle:**
```yaml
ORIENT: explore-playground         # low friction, high visual value
PLAN: full-7-section-wizard        # this persona values thoroughness
BUILD: fork-from-template          # standard, predictable
VALIDATE: full-pnpm-verify         # non-negotiable for governance
DEPLOY: vercel-auto-deploy         # frictionless
EVALUATE: activate-monitoring      # wants to see data
```

**L3 bundles are NOT designed.** They are computed. Adding a new persona = adding persona_weights to existing L2 options. No new stages, no new options unless genuinely new behavior is needed.

---

## 6. Threshold in the Journey

Every journey entry point routes through Threshold classification:

**Developer journey:**
- Every plan item → `libs/threshold/intake.ts: processGovernorInput()` → classify → PE pipeline
- Every build action → Threshold classifies as `solution` or `error` type → routes to evidence capture

**User journey:**
- Every user action → Threshold classify → routes to appropriate stage handler
- Session start → Threshold classifies as `first_visit` or `returning` → selects onboarding vs skip

Threshold is the architectural boundary that makes journeys data-driven. Without it, routing is hardcoded and fragile. With it, adding a new input type = adding a YAML entry.

---

## 7. The Playground as Journey Visualization

**`/platform/developer-journey`** (partially built S054):
- Shows the L2 developer option space as an interactive map
- Each stage: options listed with their current activation status (ACTIVE / PARTIAL / NOT BUILT)
- Persona weight visualization: toggle persona to see which options light up
- Connected to INFRA-FLOW-VALIDATION.md — each option's status reflects the step status

**`/platform/user-journey`** (NOT YET BUILT — S057 target):
- Shows the L2 user option space with same visualization
- Requires: BehaviorHub schema operational + at least 3 persona profiles defined

These pages are live-connected. When an option's underlying code changes status, the page reflects it automatically via pageDNA's contextQuestion and the validation layer.

---

*CSPS — SIA | Journey Framework v1.0 | RATIFIED S056 | Opus-8*
